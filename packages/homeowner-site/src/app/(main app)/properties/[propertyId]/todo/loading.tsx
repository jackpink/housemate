import { ToDosLoading } from "~/app/_components/Loading";
import {
  DropDownIcon,
  OptionsLargeIcon,
  ToDoIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import SideMenu from "~/app/_components/SideMenu";

export default function ToDoLoading() {
  return (
    <div className="flex">
      <SideMenu propertyId={""} selected="todo" />
      <PageWithSingleColumn>
        <div className="flex items-center justify-center p-4 xs:hidden">
          <ToDoIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">To Do List</h1>
        </div>
        <div className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black xs:hidden">
          <span className="-rotate-90">
            <DropDownIcon width={20} height={20} />
          </span>
          <span className="pl-2 pr-3">Back to Property Menu</span>
          <OptionsLargeIcon width={30} height={30} />
        </div>
        <ToDosLoading />
      </PageWithSingleColumn>
    </div>
  );
}
