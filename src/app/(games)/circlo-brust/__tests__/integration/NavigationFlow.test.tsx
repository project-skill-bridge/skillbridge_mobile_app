/**
 * =========================================================================
 * NavigationFlow Integration Tests
 * =========================================================================
 *
 * These tests verify that the CircloBrust game's navigation flows work
 * correctly, ensuring users can navigate between screens as expected.
 *
 * Tests cover:
 * - Back navigation to home screen
 * - Level selection navigation
 * - Native module activity launching
 * - Navigation state preservation
 *
 * =========================================================================
 

import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import GameScreen from "../../game-screen";

// Mock navigation
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockNavigationAddListener = jest.fn(() => jest.fn());
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    addListener: mockNavigationAddListener,
  }),
}));

// Mock native modules
const mockShowActivity1Screen = jest.fn().mockResolvedValue({
  finalScore: 100,
  levelScore: 1,
  formattedTime: "00:45",
  audioPosition: 20,
});

const mockShowActivity2Screen = jest.fn().mockResolvedValue({
  finalScore: 150,
  levelScore: 2,
  formattedTime: "01:15",
  audioPosition: 30,
});

const mockShowActivity3Screen = jest.fn().mockResolvedValue({
  finalScore: 200,
  levelScore: 3,
  formattedTime: "01:45",
  audioPosition: 40,
});

const mockShowActivity4Screen = jest.fn().mockResolvedValue({
  finalScore: 250,
  levelScore: 4,
  formattedTime: "02:15",
  audioPosition: 50,
});

const mockShowActivity5Screen = jest.fn().mockResolvedValue({
  finalScore: 300,
  levelScore: 5,
  formattedTime: "02:45",
  audioPosition: 60,
});

const mockEventEmitter = {
  addListener: jest.fn(),
  removeAllListeners: jest.fn(),
};

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      LoginModule: {
        showActivity1Screen: mockShowActivity1Screen,
        showActivity2Screen: mockShowActivity2Screen,
        showActivity3Screen: mockShowActivity3Screen,
        showActivity4Screen: mockShowActivity4Screen,
        showActivity5Screen: mockShowActivity5Screen,
      },
    },
    NativeEventEmitter: jest.fn(() => mockEventEmitter),
    Alert: {
      ...RN.Alert,
      alert: jest.fn(),
    },
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  multiGet: jest.fn().mockResolvedValue([
    ["gameScore", "100"],
    ["gameLevel", "2"],
    ["formattedTime", "01:30"],
    ["audioPosition", "0"],
  ]),
  multiSet: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

// Mock Firebase
jest.mock("@react-native-firebase/auth", () => () => ({
  currentUser: {
    uid: "test-user-id",
  },
}));

jest.mock("@react-native-firebase/firestore", () => () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue(true),
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

// Mock other dependencies
jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  resume: jest.fn(),
}));

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          pauseAsync: jest.fn(),
          stopAsync: jest.fn(),
          unloadAsync: jest.fn(),
        },
      }),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

jest.mock("expo-font", () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}));

// Mock custom components
jest.mock(
  "../../UI/animated-bubbles/animated-bubbles",
  () => "AnimatedBubbles"
);
jest.mock("../../UI/animated-logo/animated-logo", () => "LogoAnimation");
jest.mock("@/src/components/FinnCharacter/FinnGame", () => "FinnVoiceTntro");
jest.mock("@/src/components/ui/buffering-progress", () => "BufferingProgress");
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, ...props }: { name: string; [key: string]: any }) => (
    <div data-testid={`icon-${name}`} {...props} />
  ),
}));

// BackHandler mock
const mockBackHandler = {
  addEventListener: jest.fn((event, callback) => {
    return { remove: jest.fn() };
  }),
  removeEventListener: jest.fn(),
};

jest.mock(
  "react-native/Libraries/Utilities/BackHandler",
  () => mockBackHandler
);

describe("Navigation Flow Tests", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to home screen when back button is pressed", async () => {
    // Render the component
    const { getByTestId } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the back button
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);

    // Verify router.push was called with "/home"
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  test("level 1 button launches activity 1 screen", async () => {
    // Render with level set to 1
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "50"],
      ["gameLevel", "1"],
      ["formattedTime", "00:30"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Verify the correct native method was called
    expect(mockShowActivity1Screen).toHaveBeenCalled();
  });

  test("level 2 button launches activity 2 screen", async () => {
    // Render with level set to 2
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "100"],
      ["gameLevel", "2"],
      ["formattedTime", "01:30"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Verify the correct native method was called
    expect(mockShowActivity2Screen).toHaveBeenCalled();
  });

  test("level 3 button launches activity 3 screen", async () => {
    // Render with level set to 3
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "150"],
      ["gameLevel", "3"],
      ["formattedTime", "02:00"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Verify the correct native method was called
    expect(mockShowActivity3Screen).toHaveBeenCalled();
  });

  test("level 4 button launches activity 4 screen", async () => {
    // Render with level set to 4
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "200"],
      ["gameLevel", "4"],
      ["formattedTime", "02:30"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Verify the correct native method was called
    expect(mockShowActivity4Screen).toHaveBeenCalled();
  });

  test("level 5 button launches activity 5 screen", async () => {
    // Render with level set to 5
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "250"],
      ["gameLevel", "5"],
      ["formattedTime", "03:00"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Verify the correct native method was called
    expect(mockShowActivity5Screen).toHaveBeenCalled();
  });

  test("handles hardware back button press", async () => {
    // Render the component
    render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Get the back button handler that was registered
    const backHandler = mockBackHandler.addEventListener.mock.calls[0][1];

    // Call the back handler directly
    backHandler();

    // Verify router.push was called with "/home"
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  test("updates game state after activity completion", async () => {
    // Render with level set to 1
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "50"],
      ["gameLevel", "1"],
      ["formattedTime", "00:30"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");
    fireEvent.press(playButton);

    // Wait for the activity to "complete"
    await act(async () => {
      await Promise.resolve();
    });

    // Verify that AsyncStorage was called to save the new state
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ["gameScore", "100"],
      ["gameLevel", "1"],
      ["formattedTime", "00:45"],
      ["audioPosition", "20"],
    ]);
  });

  test("alerts user when native module raises an error", async () => {
    // Mock a failing native module
    mockShowActivity1Screen.mockRejectedValueOnce(
      new Error("Native activity error")
    );

    // Render with level set to 1
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.multiGet.mockResolvedValueOnce([
      ["gameScore", "50"],
      ["gameLevel", "1"],
      ["formattedTime", "00:30"],
      ["audioPosition", "0"],
    ]);

    const { getByText } = render(<GameScreen />);

    // Wait for the component to finish loading
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Find and press the "Play Now" button
    const playButton = getByText("Play Now");

    // Spy on Alert.alert
    const alertSpy = jest.spyOn(Alert, "alert");

    // Press the button which should trigger the error
    fireEvent.press(playButton);

    // Wait for the promise to reject
    await act(async () => {
      await Promise.resolve();
    });

    // Verify that an alert was shown
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy.mock.calls[0][0]).toContain("Error");

    // Clean up
    alertSpy.mockRestore();
  });
});
*/