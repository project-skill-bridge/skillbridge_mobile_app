import { View, Text, StyleSheet } from "react-native"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"

interface StreakStatsProps {
  currentStreak: number
  longestStreak: number
}