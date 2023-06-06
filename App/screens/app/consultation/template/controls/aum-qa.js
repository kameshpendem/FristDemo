import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  Text,
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
import { Input, Chip, ThemeProvider } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/FontAwesome";
import { DEFAULT_WHITE_COLOR } from "../../../../../themes/variable";

export default class QuestionAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = { item: [], notes: "", showNotes: false, keyname: "" };
  }

  componentDidMount = () => {
    this.setState({
      item: this.props.item,
      selectedOption: "",
      notes: this.props?.answer?.answer,
      keyname: this.props.keyname
    });
    Icon.loadFont();
  };

  onAnswer = () => {
    let x = this.state.item;

    console.log(this.props, "from qa");

    if (this.props?.answer) {
      x.upid = this.props?.answer.id;
    }
    // console.log('Answer-----' + this.state.notes);
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
      <View style={{ backgroundColor: DEFAULT_WHITE_COLOR }}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              // flexWrap: 'wrap',
              // paddingLeft: 10,
              paddingHorizontal: 10,
              width: "100%"
            }
          ]}>
          <View style={{ width: "35%" }}>
            <HTMLView
              value={"<div>" + this.state.item.label + "</div>"}
              style={[{ marginLeft: 5 }]}
            />
          </View>
          <View style={{ width: "65%" }}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[
                {
                  backgroundColor: "white",
                  margin: 10,
                  height: 40,
                  width: "82%",
                  padding: 10,
                  borderStyle: "solid",
                  borderColor: "#E8E8E8",
                  borderWidth: 1,
                  borderRadius: 5,
                  marginRight: 10,
                  marginLeft: 0
                }
              ]}
              onChangeText={(notes) =>
                this.setState({ notes }, () => {
                  this.onAnswer();
                })
              }
              value={this.state.notes}
            />
          </View>
        </View>
      </View>
    );
  }
}
