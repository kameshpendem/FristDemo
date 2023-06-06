import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
// import Modal from "react-native-modal";
import moment from 'moment';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import RNImageToPdf from 'react-native-image-to-pdf';
import {getImmunreactList} from '../../../redux/actions/immunreact_action';
import {getImmunupdateList} from '../../../redux/actions/immunupdate_action';
import ImageResizer from 'react-native-image-resizer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import FileSelector from '../../../components/fileselector/FileSelector';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import i18n from '../../../../i18n';
let path1;
let uri1;

class Immun extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: '',
      chosenDate: new Date(),
      ImageSource: '',
      isModalVisible: false,
      notes: '',
      isImageModalVisible: false,
      mulImg: [],
      imgPath: '',
      immuneID: '',
      pdfPath: '',
      isDatePickerVisible: false,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount = async () => {
    await this.getImmuneData();
  };

  removeDupliactes = (values) => {
    let concatArray = values.map((eachValue) => {
      return Object.values(eachValue).join('');
    });
    let filterValues = values.filter((value, index) => {
      return concatArray.indexOf(concatArray[index]) === index;
    });
    return filterValues;
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  getImmuneData = async () => {
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp: this.props.myprops.hlpid,
      dob: moment(this.props.myprops.dob, 'YYYY-MM-DD').format('DD-MMM-YYYY'),
      token: global.token,
    });
    await this.props.getImmunreactList(ob);

    if (
      this.props.immunreactList.message === '' ||
      this.props.immunreactList.message === 'immunization table not found' ||
      this.props.immunreactList.message === 'data not found'
    ) {
      alert('You dont have Immunization chart created.');
    } else {
      let vaccinearray = [];
      this.props.immunreactList.message.detail.map((item) => {
        vaccinearray.push(item.vaccine_time);
      });
      console.log(JSON.stringify([...new Set(vaccinearray)]));
      let timearray = [];
      vaccinearray.map((i) => {
        let vaccinedetails = [];
        this.props.immunreactList.message.detail.map((item) => {
          if (i == item.vaccine_time) {
            let vaccinedata = {
              im_id: item.im_id,
              days: item.days,
              vaccine_name: item.vaccine_name,
              vaccine_time: item.vaccine_time,
              actual_date: item.actual_date,
              approx_date: item.approx_date,
              file_url: item.file_url,
              status: item.status,
              notes: item.notes,
            };
            vaccinedetails.push(vaccinedata);
          }
        });
        let mydata = {
          vaccine_time: i,
          data: this.removeDupliactes(vaccinedetails),
        };
        timearray.push(mydata);
      });
      console.log(JSON.stringify(this.removeDupliactes(timearray)));
      let immunedetails = this.removeDupliactes(timearray);
      this.setState({data: immunedetails, isLoading: false});
    }
  };

  colorCode = (dd, ad) => {
    let today = new Date(),
      actual = new Date(ad),
      due = new Date(dd),
      timeDiff = Math.abs(actual.getTime() - due.getTime()),
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (due <= today) {
      if (ad != null && ad != '') {
        if (ad == dd) {
          return '#006400';
        } else if (diffDays < 7) {
          return '#ff8503';
        } else {
          return '#d53600';
        }
      } else {
        return '#6c757d';
      }
    } else {
      return '#cccccc';
    }
  };

  setDate = (newDate) => {
    this.state.chosenDate = newDate;
    this.updateActualDate();
  };

  updateActualDate = async () => {
    let url = getBaseUrl() + 'immun_update';
    console.log(url);
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp: this.props.myprops.hlpid,
      token: global.token,
      im_id: this.state.immuneID,
      actual_date: this.state.chosenDate,
      approx_date: '',
      notes: '',
    });
    console.log(url + '' + ob.toString());
    await this.props.getImmunupdateList(ob);
    alert(this.props.immunupdateList.message);
    if (this.props.immunupdateList.message == 'updated successfully') {
      this.getImmuneData();
    }
  };

  uploadFile(file) {
    const path = file.path;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
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
            //   this.convertPDF(source.path);
            setTimeout(() => {
              this.checkConvert(this.state.immuneID);
            }, 250);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } catch (error) {
      console.log(
        'The photo picker errored. Check ImagePicker.launchCamera func',
      );
      console.log(error);
    }
  }

  setImage = (immun_id) => {
    console.log('id=' + immun_id);
    this.setState({immuneID: immun_id});
    this.fileSelRef.current.openPicker();
    // const options = {
    //   title: 'Select Vaccination Report',
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };

    // ImagePicker.showImagePicker(options, (response) => {
    //   try {
    //     console.log('Response = ', response);
    //     if (Platform.OS === 'android') {
    //       const {error, path, originalRotation} = response;
    //       if (path && !error) {
    //         let rotation = 0;

    //         if (originalRotation === 90) {
    //           rotation = 360;
    //         } else if (originalRotation === 270) {
    //           rotation = 360;
    //         }

    //         ImageResizer.createResizedImage(
    //           path,
    //           800,
    //           650,
    //           'JPEG',
    //           50,
    //           rotation,
    //         )
    //           .then(({path}) => {
    //             this.setState({path});
    //             path1 = path;
    //             console.log('path', path);
    //             if (response.didCancel) {
    //               console.log('User cancelled image picker');
    //             } else if (response.error) {
    //               console.log('ImagePicker Error: ', response.error);
    //             } else {
    //               let source;
    //               console.log('123');
    //               source = {path: path1};
    //               console.log(source.path);
    //               console.log('Achu', source.path);
    //               if (path1.split('.')[1] == 'pdf') {
    //                 this.setState({pdfpath: path1});
    //               } else {
    //                 console.log('else');
    //                 this.state.mulImg.push(path1);
    //                 console.log('else1');
    //                 this.setState({mulImg: this.state.mulImg});
    //                 //   this.convertPDF(source.path);
    //                 this.checkConvert(immun_id);
    //               }
    //             }
    //           })
    //           .catch((err) => {
    //             console.log('err', err);

    //             //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
    //           });
    //       } else if (error) {
    //         console.log(
    //           'The photo picker errored. Check ImagePicker.launchCamera func',
    //         );
    //         console.log(error);
    //       }
    //     }
    //     if (Platform.OS === 'ios') {
    //       source = {path: response.uri.replace('file://', '')};

    //       // const source = { path: response.path };
    //       console.log(source);
    //       this.state.mulImg.push(source.path);
    //       this.setState({mulImg: this.state.mulImg});
    //       this.checkConvert(immun_id);
    //     }
    //   } catch (e) {
    //     console.log('errrrr', e);
    //   }
    // });
  };

  checkConvert = (immun_id) => {
    Alert.alert(
      i18n.t('PLAN.PRESCRIPTION_ADDED'),
      i18n.t('PATIENTS.ADD_MORE'),
      [
        {text:  i18n.t('COMMON.YES'), onPress: () => this.setImage(immun_id)},
        {text:  i18n.t('COMMON.NO'), onPress: () => this.convertPDF()},
      ],
      {cancelable: false},
    );
  };
  convertPDF = async () => {
    // this.refs.loading.show();
    this.setState({isLoading: true});
    console.log('imgpaath', JSON.stringify(this.state.mulImg));
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name:
          this.props.myprops.hlpid + 'immune' + this.state.immuneID + '.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: 1200,
        },
        quality: 0.4, // optional compression paramter
      };
      this.setState({mulImg: []});

      console.log(options);
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      console.log(pdf.filePath);
      this.uploadPdf(
        pdf.filePath,
        this.props.myprops.hlpid + 'immune' + this.state.immuneID + '.pdf',
      );
    } catch (e) {
      console.log('errrrr123', e);
    }
  };

  uploadPdf = async (pdf, pdfname) => {
    console.log('pdf', pdf, pdfname);
    let url = getBaseUrl() + 'doc_immun_img_upload/';
    let pt = [
      {
        name: 'image',
        filename: pdfname,
        type: 'application/pdf',
        data: RNFetchBlob.wrap(pdf),
      },
      {name: 'hlp', data: this.props.myprops.hlpid.toString()},
      {
        name: 'im_id',
        data: this.state.immuneID.toString(),
      },
      {
        name: 'token',
        data: global.token.toString(),
      },
      {
        name: 'docid',
        data: global.doctor_id.toString(),
      },
    ];
    console.log(url + ' ' + JSON.stringify(pt));
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
      .then((response) => {
        this.setState({isLoading: false});
        console.log(response.message);
        if (response.message == 'File Uploaded successfully') {
          // this.refs.loading.close();
          alert(i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'));
          this.getImmuneData();
          //   this.vaccineAlert.showMessage({
          //     message: "Immunization Update",
          //     description: "Report has been updated successfully",
          //     type: "success",
          //     icon: "auto"
          // });
        } else {
          //   this.refs.loading.close();
          //   this.vaccineAlert.showMessage({
          //     message: "Update Failed",
          //     description: "Please try again.",
          //     type: "danger",
          //     icon: "auto"
          // });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  toggleModal = (notes) => {
    this.state.notes = notes;
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  toggleImageModal = (img) => {
    if (img == '') {
      alert('no image found');
    } else {
      let uri = getApiUrl() + '/' + img.trim();
      console.log(uri);
      this.props.myprops.rootNavigation.navigate('ViewImage', {
        link: uri.toString(),
        screenname: 'Immunization Report',
      });
    }
  };

  viewPdf = (pdflink) => {
    console.log(pdflink);
    let uri = pdflink != '' && getApiUrl() + '/' + pdflink.trim();
    this.props.myprops.rootNavigation.navigate('ViewPdf', {
      link: getApiUrl() + '/' + pdflink.trim(),
      screenname: 'Immunization Report',
    });
  };

  showDatePicker = (id) => {
    //setDatePickerVisibility(true);
    console.log('showDatePicker', id);
    this.setState({immuneID: id});
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    //setDatePickerVisibility(false);
    if (this.state.isDatePickerVisible == true) {
      this.setState({isDatePickerVisible: false});
    }
  };

  handleConfirm = (date) => {
    // let newDate = date.toISOString();
    // console.warn('newDate: ', typeof newDate);
    // console.log("DATE1",newDate,moment(date).format('YYYY-MM-DD'))
    // let res = newDate.split('T');
    // console.warn('newDate: ', res[0], typeof res[0]);
    let dateNew = moment(date).format('YYYY-MM-DD');
    console.warn('ndateNew: ', dateNew);
    this.setDate(dateNew);
    this.setState({isDatePickerVisible: false});
    this.setState({isLoading: true});
  };

  render() {
    let dt = this.state.chosenDate;
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
    return (
      <View style={styles.container}>
        {this.state.isDatePickerVisible && (
          <DateTimePickerModal
            maximumDate={new Date()}
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={(date) => this.handleConfirm(date)}
            onCancel={() => this.hideDatePicker()}
          />
        )}
        <FileSelector
          ref={this.fileSelRef}
          onSelection={this.handleSelection}
          selectAny
        />
        <SectionList
          sections={this.state.data}
          renderSectionHeader={({section}) => {
            return (
              <View style={styles.titleContainer}>
                <Text allowFontScaling={false} style={styles.title}>
                  {section.vaccine_time}
                </Text>
              </View>
            );
          }}
          renderItem={({item}) => {
            return (
              <View style={styles.row}>
                <View
                  style={[
                    styles.colorCode,
                    {
                      backgroundColor: this.colorCode(
                        item.approx_date,
                        item.actual_date,
                      ),
                    },
                  ]}></View>
                <View style={styles.nameCol}>
                  <View style={styles.nameContainer}>
                    <Text allowFontScaling={false} style={styles.nameTxt}>
                      {item.vaccine_name}
                    </Text>
                  </View>
                  <View style={styles.end}>
                    <Text allowFontScaling={false} style={styles.time}>
                      Due: {moment(item.approx_date).format('DD-MMM-YYYY')}
                    </Text>
                    {item.actual_date != null && item.actual_date != '' && (
                      <Text allowFontScaling={false} style={styles.time}>
                        {' '}
                        Taken: {moment(item.actual_date).format('DD-MMM-YYYY')}
                      </Text>
                    )}
                    {/* <Text>{item.actual_date}</Text> */}
                  </View>
                </View>

                {/* <View style={styles.iconHolder}>
                  {item.actual_date == null || item.actual_date == '' ? (
                    Platform.OS == 'android' ? (
                      <DatePicker
                        allowFontScaling={false}
                        //date={this.state.newDatePicker}
                        date={new Date(dt)}
                        customStyles={{
                          dateIcon: {
                            height: 20,
                            width: 20,
                            marginLeft: 10,
                          },
                          dateInput: {
                            height: 15,
                            //    marginHorizontal:10,
                            borderColor: 'white',
                          },
                          // ... You can check the source to find the other keys.
                        }}
                        //minDate={new Date(1900, 1, 1)}
                        // maxDate={new Date(2020, 12, 12)}
                        minDate={new Date(this.props.myprops.dob)}
                        maxDate={new Date()}
                        locale={'en'}
                        format="DD-MMM-YYYY"
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'spinner'}
                        showIcon={true}
                        style={{height: 60}}
                        // placeHolderText="Select date"
                        textStyle={{color: 'green'}}
                        placeHolderTextStyle={{color: '#d3d3d3'}}
                        //onDateChange={this.setDate}
                        // onDateChange={(date) =>
                        //   this.setState({newDatePicker: date})
                        // }
                        onDateChange={this.setDate}
                        disabled={false}
                      />
                    ) : (
                      <DateTimePicker
                        style={{
                          width: 320,
                          backgroundColor: 'white',
                          height: 60,
                        }}
                        testID="dateTimePicker"
                        //value={new Date(this.state.chosenDate)} //date={this.state.newDatePicker}
                        //value={this.state.newDatePicker} //date={this.state.newDatePicker}
                        value={new Date(dt)}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        //onChange={this.setDate}
                        //onDateChange={(date) => this.setState({chosenDate: date})}
                        onDateChange={this.setDate}
                        locale={'en'}
                      />
                    )
                  ) : null}
                </View> */}

                {/* <View style={styles.iconHolder}>
                  {(item.actual_date == null || item.actual_date == '') && (
                    <View>
                      
                      <Icon
                        reverse
                        raised
                        color="#517fa4"
                        size={10}
                        containerStyle={{marginHorizontal: -8}}
                        type="ionicon"
                        name={'md-calendar'}
                        onPress={() => this.showDatePicker(item.im_id)}
                      />
                      <DateTimePickerModal
                        maximumDate={new Date()}
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                      />
                    </View>
                  )}
                </View> */}

                <View style={styles.iconHolder}>
                  {(item.actual_date == null || item.actual_date == '') && (
                    <TouchableOpacity
                      onPress={() => this.showDatePicker(item.im_id)}>
                      <Icon
                        reverse
                        raised
                        color="#517fa4"
                        size={10}
                        containerStyle={{
                          marginHorizontal: -8,
                          marginBottom: 15,
                        }}
                        type="ionicon"
                        name={'md-calendar'}
                      />
                    </TouchableOpacity>
                  )}

                  {/* {
                    (item.actual_date == null || item.actual_date == '') && (
                      // <TouchableOpacity onPress={()=>{this.setState({immuneID:item.im_id})}}>
                      <DatePicker
                        style={{width: 25}}
                        date={new Date(dt)}
                        mode="date"
                        placeholder="select actual date"
                        minDate={new Date(this.props.myprops.dob)}
                        maxDate={new Date()}
                        locale={'en'}
                        format="YYYY-MM-DD"
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        confirmBtnText="Confirm"
                        hideText="true"
                        cancelBtnText="Cancel"
                        iconComponent={
                          <Icon
                            reverse
                            raised
                            color="#517fa4"
                            size={10}
                            containerStyle={{marginHorizontal: -8}}
                            type="ionicon"
                            name={'md-calendar'}
                          />
                        }
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            marginLeft: 0,
                          },
                        }}
                        onOpenModal={() => {
                          this.setState({immuneID: item.im_id});
                        }}
                        onDateChange={this.setDate}
                      />
                    )
                    // </TouchableOpacity>
                  } */}

                  {/* {item.actual_date == null || item.actual_date == '' ? (
                    Platform.OS == 'android' ? (
                      <DatePicker
                        style={{width: 25}}
                        date={new Date(dt)}
                        mode="date"
                        placeholder="select actual date"
                        minDate={new Date(this.props.myprops.dob)}
                        maxDate={new Date()}
                        locale={'en'}
                        format="YYYY-MM-DD"
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        confirmBtnText="Confirm"
                        hideText="true"
                        cancelBtnText="Cancel"
                        iconComponent={
                          <Icon
                            reverse
                            raised
                            color="#517fa4"
                            size={10}
                            containerStyle={{marginHorizontal: -8}}
                            type="ionicon"
                            name={'md-calendar'}
                          />
                        }
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            marginLeft: 0,
                          },
                        }}
                        onOpenModal={() => {
                          this.setState({immuneID: item.im_id});
                        }}
                        onDateChange={this.setDate}
                      />
                    ) : (
                      <DateTimePicker
                        style={{
                          width: 320,
                          backgroundColor: 'white',
                          height: 60,
                        }}
                        testID="dateTimePicker"
                        //value={new Date(this.state.chosenDate)} //date={this.state.newDatePicker}
                        //value={this.state.newDatePicker} //date={this.state.newDatePicker}
                        value={new Date(dt)}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        //onChange={this.setDate}
                        //onDateChange={(date) => this.setState({chosenDate: date})}
                        onDateChange={this.setDate}
                        locale={'en'}
                      />
                    )
                  ) : null} */}

                  {item.file_url == null ? (
                    <TouchableOpacity onPress={() => this.setImage(item.im_id)}>
                      <Icon
                        reverse
                        raised
                        color="#517fa4"
                        size={10}
                        containerStyle={{
                          marginHorizontal: -2,
                          marginBottom: 15,
                        }}
                        type="ionicon"
                        name={'md-camera'}
                      />
                    </TouchableOpacity>
                  ) : item.file_url.split('.')[1] == 'pdf' ? (
                    <TouchableOpacity
                      onPress={() => this.viewPdf(item.file_url)}>
                      <Icon
                        color={APP_PRIMARY_COLOR}
                        size={18}
                        containerStyle={{marginLeft: 10, marginBottom: 10}}
                        type="font-awesome"
                        name={'file-pdf-o'}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.toggleImageModal(item.file_url)}>
                      <Icon
                        reverse
                        raised
                        color="#517fa4"
                        size={10}
                        containerStyle={{marginHorizontal: -2}}
                        type="ionicon"
                        name={'md-image'}
                      />
                    </TouchableOpacity>
                  )}
                  {item.notes != null && (
                    <TouchableOpacity
                      onPress={() => this.toggleModal(item.notes)}>
                      <Icon
                        reverse
                        raised
                        color="#517fa4"
                        size={10}
                        containerStyle={{marginHorizontal: -8}}
                        type="ionicon"
                        name={'md-text'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
        {/* <Modal
transparent={false}
isVisible={this.state.isModalVisible}
onBackButtonPress={()=>this.setState({ isModalVisible: !this.state.isModalVisible })}
animationInTiming={100}
animationOutTiming={100}
>
<View style={{ flex: 0.5, backgroundColor:'#ffffff', padding: 20 }}>
<TouchableOpacity onPress={()=>this.setState({ isModalVisible: !this.state.isModalVisible })}>
<Icon reverse raised color='#517fa4' size={20} containerStyle={{alignItems:'flex-end'}} type='ionicon' name={'md-close'} />
</TouchableOpacity>
<Text allowFontScaling={false}>Notes:</Text>
<Text allowFontScaling={false}>{this.state.notes}</Text>
</View>
</Modal> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  immunreactList: state.immunreactList.immunreactList,
  immunupdateList: state.immunupdateList.immunupdateList,
});
export default connect(mapStateToProps, {
  getImmunreactList,
  getImmunupdateList,
})(Immun);

const styles = StyleSheet.create({
  titleContainer: {
    shadowColor: '#000021',
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginBottom: 2,
    backgroundColor: APP_PRIMARY_COLOR,
    paddingVertical: 5,
    paddingLeft: 15,
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  nameCol: {
    flex: 0.75,
  },
  iconHolder: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    //justifyContent: 'space-between',
  },
  colorCode: {
    flex: 0.05,
    width: 10,
    height: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '500',
    color: '#222',
    fontSize: 15,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    marginLeft: 15,
    fontWeight: '400',
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  icon: {
    height: 20,
    width: 20,
  },
});
