import * as React from "react";
import { StyleSheet, Text, View, } from "react-native";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";

const StreakScreen = () => {
  const [progress, setprogress] = useState(5);
  const maxprogress = 10;
  const Spacer = ({ size = 10 }) => <View style={{ height: size }} />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your progress</Text>
      <View style={styles.achievement}><CircularProgress
        value={(progress / maxprogress) * 100}
        radius={55}
        duration={1000}
        progressValueColor={"#e85454"}
        maxValue={100}
        title={"Progress"}
        titleColor={"#6277bf"}
        titleStyle={{ fontWeight: "bold" }}
        /></View>
      <Text style={styles.streakCount}> // Game name</Text>

      <Spacer size={30} />

      <View style={styles.achievement}><CircularProgress
        value={(progress / maxprogress) * 100}
        radius={55}
        duration={1000}
        progressValueColor={"#e85454"}
        maxValue={100}
        title={"Progress"}
        titleColor={"#6277bf"}
        titleStyle={{ fontWeight: "bold" }}
        /></View>
      <Text style={styles.streakCount}> // Game name</Text>


      <Text style={styles.progressCount}> You are on Day {progress}</Text>
<Text style={styles.txt}>Keep going! You're doing great! 🚀</Text>

{/* 
<View style={styles.achievements}>
  <Text style={styles.achievementTitle}>Recent Achievements</Text>
  <Text>✅ --------</Text>
  <Text>✅ --------</Text>
</View>
*/}

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
    paddingBottom:20,
    color: "#6277bf"
  },
  streakCount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6277bf",
    paddingTop: 15,
    marginBottom: 15,
  },
  progressCount: {
    fontSize: 30,
    fontWeight: "600",
    color: "#e85454",
    paddingTop: 15,
  },
  txt: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 20,
    paddingTop: 15,
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
    //marginBottom: 5,
    //textAlign: "center", // Centers text inside the box
  },
  achievement: {
    backgroundColor: "#FFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#cad3ed",
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 4,
    width: "60%",
    alignItems: "center", // Centers all child elements inside this box
},

});
