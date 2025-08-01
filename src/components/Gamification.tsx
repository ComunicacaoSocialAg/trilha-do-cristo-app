import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Mountain, Timer, Target, Zap, Medal, Star, Crown, Award, Flame } from "lucide-react";
import { Badge, Challenge, GamificationData } from "@/types/gamification";

interface HikeData {
  id: string;
  name: string;
  date: string;
  duration: string;
  distance: string;
  elevation?: string;
  location?: string;
}

interface GamificationProps {
  userHikes: HikeData[];
  userId: string;
}

export function Gamification({ userHikes, userId }: GamificationProps) {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    badges: [],
    challenges: [],
    totalPoints: 0,
    level: 1
  });

  useEffect(() => {
    loadGamificationData();
  }, [userHikes, userId]);

  const loadGamificationData = () => {
    const savedData = localStorage.getItem(`gamification_${userId}`);
    let data: GamificationData = savedData ? JSON.parse(savedData) : getInitialGamificationData();

    // Atualizar progresso baseado nas trilhas
    data = updateProgressFromHikes(data, userHikes);
    
    setGamificationData(data);
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(data));
  };

  const getInitialGamificationData = (): GamificationData => ({
    badges: [
      {
        id: "first_hike",
        name: "Primeiro Passo",
        description: "Complete sua primeira trilha",
        icon: "Mountain",
        earned: false
      },
      {
        id: "distance_5km",
        name: "Caminhante",
        description: "Percorra 5km em trilhas",
        icon: "Target",
        earned: false,
        progress: 0,
        target: 5
      },
      {
        id: "elevation_500m",
        name: "Escalador",
        description: "Ganhe 500m de elevação total",
        icon: "Trophy",
        earned: false,
        progress: 0,
        target: 500
      },
      {
        id: "time_5hours",
        name: "Resistente",
        description: "Acumule 5 horas de trilha",
        icon: "Timer",
        earned: false,
        progress: 0,
        target: 300
      },
      {
        id: "streak_7",
        name: "Dedicado",
        description: "7 trilhas em 7 dias diferentes",
        icon: "Flame",
        earned: false,
        progress: 0,
        target: 7
      }
    ],
    challenges: [
      {
        id: "challenge_10km",
        name: "Desafio 10km",
        description: "Percorra 10km em trilhas este mês",
        icon: "Target",
        progress: 0,
        target: 10,
        reward: "Badge Explorador",
        completed: false,
        type: "distance"
      },
      {
        id: "challenge_1000m",
        name: "Desafio Altitude",
        description: "Ganhe 1000m de elevação total",
        icon: "Mountain",
        progress: 0,
        target: 1000,
        reward: "Badge Montanhista",
        completed: false,
        type: "elevation"
      },
      {
        id: "challenge_speed",
        name: "Desafio Velocidade",
        description: "Complete uma trilha em menos de 30 minutos",
        icon: "Zap",
        progress: 0,
        target: 1,
        reward: "Badge Velocista",
        completed: false,
        type: "time"
      },
      {
        id: "challenge_frequency",
        name: "Desafio Frequência",
        description: "Complete 5 trilhas em uma semana",
        icon: "Medal",
        progress: 0,
        target: 5,
        reward: "Badge Ativo",
        completed: false,
        type: "frequency"
      },
      {
        id: "challenge_endurance",
        name: "Desafio Resistência",
        description: "Complete uma trilha de mais de 2 horas",
        icon: "Crown",
        progress: 0,
        target: 1,
        reward: "Badge Resistente",
        completed: false,
        type: "time"
      }
    ],
    totalPoints: 0,
    level: 1
  });

  const updateProgressFromHikes = (data: GamificationData, hikes: HikeData[]): GamificationData => {
    const updatedData = { ...data };

    // Calcular estatísticas totais
    const totalDistance = hikes.reduce((sum, hike) => sum + parseFloat(hike.distance), 0);
    const totalElevation = hikes.reduce((sum, hike) => sum + (parseFloat(hike.elevation || "0")), 0);
    const totalTime = hikes.reduce((sum, hike) => {
      const [mins] = hike.duration.split(":").map(Number);
      return sum + mins;
    }, 0);

    // Atualizar badges
    updatedData.badges = updatedData.badges.map(badge => {
      switch (badge.id) {
        case "first_hike":
          return { ...badge, earned: hikes.length > 0 };
        case "distance_5km":
          return { 
            ...badge, 
            progress: Math.min(totalDistance, badge.target || 5),
            earned: totalDistance >= (badge.target || 5)
          };
        case "elevation_500m":
          return { 
            ...badge, 
            progress: Math.min(totalElevation, badge.target || 500),
            earned: totalElevation >= (badge.target || 500)
          };
        case "time_5hours":
          return { 
            ...badge, 
            progress: Math.min(totalTime, badge.target || 300),
            earned: totalTime >= (badge.target || 300)
          };
        case "streak_7":
          const uniqueDays = new Set(hikes.map(h => h.date.split('T')[0])).size;
          return { 
            ...badge, 
            progress: Math.min(uniqueDays, badge.target || 7),
            earned: uniqueDays >= (badge.target || 7)
          };
        default:
          return badge;
      }
    });

    // Atualizar challenges
    updatedData.challenges = updatedData.challenges.map(challenge => {
      switch (challenge.type) {
        case "distance":
          return {
            ...challenge,
            progress: Math.min(totalDistance, challenge.target),
            completed: totalDistance >= challenge.target
          };
        case "elevation":
          return {
            ...challenge,
            progress: Math.min(totalElevation, challenge.target),
            completed: totalElevation >= challenge.target
          };
        case "time":
          if (challenge.id === "challenge_speed") {
            const hasShortHike = hikes.some(hike => {
              const [mins] = hike.duration.split(":").map(Number);
              return mins < 30;
            });
            return {
              ...challenge,
              progress: hasShortHike ? 1 : 0,
              completed: hasShortHike
            };
          } else if (challenge.id === "challenge_endurance") {
            const hasLongHike = hikes.some(hike => {
              const [mins] = hike.duration.split(":").map(Number);
              return mins > 120;
            });
            return {
              ...challenge,
              progress: hasLongHike ? 1 : 0,
              completed: hasLongHike
            };
          }
          return challenge;
        case "frequency":
          const uniqueDays = new Set(hikes.map(h => h.date.split('T')[0])).size;
          return {
            ...challenge,
            progress: Math.min(uniqueDays, challenge.target),
            completed: uniqueDays >= challenge.target
          };
        default:
          return challenge;
      }
    });

    return updatedData;
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Mountain, Timer, Target, Zap, Medal, Star, Crown, Award, Flame, Trophy
    };
    return icons[iconName] || Trophy;
  };

  const earnedBadges = gamificationData.badges.filter(badge => badge.earned);
  const activeChallenges = gamificationData.challenges.filter(challenge => !challenge.completed);
  const completedChallenges = gamificationData.challenges.filter(challenge => challenge.completed);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Conquistas
        </CardTitle>
        <CardDescription>
          Conquiste badges e complete desafios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="badges">Badges ({earnedBadges.length})</TabsTrigger>
            <TabsTrigger value="challenges">Desafios ({activeChallenges.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gamificationData.badges.map((badge) => {
                const IconComponent = getIconComponent(badge.icon);
                return (
                  <Card key={badge.id} className={`p-4 ${badge.earned ? 'bg-primary/5 border-primary/20' : 'opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${badge.earned ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        {badge.target && !badge.earned && (
                          <div className="mt-2">
                            <Progress value={(badge.progress || 0) / badge.target * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {badge.progress || 0} / {badge.target}
                            </p>
                          </div>
                        )}
                      </div>
                      {badge.earned && (
                        <BadgeComponent variant="secondary">Conquistado</BadgeComponent>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-4">
            <div className="space-y-4">
              {activeChallenges.map((challenge) => {
                const IconComponent = getIconComponent(challenge.icon);
                const progressPercentage = (challenge.progress / challenge.target) * 100;
                
                return (
                  <Card key={challenge.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{challenge.name}</h4>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          <BadgeComponent variant="outline">
                            {challenge.reward}
                          </BadgeComponent>
                        </div>
                        <div className="space-y-2">
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{challenge.progress} / {challenge.target}</span>
                            <span>{Math.round(progressPercentage)}% completo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {completedChallenges.length > 0 && (
                <>
                  <h4 className="font-medium text-primary mt-6">Desafios Concluídos</h4>
                  {completedChallenges.map((challenge) => {
                    const IconComponent = getIconComponent(challenge.icon);
                    return (
                      <Card key={challenge.id} className="p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{challenge.name}</h4>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          <BadgeComponent variant="secondary">Concluído</BadgeComponent>
                        </div>
                      </Card>
                    );
                  })}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}