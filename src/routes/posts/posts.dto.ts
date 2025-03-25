import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

import { PostModel } from 'src/shared/models/post.model'
import { UserModel } from 'src/shared/models/user.model'

export class CreatePostBodyDTO {
  @IsString({ message: 'Title must be a string' })
  title: string
  @IsString({ message: 'Content must be a string' })
  content: string
}

export class GetPostItemDTO extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>

  constructor(partial: Partial<GetPostItemDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class GetMyPostItemDTO extends PostModel {
  constructor(partial: Partial<GetMyPostItemDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}
