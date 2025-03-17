/* eslint-disable @typescript-eslint/no-require-imports */
export const Sounds = {
  successSound: require("@/assets/sounds/game_success.mp3"),
  failureSound: require("@/assets/sounds/game_failure.mp3"),
  backgroundMusic: require("@/assets/sounds/background.mp3"),
  buttonClick: require("@/assets/sounds/button-click.mp3"),
} as const;
