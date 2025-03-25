import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { MessageResDTO } from 'src/shared/shared.dto'
import { PrismaService } from 'src/shared/services/prisma.service'
import { UserModel } from 'src/shared/models/user.model'
import { CreatePostBodyDTO } from 'src/routes/posts/posts.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts() {
    return this.prismaService.post.findMany({
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }

  getMyPosts(userId: UserModel['id']) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
    })
  }

  getPost(id: number) {
    return this.prismaService.post.findUnique({ where: { id } })
  }

  async createPost(body: CreatePostBodyDTO, userId: UserModel['id']): Promise<MessageResDTO> {
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
