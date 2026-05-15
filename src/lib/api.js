
const API_BASE_URL = "https://api.example.com/v1"

// Generic function to handle API requests
async function handleRequest(
  endpoint,
  method = "GET",
  data = null,
  customHeaders = {},
) {
  // In a real app, this would make actual API calls
  // For the demo, we'll simulate responses with a delay

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer kjaslkdfjlaskdjflkas`,
    ...customHeaders,
  }

  const options = {
    method,
    headers,
  }

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data)
  }

  // For demo purposes, simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // This is where the real fetch would happen
  // const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // For demo, return mock data based on the endpoint and method
  return getMockResponse(endpoint, method, data)
}

function getMockResponse(endpoint, method, data) {
  // Mock responses based on endpoint
  if (endpoint.includes("/members") && method === "GET") {
    return mockMembers
  }

  if (endpoint.includes("/clubs") && method === "GET") {
    return mockClubs
  }

  if (endpoint.includes("/events") && method === "GET") {
    return mockEvents
  }

  if (endpoint.includes("/meetings") && method === "GET") {
    return mockMeetings
  }

  if (endpoint.includes("/projects") && method === "GET") {
    return mockProjects
  }

  if (endpoint.includes("/requests") && method === "GET") {
    return mockRequests
  }

  // For POST/PUT operations, return the data that was sent with an id
  if (method === "POST") {
    return { id: Math.floor(Math.random() * 1000), ...data, createdAt: new Date().toISOString() }
  }

  if (method === "PUT" || method === "PATCH") {
    return { ...data, updatedAt: new Date().toISOString() }
  }

  if (method === "DELETE") {
    return { success: true, message: "Resource deleted successfully" }
  }

  return { message: "No mock data available for this endpoint" }
}

// Mock data
const mockMembers = [
  {
    id: "1",
    first_name: "Alice",
    last_name: "Johnson",
    username: "alicejohnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    avatar: null,
    address: "123 Main St",
    gender: "female",
    dob: "1990-01-15",
    id_proof: "ABCD1234",
    club: "1",
    occupation: "Software Engineer",
    membershipExpiryDate: "2024-12-31",
  },
  {
    id: "2",
    first_name: "Bob",
    last_name: "Smith",
    username: "bobsmith",
    email: "bob@example.com",
    phone: "987-654-3210",
    avatar: null,
    address: "456 Elm St",
    gender: "male",
    dob: "1985-05-20",
    id_proof: "EFGH5678",
    club: "1",
    occupation: "Marketing Manager",
    membershipExpiryDate: "2023-11-15",
  },
  {
    id: "3",
    first_name: "Charlie",
    last_name: "Brown",
    username: "charliebrown",
    email: "charlie@example.com",
    phone: "555-123-4567",
    avatar: null,
    address: "789 Oak St",
    gender: "male",
    dob: "1992-10-08",
    id_proof: "IJKL9012",
    club: "2",
    occupation: "Architect",
    membershipExpiryDate: "2024-03-22",
  },
  {
    id: "4",
    first_name: "Diana",
    last_name: "Miller",
    username: "dianamiller",
    email: "diana@example.com",
    phone: "333-888-9999",
    avatar: null,
    address: "101 Pine St",
    gender: "female",
    dob: "1988-04-30",
    id_proof: "MNOP3456",
    club: "1",
    occupation: "Financial Analyst",
    membershipExpiryDate: "2023-12-15",
  },
  {
    id: "5",
    first_name: "Edward",
    last_name: "Garcia",
    username: "edwardgarcia",
    email: "edward@example.com",
    phone: "777-222-3333",
    avatar: null,
    address: "202 Maple St",
    gender: "male",
    dob: "1995-11-12",
    id_proof: "QRST7890",
    club: "2",
    occupation: "Teacher",
    membershipExpiryDate: "2024-06-30",
  },
]

const mockClubs = [
  {
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
  },
  {
    id: "2",
    name: "Delhi Orators",
    address: "123 MG Road, Connaught Place, New Delhi",
    city: "New Delhi",
    meetingTime: "Wednesdays, 7:00 PM",
    position: [28.6139, 77.209],
    dmsPosition: "28°36'50.0\"N 77°12'32.0\"E",
    members: 45,
    image: "",
    description:
      "Delhi Orators is one of the oldest and most established public speaking clubs in the capital region. We focus on developing communication and leadership skills in a supportive environment.",
    Admin: "Priya Sharma",
    email: "priya@example.com",
    phone: "999-888-7777",
  },
  {
    id: "3",
    name: "Mumbai Speakers",
    address: "Andheri West, Mumbai, Maharashtra",
    city: "Mumbai",
    meetingTime: "Fridays, 6:00 PM",
    position: [19.076, 72.8777],
    dmsPosition: "19°4'33.6\"N 72°52'39.7\"E",
    members: 38,
    image: "",
    description:
      "Mumbai Speakers welcomes professionals from all backgrounds who want to improve their communication and leadership skills. Our diverse membership provides varied perspectives and feedback.",
    Admin: "Rahul Desai",
    email: "rahul@example.com",
    phone: "888-777-6666",
  },
]

const mockEvents = [
  {
    id: "1",
    title: "Bhopal International Storytelling Fest",
    slug: "BISF",
    description:
      "Join us for an evening of captivating stories that bridge cultures and generations. Our expert storytellers will take you on a journey through time and tradition.",
    date: "2023-12-15",
    formattedDate: "December 15, 2023",
    time: "6:00 PM - 9:00 PM",
    location: "Cultural Center, New Delhi",
    image: "",
    highlighted: true,
    club: "1",
    attendees: 120,
    maxCapacity: 200,
    ticketPrice: "₹500-1500",
    categories: ["Cultural", "Performance", "Educational"],
  },
  {
    id: "2",
    title: "Leadership Workshop",
    slug: "leadership-workshop-2023",
    description:
      "An intensive workshop focusing on essential leadership skills for today's professionals. Learn how to inspire teams and navigate challenges effectively.",
    date: "2023-11-20",
    formattedDate: "November 20, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Conference Hall, Bangalore",
    image: "",
    highlighted: false,
    club: "2",
    attendees: 85,
    maxCapacity: 100,
    ticketPrice: "₹1000",
    categories: ["Workshop", "Professional Development", "Leadership"],
  },
  {
    id: "3",
    title: "Public Speaking Championship",
    slug: "speaking-championship-2024",
    description:
      "The annual competition where the best speakers compete for recognition and prizes. Categories include prepared speeches, impromptu speaking, and storytelling.",
    date: "2024-01-30",
    formattedDate: "January 30, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Auditorium, Mumbai",
    image: "",
    highlighted: true,
    club: "3",
    attendees: 0,
    maxCapacity: 300,
    ticketPrice: "₹750",
    categories: ["Competition", "Speaking", "Awards"],
  },
]

const mockMeetings = [
  {
    id: "1",
    title: "Weekly Club Meeting",
    date: "2023-11-22",
    time: "6:30 PM - 8:30 PM",
    location: "Main Club Room",
    description: "Regular weekly meeting with prepared speeches and evaluations",
    club: "1",
    roles: [
      { role: "Toastmaster of the Evening", assignedTo: "1" },
      { role: "Timer", assignedTo: "2" },
      { role: "Ah Counter", assignedTo: "4" },
      { role: "Grammarian", assignedTo: null },
      { role: "Speaker 1", assignedTo: "2" },
      { role: "Speaker 2", assignedTo: "1" },
      { role: "Evaluator 1", assignedTo: "4" },
      { role: "Evaluator 2", assignedTo: null },
    ],
  },
  {
    id: "2",
    title: "Executive Committee Meeting",
    date: "2023-11-29",
    time: "5:30 PM - 6:30 PM",
    location: "Conference Room",
    description: "Monthly executive committee meeting to discuss club business",
    club: "1",
    roles: [
      { role: "President", assignedTo: "1" },
      { role: "VP Education", assignedTo: "2" },
      { role: "VP Membership", assignedTo: "4" },
      { role: "Secretary", assignedTo: null },
    ],
  },
  {
    id: "3",
    title: "Workshop: Effective Evaluations",
    date: "2023-12-06",
    time: "6:30 PM - 8:30 PM",
    location: "Main Club Room",
    description: "Special workshop on how to give effective evaluations",
    club: "1",
    roles: [
      { role: "Workshop Leader", assignedTo: "1" },
      { role: "Timer", assignedTo: "2" },
      { role: "Assistant", assignedTo: null },
    ],
  },
]

const mockProjects = [
  {
    id: "1",
    title: "Ice Breaker",
    description: "First speech project focusing on introducing yourself to the club",
    level: "Level 1",
    assignedTo: "4",
    status: "Completed",
    completedDate: "2023-10-15",
    club: "1",
    feedback: "Great first speech! Effectively introduced yourself and showed your enthusiasm.",
  },
  {
    id: "2",
    title: "Researching and Presenting",
    description: "Research a topic, organize supporting materials, and deliver a well-organized speech",
    level: "Level 2",
    assignedTo: "2",
    status: "In Progress",
    completedDate: null,
    club: "1",
    feedback: "",
  },
  {
    id: "3",
    title: "Focus on the Positive",
    description: "Practice using language that shows positivity in your speech",
    level: "Level 3",
    assignedTo: "1",
    status: "Completed",
    completedDate: "2023-09-22",
    club: "1",
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
    club: "1",
    feedback: "",
  },
]

const mockRequests = [
  {
    id: "1",
    type: "MemberRemoval",
    requestedBy: "1",
    requestedDate: "2023-11-10",
    status: "Pending",
    club: "1",
    details: {
      memberId: "5",
      reason: "Member has relocated to another city",
    },
  },
  {
    id: "2",
    type: "FreezeClub",
    requestedBy: "1",
    requestedDate: "2023-11-05",
    status: "Approved",
    club: "1",
    details: {
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      reason: "Holiday season break",
    },
  },
  {
    id: "3",
    type: "EventCancellation",
    requestedBy: "1",
    requestedDate: "2023-11-12",
    status: "Rejected",
    club: "1",
    details: {
      eventId: "2",
      reason: "Insufficient registrations",
    },
  },
]

// API functions
// Members
//TODO: try to use a single function for getMembers and getMember]
//TODO: try to do it in a more generic way

export const getMembers = async (clubId) => {
  const endpoint = clubId ? `/members?club=${clubId}` : "/members"
  return handleRequest(endpoint)
}

export const getMember = async (id) => {
  return handleRequest(`/members/${id}`)
}

export const createMember = async (data) => {
  return handleRequest("/members", "POST", data)
}

export const updateMember = async (id, data) => {
  return handleRequest(`/members/${id}`, "PUT", data)
}

export const renewMember = async (id, expiryDate) => {
  return handleRequest(`/members/${id}/renew`, "POST", { expiryDate })
}

export const reinstateMember = async (id) => {
  return handleRequest(`/members/${id}/reinstate`, "POST")
}

// Clubs
export const getClubs = async () => {
  return handleRequest("/clubs")
}

export const getClub = async (id) => {
  return handleRequest(`/clubs/${id}`)
}

export const createClub = async (data) => {
  return handleRequest("/clubs", "POST", data)
}

export const updateClub = async (id, data) => {
  return handleRequest(`/clubs/${id}`, "PUT", data)
}

// Events
export const getEvents = async (clubId) => {
  const endpoint = clubId ? `/events?club=${clubId}` : "/events"
  return handleRequest(endpoint)
}

export const getEvent = async (id) => {
  return handleRequest(`/events/${id}`)
}

export const createEvent = async (data) => {
  return handleRequest("/events", "POST", data)
}

export const updateEvent = async (id, data) => {
  return handleRequest(`/events/${id}`, "PUT", data)
}

export const highlightEvent = async (id, highlighted) => {
  return handleRequest(`/events/${id}/highlight`, "POST", { highlighted })
}

export const deleteEvent = async (id) => {
  return handleRequest(`/events/${id}`, "DELETE")
}

// Meetings
export const getMeetings = async (clubId) => {
  return handleRequest(`/meetings?club=${clubId}`)
}

export const getMeeting = async (id) => {
  return handleRequest(`/meetings/${id}`)
}

export const createMeeting = async (data) => {
  return handleRequest("/meetings", "POST", data)
}

export const updateMeeting = async (id, data) => {
  return handleRequest(`/meetings/${id}`, "PUT", data)
}

export const assignRole = async (meetingId, roleIndex, memberId) => {
  return handleRequest(`/meetings/${meetingId}/roles/${roleIndex}`, "PATCH", { assignedTo: memberId })
}

// Projects
export const getProjects = async (clubId) => {
  return handleRequest(`/projects?club=${clubId}`)
}

export const getProject = async (id) => {
  return handleRequest(`/projects/${id}`)
}

export const createProject = async (data) => {
  return handleRequest("/projects", "POST", data)
}

export const updateProject = async (id, data) => {
  return handleRequest(`/projects/${id}`, "PUT", data)
}

export const assignProject = async (id, memberId) => {
  return handleRequest(`/projects/${id}/assign`, "POST", { memberId })
}

export const completeProject = async (id, feedback) => {
  return handleRequest(`/projects/${id}/complete`, "POST", {
    completedDate: new Date().toISOString(),
    feedback,
  })
}

// Requests
export const getRequests = async (clubId) => {
  const endpoint = clubId ? `/requests?club=${clubId}` : "/requests"
  return handleRequest(endpoint)
}

export const createRequest = async (data) => {
  return handleRequest("/requests", "POST", data)
}

export const updateRequestStatus = async (id, status) => {
  return handleRequest(`/requests/${id}/status`, "PATCH", { status })
}

export default {
  getMembers,
  getMember,
  createMember,
  updateMember,
  renewMember,
  reinstateMember,
  getClubs,
  getClub,
  createClub,
  updateClub,
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  highlightEvent,
  deleteEvent,
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  assignRole,
  getProjects,
  getProject,
  createProject,
  updateProject,
  assignProject,
  completeProject,
  getRequests,
  createRequest,
  updateRequestStatus,
}

