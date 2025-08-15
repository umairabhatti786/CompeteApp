import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import DatePicker from "react-native-date-picker";
import { useState } from "react";
import { formatDate, formatSQLDateTime } from "../../utils/CommonHooks";

const DateModal = ({ modalVisible, setModalVisible, onConfirmDate }: any) => {
  const [date, setDate] = useState(new Date());
  const formattedDate = formatDate(new Date());
  const [classDate, setIsClassDate] = useState<any>(formattedDate);
  const tomorrow = new Date();
  const today = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(tomorrow.getDate() + 14); // 14 days = 2 weeks
  return (
    <>
      <DatePicker
        modal={true}
        mode="date"
        locale="en_US"
        theme="dark"
        confirmText="Done"
        cancelText="Cancel"
        onCancel={() => setModalVisible(false)} // Reset state on dismiss
        dividerColor={"#212325"}
        style={{
          width: 300, // Adjust the width as per your requirement
          height: 180,
          alignSelf: "center",
        }}
        open={modalVisible}
        maximumDate={maxDate}
        date={tomorrow} // Ensure it always shows a valid date
        minimumDate={tomorrow} // Prevents selecting past dates
        onDateChange={(date) => {
          setDate(date);
        }}
        onConfirm={(date) => {
          const formattedDate = formatDate(date);
          setDate(date);
          setModalVisible(false); // Close the picker after selection
          onConfirmDate(formatSQLDateTime(new Date(date)), formattedDate);
        }}
      />
    </>
  );
};
export default DateModal;

const styles = StyleSheet.create({});
