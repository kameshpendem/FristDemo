import React, {Component} from 'react';
import {View} from 'react-native';
// import SwitchButton from './mySwitchButton';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_BLACK_COLOR,
} from '../../../themes/variable';
import SwitchButton from 'switch-button-react-native';
class SwitchButtonBilling extends Component {
  constructor() {
    super();
    this.state = {
      activeSwitch: 1,
    };
  }

  render() {
    return (
      <View>
        <SwitchButton
          onValueChange={(val) => this.setState({activeSwitch: val})} // this is necessary for this component
          text1="Value" // optional: first text in switch button --- default ON
          text2="Percent" // optional: second text in switch button --- default OFF
          switchWidth={150} // optional: switch width --- default 44
          switchHeight={44} // optional: switch height --- default 100
          switchdirection="ltr" // optional: switch button direction ( ltr and rtl ) --- default ltr
          switchBorderRadius={100} // optional: switch border radius --- default oval
          switchSpeedChange={500} // optional: button change speed --- default 100
          switchBorderColor="#d4d4d4" // optional: switch border color --- default #d4d4d4
          switchBackgroundColor={DEFAULT_SHADOW_COLOR} // optional: switch background color --- default #fff
          btnBorderColor="#00a4b9" // optional: button border color --- default #00a4b9
          btnBackgroundColor={APP_PRIMARY_COLOR} // optional: button background color --- default #00bcd4
          fontColor={DEFAULT_BLACK_COLOR} // optional: text font color --- default #b1b1b1
          activeFontColor="#fff" // optional: active font color --- default #fff
        />

        {this.state.activeSwitch === 1
          ? console.log('view1')
          : console.log('view2')}
      </View>
    );
  }
}
export default SwitchButtonBilling;
