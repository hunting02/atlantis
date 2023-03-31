import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// eslint-disable-next-line import/no-internal-modules
import { ActionLabel, Button, Typography } from "@jobber/mobile/src";

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Typography />
      <Button icon="add" label="Hello" />
      <Typography>Typography baby!</Typography>
      <ActionLabel>Action on me</ActionLabel>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
