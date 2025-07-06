import { Home, Search, Info, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import img from "../../assets/images/logo.png";
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }

  const avatar = getCookie("avatar");

  // Vuốt phải để mở và vuốt trái để đóng sidebar trên mobile
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX;
      if (deltaX > 100 && !isOpen) {
        setIsOpen(true); // Swipe right to open
      } else if (deltaX < -60 && isOpen) {
        setIsOpen(false); // Swipe left to close
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  // Hàm để check trang hiện tại
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  // CSS dùng chung cho button
  const btnBase =
    "w-10 h-10 rounded-xl text-zinc-700 dark:text-zinc-200 transition-colors";
  const btnActive = "w-12 h-10 bg-zinc-300 dark:bg-zinc-700";
  const btnHover = "w-12 h-10 hover:bg-zinc-200 dark:hover:bg-zinc-800";

  return (
    <>
      {/* Nút mở menu (mobile) */}
      <div className="fixed top-4 left-4 z-50">
        <span onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-full transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-black/30 backdrop-blur-md`}
        onClick={()=>setIsOpen(!isOpen)}
      >
        <div className="flex justify-start items-center h-full">
          <div className="ms-3 w-16 p-3 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl flex flex-col items-center gap-2 h-fit">
            {/* Logo */}
            <Link to="/" title="Trang chủ">
              <Avatar className="w-10 h-10 mb-2 ring-2 ring-blue-500 ring-opacity-20">
                <AvatarImage src={img} />
                <AvatarFallback className="bg-zinc-400 text-white">
                  CN
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col items-center gap-1">
              <Link to="/client/home" title="Trang chủ">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${btnBase} ${
                    isActive("/client/home") ? btnActive : ""
                  } ${btnHover}`}
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/client/search" title="Tìm kiếm">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${btnBase} ${
                    isActive("/client/search") ? btnActive : ""
                  } ${btnHover}`}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about" title="Giới thiệu">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${btnBase} ${
                    isActive("/about") ? btnActive : ""
                  } ${btnHover}`}
                >
                  <Info className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/notifications" title="Thông báo">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${btnBase} ${
                    isActive("/notifications") ? btnActive : ""
                  } ${btnHover}`}
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </Link>
            </nav>

            {/* Avatar người dùng */}
            <div className="mt-0">
              <Link to="/client/my-profile" title="Tài khoản">
                <Avatar className="w-10 h-10 hover:ring-2 hover:ring-blue-400 transition">
                  <AvatarImage
                    src={
                      avatar
                        ? `abc/image/upload/w_80,h_80/${avatar}`
                        : undefined
                    }
                  />
                  <AvatarFallback className="bg-blue-400 text-white">
                    CN
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}