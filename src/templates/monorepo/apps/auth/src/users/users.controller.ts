import { Body, Controller, Get, Param, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import { createUserSchema, updateUserSchema, userResponseSchema } from '@packages/database';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '@packages/auth-common';
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from '@packages/database';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  mapUserResponse(user: unknown): UserResponseDto {
    return userResponseSchema.parse(user);
  }

  @Post()
  async createUser(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return this.mapUserResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.getUser(id);
    return this.mapUserResponse(user);
  }

  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.getUsers();
    return users.map((user) => this.mapUserResponse(user));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return this.mapUserResponse(updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(id);
    return { message: '사용자가 삭제되었습니다.' };
  }

  // ✅ 사용자 탈퇴 (DELETE /users/:id/withdraw)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/withdraw')
  async withdrawUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.withdrawUser(id);
    return { message: '사용자가 탈퇴되었습니다.' };
  }
}
