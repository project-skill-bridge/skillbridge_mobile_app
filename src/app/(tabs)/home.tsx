import * as React from "react";

import { useUserStore } from "@/src/store/user-store";
import auth from "@react-native-firebase/auth";
import { hp, wp } from "@/src/utils/common";
import { StyleSheet, Text, View } from "react-native";
import HomeProgress from "@/src/components/home-progress";
import GameSliderContainer from "@/src/components/game/game-slider-container";
import Modal from "@/src/components/ui/modal";
import { ModalState } from "@/src/types/type";
import FinnCharacter from "@/src/components/finnCharacter/FinnCharacter";

const HomeScreen = () => {
  const { user } = useUserStore();

  const [isVisible, setIsVisible] = React.useState<ModalState>({
    visible: false,
    message: "",
    type: null,
  });

  React.useEffect(() => {
    (async () => {
      const user = auth().currentUser;
      if (user?.emailVerified) return;

      setIsVisible({
        visible: true,
        message: "Verification email sent! Please check your inbox.",
        type: "success",
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hi {user?.name} 👋</Text>
      <HomeProgress />
      <FinnCharacter />
      <GameSliderContainer />
      <Modal
        type={isVisible.type}
        isVisible={isVisible.visible}
        setCloseModel={() =>
          setIsVisible({ visible: false, message: "", type: null })
        }
        message={isVisible.message}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
    gap: hp(2),
    backgroundColor: "#FFF",
    height: "100%",
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
