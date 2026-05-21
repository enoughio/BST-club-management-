"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"

export default function SuperAdminProjectsPage() {
  const [data, setData] = useState<any[] | null>(null)
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

  useEffect(() => {
    const fetch = async () => {
      // Mock fetch
      const projects = [{ id: "1", title: "Project A", club: "Bhopal", status: "active" }]
      setData(projects)
      setFilteredProjects(projects)
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!data) return
    let list = [...data]
    if (searchTerm) list = list.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedClub) list = list.filter((p) => p.club === selectedClub)
    if (selectedStatus) list = list.filter((p) => p.status === selectedStatus)
    setFilteredProjects(list)
  }, [searchTerm, selectedClub, selectedStatus, data])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage projects across clubs.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={selectedClub} onValueChange={(v) => setSelectedClub(v)}>
            <SelectTrigger><SelectValue placeholder="Filter by club"/></SelectTrigger>
            <SelectContent><SelectItem value="active">All Clubs</SelectItem></SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v)}>
            <SelectTrigger><SelectValue placeholder="Status"/></SelectTrigger>
            <SelectContent><SelectItem value="active">Any</SelectItem><SelectItem value="active">Active</SelectItem></SelectContent>
          </Select>
        </div>

        <Card>
          <div className="p-4">
            {loading ? <div>Loading...</div> : (
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Title</TableHead><TableHead>Club</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((p) => (<TableRow key={p.id}><TableCell>{p.title}</TableCell><TableCell>{p.club}</TableCell><TableCell>{p.status}</TableCell><TableCell className="text-right">---</TableCell></TableRow>))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
