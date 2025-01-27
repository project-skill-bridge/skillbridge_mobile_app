import * as React from 'react'

import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../constants/Theme'

const AnimatedAvatar = () => {
  return (
    <View style={styles.container}>
      <Text>AnimatedAvatar</Text>
    </View>
  )
}

export default AnimatedAvatar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.primary
    }
})