import Link from "next/link";
import { DropDownIcon, GeneralHomeIcon } from "../../../../ui/Atoms/Icons";
import SideMenu from "./SideMenu";

export function ItemNotFound({
  propertyId,
  currentPage,
}: {
  propertyId: string;
  currentPage: "schedule" | "search" | "todo" | "add";
}) {
  return (
    <div className="flex w-full">
      <SideMenu propertyId={propertyId} selected={currentPage} />
      <div className="w-full">
        <Link
          href={`/properties/${propertyId}`}
          className="flex w-max items-center justify-center p-4"
        >
          <div className="-rotate-90 pb-6">
            <DropDownIcon />
          </div>
          <GeneralHomeIcon width={30} height={30} />
          <p className="pl-2 text-xl">Property Menu</p>
        </Link>
        <div className="p-20 text-center font-bold">Item not found</div>
      </div>
    </div>
  );
}

export function PropertyNotFound() {
  return (
    <div className="flex w-full">
      <div className="w-full">
        <Link
          href={`/properties`}
          className="flex w-max items-center justify-center p-4"
        >
          <div className="-rotate-90 pb-6">
            <DropDownIcon />
          </div>
          <GeneralHomeIcon width={30} height={30} />
          <p className="pl-2 text-xl">Back to Properties</p>
        </Link>
        <div className="p-20 text-center font-bold">Property not found</div>
      </div>
    </div>
  );
}
