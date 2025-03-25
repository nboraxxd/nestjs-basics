import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { Auth } from 'src/shared/decorators/auth.decorator'
import { PostsService } from 'src/routes/posts/posts.service'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'

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
  createPost(@Body() body: { title: string; content: string }) {
    return this.postsService.createPost(body)
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
