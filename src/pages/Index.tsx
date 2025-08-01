import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Ranking } from "@/components/Ranking";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WeatherAndCameras } from "@/components/WeatherAndCameras";
import { type AnalysisResult } from "@/types";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | undefined>();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <section id="weather-cameras" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Condições da Trilha
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe o clima e monitore a trilha em tempo real
            </p>
          </div>
          <WeatherAndCameras />
        </div>
      </section>
      <HowItWorks />
      <Gallery />
      <Ranking data={analysisData} />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
