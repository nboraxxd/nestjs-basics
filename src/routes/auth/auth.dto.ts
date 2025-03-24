import { IsEmail, IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string
  @IsString({ message: 'Mật khẩu không đúng định dạng' })
  @Length(6, 20, { message: 'Mật khẩu phải từ 6 đến 20 ký tự' })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Tên không hợp lệ' })
  name: string

  @IsString({ message: 'Mật khẩu không đúng định dạng' })
  @Match('password', { message: 'Mật khẩu không khớp' })
  confirmPassword: string
}

export class RegisterResDTO extends LoginResDTO {
  constructor(partial: Partial<RegisterResDTO>) {
    super(partial)
  }
}

export class RefreshTokenBodyDTO {
  @IsString({ message: 'Token không hợp lệ' })
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {
  constructor(partial: Partial<RefreshTokenResDTO>) {
    super(partial)
  }
}
