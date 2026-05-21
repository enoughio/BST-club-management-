import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Return mock user data. In future, authenticate using cookies/session.

        const user = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        inicative: "Bhopal Storytellers",
        avatar: null,
        address: "123 Main St, Bhopal, MP",
        gender: "male",
        dob: "1990-01-15",
        id_proof: "ABCD1234", 
        clubId: "1",
        clubName: "Bhopal Storytellers",
        occupation: "Software Engineer",
        membershipExpiryDate: "2023-05-15",
        joinDate: "2022-05-15",
        bio: "Passionate about public speaking and leadership development. I joined Storytellers to improve my communication skills and connect with like-minded individuals.",
        role: "superadmin",
    }

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: 'could not fetch user' }, { status: 500 })
  }
}
