"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  Phone,
  Video,
  Info,
  MoreVertical,
  Smile,
  Paperclip,
  ImageIcon,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  Reply,
  Trash2,
  Forward,
  X,
  Plus,
  Users,
  MessageSquare,
  Settings,
  User,
  Filter,
} from "lucide-react";
import { cn } from "@/common/utils/utils";

// Dữ liệu mẫu
const CURRENT_USER = {
  id: "user1",
  name: "Nguyễn Minh Anh",
  avatar: "/placeholder.svg?height=40&width=40",
  status: "online",
};

const CONTACTS = [
  {
    id: "user2",
    name: "Trần Hải Đăng",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Bạn đang làm gì vậy?",
    lastMessageTime: "10:30",
    unread: 2,
    isTyping: false,
  },
  {
    id: "user3",
    name: "Phạm Thu Hà",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Hẹn gặp lại vào cuối tuần nhé!",
    lastMessageTime: "Hôm qua",
    unread: 0,
    isTyping: false,
  },
  {
    id: "user4",
    name: "Lê Quang Minh",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "Đã gửi một hình ảnh",
    lastMessageTime: "Hôm qua",
    unread: 0,
    isTyping: true,
  },
  {
    id: "user5",
    name: "Vũ Thanh Tâm",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Cảm ơn bạn rất nhiều!",
    lastMessageTime: "T2",
    unread: 0,
    isTyping: false,
  },
  {
    id: "user6",
    name: "Nguyễn Thị Lan",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Tài liệu đã được gửi qua email",
    lastMessageTime: "T2",
    unread: 0,
    isTyping: false,
  },
  {
    id: "user7",
    name: "Đỗ Văn Hùng",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Hẹn gặp lại vào tuần sau",
    lastMessageTime: "28/02",
    unread: 0,
    isTyping: false,
  },
  {
    id: "user8",
    name: "Hoàng Thị Thảo",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "Đã gửi một file",
    lastMessageTime: "27/02",
    unread: 0,
    isTyping: false,
  },
];

const CONVERSATIONS = {
  user2: [
    {
      id: "msg1",
      senderId: "user2",
      text: "Chào Minh Anh, bạn khỏe không?",
      time: "10:15",
      status: "read",
      reactions: [{ emoji: "❤️", count: 1 }],
    },
    {
      id: "msg2",
      senderId: "user1",
      text: "Chào Hải Đăng, mình khỏe, còn bạn thì sao?",
      time: "10:16",
      status: "read",
    },
    {
      id: "msg3",
      senderId: "user2",
      text: "Mình cũng khỏe. Bạn đang làm gì vậy?",
      time: "10:18",
      status: "read",
    },
    {
      id: "msg4",
      senderId: "user1",
      text: "Mình đang làm việc trên một dự án mới. Khá thú vị!",
      time: "10:20",
      status: "read",
    },
    {
      id: "msg5",
      senderId: "user2",
      text: "Nghe có vẻ hay đấy! Dự án gì vậy?",
      time: "10:22",
      status: "read",
    },
    {
      id: "msg6",
      senderId: "user1",
      text: "Một ứng dụng di động cho phép người dùng tìm kiếm và đặt dịch vụ gia đình như sửa chữa, dọn dẹp, v.v.",
      time: "10:25",
      status: "read",
    },
    {
      id: "msg7",
      senderId: "user2",
      text: "Wow, nghe thật tuyệt! Khi nào thì ra mắt?",
      time: "10:28",
      status: "read",
    },
    {
      id: "msg8",
      senderId: "user1",
      text: "Dự kiến là trong vòng 3 tháng tới. Còn nhiều việc phải làm lắm.",
      time: "10:29",
      status: "read",
    },
    {
      id: "msg9",
      senderId: "user2",
      text: "Bạn đang làm gì vậy?",
      time: "10:30",
      status: "delivered",
    },
  ],
  user3: [
    {
      id: "msg1",
      senderId: "user3",
      text: "Chào Minh Anh, cuối tuần này bạn có kế hoạch gì không?",
      time: "Hôm qua, 15:30",
      status: "read",
    },
    {
      id: "msg2",
      senderId: "user1",
      text: "Chào Thu Hà, mình dự định đi xem phim, bạn muốn đi cùng không?",
      time: "Hôm qua, 15:35",
      status: "read",
    },
    {
      id: "msg3",
      senderId: "user3",
      text: "Tuyệt vời! Mình rất thích ý tưởng đó. Phim gì vậy?",
      time: "Hôm qua, 15:40",
      status: "read",
    },
    {
      id: "msg4",
      senderId: "user1",
      text: "Mình đang nghĩ đến phim mới của Marvel. Bạn thấy sao?",
      time: "Hôm qua, 15:45",
      status: "read",
    },
    {
      id: "msg5",
      senderId: "user3",
      text: "Nghe hay đấy! Mình đồng ý. Mấy giờ và ở rạp nào?",
      time: "Hôm qua, 15:50",
      status: "read",
    },
    {
      id: "msg6",
      senderId: "user1",
      text: "Mình đang nghĩ đến suất chiếu 7 giờ tối thứ Bảy tại CGV Vincom. Bạn thấy ổn không?",
      time: "Hôm qua, 15:55",
      status: "read",
    },
    {
      id: "msg7",
      senderId: "user3",
      text: "Hoàn hảo! Vậy hẹn gặp lại vào cuối tuần nhé!",
      time: "Hôm qua, 16:00",
      status: "read",
    },
  ],
  user4: [
    {
      id: "msg1",
      senderId: "user4",
      text: "Chào Minh Anh, mình vừa chụp được một số hình ảnh đẹp ở Đà Lạt, muốn chia sẻ với bạn.",
      time: "Hôm qua, 09:15",
      status: "read",
    },
    {
      id: "msg2",
      senderId: "user1",
      text: "Ồ, tuyệt vời! Mình rất muốn xem. Bạn đang ở Đà Lạt à?",
      time: "Hôm qua, 09:20",
      status: "read",
    },
    {
      id: "msg3",
      senderId: "user4",
      text: "Đúng vậy, mình đang có chuyến du lịch 3 ngày ở đây. Thời tiết rất đẹp!",
      time: "Hôm qua, 09:25",
      status: "read",
    },
    {
      id: "msg4",
      senderId: "user4",
      image: "/placeholder.svg?height=400&width=600",
      caption: "Hồ Xuân Hương buổi sáng",
      time: "Hôm qua, 09:30",
      status: "read",
    },
    {
      id: "msg5",
      senderId: "user1",
      text: "Wow, đẹp quá! Mình cũng muốn đến Đà Lạt vào tháng tới.",
      time: "Hôm qua, 09:35",
      status: "read",
    },
    {
      id: "msg6",
      senderId: "user4",
      text: "Bạn nên đến vào thời điểm này, thời tiết rất dễ chịu và không quá đông du khách.",
      time: "Hôm qua, 09:40",
      status: "read",
    },
  ],
};

export default function Chat() {
  const [activeChat, setActiveChat] = useState<string | null>("user2");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(CONTACTS);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lọc danh sách liên hệ khi tìm kiếm
  useEffect(() => {
    if (searchQuery) {
      const filtered = CONTACTS.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(CONTACTS);
    }
  }, [searchQuery]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    // Trong thực tế, đây sẽ là API call để gửi tin nhắn
    // Ở đây chúng ta chỉ giả lập việc gửi tin nhắn

    // Reset input
    setMessage("");
  };

  // Xử lý phím Enter để gửi tin nhắn
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Lấy thông tin người dùng đang chat
  const activeChatUser = CONTACTS.find((contact) => contact.id === activeChat);

  // Lấy tin nhắn của cuộc trò chuyện hiện tại
  const currentMessages = activeChat
    ? CONVERSATIONS[activeChat as keyof typeof CONVERSATIONS] || []
    : [];

  return (
    <div className="flex h-screen max-h-screen p-2">
      <div className="flex w-full bg-white dark:bg-zinc-900 rounded-3xl">
        {/* Sidebar */}
        <div className="w-full max-w-xs  border-r">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={CURRENT_USER.avatar}
                      alt={CURRENT_USER.name}
                    />
                    <AvatarFallback>
                      {CURRENT_USER.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{CURRENT_USER.name}</h2>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      Đang hoạt động
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  className="pl-9 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full flex flex-col h-full">
              <div className="px-4 pt-2">
                <TabsList className="w-full grid grid-cols-4 h-9 bg-muted/50">
                  <TabsTrigger value="all" className="rounded-xl text-xs">
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="rounded-xl text-xs">
                    Chưa đọc
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="rounded-xl text-xs">
                    Nhóm
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="rounded-xl text-xs">
                    Lưu trữ
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Filter */}
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="text-sm font-medium">Tin nhắn gần đây</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Conversations List */}
              <div>
                <ScrollArea className="flex-1">
                  <div className="px-2 py-1">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        className={cn(
                          "w-full flex items-center gap-3 p-2 rounded-xl transition-colors mb-2",
                          activeChat === contact.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                        onClick={() => setActiveChat(contact.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={contact.avatar}
                              alt={contact.name}
                            />
                            <AvatarFallback>
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                              contact.status === "online"
                                ? "bg-green-500"
                                : contact.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            )}
                          ></span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {contact.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {contact.lastMessageTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate max-w-[120px] text-muted-foreground">
                              {contact.isTyping ? (
                                <span className="text-primary italic">
                                  Đang nhập...
                                </span>
                              ) : (
                                contact.lastMessage
                              )}
                            </span>
                            {contact.unread > 0 && (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                                {contact.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom Navigation */}
              <div className="p-2 border-t flex items-center justify-around mt-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                >
                  <Users className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <div className="flex items-center gap-3 me-auto">
                <Avatar>
                  <AvatarImage
                    src={activeChatUser?.avatar}
                    alt={activeChatUser?.name}
                  />
                  <AvatarFallback>
                    {activeChatUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{activeChatUser?.name}</h2>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {activeChatUser?.status === "online" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                        Đang hoạt động
                      </>
                    ) : activeChatUser?.status === "away" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                        Đang bận
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
                        Ngoại tuyến
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Phone className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gọi thoại</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Video className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gọi video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Info className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Thông tin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Thêm tùy chọn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.senderId === CURRENT_USER.id
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div className="flex gap-2 max-w-[70%]">
                      {msg.senderId !== CURRENT_USER.id && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src={
                              CONTACTS.find((c) => c.id === msg.senderId)
                                ?.avatar
                            }
                            alt={
                              CONTACTS.find((c) => c.id === msg.senderId)?.name
                            }
                          />
                          <AvatarFallback>
                            {CONTACTS.find(
                              (c) => c.id === msg.senderId
                            )?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "flex flex-col",
                          msg.senderId === CURRENT_USER.id
                            ? "items-end me-10"
                            : "items-start"
                        )}
                      >
                        <div className="group relative">
                          {/* Message Content */}
                          <div
                            className={cn(
                              "rounded-2xl p-3",
                              msg.senderId === CURRENT_USER.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {msg.text && <p className="text-sm">{msg.text}</p>}
                            {"image" in msg && msg.image && (
                              <div className="rounded-lg overflow-hidden mb-1">
                                <img
                                  src={msg.image || "/placeholder.svg"}
                                  alt={msg.caption || "Hình ảnh"}
                                  className="max-w-full h-auto"
                                />
                              </div>
                            )}
                            {"caption" in msg && msg.caption && (
                              <p className="text-sm mt-1">{msg.caption}</p>
                            )}
                          </div>

                          {/* Message Actions */}
                          <div
                            className={cn(
                              "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                              msg.senderId === CURRENT_USER.id
                                ? "left-0 -translate-x-full"
                                : "right-0 translate-x-full"
                            )}
                          >
                            <Card className="flex p-1 shadow-md">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full"
                                    >
                                      <Reply className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Trả lời</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full"
                                    >
                                      <Forward className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Chuyển tiếp</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {msg.senderId === CURRENT_USER.id && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Xóa</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </Card>
                          </div>

                          {/* Reactions */}
                          {"reactions" in msg && Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
                            <div
                              className={cn(
                                "absolute -bottom-2",
                                msg.senderId === CURRENT_USER.id
                                  ? "left-0"
                                  : "right-0"
                              )}
                            >
                              <div className="bg-background rounded-full shadow-md px-1.5 py-0.5 text-xs flex items-center border">
                                {msg.reactions.map((reaction: { emoji: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; count: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                  <div
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <span>{reaction.emoji}</span>
                                    {typeof reaction.count === "number" && reaction.count > 1 && (
                                      <span className="ml-0.5">
                                        {reaction.count}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Time and Status */}
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span>{msg.time}</span>
                          {msg.senderId === CURRENT_USER.id && (
                            <span className="ml-1">
                              {msg.status === "sent" ? (
                                <Check className="h-3 w-3" />
                              ) : msg.status === "delivered" ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : msg.status === "read" ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {activeChatUser?.isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage
                          src={activeChatUser.avatar}
                          alt={activeChatUser.name}
                        />
                        <AvatarFallback>
                          {activeChatUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl p-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              {/* Attachment Options */}
              {showAttachmentOptions && (
                <div className="mb-3 flex items-center gap-2 justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10"
                        >
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hình ảnh</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10"
                        >
                          <File className="h-5 w-5 text-green-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tài liệu</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10"
                        >
                          <MapPin className="h-5 w-5 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Vị trí</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10"
                        >
                          <Contact className="h-5 w-5 text-purple-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Liên hệ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-3 p-2 border rounded-xl bg-background">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-sm font-medium">
                      Biểu tượng cảm xúc
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      "😊",
                      "😂",
                      "❤️",
                      "👍",
                      "😍",
                      "😭",
                      "🔥",
                      "✨",
                      "🎉",
                      "🙏",
                      "😘",
                      "💕",
                      "😎",
                      "🥰",
                      "😇",
                      "😋",
                    ].map((emoji, index) => (
                      <button
                        key={index}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-lg text-lg"
                        onClick={() => {
                          setMessage((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs rounded-xl"
                    >
                      Xem tất cả
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setShowAttachmentOptions(!showAttachmentOptions);
                    if (showEmojiPicker) setShowEmojiPicker(false);
                  }}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="rounded-xl pr-10"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      if (showAttachmentOptions)
                        setShowAttachmentOptions(false);
                    }}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>

                {message.trim() ? (
                  <Button
                    size="icon"
                    className="rounded-full"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Chào mừng đến với Tin nhắn
              </h2>
              <p className="text-muted-foreground max-w-md">
                Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu một
                cuộc trò chuyện mới.
              </p>
              <Button className="mt-4 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Tạo cuộc trò chuyện mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility component for File icon
function File(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// Utility component for Contact icon
function Contact(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <path d="M8 16.5a4 4 0 0 1 8 0" />
    </svg>
  );
}

// Utility component for MapPin icon
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
