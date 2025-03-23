import * as React from "react";

import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { hp, wp } from "../utils/common";
import { theme } from "../constants/Theme";
import CircularProgress from "./ui/circular-progress";
import { Lotties } from "../constants/Lottie";

const HomeProgress = () => {
  const [overallCompletion, setOverallCompletion] = React.useState<number>(0);

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
        let totalPercentage = 0;
        let gameCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.totalGameProgressPercentage !== undefined) {
            totalPercentage += data.totalGameProgressPercentage;
            gameCount++;
          }
        });

        // Calculate the overall percentage
        const overall = gameCount > 0 ? totalPercentage / gameCount : 0;
        setOverallCompletion(overall);
      });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <View style={styles.wrapper}>
        {/* Streak */}
        <Link href="/streak" style={{ flex: 1 }}>
          <View style={styles.flameContainer}>
            <LottieView
              loop
              autoPlay
              style={styles.flame}
              resizeMode="cover"
              source={Lotties.streakFlame}
            />
            <Text style={styles.streak}>3</Text>
          </View>
        </Link>

        <CircularProgress
          perecentage={overallCompletion}
          color={theme.colors.primary}
          textColor="black"
          radius={45}
        />
      </View>
    </View>
  );
};

export default HomeProgress;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    backgroundColor: "#F2F2F2",
    borderRadius: wp(3),
    gap: hp(1),
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: hp(2),
    fontWeight: "bold",
  },
  flameContainer: {
    position: "relative",
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(4),
    height: hp(6.5),
    backgroundColor: "#ebebed",
    borderRadius: 10,
  },
  flame: {
    width: "20%",
    height: "100%",
  },
  streak: {
    alignSelf: "flex-end",
    fontSize: hp(3.5),
    fontWeight: "bold",
    color: theme.colors.primary,
    bottom: "10%",
  },
});
