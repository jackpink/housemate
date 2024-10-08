"use client";

import React from "react";
import { Session, User as LuciaUser } from "lucia";
import { set } from "zod";

const defaultViewport = { width: 1000, height: 1000 };

const viewportContext = React.createContext(defaultViewport);

export const ViewportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // This is the exact same logic that we previously had in our hook

  const [width, setWidth] = React.useState(350);
  const [height, setHeight] = React.useState(350);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  /* Now we are dealing with a context instead of a Hook, so instead
     of returning the width and height we store the values in the
     value of the Provider */
  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};

export const useViewport = () => {
  /* We can use the "useContext" Hook to acccess a context from within
     another Hook, remember, Hooks are composable! */
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};

const defaultUser: LuciaUser | null = null;

const sessionContext = React.createContext<LuciaUser | null>(defaultUser);

export const SessionProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: LuciaUser | null;
}) => {
  return (
    <sessionContext.Provider value={user}>{children}</sessionContext.Provider>
  );
};

export const useSession = () => {
  /* We can use the "useContext" Hook to acccess a context from within
     another Hook, remember, Hooks are composable! */
  const user = React.useContext(sessionContext);
  return user;
};
