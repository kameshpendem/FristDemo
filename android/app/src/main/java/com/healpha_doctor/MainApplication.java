package com.healpha_doctor;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.twiliorn.library.TwilioPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import org.wonday.pdf.RCTPdfView;
import com.zoontek.rnpermissions.RNPermissionsPackage;
import org.wonday.pdf.RCTPdfView;
import org.reactnative.camera.RNCameraPackage;
//import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
//import com.bugsnag.BugsnagReactNative;
import com.anyline.RNImageToPDF.RNImageToPdfPackage;
//import com.oney.WebRTCModule.WebRTCModulePackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.healpha_doctor.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import java.util.Arrays;
import com.facebook.react.shell.MainReactPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNFirebaseNotificationsPackage());
            packages.add(new SpiroReactPackage());
          return packages;
        }
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);
  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
