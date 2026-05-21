"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { getClub } from "@/lib/api"

type Club = any

export default function EditClubPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
//   const { toast } = useToast()
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await getClub(params.id)
        setClub(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching club:", error)
        // toast({ title: "Error", description: "Failed to load club details", variant: "destructive" })
        setLoading(false)
      }
    }

    fetchClub()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setClub((prev : Club)  => (prev ? { ...prev, [name]: value } : prev))
  }

  const handlePositionChange = (axis: number, value: string) => {
    if (!club) return
    if (!club.position) {
      const newPosition: [number, number] = [0, 0]
      newPosition[axis] = Number.parseFloat(value) || 0
      setClub((prev : Club) => (prev ? { ...prev, position: newPosition } : prev))
    } else {
      const newPosition = [...club.position]
      newPosition[axis] = Number.parseFloat(value) || 0
      setClub((prev : Club) => (prev ? { ...prev, position: newPosition } : prev))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    setTimeout(() => {
    //   toast({ title: "Club Updated", description: "The club has been successfully updated." })
      router.push(`/superadmin/clubs/${params.id}`)
      setIsSaving(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
        <p className="text-gray-500 mb-6">The club you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/superadmin/clubs"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Clubs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/superadmin/clubs/${params.id}`}><ArrowLeft className="h-4 w-4"/></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Club</h1>
            <p className="text-gray-500">Update the details for {club.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Club Information</CardTitle>
            <CardDescription>Edit the basic details for this club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name *</Label>
              <Input id="name" name="name" value={club.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" name="address" value={club.address} onChange={handleChange} rows={3} required />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={club.city} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time *</Label>
                <Input id="meetingTime" name="meetingTime" value={club.meetingTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location Coordinates</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" value={club.position ? club.position[0] : ""} onChange={(e) => handlePositionChange(0, e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" value={club.position ? club.position[1] : ""} onChange={(e) => handlePositionChange(1, e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dmsPosition">DMS Position</Label>
              <Input id="dmsPosition" name="dmsPosition" value={club.dmsPosition || ""} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" value={club.description} onChange={handleChange} rows={4} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
            <CardDescription>Contact details for the club administrator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="Admin">Admin Name *</Label>
              <Input id="Admin" name="Admin" value={club.Admin} onChange={handleChange} required />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={club.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" value={club.phone} onChange={handleChange} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/superadmin/clubs/${params.id}`)} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving Changes...</>) : (<><Save className="mr-2 h-4 w-4"/>Save Changes</>)}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
