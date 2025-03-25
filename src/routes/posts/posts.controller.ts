import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'

import { Auth } from 'src/shared/decorators/auth.decorator'
import { PostsService } from 'src/routes/posts/posts.service'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { TokenPayload } from 'src/shared/types/jwt.type'
import { CreatePostBodyDTO } from 'src/routes/posts/posts.dto'
import { MessageResDTO } from 'src/shared/shared.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.And })
  @Get()
  getPosts() {
    return this.postsService.getPosts()
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
