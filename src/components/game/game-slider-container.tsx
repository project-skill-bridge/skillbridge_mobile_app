import * as React from "react";

import { FlatList, StyleSheet, Text, View, ViewToken } from "react-native";
import { hp } from "../../utils/common";
import { gameInfo } from "@/src/data/gameInfo";
import GameCard from "./game-card";
import SliderActiveDot from "./slider-active-dot";
import { theme } from "@/src/constants/Theme";

const GameSliderContainer = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const viewableItemsChanged = React.useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  ).current;

  const viewConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 0,
  }).current;

  const sliderRef = React.useRef<FlatList>(null);
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Games to Play</Text>
      <View style={styles.slider}>
        <FlatList
          data={gameInfo}
          renderItem={({ item }) => (
            <GameCard id={item.id} path={item.path} image={item.image} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={sliderRef}
        />
      </View>
      <SliderActiveDot length={gameInfo.length} currentIndex={currentIndex} />
    </View>
  );
};

export default GameSliderContainer;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(9),
    justifyContent: "center",
  },
  slider: {
    marginTop: hp(2),
  },
  headerText: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: theme.colors.primaryText,
  },
});
