import React, {Component} from 'react';
import {Text, View, Button} from 'native-base';
import {ScrollView} from 'react-native';
import Heading from './Heading';
import CheckList from './CheckList';
import SimpleQuestion from './SimpleQuestion';
import Image from './Image';
import MultiChoice from './MultiChoice';
import Notes from './Notes';
import RatingScale from './RatingScale';
import YesNo from './YesNo';
import SingleChoice from './SIngleChoice';
import TableList from './Table';
import {APP_PRIMARY_COLOR} from '../../themes/variable';

// var inputdata = require('./sample.json');

// var response_Data = inputdata;

export default class QuestionnaireForm extends Component {
  constructor(props) {
    super(props);

    //this.handleChange = this.handleChange.bind(this)
    this.state = {
      inputdata: JSON.parse(this.props[0].TemplateBody),
      response_Data: JSON.parse(this.props[0].TemplateBody),
      callFunction: false,
    };
  }
  // propsData--INPUT DATA SENT FROM FORM TO CONTROL

  /* Function that handles TABLE control values
   */
  handleTableNotes = (propsData, text, index1, index2) => {
    console.log(text, index1, index2);
    this.state.response_Data.forEach((item, index) => {
      if (propsData.id == item.id) {
        console.log('matched');
        if (item.hasOwnProperty('value')) {
          console.log('value der');
        } else {
          console.log('value not der');
          this.state.response_Data[index]['value'] = [];
        }

        if (item.value[index1] != null) {
          console.log('index1 available');
          if (item.value[index1][index2] != null) {
            console.log('index2 available');
            item.value[index1][index2] = text;
          } else {
            console.log('index2 not available');
            item.value[index1][index2] = [];
            item.value[index1][index2] = text;
          }
        } else {
          console.log('both index not available');
          item.value[index1] = [];
          item.value[index1][index2] = [];
          item.value[index1][index2] = text;
        }
      }
    });
    console.log(this.state.response_Data[7]);
  };

  /* Function that handles CHECKLIST control values */
  handleCheckList = (propsData, checkedValue, selectedOption) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id === propsData.id) {
        if (item.hasOwnProperty('value')) {
        } else {
          this.state.response_Data[index]['value'] = [];
        }

        if (selectedOption[0].isChecked == true) {
          this.state.response_Data[index].value.push(checkedValue);
        } else {
          const resultIndex = this.state.response_Data[index].value
            .map((e) => e.value)
            .indexOf(checkedValue.value);

          if (resultIndex != -1) {
            this.state.response_Data[index].value.splice(resultIndex, 1);
          }
        }
      } else {
        //console.log("else")
      }
    });
    console.log(this.state.response_Data[1]);
    //this.props.onDataChange(this.state.response_Data)
  };
  /* Function that handles MULTISELECT control values */
  handleMultiList = (propsData, checkedValue, selectedOption) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id === propsData.id) {
        if (item.hasOwnProperty('value')) {
        } else {
          this.state.response_Data[index]['value'] = [];
        }
        if (selectedOption[0].isChecked == true) {
          this.state.response_Data[index].value.push(checkedValue);
        } else {
          const resultIndex = this.state.response_Data[index].value
            .map((e) => e.value)
            .indexOf(checkedValue.value);

          if (resultIndex != -1) {
            this.state.response_Data[index].value.splice(resultIndex, 1);
          }
        }
      } else {
        //console.log("else")
      }
    });
    console.log(this.state.response_Data[5]);
  };

  /* Function that handles RATINSCALE control values */
  handleRatings = (propsData, value, comments) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id == propsData.id) {
        if (item.yesAdditional == true) {
          this.state.response_Data[index]['selectedRating'] = value;
          this.state.response_Data[index]['additionalComment'] = comments;
        } else {
          this.state.response_Data[index]['selectedRating'] = value;
        }
      }
    });
    console.log(this.state.response_Data[8]);
  };

  /* Function that handles notes control values */

  handleNotes = (propsData, notes) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id === propsData.id) {
        this.state.response_Data[index]['usernote'] = notes;
      } else {
        // console.log('else');
      }
    });
    console.log(this.state.response_Data[6]);
  };

  /* Function that handles SIMPLEQUESTION  control values */

  handleQuestionNotes = (propsData, notes) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id === propsData.id) {
        this.state.response_Data[index]['usernote'] = notes;
      } else {
        // console.log('else');
      }
    });
    console.log(this.state.response_Data[2]);
  };

  /* Function that handles SINGLECHOICE Parent control values */

  handleSingleChoice = (propsData, value) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id == propsData.id) {
        this.state.response_Data[index]['selectedOption'] = value;
        this.state.response_Data[index].childOption = '';
      }
    });
    console.log(this.state.response_Data[3]);
  };

  /* Function that handles SINGLECHOICE child control values */

  handleChildSingleChoice = (propsData, value) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id == propsData.id) {
        this.state.response_Data[index].childOption = value;
      }
    });
    console.log(this.state.response_Data[3]);
  };

  /* Function that handles YESNO control values */

  handleYesNo = (propsData, value, comments) => {
    this.state.response_Data.forEach((item, index) => {
      if (item.id == propsData.id) {
        this.state.response_Data[index]['selectedOption'] = value;
        if (
          comments != undefined &&
          (item.yesAdditional || item.noAdditional)
        ) {
          this.state.response_Data[index]['additionalComment'] = '';
          this.state.response_Data[index]['additionalComment'] = comments;
        }
      }
    });
    console.log(this.state.response_Data[4]);
  };

  /* Function that renders the control by mapping with the json result control type
     Sends the input as the current item and listen for the function which calls continously whenever an change occur in the control

  */
  renderFormData = () => {
    return this.state.inputdata.map((item) => {
      return (
        <View>
          {item.type == 'heading' ? <Heading {...item}></Heading> : null}
          {item.type == 'checkList' ? (
            <CheckList
              {...item}
              onCheckListChange={this.handleCheckList}></CheckList>
          ) : null}
          {item.type == 'simpleQuestion' ? (
            <SimpleQuestion
              {...item}
              onSimpleQuestionChange={
                this.handleQuestionNotes
              }></SimpleQuestion>
          ) : null}
          {item.type == 'singleChoice' ? (
            <SingleChoice
              {...item}
              onSingleChoiceChange={this.handleSingleChoice}
              onChildChoiceChange={this.handleChildSingleChoice}></SingleChoice>
          ) : null}
          {item.type == 'multiChoice' ? (
            <MultiChoice
              {...item}
              onMultiListChange={this.handleMultiList}></MultiChoice>
          ) : null}
          {item.type == 'ratingScale' ? (
            <RatingScale
              {...item}
              onRatingChange={this.handleRatings}></RatingScale>
          ) : null}
          {item.type == 'yesNo' ? (
            <YesNo {...item} onYesNoChange={this.handleYesNo}></YesNo>
          ) : null}
          {item.type == 'notes' ? (
            <Notes {...item} onNotesChange={this.handleNotes}></Notes>
          ) : null}
          {item.type == 'table' ? (
            <TableList
              {...item}
              onTableTextChange={this.handleTableNotes}></TableList>
          ) : null}
          {item.type == 'image' ? <Image {...item}></Image> : null}
        </View>
      );
    });
  };

  /*
    function which calls whenever data is submitted
    check for the validations
    if form matches every condition then submit the form to api else show error messages
  */

  submitData = () => {
    let simplequestion_valid,
      checklist_valid,
      singlechoice_valid,
      multichoice_valid = false;
    console.log(JSON.stringify(this.state.response_Data));

    this.state.response_Data.forEach(function (item, index) {
      if (item.type == 'simpleQuestion') {
        if (item.hasOwnProperty('usernote')) {
          simplequestion_valid = true;
          // alert('question answered');
        } else {
          simplequestion_valid = false;
          alert('pls answer the question');
        }
      }
      if (item.type == 'checkList') {
        var listOptions = item.customOption.split('<br/>');
        if (item.hasOwnProperty('value')) {
          if (listOptions.length == item.value.length) {
            checklist_valid = true;
            //alert('checkList answered');
          } else {
            checklist_valid = false;
            alert('please select all options in checkList');
          }
        } else {
          checklist_valid = false;
          alert('please select all options in checkList');
        }
      }

      if (item.type == 'singleChoice') {
        if (item.hasOwnProperty('selectedOption')) {
          singlechoice_valid = true;
          //  alert('radio answered');
        } else {
          singlechoice_valid = false;
          alert('Please Select Atleast One Option in the radio form');
        }
      }
      if (item.type == 'multiChoice') {
        if (item.hasOwnProperty('value') && item.value.length != 0) {
          multichoice_valid = true;
          //  alert('multichoice answered');
        } else {
          multichoice_valid = false;
          alert('Please Select Atleast One Option in the multiselect');
        }
      }
    });
    if (
      simplequestion_valid &&
      singlechoice_valid &&
      checklist_valid &&
      multichoice_valid == true
    ) {
      alert('form valid submit data');
    } else {
      alert('form invalid');
    }
    // console.log(this.state.response_Data);
  };
  componentDidMount = () => {
    // console.log(this.props);
    // this.state.inputdata =JSON.parse(this.props[0].TemplateBody);
    // console.log(this.state.inputdata)
    // this.state.response_Data=this.state.inputdata
    this.setState({callFunction: true});
  };
  render() {
    return (
      <ScrollView>
        {this.state.callFunction ? (
          <View style={{backgroundColor: 'white'}}>
            {this.renderFormData()}
          </View>
        ) : null}
        {this.state.callFunction ? (
          <Button
            style={{
              height: 35,
              width: 80,
              backgroundColor: APP_PRIMARY_COLOR,
              marginTop: 15,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              this.submitData();
            }}>
            <Text
              allowFontScaling={false}
              style={{color: 'white', fontSize: 15}}>
              Save
            </Text>
          </Button>
        ) : null}
      </ScrollView>
    );
  }
}
