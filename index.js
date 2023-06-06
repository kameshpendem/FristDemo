/**
 * @format
 */

import "react-native-gesture-handler";
import "./patch.js";
import { AppRegistry } from "react-native";
import App from "./App/App";
import { name as appName } from "./app.json";
import bgMessaging from "./App/firebase/bgMessaging";
// import { Client } from "bugsnag-react-native";
import "./i18n";

// const bugsnag = new Client('88debfe471e3f206d09a2bef3e0bed3d');
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundMessage",
  () => bgMessaging
);
// bugsnag.notify(new Error('Test error'));
