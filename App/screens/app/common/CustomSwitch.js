import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_SHADOW_COLOR
} from "../../../themes/variable";
import { wp } from "../../../themes/Scale";
import Search from "../../../assets/images/search_patients.png";

const CustomSwitch = ({
  selectionMode,
  roundCorner,
  option1,
  option2,
  onSelectSwitch,
  selectionColor
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = (val) => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignContent: "space-around" }}>
        <View
          style={{
            height: 44,
            width: 215,
            backgroundColor: DEFAULT_WHITE_COLOR,
            borderRadius: getRoundCorner ? 25 : 0,
            borderWidth: 1,
            borderColor: selectionColor,
            flexDirection: "row",
            justifyContent: "center",
            padding: wp(4)
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => updatedSwitchData(1)}
            style={{
              flex: 1,
              backgroundColor:
                getSelectionMode == 1 ? selectionColor : DEFAULT_WHITE_COLOR,
              borderRadius: getRoundCorner ? 25 : 0,
              justifyContent: "center",
              alignItems: "center",
              padding: wp(3)
            }}
            testID={option1+"touch"}
              accessibilityLabel={option1+"touch"}>
            <Text
              style={{
                color:
                  getSelectionMode == 1
                    ? APP_PRIMARY_COLOR
                    : DEFAULT_BLACK_COLOR
              }} testID={option1+"text"}
              accessibilityLabel={option1+"text"}>
              {option1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            TouchableOpacity
            activeOpacity={1}
            onPress={() => updatedSwitchData(2)}
            style={{
              flex: 1,
              backgroundColor:
                getSelectionMode == 2 ? selectionColor : DEFAULT_WHITE_COLOR,
              borderRadius: getRoundCorner ? 25 : 0,
              justifyContent: "center",
              alignItems: "center"
            }}
            testID={option2+"touch"}
            accessibilityLabel={option2+"touch"}>
            <Text
              style={{
                color:
                  getSelectionMode == 2
                    ? APP_PRIMARY_COLOR
                    : DEFAULT_BLACK_COLOR
              }}
              testID={option2+"touch"}
              accessibilityLabel={option2+"touch"}>
              {option2}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomSwitch;
