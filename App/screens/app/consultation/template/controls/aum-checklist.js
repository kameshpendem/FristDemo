import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
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
import {
  Avatar,
  Badge,
  Icon,
  withBadge,
  Chip,
  ThemeProvider,
  CheckBox
} from "react-native-elements";
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR
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

export default class CheckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      selectedID: 0,
      optionArray: [],
      statusState: [],
      keyname: ""
    };
  }

  componentDidMount = () => {
    let x = this.props.item;
    x.selectedItems = [];
    console.log("Mount Fired");
    this.setState({ item: x, keyname: this.props.keyname });
    this.parseCustomOptions(this.props.item.customOption);
    this.state.item.selectedItems = [];

    if (this.props?.answer?.answer && x) {
      let y = this.props?.answer?.answer?.split("<br/>");

      y?.map((i) => {
        this.state.statusState.push(i);
      });
      // this.onAnswer();
      // console.log(x, 'setData');
    }
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

  handleButtonPress = (option, child) => {
    this.setState({ statusState: [] });
    let x = this.state.item;
    if (x.selectedItems == null) x.selectedItems = [];

    let index = x.selectedItems.indexOf(option);

    if (child == null) {
      if (index == -1) x.selectedItems.push(option);
      else x.selectedItems.splice(index, 1);
      if (option.hasChild == "true") this.setState({ hasChild: "true" });
      else this.setState({ hasChild: "false" });
    } else {
      // this is a child trigger
      let y = x.selectedItems[index];
      if (y.selectedChildren == null) y.selectedChildren = [];

      let childIndex = y.selectedChildren.indexOf(child);
      if (childIndex == -1) y.selectedChildren.push(child);
      else y.selectedChildren.splice(childIndex, 1);
      x.selectedItems[index] = y;
    }

    console.log("Array :" + JSON.stringify(x));

    this.setState({ item: x, selectedOption: x }, () => {
      this.onAnswer();
    });
  };

  informCheckStatus(option) {
    let x = this.state.item;
    if (x.selectedItems == null) x.selectedItems = [];
    let index = x.selectedItems.indexOf(option);
    if (index == -1) return false;
    else return true;
  }

  informChildCheckStatus(option, child) {
    let x = this.state.item;
    if (x.selectedItems == null) x.selectedItems = [];
    let index = x.selectedItems.indexOf(option);
    if (index == -1) return false;
    else {
      let y = x.selectedItems[index];
      if (y.selectedChildren == null) y.selectedChildren = [];

      let childIndex = y.selectedChildren.indexOf(child);
      if (childIndex == -1) return false;
      else return true;
    }
  }

  onAnswer = () => {
    let x = this.state.item;
    let y = "";

    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }

    let counter = 0;
    x.selectedItems.forEach((element) => {
      if (counter > 0) y += "<br/>";
      y += element.label;
      let children = "";

      if (
        element.selectedChildren != null &&
        element.selectedChildren.length > 0
      ) {
        children += " (";
        let i = 0;
        element.selectedChildren.forEach((child) => {
          if (i > 0) children += ",";
          children += "" + child.label;
          i++;
        });
      }

      if (children.length > 1) children += ")";
      y += children;
      counter++;
    });

    let simpleAnswer = x.label + " : " + y;
    x.simpleAnswer = simpleAnswer;
    x.keyname = this.state.keyname;

    this.setState({ item: x }, () => {
      this.props.onAnswer(this.state.item);
    });
  };

  renderButtons() {
    return this.state.optionArray.map((item, index) => {
      let x = this.state?.statusState;

      let status = x?.filter((i) => i == item.label);
      let isTrue = status[0] == item.label;
      return (
        <View
          key={index}
          style={{
            width: "50%"
            //marginLeft: -10
          }}>
          <CheckBox
            title={item.label}
            value={item.label}
            checked={isTrue ? true : this.informCheckStatus(item)}
            onPress={() => this.handleButtonPress(item, null)}
            style={[
              {
                // alignContent: 'flex-start',
                // marginLeft: -30,
                // paddingLeft: -30
              }
            ]}></CheckBox>
          {this.renderSubButtons(item)}
        </View>
      );
    });
  }

  renderSubButtons(item) {
    return item.children.map((child, index) => {
      return (
        <View
          key={index}
          style={{
            display: this.informCheckStatus(item) ? "flex" : "none",
            flexDirection: "row"
          }}>
          {/* <Chip 
                            title={child.label} 
                            type={this.state.selectedSubLabel == child.label ? "solid" : "outline"} 
                            style={[{ marginRight: 10 }]}
                            onPress={ () => this.handleSubButtonPress(child)}>
                          </Chip>  */}
          <CheckBox
            title={child.label}
            value={child.label}
            checked={this.informChildCheckStatus(item, child)}
            onPress={() => this.handleButtonPress(item, child)}
            style={[{ marginRight: 0 }]}></CheckBox>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={{ backgroundColor: DEFAULT_WHITE_COLOR }}>
        <View
          style={[
            {
              flexDirection: "row",
              paddingHorizontal: 10,
              alignItems: "center",
              flex: 1,
              width: "100%"
            }
          ]}>
          <View style={{ width: "35%" }}>
            <Text> {this.state.item.label}</Text>
          </View>
          <View
            style={[
              {
                // flexDirection: "",
                // flex: 2,
                width: "65%",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: DEFAULT_LIGHT_GREY_COLOR
              }
            ]}>
            {this.renderButtons()}
          </View>
        </View>
      </View>
    );
  }
}
