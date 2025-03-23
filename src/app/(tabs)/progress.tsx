import * as React from "react";
import { StyleSheet, Text, View, Image, } from "react-native";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";

const ProgressScreen = () => {
  const [progress, setprogress] = useState(5);
  const maxprogress = 10; //progress
  const Spacer = ({ size = 10 }) => <View style={{ height: size }} />;

  return ( //first game progress circle
    <View style={styles.container}> 
      <Text style={styles.title}>Your progress</Text>
      {/* Image added after "Your progress" text */}
      <Image
        source={require("@/assets/gif/Normal-Finn.gif")} // Replace with your image path
        style={styles.image}
      />
      <View style={styles.achievement}><CircularProgress
        value={(progress / maxprogress) * 100}
        radius={55}
        duration={1000}
        progressValueColor={"#FF6347"}  
        maxValue={100}
        title={"Progress"}
        titleColor={"#6277bf"}
        titleStyle={{ fontWeight: "bold" }}
        /></View>
      <Text style={styles.streakCount}>Mind match</Text>

      <Spacer size={30} />
      
      <View style={styles.achievement}><CircularProgress //second game progress circle
        value={(progress / maxprogress) * 100}
        radius={55}
        duration={1000}
        progressValueColor={"#e85454"}
        maxValue={100}
        title={"Progress"}
        titleColor={"#6277bf"}
        titleStyle={{ fontWeight: "bold" }}
        /></View>
      <Text style={styles.streakCount}>Tap and type</Text>


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
    paddingTop: 20,
    paddingBottom:70,
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
  image:{
    width: 150,
    height:150,
    paddingTop: 305,
    left: 20,
    resizeMode: "contain",
    position: "absolute",
    transform: [{rotate: "-20deg"}]

  },
  //achievements: {
    //backgroundColor: "#FFF",
    //padding: 15,
    //borderRadius: 10,
    //shadowColor: "#e85454", // Shadow color
    //shadowOpacity: 0.2, // Shadow opacity (0 to 1)
    //shadowRadius: 7, // Shadow radius (spread of the shadow)
    //elevation: 10, // Elevation for Android shadow
    //width: "80%",
    //marginBottom: 20, // Add some spacing between the boxes
  //},
  achievementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    //marginBottom: 5,
    //textAlign: "center", // Centers text inside the box
  },
  achievement: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#6277bf", // Dark shadow color (black)
    shadowOpacity: 0.8, // Increase opacity to make shadow darker
    shadowRadius: 10, // Increase the blur radius for a softer but darker shadow
    elevation: 15, // Elevation for Android
    width: "60%",
    alignItems: "center", // Centers all child elements inside this box
  },
  

});
