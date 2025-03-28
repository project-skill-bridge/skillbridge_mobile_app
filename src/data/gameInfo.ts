import { Images } from "../constants/Images";

export type GameCategory = "executive" | "vocational" | "realLife";

export interface GameItem {
  id: number;
  path: string;
  image: unknown;
  title: string;
  description?: string;
  category: GameCategory;
  isGif?: boolean;
}

export const gameInfo: GameItem[] = [
  {
    id: 1,
    path: "/tap-and-type/main-screen",
    image: Images.game3,
    title: "Tap & Type",
    description: "Improve typing and literacy skills",
    category: "vocational",
  },
  {
    id: 2,
    path: "/circlo-brust/game-screen",
    image: Images.game2,
    title: "Circlo Burst",
    description: "Enhance hand-eye coordination",
    category: "executive",
  },
  {
    id: 3,
    path: "/mind-match/main-screen",
    image: Images.game4,
    title: "Mind Match",
    description: "Test and improve memory and attention",
    category: "executive",
  },
  {
    id: 4,
    path: "/voccational-trainning/main-screen",
    image: Images.game1,
    title: "Vocational Training",
    description: "Learn essential work skills",
    category: "vocational",
  },
];

export const getCategorizedGames = () => {
  const executiveGames = gameInfo.filter(
    (game) => game.category === "executive"
  );
  const vocationalGames = gameInfo.filter(
    (game) => game.category === "vocational"
  );
  const realLifeGames = gameInfo.filter((game) => game.category === "realLife");

  return {
    executiveGames,
    vocationalGames,
    realLifeGames,
  };
};
