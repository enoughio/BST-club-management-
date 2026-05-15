"use client"

import React, { useEffect, useState } from "react"
import { getMeetings, assignRole, getMembers as apiGetMembers } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, Plus, Users } from "lucide-react"
import Link from "next/link"

type Member = { id: string; first_name: string; last_name: string }
type Role = { role: string; assignedTo?: string | null }
type Meeting = { id: string; title: string; date: string; time?: string; location?: string; description?: string; roles: Role[] }

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  // const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingsData = await getMeetings("1")
        const membersData = await apiGetMembers("1")
        setMeetings(meetingsData)
        setMembers(membersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meeting data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAssignRole = (meeting: Meeting, roleIndex: number) => { setSelectedMeeting(meeting); setSelectedRoleIndex(roleIndex); setIsDialogOpen(true) }

  const handleSubmitRoleAssignment = async (memberId: string) => {
    if (!selectedMeeting || selectedRoleIndex === null) return
    setIsAssigning(true)
    try {
      await assignRole(selectedMeeting.id, selectedRoleIndex, memberId)
      const updatedMeetings = meetings.map((meeting) => {
        if (meeting.id === selectedMeeting.id) {
          const updatedRoles = [...meeting.roles]
          updatedRoles[selectedRoleIndex] = { ...updatedRoles[selectedRoleIndex], assignedTo: memberId }
          return { ...meeting, roles: updatedRoles }
        }
        return meeting
      })
      setMeetings(updatedMeetings)
      setIsDialogOpen(false)
      // toast({ title: "Role Assigned", description: "The role has been successfully assigned." })
    } catch (error) {
      console.error("Error assigning role:", error)
      // toast({ title: "Error", description: "Failed to assign role. Please try again.", variant: "destructive" })
    } finally { setIsAssigning(false) }
  }

  const getMemberName = (memberId?: string | null) => { if (!memberId) return "Unassigned"; const m = members.find((x) => x.id === memberId); return m ? `${m.first_name} ${m.last_name}` : "Unknown" }

  const groupMeetingsByMonth = () => {
    const grouped: Record<string, Meeting[]> = {}
    meetings.forEach((meeting) => {
      const date = new Date(meeting.date)
      const month = date.toLocaleString("default", { month: "long", year: "numeric" })
      if (!grouped[month]) grouped[month] = []
      grouped[month].push(meeting)
    })
    return grouped
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground">View and manage club meetings and role assignments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/meetings/add"><Plus className="mr-2 h-4 w-4" />Add Meeting</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Meetings</TabsTrigger>
            <TabsTrigger value="all">All Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? <div className="flex justify-center p-8"><div className="animate-spin">Loading...</div></div> : meetings.length === 0 ? (
              <Card><CardContent className="flex flex-col items-center justify-center p-6"><p className="mb-4 text-center text-muted-foreground">No upcoming meetings scheduled.</p><Button asChild><Link href="/admin/meetings/add"><Plus className="mr-2 h-4 w-4" />Schedule a Meeting</Link></Button></CardContent></Card>
            ) : (
              Object.entries(groupMeetingsByMonth()).map(([month, monthMeetings]) => (
                <div key={month} className="space-y-4">
                  <h2 className="text-xl font-semibold">{month}</h2>
                  {monthMeetings.map((meeting) => (
                    <Card key={meeting.id}>
                      <CardHeader>
                        <CardTitle>{meeting.title}</CardTitle>
                        <CardDescription className="flex flex-col gap-2 sm:flex-row sm:items-center text-sm text-muted-foreground">
                          <span className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{new Date(meeting.date).toLocaleDateString()}</span>
                          <span className="flex items-center"><Clock className="mr-1 h-4 w-4" />{meeting.time}</span>
                          <span className="flex items-center"><MapPin className="mr-1 h-4 w-4" />{meeting.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p>{meeting.description}</p>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Role Assignments</h3>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {meeting.roles.map((role, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{role.role}</TableCell>
                                      <TableCell>{getMemberName(role.assignedTo)}</TableCell>
                                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleAssignRole(meeting, index)}>{role.assignedTo ? "Reassign" : "Assign"}</Button></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" asChild><Link href={`/admin/meetings/${meeting.id}/edit`}>Edit Meeting</Link></Button>
                        <Button variant="outline" asChild><Link href={`/admin/meetings/${meeting.id}`}>View Details</Link></Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4"><Card><CardContent className="p-6"><p className="text-center text-muted-foreground">Past meetings will appear here.</p></CardContent></Card></TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="font-medium">{meeting.title}</TableCell>
                        <TableCell>{new Date(meeting.date).toLocaleDateString()}</TableCell>
                        <TableCell>{meeting.time}</TableCell>
                        <TableCell>{meeting.location}</TableCell>
                        <TableCell><div className="flex items-center"><Users className="h-4 w-4 mr-1" />{meeting.roles.length} roles</div></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" asChild><Link href={`/admin/meetings/${meeting.id}`}>View</Link></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              {selectedMeeting && selectedRoleIndex !== null ? (
                <span>Assign the role of <strong>{selectedMeeting.roles[selectedRoleIndex].role}</strong> to a member.</span>
              ) : (
                "Select a member to assign to this role."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select onValueChange={handleSubmitRoleAssignment}>
                <SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger>
                <SelectContent>
                  {members.map((member) => (<SelectItem key={member.id} value={member.id}>{member.first_name} {member.last_name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
