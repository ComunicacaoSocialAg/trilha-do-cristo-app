import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

export default function TrackHike() {
  const navigate = useNavigate();
  
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
          
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-soft mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2 text-primary" />
                  Upload de Imagem da Trilha
                </CardTitle>
                <CardDescription>
                  Envie um print do seu app de corrida para registrar sua trilha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Nossa tecnologia de IA analisará automaticamente a imagem do seu aplicativo 
                  de corrida para extrair informações como duração, distância percorrida e mais.
                </p>
                
                <ImageUpload />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}