import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  NUNITO_SANS_BOLD,
} from '../../../../themes/variable';
import Edit from '../../../../assets/images/edit.png';
import Med from '../../../../assets/images/medical.png';
import CT from '../../../../assets/images/img.png';
import {Divider} from 'react-native-elements';
const medicine = [
  {
    id: '1',
    medical: 'Dolo 650mg (paracetemol)',
    medicalnote: '(1 TAB,TID After Food for 3Days)',
    imaging: 'CT Scan',
  },
  {
    id: '2',
    medical: 'Dolo 650mg (paracetemol)',
    medicalnote: '(1 TAB,TID After Food for 3Days)',
    imaging: 'X Ray',
    imagingnote: 'Take Upper abdomen region',
  },
  {
    id: '3',
    medical: 'Dolo 650mg (paracetemol)',
    medicalnote: '(1 TAB,TID After Food for 3Days)',
  },
  {
    id: '4',
    medical: 'Dolo 650mg (paracetemol)',
    medicalnote: '(1 TAB,TID After Food for 3Days)',
  },
];
const Imaging = [
  {
    id: '1',
    imaging: 'CT Scan',
  },
  {
    id: '2',
    imaging: 'X Ray',
    imagingnote: 'Take Upper abdomen region',
  },
];
const ViewAddMedicine = () => {
  return (
    <View style={styles.medicine}>
      <View style={styles.medList}>
        <Text style={styles.fontName}>Medicines(05)</Text>
        <TouchableOpacity>
          <Image source={Edit} style={styles.Edit} />
        </TouchableOpacity>
      </View>
      <Divider style={styles.line} />
      <View>
        {medicine.map((i) => (
          <View style={styles.medicalMap}>
            <Image source={Med} style={styles.side} />
            <View style={styles.divideline}>
              <Text>{i.medical}</Text>
              <Text note>{i.medicalnote}</Text>
            </View>

            <Divider style={styles.line} />
          </View>
        ))}
      </View>
      <View style={styles.gap}></View>
      <View style={styles.medList}>
        <Text style={styles.fontName}>Imaging (02)</Text>
        <TouchableOpacity>
          <Image source={Edit} style={styles.Edit} />
        </TouchableOpacity>
      </View>
      <Divider style={styles.line} />
      <View>
        {Imaging.map((i) => (
          <View style={styles.medicalMap}>
            <Image source={CT} style={styles.side} />
            <View style={styles.divideline}>
              <Text style={styles.fontName}>{i.imaging}</Text>
              <Text note>{i.imagingnote}</Text>
            </View>
            <Divider style={styles.line} />
          </View>
        ))}
      </View>
      <View style={styles.gap}></View>
    </View>
  );
};

export default ViewAddMedicine;
const styles = StyleSheet.create({
  medicine: {flex: 1, backgroundColor: '#fff'},
  fontName: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
    paddingVertical: 5,
  },
  Edit: {
    marginVertical: 5,
  },
  medList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  medicalMap: {flexDirection: 'row', margin: 10},
  imageStyle: {margin: 10},
  side: {marginRight: 10, paddingVertical: 5},
  notes: {justifyContent: 'flex-start', marginTop: 10},
  divideline: {flexDirection: 'column'},
  line: {height: 1, backgroundColor: '#e1e8ee', marginVertical: 5},
  gap: {height: 15, backgroundColor: 'rgb(247,247,247)'},
});
