import { Radio } from "native-base";
import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { APP_PRIMARY_COLOR } from "../../../themes/variable";

const RadioButton = ({ onPress, value, name, disable }) => {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.radioCircle}
          onPress={onPress}
          disabled={disable}>
          {value === name && <View style={styles.selectedRb} value={value} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default RadioButton;
const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  radioText: {
    marginRight: 35,
    fontSize: 20,
    color: "#000",
    fontWeight: "700"
  },
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: APP_PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center"
  },
  selectedRb: {
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: APP_PRIMARY_COLOR
  }
});
