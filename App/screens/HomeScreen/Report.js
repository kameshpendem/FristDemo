import React, { Component } from 'react';
import { 
 AppRegistry,
 StyleSheet,
 Text,
 View,
 FlatList,
 processColor,ScrollView,TouchableOpacity,StatusBar,TextInput,ActivityIndicator,RefreshControl} from 'react-native';
import{Row,Col,Thumbnail,DatePicker,Footer, FooterTab,Button, Item,Label,Picker,Icon,Header,Container, Content} from  'native-base'
import { connect } from 'react-redux';
import moment from 'moment';
import {getReportList} from '../../redux/actions/report_action';
import { APP_PRIMARY_COLOR } from '../../themes/variable';
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docid:this.props.navigation.state.params.docid,
      branch_id:this.props.navigation.state.params.branch_id,
      query:'',
      hlpid:"select",
      encid:"select",
      encounter:"Select",
      type:"select", 
      start_date:"", 
      chosenDate:new Date(),
      chosenDate1:new Date(),
      end_date:"",
      loading:true, 
      encounterslist:[],
      serviceslist:[],
     reports: [],
     reports1: [],
     query: '',
     refreshing:false,
    };
    this.arrayholder = []; 
    this.arrayholder1 = [];
    this.arrayholder2 = [];
    this.arrayholder3 = []; 
  }

  onValueChangeenc=async(value)=> {
   let mydata=await this.searchFilterFunction2(value);
  //alert(JSON.stringify(mydata)) 
  //  let obj= mydata.filter((arr, index, self) =>
  //  index === self.findIndex((t) => (t.service_type === arr.service_type)))
   this.setState({
     encounter: value,
    //  reports:this.findReport(value),
    // serviceslist:obj
 });
//

}
  componentDidMount=async()=>{
    
          //
        this.getData();
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then((item) => {
      // console.log("res="+JSON.stringify(item))
      this.setState({refreshing: false});   
    });
    
  }
  getData=async()=>{
    await this.props.getReportList({ 
      "docid":this.state.docid, 
      "token":global.token, 
      "hlpid":this.state.hlpid, 
      "encid":this.state.encid, 
      "branch":this.state.branch_id, 
      "practice":this.state.branch_id.split("-")[0], 
      "type":this.state.type, 
      "start_date":this.state.start_date, 
      "end_date":this.state.end_date 
      })  
      // console.log("my="+Object.keys(this.props.reportList.message).length )
      let myreports=[];
      console.log(JSON.stringify(this.props.reportList.message))
      Object.keys(this.props.reportList.message).map((item)=>{
        this.props.reportList.message[item].map(item2=>{
        let myobject=myreports.filter((myitem)=>myitem.encounter==item2.encounterCode)
          if(myobject.length==0){
          if(item2.service_type!="supplements"){
          let obj={
            "encounter":item2.encounterCode,
            "first_name":item2.first_name,
           "middle_name": item2.middle_name,
           "last_name":item2.last_name,
           "hlpid":item2.hlpid,
            "service_type":item2.service_type,
            "service_name":[item2.lab?item2.lab:item2.image_type?item2.image_type:item2.nurse_service],
            "test_date":item2.test_date,
            "path":item2.lab_pdf_path!=null&&item2.lab_pdf_path!=""?item2.lab_pdf_path:
                   item2.img_pdf_path!=null&&item2.img_pdf_path!=""?item2.img_pdf_path:
                   item2.ns_pdf_path!=null&&item2.ns_pdf_path!=""&&item2.ns_pdf_path
        
          }
          myreports.push(obj)
      
    }
  }else{
    myreports[0].service_name.push(item2.lab?item2.lab:item2.image_type?item2.image_type:item2.nurse_service)
  }
        })
      })
// let obj= this.props.reportList.message.filter((arr, index, self) =>
// index === self.findIndex((t) => (t.encounterCode === arr.encounterCode)))
      this.setState({
          reports:myreports,
          // encounterslist:obj,
          loading:false
        })
        this.arrayholder=myreports;
  }
  setDate=(newDate)=> {
    this.setState({ chosenDate: newDate });
  }
  setDate1=(newDate1)=> {
    this.setState({ chosenDate1: newDate1 });
//
//
this.arrayholder3.map((item)=>{
   console.log(item.test_date)
})
  }
  onValueChangeservice=async(value)=> {
    let mydata=await this.searchFilterFunction3(value);
//     let obj= this.props.reportList.message.filter((arr, index, self) =>
// index === self.findIndex((t) => (t.lab?t.lab:t.image_type?t.image_type:t.nurse_service === arr.lab?arr.lab:arr.image_type?arr.image_type:arr.nurse_service)))
    
if(value=="Select"){
  this.setState({
    service: value,
    reports:this.arrayholder
});
}
else{
    this.setState({
      service: value,
      reports:mydata
  });
}
}

renderHeader = () => {
  return (
  <View>
    <Row style={{marginHorizontal:10}}>
      <Col>
    <TextInput allowFontScaling={false}
    
    placeholder="Search Patient"
    autoFocus='true'
    placeholderTextColor={"#2D323C"}
    returnKeyType="done"
    autoCapitalize="none"
    value={this.state.query}
    //autoCorrect={false}
    style={styles.input}
     onChangeText={(text)=>this.searchFilterFunction(text)}
    />
    </Col>
    </Row>  
{/* <Row style={{marginHorizontal:10}}>
  <Col>
  <Item picker>
                               <Picker
                                   // mode="dropdown"
                                   style={{height:30,marginTop:10}}
                                   selectedValue={this.state.encounter}
                                   onValueChange={this.onValueChangeenc.bind(this)}
                               >
                                   <Picker.Item label="Select Encounter" value="Select"/>
                                
                                   { this.state.query.length>0&&  this.state.encounterslist.map((item) =>(
                                       <Picker.Item label={item.encounterCode} value={item.encounterCode} />
                                   ))}
                                   
                               </Picker>
                           </Item>
  </Col>
                                   </Row>*/}
<Row style={{marginHorizontal:10}}>
  <Col>
  <Item picker>
                               <Picker
                                   // mode="dropdown"
                                   style={{height:30,marginTop:10}}
                                   selectedValue={this.state.service}
                                   onValueChange={this.onValueChangeservice.bind(this)}
                                   
                                   // onValueChange={(value) => {this.setState({hospital_branch: value})}
                               >
                                   <Picker.Item label="Select Service" value="Select"/> 
                                   
                                   {this.state.serviceslist.map((item) =>(
                                       <Picker.Item label={item.service_type} value={item.service_type} />
                                   ))} 
                               </Picker>
                           </Item>
  </Col>
</Row>
{/* <Row style={{marginHorizontal:10}}>
    <Col size={50}>
    <Text allowFontScaling={false}style={{fontSize:10,marginTop:10,}}>
    Start Date
        </Text>
    <DatePicker
            defaultDate={new Date(this.state.chosenDate)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"spinner"}
            placeHolderText="DD/MM/YYYY"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={true}
            />
    </Col>
    <Col size={50}>
    <Text allowFontScaling={false}style={{fontSize:10,marginTop:10,}}>
    End Date
        </Text>
    <DatePicker
            defaultDate={new Date(this.state.chosenDate1)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"spinner"}
            placeHolderText="DD/MM/YYYY"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate1}
            disabled={false}
            />
            
    </Col>
</Row>  */}
</View>
  );
};

searchFilterFunction = text => {
  this.setState({
    query: text,
  });
  if(text!=""){
  const newData = this.arrayholder.filter(item => {
    const textData = text.toUpperCase();
    let p=moment(item.test_date).format('YYYY-MMM-DD').split("-");
    return item.middle_name?
    item.first_name.toUpperCase().indexOf(textData)>-1  
  ||item.middle_name.toUpperCase().indexOf(textData)>-1 
  || item.last_name.toUpperCase().indexOf(textData)>-1
  ||item.hlpid.toUpperCase().indexOf(textData)>-1
  || item.encounter.toUpperCase().indexOf(textData)>-1
  || item.service_type.toUpperCase().indexOf(textData)>-1
  || item.service_name.indexOf(textData)>-1||
  p[0].toUpperCase().indexOf(textData)>-1||
      p[1].toUpperCase().indexOf(textData)>-1||
      p[2].toUpperCase().indexOf(textData)>-1
  
  : 
   ( item.first_name.toUpperCase().indexOf(textData)>-1
   ||item.last_name.toUpperCase().indexOf(textData)>-1
   ||item.encounter.toUpperCase().indexOf(textData)>-1
   ||item.hlpid.toUpperCase().indexOf(textData)>-1
   ||item.service_type.toUpperCase().indexOf(textData)>-1||
   p[0].toUpperCase().indexOf(textData)>-1||
       p[1].toUpperCase().indexOf(textData)>-1||
       p[2].toUpperCase().indexOf(textData)>-1)
   
  });
  let obj= newData.filter((arr, index, self) =>
index === self.findIndex((t) => (t.service_type === arr.service_type)))
  this.setState({
    reports: newData,
    serviceslist:obj
  });
  this.arrayholder1=newData
}
else{
  let obj= this.arrayholder.filter((arr, index, self) =>
index === self.findIndex((t) => (t.service_type === arr.service_type)))
  this.setState({
    reports: this.arrayholder,
    serviceslist:obj
  });
  this.arrayholder1=this.arrayholder
}
};
searchFilterFunction2 = text => {
  if(text!=""){
    console.log(text)
     
  const newData = this.arrayholder1.filter(item => {
    const textData = text.toUpperCase();
    console.log(textData +" "+item.encounterCode)
    console.log(item.encounterCode.indexOf(textData)>-1)
    return item.encounterCode.indexOf(textData)>-1
  });
  console.log("value="+JSON.stringify(newData))
  let obj= newData.filter((arr, index, self) =>
index === self.findIndex((t) => (t.service_type === arr.service_type)))
  this.setState({
    reports: newData,
    serviceslist:obj
  });
  this.arrayholder2=newData
  return newData;
}
else{
  let obj= this.arrayholder1.filter((arr, index, self) =>
index === self.findIndex((t) => (t.service_type === arr.service_type)))
  this.setState({
    reports: this.arrayholder1,
    serviceslist:obj
  });
  this.arrayholder2=this.arrayholder1
  return this.arrayholder1;
  
}
};
searchFilterFunction3 = text => {
  if(text!=""){
    console.log(text)
  const newData = this.arrayholder1.filter(item => {
    const textData = text.toUpperCase();
    return item.service_type.toUpperCase().indexOf(textData)>-1
  });
  console.log("value="+JSON.stringify(newData))
  this.setState({
    reports: newData,
  });
  this.arrayholder3=newData;
  return newData;
}
else{
  this.setState({
    reports: this.arrayholder1,
  });
  this.arrayholder3=this.arrayholder1;
  return this.arrayholder1;
  
}
};
    render() {
    if(this.state.loading){
        return(
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
        <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
        )
    }
   const { reportList,isFetching16} = this.props;
 
    return (
      // <ScrollView refreshControl={
      //   <RefreshControl
      //     refreshing={this.state.refreshing}
      //     onRefresh={this._onRefresh}
      //   />}>
<Container>
 <Content>

<Row>

 <Col>
         <FlatList

style={styles.contentList}

columnWrapperStyle={styles.listContainer}


data={this.state.reports}

keyExtractor= {(item) => { return item.id; }}


    renderItem={({item}) => {
    
      let p=moment(item.test_date).format('YYYY-MMM-DD').split("-") 
      console.log(item.test_date)
return (

<View style={styles.eventBox}>
<View style={styles.eventDate}>

   <Text allowFontScaling={false}style={styles.eventDay}>{p[2]}</Text>
   <Text allowFontScaling={false}style={styles.eventMonth}>{p[1]}</Text>
   <Text allowFontScaling={false}style={styles.eventYear}>{p[0]}</Text>
 </View>
 <View>
 <TouchableOpacity>
   <View>
   <View  style={styles.eventContent}>
   <Text allowFontScaling={false}style={styles.doctorName}>

 {item.middle_name!=null&&item.middle_name!=""?item.first_name+" "+item.middle_name+" "+item.last_name:item.first_name+" "+item.last_name}


</Text>
   <Text allowFontScaling={false}style={styles.encID}><Text allowFontScaling={false}style={{fontWeight:'500'}}>ID: </Text>{item.encounter}</Text>
   <Text allowFontScaling={false}style={styles.encID}><Text allowFontScaling={false}style={{fontWeight:'500'}}>Service type: </Text>{item.service_type}</Text>
   <Text allowFontScaling={false}style={{fontWeight:'500'}}>serviceslist: </Text>
   {item.service_name.map((myitem)=>
   <Text allowFontScaling={false}style={styles.encID}>{myitem}</Text>
    )}
   
   </View> 
</View>
 </TouchableOpacity>

 </View>  
 <View>

   
   {item.path!=null&&item.path!=""?<TouchableOpacity onPress={()=>this.props.navigation.navigate('ViewPdf',{link:item.path})}  style={{marginTop:10}}>
 <Icon type="FontAwesome" name="file-pdf-o" style={{fontSize:30,marginTop:30,marginLeft:14}} />
    </TouchableOpacity>:null}
   
</View>    
</View>

)

}}
ListHeaderComponent={this.renderHeader}
/>

         </Col>
       
       </Row>
      
 </Content>
</Container>
// </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
    reportList: state.reportList.reportList,
    isFetching16:state.postList.isFetching16,
    // encList:state.encList.encList,
    // isFetching16:state.postList.isFetching16,
   });
const styles = StyleSheet.create({
 container: {
   // backgroundColor: '#F5FCFF',
   flex: 1,
   padding: 16,
   marginTop: 10,
 },
 autocompleteContainer: {
   backgroundColor: '#ffffff',
   borderWidth: 0,
 },
 descriptionContainer: {
   flex: 1,
   justifyContent: 'center',
 },
 itemText: {
   fontSize: 15,
   paddingTop: 5,
   paddingBottom: 5,
   margin: 2,
 },
 infoText: {
   textAlign: 'center',
   fontSize: 16,
 },
 card: {

   shadowColor: '#00000021',
   
   shadowOffset: {
   
   width: 0,
   
   height: 6
   
   },
   
   marginHorizontal: 10,
   
   marginVertical: 5,
   
   shadowOpacity: 0.37,
   
   shadowRadius: 7.49,
   
   elevation: 5,
   
   backgroundColor: "white",
   
   padding: 10,
   
   flexDirection: 'row',
   
   borderRadius: 8
   
   },
   input:{
    marginTop:15,
    borderColor:'#345D7E', borderRadius:8, borderWidth: 1,
    height: 40,
    backgroundColor:'white',
    marginBottom: 10,
    color:'#4F575C',
    paddingHorizontal: 15
    },
    eventBox: {
      padding: 10,
      flex:1,
      // marginTop: 5,
      // marginBottom: 5,
      flexDirection: 'row'
  },
  eventDate: {
      flexDirection: 'column'
  },
  eventDay: {
      fontSize: 26,
      color: APP_PRIMARY_COLOR,
      fontWeight: "600"
  },
  eventMonth: {
      fontSize: 22,
      color: "#345D7E",
      fontWeight: "600"
  },
  eventYear: {
      fontSize: 18,
      color: "#4F575C",
      fontWeight: "600"
  },
  eventContent: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: 10,
      backgroundColor: '#FFFFFF',
      padding: 10,
      borderRadius: 10
  },
  encID: {
    fontSize: 14,
    color: "#2D323C"
  },
  doctorName: {
    fontSize: 18,
    color: "#345D7E",
    fontWeight: "500"
  },
});
export default connect(mapStateToProps,{getReportList})(Report)