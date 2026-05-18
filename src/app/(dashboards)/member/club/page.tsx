"use client";

import { useEffect, useState } from "react";
// import MemberLayout from "@/components/member-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock, Mail, MapPin, Phone, Users } from "lucide-react";

type ExecutiveMember = {
  id: string;
  name: string;
  role: string;
  email?: String;
  avatar?: string | null;
};
type Achievement = {
  id: string;
  title: string;
  year?: string;
  description?: string;
};
type ClubInfo = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  meetingTime?: string;
  position?: [number, number];
  dmsPosition?: string;
  members?: number;
  image?: string;
  description?: string;
  Admin?: string;
  email?: string;
  phone?: string;
  executiveCommittee: ExecutiveMember[];
  achievements: Achievement[];
};

const getClubInfo = async (id: string): Promise<ClubInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        name: "Bhopal Storytellers",
        address:
          "First Floor, Bharat Storytellers, B-66, near Chetak Bridge...",
        city: "Bhopal",
        meetingTime: "Tuesdays, 6:30 PM",
        position: [23.2339, 77.4401],
        dmsPosition: "40°42'46.08\"N, 74°00'21.6\"W",
        members: 32,
        image: "",
        description: "Downtown Speakers is a friendly and supportive club...",
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
        ],
        achievements: [
          {
            id: "1",
            title: "President's Distinguished Club",
            year: "2022-2023",
            description: "Achieved all 10 goals",
          },
        ],
      });
    }, 1000);
  });
};

export default function ClubInfoPage() {
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const userRes = await fetch("/api/auth/me", { cache: "no-store" });
        let user: any = null;
        if (userRes.ok) user = await userRes.json();

        const clubId = user?.clubId || "1";
        const data = await getClubInfo(clubId);
        setClubInfo(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching club information:", error);
        setLoading(false);
      }
    };

    fetchClubInfo();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Club Information
        </h1>
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
                    <CardDescription className="text-gray-500">
                      {clubInfo.city}
                    </CardDescription>
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
                    src={`https://www.google.com/maps/embed?...`}
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
                <TabsTrigger value="achievements">
                  Club Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="committee" className="space-y-6">
                {clubInfo.executiveCommittee.length > 0 ? (
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
                              <p className="font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-blue-600">
                                {member.role}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Executive Committee details are not available.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                {clubInfo.achievements && clubInfo.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {clubInfo.achievements.map((achievement) => (
                      <Card key={achievement.id}>
                        <CardHeader>
                          <CardTitle>{achievement.title}</CardTitle>
                          <CardDescription>{achievement.year}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">
                            {achievement.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Club Achievements details are not available.
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Club Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We provide a supportive and positive learning experience...
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
}
