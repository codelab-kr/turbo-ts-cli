import { z } from 'zod';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// ✅ 역할 & 인증 제공자 enum
export const roleEnum = z.enum(['FREELANCER', 'CLIENT', 'ADMIN']);
export const providerEnum = z.enum(['email', 'google', 'github']);

// ✅ 사용자 테이블 (Drizzle ORM)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: text('provider').notNull(),
  provider_id: text('provider_id'),
  email: text('email'),
  password: text('password'),
  roles: jsonb('roles').notNull().default(['FREELANCER']),
  name: text('name'),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ✅ 기본 Zod 스키마
const baseUserSchema = z.object({
  provider: providerEnum,
  provider_id: z.string().nullable().optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  roles: z.array(roleEnum).default(['FREELANCER']),
  name: z.string().nullable().optional(),
});

// ✅ createUserSchema: refine()을 적용하여 비밀번호 필수 검증 추가
export const createUserSchema = baseUserSchema.refine(
  (data) => data.provider !== 'email' || (data.password && data.password.length >= 4),
  {
    message: 'Password is required for email provider and must be at least 4 characters',
    path: ['password'],
  }
);

// ✅ updateUserSchema: `partial()`을 적용하여 일부 필드만 업데이트 가능하도록 함
export const updateUserSchema = baseUserSchema.partial();

// ✅ 응답 스키마 정의
export const userResponseSchema = baseUserSchema
  .omit({ password: true }) // ✅ password 필드 제외
  .extend({
    id: z.string().uuid(),
    createdAt: z.date().nullable(),
  });

// // ✅ `user_roles` 테이블 (역할 관리)
// export const userRoles = pgTable(
//   'user_roles',
//   {
//     user_id: uuid('user_id')
//       .references(() => users.id)
//       .notNull(),
//     role: text('role').notNull(),
//   },
//   (table) => ({
//     uniqueUserRole: unique().on(table.user_id, table.role),
//   })
// );

// await db.executeRaw(
//   `CREATE UNIQUE INDEX unique_email_not_null ON users(email) WHERE email IS NOT NULL;`
// );

// await db.executeRaw(
//   `CREATE UNIQUE INDEX unique_provider_id_not_null ON users(provider, provider_id) WHERE provider_id IS NOT NULL;`
// );

// ✅ 마이그레이션 시 실행 (drizzle migrate)	환경 설정 시 자동 적용, 버전 관리 가능	마이그레이션을 추가해야 함	🔥 강력 추천 🚀
// migration-XXXXXX.ts (Drizzle 마이그레이션 파일)
// import { db } from "@/lib/db";

// export async function up() {
//   await db.executeRaw(
//     `CREATE UNIQUE INDEX unique_email_not_null ON users(email) WHERE email IS NOT NULL;`
//   );
// }

// export async function down() {
//   await db.executeRaw(
//     `DROP INDEX IF EXISTS unique_email_not_null;`
//   );
// }

// 서버 시작 시 실행 (app.ts or server.ts)	코드로 직접 실행 가능	이미 실행된 경우 체크 필요	👍 추천
// import { db } from "@/lib/db";

// async function setupDatabase() {
//   await db.executeRaw(
//     `CREATE UNIQUE INDEX IF NOT EXISTS unique_email_not_null ON users(email) WHERE email IS NOT NULL;`
//   );
// }

// setupDatabase();
// ✅ 역할 Enum
export const roleEnumZod = z.enum(['FREELANCER', 'CLIENT', 'ADMIN']);
// ✅ 인증 제공자 Enum
export const providerEnumZod = z.enum(['email', 'google', 'github']);



import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// ✅ ENUM 타입 정의
export type Role = z.infer<typeof roleEnumZod>
export type Provider = z.infer<typeof providerEnumZod>;

// ✅ 사용자 관련 타입
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ✅ API 요청/응답 타입
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;