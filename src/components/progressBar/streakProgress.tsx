import { useState } from "react";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CircularProgress } from 'react-native-circular-progress';

const HomeProgress = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = 5;
  
  // Calculate the percentage for progress (level out of 5)
  const progressPerecentage = (currentLevel / totalLevels) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      
      <CircularProgress
        perecentage={progressPerecentage}
        color="#3498b"
        textColor="black"
        radius={45}
      />
      
      {/* You can test the progress by increasing the level */}
      <Text onPress={() => setCurrentLevel((prev) => (prev < 5 ? prev + 1 : 5))} style={styles.button}>
        Next Level
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  circularText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: 5,
  },
});

export default HomeProgress;