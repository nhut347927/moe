import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen">
       <Outlet /> <Toaster />
    </div>
  );
};

export default AuthLayout;
