import { revalidatePath } from "next/cache";
import { db } from "../../../../core/db";
import { posts } from "../../../../core/db/schema";

async function createPost({ name }: { name: string }) {
  const [created] = await db
    .insert(posts)
    .values({ name: name })
    .returning({ id: posts.id });
  if (!created) throw new Error("Failed to create post");
  return created.id;
}

export default async function TestAddPost() {
  "use server";
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const created = await createPost({ name });
    console.log("Post created", name, created);
    revalidatePath("/");
  };

  return (
    <div>
      <h1>TestAddPost</h1>
      <form action={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" className="text-black" />
        </label>

        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}
