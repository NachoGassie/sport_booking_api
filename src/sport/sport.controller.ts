import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthSwagger, BadReqNotFoundSwagger, NotFoundByIdSwagger, NotFoundByIdUpdateSwagger } from '../common/decorators/common-swagger.decorator';
import { QueryDto } from '../common/dto/pagination.dto';
import { Role } from '../common/enums/role.enum';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportService } from './sport.service';

@ApiTags('sports')
@Controller('sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @ApiOperation({ summary: 'get all sports' })
  @Get()
  findAll(@Query() options: QueryDto) {
    return this.sportService.findAll(options);
  }

  @ApiOperation({ summary: 'get sport by id' })
  @NotFoundByIdSwagger('sport')
  @Get(':idSport')
  findOne(@Param('idSport', ParseUUIDPipe) idSport: string) {
    return this.sportService.findOne(idSport);
  }
  
  @ApiOperation({ summary: 'create one sport' })
  @ApiBadRequestResponse({ description: 'create body in wrong format' })
  @AuthSwagger({ roles: [Role.ADMIN] })
  @Post()
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportService.create(createSportDto);
  }

  @ApiOperation({ summary: 'update sport' })
  @NotFoundByIdUpdateSwagger('sport')
  @AuthSwagger({ roles: [Role.ADMIN] })
  @Patch(':idSport')
  @Auth(Role.ADMIN)
  update(@Param('idSport', ParseUUIDPipe) id: string, @Body() updateSportDto: UpdateSportDto) {
    return this.sportService.update(id, updateSportDto);
  }

  @ApiOperation({ summary: 'delete sport' })
  @NotFoundByIdSwagger('sport')
  @AuthSwagger({ roles: [Role.ADMIN] })
  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sportService.remove(id);
  }
}
