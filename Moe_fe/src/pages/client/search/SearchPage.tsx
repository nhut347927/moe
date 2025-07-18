"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/AxiosInstance";
import { AccountSearch, PostSearch, TopSearch } from "../types";
import { useGetApi } from "@/common/hooks/useGetApi";
import { ArrowUpLeft, ImageIcon, Search, Users } from "lucide-react";
import Spinner from "@/components/common/Spiner";
import PostCompo from "@/components/post/PostCompo";
import { Page } from "@/common/hooks/type";

export function SearchPage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<PostSearch[]>([]);
  const [accounts, setAccounts] = useState<AccountSearch[]>([]);
  const [postPage, setPostPage] = useState(0);
  const [accountPage, setAccountPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [hasMoreAccounts, setHasMoreAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"posts" | "accounts">("posts");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [searchSugges, setSearchSugges] = useState<string>(""); // giá trị nhập trong input
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(""); // keyword đã debounce
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Read query parameter 'q' from URL
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query.trim() !== searchInput) {
      setSearchInput(query.trim());
      setSearchTerm(query.trim());
      setSearchSugges(query.trim());
      setPostPage(0);
      setAccountPage(0);
      setPosts([]);
      setAccounts([]);
    }
  }, [searchParams]);

  const [topSearch, setTopsearch] = useState<TopSearch[]>([]);
  // Fetch top searches
  const {} = useGetApi<TopSearch[]>({
    endpoint: "search/top",
    enabled: true,
    onSuccess: (data) => {
      setTopsearch(data ?? []);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load top search",
      });
    },
  });

  // Fetch posts
  const { loading: postLoading, error: postError } = useGetApi<
    Page<PostSearch>
  >({
    endpoint: "posts/search",
    params: { keyWord: searchTerm, page: postPage, size: 12, sort: "desc" },
    enabled: !!searchTerm && activeTab === "posts",
    onSuccess: (data) => {
      setPosts((prev) =>
        postPage === 0
          ? data?.contents || []
          : [...prev, ...(data?.contents || [])]
      );
      setHasMorePosts(data?.hasNext || false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to search posts",
      });
    },
  });

  // Fetch accounts
  const { loading: accountLoading, error: accountError } = useGetApi<
    Page<AccountSearch>
  >({
    endpoint: "accounts/search",
    params: { keyWord: searchTerm, page: accountPage, size: 12, sort: "desc" },
    enabled: !!searchTerm && activeTab === "accounts",
    onSuccess: (data) => {
      setAccounts((prev) =>
        accountPage === 0
          ? data?.contents || []
          : [...prev, ...(data?.contents || [])]
      );
      setHasMoreAccounts(data?.hasNext || false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to search accounts",
      });
    },
  });

  const followOrUnfollow = async (userCode: string) => {
    try {
      const response = await axiosInstance.post("accounts/follow", {
        code: userCode,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle follow"
      );
    }
  };

  const handleFollow = async (userCode: string) => {
    try {
      await followOrUnfollow(userCode);
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.userCode === userCode
            ? {
                ...acc,
                isFollowed: !acc.isFollowed,
                followerCount: String(
                  Number(acc.followerCount) + (acc.isFollowed ? -1 : 1)
                ),
              }
            : acc
        )
      );
      toast({
        description: `Successfully ${
          accounts.find((acc) => acc.userCode === userCode)?.isFollowed
            ? "unfollowed"
            : "followed"
        } user!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Lỗi khi theo dõi",
      });
    }
  };

  const handleLoadMorePosts = useCallback(() => {
    if (!isLoading && hasMorePosts) {
      setPostPage((prev) => prev + 1);
    }
  }, [isLoading, hasMorePosts]);

  const handleLoadMoreAccounts = useCallback(() => {
    if (!isLoading && hasMoreAccounts) {
      setAccountPage((prev) => prev + 1);
    }
  }, [isLoading, hasMoreAccounts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput.trim() !== searchTerm) {
        setSearchTerm(searchInput.trim());
        setPostPage(0);
        setAccountPage(0);
        setPosts([]);
        setAccounts([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, searchTerm]);

  useEffect(() => {
    setIsLoading(postLoading || accountLoading);
  }, [postLoading, accountLoading]);

  useEffect(() => {
    if (postError) {
      setPosts([]);
      setHasMorePosts(false);
    }
    if (accountError) {
      setAccounts([]);
      setHasMoreAccounts(false);
    }
  }, [postError, accountError]);

  // Hàm gọi khi người dùng gõ input
  const searchChange = (q: string) => {
    setSearchSugges(q);
  };

  // Debounce input trong 300ms
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = searchSugges.trim();
      setDebouncedKeyword(trimmed);

      setSearchInput("");
      setPosts([]);
      setAccounts([]);
    }, 300);
  }, [searchSugges]);

  // Gọi API suggestions với keyword đã debounce
  useGetApi<string[]>({
    endpoint: "search/suggestions",
    params: { keyWord: debouncedKeyword, size: 10 },
    enabled: !!debouncedKeyword, // chỉ gọi khi có từ khóa
    onSuccess: (data) => {
      setSuggestions(data ?? []);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load top search",
      });
    },
  });

  return (
    <div className="relative flex-1 flex justify-center">
      <ScrollArea className="flex-1 max-h-full h-screen max-w-3xl w-full p-2 overflow-y-auto overflow-x-hidden relative">
        <div className="flex items-center gap-2 p-1 mb-4 mt-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Tìm bài viết hoặc tài khoản..."
              type="search"
              value={searchSugges}
              onChange={(e) => searchChange(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary"
            />

            {(suggestions.length > 0 || searchSugges.trim()) &&
              !searchInput &&
              posts.length === 0 &&
              accounts.length === 0 && (
                <ul className="absolute top-full left-0 z-50 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md rounded-2xl overflow-hidden text-zinc-800 dark:text-zinc-200 animate-fade-in">
                  {/* Gợi ý từ khoá người dùng đang gõ */}
                  <li
                    onMouseDown={() => {
                      setSearchInput(searchSugges);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Search className="w-4 h-4 text-primary" />
                      <span className="text-primary">{searchSugges}</span>
                    </div>
                    <ArrowUpLeft className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  </li>

                  {/* Gợi ý từ API */}
                  {suggestions.map((keyword, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchInput(keyword);
                        setSuggestions([]);
                        setSearchSugges(keyword);
                      }}
                      className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <span>{keyword}</span>
                      </div>
                      <ArrowUpLeft className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>

        <Tabs
          defaultValue="posts"
          className="w-full flex-1 flex flex-col overflow-hidden"
          onValueChange={(value) => setActiveTab(value as "posts" | "accounts")}
        >
          <TabsList className="inline-flex gap-2 bg-muted rounded-xl p-1 mb-4 w-auto max-w-max mx-auto">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-1 px-4 py-1 text-sm rounded-lg data-[state=active]:bg-background"
            >
              <ImageIcon className="w-4 h-4" />
              Post
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="flex items-center gap-1 px-4 py-1 text-sm rounded-lg data-[state=active]:bg-background"
            >
              <Users className="w-4 h-4" />
              Acount
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="flex-1 overflow-hidden">
            <div className="h-full pr-2">
              {posts.length === 0 && !isLoading ? (
                <div>
                  <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10 mb-9">
                    No posts available
                  </p>
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm">
                    <p className="text-left text-zinc-900 dark:text-zinc-100 text-base font-semibold mb-4">
                      You might like
                    </p>
                    <div className="space-y-3">
                      {topSearch.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                          onClick={() => {
                            setSearchInput(item.keyword);
                            setSuggestions([]);
                            setSearchSugges(item.keyword);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              ●
                            </span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-xs">
                              {item.keyword}
                            </span>
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[30px] text-right">
                            ( {item.count} )
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div
                      key={post.postCode}
                      className="rounded-xl overflow-hidden cursor-pointer relative group"
                      onClick={() => setSelectedPost(post.postCode)}
                    >
                      {/* Ảnh với overlay view ở góc dưới trái */}
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        {post.postType === "VID" ? (
                          <img
                            src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,so_${
                              post.videoThumbnail ?? "0"
                            }/${post.mediaUrl}.jpg`}
                            alt="post thumbnail"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <img
                            src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${post.mediaUrl}`}
                            alt="post thumbnail"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* View count góc dưới trái ảnh */}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded select-none">
                          {post.viewCount} view
                          {Number(post.viewCount) !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Nội dung bên dưới ảnh */}
                      <div className="mt-2 px-1 overflow-hidden">
                        <p
                          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate"
                          title={post.title}
                        >
                          {post.title || "Untitled"}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-700 dark:text-zinc-300 truncate">
                          <Avatar className="w-6 h-6 border border-zinc-300 dark:border-zinc-700">
                            <AvatarImage
                              src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_40,h_40,c_thumb,f_auto,q_auto/${post.avatarUrl}`}
                              alt={post.displayName}
                            />
                            <AvatarFallback>
                              {post.displayName?.[0] ?? "U"}
                            </AvatarFallback>
                          </Avatar>

                          <span
                            className="font-medium truncate max-w-[100px]"
                            title={post.displayName}
                          >
                            {post.displayName}
                          </span>

                          <span className="whitespace-nowrap ms-auto">
                            {new Date(post.createAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMorePosts && (
                    <div className="col-span-3 text-center mt-4">
                      <Button
                        variant="outline"
                        onClick={handleLoadMorePosts}
                        disabled={isLoading}
                        className="px-4 py-1.5 my-6 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        {isLoading?"Loading":"Load more"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {isLoading&&!posts && (
                <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Spinner className="h-5 w-5 animate-spin" />
                    <p className="text-sm font-medium">Loading...</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="flex-1 overflow-hidden">
            <div className="h-full pr-2">
              {accounts.length === 0 && !isLoading ? (
                <div>
                  <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10 mb-9">
                    No accounts available
                  </p>
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm">
                    <p className="text-left text-zinc-900 dark:text-zinc-100 text-base font-semibold mb-4">
                      You might like
                    </p>
                    <div className="space-y-3">
                      {topSearch.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                          onClick={() => {
                            setSearchInput(item.keyword);
                            setSuggestions([]);
                            setSearchSugges(item.keyword);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              ●
                            </span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-xs">
                              {item.keyword}
                            </span>
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[30px] text-right">
                            ( {item.count} )
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                        disabled={
                          isLoading || acc.userCode === acc.userCurrentCode
                        }
                      >
                        {acc.userCode === acc.userCurrentCode
                          ? "You"
                          : acc.isFollowed
                          ? "Đang theo dõi"
                          : "Theo dõi"}
                      </Button>
                    </div>
                  ))}
                  {hasMoreAccounts && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreAccounts}
                        disabled={isLoading}
                        className="px-4 py-1.5 my-6 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                         {isLoading?"Loading":"Load more"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {isLoading&&!accounts && (
                <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Spinner className="h-5 w-5 animate-spin" />
                    <p className="text-sm font-medium">Loading...</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-h-screen">
            <button
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-zinc-200 text-zinc-600 rounded-full hover:bg-zinc-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
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
