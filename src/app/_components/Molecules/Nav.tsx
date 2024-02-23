"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";

import { HorizontalLogo } from "../Atoms/Logo";
import { CTAButton } from "../Atoms/Button";
import { Text } from "../Atoms/Text";

const NavItems: React.FC = () => {
  return (
    <>
      <li className="mb-4">
        <Link href="/homeowner" className="hover:text-sky-500 ">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Dashboard
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/about" className="">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            About
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Contact
          </Text>
        </Link>
      </li>
    </>
  );
};

const UserItems: React.FC = () => {
  const { user } = useUser();
  return (
    <>
      <SignedIn>
        <li>
          <Text className="text-altSecondary">ACCOUNT</Text>
          <div className="relative h-32 px-6">
            <UserButton afterSignOutUrl="/sign-in" userProfileMode="modal" />
            <Text className="absolute right-0 top-0 text-altSecondary">
              {user?.fullName}
            </Text>

            <Text className="absolute right-0 top-10 text-altSecondary">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </div>
        </li>
        <li className="flex flex-col">
          <SignOutButton>
            <CTAButton rounded className="self-center">
              Sign Out
            </CTAButton>
          </SignOutButton>
        </li>
      </SignedIn>

      <SignedOut>
        <li className="flex flex-col ">
          <CTAButton rounded className="self-center">
            Sign In
          </CTAButton>
        </li>
        <li className="flex flex-col">
          <CTAButton rounded className="self-center">
            Sign Up
          </CTAButton>
        </li>
      </SignedOut>
    </>
  );
};

type NavPopoverProps = {
  display: string;
  className: string;
};

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative flex w-full items-center justify-between px-2 pt-6">
        <Link href="/" className="mr-3  flex-none overflow-hidden md:w-auto">
          <HorizontalLogo height={40} />
        </Link>

        <div className="relative ml-auto flex items-center ">
          <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800"></div>
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton userProfileMode="navigation" />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <Link href="/sign-in">
              <CTAButton rounded>Sign In</CTAButton>
            </Link>
          </SignedOut>
        </div>
      </div>
    </>
  );
};

export default Nav;
