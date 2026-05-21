"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Profile = {
  id: string
  first_name: string
  last_name: string
  username?: string
  email: string
  phone?: string
  avatar?: string | null
  address?: string
  gender?: string
  dob?: string
  id_proof?: string
  club?: string
  clubName?: string
  occupation?: string
  membershipExpiryDate?: string
  joinDate?: string
  bio?: string
}

const getMemberProfile = async (): Promise<Profile> => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch member profile")
    }

    const data = await response.json()
    return { ...(data as Profile) }
  } catch (error) {
    console.error("Error fetching member profile:", error)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        avatar: null,
        address: "123 Main St, Bhopal, MP",
        gender: "male",
        dob: "1990-01-15",
        id_proof: "ABCD1234",
        club: "1",
        clubName: "Bhopal Storytellers",
        occupation: "Software Engineer",
        membershipExpiryDate: "2023-05-15",
        joinDate: "2022-05-15",
        bio: "Passionate about public speaking and leadership development.",
      })
    }, 1000)
  })
}

export default function MemberProfile(){
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
//   const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        let data: Profile | null = null
        if (res.ok) data = await res.json()
        else data = await getMemberProfile()

        setProfile(data)
        setEditedProfile(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setProfile(editedProfile)
      setIsEditing(false)
      setIsSaving(false)
    //   toast({ title: "Profile Updated", description: "Your profile has been successfully updated." })
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
          <p className="text-gray-500">View and manage your personal information.</p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedProfile(profile)
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

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="membership">Membership Details</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar || "/placeholder.svg?height=64&width=64"} alt="Profile" />
                  <AvatarFallback className="text-lg">{profile?.first_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{profile?.first_name} {profile?.last_name}</CardTitle>
                  <CardDescription>{profile?.occupation}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" name="first_name" value={editedProfile?.first_name || ""} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" name="last_name" value={editedProfile?.last_name || ""} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={editedProfile?.email || ""} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={editedProfile?.phone || ""} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={editedProfile?.address || ""} onChange={handleChange} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input id="occupation" name="occupation" value={editedProfile?.occupation || ""} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" name="dob" type="date" value={editedProfile?.dob || ""} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="w-full min-h-[80px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                      value={editedProfile?.bio || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" /> Full Name
                      </div>
                      <p className="font-medium text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </div>
                      <p className="font-medium text-gray-900">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-2 h-4 w-4" /> Phone
                      </div>
                      <p className="font-medium text-gray-900">{profile?.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" /> Address
                      </div>
                      <p className="font-medium text-gray-900">{profile?.address}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="mr-2 h-4 w-4" /> Occupation
                      </div>
                      <p className="font-medium text-gray-900">{profile?.occupation}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" /> Date of Birth
                      </div>
                      <p className="font-medium text-gray-900">{profile?.dob && new Date(profile.dob).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="text-gray-700">{profile?.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
              <CardDescription>Details about your club membership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Club Name</h3>
                  <p className="font-medium text-gray-900">{profile?.clubName}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="font-medium text-gray-900">{profile?.joinDate && new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Membership ID</h3>
                  <p className="font-medium text-gray-900">{profile?.id_proof}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Membership Expiry</h3>
                  <p className="font-medium text-gray-900">{profile?.membershipExpiryDate && new Date(profile.membershipExpiryDate).toLocaleDateString()}</p>
                  {profile?.membershipExpiryDate && new Date(profile.membershipExpiryDate) < new Date() && (
                    <p className="text-sm text-red-600 mt-1">Your membership has expired. Please contact your club admin for renewal.</p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Membership Benefits</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                  <li>Access to all club meetings and events</li>
                  <li>Participation in speech contests</li>
                  <li>Access to educational materials</li>
                  <li>Mentorship opportunities</li>
                  <li>Leadership development</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Download Membership Certificate</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
