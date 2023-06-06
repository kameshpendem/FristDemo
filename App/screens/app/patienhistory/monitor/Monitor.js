import React, { useState } from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_WHITE_COLOR
} from "../../../../themes/variable";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  option1,
  option2,
  onSelectSwitch,
  selectionColor,
  t
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = (val) => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignSelf: "center",
        marginTop: "50%"
      }}>
      <Text> {t("PATIENTS.HEALTH MONITOR")}</Text>
      {/* <View
        style={{
          height: 44,
          width: 215,
          backgroundColor: DEFAULT_WHITE_COLOR,
          borderRadius: getRoundCorner ? 25 : 0,
          borderWidth: 1,
          borderColor: selectionColor,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 4,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,
            backgroundColor:
              getSelectionMode == 1 ? selectionColor : DEFAULT_WHITE_COLOR,
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
          }}>
          <Text
            style={{
              color:
                getSelectionMode == 1 ? APP_PRIMARY_COLOR : DEFAULT_BLACK_COLOR,
            }}>
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
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color:
                getSelectionMode == 2 ? APP_PRIMARY_COLOR : DEFAULT_BLACK_COLOR,
            }}>
            {option2}
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default withTranslation()(CustomSwitch);
