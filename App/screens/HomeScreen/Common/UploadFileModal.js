import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  FlatList,
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Icon, Item, Input, Textarea, Toast} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImageResizer from 'react-native-image-resizer';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';

import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import FileSelector from '../../../components/fileselector/FileSelector';
import getBaseUrl from '../../../config/Config';

class UploadFileModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doctor_name: '',
      fileName: '',
      pdfPath: '',
      selectedFiles: [],
      selectedFilesPath: [],
      notes: '',
      selecting: false,
      saving: false,
      loading: false,
      uploadedFiles: [],
    };

    this.onFileNameChange = this.onFileNameChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.convertToPdf = this.convertToPdf.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.viewFile = this.viewFile.bind(this);
    this.imgSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const doctor_name = await AsyncStorage.getItem('doctorname');
    this.setState({doctor_name});
    this.getFiles();
  };

  getFiles() {
    this.setState({loading: true});
    fetch(getBaseUrl() + 'get_images_byencounter/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enc_id: this.props.enc_id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({uploadedFiles: response.message});
        this.setState({loading: false});
      })
      .catch((error) => {
        console.error(error);
        this.setState({loading: false});
      });
  }

  onFileNameChange(fileName) {
    this.setState({fileName});
  }

  onNotesChange(notes) {
    this.setState({notes});
  }

  handleSelection(images) {
    if (images && images.length) {
      this.uploadFile(images[0]);
    }
  }

  renderAlertPopUp() {
    const {t} = this.props;
    return Alert.alert(
      t('PROFILE.ADD_MORE_FILES'),
      t('PROFILE.ADD_SUB_SUB_TEXT'),
      [
        {
          text: t('PROFILE.NO'),
          onPress: () => {
            return;
          },
        },
        {
          text: t('PROFILE.YES'),
          onPress: () => {
            console.log('opening picker');
            this.imgSelRef.current.openPicker();
          },
          style: 'cancel',
        },
      ],
    );
  }

  uploadFile(file) {
    const selectedFiles = this.state.selectedFiles;
    selectedFiles.push(file);
    this.setState({selectedFiles, selecting: true});
    ImageResizer.createResizedImage(file.path, 800, 650, 'JPEG', 50, 0)
      .then(({path, uri}) => {
        const resizedPath =
          Platform.OS === 'android' ? path : Platform.OS === 'ios' ? uri : '';

        if (resizedPath.split('.')[1] === 'pdf') {
          this.setState({pdfPath: resizedPath});
        } else {
          const selectedFilesPath = this.state.selectedFilesPath;
          selectedFilesPath.push(resizedPath);
          this.setState({selectedFilesPath});
        }
        this.setState({selecting: false});
        //  showing alert after loading files.
        this.renderAlertPopUp();
      })
      .catch((err) => {
        console.log('err', err);
        this.setState({selecting: false});
      });
  }

  convertToPdf = async () => {
    try {
      const {t} = this.props;
      if (this.state.selectedFilesPath.length <= 0) {
        Toast.show({
          text: t('MESSAGES.NO_FILES_SELECTED'),
          type: 'warning',
          duration: 5000,
        });
        return;
      } else if (!this.state.fileName) {
        Toast.show({
          text: t('MESSAGES.ENTER_FILE_NAME'),
          type: 'warning',
          duration: 5000,
        });
        return;
      } else if (!this.state.notes) {
        Toast.show({
          text: t('MESSAGES.ENTER_NOTES'),
          type: 'warning',
          duration: 5000,
        });
        return;
      }

      this.setState({saving: true});

      const options = {
        imagePaths: this.state.selectedFilesPath,
        name: this.state.fileName + '.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };

      this.setState({selectedFilesPath: []});

      const pdf = await RNImageToPdf.createPDFbyImages(options);

      this.setState({pdfPath: pdf.filePath}, () => this.saveFile());
    } catch (e) {
      console.log(e);
      this.setState({saving: false});
    }
  };

  saveFile = async () => {
    try {
      const doctorName = await AsyncStorage.getItem('doctorname');

      const payload = [
        {
          name: 'FILES',
          filename: 'consultation_pdf',
          type: 'application/pdf',
          data: RNFetchBlob.wrap(this.state.pdfPath),
        },
        {
          name: 'hlp_id',
          data: this.props.hlp_id,
        },
        {
          name: 'enc_id',
          data: this.props.enc_id,
        },
        {
          name: 'notes',
          data: this.state.notes,
        },
        {
          name: 'img_name',
          data: this.state.fileName,
        },
        {
          name: 'doc_id',
          data: this.props.doctor_id,
        },
        {
          name: 'doc_name',
          data: doctorName,
        },
      ];

      RNFetchBlob.fetch(
        'POST',
        getBaseUrl() + 'consultation_img_upload/',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
        },
        payload,
      )
        .then((response) => response.json())
        .then(async (response) => {
          Toast.show({
            text: response.message,
            type: 'success',
            duration: 5000,
          });
          this.setState({
            fileName: '',
            pdfPath: '',
            selectedFiles: [],
            selectedFilesPath: [],
            notes: '',
            saving: false,
          });
          // this.getFiles();
          this.props.onDismiss();
        })
        .catch((error) => {
          console.error(error);
          this.setState({saving: false});
        });
    } catch (e) {
      console.log(e);
      this.setState({saving: false});
    }
  };

  deleteFile(id) {
    fetch(getBaseUrl() + 'delete_images_byencounter/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enc_id: this.props.enc_id,
        id: id,
        doc_name: this.state.doctor_name,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getFiles();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  viewFile(link) {
    if (!this.props.navigation) {
      return;
    }
    this.props.onDismiss('navigate');
    this.props.navigation.navigate('ViewPdf', {
      link,
    });
  }

  renderHeader() {
    return (
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderLabel}
        testID={this.props.title+"text"}
        accessibilityLabel={this.props.title+"text"}>{this.props.title}</Text>
        <Icon
        testID="closeIcon"
        accessibilityLabel="closeIcon"
          name="close"
          type="MaterialCommunityIcons"
          onPress={this.props.onDismiss}
        />
      </View>
    );
  }

  renderContent() {
    return (
      <View>
        {this.props.upload && (
          <View>
            {this.renderInputFields()}
            <SafeAreaView style={styles.selectedFilesView}>
              <FlatList
                data={this.state.selectedFiles}
                renderItem={this.renderSelectedFiles.bind(this)}
                keyExtractor={(item) => item.timestamp}
              />
            </SafeAreaView>
          </View>
        )}
        <SafeAreaView style={styles.uploadedFilesView}>
          {this.state.loading && (
            <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
          )}
          {!this.state.loading && (
            <FlatList
              data={this.state.uploadedFiles}
              renderItem={this.renderUploadedFiles.bind(this)}
              keyExtractor={(item) => item.id}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  renderInputFields() {
    const {t} = this.props;
    return (
      <View>
        <View style={styles.uploadButtonView}>
          <Item style={styles.fileNameInput}>
            <Input
            testID="fileNameInput"
            accessibilityLabel="fileNameInput"
              placeholder={t('COMMON.FILE_NAME')}
              value={this.state.fileName}
              onChangeText={this.onFileNameChange}
            />
          </Item>
          {!this.state.selecting && (
            <Icon
            testID="fileUploadIcon"
            accessibilityLabel="fileUploadIcon"
              name="file-upload"
              type="MaterialCommunityIcons"
              onPress={() => this.imgSelRef.current.openPicker()}
              style={styles.uploadButton}
            />
          )}
          {this.state.selecting && (
            <ActivityIndicator
              size="large"
              color={APP_PRIMARY_COLOR}
              style={styles.uploadButton}
            />
          )}
        </View>
        <View>
          <Textarea
          testID="writeNotesTextArea"
          accessibilityLabel="writeNotesTextArea"
            bordered
            rowSpan={5}
            defaultValue={this.state.notes}
            onChangeText={this.onNotesChange}
            placeholder={t('COVID_MONITORING.WRITE_YOUR_NOTES_HERE')}
          />
        </View>
      </View>
    );
  }

  renderSelectedFiles({item}) {
    return (
      <View>
        <Text
        testID={item.fileName+"text"}
        accessibilityLabel={item.fileName+"text"}>{item.fileName}</Text>
      </View>
    );
  }

  renderUploadedFiles({item}) {
    return (
      <View style={styles.eachUploadedFile}>
        <View style={styles.uploadedFileName}>
          <Text
          testID={item.file_name+"text"}
          accessibilityLabel={item.file_name+"text"}>{item.file_name}</Text>
        </View>
        <View style={styles.uploadedFileActions}>
          <Icon
          testID="pdfIcon"
          accessibilityLabel="pdfIcon"
            type="FontAwesome"
            name="file-pdf-o"
            style={styles.actionIcon}
            onPress={() => this.viewFile(item.file_path)}
          />
          <Icon
           testID="trashIcon"
           accessibilityLabel="trashIcon"
            type="FontAwesome"
            name="trash"
            style={styles.actionIcon}
            onPress={() => this.deleteFile(item.id)}
          />
        </View>
      </View>
    );
  }

  renderFooter() {
    const {t} = this.props;
    return (
      <View style={styles.modalActions}>
        <Button
        testID="cancelButton"
        accessibilityLabel="cancelButton"
          light
          style={styles.modalActionCancelButton}
          onPress={this.props.onDismiss}
          disabled={this.state.saving}>
          <Text
            testID="cancelText"
            accessibilityLabel="cancelText">{t('COMMON.CANCEL')}</Text>
        </Button>
        <Button
          testID="saveButton"
          accessibilityLabel="saveButton"
          light
          style={styles.modalActionSaveButton}
          onPress={this.convertToPdf}>
          {this.state.saving && (
            <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
          )}
          {!this.state.saving && <Text>{t('COMMON.SAVE')}</Text>}
        </Button>
      </View>
    );
  }

  close = () => {
    this.props.onDismiss();
  };
  render() {
    return (
      <Modal
        animationType="fade"
        visible={this.props.visible}
        transparent={true}
        onRequestClose={() => {
          this.props.onDismiss();
        }}
        style={styles.modalPaddingAndMarginStyles}>
        <FileSelector
          ref={this.imgSelRef}
          onSelection={this.handleSelection}
          selectAny
        />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.centeredView}>
            <View style={styles.modalViewStyle}>
              {this.renderHeader()}
              {this.renderContent()}
              {this.props.upload && this.renderFooter()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalViewStyle: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 10,
    width: '80%',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileNameInput: {
    flex: 6,
  },
  uploadButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    margin: 10,
    marginLeft: 0,
    padding: 10,
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalActionCancelButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginRight: 10,
    padding: 10,
  },
  modalActionSaveButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 10,
  },
  selectedFilesView: {
    marginTop: 10,
    maxHeight: 150,
  },
  uploadedFilesView: {
    marginTop: 10,
    maxHeight: 150,
  },
  eachUploadedFile: {
    flexDirection: 'row',
    marginTop: 10,
  },
  uploadedFileName: {
    flex: 4,
  },
  uploadedFileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 2,
    paddingRight: 10,
  },
  actionIcon: {
    marginLeft: 20,
    fontSize: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  modalPaddingAndMarginStyles: {
    padding: 0,
    margin: 0,
  },
});

export default withTranslation()(UploadFileModal);
