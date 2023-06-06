import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  DEFAULT_BLACK_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR
} from "../../../../themes/variable";
import { wp, hp } from "../../../../themes/Scale";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CustomSwitch from "../../common/CustomSwitch";
import Search from "../../../../assets/images/search_patients.png";
import Vaccine from "./Vaccine";
import Others from "./Others";
import { TextInput } from "react-native-gesture-handler";
import useDebounce from "../../../../services/useDebounce";

function Immunization({ t, navigation }) {
  const [tab, settab] = useState(1);
  const [search, setSearch] = React.useState("");
  const onSelectSwitch = (index) => {
    settab(index);
    setSearch("");
  };

  const debouncedSearchText = useDebounce(search, 750);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: wp(10)
        }}>
        <View>
          <CustomSwitch
            selectionMode={1}
            roundCorner={true}
            option1={`${t("COVID_MONITORING.VACCINES CHART")}`}
            option2={`${t("COVID_MONITORING.OTHERS")}`}
            onSelectSwitch={onSelectSwitch}
            selectionColor={DEFAULT_SHADOW_COLOR}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: DEFAULT_GREY_COLOR,
            borderRadius: 20,
            width: wp(150),
            height: hp(45),
            backgroundColor: DEFAULT_WHITE_COLOR
          }}>
          <TextInput
          testID="vaccineNameTextInput"
          accessibilityLabel="vaccineNameTextInput"
            style={{
              border: 1,
              borderColor: DEFAULT_BLACK_COLOR,
              width: wp(120),
              paddingLeft: 5
            }}
            placeholder={`${t("COVID_MONITORING.VACCINE NAME")}`}
            value={search}
            onChangeText={(val) => setSearch(val)}
          />
          <Image
          testID="searchImage"
            source={Search}
            style={{
              width: 25,
              height: 25
            }}
          />
        </View>
      </View>

      <View>
        {tab == 1 ? (
          <Vaccine navigation={navigation} search={debouncedSearchText} />
        ) : null}
        {tab == 2 ? (
          <Others navigation={navigation} search={debouncedSearchText} />
        ) : null}
      </View>
    </View>
  );
}

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
)(withTranslation()(Immunization));

const styles = StyleSheet.create({});
