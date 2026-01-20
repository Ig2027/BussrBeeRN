import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Colors } from '../theme/colors';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.title}>Greater Seattle Map</Text>
      <Text style={styles.subtitle}>Google Maps integration coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  icon: {
    fontSize: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.brown,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 10,
  },
});

export default HomeScreen;