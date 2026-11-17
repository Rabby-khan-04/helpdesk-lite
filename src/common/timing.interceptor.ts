import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Timing');
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const label = `${context.getClass().name}.${context.getHandler().name}`;
    const start = Date.now();
    return next
      .handle()
      .pipe(
        finalize(() =>
          this.logger.log(`${label} took ${Date.now() - start}Ms`),
        ),
      );
  }
}
