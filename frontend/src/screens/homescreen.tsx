import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { colors } from '../theme/colors';
import MapWidget from '../widgets/map';

const HomeScreen = () => {
  return (
    <MapWidget />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  icon: {
    fontSize: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.brown,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 10,
  },
});

export default HomeScreen;