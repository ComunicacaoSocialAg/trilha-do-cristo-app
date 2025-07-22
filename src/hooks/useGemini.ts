import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useCallback } from 'react';

export interface RunnerData {
  position: number;
  name: string;
  time: string;
  city: string;
  trend: string;
  badge: string;
}

export interface HikeData {
  id?: string;
  name: string;
  date: string;
  duration: string;
  distance: string;
  elevation?: string;
  location?: string;
}

export interface AnalysisResult {
  runners: RunnerData[];
  stats: {
    totalParticipants: number;
    averageTime: string;
    bestTime: string;
  };
}

export interface ImageAnalysisResult {
  hikeData: HikeData;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = useCallback(async (file: File, apiKey: string): Promise<AnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const fileText = await file.text();
      
      const prompt = `
        Analise os dados da trilha fornecidos e extraia informações sobre os participantes.
        Retorne APENAS um JSON válido com a seguinte estrutura:

        {
          "runners": [
            {
              "position": 1,
              "name": "Nome do Corredor",
              "time": "24:15",
              "city": "Cidade",
              "trend": "+2",
              "badge": "Recordista"
            }
          ],
          "stats": {
            "totalParticipants": 89,
            "averageTime": "32:15",
            "bestTime": "24:15"
          }
        }

        Dados para análise:
        ${fileText}

        Gere dados realistas baseados no conteúdo. Se não houver dados suficientes, crie dados simulados para demonstração.
        Trends podem ser: "+N", "-N", ou "=" 
        Badges podem ser: "Recordista", "Consistente", "Em Alta", "Estreante", "Veterano"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      
      const analysis = JSON.parse(cleanText);
      
      setIsLoading(false);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar arquivo';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  const analyzeImage = useCallback(async (imageFile: File, apiKey: string): Promise<ImageAnalysisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

      // Convert image to base64
      const imageData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });

      const prompt = `
        Analise esta captura de tela de um aplicativo de trilha/corrida e extraia as informações da atividade.
        Retorne APENAS um JSON válido com a seguinte estrutura:

        {
          "hikeData": {
            "name": "Nome da Trilha",
            "date": "2025-07-20",
            "duration": "45:30",
            "distance": "3.8",
            "elevation": "230",
            "location": "Local da Trilha"
          }
        }

        Extraia o máximo de informações possível da imagem. Se algum dado não estiver disponível, use valores vazios ou omita o campo.
        A data deve estar no formato YYYY-MM-DD, a duração no formato MM:SS, a distância em km e a elevação em metros.
      `;

      const imageParts = [
        {
          inlineData: {
            data: imageData.split(',')[1], // Remove data URL prefix
            mimeType: imageFile.type
          }
        }
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      
      const analysis = JSON.parse(cleanText);
      
      setIsLoading(false);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar imagem';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    analyzeFile,
    analyzeImage,
    isLoading,
    error
  };
};