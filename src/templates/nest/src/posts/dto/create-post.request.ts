export class CreatePostRequest {
  content: string;
  userId: string;

  constructor(content: string, userId: string) {
    this.content = content;
    this.userId = userId;
  }
}
