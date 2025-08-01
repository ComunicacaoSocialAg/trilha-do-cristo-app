import { Camera, Upload, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      number: "01",
      title: "Faça sua Trilha",
      description: "Use seu app favorito (Strava, Garmin, Nike Run) para registrar sua subida ao Cristo.",
      color: "text-primary"
    },
    {
      icon: Upload,
      number: "02", 
      title: "Compartilhe o Print",
      description: "Tire um print do seu app mostrando tempo, distância e conquista da trilha.",
      color: "text-accent"
    },
    {
      icon: Trophy,
      number: "03",
      title: "Entre no Ranking",
      description: "Seu registro é validado e você entra automaticamente nos rankings mensais e anuais.",
      color: "text-primary-glow"
    },
    {
      icon: Users,
      number: "04",
      title: "Conecte-se",
      description: "Conheça outros trilheiros, participe de desafios e conquiste badges especiais.",
      color: "text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em poucos passos simples, você já faz parte da maior comunidade 
            de trilheiros de Poços de Caldas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-medium transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-mountain rounded-full flex items-center justify-center text-white font-bold text-sm shadow-medium">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mt-4 mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Lines for Desktop */}
        <div className="hidden lg:block relative -mt-24 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-1/4 h-0.5 bg-gradient-to-r from-primary/30 to-accent/30"></div>
          <div className="absolute top-1/2 left-1/2 w-1/4 h-0.5 bg-gradient-to-r from-accent/30 to-primary-glow/30"></div>
        </div>
      </div>
    </section>
  );
}