import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from "react-native";

import { wp } from "../../../themes/Scale";
import History from "./history/History";
import Immunization from "./immunization/Immunization";
import Timeline from "./timeline/Timeline";
import Monitor from "./monitor/Monitor";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  FONT_FAMILY
} from "../../../themes/variable";
import SimpleHeader from "../common/SimpleHeader";
import Header from "../common/Header";
import Gchart from "../../HomeScreen/Immunization/Gchart";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({ backgroundColor, t, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const PatientHistoryTabs = (props) => {
  const [tabIndex, settabIndex] = useState(0);
  const { t } = props;

  useEffect(() => {
    console.log(props.patientList, "patientList from patienthistorytabs");
  }, []);

  return (
    <View>
      {/* <SimpleHeader
        navigation={props.navigation}
        title="Patient Medical History"
      /> */}
      <Header
       testID="patientMedicalHistoryHeader"
       accessibilityLabel="patientMedicalHistoryHeader"
        navigation={props.navigation}
        title={t("DASHBOARD.PATIENT_MEDICAL_HISTORY")}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: DEFAULT_WHITE_COLOR
        }}>
        <TouchableOpacity
          onPress={() => settabIndex(0)}
          style={
            tabIndex == 0
              ? { ...styles.observation, ...styles.isactive }
              : styles.observation
          }
          testID="historyTouch"
          accessibilityLabel="historyTouch">
          <Text
            style={
              tabIndex == 0
                ? { ...styles.tabText, ...styles.isTabText }
                : styles.tabText
            }
            testID="historyText"
            accessibilityLabel="historyText">
            {t("PATIENTS.HISTORY")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(1)}
          style={
            tabIndex == 1
              ? { ...styles.observation, ...styles.isactive }
              : styles.observation
          }
          testID="immunizationTouch"
          accessibilityLabel="immunizationTouch">
          <Text
            style={
              tabIndex == 1
                ? { ...styles.tabText, ...styles.isTabText }
                : styles.tabText
            }
            testID="immunizationText"
            accessibilityLabel="immunizationText">
            {t("PATIENTS.IMMUNIZATION")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(2)}
          style={
            tabIndex == 2
              ? { ...styles.observation, ...styles.isactive }
              : styles.observation
          }
          testID="healthMonitorTouch"
          accessibilityLabel="healthMonitorTouch">
          <Text
            style={
              tabIndex == 2
                ? { ...styles.tabText, ...styles.isTabText }
                : styles.tabText
            }
            testID="healthMonitorText"
            accessibilityLabel="healthMonitorText">
            {t("PATIENTS.HEALTH MONITOR")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(3)}
          style={
            tabIndex == 3
              ? { ...styles.observation, ...styles.isactive }
              : styles.observation
          }
          testID="timelineTouch"
          accessibilityLabel="timelineTouch">
          <Text
            style={
              tabIndex == 3
                ? { ...styles.tabText, ...styles.isTabText }
                : styles.tabText
            }
            testID="timelineText"
            accessibilityLabel="timelineText">
            {t("PATIENTS.TIMELINE")}
          </Text>
        </TouchableOpacity>
      </View>
      {tabIndex == 0 ? <History navigation={props.navigation} /> : null}
      {tabIndex == 1 ? <Immunization navigation={props.navigation} /> : null}
      {tabIndex == 2 ? (
        <Gchart
        testID="chart"
        accessibilityLabel="chart"
          myprops={{
            enc_id: props?.patientList?.encounter_id,
            rootNavigation: "",
            hlpid: props?.patientList?.appointment?.healpha_id,
            docid: props?.patientList?.appointment?.doc_id,
            check_status: "",
            token: "",
            screen: "",
            chief: "",
            uid: "",
            template_id: props?.patientList?.template_id,
            template_name: "",
            app_type: props?.patientList?.appointment?.appointment_type,
            patientname:
              props?.patientList?.appointment?.person_details?.full_name,
            uid2: "",
            age: props?.patientList?.appointment?.person_details?.age,
            dob: props?.patientList?.appointment?.person_details?.dob,
            gender: props?.patientList?.appointment?.person_details?.gender,
            blood: ""
          }}
        />
      ) : null}
      {tabIndex == 3 ? <Timeline navigation={props.navigation} /> : null}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PatientHistoryTabs));
const styles = StyleSheet.create({
  head: { flex: 1 },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  observation: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: DEFAULT_WHITE_COLOR
  },
  isactive: {
    borderColor: APP_PRIMARY_COLOR
  },
  tabText: {
    color: DEFAULT_GREY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  isTabText: {
    color: APP_PRIMARY_COLOR
  }
});
