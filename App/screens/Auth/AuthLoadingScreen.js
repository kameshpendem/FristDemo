import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Image, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { APP_PRIMARY_COLOR } from "../../themes/variable";

import { getEnvironmentObject } from "../../config/Config";
import i18n from "../../../i18n";

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this.loadApp();
  }

  loadApp = async () => {
    await getEnvironmentObject();
    const userToken = await AsyncStorage.getItem("userToken");
    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/healpha_logo_main.png")}
            style={{ height: 70, width: 230 }}
          />
        </View>
        <View
          style={{ alignItems: "center", position: "absolute", bottom: 15 }}>
          <Text
            allowFontScaling={false}
            style={{ color: "#4F575C", fontWeight: "400" }}>
            {i18n.t("LOADING_SCREEN.POWERED_BY")} &nbsp;
            <Image
              source={require("../../assets/images/account-normal.png")}
              style={{ height: 21, width: 120 }}
            />
          </Text>
        </View>
        <ActivityIndicator
          style={{ marginBottom: 100 }}
          size={70}
          color={APP_PRIMARY_COLOR}
        />
      </View>
    );
  }
}
export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  }
});
