"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, CheckCircle, Download, Edit, Loader2, Trash, User, Users } from "lucide-react"
import Link from "next/link"

// Mock API function to get project details
const getProjectDetails = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "2",
        title: "Researching and Presenting",
        description:
          "Research a topic, organize supporting materials, and deliver a well-organized speech. This project helps members develop their research skills and learn how to structure a clear, informative presentation.",
        level: "Level 2",
        path: "Presentation Mastery",
        assignedTo: {
          id: "2",
          name: "Bob Smith",
          clubId: "1",
          clubName: "Bhopal Storytellers",
        },
        status: "In Progress",
        completedDate: null,
        startDate: "2023-10-01",
        expectedCompletionDate: "2023-12-15",
        feedback: "",
        objectives: [
          "Research a topic thoroughly using credible sources",
          "Organize information logically with a clear introduction, body, and conclusion",
          "Cite sources and incorporate visual aids as appropriate",
          "Deliver a 5-7 minute speech on your researched topic",
        ],
        resources: [
          {
            title: "Project Checklist",
            type: "PDF",
            url: "#",
          },
          {
            title: "Effective Research Guide",
            type: "PDF",
            url: "#",
          },
          {
            title: "Presentation Structure Template",
            type: "DOCX",
            url: "#",
          },
        ],
        evaluationHistory: [],
      })
    }, 1000)
  })
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectDetails(params.id)
        setProject(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching project details:", error)
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      setIsDeleteDialogOpen(false)

      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      })

      router.push("/superadmin/projects")
    }, 1000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "Not Started":
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  if (loading) {
    return (
     <>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  return (
   <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/superadmin/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.title}</h1>
              <p className="text-gray-500">
                {project.level} - {project.path}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={`/superadmin/projects/${project.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Comprehensive information about this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{project.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {project.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Resources</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.resources.map((resource, index) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            <p className="text-xs text-gray-500">{resource.type}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="text-blue-600">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {project.feedback && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback</h3>
                      <p className="text-gray-700 italic">{project.feedback}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {project.evaluationHistory && project.evaluationHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.evaluationHistory.map((evaluation, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium text-gray-900">{evaluation.evaluator}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(evaluation.date).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700">{evaluation.comments}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  {getStatusBadge(project.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Start Date:</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not started"}
                  </span>
                </div>

                {project.expectedCompletionDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Expected Completion:</span>
                    <span className="font-medium">{new Date(project.expectedCompletionDate).toLocaleDateString()}</span>
                  </div>
                )}

                {project.completedDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Completed On:</span>
                    <span className="font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.assignedTo ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Assigned To:</span>
                      <span className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {project.assignedTo.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Club:</span>
                      <span className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.assignedTo.clubName}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">Not assigned to any member</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {project.status === "In Progress" && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Mark as Completed</Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full border-gray-200 text-gray-700 hover:bg-gray-50" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Project Guide
                </Button>

                <Button className="w-full border-gray-200 text-gray-700 hover:bg-gray-50" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Evaluation Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Project: </span>
                <span>{project.title}</span>
              </div>
              <div>
                <span className="font-medium">Level: </span>
                <span>{project.level}</span>
              </div>
              {project.assignedTo && (
                <div>
                  <span className="font-medium">Assigned to: </span>
                  <span>
                    {project.assignedTo.name} ({project.assignedTo.clubName})
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

