import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthSwagger, NotFoundByIdSwagger } from '../common/decorators/common-swagger.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthLoginDto } from './dto/auht-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModifyPipe } from './pipes/user-modify.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'create user' })
  @ApiBadRequestResponse({ description: 'create body in wrong format' })
  @Post('register')
  register(@Body() registerDto: AuthRegisterDto){
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'get token by user' })
  @ApiUnauthorizedResponse({ description: 'non existant user' })
  @ApiBadRequestResponse({ description: 'create body in wrong format' })
  @Post('login')
  login(@Body() loginDto: AuthLoginDto){
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'get user by token' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @ApiBadRequestResponse({ description: 'create body in wrong format' })
  @Get('profile')
  @Auth(Role.BOOKER)
  profile(@ActiveUser() user: ActiveUserInterface){
    return this.authService.profile(user.userName);
  }

  @ApiOperation({ summary: 'update one user by token' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('user')
  @Patch(':idUser')
  @Auth(Role.BOOKER)
  updateUser(
    @Param('idUser',ParseUUIDPipe, UserModifyPipe) idUser: string,
    @Body() updateUser: UpdateUserDto
  ){
    return this.authService.update(idUser, updateUser);
  }
  
  @ApiOperation({ summary: 'delete one user by token' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('user')
  @Auth(Role.BOOKER)
  @Delete(':idUser')
  @Auth(Role.BOOKER)
  deleteUser(@Param('idUser', ParseUUIDPipe, UserModifyPipe) idUser: string){
    return this.authService.remove(idUser);
  }
}
