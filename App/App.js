import React, { Component } from "react";
import { Provider } from "react-redux";
import Store from "./redux/Store";
// import VersionCheck from 'react-native-version-check';
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Root } from "native-base";
import MainApp from "./MainApp";
import { Text, View } from "react-native";

const theme = {
  ...DefaultTheme,
  dark: false
};

// const App1 = () => {
//   useEffect(() => {
//     checkUpdateNeeded();
//   }, []);
// };
// const checkUpdateNeeded = async () => {
//   try {
//     let updateNeeded = await VersionCheck.needUpdate();
//     console.log(updateNeeded);
//     console.log(updateNeeded.isNeeded);
//     if (updateNeeded && updateNeeded.isNeeded) {
//       //Alert the user and direct to the app url
//       Alert.alert(
//         'Please Update',
//         'You will have to update your app to the latest version to continue using',
//         [
//           {
//             text: 'Update',
//             onpress: () => {
//               BackHandler.exitApp();
//               Linking.openURL(updateNeeded.storeUrl);
//             },
//           },
//         ],
//         {cancelable: false},
//       );
//     }
//   } catch (error) {}
// };

const store = Store();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Root>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <MainApp />
          </PaperProvider>
        </Provider>
      </Root>
    );
  }
}

export default App;
