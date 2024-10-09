import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "../components/Headers";
import Tabs from "../components/NavigatBottomBar";
import { NavigationContainer } from "@react-navigation/native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Hellooooooo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
