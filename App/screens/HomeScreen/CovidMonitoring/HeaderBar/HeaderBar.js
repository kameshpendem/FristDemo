import React, { Component } from "react";
import { Alert, Text, View } from "react-native";
import CovidMonitoringRouting from "../CovidMonitoringRouting/CovidMonitoringRouting";
import AsyncStorage from "@react-native-community/async-storage";
// import { NavigationActions } from "react-navigation";

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleBackPress = this.handleBackPress.bind(this);
  }
  componentDidMount() {
    this.props.navigation.setParams({
      handleBackPress: this.handleBackPress
    });
  }

  handleBackPress = async () => {
    const status = await AsyncStorage.getItem("status");
    this.props.navigation.goBack();
    return true;
  };

  render() {
    return <CovidMonitoringRouting />;
  }
}
export default HeaderBar;
