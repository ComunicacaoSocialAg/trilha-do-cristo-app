import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGemini, type ImageAnalysisResult, type HikeData } from '@/hooks/useGemini';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || 'AIzaSyAgdWUGBqTthqH2-afU53Qv4Nxr2rGunCo');
  const [dragActive, setDragActive] = useState(false);
  
  const { analyzeImage, isLoading, error } = useGemini();
  const { toast } = useToast();
  const navigate = useNavigate();

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
  }, [toast]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !apiKey) {
      toast({
        title: "Dados incompletos",
        description: "Selecione uma imagem e informe a chave da API",
        variant: "destructive"
      });
      return;
    }

    try {
      localStorage.setItem('gemini-api-key', apiKey);
      const result = await analyzeImage(selectedImage, apiKey);
      
      // Save hike data to localStorage
      const hikeData: HikeData = {
        ...result.hikeData,
        // Add unique ID to this hike
        id: crypto.randomUUID()
      };
      
      // Get existing hikes or initialize empty array
      const existingHikesStr = localStorage.getItem('userHikes');
      const existingHikes: HikeData[] = existingHikesStr ? JSON.parse(existingHikesStr) : [];
      
      // Add new hike to the beginning of the array
      const updatedHikes = [hikeData, ...existingHikes];
      
      // Save updated hikes
      localStorage.setItem('userHikes', JSON.stringify(updatedHikes));
      
      toast({
        title: "Análise concluída!",
        description: "Os dados da trilha foram extraídos com sucesso.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: "Erro na análise",
        description: "Verifique a imagem e a chave da API e tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave da API Gemini</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Cole sua chave da API aqui..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Faça upload do print da tela do seu app de trilha/corrida
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button variant="outline" type="button">
                Selecionar Imagem
              </Button>
            </Label>
          </div>

          {imagePreview && (
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {selectedImage?.name} ({(selectedImage?.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedImage || !apiKey || isLoading}
            className="w-full bg-gradient-mountain shadow-glow hover:shadow-strong"
            size="lg"
          >
            {isLoading ? "Analisando..." : "Analisar Imagem da Trilha"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}