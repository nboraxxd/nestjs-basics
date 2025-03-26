import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from 'src/routes/auth/auth.dto'
import { MessageResDTO } from 'src/shared/shared.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body)

    return new RegisterResDTO({ data: result, message: 'Đăng ký thành công' })
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBodyDTO) {
    const result = await this.authService.login(body)

    return new LoginResDTO({ data: result, message: 'Đăng nhập thành công' })
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    const result = await this.authService.refreshToken(body)

    return new RefreshTokenResDTO({ data: result, message: 'Refresh token thành công' })
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: LogoutBodyDTO) {
    const result = await this.authService.logout(body)

    return new MessageResDTO(result)
  }
}
