import { Toast } from "native-base";
import { hp } from "../../../themes/Scale";

export const NativeToast = (values) => {
  Toast.show({
    text: values.text,
    type: values.type,
    position: "top",
    duration: 3000,
    style: {
      marginBottom: 60,
      zIndex: 999,
      marginHorizontal: hp(10),
      borderRadius: 10
    },
    onClose: values?.navigation,
    textStyle: {
      textAlign: "center",
      textAlignVertical: "center",
      alignSelf: "center"
    }
  });
};

export const NativeToastTop = (values) => {
  Toast.show({
    position: "top",
    text: values.text,
    type: values.type,
    duration: 3000,
    style: {
      marginBottom: 60,
      zIndex: 999,
      marginHorizontal: hp(10),
      borderRadius: 10
    },
    onClose: values?.navigation,
    textStyle: {
      textAlign: "center",
      textAlignVertical: "center",
      alignSelf: "center"
    }
  });
};
