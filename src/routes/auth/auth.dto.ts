import { IsEmail, IsString } from 'class-validator'

export class LoginBodyDTO {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string
  @IsString({ message: 'Mật khẩu không hợp lệ' })
  password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Tên không hợp lệ' })
  name: string
  @IsString({ message: 'Mật khẩu không hợp lệ' })
  confirmPassword: string
}
