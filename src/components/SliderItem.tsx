import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";

import { theme } from "../constants/Theme";
import { hp, wp } from "../utils/common";

export interface SliderItemProps {
  id: number;
  title: string;
  description: string;
  image: any;
}

const SliderItem = ({ id, title, description, image }: SliderItemProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      {/* Onboarding Image */}
      <Image
        source={image}
        resizeMode="contain"
        style={[styles.onboardingImage, { width }]}
      />

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
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
    gap: hp(5),
  },
  onboardingImage: {
    flex: 0.7,
    justifyContent: "center",
  },
  textContainer: {
    flex: 0.32,
    gap: 15,
  },
  title: {
    textAlign: "center",
    color: theme.colors.primaryText,
    fontWeight: theme.fontWeights.extraBold,
    fontSize: hp(3.5),
    paddingHorizontal: wp(12),
  },
  description: {
    color: theme.colors.secondaryText,
    textAlign: "center",
    fontWeight: theme.fontWeights.medium,
    paddingHorizontal: wp(14),
  },
});
