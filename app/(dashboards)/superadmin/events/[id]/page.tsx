"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash, ArrowLeft } from "lucide-react"

export default function EventDetailPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
//   const { toast } = useToast()
  const [event, setEvent] = useState<any | null>(null)
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: replace with API
        setEvent({ id: params.id, name: "Sample Event", highlighted: false, clubId: "1" })
        setClubs([{ id: "1", name: "Bhopal" }])
      } catch (err) {
        // toast({ title: "Error", description: "Failed to load event.", variant: "destructive" })
      } finally { setLoading(false) }
    }
    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    setIsProcessing(true)
    try {
      // TODO: delete via API
    //   toast({ title: "Deleted", description: "Event removed." })
      router.push("/superadmin/events")
    } catch (err) {
    //   toast({ title: "Error", description: "Failed to delete.", variant: "destructive" })
    } finally { setIsProcessing(false) }
  }

  const handleToggleHighlight = async () => {
    if (!event) return
    try {
      // TODO: toggle via API
      setEvent((prev: any) => ({ ...prev, highlighted: !prev.highlighted }))
    //   toast({ title: "Updated", description: "Highlight status updated." })
    } catch (err) {
    //   toast({ title: "Error", description: "Failed to update.", variant: "destructive" })
    }
  }

  const getClubName = (clubId?: string) => clubs.find((c) => c.id === clubId)?.name || "N/A"

  if (loading) return <div>Loading...</div>
  if (!event) return <div>Event not found</div>

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/superadmin/events"><ArrowLeft className="h-4 w-4"/></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-sm text-muted-foreground">Club: {getClubName(event.clubId)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Manage event actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">{isProcessing ? <Loader2 className="animate-spin"/> : <Trash/>} Delete</Button>
            <Button onClick={handleToggleHighlight}>Toggle Highlight</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
