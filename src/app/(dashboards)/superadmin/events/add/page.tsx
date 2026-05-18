"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Loader2, Plus, Star, Trash } from "lucide-react"
import Link from "next/link"
import { getClubs, createEvent } from "@/lib/api"

type Speaker = { name: string; role: string; bio: string; image: string }
type ScheduleItem = { time: string; title: string; description: string }
type Photo = { url: string; alt: string }

type EventForm = {
  title: string
  slug: string
  description: string
  longDescription: string
  date: string
  formattedDate?: string
  time: string
  location: string
  club: string
  maxCapacity: string
  ticketPrice: string
  categories: string[]
  highlighted: boolean
  speakers: Speaker[]
  schedule: ScheduleItem[]
  photos: Photo[]
}

export default function AddEventPage() {
  const router = useRouter()
//   const { toast } = useToast()
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<EventForm>({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    date: "",
    time: "",
    location: "",
    club: "",
    maxCapacity: "100",
    ticketPrice: "",
    categories: [],
    highlighted: false,
    speakers: [{ name: "", role: "", bio: "", image: "" }],
    schedule: [{ time: "", title: "", description: "" }],
    photos: [{ url: "", alt: "" }],
  })

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await getClubs()
        setClubs(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching clubs:", error)
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlugGeneration = () => {
    if (formData.title) {
      const slug = formData.title.toLowerCase().replace(/[^
\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const date = new Date(value)

    if (!isNaN(date.getTime())) {
      const formattedDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
      setFormData((prev) => ({ ...prev, [name]: value, formattedDate }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value, formattedDate: "" }))
    }
  }

  const handleCheckboxChange = (name: keyof EventForm, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked } as any))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const categories = value.split(",").map((c) => c.trim()).filter(Boolean)
    setFormData((prev) => ({ ...prev, categories }))
  }

  const handleSelectChange = (name: keyof EventForm, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as any))
  }

  const handleSpeakerChange = (index: number, field: keyof Speaker, value: string) => {
    const updatedSpeakers = [...formData.speakers]
    updatedSpeakers[index] = { ...updatedSpeakers[index], [field]: value }
    setFormData((prev) => ({ ...prev, speakers: updatedSpeakers }))
  }

  const addSpeaker = () => setFormData((prev) => ({ ...prev, speakers: [...prev.speakers, { name: "", role: "", bio: "", image: "" }] }))
  const removeSpeaker = (index: number) => { const s = [...formData.speakers]; s.splice(index,1); setFormData((prev) => ({ ...prev, speakers: s })) }

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => { const updated = [...formData.schedule]; updated[index] = { ...updated[index], [field]: value }; setFormData((prev) => ({ ...prev, schedule: updated })) }
  const addScheduleItem = () => setFormData((prev) => ({ ...prev, schedule: [...prev.schedule, { time: "", title: "", description: "" }] }))
  const removeScheduleItem = (index: number) => { const s = [...formData.schedule]; s.splice(index,1); setFormData((prev) => ({ ...prev, schedule: s })) }

  const handlePhotoChange = (index: number, field: keyof Photo, value: string) => { const updated = [...formData.photos]; updated[index] = { ...updated[index], [field]: value }; setFormData((prev) => ({ ...prev, photos: updated })) }
  const addPhoto = () => setFormData((prev) => ({ ...prev, photos: [...prev.photos, { url: "", alt: "" }] }))
  const removePhoto = (index: number) => { const p = [...formData.photos]; p.splice(index,1); setFormData((prev) => ({ ...prev, photos: p })) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createEvent(formData)
    //   toast({ title: "Event Created", description: "The event has been successfully created." })
      router.push("/superadmin/events")
    } catch (error) {
      console.error("Error creating event:", error)
    //   toast({ title: "Error", description: "Failed to create event. Please try again.", variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/superadmin/events"><ArrowLeft className="h-4 w-4"/></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add Event</h1>
            <p className="text-gray-500">Create a new event</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} onBlur={handleSlugGeneration} required />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={handleSlugGeneration} className="h-5 text-xs text-blue-600 hover:text-blue-700">Generate from title</Button>
                </div>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2"><Label htmlFor="date">Date *</Label><Input id="date" name="date" type="date" value={formData.date} onChange={handleDateChange} required /></div>
                <div className="space-y-2"><Label htmlFor="time">Time *</Label><Input id="time" name="time" placeholder="e.g., 6:00 PM - 9:00 PM" value={formData.time} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="location">Location *</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} required /></div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="club">Hosting Club *</Label>
                <Select value={formData.club} onValueChange={(value) => handleSelectChange("club", value)} required>
                  <SelectTrigger><SelectValue placeholder="Select a club" /></SelectTrigger>
                  <SelectContent>{clubs.map((club) => (<SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2"><Label htmlFor="description">Short Description *</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required /></div>
              <div className="space-y-2"><Label htmlFor="longDescription">Detailed Description *</Label><Textarea id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleChange} rows={6} placeholder="You can use HTML formatting for rich text" required /></div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="maxCapacity">Maximum Capacity *</Label><Input id="maxCapacity" name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleChange} min={1} required /></div>
                <div className="space-y-2"><Label htmlFor="ticketPrice">Ticket Price</Label><Input id="ticketPrice" name="ticketPrice" placeholder="e.g., ₹500-1500 or Free" value={formData.ticketPrice} onChange={handleChange} /></div>
              </div>

              <div className="space-y-2"><Label htmlFor="categories">Categories (comma-separated) *</Label><Input id="categories" name="categories" placeholder="e.g., Workshop, Leadership, Competition" value={formData.categories.join(", ")} onChange={handleCategoryChange} required /></div>

              <div className="flex items-center space-x-2"><Checkbox id="highlighted" checked={formData.highlighted} onCheckedChange={(checked) => handleCheckboxChange("highlighted", Boolean(checked))} /><Label htmlFor="highlighted" className="flex items-center gap-1.5 font-normal text-sm text-gray-700 cursor-pointer"><Star className="h-4 w-4 text-yellow-500"/>Highlight this event (featured on homepage)</Label></div>
            </CardContent>
          </Card>

          {/* Speakers Card */}
          <Card>
            <CardHeader><CardTitle>Speakers & Performers</CardTitle><CardDescription>Add speakers or performers for this event</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {formData.speakers.map((speaker, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
                  <div className="flex justify-between items-center"><h3 className="font-medium">Speaker {index + 1}</h3><Button type="button" variant="ghost" size="sm" onClick={() => removeSpeaker(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash className="h-4 w-4 mr-1"/>Remove</Button></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Name *</Label><Input value={speaker.name} onChange={(e) => handleSpeakerChange(index, "name", e.target.value)} required /></div><div className="space-y-2"><Label>Role *</Label><Input value={speaker.role} onChange={(e) => handleSpeakerChange(index, "role", e.target.value)} placeholder="e.g., Keynote Speaker" required /></div></div>
                  <div className="space-y-2"><Label>Bio</Label><Textarea value={speaker.bio} onChange={(e) => handleSpeakerChange(index, "bio", e.target.value)} rows={2} /></div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={speaker.image} onChange={(e) => handleSpeakerChange(index, "image", e.target.value)} placeholder="URL to speaker's image" /></div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSpeaker} className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"><Plus className="h-4 w-4 mr-2"/>Add Speaker</Button>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader><CardTitle>Event Schedule</CardTitle><CardDescription>Add the schedule for this event</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {formData.schedule.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
                  <div className="flex justify-between items-center"><h3 className="font-medium">Schedule Item {index + 1}</h3><Button type="button" variant="ghost" size="sm" onClick={() => removeScheduleItem(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash className="h-4 w-4 mr-1"/>Remove</Button></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Time *</Label><Input value={item.time} onChange={(e) => handleScheduleChange(index, "time", e.target.value)} placeholder="e.g., 6:00 PM - 6:30 PM" required /></div><div className="space-y-2"><Label>Title *</Label><Input value={item.title} onChange={(e) => handleScheduleChange(index, "title", e.target.value)} required /></div></div>
                  <div className="space-y-2"><Label>Description</Label><Input value={item.description} onChange={(e) => handleScheduleChange(index, "description", e.target.value)} /></div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addScheduleItem} className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"><Plus className="h-4 w-4 mr-2"/>Add Schedule Item</Button>
            </CardContent>
          </Card>

          {/* Photos Card */}
          <Card>
            <CardHeader><CardTitle>Event Photos</CardTitle><CardDescription>Add photos for this event (optional)</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {formData.photos.map((photo, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
                  <div className="flex justify-between items-center"><h3 className="font-medium">Photo {index + 1}</h3><Button type="button" variant="ghost" size="sm" onClick={() => removePhoto(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash className="h-4 w-4 mr-1"/>Remove</Button></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Image URL</Label><Input value={photo.url} onChange={(e) => handlePhotoChange(index, "url", e.target.value)} placeholder="URL to photo" /></div><div className="space-y-2"><Label>Alt Text</Label><Input value={photo.alt} onChange={(e) => handlePhotoChange(index, "alt", e.target.value)} placeholder="Description of the photo" /></div></div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addPhoto} className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"><Plus className="h-4 w-4 mr-2"/>Add Photo</Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/superadmin/events")} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Creating Event...</>) : (<><Calendar className="mr-2 h-4 w-4"/>Create Event</>)}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
