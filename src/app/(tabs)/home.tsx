import Button from "@/src/components/ui/Button";
import auth from "@react-native-firebase/auth";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text>HomeScreen</Text>
      <Button title="sign out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
