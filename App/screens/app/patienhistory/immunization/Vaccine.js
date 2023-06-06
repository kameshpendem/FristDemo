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
import ImageResizer from "react-native-image-resizer";
import RNImageToPdf from "react-native-image-to-pdf";
import getBaseUrl, { getApiUrl } from "../../../../config/Config";
import ApiCall from "../../../../services/ApiCall";
import Pdf from "../../../../assets/images/adobe.png";
import close from "../../../../assets/images/close.png";
import AsyncStorage from "@react-native-community/async-storage";
import { Calendar } from "react-native-calendars";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import DatePicker1 from "react-native-date-picker";
import { wp, hp } from "../../../../themes/Scale";
import Cloud from "../../../../assets/images/cloud.png";
import Cal from "../../../../assets/images/cal.png";
import calender from "../../../../assets/images/dateIcon.png";
import { Left, Right, Body, Toast } from "native-base";
import Loader from "../../common/Loader";
import {
  getImmunization,
  updateActualdate
} from "../../../../redux/actions/immunization_action";
import { Divider } from "react-native-elements";
import {
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_SHADOW_COLOR,
  APP_PRIMARY_COLOR,
  FONT_FAMILY,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_INVERSE_LIGHT
} from "../../../../themes/variable";
import ActionSheet from "react-native-actions-sheet";

const fileSelRef = React.createRef();
const serviceRef = React.createRef();
const idRef = React.createRef();
const encounter = React.createRef();
const attachmentref = React.createRef();

const Vaccine = ({ patientList, t, navigation, search }) => {
  const [calopen, setcalOpen] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const [calselectedDate, setCalSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [id_val, setIdVal] = useState("");
  const [path, setPath] = useState("");
  const [mulImg, setMulImg] = useState([]);
  const [pdfpath, setPdfPath] = useState("");
  const [fileName, setfileName] = useState("");
  const [pdf, setPdf] = useState("");

  const [hlp_id, sethlp_id] = useState("");

  const getData = async () => {
    setLoading(true);
    const variables = {
      healpha_id: patientList?.appointment?.healpha_id,
      category: "immunization",
      search_text: search || ""
    };

    let data = await getImmunization(variables);
    setData(data.immunizations);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [search]);

  const onUpdateDate = async (e) => {
    // calenderSheetRef.current?.setModalVisible(false);
    const variables = {
      hlp_id: patientList?.appointment?.healpha_id,
      id: calopen,
      actual_date: e
    };
    console.log("variablescal",variables)

    await updateActualdate(variables)
      .then((res) => {
        setcalOpen(false);
        if (res) {
          NativeToast({
            text: "Immunization Updated,Actual date inserted",
            type: "success"
          });
          setTimeout(() => {
            getData({ healpha_id: hlp_id });
          }, 250);
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const CalenderSheet = () => {
    return (
      <View>
        <Calendar
        testID="calender"
        accessibilityLabel="calender"
          current={calselectedDate}
          markedDates={{
            [calselectedDate]: { selected: true }
          }}
          hideExtraDays={true}
          onDayPress={(day) => {
            onUpdateDate(day.dateString);
          }}
        />
      </View>
    );
  };
  const handleSelection = async (files) => {
    if (files && files.length) {
      uploadFile(files[0]);
    }
  };

  const showPdf = (pdflink) => {
    if (!pdflink) return alert("Invalid");
    navigation.navigate("ViewPdfScreen", {
      link: `${getApiUrl()}/${pdflink}`,
      // link: getApiUrl() + '/' + pdflink,
      screenname: "Immunization"
    });
  };

  const uploadFile = (file) => {
    const path = file.path;
    const id = id_val || idRef.current;

    let checkFile = path.split(".");

    if (checkFile.slice(-1)[0]?.toLowerCase() === "pdf") {
      let filename;
      filename = hlp_id + "_Immunization_" + id + ".pdf";
      setfileName(filename);
      console.log(path, file);
      setPdf(path);
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
              setfileName(filename);
              setPdf(path1);
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert(hlp_id, id, path1);
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

  const setImage = (hlp_id, id) => {
    serviceRef.current = id;
    // setIdVal(id);
    fileSelRef?.current?.openPicker();
  };

  const checkConvert = (hlp_id, id, path1) => {
    Alert.alert(
      t("VACCINATION.ATTACHMENT_ADDED"),
      t("VACCINATION.ADD_MORE"),
      [
        {
          text: t("COMMON.YES"),
          onPress: () => {
            setImage(hlp_id, id);
          }
        },
        {
          text: t("COMMON.NO"),
          onPress: () => convertPDF(id, path1)
        }
      ],
      { cancelable: false }
    );
  };

  const convertPDF = async (id, path1) => {
    // this.refs.loading.show();
    let filename = hlp_id + "_Immunization_" + id + ".pdf";

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
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setMulImg([]);
      setfileName(filename);
      setPdf(pdf.filePath);
    } catch (e) {
      console.log(e);
    }
  };
  const uploadPdf = async (encounterid, path, pdfname) => {
    const hlp_id = patientList.appointment.healpha_id;
    const id = id_val || idRef.current;
    let token = await AsyncStorage.getItem("jwt_token");
    let url =
      getBaseUrl() + `v1/person/${hlp_id}/immunization/${id}/attachment`;
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
        // console.log(res, 'response');
        if (res.message) {
          encounter.current = "";
          idRef.current = "";
          setPdf("");
          setfileName("");
          getData();
          NativeToastTop({
            text: res.message,
            type: "success"
          });
        } else {
          Toast.show({
            text: "Upload Failed",
            type: "danger",
            duration: 5000
          });
        }
      })
      .catch((err) => {
        NativeToastTop({
          text: err.message,
          type: "danger"
        });
      });
  };
  const colorCode = (dd, ad) => {
    let today = new Date(),
      actual = new Date(ad),
      due = new Date(dd),
      timeDiff = Math.abs(actual.getTime() - due.getTime()),
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (due <= today) {
      if (ad != null && ad != "") {
        if (ad == dd) {
          return "#006400";
        } else if (diffDays < 7) {
          return "#ff8503";
        } else {
          return "#d53600";
        }
      } else {
        return "#6c757d";
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            onPress={() => attachmentref.current?.setModalVisible(false)}
            testID="closeTouch"
            accessibilityLabel="closeTouch">
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
              testID="fileNameText"
              accessibilityLabel="fileNameText">{t("COMMON.NAME_FILE")}</Text>
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
              testID={pdf+"text"}
              accessibilityLabel={pdf+"text"}
                ellipsizeMode="head"
                numberOfLines={1}
                style={{ width: "70%" }}>
                {pdf}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setImage(encounter.current, idRef.current);
                }}
                style={{
                  backgroundColor: DEFAULT_INVERSE_LIGHT,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5
                }}
                testID="browseTouch"
                accessibilityLabel="browseTouch">
                <Text testID="browseText"
                accessibilityLabel="browseText">{t("COMMON.BROWSE")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            uploadPdf(encounter.current, pdf, fileName);
          }}
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            padding: 10,
            margin: 5,
            borderRadius: 5
          }}
          testID="selectedUploadTouch"
          accessibilityLabel="selectedUploadTouch">
          <Text
            style={{
              color: DEFAULT_WHITE_COLOR,
              textAlign: "center",
              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              fontSize: 18
            }}
            testID="selectedUploadText"
            accessibilityLabel="selectedUploadText">
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
    <View style={{ height: "90%", paddingBottom: "20%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View
          style={{
            paddingHorizontal: wp(15),
            backgroundColor: DEFAULT_WHITE_COLOR
          }}>
          <DatePicker1
          testID="datePicker1"
          accessibilityLabel="datePicker1"
            modal
            open={calopen}
            mode="date"
            date={date}
            maximumDate={new Date(moment().format("YYYY-MM-DD"))}
            onConfirm={(date) => {
              onUpdateDate(moment(date).format("YYYY-MM-DD"));
            }}
            onCancel={() => {
              setcalOpen(0);
            }}
          />
          {data.map((i, index0) => {
            return (
              <View>
                <View style={{ marginVertical: 10 }} key={index0}>
                  <View
                    style={{
                      backgroundColor: DEFAULT_WHITE_COLOR
                    }}>
                    <Text style={{ marginVertical: hp(5) }}
                    testID={i.label+"text"}
                    accessibilityLabel={i.label+"text"}>{i.label}</Text>
                  </View>
                  <Divider style={styles.lineStyle} />
                </View>
                {i.data.map((i, index) => {
                  // console.log(item.immunizations.data.vaccine_name, 'map');
                  // console.log(i.immunization_vaccine.vaccine_name, 'Hello');
                  return (
                    <View style={{ marginVertical: 5 }} key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: DEFAULT_WHITE_COLOR
                        }}>
                        <Left style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                              color: colorCode(i.due_date, i.actual_date)
                            }}
                            testID={i.vaccine_name+"text"}
                            accessibilityLabel={i.vaccine_name+"text"}>
                            {i.vaccine_name}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row"
                            }}>
                            <Text style={{ color: DEFAULT_GREY_COLOR }}
                            testID="dueDateText"
                            accessibilityLabel="dueDateText">
                              Due Date:{" "}
                              {i?.due_date
                                ? moment(i.due_date).format("YYYY-MM-DD")
                                : null}
                              {/* Due Date: {} {?.substring(0, 10)} */}
                            </Text>

                            {/* Actual date: */}
                            {i?.actual_date ? (
                              <Text
                                style={{
                                  marginLeft: wp(10),
                                  color: DEFAULT_GREY_COLOR
                                }}
                                testID={i.actual_date+"text"}
                                accessibilityLabel={i.actual_date+"text"}>
                                Actual date:
                                {moment(i.actual_date).format("YYYY-MM-DD")}
                              </Text>
                            ) : null}
                          </View>
                        </Left>
                        <Right style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                              disabled={i.actual_date}
                              // onPress={() => {
                              //   calenderSheetRef.current?.setModalVisible(
                              //     true,
                              //   ),
                              //     setId(item.id);
                              // }}
                              onPress={() => setcalOpen(i.id)}
                              testID="calenderTouch"
                              accessibilityLabel="calenderTouch">
                              {/* <ActionSheet ref={calenderSheetRef}>
                                  {CalenderSheet()}
                                </ActionSheet> */}

                              <Image
                              testID="calenderImage"
                              accessibilityLabel="calenderImage"
                                source={calender}
                                style={{
                                  marginHorizontal: wp(15),
                                  width: 20,
                                  height: 20,
                                  opacity: i.actual_date ? 0.4 : 1
                                }}
                              />
                            </TouchableOpacity>
                            {i.immunization_files?.length ? (
                              <TouchableOpacity
                                onPress={() =>
                                  showPdf(i?.immunization_files[0]?.file_path)
                                }
                                testID="pdfTouch"
                                accessibilityLabel="pdfTouch">
                                <Image
                                testID="pdfImage"
                                accessibilityLabel="pdfImage"
                                  source={Pdf}
                                  style={{
                                    width: 22,
                                    height: 22
                                  }}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.labOrderIcon}
                                onPress={() => {
                                  idRef.current = i.id;
                                  encounter.current = i.encounter_id;
                                  attachmentref.current.setModalVisible(true);
                                }}
                                testID="cloudTouch"
                                accessibilityLabel="cloudTouch">
                                <Image
                                testID="cloudImage"
                                accessibilityLabel="cloudImage"
                                  source={Cloud}
                                  style={{ height: 22, width: 22 }}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </Right>
                      </View>
                      <Divider
                        style={(styles.lineStyle, { marginVertical: wp(10) })}
                      />
                      {/* </View> */}

                      {/* })} */}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        <ActionSheet
          onClose={() => {
            setfileName(""), setMulImg([]);
          }}
          ref={attachmentref}>
          {AttachmentFiles()}
        </ActionSheet>
        <FileSelector
          ref={fileSelRef}
          onSelection={handleSelection}
          onError={() => {
            if (mulImg?.length > 0) {
              convertPDF(id_val || idRef.current, "");
            }
          }}
          selectAny
          multiple={true}
        />
      </ScrollView>
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
)(withTranslation()(Vaccine));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_SHADOW_COLOR,
    marginVertical: 10
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    margin: 10,
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
    height: 50
  },
  dropdown4BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left" }
});
