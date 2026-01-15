import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="relative flex-1 overflow-y-auto p-4">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;