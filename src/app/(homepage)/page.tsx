import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import {
  CTAButton,
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../_components/Atoms/Button";
import Logo from "../_components/Atoms/Logo";
import { Text } from "../_components/Atoms/Text";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Logo width="300px" height="300px" colour="#c470e7" />
        <SignedIn>
          <div className="flex flex-col items-center justify-center gap-4 text-center ">
            <Text>Welcome to Prop Doc the property maintenance app. </Text>
            <Text>Management all of the work done on your home.</Text>
            <Text>Search photos and documents for past work doe in rooms.</Text>
            <Link href="/properties" className="">
              <LargeButton>
                <LargeButtonTitle>Homepage</LargeButtonTitle>
                <LargeButtonContent>
                  Explore your properties and latest jobs
                </LargeButtonContent>
              </LargeButton>
            </Link>
          </div>
          {/* Mount the UserButton component */}
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <div className="flex justify-center">
            <Link className="block py-4" href="/">
              <CTAButton rounded>Sign In</CTAButton>
            </Link>
          </div>

          <div className="flex justify-center">
            <Link className="block" href="/create-account">
              <CTAButton rounded>Create An Account</CTAButton>
            </Link>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
