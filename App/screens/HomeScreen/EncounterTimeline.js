import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  //ListView,
  ActivityIndicator,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import HTMLView from 'react-native-htmlview';
import RNFetchBlob from 'rn-fetch-blob';
import {getPresecList} from '../../redux/actions/presec_action';
import Autocomplete from 'react-native-autocomplete-input';
import {
  Thumbnail,
  Row,
  Col,
  Header,
  Left,
  Right,
  Title,
  Container,
  Content,
  Body,
  Input,
  Item,
  Label,
  DatePicker,
} from 'native-base';
import {Button, Icon, Overlay, SearchBar} from 'react-native-elements';
import moment from 'moment';
import RNImageToPdf from 'react-native-image-to-pdf';

import AsyncStorage from '@react-native-community/async-storage';
import {getTimeList} from '../../redux/actions/timeline_action';
// import Loading from 'react-native-whc-loading';
// import ImageResizer from 'react-native-image-resizer';

// import FlashMessage, {showMessage} from "react-native-flash-message";
import ImageResizer from 'react-native-image-resizer';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import FileSelector from '../../components/fileselector/FileSelector';
import getBaseUrl, {getApiUrl} from '../../config/Config';
import i18n from '../../../i18n';
let path1;
let uri1;
class EncounterTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      mulImg: [],
      hdata: {},
      timeline: [],
      visible1: false,
      refreshing: false,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount = async () => {
    this.setState({isLoading: true});
    await this.getData();
    this.setState({isLoading: false});
  };
  getData = async () => {
    let obdaata2 = JSON.stringify({
      hlp: this.props.screenProps.hlpid,
      token: global.token,
      docid: global.doctor_id,
    });
    await this.props.getTimeList(obdaata2);
    let newdata = await this.getTimeline();
    this.setState({
      timeline: this.props.timelineList.message,
      isLoading: false,
    });
  };
  getTimeline = async () => {
    // this.setState({
    //   total_response:response
    // })
    // alert(JSON.stringify(this.props.timelineList.message)+" "+this.props.screenProps.enc_id)
    //sconsole.log("newdta="+JSON.stringify(this.props.timelineList.message))
    let newdata = this.props.timelineList.message.filter((item) => {
      if (item.encounterCode != undefined) {
        //  console.log(item.encounterCode+"=="+this.props.screenProps.enc_id)
        return item.encounterCode == this.props.screenProps.enc_id;
      }
    });
    return newdata;
  };
  gen_presec = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let obs = {
      docid: global.doctor_id,
      hlp: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      doc_name: docname,
      token: global.token,
    };
    await this.props.getPresecList(obs);
    // alert("hi"+this.props.presecList.message)
    if (this.props.presecList.message.trim() == 'Please Save Vitals') {
      alert('Please Save Vitals');
      this.setState({page: 0, tabs: this.state.tabsdata});
    } else {
      this.props.screenProps.rootNavigation.navigate('ViewPdf2', {
        link: this.props.presecList.message,
        branch_id:
          this.props.screenProps.enc_id.split('-')[0] +
          '-' +
          this.props.screenProps.enc_id.split('-')[1],
        branch_name: this.props.screenProps.hspname,
        profile_pic:
          this.props.screenProps.profile_pic != ''
            ? this.props.screenProps.profile_pic
            : '',
      });
    }
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file) {
    const filePath = file.path;
    ImageResizer.createResizedImage(filePath, 800, 650, 'JPEG', 50, 0)
      .then(({path}) => {
        this.setState({path});
        path1 = path;
        let source;
        source = {path: path1};
        if (path1.split('.')[1] == 'pdf') {
          url == 'lab_presc/'
            ? (filename =
                this.UPLOAD_ENCOUNTER_ID + '_Lab_' + this.UPLOAD_ID + '.pdf')
            : (filename =
                this.UPLOAD_ENCOUNTER_ID +
                '_imaging_' +
                this.UPLOAD_ID +
                '.pdf');
          this.uploadPdf(
            this.UPLOAD_ENCOUNTER_ID,
            this.UPLOAD_ID,
            this.UPLOAD_URL,
            source.path,
            filename,
          );
        } else {
          this.state.mulImg.push(path1);
          this.setState({mulImg: this.state.mulImg});
          setTimeout(() => {
            this.checkConvert(
              this.UPLOAD_ENCOUNTER_ID,
              this.UPLOAD_ID,
              this.UPLOAD_URL,
            );
          }, 250);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  setImage = (encounterid, id, url) => {
    //  const options = {
    //      title: 'Select Image',
    //      storageOptions: {
    //        skipBackup: true,
    //        path: 'images',
    //      },
    //    };
    this.UPLOAD_ENCOUNTER_ID = encounterid;
    this.UPLOAD_ID = id;
    this.UPLOAD_URL = url;
    this.fileSelRef.current.openPicker();

    //  ImagePicker.showImagePicker(options, (response) => {
    //    console.log('Response = ', response);
    //    if(Platform.OS==='android'){
    //    const { error, path, originalRotation } = response
    //    if ( path && !error ) {
    //      let rotation = 0

    //      if ( originalRotation === 90 ) {
    //        rotation = 360
    //      } else if ( originalRotation === 270 ) {
    //        rotation = 360
    //      }

    //      ImageResizer.createResizedImage( path, 800, 650, "JPEG", 50, rotation ).
    //        then( ( { path } ) => {
    //          this.setState( { path } )
    //          path1=path
    //          console.log("path",path)
    //          if (response.didCancel) {
    //           console.log('User cancelled image picker');
    //         } else if (response.error) {
    //           console.log('ImagePicker Error: ', response.error);
    //         } else {
    //           let source;
    //             console.log("123")
    //             source = { path: path1 };
    //             console.log(source.path)
    //           console.log("Achu",source.path);
    //           if(path1.split(".")[1]=="pdf"){
    //             url=="lab_presc/"?filename=encounterid+"_Lab_"+id+".pdf":filename=encounterid+"_imaging_"+id+".pdf";
    //             this.uploadPdf(encounterid,id,url,source.path,filename)
    //                }
    //           else{
    //             console.log("else")
    //             this.state.mulImg.push(path1);
    //             console.log("else1")
    //           this.setState({mulImg:this.state.mulImg});
    //         //   this.convertPDF(source.path);
    //         this.checkConvert(encounterid,id,url);
    //        }

    //         }
    //        } ).catch( err => {
    //          console.log("err", err )

    //         //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
    //        } )
    //    } else if ( error ) {
    //      console.log( "The photo picker errored. Check ImagePicker.launchCamera func" )
    //      console.log( error )
    //    }
    //   }
    //   if(Platform.OS==='ios'){
    //     source={path:response.uri.replace('file://','')}
    //   // const source = { path: response.path };
    //   //  console.log(source);
    //    this.state.ImageSource = source.path;
    //    if(this.state.ImageSource.split(".")[1]=="pdf"){
    //     let filename;
    //     url=="lab_presc/"?filename=encounterid+"_Lab_"+id+".pdf":filename=encounterid+"_imaging_"+id+".pdf";
    //      this.uploadPdf(encounterid,id,url,source.path,filename)
    //    }else{
    //      console.log("called", source.path)
    //      this.state.mulImg.push(source.path);
    //      console.log("called2", JSON.stringify(this.state.mulImg));
    //     this.setState({mulImg:this.state.mulImg});
    //     this.checkConvert(encounterid,id,url);
    //  }
    // }
    //  });
  };
  checkConvert = (encounterid, id, url) => {
    Alert.alert(
      i18n.t('PLAN.PRESCRIPTION_ADDED'),
      i18n.t('PATIENTS.ADD_MORE'),
      [
        {text: i18n.t('COMMON.YES'), onPress: () => this.setImage(encounterid, id, url)},
        {text: i18n.t('COMMON.NO'), onPress: () => this.convertPDF(encounterid, id, url)},
      ],
      {cancelable: false},
    );
  };

  convertPDF = async (encounterid, id, url) => {
    //  this.refs.loading.show();
    this.setState({isLoading: true});
    console.log('imgpaath', JSON.stringify(this.state.mulImg));
    let filename;
    url == 'lab_presc/'
      ? (filename = encounterid + '_Lab_' + id + '.pdf')
      : (filename = encounterid + '_imaging_' + id + '.pdf');
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: filename,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };
      console.log(options);
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      console.log(pdf.filePath);
      this.setState({mulImg: []});
      this.uploadPdf(encounterid, id, url, pdf.filePath, filename);
    } catch (e) {
      console.log(e);
    }
  };

  uploadPdf = async (encounterid, id, urldata, path, pdfname) => {
    // let url = base_url + "immun_img_upload"
    let url = getBaseUrl() + urldata;
    let pt = [
      {
        name: urldata == 'lab_presc/' ? 'lab' : 'img',
        filename: pdfname,
        type: 'application/pdf',
        data: RNFetchBlob.wrap(path),
      },
      {
        name: 'encounter_id',
        data: encounterid.toString(),
      },
      urldata == 'lab_presc/'
        ? {
            name: 'lab_id',
            data: id.toString(),
          }
        : {
            name: 'img_id',
            data: id.toString(),
          },
    ];
    //
    console.log(url + ' ' + url + ' ' + urldata + ' ' + JSON.stringify(pt));
    RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'application/pdf',
      },
      pt,
    )
      .then((response) => response.json())
      .then(async (resp) => {
        this.setState({isLoading: false});
        //
        if (resp.message == 'File Added Successfully') {
          //
          alert(resp.message);
          this.getData();
        } else {
          //    this.refs.loading.close();
          //    this.timelineAlert.showMessage({
          //      message: "Upload Failed",
          //      description: "Please try again.",
          //      type: "danger",
          //      icon: "auto"
          //  });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  closeOverlay1 = () => {
    this.setState({visible1: false});
  };
  openOverlay = () => {
    //alert("res="+this.props.screenPropss.responsedata);

    // let practice=this.state.doctors.pract_details.filter(item=> item.branch_id === this.state.branch_id);
    // let resp=this.props.screenPropss.responsedata.filter(item=>item.id===id);
    //   alert(JSON.stringify(resp));
    // alert(JSON.stringify(this.state.total_response))
    this.setState({
      visible1: true,
    });
    // alert(JSON.stringify(this.state.resp))
  };
  uploadImage = async (encounterid, id, urldata, path) => {
    let url = getBaseUrl() + urldata;
    let imagename;
    urldata == 'lab_presc/'
      ? (imagename = encounterid + '_Lab_' + id + '.jpg')
      : (imagename = encounterid + '_imaging_' + id + '.jpg');
    pt = [
      {
        name: urldata == 'lab_presc/' ? 'lab' : 'img',
        filename: imagename,
        type: 'image/jpg',
        data: RNFetchBlob.wrap(path),
      },
      {
        name: 'encounter_id',
        data: encounterid.toString(),
      },
      urldata == 'lab_presc/'
        ? {
            name: 'lab_id',
            data: id.toString(),
          }
        : {
            name: 'img_id',
            data: id.toString(),
          },
    ];

    RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      pt,
    )
      .then((response) => response.json())
      .then((resp) => {
        if (resp.message == 'File Added Successfully') {
          this.timelineAlert.showMessage({
            message: 'success',
            description:i18n.t('PLAN.PRESCRIPTION_ADDED'),
            type: 'success',
            icon: 'auto',
          });
          this.refs.loading.close();
          this.getTimeline();
        } else {
          this.refs.loading.close();
          this.timelineAlert.showMessage({
            message: 'File upload failed',
            description: 'File not upload',
            type: 'danger',
            icon: 'auto',
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  closeOverlay = () => {
    this.setState({visible: false});
    //  this.props.navigation.navigate('MenuItems')
  };
  showPdf = (pdflink) => {
    console.log('link=' + pdflink);
    this.props.screenProps.rootNavigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };
  showPdf1 = (pdflink) => {
    //alert(pdflink)
    this.setState({
      visible1: false,
    });
    this.props.screenProps.rootNavigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };

  getRecieptName = (name) => {
    var recName = name;
    var srec = recName.split('-')[4];
    var frec = srec.split('.')[0];
    return frec;
  };

  toggleImageModal = (img) => {
    if (img == '') {
      alert('no image found');
    } else {
      let uri = img != '' && getApiUrl() + '/' + img.trim();
      this.props.screenProps.rootNavigation.navigate('ViewImage', {
        link: uri.toString(),
        screenname: 'EncounterTimeline',
      });
    }
  };
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then((item) => {
      console.log('res=' + JSON.stringify(item));
      this.setState({hdata: item[0], refreshing: false});
    });
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    let item = this.state.hdata;
    item.non != undefined && console.log('item=' + JSON.stringify(item.non[0]));
    if (this.state.visible1) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1>
            <FileSelector
              ref={this.fileSelRef}
              onSelection={this.handleSelection}
              selectAny
            />
            {/* <Button
                  title="X"
                  onPress={() => this.closeOverlay1()}
                  containerStyle={{alignSelf:'center'}}
                  buttonStyle={{backgroundColor:APP_PRIMARY_COLOR,marginTop:20,marginLeft:190}}
                />   */}
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}

            <ScrollView>
              <View>
                <Text
                  allowFontScaling={false}
                  allowFontScaling={false}
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 20,
                  }}>
                  Receipts
                </Text>
                {item.reclink.map((item) => (
                  <Row style={{marginTop: 15, marginLeft: 15}}>
                    <Col size={35}>
                      <Text allowFontScaling={false} allowFontScaling={false}>
                        {this.getRecieptName(item)}{' '}
                      </Text>
                    </Col>
                    <Col size={65} style={{marginTop: -15}}>
                      <TouchableOpacity onPress={() => this.showPdf1(item)}>
                        <Icon
                          reverse
                          raised
                          color="#517fa4"
                          size={15}
                          name="file-text-o"
                          type="font-awesome"
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                ))}
              </View>
            </ScrollView>
            <Button
              title="Close"
              onPress={() => this.closeOverlay1()}
              containerStyle={{alignSelf: 'center'}}
              buttonStyle={{backgroundColor: APP_PRIMARY_COLOR}}
            />
            {/* <Text allowFontScaling={false}style={{alignSelf:'center', fontSize:14, fontWeight:'600'}}>No Record found</Text> */}
          </Overlay>
        </View>
      );
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {/* <Header style={{backgroundColor:"white",height:100}}>
        <StatusBar backgroundColor={APP_PRIMARY_COLOR} barStyle={"dark-content"}/>
        
        <Row>
          <Col>
          <Row>
            <Col size={10} style={{marginLeft:-15}}>
            <TouchableOpacity>
            <Thumbnail square source={require("../../assets/images/ic_launcher.png")} />
            </TouchableOpacity>
            </Col>
            <Col size={65} style={{marginLeft:20}}>
                            <Text allowFontScaling={false}style={{marginTop:15,marginLeft:20,fontSize:15,alignSelf:"center", textTransform: 'capitalize'}}>{this.props.screenProps.hspname}</Text>
            </Col>
            
            <Col size={25}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Settings')}>
            <Thumbnail  style={{borderRadius: 63,borderWidth: 1,borderColor: "black",marginTop:10,alignSelf:"center"}} small source={this.props.screenProps.profile_pic!=null&&this.props.screenProps.profile_pic!=""?this.props.screenProps.profile_pic:require("../../assets/images/doc.jpg")} />
         </TouchableOpacity>
            </Col>
        </Row>
        <Row style={{backgroundColor:"#e4e4e4",marginHorizontal:-10}}>
                <Col size={75} style={{marginVertical:15}}>
                <Text allowFontScaling={false}style={{fontSize:12,marginLeft:5,textTransform:"capitalize"}}>{
                this.props.screenProps.name+" | "+
                this.props.screenProps.gender+" | "+
                this.props.screenProps.age
                +" | "}{
                  this.props.screenProps.blood=="O pos"?"O +ve":
                  this.props.screenProps.blood=="O neg"?"O -ve":
                  this.props.screenProps.blood=="A pos"?"A +ve":
                  this.props.screenProps.blood=="A neg"?"A -ve":
                  this.props.screenProps.blood=="B pos"?"B +ve":
                  this.props.screenProps.blood=="B neg"?"B -ve":
                  this.props.screenProps.blood=="AB pos"?"AB +ve":
                  this.props.screenProps.blood=="AB neg"?"AB -ve":
                  this.props.screenProps.blood=="OH"?"OH":
                  this.props.screenProps.blood=="NOT KNOWN"&&"NOT KNOWN"
                }</Text>
                </Col>
                <Col size={12}>
      
                <TouchableOpacity onPress={()=>this.gen_presec()}><Thumbnail style={{height:25,width:25,marginTop:15}} square source={require("../../assets/images/pre.png")} /></TouchableOpacity>
                </Col>
                <Col size={12} >
                <TouchableOpacity style={{marginTop:15,marginLeft:-40,color:"#949494"}}>
                  
                  <Icon   name='times' type='font-awesome' style={{fontSize:20,}} />
                </TouchableOpacity>
                </Col>
              </Row>
          </Col>
        </Row>
        </Header> */}
        <View>
          <FlatList
            keyExtractor={(item) => item.encounterCode}
            data={this.state.timeline}
            renderItem={({item}) => {
              if (
                item.TYPE == 'op' ||
                item.TYPE == 'service' ||
                item.TYPE == 'op-personal'
              ) {
                if (item.uid != null) {
                  let p2 = item.uid.split('.');
                  let p = moment(p2[1]).format('YYYY-MMM-DD').split('-');

                  return (
                    <View style={styles.card}>
                      <View style={styles.eventDate}>
                        <Text allowFontScaling={false} style={styles.eventDay}>
                          {p[2]}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.eventMonth}>
                          {p[1]}
                        </Text>
                        <Text allowFontScaling={false} style={styles.eventYear}>
                          {p[0]}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.screenProps.rootNavigation.navigate(
                            'EncounterTimelineDetails',
                            {
                              rootNavigation:
                                this.props.screenProps.rootNavigation,
                              encData: JSON.stringify(item),
                              Id: item.id,
                              hlpid: this.props.screenProps.hlpid,
                              name: this.props.screenProps.name,
                              gender: this.props.screenProps.gender,
                              age: this.props.screenProps.age,
                              blood: this.props.screenProps.blood,
                              hspname: this.props.screenProps.hspname,
                              profile_pic:
                                this.props.screenProps.profile_pic != '' &&
                                this.props.screenProps.profile_pic,
                              responsedata: JSON.stringify(this.state.timeline),
                            },
                          )
                        }>
                        <View style={styles.eventContent}>
                          <Text
                            allowFontScaling={false}
                            style={styles.doctorName}>
                            {item['non'][0]
                              ? item['non'][0]['middle_name'] != ''
                                ? item['non'][0]['salutation'].replace(
                                    /^./,
                                    item['non'][0][
                                      'salutation'
                                    ][0].toUpperCase(),
                                  ) +
                                  '. ' +
                                  item['non'][0]['first_name'].replace(
                                    /^./,
                                    item['non'][0][
                                      'first_name'
                                    ][0].toUpperCase(),
                                  ) +
                                  ' ' +
                                  item['non'][0]['middle_name'] +
                                  ' ' +
                                  item['non'][0]['last_name']
                                : item['non'][0]['salutation'].replace(
                                    /^./,
                                    item['non'][0][
                                      'salutation'
                                    ][0].toUpperCase(),
                                  ) +
                                  '. ' +
                                  item['non'][0]['first_name'].replace(
                                    /^./,
                                    item['non'][0][
                                      'first_name'
                                    ][0].toUpperCase(),
                                  ) +
                                  ' ' +
                                  item['non'][0]['last_name']
                              : null}
                          </Text>
                          <Text allowFontScaling={false} style={styles.places}>
                            <Text
                              allowFontScaling={false}
                              style={{fontWeight: '500'}}>
                             {i18n.t('PATIENTS.HOSPITAL')}:{' '}
                            </Text>{' '}
                            {item['practice_name'].replace(
                              /^./,
                              item['practice_name'][0].toUpperCase(),
                            )}
                          </Text>
                          <Text allowFontScaling={false} style={styles.encID}>
                            <Text
                              allowFontScaling={false}
                              style={{fontWeight: '500'}}>
                              {i18n.t('PATIENTS.ID')}{' '}
                            </Text>{' '}
                            {item['branch_name'].replace(
                              /^./,
                              item['branch_name'][0].toUpperCase(),
                            ) +
                              ' - ' +
                              item['encounterCode'].split('-')[2]}
                          </Text>
                          <Text allowFontScaling={false} style={styles.places}>
                            <Text
                              allowFontScaling={false}
                              style={{fontWeight: '500'}}>
                              {i18n.t('PATIENTS.TYPE')} :{' '}
                            </Text>{' '}
                            {item['TYPE'] == 'op'
                              ? 'OP'
                              : item['TYPE'].replace(
                                  /^./,
                                  item['TYPE'][0].toUpperCase(),
                                )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }
              }
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  timelineList: state.timeList.timeList,
  presecList: state.presecList.presecList,
});
export default connect(mapStateToProps, {getTimeList, getPresecList})(
  EncounterTimeline,
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
  },
  eventList: {
    marginTop: 8,
  },
  eventBox: {
    padding: 10,
    // marginTop: 5,
    // marginBottom: 5,
    flexDirection: 'row',
  },
  eventDate: {
    flexDirection: 'column',
  },
  eventDay: {
    fontSize: 30,
    color: APP_PRIMARY_COLOR,
    fontWeight: '600',
  },
  eventMonth: {
    fontSize: 26,
    color: '#345D7E',
    fontWeight: '600',
  },
  eventYear: {
    fontSize: 18,
    color: '#4F575C',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  docPhoto: {
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: '#dcdcdc',
    margin: 2,
  },
  description: {
    fontSize: 14,
    // color: "#4F575C"
  },
  doctorName: {
    fontSize: 18,
    color: '#345D7E',
    fontWeight: '500',
  },
  encID: {
    fontSize: 14,
    color: '#2D323C',
  },
  card: {
    shadowColor: '#00000021',

    shadowOffset: {
      width: 0,

      height: 6,
    },

    marginHorizontal: 10,

    marginVertical: 5,

    shadowOpacity: 0.37,

    shadowRadius: 7.49,

    elevation: 5,

    backgroundColor: 'white',

    padding: 10,

    flexDirection: 'row',

    borderRadius: 8,
  },
});
