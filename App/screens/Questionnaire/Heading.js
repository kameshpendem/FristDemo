import React, {Component} from 'react';
import {Text} from 'react-native';
import {View} from 'native-base';

export default class Heading extends Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:10
      }}>
        <Text>{this.props.label}</Text>
        <Text>{this.props.subHeader}</Text>
      </View>
    );
  }
}
