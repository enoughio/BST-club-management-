"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast" 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/superadmin/events")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setEvents(data)
      } catch (e) {
        setError(e)
        console.error("Could not fetch events:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleToggleHighlight = async (event) => {
    try {
      const response = await fetch(`/api/superadmin/events/${event.id}/highlight`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ highlighted: !event.highlighted }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedEvent = await response.json()

      setEvents((prevEvents) => prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))

      toast({
        title: "Highlight Status Updated",
        description: `Event ${updatedEvent.highlighted ? "highlighted" : "unhighlighted"} successfully.`,
      })
    } catch (e) {
      setError(e)
      console.error("Could not toggle highlight:", e)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update highlight status.",
      })
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/superadmin/events/${selectedEvent.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)
      setSelectedEvent(null)

      toast({
        title: "Event Deleted",
        description: "Event deleted successfully.",
      })
    } catch (e) {
      setError(e)
      console.error("Could not delete event:", e)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event.",
      })
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Events</h1>
          <p className="text-gray-500">Manage events across all clubs in the organization.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/superadmin/events/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <Table>
          <TableCaption>A list of all events in the organization.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.id}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.clubName}</TableCell>
                <TableCell>{event.highlighted ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/superadmin/events/${event.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleHighlight(event)}>
                        {event.highlighted ? <>Remove Highlight</> : <>Highlight Event</>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

