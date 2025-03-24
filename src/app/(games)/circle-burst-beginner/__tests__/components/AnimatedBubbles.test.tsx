// import React from "react";
// import { render, waitFor } from "@testing-library/react-native";
// import AnimatedBubbles from "../../UI/animated-bubbles/animated-bubbles";
// import { View } from "react-native";

// // Mock the Animated API
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// /**
//  * AnimatedBubbles Component Tests
//  *
//  * These tests verify that the AnimatedBubbles component renders correctly
//  * with both default and custom bubble counts, and maintains its visual appearance.
//  */
// describe("AnimatedBubbles Component", () => {
//   // Test that component renders with default number of bubbles (15)
//   test("renders with default number of bubbles", async () => {
//     const { UNSAFE_getAllByType } = render(<AnimatedBubbles />);

//     await waitFor(() => {
     
//       const animatedComponents = UNSAFE_getAllByType(View);
//       expect(animatedComponents.length).toBeGreaterThanOrEqual(15);
//     });
//   });

//   // Test that component renders with custom number of bubbles
//   test("renders with custom number of bubbles", async () => {
//     const customBubbleCount = 10;
//     const { UNSAFE_getAllByType } = render(
//       <AnimatedBubbles numberOfBubbles={customBubbleCount} />
//     );

//     await waitFor(() => {
//       // One View container plus the custom number of bubbles
//       const animatedComponents = UNSAFE_getAllByType(View);
//       expect(animatedComponents.length).toBeGreaterThanOrEqual(
//         customBubbleCount
//       );
//     });
//   });

//   // Test component snapshot to detect unexpected UI changes
//   test("matches snapshot", () => {
//     const { toJSON } = render(<AnimatedBubbles />);
//     expect(toJSON()).toMatchSnapshot();
//   });
// });
