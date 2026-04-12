import React from "react";
import SideBar from "../MyProfile/SideBar";
import { Outlet } from "react-router-dom";

const MyProfileNavigation = () => {
  return (
    <div className="flex max-h-screen bg-gray-50">
      <SideBar />

      <main className="flex-1 w-full pt-24 sm:pt-4 md:pt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MyProfileNavigation;
