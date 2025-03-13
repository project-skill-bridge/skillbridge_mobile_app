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