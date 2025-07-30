import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          "Monthly Ranking": "Ranking Mensal",
          "See who is dominating the trail": "Veja quem está dominando a trilha este mês e encontre sua motivação para a próxima subida",
          "Top 3 - December 2024": "Top 3 - Dezembro 2024",
          "Participants": "Participantes",
          "Average Time": "Média de Tempo",
          "Best Time": "Melhor Marca",
          "Next Challenge": "Próximo Desafio",
          "See Full Ranking": "Ver Ranking Completo",
          "Login to see your position": "Faça login para ver sua posição atual e histórico completo",
        }
      },
      en: {
        translation: {
          "Monthly Ranking": "Monthly Ranking",
          "See who is dominating the trail": "See who is dominating the trail this month and find your motivation for the next climb",
          "Top 3 - December 2024": "Top 3 - December 2024",
          "Participants": "Participants",
          "Average Time": "Average Time",
          "Best Time": "Best Time",
          "Next Challenge": "Next Challenge",
          "See Full Ranking": "See Full Ranking",
          "Login to see your position": "Login to see your current position and full history",
        }
      }
    },
    lng: "pt",
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;