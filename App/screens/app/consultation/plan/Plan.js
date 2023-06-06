import React, { createRef, useEffect, useState } from "react";
import { Item, Input, Toast, Icon } from "native-base";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
  Keyboard
} from "react-native";
import { Button, Divider } from "react-native-elements";
import History from "../../../../assets/images/history.png";
import Attach from "../../../../assets/images/attach.png";
import Attachment from "../../../../assets/images/attachement.png";
import AttachClose from "../../../../assets/images/attachClose.png";
import ActionSheet from "react-native-actions-sheet";
import Modal from "react-native-modal";
import {
  CONSULTATION,
  ADDMEDICINE,
  ADDSUPPLIMENT,
  ADDLAB,
  ADDIMG,
  ADDNUR,
  ADDVACCINE
} from "../../common/Constants";
import Med from "../../../../assets/images/tab.png";
import Sup from "../../../../assets/images/supp.png";
import Lab from "../../../../assets/images/lab.png";
import Img from "../../../../assets/images/ct.png";
import Nur from "../../../../assets/images/nur.png";
import Vac from "../../../../assets/images/vacc.png";
import Camera from "../../../../assets/images/cameravacc.png";
import Edit from "../../../../assets/images/edit.png";
import ProvideVacc from "../../../../assets/images/provideVaccine.png";
import Cal from "../../../../assets/images/cal.png";
import PlansActionSheet from "./PlansActionSheet";
import moment from "moment";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  STATUS_CARD_BORDER_COLOR
} from "../../../../themes/variable";
import close from "../../../../assets/images/close.png";
import FileSelector from "../../../../components/fileselector/FileSelector";
import {
  createNotes,
  getNotesData
} from "../../../../redux/actions/addNotes_action";
import { deleteImg, getImgData } from "../../../../redux/actions/addImg_action";
import { getLabData, deleteLab } from "../../../../redux/actions/addLab_action";
import {
  getVaccineData,
  deleteVaccine,
  ProvideVaccine
} from "../../../../redux/actions/addVaccine_action";
import {
  deleteNur,
  getNursingData
} from "../../../../redux/actions/addNur_action";
import {
  deleteMedicine,
  getMedicinesAdded
} from "../../../../redux/actions/addmedicine_action";
import {
  deleteSuppliment,
  getSupplimentsAdded
} from "../../../../redux/actions/addsuppliment_action";
import {
  createAttachment,
  getAttachment,
  deleteAttachment
} from "../../../../redux/actions/addAttachment_action";
import { connect } from "react-redux";
import styles from "./AddPlanStyles";
import { withTranslation } from "react-i18next";
import ImageResizer from "react-native-image-resizer";
import RNImageToPdf from "react-native-image-to-pdf";
import AsyncStorage from "@react-native-community/async-storage";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import { DeviceEventEmitter } from "react-native";
import isArray from "../../../../utils/IsArray";
import getBaseUrl, { getApiUrl } from "../../../../config/Config";
import DatePicker from "react-native-date-picker";
import DatePicker1 from "react-native-datepicker";
import { hp } from "../../../../themes/Scale";
import ApiCall from "../../../../services/ApiCall";
import {
  getMedicineByTId,
  getSupplimentByTId,
  getLabByTId,
  getImagingByTId,
  getNursingByTId
} from "../../../../redux/actions/observation_action";
const actionSheetRef = createRef();
const fileSelRef = React.createRef();
const vaccineFileRef = React.createRef();
const serviceRef = React.createRef();
const indexofVaccine = createRef();
const vaccineId = createRef();
const attachmentref = createRef();

function Plan(props) {
  const [treatment, setTreatment] = useState("");
  const [fallow, setFallow] = useState("");
  const [vaccineData, setVaccineData] = useState([]);
  const [imagingData, setImagingData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [nursingData, setNursingData] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [suplimentData, setSuplimentData] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [mulImg, setMulImg] = useState([]);
  const [data, setData] = useState([]);
  const [enc_id, setEncId] = useState("");
  const [doc_id, setdoc_id] = useState("");
  const [hlp_id, sethlp_id] = useState("");
  const [id_val, setIdVal] = useState("");
  const [url_val, setUrlVal] = useState("");
  const [path, setPath] = useState("");
  const [attachments, setattachments] = useState([]);
  const [vaccineModal, setvaccineModal] = useState(false);
  const [dataof, setdataof] = useState([]);
  const { t, patientList, navigation, templateList } = props;
  // const [fileNameModal, setfileNameModal] = useState(false);
  const [fileName, setfileName] = useState("");
  const [open, setOpen] = useState(false);
  const [successModal, setsuccessModal] = useState(false);

  let vaccineDataRef = createRef();
  const isDataAvailble =
    !vaccineData?.length &&
    !imagingData?.length &&
    !labData?.length &&
    !nursingData?.length &&
    !medicineData?.length &&
    !suplimentData?.length;
  const AfterPrescription = props.navigation.state.params.edit;
  const GetNotesData = async (val) => {
    const NotesData = await getNotesData(val);
    // setshowButton(false);
    // console.log(NotesData, "NotesData");
    setFallow(NotesData?.follow_notes ? NotesData?.follow_notes : "");
    setTreatment(NotesData?.treatment_notes ? NotesData?.treatment_notes : "");
    setattachments(isArray(NotesData.attachments) ? NotesData.attachments : []);
  };
  const SaveNote = async () => {
    if (!treatment.trim())
      return NativeToastTop({
        text: "Required Treatment Notes!",
        type: "warning"
      });
    if (!fallow.trim())
      return NativeToastTop({
        text: "Required Follow Notes!",
        type: "warning"
      });

    const variable = {
      encounter_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id,
      treatment_notes: treatment,
      follow_notes: fallow
    };

    await createNotes(variable)
      .then((res) => {
        if (res) {
          NativeToast({ text: res.message, type: "success" });
          GetNotesData({
            enc_id: enc_id,
            doc_id: doc_id,
            hlp_id: hlp_id
          });
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const GetVaccineData = async (val) => {
    const data = await getVaccineData(val);
    setVaccineData(data?.services || []);
  };

  const GetImagingData = async (val) => {
    const imagingData = await getImgData(val);
    setImagingData(imagingData.services);
  };
  const GetNursingData = async (val) => {
    const data = await getNursingData(val);
    setNursingData(data?.services || []);
  };

  const GetLabData = async (val) => {
    const labData = await getLabData(val);
    setLabData(labData.services);
  };
  const GetMedicineData = async (val) => {
    const medicineData = await getMedicinesAdded(val);
    setMedicineData(medicineData.prescriptions);
  };
  const GetSupplimentData = async (val) => {
    const suplimentData = await getSupplimentsAdded(val);
    setSuplimentData(suplimentData.prescriptions);
  };

  const init = async (id) => {
    await getMedicineByTId({ id: id })
      .then((res) => {
        setMedicineData(res.prescriptions);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
    await getSupplimentByTId({ id: id })
      .then((res) => {
        setSuplimentData(res.prescriptions);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
    await getLabByTId({ id: id })
      .then((res) => {
        setLabData(res.services);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
    await getImagingByTId({ id: id })
      .then((res) => {
        setImagingData(res.services);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
    await getNursingByTId({ id: id })
      .then((res) => {
        setNursingData(res?.services || []);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
  };

  const uploadFile = (file) => {
    const path = file.path;
    const encounterid = enc_id;
    const id = id_val || serviceRef.current;
    const url = url_val;

    let checkFile = path.split(".");

    if (checkFile.slice(-1)[0]?.toLowerCase() === "pdf") {
      setfileName(encounterid);
      setPath(path);

      // let filename;
      // filename = encounterid + ".pdf";
      // uploadPdf(encounterid, id, url, path, filename);
      // setPdfPath(path);
    } else {
      try {
        ImageResizer.createResizedImage(path, 800, 650, "JPEG", 50, 0)
          .then(({ path }) => {
            // setPath(path);
            const path1 = path;
            let source;
            source = { path: path1 };
            if (path1.split(".")[1] == "pdf") {
              let filename = encounterid + ".pdf";
              uploadPdf(encounterid, id, url, source.path, filename);
              // setPdfPath(path1);
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert(encounterid, id, url, file, path1);
              }, 250);
            }
          })
          .catch((err) => {});
      } catch (error) {}
    }
  };
  const handleSelection = async (files) => {
    if (files && files.length) {
      uploadFile(files[0]);
    }
  };
  const setImage = (encounterid, id, url) => {
    serviceRef.current = id;
    // setEncId(encounterid);
    // setIdVal(id);
    // setUrlVal(url);
    fileSelRef?.current?.openPicker();
  };
  const checkConvert = (encounterid, id, url, file, path1) => {
    Alert.alert(
      t("VACCINATION.ATTACHMENT_ADDED"),
      t("VACCINATION.ADD_MORE"),
      [
        {
          text: t("COMMON.YES"),
          onPress: () => setImage(encounterid, id, url)
        },
        {
          text: t("COMMON.NO"),
          onPress: () => {
            convertPDF(path1);
          }
        }
      ],
      { cancelable: false }
    );
  };
  const convertPDF = async (path1) => {
    // this.refs.loading.show();
    // const enc_id = props.navigation.state.params.edit === true ? patientList.enc_id : patie;
    let filename = enc_id;

    let checkPath = [];

    if (!path1?.trim()) {
      checkPath = mulImg;
    } else {
      checkPath = [...mulImg, path1];
    }

    try {
      const options = {
        fileCache: true,
        imagePaths: checkPath,
        name: filename,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: 1200
        },
        quality: 0.4 // optional compression paramter
      };
      console.log(options, "canel", filename);
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setfileName(filename);
      setMulImg([]);
      setPath(pdf.filePath);
      // uploadPdf(encounterid, id, url, pdf.filePath, filename, file);
    } catch (e) {}
  };

  const showPdf = (pdflink) => {
    if (!pdflink) return alert("Invalid");
    navigation.navigate("ViewPdfScreen", {
      link: `${getApiUrl()}${pdflink}`,
      // link: getApiUrl() + '/' + pdflink,
      screenname: "Plan Attachement"
    });
  };

  const uploadPdf = async (encounterid, id, urldata, path, pdfname, file) => {
    const variable = {
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
      // encounter: patientList.encounter_id,
    };
    let pt = new FormData();
    pt.append("description", "desc2");
    pt.append("file_name", pdfname);
    pt.append("file", {
      uri: "file://" + path,
      type: "application/pdf",
      name: pdfname
    });

    await createAttachment(pt, variable)
      .then((res) => {
        if (res) {
          attachmentref.current.setModalVisible(false);
          fileSelRef.current = null;
          setPath("");
          setfileName("");
          setTimeout(() => {
            NativeToast({
              text: res.message,
              type: "success"
            });
          }, 100);

          GetNotesData({
            enc_id,
            doc_id,
            hlp_id
          });
          setTimeout(() => {
            if (patientList) {
              setEncId(patientList?.encounter_id);
            }
          }, 250);
          attachmentref.current?.setModalVisible(false);
        } else {
          NativeToast({
            text: res.message,
            type: "danger"
          });
        }
      })
      .catch((err) => {});
  };
  const DeleteFileData = async (id) => {
    const variables = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };
    await deleteAttachment(variables)
      .then((res) => {
        GetNotesData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        setTimeout(() => {
          NativeToast({ text: res.message, type: "success" });
        }, 150);
        // props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const DeleteMedData = async (id) => {
    const variable = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };

    await deleteMedicine(variable)
      .then((res) => {
        GetMedicineData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const DeleteSuppData = async (id) => {
    const variable = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };

    await deleteSuppliment(variable)
      .then((res) => {
        GetSupplimentData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const DeleteImagingData = async (id) => {
    const variable = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };

    await deleteImg(variable)
      .then((res) => {
        GetImagingData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const DeleteLabData = async (id) => {
    const variable = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };

    await deleteLab(variable)
      .then((res) => {
        GetLabData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const DeleteNursingData = async (id) => {
    const variable = {
      id,
      enc_id: enc_id,
      doc_id: doc_id,
      hlp_id: hlp_id
    };

    await deleteNur(variable)
      .then((res) => {
        GetNursingData({
          enc_id: enc_id,
          doc_id: doc_id,
          hlp_id: hlp_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const DeleteVaccineData = async (id) => {
    const variable = {
      id,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };

    await deleteVaccine(variable)
      .then((res) => {
        GetVaccineData({
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id,
          pending: false
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  // Provide Vaccination

  const SaveVaccination = async () => {
    let enteredData = [];

    vaccineData.map((i, index) => {
      if (i.batch_no && i.attachments.length > 0 && i.expiry_date) {
        let obj = {};
        obj.person_vaccine_id = i.id;
        obj.batch_no = i.batch_no;
        obj.expiry_date = i.expiry_date;
        obj.attachments = i.attachments;

        enteredData.push(obj);
        obj = {};
      }
    });

    let variable = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };

    await ProvideVaccine(variable, enteredData)
      .then((res) => {
        if (res) {
          if (res) {
            uploadPdf1(enteredData);
          }
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const uploadPdf1 = async (data) => {
    let token = await AsyncStorage.getItem("jwt_token");

    let success = [];

    let enc_id = patientList?.encounter_id;
    let doc_id = patientList?.appointment?.doc_id;
    let hlp_id = patientList?.appointment?.healpha_id;

    for (let index = 0; index < data.length; index++) {
      let url =
        getBaseUrl() +
        `v1/appointment/encounter/${enc_id}/doctor/${doc_id}/person/${hlp_id}/plan/attachment/vaccine?service_id=${data[index].person_vaccine_id}`;

      let pdfname = data[index].attachments[0].file;
      let path = data[index].attachments[0].path;

      let pt = new FormData();
      pt.append("description", "desc2");
      pt.append("file_name", pdfname);
      pt.append("file", {
        uri: "file://" + path,
        type: "application/pdf",
        name: pdfname
      });
      await ApiCall.postMultiForm(url, pt, {
        Authorization: `Bearer ${token}`,
        otherHeader: "foo",
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      })
        .then((res) => {
          if (res) {
            GetVaccineData({
              enc_id: patientList.encounter_id,
              doc_id: patientList.appointment.doc_id,
              hlp_id: patientList.appointment.healpha_id,
              pending: false
            });
            success.push(res);
          }
        })
        .catch((err) => {
          NativeToastTop({
            text: err.message,
            type: "warning"
          });
        });

      if (data.length === success.length) {
        setvaccineModal(false);
        setMulImg([]);

        indexofVaccine.current = null;
        vaccineDataRef.current = null;
        vaccineId.current = null;
        setTimeout(() => {
          setsuccessModal(true);
        }, 250);
        // NativeToastTop({
        //   text: success[0].message,
        //   type: "success"
        // });
      }
    }
  };
  const AttachmentFiles = () => {
    // const [nameOfFile, setnameOfFile] = useState("");
    return (
      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
              fontSize: 16
            }}
            testID="uploadFileText"
            accessibilityLabel="uploadFileText">
            {t("TIMELINE.UPLOAD FILE")}
          </Text>
          <TouchableOpacity
           testID="closeImageTouch"
           accessibilityLabel="closeImageTouch"
            onPress={() => attachmentref.current?.setModalVisible(false)}>
            <Image source={close} style={{ width: 14, height: 14 }} 
            testID="closeImage"
            accessibilityLabel="closeImage"/>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: DEFAULT_INVERSE_LIGHT,
            marginVertical: 10,
            padding: 10,
            borderRadius: 5,
            borderStyle: "dotted",
            borderWidth: 1,
            borderColor: DEFAULT_GREY_COLOR
          }}>
          <View style={{ marginVertical: 10 }}>
            <View>
              <Text
              testID="fimeNameText"
              accessibilityLabel="fimeNameText">{t("COMMON.NAME_FILE")}</Text>
              <TextInput
              testID="enterNameTextInput"
              accessibilityLabel="enterNameTextInput"
                placeholder={`${t("TIMELINE.ENTER_NAME")}`}
                style={{
                  borderWidth: 1,
                  borderColor: DEFAULT_INVERSE_LIGHT,
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: DEFAULT_WHITE_COLOR,
                  marginTop: 5
                }}
                defaultValue={fileName}
                blurOnSubmit={true}
                value={fileName}
                onChangeText={setfileName}
                onEndEditing={() => {
                  setfileName(fileName);
                }}
                onBlur={() => {
                  setfileName(fileName);
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "white",
                marginVertical: 15,
                padding: 10,
                borderRadius: 5,
                alignItems: "center"
              }}>
              <Text
              testID="pathText"
              accessibilityLabel="pathText"
                ellipsizeMode="head"
                numberOfLines={1}
                style={{ width: "70%" }}>
                {path}
              </Text>

              <TouchableOpacity
              testID="browseTouch"
              accessibilityLabel="browseTouch"
                onPress={() => setImage()}
                style={{
                  backgroundColor: DEFAULT_INVERSE_LIGHT,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5
                }}
               >
                <Text
                 testID="browseText"
                 accessibilityLabel="browseText">{t("COMMON.BROWSE")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
         testID="uploadedFileTouch"
         accessibilityLabel="uploadedFileTouch"
          onPress={() => {
            uploadPdf(null, null, null, path, fileName);
          }}
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            padding: 10,
            margin: 5,
            borderRadius: 5
          }}>
          <Text
            style={{
              color: DEFAULT_WHITE_COLOR,
              textAlign: "center",
              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              fontSize: 18
            }}
            testID="uploadedFileText"
            accessibilityLabel="uploadedFileText">
            {t("COMMON.UPLOADED_SELECTED")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const Vaccination = () => {
    const [dataOf, setdataOf] = useState(dataof || []);

    const setImage1 = () => {
      vaccineFileRef?.current?.openPicker();
    };

    const checkConvert1 = (path1) => {
      Alert.alert(
        t("VACCINATION.ATTACHMENT_ADDED"),
        t("VACCINATION.ADD_MORE"),
        [
          { text: t("COMMON.YES"), onPress: () => setImage1() },
          {
            text: t("COMMON.NO"),
            onPress: () => convertPDF1(path1)
          }
        ],
        { cancelable: false }
      );
    };
    const convertPDF1 = async (path1) => {
      const encounterid = patientList.encounter_id;
      const id = vaccineId.current;

      let filename = encounterid + "-" + id;
      let checkPath = [];

      if (!path1?.trim()) {
        checkPath = mulImg;
      } else {
        checkPath = [...mulImg, path1];
      }

      try {
        const options = {
          fileCache: true,
          imagePaths: checkPath,
          name: filename,
          maxSize: {
            // optional maximum image dimension - larger images will be resized
            width: 900,
            height: 1200
          },
          quality: 0.4 // optional compression paramter
        };
        const pdf1 = await RNImageToPdf.createPDFbyImages(options);
        setMulImg([]);
        let data = [...dataof];

        data[indexofVaccine?.current].attachments = [
          { file: filename, path: pdf1.filePath }
        ];

        setdataof(data);

        setTimeout(() => {
          setdataOf(data);
        }, 100);
      } catch (e) {}
    };

    const uploadFile1 = (file) => {
      const path = file.path;
      const encounterid = patientList.encounter_id;

      let checkFile = path.split(".");

      if (checkFile.slice(-1)[0]?.toLowerCase() === "pdf") {
        let filename;
        filename =
          encounterid + "-" + vaccineId?.current + "-" + vaccineId.current;
        let data = [...dataof];
        data[indexofVaccine?.current].attachments = [
          { file: filename, path: path }
        ];
        setdataOf(data);
        setdataof(data);
      } else {
        try {
          ImageResizer.createResizedImage(path, 800, 650, "JPEG", 50, 0)
            .then(({ path }) => {
              const path1 = path;
              let source;
              source = { path: path1 };
              if (path1.split(".")[1] == "pdf") {
                let filename = encounterid + ".pdf";
              } else {
                setMulImg([...mulImg, path1]);
                setTimeout(() => {
                  checkConvert1(path1);
                }, 250);
              }
            })
            .catch((err) => {});
        } catch (error) {}
      }
    };

    const handleSelection1 = async (files) => {
      if (files && files.length) {
        uploadFile1(files[0]);
      }
    };

    const addBatch = (index, val) => {
      let data = [...dataof];
      if (!val.trim()) {
        data[index].batch_no = "";
      } else {
        data[index].batch_no = val;
      }
      setdataof(data);
      setdataOf(data);
    };

    const removeFile = (index) => {
      let data = [...dataof];
      data[index].attachments = [];
      setdataof(data);
      setdataOf(data);
    };

    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            {
              backgroundColor: DEFAULT_WHITE_COLOR,
              borderRadius: 20,
              padding: 15,
              position: "absolute",
              bottom: 0,
              right: 0,
              left: 0
            }
            // dataOf.length >= 2 ? { height: "75%" } : {}
          ]}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR }}
              testID="provideVaccineText"
              accessibilityLabel="provideVaccineText">
                {t("VACCINATION.PROVIDE_VACCINE")}
              </Text>
            </View>
            <View>
              <TouchableOpacity
              testID="closeTouch"
              accessibilityLabel="closeTouch"
                onPress={() => {
                  setvaccineModal(false);
                }}>
                <Image source={close} style={{ height: 12, width: 12 }} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View> */}
          {dataOf.map((i, index) => {
            const [batch_no, setBatch_No] = useState("");
            let batchno = !i.batch_no ? true : false;
            let file = !i.attachments.length > 0 ? true : false;
            let expiry = !i.expiry_date ? true : false;
            let isTrue = batchno || expiry;
            return (
              <View>
                {isTrue || file ? (
                  <View
                    key={index}
                    style={{
                      padding: 10,
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: STATUS_CARD_BORDER_COLOR,
                      borderRadius: 10,
                      marginVertical: 10
                    }}>
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Image source={Vac} style={{ height: 18, width: 18 }} 
                        testID="vaccineImage"
                        accessibilityLabel="vaccineImage"/>
                        <Text
                          style={{
                            fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                            paddingLeft: 5
                          }}
                          testID={i.vaccine_details.vaccine_brand_name+"text"}
                          accessibilityLabel={i.vaccine_details.vaccine_brand_name+"text"}>
                          {i.vaccine_details.vaccine_brand_name}
                        </Text>
                      </View>

                      <Text
                        style={{
                          paddingLeft: 22,
                          fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          fontSize: 12,
                          color: STATUS_CARD_BORDER_COLOR
                        }}
                        testID={i?.description+"text"}
                        accessibilityLabel={i?.description+"text"}>
                        {i?.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: 20,
                        marginVertical: 10
                      }}>
                      <View style={{ width: "50%" }}>
                        <TextInput
                        testID="batchNoTextInput"
                        accessibilityLabel="batchNoTextInput"
                          placeholder={t("VACCINATION.BATCH_NO")}
                          defaultValue={i?.batch_no}
                          keyboardType="default"
                          returnKeyType="done"
                          multiline={true}
                          blurOnSubmit={true}
                          onChangeText={(val) => setBatch_No(val)}
                          onEndEditing={() => {
                            addBatch(index, batch_no);
                            setTimeout(() => {
                              setBatch_No("");
                            }, 100);
                          }}
                          onBlur={() => {
                            addBatch(index, batch_no);
                            setTimeout(() => {
                              setBatch_No("");
                            }, 100);
                          }}
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          style={{
                            borderWidth: 1,
                            borderColor: STATUS_CARD_BORDER_COLOR,
                            padding: 5,
                            height: 40,
                            width: "95%"
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: "50%",
                          borderRadius: 5
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss(),
                              setTimeout(() => {
                                setOpen(true);
                              }, 100);
                          }}
                          style={{
                            flexDirection: "row",
                            width: "95%",
                            justifyContent: "center",
                            height: 40,
                            borderWidth: 1,
                            borderColor: "gray"
                          }}>
                          {/* <Image
                            source={Cal}
                            style={{ width: 25, height: 22 }}
                          /> */}
                          <Text
                            style={{
                              color: i.expiry_date ? "black" : "gray",
                              textAlignVertical: "center",
                              textAlign: "center"
                            }}>
                            {i.expiry_date
                              ? i.expiry_date
                              : t("VACCINATION.EXPIRY_DATE")}
                          </Text>
                          <DatePicker
                            modal
                            open={open}
                            mode="date"
                            date={new Date()}
                            onConfirm={(date) => {
                              let newDate = moment(date).format("YYYY/MM/DD");
                              let data = [...dataof];
                              data[index].expiry_date = newDate;
                              setOpen(false);
                              setdataof(data);
                              setdataOf(data);
                            }}
                            onCancel={() => {
                              setOpen(false);
                            }}
                          />
                        </TouchableOpacity>
                        {/* <DatePicker1
                          style={[
                            {
                              width: "95%",
                              borderRadius: 5
                              // backgroundColor: "green"
                            }
                          ]}
                          date={i?.expiry_date}
                          confirmBtnText={t("VACCINATION.CONFIRM")}
                          cancelBtnText={t("VACCINATION.CANCEL")}
                          mode="date"
                          maxDate={new Date()}
                          placeholder={t("VACCINATION.EXPIRY_DATE")}
                          format="YYYY-MM-DD"
                          showIcon={false}
                          iconComponent={<Image source={Cal} />}
                          customStyles={{
                            dateIcon: {
                              position: "absolute",
                              left: 0,
                              top: 4,
                              marginLeft: 0,
                              borderRadius: 5,
                              width: "100%"
                            },
                            borderInput: {
                              borderRadius: 5
                            }
                          }}
                          onDateChange={(selectedDate) => {
                            let data = [...dataof];
                            data[index].expiry_date = selectedDate;
                            setdataof(data);
                            setdataOf(data);
                          }}
                        /> */}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 20
                      }}></View>
                    <View style={{ alignItems: "center", marginLeft: 10 }}>
                      <TouchableOpacity
                      testID="cameraTouch"
                      accessibilityLabel="cameraTouch"
                        onPress={() => {
                          Keyboard.dismiss();
                          indexofVaccine.current = index;
                          vaccineId.current = i.id;
                          setImage1();
                        }}
                        style={{
                          backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
                          margin: 20,
                          padding: 6,
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: APP_PRIMARY_COLOR,
                          flexDirection: "row",
                          alignContent: "center",
                          alignSelf: "center",
                          width: "95%"
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            marginLeft: 100
                          }}>
                          <Image
                          testID="cameraImage"
                          accessibilityLabel="cameraImage"
                            source={Camera}
                            style={{ width: 18, height: 18 }}
                          />
                          <Text
                          testID="uploadText"
                          accessibilityLabel="uploadText"
                            style={{
                              color: APP_PRIMARY_COLOR,
                              textAlign: "center",
                              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                              alignItems: "center",
                              alignSelf: "center",
                              marginLeft: 5
                            }}>
                            {t("VACCINATION.UPLOAD")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <FileSelector
                      ref={vaccineFileRef}
                      onError={() => {
                        if (mulImg?.length > 0) {
                          convertPDF1("");
                        }
                      }}
                      onSelection={handleSelection1}
                      selectAny
                    />
                  </View>
                ) : (
                  <View
                    key={index}
                    style={{
                      padding: 10,
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: STATUS_CARD_BORDER_COLOR,
                      borderRadius: 10,
                      marginVertical: 10
                    }}>
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Image source={Vac} style={{ height: 18, width: 18 }} 
                        testID="vaccineImage"
                        accessibilityLabel="vaccineImage"/>
                        <Text
                          style={{
                            fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                            paddingLeft: 5
                          }}
                          testID={i.vaccine_details.vaccine_brand_name+"text"}
                          accessibilityLabel={i.vaccine_details.vaccine_brand_name+"text"}>
                          {i.vaccine_details.vaccine_brand_name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          paddingLeft: 22,
                          fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          fontSize: 12,
                          color: STATUS_CARD_BORDER_COLOR
                        }}>
                        {t("VACCINATION.BATCH")}:{i.batch_no},{" "}
                        {t("VACCINATION.EXPIRY")}:{i.expiry_date}
                      </Text>
                      {i?.description && (
                        <Text
                        testID={i?.description+"text"}
                        accessibilityLabel={i?.description+"text"}
                          style={{
                            paddingLeft: 22,
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                            fontSize: 12,
                            color: STATUS_CARD_BORDER_COLOR
                          }}>
                          {i?.description}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        backgroundColor: STATUS_CARD_BORDER_COLOR,
                        height: 1,
                        width: "90%",
                        marginHorizontal: 20,
                        marginVertical: 10
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: 20,
                        justifyContent: "space-between"
                      }}>
                      <View
                        style={{ flexDirection: "row" }}
                        // onPress={() => {
                        //   localShowPdf(i.attachments[0].path);
                        // }}
                      >
                        <View>
                          <Image source={Attachment} style={styles.att1} 
                          testID="attachmentImage"
                          accessibilityLabel="attachmentImage"/>
                        </View>

                        <View style={{ marginLeft: 10, width: "70%" }}>
                          <Text style={{ flexWrap: "wrap" }}
                          testID={i.attachments[0].file+"text"}
                          accessibilityLabel={i.attachments[0].file+"text"}>
                            {i.attachments[0].file}
                          </Text>
                          <Text style={{ color: STATUS_CARD_BORDER_COLOR }}
                          testID="fileUploadedText"
                          accessibilityLabel="fileUploadedText">
                            {t("VACCINATION.FILEUPLOADED")}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity
                          testID="attachCloseTouch"
                          accessibilityLabel="attachCloseTouch"
                          style={styles.attach}
                          onPress={() => {
                            removeFile(index);
                          }}>
                          <Image source={AttachClose} style={styles.attach1} 
                          testID="attachCloseText"
                          accessibilityLabel="attachCloseText"/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
          {/* </View> */}
          <View style={{ marginVertical: 5 }}>
            <TouchableOpacity
            testID="completeTouch"
            accessibilityLabel="completeTouch"
              style={styles.generate1}
              onPress={() => {
                SaveVaccination();
              }}
             >
              <Text style={styles.generatetext1}
               testID="completeText"
               accessibilityLabel="completeText">
                {t("VACCINATION.COMPLETE")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (patientList) {
      setEncId(patientList?.encounter_id);
      setdoc_id(patientList.appointment.doc_id);
      sethlp_id(patientList.appointment.healpha_id);
      let variables = {
        enc_id: patientList.encounter_id,
        doc_id: patientList.appointment.doc_id,
        hlp_id: patientList.appointment.healpha_id,
        pending: false
      };

      DeviceEventEmitter.addListener("getMedicineData", (e) => {
        GetMedicineData(e);
      });
      DeviceEventEmitter.addListener("getSupplimentData", (e) => {
        GetSupplimentData(e);
      });
      DeviceEventEmitter.addListener("getLaboratoryData", (e) => {
        GetLabData(e);
      });
      DeviceEventEmitter.addListener("getImagingData", (e) => {
        GetImagingData(e);
      });
      DeviceEventEmitter.addListener("getNursingData", (e) => {
        GetNursingData(e);
      });
      DeviceEventEmitter.addListener("getVaccineData", (e) => {
        GetVaccineData(e);
      });

      if (!patientList?.template_id) {
        // console.log(templateList, "variables", patientList?.template_id);
        init(templateList?.id);
      } else {
        if (variables) {
          GetNotesData(variables);
          GetVaccineData(variables);
          GetImagingData(variables);
          GetNursingData(variables);
          GetLabData(variables);
          GetMedicineData(variables);
          setNursingData(variables);
          GetSupplimentData(variables);
        }
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.row}>
        <View style={styles.medical}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(ADDMEDICINE, {
                templateId: props.navigation.state.params.templateId,
                edit: false
              })
            }>
            <View style={styles.plan}>
              <Image source={Med} style={styles.med} 
               testID="medImage"
               accessibilityLabel="medImage"/>
              <Text
              testID="medText"
              accessibilityLabel="medText">Med</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
           testID="supTouch"
           accessibilityLabel="supTouch"
            onPress={() =>
              props.navigation.navigate(ADDSUPPLIMENT, {
                templateId: props.navigation.state.params.templateId
              })
            }>
            <View style={styles.plan}>
              <Image source={Sup} style={styles.med} 
               testID="supImage"
               accessibilityLabel="supImage"/>
              <Text
               testID="supText"
               accessibilityLabel="supText">Sup</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
           testID="labTouch"
           accessibilityLabel="labTouch"
            onPress={() =>
              props.navigation.navigate(ADDLAB, {
                templateId: props.navigation.state.params.templateId,
                edit: false
              })
            }>
            <View style={styles.plan}>
              <Image source={Lab} style={styles.med} 
               testID="labImage"
               accessibilityLabel="labImage"/>
              <Text
               testID="labText"
               accessibilityLabel="labText">Lab</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          testID="labText"
          accessibilityLabel="labText"
            onPress={() =>
              props.navigation.navigate(ADDIMG, {
                templateId: props.navigation.state.params.templateId,
                edit: false
              })
            }>
            <View style={styles.plan}>
              <Image source={Img} style={styles.med} 
              testID="imgImage"
              accessibilityLabel="imgImage"/>
              <Text
              testID="imgText"
              accessibilityLabel="imgText">Img</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
           testID="nurTouch"
           accessibilityLabel="nurTouch"
            onPress={() =>
              props.navigation.navigate(ADDNUR, {
                getNur: GetNursingData,
                templateId: props.navigation.state.params.templateId,
                edit: false
              })
            }>
            <View style={styles.plan}>
              <Image source={Nur} style={styles.med} 
              testID="nurImage"
              accessibilityLabel="nurImage"/>
              <Text
              testID="nurText"
              accessibilityLabel="nurText">Nur</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
           testID="vacTouch"
           accessibilityLabel="vacTouch"
            onPress={() =>
              props.navigation.navigate(ADDVACCINE, {
                templateId: props.navigation.state.params.templateId,
                edit: false
              })
            }>
            <View style={styles.plan}>
              <Image source={Vac} style={styles.med} 
               testID="vacImage"
               accessibilityLabel="vacImage"/>
              <Text
               testID="vacText"
               accessibilityLabel="vacText">Vac</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        {isDataAvailble ? (
          <View style={styles.bottom}>
            <View style={styles.card}>
              <Text style={styles.click}
              testID="clickOnAboveText"
              accessibilityLabel="clickOnAboveText">{t("PLAN.CLICK_ON_ABOVE")}</Text>
            </View>
          </View>
        ) : null}
        {/* Add Items */}
        <Divider style={styles.divide} />
        {medicineData?.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Medicines(${medicineData.length})`+"text"}
              accessibilityLabel={`Medicines(${medicineData.length})`+"text"}>
                {`Medicines(${medicineData.length})`}
              </Text>

              {!AfterPrescription ? (
                <TouchableOpacity
                testID="editTouch"
                accessibilityLabel="editTouch"
                  onPress={() =>
                    props.navigation.navigate(ADDMEDICINE, {
                      medicineData,
                      edit: true
                    })
                  }>
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {medicineData.map((i, index) => {
                const date1 = moment(i.duration_end_date).format("DD");
                const date2 = moment(i.duration_start_date).format("DD");
                const main = Math.abs(date2 - date1);
                // const durationTime =
                //   i.duration === undefined
                //     ? i.duration
                //     : `${i.duration.slice(0, 1)} days`;

                return (
                  <View style={styles.flow} key={index}>
                    {i.deleted ? (
                      <View
                        style={[
                          styles.medicineview,
                          { backgroundColor: "#FFEDED" }
                        ]}>
                        <Image source={Med} style={styles.med} 
                        testID="medImage"
                        accessibilityLabel="medImage"/>
                        <View style={styles.textside}>
                          <Text
                          testID={i.drug_name+"text"}
                          accessibilityLabel={i.drug_name+"text"}
                            numberOfLines={1}
                            style={[
                              styles.medicinetext,
                              {
                                textDecorationLine: "line-through",
                                textDecorationColor: "red"
                              }
                            ]}>
                            {i.drug_name}
                          </Text>
                          <Text
                            style={[
                              styles.labtext,
                              {
                                textDecorationLine: "line-through",
                                textDecorationColor: "red"
                              }
                            ]}
                            testID={i.dose+"text"}
                            accessibilityLabel={i.dose+"text"}>
                            <Text style={styles.labtext}>
                              (
                              {`${i.dose} ${i.dose_unit.slice(0, 3)} ${
                                i.drug_when
                              } for   ${
                                i.duration ? i.duration : main + "days"
                              }`}
                              )
                            </Text>
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.medicineview}>
                        <Image source={Sup} style={styles.med} 
                        testID="supImage"
                        accessibilityLabel="supImage"/>
                        <View style={styles.textside}>
                          <Text numberOfLines={1} style={styles.medicinetext}
                          testID={i.drug_name+"text"}
                          accessibilityLabel={i.drug_name+"text"}>
                            {i.drug_name}
                          </Text>
                          <Text style={styles.labtext}
                          testID={i.dose+"text"}
                          accessibilityLabel={i.dose+"text"}>
                            (
                            {`${i.dose} ${i.dose_unit.slice(0, 3)} ${
                              i.drug_when
                            } for ${i.duration ? i.duration : main + "days"}`}
                            )
                          </Text>
                        </View>
                      </View>
                    )}
                    {i.deleted === true ? (
                      <View
                        style={{
                          backgroundColor: "#FFEDED",
                          width: "20%"
                        }}></View>
                    ) : (
                      <TouchableOpacity onPress={() => DeleteMedData(i.id)}
                      testID="deleteTouch"
                        accessibilityLabel="deleteTouch">
                        <Icon
                        testID="deleteIcon"
                        accessibilityLabel="deleteIcon"
                          name="delete"
                          type="AntDesign"
                          style={styles.deleteIcon}
                        />
                      </TouchableOpacity>
                    )}

                    {medicineData.length - 1 !== index ? (
                      <Divider style={[styles.divide, { marginVertical: 5 }]} />
                    ) : null}
                  </View>
                );
              })}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}
        {/* Add Suppliment */}
        {suplimentData?.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Suppliment(${suplimentData.length})`+"text"}
              accessibilityLabel={`Suppliment(${suplimentData.length})`+"text"}>
                {`Suppliment(${suplimentData.length})`}
              </Text>
              {!AfterPrescription ? (
                <TouchableOpacity
                testID="editTouch"
                  accessibilityLabel="editTouch"
                  onPress={() =>
                    props.navigation.navigate(ADDSUPPLIMENT, {
                      suplimentData,
                      edit: true
                    })
                  }>
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {suplimentData.map((i, index) => {
                const date1 = moment(i.duration_end_date).format("DD");
                const date2 = moment(i.duration_start_date).format("DD");
                const main = Math.abs(date2 - date1);
                // const durationTime =
                //   i.duration === undefined
                //     ? i.duration
                //     : `${i.duration.slice(0, 1)} days`;
                //console.log(date1, "date1");

                return (
                  <View style={styles.flow} key={index}>
                    {i.deleted ? (
                      <View
                        style={[
                          styles.medicineview,
                          { backgroundColor: "#FFEDED" }
                        ]}>
                        <Image source={Sup} style={styles.med} 
                        testID="supImage"
                        accessibilityLabel="supImage"/>
                        <View style={styles.textside}>
                          <Text
                          testID={i.drug_name+"text"}
                          accessibilityLabel={i.drug_name+"text"}
                            numberOfLines={1}
                            style={[
                              styles.medicinetext,
                              {
                                textDecorationLine: "line-through",
                                textDecorationColor: "red"
                              }
                            ]}>
                            {i.drug_name}
                          </Text>
                          <Text
                            style={[
                              styles.labtext,
                              {
                                textDecorationLine: "line-through",
                                textDecorationColor: "red"
                              }
                            ]}
                            testID={i.dose+"text"}
                            accessibilityLabel={i.dose+"text"}>
                            <Text style={styles.labtext}>
                              (
                              {`${i.dose} ${i.dose_unit.slice(0, 3)} ${
                                i.drug_when
                              } for ${i.duration ? i.duration : main + "days"}`}
                              )
                            </Text>
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.medicineview}>
                        <Image source={Sup} style={styles.med} 
                        testID="supImage"
                        accessibilityLabel="supImage"/>
                        <View style={styles.textside}>
                          <Text numberOfLines={1} style={styles.medicinetext}
                          testID= {i.drug_name+"text"}
                          accessibilityLabel= {i.drug_name+"text"}>
                            {i.drug_name}
                          </Text>
                          <Text style={styles.labtext}
                          testID={i.dose+"text"}
                          accessibilityLabel={i.dose+"text"}>
                            (
                            {`${i.dose} ${i.dose_unit.slice(0, 3)} ${
                              i.drug_when
                            } for ${i.duration ? i.duration : main + "days"}`}
                            )
                          </Text>
                        </View>
                      </View>
                    )}

                    {i.deleted === true ? (
                      <View
                        style={{
                          backgroundColor: "#FFEDED",
                          width: "20%"
                        }}></View>
                    ) : (
                      <TouchableOpacity onPress={() => DeleteSuppData(i.id)}
                      testID="deleteTouch"
                        accessibilityLabel="deleteTouch">
                        <Icon
                        testID="deleteIcon"
                        accessibilityLabel="deleteIcon"
                          name="delete"
                          type="AntDesign"
                          style={[styles.deleteIcon, { marginRight: 5 }]}
                        />
                      </TouchableOpacity>
                    )}

                    {suplimentData.length - 1 !== index ? (
                      <Divider style={styles.divide} />
                    ) : null}
                  </View>
                );
              })}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}

        {/* AddLab */}
        {labData?.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Laboratory(${labData.length})`+"text"}
              accessibilityLabel={`Laboratory(${labData.length})`+"text"}>
                {`Laboratory(${labData.length})`}
              </Text>
              {!AfterPrescription ? (
                <TouchableOpacity
                testID="editTouch"
                      accessibilityLabel="editTouch"
                  onPress={() =>
                    props.navigation.navigate(ADDLAB, { labData, edit: true })
                  }>
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {labData.map((i, index) => (
                <View style={styles.flow} key={index}>
                  {i.deleted ? (
                    <View
                      style={[
                        styles.medicineview,
                        { backgroundColor: "#FFEDED" }
                      ]}>
                      <Image source={Lab} style={styles.med} 
                      testID="labImage"
                      accessibilityLabel="labImage"/>
                      <View style={styles.textside}>
                        <Text
                          //numberOfLines={1}
                          style={[
                            styles.medicinetext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.service_name+"text"}
                          accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                        <Text
                          style={[
                            styles.labtext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.description+"text"}
                        accessibilityLabel={i.description+"text"}>
                          {i.description}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.medicineview}>
                      <Image source={Lab} style={styles.med} 
                      testID="labText"
                      accessibilityLabel="labText"/>
                      <View style={styles.textside}>
                        <Text style={styles.medicinetext}
                        testID={i.service_name+"text"}
                        accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                        <Text style={styles.labtext}
                        testID={i.description+"text"}
                        accessibilityLabel={i.description+"text"}>{i.description}</Text>
                      </View>
                    </View>
                  )}
                  {i.deleted ? (
                    <View
                      style={{
                        backgroundColor: "#FFEDED",
                        width: "20%"
                      }}></View>
                  ) : (
                    <View>
                      {i.service_status === "Report Updated" ? null : (
                        <TouchableOpacity onPress={() => DeleteLabData(i.id)}
                        testID="deleteIconTouch"
                        accessibilityLabel="deleteIconTouch">
                          <Icon
                          testID="deleteIcon"
                          accessibilityLabel="deleteIcon"
                            name="delete"
                            type="AntDesign"
                            style={styles.deleteIcon}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {labData.length - 1 !== index ? (
                    <Divider style={(styles.divide, { marginVertical: 5 })} />
                  ) : null}
                </View>
              ))}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}

        {/* Add Imaging */}
        {imagingData?.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Imaging(${imagingData.length})`+"text"}
              accessibilityLabel={`Imaging(${imagingData.length})`+"text"}>
                {`Imaging(${imagingData.length})`}
              </Text>
              {!AfterPrescription ? (
                <TouchableOpacity
                testID="editTouch"
                  accessibilityLabel="editTouch"
                  onPress={() =>
                    props.navigation.navigate(ADDIMG, {
                      imagingData,
                      edit: true
                    })
                  }>
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {imagingData.map((i, index) => (
                <View style={styles.flow} key={index}>
                  {i.deleted ? (
                    <View
                      style={[
                        styles.medicineview,
                        { backgroundColor: "#FFEDED" }
                      ]}>
                      <Image source={Img} style={styles.med} 
                      testID="imgImage"
                      accessibilityLabel="imgImage"/>
                      <View style={styles.textside}>
                        <Text
                          // numberOfLines={1}
                          style={[
                            styles.medicinetext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.service_name+"text"}
                          accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                        <Text
                          style={[
                            styles.labtext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.description+"text"}
                          accessibilityLabel={i.description+"text"}>
                          {i.description}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.medicineview}>
                      <Image source={Img} style={styles.med} 
                      testID="imgImage"
                      accessibilityLabel="imgImage"/>
                      <View style={styles.textside}>
                        <Text style={styles.medicinetext}
                        testID={i.service_name+"text"}
                        accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                        <Text style={styles.labtext}
                        testID={i.description+"text"}
                        accessibilityLabel={i.description+"text"}>{i.description}</Text>
                      </View>
                    </View>
                  )}
                  {i.deleted ? (
                    <View
                      style={{
                        backgroundColor: "#FFEDED",
                        width: "20%"
                      }}></View>
                  ) : (
                    <View>
                      {i.service_status === "Report Updated" ? null : (
                        <TouchableOpacity
                        testID="deleteIconTouch"
                          accessibilityLabel="deleteIconTouch"
                          onPress={() => DeleteImagingData(i.id)}>
                          <Icon
                          testID="deleteIcon"
                          accessibilityLabel="deleteIcon"
                            name="delete"
                            type="AntDesign"
                            style={styles.deleteIcon}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  {imagingData.length - 1 !== index ? (
                    <Divider style={(styles.divide, { marginVertical: 5 })} />
                  ) : null}
                </View>
              ))}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}

        {/* Add nursing */}
        {nursingData?.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Nursing(${nursingData.length})`+"text"}
              accessibilityLabel={`Nursing(${nursingData.length})`+"text"}>
                {`Nursing(${nursingData.length})`}
              </Text>
              {!AfterPrescription ? (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(ADDNUR, {
                      nursingData,
                      edit: true
                    })
                  }
                  testID="editTouch"
                  accessibilityLabel="editTouch">
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {nursingData.map((i, index) => (
                <View style={styles.flow} key={index}>
                  {i.deleted ? (
                    <View
                      style={[
                        styles.medicineview,
                        { backgroundColor: "#FFEDED" }
                      ]}>
                      <Image source={Nur} style={styles.med} 
                      testID="nurseImage"
                      accessibilityLabel="nurseImage"/>
                      <View style={styles.textside}>
                        <Text
                          // numberOfLines={1}
                          style={[
                            styles.medicinetext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.service_name+"text"}
                          accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.medicineview}>
                      <Image source={Nur} style={styles.med} />
                      <View style={styles.textside}>
                        <Text style={styles.medicinetext}
                        testID={i.service_name+"text"}
                        accessibilityLabel={i.service_name+"text"}>
                          {i.service_name}
                        </Text>
                      </View>
                    </View>
                  )}

                  {i.deleted ? (
                    <View
                      style={{
                        backgroundColor: "#FFEDED",
                        width: "20%"
                      }}></View>
                  ) : (
                    <View>
                      {i.service_status === "Report Updated" ? null : (
                        <TouchableOpacity
                        testID="deleteTouch"
                          accessibilityLabel="deleteTouch"
                          onPress={() => DeleteNursingData(i.id)}>
                          <Icon
                          testID="deleteIcon"
                          accessibilityLabel="deleteIcon"
                            name="delete"
                            type="AntDesign"
                            style={styles.deleteIcon}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {nursingData.length - 1 !== index ? (
                    <Divider style={(styles.divide, { marginVertical: 5 })} />
                  ) : null}
                </View>
              ))}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}
        {/* Add Vaccines */}
        {vaccineData.length ? (
          <View style={styles.backside}>
            <View style={styles.medicine}>
              <Text style={[styles.medicinetext, styles.font]}
              testID={`Vaccines(${vaccineData.length})`+"text"}
              accessibilityLabel={`Vaccines(${vaccineData.length})`+"text"}>
                {`Vaccines(${vaccineData.length})`}
              </Text>
              {!AfterPrescription ? (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(ADDVACCINE, {
                      vaccineData,
                      edit: true
                    })
                  }
                  testID="editTouch"
                      accessibilityLabel="editTouch">
                  <Image source={Edit} style={styles.med} 
                  testID="editImage"
                  accessibilityLabel="editImage"/>
                </TouchableOpacity>
              ) : null}
            </View>
            <Divider style={styles.divide} />
            <View style={styles.lab}>
              {vaccineData.map((i, index) => (
                <View style={styles.flow} key={index}>
                  {i.deleted ? (
                    <View
                      style={[
                        styles.medicineview,
                        { backgroundColor: "#FFEDED" }
                      ]}>
                      <Image source={Vac} style={styles.med} 
                      testID="vaccineImage"
                      accessibilityLabel="vaccineImage"/>
                      <View style={{ width: "75%" }}>
                        <Text
                          // numberOfLines={1}
                          style={[
                            styles.medicinetext,
                            {
                              textDecorationLine: "line-through",
                              textDecorationColor: "red"
                            }
                          ]}
                          testID={i.vaccine_details.vaccine_brand_name+"text"}
                        accessibilityLabel={i.vaccine_details.vaccine_brand_name+"text"}>
                          {i.vaccine_details.vaccine_brand_name}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.medicineview}>
                      <Image source={Vac} style={styles.med} 
                      testID="vaccineImage"
                      accessibilityLabel="vaccineImage"/>
                      <View style={{ width: "75%" }}>
                        <Text style={styles.medicinetext}
                        testID={i.vaccine_details.vaccine_brand_name+"text"}
                        accessibilityLabel={i.vaccine_details.vaccine_brand_name+"text"}>
                          {i.vaccine_details.vaccine_brand_name}
                        </Text>
                      </View>
                      {/* <Text style={styles.labtext}>
                          {i.batch_no}
                          {i.expiry_date}
                        </Text> */}
                    </View>
                  )}

                  {i.deleted ? (
                    <View
                      style={{
                        backgroundColor: "#FFEDED",
                        width: "20%"
                      }}></View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row"
                      }}>
                      {i.service_status === "Report Updated" ? null : (
                        <TouchableOpacity
                        testID="vaccineTouch"
                        accessibilityLabel="vaccineTouch"
                          onPress={() => {
                            // console.log(i);
                            // setVaccineData(vaccineTrue);
                            // vaccineDataRef.current = vaccineTrue;
                            // VaccineRef.current?.setModalVisible(true);
                            setdataof([i]);
                            setvaccineModal(true);
                          }}>
                          <Image
                          testID="vaccineImage"
                          accessibilityLabel="vaccineImage"
                            source={ProvideVacc}
                            style={{
                              width: 22,
                              height: 22,
                              marginTop: 10
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <View>
                        {i.service_status === "Report Updated" ? null : (
                          <TouchableOpacity
                          testID="deleteTouch"
                            accessibilityLabel="deleteTouch"
                            onPress={() => DeleteVaccineData(i.id)}>
                            <Icon
                            testID="deleteIcon"
                            accessibilityLabel="deleteIcon"
                              name="delete"
                              type="AntDesign"
                              style={styles.deleteIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}

                  {vaccineData.length - 1 !== index ? (
                    <Divider style={(styles.divide, { marginVertical: 5 })} />
                  ) : null}
                </View>
              ))}
            </View>
            <View style={styles.view}></View>
          </View>
        ) : null}
        {/* <View style={styles.backside}>
          <Divider style={styles.divide} />
          <View style={styles.medicine}>
            <View>
              <Text style={styles.monitor}>{t("PLAN.HEALTH_MONITOR")}</Text>
            </View>
            <View>
              <Image
                source={History}
                style={{ tintColor: APP_PRIMARY_COLOR }}
              />
            </View>
          </View>
          <Divider style={styles.divide} />
        </View> */}

        {/* <View style={styles.backside}>
          <TouchableOpacity
            style={styles.SubmitButtonStyle}
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}>
            <Text style={styles.TextStyle}> + Add Health Monitor</Text>
          </TouchableOpacity>
        </View> */}
        {/* <Divider style={styles.divide} /> */}
        {/* <View style={styles.view}></View> */}
        <View style={styles.backside}>
          <View style={styles.medicine}>
            <Text style={styles.monitor}
            testID="notesText"
            accessibilityLabel="notesText">{t("PLAN.NOTES")}</Text>
          </View>
        </View>
        <Divider style={styles.divide} />
        <View style={styles.backside}>
          <View style={styles.round}>
            <View>
              <Text style={styles.treatment}
              testID="followNotesText"
              accessibilityLabel="followNotesText">
                {t("PLAN.TREATMENT") + " " + t("PLAN.NOTES")}
              </Text>

              <TextInput
              testID="notesTextInput"
              accessibilityLabel="notesTextInput"
                multiline={true}
                numberOfLines={4}
                style={styles.follow}
                // value={treatment}
                onChangeText={(val) => setTreatment(val)}
                editable={showButton}
                selectTextOnFocus={false}
                value={treatment}
              />
            </View>
            <View>
              <Text style={styles.treatment}
              testID="followNotesText"
              accessibilityLabel="followNotesText">
                {t("PLAN.FALLOW") + " " + t("PLAN.NOTES")}
              </Text>

              <TextInput
              testID="notesTextInput"
              accessibilityLabel="notesTextInput"
                multiline={true}
                numberOfLines={4}
                style={styles.follow}
                // value={fallow}
                onChangeText={(val) => setFallow(val)}
                editable={showButton}
                selectTextOnFocus={false}
                value={fallow}
              />
            </View>
          </View>
          <View>
            {showButton ? (
              <TouchableOpacity style={styles.Attachment} onPress={SaveNote}>
                {/* <Icon name="save" type="Feather" style={styles.iconsave} /> */}
                {/* <Image source={Attach} style={{tintColor: DEFAULT_GREEN_COLOR}} /> */}
                <Text style={styles.AttachmentTextStyle}
                testID="attachmentText"
                accessibilityLabel="attachmentText">
                  {t("COMMON.SAVE") + " " + t("PLAN.NOTES")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <Divider style={styles.divide} />
        <View style={styles.view}></View>
        <View style={styles.backside}>
          <View style={styles.inner}>
            <Text style={styles.monitor}
            testID="attachmentText"
            accessibilityLabel="attachmentText">{t("PLAN.ATTACHMENT")}</Text>
          </View>
          <Divider style={styles.divide} />
          <View>
            <View style={styles.wrap}>
              {attachments &&
                attachments?.map((i, index) => {
                  return (
                    <View style={styles.att} key={index}>
                      <TouchableOpacity onPress={() => showPdf(i.file_path)}
                      testID="attachTouch"
                      accessibilityLabel="attachTouch">
                        <Image source={Attachment} style={styles.att1} 
                         testID="attachImage"
                         accessibilityLabel="attachImage"/>
                        <Text
                        testID={i.file_name+"text"}
                        accessibilityLabel={i.file_name+"text"}
                          style={{ textAlign: "center", width: 50 }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {i.file_name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                       testID="attachCloseTouch"
                       accessibilityLabel="attachCloseTouch"
                        style={styles.attach}
                        onPress={() => DeleteFileData(i.id)}>
                        <Image source={AttachClose} style={styles.attach1} 
                        testID="attachCloseImage"
                        accessibilityLabel="attachCloseImage"/>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
            <TouchableOpacity
            testID="attachTouch"
            accessibilityLabel="attachTouch"
              style={styles.Attachment}
              onPress={() => {
                attachmentref.current?.setModalVisible();
              }}>
              <Image
              testID="attachImage"
              accessibilityLabel="attachImage"
                source={Attach}
                style={{ tintColor: DEFAULT_GREEN_COLOR }}
              />
              <FileSelector
                ref={fileSelRef}
                onError={() => {
                  if (mulImg?.length > 0) {
                    convertPDF("");
                  }
                }}
                onSelection={handleSelection}
                selectAny
              />
              <Text style={styles.AttachmentTextStyle}
              testID="addAttachmentText"
              accessibilityLabel="addAttachmentText">
                {t("COMMON.ADD") + " " + t("PLAN.ATTACHMENT")}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.Attachment}
              onPress={() => setImage()}>
              <Image
                source={Attach}
                style={{ tintColor: DEFAULT_GREEN_COLOR }}
              />
              <FileSelector
                ref={fileSelRef}
                onSelection={handleSelection}
                selectAny
              />
              <Text style={styles.AttachmentTextStyle}>
                {t("COMMON.ADD") + " " + t("PLAN.ATTACHMENT")}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.view}></View>

        <ActionSheet ref={actionSheetRef}>
          <PlansActionSheet
            navigation={props.navigation}
            actionSheetRef={actionSheetRef}
          />
        </ActionSheet>
        <ActionSheet ref={attachmentref}>
          {/* <AttachmentFiles /> */}
          {AttachmentFiles()}
        </ActionSheet>
      </ScrollView>

      <Modal
        isVisible={vaccineModal}
        onModalHide={() => {
          vaccineDataRef.current = null;
          setdataof([]);
          indexofVaccine.current = null;
          vaccineId.current = null;
        }}
        style={{ margin: 0, padding: 0 }}>
        <Vaccination />
      </Modal>
      {/* <Modal isVisible={fileNameModal} backdropOpacity={0.2}>
        <View
          style={{
            backgroundColor: DEFAULT_WHITE_COLOR,
            borderRadius: 20,
            padding: 15,
            flexDirection: "column",
            justifyContent: "center"
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 4
            }}>
            <TextInput
              placeholder="File Name"
              style={{
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 10,
                textAlign: "center"
              }}
              onChangeText={(e) => {
                setfileName(e);
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 4
            }}>
            <Button
              // title={t("ADD_PATIENT.SAVE_CREATE")}
              title={"Add Attachment"}
              onPress={() => {
                uploadPdf(null, null, null, path, fileName);
              }}></Button>
          </View>
        </View>
      </Modal> */}
      <Modal
        isVisible={successModal}
        style={{ margin: 0, padding: 0 }}
        animationIn="bounceInDown">
        <View
          style={{
            flex: 1,
            height: "25%",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 20,
            backgroundColor: DEFAULT_WHITE_COLOR,
            paddingHorizontal: 5
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              margin: 20
            }}>
            <View>
              <TouchableOpacity
                testID="closeTouch"
                accessibilityLabel="closeTouch"
                onPress={() => {
                  setsuccessModal(false);
                }}>
                <Image source={close} style={{ height: 12, width: 12 }} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={{ alignSelf: "center", justifyContent: "center" }}>
              <Icon
              testID="circleIcon"
              accessibilityLabel="circleIcon"
                name="checkcircle"
                type="AntDesign"
                style={{
                  color: DEFAULT_GREEN_COLOR,
                  fontSize: 80,
                  alignSelf: "center"
                }}
              />
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                  marginVertical: hp(10)
                }}
                testID="vaccineDataUpdatedText"
                accessibilityLabel="vaccineDataUpdatedText">
                Vaccine data updated
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList,
    templateList: state.templateList.templateList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSuccessNursing: (data) => dispatch(fetchSuccessNursing(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Plan));
