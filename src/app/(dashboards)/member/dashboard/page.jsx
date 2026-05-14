"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, GanttChartSquare, Star, Trophy, User } from "lucide-react"
import Link from "next/link"


// Mock API function to get member data
const getMemberData = async () => {

  // try {
  //   const response = await fetch(`${process.env.BACKEND_URL}/dashboard/`,{
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   }
  //   ) 
  //   const data = response.json() // Assuming the API returns JSON data
  //   return data
  // } catch (error) {
  //   console.error("Error fetching member data:", error)
  // }



  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        club: "1",
        clubName: "Bhopal Storytellers",
        joinDate: "2022-05-15",
        membershipExpiryDate: "2023-05-15",
        completedProjects: 3,
        upcomingMeetings: [
          {
            id: "1",
            title: "Weekly Club Meeting",
            date: "2023-11-22",
            time: "6:30 PM - 8:30 PM",
            location: "Main Club Room",
            roles: [{ role: "Speaker 2", assignedTo: "1" }],
          },
          {
            id: "3",
            title: "Workshop: Effective Evaluations",
            date: "2023-12-06",
            time: "6:30 PM - 8:30 PM",
            location: "Main Club Room",
          },
        ],
        upcomingEvents: [
          {
            id: "1",
            title: "Bhopal International Storytelling Fest",
            date: "2023-12-15",
            formattedDate: "December 15, 2023",
            time: "6:00 PM - 9:00 PM",
            location: "Cultural Center, New Delhi",
          },
        ],
        activeProjects: [
          {
            id: "2",
            title: "Researching and Presenting",
            description: "Research a topic, organize supporting materials, and deliver a well-organized speech",
            level: "Level 2",
            status: "In Progress",
          },
        ],
        achievements: [
          {
            id: "1",
            title: "Ice Breaker",
            date: "2023-10-15",
            type: "Project Completion",
          },
          {
            id: "2",
            title: "Best Speaker",
            date: "2023-09-22",
            type: "Meeting Award",
          },
        ],
      })
    }, 1000)
  })
}

export default function MemberDashboard() {
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMemberData()
        setMemberData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching member data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getMembershipStatus = (expiryDate) => {
    const now = new Date()
    const expiry = new Date(expiryDate)

    if (expiry < now) {
      return { label: "Expired", color: "bg-red-100 text-red-800" }
    } else {
      const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
      if (daysRemaining <= 30) {
        return {
          label: `Expiring Soon (${daysRemaining} days)`,
          color: "bg-yellow-100 text-yellow-800",
        }
      } else {
        return { label: "Active", color: "bg-green-100 text-green-800" }
      }
    }
  }

  return (
   //  <MemberLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Member Dashboard</h1>
          <p className="text-gray-500">Welcome to your Storytellers member dashboard.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-gray-100"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          memberData && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Membership Status</CardTitle>
                    <User className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {new Date(memberData.membershipExpiryDate).toLocaleDateString()}
                    </div>
                    <Badge className={`mt-2 ${getMembershipStatus(memberData.membershipExpiryDate).color}`}>
                      {getMembershipStatus(memberData.membershipExpiryDate).label}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Completed Projects</CardTitle>
                    <GanttChartSquare className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{memberData.completedProjects}</div>
                    <p className="text-xs text-gray-500 mt-1">Keep up the good work!</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Upcoming Meetings</CardTitle>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{memberData.upcomingMeetings.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Next: {memberData.upcomingMeetings[0]?.date}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Achievements</CardTitle>
                    <Trophy className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{memberData.achievements.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Latest: {memberData.achievements[0]?.title}</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                  <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="projects">My Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="meetings" className="space-y-4">
                  <div className="rounded-md border border-gray-200">
                    <div className="p-4">
                      <div className="grid grid-cols-3 font-medium text-gray-700">
                        <div>Meeting</div>
                        <div>Date & Time</div>
                        <div>Your Role</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {memberData.upcomingMeetings.map((meeting) => {
                        const assignedRole =
                          meeting.roles?.find((r) => r.assignedTo === memberData.id)?.role || "Attendee"

                        return (
                          <div key={meeting.id} className="grid grid-cols-3 p-4">
                            <div className="font-medium text-gray-900">{meeting.title}</div>
                            <div className="text-gray-700">
                              {meeting.date}, {meeting.time}
                            </div>
                            <div className="text-gray-700">{assignedRole}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/member/events">View All Meetings</Link>
                  </Button>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  <div className="rounded-md border border-gray-200">
                    <div className="p-4">
                      <div className="grid grid-cols-3 font-medium text-gray-700">
                        <div>Event</div>
                        <div>Date & Time</div>
                        <div>Location</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {memberData.upcomingEvents.map((event) => (
                        <div key={event.id} className="grid grid-cols-3 p-4">
                          <div className="font-medium text-gray-900">
                            <div className="flex items-center">
                              {event.highlighted && <Star className="mr-1 h-4 w-4 text-yellow-500" />}
                              {event.title}
                            </div>
                          </div>
                          <div className="text-gray-700">
                            {event.formattedDate}, {event.time}
                          </div>
                          <div className="text-gray-700">{event.location}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/member/events">View All Events</Link>
                  </Button>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="rounded-md border border-gray-200">
                    <div className="p-4">
                      <div className="grid grid-cols-3 font-medium text-gray-700">
                        <div>Project</div>
                        <div>Level</div>
                        <div>Status</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {memberData.activeProjects.map((project) => (
                        <div key={project.id} className="grid grid-cols-3 p-4">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-gray-700">{project.level}</div>
                          <div className="text-gray-700">
                            <Badge
                              className={
                                project.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/member/projects">View All Projects</Link>
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Your recent awards and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {memberData.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-4">
                          <div className="rounded-full bg-yellow-100 p-2">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{achievement.title}</p>
                            <p className="text-sm text-gray-500">{achievement.type}</p>
                            <p className="text-xs text-gray-400">{new Date(achievement.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Club Information</CardTitle>
                    <CardDescription>Your club details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Club Name</p>
                        <p className="text-gray-900">{memberData.clubName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-gray-900">{new Date(memberData.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="pt-4">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href="/member/club">View Club Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )
        )}
      </div>
    //  </MemberLayout>
  )
}

