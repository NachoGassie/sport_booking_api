import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

export type GetAllPagination<T> = Promise<Pagination<T, IPaginationMeta>> 
