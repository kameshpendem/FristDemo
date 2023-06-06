import React, { forwardRef, useImperativeHandle } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import ImagePicker from "react-native-image-crop-picker";
import FilePickerManager from "react-native-file-picker";
import RNFetchBlob, { FS } from "rn-fetch-blob";
import fs from "react-native-fs";
import DocumentPicker, {
  types,
  DocumentPickerResponse
} from "react-native-document-picker";

const FileSelector = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const {
    multiple,
    selectionLimit = 5,
    showCropper,
    height,
    width,
    onSelection,
    onError,
    selectVideoOnly,
    selectAny,
    includeBase64
  } = props;

  const getConfigObj = () => {
    const config = {};
    config.mediaType = "photo";
    if (multiple) {
      config.multiple = true;
    }
    if (height) {
      config.height = height;
    }
    if (width) {
      config.width = width;
    }
    if (showCropper) {
      config.cropping = true;
    }
    if (selectVideoOnly) {
      config.mediaType = "video";
    }
    if (selectAny) {
      config.mediaType = "all";
    }
    if (includeBase64) {
      config.includeBase64 = true;
    }
    return config;
  };

  const openCamera = () => {
    ImagePicker.openCamera(getConfigObj())
      .then((image) => {
        if (onSelection) {
          onSelection(image instanceof Array ? image : [image]);
        }
      })
      .catch((err) => {
        if (onError) {
          onError();
        }
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker(getConfigObj())
      .then((image) => {
        console.log(image, "image");
        if (onSelection) {
          onSelection(image instanceof Array ? image : [image]);
        }
      })
      .catch((err) => {
        if (onError) {
          onError();
        }
      });
  };


  const openPicker = () => {
    Alert.alert(
      "",
      t("DEVICE.CAMERA.HEADING"),
      [
        {
          text: t("DEVICE.CAMERA.CAMERA_TITLE"),
          onPress: () => openCamera()
        },
        {
          text: t("DEVICE.CAMERA.GALLERY_TITLE"),
          onPress: () => openGallery()
        },
      ],
      {
        cancelable: true
      }
    );
  };

  useImperativeHandle(ref, () => ({
    // This will show dialog with options
    openPicker() {
      openPicker();
    },
    // This will directly open the camera
    openCamera() {
      openCamera();
    },
    // This will directly open the gallery
    openGallery() {
      openGallery();
    },
  }));

  return null;
});

export default FileSelector;
