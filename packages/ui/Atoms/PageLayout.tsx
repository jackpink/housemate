import { PropsWithChildren } from "react";

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
