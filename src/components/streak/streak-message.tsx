import { View, Text, StyleSheet } from "react-native"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"

interface StreakMessageProps {
  currentStreak: number
}
const StreakMessage = ({ currentStreak }: StreakMessageProps) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>
        {currentStreak === 7
          ? "Amazing! You've completed a full week! 🎉"
          : `Complete ${7 - currentStreak} more days to earn a reward!`}
      </Text>
    </View>
  )
}
export default StreakMessage

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(3),
  },
  messageText: {
    fontSize: hp(2),
    fontFamily: "Coiny",
    color: "white",
    textAlign: "center",
  },
})

