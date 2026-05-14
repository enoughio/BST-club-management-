"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getClub, updateClub } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Building, CalendarClock, Loader2, Mail, MapPin, Phone, Save, User, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClubDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedClub, setEditedClub] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be separate API calls
        const clubData = await getClub(params.id)

        // Mock members data
        const mockMembers = [
          {
            id: "1",
            first_name: "Alice",
            last_name: "Johnson",
            email: "alice@example.com",
            phone: "123-456-7890",
            role: "Member",
            membershipExpiryDate: "2024-12-31",
          },
          {
            id: "2",
            first_name: "Bob",
            last_name: "Smith",
            email: "bob@example.com",
            phone: "987-654-3210",
            role: "Secretary",
            membershipExpiryDate: "2023-11-15",
          },
          {
            id: "3",
            first_name: "Charlie",
            last_name: "Brown",
            email: "charlie@example.com",
            phone: "555-123-4567",
            role: "Treasurer",
            membershipExpiryDate: "2024-03-22",
          },
          {
            id: "4",
            first_name: "Diana",
            last_name: "Miller",
            email: "diana@example.com",
            phone: "333-888-9999",
            role: "Vice President",
            membershipExpiryDate: "2023-12-15",
          },
          {
            id: "5",
            first_name: "Edward",
            last_name: "Garcia",
            email: "edward@example.com",
            phone: "777-222-3333",
            role: "Member",
            membershipExpiryDate: "2024-06-30",
          },
        ]

        setClub(clubData)
        setEditedClub(clubData)
        setMembers(mockMembers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching club details:", error)
        toast({
          title: "Error",
          description: "Failed to load club details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedClub((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateClub(club.id, editedClub)
      setClub(editedClub)
      setIsEditing(false)

      toast({
        title: "Club Updated",
        description: "Club details have been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating club:", error)
      toast({
        title: "Error",
        description: "Failed to update club details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getMembershipStatus = (expiryDate) => {
    const now = new Date()
    const expiry = new Date(expiryDate)

    if (expiry < now) {
      return { label: "Expired", color: "bg-red-100 text-red-800" }
    } else {
      const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
      if (daysRemaining <= 30) {
        return {
          label: `Expiring Soon`,
          color: "bg-yellow-100 text-yellow-800",
        }
      } else {
        return { label: "Active", color: "bg-green-100 text-green-800" }
      }
    }
  }

  if (loading) {
    return (
      // <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      // </AdminLayout>
    )
  }

  return (
    // <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/superadmin/clubs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{club.name}</h1>
              <p className="text-gray-500">{club.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Club
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedClub(club)
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="details">Club Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Club Information</CardTitle>
                <CardDescription>Basic details about the club</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Club Name</Label>
                        <Input id="name" name="name" value={editedClub.name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={editedClub.city} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={editedClub.address}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meetingTime">Meeting Time</Label>
                      <Input
                        id="meetingTime"
                        name="meetingTime"
                        value={editedClub.meetingTime}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editedClub.description}
                        onChange={handleChange}
                        rows={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Building className="mr-2 h-4 w-4" />
                          Club Name
                        </div>
                        <p className="font-medium text-gray-900">{club.name}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          Address
                        </div>
                        <p className="text-gray-900">{club.address}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          City
                        </div>
                        <p className="text-gray-900">{club.city}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarClock className="mr-2 h-4 w-4" />
                          Meeting Time
                        </div>
                        <p className="text-gray-900">{club.meetingTime}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-2 h-4 w-4" />
                          Members
                        </div>
                        <p className="text-gray-900">{club.members}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Description</div>
                      <p className="text-gray-900">{club.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Contact details for club administration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="admin">Admin Name</Label>
                        <Input id="admin" name="Admin" value={editedClub.Admin} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={editedClub.email} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={editedClub.phone} onChange={handleChange} />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" />
                        Admin Name
                      </div>
                      <p className="font-medium text-gray-900">{club.Admin}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </div>
                      <p className="text-gray-900">{club.email}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </div>
                      <p className="text-gray-900">{club.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Club location on map</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-200 overflow-hidden aspect-video">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59365.55110417767!2d77.40113913124998!3d23.233433599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x2155716d572d4f8!2sBhopal%2C%20Madhya%20Pradesh%2C%20India!5e0!3m2!1sen!2sin!4v1690356415188!5m2!1sen!2sin`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Club Members</CardTitle>
                  <CardDescription>Manage the members of this club</CardDescription>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/superadmin/clubs/${club.id}/add-member`}>Add Member</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => {
                      const status = getMembershipStatus(member.membershipExpiryDate)

                      return (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.first_name} {member.last_name}
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild className="text-blue-600">
                              <Link href={`/superadmin/members/${member.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Club Reports</CardTitle>
                <CardDescription>Performance reports and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membership Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-12 bg-gray-50 rounded-md">
                        Graph placeholder - Membership growth over time
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Meeting Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-12 bg-gray-50 rounded-md">
                        Graph placeholder - Meeting attendance rate
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-12 bg-gray-50 rounded-md">
                        Graph placeholder - Project completion statistics
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Member Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-12 bg-gray-50 rounded-md">
                        Graph placeholder - Member retention rate
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  Generate Detailed Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    // </AdminLayout>
  )
}

