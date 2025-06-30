"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface BannerSlide {
  id: number
  title: string
  description: string
  imageUrl: string
  songs: number
  duration: string
}

const bannerData: BannerSlide[] = [
  {
    id: 1,
    title: "Top Hits Việt Nam",
    description: "Những bản hit Vpop đang thịnh hành nhất hiện nay, cập nhật hàng tuần.",
    imageUrl: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    songs: 50,
    duration: "3 giờ 25 phút",
  },
  {
    id: 2,
    title: "Chill & Relax",
    description: "Thư giãn với những giai điệu nhẹ nhàng, sâu lắng cho những phút giây nghỉ ngơi.",
    imageUrl: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    songs: 40,
    duration: "2 giờ 50 phút",
  },
  {
    id: 3,
    title: "Workout Motivation",
    description: "Năng lượng tràn đầy cho buổi tập của bạn với những bản nhạc sôi động.",
    imageUrl: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    songs: 35,
    duration: "2 giờ 15 phút",
  },
]

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1))
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, currentSlide])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <div
      className="relative h-[400px] w-full overflow-hidden rounded-3xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out "
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((slide) => (
          <div key={slide.id} className="relative h-full w-full flex-shrink-0 ">
            <img
              src={slide.imageUrl || "/placeholder.svg"}
              alt={slide.title}
            
              className="object-cover "
              
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{slide.title}</h2>
                <p className="mt-2 text-white/90 md:text-lg">{slide.description}</p>
                <div className="mt-3 flex items-center text-sm text-white/70">
                  <span>{slide.songs} bài hát</span>
                  <span className="mx-2">•</span>
                  <span>{slide.duration}</span>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Button className="bg-white text-black hover:bg-white/90">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Phát
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/40"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
