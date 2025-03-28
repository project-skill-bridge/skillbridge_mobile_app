import * as React from "react";

import { hp, wp } from "@/src/utils/common";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import { ImageSourcePropType } from "react-native";
import { theme } from "@/src/constants/Theme";

export interface GameCardProps {
  id: number;
  path: Href;
  image: ImageSourcePropType;
  title?: string;
  isGif?: boolean;
}

const GameCard = ({ image, path, title, isGif = false }: GameCardProps) => {
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
      {title && (
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      )}
    </View>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    width: wp(45),
    marginRight: wp(4),
    alignItems: "center",
  },
  gameCover: {
    width: wp(45),
    height: hp(25),
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: hp(2),
    fontWeight: "600",
    marginTop: hp(1),
    textAlign: "center",
    color: theme.colors.primaryText,
  },
});