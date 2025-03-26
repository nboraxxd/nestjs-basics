import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'

import { UserModel } from 'src/shared/models/user.model'
import { PostModel } from 'src/shared/models/post.model'
import { isNotFoundPrismaError } from 'src/shared/helper'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from 'src/routes/posts/posts.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPosts(): Promise<Array<GetPostItemDTO>> {
    try {
      const result = await this.prismaService.post.findMany({
        include: { author: { omit: { password: true } } },
      })

      return result
    } catch {
      throw new NotFoundException('Posts not found')
    }
  }

  async getMyPosts(userId: UserModel['id']): Promise<Array<PostModel>> {
    try {
      const result = await this.prismaService.post.findMany({
        where: {
          authorId: userId,
        },
      })

      return result
    } catch {
      throw new NotFoundException('Posts not found')
    }
  }

  async getPost(id: number): Promise<GetPostItemDTO> {
    try {
      const result = await this.prismaService.post.findUniqueOrThrow({
        where: { id },
        include: { author: { omit: { password: true } } },
      })

      return result
    } catch {
      throw new NotFoundException('Post not found')
    }
  }

  async createPost(body: CreatePostBodyDTO, userId: UserModel['id']): Promise<void> {
    try {
      await this.prismaService.post.create({
        data: {
          title: body.title,
          content: body.content,
          authorId: userId,
        },
      })
    } catch {
      throw new InternalServerErrorException('Failed to create post')
    }
  }

  async updatePost({
    body,
    postId,
    userId,
  }: {
    postId: PostModel['id']
    userId: UserModel['id']
    body: UpdatePostBodyDTO
  }): Promise<void> {
    const dataNeededToUpdate = omitBy<UpdatePostBodyDTO>(body, isUndefined)

    try {
      await this.prismaService.post.update({
        where: { id: postId, authorId: userId },
        data: dataNeededToUpdate,
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw new InternalServerErrorException('Failed to update post')
    }
  }

  async deletePost({ postId, userId }: { postId: PostModel['id']; userId: UserModel['id'] }): Promise<void> {
    try {
      await this.prismaService.post.delete({
        where: { id: postId, authorId: userId },
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw new InternalServerErrorException('Failed to delete post')
    }
  }
}
