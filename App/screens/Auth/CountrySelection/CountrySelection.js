import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {List, ListItem, Left, Right, Icon} from 'native-base';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';

import {getEnvironmentObject} from '../../../config/Config';

import CheckActiveIcon from '../../HomeScreen/ImageComponents/CheckActiveIcon';
import {styles} from './CountrySelectionStyles';
import AuthUtils from '../../../utils/AuthUtils';
import i18n from '../../../../i18n';

const CountrySelection = (props) => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedCountryValue, setSelectedCountryValue] = useState('');
  const [isCountrySelected, setIsCountrySelected] = useState(false);

  const countriesList = [
    {id: 1, label: 'India', value: 'in'},
    {id: 2, label: 'Sri Lanka', value: 'sl'},
    // {id: 3, label: 'Mexico', value: 'mx'},
    // {id: 3, label: 'Jamaica', value: 'jm'},
    // {id: 4, label: 'Canada', value: 'cnd'},
  ];

  const init = async () => {
    const country = await AuthUtils.getUserCountry();
    setSelectedCountryValue(country);
    setIsCountrySelected(country ? true : false);
  };

  React.useEffect(() => {
    init();
  }, []);

  const closeModel = (item) => {
    setTimeout(() => {
      setModalVisible(true);
      props?.action(item);
    }, 2000);
  };

  const onPress = async (item) => {
    global.selectedCountryLabel = item?.label;
    AuthUtils.setUserCountry(item?.value);
    await getEnvironmentObject();
    setSelectedIndex(item?.id);
    setSelectedCountryValue(item?.value);
    closeModel(item);
  };

  return (
    <Modal
      isVisible={modalVisible}
      backdropOpacity={0.6}
      style={styles.modalStyles}>
      <View style={styles.modalView}>
        <List>
          <ListItem>
            <Left>
              <Text style={styles.countryInfoLabel} testID="chooseCountry">
                {i18n.t('PROFILE.CHOOSE_COUNTRY')}
              </Text>
            </Left>
            <Right>
              {isCountrySelected && (
                <Icon
                 testID="countryIcon"
                 accessibilityLabel="countryIcon"
                  style={styles.closeIconImg}
                  size={30}
                  name="close"
                  onPress={() => closeModel('')}
                />
              )}
            </Right>
          </ListItem>

          {countriesList?.map((item) => (
            <ListItem
              key={item?.id}
              onPress={() => onPress(item)}
              style={selectedIndex === item?.id && styles.selectedItem}>
              <Left>
                <Text style={styles.countryNameLabel}>{item.label}</Text>
              </Left>
              <Right>
                {(selectedIndex === item?.id ||
                  selectedCountryValue === item?.value) && <CheckActiveIcon />}
              </Right>
            </ListItem>
          ))}
        </List>
      </View>
    </Modal>
  );
};

export default CountrySelection;
