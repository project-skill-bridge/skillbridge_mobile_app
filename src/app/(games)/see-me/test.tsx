import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, Alert } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useFrameProcessor } from "react-native-vision-camera";
import { Worklets } from "react-native-worklets-core";
import { VisionCameraProxy } from "react-native-vision-camera";

const plugin = VisionCameraProxy.initFrameProcessorPlugin("faceMesh", {});

/**
 * Component to display the static face image in the upper half.
 */
const FaceImage = () => (
  <Image
    source={{
      uri: "https://img.freepik.com/free-vector/handsome-boy-with-brown-eyes-black-hair_1308-160536.jpg",
    }}
    style={styles.faceImage}
  />
);

/**
 * Worklet function to determine if eye contact is made (eyes are open).
 * Uses landmark indices for upper and lower eyelids.
 */
const isEyeContactFunc = (landmarks) => {
  "worklet";
  if (!landmarks) return false;

  const leftEyeUpper = landmarks[159]; // Left eye upper lid
  const leftEyeLower = landmarks[145]; // Left eye lower lid
  const rightEyeUpper = landmarks[386]; // Right eye upper lid
  const rightEyeLower = landmarks[374]; // Right eye lower lid

  if (!leftEyeUpper || !leftEyeLower || !rightEyeUpper || !rightEyeLower)
    return false;

  // Check if eyes are open based on vertical distance between lids
  const leftEyeOpen = Math.abs(leftEyeUpper.y - leftEyeLower.y) > 0.02; // Threshold may need calibration
  const rightEyeOpen = Math.abs(rightEyeUpper.y - rightEyeLower.y) > 0.02;

  return leftEyeOpen && rightEyeOpen;
};

/**
 * Main App component.
 */
const App = () => {
  const device = useCameraDevice("front"); // Use front camera
  const [score, setScore] = useState(0); // Score state
  const [isEyeContact, setIsEyeContact] = useState(false); // Eye contact state
  const { hasPermission, requestPermission } = useCameraPermission(); // Camera permission hook

  const format = device?.formats?.find((f) => f.maxFps >= 15);

  // Request camera permission when the component mounts
  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((granted) => {
        if (!granted) {
          Alert.alert(
            "Permission Denied",
            "Camera permission is required for the eye contact game. Please enable it in your device settings."
          );
        }
      });
    }
  }, [hasPermission, requestPermission]);

  // Frame processor to detect landmarks in real time
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    if (!plugin) {
      Worklets.createRunOnJS(setIsEyeContact)(false);
      return;
    }
    try {
      const result = plugin.call(frame);
      if (Array.isArray(result) && result.length > 0) {
        const landmarks = result[0];
        const eyeContact = isEyeContactFunc(landmarks);
        Worklets.createRunOnJS(setIsEyeContact)(eyeContact);
      } else {
        Worklets.createRunOnJS(setIsEyeContact)(false);
      }
    } catch (error) {
      console.error("Frame processor error:", error);
      Worklets.createRunOnJS(setIsEyeContact)(false);
    }
  }, []);

  // Increment score every second while eye contact is maintained
  useEffect(() => {
    if (isEyeContact) {
      const interval = setInterval(() => {
        setScore((prev) => prev + 1);
      }, 1000); // Increment every 1 second
      return () => clearInterval(interval); // Cleanup on state change
    }
  }, [isEyeContact]);

  // Handle permission and device availability
  if (!hasPermission) {
    return (
      <Text style={styles.errorText}>Requesting camera permission...</Text>
    );
  }

  if (device == null) {
    return <Text style={styles.errorText}>No camera device available</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Upper half: Static face image */}
      <View style={styles.upperHalf}>
        <FaceImage />
      </View>
      {/* Lower half: Camera preview */}
      <View style={styles.lowerHalf}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          fps={15}
          format={format}
        />
      </View>
      {/* Score display */}
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
};

// Styles for the UI
const styles = StyleSheet.create({
  container: { flex: 1 },
  upperHalf: { flex: 0.5, backgroundColor: "#f0f0f0" },
  lowerHalf: { flex: 0.5 },
  faceImage: { width: "100%", height: "100%" },
  camera: { width: "100%", height: "100%" },
  scoreText: { fontSize: 20, textAlign: "center", padding: 10 },
  errorText: { fontSize: 18, textAlign: "center", marginTop: 20 },
});

export default App;
