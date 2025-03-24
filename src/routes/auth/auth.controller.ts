import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body)

    return new RegisterResDTO(result)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBodyDTO) {
    const result = await this.authService.login(body)

    return new LoginResDTO(result)
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    const result = await this.authService.refreshToken(body)

    return new RefreshTokenResDTO(result)
  }
}
