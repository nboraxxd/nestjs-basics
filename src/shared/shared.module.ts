import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

const sharedServices = [PrismaService, HashingService, TokenService]

@Global()
@Module({
  exports: [...sharedServices],
  providers: [...sharedServices],
  imports: [JwtModule],
})
export class SharedModule {}
