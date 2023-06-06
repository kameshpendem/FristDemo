import React, { useState, createRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Keyboard,
  Alert
} from "react-native";
import Search from "../../../../assets/images/search_patients.png";
import { APP_PRIMARY_COLOR } from "../../../../themes/variable";
import close from "../../../../assets/images/cross.png";
import { Right, Icon } from "native-base";
import { Divider } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";
// import {RadioButton} from 'react-native-paper';
import Feather from "react-native-vector-icons/Feather";
//import CheckBox from '@react-native-community/checkbox';
import RadioButton from "../../common/RadioButton";
import { CheckBox } from "react-native-elements";
import { withTranslation } from "react-i18next";
// import DateRange from '../../../../components/datePicker/DateRangePicker';
import moment from "moment";
import {
  getSuppliments,
  postSuppliment,
  getSupplimentsAdded,
  updateSuppliment,
  deleteSuppliment,
  getUnits
} from "../../../../redux/actions/addsuppliment_action";
import { getDrugTypes } from "../../../../redux/actions/addmedicine_action";
import ActionSheet from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";
import { styles } from "./AddMedicineStyles";
import {
  DEFINE,
  FREQUENCY,
  DURATIONDAY,
  CUSTOM,
  SYRUP,
  DAYS,
  ADAYS,
  MEDICINE,
  CONSULTATION,
  DURATION,
  DURATION_START_DATE,
  INTERVAL,
  ISDISPLAY,
  OFTEN
} from "../../common/Constants";
import calStyles from "../../../../screens/app/homescreen/HomeScreenStyles";
import { connect } from "react-redux";
//import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import { DeviceEventEmitter } from "react-native";

import Collapsible from "react-native-collapsible";
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

function AddSuppliment(props) {
  const [medicines, setMedicines] = useState([]);
  const [addedMeds, setAddedMeds] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [medcol, setMedCol] = useState(null);
  const [meds, setMeds] = useState([]);
  const [value, setValue] = useState("");
  const [dates, setDates] = useState({
    markedDates: {},
    isStartDatePicked: false,
    isEndDatePicked: false,
    startDate: ""
  });
  const [pickerMode, setPickerMode] = useState(null);
  const [syrupunit, setSyrupUnit] = useState([]);
  const [powderml, setPowderml] = useState([]);
  const [capsule, setCapsule] = useState([]);
  const [customAdd, setcustomAdd] = useState(false);
  const [drugTypes, setDrugTypes] = useState([]);
  const actionSheetRef = createRef();
  const showTimePicker = () => {
    setPickerMode("time");
  };

  const hidePicker = () => {
    setPickerMode(false);
  };

  const handleConfirm = (date) => {
    // In order to prevent the double-shown popup bug on Android, picker has to be hidden first (https://github.com/react-native-datetimepicker/datetimepicker/issues/54#issuecomment-618776550)
    hidePicker();
  };

  const changeSelectedDate = (event, selectedDate, idx, edit, med) => {
    const currentDate = selectedDate || meds[idx].mydate;
    onChange({ val: currentDate, name: "mydate", idx, edit: edit, med });
    onChange({ val: false, name: "isDisplayDate", idx, edit: edit, med });
  };

  const { t, patientList } = props;
  const Frequency = ["Daily", "Weekly", "Monthly", "Yearly"];
  const Duration = ["Days", "Weekly", "Monthly", "Yearly"];
  const Freq = ["Once", "Twice", "Thrice"];
  const Unit = ["ml"];
  const Quantity = ["Tab"];
  const Food = [
    { id: "1", Food: "Before Food" },
    { id: "2", Food: "After Food" },
    { id: "3", Food: "Bed Time" },
    { id: "4", Food: "Empty Stomach" }
  ];

  const times = (med, idx, edit) => {
    const hours = med?.mydate?.getHours() || 6;
    const min = med?.mydate?.getMinutes() || 0;
    // const hours = 6;
    // const min = 0;
    const mins = (min + "").length > 1 ? min : "0" + min || "00";
    if (med.often === DEFINE) {
      const time = 24;
      const split = med.interval != 0 && time / med.interval;
      let splitTimes = [];
      if (split) {
        Array.from({ length: split }).map((i, index) => {
          const hour = hours + index * med.interval;
          if (hour < 23) {
            const time = hour + ":" + mins;
            splitTimes = [...splitTimes, time];
          }
        });
      }
      onChange({ val: splitTimes, name: "drug_intake_timings", idx, edit });
      return splitTimes;
    } else {
      const time = 24;
      const split = Freq.indexOf(med.frequency) + 1;
      const divide = Math.floor(time / split);
      let splitTimes = [];
      Array.from({ length: split }).map((i, index) => {
        const hour = hours + index * divide;
        if (hour < 23) {
          const time = hour + ":" + mins;
          splitTimes = [...splitTimes, time];
        }
      });
      onChange({ val: splitTimes, name: "drug_intake_timings", idx, edit });
      return splitTimes;
    }
  };

  // console.log(meds, 'meds');s
  const units = async (unit) => {
    getUnits({ unit }).then((res) => {
      if (unit.toLowerCase() === "syrup") {
        setSyrupUnit(res.values);
      } else if (unit.toLowerCase() === "powder") {
        setPowderml(res.values);
      } else if (unit.toLowerCase() === "capsule") {
        setCapsule(res.values);
      }
    });
  };
  const getMeds = async (val) => {
    setValue(val);
    if (val.length > 2) {
      const payload = {
        sup: val,
        branch_id: patientList.appointment.branch_id,
        hlp_id: patientList.appointment.healpha_id
      };
      const medss = await getSuppliments(payload);
      console.log("medss", medss);
      if (medss?.values?.length > 0) {
        setMedicines(medss?.values || []);
      } else {
        // setTimeout(() => {
        Alert.alert(
          t("PLAN.SUPPLEMENT_NOT_AVAILABLE"),
          t("PLAN.ADD_SUPPLEMENT"),
          [
            {
              text: t("PLAN.YES"),
              onPress: () => {
                setcustomAdd(true);
                setMedicines([
                  {
                    drug_name: val,
                    strength: "",
                    unit: "",
                    drug_type: "",
                    drug_id: ""
                  }
                ]),
                  setValue(val);
              }
            },
            {
              text: t("PLAN.CANCEL"),
              onPress: () => {
                setcustomAdd(false), setMedicines([]), setValue("");
              }
            }
          ]
        );
        // }, 500);
      }
    }
  };

  const setCustom = (e) => {
    if (e.trim() === "") {
      setcustomAdd(false);
      setMedicines([]);
      setValue("");
    } else {
      setMedicines([
        { drug_name: e, strength: "", unit: "", drug_type: "", drug_id: "" }
      ]),
        setValue(e);
    }
  };
  // console.log(patientList, 'hiii');
  const getAddedMeds = async () => {
    const payload = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    const meds = await getSupplimentsAdded(payload);
    const filData = meds?.prescriptions.map((i) => {
      const often = i.times?.toLowerCase()?.includes("hours")
        ? DEFINE
        : i.times
        ? FREQUENCY
        : "";
      let data = {
        // ...i,
        i: i.id,
        drug_name: i.drug_name,
        dose: i.dose,
        dose_unit: i.dose_unit,
        times: i.interval
          ? `${i.interval} hours`
          : `${i.frequency} ${i.freq}` || "",
        drug_when: i.drug_when,
        // duration: `${i.duration} ${i.durationType}` || "",
        duration_start_date: i.duration_start_date
          ? moment(i.duration_start_date).format("YYYY-MM-DD")
          : "",
        duration_end_date: i.duration_end_date
          ? moment(i.duration_end_date).format("YYYY-MM-DD")
          : "",
        // sos_status: i.check,
        drug_intake_timings: i.drug_intake_timings || [],
        notes: i.notes,
        drug_type: i.drug_type,
        interval:
          often === DEFINE
            ? i?.times?.toLowerCase()?.split("hours")[0] || ""
            : "",
        frequency: often === FREQUENCY ? i?.times?.split(" ")[0] : "",
        freq: often === FREQUENCY ? i?.times?.split(" ")[1] : "",
        duration: i?.duration?.split(" ")[0] || "",
        durationTime: i?.duration?.split(" ")[1] || DAYS,
        check: i.sos_status,
        often,
        customDay: i.duration ? DURATIONDAY : CUSTOM
      };
      if (i.dose_unit === SYRUP) {
        data = {
          ...data,
          dose: i?.dose?.split(" ")[0],
          unit: i?.dose?.split(" ")[1]
        };
      }

      return data;
    });

    setAddedMeds(filData || []);
  };

  const getTypes = async () => {
    await getDrugTypes()
      .then((res) => {
        setDrugTypes(res.values);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "danger" });
      });
  };

  useEffect(() => {
    getTypes();
    getAddedMeds();
    units("syrup");
    units("powder");
    units("capsule");
  }, []);

  //  let doctor_id = await AsyncStorage.getItem('doctorid');

  const onChange = ({ val, name, idx, edit, med }) => {
    // console.log(val, "notes");
    let data = edit ? [...addedMeds] : [...meds];
    if (name === INTERVAL) {
      data[idx].often = DEFINE;
      data[idx].frequency = "";
    }
    if (name === FREQUENCY) {
      data[idx].often = FREQUENCY;
      data[idx].interval = "";
    }
    if (name === DURATION) {
      data[idx].customDay = DURATIONDAY;
      data[idx].duration_start_date = "";
      data[idx].duration_end_date = "";
    }
    if (name === DURATION_START_DATE) {
      data[idx].customDay = CUSTOM;
      data[idx].duration = "";
    }
    data[idx][name] = data[idx][name] === val ? "" : val;
    edit ? setAddedMeds(data) : setMeds(data);
    if (name === INTERVAL || name === FREQUENCY || name === ISDISPLAY) {
      times(med, idx, edit);
    }
  };

  const onAdd = async (i, custom) => {
    let data;
    if (!custom) {
      if (!i?.unit.trim()) {
        data = await getDrugTypes(i?.drug_type);
      }
    }
    const tempDate = new Date();
    tempDate.setHours(6);
    tempDate.setMinutes(0);
    const med = {
      drug_name: custom ? value : `${i.drug_name} ${i.strength} ${i.unit}`,
      dose: i?.drug_type !== SYRUP ? "1" : "1",
      // dose: i.drug_type !== SYRUP ? "1" : i.strength,
      dose_unit: custom
        ? ""
        : i?.unit
        ? i?.unit
        : data?.values[0]?.prescription_unit,
      drug_type: i.drug_type,
      unit: custom
        ? ""
        : i?.unit
        ? i?.unit
        : data?.values[0]?.prescription_unit,
      times: "",
      // drug_intake_timings: "",
      drug_when: "After Food",
      duration: "2",
      freq: "A",
      frequency: "Twice",
      durationTime: DAYS,
      duration_start_date: "",
      duration_end_date: "",
      notes: "",
      often: FREQUENCY,
      drug_category: MEDICINE,
      sos_status: false,
      mydate: tempDate,
      isDisplayDate: false,
      customDay: DURATIONDAY,
      check: false,
      drug_intake_timings: ["6:00", "18:00"],
      brand: custom ? "" : i?.brand,
      custom: custom
    };
    setMeds((prevVal) => [...prevVal, med]);
    setValue("");
    setcustomAdd(false);
    setMedicines([]);
  };
  // console.log(meds[0]?.isDisplayDate, "diplay date");

  const deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [2000];
  };

  const onAddMed = async ({ idx }) => {
    let errorText = "";
    if (meds.length < 1)
      return NativeToast({
        text: t("PLAN.PLEASE_SEARCH_SUPPLEMENT"),
        type: "warning"
      });
    let dose_value = "";
    let variables = meds.map((i) => {
      dose_value = i.dose_unit;
      const drug = i.drug_intake_timings;
      const timeInterval =
        i.often == DEFINE
          ? i.interval
            ? `${i.interval} Hours`
            : ""
          : i.frequency || "";
      const sos = timeInterval || i.check;
      const DurationInterval =
        i.customDay == DURATIONDAY
          ? i.duration && i.durationTime
            ? `${i.duration} Days`
            : ""
          : i.customDay || "";
      if (!i?.dose.toString().trim())
        return (errorText = t("PLAN.REQUIRED_DOSE"));
      if (!timeInterval.trim() && !sos)
        return (errorText = t("PLAN.REQUIRED_INTERVAL"));
      if (!i?.drug_when.trim()) return (errorText = t("PLAN.REQUIRED_WHEN"));
      if (!DurationInterval.toString().trim())
        return (errorText = t("PLAN.REQUIRED_DURATION"));
      //if (!i?.notes.trim()) return (errorText = "Required notes!");
      console.log("i.dose_unit i.dose_unit i.dose_unit ", i.dose_unit);
      let data = {
        drug_name: i.drug_name,
        drug_type: i.drug_type,
        dose: i.dose,
        dose_unit: i.dose_unit,
        times: i.interval
          ? `${i.interval} Hours`
          : `${i.frequency} ${i.freq}` || "",
        drug_intake_timings: i.drug_intake_timings || [],
        sos_status: i.check,
        drug_when: i.drug_when,
        duration:
          i.customDay === CUSTOM ? "" : `${i.duration} ${i.durationTime}` || "",
        duration_start_date: i.duration_start_date,
        duration_end_date: i.duration_end_date,
        notes: i.notes
      };
      if (i.dose_unit === SYRUP) {
        data["dose"] = `${i.dose} ${i.unit}`;
      }
      return data;
    });

    if (errorText) return NativeToastTop({ text: errorText, type: "warning" });
    const valid = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id,
      template_id: props.navigation.state.params.templateId
    };
    if (idx) {
      variables = variables.filter((i, index) => index === idx);
    }
    if (dose_value) {
      await postSuppliment(variables, valid)
        .then((res) => {
          //console.log(res, "response");
          let data = [...meds];
          data = idx ? data.filter((i, index) => index !== idx) : [];
          setMeds(data);
          // alert('Suppliment Created');
          !idx && props.navigation.goBack();

          if (res) {
            deviceEmit();
            NativeToast({ text: "Suppliment Added", type: "success" });
            DeviceEventEmitter.emit("getSupplimentData", {
              enc_id: patientList.encounter_id,
              doc_id: patientList.appointment.doc_id,
              hlp_id: patientList.appointment.healpha_id
            });

            !idx && props.navigation.goBack();
          }
        })
        .catch((res) => {
          console.log("res.message res.message ", res.message);
          NativeToast({ text: res.message, type: "warning" });
        });
    } else {
      NativeToast({ text: "Dose Unit Required ", type: "warning" });
    }
  };
  //ON UPDATE MEDICINES
  const onMedUpdate = (i, data, idx) => {
    const valid = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id,
      id: i?.i
    };
    //console.log("before call", i?.id);
    updateSuppliment(data, valid)
      .then((res) => {
        let data = [...addedMeds];
        data = idx ? data.filter((i, index) => index !== idx) : [];
        setAddedMeds(data);
        // alert('Medicine Created');
        !idx && props.navigation.goBack();
        //console.log("before condition", res);
        if (res) {
          deviceEmit();
          NativeToast({ text: "Suppliment Updated", type: "success" });
          DeviceEventEmitter.emit("getSupplimentData", {
            enc_id: patientList.encounter_id,
            doc_id: patientList.appointment.doc_id,
            hlp_id: patientList.appointment.healpha_id
          });
          !idx && props.navigation.goBack();
        }
      })
      .catch((res) => {
        // console.log("err");
        NativeToast({ text: res.message, type: "warning" });
      });
  };
  const onupdateMed = async ({ idx }) => {
    let errorText = "";
    let variables = addedMeds.map((i) => {
      const timeInterval =
        i.often == DEFINE
          ? i.interval
            ? `${i.interval} Hours`
            : ""
          : i.frequency || "";

      const DurationInterval =
        i.customDay == DURATIONDAY
          ? i.duration
            ? `${i.duration} Days`
            : ""
          : i.customDay || "";

      if (!i?.dose.toString().trim()) return (errorText = "Required dose!");
      if (!timeInterval.trim()) return (errorText = "Required interval!");
      if (!i?.drug_when.trim()) return (errorText = "Required Drug when!");
      if (!DurationInterval.toString().trim())
        return (errorText = "Required duration!");
      // if (!i?.notes.trim()) return (errorText = "Required notes!");
      let data = {
        drug_name: i.drug_name,
        dose: i.dose,
        dose_unit: i.dose_unit,
        //drug_intake_timings: i.drug_intake_timings,
        drug_when: i.drug_when,
        duration_start_date: i.duration_start_date,
        duration_end_date: i.duration_end_date,
        notes: i.notes,
        times:
          i.often == DEFINE
            ? i.interval
              ? `${i.interval} Hours`
              : ""
            : `${i.frequency} ${i.freq}` || "",
        duration:
          i.customDay === CUSTOM ? "" : `${i.duration} ${i.durationTime}` || "",
        sos_status: i.check,
        drug_intake_timings: i.drug_intake_timings || []
      };

      if (i.dose_unit === SYRUP) {
        data["dose"] = `${i.dose} ${i.unit}`;
      }
      if (!idx) {
        onMedUpdate(i, data, idx);
      }
      return data;
    });
    if (errorText) return NativeToastTop({ text: errorText, type: "warning" });

    if (idx) {
      variables = variables.find((i, index) => index === idx) || {};
      onMedUpdate(i, variables, idx);
    }
  };

  // console.log(startEnd);

  const onDayPress = (day, idx, actionSheetRef, edit, med) => {
    if (!dates.isStartDatePicked) {
      let markedDates = {};
      markedDates[day.dateString] = {
        startingDay: true,
        color: "#00B0BF",
        textColor: "#FFFFFF"
      };
      setDates({
        markedDates: markedDates,
        isStartDatePicked: true,
        isEndDatePicked: false,
        startDate: day.dateString
      });
      onChange({
        val: moment(day.dateString).format("YYYY-MM-DD"),
        name: "duration_start_date",
        idx,
        edit: edit,
        med
      });
    } else {
      let markedDates = dates.markedDates;
      let startDate = moment(dates.startDate);
      let endDate = moment(day.dateString);
      let range = endDate.diff(startDate, "days");
      if (range > 0) {
        for (let i = 1; i <= range; i++) {
          let tempDate = startDate.add(1, "day");
          tempDate = moment(tempDate).format("YYYY-MM-DD");
          if (i < range) {
            markedDates[tempDate] = { color: "#00B0BF", textColor: "#FFFFFF" };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: "#00B0BF",
              textColor: "#FFFFFF"
            };
          }
        }
        setDates({
          markedDates: markedDates,
          isStartDatePicked: false,
          isEndDatePicked: true,
          startDate: ""
        });
        onChange({
          val: moment(endDate).format("YYYY-MM-DD"),
          name: "duration_end_date",
          idx,
          edit: edit,
          med
        });
        actionSheetRef.current?.setModalVisible();
      } else {
        alert("Select an upcomming date!");
      }
    }
  };
  const GetMedicineData = async (val) => {
    const medicineData = await getSupplimentsAdded(val);
    setMedicineData(medicineData.prescriptions);
  };
  const DeleteMedData = async (i) => {
    const variable = {
      id: i?.i,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };

    await deleteSuppliment(variable)
      .then((res) => {
        // GetMedicineData({
        //   enc_id: patientList.encounter_id,
        //   doc_id: patientList.appointment.doc_id,
        //   hlp_id: patientList.appointment.healpha_id
        // });
        getAddedMeds();
        DeviceEventEmitter.emit("getSupplimentData", {
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        NativeToast({ text: res.message, type: "success" });
        //  props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const renderCalenderModal = (idx, actionSheetRef, edit) => {
    return (
      <View style={calStyles.modalPaddingStyles}>
        <View style={calStyles.closeModal}>
          <View>
            <Calendar
              current={Date()}
              hideExtraDays={true}
              // monthFormat={'MMMM yyyy'}
              markedDates={dates.markedDates}
              markingType="period"
              onDayPress={(day) => onDayPress(day, idx, actionSheetRef, edit)}
            />
          </View>
        </View>
      </View>
    );
  };
  const Medical = ({ med, idx1, edit }) => {
    // const [notes, setNotes] = useState("");
    // const [quantity, setQuantity] = useState("");
    // const isSyrup = med.dose_unit.toLowerCase() === "syrup";
    // const isCapsule = med.dose_unit.toLowerCase() === "capsule";
    // useEffect(() => console.log("render"), []);
    const MedCollapse = () => {
      return (
        <View style={styles.howmuch}>
          <Text style={styles.headings}
          testID="howMuchText"
          accessibilityLabel="howMuchText">How Much ?:</Text>
          {
            <View style={styles.flexes}>
              <View style={styles.fulllength}>
                <Text style={styles.headings}
                 testID="typeText"
                 accessibilityLabel="typeText">Type</Text>
                <View style={styles.screentop}>
                  <SelectDropdown
                   testID="drupgTypeDropDown"
                   accessibilityLabel="drupgTypeDropDown"
                    data={med?.custom ? drugTypes : [med.drug_type]}
                    // defaultValueByIndex={1}
                    disabled={med?.custom ? false : true}
                    onSelect={(selectedItem, index) => {
                      let val = med?.custom
                        ? selectedItem?.drug_type
                        : selectedItem;
                      onChange({
                        val: val,
                        name: "drug_type",
                        idx: idx1,
                        edit: edit,
                        med
                      }),
                        med?.custom
                          ? onChange({
                              val: selectedItem?.prescription_unit,
                              name: "dose_unit",
                              idx: idx1,
                              edit: edit,
                              med
                            })
                          : null;
                    }}
                    defaultButtonText={med.drug_type}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return med?.custom
                        ? selectedItem?.drug_type
                        : selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return med?.custom ? item?.drug_type : item;
                    }}
                    buttonStyle={styles.dropdown4BtnStyle}
                    buttonTextStyle={styles.dropdown4BtnTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Feather
                        testID="arrowIcon"
                        accessibilityLabel="arrowIcon"
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
              <View style={styles.quantity1}>
                <View style={styles.quantity}>
                  <Text style={styles.headings}
                  testID="quantityText"
                  accessibilityLabel="quantityText">Quantity</Text>
                  <View style={styles.row}>
                    <View style={styles.flexborder}>
                      {Array.from({ length: 3 }).map((i, idx) => {
                        return (
                          <View key={idx}>
                            <TouchableOpacity
                            testID={idx+1+"touch"}
                            accessibilityLabel={idx+1+"touch"}
                              onPress={() => {
                                onChange({
                                  val: idx + 1,
                                  name: "dose",
                                  idx: idx1,
                                  edit: edit,
                                  med
                                });
                              }}
                              style={
                                med.dose == idx + 1
                                  ? styles.flexText1
                                  : styles.flexText
                              }>
                              <Text
                              testID={idx+1+"text"}
                              accessibilityLabel={idx+1+"text"}>{idx + 1}</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}

                      <TouchableOpacity style={styles.custom}
                      testID="quantityTextInputTouch"
                      accessibilityLabel="quantityTextInputTouch">
                        <TextInput
                        testID="quantityTextInput"
                        accessibilityLabel="quantityTextInput"
                          value={`${med.dose}`}
                          placeholder="custom"
                          style={{
                            margin: 0,
                            padding: 0,
                            textAlign: "center"
                          }}
                          onChangeText={(val) =>
                            // setQuantity(val)
                            onChange({
                              val: val,
                              name: "dose",
                              idx: idx1,
                              edit: edit,
                              med
                            })
                          }
                          onEndEditing={() => {}}
                          keyboardType="number-pad"
                          returnKeyType="done"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ marginLeft: 5, flex: 0.5 }}>
                  <Text style={styles.headings}>Unit</Text>
                  <View style={styles.screentop}>
                    <SelectDropdown
                      disabled={true}
                      data={
                        []
                        // isSyrup ? syrupunit : isCapsule ? capsule : powderml
                      }
                      // defaultValueByIndex={1}
                      onSelect={(selectedItem, index) => {
                        onChange({
                          val: selectedItem.prescription_unit,
                          name: "dose_unit",
                          idx: idx1,
                          edit: edit,
                          med
                        });
                      }}
                      defaultButtonText={
                        med?.dose_unit
                        // isSyrup
                        //   ? syrupunit[0]?.prescription_unit
                        //   : isCapsule
                        //   ? capsule[0]?.prescription_unit
                        //   : powderml[0]?.prescription_unit
                      }
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item.prescription_unit;
                      }}
                      buttonStyle={styles.dropdown4BtnStyle}
                      buttonTextStyle={styles.dropdown4BtnTxtStyle}
                      renderDropdownIcon={(isOpened) => {
                        return (
                          <Feather
                          testID="arrowIcon"
                          accessibilityLabel="arrowIcon"
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
              </View>
            </View>

            // </View>
          }
          <Divider style={styles.divide} />
          <View style={styles.top}>
            <Text style={styles.headings}
            testID="howOftenText"
            accessibilityLabel="howOftenText">How Often</Text>
            <View style={styles.vertical}>
              <View style={styles.row}>
                <View style={styles.radioView}>
                  <RadioButton
                  testID="radioButton"
                  accessibilityLabel="radioButton"
                    onPress={() =>
                      onChange({
                        val: "define",
                        name: "often",
                        idx: idx1,
                        edit: edit,
                        med
                      })
                    }
                    value={med.often}
                    name={"define"}
                  />
                </View>
                <View style={styles.screentop}>
                  <Text style={styles.fs_16}
                  testID="defineIntervalsText"
                  accessibilityLabel="defineIntervalsText">Define Intervals</Text>

                  <View style={styles.flexborder}>
                    {Array.from({ length: 4 }).map((i, idx) => {
                      return (
                        <View key={idx}>
                          <TouchableOpacity
                            onPress={() =>
                              onChange({
                                val: (idx + 1) * 2,
                                name: "interval",
                                idx: idx1,
                                edit: edit,
                                med
                              })
                            }
                            style={
                              med.interval == (idx + 1) * 2
                                ? styles.flexText1
                                : styles.flexText
                            }>
                            <Text
                            testID={(idx + 1) * 2+"text"}
                            accessibilityLabel={(idx + 1) * 2+"text"}>{(idx + 1) * 2}h</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                    <TouchableOpacity style={styles.custom}
                    testID="intervalsTextInputTouch"
                    accessibilityLabel="intervalsTextInputTouch">
                      <TextInput
                      testID="intervalsTextInput"
                      accessibilityLabel="intervalsTextInput"
                        value={med.interval}
                        placeholder="custom"
                        style={{ margin: 0, padding: 0, textAlign: "center" }}
                        onChangeText={(val) =>
                          onChange({
                            val: val,
                            name: "interval",
                            idx: idx1,
                            edit: edit,
                            med
                          })
                        }
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.radioView}>
                  <RadioButton
                  testID="frequencyRadioButton"
                  accessibilityLabel="frequencyRadioButton"
                    onPress={() =>
                      onChange({
                        val: "frequency",
                        name: "often",
                        idx: idx1,
                        edit: edit,
                        med
                      })
                    }
                    value={med.often}
                    name={"frequency"}
                  />
                </View>

                <View style={styles.screentop}>
                  <Text style={styles.fs_16}
                  testID="frequencyText"
                  accessibilityLabel="frequencyText">Frequency</Text>
                  <View style={styles.row}>
                    <View>
                      <View style={styles.flexborder}>
                        {Freq.map((i, idx) => (
                          <TouchableOpacity
                          testID={i+"touch"}
                          accessibilityLabel={i+"touch"}
                            key={idx}
                            onPress={() => {
                              onChange({
                                val: i,
                                name: "frequency",
                                idx: idx1,
                                edit: edit,
                                med
                              });
                            }}
                            style={
                              med.frequency === i
                                ? styles.flexText1
                                : styles.flexText
                            }>
                            <Text style={styles.smalltext}
                            testID={i+"text"}
                            accessibilityLabel={i+"text"}>{i}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.countries}>
                      <View style={styles.screentop}>
                        <SelectDropdown
                        testID="frequencyDropDown"
                        accessibilityLabel="frequencyDropDown"
                          data={Frequency}
                          // defaultValueByIndex={1}
                          onSelect={(selectedItem, index) =>
                            onChange({
                              val: selectedItem,
                              name: "freq",
                              idx: idx1,
                              edit: edit,
                              med
                            })
                          }
                          defaultValue={med.freq}
                          defaultButtonText={"A Day"}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={styles.dropdown4BtnStyle}
                          buttonTextStyle={styles.dropdown4BtnTxtStyle}
                          renderDropdownIcon={(isOpened) => {
                            return (
                              <Feather
                              testID="frequencyArrow"
                              accessibilityLabel="frequencyArrow"
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
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Divider style={styles.divide} />
          <View style={styles.dataTime}>
            <View style={styles.time}>
              {med?.drug_intake_timings?.map((i, index) => {
                //console.log(i, "med?.drug_intake_timings?.map");
                return (
                  <TouchableOpacity
                  testID={i+"touch"}
                    accessibilityLabel={i+"touch"}
                    style={styles.timing}
                    key={index}
                    onPress={() => {
                      // index === 0
                      onChange({
                        val: true,
                        name: "isDisplayDate",
                        idx: idx1,
                        edit: edit,
                        med
                      });
                    }}>
                    <Text style={{ alignSelf: "center" }}
                    testID={i+"text"}
                    accessibilityLabel={i+"text"}>{i}</Text>
                    <Icon
                    testID="clockIcon"
                    accessibilityLabel="clockIcon"
                      name="clock"
                      type="EvilIcons"
                      style={styles.clockIcon}
                    />
                  </TouchableOpacity>
                );
              })}
              {med.isDisplayDate ? (
                <DateTimePickerModal
                testID="dateTimePicker"
                accessibilityLabel="dateTimePicker"
                  isVisible={true}
                  mode={"time"}
                  is24Hour
                  onConfirm={(selectedDate) =>
                    changeSelectedDate(null, selectedDate, idx1, edit, med)
                  }
                  onCancel={hidePicker}
                />
              ) : // )
              null}
            </View>
          </View>
          <View style={styles.check}>
            <CheckBox
            testID="sosCheckBox"
            accessibilityLabel="sosCheckBox"
              title="SOS"
              checked={med.check}
              onPress={() =>
                onChange({
                  val: !med.check,
                  name: "check",
                  idx: idx1,
                  edit: edit,
                  med
                })
              }
              checkedColor={APP_PRIMARY_COLOR}
            />
          </View>
          <Divider style={styles.divide} />
          <View style={styles.top}>
            <Text style={styles.headings}
            testID="whenText"
            accessibilityLabel="whenText">When</Text>
            <View style={styles.flexborder}>
              {Food.map((i, idx) => (
                <TouchableOpacity
                testID={i.Food+"touch"}
                accessibilityLabel={i.Food+"touch"}
                  key={idx}
                  onPress={() => {
                    onChange({
                      val: i.Food,
                      name: "drug_when",
                      idx: idx1,
                      edit: edit,
                      med
                    });
                  }}
                  style={
                    med.drug_when === i.Food
                      ? styles.flexText1
                      : styles.flexText
                  }>
                  <Text style={styles.smalltext}
                  testID={i.Food+"text"}
                  accessibilityLabel={i.Food+"text"}>{i.Food}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Divider style={[styles.divide, styles.vertical]} />
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="always">
              <View style={styles.row}>
                <Text style={styles.headings}
                testID="durationText"
                accessibilityLabel="durationText">Duration : </Text>
                <Text style={styles.textcolor}
                testID="howMuchNeedText"
                accessibilityLabel="howMuchNeedText">
                  Select how much the medicine needs to be consumed
                </Text>
              </View>
            </ScrollView>
            <View>
              <View style={styles.row}>
                <View style={(styles.top, { alignItems: "center" })}></View>
                <View style={styles.mt5}>
                  <View style={styles.row}>
                    <View
                      style={{
                        alignItems: "center",
                        top: 20,
                        marginRight: 5
                      }}>
                      <RadioButton
                      testID="durationRadioButton"
                      accessibilityLabel="durationRadioButton"
                        onPress={() =>
                          onChange({
                            val: "durationDay",
                            name: "customDay",
                            idx: idx1,
                            edit: edit,
                            med
                          })
                        }
                        value={med.customDay}
                        name={"durationDay"}
                      />
                    </View>

                    <View>
                      <View style={styles.flexborder}>
                        {Array.from({ length: 6 }).map((i, idx) => {
                          return (
                            <View key={idx}>
                              <TouchableOpacity
                               testID={idx+1+"touch"}
                               accessibilityLabel={idx+1+"touch"}
                                onPress={() =>
                                  onChange({
                                    val: idx + 1,
                                    name: "duration",
                                    idx: idx1,
                                    edit: edit,
                                    med
                                  })
                                }
                                style={
                                  med.duration == idx + 1
                                    ? styles.flexText1
                                    : styles.flexText
                                }>
                                <Text
                                testID={idx+1+"text"}
                                accessibilityLabel={idx+1+"text"}>{idx + 1}</Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.countries}>
                      <View style={styles.screentop}>
                        <SelectDropdown
                        testID="durationDropDown"
                        accessibilityLabel="durationDropDown"
                          data={Duration}
                          // defaultValueByIndex={1}
                          onSelect={(selectedItem, index) => {
                            onChange({
                              val: selectedItem,
                              name: "durationTime",
                              idx: idx1,
                              edit: edit,
                              med
                            });
                          }}
                          defaultValue={
                            med.durationTime ? med.durationTime : "Days"
                          }
                          defaultButtonText={
                            med.durationTime ? med.durationTime : "Days"
                          }
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={styles.dropdown4BtnStyle}
                          buttonTextStyle={styles.dropdown4BtnTxtStyle}
                          renderDropdownIcon={(isOpened) => {
                            return (
                              <Feather
                              testID="durationArrow"
                              accessibilityLabel="durationArrow"
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
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.row, styles.top]}>
            <View style={{ alignSelf: "center", marginRight: 5 }}>
              <RadioButton
              testID="radioButton"
              accessibilityLabel="radioButton"
                onPress={() =>
                  onChange({
                    val: "custom",
                    name: "customDay",
                    idx: idx1,
                    edit: edit,
                    med
                  })
                }
                value={med.customDay}
                name={"custom"}
              />
            </View>
            <View style={styles.screentop}>
              <Text style={styles.headings}
              testID="customText"
              accessibilityLabel="customText">Custom</Text>
              <View style={styles.dates}>
                {/* <DateRange /> */}
                <Text
                testID={med.duration_start_date+"text"}
                accessibilityLabel={med.duration_start_date+"text"}
                  onPress={() => actionSheetRef.current?.setModalVisible()}
                  style={styles.date}>
                  {med.duration_start_date
                    ? `${med.duration_start_date} - ${med.duration_end_date}`
                    : "StartDate - EndDate"}
                </Text>
                <Icon
                testID="clockIcon"
                accessibilityLabel="clockIcon"
                  name="clock"
                  type="EvilIcons"
                  fontSize={5}
                  onPress={() => actionSheetRef.current?.setModalVisible()}
                />
              </View>
              {/* <DateRanger /> */}
              <ActionSheet ref={actionSheetRef}>
                {renderCalenderModal(idx1, actionSheetRef, edit, med)}
              </ActionSheet>
            </View>
          </View>
          <Divider style={[styles.divide, styles.vertical]} />
          <View>
            <Text style={styles.headings}
            testID="notesText"
            accessibilityLabel="notesText">Notes</Text>
            {/* <TextInput
              // value={notes}
              defaultValue={med.notes}
              style={styles.note}
              onChangeText={(val) => setNotes(val)}
              multiline={true}
              blurOnSubmit={true}
              onEndEditing={() => {
                //console.log("on blur");
                onChange({
                  val: notes,
                  name: "notes",
                  idx: idx1,
                  edit: edit,
                  med
                });
              }}
              onBlur={() => {
                onChange({
                  val: notes,
                  name: "notes",
                  idx: idx1,
                  edit: edit,
                  med
                });
              }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            /> */}
            <TextInput
              // value={notes}
              defaultValue={med.notes}
              style={styles.note}
              onChangeText={(val) =>
                // setNotes(val)
                onChange({
                  val: val,
                  name: "notes",
                  idx: idx1,
                  edit: edit,
                  med
                })
              }
              multiline={true}
              blurOnSubmit={true}
              onEndEditing={() => {
                //console.log("on blur");
                // onChange({
                //   val: notes,
                //   name: "notes",
                //   idx: idx1,
                //   edit: edit,
                //   med
                // });
              }}
              // onBlur={() => {
              //   onChange({
              //     val: notes,
              //     name: "notes",
              //     idx: idx1,
              //     edit: edit,
              //     med
              //   });
              // }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </View>
        </View>
      );
    };
    return (
      <View key={idx1}>
        <View>
          <View style={styles.gap}></View>
          <TouchableOpacity
            onPress={() => setMedCol(+medcol == idx1 + 1 ? null : idx1 + 1)}>
            <View style={styles.tablet}>
              <View style={[styles.row, { width: "82%" }]}>
                <Text style={[styles.medicine]}
                testID={med.drug_name+"text"}
                accessibilityLabel={med.drug_name+"text"}>
                  {med.drug_name} {med?.brand ? `(${med.brand})` : ""}
                </Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                                  testID="deleteTouch"
                                  accessibilityLabel="deleteTouch"
                  onPress={() =>
                    props?.navigation?.state?.params?.edit
                      ? DeleteMedData(med)
                      : setMeds(meds.filter((i) => i.drug_id !== med.drug_id))
                  }>
                  <Icon
                  testID="deleteIcon"
                  accessibilityLabel="deleteIcon"
                    name="delete"
                    type="AntDesign"
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() =>
                  //   props?.navigation?.state?.params?.edit
                  //     ? onupdateMed({ idx: idx1 })
                  //     : onAddMed({ idx: idx1 })
                  // }
                  onPress={() =>
                    setMedCol(+medcol == idx1 + 1 ? null : idx1 + 1)
                  }>
                  <Icon
                  testID="checkIcon"
                  accessibilityLabel="checkIcon"
                    name="check"
                    type="AntDesign"
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          {edit === true ? (
            <Collapsible
              collapsed={!medcol ? true : +medcol == idx1 + 1 ? false : true}>
              {MedCollapse()}
            </Collapsible>
          ) : (
            MedCollapse()
          )}
        </View>
        <Divider style={styles.divide} />
      </View>
    );
  };
  return (
    <View style={styles.flex_1}>
      <MyStatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.addtext}
        testID="addSupplimentText"
        accessibilityLabel="addSupplimentText">
          {t("COMMON.ADD") + " " + t("PLAN.SUPPLIMENT")}
        </Text>
        <Right>
          <TouchableOpacity onPress={() => props.navigation.goBack()}
           testID="closeTouch"
           accessibilityLabel="closeTouch">
            <Image source={close} style={global.minimize_call?styles.crossimage1:styles.crossimage} 
            testID="closeImage"
            accessibilityLabel="closeImage"/>
          </TouchableOpacity>
        </Right>
      </View>
      {/* <SimpleHeader title="Add Medicines" navigation={props.navigation} /> */}
      <View style={styles.content}>
        <View style={styles.searchoutside}>
          <View style={styles.search}>
            <Image source={Search} style={styles.searchimg} 
            testID="searchImage"
            accessibilityLabel="searchImage"/>
            <TextInput
            testID="searchSupplimentTextInput"
            accessibilityLabel="searchSupplimentTextInput"
              value={value}
              onChangeText={(e) => {
                customAdd ? setCustom(e) : getMeds(e);
              }}
              placeholder={t("PLAN.SEARCH") + " " + t("PLAN.SUPPLIMENT")}
              style={styles.searchmedicine}
            />
          </View>
        </View>
        <View style={[styles.data, { zIndex: 9999 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            {/* {!!value &&
              medicines
                ?.filter(
                  (x) => !meds.map((med) => med.drug_id).includes(x.drug_id)
                )
                .map((i, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onAdd(i, customAdd)}>
                      <Text style={styles.medName}>{`${i.drug_name}  ${
                        i.strength
                      }${i.unit} ${customAdd ? "" : "|"} ${i.drug_type}`}</Text>
                    </TouchableOpacity>
                  );
                })} */}
            {!!value &&
              medicines
                ?.filter((x) => {
                  // console.log(
                  //   !addedMeds.find((med) => med.drug_name === x.drug_name),
                  //   !meds.find((med) => med.drug_name === x.drug_name),
                  //   "dolo"
                  // );
                  return (
                    !addedMeds.find((med) => med.drug_name === x.drug_name) &&
                    !meds.find((med) => med.drug_id === x.drug_id)
                  );
                })
                .map((i, index) => {
                  return (
                    <TouchableOpacity
                    testID={i.drug_name+"touch"}
                      accessibilityLabel={i.drug_name+"touch"}
                      key={index}
                      style={{ zIndex: 9999 }}
                      onPress={() => onAdd(i, customAdd)}>
                      <Text style={styles.medName}
                      testID={i.drug_name+"text"}
                      accessibilityLabel={i.drug_name+"text"}>{`${i.drug_name}  ${
                        i?.strength
                      }${i.unit} ${customAdd ? "" : "|"} ${
                        i?.drug_type
                      }`}</Text>
                      <Divider
                        style={[
                          styles.divide,
                          {
                            width: "85%",
                            alignSelf: "center"
                          }
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </View>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
          {meds.length > 0 &&
            meds.map((med, idx1) => {
              return <Medical med={med} idx1={idx1} edit={false} 
              testID="medicineIcon"
              accessibilityLabel="medicineIcon"/>;
            })}
          {props?.navigation?.state?.params?.edit &&
            addedMeds.map((med, idx1) => {
              return <Medical med={med} idx1={idx1} edit={true} 
              testID="medicineIcon"
              accessibilityLabel="medicineIcon"/>;
            })}
        </ScrollView>
      </View>
      <View style={styles.addbottom}>
        <TouchableOpacity
        testID="updateOrSaveSupplimentTouch"
        accessibilityLabel="updateOrSaveSupplimentTouch"
          style={styles.generate}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => {
              props?.navigation?.state?.params?.edit
                ? onupdateMed({ idx: false })
                : onAddMed({ idx: false });
            }, 500);
          }}>
          <Text style={styles.generatetext}
          testID="updateOrSaveSupplimentText"
          accessibilityLabel="updateOrSaveSupplimentText">
            {props?.navigation?.state?.params?.edit
              ? `${t("COMMON.UPDATE")} ${t("PLAN.SUPPLIMENT")}`
              : `${t("COMMON.SAVE")} ${t("PLAN.SUPPLIMENT")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList
  };
};

export default connect(mapStateToProps, null)(withTranslation()(AddSuppliment));
