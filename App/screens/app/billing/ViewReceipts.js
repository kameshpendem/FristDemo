import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Pdf from "../../../assets/images/pdf.png";
import Header from "../common/Header";
// import { Card } from "react-native-elements";
import { getReceipts } from "../../../redux/actions/timeline_action";
import { NativeToastTop } from "../common/Toaster";
import Loader from "../common/Loader";
import { APP_PRIMARY_COLOR } from "../../../themes/variable";
import { CardItem } from "native-base";
import { Card } from "react-native-elements";
import moment from "moment";
import { getApiUrl } from "../../../config/Config";

function ViewReceipts({ navigation, patientList, t }) {
  const [receiptsList, setreceiptsList] = useState([]);
  const [loading, setloading] = useState(true);
  const [empty, setempty] = useState(false);

  const GetReceipts = async (val) => {
    await getReceipts(val)
      .then((res) => {
        if (res?.receipts.length == 0) {
          setloading(false);
          setempty(true);
        } else {
          setreceiptsList(res?.receipts);
          setloading(false);
          setempty(false);
        }
      })
      .catch((res) => {
        NativeToastTop({ text: t("BILLING.PAYBILL.FAIL"), type: "warning" });
        setTimeout(() => {
          navigation.goBack();
        }, 250);
      });
  };

  useEffect(() => {
    GetReceipts({
      healpha_id: patientList?.appointment?.healpha_id,
      enc_id: patientList?.encounter_id
    });
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title={t("BILLING.RECEIPTS.TITLE")} navigation={navigation} />
      {empty ? (
        <View style={{ alignItems: "center", paddingTop: 300 }}>
          <Text>{t("BILLING.RECEIPTS.NORECEIPTS")}</Text>
        </View>
      ) : (
        <ScrollView>
          {receiptsList.length > 0
            ? receiptsList.map((i, index) => {
                // let date = i.date;

                let newdate = new Date(i.date);

                let date = newdate.getDate();
                let month = moment(newdate).format("MMM");
                let year = newdate.getFullYear();

                console.log(date, month, year, "date month year");

                return (
                  <Card containerStyle={{ padding: 0 }} key={index}>
                    <CardItem
                      style={{
                        margin: 0,
                        padding: 0,
                        flexDirection: "row",
                        width: "100%"
                      }}>
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "60%",
                          height: "100%"
                        }}>
                        <Text>{i.bill_number}</Text>
                        <Text style={{ fontSize: 12 }}>
                          {/* {date + " " + month + " " + year} */}
                          {i?.date}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          height: "100%"
                        }}>
                        <Text>{i.paid_amount}</Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          height: "100%"
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("ViewPdfFooter", {
                              link: getApiUrl() + i?.pdf,
                              screenname: t("BILLING.RECEIPTS.RECEIPT")
                            });
                          }}
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#CBF3FF",
                            borderRadius: 5,
                            paddingVertical: 3,
                            paddingHorizontal: 5,
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}>
                          <Image source={Pdf} style={styles.historyicon} />
                          <Text
                            style={{
                              fontSize: 14,
                              color: APP_PRIMARY_COLOR,
                              textAlignVertical: "center"
                            }}>
                            {t("BILLING.RECEIPTS.VIEW")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </CardItem>
                  </Card>
                );
              })
            : null}
        </ScrollView>
      )}
    </View>
  );
}

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
)(withTranslation()(ViewReceipts));

const styles = StyleSheet.create({
  historyicon: {
    width: 25,
    height: 25
  }
});
