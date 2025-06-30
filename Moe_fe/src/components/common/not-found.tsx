import { Ban  } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center">
      <Ban  className="w-24 h-24 text-white" />
      <h1 className="text-2xl font-bold mt-4">Oops! Page not found.</h1>
      <p className="text-gray-400 mt-2">The page you are looking for doesn’t exist or has been moved.</p>
    </div>
  );
};

export default NotFound;
