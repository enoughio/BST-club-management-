import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const user = {
  username: "JohnDoe",
  firstName: "John",
  lastName: "Doe",
  email: "example@gmail.com",
  Phone: "1234567890",
  gender: "male",
};

const BasicInfo = (props) => {
  const {
    username = "JohnDoe",
    firstName = "John",
    lastName = "Doe",
    email = "example@gmail.com",
    Phone = "1234567890",
    gender = "male",
  } = props.user;

  return (
    <div className="md:min-w-[450px] border shadow-xl flex  flex-col gap-2 px-5 py-3 rounded-2xl ">
      <div className="self-start flex items-center justify-between w-full my-3">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h5>Id: {username}</h5>
      </div>

      <div>
        <ul className="leading-6 text-sm flex flex-col gap-2">
          <div>
          <li className="font-light text-xs">First Name: </li>
          <li>{firstName}</li>
          </div>

          <div>

          <li className="font-light text-xs">Last Name:</li>
          <li>{lastName}</li>
          </div>

          <div>

          <li className="font-light text-xs">Email:</li>
          <li>{email}</li>
          </div>

          <div>

          <li className="font-light text-xs">Phone:</li>
          <li>{Phone}</li>
          </div>

          <div>
          <li className="font-light text-xs">Gender:</li>
          <li>{gender}</li>
          </div>
        </ul>
      </div>

      <div className="self-end flex justify-center items-center mr-3 font-thin text-gray-500">
        <h1>edit</h1>
        <PenIcon />{" "}
      </div>
    </div>
  );
};

export default BasicInfo;
