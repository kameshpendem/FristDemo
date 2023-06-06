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
import FlashMessage from 'react-native-flash-message';
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
class EncounterTimelineDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      mulImg: [],
      hdata: {},
      Id: this.props.navigation.state.params.Id,
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
      hlp: this.props.navigation.state.params.hlpid,
      token: global.token,
      docid: global.doctor_id,
    });
    await this.props.getTimeList(obdaata2);
    let newdata = await this.getTimeline();

    this.setState({hdata: newdata[0]});
  };
  getTimeline = async () => {
    // this.setState({
    //   total_response:response
    // })
    // console.log(JSON.stringify(this.props.timelineList.message)+" "+this.props.navigation.state.params.enc_id)
    console.log('newdta=' + JSON.stringify());
    let newdata = this.props.timelineList.message.filter((item) => {
      if (item.encounterCode != undefined) {
        //  console.log(item.encounterCode+"=="+this.props.navigation.state.params.enc_id)
        return item.id === this.state.Id;
      }
    });
    return newdata;
  };
  gen_presec = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let obs = {
      docid: global.doctor_id,
      hlp: this.props.navigation.state.params.hlpid,
      enc_id: this.props.navigation.state.params.enc_id,
      doc_name: docname,
      token: global.token,
    };
    await this.props.getPresecList(obs);
    // alert("hi"+this.props.presecList.message)
    if (this.props.presecList.message.trim() == 'Please Save Vitals') {
      alert('Please Save Vitals');
      this.setState({page: 0, tabs: this.state.tabsdata});
    } else {
      this.props.navigation.navigate('ViewPdf2', {
        link: this.props.presecList.message,
        branch_id:
          this.props.navigation.state.params.enc_id.split('-')[0] +
          '-' +
          this.props.navigation.state.params.enc_id.split('-')[1],
        branch_name: this.props.navigation.state.params.hspname,
        profile_pic:
          this.props.navigation.state.params.profile_pic != null &&
          this.props.navigation.state.params.profile_pic != ''
            ? this.props.navigation.state.params.profile_pic
            : '',
      });
    }
  };

  checkConvert = (encounterid, id, url) => {
    Alert.alert(
      i18n.t('PLAN.PRESCRIPTION_ADDED'),
      i18n.t('PATIENTS.ADD_MORE'),
      [
        {text:i18n.t('COMMON.YES'), onPress: () => this.setImage(encounterid, id, url)},
        {text: i18n.t('COMMON.NO'), onPress: () => this.convertPDF(encounterid, id, url)},
      ],
      {cancelable: false},
    );
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
          let filename;
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
            this.UPLOAD_ID,
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
              this.UPLOAD_ID,
            );
          }, 250);
        }
      })
      .catch((err) => {});
  }

  setImage = (encounterid, id, url) => {
    /* const options = {
             title: 'Select Image',
             storageOptions: {
               skipBackup: true,
               path: 'images',
             },
           }; */

    this.UPLOAD_ENCOUNTER_ID = encounterid;
    this.UPLOAD_ID = id;
    this.UPLOAD_URL = url;
    this.fileSelRef.current.openPicker();

    /* ImagePicker.showImagePicker(options, (response) => {
             console.log('Response = ', response);
             if(Platform.OS==='android'){
             const { error, path, originalRotation } = response
             if ( path && !error ) {
               let rotation = 0
           
               if ( originalRotation === 90 ) {
                 rotation = 360
               } else if ( originalRotation === 270 ) {
                 rotation = 360
               }
           
               ImageResizer.createResizedImage( path, 800, 650, "JPEG", 50, rotation ).
                 then( ( { path } ) => {
                   this.setState( { path } )
                   path1=path
                   console.log("path",path)
                   if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                  } else {
                    let source;
                      console.log("123")
                      source = { path: path1 };
                      console.log(source.path)
                    console.log("Achu",source.path);
                    if(path1.split(".")[1]=="pdf"){
                      let filename;
                      url=="lab_presc/"?filename=encounterid+"_Lab_"+id+".pdf":filename=encounterid+"_imaging_"+id+".pdf";
                       this.uploadPdf(encounterid,id,url,source.path,filename)
                          }
                    else{
                      console.log("else")
                      this.state.mulImg.push(path1);
                      console.log("else1")
                    this.setState({mulImg:this.state.mulImg});
                  //   this.convertPDF(source.path);
                  this.checkConvert(encounterid,id,url);
                 }
                  
                  }
                 } ).catch( err => {
                   console.log("err", err )
           

                  //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
                 } )
             } else if ( error ) {
               console.log( "The photo picker errored. Check ImagePicker.launchCamera func" )
               console.log( error )
             }
            }
            if(Platform.OS==='ios'){
              source={path:response.uri.replace('file://','')}
            // const source = { path: response.path }; 
            //  console.log(source);
             this.state.ImageSource = source.path;
             if(this.state.ImageSource.split(".")[1]=="pdf"){
              let filename;
              url=="lab_presc/"?filename=encounterid+"_Lab_"+id+".pdf":filename=encounterid+"_imaging_"+id+".pdf";
               this.uploadPdf(encounterid,id,url,source.path,filename)
             }else{
               console.log("called", source.path)
               this.state.mulImg.push(source.path);
               console.log("called2", JSON.stringify(this.state.mulImg));
              this.setState({mulImg:this.state.mulImg});
              this.checkConvert(encounterid,id,url);
           }
          } 
           });*/
  };
  checkConvert = (encounterid, id, url) => {
    Alert.alert(
      'Prescription added',
      'Do you want to add more?',
      [
        {text: 'Yes', onPress: () => this.setImage(encounterid, id, url)},
        {text: 'No', onPress: () => this.convertPDF(encounterid, id, url)},
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
          width: 900,
          height: 1200,
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
          this.timelineAlert2.showMessage({
            message: 'Success!',
            description: 'File uploaded',
            type: 'success',
            icon: 'auto',
          });
          //
          // alert(resp.message)
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
    //alert("res="+this.props.navigation.state.paramss.responsedata);

    // let practice=this.state.doctors.pract_details.filter(item=> item.branch_id === this.state.branch_id);
    // let resp=this.props.navigation.state.paramss.responsedata.filter(item=>item.id===id);
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
            description: i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'),
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
    this.props.navigation.navigate('MenuItems');
  };
  showPdf = (pdflink) => {
    console.log('link=' + pdflink);
    this.props.navigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };
  showPdf1 = (pdflink) => {
    //alert(pdflink)
    this.setState({
      visible1: false,
    });
    this.props.navigation.navigate('ViewPdf', {
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
      this.props.navigation.navigate('ViewImage', {
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
                      <Text>{this.getRecieptName(item)} </Text>
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
        <Header style={{backgroundColor: 'white', height: 100}}>
          <StatusBar
            backgroundColor={APP_PRIMARY_COLOR}
            barStyle={'light-content'}
          />

          <Row>
            <Col>
              <Row>
                <Col size={10} style={{marginLeft: -15}}>
                  <TouchableOpacity>
                    <Thumbnail
                      square
                      source={require('../../assets/images/ic_launcher.png')}
                    />
                  </TouchableOpacity>
                </Col>
                <Col size={65} style={{marginLeft: 20}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginTop: 15,
                      marginLeft: 20,
                      fontSize: 15,
                      alignSelf: 'center',
                      textTransform: 'capitalize',
                    }}>
                    {this.props.navigation.state.params.hspname}
                  </Text>
                </Col>

                <Col size={25}>
                  <Thumbnail
                    style={{
                      borderRadius: 63,
                      borderWidth: 1,
                      borderColor: 'black',
                      marginTop: 10,
                      alignSelf: 'center',
                    }}
                    small
                    source={
                      this.props.navigation.state.params.profile_pic != null &&
                      this.props.navigation.state.params.profile_pic != ''
                        ? this.props.navigation.state.params.profile_pic
                        : require('../../assets/images/doc.jpg')
                    }
                  />
                </Col>
              </Row>
              <Row style={{backgroundColor: '#e4e4e4', marginHorizontal: -10}}>
                <Col size={75} style={{marginVertical: 15}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      marginLeft: 5,
                      textTransform: 'capitalize',
                    }}>
                    {this.props.navigation.state.params.name +
                      ' | ' +
                      this.props.navigation.state.params.gender +
                      ' | '}
                    {this.props.navigation.state.params.age}
                    {' | '}
                    {this.props.navigation.state.params.blood == 'O pos'
                      ? 'O +ve'
                      : this.props.navigation.state.params.blood == 'O neg'
                      ? 'O -ve'
                      : this.props.navigation.state.params.blood == 'A pos'
                      ? 'A +ve'
                      : this.props.navigation.state.params.blood == 'A neg'
                      ? 'A -ve'
                      : this.props.navigation.state.params.blood == 'B pos'
                      ? 'B +ve'
                      : this.props.navigation.state.params.blood == 'B neg'
                      ? 'B -ve'
                      : this.props.navigation.state.params.blood == 'AB pos'
                      ? 'AB +ve'
                      : this.props.navigation.state.params.blood == 'AB neg'
                      ? 'AB -ve'
                      : this.props.navigation.state.params.blood == 'OH'
                      ? 'OH'
                      : this.props.navigation.state.params.blood ==
                          'NOT KNOWN' && 'NOT KNOWN'}
                  </Text>
                </Col>
                <Col size={12}>
                  <TouchableOpacity onPress={() => this.gen_presec()}>
                    <Thumbnail
                      style={{height: 25, width: 25, marginTop: 15}}
                      square
                      source={require('../../assets/images/pre.png')}
                    />
                  </TouchableOpacity>
                </Col>
                {/* <Col size={12} >
                <TouchableOpacity style={{marginTop:15,marginLeft:-40,color:"#949494"}}>
                  <Icon   name='times' type='font-awesome' style={{fontSize:20,}} />
                </TouchableOpacity>
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Header>
        {(item.TYPE == 'op' ||
          item.TYPE == 'service' ||
          item.TYPE == 'op-personal') &&
          item.uid != null && (
            <View style={styles.eventContent}>
              <Text allowFontScaling={false} style={styles.doctorName}>
                {item['non'][0]
                  ? item['non'][0]['middle_name'] != ''
                    ? item['non'][0]['salutation'] +
                      '. ' +
                      item['non'][0]['first_name'] +
                      ' ' +
                      item['non'][0]['middle_name'] +
                      ' ' +
                      item['non'][0]['last_name']
                    : item['non'][0]['salutation'] +
                      '. ' +
                      item['non'][0]['first_name'] +
                      ' ' +
                      item['non'][0]['last_name']
                  : null}
              </Text>
              <Text allowFontScaling={false} style={styles.places}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: '500',
                    marginTop: 13,
                    fontWeight: 'bold',
                  }}>
                  {i18n.t('PATIENTS.HOSPITAL')} :{' '}
                </Text>{' '}
                {item['practice_name']}
              </Text>
              <Text allowFontScaling={false} style={styles.encID}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: '500',
                    marginTop: 13,
                    fontWeight: 'bold',
                  }}>
                  {i18n.t('PATIENTS.ID')} :{' '}
                </Text>{' '}
                {item['branch_name'] +
                  ' - ' +
                  item['encounterCode'].split('-')[2]}
              </Text>
              <Text allowFontScaling={false} style={styles.encID}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: '500',
                    marginTop: 13,
                    fontWeight: 'bold',
                  }}>
                {i18n.t('INITIAL_ASSESSMENT.DATE')}:{' '}
                </Text>{' '}
                {moment(item['uid'].split('.')[1]).format('DD-MMM-YYYY')}
              </Text>
              {/* <Text allowFontScaling={false}style={styles.encID}><Text allowFontScaling={false}style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Date: </Text> {item.payment_status}</Text>
                <Text allowFontScaling={false}style={styles.encID}><Text allowFontScaling={false}style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Date: </Text> {JSON.stringify(item)}</Text> */}
              {item['sub'].length > 0 && (
                <View>
                  <Text allowFontScaling={false} style={styles.description}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontWeight: '500',
                        marginTop: 13,
                        fontWeight: 'bold',
                      }}>
                     {i18n.t('PATIENTS.CHIEF_COMP')}:
                    </Text>
                  </Text>
                  <View>
                    <HTMLView value={item['sub'][0]['cheif_complaints']} />
                  </View>
                </View>
              )}

              {item['sub'].length > 0
                ? item['sub'][0]['syptoms_comments'] != '' && (
                    <View style={{top: 10}}>
                      <Text allowFontScaling={false} style={styles.description}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontWeight: '500',
                            marginTop: 13,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('COMMON.SYMPTOMS')}:
                        </Text>{' '}
                      </Text>
                      <View>
                        <HTMLView value={item['sub'][0]['syptoms_comments']} />
                      </View>
                    </View>
                  )
                : null}
              {item['dia'].length > 0
                ? item['dia'][0]['notes'] != '' && (
                    <View style={{top: 10}}>
                      <Text allowFontScaling={false} style={styles.description}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontWeight: '500',
                            marginTop: 13,
                            fontWeight: 'bold',
                          }}>
                          Diagnoses:
                        </Text>{' '}
                      </Text>
                      <View>
                        <HTMLView value={item['dia'][0]['notes']} />
                      </View>
                    </View>
                  )
                : null}

              {item.lab.length > 0 && (
                <View>
                  <Text
                    allowFontScaling={false}
                    style={{marginTop: 13, fontWeight: 'bold'}}>
                    Lab Order:
                  </Text>
                </View>
              )}

              {item.lab &&
                item.lab.map((item) => (
                  <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                    <Row>
                      <Col size={70}>
                        <Text allowFontScaling={false} style={{marginTop: 13}}>
                          {item.lab}
                        </Text>
                      </Col>
                      <Col size={30}>
                        {
                          (item.lab_pdf_path == null ||
                            item.lab_pdf_path == '') &&
                          item.payment_status != 'Due' ? (
                            <TouchableOpacity
                              onPress={() =>
                                this.setImage(
                                  item.encounterCode,
                                  item.lab_test_id,
                                  'lab_presc/',
                                )
                              }>
                              <Icon
                                reverse
                                raised
                                color="#517fa4"
                                name="upload"
                                type="font-awesome"
                                size={15}
                              />
                            </TouchableOpacity>
                          ) : item.lab_pdf_path != null &&
                            item.lab_pdf_path.split('.')[1] == 'pdf' &&
                            item.payment_status != 'Due' ? (
                            <TouchableOpacity
                              onPress={() => this.showPdf(item.lab_pdf_path)}>
                              <Icon
                                reverse
                                raised
                                color="#517fa4"
                                size={10}
                                containerStyle={{marginHorizontal: -2}}
                                type="ionicon"
                                name={'md-document'}
                              />
                            </TouchableOpacity>
                          ) : null

                          // <TouchableOpacity onPress={()=> this.toggleImageModal(item.service_pdf_path)}>
                          // {item.service_pdf_path!=""&&<Thumbnail square source={{uri:item.service_pdf_path}} style={styles.docPhoto} />}
                          //     </TouchableOpacity>
                        }
                      </Col>
                    </Row>
                  </View>
                ))}
              {item.img.length > 0 && (
                <View>
                  <Text
                    allowFontScaling={false}
                    style={{marginTop: 13, fontWeight: 'bold'}}>
                    Image Order:
                  </Text>
                </View>
              )}

              {item.img &&
                item.img.map((item) => (
                  <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                    <Row>
                      <Col size={70}>
                        <Text allowFontScaling={false} style={{marginTop: 13}}>
                          {item.image_type}
                        </Text>
                      </Col>
                      <Col size={30}>
                        {
                          (item.img_pdf_path == null ||
                            item.img_pdf_path == '') &&
                          item.payment_status != 'Due' ? (
                            <TouchableOpacity
                              onPress={() =>
                                this.setImage(
                                  item.encounterCode,
                                  item.imaging_id,
                                  'imaging_presc/',
                                )
                              }>
                              <Icon
                                reverse
                                raised
                                color="#517fa4"
                                name="upload"
                                type="font-awesome"
                                size={15}
                              />
                            </TouchableOpacity>
                          ) : item.img_pdf_path != null &&
                            item.img_pdf_path.split('.')[1] == 'pdf' &&
                            item.payment_status != 'Due' ? (
                            <TouchableOpacity
                              onPress={() => this.showPdf(item.img_pdf_path)}>
                              <Icon
                                reverse
                                raised
                                color="#517fa4"
                                size={10}
                                containerStyle={{marginHorizontal: -2}}
                                type="ionicon"
                                name={'md-document'}
                              />
                            </TouchableOpacity>
                          ) : null
                          //   <TouchableOpacity onPress={() => this.toggleImageModal(item.img_pdf_path)}>
                          //   {item.img_pdf_path!=""&&<Thumbnail square source={{uri:item.img_pdf_path}} style={styles.docPhoto} />}
                          //   </TouchableOpacity>
                        }
                      </Col>
                    </Row>
                  </View>
                ))}

              {/* {item.pdflink != "" &&
                        <View style={{flexDirection:'row', alignSelf:'flex-end',top:10}}>
                    
                            <Row>
                                <Col size={35}>
                            <Text allowFontScaling={false}style={{marginTop:15,fontWeight:"bold"}}>Prescription:</Text>
                               </Col>
                               <Col size={65}>
                                <TouchableOpacity onPress={()=> this.showPdf(item.pdflink)}>
                                    <Icon reverse raised color='#517fa4' name='file-pdf-o'type='font-awesome' size={15}/>
                                </TouchableOpacity>
                            
                               </Col>
                            </Row>
                            
                        </View> 
                    }
                    {item.reclink.length>0&&
                        <View style={{flexDirection:'row', alignSelf:'flex-end'}}>

                        <Row>
                                <Col size={35}>
                             <Text allowFontScaling={false}style={{marginTop:13,fontWeight:"bold"}}>Receipt:</Text>
                               </Col>
                               {item.reclink.length<=1?<Col size={65} style={{flexDirection:'row'}}>
                               

                                <TouchableOpacity onPress={()=> this.showPdf(item.reclink[0])}>

                               <Icon reverse raised color='#517fa4' size={15} name='file-text-o'type='font-awesome'/>
                               </TouchableOpacity>
                               
                               </Col>:
                               <Col size={65} style={{flexDirection:'row'}}>
                               <TouchableOpacity onPress={()=>this.openOverlay()}>
                               <Icon reverse raised color='#517fa4' size={15} name='file-text-o'type='font-awesome'/>
                               </TouchableOpacity>
                               </Col>}
                               
                            </Row>
                            
                        </View>
      
                    }
      */}
            </View>
          )}
        <FlashMessage
          position="top"
          ref={(ref) => (this.timelineAlert2 = ref)}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  timelineList: state.timeList.timeList,
  presecList: state.presecList.presecList,
});
export default connect(mapStateToProps, {getTimeList, getPresecList})(
  EncounterTimelineDetails,
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
});
