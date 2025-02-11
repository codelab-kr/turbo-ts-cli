/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, schema } from '@packages/database';
import { User, NewUser } from '@packages/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

const { users, freelancers, clients } = schema;
@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getUser(id: string) {
    const user = await this.database.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (user) {
      // ✅ 비밀번호 필드 제거 후 반환
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getUserByEmail(email: string) {
    return await this.database.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.database.query.users.findMany();
  }

  async createUser(user: NewUser) {
    return (await this.database.insert(users).values(user).returning()).at(0);
  }

  async updateUser(id: string, updates: Partial<User>) {
    const updatedUser = (await this.database.update(users).set(updates).where(eq(users.id, id)).returning()).at(0);

    if (updatedUser) {
      // ✅ 비밀번호 필드 제거 후 반환
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    return null;
  }

  // ✅ 사용자 삭제 (DELETE)
  async deleteUser(id: string) {
    return await this.database.delete(users).where(eq(users.id, id));
  }

  // ✅ 사용자 탈퇴 (DELETE) - 관련 데이터도 삭제
  async withdrawUser(id: string) {
    // ✅ 클라이언트 및 프리랜서 관련 데이터도 함께 삭제
    await this.database.delete(clients).where(eq(clients.id, id));

    await this.database.delete(freelancers).where(eq(freelancers.id, id));

    // ✅ 마지막으로 사용자 삭제
    return await this.database.delete(users).where(eq(users.id, id));
  }
}
