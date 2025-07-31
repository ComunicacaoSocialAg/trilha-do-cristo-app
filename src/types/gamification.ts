export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  target?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
  type: 'distance' | 'time' | 'elevation' | 'frequency' | 'streak';
}

export interface GamificationData {
  badges: Badge[];
  challenges: Challenge[];
  totalPoints: number;
  level: number;
}