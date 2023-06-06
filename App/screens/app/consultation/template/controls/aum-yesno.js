import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TextInput,
  Touchable,
  Alert,
  StyleSheet,
  Platform
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import { Input, Chip, ThemeProvider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  DEFAULT_INVERSE_COLOR,
  DEFAULT_WHITE_COLOR
} from "../../../../../themes/variable";
import HTMLView from "react-native-htmlview";

// const inactiveTheme = {
//   Button: {
//     titleStyle: { color: 'grey' },
//   },
// };

// const activeTheme = {
//   Button: {
//     titleStyle: { color: 'white' },
//   },
// };

export default class yesno extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      notes: "",
      shownotes: false,
      keyname: this.props.keyname,
      selectedOption: ""
    };
  }

  componentDidMount = () => {
    this.setState({ item: this.props.item, selectedOption: "" });
    Icon.loadFont();

    if (this.props?.answer?.answer) {
      let x = this.props?.answer?.answer?.split(" ");
      if (x[0] === "yes")
        this.setState({ shownotes: false, notes: x[1]?.slice(1, -1) });
      this.setState({ selectedOption: x[0] });
    }
  };

  handleButtonPress = (item) => {
    if (item === this.state.selectedOption) {
      this.setState({
        selectedOption: ""
      });
    } else {
      this.setState({ selectedOption: item }, () => {
        if (item != this.state.selectedOption) this.setState({ notes: "" });
      });
    }

    if (item == "yes" && this.state.item.yesAdditional)
      this.setState({ shownotes: true });
    else if (item == "no" && this.state.item.noAdditional)
      this.setState({ shownotes: true });
    else this.setState({ shownotes: false });

    setTimeout(() => {
      this.onAnswer();
    }, 200);
  };

  //handlenotes = (event) => { this.onAnswer();}

  onAnswer = () => {
    let x = this.state.item;
    console.log("Answer-----" + this.state.selectedOption);
    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }
    x.selectedOption = this.state.selectedOption;
    x.additionalComment = this.state.notes;
    let a = x.label;
    let b = x.selectedOption;
    let c = x.additionalComment;
    // let simpleAnswer = a + " : " + b + " [" + c + "]";
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
              flex: 1,
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
          <View
            style={[
              {
                flexDirection: "row",
                flex: 2,
                justifyContent: "flex-start",
                width: "65%",
                marginTop: Platform.OS === "ios" ? 10 : 0
              }
            ]}>
            <Chip
              title="YES"
              // type={this.state.selectedOption == 'yes' ? 'green' : 'outline'}
              type="none"
              // mode="outlined"
              icon={{
                name: "check",
                type: "Ionicons",
                size: 18,
                color: this.state.selectedOption == "yes" ? "green" : "black"
              }}
              titleStyle={{
                color:
                  this.state.selectedOption == "yes"
                    ? "green"
                    : DEFAULT_INVERSE_COLOR
              }}
              containerStyle={[
                {
                  borderRadius: 20,
                  borderWidth: 1
                  //marginRight: 10,
                },
                this.state.selectedOption == "yes"
                  ? {
                      backgroundColor: "rgb(226,254,238)",
                      borderColor: "green"
                    }
                  : { borderColor: DEFAULT_INVERSE_COLOR }
              ]}
              onPress={() => this.handleButtonPress("yes")}></Chip>
            <Chip
              title="NO"
              // type={this.state.selectedOption == 'no' ? 'solid' : 'outline'}
              type="none"
              titleStyle={{
                color:
                  this.state.selectedOption == "no"
                    ? "#FA8072"
                    : DEFAULT_INVERSE_COLOR
              }}
              icon={{
                name: "close",
                type: "Ionicons",
                size: 18,
                color: this.state.selectedOption == "no" ? "#FA8072" : "black"
              }}
              containerStyle={[
                {
                  borderRadius: 20,
                  borderWidth: 1,
                  marginHorizontal: 10
                },
                this.state.selectedOption == "no"
                  ? {
                      backgroundColor: "rgba(255,237,237,1)",
                      borderColor: "#FA8072"
                    }
                  : { borderColor: DEFAULT_INVERSE_COLOR }
              ]}
              onPress={() => this.handleButtonPress("no")}></Chip>
          </View>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              flex: 1,
              marginTop: 10,
              width: "100%",
              display: this.state.shownotes == true ? "flex" : "none"
            }
          ]}>
          <View style={{ width: "35%" }}>
            <HTMLView
              value={"<div>notes :</div>"}
              style={[{ marginLeft: 5 }]}
            />
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                flex: 2,
                // justifyContent: 'flex-end',
                width: "65%"
              }
            ]}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[
                {
                  backgroundColor: "white",
                  margin: 10,
                  height: 40,
                  width: 250,
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
