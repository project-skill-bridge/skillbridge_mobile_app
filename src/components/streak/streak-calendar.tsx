"use client"

import * as React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ConfettiCannon from "react-native-confetti-cannon"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"
import { Icons } from "@/src/constants/Icons"
import Button from "@/src/components/ui/button"

interface StreakDay {
  day: string
  shortName: string
  completed: boolean
  date: number
}

interface StreakCalendarProps {
  onStreakUpdate: (currentStreak: number, longestStreak: number) => void
  onWeekCompleted: () => void
  onResetWeek: () => void
  showConfetti: boolean
}
const StreakCalendar = ({ onStreakUpdate, onWeekCompleted, onResetWeek, showConfetti }: StreakCalendarProps) => {
  const [streakDays, setStreakDays] = React.useState<StreakDay[]>([])
  const [currentStreak, setCurrentStreak] = React.useState(0)
  const [longestStreak, setLongestStreak] = React.useState(0)
  const confettiRef = React.useRef<ConfettiCannon>(null)