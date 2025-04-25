
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Video } from "lucide-react";

export function TalentShowcase() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | "">("");
  const [showcases, setShowcases] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchShowcases();
  }, []);
  
  async function fetchShowcases() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('talent_showcases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your showcases."
      });
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith("image/")) {
        setFileType("image");
      } else if (selectedFile.type.startsWith("video/")) {
        setFileType("video");
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image or video file."
        });
        setFile(null);
        setFileType("");
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !file || !fileType) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields and upload a file."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('talent-media')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('talent-media')
        .getPublicUrl(fileName);
      
      // Save showcase information to the database
      const { error: dbError } = await supabase
        .from('talent_showcases')
        .insert({
          user_id: user.id,
          title,
          description,
          media_url: publicUrl,
          media_type: fileType
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Success",
        description: "Your showcase has been uploaded successfully!"
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setFileType("");
      
      // Refresh showcases
      fetchShowcases();
      
    } catch (error) {
      console.error('Error uploading showcase:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your showcase. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Showcase</h1>
      
      <Card className="mb-8">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Add New Showcase</CardTitle>
            <CardDescription>
              Upload photos or videos to showcase your talent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                placeholder="Enter a title for your showcase" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe your showcase" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload Media</Label>
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="file" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">Images or videos (max 100MB)</p>
                  </div>
                  <Input 
                    id="file"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Showcase"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">My Showcases</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map((showcase) => (
          <Card key={showcase.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {showcase.media_type === 'image' ? (
                <img 
                  src={showcase.media_url} 
                  alt={showcase.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <video 
                  src={showcase.media_url}
                  className="object-cover w-full h-full" 
                  controls
                />
              )}
              <div className="absolute top-2 right-2">
                {showcase.media_type === 'image' ? (
                  <div className="bg-background/80 p-1 rounded-md">
                    <Image className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="bg-background/80 p-1 rounded-md">
                    <Video className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{showcase.title}</CardTitle>
              {showcase.description && (
                <CardDescription>{showcase.description}</CardDescription>
              )}
            </CardHeader>
          </Card>
        ))}
        
        {showcases.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">You haven't added any showcases yet. Upload your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
