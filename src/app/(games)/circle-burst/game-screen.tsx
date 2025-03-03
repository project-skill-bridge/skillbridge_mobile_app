import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function GameScreen(): JSX.Element {
  const router = useRouter();
  return (
    <View>
      <Text>game-screen</Text>
    </View>
  )
}