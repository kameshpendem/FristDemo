import React from 'react';
import {View, Text} from 'react-native';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';

import Vitals from './vitals';
import Subjective from './subjective';
import Objective from './objective';
import Assesment from './assessment';
import Plan from './plan';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';

function ViewText() {
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <Text>Text</Text>
    </View>
  );
}

export default createMaterialTopTabNavigator(
  {
    Vitals: Vitals,
    Subjective: Subjective,
    Objective: Objective,
    Assesment: Assesment,
    Plan: {
      screen: Plan,
      navigationOptions: {
        tabBarVisible: false,
      },
    },
  },
  {
    backBehavior: 'none',
    initialRouteName: 'Subjective',
    swipeEnabled: true,
    lazy: true,
    // pagerComponent: ViewPagerAdapter,
    tabBarOptions: {
      tabStyle: {
        // backgroundColor: 'yellow',
        padding: 0,
        height: 45,
        // margin: 1
      },
      labelStyle: {
        fontSize: 10,
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: APP_PRIMARY_COLOR,
      },
    },
  },
);
