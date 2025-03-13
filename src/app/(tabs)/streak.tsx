"use client"

import * as React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"
import { useFonts } from "expo-font"
import { Fonts } from "@/src/constants/Fonts"
import StreakCalendar from "@/src/components/streak/streak-calendar"
import StreakStats from "@/src/components/streak/streak-stats"
import StreakMessage from "@/src/components/streak/streak-message"
import { useRouter } from "expo-router"
import { Icons } from "@/src/constants/Icons"
import Button from "@/src/components/ui/button"

const StreakScreen = () => {
    const router = useRouter()
    const [currentStreak, setCurrentStreak] = React.useState(0)
    const [longestStreak, setLongestStreak] = React.useState(0)
    const [showConfetti, setShowConfetti] = React.useState(false)
  
    const [fontsLoaded] = useFonts({
      Coiny: Fonts.Coiny,
    })

    const handleStreakUpdate = (current: number, longest: number) => {
        setCurrentStreak(current)
        setLongestStreak(longest)
      }
    
      const handleWeekCompleted = () => {
        setShowConfetti(true)
      }
    
      const handleResetWeek = () => {
        setShowConfetti(false)
      }
      if (!fontsLoaded) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        )
      }
      return (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Your Streak</Text>
            <Button onPress={() => router.back()} variant="icon">
              <Icons.ChevronLeft size={24} color="black" />
            </Button>
          </View>

          <StreakStats currentStreak={currentStreak} longestStreak={longestStreak} />

      <StreakCalendar
        onStreakUpdate={handleStreakUpdate}
        onWeekCompleted={handleWeekCompleted}
        onResetWeek={handleResetWeek}
        showConfetti={showConfetti}
      />

      <StreakMessage currentStreak={currentStreak} />
    </ScrollView>
  )
}