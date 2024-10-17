import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "../components/Headers";
import Tabs from "../components/NavigatBottomBar";
import { NavigationContainer } from "@react-navigation/native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    text: {
      fontSize: 20,
      color: 'black',
      fontFamily: 'Jua Regular',
    },
});
