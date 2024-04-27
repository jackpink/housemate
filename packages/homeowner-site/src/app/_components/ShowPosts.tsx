import { db } from "../../server/db";
import schema from "~/server/db/schema";

export default async function ShowPosts() {
  const post = await db.select().from(schema.posts);
  return (
    <div>
      <h1>ShowPosts</h1>
      <ul>
        {post.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
