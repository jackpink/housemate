import Logo from "../Atoms/Logo";
import clsx from "clsx";
import { Selected as HomeownerSelected } from "../Organisms/homeowner/Layout";
import { ComponentType } from "react";

export const MainMenuSide = ({
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

export const MainMenuBottom = ({
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
      "w-28 rounded-lg border border-2 p-3 hover:bg-black/20",
      selected ? "border-brand" : "border-light",
    )}
  >
    <div className="flex flex-wrap  content-center justify-center">
      {children}
    </div>
  </button>
);
