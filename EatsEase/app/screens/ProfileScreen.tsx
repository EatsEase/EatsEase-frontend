import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Logged out successfully");
      navigation.navigate("Login");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
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

        {/* History */}
        <TouchableOpacity onPress={() => navigation.navigate("History")} style={styles.touchableRow}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🕒</Text>
            <Text style={styles.detailText}>History</Text>
            <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/130/130884.png" }} style={styles.nextIcon} />
          </View>
        </TouchableOpacity>

        {/* Preferences */}
        <TouchableOpacity onPress={() => navigation.navigate("Preferences")} style={styles.touchableRow}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⚙️</Text>
            <Text style={styles.detailText}>Preferences</Text>
            <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/130/130884.png" }} style={styles.nextIcon} />
          </View>
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
  nextIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  touchableRow: {
    width: "100%",
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
