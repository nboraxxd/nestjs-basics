import { Injectable, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common'

import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from 'src/routes/auth/auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { isJsonWebTokenError, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper'
import { MessageResDTO } from 'src/shared/shared.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    return { accessToken, refreshToken }
  }

  async insertRefreshToken(token: string) {
    const refreshTokenPayload = this.tokenService.decodeToken(token)

    try {
      await this.prismaService.refreshToken.create({
        data: {
          token,
          userId: refreshTokenPayload.userId,
          expiresAt: new Date(refreshTokenPayload.exp * 1000),
        },
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnauthorizedException('Duplicate refresh token')
      } else {
        throw error
      }
    }
  }

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

      const token = await this.generateTokens({ userId: user.id })

      await this.insertRefreshToken(token.refreshToken)

      return token
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
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

    await this.insertRefreshToken(token.refreshToken)

    return token
  }

  async refreshToken({ refreshToken }: RefreshTokenBodyDTO) {
    try {
      const tokenPayload = await this.tokenService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      })

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.tokenService.signAccessToken({ userId: tokenPayload.userId }),
        this.tokenService.signRefreshToken({ userId: tokenPayload.userId, exp: tokenPayload.exp }),
      ])

      await Promise.all([
        this.prismaService.refreshToken.delete({ where: { token: refreshToken } }),
        this.insertRefreshToken(newRefreshToken),
      ])

      return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch (error) {
      if (isJsonWebTokenError(error)) {
        throw new UnauthorizedException(error.message)
      } else if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is invalid')
      }
      throw error
    }
  }

  async logout({ refreshToken }: LogoutBodyDTO): Promise<MessageResDTO> {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.delete({ where: { token: refreshToken } })

      return { message: 'Logout successfully' }
    } catch (error) {
      if (isJsonWebTokenError(error)) {
        throw new UnauthorizedException(error.message)
      } else if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is invalid')
      }
      throw error
    }
  }
}
