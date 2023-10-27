"use client";
import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Resizable from "@/components/resizable/Resizable";
import Navigation from "@/components/Navigation";
import { useAuthContext } from "@/context/store/AuthContext";

const DynamicLayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { navWidth, showNav } = useGlobalContext();
  const { user, loading, logout } = useAuthContext();

  if (showNav && user) {
    return (
      <div className="flex h-full">
        <Resizable direction="horizontal">
          {user && !loading && <Navigation />}
        </Resizable>
        <main
          style={!showNav ? { marginLeft: navWidth } : { marginLeft: 0 }}
          className="flex h-full flex-grow items-center justify-center"
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div>
      {user && !loading && <Navigation />}
      <main>{children}</main>
    </div>
  );
};

export default DynamicLayoutContent;
