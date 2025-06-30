import {
  ChevronDown,
  Copy,
  Ellipsis,
  Heart,
  Send,
  Smile,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Post, commonEmojis } from "../types";
import { getTimeAgo } from "@/common/utils/utils";
import { ActionMenuItem } from "@/components/dialog/action-menu-item";
import ActionMenuDialog from "@/components/dialog/action-menu-dialog";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PostCommentsProps {
  post: Post;
  newComment: string;
  setNewComment: (value: string) => void;
  replyTarget: { commentCode: string; displayName: string } | null;
  setReplyTarget: (
    value: { commentCode: string; displayName: string } | null
  ) => void;
  activePostId: string;
  setActivePostId: (value: string) => void;
  visibleReplies: { [key: string]: boolean };
  loadingReplies: { [key: string]: boolean };
  hasMoreReplies: { [key: string]: boolean };
  hasMoreComments: boolean;
  toggleReplies: (commentCode: string) => void;
  handleLoadMoreComments: () => void;
  handleLoadMoreReplies: (commentCode: string) => void;
  handleSendComment: () => void;
  handleLikeOrUnlike: (code: string) => void;
  handleDeleteComment?: (code: string) => void;
  isFullscreen: boolean;
}

const PostComments = ({
  post,
  newComment,
  setNewComment,
  replyTarget,
  setReplyTarget,
  activePostId,
  setActivePostId,
  visibleReplies,
  loadingReplies,
  hasMoreReplies,
  hasMoreComments,
  toggleReplies,
  handleLoadMoreComments,
  handleLoadMoreReplies,
  handleSendComment,
  handleLikeOrUnlike,
  handleDeleteComment,
  isFullscreen,
}: PostCommentsProps) => {
  return (
    <div className="p-3 space-y-6 pb-32">
      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
        <p className="text-sm font-medium">
          View {post.comments?.length} comments
        </p>
        <ChevronDown className="h-5 w-5 mt-1 animate-bounce" />
      </div>

      <div className="pt-10 mt-10 border-t">
        <h3 className="font-medium mb-6">Comments ({post.comments?.length})</h3>

        <div className="space-y-6">
          {post.comments?.length > 0 ? (
            post.comments?.map((comment) => (
              <div key={comment.commentCode} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${comment.userAvatar}`}
                    />
                    <AvatarFallback>{comment.displayName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <Link
                      to={`/client/profile?code=${comment.userCommentCode}`}
                    >
                      <span className="text-sm font-medium text-black dark:text-white">
                        {comment.displayName}
                      </span>
                    </Link>
                    {comment.userCommentCode === post.userCode && (
                      <span className="ml-2 px-2 py-0.5 text-[11px] text-black bg-zinc-300 rounded-full">
                        author
                      </span>
                    )}
                    <p className="text-sm text-black/90 dark:text-zinc-300 mt-0.5 break-all">
                      {comment.content}
                    </p>

                    <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1">
                      <div className="space-x-3 flex items-center">
                        <span>{getTimeAgo(comment.createdAt)}</span>
                        <button
                          onClick={() =>
                            setReplyTarget({
                              commentCode: comment.commentCode,
                              displayName: comment.displayName,
                            })
                          }
                          className="hover:underline"
                        >
                          Reply
                        </button>
                        <ActionMenuDialog
                          title="Options"
                          trigger={
                            <button className="rounded-full hover:bg-muted transition">
                              <Ellipsis className="w-4 h-4 text-muted-foreground" />
                            </button>
                          }
                          className="rounded-3xl"
                        >
                          {/* Nút sao chép */}
                          <ActionMenuItem
                            icon={
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            }
                            className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(
                                  comment.content || "Content to be copied"
                                )
                                .then(() => {
                                  alert("Content copied to clipboard!");
                                })
                                .catch(() => {
                                  alert("Failed to copy content.");
                                });
                            }}
                          >
                            Copy
                          </ActionMenuItem>

                          {comment.userCommentCode ===
                            comment.userCurrentCode && (
                            <DeleteConfirmationDialog
                              itemName="this comment"
                              onConfirm={() => {
                                handleDeleteComment?.(comment.commentCode);
                              }}
                              trigger={
                                <ActionMenuItem
                                  icon={
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  }
                                  variant="destructive"
                                  className="justify-start text-sm px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  Delete
                                </ActionMenuItem>
                              }
                            />
                          )}
                        </ActionMenuDialog>
                      </div>

                      <div className="flex items-center me-2 gap-1 text-xs text-muted-foreground">
                        {!comment?.liked ? (
                          <Heart
                            onClick={() =>
                              handleLikeOrUnlike(comment.commentCode)
                            }
                            className="h-4 w-4 cursor-pointer"
                          />
                        ) : (
                          <Heart
                            onClick={() =>
                              handleLikeOrUnlike(comment.commentCode)
                            }
                            className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer"
                          />
                        )}
                        {comment.likeCount}
                      </div>
                    </div>

                    {parseInt(comment.replyCount) > 0 &&
                      !visibleReplies[comment.commentCode] && (
                        <div className="mt-2">
                          <button
                            className="flex text-sm text-muted-foreground hover:underline"
                            onClick={() => toggleReplies(comment.commentCode)}
                          >
                            ——View {comment.replyCount} replies{" "}
                            <ChevronDown className="h-4 w-4 ms-1 mt-0.5" />
                          </button>
                        </div>
                      )}

                    {visibleReplies[comment.commentCode] && (
                      <div className="mt-3 space-y-3 border-l border-gray-300 ps-4">
                        {loadingReplies[comment.commentCode] ? (
                          <p className="text-sm text-muted-foreground italic ">
                            Loading replies...
                          </p>
                        ) : (
                          comment?.replies?.map((reply) => (
                            <div key={reply.commentCode}>
                              <div className="flex gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage
                                    src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${reply.userAvatar}`}
                                  />
                                  <AvatarFallback>
                                    {reply.displayName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Link
                                    to={`/client/profile?code=${reply.userCommentCode}`}
                                  >
                                    <span className="font-medium text-black dark:text-white">
                                      {reply.displayName}
                                    </span>
                                  </Link>
                                  {reply.userCommentCode === post.userCode && (
                                    <span className="ml-2 px-2 py-0.5 text-[11px] text-black bg-zinc-300 rounded-full">
                                      author
                                    </span>
                                  )}
                                  <p className="text-sm text-black/90 mt-0.5 dark:text-zinc-300 break-all">
                                    {reply.content}
                                  </p>

                                  <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1">
                                    <div className="space-x-3 flex items-center">
                                      <span>{getTimeAgo(reply.createdAt)}</span>
                                      <ActionMenuDialog
                                        title="Options"
                                        trigger={
                                          <button className="rounded-full hover:bg-muted transition">
                                            <Ellipsis className="w-4 h-4 text-muted-foreground" />
                                          </button>
                                        }
                                        className="rounded-3xl"
                                      >
                                        {/* Nút sao chép */}
                                        <ActionMenuItem
                                          icon={
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                          }
                                          className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                                          onClick={() => {
                                            navigator.clipboard
                                              .writeText(
                                                reply.content ||
                                                  "Content to be copied"
                                              )
                                              .then(() => {
                                                alert(
                                                  "Content copied to clipboard!"
                                                );
                                              })
                                              .catch(() => {
                                                alert(
                                                  "Failed to copy content."
                                                );
                                              });
                                          }}
                                        >
                                          Copy
                                        </ActionMenuItem>

                                        {reply.userCommentCode ===
                                          reply.userCurrentCode && (
                                          <DeleteConfirmationDialog
                                            itemName="this reply"
                                            onConfirm={() => {
                                              handleDeleteComment?.(
                                                reply.commentCode
                                              );
                                            }}
                                            trigger={
                                              <ActionMenuItem
                                                icon={
                                                  <Trash2 className="h-4 w-4 text-destructive" />
                                                }
                                                variant="destructive"
                                                className="justify-start text-sm px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                              >
                                                Delete
                                              </ActionMenuItem>
                                            }
                                          />
                                        )}
                                      </ActionMenuDialog>
                                    </div>
                                    <span className="flex items-center me-2 gap-1">
                                      {!reply?.liked ? (
                                        <Heart
                                          onClick={() =>
                                            handleLikeOrUnlike(
                                              reply.commentCode
                                            )
                                          }
                                          className="h-4 w-4 cursor-pointer"
                                        />
                                      ) : (
                                        <Heart
                                          onClick={() =>
                                            handleLikeOrUnlike(
                                              reply.commentCode
                                            )
                                          }
                                          className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer"
                                        />
                                      )}
                                      {reply.likeCount}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}

                        {visibleReplies[comment.commentCode] &&
                          hasMoreReplies[comment.commentCode] && (
                            <div className="text-center mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full cursor-pointer text-muted-foreground"
                                onClick={() =>
                                  handleLoadMoreReplies(comment.commentCode)
                                }
                                disabled={loadingReplies[comment.commentCode]}
                              >
                                {loadingReplies[comment.commentCode]
                                  ? "Loading..."
                                  : "Load more replies"}
                              </Button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {post.comments?.length > 0 && (
          <div className="text-center mt-6">
            {hasMoreComments ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full cursor-pointer"
                onClick={handleLoadMoreComments}
              >
                Load more comments
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No more comments.
              </p>
            )}
          </div>
        )}

        <div
          className={`w-full transition-all duration-500 ease-in-out mt-8 sticky bottom-0 ${
            isFullscreen
              ? "pb-4"
              : "pb-[5px] sm:pb-[env(safe-area-inset-bottom)]"
          } backdrop-blur-sm pt-4 pb-2 border-t`}
        >
          {replyTarget && (
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              Replying to:{" "}
              <span className="font-medium">@{replyTarget.displayName}</span>
              <button
                onClick={() => setReplyTarget(null)}
                className="text-red-500 hover:underline ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-2 items-center pb-11">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="grid grid-cols-5 gap-2">
                  {commonEmojis.map((emoji, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="h-9 w-9 p-0 text-lg"
                      onClick={() => setNewComment(newComment + emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Input
              placeholder={
                replyTarget
                  ? `Reply to @${replyTarget.displayName}...`
                  : "Add a comment..."
              }
              value={activePostId === post.postId ? newComment : ""}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setActivePostId(post.postId)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />

            <Button
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              className="px-4 bg-zinc-50 rounded-3xl"
            >
              <Send className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
