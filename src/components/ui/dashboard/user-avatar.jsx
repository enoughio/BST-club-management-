import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/Home/WhyChoseUsCard";

const UserAvatar = ({ email, avatar, username }) => {
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

