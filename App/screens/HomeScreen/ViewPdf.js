import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  PermissionsAndroid,
  NativeModules,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import moment from "moment";

const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;
var SpiroReact = NativeModules.SpiroReact;
import {Footer, Button, FooterTab} from 'native-base';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';

export default class GenericPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.navigation.state?.params?.link,
      datelink: this.props.navigation.state?.params?.link.includes('.pdf')?this.props.navigation.state?.params?.link.split('.pdf')[0]+moment(new Date()).format("YYYYMMDDHHMMSS")+'.pdf':this.props.navigation.state?.params?.link+moment(new Date()).format("YYYYMMDDHHMMSS"),
      baseUrl: this.props.navigation.state?.params?.baseUrl,
      page: 1,
      scale: 1,
      buttonValue: false,
      numberOfPages: 0,
      horizontal: false,
      width: WIN_WIDTH,
      isLoading: false,
    };
    this.pdf = null;
    this.handleBackPress = this.handleBackPress.bind(this);
    this.urlData = [];
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
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
    let datelink = this.state.datelink
    console.log('@@sss');
    if (Platform.OS === 'android') {
      //  alert(responsedata)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      this.setState({isLoading: true});
      if (datelink == '') {
        alert(i18n.t('VIEW_PDF.PDF_NOT_AVAILABLE'));
      } else {
        if (granted) {
          let linkname = datelink.split('/');
          let linklength = linkname.length
          const {config, fs} = RNFetchBlob;
          let downloaddir = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
          let pathdetails = linkname[linklength-1].includes('.pdf')
            ? downloaddir + '/' + linkname[linklength-1]
            : downloaddir + '/' + linkname[linklength-1] + '.pdf';
          console.log("unlink",pathdetails)
          const titlename= linkname[linklength-1].includes('.pdf')
          ? linkname[linklength-1]
          : linkname[linklength-1] + '.pdf';
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
          console.log(options);

          //  alert(JSON.stringify(options))
          await config(options)
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
                linkname[linklength-1].includes('.pdf')
                  ? linkname[linklength-1]
                  : linkname[linklength-1] + '.pdf',
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
      if (datelink == '') {
        alert(i18n.t('VIEW_PDF.PDF_NOT_AVAILABLE'));
      } else {
        let linkname = datelink.split('/');
        let linklength=linkname.length
        const {dirs} = RNFetchBlob.fs;
        const dirToSave =
          Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
        let pathdetails = linkname[linklength-1].includes('.pdf')
          ? dirToSave + '/' + linkname[linklength-1]
          : dirToSave + '/' + linkname[linklength-1] + '.pdf';
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
            console.log(JSON.stringify(resp));
            RNFetchBlob.fs.writeFile(configfb.path, resp.path(), 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          });
      }
    }
  };
  sharereport = async (link) => {
    let datelink = this.state.datelink

    console.log('@@ssssssss');
    let linkname = datelink.split('/');
    let linklength = linkname.length
    //   alert('GOT RESULT', linkname);
    const {config, fs} = RNFetchBlob;
    let downloaddir = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    let pathdetails = linkname[linklength-1].includes('.pdf')
      ? downloaddir + '/' + linkname[linklength-1]
      : downloaddir + '/' + linkname[linklength-1] + '.pdf';
    console.log("unlink",pathdetails)
    // alert("called");
    await fs.readFile(pathdetails, 'base64').then((result) => {
      //alert('GOT RESULT2', result);
      SpiroReact.share(
        result,
        linkname[linklength-1].includes('.pdf') ? linkname[linklength-1] : linkname[linklength-1] + '.pdf',
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
    let baseUrl = getBaseUrl();
    console.log("datelink",this.state.datelink)
    if (this.state.baseUrl) {
      baseUrl = this.state.baseUrl;
    }
    this.urlData = baseUrl.split('/api');
    let data = this.urlData[0] + '/' + this.state.datelink;
    let linkname = this.state.datelink.split('/')
    let linklength = linkname.length

    ///alert(JSON.stringify(linkname))
    const {config, fs} = RNFetchBlob;
    let downloaddir = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    let pathdetails = linkname[linklength-1].includes('.pdf')
      ? downloaddir + '/' + linkname[linklength-1]
      : downloaddir + '/' + linkname[linklength-1] + '.pdf';
    console.log("unlink",pathdetails)
    if (await fs.exists(pathdetails)) {
      // afterwards enable below line to true
      //   this.setState({buttonValue:true})
      // await fs.unlink(
      //   linkname[linklength-1].includes('.pdf')
      //     ? downloaddir + '/' + linkname[linklength-1]
      //     : downloaddir + '/' + linkname[linklength-1] + '.pdf',
      // );
      await fs.unlink(linkname[linklength-1].includes('.pdf')
      ? downloaddir + '/' + linkname[linklength-1]
      : downloaddir + '/' + linkname[linklength-1] + '.pdf')
      .then(() => {
        console.log('deleted1');
        // await fs.scanFile(linkname[linklength-1].includes('.pdf')
        // ? downloaddir + '/' + linkname[linklength-1]
        // : downloaddir + '/' + linkname[linklength-1] + '.pdf')
        //   .then((res1) => {
        //     console.log('scanned1');
        //   })
        //   .catch(err => {
        //     console.log("scaned1",err);
        //   });
      })
      .catch((err) => {         
          console.log("deleted1",err);
      })
      this.setState({buttonValue: false});
      //alert("available")
    } else {
      this.setState({buttonValue: false});
      // alert("not available")
    }
  };

  renderButton(url) {
    return (
      <Button
        style={styles.footerButtonStyles}
        onPress={() =>
          this.state.buttonValue
            ? this.sharereport(url)
            : this.downloadfile(url)
        }>
        <Text style={styles.saveButtonText}>{i18n.t('COMMON.SHARE')}</Text>
      </Button>
    );
  }
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
    //let source = require('./test.pdf');  // ios only
    //let source = {uri:'bundle-assets://test.pdf'};
    let source;
    if (this.state.link != '') {
      // url={uri:this.state.link,cache:false};
      source = {
        uri: this.state.link.includes('https')
          ? this.state.link
          : this.urlData[0] + '/' + this.state.link,
        cache: false,
      };
      console.log(source, 'sklhdfk');
    } else {
      Alert.alert(i18n.t('VIEW_PDF.PDF_NOT_GENERATED'), '', [
        {
          text: i18n.t('VIEW_PDF.OK'),
          onPress: () => this.props.navigation.goBack(),
        },
      ]);
    }
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
              console.log('kdhdkhdk');
              console.log(error);
            }}
            style={{flex: 1}}
          />
          <Footer style={styles.footerSection}>
            <View style={styles.footerSectionView}>
              {this.renderButton(source.uri)}
            </View>
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
  footerSection: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    shadowOpacity: 0.8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  footerSectionView: {
    flex: 6,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  footerButtonStyles: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: APP_PRIMARY_COLOR,
    marginTop: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DEFAULT_BACKGROUND_COLOR,
  },
});
