import React, {Component} from 'react';
import {
  View,
  Header,
  Left,
  Body,
  Right,
  Button,
  Container,
  Toast,
} from 'native-base';
import {Portal, Modal} from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import {Text, TouchableOpacity, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import SignatureCapture from 'react-native-signature-capture';
import FileSelector from '../../../components/fileselector/FileSelector2';
import ImageResizer from 'react-native-image-resizer';
import getBaseUrl from '../../../config/Config';
const base_url = getBaseUrl();
// styles and images
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  SIGNATURE_BLACK_COLOR,
  SIGNATURE_BLUE_COLOR,
  SIGNATURE_GREEN_COLOR,
} from '../../../themes/variable';
import Styles from './DoctorRegistrationStyles';
import AddImageIcon from '../ImageComponents/AddSignatureIcon';
import LogoWhite from '../../../assets/images/logo_white.png';
import SignColor from '../../../assets/images/sign_color.svg';

let path1;
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fill: '',
      signature: null,
      modalVisible: false,
      image: '',
      details: {},
      pathName: '',
      pdfpath: '',
      gallary_flag: false,
      signature_flag: false,
      signatureColor: SIGNATURE_BLACK_COLOR,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadFile2 = this.uploadFile2.bind(this);
  }

  componentDidMount() {
    const {details} = this.props?.navigation?.state?.params;
    this.setState({details: details});
  }

  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header androidStatusBarColor={APP_PRIMARY_COLOR} style={Styles.Header}>
          <Left style={Styles.leftHeaverView}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
            testID="leftIconTouch"
            accessibilityLabel="leftIconTouch">
              <Icon3
              testID="leftIcon"
              accessibilityLabel="leftIcon"
                name="chevron-left"
                size={25}
                style={{color: DEFAULT_WHITE_COLOR}}
              />
            </TouchableOpacity>
            <Image
            testID="healphaImage"
            accessibilityLabel="healphaImage"
              source={LogoWhite}
              style={Styles.headerImageStyles}
              resizeMode="contain"
            />
          </Left>
          <Body></Body>
        </Header>
        <View style={Styles.HeaderView}>
          <Text style={Styles.HeaderText}
          testID="createAnAccountWithHealphaText"
          accessibilityLabel="createAnAccountWithHealphaText">
            {t('DOCTOR_REGISTER.CREATE_AN_ACCOUNT_WITH_HEALPHA')}
          </Text>
        </View>
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
        testID="signatureCappture"
        accessibilityLabel="signatureCappture"
          style={Styles.SignatureCapture}
          ref="sign"
          onSaveEvent={result => {
            // this.setState({
            //   modalVisible: false,
            //   image: result.encoded,
            //   pathName: result.pathName,
            // });
            this.uploadFile2(result);
          }}
          saveImageFileInExtStorage={true}
          showNativeButtons={false}
          showTitleLabel={true}
          strokeColor={this.state.signatureColor}
          minStrokeWidth={4}
          maxStrokeWidth={4}
        />
      </View>
    );
  }

  navigateTo = () => {
    const image = this.state.image || this.state.pdfpath;
    const {t} = this.props;
    if (image) {
      const {details} = this.props?.navigation?.state?.params;
      let payload = details;
      payload.image = this.state.gallary_flag
        ? this.state.pdfpath
        : this.state.pathName;
      console.log("payload11",payload)
      this.props.navigation.navigate('PasswordScreen', {
        details: payload,
      });
    } else {
      Toast.show({
        text: t('DOCTOR_REGISTER.SIGN'),
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
            });
          } else {
            this.setState({
              pdfpath: uri,
              signature_flag: false,
              gallary_flag: true,
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
            });
            // , () => this.init());
          } else {
            this.setState({
              pdfpath: uri,
              signature_flag: false,
              gallary_flag: true,
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
              gallary_flag: false
            });
            // , () => this.init());
          } else {
            this.setState({
              modalVisible: false,
              image: file.encoded,
              pathName: path1,
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
  DigitalSignature() {
    const {t} = this.props;
    return (
      <View>
        <View style={Styles.BasicDetailsView}>
          <View style={Styles.View}>
            <Text style={Styles.TextView}
            testID="signatureText"
            accessibilityLabel="signatureText">
              {t('DOCTOR_REGISTER.SIGNATURE')}
            </Text>
            <Text style={Styles.TermsofConditionsText}
             testID="addSignatureText"
             accessibilityLabel="addSignatureText">
              {t(
                'DOCTOR_REGISTER.ADD_YOUR_SIGNATURE_AND_IT_WILL_BE_DISPLAYED_ON_PRESCRIPTION',
              )}
            </Text>
          </View>
          <View style={Styles.CircularView}>
            <AnimatedCircularProgress
              size={60}
              width={3}
              fill={60}
              tintColor={APP_PRIMARY_COLOR}
              backgroundColor="#DBE4E6">
              {fill => <Text style={Styles.circleText}
               testID="4by5Text"
               accessibilityLabel="4by5Text">4/5</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        {/* Signatureview */}

        <View style={Styles.SignatureView}>
          <AddImageIcon onPress={() => this.setImage()} 
           testID="addImageIcon"
           accessibilityLabel="addImageIcon"/>
          <FileSelector
          testID="fileSelector"
          accessibilityLabel="fileSelector"
            ref={this.fileSelRef}
            onSelection={this.handleSelection}
            selectAny
          />
        </View>

        <View style={Styles.Signaturepad}>
          <View style={Styles.signatureMainView}>
            <Text style={Styles.Signhere}
            testID="signHereText"
            accessibilityLabel="signHereText">
              {t('DOCTOR_REGISTER.SIGN_HERE')}
            </Text>
          </View>
          <TouchableOpacity
          testID="signTouch"
          accessibilityLabel="signTouch"
            onPress={() => this.setModalVisible(true)}
            style={Styles.signatureTouchableView}>
            <Image
            testID="signImage"
            accessibilityLabel="signImage"
              style={Styles.signimge}
              source={
                this.state.gallary_flag
                  ? {uri: this.state.pdfpath}
                  : {uri: 'data:image/png;base64,' + this.state.image}
              }
            />
          </TouchableOpacity>
        </View>

        {(!!this.state.image || !!this.state.pdfpath) && (
          <TouchableOpacity
          testID="deleteSignatureTouch"
           accessibilityLabel="deleteSignatureTouch"
            onPress={() => this.deleteSign()}
            style={Styles.deleteSignView}>
            <Text style={Styles.deleteSign}
            testID="deleteSignatureText"
            accessibilityLabel="deleteSignatureText">
              {t('DOCTOR_REGISTER.DELETE_SIGNATURE')}
            </Text>
            <Icon1 name="delete" color="red" size={20} 
            testID="deleteIcon"
            accessibilityLabel="deleteIcon"/>
          </TouchableOpacity>
        )}

        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onDismiss={() => this.setModalVisible(!this.state.modalVisible)}
            contentContainerStyle={Styles.Model}
            style={Styles.modalStyles}>
            <View style={Styles.viewBorderRadius}>
              <Header style={[Styles.backgroundColorWhite, Styles.modalHeader]}>
                <Left style={[Styles.alignItemsCenter]}>
                  <TouchableOpacity
                   testID="leftIconTouch"
                   accessibilityLabel="leftIconTouch"
                    onPress={() =>
                      this.setModalVisible(!this.state.modalVisible)
                    }>
                    <View
                      style={[
                        Styles.flexDirectionRow,
                        Styles.alignItemsCenter,
                      ]}>
                      <Icon3
                      testID="leftIcon"
                      accessibilityLabel="leftIcon"
                        style={Styles.backgroundColorWhite}
                        name="chevron-left"
                        size={22}
                      />
                      <View>
                        <Text style={Styles.signatureText}
                        testID="signatureText"
                        accessibilityLabel="signatureText">
                          {t('DOCTOR_REGISTER.SIGNATURE')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Left>

                {/* SIGNATURE COLORS SECTION START */}
                <Right>
                  <View style={Styles.signatureColorsMainView}>
                    <View style={Styles.paddingRight7}>
                      <SignColor height={20} width={20} 
                      testID="signColour"
                      accessibilityLabel="signColour"/>
                    </View>

                    <TouchableOpacity
                    testID="blackColourTouch"
                    accessibilityLabel="blackColourTouch"
                      style={Styles.paddingRight7}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_BLACK_COLOR)
                      }>
                      <View
                        style={[
                          Styles.checkedIconView,
                          {backgroundColor: SIGNATURE_BLACK_COLOR},
                        ]}>
                        {this.state.signatureColor ===
                          SIGNATURE_BLACK_COLOR && (
                          <View style={Styles.checkedIconViewRight} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    testID="blueColourTouch"
                    accessibilityLabel="blueColourTouch"
                      style={[Styles.paddingRight7, Styles.paddingLeft7]}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_BLUE_COLOR)
                      }>
                      <View
                        style={[
                          Styles.checkedIconView,
                          {backgroundColor: SIGNATURE_BLUE_COLOR},
                        ]}>
                        {this.state.signatureColor === SIGNATURE_BLUE_COLOR && (
                          <View style={Styles.checkedIconViewRight} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    testID="greenColourTouch"
                    accessibilityLabel="greenColourTouch"
                      style={[Styles.paddingRight7, Styles.paddingLeft7]}
                      onPress={() =>
                        this.setSignatureColor(SIGNATURE_GREEN_COLOR)
                      }>
                      <View
                        style={[
                          Styles.checkedIconView,
                          {backgroundColor: SIGNATURE_GREEN_COLOR},
                        ]}>
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
            <View style={Styles.flex}>
              <View style={Styles.flexDirectionRow}>
                <View style={[Styles.signHereMainView, Styles.transparent]}
                testID="signHereText"
                accessibilityLabel="signHereText">
                  <Text style={Styles.signHereComponentText}>
                    {t('DOCTOR_REGISTER.SIGN_HERE')}
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
                  <Text style={Styles.clearButtonText}
                  testID="clearText"
                  accessibilityLabel="clearText">
                    {t('DOCTOR_REGISTER.CLEAR')}
                  </Text>
                </Button>

                <Button
                testID="saveButton"
                accessibilityLabel="saveButton"
                  style={Styles.signatureButtonStyles}
                  onPress={() => {
                    this.saveSign();
                  }}>
                  <Text style={Styles.saveButtonText}
                  testID="saveText"
                  accessibilityLabel="saveText">{t('PROFILE.SAVE')}</Text>
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
        <View style={[Styles.SignNxtButton, {flex: 1}]}>
          <Button
           testID="nextButton"
           accessibilityLabel="nextButton"
            onPress={() => this.navigateTo()}
            style={Styles.BasicNextButtonView}>
            <Text style={Styles.ButtonText}
            testID="nextText"
            accessibilityLabel="nextText">{t('DOCTOR_REGISTER.NEXT')}</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

export default withTranslation()(Details);
