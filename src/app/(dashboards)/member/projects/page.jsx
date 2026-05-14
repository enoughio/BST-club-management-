"use client"

import { useEffect, useState } from "react"
import MemberLayout from "@/components/member-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, FileText, Award, ArrowRight } from "lucide-react"

// Mock API function to get member projects
const getMemberProjects = () => {


  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        active: [
          {
            id: "2",
            title: "Researching and Presenting",
            description: "Research a topic, organize supporting materials, and deliver a well-organized speech",
            level: "Level 2",
            status: "In Progress",
            completedDate: null,
            feedback: "",
            dueDate: "2023-12-15",
            progress: 60,
          },
        ],
        completed: [
          {
            id: "1",
            title: "Ice Breaker",
            description: "First speech project focusing on introducing yourself to the club",
            level: "Level 1",
            status: "Completed",
            completedDate: "2023-10-15",
            feedback: "Great first speech! Effectively introduced yourself and showed your enthusiasm.",
            progress: 100,
          },
          {
            id: "3",
            title: "Focus on the Positive",
            description: "Practice using language that shows positivity in your speech",
            level: "Level 3",
            status: "Completed",
            completedDate: "2023-09-22",
            feedback: "Excellent use of positive language. Very motivational and uplifting.",
            progress: 100,
          },
        ],
        upcoming: [
          {
            id: "4",
            title: "Connect with Storytelling",
            description: "Practice storytelling techniques to connect with your audience",
            level: "Level 2",
            status: "Not Started",
            completedDate: null,
            feedback: "",
            progress: 0,
          },
          {
            id: "5",
            title: "Creating Effective Visual Aids",
            description: "Learn to create and use visual aids that enhance your message",
            level: "Level 3",
            status: "Not Started",
            completedDate: null,
            feedback: "",
            progress: 0,
          },
        ],
        pathProgress: {
          currentLevel: 2,
          totalLevels: 5,
          completedProjects: 2,
          totalProjects: 10,
          pathName: "Presentation Mastery",
        },
      })
    }, 1000)
  })
}

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMemberProjects()
        setProjects(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
   //  <MemberLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Projects</h1>
          <p className="text-gray-500">Track your progress on Storytellers educational projects.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          projects && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Path Progress</CardTitle>
                  <CardDescription>Your progress in the {projects.pathProgress.pathName} path</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Level</span>
                      <span className="font-medium text-gray-900">
                        Level {projects.pathProgress.currentLevel} of {projects.pathProgress.totalLevels}
                      </span>
                    </div>
                    <Progress
                      value={(projects.pathProgress.currentLevel / projects.pathProgress.totalLevels) * 100}
                      className="h-2 bg-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Projects Completed</span>
                      <span className="font-medium text-gray-900">
                        {projects.pathProgress.completedProjects} of {projects.pathProgress.totalProjects}
                      </span>
                    </div>
                    <Progress
                      value={(projects.pathProgress.completedProjects / projects.pathProgress.totalProjects) * 100}
                      className="h-2 bg-gray-100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                  <TabsTrigger value="active">Active Projects</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6">
                  {projects.active.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="mb-4 text-center text-gray-500">No active projects.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start a New Project</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {projects.active.map((project) => (
                        <Card key={project.id} className="flex flex-col">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>{project.level}</CardDescription>
                              </div>
                              {getStatusBadge(project.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="text-sm text-gray-700 mb-4">{project.description}</p>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Progress</span>
                                  <span className="font-medium text-gray-900">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2 bg-gray-100" />
                              </div>

                              {project.dueDate && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="mr-2 h-4 w-4" />
                                  Due by: {new Date(project.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                              Continue Project
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {projects.upcoming.map((project) => (
                      <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription>{project.level}</CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-gray-700">{project.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Project</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {projects.completed.map((project) => (
                      <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription>{project.level}</CardDescription>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600 font-medium">Completed</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-gray-700 mb-4">{project.description}</p>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Feedback</h3>
                            <p className="text-sm text-gray-600 italic">{project.feedback}</p>
                          </div>

                          <div className="mt-4 text-sm text-gray-500">
                            Completed on: {new Date(project.completedDate).toLocaleDateString()}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                            View Certificate
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Educational Resources</CardTitle>
                  <CardDescription>Resources to help you complete your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Project Templates</p>
                        <p className="text-sm text-gray-500">Access templates for all your speech projects</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto text-blue-600">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Evaluation Guides</p>
                        <p className="text-sm text-gray-500">Guides to help you evaluate other speakers</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto text-blue-600">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Time Management Tips</p>
                        <p className="text-sm text-gray-500">Learn how to manage your time during speeches</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto text-blue-600">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )
        )}
      </div>
    //  </MemberLayout>
  )
}

