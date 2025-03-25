import { Exclude } from 'class-transformer'

export class UserModel {
  id: number
  name: string
  email: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user)
  }
}
