import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    const now = Date.now()
    return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
  }
}
