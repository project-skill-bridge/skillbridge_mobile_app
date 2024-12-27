import Button from "@/src/components/ui/Button";
import { hp, wp } from "@/src/utils/common";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Hi Jeniffer 😉</Text>
      <Button
        title="game"
        onPress={() => router.push("/typing-game")}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "space-between",
    padding: wp(5),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
