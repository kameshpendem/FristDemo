import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Touchable,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import {
  Avatar,
  Badge,
  Icon,
  withBadge,
  Chip,
  ThemeProvider
} from "react-native-elements";
import {
  DEFAULT_BLUE_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_WHITE_COLOR
} from "../../../../../themes/variable";

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

export default class SingleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      selectedID: 0,
      optionArray: [],
      answersArray: {},
      selectedColor: {
        backgroundColor: "rgb(241,252,255)",
        borderColor: "rgb(4,167,215)"
      },
      keyname: ""
    };
  }

  componentDidMount = () => {
    this.setState({
      item: this.props.item,
      selectedLabel: this.props?.answer?.answer,
      optionArray: [],
      answersArray: this.props?.answer,
      keyname: this.props.keyname
    });

    console.log(this.props, "this.props");

    this.parseCustomOptions(this.props.item.customOption);
  };

  parseCustomOptions = (text) => {
    const x = text.split("<br/>");
    const optionArray = [];
    var index = -1;

    x.forEach((item) => {
      let search = item.search(">>");
      if (search == -1) {
        index++;
        let x = {};
        x.label = item;
        x.hasChild = "false";
        x.children = [];
        optionArray.push(x);
      } else {
        let oldParent = optionArray[index];
        oldParent.hasChild = "true";
        let y = {};
        y.label = item.replace(">>", "");
        oldParent.children.push(y);
      }
    });

    this.setState({ optionArray: optionArray });
  };

  handleButtonPress = (item) => {
    console.log(item, "item");

    this.setState({ answersArray: [] });

    if (item.label != this.state.selectedLabel) {
      let x = this.state.item;
      x.childOption = null;
    }

    if (item.label === this.state.selectedLabel) {
      let x = this.state.item;
      x.selectedOption = { label: "" };
      this.setState(
        {
          selectedLabel: null,
          selectedOption: { label: "" }
        },
        () => {
          this.onAnswer();
        }
      );
    } else {
      if (item.hasChild == "true") this.setState({ hasChild: "true" });
      else this.setState({ hasChild: "false" });
      /* We have to edited the actual item */
      let x = this.state.item;
      x.selectedOption = item;
      this.setState({ selectedLabel: item.label, selectedOption: x }, () => {
        this.onAnswer();
      });
    }
  };

  handleSubButtonPress = (item) => {
    /* We have to edited the actual item */
    let x = this.state.item;
    x.childOption = item;
    this.setState({ selectedOption: x, selectedSubLabel: item.label }, () => {
      this.onAnswer();
    });
  };

  onAnswer = () => {
    let x = this.state.item;

    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }

    let a = x.label;
    let b = x.selectedOption.label;
    let c = x.childOption != null ? x.childOption.label : "";

    // let simpleAnswer = a + " : " + b + " [" + c + "]";
    let simpleAnswer = a + " : " + b;
    x.simpleAnswer = simpleAnswer;
    x.keyname = this.state.keyname;

    this.setState({ selectedOption: x }, () => {
      this.props.onAnswer(this.state.item);
    });
  };

  renderButtons() {
    return this.state.optionArray.map((item, index) => {
      let mappp = this.state.answersArray?.answer?.split(" ");
      let selected = mappp?.find((label) => label == item.label);
      return (
        <View key={index} style={[{ margin: 2 }]}>
          <Chip
            title={item.label}
            // type={this.state.selectedLabel == item.label ? 'solid' : 'outline'}
            type="none"
            titleStyle={
              this.state.selectedLabel == item.label
                ? { color: "rgb(4,167,215)", fontSize: 10 }
                : { color: DEFAULT_INVERSE_COLOR, fontSize: 10 }
            }
            containerStyle={[
              {
                borderRadius: 16,
                borderWidth: 1,
                marginRight: 1,
                flexWrap: "wrap",
                height: 30
              },
              this.state.selectedLabel == item.label
                ? this.state.selectedColor
                : selected == item.label
                ? this.state.selectedColor
                : { borderColor: DEFAULT_INVERSE_COLOR }
            ]}
            onPress={() => this.handleButtonPress(item)}></Chip>
        </View>
      );
    });
  }

  renderSubButtons() {
    return this.state.optionArray.map((item, index) => {
      return item.children.map((child) => {
        return (
          <View
            key={index}
            style={{
              display: this.state.selectedLabel == item.label ? "flex" : "none"
            }}>
            <Chip
              title={child.label}
              type={
                this.state.selectedSubLabel == child.label ? "solid" : "outline"
              }
              //  style={{ padding: 1 }}
              // style={[{ marginRight: 10, width: 10, height: 10 }]}
              style={{ size: 10 }}
              // style={{ width: 20, height: 20, backgroundColor: "red" }}
              onPress={() => this.handleSubButtonPress(child)}></Chip>
          </View>
        );
      });
    });
  }

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
            },
            ``
          ]}>
          <View style={{ width: "35%" }}>
            <Text>{`${this.state.item.label?.trim()}`}</Text>
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                flex: 2,
                justifyContent: "flex-start",
                width: "65%",
                flexWrap: "wrap"
              }
            ]}>
            {this.renderButtons()}
          </View>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginTop: 10,
              display: this.state.hasChild == "true" ? "flex" : "none"
            }
          ]}>
          <View
            style={[
              {
                flexDirection: "row",
                flex: 2,
                justifyContent: "flex-end",
                flexWrap: "wrap"
              }
            ]}>
            {this.renderSubButtons()}
          </View>
        </View>
      </View>
    );
  }
}
