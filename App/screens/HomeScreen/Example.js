 import React, { Component } from 'react';
 import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
 
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera as Camera } from 'react-native-camera';
//  import { connect } from 'react-redux';
//  import {getPostList} from '../../redux/actions/post_action'

 class Example extends Component {
  static navigationOptions = {
    headerShown: false
};
   constructor(props) {
     super(props);
     this.state = {
      hlp:"INDAAA000564",
      password:"vAJ@2709"
     };
   }
 
  //  componentDidMount=async()=>{

  //  await this.props.getPostList(this.state)
  //  alert(JSON.stringify(this.props.postList))
  //  }
  onSuccess = (e) => {
    // Linking
      // .openURL(e.data)
      // .catch(err => console.error('An error occured', err));
     // alert(e.data)
      this.props.navigation.navigate('Consult')
  //     if(e.data!=null||e.data!=""){
  //     this.props.navigation.navigate('Homescreen')
  // }
  }
  
   render() {
     return (
      //  <View>
      //    <Text> Example </Text>
      //  </View>
      <QRCodeScanner
      onRead={this.onSuccess}
       flashMode={Camera.Constants.FlashMode.torch} 
       showMarker={true}     
      // topContent={
      //   <Text allowFontScaling={false}style={styles.centerText}>
      //     Go to <Text allowFontScaling={false}style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
      //   </Text>
      // }
      // bottomContent={
      //   <TouchableOpacity style={styles.buttonTouchable}>
      //     <Text allowFontScaling={false}style={styles.buttonText}>OK. Got it!</Text>
      //   </TouchableOpacity>
      // }
    />
     );
   }
 }
//  const mapStateToProps=(stat)=>{
//   return {
//     getPeople:()=>dispatch(actions.getPostList())
//   }
// }
// const mapStateToProps = state => ({
//  postList: state.postList.postList,
// });

// const mapDispatchToProps = dispatch => ({
//   getPostList:(list)=>dispatch(actions.getPostList(list)),
// });
//  getPeople:()=>dispatch(actions.fetchPeopleFromAPI()
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
 export default Example;
// export default connect(mapStateToProps,{getPostList})(Example)

 
 