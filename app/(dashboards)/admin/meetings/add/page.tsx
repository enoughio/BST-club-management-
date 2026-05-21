"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { createMeeting } from "@/lib/api"

type Role = { role: string; assignedTo?: string | null }

type MeetingForm = {
  title: string
  date: string
  time: string
  location: string
  description?: string
  roles: Role[]
}

export default function AddMeetingPage() {
  const router = useRouter()
  // const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<MeetingForm>({
    title: "",
    date: "",
    time: "",
    location: "Main Club Room",
    description: "",
    roles: [
      { role: "Toastmaster of the Evening", assignedTo: null },
      { role: "Timer", assignedTo: null },
      { role: "Ah Counter", assignedTo: null },
      { role: "Grammarian", assignedTo: null },
      { role: "Speaker 1", assignedTo: null },
      { role: "Speaker 2", assignedTo: null },
      { role: "Evaluator 1", assignedTo: null },
      { role: "Evaluator 2", assignedTo: null },
    ],
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (index: number, value: string) => {
    const updatedRoles = [...formData.roles]
    updatedRoles[index] = { ...updatedRoles[index], role: value }
    setFormData((prev) => ({ ...prev, roles: updatedRoles }))
  }

  const addRole = () => setFormData((prev) => ({ ...prev, roles: [...prev.roles, { role: "", assignedTo: null }] }))
  const removeRole = (index: number) => { const updatedRoles = [...formData.roles]; updatedRoles.splice(index, 1); setFormData((prev) => ({ ...prev, roles: updatedRoles })) }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const meetingData = { ...formData, club: "1" }
      await createMeeting(meetingData)
      // toast({ title: "Meeting Created", description: "The meeting has been successfully created." })
      router.push("/admin/meetings")
    } catch (error) {
      console.error("Error creating meeting:", error)
      // toast({ title: "Error", description: "Failed to create meeting. Please try again.", variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/meetings"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Schedule Meeting</h1>
            <p className="text-gray-500">Create a new club meeting</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Meeting Information</CardTitle>
            <CardDescription>Enter the details for the new meeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Weekly Club Meeting" required />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input id="time" name="time" placeholder="e.g., 6:30 PM - 8:30 PM" value={formData.time} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the meeting" rows={3} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Meeting Roles</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRole} className="text-blue-600 border-blue-200 hover:bg-blue-50">Add Role</Button>
              </div>

              {formData.roles && formData.roles.length > 0 ? (
                <div className="space-y-3">
                  {formData.roles.map((role, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input value={role.role} onChange={(e) => handleRoleChange(index, e.target.value)} placeholder="Role name" className="flex-1" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeRole(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Remove</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No roles added yet. Click "Add Role" to add meeting roles.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/meetings")} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Meeting...</> : <><Save className="mr-2 h-4 w-4" />Create Meeting</>}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
