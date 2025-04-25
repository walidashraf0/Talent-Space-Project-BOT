
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function TalentShowcase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showcases, setShowcases] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('talent-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('talent-media')
        .getPublicUrl(filePath);

      // Save showcase to database
      const { error: dbError } = await supabase
        .from('talent_showcases')
        .insert({
          user_id: user?.id,
          title,
          description,
          media_url: publicUrl,
          media_type: file.type.startsWith('image/') ? 'image' : 'video'
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Your showcase has been uploaded successfully.",
      });

      // Reset form
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload your showcase. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Showcase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your showcase"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your talent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media">Media Upload</Label>
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>

          <Button disabled={uploading}>
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <upload className="mr-2 h-4 w-4" />
                Upload Showcase
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
