import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  View,
  TextInput,
  Touchable,
  Alert,
  StyleSheet
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import { Divider, Text } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/FontAwesome";
import { DEFAULT_WHITE_COLOR } from "../../../../../themes/variable";

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.state = { item: [], notes: "", showNotes: false, keyname: "" };
  }

  componentDidMount = () => {
    this.setState({
      item: this.props.item,
      selectedOption: "",
      keyname: this.props.keyname
    });
    Icon.loadFont();
  };

  onAnswer = () => {
    let x = this.state.item;
    console.log("Answer-----" + this.state.notes);
    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }
    x.answer = this.state.notes;
    let a = x.label;
    let b = x.answer;
    let simpleAnswer = a + " : " + b;
    x.simpleAnswer = simpleAnswer;
    x.keyname = this.state.keyname;
    this.props.onAnswer(this.state.item);
  };

  render() {
    return (
      <View
        style={{
          marginTop: -6,
          marginBottom: 6,
          backgroundColor: DEFAULT_WHITE_COLOR,
          width: "100%"
        }}>
        {/* <Text h3>{this.state.item.label}</Text> */}
        <Text style={{ marginHorizontal: 12 }}>{this.state.item.label}</Text>
        <Divider
          // subHeader={this.state.item.subHeader}
          orientation="horizontal"
          style={{ marginBottom: 5, marginTop: 5 }}
          subHeaderStyle={{ color: "#2089dc" }}
        />
      </View>
    );
  }
}
