import { FindOptionsOrder, FindOptionsOrderValue } from "typeorm";
import { FieldSortBy } from "./field.types";
import { Field } from "../entities/field.entity";

export class OrderByFactory{
  static getOrder(sort: FieldSortBy, order: FindOptionsOrderValue){
    switch (sort) {
      case FieldSortBy.club:
        return ClubOrder.order(sort, order);
      default:
        return DefaultOrder.order(sort, order);
    }
  }
}

abstract class OrderBy{
  static order: (sort: FieldSortBy, order: FindOptionsOrderValue) => FindOptionsOrder<Field>;
}

class DefaultOrder extends OrderBy{
  static order(sort: FieldSortBy, order: FindOptionsOrderValue): FindOptionsOrder<Field>{
    return { [sort]: order }
  }
}

class ClubOrder extends OrderBy{
  static order(_: FieldSortBy, order: FindOptionsOrderValue): FindOptionsOrder<Field>{
    return { club: { name: order } }
  }
}
