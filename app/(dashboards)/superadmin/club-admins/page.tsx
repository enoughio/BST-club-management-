"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"

export default function ClubAdminsPage() {
  const [clubs, setClubs] = useState<any[]>([])
  const [filteredClubs, setFilteredClubs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      // TODO: fetch real data
      setClubs([{ id: "1", Admin: "John Doe", email: "john@example.com", phone: "", name: "Bhopal", city: "Bhopal" }])
      setFilteredClubs([{ id: "1", Admin: "John Doe", email: "john@example.com", phone: "", name: "Bhopal", city: "Bhopal" }])
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (searchTerm) setFilteredClubs(clubs.filter((c) => c.Admin.toLowerCase().includes(searchTerm.toLowerCase())))
    else setFilteredClubs(clubs)
  }, [searchTerm, clubs])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Admins</h1>
          <p className="text-muted-foreground">Manage club administrators across the organization.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/superadmin/club-admins/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Club Admin
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search club admins..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">Loading club admins...</TableCell></TableRow>
                ) : filteredClubs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">No club admins found.</TableCell></TableRow>
                ) : (
                  filteredClubs.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar><AvatarImage src="" /><AvatarFallback>{club.Admin.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback></Avatar>
                          <div className="font-medium">{club.Admin}</div>
                        </div>
                      </TableCell>
                      <TableCell>{club.email}</TableCell>
                      <TableCell>{club.phone}</TableCell>
                      <TableCell>{club.name}</TableCell>
                      <TableCell>{club.city}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href={`/superadmin/club-admins/${club.id}`}>View Details</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/superadmin/club-admins/${club.id}/edit`}>Edit Admin</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/superadmin/clubs/${club.id}`}>View Club</Link></DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
