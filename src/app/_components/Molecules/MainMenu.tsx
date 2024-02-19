import Link from "next/link";
import Logo from "../Atoms/Logo";
import { Text } from "../Atoms/Text";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { AccountIcon, AlertsIcon, PropertiesIcon } from "../Atoms/Icons";

export enum Selected {
  PROPERTIES,
  ALERTS,
  ACCOUNT,
}

export const MainMenuSide = ({ selected }: { selected: Selected }) => {
  return (
    <div className="flex h-full flex-col items-center pt-10">
      <Logo
        height="120"
        width="120"
        className=""
        colour="#c470e7"
        textColour="#f7ece1"
      />
      <div className="grid h-full flex-col content-center justify-center gap-4">
        <MainMenuButtons selected={selected} />
      </div>
    </div>
  );
};

export const MainMenuBottom = ({ selected }: { selected: Selected }) => {
  return (
    <div className="flex flex-wrap justify-around gap-y-2">
      <MainMenuButtons selected={selected} />
    </div>
  );
};

const MainMenuButton: React.FC<
  React.PropsWithChildren<{
    selected?: boolean;
  }>
> = ({ children, selected = true }) => (
  <button
    className={clsx(
      "w-28 rounded-lg border border-2 p-3 hover:bg-black/20",
      selected ? "border-brand" : "border-light",
    )}
  >
    <div className="flex flex-wrap  content-center justify-center">
      {children}
    </div>
  </button>
);

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
