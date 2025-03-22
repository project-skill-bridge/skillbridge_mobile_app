// src/data/gameInfo.ts
import { Images } from "../constants/Images";

export type GameCategory = 'executive' | 'vocational' | 'realLife';

export interface GameItem {
  id: number;
  path: string;
  image: any;
  title: string;
  description?: string;
  category: GameCategory;
}

export const gameInfo: GameItem[] = [
  {
    id: 1,
    path: "/tap-and-type/main-screen",
    image: Images.game1,
    title: "Tap & Type",
    description: "Improve typing and literacy skills",
    category: 'vocational', 
  },
  {
    id: 2,
    path: "/circle-burst/game-screen",
    image: Images.game2,
    title: "Circle Burst",
    description: "Enhance hand-eye coordination",
    category: 'executive',
  },
  {
    id: 3,
    path: "/mind-match/main-screen",
    image: Images.game2,
    title: "Mind Match",
    description: "Test and improve memory and attention",
    category: 'executive', 
  },
];

export const getCategorizedGames = () => {
  const executiveGames = gameInfo.filter(game => game.category === 'executive');
  const vocationalGames = gameInfo.filter(game => game.category === 'vocational');
  const realLifeGames = gameInfo.filter(game => game.category === 'realLife');
  
  return {
    executiveGames,
    vocationalGames,
    realLifeGames
  };
};