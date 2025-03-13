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

   // Initialize streak days
   React.useEffect(() => {
    const loadStreakData = async () => {
      try {
        // Try to load saved streak data
        const savedData = await AsyncStorage.getItem("streak-data")
        if (savedData) {
          const { days, currentStreak, longestStreak } = JSON.parse(savedData)
          setStreakDays(days)
          setCurrentStreak(currentStreak)
          setLongestStreak(longestStreak)
          onStreakUpdate(currentStreak, longestStreak)
        } else {
          // Initialize with current week if no saved data
          initializeWeek()
        }
      } catch (error) {
        console.error("Error loading streak data:", error)
        initializeWeek()
      }
    }

    loadStreakData()
  }, [])
  // Trigger confetti when showConfetti changes to true
  React.useEffect(() => {
    if (showConfetti && confettiRef.current) {
      setTimeout(() => {
        confettiRef.current?.start()
      }, 100)
    }
  }, [showConfetti])
  const initializeWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 is Sunday, 6 is Saturday
    const days = []
      // Create array for the current week (Sunday to Saturday)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - dayOfWeek + i)
  
        days.push({
          day: getDayName(i),
          shortName: getShortDayName(i),
          completed: false,
          date: date.getDate(),
        })
      }
  
      setStreakDays(days)
      saveStreakData(days, 0, 0)
    }