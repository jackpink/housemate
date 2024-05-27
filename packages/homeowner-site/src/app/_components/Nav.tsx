"use client";

import { useSession } from "next-auth/react";
import NavWrapper from "../../../../ui/Molecules/Nav";
import { signOutAction } from "../actions";
import { CTAButton } from "../../../../ui/Atoms/Button";
import Link from "next/link";
import { type User } from "next-auth";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
} from "../../../../ui/Atoms/Popover";
import clsx from "clsx";

export default function Nav() {
  const session = useSession();
  if (session?.data?.user) {
    return (
      <NavWrapper>
        <UserButton user={session.data.user} />
      </NavWrapper>
    );
  }
  return (
    <NavWrapper>
      <Link href="/sign-in">
        <CTAButton rounded>Sign In</CTAButton>
      </Link>
    </NavWrapper>
  );
}

function UserButton({ user }: { user: User }) {
  const initials = user.name
    ?.split(" ")
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-full bg-altSecondary font-bold",
          )}
        >
          {initials}
        </div>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-dark bg-light p-4 shadow-lg">
        <PopoverHeading>
          Logged in as
          <br />
          <span className="font-semibold">{user.name}</span>
        </PopoverHeading>
        <PopoverDescription className="flex flex-col items-center gap-4 pt-5">
          <Link href={"/manage-account"}>
            <button className="rounded-full bg-altSecondary p-3">
              Manage Account
            </button>
          </Link>
          <form action={signOutAction}>
            <button
              className="rounded-full bg-brand p-3"
              onClick={signOutAction}
            >
              Sign Out
            </button>
          </form>
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
