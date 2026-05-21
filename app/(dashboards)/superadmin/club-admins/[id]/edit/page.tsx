"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, ArrowLeft } from "lucide-react"

type FormData = { firstName: string; lastName: string; email: string; phone: string; clubId: string }

export default function EditClubAdminPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
//   const { toast } = useToast()
  const [club, setClub] = useState<any | null>(null)
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({ firstName: "", lastName: "", email: "", phone: "", clubId: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with real API calls
        const mockClub = { id: params.id, name: "Mock Club" }
        const mockClubs = [
          { id: "1", name: "Bhopal Storytellers" },
          { id: "2", name: "Delhi Orators" },
        ]
        setClub(mockClub)
        setClubs(mockClubs)
        setFormData({ firstName: "John", lastName: "Doe", email: "john@example.com", phone: "", clubId: mockClubs[0].id })
      } catch (err) {
        // toast({ title: "Error", description: "Failed to load data.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value } as any))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as any))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // TODO: save via API
    //   toast({ title: "Saved", description: "Admin updated." })
      router.push("/superadmin/club-admins")
    } catch (err) {
    //   toast({ title: "Error", description: "Failed to save.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!club) return <div>Club not found</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/superadmin/club-admins"><ArrowLeft className="h-4 w-4"/></Link>
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
              <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="lastName">Last Name *</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required /></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clubId">Club *</Label>
              <Select value={formData.clubId} onValueChange={(v) => handleSelectChange("clubId", v)} required>
                <SelectTrigger><SelectValue placeholder="Select a club"/></SelectTrigger>
                <SelectContent>{clubs.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2"><Label htmlFor="resetPassword">Reset Password</Label>
              <div className="flex gap-2">
                <Input id="resetPassword" name="resetPassword" type="password" placeholder="Leave blank to keep current password" />
                <Button type="button" variant="outline" className="shrink-0 border-gray-200 text-gray-700 hover:bg-gray-50">Generate Password</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/superadmin/club-admins")} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">{isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</>) : (<><Save className="mr-2 h-4 w-4"/>Save Changes</>)}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
