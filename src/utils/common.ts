import { Dimensions } from "react-native";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");

export const wp = (precentage: number) => {
  return (deviceWidth * precentage) / 100;
};

export const hp = (precentage: number) => {
  return (deviceHeight * precentage) / 100;
};
