"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { getClub, getClubs } from "@/lib/api"

export default function EditClubAdminPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [club, setClub] = useState(null)
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    clubId: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubData = await getClub(params.id)
        const clubsData = await getClubs()

        setClub(clubData)
        setClubs(clubsData)
        setFormData({
          firstName: clubData.Admin.split(" ")[0] || "",
          lastName: clubData.Admin.split(" ")[1] || "",
          email: clubData.email,
          phone: clubData.phone,
          clubId: clubData.id,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load club admin details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Admin Updated",
        description: "The club admin has been successfully updated.",
      })
      router.push("/superadmin/club-admins")
      setIsSaving(false)
    }, 1500)
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

  if (!club) {
    return (
      // <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Club Admin Not Found</h1>
          <p className="text-gray-500 mb-6">The club admin you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/superadmin/club-admins">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Club Admins
            </Link>
          </Button>
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
              <Link href="/superadmin/club-admins">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Club Admin</h1>
              <p className="text-gray-500">Update the admin details for {club.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
              <CardDescription>Update the club admin's personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clubId">Club *</Label>
                <Select value={formData.clubId} onValueChange={(value) => handleSelectChange("clubId", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resetPassword">Reset Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="resetPassword"
                    name="resetPassword"
                    type="password"
                    placeholder="Leave blank to keep current password"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Generate Password
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/superadmin/club-admins")}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    // </AdminLayout>
  )
}

