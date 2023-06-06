import React, {Component} from 'react';
import {Text} from 'react-native';
import {View} from 'native-base';
import SelectMultiple from 'react-native-select-multiple';
import {CheckBox} from 'react-native-elements';

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
      checked: false,
      final_array: [],
    };
  }
  componentDidMount = async () => {
    await this.handleMultiListValues();
  };
  handleMultiListValues = () => {
    let new_array = [];
    let child_label = [];
    let parent_label = [];
    let child_Element = [];
    let count = 1;
    let inputData = this.props.customOption.split('<br/>');
    // console.log(inputData);
    inputData.forEach(function (item, index) {
      if (item.search('>>') != -1) {
        if (index > 0) {
          child_label = item.replace('>>', '');
          child_Element.push({
            label: child_label,
            value: index - count,
            isChecked: false,
            index: index,
            child: true,
          });
          parent_label.push({
            label: child_label,
            value: index - count,
            isChecked: false,
            display: false,
            index: index,
            child: true,
          });
          count++;
        }
      } else {
        count = 1;
        parent_label.push({
          label: item,
          value: index,
          isChecked: false,
          index: index,
          display: true,
          index: index,
          child: false,
        });
      }
    });
    this.state.final_array = parent_label;
    parent_label.forEach(function (item, index) {
      if (item.display == true) {
        new_array.push(item);
      }
    });
    this.setState({parentData: new_array});
    this.setState({childData: child_Element});
    // this.state.parentData = parent_label;
    // this.state.childData = child_Element;
    // console.log(this.state.parentData);
    // console.log(this.state.childData);
    this.state.showControl = true;
  };

  // onParentChange = (selectedParent) => {
  //   // FUNCTION CALLED AFTER SELECTING CHECKLIST OPTION
  //   this.state.childElement = [];
  //   console.log(typeof selectedParent);
  //   if (selectedParent.length == 0) {
  //     // IF NOTHING SELECTED THEN NO CHILD CONTROL WILL BE DISPLAYED
  //     this.state.showChild = false;
  //   }

  //   selectedParent.map((item1) => {
  //     // MAPPING WITH THE SELECTED INDEX AND CHILD VALUES PARENT INDEX IF BOTH MATCHES THEN DISPLAY CHILD CONTROLS TO MULTIPLE CHECKBOX
  //     this.state.childData.map((item2) => {
  //       if (item1.value == item2.value) {
  //         console.log(item2);
  //         this.state.childElement.push(item2);
  //         this.state.showChild = true;
  //       } else {
  //         //this.state.showChild=false
  //         console.log('not matched');
  //       }
  //     });
  //   });

  //   this.setState({selectedParent}); //UPDATING STATE WITH SELECTED VALUES
  //   console.log(selectedParent);
  // };

  // onChildChange = (selectedChild) => {
  //   this.setState({selectedChild});
  // };

  onChildCheckChanged = (value) => {
    let selectedOption = [];
    let outputdata = {};
    console.log(this.state.childElement);
    const data = this.state.childElement;

    const index = data.findIndex((x) => x.index === value);
    console.log(index);

    this.state.childElement[index].isChecked = !data[index].isChecked;

    selectedOption = this.state.childElement[index];
    console.log(selectedOption);
    this.setState({childElement: this.state.childElement}, () => {
      console.log(this.state.childElement);
    });

    this.state.parentData.forEach(function (item, index) {
      if (selectedOption.value == item.value) {
        outputdata['parent'] = item.label;
        outputdata['value'] = selectedOption.label;
        outputdata['hasChild'] = true;
      } else {
        //
      }
    });
    this.props.onMultiListChange(this.props, outputdata, selectedOption);
  };

  onParentCheckChanged(value) {
    if (value.child == true) {
      let selectedOption = [];
      let outputdata = {};
      // console.log(this.state.final_array);
      const data = this.state.final_array;

      const index = data.findIndex((x) => x.index === value.index);
      // console.log(index);

      this.state.final_array[index].isChecked = !data[index].isChecked;

      selectedOption.push(this.state.final_array[index]);
      console.log(selectedOption[0]);
      console.log(this.state.parentData);
      this.setState({parentData: this.state.parentData});

      this.state.parentData.forEach(function (item, index) {
        if (selectedOption[0].value == item.index) {
          outputdata['parent'] = item.label;
          outputdata['value'] = selectedOption[0].label;
          outputdata['hasChild'] = true;
        } else {
          //
        }
      });
      this.props.onMultiListChange(this.props, outputdata, selectedOption);
    } else {
      let new_array_ = [];
      // console.log(value);
      // console.log(this.state.final_array);
      // console.log(this.state.parentData);
      let selectedOption = [];
      let outputdata = {};
      const data = this.state.parentData;

      const index = data.findIndex((x) => x.index === value.value);
      //console.log(index);

      this.state.parentData[index].isChecked = !data[index].isChecked;

      selectedOption.push(this.state.parentData[index]);
      //console.log(selectedOption);

      this.setState({parentData: this.state.parentData});

      if (
        selectedOption[0].isChecked == true &&
        selectedOption[0].child == false
      ) {
        for (let i = 0; i < selectedOption.length; i++) {
          for (let j = 0; j < this.state.childData.length; j++) {
            if (selectedOption[i].value == this.state.childData[j].value) {
              let index = this.state.final_array.findIndex(
                (e) => e.index == this.state.childData[j].index,
              );
              this.state.final_array[index].display = true;
            } else {
            }
          }
        }
        this.state.final_array.forEach(function (item, index) {
          if (item.display == true) {
            new_array_.push(item);
          }
        });
        this.setState({parentData: new_array_});
      }
      if (
        selectedOption[0].isChecked == false &&
        selectedOption[0].child == false
      ) {
        for (let i = 0; i < selectedOption.length; i++) {
          for (let j = 0; j < this.state.childData.length; j++) {
            if (selectedOption[i].value == this.state.childData[j].value) {
              let index = this.state.final_array.findIndex(
                (e) => e.index == this.state.childData[j].index,
              );
              this.state.final_array[index].display = false;
            } else {
            }
          }
        }
        this.state.final_array.forEach(function (item, index) {
          if (item.display == true) {
            new_array_.push(item);
          }
        });
        this.setState({parentData: new_array_});
      }
      //this.state.childElement = [];
      // this.state.childData.map((item1, index1) => {
      //   selectedOption.map((item2, index2) => {
      //     if (item2.isChecked == true && item1.value == item2.value) {
      //       console.log(item1.index);
      //       this.state.parentData.splice(item1.index, 0, item1);
      //       // this.state.childElement.push(item2);
      //       // this.setState({showChild: true});
      //     } else {
      //       // console.log('else');
      //       if (item2.isChecked == false && item1.value == item2.value) {
      //         var indexes = this.state.parentData.findIndex(
      //           (p) => p.index == item1.index,
      //         );
      //         // console.log(indexes)
      //         this.state.parentData.splice(indexes, 1);
      //         this.setState({parentData: this.state.parentData});
      //         // console.log(this.state.parentData)
      //       }
      //     }
      //   });

      // });

      this.state.childData.forEach(function (item, index) {
        if (selectedOption[0].value == item.value) {
          //console.log("if")
          outputdata['parent'] = false;
          outputdata['value'] = selectedOption[0].label;
          outputdata['hasChild'] = true;
        } else {
          // console.log("else")
          outputdata['parent'] = false;
          outputdata['value'] = selectedOption[0].label;
        }
      });
      if (this.state.childData.length == 0) {
        outputdata['parent'] = false;
        outputdata['value'] = selectedOption[0].label;
      }
      this.props.onMultiListChange(this.props, outputdata, selectedOption);
    }
  }

  render() {
    return (
      <View style={{paddingTop: 20}}>
        {/* {this.handleMultiListValues()} */}
        <Text style={{textAlign: 'center'}}>{this.props.label}</Text>

        <View>
          {this.state.showControl == true
            ? this.state.parentData.map((item, key) => (
                <CheckBox
                  title={item.label}
                  key={key}
                  checkedColor="green"
                  checked={item.isChecked}
                  onPress={() => this.onParentCheckChanged(item)}
                />
              ))
            : null}
        </View>
        {/* <View>
          {this.state.showChild == true
            ? this.state.childElement.map((item, key) => (
                <CheckBox
                  title={item.label}
                  key={key}
                  checkedColor="green"
                  checked={item.isChecked}
                  onPress={() => this.onChildCheckChanged(item.index)}
                />
              ))
            : null}
        </View> */}
        {/* <SelectMultiple
              style={{borderBottomColor: 'white'}}
              items={this.state.parentData}
              selectedItems={this.state.selectedParent}
              onSelectionsChange={this.onParentChange} // ON SELECTION CALLING THE FUNCTION
            />
            {this.state.showChild==true?(
               <SelectMultiple
               style={{borderBottomColor: 'white'}}
               items={this.state.childElement}
               selectedItems={this.state.selectedChild}
               onSelectionsChange={this.onChildChange} // ON SELECTION CALLING THE FUNCTION
             />
            ):null} */}
      </View>
    );
  }
}
