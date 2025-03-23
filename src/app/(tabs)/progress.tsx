import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";

const StreakScreen = () => {
  const [progress, setprogress] = useState(5);
  const maxprogress = 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Streak Tracker</Text>
      <CircularProgress
        value={(progress / maxprogress) * 100}
        radius={50}
        duration={1000}
        progressValueColor={"#FF4500"}
        maxValue={100}
        title={"Progress"}
        titleColor={"#6277bf"}
        titleStyle={{ fontWeight: "bold" }}
      />
      <Text style={styles.streakCount}>{progress} Days</Text>
      <Text style={styles.motivation}>Keep going! You're doing great! 🚀</Text>
      <View style={styles.achievements}>
        <Text style={styles.achievementTitle}>Recent Achievements</Text>
        <Text>✅ --------</Text>
        <Text>✅ --------</Text>
      </View>
    </View>
  );
};

export default StreakScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 20,
    color: "#6277bf"
  },
  streakCount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF4500",
    marginBottom: 10,
  },
  motivation: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 20,
  },
  achievements: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "80%",
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
