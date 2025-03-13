"use client"

import * as React from "react"

import { FlatList, StyleSheet, Text, View } from "react-native"
import { hp } from "../../utils/common"
import { gameInfo } from "@/src/data/gameInfo"
import GameCard from "./game-card"
import SliderActiveDot from "./slider-active-dot"
import { theme } from "@/src/constants/Theme"

// Define ViewToken interface inline
interface ViewToken {
  item: any
  key: string
  index: number | null
  isViewable: boolean
  section?: any
}

