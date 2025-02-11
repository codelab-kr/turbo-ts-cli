import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequest } from './dto/create-post.request';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Post()
  async createPost(@Body() request: CreatePostRequest) {
    return this.postsService.createPost(request);
  }
}
