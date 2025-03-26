import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

import { PostModel } from 'src/shared/models/post.model'
import { UserModel } from 'src/shared/models/user.model'
import { SuccessResDTO } from 'src/shared/shared.dto'

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

export class GetPostsResDTO extends SuccessResDTO<Array<GetPostItemDTO>> {
  constructor(data: GetPostsResDTO) {
    super(data)
  }
}

export class GetMyPostItemDTO extends PostModel {
  constructor(partial: Partial<GetMyPostItemDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class GetMyPostsResDTO extends SuccessResDTO<Array<GetMyPostItemDTO>> {
  constructor(data: GetMyPostsResDTO) {
    super(data)
  }
}

export class GetPostDetailResDTO extends SuccessResDTO<GetPostItemDTO> {
  constructor(data: GetPostDetailResDTO) {
    super(data)
  }
}

export class UpdatePostBodyDTO {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string
}
