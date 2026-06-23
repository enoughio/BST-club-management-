import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Mock user - adjust fields as needed later
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
        role: "member" // Change to "admin" or "member" to test different roles,
    }

    const token = 'mock-token-12345'

    const res = NextResponse.json({ user })

    // Set cookies so middleware can detect authentication and role server-side
    res.cookies.set('x-bst-token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    res.cookies.set('x-bst-user-role', user.role, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    
    // redirect(`/${user.role}/dashboard`) // Redirect to dashboard after login

    return res
  } catch (err) {
    return NextResponse.json({ error: 'login failed' }, { status: 500 })
  }
}
