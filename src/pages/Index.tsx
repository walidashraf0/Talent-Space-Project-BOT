
import { useState } from "react";
import { TalentCard } from "../components/talents/TalentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for the frontend demo
const mockTalents = [
  {
    id: "1",
    name: "Emma Johnson",
    category: "Singer",
    description: "Award-winning vocalist specializing in jazz and soul music. Looking for opportunities to perform at events and collaborate with producers.",
    followers: 1243,
    location: "New York, USA",
    coverImage: "https://images.unsplash.com/photo-1503214989233-7f8e6e766c4e",
  },
  {
    id: "2",
    name: "Michael Chen",
    category: "Actor",
    description: "Professional actor with experience in theater and film. Seeking roles in independent films and drama series.",
    followers: 891,
    location: "Los Angeles, USA",
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    category: "Dancer",
    description: "Contemporary and ballet dancer with 10+ years of experience. Open to performance opportunities and teaching positions.",
    followers: 2105,
    location: "London, UK",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
  },
  {
    id: "4",
    name: "David Kim",
    category: "Magician",
    description: "Innovative illusionist blending technology with traditional magic. Available for corporate events and private shows.",
    followers: 578,
    location: "Chicago, USA",
  },
  {
    id: "5",
    name: "Priya Patel",
    category: "Photographer",
    description: "Visual storyteller capturing moments through a unique lens. Looking for brand partnerships and exhibition opportunities.",
    followers: 1876,
    location: "Mumbai, India",
    coverImage: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34",
  },
  {
    id: "6",
    name: "James Wilson",
    category: "Musician",
    description: "Multi-instrumentalist and composer seeking collaborations with other artists and producers. Specializes in ambient and electronic music.",
    followers: 932,
    location: "Berlin, Germany",
  },
];

const categories = ["All", "Singer", "Actor", "Dancer", "Musician", "Magician", "Photographer"];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTalents = mockTalents.filter((talent) => {
    const matchesCategory = activeCategory === "All" || talent.category === activeCategory;
    const matchesSearch = 
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      talent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (talent.location && talent.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Talents</h1>
          <p className="text-muted-foreground">
            Find and support emerging talent across various creative fields
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search talents..."
              className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <Tabs defaultValue="All" className="space-y-6" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-2 flex h-9 flex-wrap overflow-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="min-w-[80px] rounded-md"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {filteredTalents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTalents.map((talent) => (
                <TalentCard key={talent.id} {...talent} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No talents found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or category filter
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                View all talents
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
