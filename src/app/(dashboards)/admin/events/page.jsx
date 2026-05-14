"use client";

import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronDown, Filter, MapPin, MoreHorizontal, Plus, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents("1");
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events when search term changes
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id);

      // Update local state
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setFilteredEvents(filteredEvents.filter((e) => e.id !== selectedEvent.id));

      setIsDeleteDialogOpen(false);

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  return (
     <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage your club events, workshops, and competitions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/events/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilteredEvents(events)}>All Events</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilteredEvents(events.filter((e) => isUpcoming(e.date)))}>
                    Upcoming Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilteredEvents(events.filter((e) => e.highlighted))}>
                    Highlighted Events
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList className="ml-auto">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="h-40 bg-muted/40"></CardHeader>
                      <CardContent className="h-24 mt-4 space-y-2">
                        <div className="h-4 bg-muted/60 rounded w-1/2"></div>
                        <div className="h-4 bg-muted/60 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No events found.</p>
                  <Button asChild>
                    <Link href="/admin/events/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="flex flex-col overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={
                              event.image ||
                              `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(event.title)}`
                            }
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {event.highlighted && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500">
                              <Star className="mr-1 h-3 w-3" />
                              Highlighted
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          {event.formattedDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.categories &&
                            event.categories.slice(0, 3).map((category, i) => (
                              <Badge variant="outline" key={i}>
                                {category}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2 mt-auto">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/edit`}>Edit Event</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="grid grid-cols-4 font-medium">
                        <div>Event</div>
                        <div>Date & Time</div>
                        <div>Location</div>
                        <div>Attendees</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className="grid grid-cols-4 p-4">
                          <div className="font-medium flex items-center">
                            {event.highlighted && <Star className="mr-1 h-4 w-4 text-yellow-500" />}
                            {event.title}
                          </div>
                          <div>
                            {event.formattedDate}, {event.time}
                          </div>
                          <div>{event.location}</div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {event.attendees}/{event.maxCapacity}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/events/${event.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/events/${event.id}/edit`}>Edit Event</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  Delete Event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    /</>
  );
}