"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Trash } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // TODO: fetch from API
        setEvents([{ id: "1", name: "Sample", clubName: "Bhopal", highlighted: false }])
      } catch (e) { setError(e) } finally { setLoading(false) }
    }
    fetchEvents()
  }, [])

  const handleToggleHighlight = async (event: any) => {
    try {
      const updated = { ...event, highlighted: !event.highlighted }
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    //   toast({ title: "Highlight Status Updated", description: `Event ${updated.highlighted ? "highlighted" : "unhighlighted"} successfully.` })
    } catch (e) { setError(e); console.error(e) }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    try {
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)
    //   toast({ title: "Deleted", description: "Event deleted." })
    } catch (e) { 
        console.error(e); 
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
            <Link href="/superadmin/events/add"><Plus className="mr-2 h-4 w-4"/>Add Event</Link>
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
                      <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4"/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href={`/superadmin/events/${event.id}`}>View Details</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleHighlight(event)}>{event.highlighted ? "Remove Highlight" : "Highlight Event"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setSelectedEvent(event); setIsDeleteDialogOpen(true) }}><Trash className="mr-2 h-4 w-4"/>Delete Event</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
