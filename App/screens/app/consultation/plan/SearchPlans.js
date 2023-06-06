import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Search from '../../../../assets/images/search_patients.png';
import {wp, hp} from '../../../../themes/Scale';
import {
  FONT_FAMILY,
  NUNITO_SANS_BOLD,
  ROBOTO_BOLD,
} from '../../../../themes/variable';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../../themes/variable';
import close from '../../../../assets/images/cross.png';
import {Right} from 'native-base';
import {Divider} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
// import DateRanger from '../../../../components/datePicker/DateRangePicker';

function AddImg(props) {
  const {t} = props;

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.addtext}>{props.name}</Text>
        <Right>
          <TouchableOpacity onPress={() => props.navigation.goBack()}
          testID="closeImageTouch"
          accessibilityLabel="closeImageTouch">
            <Image source={close} style={global.minimize_call?styles.crossimage1:styles.crossimage} 
            testID="closeImage"
            accessibilityLabel="closeImage"/>
          </TouchableOpacity>
        </Right>
      </View>
      <View style={styles.searchoutside}>
        <View style={styles.search}>
          <Image source={Search} style={styles.searchimg} 
          testID="searchImage"
          accessibilityLabel="searchImage"/>
          <TextInput
          testID={"input"+props.value}
          accessibilityLabel={"input"+props.value}
            value={props.value}
            placeholder={props.placeholder}
            style={styles.searchmedicine}
            onChangeText={(val) => {
              props.getData(val);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AddImg;
const styles = StyleSheet.create({
  header: {
    backgroundColor: APP_PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp(70),
    padding: 15,
  },
  headings: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },

  medicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  time: {
    marginLeft: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timing: {
    width: 'auto',
    height: 'auto',
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    padding: 5,
    borderRadius: 5,
    margin: 5,
    flexDirection: 'row',
    fontSize: 16,
  },
  custom: {padding: 7, textAlign: 'center'},
  crossimage: {
    tintColor: DEFAULT_WHITE_COLOR,
  },
  crossimage1: {
    tintColor: DEFAULT_WHITE_COLOR,
    marginRight: wp(55)
  },
  searchmedicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  addtext: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 18,
    paddingTop: 5,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  searchoutside: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 5,
  },
  search: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 10,
  },
  searchimg: {
    height: hp(25),
    width: wp(25),
    margin: 10,
  },
  addbottom: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 10,
    borderRadius: 5,
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    fontSize: 18,
  },
});
