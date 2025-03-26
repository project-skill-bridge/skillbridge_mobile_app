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
import { useEffect } from "react"
import { AppState } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRef } from "react"

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

  // Add this ref to access the streak calendar component
  // Properly type the ref to match the StreakCalendarRef interface
  const streakCalendarRef = useRef<React.ElementRef<typeof StreakCalendar>>(null)

  // Add this inside the StreakScreen component, before the return statement
  // This will update the app usage time when the streak screen is opened
  useEffect(() => {
    const updateAppUsageTime = async () => {
      try {
        // Get today's date as a string (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        // Load saved app usage time data
        const savedUsageTime = await AsyncStorage.getItem("app-usage-time")
        const appUsageTime = savedUsageTime ? JSON.parse(savedUsageTime) : {}

        // Check if we need to initialize today's usage time
        if (!appUsageTime[today]) {
          appUsageTime[today] = 0
        }

        // Save back to AsyncStorage
        await AsyncStorage.setItem("app-usage-time", JSON.stringify(appUsageTime))
      } catch (error) {
        console.error("Error updating app usage time:", error)
      }
    }

    updateAppUsageTime()

    // Set up app state change listener to track when user leaves the streak screen
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        // User is leaving the app, update streak calendar if needed
        if (streakCalendarRef.current) {
          streakCalendarRef.current.updateUsageTime()
        }
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

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
        ref={streakCalendarRef}
        onStreakUpdate={handleStreakUpdate}
        onWeekCompleted={handleWeekCompleted}
        onResetWeek={handleResetWeek}
        showConfetti={showConfetti}
      />

      <StreakMessage currentStreak={currentStreak} />
    </ScrollView>
  )
}
export default StreakScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(4),
  },
  headerText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: theme.colors.primaryText,
    marginBottom: hp(3),
  },
})

