"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventCarousel({ events }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)

  const totalEvents = events.length

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalEvents)
  }

  const goToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalEvents) % totalEvents)
  }

  const goToSlide = (index) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(index)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [currentIndex])

  // Auto-sliding functionality
  useEffect(() => {
    autoPlayRef.current = () => {
      if (!isPaused) {
        goToNext()
      }
    }
  }, [isPaused, goToNext])

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        autoPlayRef.current()
      }
    }, 5000) // Change slides every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Pause auto-sliding on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  if (events.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-muted h-[400px] flex items-center justify-center ">
        <p className="text-muted-foreground">No highlighted events available</p>
      </div>
    )
  }

  const currentEvent = events[currentIndex]

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={carouselRef} className="relative rounded-lg overflow-hidden transition-all duration-500">
        <Image
          src={currentEvent.image || "/placeholder.svg"}
          alt={currentEvent.title}
          width={1000}
          height={400}
          className="w-full h-[400px] object-cover transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="p-8">
            <div className="bg-white/90 rounded-lg p-4 max-w-[300px]">
              <h2 className="text-4xl font-bold">{currentEvent.attendees || 0}+</h2>
              <p className="text-xs mt-1">{currentEvent.description.substring(0, 100)}...</p>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/90 rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{currentEvent.speakers.length}</div>
                <div className="text-xs">Speakers</div>
              </div>
              <div className="bg-white/90 rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{currentEvent.maxCapacity}</div>
                <div className="text-xs">Capacity</div>
              </div>
              <div className="bg-white/90 rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{currentEvent.categories?.length || 0}</div>
                <div className="text-xs">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex -space-x-2">
          {currentEvent.speakers.slice(0, 3).map((speaker, index) => (
            <Image
              key={speaker.id}
              src={speaker.image || "/placeholder.svg"}
              alt={speaker.name}
              width={50}
              height={50}
              className="rounded-full border-2 border-background"
            />
          ))}
          {currentEvent.speakers.length > 3 && (
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-background bg-primary text-primary-foreground">
              <span className="text-xs font-medium">+{currentEvent.speakers.length - 3}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={goToPrev}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex gap-1">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-primary" : "bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}