import React from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY
} from "../../../themes/variable";
import { hp, wp } from "../../../themes/Scale";
import { Icon } from "native-base";
import History from "../../../assets/images/history.png";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const SimpleHeader = (props) => {
  return (
    <View
      style={{
        backgroundColor: APP_PRIMARY_COLOR,
        height: Platform.OS === "ios" ? hp(100) : hp(70)
      }}>
      {Platform.OS == "ios" ? (
        <MyStatusBar
          backgroundColor={APP_PRIMARY_COLOR}
          barStyle="light-content"
        />
      ) : null}
      <View
        style={{
          flexDirection: "row",
          // height: Platform.OS === "ios" ? 0 : "100%",
          backgroundColor: APP_PRIMARY_COLOR,
          flex: 1
        }}>
        <View
          style={{
            justifyContent: "space-between",
            paddingHorizontal: wp(10),
            flexDirection: "row",
            alignItems: "center",
            flex: 1
          }}>
          <View>
            <Text
              style={{
                color: DEFAULT_WHITE_COLOR,
                fontSize: 18,
                marginLeft: 10,
                fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
              }}
              testID={props.title+"text"}
              accessibilityLabel={props.title+"text"}>
              {props.title}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              {props.template ? (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("PatientHistory");
                  }}
                  testID="historyTouch"
                  accessibilityLabel="historyTouch">
                  <Image
                  testID="historyImage"
                  accessibilityLabel="historyImage"
                    source={History}
                    style={{ tintColor: DEFAULT_WHITE_COLOR, margin: 5 }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}
               testID="closeTouch"
               accessibilityLabel="closeTouch">
                <Icon
                testID="closeIcon"
                accessibilityLabel="closeIcon"
                  name="close"
                  style={{ color: DEFAULT_WHITE_COLOR, fontSize: 22 }}
                  type="Ionicons"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SimpleHeader;
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  }
});
