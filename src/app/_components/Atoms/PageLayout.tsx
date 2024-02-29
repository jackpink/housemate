import { PropsWithChildren } from "react";
import { MainMenuBottom, MainMenuSide, Selected } from "../Molecules/MainMenu";

export function PropertiesPageWithMainMenu({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-nowrap">
      <div className="fixed top-0 hidden h-full w-40 flex-none overflow-hidden border border-r-4  border-altPrimary bg-altPrimary md:block">
        <MainMenuSide selected={Selected.PROPERTIES} />
      </div>
      <div className="h-34 fixed bottom-0 z-40  w-full  overflow-hidden border border-t-4 border-altPrimary bg-altPrimary py-8  md:hidden">
        <MainMenuBottom selected={Selected.PROPERTIES} />
      </div>
      <div className="grow md:pl-40">{children}</div>
    </div>
  );
}

export function ResponsiveColumns({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-4 3xl:gap-8">
      {children}
    </div>
  );
}

export function ColumnOne({ children }: PropsWithChildren) {
  return (
    <div className="col-span-2 mx-4 flex flex-col justify-center xl:col-span-1">
      {children}
    </div>
  );
}

export function ColumnTwo({ children }: PropsWithChildren) {
  return (
    <div className="col-span-2 mx-4 flex flex-col xl:col-span-1">
      {children}
    </div>
  );
}

export function PageWithSingleColumn({ children }: PropsWithChildren) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}
