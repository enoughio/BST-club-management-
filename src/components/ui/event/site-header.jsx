import Link from "next/link"
import Image from "next/image"

export default function SiteHeader() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/placeholder.svg?height=40&width=40" alt="Bharat Storytellers Logo" width={40} height={40} />
          <div className="flex flex-col">
            <span className="text-lg font-bold">BHARAT</span>
            <span className="text-xs">STORYTELLERS</span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium">
            Contact
          </Link>
          <Link href="/events" className="text-sm font-medium">
            Event
          </Link>
          <Link href="/members" className="text-sm font-medium">
            Member
          </Link>
          <Link href="/resources" className="text-sm font-medium">
            Resources
          </Link>
        </nav>
        <div className="flex items-center">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  )
}

