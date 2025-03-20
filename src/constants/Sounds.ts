/* eslint-disable @typescript-eslint/no-require-imports */
export const Sounds = {
  successSound: require("@/assets/sounds/game-success.mp3"),
  successSound2: require("@/assets/sounds/game-success-2.mp3"),
  failureSound: require("@/assets/sounds/game-failure.mp3"),
  backgroundMusic: require("@/assets/sounds/background.mp3"),
  backgroundMusic2: require("@/assets/sounds/background2.mp3"),
  buttonClick: require("@/assets/sounds/button-click.mp3"),
  cardFlip: require("@/assets/sounds/card-flip.mp3"),
} as const;
