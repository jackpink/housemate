import { ToDosLoading } from "~/app/_components/Loading";
import {
  DropDownIcon,
  GeneralHomeIcon,
  ToDoIcon,
} from "../../../../../../../ui/Atoms/Icons";
import SideMenu from "~/app/_components/SideMenu";
import { PageTitle } from "../../../../../../../ui/Atoms/Title";

export default function ToDoLoading() {
  return (
    <div className="flex w-full">
      <SideMenu propertyId={""} selected="todo" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="max-w-[800px] grow">
            <div className="flex w-max items-center justify-center p-4 xs:hidden">
              <div className="-rotate-90 pb-6">
                <DropDownIcon />
              </div>
              <GeneralHomeIcon width={30} height={30} />
              <p className="pl-2 text-xl">Property Menu</p>
            </div>
            <PageTitle className="flex items-center justify-center">
              <ToDoIcon width={40} height={40} /> To Dos
            </PageTitle>
            <ToDosLoading />
          </div>
        </div>
      </div>
    </div>
  );
}
