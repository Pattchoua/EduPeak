import React from "react";
import Sidebar from "./_components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed insert-y-0 z-50">
<Sidebar/>
      </div>
     
    </div>
  );
};

export default Layout;
