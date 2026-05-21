"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
import { Filter, Search } from "lucide-react"

export default function AllMembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [filteredMembers, setFilteredMembers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

  useEffect(() => {
    const fetch = async () => {
      // TODO: fetch members
      setMembers([{ id: "1", name: "Alice", email: "a@e.com", phone: "", clubId: "1", expiry: null }])
      setClubs([{ id: "1", name: "Bhopal" }])
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => { applyFilters() }, [searchTerm, selectedClub, members])

  const applyFilters = () => {
    let filtered = [...members]
    if (searchTerm) filtered = filtered.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedClub) filtered = filtered.filter((m) => m.clubId === selectedClub)
    setFilteredMembers(filtered)
  }

  const getMembershipStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "Active"
    return "Active"
  }

  const getClubName = (clubId?: string) => clubs.find((c) => c.id === clubId)?.name || "N/A"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Members</h1>
          <p className="text-muted-foreground">View and manage members across all clubs.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8" />
          </div>

          <div className="w-full sm:w-64">
            <Select value={selectedClub || "all"} onValueChange={(value) => setSelectedClub(value === "all" ? null : value)}>
              <SelectTrigger><SelectValue placeholder="Filter by club" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {clubs.map((club) => (<SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1"><Filter className="h-4 w-4" /> <span className="hidden sm:inline">Filter</span></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedClub(null)}>All Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* active */}}>Active Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* expiring */}}>Expiring Soon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* expired */}}>Expired Memberships</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10">Loading members...</TableCell></TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10">No members found.</TableCell></TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}><TableCell>{member.name}</TableCell><TableCell>{member.email}</TableCell><TableCell>{member.phone}</TableCell><TableCell>{getClubName(member.clubId)}</TableCell><TableCell>{member.expiry || "-"}</TableCell><TableCell>{getMembershipStatus(member.expiry)}</TableCell><TableCell className="text-right">---</TableCell></TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between py-4 border-t"><div className="text-sm text-muted-foreground">Showing {filteredMembers.length} of {members.length} members</div></CardFooter>
        </Card>
      </div>
    </div>
  )
}
