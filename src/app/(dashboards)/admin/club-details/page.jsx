"use client"

import { useEffect, useState } from "react"
import { getClub, updateClub } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Building, CalendarClock, Loader2, Mail, MapPin, Phone, Save, User, Users } from "lucide-react"
// no client auth context - fetch server-side user via /api/auth/me

export default function ClubDetailsPage() {
  const [club, setClub] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()


  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        let clubId = '1'
        try {
          const res = await fetch('/api/auth/me', { cache: 'no-store' })
          if (res.ok) {
            const user = await res.json()
            if (user?.clubId) clubId = user.clubId
          }
        } catch (e) {
          // ignore
        }

        const data = await getClub(clubId)
        setClub(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching club details:", error)
        setIsLoading(false)
      }
    }

    fetchClubDetails()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setClub((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {   // updates club details
    setIsSaving(true)

    try {
      await updateClub("1", club)       // updates club
      setIsEditing(false)

      toast({
        title: "Club Details Updated",
        description: "Your club details have been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating club details:", error)
      toast({
        title: "Error",
        description: "Failed to update club details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      // <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8  text-muted-foreground" />
        </div>
      // </AdminLayout>
    )
  }

  return (
    // <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Club Details</h1>
            <p className="text-muted-foreground">View and manage your club's information.</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Club Information</CardTitle>
              <CardDescription>Basic information about your club.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Club Name</Label>
                </div>
                {isEditing ? (
                  <Input name="name" value={club.name} onChange={handleChange} />
                ) : (
                  <p className="text-sm font-medium">{club.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Address</Label>
                </div>
                {isEditing ? (
                  <Textarea name="address" value={club.address} onChange={handleChange} />
                ) : (
                  <p className="text-sm">{club.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>City</Label>
                </div>
                {isEditing ? (
                  <Input name="city" value={club.city} onChange={handleChange} />
                ) : (
                  <p className="text-sm">{club.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Meeting Time</Label>
                </div>
                {isEditing ? (
                  <Input name="meetingTime" value={club.meetingTime} onChange={handleChange} />
                ) : (
                  <p className="text-sm">{club.meetingTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Members Count</Label>
                </div>
                <p className="text-sm font-medium">{club.members}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details for club administration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Admin Name</Label>
                </div>
                {isEditing ? (
                  <Input name="Admin" value={club.Admin} onChange={handleChange} />
                ) : (
                  <p className="text-sm font-medium">{club.Admin}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Email</Label>
                </div>
                {isEditing ? (
                  <Input name="email" value={club.email} onChange={handleChange} />
                ) : (
                  <p className="text-sm">{club.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Phone</Label>
                </div>
                {isEditing ? (
                  <Input name="phone" value={club.phone} onChange={handleChange} />
                ) : (
                  <p className="text-sm">{club.phone}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Club Description</Label>
                {isEditing ? (
                  <Textarea name="description" value={club.description} onChange={handleChange} rows={5} />
                ) : (
                  <p className="text-sm">{club.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Club Location</CardTitle>
              <CardDescription>The geographical location of your club.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden aspect-video">
                <div className="h-full w-full bg-muted flex items-center justify-center">
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
              </div>

              {isEditing && (
                <div className="grid gap-4 grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      name="lat"
                      value={club.position ? club.position[0] : ""}
                      onChange={(e) => {
                        const lat = Number.parseFloat(e.target.value) || 0
                        setClub((prev) => ({
                          ...prev,
                          position: [lat, prev.position ? prev.position[1] : 0],
                        }))
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      name="lng"
                      value={club.position ? club.position[1] : ""}
                      onChange={(e) => {
                        const lng = Number.parseFloat(e.target.value) || 0
                        setClub((prev) => ({
                          ...prev,
                          position: [prev.position ? prev.position[0] : 0, lng],
                        }))
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    // </AdminLayout>
  )
}

