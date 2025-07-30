import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processImage = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Formato não suportado",
        description: "Por favor, envie uma imagem (PNG, JPG, etc.)",
        variant: "destructive"
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('hike-screenshots')
        .upload(fileName, selectedImage);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hike-screenshots')
        .getPublicUrl(fileName);

      toast({
        title: "Upload realizado!",
        description: "Imagem enviada com sucesso.",
      });

      onImageUploaded?.(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-4">
      <Label>Print do App (opcional)</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Arraste uma imagem aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Print da tela do seu app de trilha/corrida
        </p>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          id="image-upload"
        />
        <Label htmlFor="image-upload" className="cursor-pointer">
          <Button variant="outline" type="button" size="sm">
            Selecionar Imagem
          </Button>
        </Label>
      </div>

      {imagePreview && (
        <div className="space-y-3">
          <div className="relative aspect-video w-full max-w-xs mx-auto overflow-hidden rounded-lg border bg-muted">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-contain w-full h-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 rounded-full"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            {selectedImage?.name} ({selectedImage ? (selectedImage.size / 1024).toFixed(1) : '0'} KB)
          </div>
          
          <Button 
            onClick={uploadImage}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {uploading ? "Enviando..." : "Fazer Upload"}
          </Button>
        </div>
      )}
    </div>
  );
}