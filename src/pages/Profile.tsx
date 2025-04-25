
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { TalentShowcase } from "../components/showcase/TalentShowcase";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold">Not Authenticated</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Get initials from user name
  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleSave = () => {
    // In a real app, this would make an API call to update the profile
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="relative pb-8">
          <div className="absolute right-6 top-6">
            <Badge
              className={`${
                user.userType === "talent"
                  ? "bg-talent text-white"
                  : user.userType === "mentor"
                  ? "bg-mentor text-white"
                  : "bg-investor text-white"
              }`}
            >
              {user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="mt-4 space-y-1 text-center sm:mt-0 sm:text-left">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Information</TabsTrigger>
              {user.userType === "talent" && <TabsTrigger value="showcase">My Showcase</TabsTrigger>}
              {user.userType === "investor" && <TabsTrigger value="investments">My Investments</TabsTrigger>}
              {user.userType === "mentor" && <TabsTrigger value="mentees">Mentees</TabsTrigger>}
            </TabsList>

            <TabsContent value="info">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">About</h3>
                    <p className="text-muted-foreground mt-1">
                      {bio || "No bio provided yet."}
                    </p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit profile</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="showcase">
              <TalentShowcase />
            </TabsContent>

            <TabsContent value="investments">
              <div className="space-y-4">
                <h3 className="font-medium">My Investments</h3>
                <div className="grid gap-4">
                  {/* We'll fetch and display investments here */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mentees" className="space-y-4">
              <h3 className="font-medium">My Mentees</h3>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No mentees yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with talents to start mentoring them
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
