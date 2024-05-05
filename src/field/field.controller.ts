import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BadReqNotFoundSwagger, NotFoundByIdSwagger } from '../common/decorators/common-swagger.decorator';
import { GetAllFieldsDTO } from './dto/field-query.dto';
import { FieldService } from './field.service';

@ApiTags('fields')
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @ApiOperation({ summary: 'get all fields' })
  @ApiBadRequestResponse({ description: 'sorting/pagination req is wrong' })
  @Get()
  findAllPaginated(@Query() options: GetAllFieldsDTO) {
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

  @ApiOperation({ summary: 'get field by id' })
  @NotFoundByIdSwagger('field')
  @Get(':idField')
  findOne(@Param('idField', ParseUUIDPipe) idField: string) {
    return this.fieldService.findOne(idField);
  }

}
