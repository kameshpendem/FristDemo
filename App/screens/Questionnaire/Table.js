import React, {Component} from 'react';
import {Text, TextInput} from 'react-native';
import {View, Col} from 'native-base';
import {Table, Row, Rows} from 'react-native-table-component';

export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [
        [
          <TextInput
            allowFontScaling={false}
            multiline={true}
            style={{
              backgroundColor: '#FEFBFB',
              height: 200,
              textAlignVertical: 'top',
              height: Math.max(35, 0),
              borderColor: '#345D7E',
              borderWidth: 1,
              borderWidth: 1,
              marginHorizontal: 10,
            }}
            placeholder="Enter Your Response Here"
            placeholderTextColor={'#2D323C'}
          />,
        ],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456'],
        ['a', 'b', 'c', 'd'],
      ],
      tableColumns: [],
      tableRows: [],
      item: {
        id: 0,
        name: ['wheat', 'Rice', 'Sugar'],
        Quality: ['Good', 'good', 'good'],
        Quantity: ['200', '200', '200'],
      },
    };
  }

  componentDidMount = async () => {
    await this.setTable();
  };

  setTable = async () => {
    let rowData = this.props.rows;
    let columnheader = this.props.header.split(',');
    let columnsData=this.props.cols;
    var columns = [];

    for (let i = 0; i < rowData; i++) {
      this.state.tableRows[i] = [];
      for (let j = 0; j < columnsData; j++) {
        this.state.tableRows[i].push(
          <TextInput
            allowFontScaling={false}
            multiline={true}
            style={{
              backgroundColor: '#FEFBFB',
              height: 200,
              textAlignVertical: 'top',
              height: Math.max(35, 0),
              borderColor: '#345D7E',

              borderWidth: 1,
              marginHorizontal: 10,
            }}
            placeholder="Response"
            placeholderTextColor={'#2D323C'}
            onChangeText={(text) => this.handleText(text, i,j)}
          />,
          
        );
      }
    }

    for (let i = 0; i < columnheader.length; i++) {
      columns.push(
        <View key={i}>
          <View>
            <Text>{columnheader[i]}</Text>
          </View>
        </View>,
      );
    }
    this.setState({tableColumns: columns});
    console.log(this.state.tableRows);
  };

  handleText = async (text, index1,index2) => {
    console.log(text);
    console.log(index1);
    console.log(index2);
    this.props.onTableTextChange(this.props,text,index1,index2)

  };
  render() {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={{textAlign: 'center'}}>{this.props.label}</Text>

        <Table>
          <Row
            data={this.state.tableColumns}
            style={styles.head}
            textStyle={styles.text}
          />
          
          <Rows data={this.state.tableRows} textStyle={styles.text} />
        </Table>
      </View>

     
    );
  }
}

const styles = {
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
};
