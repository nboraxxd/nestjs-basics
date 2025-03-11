import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts() {
    return this.prismaService.post.findMany()
  }

  getPost(id: number) {
    return this.prismaService.post.findUnique({ where: { id } })
  }

  createPost(body: { title: string; content: string }) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: 1,
      },
    })
  }

  updatePost(id: string, body: any): any {
    return { id, ...body }
  }

  deletePost(id: string) {
    return id
  }
}
