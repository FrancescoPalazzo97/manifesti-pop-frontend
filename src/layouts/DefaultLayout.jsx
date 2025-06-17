import React from "react";
import { Outlet } from 'react-router-dom'
import Navbar from "../components/Navbar";

const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <main className=".container-fluid">
        <div className="row">
          <Outlet />
        </div>

      </main>
    </>
  );
};

export default DefaultLayout;
