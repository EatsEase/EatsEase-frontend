import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';

interface Option {
  label: string;
  value: string | null;
}

const Dropdown: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedBirthdate, setSelectedBirthdate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const genderPlaceholder: Option = {
    label: 'Gender', // Initial placeholder text
    value: null,
  };

  const genderOptions: Option[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Undefined', value: 'Undefined' },
  ];

  const handleDateSelect = (date: string) => {
    setSelectedBirthdate(date); // Set the selected date
    setShowCalendar(false); // Close the calendar popup after selecting a date
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Gender Dropdown */}
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            placeholder={genderPlaceholder}
            items={genderOptions.map(option => ({ label: option.label, value: option.value }))}
            onValueChange={(value) => setSelectedGender(value)}
            value={selectedGender} // The selected value will show in the input field
            style={{
              inputIOS: styles.inputUnderline,
              inputAndroid: styles.inputUnderline,
              iconContainer: styles.iconContainer,
            }}
            Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
          />
        </View>

        {/* Birthdate Dropdown with Calendar */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <View style={styles.inputUnderline}>
              <Text style={[styles.selectedText, !selectedBirthdate && styles.placeholderText]}>
                {selectedBirthdate ? selectedBirthdate : 'Birthdate' }
              </Text>
              <Icon name="arrow-drop-down" size={24} color="gray" style={styles.iconContainer} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Show Calendar Popup */}
      {showCalendar && (
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarContainer}>
              <Calendar
                markedDates={{
                  [selectedBirthdate || '']: { selected: true, selectedColor: '#d9d9d9' },
                }}
                onDayPress={(day) => handleDateSelect(day.dateString)} // Pass the selected date to the handler
                monthFormat={'yyyy MM'}
                theme={{
                  textMonthFontFamily: 'Jua Regular',
                  textDayFontFamily: 'Jua Regular',
                  textDayHeaderFontFamily: 'Jua Regular',
                  textDayFontSize: 16,
                  textMonthFontSize: 20,
                  textDayHeaderFontSize: 14,
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCalendar(false)} // Close calendar
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 0,
  },
  row: {
    flexDirection: 'row', // Align dropdowns side by side
    justifyContent: 'space-between', // Space out the dropdowns
  },
  dropdownContainer: {
    width: '45%', // Each dropdown takes up about half of the width
    justifyContent: 'center', // Vertically center the inputs
  },
  inputUnderline: {
    fontSize: 20,
    fontFamily: 'Jua Regular',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#d9d9d9',
    color: 'black',
    paddingRight: 30,
    height: 50,  // Ensure both fields have the same height
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 10, // Adjust based on input height
    right: 10,
  },
  selectedText: {
    fontSize: 20,
    fontFamily: 'Jua Regular',
    color: 'black', // For selected value
  },
  placeholderText: {
    fontSize: 20,
    fontFamily: 'Jua Regular',
    color: '#d9d9d9', // Light gray for placeholder text
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300, // Adjust width of the calendar modal
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Dropdown;
