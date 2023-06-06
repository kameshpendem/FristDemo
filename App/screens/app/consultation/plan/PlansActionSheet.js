import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Right, Left} from 'native-base';
import Close from '../../../../assets/images/close.png';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SliderCustomLabel from './SliderCustomLabel';
import {Divider} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

const textTransformerTimes = (value) => {
  return value === 0 ? '0' : (value < 150 ? value : value - 0) + (value < 150);
};
const TIME = {min: 0, max: 150};
const SliderPad = 20;

const PlansActionSheet = ({navigation, actionSheetRef}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const {min, max} = TIME;
  const [width, setWidth] = useState(280);
  const [selected, setSelected] = useState(null);

  if (!selected) {
    setSelected([min, max]);
  }

  // Callbacks
  const onLayout = (event) => {
    setWidth(event.nativeEvent.layout.width - SliderPad * 2);
  };
  const onValuesChangeFinish = (values) => {
    setSelected(values);
  };
  return (
    <View style={{padding: 20}}>
      <View style={styles.row}>
        <Text style={styles.head}>Add Health Monitor</Text>
        <Right>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.setModalVisible(false)}>
            <Image source={Close} style={styles.closeImage} />
          </TouchableOpacity>
        </Right>
      </View>
      <View style={styles.vertical}>
        <Text>select Type</Text>
        <Picker note mode="dropdown" selectedValue={selectedLanguage}>
          <Picker.Item label="Thyroid Health Monitor" value="key0" />
          <Picker.Item label="Thyroid Health Monitor" value="key1" />
        </Picker>
        <Divider style={styles.divide} />
      </View>

      <View style={styles.vertical}>
        <Text style={styles.head}>Define Thresholds</Text>
        <View style={[styles.row, styles.vertical]}>
          <View style={styles.page}>
            <Text>Total Tri Ioddothyronine (T3)</Text>
          </View>

          <View onLayout={onLayout} style={styles.slider}>
            <MultiSlider
              min={min}
              max={max}
              allowOverlap
              values={selected}
              sliderLength={width}
              onValuesChangeFinish={onValuesChangeFinish}
              enableLabel={true}
              customLabel={SliderCustomLabel(textTransformerTimes)}
              trackStyle={{
                height: 10,
                borderRadius: 5,
              }}
              markerOffsetY={5}
              selectedStyle={{
                backgroundColor: '#1DDF78',
              }}
              unselectedStyle={{
                backgroundColor: '#EBF1F2',
              }}
            />
          </View>
        </View>
        <View style={[styles.row, styles.vertical]}>
          <View style={styles.page}>
            <Text> Total Thyroxine(T4)</Text>
          </View>

          <View onLayout={onLayout} style={styles.slider}>
            <MultiSlider
              min={min}
              max={max}
              allowOverlap
              values={selected}
              sliderLength={width}
              onValuesChangeFinish={onValuesChangeFinish}
              enableLabel={true}
              customLabel={SliderCustomLabel(textTransformerTimes)}
              trackStyle={{
                height: 10,
                borderRadius: 5,
              }}
              markerOffsetY={5}
              selectedStyle={{
                backgroundColor: '#1DDF78',
              }}
              unselectedStyle={{
                backgroundColor: '#EBF1F2',
              }}
            />
          </View>
        </View>
        <View style={[styles.row, styles.vertical]}>
          <View style={styles.page}>
            <Text>Thyroid Stimulating Hormone (TSH)</Text>
          </View>

          <View onLayout={onLayout} style={styles.slider}>
            <MultiSlider
              min={min}
              max={max}
              allowOverlap
              values={selected}
              sliderLength={width}
              onValuesChangeFinish={onValuesChangeFinish}
              enableLabel={true}
              customLabel={SliderCustomLabel(textTransformerTimes)}
              trackStyle={{
                height: 10,
                borderRadius: 5,
              }}
              markerOffsetY={5}
              selectedStyle={{
                backgroundColor: '#1DDF78',
              }}
              unselectedStyle={{
                backgroundColor: '#EBF1F2',
              }}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.generate}>
        <Text style={styles.generatetext}>Comfirm Addition</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlansActionSheet;
const styles = StyleSheet.create({
  generate: {
    backgroundColor: '#04A6D6',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  generatetext: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeImage: {width: 12, height: 12},
  slider: {flex: 1, paddingLeft: 20, marginTop: -15},
  row: {flexDirection: 'row'},
  vertical: {marginVertical: 10},
  page: {flex: 1},
  divide: {height: 1, backgroundColor: '#e1e8ee'},
  head: {fontWeight: 'bold', fontSize: 16},
});
