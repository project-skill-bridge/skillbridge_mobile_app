import * as React from "react";
import { hp, wp } from "@/src/utils/common";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ImageSourcePropType } from "react-native";
import { Href, Link } from "expo-router";

export interface GameCardProps {
  id: number;
  path: Href;
  image: ImageSourcePropType;
  isGif?: boolean;
}

const GameCard = ({ image, path, isGif = false }: GameCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.gameCover}>
        <Link href={path}>
          <Image
            source={image}
            style={styles.image}
            contentFit="cover"
            transition={isGif ? 0 : 200}
            cachePolicy={isGif ? "none" : "memory"}
          />
        </Link>
      </View>
    </View>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    width: wp(45),
    height: hp(28),
    marginHorizontal: wp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameCover: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
