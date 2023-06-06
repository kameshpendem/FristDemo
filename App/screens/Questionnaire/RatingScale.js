import React, {Component} from 'react';
import {Text,TextInput} from 'react-native';
import {View} from 'native-base';
import {Rating} from 'react-native-ratings';

export default class RatingScale extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRating:"",
      showAdditional:false,
      ratingComments:"",
      heighttext:0
    }
  }

  onRatingPress = (rating) => {
   
    console.log('Rating is: ' + rating);
    if (rating >= 1) {
      this.setState({showAdditional: true});
    } else {
      this.setState({showAdditional: false});
    }
    this.setState({selectedRating: rating});
    this.props.onRatingChange(this.props,rating,this.state.ratingComments)
  };

  onRatingComments=(text)=>{
    console.log(text)
    this.setState({ratingComments:text})
    this.props.onRatingChange(this.props,this.state.selectedRating,text)
  }
  render() {
    return (
      <View style={{paddingTop:20}}>
        <Text style={{textAlign:'center'}}>{this.props.label}</Text>

        <Rating
          type="star"
          ratingCount={this.props.max}
          imageSize={30}
          startingValue={0}
          onFinishRating={this.onRatingPress} // ON SELECTION CALLING THE FUNCTION
        />
        {this.props.yesAdditional==true && this.state.showAdditional==true?(
          <TextInput
          allowFontScaling={false}
          placeholder="Can you please explain your rating"
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
          onChangeText={(text) =>{this.onRatingComments(text)}}
        />
        ):null}
      </View>
    );
  }
}
const Styles={
  input:{

    padding:10,
    height: 40,
    backgroundColor:'#dcdcdc',
    marginBottom: 10,
    color:'#4F575C',
    paddingHorizontal: 15
    },
}
