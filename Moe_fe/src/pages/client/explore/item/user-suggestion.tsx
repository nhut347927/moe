"use client"

import { useState } from "react"
import { Plus, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserSuggestionProps {
  name: string
  followers: string
  imageUrl: string
}

export function UserSuggestion({ name, followers, imageUrl }: UserSuggestionProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
   <Card className="group min-w-[180px] overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-neutral-900">
  <CardContent className="p-5">
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-3 h-48 w-48 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-300  group-hover:scale-105">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{followers} người theo dõi</p>

      <Button
        onClick={() => setIsFollowing(!isFollowing)}
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        className={`mt-3 w-full font-medium transition-all ${
          isFollowing
            ? "border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            : "bg-black text-white hover:bg-black/80"
        }`}
      >
        {isFollowing ? (
          <>
            <Check className="mr-1 h-3 w-3" />
            Đang theo dõi
          </>
        ) : (
          <>
            <Plus className="mr-1 h-3 w-3" />
            Theo dõi
          </>
        )}
      </Button>
    </div>
  </CardContent>
</Card>

  )
}
