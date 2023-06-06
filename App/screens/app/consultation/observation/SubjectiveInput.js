import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Left, Body, Right, Form, ListItem} from 'native-base';
import {Divider} from 'react-native-elements';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_RED_COLOR,
} from '../../../../themes/variable';
import CheckBox from '@react-native-community/checkbox';
import FooterButton from '../../common/FooterButton';
import {wp, hp} from '../../../../themes/Scale';
import Header from '../../common/Header';
// import Slider from '@react-native-community/slider';
import Slider from 'react-native-slider';

var DEFAULT_VALUE = 0;

class SliderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: DEFAULT_VALUE,
    };
  }

  render() {
    var value = this.state.value;

    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.caption} numberOfLines={1}>
            {this.props.caption}
          </Text>
          {/* <Text style={styles.value} numberOfLines={1}>
            {value}
          </Text> */}
        </View>
        {this._renderChildren()}
      </View>
    );
  }

  _renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if (child.type === Slider || child.type === ReactNative.Slider) {
        var value = this.state.value;
        return React.cloneElement(child, {
          value: value,
          onValueChange: (val) => this.setState({value: val}),
        });
      } else {
        return child;
      }
    });
  }
}

const SubjectiveInput = () => {
  const [notes, setNotes] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [abdomenrange, setAbdomenRange] = useState(1);
  const [shoulderange, setShoulderRange] = useState(1);
  const [chestrange, setChestRange] = useState(1);
  const [hands, setHandsRange] = useState(1);
  const [fever, setFever] = useState('');
  const [cold, setCold] = useState('');
  const [rash, setRash] = useState('');
  const [vomit, setVomit] = useState('');
  const [satisfied, setSatisfied] = useState('');
  const [well, setWell] = useState('');
  const [poor, setPoor] = useState('');
  const [bored, setBored] = useState('');
  const [boredno, setBoredno] = useState('');
  return (
    <View style={{flex: 1}}>
      <Header title="Subjective" navigation={navigation} />
      <ScrollView>
        <View>
          <Text style={{margin: 10}}>Please enter the details</Text>
          <Divider style={styles.lineStyle} />
        </View>
        <Text style={{padding: 10}}>Symptoms</Text>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(10)}}>
          <Left>
            <Text style={{marginHorizontal: wp(10)}}>Fever?</Text>
          </Left>
          <Right>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  if (fever === 'No') {
                    setFever('');
                  } else {
                    setFever('No');
                  }
                }}>
                <Text
                  style={
                    fever === 'No'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (fever === 'Mild') {
                    setFever('');
                  } else {
                    setFever('Mild');
                  }
                }}>
                <Text
                  style={
                    fever === 'Mild'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Mild
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (fever === 'High') {
                    setFever('');
                  } else {
                    setFever('High');
                  }
                }}>
                <Text
                  style={
                    fever === 'High'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  High
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (fever === 'Severe') {
                    setFever('');
                  } else {
                    setFever('Severe');
                  }
                }}>
                <Text
                  style={
                    fever === 'Severe'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Severe
                </Text>
              </TouchableOpacity>
            </View>
          </Right>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(10)}}>
          <Left>
            <Text style={{marginHorizontal: wp(10)}}>Cold {`&`} Cough</Text>
          </Left>
          <Right>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  if (cold === 'No') {
                    setCold('');
                  } else {
                    setCold('No');
                  }
                }}>
                <Text
                  style={
                    cold === 'No'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (cold === 'Mild') {
                    setCold('');
                  } else {
                    setCold('Mild');
                  }
                }}>
                <Text
                  style={
                    cold === 'Mild'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Mild
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (cold === 'High') {
                    setCold('');
                  } else {
                    setCold('High');
                  }
                }}>
                <Text
                  style={
                    cold === 'High'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  High
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (cold === 'Severe') {
                    setCold('');
                  } else {
                    setCold('Severe');
                  }
                }}>
                <Text
                  style={
                    cold === 'Severe'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Severe
                </Text>
              </TouchableOpacity>
            </View>
          </Right>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(10)}}>
          <Left>
            <Text style={{marginHorizontal: wp(10)}}>Diaper Rash</Text>
          </Left>
          <Right>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  if (rash === 'No') {
                    setRash('');
                  } else {
                    setRash('No');
                  }
                }}>
                <Text
                  style={
                    rash === 'No'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (rash === 'Mild') {
                    setRash('');
                  } else {
                    setRash('Mild');
                  }
                }}>
                <Text
                  style={
                    rash === 'Mild'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Mild
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (rash === 'High') {
                    setRash('');
                  } else {
                    setRash('High');
                  }
                }}>
                <Text
                  style={
                    rash === 'High'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  High
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (rash === 'Severe') {
                    setRash('');
                  } else {
                    setRash('Severe');
                  }
                }}>
                <Text
                  style={
                    rash === 'Severe'
                      ? {...styles.symptoms, ...styles.symptomsActive}
                      : styles.symptoms
                  }>
                  Severe
                </Text>
              </TouchableOpacity>
            </View>
          </Right>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(10)}}>
          <Left>
            <Text style={{marginHorizontal: wp(10)}}>Vomiting</Text>
          </Left>
          <Right>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    if (vomit === 'No') {
                      setVomit('');
                    } else {
                      setVomit('No');
                    }
                  }}>
                  <Text
                    style={
                      vomit === 'No'
                        ? {...styles.symptoms, ...styles.symptomsActive}
                        : styles.symptoms
                    }>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (vomit === 'Mild') {
                      setVomit('');
                    } else {
                      setVomit('Mild');
                    }
                  }}>
                  <Text
                    style={
                      vomit === 'Mild'
                        ? {...styles.symptoms, ...styles.symptomsActive}
                        : styles.symptoms
                    }>
                    Mild
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (vomit === 'High') {
                      setVomit('');
                    } else {
                      setVomit('High');
                    }
                  }}>
                  <Text
                    style={
                      vomit === 'High'
                        ? {...styles.symptoms, ...styles.symptomsActive}
                        : styles.symptoms
                    }>
                    High
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (vomit === 'Severe') {
                      setVomit('');
                    } else {
                      setVomit('Severe');
                    }
                  }}>
                  <Text
                    style={
                      vomit === 'Severe'
                        ? {...styles.symptoms, ...styles.symptomsActive}
                        : styles.symptoms
                    }>
                    Severe
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Right>
        </View>
        <View style={{flexDirection: 'row', margin: wp(20)}}>
          <View style={{flex: 1}}>
            <Text>Notes</Text>
          </View>
          <View style={{flex: 1.5}}>
            <TextInput style={styles.note} placeholder="Notes" />
          </View>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(10)}}>
          <Left>
            <Text style={{marginHorizontal: wp(10)}}>
              How do you {'\n'}feel about this?
            </Text>
          </Left>
          <Body>
            <View style={styles.textstyle}>
              <Text style={styles.symptoms}>Not Satisfied</Text>
              <Text style={styles.symptoms}>well Satisfied</Text>
            </View>
          </Body>
        </View>
        <View style={styles.textstyle}>
          <Body
            style={{
              marginLeft: wp(60),
              // marginTop: wp(5),
              alignItems: 'center',
            }}>
            <Text style={styles.symptoms}>No its poor</Text>
          </Body>
        </View>
        <View style={{flexDirection: 'row', margin: wp(20)}}>
          <View style={{flex: 1}}>
            <Text>Notes</Text>
          </View>
          <View style={{flex: 1.5}}>
            <TextInput style={styles.note} placeholder="Notes" />
          </View>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={styles.headingbg}>
          <ListItem>
            <Left>
              <Text>This is a heading</Text>
            </Left>
          </ListItem>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{padding: wp(20)}}>
          <Text>Section Title</Text>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row'}}>
          <Left>
            <Text style={{padding: wp(20)}}>Do you {'\n'}feel Bored?</Text>
          </Left>
          <Right>
            <View style={styles.textstyle}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    if (bored === 'YES') {
                      setBored('');
                    } else {
                      setBored('YES');
                    }
                  }}>
                  <Text
                    style={
                      bored === 'YES'
                        ? {...styles.yes, ...styles.yesActive}
                        : styles.yes
                    }>
                    YES
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (bored === 'NO') {
                    setBored('');
                  } else {
                    setBored('NO');
                  }
                }}>
                <Text
                  style={
                    bored === 'NO'
                      ? {...styles.yes, ...styles.yesActive}
                      : styles.yes
                  }>
                  NO
                </Text>
              </TouchableOpacity>
            </View>
          </Right>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={styles.textstyle}>
          <View style={{flex: 1, padding: wp(20)}}>
            <Text>Pain Areas</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.pain}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Muscles</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Abdomen</Text>
              </View>
            </View>
            <View style={styles.pain}>
              <View style={{flexDirection: 'row'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Chest</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Eyes</Text>
              </View>
            </View>
          </View>
        </View>
        <Divider style={styles.lineStyle} />
        <View>
          <View style={styles.textstyle}>
            <View style={{flex: 1, padding: wp(20)}}>
              <Text>Pain Areas</Text>
            </View>
            <View style={{flex: 1}}>
              <View style={styles.pain}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Muscles</Text>
              </View>
              <View style={styles.pain}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Abdomen</Text>
              </View>
              <View style={styles.pain}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Chest</Text>
              </View>
              <View style={styles.pain}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={{alignSelf: 'center'}}>Eyes</Text>
              </View>
            </View>
          </View>
        </View>
        <Divider style={styles.lineStyle} />
        <View style={{flexDirection: 'row', padding: wp(20)}}>
          <View style={{flex: 1}}>
            <Text>Pain</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginLeft: wp(-100)}}>
            <Text style={styles.direction}>1</Text>
            <Text style={styles.direction}>2</Text>
            <Text style={styles.direction}>3</Text>
            <Text style={styles.direction}>4</Text>
            <Text style={styles.direction}>5</Text>
          </View>
        </View>
        {/* <Divider style={styles.lineStyle} /> */}
        <Divider style={styles.lineStyle} />
        <View
          style={{
            flexDirection: 'row',
            marginVertical: wp(5),
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.direction}>Abdomen</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, marginTop: wp(-30), marginLeft: wp(-30)}}>
              <SliderContainer>
                <Slider
                  trackStyle={customStyles3.track}
                  thumbStyle={customStyles3.thumb}
                  minimumTrackTintColor={APP_PRIMARY_COLOR}
                  value={abdomenrange}
                  onValueChange={(value) =>
                    setAbdomenRange(parseInt(value + 1))
                  }
                />
              </SliderContainer>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: wp(5)}}>
          <View style={{flex: 1}}>
            <Text style={styles.direction}>Shoulder</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, marginTop: wp(-30), marginLeft: wp(-30)}}>
              <SliderContainer>
                <Slider
                  trackStyle={customStyles3.track}
                  thumbStyle={customStyles3.thumb}
                  minimumTrackTintColor={APP_PRIMARY_COLOR}
                  value={shoulderange}
                  onValueChange={(value) =>
                    setShoulderRange(parseInt(value + 1))
                  }
                />
              </SliderContainer>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: wp(5)}}>
          <View style={{flex: 1}}>
            <Text style={styles.direction}>Chest</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, marginTop: wp(-30), marginLeft: wp(-30)}}>
              <SliderContainer>
                <Slider
                  trackStyle={customStyles3.track}
                  thumbStyle={customStyles3.thumb}
                  minimumTrackTintColor={APP_PRIMARY_COLOR}
                  value={chestrange}
                  onValueChange={(value) => setChestRange(parseInt(value + 1))}
                />
              </SliderContainer>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: wp(5)}}>
          <View style={{flex: 1}}>
            <Text style={styles.direction}>Hands</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, marginTop: wp(-30), marginLeft: wp(-30)}}>
              <SliderContainer>
                <Slider
                  trackStyle={customStyles3.track}
                  thumbStyle={customStyles3.thumb}
                  minimumTrackTintColor={APP_PRIMARY_COLOR}
                  value={hands}
                  onValueChange={(value) => setHandsRange(parseInt(value + 1))}
                />
              </SliderContainer>
            </View>
          </View>
        </View>
        <FooterButton label="Save Data" />
      </ScrollView>
    </View>
  );
};
export default SubjectiveInput;
const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_GREY_COLOR,
  },
  label: {
    margin: 8,
  },
  symptoms: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: wp(10),
    padding: 5,
    color: DEFAULT_BLACK_COLOR,
  },
  symptomsActive: {
    borderColor: APP_PRIMARY_COLOR,
    color: APP_PRIMARY_COLOR,
  },
  option: {
    marginHorizontal: wp(10),
  },
  textInput: {
    width: 100,
    borderRadius: 5,
    padding: 5,
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  direction: {
    marginHorizontal: wp(20),
  },
  textInputNurse: {
    width: wp(230),
    borderRadius: 5,
    padding: 10,
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    marginRight: wp(25),
  },
  headingbg: {
    backgroundColor: DEFAULT_LIGHT_BLUE_COLOR,
  },
  pain: {
    flexDirection: 'row',
    marginLeft: wp(-30),
  },
  textstyle: {
    flexDirection: 'row',
    marginRight: wp(70),
    paddingVertical: wp(10),
  },
  yes: {
    width: wp(85),
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
    margin: 5,
    color: DEFAULT_BLACK_COLOR,
    // borderColor: DEFAULT_RED_COLOR,
  },
  yesActive: {
    width: wp(85),
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
    margin: 5,
    color: DEFAULT_GREEN_COLOR,
    borderColor: DEFAULT_GREEN_COLOR,
  },
  note: {
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: wp(-30),
  },
});

var customStyles3 = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
  },
  thumb: {
    width: 12,
    height: 25,
    borderRadius: 5,
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
});
