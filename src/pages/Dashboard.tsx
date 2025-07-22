import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, TrendingUp, Award, List, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Ranking } from "@/components/Ranking";

interface HikeData {
  id: string;
  name: string;
  date: string;
  duration: string;
  distance: string;
  elevation?: string;
  location?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Usuário");
  const [userHikes, setUserHikes] = useState<HikeData[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setUserName(userData.name || "Usuário");
      
      // Load user hikes from localStorage
      const savedHikes = localStorage.getItem("userHikes");
      if (savedHikes) {
        setUserHikes(JSON.parse(savedHikes));
      } else {
        // Sample data if no hikes exist
        const sampleHikes: HikeData[] = [
          {
            id: "1",
            name: "Trilha do Cristo",
            date: "2025-07-15",
            duration: "45:30",
            distance: "3.8",
            elevation: "230",
            location: "Rio de Janeiro, RJ"
          }
        ];
        localStorage.setItem("userHikes", JSON.stringify(sampleHikes));
        setUserHikes(sampleHikes);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* User Profile Card */}
            <Card className="md:w-1/3 shadow-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-mountain text-white">
                      {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{userName}</CardTitle>
                    <CardDescription>Trilheiro Ativo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{userHikes.length}</span>
                    <span className="text-sm text-muted-foreground">Trilhas</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">8</span>
                    <span className="text-sm text-muted-foreground">Conquistas</span>
                  </div>
                </div>
                <Button 
                  variant="hero" 
                  className="w-full mt-2"
                  onClick={() => navigate('/track')}
                >
                  Registrar Nova Trilha
                </Button>
              </CardContent>
            </Card>
            
            {/* Activity Summary Card */}
            <Card className="md:w-2/3 shadow-soft">
              <CardHeader>
                <CardTitle>Resumo de Atividades</CardTitle>
                <CardDescription>
                  Estatísticas das suas trilhas recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Tempo Total</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userHikes.reduce((total, hike) => {
                        const [mins, secs] = hike.duration.split(":").map(Number);
                        return total + mins + (secs || 0) / 60;
                      }, 0).toFixed(0)} min
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Distância Total</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userHikes.reduce((total, hike) => total + parseFloat(hike.distance), 0).toFixed(1)} km
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Última Trilha</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userHikes.length > 0 
                        ? new Date(userHikes[userHikes.length - 1].date).toLocaleDateString('pt-BR') 
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="activities" className="text-base">
                <Activity className="h-4 w-4 mr-2" />
                Minhas Atividades
              </TabsTrigger>
              <TabsTrigger value="ranking" className="text-base">
                <List className="h-4 w-4 mr-2" />
                Ranking
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities" className="space-y-4">
              {userHikes.length > 0 ? (
                userHikes.map((hike) => (
                  <Card key={hike.id} className="shadow-soft">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{hike.name}</CardTitle>
                      <CardDescription>
                        {new Date(hike.date).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Duração</span>
                          <span className="font-medium">{hike.duration}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Distância</span>
                          <span className="font-medium">{hike.distance} km</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Elevação</span>
                          <span className="font-medium">{hike.elevation || "N/A"} m</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Você ainda não registrou nenhuma trilha</p>
                  <Button variant="hero" onClick={() => navigate('/track')}>
                    Registrar Primeira Trilha
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ranking">
              <Ranking />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}