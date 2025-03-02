import * as React from "react";

import { theme } from "@/src/constants/Theme";
import { StyleSheet, View } from "react-native";

interface SliderActiveDotProps {
  length: number;
  currentIndex: number;
}

const SliderActiveDot = ({ length, currentIndex }: SliderActiveDotProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex ? theme.colors.primary : "#C4C4C4",
            },
          ]}
        />
      ))}
    </View>
  );
};

export default SliderActiveDot;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 4,
    margin: 5,
  },
});
