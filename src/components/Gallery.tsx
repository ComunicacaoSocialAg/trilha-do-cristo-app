import { Heart, MessageCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import hikersGroup from "@/assets/hikers-group.jpg";
import appUsage from "@/assets/app-usage.jpg";

export function Gallery() {
  const photos = [
    {
      id: 1,
      image: hikersGroup,
      author: "Bruno Garcia",
      time: "28:45",
      date: "Hoje",
      likes: 12,
      comments: 3,
      badge: "Trilheira do Mês"
    },
    {
      id: 2, 
      image: appUsage,
      author: "Carlos Santos",
      time: "31:20",
      date: "Ontem", 
      likes: 8,
      comments: 1,
      badge: "Primeiro PR"
    },
    {
      id: 3,
      image: hikersGroup,
      author: "Ana Costa", 
      time: "29:10",
      date: "2 dias",
      likes: 15,
      comments: 5,
      badge: "Noturna"
    },
    {
      id: 4,
      image: appUsage,
      author: "João Pereira",
      time: "26:30", 
      date: "3 dias",
      likes: 20,
      comments: 7,
      badge: "Recorde Pessoal"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Galeria dos Trilheiros
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as conquistas da nossa comunidade e inspire-se 
            com as histórias de superação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <Card key={photo.id} className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img 
                  src={photo.image} 
                  alt={`Trilha de ${photo.author}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                <Badge className="absolute top-3 left-3 bg-gradient-mountain text-white border-0">
                  {photo.badge}
                </Badge>

                {/* Time */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                  {photo.time}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{photo.author}</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {photo.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{photo.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{photo.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Quer ver sua foto aqui? Faça sua trilha e compartilhe!
          </p>
        </div>
      </div>
    </section>
  );
}