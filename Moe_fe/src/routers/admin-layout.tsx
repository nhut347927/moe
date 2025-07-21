import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Cloud,
  FileClock,
  Grid,
  Home,
  Menu,
  MessageSquare,
  PanelLeft,
  Search,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/common/utils/utils";
import logo from "../assets/images/logo.png";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = () => {
  const [notifications] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Mảng sidebar items (bỏ isActive cứng)
  const sidebarItems = [
    {
      title: "Home",
      icon: <Home />,
      isActive: false,
      path: "/admin",
    },
    {
      title: "Activity Log",
      icon: <FileClock />,
      isActive: false,
      path: "/admin/activity-log",
    },
    {
      title: "User",
      icon: <User />,
      isActive: false,
      path: "/admin/user",
    },
    {
      title: "Permissions",
      icon: <Shield />,
      isActive: false,
      path: "/admin/permissions",
    },
    {
      title: "App (Example)",
      icon: <Grid />,
      badge: "2",
      isActive: false,
      items: [
        { title: "All Apps", url: "/admin/app/all" },
        { title: "Recent", url: "/admin/app/recent" },
        { title: "Updates", url: "/admin/app/updates", badge: "2" },
        { title: "Installed", url: "/admin/app/installed" },
      ],
      path: "/admin/app",
    },
  ];

  // Hàm toggle expanded menu
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Kiểm tra xem item có active không dựa trên location.pathname
  const isActive = (item: (typeof sidebarItems)[number]) => {
    // Nếu item có path thì so sánh trực tiếp
    if (item.path && location.pathname.startsWith(item.path)) return true;

    // Nếu có sub items thì kiểm tra xem có cái nào active ko
    if (item.items) {
      return item.items.some((sub) => location.pathname.startsWith(sub.url));
    }

    return false;
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img className="w-9" src={logo} alt="" />
              <div>
                <h2 className="font-semibold">MOE</h2>
                <p className="text-xs text-muted-foreground">Social network</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const active = isActive(item);

                return (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                      onClick={() => {
                        if (item.items) {
                          toggleExpanded(item.title);
                        } else if (item.path) {
                          navigate(item.path);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto rounded-full px-2 py-0.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "ml-2 h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : ""
                          )}
                        />
                      )}
                    </button>

                    {item.items && expandedItems[item.title] && (
                      <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                        {item.items.map((subItem) => {
                          const subActive = location.pathname.startsWith(
                            subItem.url
                          );
                          return (
                            <a
                              key={subItem.title}
                              href={subItem.url}
                              className={cn(
                                "flex items-center justify-between rounded-2xl px-3 py-2 text-sm",
                                subActive
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted"
                              )}
                            >
                              {subItem.title}
                              {subItem.badge && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto rounded-full px-2 py-0.5 text-xs"
                                >
                                  {subItem.badge}
                                </Badge>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img className="w-9" src={logo} alt="" />
              <div>
                <h2 className="font-semibold">MOE</h2>
                <p className="text-xs text-muted-foreground">Social network</p>
              </div>
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const active = isActive(item);

                return (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                      onClick={() => {
                        if (item.items) {
                          toggleExpanded(item.title);
                        } else if (item.path) {
                          navigate(item.path);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto rounded-full px-2 py-0.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "ml-2 h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : ""
                          )}
                        />
                      )}
                    </button>

                    {item.items && expandedItems[item.title] && (
                      <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                        {item.items.map((subItem) => {
                          const subActive = location.pathname.startsWith(
                            subItem.url
                          );
                          return (
                            <a
                              key={subItem.title}
                              href={subItem.url}
                              className={cn(
                                "flex items-center justify-between rounded-2xl px-3 py-2 text-sm",
                                subActive
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted"
                              )}
                            >
                              {subItem.title}
                              {subItem.badge && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto rounded-full px-2 py-0.5 text-xs"
                                >
                                  {subItem.badge}
                                </Badge>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:pl-64" : "md:pl-0"
        )}
      >
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">MOE Creative</h1>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Cloud className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cloud Storage</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Messages</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl relative"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {" "}
              <Toaster />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
