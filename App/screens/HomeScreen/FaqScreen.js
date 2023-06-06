import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Content,
  Text,
  View,
  Icon,
} from 'native-base';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { APP_PRIMARY_COLOR } from '../../themes/variable';
import getBaseUrl, { base_document_url, getApiUrl } from '../../config/Config';

const BASE_DOC_URL = getApiUrl();


// const QUESTIONS_INFO_ARR = [
//   {
//     id: '1',
//     serialNo: '1)',
//     text: 'HELP.QUES_REG_DOC',
//     urlPdfFile: 'Doc-Registration.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/EesEAdJ77IFNqtZ5RMlHEq8BLuW8lS2-AvCd8WOpkxdaqg?e=RowQrr'
//   },
//   {
//     id: '2',
//     serialNo: '2)',
//     text: 'HELP.QUES_EDIT_PROF',
//     urlPdfFile: 'Doc-EditProfile.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/ETqGxXA9XaJAv7_S5GeVqH8BdgizEBeTjTQMnuQTezh_Pw?e=iEcyNg'
//   },
//   {
//     id: '3',
//     serialNo: '3)',
//     text: 'HELP.QUES_REMOTE_CONS',
//     urlPdfFile: 'Doc-Consult-CovidIA.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/EXw6alZa3kNIv1GTdRN0-bYBHjFOOGCEf4lAL5YfGmshxA?e=wv6SkC'
//   },
//   {
//     id: '4',
//     serialNo: '4)',
//     text: 'HELP.QUES_EDIT_PRESC',
//     urlPdfFile: 'Doc-EditTimeline.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/EbGZgjLu-GRCpYQeLGRGsooB2YIXhYIUvduh9YBysaHcAw?e=NqnYgr'
//   },
//   {
//     id: '5',
//     serialNo: '5)',
//     text: 'HELP.QUES_REVIEW_CONS',
//     urlPdfFile: 'Doc-ReviewConsultation.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/EbyXVcZeSJdIk7eJl_Za_y4Blp-ncI7SimN9W_xDJu5jPQ?e=7ZR7I8'
//   },
//   {
//     id: '6',
//     serialNo: '6)',
//     text: 'HELP.QUES_MONITOR_COV',
//     urlPdfFile: 'Doc-CovidMonitoring.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/Ef4u8mZDXvJDj9Tc7_4pYQ8B5a2VFOXb0dguxt0b263UOQ?e=W7h9VS'
//   },
//   {
//     id: '7',
//     serialNo: '7)',
//     text: 'HELP.QUES_USE_FORUMS',
//     urlPdfFile: 'Doc-Forum.pdf',
//     videoUrl: 'https://concentin-my.sharepoint.com/:v:/g/personal/vivek_concent_in/EQaHXVo_etFEsdKR7pyqOmABMyZBuZgaIuxpMRvt84GRbw?e=u1qqaz'
//   },
//   {
//     id: '8',
//     serialNo: '8)',
//     text: 'HELP.QUES_UPDATE_TIMINGS',
//     urlPdfFile: 'Doc-MyPractice.pdf',
//     videoUrl: ''
//   }
// ]
// const QUESTIONS_INFO_ARR=[];

const styles = StyleSheet.create({
  content: {
    paddingVertical: 25,
    paddingHorizontal: 20
  },
  helpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  textSec: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 10
  },
  text: {
    fontSize: 16,
    lineHeight: 20
  },
  actionSec: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'flex-start'
  },
  iconBox: {
    //marginRight: 20   
  },
});






const FaqScreen = ({ navigation }) => {
  const [QUESTIONS_INFO_ARR, SET_QUESTIONS_INFO_ARR] = useState([]);

  const { t } = useTranslation();
  useEffect(() => {

    const faq = []
    let url = getBaseUrl() + 'v1/public/help-document-details'
    console.log("url", url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        const data = response.data.help_document_details

        data.map(item => {
          console.log("item ", item)
          if (item['key'] == 'doctor_app_registration') {

            faq.push({
              id: '1',
              serialNo: '1)',
              text: 'HELP_SCREEN.QUES_REG_DOC',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            console.log("base url for 1 ",base_document_url)

          }
          else if (item['key'] == 'doctor_app_editprofile') {
            faq.push({
              id: '2',
              serialNo: '2)',
              text: 'HELP_SCREEN.QUES_EDIT_PROF',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf2 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_consultation') {
            faq.push({
              id: '3',
              serialNo: '3)',
              text: 'HELP_SCREEN.QUES_REMOTE_CONS',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf3 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_edittimeline') {
            faq.push({
              id: '4',
              serialNo: '4)',
              text: 'HELP_SCREEN.QUES_EDIT_PRESC',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf4 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_review_consultation') {
            faq.push({
              id: '5',
              serialNo: '5)',
              text: 'HELP_SCREEN.QUES_REVIEW_CONS',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf5 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_covid_monitoring') {
            faq.push({
              id: '6',
              serialNo: '6)',
              text: 'HELP_SCREEN.QUES_MONITOR_COV',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf6 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_forums') {
            faq.push({
              id: '7',
              serialNo: '7)',
              text: 'HELP_SCREEN.QUES_USE_FORUMS',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            // console.log("urlpdf7 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_mypractice') {
            faq.push({
              id: '8',
              serialNo: '8)',
              text: 'HELP_SCREEN.QUES_UPDATE_TIMINGS',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            
            // console.log("urlpdf8 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_standalone_billing') {
            faq.push({
              id: '9',
              serialNo: '9)',
              text: 'HELP_SCREEN.QUES_BILLING',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            
            // console.log("urlpdf8 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_leave_absence') {
            faq.push({
              id: '10',
              serialNo: '10)',
              text: 'HELP_SCREEN.QUES_LEAVE',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            
            // console.log("urlpdf8 ",urlPdfFile)

          }
          else if (item['key'] == 'doctor_app_standalone_add_patient') {
            faq.push({
              id: '11',
              serialNo: '11)',
              text: 'HELP_SCREEN.QUES_STANDALONE',
              urlPdfFile: item['value'],
              videoUrl: item['video_link']
            })
            
            // console.log("urlpdf8 ",urlPdfFile)

          }
        })
        SET_QUESTIONS_INFO_ARR(faq)
        console.log("base url i  useeffect ",BASE_DOC_URL)
        //console.log("item of value", QUESTIONS_INFO_ARR)
//          console.log("question array ", item)
       // })
      })
      .catch(error => {
        console.error(error);
      });
  }, []);



  const openDoc = (urlPdfFile) => {
    navigation.navigate('ViewPdf', {
      link: urlPdfFile,
      baseUrl: BASE_DOC_URL
    });
  }
  // const questions = () => {
  //   console.log("inside return ", QUESTIONS_INFO_ARR)
  // }
  return (


    <Container>
      <Content style={styles.content}>
        {QUESTIONS_INFO_ARR.map((item) => {
          console.log("consolefor item ", item)
          return (
            <View
              key={item.id}
              style={styles.helpRow}>
              <View style={styles.textSec}>
                <View>
                  <Text style={styles.text} testID={item.serialNo+"Text"} accessibilityLabel={item.serialNo+"Text"}>{item.serialNo}&nbsp;</Text>
                </View>
                <View>
                  <Text style={styles.text} testID={t(item.text)+"text"} accessibilityLabel={t(item.text)+"text"}>
                    {t(item.text)}
                  </Text>
                </View>
              </View>
              <View style={styles.actionSec}>
                <TouchableOpacity style={styles.iconBox} onPress={() => openDoc(item.urlPdfFile)}>
                  <Icon
                    type="FontAwesome"
                    name="file-pdf-o"
                    style={{
                      fontSize: 20,
                      paddingTop: 2,
                      color: APP_PRIMARY_COLOR
                    }}
                  testID="pdfIcon"
                  accessibilityLabel="pdfIcon"/>
                </TouchableOpacity>
                {/* To be uncommented for showing youtube links 
                  <TouchableOpacity style={[styles.iconBox, {marginRight: 0}]} onPress={() => openUrl(item.videoUrl)}>
                  <Icon
                    type="FontAwesome"
                    name="youtube-play"
                    style={{
                      fontSize: 25,
                      color: APP_PRIMARY_COLOR                      
                    }}
                  />
                </TouchableOpacity>*/}
              </View>
            </View>
          )
        }
        )}
      </Content>
    </Container>
  );
};

export default FaqScreen;