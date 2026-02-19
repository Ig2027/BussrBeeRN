import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💬</Text>
      <Text style={styles.title}>Chat</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
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

export default ChatScreen;