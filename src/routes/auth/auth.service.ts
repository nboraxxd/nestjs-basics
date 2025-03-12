import { Prisma } from '@prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'

import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyDTO } from 'src/routes/auth/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService
  ) {}

  async register({ name, email, password }: RegisterBodyDTO) {
    try {
      const hashedPassword = await this.hashingService.hash(password)

      const user = await this.prismaService.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }
}
