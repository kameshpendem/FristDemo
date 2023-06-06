import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  View,
  TextInput,
  Touchable,
  Alert,
  StyleSheet
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import { Divider, Text } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/FontAwesome";
import { DEFAULT_WHITE_COLOR } from "../../../../../themes/variable";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
export default class Tables extends Component {
  constructor(props) {
    super(props);
    // this.state = { item: [], notes: "", showNotes: false, keyname: "" };
    this.state = {
      // tableHead: ["Head", "Head2", "Head3", "Head4"],
      // tableData: [
      //   ["", "Right", "Left"],
      //   ["Eye sight.", "", ""]
      // ]
      //tableData: [this.props.item.table_data]
      tableData: []
    };
  }
  componentDidMount = () => {
    //console.log(this.props, "props hello");
    const data = this.props?.item?.table_data;
    // console.log(data, "data");
    // const parsingdata = JSON.parse(data);
    // const dataTable = parsingdata?.map((row, rowIndex) => {
    //   return row?.map((col, colIndex) => {
    //     if (!col) {
    //       return (
    //         <View>
    //           <TextInput
    //             onChangeText={(value) => {
    //               const dataTable = [...parsingdata];
    //               const rowData = [...row];
    //               rowData[colIndex] = value;
    //               dataTable[rowIndex] = rowData;
    //               // const vals = JSON.stringify(dataTable);
    //               this.setState({ tableData: dataTable });
    //             }}
    //           />
    //         </View>
    //       );
    //     }
    //     return col;
    //   });
    // });

    //console.log(dataTable, "datataable");
    let table = JSON.parse(data);

    // console.log(table, "datadhjahjs");
    this.setState({
      item: this.props.item,
      selectedOption: "",
      keyname: this.props.keyname,
      tableData: data ? table : []
    });
    Icon.loadFont();
    if (this.props?.answer?.answer)
      this.setState({ tableData: this.props?.answer?.answer });
  };

  onAnswer = () => {
    //this.setState({ tableData: [] });
    let x = this.state.item;
    if (this.props?.answer) {
      x.upid = this.props?.answer?.id;
    }
    // console.log("Answer-----" + this.state.tableData);
    x.answer = this.state.tableData;
    let a = x.label;
    let b = x.answer;
    let simpleAnswer = a + " : " + b;
    x.simpleAnswer = simpleAnswer;
    x.keyname = this.state.keyname;
    this.props.onAnswer(this.state.item);
  };

  render() {
    // console.log(this.state.tableData);
    const data = this.props?.item?.table_data;
    //console.log(data, "tables response");
    let table = JSON.parse(data);
    const parsingdata = this.state.tableData;
    const element = (row, colIndex, rowIndex, cellData) => {
      return (
        <TextInput
          value={cellData}
          onChangeText={(value) => {
            const dataTable = [...parsingdata];
            const rowData = [...row];
            rowData[colIndex] = value;
            dataTable[rowIndex] = rowData;
            //const vals = JSON.stringify(dataTable);
            this.setState({ tableData: dataTable }, () => {
              this.onAnswer();
            });
          }}
        />
      );
    };
    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={this.state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {/* <Rows data={this.state.tableData} textStyle={styles.text} /> */}
          {parsingdata?.map((row, index) => (
            <TableWrapper key={index} style={styles.row}>
              {row?.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    !table[index][cellIndex]
                      ? element(row, cellIndex, index, cellData)
                      : cellData
                  }
                  //textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  text: { margin: 6 }
});
