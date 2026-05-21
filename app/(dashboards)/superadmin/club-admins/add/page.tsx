"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  clubId: string
  username: string
  password: string
  confirmPassword: string
}

export default function AddClubAdminPage() {
  const router = useRouter()
//   const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    clubId: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const clubs = [
    { id: "1", name: "Bhopal Storytellers" },
    { id: "2", name: "Delhi Orators" },
    { id: "3", name: "Mumbai Speakers" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value } as any))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as any))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: call API to create admin
    //   toast({ title: "Admin Created", description: "Club admin created successfully." })
      router.push("/superadmin/club-admins")
    } catch (err) {
      console.error(err)
    //   toast({ title: "Error", description: "Failed to create admin.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/superadmin/club-admins">Back</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add Club Admin</h1>
            <p className="text-gray-500">Create a new club administrator</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
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

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/superadmin/club-admins")}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white">{isLoading ? "Creating..." : "Create Admin"}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
