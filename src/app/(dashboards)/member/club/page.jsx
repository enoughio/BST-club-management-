"use client"

import { useEffect, useState } from "react"
import MemberLayout from "@/components/member-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarClock, Mail, MapPin, Phone, Users } from "lucide-react"
// import { useAuth } from "@/context/auth-context"


const getClubInfo = async(id) => {
  
    // const BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"
    // try {
    //   const response = await fetch(`${BASE_URL}//api/bst/clubs/${id}/`,
    //     {
    //       method: "GET",
    //       credentials: "include",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok")
    //   }

    //   const data = response.json()
    //   return data
    // } catch (error) {
    //   console.error("Error fetching club information:", error)
    // }

//fallback data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        name: "Bhopal Storytellers",
        address:
          "First Floor, Bharat Storytellers, B-66, near Chetak Bridge, Housing Board Colony, Kasturba Nagar, Bhopal, Madhya Pradesh 462022",
        city: "Bhopal",
        meetingTime: "Tuesdays, 6:30 PM",
        position: [23.2339, 77.4401],
        dmsPosition: "40°42'46.08\"N, 74°00'21.6\"W",
        members: 32,
        image: "",
        description:
          "Downtown Speakers is a friendly and supportive club that helps members improve their public speaking and leadership skills. We meet every Tuesday at 6:30 PM at 123 Main St, New York, NY. Join us to practice your speaking skills, receive feedback, and connect with other members.",
        Admin: "John Doe",
        email: "jhondoe@example.com",
        phone: "123-456-7890",
        executiveCommittee: [
          {
            id: "1",
            name: "John Doe",
            role: "President",
            email: "john.doe@example.com",
            avatar: null,
          },
          {
            id: "2",
            name: "Jane Smith",
            role: "Vice President Education",
            email: "jane.smith@example.com",
            avatar: null,
          },
          {
            id: "3",
            name: "Michael Johnson",
            role: "Vice President Membership",
            email: "michael.johnson@example.com",
            avatar: null,
          },
          {
            id: "4",
            name: "Sarah Williams",
            role: "Vice President Public Relations",
            email: "sarah.williams@example.com",
            avatar: null,
          },
          {
            id: "5",
            name: "Robert Brown",
            role: "Secretary",
            email: "robert.brown@example.com",
            avatar: null,
          },
          {
            id: "6",
            name: "Emily Davis",
            role: "Treasurer",
            email: "emily.davis@example.com",
            avatar: null,
          },
          {
            id: "7",
            name: "David Wilson",
            role: "Sergeant at Arms",
            email: "david.wilson@example.com",
            avatar: null,
          },
        ],
        achievements: [
          {
            id: "1",
            title: "President's Distinguished Club",
            year: "2022-2023",
            description: "Achieved all 10 goals in the Distinguished Club Program",
          },
          {
            id: "2",
            title: "Best Club in District",
            year: "2021-2022",
            description: "Recognized as the best club in the district for membership growth and retention",
          },
        ],
      })
    }, 1000)
  })
}

export default function ClubInfoPage() {
  const [clubInfo, setClubInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        // fetch mock user from server-side API
        const userRes = await fetch('/api/auth/me', { cache: 'no-store' })
        let user = null
        if (userRes.ok) user = await userRes.json()

        const clubId = user?.clubId || '1'
        const data = await getClubInfo(clubId)
        setClubInfo(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching club information:", error)
        setLoading(false)
      }
    }

    fetchClubInfo()
  }, [])

  return (
   //  <MemberLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Club Information</h1>
          <p className="text-gray-500">Details about your Storytellers club.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : (

          clubInfo && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{clubInfo.name}</CardTitle>
                      <CardDescription className="text-gray-500">{clubInfo.city}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{clubInfo.members} Members</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarClock className="h-4 w-4 text-gray-500" />
                        <span>Meeting Time: {clubInfo.meetingTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Location: {clubInfo.city}</span>
                      </div>
                    </div>

                    <p className="text-gray-700">{clubInfo.description}</p>
                  </div>

                  <div className="rounded-md border border-gray-200 overflow-hidden aspect-video">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59365.55110417767!2d77.40113913124998!3d23.233433599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x2155716d572d4f8!2sBhopal%2C%20Madhya%20Pradesh%2C%20India!5e0!3m2!1sen!2sin!4v1690356415188!5m2!1sen!2sin`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        Address
                      </div>
                      <p className="text-gray-700">{clubInfo.address}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-1 h-4 w-4" />
                        Email
                      </div>
                      <p className="text-gray-700">{clubInfo.email}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-1 h-4 w-4" />
                        Phone
                      </div>
                      <p className="text-gray-700">{clubInfo.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="committee" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                  <TabsTrigger value="committee">Executive Committee</TabsTrigger>
                  <TabsTrigger value="achievements">Club Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="committee" className="space-y-6">

                {
                  clubInfo.executiveCommittee.length > 0 ? (

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clubInfo.executiveCommittee.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar || ""} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-blue-600">{member.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  ) : (

                    <p className="text-gray-500 text-center">Executive Committee details are not available.</p>

                  )
                }

                  


                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">

                  {
                    clubInfo.achievements && clubInfo.achievements.length > 0 ? (
                      <div className="space-y-4">
                      {clubInfo.achievements.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardHeader>
                            <CardTitle>{achievement.title}</CardTitle>
                            <CardDescription>{achievement.year}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{achievement.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    ) : (
                      <p className="text-gray-500 text-center">Club Achievements details are not available.</p>
                    )
                  }
                 
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Club Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We provide a supportive and positive learning experience in which members are empowered to develop
                      communication and leadership skills, resulting in greater self-confidence and personal growth.
                    </p>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-700 mb-2">Communication</h3>
                        <p className="text-sm text-gray-700">
                          Develop effective communication skills through regular practice and feedback.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-700 mb-2">Leadership</h3>
                        <p className="text-sm text-gray-700">
                          Build leadership skills by taking on various roles and responsibilities.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-700 mb-2">Growth</h3>
                        <p className="text-sm text-gray-700">
                          Experience personal and professional growth in a supportive environment.
                        </p>
                      </div>
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

