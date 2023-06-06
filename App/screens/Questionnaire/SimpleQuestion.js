import React, {Component} from 'react';
import {Text, TextInput} from 'react-native';
import {View} from 'native-base';

export default class SimpleQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleQuestionAnswer: '',
      heighttext: 0,
    };
  }

  render() {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={{textAlign: 'center'}}>{this.props.value}</Text>
        <TextInput
          allowFontScaling={false}
          multiline={true}
          placeholder="Enter Your Response"
          placeholderTextColor={'#2D323C'}
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
            this.props.onSimpleQuestionChange(this.props, text)
          }
        />
      </View>
    );
  }
}

// const Styles = {
//   input: {
//     backgroundColor: '#FEFBFB',
//     height: 200,
//     textAlignVertical: 'top',
//     height: Math.max(35, this.state.heighttext),
//     borderColor: '#345D7E',
//     borderWidth: 1,
//     borderWidth: 1,
//     marginHorizontal: 10,
//   },
// };
