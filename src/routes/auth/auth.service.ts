import { Prisma } from '@prisma/client'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'

import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RegisterBodyDTO } from 'src/routes/auth/auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
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
        throw new UnprocessableEntityException([{ field: 'email', message: 'Email already exists' }])
      }
      throw error
    }
  }

  async login({ email, password }: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) {
      throw new UnprocessableEntityException([{ field: 'email', message: 'Email or password is incorrect' }])
    }

    const isPasswordValid = await this.hashingService.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([{ field: 'email', message: 'Email or password is incorrect' }])
    }

    const token = await this.generateTokens({ userId: user.id })

    return token
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const refreshTokenPayload = this.tokenService.decodeToken(refreshToken)

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(refreshTokenPayload.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }
}
