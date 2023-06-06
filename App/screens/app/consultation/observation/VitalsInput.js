import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  DeviceEventEmitter,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  BackHandler,
  Text
} from "react-native";
import {
  Left,
  Body,
  ListItem,
  Container,
  Content,
  Button,
  Row,
  Col
} from "native-base";
import {
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  APP_PRIMARY_COLOR
} from "../../../../themes/variable";
import SafeAreaView from "react-native-safe-area-view";
import FooterButton from "../../common/FooterButton";
import { wp, lh, hp } from "../../../../themes/Scale";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import SimpleHeader from "../../common/SimpleHeader";
// import Vitals from '../../data/vitalLabels.json';
import {
  getVitalCalculation,
  getBmi,
  saveVitals,
  getBPCalculation,
  updateVitals,
  fetchVitalLabelssuccess
} from "../../../../redux/actions/observation_action";
import { getColor } from "../../../../themes/Theme";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import isArray from "../../../../utils/IsArray";
import Loader from "../../common/Loader";
import { renderDeviceMessage } from "../../../../utils/Utils";
import AsyncStorage from "@react-native-community/async-storage";

import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import RefreshIcon from "../../../../assets/images/refresh.svg";
import { theme } from "../../../../themes/Theme";
import LocationEnabler from "react-native-location-enabler";
import { healphaCallEventEmitter } from "../../../HomeScreen/MyPractice/Constants";
import { getCaptureVitals } from "../../../../redux/actions/timeline_action";
// if (Platform.OS === "android") {
// let LocationEnabler=require('react-native-location-enabler');
// }
const VitalsInput = ({
  navigation,
  vitallabels,
  patientList,
  templateList,
  t
}) => {
  const [nurseNotes, setNurseNotes] = useState("");
  const [enc_id, setenc_id] = useState();
  const [doc_id, setdoc_id] = useState();
  const [healphaId, sethealphaId] = useState();
  const template = useState(true);
  const [vitalsInput, setvitalsInput] = useState({});
  const [vitals, setvitals] = useState();
  const [demo, setDemo] = useState("");
  const [edit, setedit] = useState(false);
  const [vitalsId, setvitalsId] = useState("");
  const [loading, setloading] = useState(true);
  const [temp_id, set_temp_id] = useState();
  // const [timeline, settimeline] = useState(false);
  const [refreshing, setrefreshing] = useState(false);
  const [refreshing1, setrefreshing1] = useState(false);

  const { encounter_id, doctor_id, hlp_id, template_id, timeline } =
    navigation?.state?.params || {};
  const [device_connection_object, set_device_connection_object] = useState({
    device_flag: "",
    bp_val: "",
    pulse_oxi_meter_val: "",
    temperature_val: ""
  });

  const [devices, set_devices] = useState([]);
  const [isEnabled, set_isEnabled] = useState("");

  const [devicecount, set_devicecount] = useState("0");

  const [connected, set_connected] = useState(false);
  let intervalId = useRef(null);

  const handleVitalChanges = async (e) => {
    let colorKey = e.key + "_color";
    {e.deviceeventflag?setvitalsInput(e.vitalsInput):null}
    if (!e.input.trim()) {
      let newState = e.deviceeventflag?e.vitalsInput:vitalsInput;
      if (e.key == "height" || e.key == "weight") {
        delete newState["bmi"];
        delete newState["bmi_color"];
      }

      delete newState[e.key];
      delete newState[colorKey];
      setvitalsInput(newState);
    } else {
      if (e.key == "systolic" || e.key == "diastolic" || e.key == "pefr") {
        if (e.deviceeventflag?e.vitalsInput['height']:vitalsInput["height"]) {
          const variables = {
            enc_id: e.deviceeventflag ? e.enc_id : enc_id,
            doc_id: e.deviceeventflag ? e.doc_id : doc_id,
            healphaId: e.deviceeventflag ? e.healphaId : healphaId,
            key: e.key,
            input: e.input,
            height: e.deviceeventflag?e.vitalsInput['height']:vitalsInput["height"]
          };
          await getBPCalculation(variables).then((res) => {
            if (res) {
              if (res.vital_value === null) {
                setvitalsInput((currentInput) => ({
                  ...currentInput,
                  // don't forget the brackets here,
                  [e.key]: e.input
                }));
              } else {
                setvitalsInput((currentInput) => ({
                  ...currentInput,
                  // don't forget the brackets here
                  [colorKey]: res.vital_value,
                  [e.key]: e.input
                }));
              }
            }
          });
        } else {
          NativeToast({ text: t("OBSERVATION.ENTER_HEIGHT"), type: "warning" });
        }
      } else {
        const variables = {
          enc_id: e.deviceeventflag ? e.enc_id : enc_id,
          doc_id: e.deviceeventflag ? e.doc_id : doc_id,
          healphaId: e.deviceeventflag ? e.healphaId : healphaId,
          key: e.key,
          input: e.input
        };
        console.log("variables1", variables);

        await getVitalCalculation(variables)
          .then((res) => {
            if (res) {
              if (res.vital_value === null) {
                setvitalsInput((currentInput) => ({
                  ...currentInput,
                  // don't forget the brackets here,
                  [e.key]: e.input
                }));
              } else {
                setvitalsInput((currentInput) => ({
                  ...currentInput,
                  // don't forget the brackets here
                  [colorKey]: res.vital_value,
                  [e.key]: e.input
                }));
              }
            }
          })
          .catch((res) => {
            NativeToast({ text: res.message, type: "warning" });
          });

        if (e.key == "height" || e.key == "weight") {
          const variables = {
            enc_id: e.deviceeventflag ? e.enc_id : enc_id,
            doc_id: e.deviceeventflag ? e.doc_id : doc_id,
            healphaId: e.deviceeventflag ? e.healphaId : healphaId,
            key: e.key,
            height: e.key == "height" ? e.input : vitalsInput["height"],
            weight: e.key == "weight" ? e.input : vitalsInput["weight"]
          };
          await getBmi(variables)
            .then((res) => {
              if (res) {
                if (res.vital_value === null) {
                  setvitalsInput((currentInput) => ({
                    ...currentInput,
                    // don't forget the brackets here
                    ["bmi"]: isNaN(res.bmi_value) ? "" : res.bmi_value
                  }));
                } else {
                  setvitalsInput((currentInput) => ({
                    ...currentInput,
                    // don't forget the brackets here
                    ["bmi_color"]: res.vital_value,
                    ["bmi"]: isNaN(res.bmi_value) ? "" : res.bmi_value
                  }));
                }
              }
            })
            .catch((res) => {
              NativeToast({ text: res.message, type: "warning" });
            });
        }
      }
    }
  };

  const deviceEmit = () => {
    DeviceEventEmitter.emit(healphaCallEventEmitter.getPatientCard, {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit(healphaCallEventEmitter.updateHomeScreen, {
        date: ""
      });
    DeviceEventEmitter.emit(healphaCallEventEmitter.VitalsLabes, {
      enc_id,
      doc_id,
      healphaId,
      templateId: navigation.state.params.templateId
    });
    [1000];
  };
  const getVitalLabels = async () => {
    const variables = {
      enc_id: timeline ? encounter_id : enc_id,
      doc_id: timeline ? doctor_id : doc_id,
      healpha_id: timeline ? hlp_id : healphaId,
      template_id: navigation.state.params.appointment?.templateId,
      data: "all"
    };
    await getCaptureVitals(variables).then((res) => {
      fetchVitalLabelssuccess(res);
    });
  };
  const SaveVitalsData = async () => {
    disconnect();
    global.twilioconnected
      ? onPressTitle()
      : {
          /*console.log("not in healphacall")*/
        };
    const variables = {
      vitals: vitalsInput,
      comments: nurseNotes,
      enc_id: timeline ? encounter_id : enc_id,
      doc_id: timeline ? doctor_id : doc_id,
      healphaId: timeline ? hlp_id : healphaId,
      template_id: timeline
        ? template_id
        : navigation?.state?.params?.templateId
    };
    await saveVitals(variables)
      .then((res) => {

        if (navigation.state.params.from == "my_records") {
          getVitalLabels();
          // :null
        }

        if (res.status_type == "Success") {
          deviceEmit();
          NativeToast({
            text: "Vitials Saved Successfully",
            type: "success",

            onclose:
              navigation.state.params.from == "my_records"
                ? navigation.navigate("PatientHistory", {
                    enc_id: timeline ? encounter_id : enc_id,
                    doc_id: timeline ? doctor_id : doc_id,
                    healphaId: timeline ? hlp_id : healphaId,
                    Id: navigation.state.params.appointment?.Id,
                    template_id:
                      navigation.state.params.appointment?.templateId,
                    enc_status: "completed"
                  })
                : navigation.goBack()
          });
          setTimeout(() => {
            DeviceEventEmitter.emit(healphaCallEventEmitter.toVitals);
          }, 250);
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const UpdateVitals = async () => {
    disconnect();
    global.twilioconnected
      ? onPressTitle()
      : {
          /*console.log("not in healphacall")*/
        };
    const variables = {
      vitals: vitalsInput,
      comments: nurseNotes,
      enc_id: timeline ? encounter_id : enc_id,
      doc_id: timeline ? doctor_id : doc_id,
      healphaId: timeline ? hlp_id : healphaId,
      vitalsId: vitalsId,
      template_id: navigation.state.params.templateId
    };
    await updateVitals(variables)
      .then((res) => {
        if (res.status_type == "Success") {
          deviceEmit();
          NativeToast({
            text: "Vitails Updated",
            type: "success",
            onclose: navigation.goBack()
          });
          setTimeout(() => {
            DeviceEventEmitter.emit(healphaCallEventEmitter.toVitals);
          }, 250);
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const _onRefresh = () => {
    init();
  };
  useEffect(() => {
    const navFocusListener = navigation.addListener("didBlur", () => {
      disconnect();
    });
    const backAction = () => {
      disconnect();
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    //set up initial information, link, device flag, bp, pulse, temperature
    set_initial_information();
    // method get templates categories and vital values
    init();

    // listeners
    DeviceEventEmitter.addListener(healphaCallEventEmitter.eventVitals, (e) => {
      setvitalsValue(e);
    });
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventpushVitalsfromperson,
      (e) => {
        Alert.alert(
          t("VITALS_INPUT.PERSON_PUSHED"),
          t("VITALS_INPUT.CONTINUE"),
          [
            {
              text: "Yes",
              onPress: () => setvitalsValue(e)
            },
            {
              text: "No",
              onPress: () => {
                /*console.log("not updating")*/
              }
            }
          ],
          { cancelable: false }
        );
      }
    );
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventvitalspushfromdb,
      (e) => {
        setvitalsValue(e);
      }
    );
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventaashavalue,
      (e) => {
        deviceValuefromPerson(e);
      }
    );
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventDevicePulse,
      (e) => {
        // UPDATING OXYGEN SATURATION.......
        console.log("healphaCallEventEmitter.eventDevicePulse",e)
        handleVitalChanges({
          input: e.data,
          key: e.key,
          enc_id: e.enc_id,
          doc_id: e.doc_id,
          healphaId: e.healphaId,
          deviceeventflag: true,
          vitalsInput: e.vitalsInput
        });
        //  UPDATING PULSE RATE
        handleVitalChanges({
          input: e.data1,
          key: e.key1,
          enc_id: e.enc_id,
          doc_id: e.doc_id,
          healphaId: e.healphaId,
          deviceeventflag: true,
          vitalsInput: e.vitalsInput
        });
      }
    );
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventDeviceBP,
      (e) => {
        console.log("healphaCallEventEmitter.eventDeviceBP",e)
        handleVitalChanges({
          input: e.data,
          key: e.key,
          enc_id: e.enc_id,
          doc_id: e.doc_id,
          healphaId: e.healphaId,
          deviceeventflag: true,
          vitalsInput: e.vitalsInput
        });
        handleVitalChanges({
          input: e.data1,
          key: e.key1,
          enc_id: e.enc_id,
          doc_id: e.doc_id,
          healphaId: e.healphaId,
          deviceeventflag: true,
          vitalsInput: e.vitalsInput
        });
      }
    );
    DeviceEventEmitter.addListener(
      healphaCallEventEmitter.eventDeviceTemp,
      (e) => {
        console.log("healphaCallEventEmitter.eventDeviceTemp",e)
        handleVitalChanges({
          input: e.data,
          key: e.key,
          enc_id: e.enc_id,
          doc_id: e.doc_id,
          healphaId: e.healphaId,
          deviceeventflag: true,
          vitalsInput: e.vitalsInput
        });
      }
    );
    return () => {
      navFocusListener.remove();
      backHandler.remove();
    };
  }, []);

  const setvitalsValue = (e) => {
    const data1 = e.data;
    const JSONString = e.data;
    const object = JSON.parse(JSONString);
    const object1 = object.vitalsdata;
    if(object1){
    const array = Object.entries(object1).map(([key, val]) => ({
      [key]: val
    }));}
    setvitalsInput(object1);
    setvitals(object.vitals);
    // array.map((item,index) => {
    //   Object.keys(item)[0].includes('color')?console.log("colorvalue"):handleVitalChanges({
    //     input: Object.keys(item)[0],
    //     key: item[Object.keys(item)[0]],
    //     enc_id: object.enc_id,
    //     doc_id: object.doc_id,
    //     healphaId: object.healphaId
    //   });
    // })
  };
  //set up initial information, link, device flag, bp, pulse, temperature
  const set_initial_information = async () => {
    const devices_flg = await AsyncStorage.getItem("Devices_flg");

    const bp_val = await AsyncStorage.getItem("bp_val");

    const pulse_oxi_meter_val = await AsyncStorage.getItem("PulseOximeter_val");

    const temperature_val = await AsyncStorage.getItem("Temperature_val");
    set_device_connection_object({
      ...device_connection_object,
      device_flag: devices_flg,
      bp_val: bp_val,
      pulse_oxi_meter_val: pulse_oxi_meter_val,
      temperature_val: temperature_val
    });

    if (devices_flg === "yes") {
      if (Platform.OS === "android") {
        const {
          PRIORITIES: { HIGH_ACCURACY },
          addListener,
          checkSettings,
          requestResolutionSettings
        } = LocationEnabler;
        const config = {
          priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
          alwaysShow: true, // default false
          needBle: false // default false
        };
        const check = requestResolutionSettings(config);
        checkInitialBluetoothState();
      }

      if (Platform.OS === "android") {
        bluetoothpair();
      }
    }
  };
  // checking up initial  bluetooth and
  // if bluetooth if offline, showing alert to turn on bluetooth.
  const checkInitialBluetoothState = async () => {
    const isEnabled = await BluetoothStatus.state();
    if (isEnabled == true) {
      Platform.OS === "ios"
        ? set_devices([])
        : set_devices(await BluetoothSerial.list());
    } else {
      Platform.OS === "android" ? requestEnable() : null;
    }
  };
  // method to request enable bluetooth.
  const requestEnable = () => {
    BluetoothSerial.requestEnable()
      .then((res) => set_isEnabled(true))
      .catch((err) => console.log(err.message));
  };
  // connecting aasha devices and physical devices.
  const aashaConnect = async (device) => {
    await BluetoothSerial.connect(device.id)
      .then((res) => {
        set_connected(true);
        NativeToastTop({
          text: "Connected to Aasha device",
          type: "success"
        });
        return;
      })
      .catch((err) => {
        console.log("catch block", err);
        // bluetoothpair();
      });
  };
  // bluetooth pair mehtod,
  // checking list of bluetooth list and paring device based on conditions
  const bluetoothpair = async () => {
    try {
      const bluetooth_serial_lit = await BluetoothSerial.list();

      if (bluetooth_serial_lit?.length > 0) {
        bluetooth_serial_lit.map((data) => {
          if (data.name.includes("SPP")) {
            set_devicecount("1");
            aashaConnect(data);
          }
        });
      }

      if (devicecount != "1") {
        NativeToastTop({
          text: "Please pair with Aasha device",
          type: "warning"
        });
      }
      //  kept the commented code for future reference

      // BluetoothSerial.list().then(
      //   data1 => {
      //     data1
      //       .map(data => {
      //         if (data.name.includes('SPP')) {
      //           console.log('yes');
      //           this.setState({devicecount: '1'});
      //           this.Aashaconnect(data);
      //         }

      //         // Case for remaining bluetooth devices

      //         // else if (data.name.includes('NIBP046')) {
      //         //   console.log('yes');
      //         //   this.setState({devicecount: '1'});
      //         //   this.Bpconnect(data);
      //         // } else if (data.name.includes('PULMO0')) {
      //         //   console.log('yes');
      //         //   this.setState({devicecount: '1'});
      //         //   this.Bpconnect(data);
      //         // } else if (data.name.includes('WT01')) {
      //         //   console.log('yes');
      //         //   this.setState({devicecount: '1'});
      //         //   this.Bpconnect(data);
      //         // } else if (data.name.includes('SpO208')) {
      //         //   console.log('yes');
      //         //   this.setState({devicecount: '1'});
      //         //   this.Bpconnect(data);
      //         // }
      //       })
      //       .catch(err => console.log('1234', err.message));

      //     if (this.state.devicecount != '1') {
      //       alert(i18n.t('TIMELINE.PLS_AASHA'));
      //     }
      //   },
      //   error => {
      //     console.log(i18n.t('TIMELINE.NOT_AASHA') + error);
      //     //   this.showError(error);
      //   },
      // );
    } catch (error) {
      NativeToastTop({
        text: error?.message,
        type: "danger"
      });
    }
  };

  // method get templates categories and vital values
  // setting up vital categories and mapping  latest vitals if already exist.
  const init = async () => {
    try {
      setvitals(vitallabels.categories);
      setenc_id(patientList?.encounter_id);
      setdoc_id(patientList?.appointment?.doc_id);
      sethealphaId(patientList?.appointment?.healpha_id);
      set_temp_id(patientList?.template_id);

      if (navigation.state.params.edit) {
        setedit(navigation.state.params.edit);
        let data = navigation.state.params.data;
        let commentData = navigation.state.params.comment;
        let id = navigation.state.params.id;

        setvitalsInput(JSON.parse(data));
        setNurseNotes(commentData);
        setvitalsId(id);
      }
      setloading(false);
    } catch (error) {
      NativeToastTop({ text: error?.message, type: "danger" });
    } finally {
    }
  };

  // method to get refresh icon and based on device enable and based on type selection device list
  const renderRefreshIconFlag = (key) => {
    if (key === "pulse_rate") {
      if (device_connection_object?.pulse_oxi_meter_val === "Aasha") {
        return true;
      }
    } else if (key === "systolic") {
      if (device_connection_object?.bp_val === "Aasha") {
        return true;
      }
    } else if (key === "temperature") {
      if (device_connection_object?.temperature_val === "Aasha") {
        return true;
      }
    }
    return false;
  };

  // method calling when click on refresh icon.
  // checking device already not connected , calling bluetooth pair.
  // updating vitals data if have getting data from devices.
  const write = async (key) => {
    //  checking device connection condition
    if (global.twilioconnected) {
      datachannel("@aasha@" + key);
    } else {
      if (!connected) {
        await bluetoothpair();
        updateVitalsData(key);
      } else {
        updateVitalsData(key);
      }
    }
  };
  const datachannel = (message) => {
    global.twilioconnected
      ? DeviceEventEmitter.emit(healphaCallEventEmitter.eventKeyAasha, {
          name: message
        })
      : {
          /*console.log("twilio not on")*/
        };
  };

  const deviceValuefromPerson = (e) => {
    const data = e.data["key"][0];
    const key = e.data["key"][1];
    if (data.includes("T_")) {
      let temp = data.split("_");

      NativeToastTop({
        text: "Fetching data...",
        type: "warning"
      });
      //  updating temperature.....
      handleVitalChanges({
        input: temp[2],
        key: key
      });
    } else if (data.includes("B_")) {
      let bp = data.split("_");

      NativeToastTop({
        text: "Fetching data...",
        type: "warning"
      });

      //  UPDATING SYSTOLIC
      handleVitalChanges({
        input: bp[1],
        key: key
      });
      // UPDATING DIASTOLIC.
      handleVitalChanges({
        input: bp[2],
        key: "diastolic"
      });
    } else if (data.includes("O_")) {
      let pulse = data.split("_");

      NativeToastTop({
        text: "Fetching data...",
        type: "warning"
      });

      // UPDATING OXYGEN SATURATION.......
      handleVitalChanges({
        input: pulse[1],
        key: "oxygen_saturation"
      });
      //  UPDATING PULSE RATE
      handleVitalChanges({
        input: pulse[2],
        key: key
      });
    } else if (data != undefined && data.includes("G_")) {
      // this.setState({loading2: false, glucovalue: data});
    }
  };
  // method to update vitals data and populating vitals in input fields.
  const updateVitalsData = async (key) => {
    global.device_key=key
    setrefreshing1(true);
    let message = renderDeviceMessage(key);
    // datachannel('@aasha@' + key == 'systolic' ? 'BP' : key);
    BluetoothSerial.write(message)
      .then((res) => {
        console.log("Successfully wrote to device=" + res);
        intervalId.current = setInterval(() => {
          BluetoothSerial.readFromDevice()
            .then((data) => {
              if (data != "undefined" && data != undefined) {
                if (data.includes("T_")) {
                  let temp = data.split("_");

                  NativeToastTop({
                    text: "Fetching data...",
                    type: "warning"
                  });
                  // //  updating temperature.....
                  // handleVitalChanges({
                  //   input: temp[2],
                  //   key: key
                  // });
                  DeviceEventEmitter.emit("eventDeviceTemp", {
                    data: temp[2],
                    key: key,
                    enc_id: enc_id,
                    doc_id: doc_id,
                    healphaId: healphaId,
                    vitalsInput: vitalsInput
                  });
                  // datachannel("@aashavalue@"+data)
                  setrefreshing1(false);
                  clearInterval(intervalId.current);
                  setrefreshing1(false);
                } else if (data.includes("B_")) {
                  let bp = data.split("_");

                  NativeToastTop({
                    text: "Fetching data...",
                    type: "warning"
                  });

                  // //  UPDATING SYSTOLIC
                  // handleVitalChanges({
                  //   input: bp[1],
                  //   key: key
                  // });
                  // // UPDATING DIASTOLIC.
                  // handleVitalChanges({
                  //   input: bp[2],
                  //   key: "diastolic"
                  // });
                  DeviceEventEmitter.emit("eventDeviceBP", {
                    data: bp[1],
                    key: key,
                    data1: bp[2],
                    key1: "diastolic",
                    enc_id: enc_id,
                    doc_id: doc_id,
                    healphaId: healphaId,
                    vitalsInput: vitalsInput
                  });

                  // datachannel("@aashavalue@"+data)
                  setrefreshing1(false);
                  clearInterval(intervalId.current);
                  setrefreshing1(false);
                } else if (data.includes("O_")) {
                  let pulse = data.split("_");

                  NativeToastTop({
                    text: "Fetching data...",
                    type: "warning"
                  });

                  // // UPDATING OXYGEN SATURATION.......
                  // handleVitalChanges({
                  //   input: pulse[1],
                  //   key: "oxygen_saturation"
                  // });
                  // //  UPDATING PULSE RATE
                  // handleVitalChanges({
                  //   input: pulse[2],
                  //   key: key
                  // });
                  DeviceEventEmitter.emit("eventDevicePulse", {
                    data: pulse[1],
                    key: "oxygen_saturation",
                    data1: pulse[2],
                    key1: key,
                    enc_id: enc_id,
                    doc_id: doc_id,
                    healphaId: healphaId,
                    vitalsInput: vitalsInput
                  });

                  // datachannel("@aashavalue@"+data)
                  setrefreshing1(false);
                  clearInterval(intervalId.current);
                  setrefreshing1(false);
                } else if(data.includes('not found')){
                  setrefreshing1(false);
                  global.aashalisten = false;
                  clearInterval(intervalId.current);
                  NativeToastTop({
                    text: global.device_key.replace(/^./, global.device_key[0].toUpperCase())+' Not able to fetch data.Please retry again',
                    type: 'warning',
                  });
                  setrefreshing1(false);
                }else if (data != undefined && data.includes("G_")) {
                  // this.setState({loading2: false, glucovalue: data});
                  disconnect();
                  clearInterval(intervalId.current);
                }
              }
            })
            .catch((err) => console.log(err.message));
        }, 3000);

        // this.setState({connected: true});
      })
      .catch((err) => console.log(err.message));
  };

  //stop refresh
  const cancelDeviceconnecion = () => {
    setrefreshing1(false);
  };

  const onPressTitle = () => {
    datachannel("@vitalspushdata@" + JSON.stringify(vitalsInput));
  };

  //bluetooth disconnet method.
  const disconnect = async () => {
    BluetoothSerial.disconnect()
      .then(() => {
        set_connected(false);
      })
      .catch((err) => console.log(err.message));
  };
  if (loading || !vitallabels) {
    return <Loader />;
  }
  if (refreshing1) {
    return (
      <View style={styles.refreshDeviceView}>
        <Row style={styles.refreshDeviceRow}>
          <Col size={5}>
            <ActivityIndicator
              size="large"
              color="black"
              style={{ marginLeft: wp(50) }}
            />
          </Col>
          <Col size={5} style={styles.refreshDeviceCol}>
            <Button
              style={styles.refreshDeviceButton}
              onPress={() => cancelDeviceconnecion()}>
              <Text allowFontScaling={false} style={styles.refreshDeviceText}>
                {t("VITALS_INPUT.CLOSE")}
              </Text>
            </Button>
          </Col>
        </Row>
        <Text
          allowFontScaling={false}
          style={styles.refreshDeviceText1}>
          Checking {global.device_key.toLowerCase()=='systolic'?'BP':global.device_key}
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader
      accessibilityLabel="enterVitalsText"
        title={t("OBSERVATION.ENTER_VITALS")}
        navigation={navigation}
        template={template}
      />
      <ScrollView style={{ flex: 1, marginBottom: 80 }}>
        <View style={{ backgroundColor: DEFAULT_WHITE_COLOR ,marginBottom: Platform.OS == "ios" ?150:0}}>
          <ListItem>
            <Left style={[{ flex: 1 }, styles.option]}>
              <Text style={styles.title}
              testID="pleaseEnterTheDetailsText"
              accessibilityLabel="pleaseEnterTheDetailsText">
                {t("OBJECTIVE.PLEASE_ENTER_THE_DETAILS")}
              </Text>
            </Left>
            {/* <Body /> */}
          </ListItem>

          <View>
            <View style={styles.headingbg}>
              <ListItem>
                <Left style={[styles.option, styles.label]}>
                  <Text style={[styles.title, { ...titleFontSize }]}
                  testID="vitalSignsText"
                  accessibilityLabel="vitalSignsText">
                    {t("VITALS_INPUT.VITALS_SIGN")}
                  </Text>
                </Left>
                <Body>
                  <Text
                    style={[
                      styles.title,
                      {
                        ...titleFontSize,
                        textAlign: "center",
                        marginLeft: Platform.OS === "ios" ? 80 : 85
                      }
                    ]}
                    testID="valuesText"
                    accessibilityLabel="valuesText">
                    {t("VITALS_INPUT.VALUES")}
                  </Text>
                </Body>
              </ListItem>
            </View>
          </View>

          {vitals &&
            vitals.map((item, index) => {
              if (item?.data === undefined) {
                let keyss = Object.keys(vitalsInput);
                let filter = keyss.filter((i) => i == item.value);
                return (
                  <ListItem key={index}>
                    <Left style={[styles.option, styles.label]}>
                      <Text
                       testID={item.label+"text"}
                       accessibilityLabel={item.label+"text"}>
                        {item.label} <Text note  testID={item.unit+"text"}
                       accessibilityLabel={item.unit+"text"}>({item.unit})</Text>
                      </Text>
                    </Left>
                    <Body style={[styles.option, styles.value, styles.body]}>
                      {item.value === "bmi" ? (
                        // <Text
                        //   style={{
                        //     textAlign: "center",
                        //     justifyContent: "center",
                        //     // paddingLeft: 100,
                        //     marginRight: Platform.OS === "ios" ? 60 : 30,
                        //     color: getColor(vitalsInput[item.value + "_color"])
                        //   }}>
                        //   {/* {}
                        // </Text>
                        <TextInput
                        testID={item.value+"textInput"}
                        accessibilityLabel={item.value+"textInput"}
                          editable={false}
                          style={{
                            textAlign: "center",
                            justifyContent: "center",
                            // paddingLeft: 100,
                            // color: getColor(vitalsInput[item.value + "_color"]),
                            color: getColor(vitalsInput[item.value + "_color"])
                          }}
                          defaultValue={
                            isNaN(vitalsInput[item.value])
                              ? ""
                              : vitalsInput[item.value]
                          }
                          value={
                            isNaN(vitalsInput[item.value])
                              ? ""
                              : vitalsInput[item.value]
                          }
                        />
                      ) : (
                        <TextInput
                        testID={item.value+"textInput"}
                        accessibilityLabel={item.value+"textInput"}
                          // value={vitalsInput[item.value]}
                          defaultValue={vitalsInput[item.value]}
                          color="black"
                          style={[
                            styles.textInput,
                            {
                              borderColor:
                                filter[0] === item.value
                                  ? getColor(vitalsInput[item.value + "_color"])
                                  : DEFAULT_GREY_COLOR,
                              borderWidth: 1
                            }
                          ]}
                          onChangeText={(val) =>
                            handleVitalChanges({
                              input: val,
                              key: item.value
                            })
                          }
                          keyboardType="numeric"
                        />
                      )}
                      {device_connection_object?.device_flag === "yes" &&
                        (item?.value === "systolic" ||
                          "pulse_rate" ||
                          "temperature") &&
                        renderRefreshIconFlag(item?.value) && (
                          <TouchableOpacity
                            style={styles.refreshTouchable}
                            onPress={() => write(item?.value)}>
                            <RefreshIcon height={wp(24)} width={wp(24)} />
                          </TouchableOpacity>
                        )}
                    </Body>
                  </ListItem>
                );
              } else if (typeof item?.data === "object") {
                return (
                  <View>
                    <View style={styles.headingbg}>
                      <ListItem>
                        <Left style={[styles.option, styles.label]}>
                          <Text style={[styles.title, { ...titleFontSize }]}
                          testID={item.label+"text"}
                          accessibilityLabel={item.label+"text"}>
                            {item.label}
                          </Text>
                        </Left>
                        <Body style={(styles.option, styles.value)}></Body>
                      </ListItem>
                    </View>
                    {item?.data.map((labels, index1) => {
                      let keyss = Object.keys(vitalsInput);
                      let filter = keyss.filter((i) => i == labels.value);
                      return (
                        <ListItem key={index1}>
                          <Left style={[styles.option, styles.label]}>
                            <Text
                            testID={labels.label+"text"}
                            accessibilityLabel={labels.label+"text"}>
                              {labels.label} <Text note
                               testID={labels.unit+"text"}
                               accessibilityLabel={labels.unit+"text"}>({labels.unit})</Text>
                            </Text>
                          </Left>
                          <Body
                            style={[styles.option, styles.value, styles.body]}>
                            <TextInput
                            testID={labels.value+"textInput"}
                            accessibilityLabel={labels.value+"textInput"}
                              defaultValue={vitalsInput[labels.value]}
                              style={[
                                styles.textInput,
                                {
                                  borderColor:
                                    filter[0] === labels.value
                                      ? getColor(vitalsInput[labels.value + "_color"])
                                      : DEFAULT_GREY_COLOR,
                                  borderWidth: 1
                                }
                              ]}
                              onChangeText={(val) =>
                                handleVitalChanges({
                                  input: val,
                                  key: labels.value
                                })
                              }
                              keyboardType="numeric"
                            />
                            {device_connection_object?.device_flag === "yes" &&
                              (labels.value === "systolic" ||
                                "pulse_rate" ||
                                "temperature") &&
                              renderRefreshIconFlag(labels.value) && (
                                <TouchableOpacity
                                  style={styles.refreshTouchable}
                                  onPress={() => write(labels.value)}>
                                  <RefreshIcon height={wp(24)} width={wp(24)} />
                                </TouchableOpacity>
                              )}
                          </Body>
                        </ListItem>
                      );
                    })}
                  </View>
                );
              }
            })}
          <View style={styles.headingbg}>
            <ListItem>
              <Left style={[styles.option, styles.label]}>
                <Text style={[styles.title, { ...titleFontSize }]}
                testID="nursesNotesText"
                accessibilityLabel="nursesNotesText">
                  Nurse's Notes
                </Text>
              </Left>
            </ListItem>
          </View>
          <View
            style={{
              width: "95%",
              padding: 10,
              height: 100,
              margin: 10
            }}>
            <TextInput
              testID="nursesNotesTextInput"
              accessibilityLabel="nursesNotesTextInput"
              style={[styles.textInputNurse]}
              onChangeText={(value) => setNurseNotes(value)}
              value={nurseNotes}
              defaultValue={nurseNotes}
              multiline={true}
              numberOfLines={4}
              scrollEnabled={true}
            />
          </View>
        </View>
      </ScrollView>
      {/* <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <FooterButton
          label={
            edit ? t("OBSERVATION.UPDATE_DATA") : t("OBSERVATION.SAVE_DATA")
          }
          onPress={() => {
            edit ? UpdateVitals() : SaveVitalsData();
          }}
        /> */}
      <View style={styles.addbottom}>
        {global.twilioconnected ? (
          <Col size={5} style={styles.refreshDeviceCol}>
            <Button
              style={styles.generate}
              onPress={() => datachannel("@vitalspulldata@")}
              testID="pullVitalsButton"
              accessibilityLabel="pullVitalsButton">
              <Text style={styles.generatetext}
              testID="pullVitalsText"
              accessibilityLabel="pullVitalsText">
                {t("VITALS_INPUT.PULL_VITALS")}
              </Text>
            </Button>
          </Col>
        ) : null}
        <Col size={5} style={styles.refreshDeviceCol}>
          <Button
            style={global.twilioconnected ? styles.generate : styles.generate1}
            onPress={() => (edit ? UpdateVitals() : SaveVitalsData())}
            testID="updateOrSaveDataButton"
            accessibilityLabel="updateOrSaveDataButton">
            <Text style={styles.generatetext}
            testID="updateOrSaveDataText"
            accessibilityLabel="updateOrSaveDataText">
              {edit ? t("OBSERVATION.UPDATE_DATA") : t("OBSERVATION.SAVE_DATA")}
            </Text>
          </Button>
        </Col>
        {/* <Button style={styles.generate} >
          <Text style={styles.generatetext}>{edit ? t("OBSERVATION.UPDATE_DATA") : t("OBSERVATION.SAVE_DATA")}</Text>
        </Button>
        <Button style={styles.generate}>
          <Text style={styles.generatetext}>{edit ? t("OBSERVATION.UPDATE_DATA") : t("OBSERVATION.SAVE_DATA")}</Text>
        </Button> */}
        {/* </View> */}
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList,
    vitallabels: state.vitalLabels.vitalsLabels,
    templateList: state.templateList.templateList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVitalLabelssuccess: (data) => dispatch(fetchVitalLabelssuccess(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(VitalsInput));

const styles = StyleSheet.create({
  value: {
    flex: 0.3,
    alignSelf: "flex-start"
  },
  title: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    fontSize: 18
  },
  title1: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
  },
  label: {
    flex: 0.7
  },
  textInput: {
    width: wp(60),
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    height: 30,
    marginLeft: Platform.OS === "ios" ? 10 : 20
  },
  card: { height: hp(200), paddingTop: hp(10) },
  notes: {
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: DEFAULT_GREY_COLOR
  },
  option: {
    marginHorizontal: wp(10)
  },
  headingbg: {
    backgroundColor: "#f7f8f8"
  },
  textInputNurse: {
    width: "100%",
    borderRadius: 5,
    height: "100%",
    borderColor: DEFAULT_GREY_COLOR,
    borderWidth: 1,
    padding: 5
  },
  refreshTouchable: {
    backgroundColor: "#EFFBFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(5),
    marginLeft: wp(5),
    paddingLeft: wp(5),
    paddingRight: wp(5)
  },
  body: {
    flexDirection: "row",
    marginRight: wp(60)
  },
  refreshDeviceView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  refreshDeviceRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  refreshDeviceCol: {
    alignItems: "center",
    marginLeft: wp(10)
  },
  refreshDeviceButton: {
    height: 40,
    backgroundColor: APP_PRIMARY_COLOR,
    marginTop: 10
  },
  refreshDeviceText: {
    color: "black",
    fontSize: 15
  },
  pushTitle: {
    fontSize: 15,
    alignSelf: "center",
    justifyContent: "center",
    fontFamily: theme.fontFamily.primarySemiBold,
    fontSize: 18,
    textDecorationLine: "underline"
  },
  addbottom: {
    bottom: Platform.OS === "ios" ? 10 : 0,
    position: "absolute",
    width: "100%",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15,
    flex: 1,
    flexDirection: "row"
  },
  generate: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 12,
    borderRadius: 5
  },
  generate1: {
    backgroundColor: APP_PRIMARY_COLOR,
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center"
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: "NunitoSans-Bold",
    fontSize: 18
  },
  refreshDeviceText1: {
    color: 'black',
    fontSize: 18,
    marginBottom: wp(100),
    fontFamily: theme.fontFamily.primarySemiBold
  }
});

const titleFontSize = {
  fontSize: 18
};
