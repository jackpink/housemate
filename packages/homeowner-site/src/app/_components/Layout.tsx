import Link from "next/link";
import {
  BottomMenu,
  MainMenuButton,
  SideMenu,
  HomeownerSelected as Selected,
} from "../../../../ui/Molecules/SideMenu";
import {
  AccountIcon,
  AlertsIcon,
  PropertiesIcon,
} from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";
import { PropsWithChildren } from "react";

const MainMenuButtons = ({ selected }: { selected: Selected }) => {
  const propertiesSelected = selected === Selected.PROPERTIES;
  const alertsSelected = selected === Selected.ALERTS;
  const accountSelected = selected === Selected.ACCOUNT;

  return (
    <>
      <Link href="/properties">
        <MainMenuButton selected={propertiesSelected}>
          <PropertiesIcon selected={propertiesSelected} />
          <Text colour={propertiesSelected ? "text-brand" : "text-light"}>
            Properties
          </Text>
        </MainMenuButton>
      </Link>

      <Link href="/alerts">
        <MainMenuButton selected={alertsSelected}>
          <AlertsIcon selected={alertsSelected} />
          <Text colour={alertsSelected ? "text-brand" : "text-light"}>
            Alerts
          </Text>
        </MainMenuButton>
      </Link>
      <Link href="/account">
        <MainMenuButton selected={accountSelected}>
          <AccountIcon selected={accountSelected} />
          <Text colour={accountSelected ? "text-brand" : "text-light"}>
            Account
          </Text>
        </MainMenuButton>
      </Link>
    </>
  );
};

export function PropertiesPageWithSideMenu({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-nowrap">
      <div className="border-altPrimary bg-altPrimary fixed top-0 hidden h-full w-40 flex-none overflow-hidden  border border-r-4 md:block">
        <SideMenu
          selected={Selected.PROPERTIES}
          MainMenuButtons={MainMenuButtons}
        />
      </div>
      <div className="h-34 border-altPrimary bg-altPrimary fixed  bottom-0  z-40 w-full overflow-hidden border border-t-4 py-8  md:hidden">
        <BottomMenu
          selected={Selected.PROPERTIES}
          MainMenuButtons={MainMenuButtons}
        />
      </div>
      <div className="grow md:pl-40">{children}</div>
    </div>
  );
}
