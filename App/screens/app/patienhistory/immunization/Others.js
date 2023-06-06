import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Keyboard
} from "react-native";
import React, { useEffect, useState, createRef } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import FileSelector from "../../../../components/fileselector/FileSelector";
import moment from "moment";
import Modal from "react-native-modal";
import ImageResizer from "react-native-image-resizer";
import RNImageToPdf from "react-native-image-to-pdf";
import getBaseUrl, { getApiUrl } from "../../../../config/Config";
import ApiCall from "../../../../services/ApiCall";
import Pdf from "../../../../assets/images/adobe.png";
import close from "../../../../assets/images/close.png";
import AsyncStorage from "@react-native-community/async-storage";
import { Calendar } from "react-native-calendars";
import { NativeToast } from "../../common/Toaster";
import ActionSheet from "react-native-actions-sheet";
import DatePicker from "react-native-datepicker";
import { wp, hp } from "../../../../themes/Scale";
import Feather from "react-native-vector-icons/Feather";
import Cloud from "../../../../assets/images/cloud.png";
import calender from "../../../../assets/images/dateIcon.png";
import { Left, Right, Toast } from "native-base";
import SelectDropdown from "react-native-select-dropdown";
import Loader from "../../common/Loader";
import {
  getSearchVaccine,
  saveVaccination
} from "../../../../redux/actions/addVaccine_action";
import { Divider } from "react-native-elements";
import {
  getImmunization,
  updateActualdate
} from "../../../../redux/actions/immunization_action";
import {
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  FONT_FAMILY,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_INVERSE_LIGHT
} from "../../../../themes/variable";
import DatePicker1 from "react-native-date-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";

const idRef = React.createRef();
const actionSheetRef = React.createRef();
const addRef = React.createRef();

const vaccinenameRef = React.createRef();
const vaccineidRef = React.createRef();
const vaccinedateRef = React.createRef();
const pdfRef = React.createRef();
const selectRef = React.createRef();
const selectRef1 = React.createRef();
const attachmentref = React.createRef();

const Others = ({ patientList, t, navigation, search }) => {
  const [otherData, setOtherData] = useState([]);
  const OthercalenderSheetRef = createRef();
  const [vaccineNameTypes, setVaccineNameTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const [showAddVaccince, setshowAddVaccince] = useState(false);

  const [othercalselectedDate, setOtherCalselectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [enc_id, setEncId] = useState("");
  const [id_val, setIdVal] = useState("");
  const [url_val, setUrlVal] = useState("");
  const [path, setPath] = useState("");
  const [mulImg, setMulImg] = useState([]);
  const [pdfpath, setPdfPath] = useState("");
  const [pdf, setPdf] = useState("");
  const [id, setId] = useState("");
  const [calopen, setcalOpen] = useState(0);
  const [hlp_id, sethlp_id] = useState("");
  const [fileName, setfileName] = useState("");
  const [dateChild, setdateChild] = useState(
    vaccinedateRef?.current ? vaccinedateRef?.current : ""
  );
  const [datePicker, setdatePicker] = useState(false)

  const getVaccine = async () => {
    const data = await getSearchVaccine({
      hlp_id: patientList?.appointment?.healpha_id
    });
    console.log(data, "Hello");
    setVaccineNameTypes(data.vaccines);
  };

  const setImage = ( id) => {
    addRef.current;
    console.log(selectRef.current, "fileSelRef");
    setIdVal(id);
    setTimeout(() => {
      selectRef?.current?.openPicker();
    }, 250);
  };

  const setImage1 = () => {
    selectRef1.current.openPicker();
  };

  const handleSelection = async (files) => {
    if (files && files.length) {
      uploadFile(files[0]);
    }
  };
  const handleSelection1 = async (files) => {
    if (files && files.length) {
      uploadFile1(files[0]);
    }
  };

  const uploadFile = (file) => {
    const path = file.path;
    const id = id_val || idRef.current;
    const url = url_val;

    let checkFile = path.split(".");

    if (checkFile.slice(-1)[0]?.toLowerCase() === "pdf") {
      let filename;
      if (id) {
        filename = hlp_id + "_Immunization_" + id + ".pdf";
      } else {
        filename = hlp_id + "_Immunization_.pdf";
      }
      setPdfPath(path);
      setfileName(filename);
      setPdf({ filePath: path, filename });
    } else {
      try {
        ImageResizer.createResizedImage(path, 800, 650, "JPEG", 50, 0)
          .then(({ path }) => {
            setPath(path);
            const path1 = path;
            let source;
            source = { path: path1 };
            if (path1.split(".")[1] == "pdf") {
              let filename;
              filename = hlp_id + "_Immunization_" + id + ".pdf";
              setPdfPath(path1);
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert(hlp_id, id, url, file, path1);
              }, 250);
            }
          })
          .catch((err) => {
            // console.log('err', err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const uploadFile1 = (file) => {
    const path = file.path;
    const id = id_val || idRef.current;
    const url = url_val;

    let checkFile = path.split(".");

    if (checkFile.slice(-1)[0]?.toLowerCase() === "pdf") {
      let filename;
      if (id) {
        filename = hlp_id + "_Immunization_" + id + ".pdf";
      } else {
        filename = hlp_id + "_Immunization_.pdf";
      }
      setPdfPath(path);
      setfileName(filename);
      setPdf({ filePath: path, filename });
    } else {
      try {
        ImageResizer.createResizedImage(path, 800, 650, "JPEG", 50, 0)
          .then(({ path }) => {
            setPath(path);
            const path1 = path;
            let source;
            source = { path: path1 };
            if (path1.split(".")[1] == "pdf") {
              let filename;
              filename = hlp_id + "_Immunization_" + id + ".pdf";
              setPdfPath(path1);
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert1(hlp_id, id, url, file, path1);
              }, 250);
            }
          })
          .catch((err) => {
            // console.log('err', err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkConvert = (hlp_id, id, url, file, path1) => {
    Alert.alert(
      t("VACCINATION.ATTACHMENT_ADDED"),
      t("VACCINATION.ADD_MORE"),
      [
        {
          text: t("COMMON.YES"),
          onPress: () => {
            {
              selectRef?.current;
              setImage(hlp_id, id, url);
            }
          }
        },
        {
          text: t("COMMON.NO"),
          onPress: () => {
            convertPDF(id, path1);
            addRef.current && openAction();
          }
        }
      ],
      { cancelable: false }
    );
  };
  const checkConvert1 = (hlp_id, id, url, file, path1) => {
    Alert.alert(
      t("VACCINATION.ATTACHMENT_ADDED"),
      t("VACCINATION.ADD_MORE"),
      [
        {
          text: t("COMMON.YES"),
          onPress: () => {
            {
              selectRef1?.current;
              setImage1(hlp_id, id, url);
            }
          }
        },
        {
          text: t("COMMON.NO"),
          onPress: () => {
            convertPDF1(id, path1);
          }
        }
      ],
      { cancelable: false }
    );
  };

  const convertPDF = async (id, path1) => {
    // this.refs.loading.show();
    const hlp_id = patientList.appointment.healpha_id;
    let filename = hlp_id + "_Immunization_" + id + ".pdf";
    let checkPath = [];
    if (!path1?.trim()) {
      checkPath = [...mulImg];
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
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setMulImg([]);
      setfileName(filename);
      setPdf({ filePath: pdf.filePath, filename });
    } catch (e) {
      console.log(e);
    }
  };

  const convertPDF1 = async (id, path1) => {
    // this.refs.loading.show();
    const hlp_id = patientList.appointment.healpha_id;
    let filename = hlp_id + "_Immunization_" + id + ".pdf";
    let checkPath = [];
    if (!path1?.trim()) {
      checkPath = [...mulImg];
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
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setMulImg([]);
      setfileName(filename);
      setPdf({ filePath: pdf.filePath, filename });
    } catch (e) {
      console.log(e);
    }
  };

  const uploadPdf = async (encounterid, path, pdfname) => {
    const id = idRef.current;
    let token = await AsyncStorage.getItem("jwt_token");
    let url =
      getBaseUrl() + `v1/person/${hlp_id}/immunization/${id}/attachment`;
    console.log(url, "urllll");
    let pt = new FormData();
    pt.append("description", "desc2");
    pt.append("file_name", pdfname);
    pt.append("file", {
      uri: "file://" + path,
      type: "application/jpeg",
      name: pdfname
    });

    ApiCall.post(url, pt, {
      Authorization: `Bearer ${token}`,
      otherHeader: "foo",
      "Content-Type": "multipart/form-data"
    })
      .then((res) => {
        if (res.message === "Attachment Saved.") {
          vaccinedateRef.current = "";
          vaccinenameRef.current = "";
          vaccineidRef.current = "";
          setfileName("");
          setfileName("");
          getOtherData();
          NativeToast({ text: "File Uploaded", type: "success" });
        } else {
          NativeToast({ text: "Upload failed", type: "warning" });
        }
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  // const onUpdateOtherDate = async (e) => {
  //   OthercalenderSheetRef.current?.setModalVisible(false);
  //   const variables = {
  //     hlp_id: patientList?.appointment?.healpha_id,
  //     id: id,
  //     actual_date: e,
  //   };

  //   await updateActualdate(variables)
  //     .then((res) => {
  //       if (res) {
  //         NativeToast({
  //           text: 'Immunization Updated,Actual date inserted',
  //           type: 'success',
  //         });
  //         getOtherData({healpha_id: hlp_id});
  //       }
  //     })
  //     .catch((res) => {
  //       NativeToast({text: res.message, type: 'danger'});
  //     });
  // };

  const onUpdateDate = async (e) => {
    // calenderSheetRef.current?.setModalVisible(false);
    const variables = {
      hlp_id: patientList?.appointment?.healpha_id,
      id: calopen,
      actual_date: e
    };

    await updateActualdate(variables)
      .then((res) => {
        setcalOpen(false);
        if (res) {
          NativeToast({
            text: "Immunization Updated,Actual date inserted",
            type: "success"
          });
          setTimeout(() => {
            getOtherData();
          }, 250);
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  useEffect(() => {
    getOtherData();
  }, [search]);

  const openAction = () => {
    setshowAddVaccince(true);
  };

  const showPdf = (pdflink) => {
    if (!pdflink) return alert("Invalid");
    navigation.navigate("ViewPdfScreen", {
      link: `${getApiUrl()}/${pdflink}`,
      // link: getApiUrl() + '/' + pdflink,
      screenname: "Immunization"
    });
  };

  const getOtherData = async () => {
    setLoading(true);
    const variables = {
      healpha_id: patientList?.appointment?.healpha_id,
      category: "other",
      search_text: search || ""
    };
    let data = await getImmunization(variables);
    console.log(data, "dataaa", variables);
    setOtherData(data.immunizations);
    setLoading(false);
    return data;
  };

  useEffect(() => {
    sethlp_id(patientList.appointment.healpha_id);
    getOtherData();
    getVaccine();
  }, []);

  const addVaccination = async () => {
    setshowAddVaccince(false);
    const variables = {
      hlp_id: patientList?.appointment?.healpha_id,
      id: vaccineidRef?.current,
      vaccine_taken_date: vaccinedateRef?.current
    };
    await saveVaccination(variables)
      .then((res) => {
        NativeToast({ text: res.message, type: "success" });
        getSearchVaccine();
        getOtherData();
        idRef.current = res.data.id; // added vaccine id after getting

        console.log(res, pdf, "from addVaccination");

        pdf.filePath && uploadPdf(hlp_id, pdf.filePath, fileName);
        pdfRef.current = "";
        vaccinedateRef.current = "";
        vaccineidRef.current = "";
        vaccinenameRef.current = "";
        idRef.current = null;
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const setdate = (date) => {
    console.log(JSON.stringify(date), vaccinenameRef, vaccineidRef);
    vaccinedateRef.current = JSON.stringify(date);
    setdateChild(date);
  };
  const enableDatePicker = (date) => {
    setdatePicker(true)
  };
  const handleDateOfOtherVaccine = (event,date) => {
    console.log("date",date)
    if (event.type === "dismissed") {
      setdatePicker(false)
      return;
    }else{
      setdate(date)
      setdatePicker(false)
    }
  };
  const VaccineAction = () => {
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: DEFAULT_WHITE_COLOR,
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0
        }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                fontSize: 20
              }}>
              {t("COVID_MONITORING.ADD VACCINE")}
            </Text>
          </View>
          <TouchableOpacity onPress={() => {setshowAddVaccince(false)
          setdateChild("")
          setfileName("");
          }}>
            <Image source={close} style={styles.close} />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10 }}>
          <View style={styles.screentop}>
            <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD }}>
              {t("COVID_MONITORING.VACCINE NAME")}
            </Text>
            <SelectDropdown
              data={vaccineNameTypes}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem.im_id);
                vaccineidRef.current = selectedItem.im_id;
                vaccinenameRef.current = selectedItem.vaccine_name;
              }}
              defaultButtonText={
                vaccineidRef?.current
                  ? vaccinenameRef?.current
                  : t("PATIENTS.SELECT") +
                    " " +
                    t("COVID_MONITORING.VACCINE NAME")
              }
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.vaccine_name;
              }}
              rowTextForSelection={(item, index) => {
                return item.vaccine_name;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR }}>
            {t("COVID_MONITORING.VACCINE TAKEN DATE")}
          </Text>
          <View style={{ flexDirection: "row" }}>
          <Image
                source={calender}
                style={{ width: 30, height: 30, alignSelf: "center" }}
              />
          <Button
              style = {{borderColor: DEFAULT_LIGHT_GREY_COLOR,
                borderWidth: 1,
                borderRadius: 1,
                padding: 0}}
              onPress={() =>
                 enableDatePicker("select_date")
              }
              >
              <Text style={{color:DEFAULT_LIGHT_GREY_COLOR}}>
                {dateChild!=""
                // ? new Date(moment(this.state.details?.dob))
                ?moment(dateChild).format("YYYY-MM-DD")
                : "select date"
                }
                </Text>
            </Button>
          {/* <DatePicker
            style={{ width: 200 }}
            confirmBtnText="confirm"
            cancelBtnText="cancel"
            date={dateChild}
            maxDate={new Date()}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(selectedDate) => {
              setdate(selectedDate);
            }}
          /> */}
          </View>
        </View>
        {datePicker && (
            <DateTimePicker
              testID="dateOfotherVaccine"
              accessibilityLabel="dateOfotherVaccine"
              value={
                dateChild!=""
                ? new Date(moment(dateChild))
                : new Date()}
              display="default"
              mode={"date"}
              onChange={(event, date) => {
                const new_date = moment(date).format('YYYY-MM-DD');
                handleDateOfOtherVaccine(event,new_date)
              }} 
              maximumDate={new Date()}
          />)}
        {/* <TouchableOpacity style={{marginVertical: 20}} onPress={()=>{
              }}>
              <Text
              style={{
                color: APP_PRIMARY_COLOR,
                fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
              }}>
              + {t('COVID_MONITORING.ADD_ATTACHMENT')}
              </Text>
            </TouchableOpacity> */}
        {!pdf && (
          <TouchableOpacity
            style={styles.labOrderIcon}
            onPress={() => {
              // idRef.current = item.id;
              addRef.current = true;
              setImage(null, null);
            }}>
            <FileSelector
              ref={selectRef}
              onError={() => {
                if (mulImg?.length > 0) {
                  convertPDF(id_val || idRef.current, "");
                }
              }}
              onSelection={handleSelection}
              selectAny
              multiple={true}
            />
            <Text
              style={{
                color: APP_PRIMARY_COLOR,
                fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
              }}>
              + {t("COVID_MONITORING.ADD_ATTACHMENT")}
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ marginTop: !pdf ? 0 : 10 }}>
          <TextInput
            style={styles.allergyinput}
            placeholder={`${t("TIMELINE.ENTER_NAME")}`}
            defaultValue={fileName}
            blurOnSubmit={true}
            onChangeText={(e) => {
              setfileName(e);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.generate}
          onPress={() => {
            addVaccination();
            setdateChild("");
            setfileName("");
          }}>
          <Text style={styles.generatetext}>
            {t("COVID_MONITORING.SAVE_VACCINATION")}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
            }}>
            {t("TIMELINE.UPLOAD FILE")}
          </Text>
          <TouchableOpacity
            onPress={() => attachmentref.current?.setModalVisible(false)}>
            <Image source={close} style={{ width: 14, height: 14 }} />
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
              <Text>{t("COMMON.NAME_FILE")}</Text>
              <TextInput
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
                ellipsizeMode="head"
                numberOfLines={1}
                style={{ width: "70%" }}>
                {pdf?.filePath}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setImage1(null, null);
                }}
                style={{
                  backgroundColor: DEFAULT_INVERSE_LIGHT,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5
                }}>
                <Text>{t("COMMON.BROWSE")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            uploadPdf(null, pdf.filePath, fileName);
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
            }}>
            {t("COMMON.UPLOADED_SELECTED")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ marginTop: hp(50) }}>
        <Loader />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: DEFAULT_WHITE_COLOR,
        height: hp(675)
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: hp(65), paddingHorizontal: wp(15) }}>
        <DatePicker1
          modal
          open={calopen}
          mode="date"
          date={date}
          onConfirm={(date) => {
            onUpdateDate(moment(date).format("YYYY-MM-DD"));
          }}
          onCancel={() => {
            setcalOpen(0);
          }}
        />
        {otherData.map((i, index) => {
          return (
            <View style={{ marginVertical: 10 }}>
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    // paddingHorizontal: wp(10),
                    backgroundColor: DEFAULT_WHITE_COLOR
                  }}>
                  <Left style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                      }}>
                      {i.immunization_vaccine.vaccine_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "space-around"
                      }}>
                      <Text
                        style={{
                          color: DEFAULT_GREY_COLOR
                        }}>
                        {/* Due Date: {i.due_date?.substring(0, 10)} */}
                        {i?.due_date
                          ? `Due Date: ${i.due_date.substring(0, 10)}`
                          : null}
                      </Text>
                      <Text
                        style={{
                          color: DEFAULT_GREY_COLOR
                        }}>
                        {i?.actual_date
                          ? `Actual date: ${i.actual_date?.substring(0, 10)}`
                          : null}
                      </Text>
                    </View>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                      {!i.due_date && (
                        <TouchableOpacity
                          // disabled={i.actual_date}
                          // onPress={() => {
                          //   calenderSheetRef.current?.setModalVisible(
                          //     true,
                          //   ),
                          //     setId(item.id);
                          // }}
                          onPress={() => setcalOpen(i.id)}>
                          {/* <ActionSheet ref={calenderSheetRef}>
                                  {CalenderSheet()}
                                </ActionSheet> */}
                          <Image
                            source={calender}
                            style={{
                              marginHorizontal: wp(15),
                              width: 20,
                              height: 20
                              // opacity: 0.4,
                            }}
                          />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          idRef.current = i.id;
                          i?.immunization_files?.length > 0
                            ? showPdf(i?.immunization_files[0]?.file_path)
                            : (setEncId(i.encounter_id),
                              setIdVal(i.id),
                              attachmentref.current.setModalVisible(true));
                        }}>
                        {i?.immunization_files[0]?.file_path ? (
                          <Image
                            source={Pdf}
                            style={{
                              width: 22,
                              height: 22
                            }}
                          />
                        ) : (
                          <Image
                            source={Cloud}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                        <FileSelector
                          ref={selectRef1}
                          onError={() => {
                            if (mulImg?.length > 0) {
                              convertPDF1(id_val || idRef.current, "");
                            }
                          }}
                          onSelection={handleSelection1}
                          selectAny
                          multiple={true}
                        />
                      </TouchableOpacity>
                    </View>
                  </Right>
                </View>
              </View>
              <Divider style={styles.lineStyle} />
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          backgroundColor: DEFAULT_WHITE_COLOR,
          // top: Platform.OS === "ios" ? 0 : 10,
          position: "absolute",
          bottom: Platform.OS === "ios" ? 35 : 5,
          width: "100%",
          alignItems: "center"
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            alignSelf: "center",
            padding: 15,
            width: "90%",
            borderRadius: 5
          }}
          onPress={() => {
            openAction();
          }}>
          <Text style={styles.generatetext}>
            {" "}
            + {t("COVID_MONITORING.ADD VACCINE")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <ActionSheet ref={actionSheetRef}>{VaccineAction()}</ActionSheet> */}
      <ActionSheet ref={attachmentref}>{AttachmentFiles()}</ActionSheet>

      <Modal
        isVisible={showAddVaccince}
        style={{ margin: 0, padding: 0 }}
        useNativeDriver={true}
        backdropOpacity={0.5}>
        {/* <VaccineAction /> */}
        {VaccineAction()}
      </Modal>
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
)(withTranslation()(Others));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_SHADOW_COLOR,
    marginVertical: 10
  },
  allergyinput: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRadius: 5,
    marginTop: 2,
    padding: 5,
    height: 40
  },
  labOrderIcon: {
    marginVertical: 10
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5
  },
  screentop: { marginTop: 5 },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
  },
  close: {
    width: 12,
    height: 12
  },
  dropdown4BtnStyle: {
    width: "auto",
    height: "auto",
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: 40
  },
  dropdown4BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left" }
});
