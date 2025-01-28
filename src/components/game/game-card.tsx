import * as React from "react";

import { hp, wp } from "@/src/utils/common";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { Href, Link } from "expo-router";

export interface GameCardProps {
  id: number;
  path: Href;
  image: ImageSourcePropType;
}

const GameCard = ({ image, path }: GameCardProps) => {
  return (
    <View style={styles.gameCover}>
      <Link href={path}>
        <Image source={image} resizeMode="contain" style={styles.image} />
      </Link>
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
