import { Toaster } from "@/components/ui/toaster";
import Header from "@/pages/client/Header";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-black overflow-hidden">
      <Toaster />
      <Header/>
      <Outlet />
    </div>
  );
};

export default ClientLayout;
