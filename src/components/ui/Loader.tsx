import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View>
      <ActivityIndicator size="large" color="blue" />
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})