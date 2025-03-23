/**
 * =========================================================================
 * CircloBrust Game Screen Component
 * =========================================================================
 *
 * This component serves as the main menu screen for the CircloBrust game,
 * providing users with:
 *  - Game level selection and status
 *  - Audio controls
 *  - Game state management
 *  - Animated UI elements
 *  - Voice guidance through Finn character
 *
 * The game integrates with native modules to launch the appropriate
 * native activity screens for each game level, and manages the state
 * between sessions using AsyncStorage and Firebase.
 *
 * @lastUpdated March 21, 2025
 * =========================================================================
 */

/* ================ REACT CORE IMPORTS ================ */
// Core React library and hooks for component lifecycle, state, and optimization
import React, { useEffect, useRef, useState, useCallback } from "react";

/* ================ REACT NATIVE & EXPO IMPORTS ================ */
// UI components, styling, animation, and device functionality from React Native and Expo
import {
  StatusBar, // Controls the app status bar appearance
  StyleSheet, // For creating stylesheets
  Text, // Basic text display component
  View, // Fundamental layout component
  TouchableOpacity, // Touchable area with opacity feedback
  SafeAreaView, // Container that respects safe areas
  Animated, // Animation system
  Easing, // Animation easing functions
  Dimensions, // Screen dimensions utility
  ImageBackground, // Image with child components
  NativeModules, // Bridge to native code
  NativeEventEmitter, // Event system for native code
  Alert, // Native alert dialog
  AppState, // App lifecycle monitoring
  BackHandler, // Hardware back button handler
} from "react-native";
import * as Speech from "expo-speech"; // Text-to-speech functionality
import { LinearGradient } from "expo-linear-gradient"; // Gradient backgrounds
import { useFonts } from "expo-font"; // Custom font loading
import { Ionicons } from "@expo/vector-icons"; // Icon set
import { Audio } from "expo-av"; // Audio playback capabilities

/* ================ NAVIGATION IMPORTS ================ */
// Navigation utilities for screen transitions and routing
import { useNavigation } from "@react-navigation/native"; // Navigation hooks
import { useRouter } from "expo-router"; // Expo router navigation

/* ================ STORAGE & DATABASE IMPORTS ================ */
// Local storage and cloud database services for data persistence
import AsyncStorage from "@react-native-async-storage/async-storage"; // Local storage
import auth from "@react-native-firebase/auth"; // Firebase authentication
import firestore from "@react-native-firebase/firestore"; // Firebase database

/* ================ CUSTOM COMPONENTS & ASSETS IMPORTS ================ */
// App-specific UI components, animations, and static assets
import { Images } from "@/src/constants/Images"; // Image assets
import { Fonts } from "@/src/constants/Fonts"; // Font assets
import FinnVoiceTntro from "@/src/components/FinnCharacter/FinnGame"; // Character voice guide
import BufferingProgress from "@/src/components/ui/buffering-progress"; // Loading indicator
import AnimatedBubbles from "@/src/app/(games)/circlo-brust/UI/animated-bubbles/animated-bubbles"; // Background bubble animations
import LogoAnimation from "@/src/app/(games)/circlo-brust/UI/animated-logo/animated-logo"; // Game logo animation

/* ================ CONSTANTS ================ */
// Get device screen dimensions for responsive layouts
const { width, height } = Dimensions.get("window");

/* ================ NATIVE MODULE SETUP ================ */
/**
 * Access to native code functionality through the bridge
 * LoginModule provides methods to launch different game activities
 */
const { LoginModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(LoginModule);

/* ================ GAME LEVEL CONFIGURATION ================ */
/**
 * Mapping of level numbers to user-friendly level names
 * These names are displayed in the UI and spoken by the voice assistant
 */
const levelNames: { [key: number]: string } = {
  1: "Level 1 : Bubble Joy", // Introductory level
  2: "Level 2 : Color Burst", // Intermediate level with more colors
  3: "Level 3 : Speedy Dots", // Advanced level with faster elements
  4: "Level 4 : Magic Circles", // Expert level with special effects
  5: "Level 5 : Super Pop Rush", // Final challenge level
};

/**
 * Main GameScreen Component
 *
 * Manages the entire game experience including:
 * - Game state (level, score, time)
 * - Audio management (background music, speech)
 * - Native activity integration
 * - Animation and visual effects
 * - Data persistence (AsyncStorage, Firebase)
 *
 * @returns {JSX.Element} The rendered game screen
 */
export default function GameScreen() {
  /* ================ STATE VARIABLES ================ */
  const router = useRouter(); // Navigation controller
  const [score, setScore] = useState(0); // Player's current score
  const [level, setLevel] = useState(1); // Current game level (1-5)
  const [formattedTime, setFormattedTime] = useState(""); // Game timer in formatted display
  const [audioPosition, setAudioPosition] = useState(0); // Position in background audio for resuming
  const [hasFetchedData, setHasFetchedData] = useState(false); // Flag for initial data load
  const [navigationKey, setNavigationKey] = useState(0); // Counter for navigation actions
  const [isFirstRun, setIsFirstRun] = useState(true); // Flag for first-time players
  const [spokenLevels, setSpokenLevels] = useState<number[]>([]); // Tracks which levels have been announced
  const [isToggling, setIsToggling] = useState(false); // Track when toggle is in progress

  /* ================ ACTIVITY RESULT HANDLER ================ */
  /**
   * Processes the result returned from native game activities
   * Updates game state (score, level, time) and persists to storage
   *
   * @param {any} result - Data returned from native activity
   */
  const handleActivityResult = async (result: any) => {
    // Skip if no result was returned
    if (!result) return;

    // Extract values from result, falling back to current values if missing
    const newScore = result.finalScore ?? score;
    const newLevel = result.levelScore ?? level;
    const newFormattedTime = result.formattedTime ?? formattedTime;
    const newAudioPosition = result.audioPosition ?? audioPosition;

    // Update state with new values
    setAudioPosition(newAudioPosition);
    setScore(newScore);
    setLevel(newLevel);
    setFormattedTime(newFormattedTime);

    // Persist all values to AsyncStorage for game continuity
    await AsyncStorage.multiSet([
      ["gameScore", newScore.toString()],
      ["gameLevel", newLevel.toString()],
      ["formattedTime", newFormattedTime],
      ["audioPosition", newAudioPosition.toString()],
    ]);
  };

  /* ================ ACTIVITY SCREEN LAUNCHERS ================ */
  /**
   * Opens a specific game activity through the native module
   * Passes current game state and handles the result
   *
   * @param {number} activityNumber - The level number to launch (1-5)
   */
  const openActivityScreen = async (activityNumber: number) => {
    try {
      // Dynamically construct the method name based on activity number
      const methodName =
        `showActivity${activityNumber}Screen` as keyof typeof LoginModule;

      // Call the native method with current game state
      const result = await LoginModule[methodName](
        score,
        formattedTime,
        audioPosition
      );

      // Process the returned result
      await handleActivityResult(result);

      // Clean up audio resources
      stopBackgroundMusic();
      Speech.stop();

      // Update first run flag if needed
      if (isFirstRun) setIsFirstRun(false);
    } catch (error) {
      // Ensure audio cleanup even on failure
      Speech.stop();
      stopBackgroundMusic();
    }
  };

  // Level-specific activity launcher convenience methods
  /**
   * Convenience methods for launching specific level activities
   * These provide a cleaner API for the different event handlers
   */
  const openLoginScreen = () => openActivityScreen(1); // Level 1
  const openActivity2Screen = () => openActivityScreen(2); // Level 2
  const openActivity3Screen = () => openActivityScreen(3); // Level 3
  const openActivity4Screen = () => openActivityScreen(4); // Level 4
  const openActivity5Screen = () => openActivityScreen(5); // Level 5

  /* ================ EVENT HANDLERS & LISTENERS ================ */
  /**
   * Handles results from Activity 2
   * Updates game state and returns to home screen
   */
  useEffect(() => {
    const handleActivity2Result = async (result: {
      audioPosition: any;
      finalScore: any;
      levelScore: any;
      formattedTime: any;
    }) => {
      // Extract values from the result
      const newScore = result.finalScore;
      const newLevel = result.levelScore;
      const newFormattedTime = result.formattedTime;
      const newAudioPosition = result.audioPosition;

      // Update state with new values
      setScore(newScore);
      setLevel(newLevel);
      setFormattedTime(newFormattedTime);
      setAudioPosition(newAudioPosition);

      // Persist to storage
      await AsyncStorage.multiSet([
        ["gameScore", newScore.toString()],
        ["gameLevel", newLevel.toString()],
        ["formattedTime", newFormattedTime],
        ["audioPosition", newAudioPosition.toString()],
      ]);

      // Clean up and navigate
      Speech.stop();
      await stopBackgroundMusic();
      router.push("/home");
    };

    // Register event listener
    const subscription = eventEmitter.addListener(
      "Activity2Result",
      handleActivity2Result
    );

    // Cleanup function
    return () => subscription.remove();
  }, []); // Empty dependency array ensures this runs once on mount

  /**
   * Handles results from Activity 1
   * Updates game state and launches the appropriate next level
   */
  useEffect(() => {
    const handleActivity1Result = (result: {
      audioPosition: any;
      finalScore: any;
      levelScore: any;
      formattedTime: any;
    }) => {
      // Extract and update state values
      const newScore = result.finalScore;
      const newLevel = result.levelScore;
      const newFormattedTime = result.formattedTime;
      const newAudioPosition = result.audioPosition;

      setScore(newScore);
      setLevel(newLevel);
      setFormattedTime(newFormattedTime);
      setAudioPosition(newAudioPosition);

      // Persist to storage
      AsyncStorage.setItem("gameScore", newScore.toString());
      AsyncStorage.setItem("gameLevel", newLevel.toString());
      AsyncStorage.setItem("formattedTime", newFormattedTime);
      AsyncStorage.setItem("audioPosition", newAudioPosition.toString());

      // If level changed, launch the appropriate level activity
      if (newLevel !== level) {
        // Clean up audio before launching
        stopBackgroundMusic();
        Speech.stop();

        // Launch the appropriate level based on newLevel
        if (newLevel == 1) {
          openLoginScreen();
        } else if (newLevel == 2) {
          openActivity2Screen();
        } else if (newLevel == 3) {
          openActivity3Screen();
        } else if (newLevel == 4) {
          openActivity4Screen();
        } else if (newLevel == 5) {
          openActivity5Screen();
        }
      }
    };

    // Register event listener
    const subscription = eventEmitter.addListener(
      "Activity1Result",
      handleActivity1Result
    );

    // Cleanup function
    return () => subscription.remove();
  }, []);

  /* ================ FIREBASE DATA MANAGEMENT ================ */
  /**
   * Calculates the overall game progress percentage based on current level
   * Used for displaying progress indicators and achievements
   *
   * @param {number} currentLevel - The player's current level (1-5)
   * @returns {number} The overall game completion percentage (0-100)
   */
  const getProgressPercentage = (currentLevel: number) => {
    switch (currentLevel) {
      case 1:
        return 0; // Just starting
      case 2:
        return 20; // 20% complete
      case 3:
        return 40; // 40% complete
      case 4:
        return 60; // 60% complete
      case 5:
        return 80; // 80% complete (100% when completed)
      default:
        return 0; // Default to 0 for safety
    }
  };

  /**
   * Displays error alerts for Firebase operations
   * Centralizes error handling for consistency
   *
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   */
  const handleGameError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  /**
   * Saves game data to Firebase
   * Stores level, score, progress percentage, and timestamp
   */
  useEffect(() => {
    const saveGameData = async () => {
      try {
        // Verify user is authenticated
        const user = auth().currentUser;
        if (!user) return; // Skip if not logged in

        // Prepare game data objects
        const levelBasedGameData = {
          level: level,
          score: score,
        };

        const totalGameProgressPercentage = {
          totalGameProgressPercentage: getProgressPercentage(level),
        };

        const savedTime = {
          timestamp: firestore.FieldValue.serverTimestamp(),
        };

        // Save to Firebase with merge strategy
        await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("games")
          .doc("circlo-brust")
          .set(
            {
              ...levelBasedGameData,
              ...totalGameProgressPercentage,
              ...savedTime,
            },
            { merge: true } // Update only the provided fields
          );
      } catch (error) {
        // Handle errors gracefully
        handleGameError("Save Error", "Progress saved error");
        console.error("Firebase save error:", error);
      }
    };

    // Throttle saves to prevent excessive database writes
    const saveTimeout = setTimeout(saveGameData, 1000);
    return () => clearTimeout(saveTimeout);
  }, [level, score]); // Only run when level or score changes

  /* ================ LOAD SAVED GAME DATA ================ */
  /**
   * Loads previously saved game data from AsyncStorage on component mount
   * Restores the player's level, score, and audio position
   */
  useEffect(() => {
    const loadSavedGame = async () => {
      try {
        if (!hasFetchedData) {
          // Fetch all game data in parallel for efficiency
          const [
            savedScore,
            savedLevel,
            savedFormattedTime,
            savedAudioPosition,
          ] = await AsyncStorage.multiGet([
            "gameScore",
            "gameLevel",
            "formattedTime",
            "audioPosition",
          ]);

          // Parse and set audio position
          setAudioPosition(parseInt(savedAudioPosition?.[1] || "0", 10));

          // Determine if this is first run based on absence of saved data
          setIsFirstRun(!savedScore?.[1] && !savedLevel?.[1]);

          // Parse and set score (default to 0)
          setScore(parseInt(savedScore?.[1] || "0", 10));

          // Parse and set level (default to 1)
          setLevel(parseInt(savedLevel?.[1] || "1", 10));

          // Set formatted time (default to empty string)
          setFormattedTime(savedFormattedTime?.[1] || "");

          // Mark data as fetched to prevent duplicate loading
          setHasFetchedData(true);
        }
      } catch (error) {
        // Handle loading errors
        console.error("Error loading saved game:", error);
        Alert.alert("Error", "Failed to load the saved game.");
      }
    };

    loadSavedGame();
  }, [hasFetchedData]); // Dependency ensures this runs once when component mounts

  /* ================ NAVIGATION HANDLERS ================ */
  /**
   * Handles navigation to home screen when navigationKey changes
   * Stops speech and audio before navigating
   */
  useEffect(() => {
    if (navigationKey > 0) {
      router.push("/home");
      Speech.stop();
    }
  }, [navigationKey]);

  /**
   * Sets up event listeners for navigation between different game activities
   * Allows the native code to request specific level launches
   */
  useEffect(() => {
    // Register listeners for each activity navigation event
    const subscription1 = eventEmitter.addListener(
      "NavigateToActivity1",
      openLoginScreen
    );
    const subscription2 = eventEmitter.addListener(
      "NavigateToActivity2",
      openActivity2Screen
    );
    const subscription3 = eventEmitter.addListener(
      "NavigateToActivity3",
      openActivity3Screen
    );
    const subscription4 = eventEmitter.addListener(
      "NavigateToActivity4",
      openActivity4Screen
    );
    const subscription5 = eventEmitter.addListener(
      "NavigateToActivity5",
      openActivity5Screen
    );

    // Cleanup all subscriptions on unmount
    return () => {
      subscription1.remove();
      subscription2.remove();
      subscription3.remove();
      subscription4.remove();
      subscription5.remove();
    };
  }, [
    openLoginScreen,
    openActivity2Screen,
    openActivity3Screen,
    openActivity4Screen,
    openActivity5Screen,
  ]);

  /**
   * Handles "Resume Game" button press
   * Launches the appropriate game activity based on current level
   */
  const handleResume = useCallback(() => {
    openActivityScreen(level); // Launch the current level activity
  }, [level, openActivityScreen]);

  /* ================ AUDIO MANAGEMENT ================ */
  const navigation = useNavigation(); // Navigation controller for cleanup events
  const [isMuted, setIsMuted] = useState(false); // Tracks audio mute state
  const isMutedRef = useRef(isMuted); // Ref for access in async contexts
  const [sound, setSound] = useState<Audio.Sound>(); // State for sound object
  const soundRef = useRef<Audio.Sound>(); // Ref for access in async contexts

  // Load custom fonts for text elements
  const [fontsLoaded] = useFonts({
    "Montserrat-Bold": Fonts.Coiny,
    "Montserrat-SemiBold": Fonts.Coiny,
  });

  /**
   * Handles cleanup when navigating away from screen
   * Ensures audio resources are properly released
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = undefined;
          Speech.stop();
        }
      } catch (error) {
        console.log("Navigation cleanup error:", error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * Ensures the muted state ref stays in sync with state
   * Important for accessing correct state in async contexts
   */
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  /**
   * Loads and plays background music
   * Handles app state changes (foreground/background)
   */
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    /**
     * Loads and initializes background music
     * Sets up looping and volume controls
     */
    const loadAudio = async () => {
      try {
        // Create and configure sound object
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/sounds/background-music-circlobrust.mp3"),
          {
            isLooping: true, // Loop continuously
            volume: 0.5, // 50% volume
          }
        );

        // Prevent state updates if component unmounted
        if (!isMounted) return;

        // Store sound reference and play if not muted
        soundRef.current = sound;
        if (!isMutedRef.current) {
          await sound.playAsync();
        }
      } catch (error) {
        console.log("Audio loading error:", error);
      }
    };

    /**
     * Handles app state changes (foreground/background)
     * Pauses audio when app is backgrounded, resumes when foregrounded
     *
     * @param {string} nextAppState - The new app state
     */
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && soundRef.current) {
        // App going to background - pause audio and speech
        soundRef.current.pauseAsync();
        Speech.stop();
      } else if (
        nextAppState === "active" &&
        soundRef.current &&
        !isMutedRef.current
      ) {
        // App coming to foreground - resume audio if not muted
        soundRef.current.playAsync();
      }
    };

    /**
     * Handles screen losing focus
     * Pauses audio and speech
     */
    const onBlur = () => {
      if (soundRef.current) {
        soundRef.current.pauseAsync();
        Speech.stop();
      }
    };

    /**
     * Handles screen gaining focus
     * Resumes audio if not muted
     */
    const onFocus = () => {
      if (soundRef.current && !isMutedRef.current) {
        soundRef.current.playAsync();
      }
    };

    // Configure global audio mode for the app
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true, // Lower volume when notifications occur
    });

    // Initialize audio
    loadAudio();

    // Cleanup function with async handling
    return () => {
      isMounted = false; // Mark component as unmounted

      // Async cleanup function for audio resources
      (async () => {
        try {
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = undefined;
            Speech.stop();
          }
        } catch (error) {
          console.log("Audio cleanup error:", error);
        }
      })();
    };
  }, [navigation]);

  /**
   * Toggles audio mute state
   * Pauses/resumes background music and speech
   */
  const toggleMute = async () => {
    // Prevent multiple clicks while operation is in progress
    if (isToggling || !soundRef.current) return;

    try {
      setIsToggling(true);

      if (isMuted) {
        // Unmuting - resume audio and speech
        await soundRef.current.playAsync();
      } else {
        // Muting - pause audio and speech
        await soundRef.current.pauseAsync();
        Speech.stop();
      }

      // Update state after operation completes
      setIsMuted(!isMuted);
      isMutedRef.current = !isMuted; // Update ref immediately
    } catch (error) {
      console.log("Audio toggle error:", error);
      // Handle error - show feedback to user if needed
    } finally {
      setIsToggling(false);
    }
  };

  /**
   * Handles back button press
   * Stops audio, returns to home screen
   */
  const handleBack = useCallback(() => {
    Speech.stop();

    const stopAudioAndNavigate = async () => {
      try {
        // Clean up audio resources
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = undefined;
          Speech.stop();
        }
      } catch (error) {
        console.log("Audio stop error:", error);
      }
    };

    // Navigate to home screen
    router.push("/home");
    stopAudioAndNavigate();
    return true; // Prevent default back behavior
  }, [router]);

  /**
   * Stops background music and releases resources
   * Used when transitioning between screens or game states
   */
  const stopBackgroundMusic = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = undefined;
      Speech.stop();
    }
  };

  /**
   * Handles hardware back button press
   * Routes to custom back handler
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );
    return () => backHandler.remove();
  }, [handleBack]);

  /* ================ ANIMATIONS ================ */
  // Animation value references for various visual effects
  const pulseAnim = useRef(new Animated.Value(1)).current; // Controls pulsing effect
  const handAnim = useRef(new Animated.Value(0)).current; // Controls hand movement
  const waveAnim = useRef(new Animated.Value(0)).current; // Controls wave animation
  const bannerShineAnim = useRef(new Animated.Value(-width)).current; // Controls shine effect
  const handRotateAnim = useRef(new Animated.Value(0)).current; // Controls hand rotation

  // Generate random positions for background bubbles
  const bubblePositions = Array.from(
    { length: 15 },
    () => Math.random() * width
  );

  /**
   * Sets up and starts all animations
   * Creates looping animations for visual elements
   */
  useEffect(() => {
    // Pulse animation for the blue circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2, // Expand to 120%
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, // Return to normal size
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hand animation - scaling up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(handAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(handAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hand rotation animation - full 360° rotation
    Animated.loop(
      Animated.timing(handRotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Wave animation - for bottom gradient
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Banner shine animation - sliding highlight effect
    Animated.loop(
      Animated.timing(bannerShineAnim, {
        toValue: width,
        duration: 3000,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 2000, // Wait between shine effects
      })
    ).start();
  }, []);

  // Animation interpolations for derived values
  const handScale = handAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1], // Scale between 90% and 110%
  });

  const handRotate = handRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Rotate from 0 to 360 degrees
  });

  // Wave animation for bottom section
  const waveTransform = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, -50], // Move from below to above
  });

  /* ================ RENDER ================ */
  // Wait for fonts to load before rendering
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {hasFetchedData ? (
        <>
          {/* Status Bar Configuration */}
          <StatusBar barStyle="dark-content" />

          {/* Animated Background Bubbles */}
          <AnimatedBubbles />

          {/* Top Navigation Header */}
          <View style={styles.header}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.headerTitle}>CIRCLOBRUST</Text>

            {/* Mute/Unmute Button */}
            <TouchableOpacity
              style={[styles.muteButton, isToggling ? { opacity: 0.7 } : {}]}
              onPress={toggleMute}
              disabled={isToggling}
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-medium"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          {/* Game Logo Area with Animations */}
          <View style={styles.logoContainer}>
            <LogoAnimation />
          </View>

          {/* Finn Character Voice Guide Overlay */}
          <View style={styles.finnOverlay}>
            <FinnVoiceTntro
              displayText={
                level === 1
                  ? "Welcome to Level 1! Pop the blue bubbles to score points and advance."
                  : level === 2
                  ? "Level 2 unlocked! Now you'll face faster bubbles and more challenges."
                  : level === 3
                  ? "Level 3 unlocked! Can you keep up with the speedy dots?"
                  : level === 4
                  ? "Level 4 unlocked! Magic Circles are here to challenge you."
                  : "Level 5 unlocked! Super Pop Rush is the final challenge."
              }
              IntroText=""
              buttonText={
                level === 1
                  ? "Welcome to Level 1! Pop the blue bubbles to score points and advance."
                  : level === 2
                  ? "Level 2 unlocked! Now you'll face faster bubbles and more challenges."
                  : level === 3
                  ? "Level 3 unlocked! Can you keep up with the speedy dots?"
                  : level === 4
                  ? "Level 4 unlocked! Magic Circles are here to challenge you."
                  : "Level 5 unlocked! Super Pop Rush is the final challenge."
              }
            />

            {/* Text-to-Speech for level announcements (only played once per level) */}
            {level >= 1 && level <= 5 && !spokenLevels.includes(level) && (
              <>
                {Speech.speak(
                  `<speak><break time="1500ms"/>${
                    level === 1
                      ? "Welcome to Level 1! Pop the blue bubbles to score points and advance."
                      : level === 2
                      ? "Level 2 unlocked! Now you'll face faster bubbles and more challenges."
                      : level === 3
                      ? "Level 3 unlocked! Can you keep up with the speedy dots?"
                      : level === 4
                      ? "Level 4 unlocked! Magic Circles are here to challenge you."
                      : "Level 5 unlocked! Super Pop Rush is the final challenge."
                  }</speak>`,
                  { rate: 0.9, language: "en-US", pitch: 1.0, volume: 1.0 }
                )}
                {/* Mark this level as announced */}
                {setSpokenLevels([...spokenLevels, level])}
              </>
            )}
          </View>

          {/* Bottom Section with Level Info and Play Button */}
          <View style={styles.bottomContainer}>
            {/* Animated Wave Gradient Background */}
            <Animated.View
              style={[
                styles.gradientContainer,
                { transform: [{ translateY: waveTransform }] },
              ]}
            >
              <LinearGradient
                colors={["#ffffff", "#ffffff"]}
                style={styles.gradientFill}
                start={{ x: 0.5, y: -1 }} // Start from bottom
                end={{ x: 0.5, y: 0 }} // End at top
              />
            </Animated.View>

            {/* SVG Background Decoration */}
            <ImageBackground
              source={Images.BackgroundSVGcirclobrust}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              <View style={styles.bottomContent}>
                {/* Level Display */}
                <Text style={styles.levelText}>
                  {" "}
                  {levelNames[level] || `Level ${level}`}
                </Text>

                {/* Play/Resume Button */}
                <TouchableOpacity
                  style={styles.resumeButton}
                  onPress={async () => {
                    await stopBackgroundMusic();
                    handleResume();
                  }}
                >
                  <Text style={styles.resumeButtonText}>
                    {audioPosition > 0 ? "Resume Game" : "Play Now"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </>
      ) : (
        /* Loading State */
        <View style={styles.loadingContainer}>
          <BufferingProgress />
        </View>
      )}
    </SafeAreaView>
  );
}

/* ================ STYLES ================ */
/**
 * Component styles using StyleSheet for optimal performance
 * Organized by component section for maintainability
 */
const styles = StyleSheet.create({
  /* Loading Screen Styles */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Clean white background
  },

  /* Main Container Styles */
  container: {
    flex: 1,
    backgroundColor: "#fff", // Consistent white background
  },

  /* Bubble Animation Styles */
  bubblesContainer: {
    ...StyleSheet.absoluteFillObject, // Cover entire screen
    overflow: "hidden", // Prevent bubbles from causing scrolling
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#6979c9", // Soft blue color
    opacity: 0.5, // Semi-transparent
  },

  /* Header Styles */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 10, // Above background elements
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular button
    backgroundColor: "#8de4a2", // Light green
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 15,
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#333", // Dark gray text
  },

  /* Logo Container Styles */
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 5,
    marginTop: 20, // Space from header
  },

  /* Logo Box Styles */
  logoBox: {
    width: "100%",
    aspectRatio: 1.6, // Maintains consistent proportions
    backgroundColor: "#e63946", // Vibrant red
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
    overflow: "hidden", // For shine effect
    borderWidth: 2,
    borderColor: "#c1121f", // Darker red border
    position: "relative", // For absolute child positioning
  },

  /* Shine Effect Styles */
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 60,
    height: "300%", // Extra height for rotating
    backgroundColor: "rgba(255, 255, 255, 0.3)", // White semi-transparent
    transform: [{ rotate: "45deg" }], // Diagonal shine
  },

  /* Banner Content Styles */
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },

  /* Hand and Circle Animation Styles */
  splatterContainer: {
    position: "relative",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  handContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Below circle
  },
  blueCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20, // Perfect circle
    backgroundColor: "#1d3557", // Dark blue
    zIndex: 2, // Above hand
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3, // Subtle shadow
  },

  /* Logo Text Styles */
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  logoText: {
    color: "#f1faee", // Off-white
    fontSize: 28,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3, // Text shadow for depth
  },
  logoTextBold: {
    fontFamily: "Montserrat-Bold",
    color: "#ffd700", // Gold color for emphasis
  },

  /* Banner Corner Decorations */
  bannerCorner1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f", // Dark red
    borderBottomRightRadius: 15, // Quarter circle
  },
  bannerCorner2: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f",
    borderBottomLeftRadius: 15,
  },
  bannerCorner3: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f",
    borderTopRightRadius: 15,
  },
  bannerCorner4: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f",
    borderTopLeftRadius: 15,
  },

  /* Bottom Section Styles */
  bottomContainer: {
    height: 340, // Fixed height
    position: "relative",
    zIndex: 5,
    overflow: "hidden", // For wave animation
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50, // Gradient height
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40, // Space at bottom
    paddingTop: 40, // Space at top
  },
  levelText: {
    color: "#EBEF00", // Bright yellow
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 10, // Space before button
  },

  /* Play Button Styles */
  resumeButton: {
    backgroundColor: "#2ecc71", // Bright green
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30, // Pill shape
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    transform: [{ translateY: 0 }],
  },
  resumeButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
  },

  /* Gradient Container Styles */
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Below content
  },
  gradientFill: {
    flex: 1,
  },

  /* Background Image Styles */
  imageBackground: {
    flex: 1,
    zIndex: 2, // Above gradient
    position: "relative",
    marginRight: -20, // Full width plus margins
    marginLeft: -20,
  },

  /* Mute Button Styles */
  muteButton: {
    position: "absolute",
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20, // Circular
    backgroundColor: "#8de4a2", // Match back button
    justifyContent: "center",
    alignItems: "center",
  },

  /* Finn Character Overlay Styles */
  finnOverlay: {
    position: "absolute",
    top: "50%", // Center vertically
    left: 0,
    right: 0,
    zIndex: 20, // Above all other elements
    paddingHorizontal: 20,
    transform: [{ translateY: -50 }], // True centering
  },
});
