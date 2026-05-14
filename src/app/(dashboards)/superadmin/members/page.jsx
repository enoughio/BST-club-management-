"use client"

import { useEffect, useState } from "react"
import { getMembers, getClubs } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"

export default function AllMembersPage() {
  const [members, setMembers] = useState([])
  const [clubs, setClubs] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersData = await getMembers()
        const clubsData = await getClubs()

        setMembers(membersData)
        setFilteredMembers(membersData)
        setClubs(clubsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching members:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedClub, members])

  const applyFilters = () => {
    let filtered = [...members]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.first_name.toLowerCase().includes(term) ||
          m.last_name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.phone.includes(term),
      )
    }

    // Apply club filter
    if (selectedClub) {
      filtered = filtered.filter((m) => m.club === selectedClub)
    }

    setFilteredMembers(filtered)
  }

  const getMembershipStatus = (expiryDate) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    if (expiry < now) {
      return { label: "Expired", variant: "destructive" }
    } else if (expiry < oneMonthFromNow) {
      return { label: "Expiring Soon", variant: "warning" }
    } else {
      return { label: "Active", variant: "success" }
    }
  }

  const getClubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId)
    return club ? club.name : clubId
  }

  return (
    // <AdminLayout>
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
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
              />
            </div>

            <div className="w-full sm:w-64">
              <Select value={selectedClub || "all"} onValueChange={(value) => setSelectedClub(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedClub(null)}>All Members</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const filtered = members.filter((m) => {
                        const status = getMembershipStatus(m.membershipExpiryDate)
                        return status.label === "Active"
                      })
                      setFilteredMembers(filtered)
                    }}
                  >
                    Active Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const filtered = members.filter((m) => {
                        const status = getMembershipStatus(m.membershipExpiryDate)
                        return status.label === "Expiring Soon"
                      })
                      setFilteredMembers(filtered)
                    }}
                  >
                    Expiring Soon
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const filtered = members.filter((m) => {
                        const status = getMembershipStatus(m.membershipExpiryDate)
                        return status.label === "Expired"
                      })
                      setFilteredMembers(filtered)
                    }}
                  >
                    Expired Memberships
                  </DropdownMenuItem>
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
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        Loading members...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => {
                      const status = getMembershipStatus(member.membershipExpiryDate)

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage src={member.avatar || ""} />
                                <AvatarFallback>
                                  {member.first_name[0]}
                                  {member.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {member.first_name} {member.last_name}
                                </div>
                                <div className="text-xs text-muted-foreground">{member.occupation || "Member"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>{getClubName(member.club)}</TableCell>
                          <TableCell>{new Date(member.membershipExpiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/superadmin/members/${member.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/superadmin/members/${member.id}/edit`}>Edit Details</Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    // </AdminLayout>
  )
}

