import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  processColor,
  BackHandler,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from "react-native";
// import MapView from 'react-native-maps';
import {
  DatePicker,
  Header,
  Left,
  Right,
  Container,
  Content,
  Row,
  Col,
  Body,
  Item,
  Label,
  Badge,
  Icon,
  Footer,
  FooterTab,
  Button,
  Title
} from "native-base";
import { LineChart } from "react-native-charts-wrapper";
import { Input, Card, ListItem, Overlay } from "react-native-elements";
import moment from "moment";
import update from "immutability-helper";
import {Picker} from '@react-native-picker/picker';

const { width } = Dimensions.get("window");
const { deviceRowHeight } = "80%";
import { getGchartList } from "../../../redux/actions/gchart_action";
import { connect } from "react-redux";
import { APP_PRIMARY_COLOR } from "../../../themes/variable";
import i18n from "../../../../i18n";
import Loader from "../../app/common/Loader";
import { hp } from "../../../themes/Scale";

class Gchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEncounter: undefined,
      valid1: false,
      valid2: false,
      valid3: false,
      gender: global.gender,
      visible: false,
      growth_graph: true,
      graph: true,
      box1: true,
      box2: false,
      data: {},
      data2: {},
      ht: [],
      wt: [],
      bt: [],
      head1: [],
      ar: {},
      ar1: {},
      isLoading: true,
      chosenDate: new Date(),
      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor("teal"),
        markerColor: processColor("#345D7E"),
        textColor: processColor("white")
      },
      xAxis: {
        position: "BOTTOM"
      },
      yAxis: {
        position: "LEFT"
      },

      girl_Heightr: [
        { x: 0.0, y: 46.1 },
        { x: 2.0, y: 80.4 },
        { x: 4.0, y: 95.6 },
        { x: 6.0, y: 106.703 },
        { x: 8.0, y: 117.02 },
        { x: 10.0, y: 128.115 },
        { x: 12.0, y: 139.981 },
        { x: 14.0, y: 148.369 },
        { x: 16.0, y: 151.353 },
        { x: 18.0, y: 152.189 }
      ],
      girl_Heighta: [
        { x: 0.0, y: 46.8 },
        { x: 2.0, y: 81.6 },
        { x: 4.0, y: 97.2 },
        { x: 6.0, y: 108.563 },
        { x: 8.0, y: 119.126 },
        { x: 10.0, y: 130.439 },
        { x: 12.0, y: 142.467 },
        { x: 14.0, y: 150.891 },
        { x: 16.0, y: 153.818 },
        { x: 18.0, y: 154.59 }
      ],
      girl_Heightg: [
        { x: 0.0, y: 47.9 },
        { x: 2.0, y: 83.5 },
        { x: 4.0, y: 99.8 },
        { x: 6.0, y: 111.671 },
        { x: 8.0, y: 122.645 },
        { x: 10.0, y: 134.322 },
        { x: 12.0, y: 146.619 },
        { x: 14.0, y: 155.106 },
        { x: 16.0, y: 157.938 },
        { x: 18.0, y: 158.602 }
      ],
      boy_Heightr: [
        { x: 0.0, y: 46.8 },
        { x: 2.0, y: 82.1 },
        { x: 4.0, y: 96.4 },
        { x: 6.0, y: 107.8 },
        { x: 8.0, y: 118 },
        { x: 10.0, y: 127.3 },
        { x: 12.0, y: 137.4 },
        { x: 14.0, y: 150.5 },
        { x: 16.0, y: 160.1 },
        { x: 18.0, y: 163.9 }
      ],
      boy_Heighta: [
        { x: 0.0, y: 47.5 },
        { x: 2.0, y: 83.2 },
        { x: 4.0, y: 98 },
        { x: 6.0, y: 109.6 },
        { x: 8.0, y: 120 },
        { x: 10.0, y: 130 },
        { x: 12.0, y: 140 },
        { x: 14.0, y: 153.3 },
        { x: 16.0, y: 162.9 },
        { x: 18.0, y: 166.6 }
      ],
      boy_Heightg: [
        { x: 0.0, y: 48.6 },
        { x: 2.0, y: 85.1 },
        { x: 4.0, y: 100.5 },
        { x: 6.0, y: 112.6 },
        { x: 8.0, y: 123.5 },
        { x: 10.0, y: 133.5 },
        { x: 12.0, y: 144.3 },
        { x: 14.0, y: 158 },
        { x: 16.0, y: 167.7 },
        { x: 18.0, y: 171.1 }
      ],
      girl_weightr: [
        { x: 0.0, y: 2.5 },
        { x: 2.0, y: 9.4 },
        { x: 4.0, y: 12.9 },
        { x: 6.0, y: 16 },
        { x: 8.0, y: 19.53 },
        { x: 10.0, y: 24.51 },
        { x: 12.0, y: 31.15 },
        { x: 14.0, y: 37.91 },
        { x: 16.0, y: 42.96 },
        { x: 18.0, y: 45.36 }
      ],
      girl_weighta: [
        { x: 0.0, y: 2.7 },
        { x: 2.0, y: 9.8 },
        { x: 4.0, y: 13.5 },
        { x: 6.0, y: 16.8 },
        { x: 8.0, y: 20.57 },
        { x: 10.0, y: 24.51 },
        { x: 12.0, y: 25.88 },
        { x: 14.0, y: 39.95 },
        { x: 16.0, y: 44.86 },
        { x: 18.0, y: 47.24 }
      ],
      girl_weightg: [
        { x: 0.0, y: 2.9 },
        { x: 2.0, y: 10.6 },
        { x: 4.0, y: 14.7 },
        { x: 6.0, y: 18.28 },
        { x: 8.0, y: 22.51 },
        { x: 10.0, y: 28.47 },
        { x: 12.0, y: 36.75 },
        { x: 14.0, y: 43.94 },
        { x: 16.0, y: 48.62 },
        { x: 18.0, y: 50.95 }
      ],
      girl_weightr1: [
        { x: 0.0, y: 3.2 },
        { x: 2.0, y: 11.5 },
        { x: 4.0, y: 16.1 },
        { x: 6.0, y: 20.16 },
        { x: 8.0, y: 25.03 },
        { x: 10.0, y: 31.86 },
        { x: 12.0, y: 41.83 },
        { x: 14.0, y: 49.49 },
        { x: 16.0, y: 53.95 },
        { x: 18.0, y: 56.23 }
      ],
      girl_weighta1: [
        { x: 0.0, y: 3.6 },
        { x: 2.0, y: 12.5 },
        { x: 4.0, y: 12.9 },
        { x: 6.0, y: 22.35 },
        { x: 8.0, y: 28.01 },
        { x: 10.0, y: 35.94 },
        { x: 12.0, y: 48.33 },
        { x: 14.0, y: 56.76 },
        { x: 16.0, y: 61.16 },
        { x: 18.0, y: 63.44 }
      ],
      girl_weightg1: [
        { x: 0.0, y: 3.9 },
        { x: 2.0, y: 13.5 },
        { x: 4.0, y: 19.3 },
        { x: 6.0, y: 24.65 },
        { x: 8.0, y: 31.2 },
        { x: 10.0, y: 40.39 },
        { x: 12.0, y: 55.95 },
        { x: 14.0, y: 65.58 },
        { x: 16.0, y: 70.4 },
        { x: 18.0, y: 72.83 }
      ],
      boy_weightr: [
        { x: 0.0, y: 2.6 },
        { x: 2.0, y: 10.1 },
        { x: 4.0, y: 13.3 },
        { x: 6.0, y: 16.59 },
        { x: 8.0, y: 20.36 },
        { x: 10.0, y: 24.35 },
        { x: 12.0, y: 30.55 },
        { x: 14.0, y: 38.48 },
        { x: 16.0, y: 47.32 },
        { x: 18.0, y: 53.23 }
      ],
      boy_weighta: [
        { x: 0.0, y: 2.8 },
        { x: 2.0, y: 10.5 },
        { x: 4.0, y: 13.9 },
        { x: 6.0, y: 17.36 },
        { x: 8.0, y: 21.33 },
        { x: 10.0, y: 25.63 },
        { x: 12.0, y: 32.36 },
        { x: 14.0, y: 40.81 },
        { x: 16.0, y: 49.85 },
        { x: 18.0, y: 55.79 }
      ],
      boy_weightg: [
        { x: 0.0, y: 3 },
        { x: 2.0, y: 11.3 },
        { x: 4.0, y: 15 },
        { x: 6.0, y: 18.77 },
        { x: 8.0, y: 23.13 },
        { x: 10.0, y: 28.02 },
        { x: 12.0, y: 35.87 },
        { x: 14.0, y: 45.27 },
        { x: 16.0, y: 54.67 },
        { x: 18.0, y: 60.69 }
      ],
      boy_weightr1: [
        { x: 0.0, y: 3.3 },
        { x: 2.0, y: 12.2 },
        { x: 4.0, y: 16.3 },
        { x: 6.0, y: 20.51 },
        { x: 8.0, y: 25.42 },
        { x: 10.0, y: 31.16 },
        { x: 12.0, y: 40.67 },
        { x: 14.0, y: 51.23 },
        { x: 16.0, y: 61.1 },
        { x: 18.0, y: 67.29 }
      ],
      boy_weighta1: [
        { x: 0.0, y: 3.7 },
        { x: 2.0, y: 13.1 },
        { x: 4.0, y: 17.8 },
        { x: 6.0, y: 22.48 },
        { x: 8.0, y: 28.07 },
        { x: 10.0, y: 34.93 },
        { x: 12.0, y: 46.81 },
        { x: 14.0, y: 58.59 },
        { x: 16.0, y: 69.03 },
        { x: 18.0, y: 75.58 }
      ],
      boy_weightg1: [
        { x: 0.0, y: 4 },
        { x: 2.0, y: 14.1 },
        { x: 4.0, y: 19.3 },
        { x: 6.0, y: 24.47 },
        { x: 8.0, y: 30.85 },
        { x: 10.0, y: 39.03 },
        { x: 12.0, y: 53.98 },
        { x: 14.0, y: 66.82 },
        { x: 16.0, y: 77.92 },
        { x: 18.0, y: 85.08 }
      ],
      girl_bmir: [
        { x: 0.0, y: 11.5 },
        { x: 2.0, y: 13.7 },
        { x: 4.0, y: 13.2 },
        { x: 6.0, y: 13.089 },
        { x: 8.0, y: 13.293 },
        { x: 10.0, y: 13.919 },
        { x: 12.0, y: 14.902 },
        { x: 14.0, y: 16.035 },
        { x: 16.0, y: 16.845 },
        { x: 18.0, y: 17.149 }
      ],
      girl_bmia: [
        { x: 0.0, y: 11.8 },
        { x: 2.0, y: 14.1 },
        { x: 4.0, y: 13.6 },
        { x: 6.0, y: 13.513 },
        { x: 8.0, y: 13.744 },
        { x: 10.0, y: 14.418 },
        { x: 12.0, y: 15.473 },
        { x: 14.0, y: 16.688 },
        { x: 16.0, y: 17.547 },
        { x: 18.0, y: 17.924 }
      ],
      girl_bmig: [
        { x: 0.0, y: 12.5 },
        { x: 2.0, y: 14.8 },
        { x: 4.0, y: 14.4 },
        { x: 6.0, y: 14.29 },
        { x: 8.0, y: 14.586 },
        { x: 10.0, y: 15.362 },
        { x: 12.0, y: 16.555 },
        { x: 14.0, y: 17.925 },
        { x: 16.0, y: 18.909 },
        { x: 18.0, y: 19.374 }
      ],
      girl_bmir1: [
        { x: 0.0, y: 13.3 },
        { x: 2.0, y: 15.7 },
        { x: 4.0, y: 15.3 },
        { x: 6.0, y: 15.27 },
        { x: 8.0, y: 15.681 },
        { x: 10.0, y: 16.613 },
        { x: 12.0, y: 17.997 },
        { x: 14.0, y: 19.624 },
        { x: 16.0, y: 20.701 },
        { x: 18.0, y: 21.26 }
      ],
      girl_bmia1: [
        { x: 0.0, y: 14.2 },
        { x: 2.0, y: 16.6 },
        { x: 4.0, y: 16.3 },
        { x: 6.0, y: 16.401 },
        { x: 8.0, y: 16.995 },
        { x: 10.0, y: 18.152 },
        { x: 12.0, y: 19.781 },
        { x: 14.0, y: 21.581 },
        { x: 16.0, y: 22.876 },
        { x: 18.0, y: 23.516 }
      ],
      girl_bmig1: [
        { x: 0.0, y: 15 },
        { x: 2.0, y: 17.5 },
        { x: 4.0, y: 17.2 },
        { x: 6.0, y: 17.579 },
        { x: 8.0, y: 18.43 },
        { x: 10.0, y: 19.884 },
        { x: 12.0, y: 21.803 },
        { x: 14.0, y: 23.842 },
        { x: 16.0, y: 25.274 },
        { x: 18.0, y: 27.671 }
      ],
      boy_bmir: [
        { x: 0.0, y: 11.5 },
        { x: 2.0, y: 14.2 },
        { x: 4.0, y: 13.4 },
        { x: 6.0, y: 13.393 },
        { x: 8.0, y: 13.666 },
        { x: 10.0, y: 14.127 },
        { x: 12.0, y: 14.891 },
        { x: 14.0, y: 15.976 },
        { x: 16.0, y: 17.078 },
        { x: 18.0, y: 17.931 }
      ],
      boy_bmia: [
        { x: 0.0, y: 11.9 },
        { x: 2.0, y: 14.5 },
        { x: 4.0, y: 13.8 },
        { x: 6.0, y: 13.773 },
        { x: 8.0, y: 14.065 },
        { x: 10.0, y: 14.561 },
        { x: 12.0, y: 15.378 },
        { x: 14.0, y: 16.534 },
        { x: 16.0, y: 17.714 },
        { x: 18.0, y: 18.647 }
      ],
      boy_bmig: [
        { x: 0.0, y: 12.6 },
        { x: 2.0, y: 15.2 },
        { x: 4.0, y: 14.5 },
        { x: 6.0, y: 14.459 },
        { x: 8.0, y: 14.799 },
        { x: 10.0, y: 15.375 },
        { x: 12.0, y: 16.302 },
        { x: 14.0, y: 17.593 },
        { x: 16.0, y: 18.913 },
        { x: 18.0, y: 19.98 }
      ],
      boy_bmir1: [
        { x: 0.0, y: 13.4 },
        { x: 2.0, y: 16 },
        { x: 4.0, y: 15.3 },
        { x: 6.0, y: 15.306 },
        { x: 8.0, y: 15.737 },
        { x: 10.0, y: 16.443 },
        { x: 12.0, y: 17.533 },
        { x: 14.0, y: 19.005 },
        { x: 16.0, y: 20.495 },
        { x: 18.0, y: 21.708 }
      ],
      boy_bmia1: [
        { x: 0.0, y: 14.3 },
        { x: 2.0, y: 16.9 },
        { x: 4.0, y: 16.2 },
        { x: 6.0, y: 16.258 },
        { x: 8.0, y: 16.835 },
        { x: 10.0, y: 17.743 },
        { x: 12.0, y: 19.063 },
        { x: 14.0, y: 20.758 },
        { x: 16.0, y: 22.428 },
        { x: 18.0, y: 23.768 }
      ],
      boy_bmig1: [
        { x: 0.0, y: 15.2 },
        { x: 2.0, y: 17.8 },
        { x: 4.0, y: 17.1 },
        { x: 6.0, y: 17.221 },
        { x: 8.0, y: 18.002 },
        { x: 10.0, y: 19.189 },
        { x: 12.0, y: 20.808 },
        { x: 14.0, y: 22.757 },
        { x: 16.0, y: 24.582 },
        { x: 18.0, y: 25.993 }
      ],
      hdboyr: [
        { x: 0, y: 32.1 },
        { x: 1, y: 35.1 },
        { x: 2, y: 36.9 },
        { x: 3, y: 38.3 },
        { x: 4, y: 39.4 },
        { x: 5, y: 40.3 },
        { x: 6, y: 41 },
        { x: 7, y: 41.7 },
        { x: 8, y: 42.2 },
        { x: 9, y: 42.6 },
        { x: 10, y: 43 },
        { x: 11, y: 43.4 },
        { x: 12, y: 43.6 },
        { x: 13, y: 43.9 },
        { x: 14, y: 44.1 },
        { x: 15, y: 44.3 },
        { x: 16, y: 44.5 },
        { x: 17, y: 44.7 },
        { x: 18, y: 45 },
        { x: 19, y: 45.2 },
        { x: 20, y: 45.3 },
        { x: 21, y: 45.3 },
        { x: 22, y: 45.4 },
        { x: 23, y: 45.6 },
        { x: 24, y: 45.7 },
        { x: 25, y: 45.8 },
        { x: 26, y: 45.9 },
        { x: 27, y: 46 },
        { x: 28, y: 46.1 },
        { x: 29, y: 46.2 },
        { x: 30, y: 46.3 },
        { x: 31, y: 46.4 },
        { x: 32, y: 46.5 },
        { x: 33, y: 46.6 },
        { x: 34, y: 46.6 },
        { x: 35, y: 46.7 },
        { x: 36, y: 46.8 }
      ],
      hdgirlr: [
        { x: 0, y: 31.7 },
        { x: 1, y: 34.3 },
        { x: 2, y: 36 },
        { x: 3, y: 37.2 },
        { x: 4, y: 38.2 },
        { x: 5, y: 39 },
        { x: 6, y: 39.7 },
        { x: 7, y: 40.4 },
        { x: 8, y: 40.9 },
        { x: 9, y: 41.3 },
        { x: 10, y: 41.7 },
        { x: 11, y: 42 },
        { x: 12, y: 42.3 },
        { x: 13, y: 42.6 },
        { x: 14, y: 42.9 },
        { x: 15, y: 43.1 },
        { x: 16, y: 43.3 },
        { x: 17, y: 43.5 },
        { x: 18, y: 43.5 },
        { x: 19, y: 43.8 },
        { x: 20, y: 44 },
        { x: 21, y: 44.1 },
        { x: 22, y: 44.3 },
        { x: 23, y: 44.4 },
        { x: 24, y: 44.6 },
        { x: 25, y: 44.7 },
        { x: 26, y: 44.8 },
        { x: 27, y: 44.9 },
        { x: 28, y: 45.1 },
        { x: 29, y: 45.2 },
        { x: 30, y: 45.3 },
        { x: 31, y: 45.4 },
        { x: 32, y: 45.5 },
        { x: 33, y: 45.6 },
        { x: 34, y: 45.7 },
        { x: 35, y: 45.8 },
        { x: 36, y: 45.9 }
      ],
      hdboya: [
        { x: 0, y: 33.1 },
        { x: 1, y: 36.1 },
        { x: 2, y: 37.9 },
        { x: 3, y: 39.3 },
        { x: 4, y: 40.4 },
        { x: 5, y: 41.3 },
        { x: 6, y: 42.1 },
        { x: 7, y: 42.7 },
        { x: 8, y: 43.2 },
        { x: 9, y: 43.7 },
        { x: 10, y: 44.2 },
        { x: 11, y: 44.5 },
        { x: 12, y: 44.7 },
        { x: 13, y: 45 },
        { x: 14, y: 45.2 },
        { x: 15, y: 45.5 },
        { x: 16, y: 45.6 },
        { x: 17, y: 45.8 },
        { x: 18, y: 46 },
        { x: 19, y: 46.2 },
        { x: 20, y: 46.3 },
        { x: 21, y: 46.4 },
        { x: 22, y: 46.6 },
        { x: 23, y: 46.7 },
        { x: 24, y: 46.8 },
        { x: 25, y: 47 },
        { x: 26, y: 47.1 },
        { x: 27, y: 47.2 },
        { x: 28, y: 47.3 },
        { x: 29, y: 47.4 },
        { x: 30, y: 47.5 },
        { x: 31, y: 47.6 },
        { x: 32, y: 47.7 },
        { x: 33, y: 47.8 },
        { x: 34, y: 47.8 },
        { x: 35, y: 47.9 },
        { x: 36, y: 48 }
      ],
      hdgirla: [
        { x: 0, y: 32.7 },
        { x: 1, y: 35.3 },
        { x: 2, y: 37 },
        { x: 3, y: 38.2 },
        { x: 4, y: 39.3 },
        { x: 5, y: 40.1 },
        { x: 6, y: 40.8 },
        { x: 7, y: 41.5 },
        { x: 8, y: 42 },
        { x: 9, y: 42.4 },
        { x: 10, y: 42.8 },
        { x: 11, y: 43.2 },
        { x: 12, y: 43.5 },
        { x: 13, y: 43.8 },
        { x: 14, y: 44 },
        { x: 15, y: 44.2 },
        { x: 16, y: 44.4 },
        { x: 17, y: 44.6 },
        { x: 18, y: 44.6 },
        { x: 19, y: 45 },
        { x: 20, y: 45.1 },
        { x: 21, y: 45.3 },
        { x: 22, y: 45.4 },
        { x: 23, y: 45.6 },
        { x: 24, y: 45.7 },
        { x: 25, y: 45.9 },
        { x: 26, y: 46 },
        { x: 27, y: 46.1 },
        { x: 28, y: 46.3 },
        { x: 29, y: 46.4 },
        { x: 30, y: 46.5 },
        { x: 31, y: 46.6 },
        { x: 32, y: 46.7 },
        { x: 33, y: 46.8 },
        { x: 34, y: 46.9 },
        { x: 35, y: 47 },
        { x: 36, y: 47 }
      ],
      hdboyg: [
        { x: 0, y: 34.5 },
        { x: 1, y: 37.3 },
        { x: 2, y: 39.1 },
        { x: 3, y: 40.5 },
        { x: 4, y: 41.6 },
        { x: 5, y: 42.6 },
        { x: 6, y: 43.3 },
        { x: 7, y: 44 },
        { x: 8, y: 44.5 },
        { x: 9, y: 45 },
        { x: 10, y: 45.4 },
        { x: 11, y: 45.8 },
        { x: 12, y: 46.1 },
        { x: 13, y: 46.3 },
        { x: 14, y: 46.6 },
        { x: 15, y: 46.8 },
        { x: 16, y: 47 },
        { x: 17, y: 47.2 },
        { x: 18, y: 47.4 },
        { x: 19, y: 47.5 },
        { x: 20, y: 47.7 },
        { x: 21, y: 47.8 },
        { x: 22, y: 48 },
        { x: 23, y: 48.1 },
        { x: 24, y: 48.3 },
        { x: 25, y: 48.4 },
        { x: 26, y: 48.5 },
        { x: 27, y: 48.6 },
        { x: 28, y: 48.7 },
        { x: 29, y: 48.8 },
        { x: 30, y: 48.9 },
        { x: 31, y: 49 },
        { x: 32, y: 49.1 },
        { x: 33, y: 49.2 },
        { x: 34, y: 49.3 },
        { x: 35, y: 49.4 },
        { x: 36, y: 49.5 }
      ],
      hdgirlg: [
        { x: 0, y: 33.9 },
        { x: 1, y: 36.5 },
        { x: 2, y: 38.3 },
        { x: 3, y: 39.5 },
        { x: 4, y: 40.6 },
        { x: 5, y: 41.5 },
        { x: 6, y: 42.2 },
        { x: 7, y: 42.8 },
        { x: 8, y: 43.4 },
        { x: 9, y: 43.8 },
        { x: 10, y: 44.2 },
        { x: 11, y: 44.6 },
        { x: 12, y: 44.9 },
        { x: 13, y: 45.2 },
        { x: 14, y: 44.4 },
        { x: 15, y: 45.7 },
        { x: 16, y: 45.9 },
        { x: 17, y: 46.1 },
        { x: 18, y: 46.1 },
        { x: 19, y: 46.4 },
        { x: 20, y: 46.6 },
        { x: 21, y: 46.7 },
        { x: 22, y: 46.9 },
        { x: 23, y: 47 },
        { x: 24, y: 47.2 },
        { x: 25, y: 47.3 },
        { x: 26, y: 47.5 },
        { x: 27, y: 47.6 },
        { x: 28, y: 47.7 },
        { x: 29, y: 47.8 },
        { x: 30, y: 47.9 },
        { x: 31, y: 48 },
        { x: 32, y: 48.1 },
        { x: 33, y: 48.2 },
        { x: 34, y: 48.3 },
        { x: 35, y: 48.4 },
        { x: 36, y: 48.5 }
      ],
      hdboya2: [
        { x: 0, y: 35.8 },
        { x: 1, y: 38.5 },
        { x: 2, y: 40.3 },
        { x: 3, y: 41.7 },
        { x: 4, y: 42.9 },
        { x: 5, y: 43.8 },
        { x: 6, y: 44.6 },
        { x: 7, y: 45.3 },
        { x: 8, y: 45.8 },
        { x: 9, y: 46.3 },
        { x: 10, y: 46.7 },
        { x: 11, y: 47.1 },
        { x: 12, y: 47.4 },
        { x: 13, y: 47.7 },
        { x: 14, y: 47.9 },
        { x: 15, y: 48.2 },
        { x: 16, y: 48.4 },
        { x: 17, y: 48.6 },
        { x: 18, y: 48.7 },
        { x: 19, y: 48.9 },
        { x: 20, y: 49.1 },
        { x: 21, y: 49.2 },
        { x: 22, y: 49.4 },
        { x: 23, y: 49.5 },
        { x: 24, y: 49.7 },
        { x: 25, y: 49.8 },
        { x: 26, y: 49.9 },
        { x: 27, y: 50 },
        { x: 28, y: 50.2 },
        { x: 29, y: 50.3 },
        { x: 30, y: 50.4 },
        { x: 31, y: 50.5 },
        { x: 32, y: 50.6 },
        { x: 33, y: 50.7 },
        { x: 34, y: 50.8 },
        { x: 35, y: 50.8 },
        { x: 36, y: 50.9 }
      ],
      hdgirla2: [
        { x: 0, y: 35.1 },
        { x: 1, y: 37.8 },
        { x: 2, y: 39.5 },
        { x: 3, y: 40.8 },
        { x: 4, y: 41.9 },
        { x: 5, y: 42.8 },
        { x: 6, y: 43.5 },
        { x: 7, y: 44.2 },
        { x: 8, y: 44.7 },
        { x: 9, y: 45.2 },
        { x: 10, y: 45.6 },
        { x: 11, y: 46 },
        { x: 12, y: 46.3 },
        { x: 13, y: 46.6 },
        { x: 14, y: 46.8 },
        { x: 15, y: 47.1 },
        { x: 16, y: 47.3 },
        { x: 17, y: 47.5 },
        { x: 18, y: 47.5 },
        { x: 19, y: 47.8 },
        { x: 20, y: 48 },
        { x: 21, y: 48.2 },
        { x: 22, y: 48.3 },
        { x: 23, y: 48.5 },
        { x: 24, y: 48.6 },
        { x: 25, y: 48.8 },
        { x: 26, y: 48.9 },
        { x: 27, y: 49 },
        { x: 28, y: 49.2 },
        { x: 29, y: 49.3 },
        { x: 30, y: 49.4 },
        { x: 31, y: 49.5 },
        { x: 32, y: 49.6 },
        { x: 33, y: 49.7 },
        { x: 34, y: 49.8 },
        { x: 35, y: 49.9 },
        { x: 36, y: 50 }
      ],
      hdboyr2: [
        { x: 0, y: 36.9 },
        { x: 1, y: 39.5 },
        { x: 2, y: 41.3 },
        { x: 3, y: 42.7 },
        { x: 4, y: 43.9 },
        { x: 5, y: 44.8 },
        { x: 6, y: 45.6 },
        { x: 7, y: 46.3 },
        { x: 8, y: 46.9 },
        { x: 9, y: 47.4 },
        { x: 10, y: 47.8 },
        { x: 11, y: 48.2 },
        { x: 12, y: 48.5 },
        { x: 13, y: 48.8 },
        { x: 14, y: 49 },
        { x: 15, y: 49.3 },
        { x: 16, y: 49.5 },
        { x: 17, y: 49.7 },
        { x: 18, y: 49.9 },
        { x: 19, y: 50 },
        { x: 20, y: 50.2 },
        { x: 21, y: 50.4 },
        { x: 22, y: 50.5 },
        { x: 23, y: 50.7 },
        { x: 24, y: 50.8 },
        { x: 25, y: 50.9 },
        { x: 26, y: 51.1 },
        { x: 27, y: 51.2 },
        { x: 28, y: 51.3 },
        { x: 29, y: 51.4 },
        { x: 30, y: 51.6 },
        { x: 31, y: 51.7 },
        { x: 32, y: 51.8 },
        { x: 33, y: 51.9 },
        { x: 34, y: 52 },
        { x: 35, y: 52 },
        { x: 36, y: 52.1 }
      ],
      hdgirlr2: [
        { x: 0, y: 36.1 },
        { x: 1, y: 38.8 },
        { x: 2, y: 40.5 },
        { x: 3, y: 41.9 },
        { x: 4, y: 43 },
        { x: 5, y: 43.9 },
        { x: 6, y: 44.6 },
        { x: 7, y: 45.3 },
        { x: 8, y: 45.9 },
        { x: 9, y: 46.3 },
        { x: 10, y: 46.8 },
        { x: 11, y: 47.1 },
        { x: 12, y: 47.5 },
        { x: 13, y: 47.7 },
        { x: 14, y: 48 },
        { x: 15, y: 48.2 },
        { x: 16, y: 48.5 },
        { x: 17, y: 48.7 },
        { x: 18, y: 48.7 },
        { x: 19, y: 49 },
        { x: 20, y: 49.2 },
        { x: 21, y: 49.4 },
        { x: 22, y: 49.5 },
        { x: 23, y: 49.7 },
        { x: 24, y: 49.8 },
        { x: 25, y: 49.9 },
        { x: 26, y: 50.1 },
        { x: 27, y: 50.2 },
        { x: 28, y: 50.3 },
        { x: 29, y: 50.5 },
        { x: 30, y: 50.6 },
        { x: 31, y: 50.7 },
        { x: 32, y: 50.8 },
        { x: 33, y: 50.9 },
        { x: 34, y: 51 },
        { x: 35, y: 51.1 },
        { x: 36, y: 51.2 }
      ]
      //  chosenDate:""
    };
    this.setDate = this.setDate.bind(this);
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    // this.setState({chosenDate:newDate.format("DD/MM/YYYY") })
  }
  ShowHideComponent = () => {
    // alert("csll")
    this.setState({
      box1: true,
      box2: false
    });
  };
  ShowHideComponent1 = () => {
    this.setState({
      box1: false,
      box2: true
    });
  };
  dateofbirth1 = () => {
    let birth_date = moment(this.props.myprops.dob).format("DD-MM-YYYY");
    let date1 = birth_date.split("-");
    let today = new Date();
    this.setState({
      date2: date1[0],
      month: date1[1] - 1,
      year: date1[2],
      today_Date: today.getDate(),
      today_month: today.getMonth() + 1,
      today_year: today.getFullYear()
    });
  };
  Show = () => {
    if ((global.gender = "male")) {
      return true;
    } else {
      return false;
    }
  };
  closeOverlay = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("MenuItems");
    this.setState({
      growth_graph: false,
      graph: false
    });
  };
  onValuebmi1 = (value) => {
    if (value !== 0) {
      this.setState({ height1: value });
    }

    //   if(this.state.weight1!=""){
    //     let bmi= (Number(this.state.weight1)/Number(value)/Number(value))*10000
    //     let bmi2=Math.round(bmi)
    // this.setState({bmi1:bmi2.toString()})
    // }
    // else if (bmi=NaN)
    // {
    //   this.setState({bmi1:""})
    // }
  };
  onValuebmi2 = (value) => {
    if (value !== 0) {
      this.setState({ weight1: value });
      if (this.state.height1 != "") {
        let bmi =
          (Number(value) /
            Number(this.state.height1) /
            Number(this.state.height1)) *
          10000;
        let bmi2 = Math.round(bmi);
        this.setState({ bmi1: bmi2.toString() });
      }
    }
  };
  componentDidMount = async () => {
    this.GetChartData();
    this.dateofbirth1();
    // await this.props.getGchartList({
    //   "docid":global.doctor_id,
    //   "token":global.token,
    //   "hlp":this.props.myprops.hlpid
    //   })
    // alert(JSON.stringify(this.props.gchartList.message))
  };
  fetchGrowth = async () => {
    await this.props.getGchartList({
      docid: global.doctor_id,
      token: global.token,
      hlp: this.props.myprops.hlpid
    });
    // console.log("hi"+JSON.stringify(responsedata))
    // alert(JSON.stringify(responsedata))
    // let ar = responsedata.message.growthdata.pop()
    // alert(JSON.stringify(ar.date_given))
    // let responsedata;
    // if(responsedata.message.growthdata.length>0||responsedata.message.head_circumferences.length>0){
    //   // responsedata=responsedata
    // }
    //  alert(JSON.stringify(this.state.resdata))

    console.log(this.props.gchartList, "this.props.gchartList");
    this.setState({
      // height:responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
      // responsedata.message.growthdata[0].height!=""?responsedata.message.growthdata[0].height:""
      // :null,
      // weight:responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
      // responsedata.message.growthdata[0].weight!=""?responsedata.message.growthdata[0].weight:"":null,
      // bmi:responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
      // responsedata.message.growthdata[0].bmi!=""?responsedata.message.growthdata[0].bmi:"":null,
      // age:responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
      // responsedata.message.growthdata[0].age!=""?responsedata.message.growthdata[0].age:"":null,
      // head_circumference:responsedata.message.head_circumferences!=""&&responsedata.message.head_circumferences.length>0?responsedata.message.head_circumferences[0].head_circumference:[],
      // head_age:responsedata.message.head_circumferences!=""&&responsedata.message.head_circumferences.length>0?responsedata.message.head_circumferences[0].age:"",
      resdata: this.props.gchartList.message,
      isLoading: false
    });
    //  alert(JSON.stringify(this.state.resdata.growthdata[0]))
    //  alert(this.state.head_circumference)

    //   if(responsedata.message.growthdata!=""){

    // }else{

    // }
    //  this.setState({weight:responsedata.message.growthdata[0].weight});
    //  this.setState({bmi:responsedata.message.growthdata[0].bmi});
    // this.setState({age:responsedata.message.growthdata[0].age});

    //  alert(this.state.bmi)
    // alert("age"+this.state.head_circumference+"gg"+this.state.head_age)
    let ht = [];
    let wt = [];
    let bt = [];

    //  responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
    //   responsedata.message.growthdata[0].height!=""?responsedata.message.growthdata[0].height:"":null&&

    //   responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
    //   responsedata.message.growthdata[0].weight!=""?responsedata.message.growthdata[0].weight:"":null&&

    //   responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0?
    //   responsedata.message.growthdata[0].bmi!=""?responsedata.message.growthdata[0].bmi:"":null&&
    //   responsedata.message.growthdata.sort(function(a, b){
    //           return a.id- b.id;
    //       });
    // let ar = responsedata.message.growthdata.pop()
    // alert(JSON.stringify(ar))
    // alert(JSON.stringify(responsedata.message.growthdata))
    //       responsedata.message.head_circumferences!=""&&responsedata.message.head_circumferences.length>0&& responsedata.message.head_circumferences.sort(function(a, b){
    //    return a.id-b.id;
    //  })
    // alert(JSON.stringify(responsedata.message.growthdata))
    //  alert(JSON.stringify(responsedata.message.head_circumferences))

    // this.setState({head1:head1})4
    // alert(JSON.stringify(this.props.gchartList.message.growthdata))
    if (
      (this.props.gchartList.message.growthdata != "" &&
        this.props.gchartList.message.growthdata.length > 0) ||
      (this.props.gchartList.message.head_circumferences.length > 0 &&
        this.props.gchartList.message.head_circumferences != "")
    ) {
      // if((responsedata.message.growthdata!=""&&responsedata.message.growthdata.length>0)){

      if (
        this.props.gchartList.message.growthdata[0].height != "" &&
        this.props.gchartList.message.growthdata[0].weight != "" &&
        this.props.gchartList.message.growthdata[0].bmi != ""
      ) {
        // alert(ar.date_given)
        this.props.gchartList.message.growthdata.sort(function (a, b) {
          // return a.id- b.id;
          return new Date(b.date_given) - new Date(a.date_given);
        });
        // alert(JSON.stringify(responsedata.message.growthdata))
        this.setState({
          ar: this.props.gchartList.message.growthdata[
            this.props.gchartList.message.growthdata.length - 1
          ]
        });
        // alert(JSON.stringify(this.state.ar))
        // alert(JSON.stringify(this.props.gchartList.message.growthdata))
        this.props.gchartList.message.growthdata.map((item) => {
          if (item.height != 0 && item.weight != 0 && item.bmi !== 0) {
            let mydata = {
              x: Number(item.age),
              y: Number(item.height)
            };
            let mydata1 = {
              x: Number(item.age),
              y: Number(item.weight)
            };
            let mydata2 = {
              x: Number(item.age),
              y: Number(item.bmi)
            };
            ht.push(mydata);
            wt.push(mydata1);
            bt.push(mydata2);
            //  alert(JSON.stringify(ht))
          }
        });

        this.setState({
          ht: ht,
          wt: wt,
          bt: bt,
          growth_graph: true
        });
        // alert(JSON.stringify(this.state.ht))
      }

      // }
      else {
        this.setState({
          growth_graph: false
        });
      }

      if (
        this.props.gchartList.message.head_circumferences.length > 0 &&
        this.props.gchartList.message.head_circumferences != ""
      ) {
        // if(this.state.head1!=0&&this.state.head1!=""){}
        this.props.gchartList.message.head_circumferences.sort(function (a, b) {
          //  return a.id-b.id;
          return new Date(b.date_given) - new Date(a.date_given);
        });
        //  alert(JSON.stringify(responsedata.message.head_circumferences))
        this.setState({
          ar1: this.props.gchartList.message.head_circumferences[
            this.props.gchartList.message.head_circumferences.length - 1
          ]
        });
        // alert(JSON.stringify(this.state.ar1))
        let head1 = [];
        this.props.gchartList.message.head_circumferences.map((item) => {
          if (item.head_circumference != 0) {
            let mydata3 = {
              x: Number(item.age),
              y: Number(item.head_circumference)
            };

            head1.push(mydata3);
          }
        });
        this.setState({
          head1: head1,
          graph: true
        });
        //  alert(JSON.stringify(this.state.head1))
      } else {
        this.setState({
          graph: false
        });
      }
    } else {
      this.setState({ visible: true });
      // alert("hi")
    }
  };
  GetChartData = async () => {
    await this.fetchGrowth();

    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: [
              {
                values: this.Show()
                  ? this.state.boy_Heightr
                  : this.state.girl_Heightr,
                label: "Red",
                // legend:{
                //   enabled:false
                // },
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  // circleColor:[56],
                  // enabled:false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_Heighta
                  : this.state.girl_Heighta,
                label: "Amber",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_Heightg
                  : this.state.girl_Heightg,
                label: "Green",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.state.ht,
                label: "Height",
                config: {
                  lineWidth: 2,
                  drawValues: true,
                  drawCircles: true,
                  highlightColor: processColor("black"),
                  color: processColor("black"),
                  // circleRadius: 8,
                  // circleHoleColor: 600,
                  drawFilled: false,
                  fillColor: processColor("black"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              }
            ]
          }
        },
        data2: {
          $set: {
            dataSets: [
              {
                values: this.Show()
                  ? this.state.boy_weightr
                  : this.state.girl_weightr,
                label: "Red2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_weighta
                  : this.state.girl_weighta,
                label: "Amber2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_weightg
                  : this.state.girl_weightg,
                label: "Green2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_weightr1
                  : this.state.girl_weightr1,
                label: "Red1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_weighta1
                  : this.state.girl_weighta1,
                label: "Amber1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_weightg1
                  : this.state.girl_weightg1,
                label: "Green1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.state.wt,
                label: "Weight",
                config: {
                  lineWidth: 2,
                  drawValues: true,
                  drawCircles: true,
                  highlightColor: processColor("black"),
                  color: processColor("black"),
                  drawFilled: false,
                  fillColor: processColor("black"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              }
            ]
          }
        },
        data3: {
          $set: {
            dataSets: [
              {
                values: this.Show()
                  ? this.state.boy_bmir
                  : this.state.girl_bmir,
                label: "Red2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_bmia
                  : this.state.girl_bmia,
                label: "Amber2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_bmig
                  : this.state.girl_bmig,
                label: "Green2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_bmir1
                  : this.state.girl_bmir1,
                label: "Red1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_bmia1
                  : this.state.girl_bmia1,
                label: "Amber1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show()
                  ? this.state.boy_bmig1
                  : this.state.girl_bmig1,
                label: "Green1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.state.bt,
                label: "BMI",
                config: {
                  lineWidth: 2,
                  drawValues: true,
                  drawCircles: true,
                  highlightColor: processColor("black"),
                  color: processColor("black"),
                  drawFilled: false,
                  fillColor: processColor("black"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              }
            ]
          }
        },
        data4: {
          $set: {
            dataSets: [
              {
                values: this.Show() ? this.state.hdboyr : this.state.hdgirlr,
                label: "Red2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show() ? this.state.hdboya : this.state.hdgirla,
                label: "Amber2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show() ? this.state.hdboyg : this.state.hdgirlg,
                label: "Green2",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("green"),
                  color: processColor("green"),
                  drawFilled: false,
                  fillColor: processColor("green"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                values: this.Show() ? this.state.hdboya2 : this.state.hdgirla2,
                label: "Amber1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("yellow"),
                  color: processColor("yellow"),
                  drawFilled: false,
                  fillColor: processColor("yellow"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                //  values:this.Show()?this.state.boy_bmig1:this.state.girl_bmig1 ,
                values: this.Show() ? this.state.hdboyr2 : this.state.hdgirlr2,
                label: "Green1",
                config: {
                  lineWidth: 2,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor("red"),
                  color: processColor("red"),
                  drawFilled: false,
                  fillColor: processColor("red"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              },
              {
                //  values:this.Show()?this.state.boy_bmig1:this.state.girl_bmig1 ,
                values: this.state.head1,
                label: "Green1",
                config: {
                  lineWidth: 2,
                  drawValues: true,
                  drawCircles: true,
                  highlightColor: processColor("black"),
                  color: processColor("black"),
                  drawFilled: false,
                  fillColor: processColor("black"),
                  fillAlpha: 60,
                  highlightEnabled: true,
                  dashedLine: {
                    lineLength: 20,
                    spaceLength: 20
                  }
                }
              }
            ]
          }
        }
      })
    );
    // alert(JSON.stringify(this.state.data))
  };
  onValueEncounter(value) {
    this.setState({
      selectedEncounter: value
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null });
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
    }

    console.log(event.nativeEvent);
  }
  render() {
    // if(this.state.visible){
    //   return(
    //     <View style={{
    //        justifyContent: 'center',
    //        alignItems: 'center'
    //    }}>
    //     <Overlay isVisible height={240}>
    //         {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
    //         <Text allowFontScaling={false}style={{alignSelf:'center', fontSize:14, fontWeight:'600'}}>No Record found</Text>
    //           {/* <Button
    //             title="Go back"
    //             onPress={() => this.closeOverlay()}
    //             containerStyle={{alignSelf:'center'}}
    //             buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
    //           /> */}
    //           <Button small
    //           onPress={() => this.closeOverlay()}
    //           style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:80}}
    //           ><Text allowFontScaling={false}style={{color:"white",marginLeft:13}}>Go Back</Text></Button>
    //     </Overlay>
    //   </View>
    //   )
    // }
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: hp(100)
          }}>
          <Loader />
        </View>
      );
    }
    return (
      <ScrollView>
        <View style={{ flex: 1, paddingBottom: 110 }}>
          {this.state.box2 ? (
            <View>
              <Col style={{ marginLeft: 15 }}>
                <TouchableOpacity onPress={this.ShowHideComponent}
                 testID="closeTouch"
                 accessibilityLabel="closeTouch">
                  <Icon name="close" 
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"/>
                </TouchableOpacity>
              </Col>
            </View>
          ) : null}
          {this.state.box2 ? (
            <View>
              <Col>
                <Card title="Growth Chart Data">
                  <Row>
                    <Col
                      size={80}
                      style={{
                        borderBottomColor: "#808080",
                        borderBottomWidth: 1,
                        marginLeft: 12
                      }}>
                      <DatePicker
                      testID="datePicker"
                      accessibilityLabel="datePicker"
                        // format='DD/MM/YYYY'
                        defaultDate={new Date()}
                        minimumDate={
                          new Date(
                            this.state.year,
                            this.state.month,
                            this.state.date2
                          )
                        }
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"slide"}
                        androidMode={"spinner"}
                        // placeHolderText={new Date(this.state.today_year,this.state.today_month,this.state.today_Date)}
                        textStyle={{ color: "green" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.setDate}
                        disabled={false}
                      />
                    </Col>
                    <Col size={20} style={{ margintop: 30 }}>
                      <Icon
                      testID="calenderIcon"
                      accessibilityLabel="calenderIcon"
                        name="md-calendar"
                        style={{ color: "#808080", marginLeft: 10 }}></Icon>
                    </Col>
                  </Row>
                  {this.state.valid1 ? (
                    <Text
                      allowFontScaling={false}
                      style={{ fontSize: 10, color: "red", marginLeft: 10 }}
                      testID="pleaseSelectDateText"
                      accessibilityLabel="pleaseSelectDateText">
                      Please Select Date
                    </Text>
                  ) : null}
                  {this.state.growth_graph ? (
                    <Row>
                      <Col size={60}>
                        {this.state.growth_graph ? (
                          <Row>
                            <Col size={90}>
                              <Input
                              testID="heightInput"
                              accessibilityLabel="heightInput"
                                placeholder="Height"
                                keyboardType="numeric"
                                value={this.state.height1}
                                onChangeText={this.onValuebmi1.bind(this)}
                              />
                              {this.state.valid2 ? (
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontSize: 10,
                                    color: "red",
                                    marginLeft: 10
                                  }}
                                  testID="enterHeightText"
                                  accessibilityLabel="enterHeightText">
                                  Please enter Height
                                </Text>
                              ) : null}
                            </Col>
                            <Col size={20}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  marginTop: 30,
                                  color: "#808080",
                                  marginLeft: 10
                                }}
                                testID="cmText"
                                accessibilityLabel="cmText">
                                Cm
                              </Text>
                            </Col>
                          </Row>
                        ) : null}
                        {this.state.growth_graph ? (
                          <Row>
                            <Col size={90}>
                              <Input
                              testID="weighTextInput"
                              accessibilityLabel="weighTextInput"
                                placeholder="Weight"
                                keyboardType="numeric"
                                value={this.state.weight1}
                                onChangeText={this.onValuebmi2.bind(this)}
                              />
                              {this.state.valid3 ? (
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontSize: 10,
                                    color: "red",
                                    marginLeft: 10
                                  }}
                                  testID="enterWeightText"
                                  accessibilityLabel="enterWeightText">
                                  Please enter Weight
                                </Text>
                              ) : null}
                            </Col>
                            <Col size={20}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  marginTop: 30,
                                  color: "#808080",
                                  marginLeft: 10
                                }}
                                testID="kgText"
                                accessibilityLabel="kgText">
                                Kg
                              </Text>
                            </Col>
                          </Row>
                        ) : null}
                      </Col>
                      <Col size={40} style={{ marginTop: 30 }}>
                        <Badge
                        testID="badge"
                        accessibilityLabel="badge"
                          style={{
                            height: 80,
                            width: 80,
                            marginLeft: 30,
                            backgroundColor: "#345D7E"
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 15,
                              marginLeft: 18,
                              marginTop: 5,
                              color: "white"
                            }}
                            testID="bmiText"
                            accessibilityLabel="bmiText">
                            BMI
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              marginHorizontal: 20,
                              marginTop: 5,
                              color: "white",
                              alignItems: "center"
                            }}
                            testID= {this.state.bmi1+"text"}
                            accessibilityLabel={this.state.bmi1+"text"}>
                            {this.state.bmi1}
                          </Text>
                        </Badge>
                      </Col>
                    </Row>
                  ) : null}

                  {/* {this.state.growth_graph?(<Row>
                  <Col size={85}>
         <Input
                      placeholder='BMI'
                      keyboardType='numeric'
                      value={this.state.bmi1}
                      // onChangeText={(text)=>this.setState({bmi1:text})}
                      />
         </Col>
         <Col size={20}><Text allowFontScaling={false}style={{marginTop:30,color:"#808080"}}>kg/m<Text allowFontScaling={false}style={{fontSize: 8,marginTop:-15}}>2</Text></Text></Col>
                     </Row>):null} */}
                  {this.state.graph ? (
                    <Row>
                      <Col size={90}>
                        <Input
                        testID="headCircumferenceText"
                        accessibilityLabel="headCircumferenceText"
                          placeholder="Head Circumference"
                          keyboardType="numeric"
                          value={this.state.head2}
                          onChangeText={(text) =>
                            this.setState({ head2: text })
                          }
                        />
                      </Col>
                      <Col size={20}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 30,
                            color: "#808080",
                            marginLeft: 10
                          }}
                          testID="cmText"
                          accessibilityLabel="cmText">
                          Cm
                        </Text>
                      </Col>
                    </Row>
                  ) : null}

                  <Button
                    block
                    style={{
                      marginTop: 50,
                      backgroundColor: APP_PRIMARY_COLOR
                    }}
                    onPress={() => this.growth()}>
                    <Text allowFontScaling={false} style={{ color: "white" }}
                    testID="saveText"
                    accessibilityLabel="saveText">
                      Save
                    </Text>
                  </Button>
                </Card>
              </Col>
            </View>
          ) : null}
          <View>
            <Col>
              {/* <Label style={{fontSize:10}}>Encouter ID</Label> */}
              {/* <Item picker>
                                  <Picker
                                      mode="dropdown"
                                      selectedValue={this.state.selectedEncounter}
                                      onValueChange={this.onValueEncounter.bind(this)}
                                  >
                                  <Picker.Item label="Select Encounter" value="select" />
                                  {global.enc['encounter'].map((item) =>(
                                      <Picker.Item label={item.PRACTICE_ID+"-"+item.ENCOUNTER_ID} value={item.PRACTICE_ID+"-"+item.ENCOUNTER_ID} />
                                  ))}
                                  </Picker>
                              </Item> */}
              {/* <Text>INDTGAAA000178-18AAA000003</Text> */}
            </Col>
          </View>
          {/* Height */}
          {this.state.growth_graph ? (
            <View>
              <Col>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginLeft: 15,
                    marginTop: 20
                  }}
                  testID="heightText"
                  accessibilityLabel="heightText">
                  {i18n.t("COMMON.HEIGHT")}
                </Text>
              </Col>
            </View>
          ) : null}
          {this.state.growth_graph ? (
            <View style={{ marginTop: 15 }}>
              <Col style={{ flex: 1 }}>
                <LineChart
                testID="heightChart"
                accessibilityLabel="heightChart"
                  style={{ height: 300 }}
                  // style={styles.chart}
                  data={this.state.data}
                  chartDescription={{ text: i18n.t("COMMON.HEIGHT") }}
                  legend={this.state.legend}
                  marker={this.state.marker}
                  xAxis={this.state.xAxis}
                  drawGridBackground={false}
                  borderColor={processColor("teal")}
                  borderWidth={1}
                  drawBorders={true}
                  touchEnabled={true}
                  dragEnabled={true}
                  scaleEnabled={true}
                  scaleXEnabled={true}
                  scaleYEnabled={true}
                  pinchZoom={true}
                  doubleTapToZoomEnabled={true}
                  dragDecelerationEnabled={true}
                  dragDecelerationFrictionCoef={0.99}
                  keepPositionOnRotation={false}
                  onSelect={this.handleSelect.bind(this)}
                  onChange={(event) => console.log(event.nativeEvent)}
                />
                {/* <LineChart style={{height:300}}
             data={this.state.data}
          // data={{dataSets:[
          //   {label: "GEncouter1",
          // config: {
          //     lineWidth: 2,                                                                                                                                                                                       
          //     drawValues: false,
          //     drawCircles: false,
          //     highlightColor: processColor('red'),
          //     color: processColor('red'),
          //     drawFilled: false,
          //     fillColor: processColor('red'),
          //     fillAlpha: 60,
          //     highlightEnabled: true,
          //     dashedLine: {
          //       lineLength: 20,
          //       spaceLength: 20   
          //     }},
          // values:this.Show()?this.state.boy_Heightr:this.state.girl_Heightr },
          // {label: "GEncouter2",
          //    config: {
          //     lineWidth: 2,
          //     drawValues: false,
          //     drawCircles: false,
          //     highlightColor: processColor('orange'),
          //     color: processColor('orange'),
          //     drawFilled: false,
          //     fillColor: processColor('orange'),
          //     fillAlpha: 60,
          //     highlightEnabled: true,
          //     dashedLine: {
          //       lineLength: 20,
          //       spaceLength: 20
              // }},
            //  values:this.Show()?this.state.boy_Heighta:this.state.girl_Heighta },
            //  {label: "GEncouter3",
            //  config: {
            //   lineWidth: 2,
            //   drawValues: false,
            //   drawCircles: false,
            //   highlightColor: processColor('green'),
            //   color: processColor('green'),
            //   drawFilled: false,
            //   fillColor: processColor('green'),
            //   fillAlpha: 60,
            //   highlightEnabled: true,
            //   dashedLine: {
            //     lineLength: 20,
            //     spaceLength: 20
            //   }},
            //  values:this.Show()?this.state.boy_Heightg:this.state.girl_Heightg },
            //  {label: "BEncouter1",
          //   config: {
          //    lineWidth: 2,
          //    drawValues: false,
          //    drawCircles:false,
          //    highlightColor: processColor('red'),
          //    color: processColor('red'),
          //    drawFilled: false,
          //    fillColor: processColor('red'),
          //    fillAlpha: 60,
          //    highlightEnabled: true,
          //    dashedLine: {
          //      lineLength: 20,
          //      spaceLength: 20
          //    }},
          //   values:this.state.boy_Heightr },
          //  {label: "BEncouter2",
          //    config: {
          //     lineWidth: 2,
          //     drawValues: false,
          //     drawCircles:false,
          //     highlightColor: processColor('orange'),
          //     color: processColor('orange'),
          //     drawFilled: false,
          //     fillColor: processColor('orange'),
          //     fillAlpha: 60,
          //     highlightEnabled: true,
          //     dashedLine: {
          //       lineLength: 20,
          //       spaceLength: 20
          //     }},
          //    values:this.state.boy_Heighta },
          //   {label: "BEncouter3",
          //    config: {
          //     lineWidth: 2,
          //     drawValues: false,
          //     drawCircles: false,
          //     highlightColor: processColor('green'),
          //     color: processColor('green'),
          //     drawFilled: false,
          //     fillColor: processColor('green'),
          //     fillAlpha: 60,
          //     highlightEnabled: true,
          //     dashedLine: {
          //       lineLength: 20,
          //       spaceLength: 20
          //     }},
          //    values:this.state.boy_Heightg },
            //  {label: "BEncouter4",
            //  config: {
            //   lineWidth: 2,
            //   drawValues: true,
            //   drawCircles: true,
            //   highlightColor: processColor('black'),
            //   color: processColor('black'),
            //   drawFilled: true,
            //   fillColor: processColor('black'),
            //   fillAlpha: 60,
            //   highlightEnabled: true,
            //   dashedLine: {
            //     lineLength: 20,
            //     spaceLength: 20
            //   }},
            //  values:this.state.ht},
          // ]}}
             marker={this.state.marker}
             xAxis={this.state.xAxis}
             yAxis={this.state.yAxis}
             chartDescription={{text: 'Growth Chart Of Height'}}
             drawGridBackground={false}
             borderColor={processColor('teal')}
             borderWidth={1}
             drawBorders={true}
           
        /> */}
              </Col>
            </View>
          ) : null}
          {/* weight */}
          {this.state.growth_graph ? (
            <View>
              <Col>
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 15, fontWeight: "bold", marginLeft: 15 }}
                  testID="weightText"
                  accessibilityLabel="weightText">
                  {i18n.t("COMMON.WEIGHT")}
                </Text>
              </Col>
            </View>
          ) : null}
          {this.state.growth_graph ? (
            <View style={{ marginTop: 15 }}>
              <Col style={{ flex: 1 }}>
                <LineChart
                testID="weightChart"
                accessibilityLabel="weightChart"
                  style={{ height: 300 }}
                  // style={styles.chart}
                  data={this.state.data2}
                  chartDescription={{ text: i18n.t("COMMON.WEIGHT") }}
                  legend={this.state.legend}
                  marker={this.state.marker}
                  xAxis={this.state.xAxis}
                  drawGridBackground={false}
                  borderColor={processColor("teal")}
                  borderWidth={1}
                  drawBorders={true}
                  touchEnabled={true}
                  dragEnabled={true}
                  scaleEnabled={true}
                  scaleXEnabled={true}
                  scaleYEnabled={true}
                  pinchZoom={true}
                  doubleTapToZoomEnabled={true}
                  dragDecelerationEnabled={true}
                  dragDecelerationFrictionCoef={0.99}
                  keepPositionOnRotation={false}
                  onSelect={this.handleSelect.bind(this)}
                  onChange={(event) => console.log(event.nativeEvent)}
                />
              </Col>
            </View>
          ) : null}
          {/* BMI */}
          {this.state.growth_graph ? (
            <View>
              <Col>
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 15, fontWeight: "bold", marginLeft: 15 }}
                  testID="bmiText"
                  accessibilityLabel="bmiText">
                  {i18n.t("COMMON.BMI")}
                </Text>
              </Col>
            </View>
          ) : null}
          {/* {this.state.growth_graph?():null} */}
          {this.state.growth_graph ? (
            <View style={{ marginTop: 15 }}>
              <Col style={{ flex: 1 }}>
                <LineChart
                testID="bmiChart"
                accessibilityLabel="bmiChart"
                  style={{ height: 300 }}
                  // style={styles.chart}
                  data={this.state.data3}
                  chartDescription={{ text: i18n.t("COMMON.BMI") }}
                  legend={this.state.legend}
                  marker={this.state.marker}
                  xAxis={this.state.xAxis}
                  drawGridBackground={false}
                  borderColor={processColor("teal")}
                  borderWidth={1}
                  drawBorders={true}
                  touchEnabled={true}
                  dragEnabled={true}
                  scaleEnabled={true}
                  scaleXEnabled={true}
                  scaleYEnabled={true}
                  pinchZoom={true}
                  doubleTapToZoomEnabled={true}
                  dragDecelerationEnabled={true}
                  dragDecelerationFrictionCoef={0.99}
                  keepPositionOnRotation={false}
                  onSelect={this.handleSelect.bind(this)}
                  onChange={(event) => console.log(event.nativeEvent)}
                />
              </Col>
            </View>
          ) : null}
          {/* transform:([{rotate: '-90deg'}]) */}
          {/* Growth Chart Of Head Circumference */}
          {this.state.graph ? (
            <View>
              <Col>
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 15, fontWeight: "bold", marginLeft: 15 }}
                  testID="growthChartOfHeadCircumferenceText"
                  accessibilityLabel="growthChartOfHeadCircumferenceText">
                  Growth Chart Of Head Circumference
                </Text>
              </Col>
            </View>
          ) : null}
          {this.state.graph ? (
            <View>
              <Col>
                <LineChart
                  style={{ height: 300 }}
                  // style={styles.chart}
                  data={this.state.data4}
                  chartDescription={{
                    text: "Growth Chart Of Head Circumference"
                  }}
                  legend={this.state.legend}
                  marker={this.state.marker}
                  xAxis={this.state.xAxis}
                  drawGridBackground={false}
                  borderColor={processColor("teal")}
                  borderWidth={1}
                  drawBorders={true}
                  touchEnabled={true}
                  dragEnabled={true}
                  scaleEnabled={true}
                  scaleXEnabled={true}
                  scaleYEnabled={true}
                  pinchZoom={true}
                  doubleTapToZoomEnabled={true}
                  dragDecelerationEnabled={true}
                  dragDecelerationFrictionCoef={0.99}
                  keepPositionOnRotation={false}
                  onSelect={this.handleSelect.bind(this)}
                  onChange={(event) => console.log(event.nativeEvent)}
                />
              </Col>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  isFetching29: state.gchartList.isFetching29,
  gchartList: state.gchartList.gchartList
});

// const ActionCreators = Object.assign(
//   {},
//   pageActions,
// );
// const mapDispatchToProps = dispatch => ({
//   // actions: bindActionCreators(ActionCreators, dispatch),
// });
const styles = StyleSheet.create({});
export default connect(mapStateToProps, { getGchartList })(Gchart);
