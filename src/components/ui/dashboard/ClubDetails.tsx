import React from "react"

type Club = {
  clubId?: string
  clubName?: string
  clubDescription?: string
  clubAdmin?: string
  mettingDetails?: string
  clubMembers?: number
  clubImage?: string
  clubEmail?: string
  clubPhone?: string
  clubLocation?: string
  clubSocialMedia?: Record<string, string>
}

const defaultProps: Club = {
  clubId: "12345",
  clubName: "Book Club",
  clubDescription: "A club for book lovers",
  clubAdmin: "John Doe",
  mettingDetails: "Every Saturday at 10 AM",
  clubMembers: 42,
  clubImage: "https://example.com/club-image.jpg",
  clubEmail: "books@example.com",
  clubPhone: "123-456-7890",
  clubLocation: "123 Book St, Booktown",
  clubSocialMedia: {
    facebook: "https://facebook.com/bookclub",
    twitter: "https://twitter.com/bookclub",
    instagram: "https://instagram.com/bookclub",
  },
}

const ClubDetails: React.FC<{ club?: Club }> = ({ club = defaultProps }) => {
  return (
    <div className="border-2 flex items-start min-w-[500px] max-w-[500px] justify-center gap-5 p-5 rounded-lg shadow-md bg">
      <ul>
        <li>
          Club Id: <strong>{club.clubId}</strong>
        </li>
        <li>
          Club Name: <strong>{club.clubName}</strong>
        </li>
        <li>
          Club Description: <strong>{club.clubDescription}</strong>
        </li>
        <li>
          Club Admin: <strong>{club.clubAdmin}</strong>
        </li>
        <li>
          Meeting Details: <strong>{club.mettingDetails}</strong>
        </li>
        <li>
          Club Members: <strong>{club.clubMembers}</strong>
        </li>
        <li>
          Club Email: <strong>{club.clubEmail}</strong>
        </li>

        <li>
          Club Phone: <strong>{club.clubPhone}</strong>
        </li>

        <li>
          Club Location: <strong>{club.clubLocation}</strong>
        </li>
      </ul>
    </div>
  )
}

export default ClubDetails
