"use client";

import Link from "next/link";
import { useState } from "react";
import { HorizontalLogo } from "../Atoms/Logo";
import { CTAButton } from "../Atoms/Button";
import { Text } from "../Atoms/Text";
import clsx from "clsx";
import React from "react";

const NavItems: React.FC = () => {
  return (
    <>
      <li className="mb-4">
        <Link href="/homeowner" className="hover:text-sky-500 ">
          <Text className="text-altPrimary hover:text-brandSecondary font-semibold">
            Dashboard
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/about" className="">
          <Text className="text-altPrimary hover:text-brandSecondary font-semibold">
            About
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="text-altPrimary hover:text-brandSecondary font-semibold">
            Contact
          </Text>
        </Link>
      </li>
    </>
  );
};

// const UserItems: React.FC = () => {
//   const { user } = useUser();
//   return (
//     <>
//       <SignedIn>
//         <li>
//           <Text className="text-altSecondary">ACCOUNT</Text>
//           <div className="relative h-32 px-6">
//             <UserButton afterSignOutUrl="/sign-in" userProfileMode="modal" />
//             <Text className="absolute right-0 top-0 text-altSecondary">
//               {user?.fullName}
//             </Text>

//             <Text className="absolute right-0 top-10 text-altSecondary">
//               {user?.primaryEmailAddress?.emailAddress}
//             </Text>
//           </div>
//         </li>
//         <li className="flex flex-col">
//           <SignOutButton>
//             <CTAButton rounded className="self-center">
//               Sign Out
//             </CTAButton>
//           </SignOutButton>
//         </li>
//       </SignedIn>

//       <SignedOut>
//         <li className="flex flex-col ">
//           <CTAButton rounded className="self-center">
//             Sign In
//           </CTAButton>
//         </li>
//         <li className="flex flex-col">
//           <CTAButton rounded className="self-center">
//             Sign Up
//           </CTAButton>
//         </li>
//       </SignedOut>
//     </>
//   );
// };

type NavPopoverProps = {
  display: string;
  className: string;
};

const NavWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="bg-brand/60 border-dark relative flex w-full items-center justify-between border-2 p-2">
        <div className="flex  flex-col items-center">
          <Link href="/" className="mr-3 flex-none overflow-hidden md:w-auto">
            <HorizontalLogo
              height={30}
              fillColour="#7df2cd"
              fillOpacity="1"
              outlineColour="black"
              textColour="black"
            />
          </Link>
        </div>

        <div className="relative   hidden items-center justify-center md:flex">
          {/* <SignedIn>
            <UserButton userProfileMode="navigation" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <CTAButton rounded>Sign In</CTAButton>
            </Link>
          </SignedOut> */}
          {children}
        </div>
        <div className="flex flex-col items-center justify-center md:hidden">
          <NavMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </>
  );
};

export default NavWrapper;

type NavMenuButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

export function NavMenuButton({
  isOpen,
  setIsOpen,
  className,
}: NavMenuButtonProps) {
  return (
    <button onClick={() => setIsOpen(!isOpen)} className={className}>
      <div className="flex h-10 w-10 flex-col gap-2">
        <span
          className={clsx(
            "h-2 transform rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "translate-y-4 rotate-45",
          )}
        ></span>
        <span
          className={clsx(
            "h-2 rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "rotate-[-45deg]",
          )}
        ></span>
        <span
          className={clsx(
            "h-2 w-6 rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "bg-transparent",
          )}
        ></span>
      </div>
    </button>
  );
}
