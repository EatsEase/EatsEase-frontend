import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Headers";
import Tabs from "../components/NavigateBottomBar";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProfileScreen() {

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
        console.log('Logged out successfully');
        navigation.navigate('Login'); // Navigate to login screen
    } catch (err) {
        console.error('Error logging out', err);
    }
  };

  return (
    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* <Image
          style={styles.profileImage}
          source={require("../assets/profile_icon.png")} // Replace with your image path
        /> */}
        <Text style={styles.profileName}>thacwn</Text>
        <Text style={styles.joinDate}>เข้าร่วมตั้งแต่ 28 August 2024</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📧</Text>
          <Text style={styles.detailText}>thanidachaiwongnon23@gmail.com</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>♀️</Text>
          <Text style={styles.detailText}>Female</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🎂</Text>
          <Text style={styles.detailText}>21 years</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('History')}
          style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕒</Text>
          <Text style={styles.detailText}>History</Text>
        </TouchableOpacity>
      {/* Preferences Row navigation to SettingScreen */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Preferences')}
          style={styles.detailRow}>
          <Text style={styles.detailLabel}>⚙️</Text>
          <Text style={styles.detailText}>Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8E8E8", // Placeholder background color
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Mali SemiBold",
  },
  joinDate: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    fontFamily: "Mali Regular",
  },
  detailsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingBottom: 10,
  },
  detailLabel: {
    fontSize: 20,
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    fontFamily: "Mali Regular",
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Mali Bold",
  },
});