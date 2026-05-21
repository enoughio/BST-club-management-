import Image from "next/image";
import React from "react";

const adminData = {
  name: "John Doe",
  username: "johndoe",
  adminId: "21A",
  age: 30,
  email: "admin@example.com",
  isStaff: true,
  clubId: "12345",
  clubName: "Book Club",
  adminPhone: "+1234567890",
  // Add more fields as needed
  
};

const AdminDetails = () => {
  return (
    <div className="border-2 flex items-start max-w-[500px] justify-center gap-5 p-5 rounded-lg shadow-md bg">   

      <ul>
        <li>
          Admin Id: <strong>{adminData.adminId}</strong>
        </li>
        <li>
          Admin Name: <strong>{adminData.name}</strong>
        </li>
        <li>
          Admin Username: <strong>{adminData.username}</strong>
        </li>
        <li>
          Admin Email: <strong>{adminData.email}</strong>
        </li>
        <li>
          Admin Age: <strong>{adminData.age}</strong>
        </li>
        <li>
          Is Staff: <strong>{adminData.isStaff ? "Yes" : "No"}</strong>
        </li>

        <li>
          Your Name: <strong>{adminData.clubName}</strong>
        </li>
        <li>
          Club Id: <strong>{adminData.clubId}</strong>
        </li>
        <li>
          Admin Phone: <strong>{adminData.adminPhone}</strong>
        </li>
      </ul>

      <Image
          src="/images/admin.jpg"
          alt="Admin Image" 
          width={100}
          height={100}
          className="rounded-full border-2 border-gray-300 shadow-md"
        />

    </div>
  );
};

export default AdminDetails;
