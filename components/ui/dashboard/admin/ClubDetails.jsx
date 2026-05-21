import React from "react";
// import { fetchClubData } from '@/utils/club.js'

// TODO: fetch data of admin of the club and pass that admin name to club detaisl component

const props = {
  clubId: "12345",  
  clubName: "Book Club",
  clubDescription: "A club for book lovers",
  clubAdmin: "John Doe",
  mettingDetails: "Every Saturday at 10 AM",
  clubMembers: 42,
  clubImage: "https://example.com/club-image.jpg",
  clubAdmin : "John Doe",
  clubEmail : "books@example.com",
  clubPhone : "123-456-7890",
  clubLocation : "123 Book St, Booktown",
  // clubWebsite : "https://bookclub.example.com",
  clubSocialMedia : {
    facebook: "https://facebook.com/bookclub",
    twitter: "https://twitter.com/bookclub",
    instagram: "https://instagram.com/bookclub",
  },

}


const ClubDetails = ({  }) => {
  // const {clubId} = props
  // const clubData = fetchClubData(clubId)

  return (
     <div className="border-2 flex items-start min-w-[500px] max-w-[500px] justify-center gap-5 p-5 rounded-lg shadow-md bg">   
   
         <ul>
            <li>
              Club Id: <strong>{props.clubId}</strong>
            </li>
            <li>
              Club Name: <strong>{props.clubName}</strong>
            </li>
            <li>
              Club Description: <strong>{props.clubDescription}</strong>
            </li>
            <li>
              Club Admin: <strong>{props.clubAdmin}</strong>
            </li>
            <li>
              Meeting Details: <strong>{props.mettingDetails}</strong>
            </li>
            <li>
              Club Members: <strong>{props.clubMembers}</strong>
            </li>
            <li>
              Club Email: <strong>{props.clubEmail}</strong>
            </li>
  
            <li>
              Club Phone: <strong>{props.clubPhone}</strong>
            </li>
  
            <li>
              Club Location: <strong>{props.clubLocation}</strong>
            </li>
         </ul>
   
       </div>
  );
};

export default ClubDetails;
