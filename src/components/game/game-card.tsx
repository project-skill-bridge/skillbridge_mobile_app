import * as React from "react";

import { hp, wp } from "@/src/utils/common";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

export interface GameCardProps {
  id: number;
  path: string;
  image: ImageSourcePropType;
}

const GameCard = ({ image }: GameCardProps) => {
  return (
    <View style={styles.gameCover}>
      <Image source={image} resizeMode="contain" style={styles.image} />
    </View>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  gameCover: {
    width: wp(45),
    height: hp(28),
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
