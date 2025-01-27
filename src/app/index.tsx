import * as React from "react";

import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingData } from "@/src/data/onboardingData";
import SliderItem from "@/src/components/slider-item";
import SliderIndicator from "@/src/components/slider-indicator";
import Button from "@/src/components/ui/button";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { router } from "expo-router";

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const onboardingRef = React.useRef<FlatList>(null);
  const isFirstPage = currentIndex === 0;

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
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      onboardingRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/sign-up");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <Pressable
        style={styles.skipButton}
        onPress={() => router.replace("/(auth)/sign-up")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.slider}>
        <FlatList
          data={onboardingData}
          renderItem={({ item }) => (
            <SliderItem
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={onboardingRef}
        />
      </View>

      <SliderIndicator data={onboardingData} scrollX={scrollX} />
      <View style={styles.buttonContainer}>
        <Button
          title={isFirstPage ? "Get Started" : "Next"}
          onPress={scrollTo}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: wp(10),
  },
  skipButton: {
    alignSelf: "flex-end",
    marginRight: wp(5),
  },
  skipText: {
    color: theme.colors.primaryText,
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.bold,
  },
  slider: {
    flex: 3,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: wp(5),
    marginBottom: hp(4),
  },
});
