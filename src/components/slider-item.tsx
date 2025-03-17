import * as React from "react";

import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { theme } from "../constants/Theme";
import { hp, wp } from "../utils/common";
import { Icons } from "../constants/Icons";
import LottieView, { LottieViewProps } from "lottie-react-native";

export interface SliderItemProps {
  id: number;
  title: string;
  description: string;
  src: LottieViewProps["source"];
}

const SliderItem = ({ id, title, description, src }: SliderItemProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      {/* Onboarding Image */}
      <LottieView
        source={src}
        autoPlay
        style={[styles.lottie, { width: width - wp(20) }]}
        resizeMode="contain"
      />

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title.split(" ").map((word, index) => (
            <Text
              key={index + word}
              style={{
                color:
                  (id === 1 && word === "Independence,") ||
                  (id === 2 && (word === "Skill" || word === "Bridge?"))
                    ? theme.colors.primary
                    : theme.colors.primaryText,
              }}
            >
              {word + " "}
            </Text>
          ))}
        </Text>

        <View
          style={{
            gap: id === 2 ? 20 : 0,
            paddingHorizontal: id === 2 ? wp(8) : wp(14),
          }}
        >
          {description.split(".").map(
            (sentence, index) =>
              index < 2 && (
                <View key={index} style={styles.descriptionContainer}>
                  <Text>{id === 2 && <Icons.Check color="green" />}</Text>
                  <Text
                    style={[
                      styles.description,
                      {
                        textAlign: id === 2 ? "left" : "center",
                      },
                    ]}
                  >
                    {sentence}
                  </Text>
                </View>
              )
          )}
        </View>
      </View>
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: hp(3.5),
  },
  lottie: {
    flex: 0.7,
    justifyContent: "center",
  },
  textContainer: {
    flex: 0.32,
    gap: 15,
  },
  title: {
    textAlign: "center",
    fontWeight: theme.fontWeights.extraBold,
    fontSize: hp(3.5),
    paddingHorizontal: wp(12),
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  description: {
    color: theme.colors.secondaryText,
    textAlign: "center",
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
  },
});
