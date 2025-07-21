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

export interface AnalysisResult {
  runners: RunnerData[];
  stats: {
    totalParticipants: number;
    averageTime: string;
    bestTime: string;
  };
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

  return {
    analyzeFile,
    isLoading,
    error
  };
};