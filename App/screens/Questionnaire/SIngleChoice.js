import React, {Component} from 'react';
import {Text} from 'react-native';
import {View} from 'native-base';
import RadioGroup from 'react-native-radio-buttons-group';

export default class SingleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentData: [],
      childData: [],
      selectedParent: [],
      showControl: false,
      showChild: false,
      childElement: [],
      selectedChild: [],
    };
  }

  componentDidMount = () => {
    this.handleSingleChoiceValues();
  };

  handleSingleChoiceValues = () => {
    let child_label = [];
    let parent_label = [];
    let child_Element = [];
    let count = 1;
    let inputData = this.props.customOption.split('<br/>');
    console.log(inputData);
    inputData.forEach(function (item, index) {
      if (item.search('>>') != -1) {
        if (index > 0) {
          child_label = item.replace('>>', '');
          child_Element.push({label: child_label, value: index - count});
          count++;
        }
      } else {
        count = 1;
        parent_label.push({label: item, value: index});
      }
    });
    this.setState({parentData: parent_label});
    this.setState({childData: child_Element});
    // this.state.parentData = parent_label;
    // this.state.childData = child_Element;
    // console.log(this.state.parentData);
    // console.log(this.state.childData);
    this.state.showControl = true;
  };

  onParentSelect = (selectedParent) => {
    let data = {};
    // FUNCTION CALLED AFTER SELECTING SINGLECHOICE OPTION(RADIO BUTTON)
    console.log(selectedParent);
    //let selectedValue={}
    let selectedValue = selectedParent.find((e) => e.selected == true);
    console.log(selectedValue.value);
    console.log(selectedValue.label);
    if (selectedValue.length == 0) {
      this.state.showChild = false; // IF NOTHING SELECTED THEN NO CHILD CONTROL WILL BE DISPLAYED
    }

    this.state.childData.map((item) => {
      if (item.value == selectedValue.value) {
        console.log('has child');
        this.state.showChild = true; // MAPPING WITH THE SELECTED INDEX AND CHILD VALUES PARENT INDEX IF BOTH MATCHES THEN DISPLAY CHILD CONTROLS TO SINGLE CHOICE CONTROL
        data['value'] = selectedValue.label;
        data['parent'] = false;
        data['hasChild'] = true;
      } else {
        this.state.showChild = false;
        console.log('no child');
        data['value'] = selectedValue.label;
        data['parent'] = false;
      }
    });
    if(this.state.childData.length==0){
      data['value'] = selectedValue.label;
      data['parent'] = false;
    }
    this.setState({selectedParent: selectedParent.label}); //UPDATING STATE WITH THE SELECTED VALUES
    this.props.onSingleChoiceChange(this.props, data);
  };

  onChildSelect = (selectedChild) => {
    let data = {};
    let parent = [];

    let selectedValue = selectedChild.find((e) => e.selected == true);
    parent = this.state.parentData[selectedValue.value];
    data['parent'] = parent.label;
    data['value'] = selectedValue.label;
    this.setState({selectedChild: selectedChild.label});
    console.log(data + 'sandyyyyy');
    this.props.onChildChoiceChange(this.props, data);
  };
  render() {
    return (
      <View style={{paddingTop: 20}}>
        {/* {this.handleSingleChoiceValues()} */}
        <Text style={{textAlign: 'center'}}>{this.props.label}</Text>
        <View>
          {this.state.showControl == true ? (
            <RadioGroup
              radioButtons={this.state.parentData} // IF HAS CHILD THEN DISPLAYING ONLY PARENT DATA
              onPress={this.onParentSelect} // ON SELECTION CALLING THE FUNCTION
              flexDirection="row"
            />
          ) : null}
          {this.state.showChild == true ? (
            <RadioGroup
              radioButtons={this.state.childData} // IF HAS CHILD THEN DISPLAYING ONLY CHILD DATA
              onPress={this.onChildSelect} // ON SELECTION CALLING THE FUNCTION
              flexDirection="row"
            />
          ) : null}
          {/* <RadioGroup
            selected='none'
            radioButtons={this.state.parentData} // IF HAS CHILD THEN DISPLAYING ONLY PARENT DATA
            onPress={this.onParentSelect} // ON SELECTION CALLING THE FUNCTION
            flexDirection="row"
          />
          {this.state.showChild == true ? (
            <RadioGroup
              checked={null}
              radioButtons={this.state.childData} // IF HAS CHILD THEN DISPLAYING ONLY CHILD DATA
              onPress={this.onChildSelect} // ON SELECTION CALLING THE FUNCTION
              flexDirection="row"
            />
          ) : null} */}
        </View>
      </View>
    );
  }
}
