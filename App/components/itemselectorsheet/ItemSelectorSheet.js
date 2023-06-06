import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList  ,
  Text,
  Title
} from 'react-native';
// import { Text, Title } from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';
import {DEFAULT_LIGHT_BLUE_COLOR} from '../../themes/variable';
import { styles } from './ItemSelectorSheetStyle';


const ItemSelectorSheet = (props) => {
  const {list, title, selectedValue, isVisible, onClose, onItemPress} = props;    
  const renderListItem = ({item}) => {
    let selectedStyle = {};
    const isItemSelected = item.value === selectedValue;
    if (isItemSelected) {
      selectedStyle = {backgroundColor: DEFAULT_LIGHT_BLUE_COLOR};
    }
    return (
      <TouchableOpacity
        style={[styles.listItem, selectedStyle]}
        onPress={() => {
          if(onItemPress) {
            onItemPress(item.value)
          }          
        }}>
        <Text style={styles.listItemText}>{item.label}</Text>
        {isItemSelected && (
          <Icon style={styles.checkIcon} size={30} name="checkmark" onPress={() => onClose()}/>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        if(onClose) {
          onClose()
        }
      }}>
      <TouchableOpacity
        style={styles.modalWrapperView}
        onPress={() => {
          onClose()
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={styles.headerSec}>
              <View style={styles.titleView}>
                <Title style={styles.modalTitle}>{title}</Title>
              </View>
              <View style={styles.closeIconView}>
                <Icon style={styles.closeIconImg} size={30} name="close" onPress={() => onClose()}/>
              </View>
            </View>
            <View style={styles.listWrapper}>
              <FlatList
                data={list}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={selectedValue}                
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

export default ItemSelectorSheet;