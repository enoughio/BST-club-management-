"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Download, Filter, Link, Loader2, Plus, Search, Trash } from "lucide-react"
import NextLink from "next/link"

// Mock API function to get all projects across clubs
const getAllProjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        projects: [
          {
            id: "1",
            title: "Ice Breaker",
            description: "First speech project focusing on introducing yourself to the club",
            level: "Level 1",
            assignedTo: {
              id: "4",
              name: "Diana Miller",
              clubId: "1",
              clubName: "Bhopal Storytellers",
            },
            status: "Completed",
            completedDate: "2023-10-15",
            feedback: "Great first speech! Effectively introduced yourself and showed your enthusiasm.",
          },
          {
            id: "2",
            title: "Researching and Presenting",
            description: "Research a topic, organize supporting materials, and deliver a well-organized speech",
            level: "Level 2",
            assignedTo: {
              id: "2",
              name: "Bob Smith",
              clubId: "1",
              clubName: "Bhopal Storytellers",
            },
            status: "In Progress",
            completedDate: null,
            feedback: "",
          },
          {
            id: "3",
            title: "Focus on the Positive",
            description: "Practice using language that shows positivity in your speech",
            level: "Level 3",
            assignedTo: {
              id: "1",
              name: "Alice Johnson",
              clubId: "1",
              clubName: "Bhopal Storytellers",
            },
            status: "Completed",
            completedDate: "2023-09-22",
            feedback: "Excellent use of positive language. Very motivational and uplifting.",
          },
          {
            id: "4",
            title: "Connect with Storytelling",
            description: "Practice storytelling techniques to connect with your audience",
            level: "Level 2",
            assignedTo: null,
            status: "Not Started",
            completedDate: null,
            feedback: "",
          },
          {
            id: "5",
            title: "Using Visual Aids",
            description: "Learn to use visual aids to enhance your speech",
            level: "Level 3",
            assignedTo: {
              id: "3",
              name: "Charlie Brown",
              clubId: "2",
              clubName: "Delhi Orators",
            },
            status: "In Progress",
            completedDate: null,
            feedback: "",
          },
          {
            id: "6",
            title: "Vocal Variety",
            description: "Learn to use voice modulation effectively in your speeches",
            level: "Level 2",
            assignedTo: {
              id: "5",
              name: "Edward Garcia",
              clubId: "3",
              clubName: "Mumbai Speakers",
            },
            status: "Completed",
            completedDate: "2023-10-10",
            feedback: "Good use of vocal variety. Work on pauses for dramatic effect.",
          },
        ],
        clubs: [
          { id: "1", name: "Bhopal Storytellers" },
          { id: "2", name: "Delhi Orators" },
          { id: "3", name: "Mumbai Speakers" },
        ],
      })
    }, 1000)
  })
}

export default function SuperAdminProjectsPage() {
  const [data, setData] = useState(null)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllProjects()
        setData(result)
        setFilteredProjects(result.projects)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      let filtered = [...data.projects]

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (project) => project.title.toLowerCase().includes(term) || project.description.toLowerCase().includes(term),
        )
      }

      // Apply club filter
      if (selectedClub) {
        filtered = filtered.filter((project) => project.assignedTo && project.assignedTo.clubId === selectedClub)
      }

      // Apply status filter
      if (selectedStatus) {
        filtered = filtered.filter((project) => project.status === selectedStatus)
      }

      setFilteredProjects(filtered)
    }
  }, [searchTerm, selectedClub, selectedStatus, data])

  const handleDeleteClick = (project) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      // Remove project from filtered list
      const updatedProjects = filteredProjects.filter((p) => p.id !== selectedProject.id)
      setFilteredProjects(updatedProjects)

      // Also update the main data
      if (data) {
        const updatedData = {
          ...data,
          projects: data.projects.filter((p) => p.id !== selectedProject.id),
        }
        setData(updatedData)
      }

      setIsDeleteDialogOpen(false)

      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      })
    }, 500)
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

  return (
   <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Projects</h1>
            <p className="text-gray-500">View and manage projects across all clubs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <NextLink href="/superadmin/projects/add">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </NextLink>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 border-gray-200"
            />
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {data?.clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedClub("")
              setSelectedStatus("")
            }}
            className="text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project List</CardTitle>
                <CardDescription>View and manage all projects</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">No projects found matching your filters.</p>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Club</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.level}</TableCell>
                            <TableCell>{project.assignedTo ? project.assignedTo.name : "Unassigned"}</TableCell>
                            <TableCell>{project.assignedTo ? project.assignedTo.clubName : "-"}</TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild className="text-blue-600">
                                  <NextLink href={`/superadmin/projects/${project.id}`}>View</NextLink>
                                </Button>
                                <Button variant="ghost" size="sm" asChild className="text-blue-600">
                                  <NextLink href={`/superadmin/projects/${project.id}/edit`}>Edit</NextLink>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(project)}
                                  className="text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredProjects.length} of {data?.projects.length || 0} projects
                </div>
                <Button variant="outline" className="text-gray-700 border-gray-200 hover:bg-gray-50">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects
                      .filter((project) => project.status === "In Progress")
                      .map((project) => (
                        <Card key={project.id}>
                          <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>{project.level}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Assigned to:</span>
                                <span className="text-sm font-medium">
                                  {project.assignedTo ? project.assignedTo.name : "Unassigned"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Club:</span>
                                <span className="text-sm font-medium">
                                  {project.assignedTo ? project.assignedTo.clubName : "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Status:</span>
                                <span>{getStatusBadge(project.status)}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-gray-700 border-gray-200 hover:bg-gray-50"
                            >
                              <NextLink href={`/superadmin/projects/${project.id}`}>View Details</NextLink>
                            </Button>
                            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                              <NextLink href={`/superadmin/projects/${project.id}/edit`}>Edit Project</NextLink>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects
                      .filter((project) => project.status === "Completed")
                      .map((project) => (
                        <Card key={project.id}>
                          <CardHeader>
                            <div className="flex justify-between">
                              <div>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>{project.level}</CardDescription>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Completed by:</span>
                                <span className="text-sm font-medium">
                                  {project.assignedTo ? project.assignedTo.name : "Unassigned"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Club:</span>
                                <span className="text-sm font-medium">
                                  {project.assignedTo ? project.assignedTo.clubName : "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Completed on:</span>
                                <span className="text-sm font-medium">
                                  {project.completedDate ? new Date(project.completedDate).toLocaleDateString() : "-"}
                                </span>
                              </div>
                            </div>
                            {project.feedback && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
                                <p className="text-sm text-gray-600 italic">{project.feedback}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-gray-700 border-gray-200 hover:bg-gray-50"
                            >
                              <NextLink href={`/superadmin/projects/${project.id}`}>View Details</NextLink>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-700 border-gray-200 hover:bg-gray-50"
                            >
                              <Link className="mr-2 h-4 w-4" />
                              Generate Certificate
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
            {selectedProject && (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Project: </span>
                  <span>{selectedProject.title}</span>
                </div>
                <div>
                  <span className="font-medium">Level: </span>
                  <span>{selectedProject.level}</span>
                </div>
                {selectedProject.assignedTo && (
                  <div>
                    <span className="font-medium">Assigned to: </span>
                    <span>
                      {selectedProject.assignedTo.name} ({selectedProject.assignedTo.clubName})
                    </span>
                  </div>
                )}
              </div>
            )}
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

