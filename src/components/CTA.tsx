import { ArrowRight, Smartphone, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTA() {
  const socialLinks = [
    {
      name: "WhatsApp",
      icon: "💬",
      description: "Grupo oficial dos trilheiros",
      action: "Entrar no grupo"
    },
    {
      name: "Instagram", 
      icon: "📸",
      description: "Acompanhe nossas aventuras",
      action: "Seguir @trilhadocristo"
    },
    {
      name: "Facebook",
      icon: "👥", 
      description: "Comunidade no Facebook",
      action: "Curtir página"
    }
  ];

  return (
    <section className="py-20 bg-gradient-mountain relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Pronto para sua Próxima Aventura?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Junte-se à maior comunidade de trilheiros de Poços de Caldas. 
            Registre suas conquistas, compete com amigos e descubra novos limites.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-strong hover:shadow-glow transition-all">
              <Smartphone className="mr-2 h-5 w-5" />
              Baixar App (Em Breve)
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              Registrar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {socialLinks.map((social, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{social.icon}</div>
                <h4 className="font-semibold text-white mb-2">{social.name}</h4>
                <p className="text-white/80 text-sm mb-4">{social.description}</p>
                <Button variant="ghost" className="text-white hover:bg-white/20 group-hover:translate-y-[-2px] transition-all">
                  {social.action}
                  <Share2 className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              100% Gratuito
            </div>
            <div className="flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              PWA Otimizado
            </div>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Comunidade Ativa
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}