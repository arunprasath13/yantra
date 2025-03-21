import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FC, ReactNode } from "react";


interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">      
      <div className="w-64 h-screen overflow-y-auto">
        <Sidebar />
      </div>      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
