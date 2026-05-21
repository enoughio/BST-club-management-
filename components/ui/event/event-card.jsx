import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin } from "lucide-react"

export default function EventCard({ image, title, description, href, date, location }) {
  return (
    <div className="group overflow-hidden rounded-lg bg-blue-50">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{location}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-4 flex justify-end">
          <Link href={href} className="inline-flex items-center text-primary hover:underline">
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

