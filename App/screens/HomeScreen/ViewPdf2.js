import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  View,
  Text,
  BackHandler,
  PermissionsAndroid,
  NativeModules,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {Footer, FooterTab} from 'native-base';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
var SpiroReact = NativeModules.SpiroReact;
// import Orientation from 'react-native-orientation-locker';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import {getApiUrl} from '../../config/Config';
import i18n from '../../../i18n';

const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;
global.twilioviewpdf=false
export default class ViewPdf2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.navigation.state.params.link,
      page: 1,
      scale: 1,
      buttonValue: false,
      numberOfPages: 0,
      horizontal: false,
      width: WIN_WIDTH,
      profile_pic: this.props.navigation.state.params.profile_pic,
      isLoading: false,
    };
    this.pdf = null;
  }

  _onOrientationDidChange = (orientation) => {
    if (orientation == 'LANDSCAPE-LEFT' || orientation == 'LANDSCAPE-RIGHT') {
      this.setState({
        width: WIN_HEIGHT > WIN_HEIGHT ? WIN_HEIGHT : WIN_WIDTH,
        horizontal: true,
      });
    } else {
      this.setState({
        width: WIN_HEIGHT > WIN_HEIGHT ? WIN_HEIGHT : WIN_WIDTH,
        horizontal: false,
      });
    }
  };

  // componentDidMount() {
  //     Orientation.addOrientationListener(this._onOrientationDidChange);
  // }

  // componentWillUnmount() {
  //     Orientation.removeOrientationListener(this._onOrientationDidChange);
  // }
  downloadfile = async (link) => {
    if (Platform.OS === 'android') {
      //  alert(responsedata)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      this.setState({isLoading: true});
      if (link == '') {
        alert(i18n.t('VIEW_PDF.PDF_NOT_AVAILABLE'));
      } else {
        if (granted) {
          linkname = link.split('/');
          const {config, fs} = RNFetchBlob;
          let downloaddir = fs.dirs.DownloadDir;
          let pathdetails = linkname[5].includes('.pdf')
            ? downloaddir + '/' + linkname[5]
            : downloaddir + '/' + linkname[5] + '.pdf';

          let filePath = null;
          let options = {
            // add this option that makes response data to be stored as a file, this is much
            // more performant.
            addAndroidDownloads: {
              useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
              notification: true,
              path: pathdetails,
              description: 'Downloading image.',
              title: linkname[5] + '.pdf',
              mime: 'application/pdf',
            },
            fileCache: true,
          };
          //  alert(JSON.stringify(options))

          let responsedata = await config(options)
            .fetch('GET', link)
            .then((resp) => {
              console.log(JSON.stringify(resp));
              filePath = resp.path();
              return resp.readFile('base64');
            })
            .then(async (base64Data) => {
              this.setState({buttonValue: true});
              // base64Data = `data:'application/pdf';base64,` + base64Data;
              this.setState({isLoading: false});
              SpiroReact.share(
                base64Data,
                linkname[5].includes('.pdf')
                  ? linkname[5]
                  : linkname[5] + '.pdf',
              );
              // await Share.share({ message:"hi",url: base64Data });
              // remove the image or pdf from device's storage
              //await fs.unlink(filePath);
            });
        } else {
          console.log('ACCESS_FINE_LOCATION permission denied');
        }
      }
    }
    if (Platform.OS === 'ios') {
      if (link == '') {
        alert(i18n.t('VIEW_PDF.PDF_NOT_AVAILABLE'));
      } else {
        linkname = link.split('/');
        const {dirs} = RNFetchBlob.fs;
        const dirToSave =
          Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
        let pathdetails = linkname[5].includes('.pdf')
          ? dirToSave + '/' + linkname[5]
          : dirToSave + '/' + linkname[5] + '.pdf';
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
          .then((resp) => {
            console.log(JSON.stringify(resp) + '@sandyy');
            RNFetchBlob.fs.writeFile(configfb.path, resp.path(), 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          });
      }
    }
  };
  sharereport = async (link) => {
    let linkname = link.split('/');
    //   alert('GOT RESULT', linkname);
    const {config, fs} = RNFetchBlob;
    let downloaddir = fs.dirs.DownloadDir;
    let pathdetails = linkname[5].includes('.pdf')
      ? downloaddir + '/' + linkname[5]
      : downloaddir + '/' + linkname[5] + '.pdf';
    // alert("called");
    await fs.readFile(pathdetails, 'base64').then((result) => {
      //alert('GOT RESULT2', result);
      SpiroReact.share(
        result,
        linkname[5].includes('.pdf') ? linkname[5] : linkname[5] + '.pdf',
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
  componentDidMount = async () => {
    let data = getApiUrl() + '/' + this.state.link;
    let linkname = this.state.link.includes('https')
      ? this.state.link
      : data.split('/');

    ///alert(JSON.stringify(linkname))
    const {config, fs} = RNFetchBlob;
    let downloaddir = fs.dirs.DownloadDir;
    let pathdetails = linkname[5].includes('.pdf')
      ? downloaddir + '/' + linkname[5]
      : downloaddir + '/' + linkname[5] + '.pdf';

    if (await fs.exists(pathdetails)) {
      // afterwards enable below line to true
      //   this.setState({buttonValue:true})
      console.log('12345' + downloaddir);
      console.log(
        linkname[5].includes('.pdf')
          ? downloaddir + '/' + linkname[5]
          : downloaddir + '/' + linkname[5] + '.pdf',
      );
      await fs.unlink(
        linkname[5].includes('.pdf')
          ? downloaddir + '/' + linkname[5]
          : downloaddir + '/' + linkname[5] + '.pdf',
      );

      this.setState({buttonValue: false});
      //alert("available")
    } else {
      this.setState({buttonValue: false});
      //alert("not available")
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  renderButton(url) {
    //   alert(this.state.buttonValue)
    if (this.state.buttonValue) {
      return (
        <TouchableOpacity
          style={{paddingVertical: 15, marginHorizontal: 20}}
          onPress={() => this.sharereport(url)}>
          <Text style={{textAlign: 'center', color: '#fff', fontWeight: '700'}}>
            {i18n.t('COMMON.SHARE')}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={{paddingVertical: 15, marginHorizontal: 20}}
        onPress={() => this.downloadfile(url)}>
        <Text style={{textAlign: 'center', color: '#fff', fontWeight: '700'}}>
        {i18n.t('COMMON.SHARE')}
        </Text>
      </TouchableOpacity>
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress());
  }

  handleBackPress = () => {
    // alert("viewpdf2"+this.props.navigation.state.params.branch_id)
    // global.twilioviewpdf=true
    {global.twilioconnected?
      Alert.alert('Please Disconnect the Healpha Call with', global.twiliopatienname, [
        {
          text: 'OK',
          onPress: () => console.log("disconnect"),
        },
      ]):
    // alert('Disconnect the Healpha Call with '+global.twiliopatienname):
    this.props.navigation.pop(2)}
    //    if(global.screen=="dashboard"){
    //    this.props.navigation.navigate("HomeScreen",
    //   ///this.props.navigation.navigate("LandingPage",
    //   {
    //  branch_id:this.props.navigation.state.params.branch_id,
    //      branch_name:this.props.navigation.state.params.branch_name
    //   }
    //   )
    // }
    // if(global.screen=="timelene")
    // {
    //     this.props.navigation.navigate('OldPatient',
    //     {
    //         docid:global.doctor_id,
    //         branch_id:this.props.navigation.state.params.branch_id,
    //         profile_pic:this.props.navigation.state.params.profile_pic
    //     })
    // }
    return true;
  };

  prePage = () => {
    let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
    this.pdf.setPage(prePage);
    console.log(`prePage: ${prePage}`);
  };

  nextPage = () => {
    let nextPage =
      this.state.page + 1 > this.state.numberOfPages
        ? this.state.numberOfPages
        : this.state.page + 1;
    this.pdf.setPage(nextPage);
    console.log(`nextPage: ${nextPage}`);
  };

  zoomOut = () => {
    let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
    this.setState({scale: scale});
    console.log(`zoomOut scale: ${scale}`);
  };

  zoomIn = () => {
    let scale = this.state.scale * 1.2;
    scale = scale > 3 ? 3 : scale;
    this.setState({scale: scale});
    console.log(`zoomIn scale: ${scale}`);
  };

  switchHorizontal = () => {
    this.setState({horizontal: !this.state.horizontal, page: this.state.page});
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{i18n.t('HELP.VIEW_PDF.DOWNLOADING')}</Text>
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    let source = {
      uri: this.state.link.includes('https')
        ? this.state.link
        : getApiUrl() + '/' + this.state.link,
      cache: false,
    };
    //let source = require('./test.pdf');  // ios only
    //let source = {uri:'bundle-assets://test.pdf'};

    //let source = {uri:'file:///sdcard/test.pdf'};

    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, width: this.state.width}}>
          <Pdf
            ref={(pdf) => {
              this.pdf = pdf;
            }}
            source={source}
            scale={this.state.scale}
            horizontal={this.state.horizontal}
            onLoadComplete={(
              numberOfPages,
              filePath,
              {width, height},
              tableContents,
            ) => {
              this.setState({
                numberOfPages: numberOfPages,
              });
              console.log(`total page count: ${numberOfPages}`);
              console.log(tableContents);
            }}
            onPageChanged={(page, numberOfPages) => {
              this.setState({
                page: page,
              });
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            style={{flex: 1}}
          />
          <Footer style={{backgroundColor: APP_PRIMARY_COLOR}}>
            <FooterTab
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                justifyContent: 'center',
              }}>
              {this.renderButton(source.uri)}
            </FooterTab>
          </Footer>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  btn: {
    margin: 2,
    padding: 2,
    backgroundColor: 'aqua',
  },
  btnDisable: {
    margin: 2,
    padding: 2,
    backgroundColor: 'gray',
  },
  btnText: {
    margin: 2,
    padding: 2,
  },
});
