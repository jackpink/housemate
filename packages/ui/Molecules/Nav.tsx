"use client";

import Link from "next/link";
import { useState } from "react";
import { HorizontalLogo } from "../Atoms/Logo";
import { CTAButton } from "../Atoms/Button";
import { Text } from "../Atoms/Text";

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
      <div className="bg-brand/60 border-dark relative flex w-full flex-wrap items-center justify-between border-2 py-2">
        <div className="flex grow flex-col items-center">
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

        <div className="relative flex grow items-center justify-center pt-2">
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
      </div>
    </>
  );
};

export default NavWrapper;
