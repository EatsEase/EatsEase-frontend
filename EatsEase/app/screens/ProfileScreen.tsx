import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (!storedUsername) {
          Alert.alert("Error", "No username found. Please log in again.");
          navigation.navigate("Login");
          return;
        }

        console.log("Fetching profile for:", storedUsername);

        const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/${storedUsername}`);
        console.log("User Profile Data:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem('username');

      console.log("Logged out successfully");
      
      navigation.navigate("Login");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorMessage}>Failed to load profile. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>{userData.userProfile.user_name || "Unknown"}</Text>
        <Text style={styles.joinDate}>เข้าร่วมตั้งแต่ {new Date(userData.created_date).toLocaleDateString()}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📧</Text>
          <Text style={styles.detailText}>{userData.user_email || "No Email"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>♀️</Text>
          <Text style={styles.detailText}>{userData.userProfile.gender || "Not specified"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🎂</Text>
          <Text style={styles.detailText}>{ userData.age ? `${userData.age} years` : "Not specified"}</Text>
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
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorMessage: { fontSize: 16, color: "#FF6B6B", fontFamily: "Mali SemiBold" },
  profileSection: { alignItems: "center", marginTop: 20 },
  profileName: { fontSize: 20, fontWeight: "bold", marginTop: 10, fontFamily: "Mali SemiBold" },
  joinDate: { fontSize: 14, color: "#888", marginTop: 5, fontFamily: "Mali Regular" },
  detailsSection: { marginTop: 30, paddingHorizontal: 20 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E8E8E8", paddingBottom: 10 },
  detailLabel: { fontSize: 20, marginRight: 15 },
  detailText: { fontSize: 16, fontFamily: "Mali Regular", flex: 1 },
  nextIcon: { width: 20, height: 20, tintColor: "#888" },
  touchableRow: { width: "100%" },
  logoutButton: { backgroundColor: "#FF6B6B", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, alignSelf: "center", marginTop: 30 },
  logoutText: { color: "#fff", fontSize: 16, fontFamily: "Mali Bold" },
});
