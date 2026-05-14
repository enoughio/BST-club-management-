"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Clock, Globe, Loader2, MapPin, Star, Trash } from "lucide-react"
import Link from "next/link"
import { getEvent, highlightEvent, deleteEvent, getClubs } from "@/lib/api"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState(null)
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEvent(params.id)
        const clubsData = await getClubs()

        setEvent(eventData)
        setClubs(clubsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "There was a problem loading the event details.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleDelete = async () => {
    setIsProcessing(true)

    try {
      await deleteEvent(event.id)

      setIsDeleteDialogOpen(false)
      router.push("/superadmin/events")

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleHighlight = async () => {
    setIsProcessing(true)

    try {
      await highlightEvent(event.id, !event.highlighted)

      setEvent({
        ...event,
        highlighted: !event.highlighted,
      })

      toast({
        title: event.highlighted ? "Event Unhighlighted" : "Event Highlighted",
        description: `The event has been ${event.highlighted ? "removed from" : "added to"} highlighted events.`,
      })
    } catch (error) {
      console.error("Error toggling highlight:", error)
      toast({
        title: "Error",
        description: "Failed to update event highlight status.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getClubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId)
    return club ? club.name : clubId
  }

  if (loading) {
    return (
      // <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      // </AdminLayout>
    )
  }

  if (!event) {
    return (
      // <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/superadmin/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      // </AdminLayout>
    )
  }

  return (
     <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/superadmin/events">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{event.title}</h1>
              <div className="flex items-center text-gray-500">
                <span>{event.formattedDate}</span>
                <span className="mx-2">•</span>
                <span>{getClubName(event.club)}</span>
                {event.highlighted && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              variant={event.highlighted ? "outline" : "default"}
              onClick={handleToggleHighlight}
              disabled={isProcessing}
              className={
                event.highlighted
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }
            >
              <Star className="mr-2 h-4 w-4" />
              {event.highlighted ? "Remove Highlight" : "Highlight Event"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Information about this event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={event.image || `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(event.title)}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      Date
                    </div>
                    <p className="font-medium text-gray-900">{event.formattedDate}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      Time
                    </div>
                    <p className="font-medium text-gray-900">{event.time}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      Location
                    </div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="mr-1 h-4 w-4" />
                      Organized by
                    </div>
                    <p className="font-medium text-gray-900">{getClubName(event.club)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.categories &&
                      event.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="border-gray-200 text-gray-700">
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Attendance:</span>
                  <span className="font-medium">
                    {event.attendees}/{event.maxCapacity}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ticket Price:</span>
                  <span className="font-medium">{event.ticketPrice || "Free"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  <Badge
                    className={
                      new Date(event.date) > new Date() ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href={`/events/${event.slug}`} target="_blank">
                    <Globe className="mr-2 h-4 w-4" />
                    View Public Page
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={handleToggleHighlight}
                  disabled={isProcessing}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {event.highlighted ? "Remove Highlight" : "Highlight Event"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-500">
                {event.formattedDate} • {event.time}
              </p>
              <p className="text-sm text-gray-500">{getClubName(event.club)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

