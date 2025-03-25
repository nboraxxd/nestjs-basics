import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreatePostBodyDTO } from 'src/routes/posts/posts.dto'
import { PrismaService } from 'src/shared/services/prisma.service'
import { MessageResDTO } from 'src/shared/shared.dto'
import { TokenPayload } from 'src/shared/types/jwt.type'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts() {
    return this.prismaService.post.findMany()
  }

  getPost(id: number) {
    return this.prismaService.post.findUnique({ where: { id } })
  }

  async createPost(body: CreatePostBodyDTO, userId: TokenPayload['userId']): Promise<MessageResDTO> {
    try {
      await this.prismaService.post.create({
        data: {
          title: body.title,
          content: body.content,
          authorId: userId,
        },
      })

      return { message: 'Post created successfully' }
    } catch {
      throw new InternalServerErrorException('Failed to create post')
    }
  }

  updatePost(id: string, body: any): any {
    return { id, ...body }
  }

  deletePost(id: string) {
    return id
  }
}
