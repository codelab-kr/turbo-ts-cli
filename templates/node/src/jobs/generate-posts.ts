import { faker } from '@faker-js/faker';
import { db, schema } from '@packages/database';
import { JobData, JobType } from '@packages/queue';
import { eq } from 'drizzle-orm';

export const runGeneratePosts = async (
  data: JobData[JobType.GeneratePosts]
) => {
  const { count } = data;

  console.log(`Generating ${count}`);

  const fakePosts = await Promise.all(
    Array.from({ length: count }).map(async () => {
      const id = faker.number.int({ min: 1, max: 2_147_483_647 });
      const email = faker.internet.email();

      let user = await db.query.users.findFirst({
        where: eq(schema.users.id, id),
      });
      if (!user) {
        [user] = await db
          .insert(schema.users)
          .values({ email, password: '123456' })
          .returning();
      }

      return {
        content: faker.lorem.paragraph({ min: 1, max: 3 }),
        createdAt: new Date(),
        userId: user.id,
      };
    })
  );

  console.log(fakePosts);

  // 🏷️ Drizzle ORM을 사용하여 데이터 삽입
  await db.insert(schema.posts).values(fakePosts);
};
