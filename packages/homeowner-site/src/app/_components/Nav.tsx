"use client";

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
import { LargeSearchIcon, MoveIcon } from "../../../../ui/Atoms/Icons";
import { type Property } from "../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { use } from "react";
import { useSession } from "./ContextProviders";

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
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center rounded-lg border-black bg-brand p-2 shadow-sm shadow-black">
          <MoveIcon />
          <p>{address}</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-dark bg-light p-4 shadow-lg">
        <PopoverHeading>Choose a Property</PopoverHeading>
        <PopoverDescription className="flex flex-col items-center gap-4 pt-5">
          <div className="grid w-full gap-4">
            {properties.map((property) => (
              <PropertyButton
                property={property}
                key={property.id}
                onClickCancel={onClickCancel}
              />
            ))}
            <Link href={`/properties/create`}>
              <button className=" w-full rounded-full bg-brand p-3 font-semibold">
                Create New Property
              </button>
            </Link>
          </div>
        </PopoverDescription>
      </PopoverContent>
    </Popover>
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
  const initials = user.name
    ?.split(" ")
    .map((name) => name[0]?.toUpperCase())
    .join("");

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
