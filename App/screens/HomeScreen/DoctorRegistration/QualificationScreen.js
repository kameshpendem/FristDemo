import {
  View,
  Header,
  Left,
  Body,
  Container,
  Content,
  Button,
  Toast,
} from 'native-base';
import Icon3 from 'react-native-vector-icons/Feather';
import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import {withTranslation} from 'react-i18next';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CertificateIcon from '../../HomeScreen/ImageComponents/CertificationIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageResizer from 'react-native-image-resizer';
import RNImageToPdf from 'react-native-image-to-pdf';
import getBaseUrl from '../../../config/Config';
const base_url = getBaseUrl();
// Styles and theme
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Styles from './DoctorRegistrationStyles';

//images
import LogoWhite from '../../../assets/images/logo_white.png';
import {compareDobAndQualificationYear} from '../../../utils/QualificationAndCertificationYear';

import FileSelector from '../../../components/fileselector/FileSelector';

let path1;
class ExperienceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fill: '',
      qualification: [],
      pdfpath: '',
      mulImg: [],
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    const {details} = this.props?.navigation?.state?.params;
    this.setState({qualification: details});
  }

  handleInputText = (text, type) => {
    const qArray = this.state.qualification;
    const {t} = this.props;
    if (type === 'year_of_registration' || type === 'edu_year') {
      if (text.length === 4) {
        const year_flag = compareDobAndQualificationYear(
          qArray.dob,
          parseInt(text),
        );
        if (year_flag) {
          qArray[type] = '';
          Toast.show({
            text: t('DOCTOR_REGISTER.DATE_OF_BIRTH'),
            type: 'warning',
            duration: 2000,
          });
        } else {
          qArray[type] = text;
        }
      }
    } else {
      qArray[type] = text;
    }
    this.setState({
      qualification: qArray,
    });
  };

  navigateTo = () => {
    const details = this.state.qualification;
    const {t} = this.props;

    if (!details.edu_degree) {
      Toast.show({
        text: t('DOCTOR_REGISTER.DEGREE_NAME'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.edu_college) {
      Toast.show({
        text: t('DOCTOR_REGISTER.COLLEGE_NAME'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.edu_year) {
      Toast.show({
        text: t('DOCTOR_REGISTER.EDU_YEAR'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.registration_number) {
      Toast.show({
        text: t('DOCTOR_REGISTER.REG_NUMBER'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.year_of_registration) {
      Toast.show({
        text: t('DOCTOR_REGISTER.REG_YEAR'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.medical_council) {
      Toast.show({
        text: t('DOCTOR_REGISTER.MEDICAL_COUNCIL'),
        type: 'warning',
        duration: 3000,
      });
    } else if (!this.state.pdfpath) {
      details.doc_certificate = this.state.pdfpath;
      // (!details.doc_certificate) {
      Toast.show({
        text: t('DOCTOR_REGISTER.ATTACH_CERT'),
        type: 'warning',
        duration: 3000,
      });
    } else {
      details.doc_certificate = this.state.pdfpath;
      this.props.navigation.navigate('SignatureScreen', {
        details: this.state.qualification,
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
            const images = this.state.mulImg;
            images.push(path);
            this.setState({mulImg: this.state.mulImg});
            setTimeout(() => {
              this.checkConvert();
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

  checkConvert = () => {
    this.convertPDF();
    // Alert.alert(
    //   'Images added',
    //   'Do you want to add more?',
    //   [
    //     {text: 'Yes', onPress: () => this.setImage()},
    //     {text: 'No', onPress: () => this.convertPDF()},
    //   ],
    //   {cancelable: false},
    // );
  };

  convertPDF = async () => {
    // this.refs.loading.show();
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: 'certificate.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };
      this.setState({mulImg: []});

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdfpath: pdf.filePath});
    } catch (e) {
      console.log(e);
    }
  };

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
  QualificationSection() {
    const {t} = this.props;
    return (
      <View>
        {/* AddQualification/Text */}
        <View style={Styles.BasicDetailsView}>
          <View style={{marginLeft: 16}}>
            <Text style={Styles.TextView}
             testID="qualificationText"
             accessibilityLabel="qualificationText">
              {t('DOCTOR_REGISTER.QUALIFICATION')}
            </Text>
            <Text style={Styles.TermsofConditionsText}
             testID="addYourQualificationText"
             accessibilityLabel="addYourQualificationText">
              {t('DOCTOR_REGISTER.ADD_YOUR_QUALIFICATION')}
            </Text>
          </View>
          <View style={Styles.CircularView}>
            <AnimatedCircularProgress
              size={60}
              width={4}
              fill={40}
              tintColor={APP_PRIMARY_COLOR}
              backgroundColor="#DBE4E6">
              {(fill) => <Text style={Styles.circleText}
               testID="3by5Text"
               accessibilityLabel="3by5Text">3/5</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="degreeText"
           accessibilityLabel="degreeText">
            {t('PROFILE.DEGREE')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="degreeTextInput"
             accessibilityLabel="degreeTextInput"
              style={Styles.textInput}
              defaultValue={this.state.qualification?.edu_degree}
              onChangeText={(text) => this.handleInputText(text, 'edu_degree')}
            />
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="collegeOrUniversityText"
           accessibilityLabel="collegeOrUniversityText">
            {t('PROFILE.COLLEGE/UNIVERSITY')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="collegeOrUniversityTextInput"
             accessibilityLabel="collegeOrUniversityTextInput"
              defaultValue={this.state.qualification?.edu_college}
              style={Styles.textInput}
              onChangeText={(text) => this.handleInputText(text, 'edu_college')}
            />
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="yearText"
           accessibilityLabel="yearText">
            {t('PROFILE.YEAR')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="yearTextInput"
             accessibilityLabel="yearTextInput"
              maxLength={4}
              keyboardType="numeric"
              style={Styles.textInput}
              defaultValue={this.state.qualification?.edu_year}
              onChangeText={(text) => this.handleInputText(text, 'edu_year')}
            />
          </View>
        </View>

        {/* certificates */}
        <View style={Styles.CertificateView}
         testID="certificationText"
         accessibilityLabel="certificationText">
          <Text style={Styles.TextView}>
            {t('DOCTOR_REGISTER.CERTIFICATION')}
          </Text>
          <Text style={Styles.TermsofConditionsText}
           testID="addCertificationText"
           accessibilityLabel="addCertificationText">
            {t('DOCTOR_REGISTER.ADD_YOUR_CERTIFICATION')}
          </Text>
        </View>

        {/* Registration Number */}
        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="registrationNumberText"
           accessibilityLabel="registrationNumberText">
            {t('PROFILE.REGISTRATIONNUMBER')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="registrationNumberTextInput"
             accessibilityLabel="registrationNumberTextInput"
              maxLength={6}
              style={Styles.textInput}
              defaultValue={this.state.qualification?.registration_number}
              onChangeText={(text) =>
                this.handleInputText(text, 'registration_number')
              }
            />
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="yearOfRegistrationText"
           accessibilityLabel="yearOfRegistrationText">
            {t('PROFILE.YEAROFREGISTRATION')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="yearOfRegistrationTextInput"
             accessibilityLabel="yearOfRegistrationTextInput"
              maxLength={4}
              keyboardType="numeric"
              style={Styles.textInput}
              defaultValue={this.state.qualification?.year_of_registration}
              onChangeText={(text) =>
                this.handleInputText(text, 'year_of_registration')
              }
            />
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
           testID="medicalCouncilText"
           accessibilityLabel="medicalCouncilText">
            {t('PROFILE.REGISTRATION/MEDICALCOUNCIL')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
             testID="medicalCouncilTextInput"
             accessibilityLabel="medicalCouncilTextInput"
              style={Styles.textInput}
              defaultValue={this.state.qualification?.Medical_council}
              onChangeText={(text) =>
                this.handleInputText(text, 'medical_council')
              }
            />
          </View>
        </View>

        <View style={Styles.UploadView}>
          <Text style={Styles.UploadText}
           testID="uploadRegistrationCertificatesText"
           accessibilityLabel="uploadRegistrationCertificatesText">
            {t('PROFILE.UPLOADREGISTRATIONCERTIFICATES')}
          </Text>

          <View style={Styles.CertificateIcon}>
            {this.state.pdfpath == '' ? (
              <TouchableOpacity onPress={() => this.setImage()}
              testID="fileSelectTouch"
              accessibilityLabel="fileSelectTouch">
                <FileSelector
                 testID="fileSelector"
                 accessibilityLabel="fileSelector"
                  ref={this.fileSelRef}
                  onSelection={this.handleSelection}
                  selectAny
                />
                <View>
                  <CertificateIcon 
                   testID="certificateIcon"
                   accessibilityLabel="certificateIcon"/>
                </View>
              </TouchableOpacity>
            ) : (
              <View>
                <Icon
                 testID="pdfIcon"
                 accessibilityLabel="pdfIcon"
                  name="file-pdf-o"
                  size={25}
                  style={{color: APP_PRIMARY_COLOR}}
                />
              </View>
            )}
          </View>
        </View>

        {/* Qualification/NextButton */}
        <View style={Styles.QualificationButtonView}>
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
      </View>
    );
  }
  render() {
    return (
      <Container>
        {this.Header()}
        <Content>{this.QualificationSection()}</Content>
        <FileSelector
          ref={this.imgRef}
          onSelection={this.handleSelection}
          selectAny
          includeBase64
        />
      </Container>
    );
  }
}

export default withTranslation()(ExperienceScreen);
