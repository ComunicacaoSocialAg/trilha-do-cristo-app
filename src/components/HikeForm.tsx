import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';

interface HikeData {
  id: string;
  name: string;
  date: string;
  duration: string;
  distance: string;
  elevation?: string;
  location?: string;
  imageUrl?: string;
}

export function HikeForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get current user
  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !distance) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos para registrar sua trilha.",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Usuário não autenticado",
          description: "Faça login para registrar suas trilhas.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Create hike data
      const hikeData: HikeData = {
        id: crypto.randomUUID(),
        name: `Trilha de ${new Date(date).toLocaleDateString('pt-BR')}`,
        date,
        duration: time,
        distance,
        imageUrl
      };
      
      // Get existing hikes or initialize empty array
      const storageKey = `userHikes_${user.id}`;
      const existingHikesStr = localStorage.getItem(storageKey);
      const existingHikes: HikeData[] = existingHikesStr ? JSON.parse(existingHikesStr) : [];
      
      // Add new hike to the beginning of the array
      const updatedHikes = [hikeData, ...existingHikes];
      
      // Save updated hikes
      localStorage.setItem(storageKey, JSON.stringify(updatedHikes));
      
      toast({
        title: "Trilha registrada!",
        description: "Sua trilha foi salva com sucesso.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving hike:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Registrar Trilha
        </CardTitle>
        <CardDescription>
          Preencha os dados da sua trilha manualmente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Tempo (formato: HH:MM)</Label>
            <Input
              id="time"
              type="text"
              placeholder="01:30"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              pattern="[0-9]{1,2}:[0-9]{2}"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distance">Distância (km)</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="5.2"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>
          
          <ImageUpload onImageUploaded={setImageUrl} />
          
          <Button
            type="submit" 
            className="w-full bg-gradient-mountain shadow-glow hover:shadow-strong"
            size="lg"
          >
            Salvar Trilha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}