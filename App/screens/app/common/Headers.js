import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import {Icon} from 'native-base';
import back_arrow from '../../../assets/images/back_arrow.png';
import Search from '../../../assets/images/search_patients.png';
import styles from './HeadersStyles';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);


const Headers = props => {
  const {type, setSearchText, listOfpatients, searchText} = props;
  const [searchEnable, setSearchEnable] = useState(false);
  const closeMethod = async() => {
    global.search_text=''
    setSearchEnable(false);
    await setSearchText('');
    await listOfpatients();
  };
  return (
    <View style={styles.CardAlign}>
      {Platform.OS == 'ios' ? (
        <MyStatusBar
          backgroundColor={APP_PRIMARY_COLOR}
          barStyle="light-content"
        />
      ) : null}
      {!searchEnable ? (
        <View style={styles.headingStyle}>
          <View style={styles.backArrow}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image source={back_arrow} style={styles.backArrowImage} />
            </TouchableOpacity>
            <View>
              <Text
                style={
                  type == 'list_of_patients'
                    ? styles.title
                    : styles.titleDetails
                }
                testID={props.title + 'text'}
                accessibilityLabel={props.title + 'text'}>
                {props.title}
              </Text>
            </View>
            <View style={styles.search}>
              {type == 'list_of_patients' ? (
                <View style={styles.searchStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      setSearchEnable(true);
                    }}
                    testID="historyTouch"
                    accessibilityLabel="historyTouch">
                    <Image
                      source={Search}
                      style={styles.searchImage}
                      testID="searchImage"
                      accessibilityLabel="searchImage"
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.headingStyle}>
          <View style={styles.backArrow}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image source={back_arrow} style={styles.backArrowImage} />
            </TouchableOpacity>
            <View>
              <TextInput
                style={styles.searchBox}
                value={searchText}
                placeholder="Search Patients"
                onChangeText={async value => {
                  global.search_text=value
                  await setSearchText(value);
                  await listOfpatients();
                }}
              />
            </View>
            <View style={styles.close}>
              <TouchableOpacity
                onPress={() => {
                  closeMethod();
                }}
                testID="historyTouch"
                accessibilityLabel="historyTouch">
                <Icon
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                  name="close"
                  style={styles.closeImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Headers;
// const styles = StyleSheet.create({
//   statusBar: {
//     height: STATUSBAR_HEIGHT,
//   },
// });
