"use client"

import { useEffect, useState } from "react"
import { getRequests, updateRequestStatus, getClubs, getMembers, getEvents } from "@/lib/api"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, CalendarIcon, Flag, Loader2, CheckCircle, XCircle, UserMinus } from "lucide-react"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [clubs, setClubs] = useState([])
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getRequests()
        const clubsData = await getClubs()
        const membersData = await getMembers()
        const eventsData = await getEvents()

        setRequests(requestsData)
        setClubs(clubsData)
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

  const handleAction = (request) => {
    setSelectedRequest(request)
    setIsActionDialogOpen(true)
  }

  const handleUpdateStatus = async (status) => {
    if (!selectedRequest) return

    setIsProcessing(true)

    try {
      await updateRequestStatus(selectedRequest.id, status)

      // Update local state
      const updatedRequests = requests.map((request) => {
        if (request.id === selectedRequest.id) {
          return { ...request, status }
        }
        return request
      })

      setRequests(updatedRequests)
      setIsActionDialogOpen(false)

      toast({
        title: `Request ${status}`,
        description: `The request has been ${status.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("Error updating request status:", error)
      toast({
        title: "Error",
        description: "Failed to update request status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getRequestDetails = (request) => {
    switch (request.type) {
      case "MemberRemoval": {
        const member = members.find((m) => m.id === request.details.memberId)
        const club = clubs.find((c) => c.id === request.club)
        return {
          title: "Member Removal Request",
          icon: UserMinus,
          description: member
            ? `Request to remove ${member.first_name} ${member.last_name} from ${club?.name || "the club"}.`
            : `Request to remove a member from ${club?.name || "the club"}.`,
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      case "FreezeClub": {
        const club = clubs.find((c) => c.id === request.club)
        return {
          title: "Club Freeze Request",
          icon: Clock,
          description: `Request to freeze ${club?.name || "club"} activities from ${new Date(request.details.startDate).toLocaleDateString()} to ${new Date(request.details.endDate).toLocaleDateString()}.`,
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      case "EventCancellation": {
        const event = events.find((e) => e.id === request.details.eventId)
        const club = clubs.find((c) => c.id === request.club)
        return {
          title: "Event Cancellation Request",
          icon: Calendar,
          description: event
            ? `Request to cancel the event "${event.title}" from ${club?.name || "the club"}.`
            : `Request to cancel an event from ${club?.name || "the club"}.`,
          content: request.details.reason,
          date: new Date(request.requestedDate).toLocaleDateString(),
        }
      }
      default:
        return {
          title: "Request",
          icon: Flag,
          description: "General request from club admin.",
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

  const getClubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId)
    return club ? club.name : clubId
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
            <p className="text-muted-foreground">Review and manage requests from club admins.</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
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
                          <div className="text-sm text-muted-foreground mt-4">Club: {getClubName(request.club)}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleAction(request)}>
                              Review
                            </Button>
                          </div>
                        )}
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
                          <div className="text-sm text-muted-foreground mt-4">Club: {getClubName(request.club)}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Requested on {details.date}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus("Rejected")}>
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleUpdateStatus("Approved")}>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
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
                          <div className="text-sm text-muted-foreground mt-4">Club: {getClubName(request.club)}</div>
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
                          <div className="text-sm text-muted-foreground mt-4">Club: {getClubName(request.club)}</div>
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

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && <span>Please review this request and take appropriate action.</span>}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Request Type</h3>
                <p>{selectedRequest.type}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Details</h3>
                <p className="text-sm">{getRequestDetails(selectedRequest).description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Reason</h3>
                <p className="text-sm">{getRequestDetails(selectedRequest).content}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleUpdateStatus("Rejected")} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
            <Button onClick={() => handleUpdateStatus("Approved")} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

