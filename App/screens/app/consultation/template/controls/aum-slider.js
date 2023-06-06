import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Animations,
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
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome";
import { DEFAULT_WHITE_COLOR } from "../../../../../themes/variable";
import { color } from "react-native-reanimated";
import { SliderPicker } from "react-native-slider-picker";

export default class SliderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      notes: "",
      showNotes: false,
      rating: "",
      keyname: ""
    };
  }

  componentDidMount = () => {
    let x = this.props.item;
    x.simpleAnswer = null;
    x.selectedValue = 0;

    this.setState({
      item: x,
      value: this.props.item.min,
      keyname: this.props.keyname
    });
    Icon.loadFont();

    if (this.props?.answer?.answer && x) {
      let y = this.props?.answer?.answer?.split("/");
      y = y[0]?.split(" ");

      this.setState({ rating: +y[0] });
    }
  };

  handleButtonPress = (value) => {
    this.setState({ rating: "" });
    this.setState({ value: value }, () => {
      this.onAnswer();
    });
  };

  onAnswer = () => {
    let x = this.state.item;
    x.selectedValue = this.state.value;

    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }

    x.simpleAnswer = x.label + " : " + x.selectedValue + " / " + x.max;
    x.keyname = this.state.keyname;

    console.log(x, "hello answer");

    this.setState({ item: x }, () => {
      this.props.onAnswer(this.state.item);
    });
  };

  render() {
    let value = this.state.rating ? this.state.rating : 0;

    console.log(value, this.state.rating);

    return (
      <View style={{ backgroundColor: DEFAULT_WHITE_COLOR }}>
        <View
          style={{
            flex: 1,
            alignItems: "stretch",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 10,
            width: "100%"
          }}>
          <View style={{ width: "35%" }}>
            <Text style={{ flex: 1, flexWrap: "wrap" }}>
              {" "}
              {this.state.item.label}{" "}
            </Text>
            {/* <Text style={{ flex: 1, flexWrap: "wrap" }}>
              {" "}
              ( {this.state.item.min} - {this.state.item.max} ){" "}
            </Text> */}
          </View>

          <View style={{ width: "65%" }}>
            {/* <Slider
              style={{
                width: "100%",
                height: 40,
                flex: 1,
                justifyContent: "flex-start"
                // marginRight: 10,
              }}
              minimumValue={this.state.item.min}
              maximumValue={this.state.item.max}
              // minimumTrackTintColor="#FFFFFF"
              // maximumTrackTintColor="#000000"
              tapToSeek={true}
              thumbTintColor="#2089dc"
              minimumTrackTintColor="#2089dc"
              maximumTrackTintColor="#e1e8ee"
              value={this.state.rating ? this.state.rating : this.state.value}
              step={1}
              onSlidingComplete={(value) => this.handleButtonPress(value)}
            /> */}

            <SliderPicker
              //   minLabel={"0"}
              //midLabel={'1'}
              //   midLabel={'2'}
              // midLabel={'3'}
              //   maxLabel={this.state.item.max}
              minValue={1}
              maxValue={this.state.item.max}
              callback={(value) => this.handleButtonPress(value)}
              //   defaultValue={Number(this.state.rating)}
              labelFontColor={"#6c7682"}
              labelFontSize={1}
              numberStylesOverride={{
                fontSize: 12
              }}
              showFill={true}
              fillColor={"#04A6D6"}
              //labelFontWeight={'bold'}
              showNumberScale={true}
              //   showSeparatorScale={true}
              buttonBackgroundColor={"#fff"}
              buttonBorderColor={"#6c7682"}
              buttonBorderWidth={1}
              //   scaleNumberFontWeight={"10"}
              buttonDimensionsPercentage={6}
              heightPercentage={2}
              widthPercentage={60}
            />

            {/* <Text
              style={{
                textAlign: "center"
              }}>
              {this.state.rating ? this.state.rating : this.state.value}
            </Text> */}
          </View>
        </View>
      </View>
    );
  }
}
