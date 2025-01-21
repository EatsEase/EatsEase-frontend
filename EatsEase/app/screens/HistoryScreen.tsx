import React from 'react';
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Headers";

const historyData = [
    {
        id: '1',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '2',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '3',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '4',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '5',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '6',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
    {
        id: '7',
        meal: 'มื้อกลางวัน',
        menu: 'ข้าวกะเพราหมูกรอบ + ไข่ดาว',
        restaurant: 'ตู้ตาโฮมเมด',
        location: 'ซอย 2 วตุจักร กทม 10900',
        dateTime: '01/01/68 4.00 PM',
    },
];

const HistoryScreen = ({ navigation }) => {
    const renderHistoryItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>{item.dateTime}</Text>
            </View>
            <Image source={item.image} style={styles.foodImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.mealText}>Meal: {item.meal}</Text>
                <Text style={styles.menuText}>Menu: {item.menu}</Text>
                <Text style={styles.text}>Restaurant: {item.restaurant}</Text>
                <Text style={styles.text}>Location: {item.location}</Text>
            </View>
        </View>
    );
    

    return (
        <View style={styles.container}>
            <Header title="EatsEase" /> 
            <View style={styles.listContainer}>
                <FlatList
                    data={historyData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderHistoryItem}
                    contentContainerStyle={styles.listContent}
                />
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1, // Ensures FlatList takes up the remaining space
    },
    listContent: {
        paddingBottom: 80, // Extra space to account for the fixed back button
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 2,
        marginHorizontal: 16,
    },
    dateTimeContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    dateTimeText: {
        fontFamily: 'Mali SemiBold',
        fontSize: 12,
        color: '#888',
    },
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    mealText: {
        fontFamily: 'Mali SemiBold',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    menuText: {
        fontFamily: 'Mali SemiBold',
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },
    text: {
        fontFamily: 'Mali SemiBold',
        fontSize: 12,
        color: '#555',
    },
    backButton: {
        backgroundColor: '#FE5266',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        width: 100,
        alignSelf: 'center',
        position: 'absolute', // Make the button fixed
        bottom: 45, // Adjust position to your liking
        zIndex: 10, // Ensure it is layered above other components
    },
    backButtonText: {
        fontFamily: 'Mali Bold',
        color: 'white',
        fontSize: 16,
    },
});

export default HistoryScreen;
