import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ResponseMessage } from './decorators/response-message.decorator.js';
import { SkipEnvelope } from './decorators/skip-envelope.decorator.js';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class WithMessage<T> {
  constructor(
    public readonly message: string,
    public readonly data: T,
  ) {}
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | T
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.reflector.get(SkipEnvelope, context.getHandler())) {
      return next.handle();
    }

    const message =
      this.reflector.get(ResponseMessage, context.getHandler()) ?? 'Success';

    return next.handle().pipe(
      map((result) =>
        result instanceof WithMessage
          ? {
              success: true as const,
              message: result.message,
              data: result.data,
            }
          : { success: true as const, message, data: result },
      ),
    );
  }
}
