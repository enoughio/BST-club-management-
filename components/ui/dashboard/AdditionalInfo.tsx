import React from "react"
import { PenIcon } from "lucide-react"

const additionalInfo = {
  address: "123, Main Street, City, Country",
  occupation: "Software Engineer",
  dob: "01-01-1990",
}

const AdditionalInfo: React.FC = () => {
  return (
    <div className="md:min-w-112.5  border shadow-xl flex  flex-col gap-2 px-5 py-3 rounded-2xl ">
      <h1 className="text-xl font-semibold">Additional info</h1>

      <ul>
        <li className="font-light text-xs">Address: </li>
        <li>{additionalInfo.address} </li>
        <li className="font-light text-xs">Occupation: </li>
        <li> {additionalInfo.occupation} </li>
        <li className="font-light text-xs">Date of birth: </li>
        <li> {additionalInfo.dob} </li>
      </ul>
      <div className="self-end flex justify-center items-center mr-3 font-thin text-gray-500">
        <h1>edit</h1>
        <PenIcon /> {" "}
      </div>
    </div>
  )
}

export default AdditionalInfo
