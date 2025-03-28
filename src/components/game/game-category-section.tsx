import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp } from "@/src/utils/common";
import { GameItem } from "@/src/data/gameInfo";
import { theme } from "@/src/constants/Theme";
import GameSliderContainer from "./game-slider-container";

interface GameCategorySectionProps {
  title: string;
  description?: string;
  games: GameItem[];
  comingSoon?: boolean;
}

const GameCategorySection: React.FC<GameCategorySectionProps> = ({
  title,
  description,
  games,
  comingSoon = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        {comingSoon && <View style={styles.comingSoonBadge}><Text style={styles.comingSoonText}>Coming Soon</Text></View>}
      </View>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {!comingSoon && games.length > 0 ? (
        <GameSliderContainer games={games} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {comingSoon 
              ? "We're working on exciting new games for this category!" 
              : "No games available in this category yet."}
          </Text>
        </View>
      )}
    </View>
  );
};

export default GameCategorySection;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(4),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: theme.colors.primaryText,
    marginRight: 10,
  },
  description: {
    fontSize: hp(1.8),
    color: theme.colors.secondaryText,
    marginBottom: hp(2),
  },
  comingSoonBadge: {
    backgroundColor: "#ff8f8f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: "#ffffff",
    fontSize: hp(1.5),
    fontWeight: "600",
  },
  emptyContainer: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  emptyText: {
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});