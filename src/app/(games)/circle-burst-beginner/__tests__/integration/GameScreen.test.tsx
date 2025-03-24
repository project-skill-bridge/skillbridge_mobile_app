// import React from "react";
// import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
// import GameScreen from "../../game-screen";

// // Import our mocks
// import { mockAuth } from "../../__mocks__/firebase-auth-mock";
// import { mockFirestore } from "../../__mocks__/firebase-mock";
// // Mock dependencies
// jest.mock("expo-router", () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
// }));

// jest.mock("@react-navigation/native", () => ({
//   useNavigation: () => ({
//     addListener: jest.fn(() => jest.fn()),
//   }),
// }));

// jest.mock("expo-speech", () => ({
//   speak: jest.fn(),
//   stop: jest.fn(),
//   resume: jest.fn(),
// }));

// jest.mock("expo-av", () => ({
//   Audio: {
//     Sound: {
//       createAsync: jest.fn().mockResolvedValue({
//         sound: {
//           playAsync: jest.fn(),
//           stopAsync: jest.fn(),
//           pauseAsync: jest.fn(),
//           unloadAsync: jest.fn(),
//         },
//       }),
//     },
//     setAudioModeAsync: jest.fn(),
//   },
// }));

// jest.mock("expo-font", () => ({
//   useFonts: jest.fn().mockReturnValue([true]),
// }));

// jest.mock("@react-native-async-storage/async-storage", () => ({
//   multiGet: jest.fn().mockResolvedValue([
//     ["gameScore", "100"],
//     ["gameLevel", "2"],
//     ["formattedTime", "01:30"],
//     ["audioPosition", "0"],
//   ]),
//   multiSet: jest.fn().mockResolvedValue(null),
//   setItem: jest.fn().mockResolvedValue(null),
// }));

// jest.mock("@react-native-firebase/auth", () => () => mockAuth);
// jest.mock("@react-native-firebase/firestore", () => () => mockFirestore);

// jest.mock(
//   "../../UI/animated-bubbles/animated-bubbles",
//   () => "AnimatedBubbles"
// );
// jest.mock("../../UI/animated-logo/animated-logo", () => "LogoAnimation");
// jest.mock("@/src/components/FinnCharacter/FinnGame", () => "FinnVoiceTntro");
// jest.mock("@/src/components/ui/buffering-progress", () => "BufferingProgress");

// /**
//  * GameScreen Integration Tests
//  *
//  * These tests verify that the GameScreen component integrates correctly
//  * with its dependencies and handles user interactions appropriately.
//  */
// describe("GameScreen Integration", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();

//     // Add testID to the Ionicons mock
//     jest.mock("@expo/vector-icons", () => ({
//       Ionicons: ({ name, ...props }: { name: string; [key: string]: any }) => (
//         <div data-testid={`icon-${name}`} {...props} />
//       ),
//     }));
//   });

//   // Test basic rendering
//   test("renders loading state initially", async () => {
//     const { getByTestId } = render(<GameScreen />);

//     // Initially shows loading indicator
//     expect(getByTestId("loading-indicator")).toBeTruthy();
//   });

//   // Test game state after data is loaded
//   test("loads game state from AsyncStorage", async () => {
//     const { findByText } = render(<GameScreen />);

//     // After data is loaded, shows level 2 as retrieved from AsyncStorage mock
//     const levelText = await findByText("Level 2 : Color Burst");
//     expect(levelText).toBeTruthy();
//   });

//   // Test navigation
//   test("navigates to home when back button is pressed", async () => {
//     const { findByTestId } = render(<GameScreen />);
//     const router = require("expo-router").useRouter();

//     // Find and press the back button
//     const backButton = await findByTestId("back-button");
//     fireEvent.press(backButton);

//     // Verify router.push was called with "/home"
//     expect(router.push).toHaveBeenCalledWith("/home");
//   });

//   // Test audio control
//   test("toggles mute state when mute button is pressed", async () => {
//     const { findByTestId } = render(<GameScreen />);
//     const Audio = require("expo-av").Audio;

//     // Initially audio should be playing
//     expect(Audio.Sound.createAsync).toHaveBeenCalled();

//     // Find and press mute button
//     const muteButton = await findByTestId("mute-button");
//     fireEvent.press(muteButton);

//     // After pressing, pauseAsync should be called
//     const sound = (await Audio.Sound.createAsync()).sound;
//     expect(sound.pauseAsync).toHaveBeenCalled();
//   });

//   // Test resume game button
//   test("calls openActivityScreen when Resume Game button is pressed", async () => {
//     const { findByText } = render(<GameScreen />);

//     // Mock native modules
//     (global as any).NativeModules = {
//       LoginModule: {
//         showActivity2Screen: jest.fn().mockResolvedValue({
//           finalScore: 200,
//           levelScore: 3,
//           formattedTime: "02:30",
//           audioPosition: 50,
//         }),
//       },
//     };

//     // Define the type for global.NativeModules
//     interface NativeModules {
//       LoginModule: {
//         showActivity2Screen: jest.Mock;
//       };
//     }
    

    
//   });
// });
