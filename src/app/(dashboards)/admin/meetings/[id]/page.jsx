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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Clock, Edit, Loader2, MapPin, Trash, User } from "lucide-react"
import Link from "next/link"
import { getMeeting, getMembers } from "@/lib/api"

export default function MeetingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [meeting, setMeeting] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAssigningRole, setIsAssigningRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedMember, setSelectedMember] = useState("")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingData = await getMeeting(params.id)
        const membersData = await getMembers("1")

        setMeeting(meetingData)
        setMembers(membersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "There was a problem loading the meeting details.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleDelete = () => {
    // In a real app, this would be an API call
    setIsLoading(true)

    setTimeout(() => {
      setIsDeleteDialogOpen(false)
      router.push("/admin/meetings")

      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      })
    }, 1000)
  }

  const handleAssignRole = (roleIndex) => {
    setSelectedRole(meeting.roles[roleIndex])
    setSelectedMember("")
    setIsRoleDialogOpen(true)
  }

  const submitRoleAssignment = async () => {
    if (!selectedMember) return

    setIsAssigningRole(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      // Update the UI
      const updatedRoles = [...meeting.roles]
      const roleIndex = meeting.roles.findIndex((r) => r === selectedRole)
      updatedRoles[roleIndex] = { ...selectedRole, assignedTo: selectedMember }

      setMeeting({
        ...meeting,
        roles: updatedRoles,
      })

      setIsRoleDialogOpen(false)
      setIsAssigningRole(false)

      toast({
        title: "Role Assigned",
        description: "The role has been successfully assigned.",
      })
    }, 1000)
  }

  const getMemberName = (memberId) => {
    if (!memberId) return "Unassigned"
    const member = members.find((m) => m.id === memberId)
    return member ? `${member.first_name} ${member.last_name}` : "Unknown"
  }

  if (loading) {
    return (
     <>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  if (!meeting) {
    return (
     <>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Meeting Not Found</h1>
          <p className="text-gray-500 mb-6">The meeting you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/meetings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meetings
            </Link>
          </Button>
        </div>
      </>
    )
  }

  return (
   <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/meetings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{meeting.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(meeting.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {meeting.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {meeting.location}
                </div>
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
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={`/admin/meetings/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Meeting
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
                <CardDescription>Information about this meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{meeting.description || "No description provided."}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Role Assignments</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {meeting.roles.map((role, index) => (
                      <Card key={index} className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{role.role}</h4>
                              <div className="flex items-center mt-1">
                                <User className="mr-1 h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-500">{getMemberName(role.assignedTo)}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAssignRole(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {role.assignedTo ? "Reassign" : "Assign"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href={`/admin/meetings/${params.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Meeting Details
                  </Link>
                </Button>

                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                  Send Reminder to Participants
                </Button>

                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                  Generate Attendance Report
                </Button>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Badge className="w-full justify-center bg-green-100 text-green-800 hover:bg-green-200">
                    {new Date(meeting.date) > new Date() ? "Upcoming Meeting" : "Past Meeting"}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>


      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meeting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meeting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{meeting.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(meeting.date).toLocaleDateString()} • {meeting.time}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      // {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              {selectedRole && (
                <span>
                  Assign the role of <strong>{selectedRole.role}</strong> to a member.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={submitRoleAssignment}
              disabled={isAssigningRole || !selectedMember}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAssigningRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

