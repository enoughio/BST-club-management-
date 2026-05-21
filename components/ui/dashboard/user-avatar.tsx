import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "../card";
// import { Card, CardContent } from "@/components/ui/Home/WhyChoseUsCard";

const UserAvatar = ({ email, avatar, username } : {
  email?: string
  avatar?: string
  username: string
} )  => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-semibold text-primary">{username}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAvatar;



// const WhyChoseUsCard = ({ image, title, description } : {
//   image: string, 
//   title: string,
//   description: string
// }) => {
//   return (
//     <div className="relative flex flex-col bg-whiterounded-lg w-[97%] md:w-1/3 ">
//       <div className="relative h-56 mb-2 overflow-hidden text-white rounded-md">
//         <img src={image} alt="card-image" className="object-cover w-full h-full" />
//       </div>
//       <div className="px-4 bg-blue-100 p-4 rounded-b-lg">
//         <h6 className="mb-1 text-slate-800 text-xl font-semibold">{title}</h6>
//         <p className=" leading-5 ">{description}</p>
//       </div>
//     </div>
//   );
// };

