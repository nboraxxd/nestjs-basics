import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts(): string {
    return 'Hello World!'
  }

  getPost(id: string) {
    return id
  }

  createPost(body: any): any {
    return body
  }

  updatePost(id: string, body: any): any {
    return { id, ...body }
  }

  deletePost(id: string) {
    return id
  }
}
