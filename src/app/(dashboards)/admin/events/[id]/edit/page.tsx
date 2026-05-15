"use client"

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { getEvent, updateEvent } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Loader2, Save, Star, Users } from "lucide-react"
import Link from "next/link"

type EventModel = {
  id: string
  title: string
  date?: string
  formattedDate?: string
  time?: string
  location?: string
  description?: string
  maxCapacity?: number | string
  ticketPrice?: string
  categories?: string[]
  highlighted?: boolean
  attendees?: number
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<EventModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(params.id)
        setEvent(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching event:", error)
        // toast({ title: "Error", description: "Failed to load event details", variant: "destructive" })
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const date = new Date(value)
    const formattedDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)

    setEvent((prev) => (prev ? { ...prev, [name]: value, formattedDate } : prev))
  }

  const handleCheckboxChange = (name: keyof EventModel, checked: boolean) => {
    setEvent((prev) => (prev ? { ...prev, [name]: checked } : prev))
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const categories = value.split(",").map((cat) => cat.trim()).filter(Boolean)
    setEvent((prev) => (prev ? { ...prev, categories } : prev))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!event) return
    setIsSaving(true)

    try {
      await updateEvent(event.id, event)
      // toast({ title: "Event Updated", description: "The event has been successfully updated." })
      // router.push("/admin/events")
    } catch (error) {
      console.error("Error updating event:", error)
      // toast({ title: "Error", description: "Failed to update event. Please try again.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/events"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Event</h1>
            <p className="text-gray-500">Update the details of your event</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>Basic details about the event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" name="title" value={event?.title || ""} onChange={handleChange} required />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={event?.date || ""} onChange={handleDateChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input id="time" name="time" value={event?.time || ""} onChange={handleChange} placeholder="e.g., 6:00 PM - 9:00 PM" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" value={event?.location || ""} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" value={event?.description || ""} onChange={handleChange} rows={5} required />
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
                <Input id="maxCapacity" name="maxCapacity" type="number" value={String(event?.maxCapacity || "") } onChange={handleChange} min={1} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price</Label>
                <Input id="ticketPrice" name="ticketPrice" value={event?.ticketPrice || ""} onChange={handleChange} placeholder="e.g., ₹500-1500 or Free" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input id="categories" name="categories" value={event?.categories ? event.categories.join(", ") : ""} onChange={handleCategoryChange} placeholder="e.g., Workshop, Leadership, Competition" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="highlighted" checked={Boolean(event?.highlighted)} onCheckedChange={(checked) => handleCheckboxChange("highlighted", Boolean(checked))} />
              <Label htmlFor="highlighted" className="flex items-center gap-1.5 font-normal text-sm text-gray-700 cursor-pointer"><Star className="h-4 w-4 text-yellow-500" />Highlight this event (featured)</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Created: {new Date().toLocaleDateString()}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-1" />Attendees: {event?.attendees || 0}</div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/events")} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
