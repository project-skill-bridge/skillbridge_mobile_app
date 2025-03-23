import * as React from "react";
import { StyleSheet, Text, View, Image, } from "react-native";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";
//import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
//import { collection, doc, getDoc, getDocs } from "@react-native-firebase/firestore";
import { auth, db } from '../../services/firebase'; // Import your firebase config
import { collection, doc, getDoc, getDocs } from "firebase/firestore";




const ProgressScreen = () => {
  const [progress, setprogress] = useState(5);
  const [game1Progress, setgame1Progress] = React.useState<number>(0);
  const [game2Progress, setgame2Progress] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {

    
    const fetchGameProgress = async () => {
      console.log("Begin");
      try{
        
        //comment when user session created
        const userId = "8S5GzpnTS7Q5lc8OuU4NTOZ0mZT2"; // Hardcoded user ID

        const userDocRef = doc(db, "users", userId); // Reference to the hardcoded user's document
        const userDocSnap = await getDoc(userDocRef);
        console.log("userDocSnap "+userDocSnap);

        //------------------------------------------

          //uncomment when user session created
          // const user = auth.currentUser; // Get the logged-in user
          // if (!user) {
          //   console.log("No user is logged in");
          //   return;
          // }
  
          // const userDocRef = doc(db, "users", user.uid); // Reference to logged-in user's document
          // const userDocSnap = await getDoc(userDocRef);
          //----------------------------------------
  
          if (!userDocSnap.exists()) {
            console.log("No user document found!");
            return;
          }
  
          console.log(`User ID: ${userId}`, userDocSnap.data());

          // Reference to 'games' subcollection for this user
        const gamesCollectionRef = collection(userDocRef, "games");
        const gamesSnapshot = await getDocs(gamesCollectionRef);

        let totalProgressGame1 = 0;
        let totalProgressGame2 = 0;

        let gameCountGame1 = 0;
        let gameCountGame2 = 0;

        console.log(`gamesSnapshot : ${gamesSnapshot}`);
        gamesSnapshot.forEach((gameDoc) => {
          console.log(`  Game ID: ${gameDoc.id}`, gameDoc.data());

          // Assuming each game document has a `progress` field with a percentage value (0-100)
          const gameProgress = gameDoc.data().totalGameProgressPercentage;

          // You can add more logic to distinguish which game is Game 1 and Game 2
          if (gameDoc.id === "mind-match") {
            totalProgressGame1 += gameProgress;
            gameCountGame1 += 1;
          } else if (gameDoc.id === "tap-and-type") {
            totalProgressGame2 += gameProgress;
            gameCountGame2 += 1;
          }
        });

        // Calculate average progress for each game
        const progressGame1 = gameCountGame1 > 0 ? totalProgressGame1 : 0;
        const progressGame2 = gameCountGame2 > 0 ? totalProgressGame2 : 0;

        console.log(`Total Progress for Game 1: ${progressGame1}%`);
        console.log(`Total Progress for Game 2: ${progressGame2}%`);


      }catch (error) {


      }
    }
    fetchGameProgress();
  });

  const maxprogress = 10; //progress
  const Spacer = ({ size = 10 }) => <View style={{ height: size }} />;

  return ( //first game progress circle
    <View style={styles.container}> 
      <Text style={styles.title}>Your progress so far</Text>
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
  /*progressCount: {
    fontSize: 30,
    fontWeight: "600",
    color: "#e85454",
    paddingTop: 15,
  },*/
  txt: {
    fontSize: 19,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 20,
    paddingTop: 15,
  },
  image:{
    width: 150,
    height:150,
    paddingTop: 303,
    left: 20,
    resizeMode: "contain",
    position: "absolute",
    transform: [{rotate: "-17deg"}]

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
