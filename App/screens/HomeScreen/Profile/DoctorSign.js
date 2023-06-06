import React, {Component} from 'react';
import {
  View,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Container,
  Toast,
  Toast as nativeBaseToast,
} from 'native-base';
import {Portal, Modal} from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import {Text, TouchableOpacity, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import SignatureCapture from 'react-native-signature-capture';
import Styles from './DoctorSignStyles.js';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import FileSelectorProfile from '../../../components/fileselector/FileSelectorProfile.js';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

// styles and images
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  SIGNATURE_BLACK_COLOR,
  SIGNATURE_BLUE_COLOR,
  SIGNATURE_GREEN_COLOR,
} from '../../../themes/variable';
import AddImageIcon from '../ImageComponents/AddSignatureIcon';
import SignColor from '../../../assets/images/sign_color.svg';
import getBaseUrl, {getApiUrl} from '../../../config/Config';

let path1;
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signature: this.props.navigation.state.params.signature,
      modalVisible: false,
      image: '',
      details: {},
      pdfpath: '',
      signatureColor: SIGNATURE_BLACK_COLOR,
      gallary_flag: false,
      signature_flag: false,
      pathName: '',
      sign_state: true,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadFile2 = this.uploadFile2.bind(this);
  }

  componentDidMount() {
    const {signature} = this.props?.navigation?.state?.params;
    this.setState({details: signature});
  }

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const jwt_token = await AsyncStorage.getItem('jwt_token');
    const data_token = {
      name: 'doc_sign',
      filename: Math.round(Math.random() * 1000000) + 'doc_sign.jpg',
      type: 'image.jpg',
      data: RNFetchBlob.wrap(
        this.state.gallary_flag ? this.state.pdfpath : this.state.pathName,
      ),
    };
    console.log('api', {
      name: 'doc_sign',
      filename: Math.round(Math.random() * 1000000) + 'doc_sign.jpg',
      type: 'image.jpg',
      data: RNFetchBlob.wrap(
        Platform.OS === 'ios'?
        this.state.gallary_flag ? 
        this.state.pdfpath.replace('file://', '') : 
        this.state.pathName.replace('file://', ''):
        this.state.gallary_flag ? 
        this.state.pdfpath: 
        this.state.pathName,
      ),
    });
    try {
      RNFetchBlob.fetch(
        'PUT',
        getBaseUrl() + 'v1/doctor/' + doctorId,
        {
          // dropbox upload headers
          Authorization: 'Bearer' + ' ' + jwt_token,
          'Dropbox-API-Arg': JSON.stringify({
            path: '/img-from-react-native.png',
            mode: 'add',
            autorename: true,
            mute: false,
          }),
          'Content-Type': 'application/octet-stream',
        },
        [
          {
            name: 'doc_sign',
            filename: Math.round(Math.random() * 1000000) + 'doc_sign.jpg',
            type: 'image.jpg',
            data: RNFetchBlob.wrap(
              Platform.OS === 'ios'?
              this.state.gallary_flag ? 
              this.state.pdfpath.replace('file://', '') : 
              this.state.pathName.replace('file://', ''):
              this.state.gallary_flag ? 
              this.state.pdfpath: 
              this.state.pathName,
            ),
          },
        ],
      )
        .then(res => {
          const response = {}; //JSON.parse(res?.data);
          this.props.navigation.goBack();
        })
        .catch(err => {
          console.log(err, 'data in the error');
        });
    } catch (error) {
      nativeBaseToast.show({
        text: t('PROFILE.DATANOTSAVED'),
        type: 'danger',
        duration: 5000,
      });
    }
  };

  setImage = () => {
    this.fileSelRef.current.openPicker();
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile1(file) {
    const path = file.path;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path, uri}) => {
          this.setState({path, uri});
          path1 = uri;
          let source;
          source = {uri: path1};
          if (path1.split('.')[1] == 'pdf') {
            this.setState({
              pdfpath: path1,
              signature_flag: false,
              gallary_flag: true,
              sign_state: false,
            });
          } else {
            this.setState({
              pdfpath: uri,
              signature_flag: false,
              gallary_flag: true,
              sign_state: false,
            });
            setTimeout(() => {
              //this.checkConvert();
            }, 250);
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    } catch (error) {
      console.log(
        'The photo picker errored. Check ImagePicker.launchCamera func',
      );
      console.log(error);
    }
  }
  uploadFile(file) {
    const path = file.path;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path, uri}) => {
          this.setState({path, uri});
          path1 = uri;
          if (path1.split('.')[1] == 'pdf') {
            this.setState({
              pdfpath: path1,
              signature_flag: false,
              gallary_flag: true,
              sign_state: false,
            });
            // , () => this.init());
          } else {
            this.setState({
              pdfpath: uri,
              signature_flag: false,
              gallary_flag: true,
              sign_state: false,
            });
            // , () => this.init());
          }
        })
        .catch(err => {
          nativeBaseToast.show({
            text:
              (err && err.message) || 'Error while uploading signature image',
            type: 'warning',
            duration: 5000,
          });
        });
    } catch (error) {
      nativeBaseToast.show({
        text:
          (error && error.message) || 'Error while uploading signature image',
        type: 'warning',
        duration: 5000,
      });
    }
  }
  uploadFile2(file) {
    const path = file.pathName;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path, uri}) => {
          this.setState({path, uri});
          path1 = uri;
          if (path1.split('.')[1] == 'pdf') {
            this.setState({
              modalVisible: false,
              image: file.encoded,
              pathName: path1,
              signature_flag: true,
              gallary_flag: false,
              sign_state: false,
            });
            // , () => this.init());
          } else {
            this.setState({
              modalVisible: false,
              image: file.encoded,
              pathName: path1,
              signature_flag: true,
              gallary_flag: false,
              sign_state: false,
            });
            // , () => this.init());
          }
        })
        .catch(err => {
          nativeBaseToast.show({
            text:
              (err && err.message) || 'Error while uploading signature image',
            type: 'warning',
            duration: 5000,
          });
        });
    } catch (error) {
      nativeBaseToast.show({
        text:
          (error && error.message) || 'Error while uploading signature image',
        type: 'warning',
        duration: 5000,
      });
    }
  }
  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon3
                testID="goBackIcon"
                accessibilityLabel="goBackIcon"
                name="chevron-left"
                size={30}
                style={{color: DEFAULT_WHITE_COLOR}}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{color: DEFAULT_WHITE_COLOR}}
              testID="doctorSignTitle"
              accessibilityLabel="doctorSignTitle">
              {t('PROFILE.DOCTOR_SIGN')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title
                style={{color: DEFAULT_WHITE_COLOR}}
                testID="saveTitle"
                accessibilityLabel="saveTitle">
                {' '}
                {t('PROFILE.SAVE')}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  deleteSign = () => {
    this.setState({
      image: '',
      pdfpath: '',
      gallary_flag: false,
      signature_flag: false,
    });
  };

  saveSign() {
    const image = this.refs['sign'].saveImage();
    console.log('imagesign', image);
    this.setState({image: image});
  }

  resetSign() {
    this.refs['sign'].resetImage();
  }

  image = result => {
    const imge = result.encoded;
    this.setState({details: imge, modalVisible: false});
  };
  signature() {
    const {t} = this.props;
    return (
      <View style={[Styles.signatureTouchableView]}>
        <SignatureCapture
          style={Styles.SignatureCapture}
          ref="sign"
          onSaveEvent={result => {
            // this.setState({
            //   modalVisible: false,
            //   image: result.encoded,
            //   pathName: result.pathName,
            //   signature_flag: true,
            //   gallary_flag: false,
            //   sign_state: false
            // });
            this.uploadFile2(result);
          }}
          saveImageFileInExtStorage={true}
          showNativeButtons={false}
          showTitleLabel={true}
          strokeColor={this.state.signatureColor}
          minStrokeWidth={9}
          maxStrokeWidth={9}
        />
      </View>
    );
  }

  navigateTo = () => {
    const image = this.state.image;
    if (image) {
      const {details} = this.props?.navigation?.state?.params;
      let payload = details;
      payload.image = image;
      this.props.navigation.navigate('PasswordScreen', {
        details: payload,
      });
    } else {
      Toast.show({
        text: 'Please add your signature',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  setModalVisible = visible => {
    this.setState({
      modalVisible: visible,
    });
  };

  setSignatureColor = color => {
    this.setState({
      signatureColor: color,
    });
  };

  DigitalSignature() {
    const {t} = this.props;
    return (
      <View>
        <View style={{padding: 20}}>
          <Text
            style={Styles.PrescriptionText}
            testID="thisSignatureWillBeDisplayedText"
            accessibilityLabel="thisSignatureWillBeDisplayedText">
            {t('PROFILE.THIS_SIGNATURE_WILL_BE_DISPLAYED_PRESCRIPTION')}
          </Text>
        </View>
        {/* Signatureview */}

        <View style={Styles.SignatureView}></View>

        <View style={Styles.Signaturepad}>
          <View style={Styles.signatureMainView}>
            <Text
              style={Styles.Signhere}
              testID="signHereText"
              accessibilityLabel="signHereText">
              {t('PROFILE.SIGN_HERE')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setModalVisible(true)}
            style={Styles.signatureTouchableView}>
            <Image
              testID="signImage"
              accessibilityLabel="signImage"
              style={Styles.signimge}
              source={
                this.state.sign_state
                  ? {uri: getApiUrl() + this.state.signature}
                  : this.state.gallary_flag
                  ? {uri: this.state.pdfpath}
                  : {uri: 'data:image/png;base64,' + this.state.image}
              }
            />
          </TouchableOpacity>
        </View>

        <View style={Styles.ImageUploadview}>
          <TouchableOpacity
            onPress={() => this.setImage()}
            style={Styles.ImageUploadview1}>
            <FileSelectorProfile
              ref={this.fileSelRef}
              onSelection={this.handleSelection}
              selectAny
            />
            <Text
              style={Styles.uploadText}
              testID="uploadImageText"
              accessibilityLabel="uploadImageText">
              {t('PROFILE.UPLOAD_IMAGE')}
            </Text>
            <AddImageIcon
              height={20}
              width={20}
              style={{marginLeft: 8}}
              testID="addImageIcon"
              accessibilityLabel="addImageIcon"
            />
          </TouchableOpacity>

          {(!!this.state.image || !!this.state.pdfpath) && (
            <TouchableOpacity
              onPress={() => this.deleteSign()}
              style={Styles.deleteSignView}>
              <Text
                style={Styles.deleteSign}
                testID="deleteSignatureText"
                accessibilityLabel="deleteSignatureText">
                {t('PROFILE.DELETE_SIGNATURE')}
              </Text>
              <Icon1
                name="delete"
                color="red"
                size={20}
                testID="deleteIcon"
                accessibilityLabel="deleteIcon"
              />
            </TouchableOpacity>
          )}
        </View>

        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onDismiss={() => this.setModalVisible(!this.state.modalVisible)}
            contentContainerStyle={Styles.Model}
            style={Styles.modalStyles}>
            <View style={Styles.viewBorderRadius}>
              <Header style={Styles.modalHeader}>
                <Left style={Styles.alignItemsCenter}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setModalVisible(!this.state.modalVisible)
                    }>
                    <View style={Styles.flexDirectionRow}>
                      <Icon3
                        testID="goBackIcon"
                        accessibilityLabel="goBackIcon"
                        style={Styles.backgroundColorWhite}
                        name="chevron-left"
                        size={22}
                      />
                      <View>
                        <Text
                          style={Styles.signatureText}
                          testID="signatureText"
                          accessibilityLabel="signatureText">
                          {t('PROFILE.SIGNATURE')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Left>

                {/* SIGNATURE COLORS SECTION START */}
                <Right>
                  <View style={Styles.signatureColorsMainView}>
                    <View style={{paddingRight: 7}}>
                      <SignColor height={20} width={20} />
                    </View>

                    <TouchableOpacity
                      style={{paddingRight: 7}}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_BLACK_COLOR)
                      }>
                      <View style={Styles.checkedIconView}>
                        {this.state.signatureColor ===
                          SIGNATURE_BLACK_COLOR && (
                          <View style={Styles.checkedIconViewRight} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{paddingRight: 7, paddingLeft: 7}}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_BLUE_COLOR)
                      }>
                      <View style={Styles.checkedIconView1}>
                        {this.state.signatureColor === SIGNATURE_BLUE_COLOR && (
                          <View style={Styles.checkedIconViewRight} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{paddingRight: 7, paddingLeft: 7}}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_GREEN_COLOR)
                      }>
                      <View style={Styles.checkedIconView2}>
                        {this.state.signatureColor ===
                          SIGNATURE_GREEN_COLOR && (
                          <View style={Styles.checkedIconViewRight} />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </Right>
                {/* SIGNATURE COLORS SECTION END*/}
              </Header>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <View style={Styles.signHereMainView}>
                  <Text
                    style={Styles.signHereComponentText}
                    testID="signHereText"
                    accessibilityLabel="signHereText">
                    {t('PROFILE.SIGN_HERE')}
                  </Text>
                </View>

                {this.signature()}
              </View>

              {/* save and clear buttons view */}
              <View style={Styles.signButtonsView}>
                <Button
                  testID="clearButton"
                  accessibilityLabel="clearButton"
                  style={Styles.signatureButtonStyles}
                  onPress={() => {
                    this.resetSign();
                  }}>
                  <Text
                    style={Styles.clearButtonText}
                    testID="clearText"
                    accessibilityLabel="clearText">
                    {t('PROFILE.CLEAR')}
                  </Text>
                </Button>

                <Button
                  testID="saveButton"
                  accessibilityLabel="saveButton"
                  style={Styles.signatureButtonStyles}
                  onPress={() => {
                    this.saveSign();
                  }}>
                  <Text testID="saveText" accessibilityLabel="saveText">
                    {t('PROFILE.SAVE')}
                  </Text>
                </Button>
              </View>
              {/* save and clear buttons view end */}
            </View>
          </Modal>
        </Portal>
      </View>
    );
  }

  render() {
    const {t} = this.props;
    return (
      <Container>
        {this.Header()}
        {this.DigitalSignature()}

        {/* <FileSelector
          ref={this.imgRef}
          onSelection={(images) => {
            this.setState({
              image: images[0].data,
            });
          }}
          includeBase64
        /> */}
      </Container>
    );
  }
}

export default withTranslation()(Details);
