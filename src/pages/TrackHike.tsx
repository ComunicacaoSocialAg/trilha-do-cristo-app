import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Timer, Mountain, Calendar, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TrackHike() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    distance: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    toast({
      title: "Tracking iniciado!",
      description: "Registrando sua trilha. Bom treino!",
    });
    // In a real app, we would start GPS tracking here
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    toast({
      title: "Tracking finalizado!",
      description: "Sua trilha foi registrada com sucesso.",
    });
    // In a real app, we would stop GPS tracking and save the data
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Trilha salva com sucesso!",
      description: "Seus dados foram registrados no sistema.",
    });
    
    // In a real app, we would save the data to a database
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Tracking Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-primary" />
                  Tracking ao Vivo
                </CardTitle>
                <CardDescription>
                  Registre sua trilha em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-md mb-4">
                  {isTracking ? (
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2 text-primary animate-pulse">
                        {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
                      </div>
                      <p className="text-muted-foreground">Tempo de trilha</p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Mountain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Inicie o tracking para registrar sua trilha</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={isTracking ? "destructive" : "hero"}
                  size="lg"
                  className="w-full"
                  onClick={isTracking ? handleStopTracking : handleStartTracking}
                >
                  {isTracking ? "Parar Tracking" : "Iniciar Tracking"}
                </Button>
              </CardContent>
            </Card>
            
            {/* Manual Entry Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  Registro Manual
                </CardTitle>
                <CardDescription>
                  Registre os detalhes da sua trilha manualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Trilha</Label>
                      <Input 
                        id="name"
                        name="name"
                        placeholder="Ex: Trilha do Cristo"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input 
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duração (min)</Label>
                        <Input 
                          id="duration"
                          name="duration"
                          type="number"
                          placeholder="Ex: 45"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="distance">Distância (km)</Label>
                        <Input 
                          id="distance"
                          name="distance"
                          type="number"
                          step="0.01"
                          placeholder="Ex: 3.5"
                          value={formData.distance}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea 
                        id="notes"
                        name="notes"
                        placeholder="Compartilhe sua experiência, dificuldades, etc."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-mountain shadow-glow hover:shadow-strong"
                      size="lg"
                    >
                      Salvar Trilha
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}