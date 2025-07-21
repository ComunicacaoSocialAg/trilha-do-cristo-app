import { ArrowRight, Play, MapPin, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";

export function Hero() {
  const stats = [
    { icon: Users, label: "Trilheiros Ativos", value: "324+" },
    { icon: MapPin, label: "Trilhas Registradas", value: "1.2k+" },
    { icon: Trophy, label: "Recordes Batidos", value: "89" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Trilha do Cristo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Trilha do
            <span className="block bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              Cristo
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
            Transforme sua caminhada em uma jornada de superação. 
            Registre, compete e conecte-se com trilheiros de Poços de Caldas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
            <Button size="lg" className="bg-gradient-mountain shadow-glow hover:shadow-strong transition-all text-lg px-8 py-6">
              Registrar Minha Trilha
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Como Funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 p-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col items-center text-center">
                  <stat.icon className="h-8 w-8 text-primary-glow mb-3" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}