// EyeContactGameScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Image, Text, Dimensions, Alert } from "react-native";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import Svg, { Rect, Circle } from "react-native-svg";
import { FaceMesh } from "@mediapipe/face_mesh";

// Get device dimensions and calculate container sizes
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const topContainerHeight = screenHeight / 2;
const bottomContainerHeight = screenHeight / 2;

// Define fixed positions for the character’s eye markers in the top half.
// (Adjust these values to match your character face asset.)
const staticLeftEye = { x: screenWidth * 0.3, y: topContainerHeight * 0.4 };
const staticRightEye = { x: screenWidth * 0.7, y: topContainerHeight * 0.4 };

const levels = [10, 15, 20, 30]; // durations (in seconds) for levels 1 to 4

interface Detection {
  boundingBox: { x: number; y: number; width: number; height: number };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
}

const TypingGameScreen: React.FC = () => {
  // State variables for game logic
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(levels[0]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  // Detection state will hold the face bounding box and eye landmarks (in absolute coordinates relative to the camera preview)
  const [detection, setDetection] = useState<Detection | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const detectionRef = useRef<Detection | null>(null);

  // Update detectionRef whenever detection state changes
  useEffect(() => {
    detectionRef.current = detection;
  }, [detection]);

  // Setup camera permissions on mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission",
          "Camera permission is required to play the game."
        );
      }
    })();
  }, []);

  // Initialize MediaPipe FaceMesh
  const faceMeshRef = useRef<FaceMesh | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { FaceMesh } = await import("@mediapipe/face_mesh");
        faceMeshRef.current = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMeshRef.current.onResults(onResults);
      } catch (error) {
        console.error("Error initializing FaceMesh:", error);
      }
    })();
  }, []);

  // onResults callback processes MediaPipe output
  // MediaPipe returns normalized coordinates (0–1) so we convert them to the size of the camera preview.
  const onResults = (results) => {
    const camWidth = screenWidth;
    const camHeight = bottomContainerHeight;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];

      // Compute bounding box (using normalized coordinates)
      let minX = 1,
        minY = 1,
        maxX = 0,
        maxY = 0;
      landmarks.forEach((pt) => {
        if (pt.x < minX) minX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y > maxY) maxY = pt.y;
      });
      const boundingBox = {
        x: minX * camWidth,
        y: minY * camHeight,
        width: (maxX - minX) * camWidth,
        height: (maxY - minY) * camHeight,
      };

      // Use landmark indices 159 (left eye) and 386 (right eye)
      const leftEye = {
        x: landmarks[159].x * camWidth,
        y: landmarks[159].y * camHeight,
      };
      const rightEye = {
        x: landmarks[386].x * camWidth,
        y: landmarks[386].y * camHeight,
      };

      setDetection({ boundingBox, leftEye, rightEye });
    } else {
      setDetection(null);
    }
  };

  // Stub function: convert the raw camera frame to an image format acceptable by MediaPipe.
  // (You will need to implement the actual conversion for your project.)
  const convertFrameToImage = (frame) => {
    return frame;
  };

  // Process each camera frame: send the image to MediaPipe.
  const processFrame = (frame) => {
    if (faceMeshRef.current) {
      const image = convertFrameToImage(frame);
      faceMeshRef.current.send({ image });
    }
  };

  // useFrameProcessor hook from VisionCamera.
  // Note: runOnJS is used so that processFrame (which is not a worklet) runs on the JS thread.
  const frameProcessor = useFrameProcessor((frame) => {
    runOnJS(processFrame)(frame);
  }, []);

  // Setup timer and score update intervals whenever a new level starts.
  useEffect(() => {
    // Reset score and timer for the new level
    setScore(0);
    setTimer(levels[levelIndex]);

    // Timer interval: countdown every 1000 ms.
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
          // When time is up, check if score reached 100.
          if (score < 100) {
            Alert.alert("Level Failed", "Try again!");
            // Restart current level.
            setScore(0);
            setTimer(levels[levelIndex]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Score update interval: every 200 ms, if a face is detected (i.e. “eye contact”) then add 2 points.
    scoreIntervalRef.current = setInterval(() => {
      if (detectionRef.current) {
        setScore((prev) => {
          const newScore = Math.min(prev + 2, 100);
          if (newScore === 100) {
            // Level completed early if the score reaches 100.
            if (timerIntervalRef.current)
              clearInterval(timerIntervalRef.current);
            if (scoreIntervalRef.current)
              clearInterval(scoreIntervalRef.current);
            if (levelIndex < levels.length - 1) {
              Alert.alert(
                "Level Complete",
                `You completed level ${levelIndex + 1}!`
              );
              // Small delay before advancing
              setTimeout(() => setLevelIndex(levelIndex + 1), 1000);
            } else {
              Alert.alert("Game Completed", "Congratulations!");
              setGameCompleted(true);
            }
          }
          return newScore;
        });
      }
    }, 200);

    // Cleanup intervals on unmount or level change
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [levelIndex, score]);

  // Get the front-facing camera device (used for children facing the screen)
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");
  if (device == null)
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Camera...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Top half: static character face */}
      <View style={styles.topContainer}>
        <Image
          source={{ uri: "https://your-cdn.com/character_face.png" }} // or use require('./assets/face.png')
          style={styles.faceImage}
          resizeMode="contain"
        />
        {/* Overlay static eye markers for the character */}
        <Svg style={StyleSheet.absoluteFill}>
          <Circle cx={staticLeftEye.x} cy={staticLeftEye.y} r={8} fill="blue" />
          <Circle
            cx={staticRightEye.x}
            cy={staticRightEye.y}
            r={8}
            fill="blue"
          />
        </Svg>
      </View>

      {/* Bottom half: live camera preview with detection overlay */}
      <View style={styles.bottomContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          frameProcessor={frameProcessor}
          //   frameProcessorFps={5}
          fps={5}
        />
        <Svg style={StyleSheet.absoluteFill}>
          {detection && (
            <>
              <Rect
                x={detection.boundingBox.x}
                y={detection.boundingBox.y}
                width={detection.boundingBox.width}
                height={detection.boundingBox.height}
                stroke="green"
                strokeWidth="3"
                fill="none"
              />
              <Circle
                cx={detection.leftEye.x}
                cy={detection.leftEye.y}
                r={6}
                fill="red"
              />
              <Circle
                cx={detection.rightEye.x}
                cy={detection.rightEye.y}
                r={6}
                fill="red"
              />
            </>
          )}
        </Svg>
      </View>

      {/* Information overlay (level, timer, score) */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Level: {levelIndex + 1}</Text>
        <Text style={styles.infoText}>Time: {timer}s</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    height: topContainerHeight,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    height: bottomContainerHeight,
    backgroundColor: "#000",
  },
  faceImage: {
    width: screenWidth * 0.8,
    height: topContainerHeight * 0.8,
  },
  infoContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TypingGameScreen;
