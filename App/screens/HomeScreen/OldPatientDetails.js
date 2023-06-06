import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  //ListView,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import HTMLView from 'react-native-htmlview';
import RNFetchBlob from 'rn-fetch-blob';
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
import {getOldList} from '../../redux/actions/oldpatient_action';
import {connect} from 'react-redux';

import RNImageToPdf from 'react-native-image-to-pdf';
import ImageResizer from 'react-native-image-resizer';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import FileSelector from '../../components/fileselector/FileSelector';
import getBaseUrl, {getApiUrl} from '../../config/Config';
import i18n from '../../../i18n';
let path1;
// import Loading from 'react-native-whc-loading';
// import ImageResizer from 'react-native-image-resizer';

// import FlashMessage, {showMessage} from "react-native-flash-message";

class OldPatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      Id: this.props.navigation.state.params.Id,
      schedule_date: this.props.navigation.state.params.schedule_date,
      enc_id: this.props.navigation.state.params.enc_id,
      hlpid: this.props.navigation.state.params.hlpid,
      branch_id: this.props.navigation.state.params.branch_id,
      encounter_type: this.props.navigation.state.params.encounter_type,
      mulImg: [],
      hdata: '',
      visible1: false,
      encounterdate: this.props.navigation.state.params.encounterdate,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount = async () => {
    await this.props.getOldList({
      docid: global.doctor_id,
      token: global.token,
      hlpid: this.state.hlpid,
      encid: this.state.enc_id,
      branch: this.state.branch_id,
      key: 'other',
      date: moment(this.state.schedule_date).format('YYYY-MM-DD'),
    });
    this.setState({
      isLoading: false,
      hdata: this.props.oldList.message.filter((item) => {
        console.log(item.id == this.state.Id);
        return item.id === this.state.Id;
      }),
    });
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
          this.setState({pdfpath: path1});
        } else {
          this.state.mulImg.push(path1);
          this.setState({mulImg: this.state.mulImg});
          setTimeout(() => {
            this.checkConvert(
              this.UPLOAD_ID,
              this.UPLOAD_ENC_ID,
              this.UPLOAD_SERV_LIST_ID,
              this.UPLOAD_SERV_TYPE,
            );
          }, 250);
        }
      })
      .catch((err) => {});
  }

  chooseFile = (id, encid, service_list_id, servicetype) => {
    // var options = {
    //   title: 'Select Image',
    //   //   customButtons: [
    //   //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    //   //   ],
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };
    this.UPLOAD_ENC_ID = encid;
    this.UPLOAD_ID = id;
    this.UPLOAD_SERV_LIST_ID = service_list_id;
    this.UPLOAD_SERV_TYPE = servicetype;
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
 
        ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, rotation)
          .then(({path}) => {
            this.setState({path});
            path1 = path;
            console.log('path', path);
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
               this.setState({pdfpath:path1})
             }
             else{
               console.log("else")
               this.state.mulImg.push(path1);
               console.log("else1")
             this.setState({mulImg:this.state.mulImg});
           //   this.convertPDF(source.path);
           this.checkConvert(id,encid,service_list_id,servicetype);
          }
           
           }
          } ).catch( err => {
            console.log("err", err )
    
           //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
          } )
        }
         else if ( error ) {
        console.log( "The photo picker errored. Check ImagePicker.launchCamera func" )
        console.log( error )
      }
    }
      if(Platform.OS==='ios'){
        source={path:response.uri.replace('file://','')}
      //let source = { path: response.path };
      console.log(source);
      if(source.path.split(".")[1]=="pdf"){
        this.setState({pdfpath:source.path})
      }
      else{
        this.state.mulImg.push(source.path);
      this.setState({mulImg:this.state.mulImg});
    //   this.convertPDF(source.path);
    this.checkConvert(id,encid,service_list_id,servicetype);
 
    }}
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        // this.state.mulImg.push(source.path);
        // this.setState({
        //   filePath: source,
        // });
    }); */
    // alert(this.state.filePath.uri)
    // this.checkConvert();
  };

  checkConvert = (id, encid, service_list_id, servicetype) => {
    Alert.alert(
      'Image Order added',
      'Do you want to add more?',
      [
        {
          text: 'Yes',
          onPress: () =>
            this.chooseFile(id, encid, service_list_id, servicetype),
        },
        {
          text: 'No',
          onPress: () =>
            this.convertPDF(id, encid, service_list_id, servicetype),
        },
      ],
      {cancelable: false},
    );
  };
  convertPDF = async (id, encid, service_list_id, servicetype) => {
    // this.refs.loading.show();
    this.setState({isLoading: true});
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: encid + '-' + service_list_id + '-' + id + '.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: 1200,
        },
        quality: 0.5, // optional compression paramter
      };
      console.log(options);
      this.setState({mulImg: []});

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdfpath: pdf.filePath});
      // this.refs.loading.close();
      // alert("hi"+pdf.filePath)
      let pt = [
        {
          name:
            servicetype == 'img'
              ? 'img'
              : servicetype == 'lab'
              ? 'lab'
              : 'nursing',
          filename: encid + '-' + service_list_id + '-' + id + '.pdf',
          type: 'application/pdf',
          data: RNFetchBlob.wrap(pdf.filePath),
        },
        {
          name: 'encounter_id',
          data: encid,
        },
        {
          name:
            servicetype == 'img'
              ? 'img_id'
              : servicetype == 'lab'
              ? 'lab_id'
              : 'nursing_id',
          data: id,
        },
        {
          name: 'docid',
          data: global.doctor_id,
        },
        {
          name: 'token',
          data: global.token,
        },
      ];

      let url =
        servicetype == 'img'
          ? getBaseUrl() + 'img_pdf/'
          : servicetype == 'lab'
          ? getBaseUrl() + 'lab_pdf/'
          : getBaseUrl() + 'nursing_pdf/';
      // alert(url+" "+JSON.stringify(pt))

      let response = await RNFetchBlob.fetch(
        'POST',
        url,
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
        },
        pt,
      )
        .then((response) => response.json())
        .then(async (response) => {
          console.log(' enc inserted res=' + JSON.stringify(response));
          //  alert(JSON.stringify(response))
          // this.refs.loading.close();
          this.setState({isLoading: false});
          return response;
        })
        .catch((error) => {
          console.error(error);
        });

      if (
        response.message == 'File Added Successfully' ||
        response.message == 'successfully' ||
        response.message == 'success'
      ) {
        //alert("Added Successfully")
        this.timelineAlert.showMessage({
          message: 'Success!',
          description: 'File uploaded',
          type: 'success',
          icon: 'auto',
        });
        let ob = JSON.stringify({
          docid: global.doctor_id,
          token: global.token,
          hlpid: this.state.hdata[0].hlpid,
          encid: encid,
          branch: this.state.hdata[0].branch_id,
          key: 'other',
          date: moment(this.state.schedule_date).format('YYYY-MM-DD'),
        });
        console.log(ob);
        // alert("Lab Order saved Successfully")

        await this.props.getOldList(ob);
        this.setState({
          hdata: this.props.oldList.message.filter((item) => {
            console.log(item.id == this.state.Id);
            return item.id === this.state.Id;
          }),
        });
      } else {
        alert('File not upload');
      }
    } catch (e) {
      console.log(e);
    }
  };

  closeOverlay1 = () => {
    this.setState({visible1: false});
  };
  openOverlay = () => {
    //alert("res="+this.props.navigation.state.params.responsedata);

    // let practice=this.state.doctors.pract_details.filter(item=> item.branch_id === this.state.branch_id);
    // let resp=this.props.navigation.state.params.responsedata.filter(item=>item.id===id);
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
        } else {
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
    console.log('pdf=' + pdflink);
    this.props.navigation.navigate('ViewPdf', {
      link: pdflink,
      screenname: 'Prescription',
    });
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
    let item = this.state.hdata[0];
    // alert(JSON.stringify(item))
    if (this.state.visible1) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1>
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
                {/* {item.reclink.map((item)=>
                  <Row style={{marginTop:15,marginLeft:15}}>
                  <Col size={35}>
                  <Text allowFontScaling={false}>{this.getRecieptName(item)} </Text>
                  </Col>
                  <Col size={65} style={{marginTop:-15}}>
                  <TouchableOpacity onPress={()=>this.showPdf1(item)}>
                  <Icon reverse raised color='#517fa4' size={15} name='file-text-o'type='font-awesome'/>
                  </TouchableOpacity>
                  </Col>
                </Row>
        
        )} */}
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
      <ScrollView>
        <FileSelector
          ref={this.fileSelRef}
          onSelection={this.handleSelection}
          selectAny
        />
        <View style={styles.eventContent}>
          <Text allowFontScaling={false} style={styles.doctorName}>
            {item.middle_name != '' && item.middle_name != null
              ? item.salutation +
                '.' +
                item.first_name +
                ' ' +
                item.middle_name +
                ' ' +
                item.last_name
              : item.salutation + '.' + item.first_name + ' ' + item.last_name}
          </Text>
          {/* <Text allowFontScaling={false}style={styles.places}><Text allowFontScaling={false}style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Hospital : </Text> {item['practice_name']}</Text> */}
          <Text allowFontScaling={false} style={styles.encID}
          testID={item['encounterCode']+"text"}
          accessibilityLabel={item['encounterCode']+"text"}>
            <Text
              allowFontScaling={false}
              style={{fontWeight: '500', marginTop: 13, fontWeight: 'bold'}}
              testID="idText"
              accessibilityLabel="idText">
             {i18n.t('PATIENTS_DETAILS.ID')}:{' '}
            </Text>{' '}
            {item['encounterCode']}
          </Text>
          {/* <Text allowFontScaling={false}style={styles.encID}><Text allowFontScaling={false}style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Date: </Text> {moment(item['uid'].split(".")[1]).format('DD-MMM-YYYY')}</Text> */}
          <Text allowFontScaling={false} style={styles.encID}
          testID={moment(item.schedule_date).format('DD-MMM-YYYY')+"text"}
          accessibilityLabel={moment(item.schedule_date).format('DD-MMM-YYYY')+"text"}>
            <Text
              allowFontScaling={false}
              style={{fontWeight: '500', marginTop: 13, fontWeight: 'bold'}}
              testID="dateText"
              accessibilityLabel="dateText">
              {i18n.t('PATIENTS_DETAILS.DATE')}:{' '}
            </Text>{' '}
            {moment(item.schedule_date).format('DD-MMM-YYYY')}
          </Text>
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
                  {i18n.t('PATIENTS_DETAILS.CHEIF_COMPLAINTS')} :
                </Text>
              </Text>
              <View>
                <HTMLView value={item['sub'][0]['cheif_complaints']} />
              </View>
            </View>
          )}

          {/* {item['sub'].length>0? item['sub'][0]['syptoms_comments']!=""&&
                
                <View style={{top:10}}>
                 <Text allowFontScaling={false}style={styles.description}><Text allowFontScaling={false}style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Symptoms:</Text> </Text>
                  <View>
                    <HTMLView
                    value={item['sub'][0]['syptoms_comments']}
                  />
                  </View>
                  </View>
                  :null
                } */}

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
                       {i18n.t('PATIENTS_DETAILS.DIAGNOSES')}:
                    </Text>{' '}
                  </Text>
                  <View style={{top: -5}}>
                    <HTMLView value={item['dia'][0]['notes']} />
                  </View>
                </View>
              )
            : null}
          {/* {item.medicines&&item.medicines.length>0&&item.medicines[0].medicine_type=="med"&&item.medicines[0].medicine_reminder.length>0&&<View><Text style={{marginTop:13,fontWeight:"bold"}}>Prescriptions:</Text></View>}
                {item.medicines&&item.medicines.length>0&&item.medicines[0].medicine_type=="med"&&item.medicines[0].medicine_reminder.length>0&&<View style={{ marginTop:13,flexDirection:'row', alignSelf:'flex-end'}}>
                <Row>
                               <Col size={25}><Text>Date</Text></Col>
                               <Col size={30}><Text>Medicine Name</Text></Col>
                               <Col size={30}><Text>Time</Text></Col>
                               <Col size={15}><Text>Status</Text></Col>
                               </Row>
                </View>}
                {item.medicines&&item.medicines.map((item2)=>
                           item2.medicine_type=="med"&&  item2.medicine_reminder.map((item3)=>
                              <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                            <Row>
                               <Col size={25}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_intake_date}</Text>
                              </Col>
                               <Col size={30}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_name}</Text>
                              </Col>
                              <Col size={30}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_timing.includes(",")?item3.drug_timing.split(",")[0]:item3.drug_timing}</Text>
                              </Col>
                              <Col size={15}>
                              <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_intake_status=="1"?"Taken":item3.drug_intake_status=="0"?"Not Taken":item3.drug_intake_status=="0.5"&&"Late Taken"}</Text>
                              </Col>
                              </Row>
                              </View>)
                )
                }
                 {item.medicines&&item.medicines.length>0&&item.medicines[0].medicine_type=="sup"&&item.medicines[0].medicine_reminder.length>0&&<View><Text style={{marginTop:13,fontWeight:"bold"}}>Supplements:</Text></View>}
                {item.medicines&&item.medicines.length>0&&item.medicines[0].medicine_type=="sup"&&item.medicines[0].medicine_reminder.length>0&&<View style={{ marginTop:13,flexDirection:'row', alignSelf:'flex-end'}}>
                <Row>
                               <Col size={25}><Text>Date</Text></Col>
                               <Col size={30}><Text>Medicine Name</Text></Col>
                               <Col size={30}><Text>Time</Text></Col>
                               <Col size={15}><Text>Status</Text></Col>
                               </Row>
                </View>}
                {item.medicines&&item.medicines.map((item2)=>
                           item2.medicine_type=="sup"&&  item2.medicine_reminder.map((item3)=>
                              <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                            <Row>
                               <Col size={25}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_intake_date}</Text>
                              </Col>
                               <Col size={30}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_name}</Text>
                              </Col>
                              <Col size={30}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_timing.includes(",")?item3.drug_timing.split(",")[0]:item3.drug_timing}</Text>
                              </Col>
                              <Col size={15}>
                           <Text allowFontScaling={false}style={{marginTop:13}}>{item3.drug_intake_status=="1"?"Taken":item3.drug_intake_status=="0"?"Not Taken":item3.drug_intake_status=="0.5"&&"Late Taken"}</Text>
                              </Col>
                              </Row>
                              </View>)
                )
                } */}

          {item.lab.length > 0 && (
            <View>
              <Text
                allowFontScaling={false}
                style={{marginTop: 13, fontWeight: 'bold'}}>
                {i18n.t('PATIENTS_DETAILS.LAB_ORDER')}:
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
                    {item.lab_pdf_path == null || item.lab_pdf_path == '' ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.chooseFile(
                            item.lab_test_id,
                            item.encounterCode,
                            item.service_list_id,
                            'lab',
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
                    ) : item.lab_pdf_path.split('.')[1] == 'pdf' ? (
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
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.toggleImageModal(item.lab_pdf_path)
                        }>
                        {item.img_pdf_path != '' && (
                          <Thumbnail
                            square
                            source={{
                              uri: getApiUrl() + '/' + item.lab_pdf_path,
                            }}
                            style={styles.docPhoto}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  </Col>
                </Row>
              </View>
            ))}
          {item.img.length > 0 && (
            <View>
              <Text
                allowFontScaling={false}
                style={{marginTop: 13, fontWeight: 'bold'}}>
                {i18n.t('PATIENTS_DETAILS.IMAGE_ORDER')}:
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
                    {item.img_pdf_path == null || item.img_pdf_path == '' ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.chooseFile(
                            item.imaging_id,
                            item.encounterCode,
                            item.service_list_id,
                            'img',
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
                    ) : item.img_pdf_path.split('.')[1] == 'pdf' ? (
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
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.toggleImageModal(
                            getApiUrl() + '/' + item.img_pdf_path,
                          )
                        }>
                        {item.img_pdf_path != '' && (
                          <Thumbnail
                            square
                            source={{
                              uri: getApiUrl() + '/' + item.img_pdf_path,
                            }}
                            style={styles.docPhoto}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  </Col>
                </Row>
              </View>
            ))}
          {item.vac.length > 0 && (
            <View>
              <Text
                allowFontScaling={false}
                style={{marginTop: 13, fontWeight: 'bold'}}>
                 {i18n.t('PATIENTS_DETAILS.VACCINES')}:
              </Text>
            </View>
          )}

          {item.vac &&
            item.vac.map((item) => (
              <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                <Row>
                  <Col size={70}>
                    <Text allowFontScaling={false} style={{marginTop: 13}}>
                      {item.vaccine_brand_name}
                    </Text>
                  </Col>
                  <Col size={30}>
                    {item.batch_no != '' && item.expiry_date != '' && (
                      <Text allowFontScaling={false} style={{marginTop: 13}}>
                        {item.batch_no}-{item.expiry_date}
                      </Text>
                    )}
                  </Col>
                </Row>
              </View>
            ))}

          {item.pdflink != '' && (
            <View
              style={{flexDirection: 'row', alignSelf: 'flex-end', top: 10}}>
              <Row>
                <Col size={35}>
                  <Text
                    allowFontScaling={false}
                    style={{marginTop: 15, fontWeight: 'bold'}}>
                    {i18n.t('COVID_MONITORING.PRESCRIPTION')}:
                  </Text>
                </Col>
                <Col size={65}>
                  <TouchableOpacity onPress={() => this.showPdf(item.pdflink)}>
                    <Icon
                      reverse
                      raised
                      color="#517fa4"
                      name="file-pdf-o"
                      type="font-awesome"
                      size={15}
                    />
                  </TouchableOpacity>
                </Col>
              </Row>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              top: 20,
              paddingLeft: -15,
            }}>
            <Row style={{marginTop: -5, marginLeft: -10}}>
              <Col style={{marginHorizontal: 3}}>
                {this.state.encounter_type.toLowerCase() != 'cancelled' &&
                this.state.encounter_type.toLowerCase() != 'Cancelled' &&
                this.state.encounter_type.toLowerCase() != 'checkedin' &&
                this.state.encounter_type.toLowerCase() != 'Checkedin' &&
                this.state.encounter_type.toLowerCase() != 'triage' &&
                this.state.encounter_type.toLowerCase() != 'confirm' &&
                this.state.encounter_type.toLowerCase() != 'Confirm' &&
                this.state.encounter_type.toLowerCase() !=
                  'appointment rescheduled' ? (
                  <TouchableOpacity
                  testID="medicineText"
                      accessibilityLabel="medicineText"
                    style={{backgroundColor: APP_PRIMARY_COLOR, marginLeft: 5}}
                    onPress={() =>
                      this.props.navigation.navigate('ReminderAlarms', {
                        hlpid: this.state.hlpid,
                        enc: this.state.enc_id,
                        encounterdate: this.state.encounterdate,
                      })
                    }>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'white',
                        fontSize: 15,
                        margin: 10,
                        marginBottom: 20,
                        textAlign: 'center',
                      }}
                      testID="medicineText"
                      accessibilityLabel="medicineText">
                      {i18n.t('PATIENTS_DETAILS.MEDICINE')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Col>
              <Col style={{marginHorizontal: 9}}>
                {/* <TouchableOpacity style={{backgroundColor:APP_PRIMARY_COLOR,marginLeft:5}} onPress={()=>this.props.navigation.navigate('Vitals2',{hlpid:item.hlpid,enc:item.encounterCode})}>
                                <Text allowFontScaling={false} style={{color:"white",fontSize:12,margin:10,textAlign:"center"}}>Medicine</Text>
                            </TouchableOpacity> */}
              </Col>
            </Row>
          </View>
        </View>
        <FlashMessage
          position="top"
          ref={(ref) => (this.timelineAlert = ref)}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  oldList: state.oldList.oldList,
  isFetching15: state.postList.isFetching15,
  // encList:state.encList.encList,
  // isFetching16:state.postList.isFetching16,
});

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
export default connect(mapStateToProps, {getOldList})(OldPatientDetails);
