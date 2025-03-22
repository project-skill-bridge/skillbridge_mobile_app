// src/components/game/game-card.tsx
import * as React from "react";
import { hp, wp } from "@/src/utils/common";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { Href, Link } from "expo-router";
import { theme } from "@/src/constants/Theme";

export interface GameCardProps {
  id: number;
  path: Href;
  image: ImageSourcePropType;
  title?: string;
}

const GameCard = ({ image, path, title }: GameCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.gameCover}>
        <Link href={path}>
          <Image source={image} resizeMode="contain" style={styles.image} />
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