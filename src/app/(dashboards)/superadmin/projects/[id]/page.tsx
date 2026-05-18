"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"

export default function ProjectDetailsPage(){
  const params = useParams() as { id?: string }
  const router = useRouter()
// //   const { toast } = useToast()
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      // TODO: fetch project
      setProject({ id: params.id, title: "Project A", status: "active", description: "" })
      setLoading(false)
    }
    fetch()
  }, [params.id])

  const handleDelete = () => {
    // TODO: delete
    // toast({ title: "Deleted", description: "Project removed." })
    router.push("/superadmin/projects")
  }

  if (loading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">Status: {project.status}</p>
      </div>
      <Card>
        <div className="p-4">{project.description || "No details"}</div>
      </Card>
    </div>
  )
}
