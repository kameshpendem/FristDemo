import React, {Component} from 'react'
import {
    NativeModules,
    PermissionsAndroid,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    Alert,
    ToastAndroid,
    BackHandler
} from 'react-native'
// import {
//     mediaDevices,
//     RTCIceCandidate,
//     RTCPeerConnection,
//     RTCSessionDescription,
//     RTCView,
// } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import { Icon } from 'react-native-elements'
console.log("55678")
var SpiroReact = NativeModules.SpiroReact;
let connection=null;
let otherUsername = null;
let localStream;
let sendChannel;
let receiveChannel;
// import {getWebsocket} from '../../../../App/config/Config2';
//const ws = new WebSocket('wss://stun.concent.in/websocket')
function heartbeat() {
    clearTimeout(this.pingTimeout);
  
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
      this.terminate();
    }, 300000 + 1000);
  }
let ws=null
ws = new WebSocket('wss://stun.concent.in/websocket')
 console.log("fsssSWV",ws);
    ws.onopen = () => {
        console.log("gbadfsss");
    console.log('Connected to the signaling server')
}

ws.onerror = err => {
    console.log("error="+JSON.stringify(err))
    console.log(new Date()+"server disconnected")
//    ws = new WebSocket('wss://stun.concent.in/websocket') 
}
ws.onclose= function clear() {
    clearTimeout(this.pingTimeout);
    console.log(new Date()+"onclose call")
    console.log(ws)
    // ws = new WebSocket('wss://stun.concent.in/websocket')
  }

  ws.onping = (heartbeat) =>{
      console.log('ping')
  }
  const configuration = {
    iceServers: [{ url: 'stun:stun.concent.in:3478' },
    { url: 'turn:turn.concent.in:3478',
    username: "ajeistun",
    credential: "Christjune^123" },
    {
        url: 'stun:stun2.1.google.com:19302'
    }]
}
class Telemedicine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStatus       : '',
            micMode             : '',
            soundOutput         : '',
            videoMode           : '',
            videoEnabled        : true,
            streamURL           : null,
            remoteURL           : null,
            remote              : '',
            checkcallpressed    :false,
            userName            : global.doctor_id,
            remoteUserName      : this.props.screenProps.hlpid,
            ptpMsg              : '',
            recievedMsg         : '',
            intervalStatus      : ''
        }
    }

    async componentDidMount() {
        console.log("1234556789");
        console.log(SpiroReact);
        console.log("didmount",ws)
        const wsdata=ws
        if(ws==null||wsdata._subscriptions.length==0){
            console.log("11111");
            function heartbeat() {
                clearTimeout(this.pingTimeout);
                console.log(new Date()+"heartbeat")
                // Use `WebSocket#terminate()`, which immediately destroys the connection,
                // instead of `WebSocket#close()`, which waits for the close timer.
                // Delay should be equal to the interval at which your server
                // sends out pings plus a conservative assumption of the latency.
                this.pingTimeout = setTimeout(() => {
                  this.terminate();
                }, 300000 + 1000);
              }
            // let ws=null
            ws = new WebSocket('wss://stun.concent.in/websocket')
             console.log("fsssSWV",ws);
                ws.onopen = () => {
                    console.log("gbadfsss1");
                console.log('Connected to the signaling server')
            }
            
            ws.onerror = err => {
                console.log("error="+JSON.stringify(err))
                console.log(new Date()+"server disconnected")
            //    ws = new WebSocket('wss://stun.concent.in/websocket') 
            }
            ws.onclose= function clear() {
                clearTimeout(this.pingTimeout);
                console.log(new Date()+"onclose call")
                console.log(ws)
                // ws = new WebSocket('wss://stun.concent.in/websocket')
              }
            
              ws.onping = (heartbeat) =>{
                  console.log('ping')
              }
        }
        const configuration = {
            iceServers: [{ url: 'stun:stun.concent.in:3478' },
            { url: 'turn:turn.concent.in:3478',
            username: "ajeistun",
            credential: "Christjune^123" },
            {
                url: 'stun:stun2.1.google.com:19302'
            }]
        }
        // connection = new RTCPeerConnection(configuration);
        // sendChannel = connection.createDataChannel('sendDataChannel');
        this.logindoctor();
        this.logindoctor();
        // await this.loginPressed();
        // ws.onmessage = msg => {
        //     console.log('onMessage got called', msg.data)
        //     const data = JSON.parse(msg.data)
        //     data.type == 'login' &&  this.handleLogin(data.success,data.onlineusers)
        // }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    
    handleBackPress = () => {
        this.endCallPressed();  
    }
    logindoctor = async() =>{
        console.log("charitha",ws);
        const wsdata=ws
        if(ws==null||wsdata._subscriptions.length==0){
            console.log("11111");
            function heartbeat() {
                clearTimeout(this.pingTimeout);
                console.log(new Date()+"heartbeat")
                // Use `WebSocket#terminate()`, which immediately destroys the connection,
                // instead of `WebSocket#close()`, which waits for the close timer.
                // Delay should be equal to the interval at which your server
                // sends out pings plus a conservative assumption of the latency.
                this.pingTimeout = setTimeout(() => {
                  this.terminate();
                }, 300000 + 1000);
              }
            // let ws=null
            ws = new WebSocket('wss://stun.concent.in/websocket')
             console.log("fsssSWV",ws);
                ws.onopen = () => {
                    console.log("gbadfsss2");
                console.log('Connected to the signaling server')
            }
            
            ws.onerror = err => {
                console.log("error="+JSON.stringify(err))
                console.log(new Date()+"server disconnected")
            //    ws = new WebSocket('wss://stun.concent.in/websocket') 
            }
            ws.onclose= function clear() {
                clearTimeout(this.pingTimeout);
                console.log(new Date()+"onclose call")
                console.log(ws)
                // ws = new WebSocket('wss://stun.concent.in/websocket')
              }
            
              ws.onping = (heartbeat) =>{
                  console.log('ping')
              }
        }
        console.log(new Date()+"beforeloginpressed",ws)
        connection = new RTCPeerConnection(configuration);
        sendChannel = connection.createDataChannel('sendDataChannel');
        await this.loginPressed();
        ws.onmessage = msg => {
            console.log('onMessage got called', msg.data)
            const data = JSON.parse(msg.data)
            data.type == 'login' &&  this.handleLogin(data.success,data.onlineusers)
        }
    }
    componentDidUpdate() {
        console.log('CWU called')
        ws.onmessage = msg => {
            const data = JSON.parse(msg.data)    
            switch (data.type) {
                case 'offer':
                    this.handleOffer(data.offer, data.username)
                    console.log('Handle offer got data', data.offer, data.username)
                    break
                case 'answer':
                    console.log('Handle answer got data', data.answer)
                    this.handleAnswer(data.answer)
                    break
                case 'candidate':
                    this.handleCandidate(data.candidate)
                    break
                case 'close':
                    console.log('handle close block')
                    Alert.alert("Please click on Redial to connect with patient again")
                    localStream.getTracks().forEach(t => t.stop());
                    otherUsername = null
                    connection.close();
                    connection.onicecandidate = null
                    connection.onaddstream = null
                    
                    this.setState({remote: null})
                    this.setState({streamURL: null})
                    this.setState({remoteURL: null})
                    this.setState({checkcallpressed:"false1"})
                    console.log('Remote : '+this.state.remote+' Stream URL : '+this.state.streamURL+' Remote URL : '+this.state.remoteURL)
                    //this.props.screenProps.rootNavigation.goBack();
                    // Alert.alert(
                    //     'Your call has been ended',
                    //     'Help us to improve by rating the application',
                    //     [
                    //         {   text: 'Okay'  },
                    //         {   text: 'Rate now!'  },
                            
                    //     ]
                    // )
                    this.logindoctor();
                    break
                default:
                    break
            }
        }
    }
    
    loginPressed = () => {
        console.log("loginpressed",ws)
        console.log('Username : '+this.state.userName);
        (this.state.userName).length < 0 && alert('Please enter a username 🙂')
        console.log('Username : '+this.state.userName);
        this.sendMessage({type: 'login', username: this.state.userName})
    }

    handleLogin = async (success,onlineusers)  => {
        console.log("asdfgh")
        let isFront = true;
        mediaDevices.enumerateDevices()
            .then(sourceInfos => {
                console.log('source info'+sourceInfos);
                let videoSourceId;
                for (let i = 0; i < sourceInfos.length; i++) {
                    console.log("front end 1234")
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront
                        ? "front"
                        : "back")) {
                            console.log("front end 3456");
                        videoSourceId = sourceInfo.id;
                    }
                }
                console.log("aaaaa");
                mediaDevices.getUserMedia({
                    audio: { noiseSuppression: true },
                    video: {
                        mandatory: {
                            minWidth: 200,
                            minHeight: 300,
                            minFrameRate: 60
                            },
                        facingMode: (isFront
                            ? "user"
                            : "environment"),
                        optional: (videoSourceId
                            ? [{ sourceId: videoSourceId }]
                            : [])
                    }
                }).then(stream => {
                    console.log("bbbbb");
                    this.firstActions()

                    localStream = stream;

                    this.setState({ streamURL: stream.toURL() });

                    connection.addStream(stream)
                                            
                    connection.onaddstream = event => {
                        this.setState({ remoteURL: event.stream.toURL()})
                    }

                    connection.onicecandidate = event => {
                        if (event.candidate) {
                            this.sendMessage({type: 'candidate', candidate: event.candidate})
                        }
                    }

                    connection.ondatachannel = event => {
                        console.log('Receive Channel Callback');
                        receiveChannel = event.channel;
                        receiveChannel.onmessage = this.onReceiveMessageCallback;
                    }
                   // this.callPressed();
                    console.log('call back executed');

                }).catch(error => {
                    console.log(error);
                });
            });
    }

    firstActions = () => {
        this.setState({micMode      : 'unmute'})
        this.setState({soundOutput  : 'speaker'})
        this.setState({videoMode    : 'on'})
        
        //this.TurnOnBT();
    }

    callPressed = () => {
        const callToUsername = this.state.remoteUserName;
        this.setState({checkcallpressed:true})
        if (callToUsername.length === 0) {
            alert('Enter a username 😉')
            return
        }

        otherUsername = callToUsername
        try {
        connection.createOffer()
            .then(offer => {
                this.sendMessage({type: 'offer', offer: offer})
                connection.setLocalDescription(offer)
            });
        }catch(e) {
            Alert.alert("Please disconnect call and Redial to connect with patient again")
            
          }

    }

    endCallPressed = () => {
        console.log(new Date()+"onclose")
        Alert.alert("Please click on Redial to connect with patient again")
        this.sendMessage({type: 'close'});
        localStream&&localStream.getTracks()&&localStream.getTracks().forEach(t => t.stop());
        otherUsername = null
        connection.close();
        connection.onicecandidate = null
        connection.onaddstream = null
        
        this.setState({remote: null})
        this.setState({streamURL: null})
        this.setState({remoteURL: null})
        this.setState({checkcallpressed:"false1"})
        console.log('Remote : '+this.state.remote+' Stream URL : '+this.state.streamURL+' Remote URL : '+this.state.remoteURL)
        // Alert.alert(
        //     'Your call has been ended',
        //     'Help us to improve by rating the application',
        //     [
        //         {   text: 'Okay'  },
        //         {   text: 'Rate now!'  },
                
        //     ]
        // )
        this.logindoctor();
    }

    sendPressed = () => {
        const data = this.state.ptpMsg;
        sendChannel.send(data);
        this.state.ptpMsg != '' && clearInterval(this.state.intervalStatus);
        this.setState({ptpMsg : ''})
        console.log('Sent Data : ' + data);
        
    }

    sendMessage = message => {
        if (otherUsername) {
            message.otherUsername = otherUsername
        }
        console.log("sendmessagetele",ws)
        // ws = new WebSocket('wss://stun.concent.in/websocket')
        console.log("1234567890")
        ws.send(JSON.stringify(message))
        console.log(JSON.stringify(message))
        console.log('sendMessage Called');
    }

    handleOffer = (offer, username) => {
        otherUsername = username
        connection.setRemoteDescription(new RTCSessionDescription(offer))
        connection.createAnswer()
            .then(answer => {
                InCallManager.startRingtone('_DEFAULT_');
                Alert.alert(
                    'Alert!!',
                    'You have got a call',
                    [
                      {text: 'Answer', onPress: () => this.answerCall(answer)},
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress:()=>this.hangupCall()
                      },
                    ],
                  );
                

            }, error => {
                alert('Error when creating an answer')
                console.log(error)
            })
    }

    answerCall = answer => {
        connection.setLocalDescription(answer)
        InCallManager.stopRingtone();
        InCallManager.start({media: 'video'});

        this.sendMessage({type: 'answer', answer: answer})
        console.log('handleOffer Called');
    }

    hangupCall = () =>{
        InCallManager.stopRingtone();
        InCallManager.stop();
        this.endCallPressed();
    }

    handleAnswer = answer => {
        connection.setRemoteDescription(new RTCSessionDescription(answer))
    }

    handleCandidate = candidate => {
        connection.addIceCandidate(new RTCIceCandidate(candidate))
    }

    receiveChannelCallback = event => {
        console.log('Receive Channel Callback');
        receiveChannel = event.channel;
        receiveChannel.onmessage = this.onReceiveMessageCallback;
    }

    onReceiveMessageCallback = event => {
        console.log('Received Message'+event.data);
        switch (event.data) {
            case 'b':
                this.getBp()
                break;
            case 'p':
                this.getPulse()
                break;
            case 's':
                this.getSpiro()
                break;
            case 'm':
                this.getTemp()
                break;
            default:
                break;
        }
    }
    

    //Turns On Bluetooth
    async TurnOnBT() {
        SpiroReact.TurnBT((err) => {
            console.log(err)
        }, (msg) => {
            console.log(msg)
        });
    }
    //BP machine starts
    getBp = async() => {
        console.log('BP Called');
        ToastAndroid.showWithGravityAndOffset(
            'Blood Pressure is being measured and will be shared with the Doctor. Please do not turn off the Blood Pressure monitoring devices.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            30,
            50,
          );
        await SpiroReact.startBp((err) => {
            console.log(err)
        }, (msg) => {
            let bp = msg.split(" ");
            this.setState({ptpMsg: bp.toString()})
        });
        deviceInterval = setInterval(() => {this.sendPressed()}, 2000);
        this.setState({intervalStatus: deviceInterval})
    }
    //BP machine ends Pulse starts
    getPulse = async() => {
        console.log('Pulse Called');
        ToastAndroid.showWithGravityAndOffset(
            'Pulse is being measured and will be shared with the Doctor. Please do not turn off the Pulseoximeter.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            30,
            50,
          );
        await SpiroReact.startSpo2((err) => {
            console.log(err)
        }, (msg) => {
            let pulse = msg.split(" ");
            this.setState({ptpMsg: pulse.toString()})
        });
        deviceInterval = setInterval(() => {this.sendPressed()}, 2000);
        this.setState({intervalStatus: deviceInterval})
    }
    // Pulse Ends Spiro starts
    getSpiro = async() => {
        console.log('Spiro Called');
        ToastAndroid.showWithGravityAndOffset(
            'PEFR is being measured and will be shared with the Doctor. Please do not turn off the Spirometer.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            30,
            50,
          );
        await SpiroReact.startSpiro((err) => {
            console.log(err)
        }, (msg) => {
            this.setState({ptpMsg: msg.toString()})
        });
        deviceInterval = setInterval(() => {this.sendPressed()}, 2000);
        this.setState({intervalStatus: deviceInterval})
    }
    // Spiro ends Thermometer starts
    getTemp = async() => {
        console.log('Temprature called')
        ToastAndroid.showWithGravityAndOffset(
            'Temperature is being measured and will be shared with the Doctor. Please do not turn off the Thermometer.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            30,
            50,
          );
        await SpiroReact.startTemp((err) => {
            console.log(err)
        }, (msg) => {
            //let temp = (msg * 9 / 5) + 32;
            this.setState({ptpMsg: msg.toString()})
        });
        deviceInterval = setInterval(() => {this.sendPressed()}, 2000);
        this.setState({intervalStatus: deviceInterval})
    }
    // Thermometer ends

    //UI button actions 

    toggleCamera = () => {
        localStream.getVideoTracks().forEach(track => { track._switchCamera(); });
    }

    /*toggleMute = () => {
        this.state.videoEnabled = !this.state.videoEnabled;
        InCallManager.setMicrophoneMute(this.state.videoEnabled)
    }

        toggleVideocam = () => {
            this.state.videoEnabled = !this.state.videoEnabled;
            localStream.getVideoTracks().forEach(VideoTrack => {VideoTrack.enabled(this.state.videoEnabled)});
    }*/

    render() {
        const {buttonContainer, rtcView, rtcRemoteView} = styles;

        return (
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View> 
                    <RTCView 
                    
                        mirror={true}                         
                        objectFit = 'cover'
                        streamURL={this.state.remoteURL} 
                        style={rtcRemoteView}
                    /> 
                    <RTCView
                        mirror={true}
                        style={rtcView}
                        streamURL={this.state.streamURL != undefined
                        ? this.state.streamURL
                        : null} 
                    />
                </View>
                <View style={buttonContainer}>
                 {this.state.checkcallpressed==false ?( <View>
               {/* <TextInput
                autoCapitalize='characters'
                            style={{borderColor:'#000000', borderWidth: 1, borderRadius:8,backgroundColor:"white"}}
                            placeholder='Enter Remote Username'
                            value={this.state.remoteUserName}
                            onChangeText={(text) => this.setState({remoteUserName: text})}/> */}
             <TouchableOpacity onPress={() => this.callPressed()}>
                            <Text style={[styles.buttonStyle,{backgroundColor: '#228B22', color: '#ffffff',width:100}]}>Call Patient</Text>
                        </TouchableOpacity>
                        </View>):this.state.checkcallpressed=="false1"?( <View>
               {/* <TextInput
                autoCapitalize='characters'
                            style={{borderColor:'#000000', borderWidth: 1, borderRadius:8,backgroundColor:"white"}}
                            placeholder='Enter Remote Username'
                            value={this.state.remoteUserName}
                            onChangeText={(text) => this.setState({remoteUserName: text})}/> */}
             <TouchableOpacity onPress={() => this.callPressed()}>
                            <Text style={[styles.buttonStyle,{backgroundColor: '#228B22', color: '#ffffff',width:100}]}>Redial Patient</Text>
                        </TouchableOpacity>
                        </View>)
                        :
                        <View>
                            {/* <Icon
                        reverse
                        name='ios-reverse-camera'
                        type='ionicon'
                        size={30}
                        color='#345D7E'
                        onPress={() => this.toggleCamera()}/>  */}
                        <TouchableOpacity onPress={() =>{this.endCallPressed();}}>
                            {/* // this.props.screenProps.rootNavigation.goBack();}}> */}
                        <Icon
                        reverse
                        name='ios-close'
                        type='ionicon'
                        size={30}
                        color='#ff0000'
                        
                    />
                    </TouchableOpacity>
                        </View>
                }
                    {/*<Icon
                        reverse
                        name='ios-mic-off'
                        type='ionicon'
                        size={30}
                        color='#345D7E'
                        onPress = {() => this.toggleMute()}
                    />*/}
                    {/*<Icon
                        reverse
                        name='ios-volume-high'
                        type='ionicon'
                        size={30}
                        color='#345D7E'
                        onPress = {() => this.toggleSoundOutput()}
                    />
                    <Icon
                        reverse
                        name='ios-videocam'
                        type='ionicon'
                        size={30}
                        color='#345D7E'
                        onPress = {() => this.toggleVideocam()}
                    />*/}
                </View>
            </ScrollView>
        )
    }
}
export  default Telemedicine;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = {
    buttonContainer: {
        flexDirection: 'row',
        position: "absolute",
        justifyContent: 'center',
        alignSelf : 'center',
        bottom: 40,
        alignItems: 'center'
    },
    buttonStyle: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        padding: 10,
        borderRadius: 10
    },

    rtcRemoteView: {
        height : windowHeight - 8,
        width: windowWidth
    },
    rtcView: {
        position: "absolute",
        top: 0,
        right: 10,
        width:120,
        height: 180
    }
};  