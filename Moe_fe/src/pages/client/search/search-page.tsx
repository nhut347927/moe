"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import { AccountSearch, PostSearch } from "./types";
import { getTimeAgo } from "@/common/utils/utils";
import PostCompo from "@/components/post/post";

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [posts, setPosts] = useState<PostSearch[]>([]);
  const [accounts, setAccounts] = useState<AccountSearch[]>([]);
  const [postPage, setPostPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [hasMoreAccounts, setHasMoreAccounts] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"posts" | "accounts">("posts");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { toast } = useToast();
  const pageSize = "10";

  // Debounce search
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const searchPost = async (keyWord: string, page: string, size: string) => {
    try {
      const response = await axiosInstance.post("post/search", {
        keyWord: keyWord,
        page: page,
        size: size,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to search posts");
    }
  };

  const searchAccount = async (keyWord: string, page: string, size: string) => {
    try {
      const response = await axiosInstance.post("account/search", {
        keyWord: keyWord,
        page: page,
        size: size,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to search accounts");
    }
  };

  const followOrUnfollow = async (userCode: string) => {
    try {
      const response = await axiosInstance.post("account/follow", {
        code: userCode,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to toggle follow");
    }
  };

  const fetchSearchResults = useCallback(
    async (term: string, reset: boolean = false) => {
      if (!term.trim()) return;

      setIsLoading(true);
      try {
        if (activeTab === "posts") {
          const postResults = await searchPost(
            term,
            reset ? "0" : String(postPage),
            pageSize
          );
          setPosts((prev) => (reset ? postResults : [...prev, ...postResults]));
          setHasMorePosts(postResults.length === Number(pageSize));
          setPostPage((prev) => (reset ? 1 : prev + 1));
          if (!reset && postResults.length === 0) {
            toast({
              description: "Không còn bài viết để tải!",
            });
          }
        } else {
          const accountResults = await searchAccount(
            term,
            reset ? "0" : String(accountPage),
            pageSize
          );
          setAccounts((prev) =>
            reset ? accountResults : [...prev, ...accountResults]
          );
          setHasMoreAccounts(accountResults.length === Number(pageSize));
          setAccountPage((prev) => (reset ? 1 : prev + 1));
          if (!reset && accountResults.length === 0) {
            toast({
              description: "Không còn tài khoản để tải!",
            });
          }
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, postPage, accountPage, toast]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => fetchSearchResults(term, true), 500),
    [fetchSearchResults]
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      setPosts([]);
      setAccounts([]);
      setPostPage(0);
      setAccountPage(0);
      setHasMorePosts(true);
      setHasMoreAccounts(true);
    }
  }, [searchTerm, debouncedSearch]);

  const handleFollow = async (userCode: string) => {
    try {
      await followOrUnfollow(userCode);
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.userCode === userCode
            ? {
                ...acc,
                isFollowed: !acc.isFollowed,
                followerCount: (
                  Number(acc.followerCount) + (acc.isFollowed ? -1 : 1)
                ).toString(),
              }
            : acc
        )
      );
      toast({
        description: `Successfully ${accounts.find((acc) => acc.userCode === userCode)?.isFollowed ? "unfollowed" : "followed"} user!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Lỗi khi theo dõi",
      });
    }
  };

  const handleLoadMorePosts = () => {
    if (hasMorePosts && !isLoading) {
      fetchSearchResults(searchTerm);
    }
  };

  const handleLoadMoreAccounts = () => {
    if (hasMoreAccounts && !isLoading) {
      fetchSearchResults(searchTerm);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen max-w-lg mx-auto px-3 py-4 flex flex-col relative">
      {/* Nút back + ô tìm kiếm trên cùng 1 hàng */}
      <div className="flex items-center gap-2 mb-4 mt-12">
      
        <Input
          placeholder="Tìm bài viết hoặc tài khoản..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="posts"
        className="w-full flex-1 flex flex-col overflow-hidden"
        onValueChange={(value) => {
          setActiveTab(value as "posts" | "accounts");
          if (
            searchTerm.trim() &&
            (value === "accounts" ? accounts.length === 0 : posts.length === 0)
          ) {
            fetchSearchResults(searchTerm, true);
          }
        }}
      >
        <TabsList className="w-full h-11 flex justify-around bg-muted rounded-2xl mb-4">
          <TabsTrigger
            value="posts"
            className="flex-1 rounded-xl data-[state=active]:bg-background py-2 text-sm font-medium"
          >
            Bài viết
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="flex-1 rounded-xl data-[state=active]:bg-background py-2 text-sm font-medium"
          >
            Tài khoản
          </TabsTrigger>
        </TabsList>

        {/* Bài viết */}
        <TabsContent value="posts" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            {posts.length === 0 && !isLoading ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
                Không có bài viết
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {posts.map((post) => (
                  <div
                    key={post.postCode}
                    className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900"
                  >
                    <div className="aspect-square">
                      {post.postType === "VID" ? (
                        <img
                          src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,so_${
                            post.videoThumbnail ?? "0"
                          }/${post.mediaUrl}.jpg`}
                          className="w-full h-full object-cover cursor-pointer"
                          alt="post"
                          onClick={() => setSelectedPost(post.postCode)}
                        />
                      ) : (
                        <img
                          src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${post.mediaUrl}`}
                          className="w-full h-full object-cover cursor-pointer"
                          alt="post"
                          onClick={() => setSelectedPost(post.postCode)}
                        />
                      )}
                    </div>
                    <div className="px-2 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-5 h-5">
                          <AvatarImage
                            src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_40,h_40,c_thumb,f_auto,q_auto/${post.avatarUrl}`}
                          />
                          <AvatarFallback>{post.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <Link to={`/client/profile?code=${post.userCode}`}>
                          <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate cursor-pointer">
                            {post.displayName}
                          </span>
                        </Link>
                      </div>
                      <Link to={`/client/profile?code=${post.userCode}`}>
                        <p className="text-sm font-semibold truncate">
                          {post.userName}
                        </p>
                      </Link>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {post.viewCount} lượt xem • {getTimeAgo(post.createAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {hasMorePosts && (
                  <div className="col-span-2 text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMorePosts}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang tải..." : "Tải thêm"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Tài khoản */}
        <TabsContent value="accounts" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            {accounts.length === 0 && !isLoading ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
                Không tìm thấy tài khoản
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div
                    key={acc.userCode}
                    className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_40,h_40,c_thumb,f_auto,q_auto/${acc.avatarUrl}`}
                        />
                        <AvatarFallback>
                          {acc.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/client/profile?code=${acc.userCode}`}>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {acc.displayName}
                          </p>
                        </Link>
                        <Link to={`/client/profile?code=${acc.userCode}`}>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            @{acc.userName}
                          </p>
                        </Link>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {acc.followerCount} followers
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={acc.isFollowed ? "outline" : "default"}
                      size="sm"
                      className="rounded-full text-xs px-4"
                      onClick={() => handleFollow(acc.userCode)}
                      disabled={isLoading}
                    >
                      {acc.isFollowed ? "Đang theo dõi" : "Theo dõi"}
                    </Button>
                  </div>
                ))}
                {hasMoreAccounts && (
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMoreAccounts}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang tải..." : "Tải thêm"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative m-4 max-w-lg w-full rounded-lg overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-0 right-0 z-50 w-8 h-8 flex items-center justify-center bg-slate-200 text-zinc-600 rounded-full hover:bg-slate-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
              onClick={() => setSelectedPost(null)}
              aria-label="Close post"
            >
              ✕
            </button>
            <PostCompo postCode={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;