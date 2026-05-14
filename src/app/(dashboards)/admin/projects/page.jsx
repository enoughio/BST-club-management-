"use client"

import { useEffect, useState } from "react"
import { getProjects, assignProject, completeProject } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, MoreHorizontal, Plus, User } from "lucide-react"
import Link from "next/link"
import { getMembers } from "@/lib/api"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects("1")
        const membersData = await getMembers("1")

        setProjects(projectsData)
        setMembers(membersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching project data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAssign = (project) => {
    setSelectedProject(project)
    setIsAssignDialogOpen(true)
  }

  const handleMarkComplete = (project) => {
    setSelectedProject(project)
    setFeedback("")
    setIsCompleteDialogOpen(true)
  }

  const handleSubmitAssignment = async (memberId) => {
    if (!selectedProject) return

    try {
      await assignProject(selectedProject.id, memberId)

      // Update local state
      const updatedProjects = projects.map((project) => {
        if (project.id === selectedProject.id) {
          return { ...project, assignedTo: memberId, status: "In Progress" }
        }
        return project
      })

      setProjects(updatedProjects)
      setIsAssignDialogOpen(false)

      toast({
        title: "Project Assigned",
        description: "The project has been successfully assigned.",
      })
    } catch (error) {
      console.error("Error assigning project:", error)
      toast({
        title: "Error",
        description: "Failed to assign project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitCompletion = async () => {
    if (!selectedProject) return

    try {
      await completeProject(selectedProject.id, feedback)

      // Update local state
      const updatedProjects = projects.map((project) => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            status: "Completed",
            completedDate: new Date().toISOString().split("T")[0],
            feedback,
          }
        }
        return project
      })

      setProjects(updatedProjects)
      setIsCompleteDialogOpen(false)

      toast({
        title: "Project Completed",
        description: "The project has been marked as completed.",
      })
    } catch (error) {
      console.error("Error completing project:", error)
      toast({
        title: "Error",
        description: "Failed to mark project as completed. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getMemberName = (memberId) => {
    if (!memberId) return "Unassigned"
    const member = members.find((m) => m.id === memberId)
    return member ? `${member.first_name} ${member.last_name}` : "Unknown"
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">Completed</Badge>
      case "In Progress":
        return <Badge variant="warning">In Progress</Badge>
      case "Not Started":
        return <Badge variant="outline">Not Started</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
   <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage member projects, assignments, and track progress.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/projects/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-24 bg-muted/40"></CardHeader>
                    <CardContent className="h-40 bg-muted/20"></CardContent>
                  </Card>
                ))
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground mb-4">No projects found.</p>
                  <Button asChild>
                    <Link href="/admin/projects/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Link>
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.level}</CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span className="font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {getMemberName(project.assignedTo)}
                          </span>
                        </div>

                        {project.status === "Completed" && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Completed on:</span>
                              <span className="font-medium">
                                {new Date(project.completedDate).toLocaleDateString()}
                              </span>
                            </div>

                            {project.feedback && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Feedback:</span>
                                <p className="mt-1 italic">{project.feedback}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                            <MoreHorizontal className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/projects/${project.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/projects/${project.id}/edit`}>Edit Project</Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {!project.assignedTo && (
                            <DropdownMenuItem onClick={() => handleAssign(project)}>Assign to Member</DropdownMenuItem>
                          )}

                          {project.assignedTo && project.status !== "Completed" && (
                            <>
                              <DropdownMenuItem onClick={() => handleAssign(project)}>
                                Reassign to Another Member
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkComplete(project)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.assignedTo && project.status !== "Completed")
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.level}</CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span className="font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {getMemberName(project.assignedTo)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button size="sm" onClick={() => handleMarkComplete(project)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="unassigned" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => !project.assignedTo)
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.level}</CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleAssign(project)}>
                        Assign to Member
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.status === "Completed")
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.level}</CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completed by:</span>
                          <span className="font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {getMemberName(project.assignedTo)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completed on:</span>
                          <span className="font-medium">{new Date(project.completedDate).toLocaleDateString()}</span>
                        </div>

                        {project.feedback && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Feedback:</span>
                            <p className="mt-1 italic">{project.feedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
            <DialogDescription>
              {selectedProject && <span>Assign the project "{selectedProject.title}" to a member.</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member">Select Member</Label>
              <Select onValueChange={handleSubmitAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Project as Completed</DialogTitle>
            <DialogDescription>
              {selectedProject && <span>Mark the project "{selectedProject.title}" as completed.</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Provide feedback on the project completion"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCompletion}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

