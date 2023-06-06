Step 1 : Clone the Project from Bitbucket
Step 2 : Open the Project
Step 3 : sudo su
Step 4 : Enter Password
Step 5 : delete package-lock.json
step 6 : npm install realm@^6.1.4 --unsafe-perm
Step 7 : npm install
Step 8 : npx react-native link
Step 9 : Comment ln 23 in node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialPackage.java
Step 10 : Add locale.properties file under android/ (Contains SDK Path)
Step 11 : Update android/build.gradle file add subprojects block at top
(Link : https://github.com/facebook/react-native/issues/19239#issuecomment-499310486)
Step 12 : Update android/app/build.gradle file add subprojects block at bottom
(Link : https://github.com/facebook/react-native/issues/19239#issuecomment-499310486)
Step 13 : npm run android
Step 14 : Open new terminal
Step 15 : npm start

Others :
Release APK : npx react-native run-android --variant=release
APK Path : cd android/app/build/outputs/apk/release/
List Process : lsof -i:8081
Kill Process : kill -9 <PID>
