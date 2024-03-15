import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { homeowner } from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  //const payload = await req.json();
  const body = JSON.stringify(await req.json());

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    const error = JSON.stringify(err as Error);
    return new Response(`Error occured ${error}`, {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);
  let responseBody = "";
  // If user is created, then create user in db\
  if (eventType === "user.created") {
    //responseBody = "User created";
    try {
      const newUser = await db
        .insert(homeowner)
        .values({
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          email: evt.data.email_addresses[0]?.email_address,
          authId: evt.data.id,
        })
        .returning();

      responseBody = "insert";
      await clerkClient.users.updateUserMetadata(evt.data.id, {
        publicMetadata: {
          appUserId: newUser[0]?.id,
        },
      });
    } catch (err) {
      responseBody = "Error creating user in db";
    }
  }

  // If user is updated, then update user in db
  if (eventType === "user.updated") {
    responseBody = "User updated";
  }

  // If user is deleted, then set user inactive ? in db
  if (eventType === "user.deleted") {
    responseBody = "User deleted";
  }

  return new Response(responseBody, { status: 200 });
}
