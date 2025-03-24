// /**
//  * Unit Tests for toggleMute function
//  *
//  * Tests the audio muting functionality of the game, verifying that:
//  * - Audio playback is properly paused/resumed when mute state changes
//  * - Speech is properly stopped/resumed when mute state changes
//  * - The mute state is correctly toggled
//  */

// import React from "react";
// import { render, fireEvent, act } from "@testing-library/react-native";
// import * as Speech from "expo-speech";
// import { Audio } from "expo-av";

// // We need to extract the component for testing
// // This is a simplified version to focus on testing the toggle functionality
// import GameScreen from "../../game-screen";

// // Mock dependencies
// jest.mock("expo-speech", () => ({
//   stop: jest.fn(),
//   resume: jest.fn(),
// }));

// jest.mock("expo-av", () => ({
//   Audio: {
//     Sound: {
//       createAsync: jest.fn().mockResolvedValue({
//         sound: {
//           playAsync: jest.fn(),
//           pauseAsync: jest.fn(),
//           stopAsync: jest.fn(),
//           unloadAsync: jest.fn(),
//         },
//       }),
//     },
//     setAudioModeAsync: jest.fn(),
//   },
// }));

// // Mock navigation and router
// jest.mock("@react-navigation/native", () => ({
//   useNavigation: () => ({
//     addListener: jest.fn(() => jest.fn()),
//   }),
// }));

// jest.mock("expo-router", () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
// }));

// // Mock AsyncStorage
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

// // Mock Firebase
// jest.mock("@react-native-firebase/auth", () => () => ({
//   currentUser: {
//     uid: "test-user-id",
//   },
// }));

// jest.mock("@react-native-firebase/firestore", () => () => ({
//   collection: jest.fn().mockReturnThis(),
//   doc: jest.fn().mockReturnThis(),
//   set: jest.fn().mockResolvedValue(true),
//   FieldValue: {
//     serverTimestamp: jest.fn(),
//   },
// }));

// // Mock custom components
// jest.mock(
//   "../../UI/animated-bubbles/animated-bubbles",
//   () => "AnimatedBubbles"
// );
// jest.mock("../../UI/animated-logo/animated-logo", () => "LogoAnimation");
// jest.mock("@/src/components/FinnCharacter/FinnGame", () => "FinnVoiceTntro");
// jest.mock("@/src/components/ui/buffering-progress", () => "BufferingProgress");
// jest.mock("@expo/vector-icons", () => ({
//   Ionicons: "Ionicons",
// }));

// // Mock font loading
// jest.mock("expo-font", () => ({
//   useFonts: jest.fn().mockReturnValue([true]),
// }));

// // Set testIDs for components we'll need to find
// jest.mock("react-native", () => {
//   const RN = jest.requireActual("react-native");

//   return {
//     ...RN,
//     TouchableOpacity: ({ onPress, testID, children, ...props }: { onPress: () => void; testID: string; children: React.ReactNode; [key: string]: any }) => (
//       <RN.TouchableOpacity onPress={onPress} testID={testID} {...props}>
//         {children}
//       </RN.TouchableOpacity>
//     ),
//   };
// });

// describe("toggleMute Function", () => {
//   // Reset all mocks before each test
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("toggles from unmuted to muted state", async () => {
//     // Render the component
//     const { getByTestId } = render(<GameScreen />);

//     // Wait for the component to finish loading
//     await act(async () => {
//       // Force a tick to ensure loading is done
//       await new Promise((resolve) => setTimeout(resolve, 0));
//     });

//     // Initially the sound should be created and played (unmuted)
//     expect(Audio.Sound.createAsync).toHaveBeenCalled();

//     // Find the mute button by its testID
//     const muteButton = getByTestId("mute-button");

//     // Initial state is unmuted, press the button to mute
//     await act(async () => {
//       fireEvent.press(muteButton);
//     });

//     // The sound should be paused
//     const sound = (await Audio.Sound.createAsync(require('../../../../../../assets/sounds/background-music-circlobrust.mp3'))).sound;
//     expect(sound.pauseAsync).toHaveBeenCalled();

//     // Speech should be stopped
//     expect(Speech.stop).toHaveBeenCalled();
//   });

//   test("toggles from muted to unmuted state", async () => {
//     // Render the component
//     const { getByTestId } = render(<GameScreen />);

//     // Wait for the component to finish loading
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 0));
//     });

//     // Find the mute button
//     const muteButton = getByTestId("mute-button");

//     // First press to mute
//     await act(async () => {
//       fireEvent.press(muteButton);
//     });

//     // Clear previous mock calls
//     jest.clearAllMocks();

//     // Second press to unmute
//     await act(async () => {
//       fireEvent.press(muteButton);
//     });

//     // The sound should now be played
//     const sound = (await Audio.Sound.createAsync(require('../../../../../../assets/sounds/background-music-circlobrust.mp3'))).sound;
//     expect(sound.playAsync).toHaveBeenCalled();

//     // Speech should be resumed
//     expect(Speech.resume).toHaveBeenCalled();
//   });

//   test("does nothing when sound is not initialized", async () => {
//     // Mock Audio.Sound.createAsync to return null sound
//     (Audio.Sound.createAsync as jest.Mock).mockResolvedValueOnce({ sound: null });

//     // Render the component
//     const { getByTestId } = render(<GameScreen />);

//     // Wait for the component to finish loading
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 0));
//     });

//     // Clear previous mock calls
//     jest.clearAllMocks();

//     // Find the mute button
//     const muteButton = getByTestId("mute-button");

//     // Press the mute button
//     await act(async () => {
//       fireEvent.press(muteButton);
//     });

//     // No audio methods should be called
//     const sound = (await Audio.Sound.createAsync(require('../../../../../../assets/sounds/background-music-circlobrust.mp3'))).sound;
//     expect(sound.playAsync).not.toHaveBeenCalled();
//     expect(sound.pauseAsync).not.toHaveBeenCalled();

//     // No speech methods should be called
//     expect(Speech.stop).not.toHaveBeenCalled();
//     expect(Speech.resume).not.toHaveBeenCalled();
//   });
// });
