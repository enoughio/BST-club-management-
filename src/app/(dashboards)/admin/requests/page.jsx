"use client"

import { useEffect, useState } from "react"
import { getRequests, createRequest } from "@/lib/api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, CalendarIcon, Flag, Loader2, Plus, Send, UserMinus } from "lucide-react"
import { getMembers, getEvents } from "@/lib/api"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    type: "",
    memberId: "",
    eventId: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getRequests("1")
        const membersData = await getMembers("1")
        const eventsData = await getEvents("1")

        setRequests(requestsData)
        setMembers(membersData)
        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching request data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateRequest = async () => {
    setIsSubmitting(true)

    try {
      const requestData = {
        type: newRequest.type,
        requestedBy: "1", // Current admin ID
        requestedDate: new Date().toISOString(),
        status: "Pending",
        club: "1", // Current club ID
        details: {},
      }

      // Add type-specific details
      switch (newRequest.type) {
        case "MemberRemoval":
          requestData.details = {
            memberId: newRequest.memberId,
            reason: newRequest.reason,
          }
          break
        case "FreezeClub":
          requestData.details = {
            startDate: newRequest.startDate,
            endDate: newRequest.endDate,
            reason: newRequest.reason,
          }
          break
        case "EventCancellation":
          requestData.details = {
            eventId: newRequest.eventId,
            reason: newRequest.reason,
          }
          break
      }

      const result = await createRequest(requestData)

      // Update local state
      setRequests([result, ...requests])

      // Reset form & close dialog
      setNewRequest({
        type: "",
        memberId: "",
        eventId: "",
        startDate: "",
        endDate: "",
        reason: "",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Request Submitted",
        description: "Your request has been submitted to the Super Admin.",
      })
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRequestDetails = (request) => {
    switch (request.type) {
      case "MemberRemoval": {
        const member = members.find((m) => m.id === request.details.memberId)
        return {
          title: "Member Removal Request",
          icon: UserMinus,
          description: member
            ? `Request to remove ${member.first_name} ${member.last_name} from the club.`
            : "Request to remove a member from the club.",
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      case "FreezeClub": {
        return {
          title: "Club Freeze Request",
          icon: Clock,
          description: `Request to freeze club activities from ${new Date(request.details.startDate).toLocaleDateString()} to ${new Date(request.details.endDate).toLocaleDateString()}.`,
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      case "EventCancellation": {
        const event = events.find((e) => e.id === request.details.eventId)
        return {
          title: "Event Cancellation Request",
          icon: Calendar,
          description: event ? `Request to cancel the event "${event.title}".` : "Request to cancel an event.",
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      default:
        return {
          title: "Request",
          icon: Flag,
          description: "General request to Super Admin.",
          content: "No additional details provided.",
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success">Approved</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "Pending":
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
            <p className="text-muted-foreground">Submit and track requests to the Super Admin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : requests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="mb-4 text-center text-muted-foreground">No requests found.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {requests.map((request) => {
                  const details = getRequestDetails(request)

                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <details.icon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{details.title}</CardTitle>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardDescription>{details.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Reason:</div>
                          <p className="text-sm">{details.content}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {requests
                .filter((request) => request.status === "Pending")
                .map((request) => {
                  const details = getRequestDetails(request)

                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <details.icon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{details.title}</CardTitle>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardDescription>{details.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Reason:</div>
                          <p className="text-sm">{details.content}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {requests
                .filter((request) => request.status === "Approved")
                .map((request) => {
                  const details = getRequestDetails(request)

                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <details.icon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{details.title}</CardTitle>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardDescription>{details.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Reason:</div>
                          <p className="text-sm">{details.content}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {requests
                .filter((request) => request.status === "Rejected")
                .map((request) => {
                  const details = getRequestDetails(request)

                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <details.icon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{details.title}</CardTitle>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardDescription>{details.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Reason:</div>
                          <p className="text-sm">{details.content}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>Submit a new request to the Super Admin for approval.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="type">Request Type</Label>
              <Select value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MemberRemoval">Member Removal</SelectItem>
                  <SelectItem value="FreezeClub">Freeze Club</SelectItem>
                  <SelectItem value="EventCancellation">Event Cancellation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newRequest.type === "MemberRemoval" && (
              <div className="space-y-2">
                <Label htmlFor="memberId">Select Member</Label>
                <Select
                  value={newRequest.memberId}
                  onValueChange={(value) => setNewRequest({ ...newRequest, memberId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newRequest.type === "EventCancellation" && (
              <div className="space-y-2">
                <Label htmlFor="eventId">Select Event</Label>
                <Select
                  value={newRequest.eventId}
                  onValueChange={(value) => setNewRequest({ ...newRequest, eventId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newRequest.type === "FreezeClub" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for your request"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={
                isSubmitting ||
                !newRequest.type ||
                !newRequest.reason ||
                (newRequest.type === "MemberRemoval" && !newRequest.memberId) ||
                (newRequest.type === "EventCancellation" && !newRequest.eventId) ||
                (newRequest.type === "FreezeClub" && (!newRequest.startDate || !newRequest.endDate))
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

