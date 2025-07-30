import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';

interface HikeData {
  id: string;
  date: string;
  time: string;
  distance: string;
  imageUrl?: string;
}

export function HikeForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !distance) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos para registrar sua trilha.",
        variant: "destructive"
      });
      return;
    }

    // Create hike data
    const hikeData: HikeData = {
      id: crypto.randomUUID(),
      date,
      time,
      distance,
      imageUrl
    };
    
    // Get existing hikes or initialize empty array
    const existingHikesStr = localStorage.getItem('userHikes');
    const existingHikes: HikeData[] = existingHikesStr ? JSON.parse(existingHikesStr) : [];
    
    // Add new hike to the beginning of the array
    const updatedHikes = [hikeData, ...existingHikes];
    
    // Save updated hikes
    localStorage.setItem('userHikes', JSON.stringify(updatedHikes));
    
    toast({
      title: "Trilha registrada!",
      description: "Sua trilha foi salva com sucesso.",
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
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