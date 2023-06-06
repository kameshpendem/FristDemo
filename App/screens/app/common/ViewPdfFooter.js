import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  NativeModules
} from "react-native";
import { Footer, FooterTab } from "native-base";
import Pdf from "react-native-pdf";
import RNFS from "react-native-fs";
var SpiroReact = NativeModules.SpiroReact;
import RNFetchBlob from "rn-fetch-blob";
import Header from "./Header";
import { NativeToast } from "./Toaster";
import styles from "../homescreen/HomeScreenStyles";
import i18n from "../../../../i18n";

class ViewPdfFooter extends Component {
  constructor(props) {
    super(props);
    this.pdf = null;
    this.state = {
      path: null,
      buttonValue: false,
      link: this.props.navigation.state.params.link,
      screenname: this.props.navigation.state.params.screenname,
      isLoading: false,
      patientList: this.props.navigation.state.params.patientList
    };
  }
  downloadfile = async (link) => {
    //  alert(responsedata)
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    this.setState({ isLoading: true });
    if (link == "") {
      alert("PDF not Available to Download");
    } else {
      if (granted) {
        linkname = link.split("/");
        const { config, fs } = RNFetchBlob;
        let downloaddir = fs.dirs.DownloadDir;
        let pathdetails = linkname[2].includes(".pdf")
          ? downloaddir + "/" + linkname[2]
          : downloaddir + "/" + linkname[2] + ".pdf";

        let filePath = null;
        let options = {
          // add this option that makes response data to be stored as a file, this is much
          // more performant.
          addAndroidDownloads: {
            useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification: true,
            path: pathdetails,
            description: "Downloading image.",
            title: linkname[2] + ".pdf",
            mime: "application/pdf"
          },
          fileCache: true
        };
        //  alert(JSON.stringify(options))

        let responsedata = await config(options)
          .fetch("GET", link)
          .then((resp) => {
            console.log(JSON.stringify(resp));
            filePath = resp.path();
            return resp.readFile("base64");
          })
          .then(async (base64Data) => {
            this.setState({ buttonValue: true });
            // base64Data = `data:'application/pdf';base64,` + base64Data;
            this.setState({ isLoading: false });
            SpiroReact.share(
              base64Data,
              linkname[2].includes(".pdf") ? linkname[2] : linkname[2] + ".pdf"
            );
            // await Share.share({ message:"hi",url: base64Data });
            // remove the image or pdf from device's storage
            //await fs.unlink(filePath);
          });
      } else {
        console.log("ACCESS_FINE_LOCATION permission denied");
      }
    }
  };
  componentDidMount = async () => {
    console.log(
      this.props.navigation.state.params.link,
      "this.props.navigation.state.params.link"
    );
    linkname = this.state.link.split("/");
    const { config, fs } = RNFetchBlob;
    let downloaddir = fs.dirs.DownloadDir;
    let pathdetails = linkname[2].includes(".pdf")
      ? downloaddir + "/" + linkname[2]
      : downloaddir + "/" + linkname[2] + ".pdf";

    if (await fs.exists(pathdetails)) {
      //
      await fs.unlink(
        linkname[2].includes(".pdf")
          ? downloaddir + "/" + linkname[2]
          : downloaddir + "/" + linkname[2] + ".pdf"
      );
      this.setState({ buttonValue: false });
      //alert("available")
    } else {
      this.setState({ buttonValue: false });
      //alert("not available")
    }

    //  .then((statResult) => {
    // //    if (statResult[0].isFile()) {
    // //      // if we have a file, read it
    // //      return RNFS.readFile(statResult[1], 'utf8');
    // //    }

    // alert(JSON.stringify(statResult))
    // //    return 'no file';
    //  })
  };
  sharereport = async (link) => {
    linkname = this.state.link.split("/");
    const { config, fs } = RNFetchBlob;
    let downloaddir = fs.dirs.DownloadDir;
    let pathdetails = linkname[2].includes(".pdf")
      ? downloaddir + "/" + linkname[2]
      : downloaddir + "/" + linkname[2] + ".pdf";
    // alert("called");
    await fs.readFile(pathdetails, "base64").then((result) => {
      console.log("GOT RESULT", result);
      SpiroReact.share(
        result,
        linkname[2].includes(".pdf") ? linkname[2] : linkname[2] + ".pdf"
      );
      // stat the first file
    });
    //  let res= await this.downloadfile(link);
    // console.log("final="+this.state.path);
    // Share.share({
    //     url: this.state.path,
    //     title: 'Download PDF'
    //   })
  };

  renderButton(url) {
    return (
      <View style={styles.bottomtab}>
        <TouchableOpacity
          style={styles.preview}
          onPress={() => {
            this.props.navigation.navigate("HomeScreen");
          }}>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center"
              }}>
              <Text style={styles.previewtext}>
                {i18n.t("BILLING.RECEIPTS.GOBACK")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {this.state.patientList ? this.state.patientList?.appointment?.enc_version?.enc_id ? (
          <TouchableOpacity
            style={styles.generate}
            onPress={() => {
              this.props.navigation.navigate("ViewReceipts",);
            }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center"
              }}>
              <Text style={styles.generatetext}>
                {i18n.t("BILLING.RECEIPTS.VIEWALL")}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.generate}
            disabled={true}
            onPress={() => {
              this.props.navigation.navigate("ViewReceipts");
            }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center"
              }}>
              <Text style={styles.generatetext}>
                {i18n.t("BILLING.RECEIPTS.VIEWALL")}
              </Text>
            </View>
          </TouchableOpacity>
        ):  <TouchableOpacity
        style={styles.generate}
        onPress={() => {
          this.props.navigation.navigate("ViewReceipts",);
        }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignSelf: "center",
            justifyContent: "center"
          }}>
          <Text style={styles.generatetext}>
            {i18n.t("BILLING.RECEIPTS.VIEWALL")}
          </Text>
        </View>
      </TouchableOpacity>}
      </View>
    );
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Text>Downloading...</Text>
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    let url = "";
    if (this.state.link != "") {
      url = { uri: this.state.link, cache: false };
      console.log(url, "url");
    } else {
      Alert.alert(i18n.t("BILLING.RECEIPTS.PDFNOTGENERATED"), "", [
        {
          text: i18n.t("COMMON.OK"),
          onPress: () => this.props.navigation.goBack()
        }
      ]);
    }
    return (
      <View style={{ flex: 1 }}>
        <Header
          title={this.state.screenname}
          navigation={this.props.navigation}
        />
        <Pdf
          ref={(pdf) => {
            this.pdf = pdf;
          }}
          source={url}
          style={{ flex: 1 }}
          onError={(error) => {
            Alert.alert(
              i18n.t("BILLING.PAYBILL.FAIL"),
              i18n.t("BILLING.RECEIPTS.NOTPDF"),
              [
                {
                  text: i18n.t("COMMON.OK"),
                  onPress: () => this.props.navigation.goBack()
                }
              ]
            );
          }}
        />
        {this.renderButton(url.uri)}
      </View>
    );
  }
}
export default ViewPdfFooter;
