"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Member = {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  membershipExpiryDate?: string
}

type Meeting = {
  id: string
  title: string
  date?: string
  time?: string
  location?: string
}

type Event = {
  id: string
  title ?: string 
  formattedDate?: string
  time?: string
  location?: string
}

type Props = {
  members?: Member[]
  meetings?: Meeting[]
  events?: Event[]
  stats?: Record<string, any>
}

export default function AdminDashboardClient({ members = [], meetings = [], events = [] }: Props) {
  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="members">Recent Members</TabsTrigger>
        <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
        <TabsTrigger value="events">Upcoming Events</TabsTrigger>
      </TabsList>

      <TabsContent value="members" className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-4 font-medium">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Expires</div>
            </div>
          </div>

          <div className="divide-y">
            {members.slice(0, 10).map((member) => (
              <div key={member.id} className="grid grid-cols-4 p-4">
                <div className="font-medium">
                  {member.first_name} {member.last_name}
                </div>
                <div>{member.email}</div>
                <div>{member.phone}</div>
                <div>{member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString() : ""}</div>
              </div>
            ))}
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/members">View All Members</Link>
        </Button>
      </TabsContent>

      <TabsContent value="meetings" className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-3 font-medium">
              <div>Title</div>
              <div>Date & Time</div>
              <div>Location</div>
            </div>
          </div>

          <div className="divide-y">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="grid grid-cols-3 p-4">
                <div className="font-medium">{meeting.title}</div>
                <div>
                  {meeting.date}, {meeting.time}
                </div>
                <div>{meeting.location}</div>
              </div>
            ))}
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/meetings">View All Meetings</Link>
        </Button>
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-3 font-medium">
              <div>Title</div>
              <div>Date & Time</div>
              <div>Location</div>
            </div>
          </div>
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="grid grid-cols-3 p-4">
                <div className="font-medium">{event.title}</div>
                <div>
                  {event.formattedDate}, {event.time}
                </div>
                <div>{event.location}</div>
              </div>
            ))}
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/events">View All Events</Link>
        </Button>
      </TabsContent>
    </Tabs>
  )
}
