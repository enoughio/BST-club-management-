"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getClubs, getRequests, getEvents } from "@/lib/api"
import { AlertTriangle, Building, Calendar, Flag, Star, Users } from "lucide-react"
import Link from "next/link"
type Club = {
  id: string
  name?: string
  city?: string
  Admin?: string
  members?: number
}

type RequestItem = {
  id: string
  type: string
  club?: string
  requestedDate: string
  status: string
}

type EventItem = {
  id: string
  title?: string
  highlighted?: boolean
  formattedDate?: string
  location?: string
  club?: string
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalMembers: 0,
    pendingRequests: 0,
    totalEvents: 0,
    highlightedEvents: 0,
  })

  const [clubs, setClubs] = useState<Club[]>([])
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsData = await getClubs()
        const requestsData = await getRequests()
        const eventsData = await getEvents()

        setClubs(clubsData)
        setRequests(requestsData)
        setEvents(eventsData)

        const pendingRequests = requestsData.filter((request: RequestItem) => request.status === "Pending")
        const highlightedEvents = eventsData.filter((event: EventItem) => event.highlighted)

        const totalMembers = clubsData.reduce((acc: number, club: Club) => {
          return acc + (club.members || 0)
        }, 0)

        setStats({
          totalClubs: clubsData.length,
          totalMembers,
          pendingRequests: pendingRequests.length,
          totalEvents: eventsData.length,
          highlightedEvents: highlightedEvents.length,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    // <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Super Admin dashboard for managing all clubs and events.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/40"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClubs}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active clubs in the system</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMembers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all clubs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting your approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Scheduled across all clubs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Highlighted Events</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.highlightedEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Featured on the platform</p>
                </CardContent>
              </Card>
            </div>

            {stats.pendingRequests > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  {stats.pendingRequests} request(s) from club admins are awaiting your approval.{" "}
                  <Link href="/superadmin/requests" className="font-medium underline underline-offset-4">
                    View Requests
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="clubs" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="clubs">Clubs</TabsTrigger>
                <TabsTrigger value="requests">Recent Requests</TabsTrigger>
                <TabsTrigger value="events">Highlighted Events</TabsTrigger>
              </TabsList>

              <TabsContent value="clubs" className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="grid grid-cols-4 font-medium">
                      <div>Club Name</div>
                      <div>City</div>
                      <div>Admin</div>
                      <div>Members</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {clubs.map((club) => (
                      <div key={club.id} className="grid grid-cols-4 p-4">
                        <div className="font-medium">{club.name}</div>
                        <div>{club.city}</div>
                        <div>{club.Admin}</div>
                        <div>{club.members}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/superadmin/clubs">View All Clubs</Link>
                </Button>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="grid grid-cols-4 font-medium">
                      <div>Request Type</div>
                      <div>Club</div>
                      <div>Date</div>
                      <div>Status</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {requests.slice(0, 5).map((request) => {
                      const club = clubs.find((c) => c.id === request.club)
                      return (
                        <div key={request.id} className="grid grid-cols-4 p-4">
                          <div className="font-medium">{request.type}</div>
                          <div>{club ? club.name : request.club}</div>
                          <div>{new Date(request.requestedDate).toLocaleDateString()}</div>
                          <div>{request.status}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/superadmin/requests">View All Requests</Link>
                </Button>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="grid grid-cols-4 font-medium">
                      <div>Event Title</div>
                      <div>Date</div>
                      <div>Location</div>
                      <div>Club</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {events
                      .filter((event) => event.highlighted)
                      .map((event) => {
                        const club = clubs.find((c) => c.id === event.club)
                        return (
                          <div key={event.id} className="grid grid-cols-4 p-4">
                            <div className="font-medium">{event.title}</div>
                            <div>{event.formattedDate}</div>
                            <div>{event.location}</div>
                            <div>{club ? club.name : event.club}</div>
                          </div>
                        )
                      })}
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/superadmin/events">View All Events</Link>
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    // </AdminLayout>
  )
}

