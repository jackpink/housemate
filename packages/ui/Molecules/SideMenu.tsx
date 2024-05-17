import Logo from "../Atoms/Logo";
import clsx from "clsx";
import { ComponentType } from "react";

export enum HomeownerSelected {
  PROPERTIES,
  ALERTS,
  SEARCH,
}

export const SideMenu = ({
  selected,
  MainMenuButtons,
}: {
  selected: HomeownerSelected;
  MainMenuButtons: ComponentType<{ selected: HomeownerSelected }>;
}) => {
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

export const BottomMenu = ({
  selected,
  MainMenuButtons,
}: {
  selected: HomeownerSelected;
  MainMenuButtons: ComponentType<{ selected: HomeownerSelected }>;
}) => {
  return (
    <div className="flex flex-wrap justify-around gap-y-2">
      <MainMenuButtons selected={selected} />
    </div>
  );
};

export const MainMenuButton: React.FC<
  React.PropsWithChildren<{
    selected?: boolean;
  }>
> = ({ children, selected = true }) => (
  <button
    className={clsx(
      "w-24 rounded-lg border border-2 p-1 hover:bg-black/20",
      selected ? "border-brand" : "border-light",
    )}
  >
    <div className="flex flex-wrap  content-center justify-center">
      {children}
    </div>
  </button>
);
