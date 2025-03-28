import * as React from "react";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import { hp } from "../../utils/common";
import GameCard from "./game-card";
import SliderActiveDot from "./slider-active-dot";
import { GameItem } from "@/src/data/gameInfo";

interface GameSliderContainerProps {
  games: GameItem[];
}

const GameSliderContainer: React.FC<GameSliderContainerProps> = ({ games }) => {
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
      <View style={styles.slider}>
        <FlatList
          data={games}
          renderItem={({ item }) => (
            <GameCard 
              id={item.id} 
              path={item.path} 
              image={item.image}
              title={item.title}
              isGif={item.isGif || false}
            />
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
      <SliderActiveDot length={games.length} currentIndex={currentIndex} />
    </View>
  );
};

export default GameSliderContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  slider: {
    marginTop: hp(2),
  },
});