import { generatePosts } from '@/actions';
import { db, schema } from '@packages/database';
import { eq } from 'drizzle-orm';
const { users, posts: post } = schema;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await db
    .select({
      id: post.id,
      content: post.content,
      userEmail: users.email,
    })
    .from(post)
    .innerJoin(users, eq(post.userId, users.id));

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#c039ae] mb-6"></h1>
      <form action={generatePosts} className="flex justify-end mb-6">
        <button
          type="submit"
          className="bg-[#4a5a8a] hover:bg-[#3a4a7a] text-[#e6e6eb] font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
        >
          Generate Posts
        </button>
      </form>

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-[#1a1a2a] shadow-lg rounded-md p-4 mb-4 border border-[#3a4a7a]"
        >
          <p className="mt-2 text-[#dcdceb]">{post.content}</p>
          <p className="font-bold text-[#a0b0ff]">@{post.userEmail}</p>
          {/* <p className="mt-2 text-sm text-[#8090c0]">
            {new Date(post.timestamp).toLocaleString()}
          </p> */}
        </div>
      ))}
    </div>
  );
}
