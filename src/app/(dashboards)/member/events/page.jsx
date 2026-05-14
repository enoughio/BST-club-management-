"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin, Search, Star, Users } from "lucide-react"

// Mock API function to get meetings and events
const getMeetingsAndEvents = async() => {

  // try {
    
  //   const response = await fetch("/api/meetings", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch meetings")
  //   }

  //   const data = await response.json()
  //   return data

  // } catch (error) {
  //   console.error("Error fetching meetings and events:", error)
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        meetings: [
          {
            id: "1",
            title: "Weekly Club Meeting",
            date: "2023-11-22",
            time: "6:30 PM - 8:30 PM",
            location: "Main Club Room",
            description: "Regular weekly meeting with prepared speeches and evaluations",
            roles: [
              { role: "Toastmaster of the Evening", assignedTo: "2" },
              { role: "Timer", assignedTo: "3" },
              { role: "Ah Counter", assignedTo: "4" },
              { role: "Grammarian", assignedTo: null },
              { role: "Speaker 1", assignedTo: "3" },
              { role: "Speaker 2", assignedTo: "1" },
              { role: "Evaluator 1", assignedTo: "4" },
              { role: "Evaluator 2", assignedTo: null },
            ],
          },
          {
            id: "2",
            title: "Executive Committee Meeting",
            date: "2023-11-29",
            time: "5:30 PM - 6:30 PM",
            location: "Conference Room",
            description: "Monthly executive committee meeting to discuss club business",
            roles: [
              { role: "President", assignedTo: "2" },
              { role: "VP Education", assignedTo: "3" },
              { role: "VP Membership", assignedTo: "4" },
              { role: "Secretary", assignedTo: null },
            ],
          },
          {
            id: "3",
            title: "Workshop: Effective Evaluations",
            date: "2023-12-06",
            time: "6:30 PM - 8:30 PM",
            location: "Main Club Room",
            description: "Special workshop on how to give effective evaluations",
            roles: [
              { role: "Workshop Leader", assignedTo: "2" },
              { role: "Timer", assignedTo: "3" },
              { role: "Assistant", assignedTo: null },
            ],
          },
        ],
        events: [
          {
            id: "1",
            title: "Bhopal International Storytelling Fest",
            slug: "BISF",
            description:
              "Join us for an evening of captivating stories that bridge cultures and generations. Our expert storytellers will take you on a journey through time and tradition.",
            date: "2023-12-15",
            formattedDate: "December 15, 2023",
            time: "6:00 PM - 9:00 PM",
            location: "Cultural Center, New Delhi",
            image: "",
            highlighted: true,
            club: "1",
            attendees: 120,
            maxCapacity: 200,
            ticketPrice: "₹500-1500",
            categories: ["Cultural", "Performance", "Educational"],
          },
          {
            id: "2",
            title: "Leadership Workshop",
            slug: "leadership-workshop-2023",
            description:
              "An intensive workshop focusing on essential leadership skills for today's professionals. Learn how to inspire teams and navigate challenges effectively.",
            date: "2023-11-20",
            formattedDate: "November 20, 2023",
            time: "9:00 AM - 5:00 PM",
            location: "Conference Hall, Bangalore",
            image: "",
            highlighted: false,
            club: "2",
            attendees: 85,
            maxCapacity: 100,
            ticketPrice: "₹1000",
            categories: ["Workshop", "Professional Development", "Leadership"],
          },
          {
            id: "3",
            title: "Public Speaking Championship",
            slug: "speaking-championship-2024",
            description:
              "The annual competition where the best speakers compete for recognition and prizes. Categories include prepared speeches, impromptu speaking, and storytelling.",
            date: "2024-01-30",
            formattedDate: "January 30, 2024",
            time: "10:00 AM - 6:00 PM",
            location: "Auditorium, Mumbai",
            image: "",
            highlighted: true,
            club: "3",
            attendees: 0,
            maxCapacity: 300,
            ticketPrice: "₹750",
            categories: ["Competition", "Speaking", "Awards"],
          },
        ],
        currentUserId: "1",
      })
    }, 1000)
  })
}

export default function MemberEventsPage() {
  const [data, setData] = useState(null)
  const [filteredMeetings, setFilteredMeetings] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMeetingsAndEvents()
        setData(result)
        setFilteredMeetings(result.meetings)
        setFilteredEvents(result.events)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meetings and events:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()

        setFilteredMeetings(
          data.meetings.filter(
            (meeting) =>
              meeting.title.toLowerCase().includes(term) ||
              meeting.description.toLowerCase().includes(term) ||
              meeting.location.toLowerCase().includes(term),
          ),
        )

        setFilteredEvents(
          data.events.filter(
            (event) =>
              event.title.toLowerCase().includes(term) ||
              event.description.toLowerCase().includes(term) ||
              event.location.toLowerCase().includes(term),
          ),
        )
      } else {
        setFilteredMeetings(data.meetings)
        setFilteredEvents(data.events)
      }
    }
  }, [searchTerm, data])

  const isUpcoming = (date) => {
    return new Date(date) > new Date()
  }

  const getMyRole = (meeting) => {
    if (!data) return "None"

    const myRole = meeting.roles?.find((r) => r.assignedTo === data.currentUserId)
    return myRole ? myRole.role : "Attendee"
  }

  return (
   //  <MemberLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meetings & Events</h1>
          <p className="text-gray-500">View upcoming meetings and events for your club.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search meetings & events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 border-gray-200"
          />
        </div>

        <Tabs defaultValue="meetings" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="meetings">Club Meetings</TabsTrigger>
            <TabsTrigger value="events">Special Events</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings" className="space-y-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : filteredMeetings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="mb-4 text-center text-gray-500">No meetings found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredMeetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <CardTitle>{meeting.title}</CardTitle>
                          <CardDescription className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {new Date(meeting.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {meeting.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {meeting.location}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge className="self-start md:self-center bg-blue-100 text-blue-800">
                          Your Role: {getMyRole(meeting)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">{meeting.description}</p>

                        <div>
                          <h3 className="text-sm font-medium mb-2 text-gray-700">Role Assignments</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {meeting.roles?.map((role, index) => (
                              <div
                                key={index}
                                className={`flex justify-between p-2 rounded-md ${
                                  role.assignedTo === data.currentUserId
                                    ? "bg-blue-50 border border-blue-200"
                                    : "bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-gray-700">{role.role}</span>
                                <span className="text-gray-500">
                                  {role.assignedTo === data.currentUserId
                                    ? "You"
                                    : role.assignedTo
                                      ? "Assigned"
                                      : "Unassigned"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="mb-4 text-center text-gray-500">No events found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
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
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        {event.formattedDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {event.categories &&
                          event.categories.map((category, i) => (
                            <Badge key={i} variant="outline" className="border-gray-200 text-gray-700">
                              {category}
                            </Badge>
                          ))}
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          <span>
                            {event.attendees}/{event.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {isUpcoming(event.date) ? "Register Now" : "View Details"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    //  </MemberLayout>
  )
}

