import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  NativeModules,
  Share
} from "react-native";
import {
  Row,
  Col,
  Content,
  Container,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Thumbnail
} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import { Footer, FooterTab, FooterButton } from "native-base";
// import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import Communications from "react-native-communications";
import { APP_PRIMARY_COLOR } from "../../../themes/variable";
import i18n from "../../../../i18n";
import { doctorGetMethod } from "../../../../App/services/DoctorProfileService";
import { getApiUrl, getBaseUrl } from "../../../config/Config";
//import FooterButton from '../Common/FooterButton';
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
// import { Share } from "react-native-share";
var SpiroReact = NativeModules.SpiroReact;

class QrCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myQr: "",
      doc_name: "",
      doc_url: "",
      white_label: ""
    };
  }
  componentDidMount() {
    this.handleQrCode();
  }
  capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };
  handleQrCode = async () => {
    try {
      const response = await doctorGetMethod();
      let data = response?.data?.data.doc_qrcode;
      let data1 = response?.data?.data.white_label_prefix;
      console.log("whitelabel", data1);

      let doc_name_first = response?.data?.data?.first_name;
      let doc_name_middle = response?.data?.data?.middle_name;
      let doc_name_last = response?.data?.data?.last_name;
      doc_name_first = this.capitalize(doc_name_first);
      // doc_name_middle = this.capitalize(doc_name_middle);
      // doc_name_last = this.capitalize(doc_name_last);
      console.log("doctorname", doc_name_first);
      console.log("doctorname", doc_name_middle);
      console.log("doctorname", doc_name_last);

      let myurl = getApiUrl() + "/" + data;
      let whitelabel = getApiUrl() + "/" + data1;

      console.log("urll", myurl);
      console.log("urlll1", getApiUrl() + "/" + data);
      this.setState({
        myQr: myurl,
        doc_name: doc_name_first + " " + doc_name_middle + " " + doc_name_last,
        white_label: data1
      });
      console.log("data for doctor 123", this.state.myQr);
      console.log("docnn", this.state.doc_name);
    } catch (error) {
      console.log("error from qrcode");
    }
  };
  shareqr = async () => {
    try {
      const doctorId = await AsyncStorage.getItem("doctorid");
      let url, url1;
      console.log("docid", doctorId);
      {
        !this.state.white_label
          ? null
          : ((url1 = getApiUrl().split(".")[0]),
            (url1 = url1.split("/")[2]),
            (url = getApiUrl().replace(url1, this.state.white_label)));
      }
      await Share.share({
        title: "React Native Share",
        message:
          "Book Your Appointment with Dr. " +
          `${this.state.doc_name}` +
          " by clicking the link" +
          ` ${url}`
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, height: 100 }}
        style={{ flexDirection: "column", flex: 1 }}>
        <Container>
          <Content style={{ marginLeft: 15, marginTop: 50 }}>
            <View>
              <Thumbnail
                style={{
                  height: 250,
                  width: 250,
                  marginTop: 180,
                  marginLeft: 55
                }}
                square
                source={{ uri: this.state.myQr }}
              />
            </View>
          </Content>
        </Container>
        <TouchableOpacity onPress={() => 
           {
            !this.state.white_label
              ? null
              : this.shareqr()}
          } >
          <Footer style={{ backgroundColor: APP_PRIMARY_COLOR }}>
            <FooterTab
              style={{
                backgroundColor: APP_PRIMARY_COLOR
              }}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  marginLeft: 165,
                  marginTop: 17,
                  fontSize: 18,
                }}>
                {i18n.t("PROFILE.SHARE")}
              </Text>
            </FooterTab>
          </Footer>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default QrCode;
