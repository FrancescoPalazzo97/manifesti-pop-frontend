import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container-fluid">
        <div className="row">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
