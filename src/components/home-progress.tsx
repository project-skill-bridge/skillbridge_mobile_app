import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../utils/common";
import CircularProgress from "./ui/circular-progress";
import { theme } from "../constants/Theme";
import { db } from '../services/firebase'; // Import your firebase config
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

const HomeProgress = () => {

  const [averageProgress, setAverageProgress] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Fetch data from Firestore
    const fetchGameProgress = async () => {
      try {
        //comment when user session created
        const userId = "8S5GzpnTS7Q5lc8OuU4NTOZ0mZT2"; // Hardcoded user ID

        const gamesSnapshot =  firestore().collection("users").doc(userId).collection("games"); //doc(db, "users", userId); // Reference to the hardcoded user's document
        //const userDocSnap = await getDoc(userDocRef);
        //------------------------------------------

         // Reference to 'games' subcollection for this user
         //const gamesCollectionRef = collection("games");
         //const gamesSnapshot = await getDocs(gamesCollectionRef);
 
        
        // if (!snapshot.empty) {
        //   let totalProgress = 0;
        //   let gameCount = 0;

        //   // Loop through each document in the "games" collection
        //   snapshot.forEach(doc => {
        //     const data = doc.data();
        //     if (data?.totalGameProgressPercentage) {
        //       totalProgress += data.totalGameProgressPercentage;
        //       gameCount++;
        //     }
        //   });

        //   // Calculate the average progress
        //   const avgProgress = gameCount > 0 ? totalProgress / gameCount : 0;
        //   setAverageProgress(avgProgress);
        // } else {
        //   console.log("No games found!");
        // }
      } catch (error) {
        console.error("Error getting games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameProgress();
  }, []);


  // // Total number of levels in your game
  // const totalLevels = 5;

  // // This should dynamically reflect game progress
  // const completedLevels = 2;

  // Calculate and cap progress percentage
  //const rawPercentage = (completedLevels / totalLevels) * 100;
 // const progressPercentage = Math.min(rawPercentage, 100); // prevent overfill

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <CircularProgress
        percentage={averageProgress}
        color={theme.colors.primary}
        textColor="blue"
        radius={45}

      />
    </View>
  );
};

export default HomeProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: "#F2F2F2",
    borderRadius: wp(3),
  },
  text: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#333",
  },
});
