import * as React from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

import { SliderItemProps } from "./slider-item";
import { theme } from "../constants/Theme";
import { hp } from "../utils/common";

interface SliderIndicatorProps {
  data: ReadonlyArray<SliderItemProps>;
  scrollX: Animated.Value;
}

const SliderIndicator = ({ data, scrollX }: SliderIndicatorProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [16, 32, 16],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[styles.indicator, { width: scale, opacity }]}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
};

export default SliderIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: hp(5),
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 5,
    backgroundColor: theme.colors.primary,
  },
});
