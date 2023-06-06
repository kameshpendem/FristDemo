import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  NativeModules,
  BackHandler,
} from 'react-native';
import {Footer, FooterTab} from 'native-base';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
var SpiroReact = NativeModules.SpiroReact;
import RNFetchBlob from 'rn-fetch-blob';
import Header from '../../common/Header';
import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
import {NativeToast} from '../../common/Toaster';
import i18n from '../../../../../i18n';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

class ViewPdfScreen extends Component {
  constructor(props) {
    super(props);
    this.pdf = null;
    this.state = {
      path: null,
      buttonValue: false,
      link: this.props.navigation.state.params.link,
      datelink: this.props.navigation.state?.params?.link.includes('.pdf')
        ? this.props.navigation.state?.params?.link.split('.pdf')[0] +
          moment(new Date()).format('YYYYMMDDHHMMSS') +
          '.pdf'
        : this.props.navigation.state?.params?.link +
          moment(new Date()).format('YYYYMMDDHHMMSS'),
      screenname: this.props.navigation.state.params.screenname,
      isLoading: false,
      share: false,
      convert_template_id:
        this.props.navigation.state.params.convert_template_id ?  this.props.navigation.state.params.convert_template_id :'',
    };
    this.handleBackPress = this.handleBackPress.bind(this);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = async () => {
    {
      global.twilioconnected &&
      this.state.screenname == 'Prescription Generated'
        ? Alert.alert(
            i18n.t('HEALPHACALL.DISCONNECT_CALL_WITH'),
            global.twiliopatienname,
            [
              {
                text: 'OK',
                onPress: () => {
                  /*console.log("disconnect")*/
                },
              },
            ],
          )
        : this.backHandlerExit();
    }
  };
  backHandlerExit = async () => {
    global.nrmlCall = false;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'false');
    this.props.navigation.goBack(null);
    return true;
  };
  arrowBackPress() {
    // {global.twilioconnected?
    //   Alert.alert(i18n.t("HEALPHACALL.DISCONNECT_CALL_WITH"), global.twiliopatienname, [
    //     {
    //       text: 'OK',
    //       onPress: () => {/*console.log("disconnect")*/},
    //     },
    //   ]):
    //   this.props.navigation.goBack()
    //   return true;
    //   }
    this.handleBackPress;
  }
  downloadfile = async link => {
    let datelink = this.state.datelink;
    //  alert(responsedata)
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      this.setState({isLoading: true});
      if (datelink == '') {
        alert(i18n.t('BILLING.RECEIPTS.NODOWNLOAD'));
      } else {
        if (granted) {
          let linkname = datelink.split('/');
          let linklength = linkname.length;
          const {config, fs} = RNFetchBlob;
          let downloaddir =
            Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
          let pathdetails = linkname[linklength - 1].includes('.pdf')
            ? downloaddir + '/' + linkname[linklength - 1]
            : downloaddir + '/' + linkname[linklength - 1] + '.pdf';
          const titlename = linkname[linklength - 1].includes('.pdf')
            ? linkname[linklength - 1]
            : linkname[linklength - 1] + '.pdf';
          let filePath = null;
          let options = {
            // add this option that makes response data to be stored as a file, this is much
            // more performant.
            addAndroidDownloads: {
              useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
              notification: true,
              path: pathdetails,
              description: 'Downloading image.',
              title: titlename,
              mime: 'application/pdf',
            },
            fileCache: true,
          };
          //  alert(JSON.stringify(options))

          let responsedata = await config(options)
            .fetch('GET', link)
            .then(resp => {
              console.log(JSON.stringify(resp));
              filePath = resp.path();
              return resp.readFile('base64');
            })
            .then(async base64Data => {
              this.setState({buttonValue: true});
              // base64Data = `data:'application/pdf';base64,` + base64Data;
              this.setState({isLoading: false});
              SpiroReact.share(
                base64Data,
                linkname[linklength - 1].includes('.pdf')
                  ? linkname[linklength - 1]
                  : linkname[linklength - 1] + '.pdf',
              );
              // await Share.share({ message:"hi",url: base64Data });
              // remove the image or pdf from device's storage
              //await fs.unlink(filePath);
            })
            .catch(res => {
              // NativeToast({ text: res.message, type: "warning" });

              console.log(res, 'errrororororor');
            });
        } else {
          console.log('ACCESS_FINE_LOCATION permission denied');
        }
      }
    }
    if (Platform.OS === 'ios') {
      if (datelink == '') {
        alert(i18n.t('BILLING.RECEIPTS.NODOWNLOAD'));
      } else {
        let linkname = datelink.split('/');
        let linklength = linkname.length;
        const {dirs} = RNFetchBlob.fs;
        const dirToSave =
          Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
        let pathdetails = linkname[linklength - 1].includes('.pdf')
          ? dirToSave + '/' + linkname[linklength - 1]
          : dirToSave + '/' + linkname[linklength - 1] + '.pdf';
        const configfb = {
          fileCache: true,
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: 'Healpha',
          path: `${dirToSave}/${pathdetails}`,
        };
        const configOptions = Platform.select({
          ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: 'pdf',
          },
          android: configfb,
        });
        RNFetchBlob.config(configOptions)
          .fetch('GET', link)
          .then(resp => {
            console.log(JSON.stringify(resp));
            RNFetchBlob.fs.writeFile(configfb.path, resp.path(), 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          });
      }
    }
  };
  componentDidMount = async () => {
    let datelink = this.state.datelink;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    console.log(
      this.props.navigation.state.params,
      'this.props.navigation.state.params.link',
    );
    let linkname = this.state.datelink.split('/');
    let linklength = linkname.length;
    const {config, fs} = RNFetchBlob;
    let downloaddir =
      Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    let pathdetails = linkname[linklength - 1].includes('.pdf')
      ? downloaddir + '/' + linkname[linklength - 1]
      : downloaddir + '/' + linkname[linklength - 1] + '.pdf';

    console.log(fs, 'hello');

    if (this.props.navigation.state.params.share) {
      this.setState({
        share: this.props.navigation.state.params.share,
      });
    }

    if (await fs.exists(pathdetails)) {
      //
      await fs
        .unlink(
          linkname[linklength - 1].includes('.pdf')
            ? downloaddir + '/' + linkname[linklength - 1]
            : downloaddir + '/' + linkname[linklength - 1] + '.pdf',
        )
        .then(res => {
          console.log(res, 'then');
        })
        .catch(err => {
          console.log(err, 'errr');
        });
      this.setState({buttonValue: false});
      //alert("available")
    } else {
      this.setState({buttonValue: false});
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
  sharereport = async link => {
    let datelink = this.state.datelink;
    let linkname = this.state.datelink.split('/');
    let linklength = linkname.length;
    const {config, fs} = RNFetchBlob;
    // let downloaddir = fs.dirs.DownloadDir;
    let downloaddir =
      Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    let pathdetails = linkname[linklength - 1].includes('.pdf')
      ? downloaddir + '/' + linkname[linklength - 1]
      : downloaddir + '/' + linkname[linklength - 1] + '.pdf';
    await fs.readFile(pathdetails, 'base64').then(result => {
      console.log('GOT RESULT', result);
      SpiroReact.share(
        result,
        linkname[linklength - 1].includes('.pdf')
          ? linkname[linklength - 1]
          : linkname[linklength - 1] + '.pdf',
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
    if (this.state.buttonValue) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            paddingVertical: 15,
            marginHorizontal: 20,
          }}
          onPress={() => this.sharereport(url)}>
          <Text style={{textAlign: 'center', color: '#fff', fontWeight: '700'}}>
            {i18n.t('BILLING.RECEIPTS.SHARE')}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={{
          backgroundColor: APP_PRIMARY_COLOR,
          paddingVertical: 15,
          marginHorizontal: 20,
        }}
        onPress={() => this.downloadfile(url)}>
        <Text style={{textAlign: 'center', color: '#fff', fontWeight: '700'}}>
          {i18n.t('BILLING.RECEIPTS.SHARE')}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{i18n.t('BILLING.RECEIPTS.DOWNLOADING')}</Text>
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    let url = '';
    if (this.state.link != '') {
      url = {uri: this.state.link, cache: false};
      console.log(url, 'url');
    } else {
      Alert.alert(i18n.t('BILLING.RECEIPTS.PDFNOTGENERATED'), '', [
        {
          text: i18n.t('COMMON.OK'),
          onPress: () => this.props.navigation.goBack(),
        },
      ]);
    }
    return (
      <View style={{flex: 1}}>
        <Header
          title={this.state.screenname}
          navigation={this.props.navigation}
          convert_template_id={this.state.convert_template_id}
        />
        <Pdf
          ref={pdf => {
            this.pdf = pdf;
          }}
          source={url}
          style={{flex: 1}}
          onError={error => {
            Alert.alert(
              i18n.t('BILLING.PAYBILL.FAIL'),
              i18n.t('BILLING.RECEIPTS.NOTPDF'),
              [
                {
                  text: i18n.t('COMMON.OK'),
                  onPress: () => this.props.navigation.goBack(),
                },
              ],
            );
          }}
        />
        {this.state.share ? (
          <Footer style={{backgroundColor: APP_PRIMARY_COLOR}}>
            <FooterTab
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                justifyContent: 'center',
              }}>
              {this.renderButton(url.uri)}
            </FooterTab>
          </Footer>
        ) : null}
      </View>
    );
  }
}
export default connect()(withTranslation()(ViewPdfScreen));
// mapStateToProps,
// mapDispatchToProps
