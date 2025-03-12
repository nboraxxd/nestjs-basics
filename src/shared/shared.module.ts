import { Global, Module } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const sharedServices = [PrismaService, HashingService]

@Global()
@Module({
  providers: [...sharedServices],
  exports: [...sharedServices],
})
export class SharedModule {}
