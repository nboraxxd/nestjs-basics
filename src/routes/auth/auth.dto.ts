import { IsEmail, IsString, Length } from 'class-validator'

import { SuccessResDTO } from 'src/shared/shared.dto'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string
  @IsString({ message: 'Mật khẩu không đúng định dạng' })
  @Length(6, 20, { message: 'Mật khẩu phải từ 6 đến 20 ký tự' })
  password: string
}

// export class LoginData {
//   accessToken: string
//   refreshToken: string

//   constructor(partial: Partial<LoginData>) {
//     Object.assign(this, partial)
//   }
// }
// export class LoginResDTO extends SuccessResDTO<LoginData> {
//   @Type(() => LoginData)
//   declare data: LoginData

//   constructor(partial: Partial<LoginResDTO>) {
//     super(partial)
//     Object.assign(this, partial)
//   }
// }

export class LoginResDTO extends SuccessResDTO<{
  accessToken: string
  refreshToken: string
}> {
  constructor(data: LoginResDTO) {
    super(data)
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
  constructor(data: RegisterResDTO) {
    super(data)
  }
}

export class RefreshTokenBodyDTO {
  @IsString({ message: 'Token không hợp lệ' })
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {
  constructor(data: RefreshTokenResDTO) {
    super(data)
  }
}

export class LogoutBodyDTO {
  @IsString({ message: 'Token không hợp lệ' })
  refreshToken: string
}
