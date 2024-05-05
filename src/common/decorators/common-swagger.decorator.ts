import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthSwagger, BadReqNotFoundSwagger, entityName } from "../interfaces/swagger.interface";

export function NotFoundByIdSwagger(entity: entityName | entityName[]){
  return applyDecorators(
    ApiBadRequestResponse({ description: 'id in wrong uuid format' }),
    ApiNotFoundResponse({ description: getNotFoundIdTxt(entity) }),
  )
}

export function NotFoundByIdUpdateSwagger(entity: entityName | entityName[]){
  return applyDecorators(
    ApiBadRequestResponse({ description: 'id in wrong uuid format / update body is wrong' }),
    ApiNotFoundResponse({ description: getNotFoundIdTxt(entity) }),
  );
}

export function BadReqNotFoundSwagger({ badRequest, notFound}: BadReqNotFoundSwagger){
  return applyDecorators(
    ApiBadRequestResponse({ description: badRequest }),
    ApiNotFoundResponse({ description: notFound })
  );
}

export function AuthSwagger({ roles }: AuthSwagger){
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'token required' }),
    ApiForbiddenResponse({ description: `only roles: ${roles.join(' | ')}` })
  );
}

function getNotFoundIdTxt(entity: entityName | entityName[]){
  const isString = typeof entity === 'string';
  return `${isString ? entity : entity.join(' | ')} not found`;
}