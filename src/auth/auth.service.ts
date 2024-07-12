import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { AuthLoginDto } from './dto/auht-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponseDto, AuthRegisterResponseDto } from './dto/auth-resp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async findUserByid(idUser: string): Promise<User>{
    const user = await this.userRepository.findOne({ where: { idUser }});
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async register({ userName, phone, password, role }: AuthRegisterDto): Promise<AuthRegisterResponseDto>{
    if (role) this.validateRole(role);

    await this.errorIfExistsByUserName(userName);
    password = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      userName,
      phone,
      password,
      role
    });

    const { password: pw, ...userResp } = await this.userRepository.save(newUser);

    return userResp;
  }

  async login(authLoginDto: AuthLoginDto): Promise<AuthLoginResponseDto>{
    const { idUser, userName, role } = await this.validateLoginBody(authLoginDto);

    const payload = { idUser, userName, role }
    const token = this.jwtService.sign(payload,{
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'another_secret',
      expiresIn: '7d',
    });
    
    return { idUser, userName, token, refreshToken, role };
  }


  async refreshToken(refreshToken: string): Promise<{ token: string, refreshToken: string }>{
    console.log('refresh was called')
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: 'another_secret',
      });

      const { exp, iat, ...newPayload } = payload;

      const token = this.jwtService.sign(newPayload,{
        expiresIn: '10s',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: 'another_secret',
        expiresIn: '7d',
      });

      return { token, refreshToken: newRefreshToken }
    } catch (error) {
      console.log(error instanceof Error && error.message);
    }
  }

  async profile(userName : string): Promise<User>{
    const user = await this.userRepository.findOne({ where: { userName } });
    if (!user) throw new NotFoundException();
    return user; // TODO -> should return password???
  }

  async update(idUser: string, { userName, phone, password }: UpdateUserDto) {
    const user = await this.findUserByid(idUser);
    
    if(userName) await this.errorIfExistsByUserName(userName);
    if (password) password = await this.hashPassword(password);
    
    await this.userRepository.update(idUser, { userName, phone, password });

    return idUser;
  }

  async remove(idUser: string): Promise<string>{
    const { affected } = await this.userRepository.delete(idUser);
    if (!affected) throw new NotFoundException();
    return idUser;
  }

  // Private
  private async errorIfExistsByUserName(userName: string){
    const existsUser = await this.userRepository.exists({ where: { userName } });
    if (existsUser) throw new BadRequestException('user already exists');
  }

  private async findByUserNameWithPassword(userName: string): Promise<User>{
    const user = await this.userRepository.findOne({
      where: { userName },
      select: ['idUser', 'userName', 'phone', 'role', 'password']
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }

  private async validateLoginBody({ userName, password }: AuthLoginDto): Promise<User>{
    const foundUser = await this.findByUserNameWithPassword(userName);

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) throw new UnauthorizedException();

    return foundUser;
  }

  private validateRole(role: Role){
    // if (role === Role.ADMIN) throw new ForbiddenException('role not allowed'); 
    // to work in production

    // let includes = false;
    // for (const key in Role){
    //   if (role === Role[key]) includes = true;
    // }
    // if (!includes) throw new BadRequestException(`${role} is not valid`);

    const roles = Object.values(Role);
    if (!roles.includes(role)) throw new BadRequestException(`${role} is not valid`);
  }

  private async hashPassword(password: string){
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}