import React, { Component } from "react";
import Routes from "./routes/RoutesMT";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import Twilio from "./screens/HomeScreen/Checkup/Twilio";
import { ComponentStateCache } from "react-component-state-cache";

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { twilio_connection } = this.props;

    console.log(twilio_connection, "MainApp");

    return (
      <View style={{ flex: 1 }}>
        <ComponentStateCache>
          {twilio_connection && <Twilio />}
        </ComponentStateCache>
        <Routes />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    twilio_connection: state.app_twilio.twilio_connection
  };
}

export default connect(mapStateToProps, {})(MainApp);
