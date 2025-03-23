import { View, Text, StyleSheet } from "react-native"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"

interface StreakStatsProps {
  currentStreak: number
  longestStreak: number
}
const StreakStats = ({ currentStreak, longestStreak }: StreakStatsProps) => {
  return (
    <View style={styles.streakInfoContainer}>
      <View style={styles.streakInfo}>
        <Text style={styles.streakValue}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>Current Streak</Text>
      </View>
      <View style={styles.streakInfo}>
        <Text style={styles.streakValue}>{longestStreak}</Text>
        <Text style={styles.streakLabel}>Longest Streak</Text>
      </View>
    </View>
  )
}
export default StreakStats

const styles = StyleSheet.create({
  streakInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp(3),
  },
  streakInfo: {
    alignItems: "center",
    backgroundColor: theme.colors.lightGray,
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    borderRadius: 16,
    width: wp(40),
  },
  streakValue: {
    fontSize: hp(4),
    fontFamily: "Coiny",
    color: theme.colors.primary,
  },
  streakLabel: {
    fontSize: hp(1.8),
    color: theme.colors.secondaryText,
    marginTop: hp(0.5),
  },
})