import * as React from "react";

import { useUserStore } from "@/src/store/user-store";
import auth from "@react-native-firebase/auth";
import { hp, wp } from "@/src/utils/common";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HomeProgress from "@/src/components/home-progress";
import Modal from "@/src/components/ui/modal";
import { ModalState } from "@/src/types/type";
import FinnCharacter from "@/src/components/FinnCharacter/FinnCharacter";
import GameCategorySection from "../../components/game/game-category-section";
import { getCategorizedGames } from "@/src/data/gameInfo";

const HomeScreen = () => {
  const { user } = useUserStore();
  const { executiveGames, vocationalGames, realLifeGames } = getCategorizedGames();

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.welcomeText}>Hi {user?.name} 👋</Text>
      <HomeProgress />
      <FinnCharacter />
      
      <View style={styles.gamesContainer}>
        <GameCategorySection
          title="Executive Function Games"
          description="Games to improve attention, memory, and cognitive control"
          games={executiveGames}
        />
        
        <GameCategorySection
          title="Vocational Skills Games"
          description="Develop practical skills for future independence"
          games={vocationalGames}
        />
        
        <GameCategorySection
          title="Real Life Skills"
          description="Learn everyday life skills in a fun interactive way"
          comingSoon={true}
          games={realLifeGames}
        />
      </View>
      
      <Modal
        type={isVisible.type}
        isVisible={isVisible.visible}
        setCloseModel={() =>
          setIsVisible({ visible: false, message: "", type: null })
        }
        message={isVisible.message}
      />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
    backgroundColor: "#FFF",
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: hp(2),
  },
  gamesContainer: {
    marginTop: hp(2),
    paddingBottom: hp(10), // Extra padding at the bottom for scrolling
  },
});