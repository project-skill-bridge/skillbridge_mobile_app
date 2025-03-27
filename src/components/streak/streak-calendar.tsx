"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ConfettiCannon from "react-native-confetti-cannon"
import { hp, wp } from "@/src/utils/common"
import { theme } from "@/src/constants/Theme"
import { Icons } from "@/src/constants/Icons"
import Button from "@/src/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { AppState } from "react-native"
import { forwardRef, useImperativeHandle } from "react"

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

// Add this interface for the ref methods
interface StreakCalendarRef {
  updateUsageTime: () => Promise<void>
}

// Modify the component to use forwardRef
const StreakCalendar = forwardRef<StreakCalendarRef, StreakCalendarProps>(
  ({ onStreakUpdate, onWeekCompleted, onResetWeek, showConfetti }, ref) => {
    const [streakDays, setStreakDays] = useState<StreakDay[]>([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [longestStreak, setLongestStreak] = useState(0)
    const confettiRef = useRef<ConfettiCannon>(null)

    // Add these new state variables for tracking app usage time
    const [appUsageTime, setAppUsageTime] = useState<Record<string, number>>({})
    const [startTime, setStartTime] = useState<number | null>(null)
    const appState = useRef(AppState.currentState)

    // Required minimum usage time in milliseconds (5 minutes)
    const REQUIRED_USAGE_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

    // Expose the updateUsageTime method to the parent component via ref
    useImperativeHandle(ref, () => ({
      updateUsageTime: async () => {
        await updateUsageTime()
      },
    }))

    // Initialize streak days
    useEffect(() => {
      const loadStreakData = async () => {
        try {
          // Try to load saved streak data
          const savedData = await AsyncStorage.getItem("streak-data")
          if (savedData) {
            const { days, currentStreak, longestStreak } = JSON.parse(savedData)

            // Check if the saved data is from the current week
            const today = new Date()
            const currentWeekStart = new Date(today)
            currentWeekStart.setDate(today.getDate() - today.getDay()) // Set to Sunday of current week
            currentWeekStart.setHours(0, 0, 0, 0)

            // Get the date from the first day (Sunday) in the saved data
            const firstDayDate = new Date()
            firstDayDate.setDate(firstDayDate.getDate() - firstDayDate.getDay()) // Set to Sunday
            firstDayDate.setDate(days[0].date) // Set to the saved date
            firstDayDate.setHours(0, 0, 0, 0)

            // If the saved week is different from the current week, reinitialize
            if (firstDayDate.getTime() !== currentWeekStart.getTime()) {
              console.log("Week changed, reinitializing streak calendar")
              initializeWeek()
            } else {
              setStreakDays(days)
              setCurrentStreak(currentStreak)
              setLongestStreak(longestStreak)
              onStreakUpdate(currentStreak, longestStreak)
            }
          } else {
            // Initialize with current week if no saved data
            initializeWeek()
          }

          // Load saved app usage time data
          const savedUsageTime = await AsyncStorage.getItem("app-usage-time")
          if (savedUsageTime) {
            setAppUsageTime(JSON.parse(savedUsageTime))
          }
        } catch (error) {
          console.error("Error loading streak data:", error)
          initializeWeek()
        }
      }

      loadStreakData()
    }, [])

    // Add this new useEffect for tracking app usage time
    useEffect(() => {
      // Start tracking time when component mounts
      setStartTime(Date.now())

      // Set up app state change listener
      const subscription = AppState.addEventListener("change", (nextAppState) => {
        if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
          // App is going to background, update usage time
          updateUsageTime()
        } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
          // App is coming to foreground, start tracking time again
          setStartTime(Date.now())
        }
        appState.current = nextAppState
      })

      // Clean up on unmount
      return () => {
        subscription.remove()
        updateUsageTime()
      }
    }, [])

    // Modify the useEffect that monitors app usage time to be more reliable
    useEffect(() => {
      // Check if today's usage time has reached the threshold
      const today = new Date().toISOString().split("T")[0]
      const todayUsage = appUsageTime[today] || 0

      if (todayUsage >= REQUIRED_USAGE_TIME) {
        autoCompleteToday()
      }

      // Set up a periodic check every minute to verify if threshold has been met
      const intervalId = setInterval(() => {
        updateUsageTime().then(() => {
          const currentUsage = appUsageTime[today] || 0
          if (currentUsage >= REQUIRED_USAGE_TIME) {
            autoCompleteToday()
          }
        })
      }, 60000) // Check every minute

      return () => clearInterval(intervalId)
    }, [appUsageTime])

    // Improve the autoCompleteToday function to be more reliable
    const autoCompleteToday = () => {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 is Sunday, 6 is Saturday

      console.log("Attempting to auto-complete today:", dayOfWeek)
      console.log("Current streak days:", JSON.stringify(streakDays))

      // Check if today is already completed
      if (streakDays.length > 0 && !streakDays[dayOfWeek].completed) {
        console.log("Today not yet completed, marking as complete")

        const newDays = [...streakDays]
        newDays[dayOfWeek].completed = true
        setStreakDays(newDays)

        // Calculate current streak
        let streak = 0
        const sortedDays = [...newDays].sort((a, b) => {
          const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
        })

        for (const day of sortedDays) {
          if (day.completed) {
            streak++
          } else {
            break
          }
        }

        const newCurrentStreak = streak
        const newLongestStreak = Math.max(longestStreak, newCurrentStreak)

        console.log("New streak:", newCurrentStreak, "Longest streak:", newLongestStreak)

        setCurrentStreak(newCurrentStreak)
        setLongestStreak(newLongestStreak)

        saveStreakData(newDays, newCurrentStreak, newLongestStreak)

        // Check if all days are completed
        const allCompleted = newDays.every((day) => day.completed)
        if (allCompleted) {
          onWeekCompleted()
        }

        // Show a notification to the user that their streak was updated
        alert("Congratulations! You've used the app for 5 minutes today and your streak has been updated.")
      } else {
        console.log("Today already completed or streak days not initialized")
      }
    }

    // Improve the updateUsageTime function to be more reliable
    const updateUsageTime = async () => {
      if (startTime) {
        const now = Date.now()
        const sessionTime = now - startTime

        // Get today's date as a string (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        // Update app usage time for today
        const savedUsageTime = await AsyncStorage.getItem("app-usage-time")
        const currentAppUsageTime = savedUsageTime ? JSON.parse(savedUsageTime) : {}

        const newAppUsageTime = { ...currentAppUsageTime }
        newAppUsageTime[today] = (newAppUsageTime[today] || 0) + sessionTime

        console.log("Updated usage time for today:", newAppUsageTime[today] / 60000, "minutes")

        // Save to state and AsyncStorage
        setAppUsageTime(newAppUsageTime)
        await AsyncStorage.setItem("app-usage-time", JSON.stringify(newAppUsageTime))

        // Reset start time
        setStartTime(now)

        // Check if user has used the app for 5 minutes today and update streak if needed
        if (newAppUsageTime[today] >= REQUIRED_USAGE_TIME) {
          autoCompleteToday()
        }

        return newAppUsageTime
      }

      return appUsageTime
    }

    // Modify the handleDayComplete function to allow manual completion for past days only
    const handleDayComplete = (index: number) => {
      // Get the date for the selected day
      const selectedDate = new Date()
      const currentDay = selectedDate.getDay()
      const diff = index - currentDay
      selectedDate.setDate(selectedDate.getDate() + diff)
      const dateString = selectedDate.toISOString().split("T")[0]

      // Check if it's today or a past day
      const today = new Date().toISOString().split("T")[0]
      const isPastOrToday = dateString <= today
      const isToday = dateString === today

      // Only allow completing today or past days
      if (isPastOrToday) {
        // For today, check if app has been used for 5 minutes
        if (isToday) {
          const usageTimeToday = appUsageTime[today] || 0
          if (usageTimeToday < REQUIRED_USAGE_TIME) {
            // Show alert or message that 5 minutes of usage is required
            alert(
              `You need to use the app for at least 5 minutes today to mark your streak. Current usage: ${Math.floor(usageTimeToday / 60000)} minutes.`,
            )
            return
          }
        }

        // For past days, allow manual completion (for recovery)
        if (!isToday) {
          // Update streak as before
          const newDays = [...streakDays]
          newDays[index].completed = !newDays[index].completed
          setStreakDays(newDays)

          // Calculate current streak
          let streak = 0
          for (const day of newDays) {
            if (day.completed) {
              streak++
            } else {
              break
            }
          }

          const newCurrentStreak = streak
          const newLongestStreak = Math.max(longestStreak, newCurrentStreak)

          setCurrentStreak(newCurrentStreak)
          setLongestStreak(newLongestStreak)

          saveStreakData(newDays, newCurrentStreak, newLongestStreak)

          // Check if all days are completed
          const allCompleted = newDays.every((day) => day.completed)
          if (allCompleted) {
            onWeekCompleted()
          }
        }
      } else {
        // Show message that future days cannot be completed
        alert("You cannot mark future days as completed.")
      }
    }
    const initializeWeek = () => {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 is Sunday, 6 is Saturday
      const days = []

      // Create array for the current week (Sunday to Saturday)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - dayOfWeek + i) // Calculate the correct date for each day

        days.push({
          day: getDayName(i),
          shortName: getShortDayName(i),
          completed: false,
          date: date.getDate(), // Store just the day number
        })
      }

      setStreakDays(days)
      saveStreakData(days, 0, longestStreak || 0)
    }
    const getDayName = (dayIndex: number): string => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      return days[dayIndex]
    }

    const getShortDayName = (dayIndex: number): string => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      return days[dayIndex]
    }
    const saveStreakData = async (days: StreakDay[], current: number, longest: number) => {
      try {
        await AsyncStorage.setItem(
          "streak-data",
          JSON.stringify({
            days,
            currentStreak: current,
            longestStreak: longest,
          }),
        )
        onStreakUpdate(current, longest)
      } catch (error) {
        console.error("Error saving streak data:", error)
      }
    }

    const resetWeek = () => {
      const newDays = streakDays.map((day) => ({
        ...day,
        completed: false,
      }))

      setStreakDays(newDays)
      saveStreakData(newDays, 0, longestStreak)
      onResetWeek()
    }
    return (
      <View>
        <View style={styles.weekContainer}>
          <Text style={styles.weekTitle}>This Week</Text>
          <View style={styles.daysContainer}>
            {streakDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, day.completed && styles.completedDay]}
                onPress={() => handleDayComplete(index)}
              >
                <Text style={styles.dayName}>{day.shortName}</Text>
                <Text style={styles.dayDate}>{day.date}</Text>
                {day.completed ? (
                  <View style={styles.checkCircle}>
                    <Icons.Check size={20} color="white" />
                  </View>
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {currentStreak === 7 && (
          <Button onPress={resetWeek} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Start New Week</Text>
          </Button>
        )}

        {showConfetti && (
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: wp(50), y: 0 }}
            autoStart={false}
            fadeOut
            explosionSpeed={350}
            fallSpeed={3000}
          />
        )}
      </View>
    )
  },
)
export default StreakCalendar

const styles = StyleSheet.create({
  weekContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(3),
  },
  weekTitle: {
    fontSize: hp(2.2),
    fontFamily: "Coiny",
    color: theme.colors.primaryText,
    marginBottom: hp(2),
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayItem: {
    width: wp(11),
    alignItems: "center",
    marginBottom: hp(2),
  },
  completedDay: {
    opacity: 1,
  },
  dayName: {
    fontSize: hp(1.6),
    color: theme.colors.secondaryText,
    marginBottom: hp(0.5),
  },
  dayDate: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: theme.colors.primaryText,
    marginBottom: hp(1),
  },
  checkCircle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCircle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    borderWidth: 2,
    borderColor: "#DDD",
    backgroundColor: "white",
  },
  resetButton: {
    backgroundColor: theme.colors.secondary,
    marginBottom: hp(4),
  },
  resetButtonText: {
    fontSize: hp(2),
    fontFamily: "Coiny",
    color: "white",
  },
})

