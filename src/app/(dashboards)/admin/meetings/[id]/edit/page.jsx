"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Plus, Save, Trash } from "lucide-react"
import Link from "next/link"
import { getMeeting } from "@/lib/api"

export default function EditMeetingPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await getMeeting(params.id)
        setMeeting(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meeting:", error)
        toast({
          title: "Error",
          description: "Failed to load meeting details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchMeeting()
  }, [params.id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setMeeting((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (index, value) => {
    const updatedRoles = [...meeting.roles]
    updatedRoles[index].role = value
    setMeeting((prev) => ({ ...prev, roles: updatedRoles }))
  }

  const handleAddRole = () => {
    setMeeting((prev) => ({
      ...prev,
      roles: [...prev.roles, { role: "", assignedTo: null }],
    }))
  }

  const handleRemoveRole = (index) => {
    const updatedRoles = meeting.roles.filter((_, i) => i !== index)
    setMeeting((prev) => ({ ...prev, roles: updatedRoles }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Meeting Updated",
        description: "The meeting has been successfully updated.",
      })
      router.push(`/admin/meetings/${params.id}`)
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

  if (!meeting) {
    return (
      // <AdminLayout>
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
      // </AdminLayout>
    )
  }

  return (
    // <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/meetings/${params.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Meeting</h1>
              <p className="text-gray-500">Update meeting details and role assignments</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Meeting Information</CardTitle>
              <CardDescription>Update the details for this meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input id="title" name="title" value={meeting.title} onChange={handleChange} required />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" name="date" type="date" value={meeting.date} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input id="time" name="time" value={meeting.time} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" name="location" value={meeting.location} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={meeting.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Meeting Roles</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRole}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Role
                  </Button>
                </div>

                <div className="space-y-2">
                  {meeting.roles.map((role, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Role name"
                        value={role.role}
                        onChange={(e) => handleRoleChange(index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/meetings/${params.id}`)}
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

