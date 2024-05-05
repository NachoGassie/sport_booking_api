import { FindOptionsOrder, FindOptionsOrderValue } from "typeorm";
import { BookingSortBy } from "./booking.types";
import { Booking } from "../entities/booking.entity";

export class OrderByFactory{
  static getOrder(sort: BookingSortBy, order: FindOptionsOrderValue){
    switch (sort) {
      case BookingSortBy.field:
        return FieldOrder.order(sort, order);
      case BookingSortBy.booker:
        return UserOrder.order(sort, order);
      default:
        return DefaultOrder.order(sort, order);
    }
  }
}

abstract class OrderBy{
  static order: (sort: BookingSortBy, order: FindOptionsOrderValue) => FindOptionsOrder<Booking>;
}

class DefaultOrder extends OrderBy{
  static order(sort: BookingSortBy, order: FindOptionsOrderValue): FindOptionsOrder<Booking>{
    return { [sort]: order }
  }
}

class FieldOrder extends OrderBy{
  static order(_: BookingSortBy, order: FindOptionsOrderValue): FindOptionsOrder<Booking>{
    return { field: { fieldName: order } }
  }
}

class UserOrder extends OrderBy{
  static order(_: BookingSortBy, order: FindOptionsOrderValue): FindOptionsOrder<Booking>{
    return { user: { idUser: order } }
  }
}