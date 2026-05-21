"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/hooks/use-toast"

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
//   const { toast } = useToast()

  useEffect(() => {
    const fetch = async () => {
      // TODO: fetch
      setRequests([])
      setClubs([])
      setMembers([])
      setEvents([])
      setLoading(false)
    }
    fetch()
  }, [])

  const handleAction = (request: any) => { setSelectedRequest(request); setIsActionDialogOpen(true) }

  const handleUpdateStatus = async (status: string) => {
    if (!selectedRequest) return
    setIsProcessing(true)
    try {
      // TODO: update
    //   toast({ title: "Updated", description: `Request ${status}` })
      setIsActionDialogOpen(false)
    } catch (err) {
    //   toast({ title: "Error", description: "Failed to update.", variant: "destructive" })
    } finally { setIsProcessing(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="text-muted-foreground">Manage incoming requests from clubs and members.</p>
      </div>

      <Card>
        <div className="p-4">
          {loading ? <div>Loading...</div> : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>Details</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (<TableRow key={r.id}><TableCell>{r.type}</TableCell><TableCell>{r.from}</TableCell><TableCell>{r.details}</TableCell><TableCell className="text-right">---</TableCell></TableRow>))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}
