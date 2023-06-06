import React from 'react';
import {Image} from 'react-native';
import VideoCameraIcon from '../../../assets/images/videoCamera.png';
const VideoCamera = (props) => {
  return (
    <Image
      source={VideoCameraIcon}
      height={25}
      width={25}
      {...props}
      style={{height: 25, width: 25, marginLeft: 8}}
    />
  );
};

export default VideoCamera;
