import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BannerCarousel } from "./item/banner-carousel";
import { PlaylistCard } from "./item/playlist-card";
import { CategoryCard } from "./item/category-card";
import { UserSuggestion } from "./item/user-suggestion";
import { PlaylistCardFeatured } from "./item/playlist-card-featured";

export default function ExplorePage() {
  return (
     <div className="flex h-screen max-h-screen p-2">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-y-auto overflow-x-hidden p-4 px-14">
  
        <div className="mx-auto">
          <div className="mb-8">
            <BannerCarousel />
          </div>

          <div className="space-y-8 py-6">
            {/* Featured Playlist */}
            <Section title="Playlist Nổi Bật" link="#">
              <PlaylistCardFeatured
                playlist={{
                  cover: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
                  title: "Featured Playlist",
                  featured: true,
                  tracks: 10,
                  author: "Author Name",
                  authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
                  lastUpdated: "2024-04-01",
                  color: "#FF5733",
                  plays: 1000,
                  description: "This is a featured playlist description.",
                  tags: ["tag1", "tag2"],
                  duration: "1h 30m",
                  followers: 500,
                }}
              />
            </Section>

            {/* For You */}
            <Section title="Dành Cho Bạn" link="#">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {[
                    {
                      title: "Nhạc Trẻ Gây Nghiện",
                      description: "Những bản hit Vpop hay nhất hiện nay",
                      totalSongs: 25,
                    },
                    {
                      title: "Lofi Chill",
                      description: "Thư giãn với những giai điệu lofi",
                      totalSongs: 18,
                    },
                    {
                      title: "Acoustic Covers",
                      description: "Những bản cover acoustic hay nhất",
                      totalSongs: 32,
                    },
                    {
                      title: "Workout Motivation",
                      description: "Năng lượng cho buổi tập của bạn",
                      totalSongs: 40,
                    },
                  ].map((item, index) => (
                    <div key={index} className="min-w-[200px] flex-shrink-0">
                      <PlaylistCard
                        {...item}
                        imageUrl="https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Section>

            {/* Mood & Genre */}
            <Section title="Tâm Trạng & Thể Loại" link="#">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {[
                    "Tâm Trạng Chill",
                    "Tập Trung Làm Việc",
                    "Năng Lượng Tích Cực",
                    "Thư Giãn",
                  ].map((title, index) => (
                    <div key={index} className="min-w-[160px] flex-shrink-0">
                      <CategoryCard
                        title={title}
                        imageUrl="https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Section>

            {/* Suggested Artists */}
            <Section title="Nghệ Sĩ Gợi Ý" link="#">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {[
                    { name: "Sơn Tùng MTP", followers: "2.5M" },
                    { name: "Hoàng Thùy Linh", followers: "1.8M" },
                    { name: "Đen Vâu", followers: "3.2M" },
                    { name: "Bích Phương", followers: "1.2M" },
                    { name: "Vũ", followers: "950K" },
                  ].map((artist, index) => (
                    <div key={index} className="min-w-[140px] flex-shrink-0">
                      <UserSuggestion
                        {...artist}
                        imageUrl="https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Section>

            {/* New Releases */}
            <Section title="Mới Phát Hành" link="#">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {[
                    {
                      title: "Nhạc Mới Tháng 4/2024",
                      description: "Cập nhật những bản hit mới nhất",
                      totalSongs: 30,
                    },
                    {
                      title: "Fresh Finds",
                      description: "Khám phá những nghệ sĩ mới nổi",
                      totalSongs: 25,
                    },
                    {
                      title: "New Music Friday",
                      description: "Nhạc mới phát hành mỗi thứ Sáu",
                      totalSongs: 20,
                    },
                  ].map((item, index) => (
                    <div key={index} className="min-w-[200px] flex-shrink-0">
                      <PlaylistCard
                        {...item}
                        imageUrl="https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Section>

            {/* Featured Podcasts */}
            <Section title="Podcast Nổi Bật" link="#">
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {[
                    {
                      title: "Gánh Team Radio",
                      description: "Podcast về công nghệ và cuộc sống",
                      totalSongs: 45,
                    },
                    {
                      title: "Have A Sip",
                      description: "Tâm sự và chia sẻ về cuộc sống",
                      totalSongs: 32,
                    },
                    {
                      title: "The Present Writer",
                      description: "Podcast về viết lách và sáng tạo",
                      totalSongs: 28,
                    },
                    {
                      title: "Hieu.TV",
                      description: "Phỏng vấn những người thành công",
                      totalSongs: 50,
                    },
                  ].map((item, index) => (
                    <div key={index} className="min-w-[200px] flex-shrink-0">
                      <PlaylistCard
                        {...item}
                        imageUrl="https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png"
                        isPodcast
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Section Component
function Section({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <Link to={link} className="flex items-center text-sm font-medium text-black">
          Xem tất cả
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}