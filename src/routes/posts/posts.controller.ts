import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'

import { MessageResDTO } from 'src/shared/shared.dto'
import { TokenPayload } from 'src/shared/types/jwt.type'
import { PostModel } from 'src/shared/models/post.model'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import {
  CreatePostBodyDTO,
  GetMyPostItemDTO,
  GetMyPostsResDTO,
  GetPostDetailResDTO,
  GetPostItemDTO,
  GetPostsResDTO,
  UpdatePostBodyDTO,
} from 'src/routes/posts/posts.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<GetPostsResDTO> {
    const posts = await this.postsService.getPosts()
    return new GetPostsResDTO({
      data: posts.map((post) => new GetPostItemDTO(post)),
      message: 'Get posts successfully',
    })
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMyPosts(@ActiveUser('userId') userId: TokenPayload['userId']): Promise<GetMyPostsResDTO> {
    const posts = await this.postsService.getMyPosts(userId)

    return new GetMyPostsResDTO({
      data: posts.map((post) => new GetMyPostItemDTO(post)),
      message: 'Get my posts successfully',
    })
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: PostModel['id']): Promise<GetPostDetailResDTO> {
    const post = await this.postsService.getPost(id)

    return new GetPostDetailResDTO({ data: new GetPostItemDTO(post), message: 'Get post successfully' })
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @Body() body: CreatePostBodyDTO,
    @ActiveUser('userId') userId: TokenPayload['userId']
  ): Promise<MessageResDTO> {
    await this.postsService.createPost(body, userId)

    return new MessageResDTO({ message: 'Create post successfully' })
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: PostModel['id'],
    @Body() body: UpdatePostBodyDTO,
    @ActiveUser('userId') userId: TokenPayload['userId']
  ): Promise<MessageResDTO> {
    await this.postsService.updatePost({ postId: id, body, userId })

    return new MessageResDTO({ message: 'Update post successfully' })
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: PostModel['id'],
    @ActiveUser('userId') userId: TokenPayload['userId']
  ): Promise<MessageResDTO> {
    await this.postsService.deletePost({ postId: id, userId })

    return new MessageResDTO({ message: 'Delete post successfully' })
  }
}
