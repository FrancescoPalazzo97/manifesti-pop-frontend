import React from "react";
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <>
      <main className="container">
        <div className="row">
          <Outlet />
        </div>

      </main>
    </>
  );
};

export default DefaultLayout;
