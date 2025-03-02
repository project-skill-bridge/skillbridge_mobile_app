import * as React from "react";

import { StyleSheet, Animated, View, TextInput } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

interface CircularProgressProps {
  perecentage?: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  delay?: number;
  textColor?: string;
  max?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

const CircularProgress = ({
  perecentage = 50,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = "blue",
  delay = 0,
  textColor,
  max = 100,
}: CircularProgressProps) => {
  const circleRef = React.useRef<Circle>(null);
  const inputRef = React.useRef<TextInput>(null);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const animation = (toValue: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  };

  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  React.useEffect(() => {
    animation(perecentage);

    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const maxPercentage = 100 * (v.value / max);
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPercentage) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }

      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}%`,
        });
      }
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [perecentage, max, radius]);

  return (
    <View>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
            fill="transparent"
            r={radius}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <AnimatedInput
        ref={inputRef}
        defaultValue="0%"
        editable={false}
        underlineColorAndroid="transparent"
        style={[
          StyleSheet.absoluteFillObject,
          styles.text,
          { color: textColor ?? color, fontSize: radius / 2 },
        ]}
      />
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  text: {
    fontWeight: 900,
    textAlign: "center",
  },
});
