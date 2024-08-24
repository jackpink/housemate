import React from "react";
import SideMenu from "~/app/_components/SideMenu";
import {
  DropDownIcon,
  ToDoListIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import { EditItemLoading, ToDosLoading } from "~/app/_components/Loading";

export default async function ToDoPage() {
  return (
    <div className="flex w-full">
      <SideMenu propertyId="" selected="todo" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="hidden max-w-[800px] grow lg:block">
            <ToDosLoading />
          </div>
          <div className="grow">
            <div className="flex items-center p-2 text-xl lg:hidden">
              <span className="-rotate-90">
                <DropDownIcon width={20} height={20} />
              </span>
              Back to To Dos
              <ToDoListIcon width={60} height={40} />
            </div>
            <EditItemLoading />
          </div>
        </div>
      </div>
    </div>
  );
}
