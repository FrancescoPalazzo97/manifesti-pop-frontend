import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chat from "../components/Chat";

const DefaultLayout = () => {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <main className="container-fluid">
          <Outlet />
        </main>
        <Footer />
        {/* Chat widget sempre visibile */}
        <Chat />
      </div>
    </>
  );
};

export default DefaultLayout;