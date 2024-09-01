"use client";

import { getUnviewedNotificationsAction, signOutAction } from "../actions";
import {
  CTAButton,
  PopoverButton,
  PopoverFormButton,
  PopoverLinkButton,
} from "../../../../ui/Atoms/Button";
import Link from "next/link";
import { User } from "lucia";
import clsx from "clsx";
import {
  AccountIcon,
  AlertsIcon,
  GeneralHomeIcon,
  LargeAddIcon,
  LargeSearchIcon,
  MoveIcon,
  PlusIcon,
  SignOutIcon,
} from "../../../../ui/Atoms/Icons";
import { type Property } from "../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { useState } from "react";
import { useSession, useViewport } from "./ContextProviders";
import { HorizontalLogo } from "../../../../ui/Atoms/Logo";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";

export default function Nav({
  properties,
  currentPropertyId,
  unviewedNotifications,
}: {
  properties: Property[];
  currentPropertyId: string;
  unviewedNotifications: number;
}) {
  const currentProperty = properties.find((p) => p.id === currentPropertyId);
  console.log("Nav", currentPropertyId);
  const currentAddress = currentProperty
    ? concatAddress(currentProperty).split(",")[0]
    : "";

  const user = useSession();
  if (user) {
    return (
      <NavWrapper>
        <div className="flex gap-4">
          <div className="relative flex hidden grow items-center justify-between gap-4 xs:flex">
            <InlineMenu
              properties={properties}
              currentAddress={currentAddress}
              user={user}
              currentPropertyId={currentPropertyId}
              unviewedNotifications={unviewedNotifications}
            />
          </div>
          <div className="relative flex flex items-center justify-center xs:hidden">
            <DropDownMenu
              properties={properties}
              currentpropertyId={currentPropertyId}
              user={user}
              unviewedNotifications={unviewedNotifications}
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
  currentPropertyId,
  unviewedNotifications,
}: {
  properties: Property[];
  currentAddress?: string;
  user: User;
  currentPropertyId: string;
  unviewedNotifications: number;
}) {
  console.log("InlineMenu", currentAddress);
  return (
    <>
      <PropertySelectorMenu
        address={currentAddress}
        properties={properties}
        onClickCancel={() => {}}
        currentPropertyId={currentPropertyId}
      />

      <UserButton user={user} unviewedNotifications={unviewedNotifications} />
    </>
  );
}
function DropDownMenu({
  properties,
  currentpropertyId,
  user,
  unviewedNotifications,
}: {
  properties: Property[];
  currentpropertyId: string;
  user: User;
  unviewedNotifications: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Popover.Trigger className="outline-none">
        <NavMenuButton setIsOpen={setIsOpen} isOpen={isOpen} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={clsx(
            "min-w-max rounded-lg border-2 border-black bg-white  opacity-0 shadow-md shadow-black transition-all duration-1000 ease-in	will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade",
            isOpen && "opacity-100",
          )}
          sideOffset={5}
        >
          <div className="bg-brand p-4">
            <p>{`${user.firstName} ${user.lastName}`}</p>
            <p>{user.email}</p>
          </div>
          <div className="p-4">
            <PropertySelectorSubMenu
              currentPropertyId={currentpropertyId}
              properties={properties}
              onClickCancel={() => {}}
            />

            <PopoverLinkButton
              href="/manage-account"
              Icon={<AccountIcon colour="black" selected={false} height={25} />}
              IconSecondary={
                <AccountIcon colour="#c470e7" selected={false} height={25} />
              }
              title="Manage Account"
              iconPadding={2}
            />

            <NotificationsButton
              unviewedNotifications={unviewedNotifications}
            />

            <PopoverFormButton
              onClick={signOutAction}
              Icon={<SignOutIcon width={25} height={25} />}
              IconSecondary={
                <SignOutIcon width={25} height={25} colour="#c470e7" />
              }
              title="Sign Out"
              iconPadding={2}
            />
          </div>
          <Popover.Arrow
            className="  fill-brand stroke-black"
            width={30}
            height={15}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PropertySelectorSubMenu({
  currentPropertyId,
  properties,
  onClickCancel,
}: {
  currentPropertyId: string;
  properties: Property[];
  onClickCancel: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useViewport();

  const currentProperty = properties.find((p) => p.id === currentPropertyId);
  console.log("Nav", currentPropertyId);
  const currentAddress = currentProperty
    ? concatAddress(currentProperty).split(",")[0]
    : "";
  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Popover.Trigger className="outline-none">
        <button className="flex items-center  p-2 ">
          <MoveIcon />
          <p>{currentAddress ? currentAddress : "Select a property"}</p>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <PropertySelectorMenuContent
          properties={properties}
          onClickCancel={onClickCancel}
          side={width < 585 ? "bottom" : "left"}
          currentPropertyId={currentPropertyId}
        />
      </Popover.Portal>
    </Popover.Root>
  );
}

function PropertySelectorMenu({
  address,
  properties,
  onClickCancel,
  currentPropertyId,
}: {
  address: string | undefined;
  properties: Property[];
  onClickCancel: () => void;
  currentPropertyId: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild className="outline-none">
        <button className="flex items-center rounded-lg border-black bg-brand p-2 shadow-sm shadow-black active:shadow-none">
          <MoveIcon />
          <p>{address ? address : "Select a property"}</p>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <PropertySelectorMenuContent
          properties={properties}
          onClickCancel={onClickCancel}
          arrowColour="brand"
          currentPropertyId={currentPropertyId}
        />
      </Popover.Portal>
    </Popover.Root>
  );
}

function PropertySelectorMenuContent({
  properties,
  onClickCancel,
  side = "bottom",
  arrowColour = "white",
  currentPropertyId,
}: {
  properties: Property[];
  onClickCancel: () => void;
  side?: "left" | "bottom";
  arrowColour?: "brand" | "white";
  currentPropertyId: string;
}) {
  return (
    <Popover.Content
      className="min-w-[220px] rounded-md border-2 border-slate-400 bg-white p-4 p-[5px] shadow-sm shadow-slate-400 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
      sideOffset={5}
      side={side}
      avoidCollisions={true}
      collisionBoundary={null}
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
              selected={property.id === currentPropertyId}
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
      <Popover.Arrow
        className={clsx(
          arrowColour === "white" && "fill-white",
          arrowColour === "brand" && "fill-brand",
          "stroke-slate-400",
        )}
        width={30}
        height={15}
      />
    </Popover.Content>
  );
}

function PropertyButton({
  property,
  onClickCancel,
  selected = false,
}: {
  property: Property;
  onClickCancel: () => void;
  selected?: boolean;
}) {
  return (
    <Link
      className={clsx(
        "flex items-center justify-between p-2",
        selected && "bg-brand",
      )}
      href={`/properties/${property.id}`}
    >
      <GeneralHomeIcon width={30} />
      <p className="px-2">{concatAddress(property)}</p>
    </Link>
  );
}

function UserButton({
  user,
  unviewedNotifications,
}: {
  user: User;
  unviewedNotifications: number;
}) {
  console.log("User", user);
  const initials = `${user.firstName.split("")[0]?.toUpperCase()}
    ${user.lastName.split("")[0]?.toUpperCase()}`;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-full border-black bg-brand font-bold shadow-sm shadow-black active:shadow-none",
          )}
        >
          {initials}
        </button>
      </Popover.Trigger>
      <Popover.PopoverPortal>
        <Popover.Content className="min-w-[220px] rounded-md border-2 border-slate-400 bg-white  shadow-sm shadow-slate-400 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade">
          <div className="bg-brand p-4">
            <p>{`${user.firstName} ${user.lastName}`}</p>
            <p>{user.email}</p>
          </div>
          <div className="p-4">
            <PopoverLinkButton
              href="/manage-account"
              Icon={<AccountIcon colour="black" selected={false} height={25} />}
              IconSecondary={
                <AccountIcon colour="#c470e7" selected={false} height={25} />
              }
              title="Manage Account"
              iconPadding={2}
            />

            <NotificationsButton
              unviewedNotifications={unviewedNotifications}
            />

            <PopoverFormButton
              onClick={signOutAction}
              Icon={<SignOutIcon width={25} height={25} />}
              IconSecondary={
                <SignOutIcon width={25} height={25} colour="#c470e7" />
              }
              title="Sign Out"
              iconPadding={2}
            />
          </div>
          <Popover.Arrow
            className="  fill-brand stroke-slate-400"
            width={30}
            height={15}
          />
        </Popover.Content>
      </Popover.PopoverPortal>
    </Popover.Root>
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
        "flex h-16 w-16 items-center justify-center rounded-full bg-brand shadow-sm  shadow-black outline-none active:shadow-none",
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

function NotificationsButton({
  unviewedNotifications,
}: {
  unviewedNotifications: number;
}) {
  //const unviewedNotifications = getUnviewedNotificationsAction({ homeownerId });
  return (
    <div className="flex items-center justify-between">
      <PopoverLinkButton
        href="/notifications"
        Icon={<AlertsIcon height={20} colour="black" selected={false} />}
        IconSecondary={
          <AlertsIcon height={20} colour="#c470e7" selected={false} />
        }
        title="Notifications"
        iconPadding={3}
      />
      {unviewedNotifications > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brandSecondary text-lg text-white">
          {unviewedNotifications}
        </span>
      )}
    </div>
  );
}
