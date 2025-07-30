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