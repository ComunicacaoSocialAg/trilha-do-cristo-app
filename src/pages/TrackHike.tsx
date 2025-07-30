import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Activity } from "lucide-react";
import { HikeForm } from "@/components/HikeForm";

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
            <HikeForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}