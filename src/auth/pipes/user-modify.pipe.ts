import { ArgumentMetadata, ForbiddenException, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { RequestWithUser } from "../../common/interfaces/active-user.interface";

@Injectable()
export class UserModifyPipe implements PipeTransform{

  constructor(
    @Inject(REQUEST) 
    protected readonly req: RequestWithUser,
  ){}
  
  // TODO -> should be guard
  transform(value: any, metadata: ArgumentMetadata) {
    const { idUser } = this.req.params;
    const { idUser: tokenId } = this.req.user;

    if (tokenId !== idUser) throw new ForbiddenException();
    
    return value;
  }
}