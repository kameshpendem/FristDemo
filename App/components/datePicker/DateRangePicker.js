import React from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import { DEFAULT_GREY_COLOR } from "../../themes/variable";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      displayedDate: moment()
    };
  }

  setDates = (dates) => {
    // console.log(dates);
    this.setState({
      ...dates
    });
  };

  render() {
    const { startDate, endDate, displayedDate } = this.state;
    return (
      <View style={styles.container}>
        <DateRangePicker
          onChange={this.setDates}
          endDate={endDate}
          startDate={startDate}
          displayedDate={displayedDate}
          range>
          <Text style={styles.date}>StartDate - EndDate</Text>
        </DateRangePicker>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text>{this.state?.startDate?.toString().slice(4, 15)}</Text>

          <Text>{this.state?.endDate?.toString().slice(4, 15)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  date: {
    marginRight: 10,
    marginLeft: 5,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 2,
    color: DEFAULT_GREY_COLOR
  }
});
