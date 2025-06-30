
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"


interface CategoryCardProps {
  title: string
  imageUrl: string
}

export function CategoryCard({ title, imageUrl }: CategoryCardProps) {
  return (
    <Link to="#" className="block">
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square w-full max-h-[250px] overflow-hidden">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                width={150}
                height={150}
                className="h-full w-full object-cover brightness-75 transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-center text-lg font-bold text-white">{title}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
