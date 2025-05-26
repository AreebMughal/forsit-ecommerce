import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((value: any) => {
        
        let totalRecords = undefined;
        if (Array.isArray(value.data) && value.totalRecords) {
          totalRecords = value?.totalRecords ? value.totalRecords : 0;
        }

        return {
          succeeded: true,
          totalRecords,
          statusCode:
            value?.status && typeof value.status === 'number'
              ? value.status
              : 201,
          message: value?.message ? value.message : 'Successful',
          data:
            (value?.totalRecords !== null &&
              value?.totalRecords !== undefined &&
              typeof value?.totalRecords === 'number') ||
            value?.data
              ? value.data
              : value?.message
                ? []
                : value,
        };
      })
    );
  }
}
