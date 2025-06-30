// import { useState, useRef, useEffect } from "react";
// import PostMultiImg from "../home/item/Image";
// import Detail from "./homecopy/Detail";
// import PostVideo from "./home/Video";
// import ActionBar from "./homecopy/ActionBar";
// import { useToast } from "@/common/hooks/use-toast";
// import { getAxiosInstance } from "../../services/axios/axiosInstance";

// type Reply = {
//   commentId: string;
//   userAvatar: string;
//   content: string;
//   displayName: string;
//   createdAt: string;
// };
// type Comment = {
//   commentId: string;
//   userAvatar: string;
//   content: string;
//   displayName: string;
//   createdAt: string;
//   replies: Reply[];
// };

// type Post = {
//   userId: string;
//   postId: string;
//   createdAt: string;

//   userAvatar: string;
//   userDisplayName: string;

//   postType: "VIDEO" | "IMG";
//   videoUrl: string;
//   imageUrls: string[];
//   caption: string;

//   likeCount: string;
//   commentCount: string;
//   playlistCount: string;

//   audioUrl: string;
//   audioOwnerAvatar: string;
//   audioOwnerName: string;
//   audioId: string;

//   comments: Comment[];
// };

// // Dữ liệu mẫu
// const samplePostData: Post[] = [
//   {
//     userId: "user1",
//     postId: "post1",
//     createdAt: "2025-04-01T10:00:00Z",
//     userAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//     userDisplayName: "John Doe",
//     postType: "VIDEO",
//     videoUrl: "v1740748142/videos/ku2ammahemr2k4iiezza.mp4",
//     imageUrls: [],
//     caption: "A cool video post!",
//     likeCount: "120",
//     commentCount: "15",
//     playlistCount: "5",
//     audioUrl: "",
//     audioOwnerAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//     audioOwnerName: "Audio Creator",
//     audioId: "audio1",
//     comments: [
//       {
//         commentId: "cmt1",
//         userAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//         content: "Great video!",
//         displayName: "Jane Smith",
//         createdAt: "2025-04-01T10:05:00Z",
//         replies: [
//           {
//             commentId: "reply1",
//             userAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//             content: "Thanks!",
//             displayName: "John Doe",
//             createdAt: "2025-04-01T10:06:00Z",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     userId: "user2",
//     postId: "post2",
//     createdAt: "2025-04-02T15:00:00Z",
//     userAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//     userDisplayName: "Jane Smith",
//     postType: "IMG",
//     videoUrl: "",
//     imageUrls: [
//       "images/sikxb1qmpocwuwpbgapc",
//       "images/sikxb1qmpocwuwpbgapc",
//       "images/sikxb1qmpocwuwpbgapc",
//     ],
//     caption: "Some beautiful photos!",
//     likeCount: "85",
//     commentCount: "10",
//     playlistCount: "3",
//     audioUrl: "audios/t0m4l8rgcrrtbdbxnanp.mp3",
//     audioOwnerAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//     audioOwnerName: "Music Maker",
//     audioId: "audio2",
//     comments: [
//       {
//         commentId: "cmt2",
//         userAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
//         content: "Love these pics!",
//         displayName: "Alex Brown",
//         createdAt: "2025-04-02T15:10:00Z",
//         replies: [],
//       },
//     ],
//   },
// ];

// const Home = () => {
//   const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const currentIndex = useRef<number>(0);
//   const lastScrollTime = useRef<number>(0);
//   const [audioStates, setAudioStates] = useState<
//     Record<number, { isPlaying: boolean; isMuted: boolean }>
//   >({});
//   const [userInfoStates, setUserInfoStates] = useState<Record<number, boolean>>(
//     {}
//   );
//   const { toast } = useToast();
//   const axiosInstance = getAxiosInstance();
//   const [errorMessages, setErrorMessages] = useState<any>({});
//   const [postData, setPostData] = useState<Post[]>([]);

//   useEffect(() => {
//     // Comment lại phần gọi API
//     /*
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get("/post/get-post");
//         setPostData(response.data.data);
//       } catch (error: any) {
//         if (error.response && error.response.data) {
//           toast({
//             variant: "destructive",
//             description: error.response.data.message || "An error occurred!",
//           });
//           setErrorMessages(null);
//           const { errors } = error.response.data;
//           if (errors) {
//             setErrorMessages(errors);
//           }
//         }
//       }
//     };

//     fetchData();
//     */

//     // Sử dụng dữ liệu mẫu thay thế
//     setPostData(samplePostData);
//   }, []);

//   // Hàm toggle hiển thị Detail
//   const toggleUserInfo = (index: number) => {
//     setUserInfoStates((prevStates) => ({
//       ...prevStates,
//       [index]: !prevStates[index],
//     }));
//   };

//   useEffect(() => {
//     const handleScroll = (event: WheelEvent) => {
//       const videoContainer = document.getElementById("video-container");

//       if (
//         document.querySelector(".user-info")?.contains(event.target as Node)
//       ) {
//         return; // Không cuộn nếu đang hover vào user info
//       }

//       if (!videoContainer || !videoContainer.contains(event.target as Node))
//         return;

//       event.preventDefault();
//       const now = Date.now();
//       if (now - lastScrollTime.current < 300) return;

//       const delta = Math.sign(event.deltaY);
//       const newIndex = Math.min(
//         Math.max(currentIndex.current + delta, 0),
//         videoRefs.current.length - 1
//       );

//       if (newIndex !== currentIndex.current) {
//         currentIndex.current = newIndex;
//         const target = videoRefs.current[currentIndex.current];

//         if (target) {
//           target.scrollIntoView({ behavior: "smooth", block: "center" });
//           setAudioStates((prevStates) => {
//             const updatedStates = { ...prevStates };
//             Object.keys(updatedStates).forEach((key) => {
//               if (parseInt(key) !== currentIndex.current) {
//                 updatedStates[parseInt(key)] = {
//                   isPlaying: false,
//                   isMuted: true,
//                 };
//               }
//             });

//             updatedStates[currentIndex.current] = {
//               isPlaying: true,
//               isMuted: false,
//             };
//             return updatedStates;
//           });
//         }
//       }

//       lastScrollTime.current = now;
//     };

//     window.addEventListener("wheel", handleScroll, { passive: false });
//     return () => {
//       window.removeEventListener("wheel", handleScroll);
//     };
//   }, []);

//   return (
//     <div className="max-h-screen p-2">
//       <div
//         id="video-container"
//         className="h-full rounded-xl overflow-y-auto overflow-x-hidden scroll-but-hidden"
//       >
//         {postData.map((post, index) => (
//           <div
//             key={index}
//             className="w-full max-h-screen h-screen p-9 flex items-center justify-center"
//           >
//             <div className="flex h-full">
//               <div className="flex border rounded-3xl">
//                 <div
//                   ref={(el) => (videoRefs.current[index] = el)}
//                   className={`flex-1 min-w-[500px] border-e ${
//                     userInfoStates[index] ? "" : "rounded-3xl"
//                   }`}
//                 >
//                   {post.postType === "VIDEO" ? (
//                     <PostVideo
//                       videoSrc={post.videoUrl!}
//                       initialMuted={audioStates[index]?.isMuted ?? true}
//                       initialPlaying={audioStates[index]?.isPlaying ?? false}
//                     />
//                   ) : (
//                     <PostMultiImg
//                       images={post.imageUrls!}
//                       audioSrc={post.audioUrl!}
//                       initialMuted={audioStates[index]?.isMuted ?? true}
//                       initialPlaying={audioStates[index]?.isPlaying ?? false}
//                     />
//                   )}
//                 </div>
//                 <div
//                   className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                     userInfoStates[index]
//                       ? "w-[500px] translate-x-0"
//                       : "w-0 translate-x-full"
//                   }`}
//                 >
//                   <Detail postData={post} />
//                 </div>
//               </div>
//               <div className="ms-2 flex flex-col justify-end">
//                 <ActionBar toggleUserInfo={() => toggleUserInfo(index)} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;