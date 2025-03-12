import { Body, Controller, HttpCode, Post, SerializeOptions } from '@nestjs/common'

import { AuthService } from 'src/routes/auth/auth.service'
import { LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO } from 'src/routes/auth/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    // const result = await this.authService.register(body)

    // return new RegisterResponseDTO(result)

    return await this.authService.register(body)
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBodyDTO) {
    const result = await this.authService.login(body)

    return new LoginResDTO(result)
  }
}
