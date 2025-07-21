import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type AnalysisResult } from "@/hooks/useGemini";

interface RankingProps {
  data?: AnalysisResult;
}

export function Ranking({ data }: RankingProps) {
  const topRanking = data?.runners || [
    {
      position: 1,
      name: "Carlos Santos",
      time: "24:15",
      city: "Poços de Caldas",
      trend: "+2",
      badge: "Recordista"
    },
    {
      position: 2, 
      name: "Marina Silva",
      time: "26:30",
      city: "Poços de Caldas", 
      trend: "=",
      badge: "Consistente"
    },
    {
      position: 3,
      name: "João Pereira", 
      time: "27:45",
      city: "Poços de Caldas",
      trend: "+1",
      badge: "Em Alta"
    }
  ];

  const monthlyStats = [
    { label: "Participantes", value: data?.stats.totalParticipants?.toString() || "89", icon: Trophy },
    { label: "Média de Tempo", value: data?.stats.averageTime || "32:15", icon: TrendingUp },
    { label: "Melhor Marca", value: data?.stats.bestTime || "24:15", icon: Crown }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.includes('+')) return "text-green-500";
    if (trend.includes('-')) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <section id="ranking" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ranking Mensal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja quem está dominando a trilha este mês e encontre sua motivação 
            para a próxima subida
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Top 3 Podium */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium bg-gradient-to-br from-white to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-6 w-6 text-primary mr-2" />
                  Top 3 - Dezembro 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRanking.map((runner, index) => (
                    <div key={index} className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                      runner.position === 1 ? 'bg-gradient-mountain text-white shadow-glow' : 'bg-secondary/50 hover:bg-secondary'
                    }`}>
                      <div className="flex-shrink-0 mr-4">
                        {getPositionIcon(runner.position)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-semibold ${runner.position === 1 ? 'text-white' : 'text-foreground'}`}>
                              {runner.name}
                            </h4>
                            <p className={`text-sm ${runner.position === 1 ? 'text-white/80' : 'text-muted-foreground'}`}>
                              {runner.city}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-xl font-bold ${runner.position === 1 ? 'text-white' : 'text-foreground'}`}>
                              {runner.time}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={getTrendColor(runner.trend)}>{runner.trend}</span>
                              <Badge variant={runner.position === 1 ? "secondary" : "outline"} className="text-xs">
                                {runner.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Stats */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      <stat.icon className="h-5 w-5 text-primary mr-3" />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-soft bg-gradient-sky">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-white" />
                <h4 className="font-bold text-white mb-2">Próximo Desafio</h4>
                <p className="text-white/90 text-sm mb-4">
                  Desafio de Ano Novo: Complete 5 trilhas em Janeiro e ganhe uma badge especial!
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Participar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-mountain shadow-soft hover:shadow-medium transition-all">
            Ver Ranking Completo
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Faça login para ver sua posição atual e histórico completo
          </p>
        </div>
      </div>
    </section>
  );
}