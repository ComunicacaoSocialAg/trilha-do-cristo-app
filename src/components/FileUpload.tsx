import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type AnalysisResult } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export function FileUpload({ onAnalysisComplete }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
  const [dragActive, setDragActive] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Formato não suportado",
          description: "Por favor, envie arquivos .txt ou .csv",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Formato não suportado",
          description: "Por favor, envie arquivos .txt ou .csv",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "Arquivo necessário",
        description: "Selecione um arquivo para análise.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate analysis with mock data
      const mockResult: AnalysisResult = {
        runners: [
          { position: 1, name: "Carlos Santos", time: "24:15", city: "Poços de Caldas", trend: "+2", badge: "Recordista" },
          { position: 2, name: "Bruno Garcia", time: "26:30", city: "Poços de Caldas", trend: "=", badge: "Consistente" },
          { position: 3, name: "João Pereira", time: "27:45", city: "Poços de Caldas", trend: "+1", badge: "Em Alta" }
        ],
        stats: {
          totalParticipants: 89,
          averageTime: "32:15",
          bestTime: "24:15"
        }
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onAnalysisComplete(mockResult);
      toast({
        title: "Análise concluída!",
        description: "Os dados do ranking foram atualizados.",
      });
    } catch (err) {
      setError("Erro ao processar arquivo");
      toast({
        title: "Erro na análise",
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">

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
              Arraste um arquivo aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Formatos suportados: .txt, .csv (dados dos participantes da trilha)
            </p>
            <Input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" type="button">
                Selecionar Arquivo
              </Button>
            </Label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
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
            disabled={!selectedFile || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Analisando..." : "Analisar Dados da Trilha"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}