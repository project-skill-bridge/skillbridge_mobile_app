import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const ProgressScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Screen</Text>
    </View>
  );
};

export default ProgressScreen;

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
    color: "#6277bf",
  },
  streakCount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF4500",
    marginBottom: 10,
  },
  progressBar: {
    width: "80%",
    height: 10,
    borderRadius: 5,
    marginBottom: 20,
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