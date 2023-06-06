import React, { Component } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
//import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import { Transition } from "react-native-reanimated";
import i18n from "i18next";

import CovidMonitoringPatientList from "../CovidMonitoringPatientList";
import CovidMonitorDashboard from "../CovidMonitoringDashboard";
import CovidMonitoringPatientView from "../CovidMonitoringPatientView";
import CovidMonitoringInitialAssessment from "../IntialsAssessment/CovidMonitoringInitialAssessment";

import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR
} from "../../../../themes/variable";

const AppStackNavigator = createStackNavigator(
  {
    CovidMonitoringPatientList: {
      screen: CovidMonitoringPatientList,
      navigationOptions: ({ navigation }) => ({
        title: i18n.t("COVID_MONITORING.TITLE"),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR
        },
        headerBackTitle: "",
        headerShown: false
      })
    },
    CovidMonitorDashboard: {
      screen: CovidMonitorDashboard,
      navigationOptions: ({ navigation }) => ({
        title: i18n.t("COVID_MONITORING.TITLE"),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR
        },
        headerBackTitle: "",
        headerShown: false
      })
    },
    CovidMonitoringPatientView: {
      screen: CovidMonitoringPatientView,
      navigationOptions: ({ navigation }) => ({
        title: i18n.t("COVID_MONITORING.TITLE"),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR
        },
        headerBackTitle: "",
        headerShown: false
        // headerLeft: () => (
        //   <HeaderBackButton
        //     tintColor={DEFAULT_WHITE_COLOR}
        //     onPress={navigation.getParam('handleBackPress', () => {})}
        //   />
        // ),
        // headerRight: () => {
        //   const togglePopover = navigation.getParam('togglePopover', () => {});
        //   const toggleUploadFileModal = navigation.getParam(
        //     'toggleUploadFileModal',
        //     () => {},
        //   );
        //   const toggleCallModal = navigation.getParam(
        //     'toggleCallModal',
        //     () => {},
        //   );
        //   return (
        //     <View style={styles.headerRight}>
        //       <TouchableOpacity onPress={() => toggleCallModal()}>
        //         <MaterialIcon name="phone" style={styles.materialIcons} />
        //       </TouchableOpacity>
        //       <TouchableOpacity onPress={() => toggleUploadFileModal()}>
        //         <MaterialIcon name="attachment" style={styles.materialIcons} />
        //       </TouchableOpacity>
        //       <TouchableOpacity
        //         ref={touchableRef}
        //         onPress={() => togglePopover(touchableRef)}>
        //         <MaterialIcon name="dots-vertical" style={styles.materialIcons} />
        //       </TouchableOpacity>
        //     </View>
        //   );
        // },
      })
    },
    CovidMonitoringInitialAssessment: {
      screen: CovidMonitoringInitialAssessment,
      navigationOptions: ({ navigation }) => ({
        title: i18n.t("COVID_MONITORING.TITLE"),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR
        },
        headerBackTitle: "",
        headerShown: false
      })
    }
  },
  {
    initialRouteName: "CovidMonitorDashboard"
  }
);

export default createAppContainer(
  createSwitchNavigator({
    Covid: AppStackNavigator
  })
);
