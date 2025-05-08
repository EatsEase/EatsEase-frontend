import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Define the types for the options
interface Option {
  label: string;
  value: string | null;
}

interface DropdownProps {
  selectedGender: string;
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>;
  selectedBirthdate: string;
  setSelectedBirthdate: React.Dispatch<React.SetStateAction<string>>;
}

const Dropdown: React.FC<DropdownProps> = ({
  selectedGender,
  setSelectedGender,
  selectedBirthdate,
  setSelectedBirthdate
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);

  const genderPlaceholder: Option = {
    label: 'เพศ',
    value: '', // Default value as an empty string
  };

  const genderOptions: Option[] = [
    { label: 'เพศชาย', value: 'Male' },
    { label: 'เพศหญิง', value: 'Female' },
    { label: 'ไม่ต้องการระบุ', value: 'Not specified' },
  ];

  const birthDatePlaceholder: Option = {
    label: 'Birthdate',
    value: null,
  };

  const handleConfirmDate = (date: Date) => {
    setSelectedBirthdate(date.toLocaleDateString());
    setDatePickerVisible(false);
  };

  const handleCancelDate = () => {
    setDatePickerVisible(false);
  };

  // Get today's date to use as the maximum selectable date
  const maxDate = new Date();
  // set maxDate to 13 years ago
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Gender Dropdown */}
        <View style={styles.dropdownContainerLeft}>
          <RNPickerSelect
            placeholder={genderPlaceholder}
            items={genderOptions.map(option => ({ label: option.label, value: option.value }))}
            onValueChange={(value) => setSelectedGender(value)}
            value={selectedGender}
            style={{
              inputIOS: [
                styles.inputUnderline,
                selectedGender && { color: 'black' },
              ],
              inputAndroid: [
                styles.inputUnderline,
                selectedGender && { color: 'black' },
              ],
              iconContainer: styles.iconContainer,
            }}
            Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
          />
        </View>

        {/* Birthdate Picker */}
        <View style={styles.dropdownContainerRight}>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <View style={styles.inputUnderline}>
              <Text
                style={[
                  styles.selectedText,
                  selectedBirthdate ? { color: 'black' } : { color: '#d9d9d9' },
                ]}
              >
                {selectedBirthdate || 'วัน/เดือน/ปีเกิด'}
              </Text>
            </View>
          <Icon name="calendar-today" size={24} color="gray" style={styles.iconContainer} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDate}
        maximumDate={maxDate} // Prevent future date selection
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between the items
    alignItems: 'center',
  },
  dropdownContainerLeft: {
    width: '40%', // Left dropdown (e.g., Gender)
    marginRight: 10, // Add space to the right of the first dropdown
  },
  dropdownContainerRight: {
    width: '60%', // Right dropdown (e.g., Birthdate)
  },
  inputUnderline: {
    fontSize: 20,
    fontFamily: 'Mali-Bold',
    paddingVertical: 16,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#d9d9d9',
    paddingRight: 30,
    height: 60,
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  selectedText: {
    fontSize: 20,
    fontFamily: 'Mali-Bold',
    color: '#d9d9d9',
    width: '100%',
  },
});

export default Dropdown;
