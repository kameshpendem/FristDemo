import React, {Component} from 'react';
import {Text, TextInput} from 'react-native';
import {View} from 'native-base';
import RadioGroup from 'react-native-radio-buttons-group';

const radio_props = [
  {label: 'Yes', value: 0},
  {label: 'No', value: 1},
];

export default class YesNo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controls: [],
      showControl: false,
      showYes_Additional: false,
      showNo_Additional: false,
      yes_comments: '',
      no_comments: '',
      selectedValue: [],
      heighttext: 0,
    };
  }
  componentDidMount = () => {
    this.setControls();
  };
  setControls = () => {
    let radio_data = [];
    radio_data.push({label: 'Yes', value: 0}, {label: 'No', value: 1});
    this.setState({controls: radio_data});
    this.state.showControl = true;
  };
  onYes_No_Press = (selectedAnswer) => {
    this.setState({showYes_Additional: false});
    this.setState({showNo_Additional: false});
    let selectedLabel;
    selectedLabel = selectedAnswer.find((e) => e.selected == true);
    //console.log(selectedLabel);
    if (selectedLabel.label == 'Yes' && this.props.yesAdditional == true) {
      //console.log('if');
      this.setState({showNo_Additional: false});
      this.setState({showYes_Additional: true});
    } else if (selectedLabel.label == 'No' && this.props.noAdditional == true) {
      //console.log('else if');
      this.setState({showYes_Additional: false});
      this.setState({showNo_Additional: true});
    }

    this.setState({selectedValue: selectedAnswer});
    //console.log(this.props);
    this.props.onYesNoChange(this.props, selectedLabel.label);
  };

  render() {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={{textAlign: 'center'}}>{this.props.label}</Text>
        {this.state.showControl == true ? (
          <RadioGroup
            radioButtons={this.state.controls} // IF HAS CHILD THEN DISPLAYING ONLY PARENT DATA
            onPress={this.onYes_No_Press} // ON SELECTION CALLING THE FUNCTION
            flexDirection="row"
          />
        ) : null}
        {/* <RadioGroup
          radioButtons={radio_props} //DISPLAYING JUST YES OR NO VALUES
          onPress={this.onYes_No_Press} // ON SELECTION CALLING THE FUNCTION
          flexDirection="row"
        /> */}
        {this.state.showYes_Additional == true ? (
          <TextInput
            allowFontScaling={false}
            placeholder="Please Explain why you selected YES"
            placeholderTextColor={'#2D323C'}
            multiline={true}
            onContentSizeChange={(event) => {
              this.setState({heighttext: event.nativeEvent.contentSize.height});
            }}
            style={{
              backgroundColor: '#FEFBFB',
              height: 200,
              textAlignVertical: 'top',
              height: Math.max(35, this.state.heighttext),
              borderColor: '#345D7E',
              borderWidth: 1,
              borderWidth: 1,
              marginHorizontal: 10,
            }}
            onChangeText={(text) =>
              this.props.onYesNoChange(this.props, 'yes', text)
            }
          />
        ) : null}
        {this.state.showNo_Additional == true ? (
          <TextInput
            allowFontScaling={false}
            placeholder="Please Explain why you selected NO"
            placeholderTextColor={'#2D323C'}
            multiline={true}
            onContentSizeChange={(event) => {
              this.setState({heighttext: event.nativeEvent.contentSize.height});
            }}
            style={{
              backgroundColor: '#FEFBFB',
              height: 200,
              textAlignVertical: 'top',
              height: Math.max(35, this.state.heighttext),
              borderColor: '#345D7E',
              borderWidth: 1,
              borderWidth: 1,
              marginHorizontal: 10,
            }}
            onChangeText={(text) =>
              this.props.onYesNoChange(this.props, 'no', text)
            }
          />
        ) : null}
      </View>
    );
  }
}
const Styles = {
  input: {
    padding: 10,
    height: 40,
    backgroundColor: '#dcdcdc',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
};
