import Link from "next/link";
import {
  BottomMenu,
  MainMenuButton,
  SideMenu,
  HomeownerSelected as Selected,
  MainMenuButtonsProps,
} from "../../../../ui/Molecules/SideMenu";
import {
  AlertsIcon,
  LargeSearchIcon,
  PropertiesIcon,
} from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";
import { PropsWithChildren } from "react";
import { auth } from "~/auth";
import { Alert } from "../../../../core/homeowner/alert";
import clsx from "clsx";

const MainMenuButtons = ({ selected, alerts }: MainMenuButtonsProps) => {
  const propertiesSelected = selected === Selected.PROPERTIES;
  const alertsSelected = selected === Selected.ALERTS;
  const accountSelected = selected === Selected.SEARCH;

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

      <Link className="relative" href="/alerts">
        <div
          className={clsx(
            "full absolute -right-2 -top-2 flex h-10 w-10 flex-col items-center justify-center rounded-full bg-red-600 text-white",
            alerts === 0 && "invisible",
          )}
        >
          {alerts}
        </div>
        <MainMenuButton selected={alertsSelected}>
          <AlertsIcon selected={alertsSelected} />
          <Text colour={alertsSelected ? "text-brand" : "text-light"}>
            Alerts
          </Text>
        </MainMenuButton>
      </Link>
      <Link href="/search">
        <MainMenuButton selected={accountSelected}>
          <LargeSearchIcon
            width={55}
            height={60}
            colour={accountSelected ? "#7df2cd" : "#f7ece1"}
          />
          <Text colour={accountSelected ? "text-brand" : "text-light"}>
            Search
          </Text>
        </MainMenuButton>
      </Link>
    </>
  );
};

export async function PropertiesPageWithSideMenu({
  children,
}: PropsWithChildren) {
  // get alerts for user
  const session = await auth();

  const alerts = await Alert.getForHomeowner(session?.user?.id ?? "");

  const newAlertsCount = alerts.filter((alert) => !alert.viewed).length;

  return (
    <div className="flex w-full flex-nowrap">
      <div className="fixed top-0 hidden h-full w-40 flex-none overflow-hidden border border-r-4  border-altPrimary bg-altPrimary md:block">
        <SideMenu
          selected={Selected.PROPERTIES}
          MainMenuButtons={MainMenuButtons}
        />
      </div>
      <div className="h-26 fixed bottom-0 z-40  w-full  overflow-hidden border border-t-4 border-altPrimary bg-altPrimary py-3  md:hidden">
        <BottomMenu
          selected={Selected.PROPERTIES}
          MainMenuButtons={MainMenuButtons}
          alerts={newAlertsCount}
        />
      </div>
      <div className="grow md:pl-40">{children}</div>
    </div>
  );
}

export async function AlertsPageWithSideMenu({ children }: PropsWithChildren) {
  // get alerts for user
  const session = await auth();

  const alerts = await Alert.getForHomeowner(session?.user?.id ?? "");

  const newAlertsCount = alerts.filter((alert) => !alert.viewed).length;

  return (
    <div className="flex w-full flex-nowrap">
      <div className="fixed top-0 hidden h-full w-40 flex-none overflow-hidden border border-r-4  border-altPrimary bg-altPrimary md:block">
        <SideMenu
          selected={Selected.ALERTS}
          MainMenuButtons={MainMenuButtons}
        />
      </div>
      <div className="h-26 fixed bottom-0 z-40  w-full  overflow-hidden border border-t-4 border-altPrimary bg-altPrimary py-3  md:hidden">
        <BottomMenu
          selected={Selected.ALERTS}
          MainMenuButtons={MainMenuButtons}
          alerts={newAlertsCount}
        />
      </div>
      <div className="grow md:pl-40">{children}</div>
    </div>
  );
}
