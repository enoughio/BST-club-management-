import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getMembers, getMeetings, getEvents, getRequests } from "@/lib/api"
import { Calendar, UserCheck, UserMinus, Clock, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"
import AdminDashboardClient from "@/components/ui/dashboard/admin/admin-dashboard-client"


export default async function AdminDashboard() {
  // Fetch data server-side
  const [membersData, meetingsData, eventsData, requestsData] = await Promise.all([
    getMembers("1"),
    getMeetings("1"),
    getEvents("1"),
    getRequests("1"),
  ])

  // Calculate stats on the server
  const now = new Date()
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const expiringMembers = membersData.filter((member) => {
    const expiryDate = new Date(member.membershipExpiryDate)
    return expiryDate > now && expiryDate < nextMonth
  })

  const upcomingMeetings = meetingsData.filter((meeting) => {
    const meetingDate = new Date(meeting.date)
    return meetingDate > now
  })

  const upcomingEvents = eventsData.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate > now
  })

  const pendingRequests = requestsData.filter((request) => request.status === "Pending")

  const stats = {
    totalMembers: membersData.length,
    expiringMembers: expiringMembers.length,
    activeProjects: 2,
    upcomingMeetings: upcomingMeetings.length,
    upcomingEvents: upcomingEvents.length,
    pendingRequests: pendingRequests.length,
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Club Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Bhopal Storytellers club management dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Club is growing steadily</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memberships Expiring Soon</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">In the next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response from Super Admin</p>
          </CardContent>
        </Card>
      </div>

      {stats.expiringMembers > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            {stats.expiringMembers} member(s) have memberships expiring in the next 30 days. {" "}
            <Link href="/admin/members" className="font-medium underline underline-offset-4">
              View Members
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Client component only for interactive lists/tabs */}
      <AdminDashboardClient members={membersData} meetings={meetingsData} events={eventsData} stats={stats} />
    </div>
  )
}

