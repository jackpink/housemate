"use client";

import { signOutAction } from "../actions";
import { CTAButton } from "../../../../ui/Atoms/Button";
import Link from "next/link";
import { User } from "lucia";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
} from "../../../../ui/Atoms/Popover";
import clsx from "clsx";
import {
  LargeAddIcon,
  LargeSearchIcon,
  MoveIcon,
  PlusIcon,
} from "../../../../ui/Atoms/Icons";
import { type Property } from "../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { useState } from "react";
import { useSession } from "./ContextProviders";
import { HorizontalLogo } from "../../../../ui/Atoms/Logo";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Nav({
  properties,
  currentPropertyId,
}: {
  properties: Property[];
  currentPropertyId: string;
}) {
  const currentProperty = properties.find((p) => p.id === currentPropertyId);
  const currentAddress = currentProperty
    ? concatAddress(currentProperty).split(",")[0]
    : "";

  const user = useSession();
  if (user) {
    return (
      <NavWrapper>
        <div className="flex gap-4">
          <div className="relative flex hidden grow items-center justify-between gap-4 sm:flex">
            <InlineMenu
              properties={properties}
              currentAddress={currentAddress}
              user={user}
            />
          </div>
          <div className="relative flex flex items-center justify-center sm:hidden">
            <DropDownMenu
              properties={properties}
              currentAddress={currentAddress}
              user={user}
            />
          </div>
        </div>
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

function InlineMenu({
  properties,
  currentAddress,
  user,
}: {
  properties: Property[];
  currentAddress?: string;
  user: User;
}) {
  return (
    <>
      <PropertySelector
        address={currentAddress}
        properties={properties}
        onClickCancel={() => {}}
      />

      <button className="flex items-center rounded-lg bg-brand p-2 shadow-sm shadow-black">
        <LargeSearchIcon />
        Search
      </button>
      <UserButton user={user} />
    </>
  );
}
function DropDownMenu({
  properties,
  currentAddress,
  user,
}: {
  properties: Property[];
  currentAddress?: string;
  user: User;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenu.Trigger className="outline-none">
        <NavMenuButton setIsOpen={setIsOpen} isOpen={isOpen} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={clsx(
            "data-[side=top]:animate-slideDownAndFade min-w-max rounded-lg border-2 border-black bg-white p-4 opacity-0 shadow-md shadow-black transition-all duration-1000	ease-in will-change-[opacity,transform]",
            isOpen && "opacity-100",
          )}
          sideOffset={5}
        >
          <DropdownMenu.Item className="outline-none">
            New Tab <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="outline-none">
            <PropertySelector
              address={currentAddress}
              properties={properties}
              onClickCancel={() => {}}
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item className="outline-none">
            <button className="flex items-center rounded-lg bg-brand p-2 shadow-sm shadow-black">
              <LargeSearchIcon />
              Search
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem">
            {" "}
            <UserButton user={user} />
          </DropdownMenu.Item>
          <DropdownMenu.Arrow
            className="  fill-brand stroke-black"
            width={30}
            height={15}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function PropertySelector({
  address,
  properties,
  onClickCancel,
}: {
  address: string | undefined;
  properties: Property[];
  onClickCancel: () => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="outline-none">
        <button className="flex items-center rounded-lg border-black bg-brand p-2 shadow-sm shadow-black">
          <MoveIcon />
          <p>{address ? address : "Select a property"}</p>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md border-2 border-slate-400 bg-white p-4 p-[5px] shadow-md shadow-slate-400 will-change-[opacity,transform]"
          sideOffset={5}
        >
          <div className="grid w-full max-w-xs gap-4">
            {properties.length === 0 ? (
              <p>No Properties for this account. Please create one below.</p>
            ) : (
              properties.map((property) => (
                <PropertyButton
                  property={property}
                  key={property.id}
                  onClickCancel={onClickCancel}
                />
              ))
            )}
            <Link href={`/properties/create`}>
              <button className=" flex w-full items-center p-2 font-semibold text-brandSecondary">
                <PlusIcon width={30} height={30} colour="#c470e7" />
                Create New Property
              </button>
            </Link>
          </div>
          <DropdownMenu.Arrow
            className="  fill-brand stroke-slate-400"
            width={30}
            height={15}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function PropertyButton({
  property,
  onClickCancel,
}: {
  property: Property;
  onClickCancel: () => void;
}) {
  return (
    <button
      className="rounded-full bg-altSecondary p-3"
      onClick={onClickCancel}
    >
      {concatAddress(property)}
    </button>
  );
}

function UserButton({ user }: { user: User }) {
  console.log("User", user);
  const initials = `${user.firstName.split("")[0]?.toUpperCase()}
    ${user.lastName.split("")[0]?.toUpperCase()}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-full border-black bg-brand font-bold shadow-sm shadow-black",
          )}
        >
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg bg-light p-4 shadow-lg">
        <PopoverHeading>
          Logged in as
          <br />
          <span className="font-semibold">{user.firstName}</span>
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
const NavWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative flex w-full items-center justify-between bg-brand/60 p-2">
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

        {children}
      </div>
    </>
  );
};

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
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={clsx(
        "flex h-16 w-16 items-center justify-center rounded-full bg-brand shadow-sm  shadow-black outline-none",
        className,
      )}
    >
      <div className="flex h-10 w-10 flex-col gap-2 ">
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
