import { IsString } from 'class-validator'

export class CreatePostBodyDTO {
  @IsString({ message: 'Title must be a string' })
  title: string
  @IsString({ message: 'Content must be a string' })
  content: string
}
