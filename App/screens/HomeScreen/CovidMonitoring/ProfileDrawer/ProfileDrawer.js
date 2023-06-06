import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  DrawerLayoutAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, Container} from 'native-base';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import getBaseUrl from '../../../../config/Config';

import i18n from '../../../../../i18n';
// const Realm = require('realm');
// let realm;

// styles
import styles from './ProfileDrawerStyles';

// images
import Language from '../../../../assets/images/language.png';
import Practice from '../../../../assets/images/practice.png';
import ArrowSideMenu from '../../../../assets/images/arrow_side_menu.png';
import Logout from '../../../../assets/images/logout.png';
import Help from '../../../../assets/images/help_blue.png';
import Devices from '../../../../assets/images/devices.png';
import ChangePassword from '../../../../assets/images/change_password.png';
import HeAlpha from '../../../../assets/images/he_alpha_logo.png';
import SelectPractice from '../../../../assets/images/select_practice.png';
import Close from '../../../../assets/images/close.svg';

const ProfileDrawer = (props) => {
  const drawer = useRef(null);
  useEffect(() => {
    drawer.current.openDrawer();
  }, ['']);

  const {t} = useTranslation();

  const [modal, setModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);

  // realm = new Realm({
  //   schema: [
  //     {
  //       name: 'Notifications',
  //       properties: {
  //         id: {type: 'int', default: 0},
  //         hlpid: 'string',
  //         created_date: 'string',
  //         title: 'string',
  //         body: 'string',
  //       },
  //     },
  //   ],
  // });

  const changeLanguage = (lng, text) => {
    i18n.changeLanguage(lng);
    setModal(false);
    // setSelectedLanguage(text);
    setLanguageModal(!languageModal);
  };

  const settingActions = (type) => {
    if (type === 'select_practice') {
      const {handlePractice} = props?.navigation?.state?.params;
      if (typeof handlePractice === 'function') {
        handlePractice();
        props.navigation.goBack();
      }
    } else if (type === 'select_language') {
      setModal(!modal);
      setLanguageModal(!languageModal);
    }
  };
  const renderSettingsSection = (text1, text2, type, image) => {
    return (
      <View style={styles.settingSectionWrapper}>
        <TouchableOpacity onPress={() => settingActions(type)}>
          <View style={styles.flexDirectionRow}>
            <View style={styles.ImageTextSectionView}>
              <Image source={image} style={styles.ImageStyles}></Image>
              <Text style={styles.textStyles}>
                {text1}
                <Text>{text2}</Text>
              </Text>
            </View>
            <View style={styles.sideArrowSectionView}>
              <Image source={ArrowSideMenu} style={styles.sideArrowStyles} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const loggingOutPut = async (deviceRegID) => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    let putUrl = getBaseUrl() + `v1/user/device-token/${deviceRegID}`;
    fetch(putUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${deviceToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.message;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logOut = async () => {
    let url = getBaseUrl() + 'logout';
    const deviceRegID = await AsyncStorage.getItem('deviceRegID');
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    let putUrl = getBaseUrl() + `v1/user/device-token/${deviceRegID}`;
    const hlp = await AsyncStorage.getItem('doctorid');
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hlp: hlp,
        device_id: deviceRegID,
      }),
    })
      .then((response) => {
        return response.message;
      })
      .catch((error) => {
        console.error(error);
      });
    loggingOutPut(deviceRegID);
    // realm.write(() => {
    //   realm.delete([]);
    // });
    AsyncStorage.clear();
    props.navigation.navigate('SignIn');
  };
  
  const menuSectionActions = (type) => {
    if (type === 'profile') {
      props.navigation.navigate('Profile');
    } else if (type === 'devices') {
      props.navigation.navigate('listofdevices');
    } else if (type === 'change_password') {
      props.navigation.navigate('ChangePassword');
    } else if (type === 'help') {
      props.navigation.navigate('FaqScreen');
    } else if (type === 'logout') {
      logOut();
    } else if (type === 'my_practice') {
      // props.navigation.navigate('practiceapproval');
      props.navigation.navigate('MyPractice');
    } else if (type === 'leave_absence') {
      props.navigation.navigate('LeaveOrAbsence');
    }
  };
  const menuSection = (text1, type, image) => {
    return (
      <View style={styles.settingSectionWrapper}>
        <TouchableOpacity onPress={() => menuSectionActions(type)}>
          <View style={styles.flexDirectionRow}>
            <View style={styles.ImageTextSectionView}>
              <Image source={image} style={styles.ImageStyles}></Image>
              <Text style={styles.textStyles}>{text1}</Text>
            </View>
            <View style={styles.sideArrowSectionView}>
              <Image source={ArrowSideMenu} style={styles.sideArrowStyles} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const closeModal = () => {
    setLanguageModal(!languageModal);
  };

  const renderLanguages = () => {
    return (
      <View style={styles.languageMargin}>
        <TouchableOpacity
          style={styles.touchableView}
          onPress={() => changeLanguage('en', 'English')}>
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableView}
          onPress={() => changeLanguage('hi', 'हिंदी')}>
          <Text style={styles.languageText}>हिंदी</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableView}
          onPress={() => changeLanguage('te', 'తెలుగు')}>
          <Text style={styles.languageText}>తెలుగు</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLanguageModal = () => {
    return (
      <Modal
        isVisible={languageModal}
        backdropOpacity={0.5}
        onBackdropPress={() => closeModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          <View
            style={[
              styles.headerView,
              {
                paddingBottom: 5,
              },
            ]}>
            <Text style={styles.headerText}>
              {t('PROFILE.SELECT_LANGUAGE')}
            </Text>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={styles.touchableArea}
                onPress={() => closeModal()}>
                <Close height={18} width={18} style={styles.closeImage} />
              </TouchableOpacity>
            </View>
          </View>
          {renderLanguages()}
        </View>
      </Modal>
    );
  };
  const navigationView = () => (
    <Container style={styles.drawerWrapper}>
      <View style={styles.settingView}>
        <Text style={styles.settingText}>{t('PROFILE.SETTINGS')}</Text>
        <Text style={styles.changePracticeText}>
          {t('PROFILE.CHANGE_PRACTICE')}
        </Text>
        {/* select language section start*/}
        {renderSettingsSection(
          global.branch_name,
          '',
          'select_practice',
          SelectPractice,
        )}
        {renderSettingsSection(
          t('PROFILE.LANGUAGE'),
          i18n.language === 'en'
            ? 'English'
            : i18n.language === 'hi'
            ? 'हिंदी'
            : 'తెలుగు',
          'select_language',
          Language,
        )}
      </View>

      <View style={styles.menuView}>
        <Text style={styles.settingText}>{t('PROFILE.MENU')}</Text>
        {menuSection(t('PROFILE.PROFILE'), 'profile', global.profile_image)}
        {menuSection(t('PROFILE.MY_PRACTICE'), 'my_practice', Practice)}
        {menuSection(t('PROFILE.DEVICES'), 'devices', Devices)}
        {menuSection(
          t('PROFILE.CHANGE_PASSWORD'),
          'change_password',
          ChangePassword,
        )}
        {menuSection(t('PROFILE.HELP'), 'help', Help)}
        {menuSection(t('PROFILE_DRAWER.LEAVE_ABSENCE'), 'leave_absence', Help)}
      </View>
      <View style={styles.logoutSection}>
        <View style={styles.logoutAndFooterSection}>
          <TouchableOpacity
            style={styles.flex}
            onpress={() => menuSectionActions('logout')}>
            <View style={styles.flexDirectionRow}>
              <View style={styles.ImageTextSectionView}>
                <Image source={Logout} style={styles.logoutImageStyles} />
                <Text style={styles.textStyles}>{t('PROFILE.LOGOUT')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.poweredBySection}>
          <Text style={styles.poweredByText}>
            {t('PROFILE.POWERED_BY')} <Image source={HeAlpha} />
          </Text>
        </View>
      </View>
      {languageModal && renderLanguageModal()}
    </Container>
  );

  const navigate = () => {
    props.navigation.goBack();
  };

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={250}
      drawerPosition={'right'}
      renderNavigationView={navigationView}
      onDrawerClose={navigate}
      drawerBackgroundColor="rgba(0,0,0.5,0)"
    />
  );
};

export default ProfileDrawer;
