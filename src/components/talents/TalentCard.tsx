
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TalentCardProps {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  category: string;
  description: string;
  followers: number;
  location?: string;
}

export function TalentCard({
  id,
  name,
  avatar,
  coverImage,
  category,
  description,
  followers,
  location,
}: TalentCardProps) {
  // Get initials from talent name
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Link to={`/talents/${id}`}>
      <Card className="talent-card overflow-hidden h-full">
        <div 
          className="h-40 bg-gradient-to-r from-talent-light to-talent bg-cover bg-center"
          style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
        >
          <div className="w-full h-full bg-black/10"></div>
        </div>
        
        <CardContent className="p-5 relative">
          <div className="absolute -top-8 left-4 border-4 border-background rounded-full">
            <Avatar className="h-16 w-16">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} />
              ) : (
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">{name}</h3>
              <Badge variant="outline" className="bg-talent-light text-talent-dark">
                {category}
              </Badge>
            </div>
            
            {location && (
              <p className="text-sm text-muted-foreground">{location}</p>
            )}
            
            <p className="text-sm line-clamp-2">{description}</p>
            
            <div className="text-xs text-muted-foreground pt-2">
              {followers.toLocaleString()} followers
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
