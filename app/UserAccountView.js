import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserAccount({ route }) {
  const { userName } = route.params; // Destructure userName from route.params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Account Screen</Text>
      <Text style={styles.text}>Hello, {userName}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
