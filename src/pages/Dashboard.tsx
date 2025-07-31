import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, TrendingUp, Award, List, Activity, LogOut, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Ranking } from "@/components/Ranking";
import { Gamification } from "@/components/Gamification";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState<string>("Usuário");
  const [userHikes, setUserHikes] = useState<HikeData[]>([]);
  
  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Load user profile data when authenticated
    if (user) {
      loadUserProfile();
      loadUserHikes();
    }
  }, [user, loading, navigate]);

  // Also reload hikes when coming back to this page
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        loadUserHikes();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setUserName(profile.display_name || user.email || "Usuário");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setUserName(user.email || "Usuário");
    }
  };

  const loadUserHikes = () => {
    if (!user) return;
    
    // Load user hikes from localStorage or provide sample data
    const storedHikes = localStorage.getItem(`userHikes_${user.id}`);
    if (storedHikes) {
      setUserHikes(JSON.parse(storedHikes));
    } else {
      // Sample data for demonstration
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
      localStorage.setItem(`userHikes_${user.id}`, JSON.stringify(sampleHikes));
      setUserHikes(sampleHikes);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                <div className="space-y-2">
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => navigate('/track')}
                  >
                    Registrar Nova Trilha
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
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
              <TabsTrigger value="gamification" className="text-base">
                <Trophy className="h-4 w-4 mr-2" />
                Gamificação
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
            
            <TabsContent value="gamification">
              <Gamification userHikes={userHikes} userId={user?.id || ''} />
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