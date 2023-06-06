import React, {Component} from 'react';
import {Text,TextInput} from 'react-native';
import {View} from 'native-base';

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state={
      notes_value:"",
      heighttext:0
    }
  }
  
  render() {
    return (
      <View style={{paddingTop:20}}>
        <Text style={{textAlign:'center'}}>{this.props.label}</Text>
        <TextInput
          allowFontScaling={false}
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
          placeholder="Enter Your Response Here"
          placeholderTextColor={'#2D323C'}
          
          onChangeText={(text) => this.props.onNotesChange(this.props,text)}
        />
      </View>
    );
  }
}

// const Styles={
//   input:{

//     padding:10,
//     height: 40,
//     backgroundColor:'#dcdcdc',
//     marginBottom: 10,
//     color:'#4F575C',
//     paddingHorizontal: 15
//     },
// }