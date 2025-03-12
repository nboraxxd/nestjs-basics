import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'

import { AuthService } from 'src/routes/auth/auth.service'
import { RegisterBodyDTO, RegisterResponseDTO } from 'src/routes/auth/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResponseDTO })
  @Post('register')
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body)
  }
}
