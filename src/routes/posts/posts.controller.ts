import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'

import { MessageResDTO } from 'src/shared/shared.dto'
import { TokenPayload } from 'src/shared/types/jwt.type'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { PostsService } from 'src/routes/posts/posts.service'
import { CreatePostBodyDTO, GetMyPostItemDTO, GetPostItemDTO } from 'src/routes/posts/posts.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    const posts = await this.postsService.getPosts()
    return posts.map((post) => new GetPostItemDTO(post))
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMyPosts(@ActiveUser('userId') userId: TokenPayload['userId']) {
    const posts = await this.postsService.getMyPosts(userId)
    return posts.map((post) => new GetMyPostItemDTO(post))
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postsService.getPost(id)
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: TokenPayload['userId']) {
    const result = await this.postsService.createPost(body, userId)

    return new MessageResDTO(result)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any): any {
    return this.postsService.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
