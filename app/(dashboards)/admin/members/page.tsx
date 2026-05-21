"use client"

import React, { useEffect, useState } from "react"
import { getMembers, renewMember, reinstateMember } from "@/lib/api"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronDown, Filter, MoreHorizontal, RefreshCcw, UserPlus } from "lucide-react"
import Link from "next/link"
// import { useToast } from "@/hooks/use-toast"

type Member = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar?: string | null
  occupation?: string | null
  membershipExpiryDate: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  // const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers("1")
        setMembers(data)
        setFilteredMembers(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching members:", error)
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeTab, members])

  const applyFilters = () => {
    let filtered = [...members]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.first_name.toLowerCase().includes(term) ||
          m.last_name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          (m.phone || "").includes(term)
      )
    }

    if (activeTab === "active") {
      filtered = filtered.filter((m) => new Date(m.membershipExpiryDate) > new Date())
    } else if (activeTab === "expiring") {
      const now = new Date()
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      filtered = filtered.filter((m) => {
        const expiryDate = new Date(m.membershipExpiryDate)
        return expiryDate > now && expiryDate < nextMonth
      })
    } else if (activeTab === "expired") {
      filtered = filtered.filter((m) => new Date(m.membershipExpiryDate) < new Date())
    }

    setFilteredMembers(filtered)
  }

  const handleRenewMember = async (id: string) => {
    try {
      const now = new Date()
      const nextYear = new Date(now.setFullYear(now.getFullYear() + 1))
      const expiryDate = nextYear.toISOString().split("T")[0]

      await renewMember(id, expiryDate)

      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, membershipExpiryDate: expiryDate } : m)))

      // toast({ title: "Membership Renewed", description: "Member's subscription has been renewed for 1 year." })
    } catch (error) {
      console.error("Error renewing membership:", error)
      // toast({ title: "Error", description: "Failed to renew membership. Please try again.", variant: "destructive" })
    }
  }

  const handleReinstateMember = async (id: string) => {
    try {
      await reinstateMember(id)

      const now = new Date()
      const nextYear = new Date(now.setFullYear(now.getFullYear() + 1))
      const expiryDate = nextYear.toISOString().split("T")[0]

      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, membershipExpiryDate: expiryDate } : m)))

      // toast({ title: "Member Reinstated", description: "Member has been successfully reinstated." })
    } catch (error) {
      console.error("Error reinstating member:", error)
      // toast({ title: "Error", description: "Failed to reinstate member. Please try again.", variant: "destructive" })
    }
  }

  const handleTabChange = (value: string) => setActiveTab(value)

  const getMembershipStatus = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    if (expiry < now) return { label: "Expired", variant: "destructive" }
    if (expiry < oneMonthFromNow) return { label: "Expiring Soon", variant: "warning" }
    return { label: "Active", variant: "success" }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage your club members, renew memberships, and add new members.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/members/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Input placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
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
                <DropdownMenuItem onClick={() => setActiveTab("all")}>All Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("active")}>Active Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("expiring")}>Expiring Soon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("expired")}>Expired Memberships</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">Loading members...</TableCell>
                      </TableRow>
                    ) : filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">No members found.</TableCell>
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
                                  <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.first_name} {member.last_name}</div>
                                  <div className="text-xs text-muted-foreground">{member.occupation || "Member"}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.phone}</TableCell>
                            <TableCell>{new Date(member.membershipExpiryDate).toLocaleDateString()}</TableCell>
                            <TableCell><Badge variant={status.variant as any}>{status.label}</Badge></TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild><Link href={`/admin/members/${member.id}`}>View Details</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link href={`/admin/members/${member.id}/edit`}>Edit Details</Link></DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleRenewMember(member.id)}><RefreshCcw className="h-4 w-4 mr-2" />Renew Membership</DropdownMenuItem>
                                  {status.label === "Expired" && (
                                    <DropdownMenuItem onClick={() => handleReinstateMember(member.id)}><UserPlus className="h-4 w-4 mr-2" />Reinstate Member</DropdownMenuItem>
                                  )}
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
                <div className="text-sm text-muted-foreground">Showing {filteredMembers.length} of {members.length} members</div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
