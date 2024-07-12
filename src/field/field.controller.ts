import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadReqNotFoundSwagger, NotFoundByIdSwagger } from '../common/decorators/common-swagger.decorator';
import { GetAllFieldsDTO } from './dto/field-query.dto';
import { FieldService } from './field.service';
import { fieldsMapper } from './mapper/field.mapper';
import { FieldResponse } from './dto/response-field.dto';

@ApiTags('fields')
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @ApiOperation({ summary: 'get all fields' })
  @ApiOkResponse({ description: 'Retorna todos los campos.', type: [FieldResponse] })
  @ApiBadRequestResponse({ description: 'sorting/pagination req is wrong' })
  @Get()
  async findAllPaginated(@Query() options: GetAllFieldsDTO) {
    // const { items, ...rest } = await this.fieldService.findAll(options);
    // const mappedFields = fieldsMapper(items);
    // return {
    //   items: mappedFields,
    //   ...rest
    // }

    return this.fieldService.findAll(options);
  }
  
  @ApiOperation({ summary: 'get all fields by club' })
  @BadReqNotFoundSwagger({
    badRequest: 'id in wrong uuid format / sorting/pagination req is wrong',
    notFound: 'club not found'
  })
  @Get('club/:idClub')
  findAllByClub(
    @Param('idClub', ParseUUIDPipe) idClub: string,
    @Query() options: GetAllFieldsDTO
  ){
    return this.fieldService.findAllByClub(options, idClub);
  }

  @ApiOperation({ summary: 'get all fields by club' })
  @BadReqNotFoundSwagger({
    badRequest: 'id in wrong uuid format / sorting/pagination req is wrong',
    notFound: 'club not found'
  })
  @Get('sport/:idSport')
  findAllBySport(
    @Param('idSport', ParseUUIDPipe) idSport: string,
    @Query() options: GetAllFieldsDTO
  ){
    return this.fieldService.findAllBySport(options, idSport);
  }

  @ApiOperation({ summary: 'get field by id' })
  @NotFoundByIdSwagger('field')
  @Get(':idField')
  findOne(@Param('idField', ParseUUIDPipe) idField: string) {
    return this.fieldService.findOne(idField);
  }

}
