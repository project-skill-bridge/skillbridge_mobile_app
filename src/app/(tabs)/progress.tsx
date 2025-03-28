import * as React from "react";

import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import CircularProgress from "@/src/components/ui/circular-progress";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Images } from "@/src/constants/Images";

const formatGameName = (name: string): string => {
  return name
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const ProgressScreen = () => {
  const [games, setGames] = React.useState<
    { name: string; progress: number }[]
  >([]);

  React.useEffect(() => {
    const userId = auth().currentUser?.uid; // Get the logged-in user's ID

    if (!userId) {
      return;
    }

    // Reference to user's games collection
    const unsubscribe = firestore()
      .collection("users")
      .doc(userId)
      .collection("games")
      .onSnapshot((querySnapshot) => {
        const gamesData: { name: string; progress: number }[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.totalGameProgressPercentage !== undefined) {
            gamesData.push({
              name: doc.id, // Use document ID as the game name
              progress: data.totalGameProgressPercentage,
            });
          }
        });

        setGames(gamesData);
      });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    //first game progress circle
    <View style={styles.container}>
      <Text style={styles.title}>Your progress so far</Text>
      {/* Image added after "Your progress" text */}
      <Image
        source={Images.normalFinn} // Replace with your image path
        style={styles.image}
      />
      <ScrollView>
        <View style={{ gap: 20 }}>
          {games.map((game, index) => (
            <View key={index + game.name} style={styles.gameProgressContainer}>
              <Text style={styles.streakCount}>
                {formatGameName(game.name)}
              </Text>
              <View style={styles.circularProgressContainer}>
                <CircularProgress
                  perecentage={game.progress}
                  radius={55}
                  duration={1000}
                  color="#6277bf"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.txt}>Take your time</Text>
      <Text style={styles.txt}>You&apos;re doing great </Text>
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
    paddingBottom: 70,
    color: "#6277bf",
  },
  streakCount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6277bf",
    paddingTop: 15,
    marginBottom: 15,
  },
  txt: {
    fontSize: 19,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#e85454",
    //marginBottom: 20,
    paddingTop: 15,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    paddingTop: 300,
    left: 10,
    resizeMode: "contain",
    position: "absolute",
    transform: [{ rotate: "-17deg" }],
  },
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
  gameProgressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  circularProgressContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
});
