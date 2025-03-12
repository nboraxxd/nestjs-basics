import { NestFactory } from '@nestjs/core'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import envConfig from 'src/shared/config'
import { LoggingInterceptor } from 'src/shared/interceptor/logging.interceptor'
import { TransformInterceptor } from 'src/shared/interceptor/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      // Tự động loại bỏ các field không được khai báo decorator trong DTO hoặc không tồn tại trong DTO
      whitelist: true,

      // Nếu có field không được khai báo decorator trong DTO hoặc không tồn tại trong DTO thì sẽ báo lỗi
      forbidNonWhitelisted: true,

      // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      transform: true,

      transformOptions: {
        // Tự động chuyển đổi kiểu dữ liệu của các field trong DTO
        enableImplicitConversion: true,
      },

      exceptionFactory: (validationError) => {
        return new UnprocessableEntityException(
          validationError.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints ?? {}).join(', '),
          }))
        )
      },
    })
  )

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(envConfig.PORT ?? 3000)
}

bootstrap()
