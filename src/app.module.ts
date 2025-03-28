import { APP_INTERCEPTOR } from '@nestjs/core'
import { ClassSerializerInterceptor, Module } from '@nestjs/common'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { PostsModule } from './routes/posts/posts.module'

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
