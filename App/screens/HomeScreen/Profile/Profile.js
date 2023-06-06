import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Image,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Row, Col, Header, Left, Body, Title, Card, Toast} from 'native-base';
import moment from 'moment';
import Icon3 from 'react-native-vector-icons/Feather';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import {withTranslation} from 'react-i18next';
import Styles from '../Profile/profilestyle.js';
import {Avatar} from 'react-native-elements';
import NavRoutes from '../../../constants/NavRoutes.js';
import {doctorGetMethod} from '../../../services/DoctorProfileService.js';
import AsyncStorage from '@react-native-community/async-storage';
// utils
import {dateOfBirthFormat} from '../CovidMonitoring/Utils/DateTimeUtil';
import AwardsIcon from '../../../assets/images/Awards & Recognitions.svg';
import PublicationIcon from '../../../assets/images/publications.svg';
import ResearchIcon from '../../../assets/images/research.svg';
import PdfIcon from '../../../assets/images/pdf.svg';
// image components
import DoctorEditIcon from '../ImageComponents/DoctorEditIcon';
import DoctorNameIcon from '../ImageComponents/DoctorNameIcon';
import DoctorPhoneIcon from '../ImageComponents/DoctorPhoneIcon';
import DoctorEmailIcon from '../ImageComponents/DoctorEmailIcon';
import DoctorDobIcon from '../ImageComponents/DoctorDobIcon';
import DoctorGenderIcon from '../ImageComponents/DoctorGenderIcon';
import EducationAndExperienceIcon from '../ImageComponents/EducationAndExperienceIcon';
import English from '../../../assets/images/english.png';
import Hindi from '../../../assets/images/hindi.png';
import Telugu from '../../../assets/images/telugu.png';
import Tamil from '../../../assets/images/tamil.png';
import ViewMoreText from '../Common/ViewMoreText';

import DefaultDoctorImage from '../../../assets/images/healpha_doctor.png';
import {getApiUrl} from '../../../config/Config';

// components and urls

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile_image: '',
      profile: {},
      textShowNumbers: false,
      showViewMore: false,
      textShown: false,
      refreshing: false,
      init: true,
    };
    this.init();
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this._handleStateChang();
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = async() => {
    const {t} = this.props;
    if(this.state.profile.dob=="" || this.state.profile.gender==""){
      Toast.show({
        text: t('PROFILE.FILL_THE_DETAILS'),
        type: 'danger',
        duration: 3000,
      })
    }else if(this.state.profile.user_experience == null || this.state.profile.user_experience == ""){
      Toast.show({
        text: t('PROFILE.FILL_THE_EXPERIENCE'),
        type: 'danger',
        duration: 3000,
      })
    }else if(this.state.profile.education == null || this.state.profile.education == ""){
      Toast.show({
        text: t('PROFILE.FILL_THE_EDUCATION'),
        type: 'danger',
        duration: 3000,
      })
    }else if(this.state.profile.medical_registartion == null || this.state.profile.medical_registartion == ""){
      Toast.show({
        text: t('PROFILE.FILL_THE_REGISTERED_CERTIFICATE'),
        type: 'danger',
        duration: 3000,
      })
    }else if(this.state.profile.doc_sign == null || this.state.profile.doc_sign == ""){
      Toast.show({
        text: t('PROFILE.FILL_SIGNATURE'),
        type: 'danger',
        duration: 3000,
      })
    }else{
      await AsyncStorage.setItem("is_reg_completed", "true");
      this.props.navigation.goBack()
    }
  }
  _handleStateChang() {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    this.init();
  }

  init = async () => {
    const {t} = this.props;
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      let doctorProfileResponse = await doctorGetMethod();
      const doctorProfile = doctorProfileResponse.data.data;
      const profile_image = getApiUrl() + '/' + doctorProfile?.profile_image;
      console.log("doctorProfile",doctorProfile)
      this.setState({
        profile: doctorProfile,
        profile_image: profile_image,
      });
      this.init2()
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('PROFILE.PROFILE_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  init2 = async () => {
    const {t} = this.props;
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      let doctorProfileResponse = await doctorGetMethod();
      const doctorProfile = doctorProfileResponse.data.data;
      const profile_image = getApiUrl() + '/' + doctorProfile?.profile_image;
      console.log("doctorProfile",doctorProfile)
      this.setState({
        profile: doctorProfile,
        profile_image: profile_image,
      });
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('PROFILE.PROFILE_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.init().then(item => {
      this.setState({refreshing: false});
    });
  };

  onTextLayout(event) {
    const numberOfLines = 2;
    this.setState({
      showViewMore: event.nativeEvent.lines.length > numberOfLines,
    });
  }

  renderExperienceDetails = item => {
    return (
      <View style={{paddingTop: 5, paddingBottom: 5}}>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
            marginBottom: 0,
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: 8,
            }}>
            <EducationAndExperienceIcon />
          </View>

          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'NunitoSans-Regular',
            }}>
            {item.organization_name}
          </Text>
        </View>

        {item.designation ? (
          <View>
            <Text
              style={{
                marginLeft: 50,
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                padding: 3,
              }}>
              {item.designation}
            </Text>
          </View>
        ) : null}

        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}>
          {moment(item.from_date).format('YYYY')} -{' '}
          {moment(item.till_date).format('YYYY')}
        </Text>
      </View>
    );
  };

  renderEducationDetails = item => {
    return (
      <View style={{paddingTop: 5, paddingBottom: 5}}>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
            marginBottom: 0,
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              borderRadius: 8,
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <EducationAndExperienceIcon />
          </View>

          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'NunitoSans-Regular',
            }}>
            {item.edu_degree}
          </Text>
        </View>

        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}>
          {item.edu_college}
        </Text>
        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}>
          {item.edu_year}
        </Text>
      </View>
    );
  };

  viewPdf = pdflink => {
    this.props.navigation.navigate('ViewPdf', {
      link: pdflink,
      screenname: 'ViewPdf',
    });
  };

  renderCertificate = item => {
    return (
      <View style={{paddingTop: 5, paddingBottom: 5}}>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <TouchableOpacity
         
            onPress={() =>
                this.viewPdf(getApiUrl() + '/' + item.medical_registartion.certificate_path)
              }
            >
              <PdfIcon />
            </TouchableOpacity>
          </View>
          <Text style={{marginLeft: 8, fontSize: 14}}>
            {/* {this.state.profile.year_of_registration}, */}
            {/* {this.state.profile.medical_council}, */}
            {this.state.profile?.medical_registartion?.registration_number}
          </Text>
        </View>
      </View>
    );
  };

  renderAwardAndCertificate = item => {
    return (
      <View style={{paddingTop: 5, paddingBottom: 5}}>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <AwardsIcon style={{margin: 3}} height={20} width={20} />
          </View>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'NunitoSans-Regular',
            }}>
            {item.name}
          </Text>
        </View>

        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            marginTop: -12,
            fontFamily: 'NunitoSans-Regular',
          }}>
          {item.description}
        </Text>
        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}>
          {item.year}
        </Text>
      </View>
    );
  };

  renderEachPublications = item => {
    return (
      <View>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <PublicationIcon style={{margin: 3}} height={20} width={20} 
            testID="publicationIcon"
            accessibilityLabel="publicationIcon"/>
          </View>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'NunitoSans-Regular',
            }}
            testID={item.name+"text"}
            accessibilityLabel={item.name+"text"}>
            {item.name}
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            marginTop: -12,
            fontFamily: 'NunitoSans-Regular',
          }}
          testID={item.publication_by+"text"}
          accessibilityLabel={item.publication_by+"text"}>
          {item.publication_by}
        </Text>
        <Text
          style={{
            marginLeft: 50,
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}
          testID={item.year+"text"}
          accessibilityLabel={item.year+"text"}>
          {item.year}
        </Text>
      </View>
    );
  };

  renderEachResearch = item => {
    return (
      <View>
        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              height: 26,
              width: 26,
              backgroundColor: '#EBEBEB',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <ResearchIcon style={{margin: 3}} height={20} width={20} 
            testID="researchIcon"
            accessibilityLabel="researchIcon"/>
          </View>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'NunitoSans-Regular',
            }}
            testID={item.res_name+"text"}
            accessibilityLabel={item.res_name+"text"}>
            {item.res_name}
          </Text>
        </View>
      </View>
    );
  };

  Header() {
    const {t} = this.props;
    return (
      <Header
        androidStatusBarColor={APP_PRIMARY_COLOR}
        style={Styles.headerbgcolor}>
        <Left style={Styles.headerleft}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon3
              testID="goBackIcon"
              accessibilityLabel="goBackIcon"
              name="chevron-left"
              size={30}
              style={{color: DEFAULT_WHITE_COLOR}}
            />
          </TouchableOpacity>
          <Title
            style={Styles.headertitle}
            testID="profileTitle"
            accessibilityLabel="profileTitle">
            {t('PROFILE.PROFILE')}
          </Title>
        </Left>
        <Body></Body>
      </Header>
    );
  }

  languageText = (element, index, length) => {
    return (
      <Text>
        {element.label}
        {index !== length - 1 ? ',' : ''}
      </Text>
    );
  };

  profileDetails() {
    const {t} = this.props;
    let languages = this.state.profile.languages;
    let education = this.state.profile.education;
    let profile_image = this.state.profile?.profile_image;

    languages = languages.filter(
      (element, index, self) =>
        index === self.findIndex(object => object.label === element.label),
    );

    const image_url = getApiUrl() + '/' + profile_image.trim();

    if (education === undefined || education === '') {
      education = [];
    }

    return (
      <View>
        <Card style={Styles.profilecard}>
          <Row>
            <Col size={25}>
              <View style={{margin: 17}}>
                {profile_image ? (
                  <Image
                    testID="profileImage"
                    accessibilityLabel="profileImage"
                    style={Styles.profileImageStyles}
                    source={{uri: image_url}}
                  />
                ) : (
                  <Image
                    testID="doctorImage"
                    accessibilityLabel="doctorImage"
                    style={Styles.profileImageStyles}
                    source={DefaultDoctorImage}
                  />
                )}
              </View>
            </Col>

            <Col size={75}>
              <View style={{margin: 17}}>
                <Text
                  allowFontScaling={false}
                  style={Styles.profileText}
                  testID="nameText"
                  accessibilityLabel="nameText">
                  <Text style={{fontWeight: 'bold'}}>
                    {' '}
                    {this.state.profile.salutation}.{' '}
                    {this.state.profile.first_name}{' '}
                    {this.state.profile.middle_name}{' '}
                    {this.state.profile.last_name}
                  </Text>
                  {/* {this.state.profile.first_name}{' '}
                  {this.state.profile.middle_name}{' '}
                  {this.state.profile.last_name} */}
                </Text>
                {/* education text */}

                {education.length ? (
                  <Text
                    allowFontScaling={false}
                    style={Styles.profileText}
                    testID="educationText"
                    accessibilityLabel="educationText">
                    {education[0].edu_degree.trim()},{' '}
                    {this.state.profile.branches[0].designation}
                  </Text>
                ) : null}
                {/* specialization */}

                {this.state.profile.branches ? (
                  <Text
                    allowFontScaling={false}
                    style={Styles.profileText}
                    testID="specializationText"
                    accessibilityLabel="specializationText">
                    {this.state.profile.branches[0].specialization
                      .charAt(0)
                      .toUpperCase() +
                      this.state.profile.branches[0].specialization.slice(1)}
                    {/* {this.state.profile.specialization} */}
                  </Text>
                ) : null}
                {/*  languages sections */}
                <Text
                  allowFontScaling={false}
                  style={Styles.profileText}
                  testID="speaksText"
                  accessibilityLabel="speaksText">
                  {languages?.length ? <Text>{t('PROFILE.SPEAKS')}-</Text> : ''}
                  {!!languages?.length &&
                    languages.map((element, index) => {
                      return this.languageText(
                        element,
                        index,
                        languages.length,
                      );
                    })}
                </Text>
              </View>
            </Col>
          </Row>
        </Card>
      </View>
    );
  }

  toggleNumberOfLines = () => {
    this.setState(prevState => ({
      textShowNumbers: !prevState.textShowNumbers,
      textShown: !prevState.textShown,
    }));
  };

  renderAboutSection() {
    const {t} = this.props;
    const {numberOfLines = 4} = this.props;
    return (
      <View>
        <Card style={Styles.Aboutcard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.AboutText}
                testID="aboutText"
                accessibilityLabel="aboutText">
                {t('PROFILE.ABOUT')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                testID="about"
                accessibilityLabel="about"
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.ABOUT, {
                    about: this.state.profile.brief_text,
                  })
                }>
                <DoctorEditIcon
                  testID="editIcon"
                  accessibilityLabel="editIcon"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText"
                  accessibilityLabel="editText">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.AboutBriefText}>
            <ViewMoreText
            testID="viewMoreText"
            accessibilityLabel="viewMoreText"
              text={this.state.profile.brief_text.replace(/(<([^>]+)>)/ig, '')}
              style={Styles.Aboutstyle}
            />
          </View>
        </Card>
      </View>
    );
  }

  renderDetailsSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.detailscard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={{fontSize: 16, fontFamily: 'NunitoSans-SemiBold'}}
                testID="detailsText"
                accessibilityLabel="detailsText">
                {t('PROFILE.DETAILS')}
              </Text>
            </View>

            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    NavRoutes.PRIVATE.EDIT_DETAILS,
                    {
                      details: this.state.profile,
                    },
                  )
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon"
                  accessibilityLabel="editIcon"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText"
                  accessibilityLabel="editText">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{paddingTop: 10}}>
            <View style={Styles.detailsview}>
              <View style={Styles.Detailsicon1}>
                <DoctorNameIcon
                  testID="nameIcon"
                  accessibilityLabel="detailsText"
                />
              </View>
              <Text
                style={Styles.Detailsicon1Text}
                testID="nameText"
                accessibilityLabel="nameText">
                {this.state.profile.salutation}. {this.state.profile.first_name}{' '}
                {this.state.profile.middle_name} {this.state.profile.last_name}
              </Text>
            </View>

            {this.state.profile.phone_no ? (
              <View style={Styles.detailsview}>
                <View style={Styles.Detailsicon2}>
                  <DoctorPhoneIcon
                    testID="phoneIcon"
                    accessibilityLabel="phoneIcon"
                  />
                </View>
                <Text
                  style={Styles.Detailsicon2Text}
                  testID="phoneNumberText"
                  accessibilityLabel="phoneNumberText">
                  {this.state.profile.phone_code} {this.state.profile.phone_no}
                </Text>
              </View>
            ) : null}

            {this.state.profile.email ? (
              <View style={Styles.detailsview}>
                <View style={Styles.Detailsicon1}>
                  <DoctorEmailIcon
                    testID="emailIcon"
                    accessibilityLabel="emailIcon"
                  />
                </View>
                <Text
                  style={Styles.Detailsicon1Text}
                  testID="emailText"
                  accessibilityLabel="emailText">
                  {this.state.profile.email}
                </Text>
              </View>
            ) : null}

            <View style={Styles.detailsview}>
              <View style={Styles.Detailsicon1}>
                <DoctorDobIcon
                  testID="dateOfBirthIcon"
                  accessibilityLabel="dateOfBirthIcon"
                />
              </View>
              <Text
                style={Styles.Detailsicon1Text}
                testID="dateText"
                accessibilityLabel="dateText">
                {this.state.profile.dob &&
                  // dateOfBirthFormat(this.state.profile.dob)}
                  moment(this.state.profile.dob).format('DD-MMM-YYYY')}
              </Text>
            </View>

            <View style={Styles.detailsview}>
              <View style={Styles.Detailsicon1}>
                <DoctorGenderIcon
                  testID="genderIcon"
                  accessibilityLabel="genderIcon"
                />
              </View>
              <Text
                style={Styles.Detailsicon1Text}
                testID="genderText"
                accessibilityLabel="genderText">
                {this.state.profile.gender &&
                  this.state.profile.gender.charAt(0).toUpperCase() +
                    this.state.profile.gender.slice(1)}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    );
  }

  renderExperiences = () => {
    const exp = this.state.profile.user_experience;
    if (exp !== undefined && exp !== '') {
      if (Array.isArray(exp) && exp.length) {
        return exp.map((element, index) =>
          this.renderExperienceDetails(element),
        );
      }
    }

    return;
  };

  renderEducations = () => {
    const education = this.state.profile.education;
    if (education !== undefined && education !== '') {
      if (education.length) {
        return education.map((element, index) =>
          this.renderEducationDetails(element),
        );
      }
    }

    return;
  };

  renderExperienceSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.experiencecard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="experiencesText"
                accessibilityLabel="experiencesText">
                {t('PROFILE.EXPERIENCES')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.EXPERIENCE, {
                    experienceArray: this.state.profile.user_experience,
                    details: this.state.profile,
                  })
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon3"
                  accessibilityLabel="editIcon3"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText3"
                  accessibilityLabel="editText3">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1}}>{this.renderExperiences()}</View>
        </Card>
      </View>
    );
  }

  renderEducationSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.educationcard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="educationText"
                accessibilityLabel="educationText">
                {t('PROFILE.EDUCATION')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    NavRoutes.PRIVATE.QUALIFICATION,
                    {
                      qualificationArray: this.state.profile.education,
                      details: this.state.profile,
                    },
                  )
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon4"
                  accessibilityLabel="editIcon4"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText4"
                  accessibilityLabel="editText4">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>{this.renderEducations()}</View>
        </Card>
      </View>
    );
  }

  renderRegistrationCertifications = () => {
    const reg = this.state.profile;
    if (reg !== undefined && reg !== '') {
      return this.renderCertificate(reg);
      // if (reg.length) {
      //   return reg.map((element, index) => this.renderCertificate(element));
      // }
    }
  };

  registerCertificates() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="certificatesText"
                accessibilityLabel="certificatesText">
                {t('PROFILE.REGISTERED CERTIFICATES')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    NavRoutes.PRIVATE.CERTIFICATE,
                    {
                      registerCertifications: this.state.profile,
                      details: this.state.profile,
                    },
                  )
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon5"
                  accessibilityLabel="editIcon5"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText5"
                  accessibilityLabel="editText5">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            {this.renderRegistrationCertifications()}
          </View>
        </Card>
      </View>
    );
  }

  signatureSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="signatureText"
                accessibilityLabel="signatureText">
                {t('PROFILE.SIGNATURE')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.SIGNATURE, {
                    signature: this.state.profile.doc_sign==null?'':this.state.profile.doc_sign,
                  })
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon6"
                  accessibilityLabel="editIcon6"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText6"
                  accessibilityLabel="editText6">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, marginTop: 10}}>
            <Image
              style={{
                height: 80,
                width: 80,
                marginRight: 16,
                marginTop: 1,
                marginLeft: 16,
              }}
              source={{
                uri: getApiUrl() + '/' + this.state.profile.doc_sign,
              }}
            testID="signatureImage"
            accessibilityLabel="signatureImage"/>
          </View>
        </Card>
      </View>
    );
  }

  renderAwards = () => {
    const awards = this.state.profile.awards;
    if (awards !== undefined && awards !== '') {
      if (awards.length) {
        return awards.map((element, index) =>
          this.renderAwardAndCertificate(element),
        );
      }
    }
  };

  awardsAndRecognitions() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="awardsRecognitionsText"
                accessibilityLabel="awardsRecognitionsText">
                {t('PROFILE.AWARDS_RECOGNITIONS')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.AWARDS, {
                    awardsArray: this.state.profile.awards,
                    details: this.state.profile,
                  })
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon7"
                  accessibilityLabel="editIcon7"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText7"
                  accessibilityLabel="editText7">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1}}>{this.renderAwards()}</View>
        </Card>
      </View>
    );
  }

  renderPublications = () => {
    const publications = this.state.profile.publications;
    if (publications !== undefined && publications !== '') {
      if (publications.length) {
        return publications.map((element, index) =>
          this.renderEachPublications(element),
        );
      }
    }
  };

  publicActionsSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="publicationsText"
                accessibilityLabel="publicationsText">
                {t('PROFILE.PUBLICATIONS')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    NavRoutes.PRIVATE.PUBLICATIONS,
                    {
                      publicationsArray: this.state.profile.publications,
                      details: this.state.profile,
                    },
                  )
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon8"
                  accessibilityLabel="editIcon8"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText8"
                  accessibilityLabel="editText8">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>{this.renderPublications()}</View>
        </Card>
      </View>
    );
  }

  renderResearch = () => {
    const research = this.state.profile.researches;
    if (research !== undefined && research !== '') {
      if (research.length) {
        return research.map((element, index) =>
          this.renderEachResearch(element),
        );
      }
    }
  };

  researchSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={Styles.experienceText}
                testID="researchText"
                accessibilityLabel="researchText">
                {t('PROFILE.REASERCH')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.RESEARCH, {
                    researchArray: this.state.profile.researches,
                    details: this.state.profile,
                  })
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon9"
                  accessibilityLabel="editIcon9"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText9"
                  accessibilityLabel="editText9">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1}}>{this.renderResearch()}</View>
        </Card>
      </View>
    );
  }

  renderLanguageSource = item => {
    if (item.toLowerCase() === 'english') {
      return English;
    } else if (item.toLowerCase() === 'hindi') {
      return Hindi;
    } else if (item.toLowerCase() === 'telugu') {
      return Telugu;
    } else if (item.toLowerCase() === 'tamil') {
      return Tamil;
    } else {
      return '';
    }
  };

  returnLanguage = item => {
    return (
      <View style={Styles.detailsview}>
        <View style={Styles.languageicon}>
          <Image
            testID={item.label + 'icon'}
            accessibilityLabel={item.label + 'icon'}
            style={{height: 15, width: 15, margin: 5}}
            source={this.renderLanguageSource(item.label)}
          />
        </View>
        <Text
          style={Styles.languageText}
          testID={item.label + 'languageText'}
          accessibilityLabel={item.label + 'languageText'}>
          {item.label}
        </Text>
      </View>
    );
  };

  speaksSection() {
    const {t} = this.props;
    let languages = this.state.profile.languages;
    if (languages === undefined || languages === '') {
      languages = [];
    } else {
      languages = languages.filter(
        (element, index, self) =>
          index === self.findIndex(object => object.label === element.label),
      );
    }
    return (
      <View>
        <Card style={Styles.certicatescard}>
          <View style={Styles.AboutView}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={{fontSize: 14, fontFamily: 'NunitoSans-SemiBold'}}
                testID="speaksText"
                accessibilityLabel="speaksText">
                {t('PROFILE.SPEAKS')}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(NavRoutes.PRIVATE.LANGUAGE, {
                    languages: this.state.profile.languages,
                  })
                }
                style={{flexDirection: 'row'}}>
                <DoctorEditIcon
                  testID="editIcon10"
                  accessibilityLabel="editIcon10"
                />
                <Text
                  style={{fontSize: 14, color: APP_PRIMARY_COLOR}}
                  testID="editText10"
                  accessibilityLabel="editText10">
                  {t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {!!languages?.length &&
            languages.map((element, index) => {
              return this.returnLanguage(element);
            })}
        </Card>
      </View>
    );
    // }
    // return;
    // }
  }
  render() {
    const profile = this.state.profile;

    if (Object.keys(profile).length > 0) {
      return (
        <View style={{backgroundColor: '#F8F8F8', flex: 1}}>
          {this.Header()}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            {this.profileDetails()}
            {this.renderAboutSection()}
            {this.renderDetailsSection()}
            {this.renderExperienceSection()}
            {this.renderEducationSection()}
            {this.registerCertificates()}
            {this.awardsAndRecognitions()}
            {this.publicActionsSection()}
            {this.researchSection()}
            {this.speaksSection()}
            {this.signatureSection()}
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={Styles.loaderView}>
        <ActivityIndicator size={'large'} color={APP_PRIMARY_COLOR} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  nonList: state.nonList.nonList,
});

export default withTranslation()(Profile);
