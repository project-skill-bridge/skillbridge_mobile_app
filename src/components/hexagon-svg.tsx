import React from "react";
import { ColorValue } from "react-native";
import { Text } from "react-native-svg";
import Svg, { Polygon } from "react-native-svg";

interface HexagonSVGProps {
  character: string;
  fill?: ColorValue;
  fontSize?: string;
}

const HexagonSVG = ({
  character,
  fill = "blue",
  fontSize = "30",
}: HexagonSVGProps) => {
  return (
    <Svg height="75" width="75" viewBox="0 0 100 100">
      <Polygon
        points="50,5 95,30 95,70 50,95 5,70 5,30"
        fill={fill}
        stroke={"black"}
        strokeWidth={2}
      />
      <Text
        x="50"
        y="50"
        fontSize={fontSize}
        textAnchor="middle"
        dy=".3em"
        fontWeight="bold"
      >
        {character}
      </Text>
    </Svg>
  );
};

export default HexagonSVG;
