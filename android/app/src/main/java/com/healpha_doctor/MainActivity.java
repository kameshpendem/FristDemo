package com.healpha_doctor;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
// import android.os.CountDownTimer;
import android.os.Environment;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Base64;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.ayudevice.ayublesdk.AyuBLE;
import com.ayudevice.ayublesdk.BLEScanner;
import com.ayudevice.ayublesdk.Device;
import com.ayudevice.ayublesdk.DeviceConnectionState;
import com.ayudevice.ayublesdk.DeviceScanListener;
import com.ayudevice.ayuplaybacksdk.AyuFileGenerator;
import com.ayudevice.ayuplaybacksdk.AyuPlayback;
import com.ayudevice.ayuplaybacksdk.PlayBackUtil;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Vector;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
public class MainActivity extends ReactActivity  implements com.healpha_doctor.Spirometer.ICallBack,
        com.healpha_doctor.pulse_oximeter.ICallBack,
        com.healpha_doctor.blood_pressure.ICallBack,
        com.healpha_doctor.ear_temperature.ICallBack,
        com.healpha_doctor.blood_glucose.ICallBack,
        com.healpha_doctor.urine_analyzer.ICallBack {

    /**
     */
    String box = null;
  String box2=null;
  String voiceValue=null;
  private static final int SPEECH_REQUEST_CODE = 0;
    private BluetoothAdapter mAdapter;
    private Button BTscan, BTturnOn;
    public final int PULSE_REQUEST_COARSE_LOCATION_PERMISSIONS=0;
    public final int TEMP_REQUEST_COARSE_LOCATION_PERMISSIONS=1;
    public final int BP_REQUEST_COARSE_LOCATION_PERMISSIONS=2;
    public final int SPIRO_REQUEST_COARSE_LOCATION_PERMISSIONS=3;
    public final int AASHA_REQUEST_COARSE_LOCATION_PERMISSIONS=4;
    public final int AYU_REQUEST_COARSE_LOCATION_PERMISSIONS=5;

    private com.healpha_doctor.Spirometer.BluetoothChatService mBluetoothChatService;
    private com.healpha_doctor.Spirometer.Callback call;


    public com.healpha_doctor.pulse_oximeter.BluetoothChatService mBluetoothChatServicespo2;
    public com.healpha_doctor.pulse_oximeter.CallBack callspo2;


    public com.healpha_doctor.blood_pressure.BluetoothChatService mBluetoothChatServicebp;
    public com.healpha_doctor.blood_pressure.CallBack callbp;


    public com.healpha_doctor.ear_temperature.BluetoothChatService mBluetoothChatServicetemp;
    public com.healpha_doctor.ear_temperature.Callback calltemp;

    public com.healpha_doctor.blood_glucose.BluetoothChatService mBluetoothChatServiceglucose;
    public com.healpha_doctor.blood_glucose.Callback callglucose;

    public com.healpha_doctor.urine_analyzer.BluetoothChatService mBluetoothChatServicebc;
    public com.healpha_doctor.urine_analyzer.Callback callbc;
    private  com.healpha_doctor.aasha.BluetoothChatService mBluetoothChatServiceaasha;

    public com.healpha_doctor.Spirometer.MtBuf m_mtbuf = new com.healpha_doctor.Spirometer.MtBuf();
    public com.healpha_doctor.blood_glucose.MtBuf m_mtbuf_glucose = new com.healpha_doctor.blood_glucose.MtBuf();
    public com.healpha_doctor.urine_analyzer.MtBuf m_mtbuf_bc = new com.healpha_doctor.urine_analyzer.MtBuf();
    public com.healpha_doctor.ear_temperature.MtBuf m_mtbuftemp = new com.healpha_doctor.ear_temperature.MtBuf(this);
    public com.healpha_doctor.pulse_oximeter.MtBuf m_mtbufspo2 = new com.healpha_doctor.pulse_oximeter.MtBuf(this);
    public com.healpha_doctor.blood_pressure.MtBuf m_mtbufbp = new com.healpha_doctor.blood_pressure.MtBuf(this);


    private static MainActivity instance;
    double spiroValue;
    public static int called = 0;
    public static int called1 = 0;
    public static int called2 = 0;
    public static int called3 = 0;
    public static int startTest = 0;
    public static String aasha=null;
  public AudioManager audio=null;
  public  RecognitionListener recognitionListener;
  private SpeechRecognizer speech = null;
  private Intent recognizerIntent;
  public String device_address = null;
  public boolean autoConnect = true;
  public boolean enable = true;
  public short[] ayudata;
  public String ayuflag="";
  public boolean recorder =false;
  public boolean recorder1 =false;
    /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "healpha_doctor";
  }
  public static MainActivity getInstance() {
    return instance;
  }

  // @Override
  // protected ReactActivityDelegate createReactActivityDelegate() {
  //   return new ReactActivityDelegate(this, getMainComponentName()) {
  //     @Override
  //     protected ReactRootView createRootView() {
  //      return new RNGestureHandlerEnabledRootView(MainActivity.this);
  //     }
  //   };
  // }


  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
//        BTscan = (Button)findViewById(R.id.scan);
//        BTturnOn = (Button)findViewById(R.id.turnon);
//        BTscan.setOnClickListener(new ClickMe());
//        BTturnOn.setOnClickListener(new ClickMe());
        call = new com.healpha_doctor.Spirometer.Callback(m_mtbuf, this);
        callspo2 = new com.healpha_doctor.pulse_oximeter.CallBack(m_mtbufspo2, this);
        calltemp = new com.healpha_doctor.ear_temperature.Callback(m_mtbuftemp, this);
        callbp = new com.healpha_doctor.blood_pressure.CallBack(m_mtbufbp, this);
        callglucose = new com.healpha_doctor.blood_glucose.Callback(m_mtbuf_glucose, this);
        callbc = new com.healpha_doctor.urine_analyzer.Callback(m_mtbuf_bc, this);
        instance = this;
    audio = (AudioManager) this.getSystemService(Context.AUDIO_SERVICE);

    }

    protected void onStart() {
        super.onStart();
        if (mBluetoothChatService == null) {
            mBluetoothChatService = new com.healpha_doctor.Spirometer.BluetoothChatService(this, call);
        }
        if (mBluetoothChatServicespo2 == null) {
            mBluetoothChatServicespo2 = new com.healpha_doctor.pulse_oximeter.BluetoothChatService(this, callspo2);
        }
        if (mBluetoothChatServicebp == null) {
            mBluetoothChatServicebp = new com.healpha_doctor.blood_pressure.BluetoothChatService(this, callbp);
        }
        if (mBluetoothChatServicetemp == null) {
            mBluetoothChatServicetemp = new com.healpha_doctor.ear_temperature.BluetoothChatService(this, calltemp);
        }
        if (mBluetoothChatServiceglucose == null) {
            mBluetoothChatServiceglucose = new com.healpha_doctor.blood_glucose.BluetoothChatService(this, callglucose);
        }
        if (mBluetoothChatServicebc == null) {
            mBluetoothChatServicebc = new com.healpha_doctor.urine_analyzer.BluetoothChatService(this, callbc);
        }
        if (mBluetoothChatServiceaasha == null) {
            mBluetoothChatServiceaasha=new com.healpha_doctor.aasha.BluetoothChatService();
        }
    }


    private IntentFilter intentFilterActions() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothDevice.ACTION_FOUND);// ??BroadcastReceiver????????????
        filter.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);
        filter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED);
        filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
        return filter;
    }


    @Override
  public void call() {
    Vector<Integer> _ver = com.healpha_doctor.Spirometer.MtBuf.m_buf;
    for (int i = 0; i < _ver.size(); i++) {
      Log.i("............", Integer.toHexString(_ver.get(i) & 0xFF));
    }
  }

  @Override
  public void callPulseOxi() {

  }

  @Override
  public void callBp() {

  }

  @Override
  public void callTemp() {

  }

  @Override
  public void callGlucose() {

  }

  @Override
  public void callbc() {

  }

//    private class ClickMe implements View.OnClickListener{
//        @Override
//        public void onClick(View v) {
//            switch (v.getId()){
//                case R.id.scan:
//                    scanBT();
//                    break;
//                case R.id.turnon:
//                    turnOnBT();
//                    break;
//            }
//        }
//    }

  public void turnOnBT() {
    //TODO:: Turning on bluetooth code here...
    Intent discoverableIntent = new Intent(
            BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
    discoverableIntent.putExtra(
            BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
    startActivity(discoverableIntent);
    Log.i("TEST", " TurnBT called");
  }

  private BroadcastReceiver mBroadcastReceivers = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());
        if (device.getName().contains("PULMO0")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatService.start();
          mBluetoothChatService.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }
        }

      }
    }
  };
  private BroadcastReceiver mBroadcastReceiversspo2 = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());

        if (device.getName().contains("SpO208")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatServicespo2.start();
          mBluetoothChatServicespo2.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }

        }
      }
    }
  };
  private BroadcastReceiver mBroadcastReceiversbp = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());
        if (device.getName().contains("NIBP046")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatServicebp.start();
          mBluetoothChatServicebp.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }

        }
      }
    }
  };
  private BroadcastReceiver mBroadcastReceiverstemp = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());

        if (device.getName().contains("TEMP03")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatServicetemp.start();
          mBluetoothChatServicetemp.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }

        }
      }
    }
  };
  private BroadcastReceiver mBroadcastReceiversglucose = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());

        if (device.getName().contains("BG01")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatServiceglucose.start();
          mBluetoothChatServiceglucose.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }

        }
      }
    }
  };
  private BroadcastReceiver mBroadcastReceiversbc = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Log.i("TEST BR ACTION", action);
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();
      Log.i("TEST", "Broadcast receiver");
      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
        Log.i("TEST BR", "for loop");
      }
      //????????????????MAC???
      if (BluetoothDevice.ACTION_FOUND.equals(action)) {
        BluetoothDevice device = intent
                .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName() == null) {
          return;
        }
        Log.i("TEST", device.getName());

        if (device.getName().contains("BC01")) {//TEMP030041
          Log.d("MainActivity test", "Device Detected!!!");
          mBluetoothChatServicebc.start();
          mBluetoothChatServicebc.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }
        }
      }
    }
  };

  public double scanSpiro() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
//      if (mAdapter.isDiscovering()) {
//        // Bluetooth is already in modo discovery mode, we cancel to restart it again
//        mAdapter.cancelDiscovery();
//      }
//      mAdapter.startDiscovery();
//      registerReceiver(mBroadcastReceivers, intentFilterActions());
      SpiroDiscovery();
      while (!m_mtbuf.flag) ;

      Log.i("TEST flag", m_mtbuf.mPef + "");


    }
    return m_mtbuf.mPef;
  }

  public double scanTemp() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
//      if (mAdapter.isDiscovering()) {
//        // Bluetooth is already in modo discovery mode, we cancel to restart it again
//        mAdapter.cancelDiscovery();
//      }
//      mAdapter.startDiscovery();
//      registerReceiver(mBroadcastReceiverstemp, intentFilterActions());
      TempDiscovery();
      while (!m_mtbuftemp.flag) ;

      Log.i("TEST flag", m_mtbuftemp.mTempData + "");


    }
    return m_mtbuftemp.mTempData;
  }

  public void PulseDiscovery() {
    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
      registerReceiver(mBroadcastReceiversspo2,intentFilterActions());
      mAdapter.startDiscovery();
      return;
    }

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[]{
                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
            PULSE_REQUEST_COARSE_LOCATION_PERMISSIONS);
  }
  public void aashaDiscovery() {
    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
      registerReceiver(searchAasha,intentFilterActions());
      mAdapter.startDiscovery();
      return;
    }

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[]{
                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
            AASHA_REQUEST_COARSE_LOCATION_PERMISSIONS);
  }
  public void BPDiscovery() {
    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
      registerReceiver(mBroadcastReceiversbp,intentFilterActions());
      mAdapter.startDiscovery();
      return;
    }

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[]{
                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
            BP_REQUEST_COARSE_LOCATION_PERMISSIONS);
  }

  public void SpiroDiscovery() {
    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
      registerReceiver(mBroadcastReceivers,intentFilterActions());
      mAdapter.startDiscovery();
      return;
    }

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[]{
                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
            SPIRO_REQUEST_COARSE_LOCATION_PERMISSIONS);
  }
  public void TempDiscovery() {
    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
      registerReceiver(mBroadcastReceiverstemp,intentFilterActions());
      mAdapter.startDiscovery();
      return;
    }

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[]{
                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
            TEMP_REQUEST_COARSE_LOCATION_PERMISSIONS);
  }

  public String scanSpo2() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
      PulseDiscovery();
//      if (mAdapter.isDiscovering()) {
//        // Bluetooth is already in modo discovery mode, we cancel to restart it again
//        mAdapter.cancelDiscovery();
//      }
//      mAdapter.startDiscovery();
//
      while (!m_mtbufspo2.flag) ;
      Log.i("TEST flag", m_mtbufspo2.spo2Data + " " + m_mtbufspo2.PRData);
    }
    return m_mtbufspo2.spo2Data + " " + m_mtbufspo2.PRData;
  }
//   @Override
//   public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
//     switch (requestCode) {
//       case TEMP_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           registerReceiver(mBroadcastReceiverstemp,intentFilterActions());
//         } else {
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//       case PULSE_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           registerReceiver(mBroadcastReceiversspo2,intentFilterActions());
//         } else {
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//       case BP_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           registerReceiver(mBroadcastReceiversbp,intentFilterActions());
//         } else {
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//       case SPIRO_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           registerReceiver(mBroadcastReceivers,intentFilterActions());
//         } else {
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//       case AASHA_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           registerReceiver(searchAasha,intentFilterActions());
//         } else {
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//       case AYU_REQUEST_COARSE_LOCATION_PERMISSIONS: {
//         Log.i("Test output=","locpermcase");
//         Log.i("Test output=", String.valueOf(grantResults.length));
//         Log.i("Test output=", String.valueOf(grantResults[0]));
//         Log.i("Test output=", String.valueOf(PackageManager.PERMISSION_GRANTED));
//         if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//           //continueDoDiscovery();
//           Log.i("Test output=","locpermif");
//           ayublescandevice();
// //          registerReceiver(searchAasha,intentFilterActions());
//         } else {
//           Log.i("Test output=","locpermelse");
//           Toast.makeText(this,
//                   getResources().getString(Integer.parseInt("permission failed")),
//                   Toast.LENGTH_LONG).show();

//           // mAdapter.cancelDiscovery();
//         }
//         return;
//       }
//     }
//   }

  public String scanbp() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
//      if (mAdapter.isDiscovering()) {
//        // Bluetooth is already in modo discovery mode, we cancel to restart it again
//        mAdapter.cancelDiscovery();
//      }
//      mAdapter.startDiscovery();
//      registerReceiver(mBroadcastReceiversbp, intentFilterActions());
      BPDiscovery();
      while (!m_mtbufbp.flag) ;

      Log.i("TEST flag", m_mtbufbp.highbp + " " + m_mtbufbp.lowbp);
    }
    return m_mtbufbp.highbp + " " + m_mtbufbp.lowbp;
  }
  private BroadcastReceiver searchAasha = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Bundle b = intent.getExtras();
      Object[] lstName = b.keySet().toArray();

      // ??????????????????????
      for (int i = 0; i < lstName.length; i++) {
        String keyName = lstName[i].toString();
        Log.e(keyName, String.valueOf(b.get(keyName)));
      }
      if(BluetoothDevice.ACTION_FOUND.equals(action)){
        BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (device.getName()==null) {
          return;
        }
        if (device.getName().contains("SPP")) {
          Log.d("MainActivity", "Device Detected!!!");
          mBluetoothChatServiceaasha.start();
          mBluetoothChatServiceaasha.connect(device);
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }

        }
      }
    }
  };

  public void speechToText(String str){
    if(speech!=null) {
      //  speech.stopListening();
      speech.destroy();
      speech = null;
    }
    box = str;

    Log.d("Javascript Interface: ","Function called");
    Toast.makeText(MainActivity.this, "Healpha Listening", Toast.LENGTH_SHORT).show();
    Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,
            Locale.getDefault());
    intent.putExtra("android.speech.extra.DICTATION_MODE", true);
    intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,2000000);
    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS,2000000);
    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,2000000);
    // Start the activity, the intent will be populated with the speech text
    intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
    startActivityForResult(intent, SPEECH_REQUEST_CODE);
    //webView.loadUrl("javascript:setChief('"+ docInput +"')");
  }
//   public void ayudev1(short[] ayudata){
//     Log.i("Test output=","ayudev1");
//     runOnUiThread(new Runnable() {
//       @Override
//       public void run() {
//         Log.i("Test output=","ayudevrun1");
//         AyuPlayback ayuPlayback = AyuPlayback.getInstance();
//         Log.i("Test output=","ayuplayback1");
//         ayuPlayback.play(ayudata);
//         Log.i("Test output=","ayustream");
//       }
//     });
//   }
//  public void stopayuble(){
//    Log.i("Test output=","stopayuble");
//    runOnUiThread(new Runnable() {
//      @Override
//      public void run() {
//        Log.i("Test1 output=","stopayublerun1");
//        AyuPlayback ayuPlayback = AyuPlayback.getInstance();
//        ayuPlayback.stop();
//
//        AyuBLE ayuBle = new AyuBLE(getApplicationContext());
//        Log.i("Test1 output=","stopayuble1");
////        ayuBle.close();
//        enable = false;
//        ayuBle.soundData(enable);
//        Log.i("Test1 output=","stopayubleclose");
//
//      }
//    });
//  }
//   public void ayudev(){
//   Log.i("Test output1=","ayudev");
//   runOnUiThread(new Runnable() {
//     @Override
//     public void run() {
//       Log.i("Test output1=","ayudevrun2");
//       AyuPlayback ayuPlayback = AyuPlayback.getInstance();
//       Log.i("Test output1=","ayuplayback");
//       ayuPlayback.setRecordingTimeLimit(5);
////       ayuPlayback.stop(); // Stops playing
////       ayuPlayback.startRecording();
//
////       ayuPlayback.startRecording();
//       Log.i("Test output1=","ayustream");
//       ayuPlayback.setProgressListener(new AyuPlayback.ProgressListener() {
//         @Override
//         public void elapsedTime(long min, long secs) {
//           Log.i("Test output11=","ayuelapsedtime");
//           //returns the elapsed time recorded/streamed
//         }
//
//         @Override
//         public void recordingComplete() {
//
//           Log.i("Test output1=","ayurecordcomplete");
//           //method is called when recording gets completed for specified time by default it will be recorded for 10 sec
//           short[] data = ayuPlayback.getData(); //returns recorded data
//           ayuPlayback.clearRecordedData();
//           File file = new File(Environment.getExternalStorageDirectory() + "/AyuData/recorder.wav");
//           String file2="";
//           File file1 = new File(Environment.getExternalStorageDirectory(), "AyuData");
//           if (!file1.exists()) {
//                      if (!file1.mkdirs()) {
//                          Log.d("readdata", "failed to create directory");
//                      }
//             file1.mkdirs();
//           }
//           if(recorder==false) {
//             file = new File(Environment.getExternalStorageDirectory() + "/AyuData/recorded.wav");
//             file2 = Environment.getExternalStorageDirectory() + "/AyuData/recorded.wav";
//             recorder=true;
//           }
//           else{
//             file = new File(Environment.getExternalStorageDirectory() + "/AyuData/recorded1.wav");
//             file2 = Environment.getExternalStorageDirectory() + "/AyuData/recorded1.wav";
//             recorder=false;
//           }
//           Log.i("Test output1=","ayurecorddata"+file);
//           try {
//             AyuFileGenerator.saveFile(PlayBackUtil.shortToByte(data), file);
//
//             try {
//               Log.i("Test output1=","eventemitter1"+file2);
//               SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                       .emit("getAyuData", file2);
//
//             } catch (Exception e){
//               Log.e("ReactNative1=", "Caught Exception: " + e.getMessage());
//             }
////             FileInputStream fileInputStreamReader = new FileInputStream(file2);
////             Bitmap bm = BitmapFactory.decodeFile(file2);
//
////             ByteArrayOutputStream baos = new ByteArrayOutputStream();
//
////             bm.compress(Bitmap.CompressFormat.wav, 100, baos);
//
////             byte[] byteArrayImage = baos.toByteArray();
////             byte[] bytes = new byte[(int)file2.length()];
////             fileInputStreamReader.read(bytes);
////             String encodedfile = Base64.encodeToString(bytes, Base64.DEFAULT);
////             Log.i("Test output1=","encodedfile"+encodedfile);
////             ayuflag=encodedfile;
//             //             String encodedImage = Base64.encodeToString(byteArrayImage, Base64.DEFAULT);
////             File file = new File(Environment.getExternalStorageDirectory() + "/AyuData/recorded.wav");
//
////             AyuFileGenerator.saveFile(PlayBackUtil.shortToByte(data), file);
//           } catch (IOException e){
//             e.printStackTrace();
//           }
//           Log.i("Test output1=","againayuble");
////           stopayuble();
//           ayuble();
////           ayuPlayback.clearRecordedData();
////           return;
//         }
//
//         @Override
//         public void playingComplete() {
//           Log.i("Test output1=","playing complete");
//           //method is called when playing gets completed
//         }
//       });
//     }
//   });
// }
// public void scanayuble() {
//   Log.i("Test output=","scanayuble");
//   Log.i("Test output=", String.valueOf(PackageManager.PERMISSION_GRANTED));
//   int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
//   if (hasPermission == PackageManager.PERMISSION_GRANTED) {
//     ayublescandevice();
//   return;
//   }

//   ActivityCompat.requestPermissions(MainActivity.this,
//           new String[]{
//                   android.Manifest.permission.ACCESS_COARSE_LOCATION},
//           AYU_REQUEST_COARSE_LOCATION_PERMISSIONS);
// }
//  public void scanayuble() {
//    int hasPermission = ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION);
//    if (hasPermission == PackageManager.PERMISSION_GRANTED) {
//     ayublescandevice();
//      return;
//    }
//
//    ActivityCompat.requestPermissions(MainActivity.this,
//            new String[]{
//                    android.Manifest.permission.ACCESS_COARSE_LOCATION},
//            AYU_REQUEST_COARSE_LOCATION_PERMISSIONS);
//  }
//  public void ayublescandevice(){
//    Log.i("Test output=","ayublescandevice");
//    runOnUiThread(new Runnable() {
//      @Override
//      public void run() {
//        Log.i("Test output=","run");
//        BLEScanner bleScanner = new BLEScanner(getApplicationContext());
//        bleScanner.setDeviceScanListener(new DeviceScanListener() {
//          @Override
//          public void onScanStart() {
//
//            Log.i("Test output=","onScanStart");
//          }
//
//          @Override
//          public void onDeviceFound(Device device) {
//            Log.i("Test output=", String.valueOf(device.getAddress()));
//            device_address = device.getAddress();
//            autoConnect = true;
//          }
//
//          @Override
//          public void onScanFinish() {
//            Log.i("Test output=","onScanFinish");
//             ayuble();
//          }
//
//          @Override
//          public void onScanFailed(int errorCode) {
//            Log.i("Test output=", String.valueOf(errorCode));
//          }
//        });
//        Log.i("Test output=","startscan");
//        bleScanner.startScan(1000);
//
//      }
//    });
//  }

//  public String ayublestart() {
//    String ayupath="";
//    if(ayuflag==""){
//      ayupath=ayuble();
//    }
//    else{
//      ayupath=ayuflag;
//    }
//    return ayupath;
//  }

//  public String ayuble(){
//     Log.i("Test output=","ayuble start");
//     runOnUiThread(new Runnable() {
//
//       @Override
//       public void run() {
//         Log.i("Test output=","run");
//         AyuBLE ayuBle = new AyuBLE(getApplicationContext());
//         Log.i("Test output=","ayuble run");
//         enable = true;
//         /**
//          * To enable/disable receiving sound samples
//          * Default - it is enabled
//          */
// //        ayuBle.connect(device_address,autoConnect);
//         ayuBle.connect(device_address,autoConnect);
//         Log.i("Test output=","ayuble connect done");
//
//
//         //Callback to get device connection state
//         ayuBle.setDeviceConnectionReceiver(new AyuBLE.DeviceConnectionReceiver() {
//           @Override
//           public void deviceStateChanged(DeviceConnectionState state) {
//             Log.i("Test output=","ondevicestatechange");
//           }
//
//           @Override
//           public void onBluetoothAdapterStateChanged(int i) {
//             Log.i("Test output=","bluetoothadapterstatechanged");
//
//           }
//         });
//         //Callback to get raw audio data from hardware
//         ayuBle.setSampleReceiver(new AyuBLE.SampleReceiver() {
//           @Override
//           public void onSampleReceived(short[] data) {
//             Log.i("Test output=","onSamplereceived");
//             ayudata = data;
////             eventemitter1(ayudata);
//             ayudev1(ayudata);
//           }
//
//         });
//         Log.i("Test output=","sound data");
//         ayuBle.soundData(enable);
//         Log.i("Test output=","sound data enabled");
////         if(ayuflag==""){
//           ayudev();
////         }
// //
// //        /**
// //         * Listener for getting rssi value
// //         */
// //        ayuBle.setRssiReceiver(new BluetoothRssiListener() {
// //          @Override
// //          public void remoteRssi(int rssi) {
// //
// //          }
// //        });
// //
// //        //Call this function to get rssi value of AyuMix.
// //        ayuBle.readRSSI();
//
//       }
//     });
//     return ayuflag;
//   }
   public void eventemitter1(short[] data){
     byte[] data1=PlayBackUtil.shortToByte(data);
     String encodedfile = Base64.encodeToString(data1, Base64.DEFAULT);

     Log.i("Test output=","eventemitter11"+encodedfile);

//     String data1 = String.valueOf(data);
//     JSONObject data1 = new JSONObject();
//     data1.put("ayuevent",data1);
//     List<Short> list = new ArrayList<>();
//     list.add(data);
//     JSONObject data11 = new JSONObject(list);

//     Short data1=Short.valueOf(String.valueOf(data));
//     Short data1 = Short.parseShort(data.getClass().toString());
//     temprature =Integer.parseInt( Temprature.getText().toString());

     Log.i("Test output=","eventemitter111");

//     double data1= data.doubleValue();
//    String data1="hello getting eventemitter";
//     runOnUiThread(new Runnable() {

//       @Override
//       protected void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);
//         WritableMap payload = Arguments.createMap();
         // Put data to map
//         payload.putShort("MyCustomEventParam", data);

         // Emitting event from java code
     try {
       Log.i("Test output","eventemitter1");
//       (getReactNativeHost().getReactInstanceManager().getCurrentReactContext()).getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//               .emit("MyCustomEvent", data);
//       WritableNativeMap appParams = new WritableNativeMap();
//       appParams.putMap("initialProps", data);
       SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
               .emit("getAyuData", encodedfile);

     } catch (Exception e){
    Log.e("ReactNative", "Caught Exception: " + e.getMessage());
  }
//       }
//     })
   }
  public void speechToText3()
  {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        recognitionListener = new RecognitionListener() {
          @Override
          public void onReadyForSpeech(Bundle params) {
            Log.d("test", "onReadyForSpeech()");
          }
          @SuppressLint("LongLogTag")
          @Override
          public void onBeginningOfSpeech() {
            Log.d("test", "onBeginningOfSpeech()");
          }
          @Override
          public void onRmsChanged(float rmsdB) {
            //   Log.d("readdata", "OnRmsChanged " + rmsdB);
          }
          @Override
          public void onBufferReceived(byte[] buffer) {
            Log.d("test", "onBufferReceived " + buffer);
          }
          @Override
          public void onEndOfSpeech() {
//                        Log.d("readdata","current="+audio.getStreamVolume(AudioManager.STREAM_MUSIC)+ " max="+audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC));
//                        if(audio.getStreamVolume(AudioManager.STREAM_MUSIC)==audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC)) {
//                            audio.setStreamVolume(AudioManager.STREAM_MUSIC, 0,  AudioManager.FLAG_SHOW_UI);
//                        }
            //Toast.makeText(UsbCamActivity.this,"End of Speech",Toast.LENGTH_SHORT).show();
            audio.setStreamVolume(AudioManager.STREAM_MUSIC, 0,  AudioManager.ADJUST_MUTE);
          }
          @Override
          public void onResults(Bundle results) {
            Log.d("readdata", "listening4");
            ArrayList<String> matches = results
                    .getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            Log.d("readdata", "onResults" + matches);
            String text = matches.get(0);
            Toast.makeText(MainActivity.this, text, Toast.LENGTH_SHORT).show();
            Log.d("readdata", "listening6=" + speech);
            try{
// else {
              getVoiceToTextResponse("https://test.healpha.com/api/voice_text_field",text);
//                            getVoiceToTextResponse("http://192.168.43.127/api/voice_text_field",text);
//                            getVoiceToTextResponse("https://test.healpha.com/api/voice_text_field", text);
              //}
              //  speech.stopListening();
              speech.destroy();
              speech = null;
              speechToText3();
            }
            catch (Exception e){
            }
//                        runOnUiThread(new Runnable() {
//                            @Override
//                            public void run() {
//                                Log.d("readdata", "onResults: Start Listening");
//                                speech.startListening(recognizerIntent);
//
//                                Log.d("readdata", "onResults: Start Listening2");
//                            }});
          }
          @Override
          public void onError(int error) {
            String message;
            switch (error) {
              case SpeechRecognizer.ERROR_AUDIO:
                message = "Audio recording error";
                break;
              case SpeechRecognizer.ERROR_CLIENT:
                message = "Client side error";
                break;
              case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                message = "Insufficient permissions";
                break;
              case SpeechRecognizer.ERROR_NETWORK:
                message = "Network error";
                break;
              case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                message = "Network timeout";
                break;
              case SpeechRecognizer.ERROR_NO_MATCH:
                message = "No match";
                break;
              case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                message = "RecognitionService busy";
                break;
              case SpeechRecognizer.ERROR_SERVER:
                message = "error from server";
                break;
              case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                message = "No speech input";
                break;
              default:
                message = "Didn't understand, please try again.";
                break;
            }
            Log.d("readdata2","errMsg "+message+" code="+error);
            // speech.stopListening();
            speech.destroy();
            speech = null;
            speechToText3();
          }
          @Override
          public void onPartialResults(Bundle partialResults) {
          }
          @Override
          public void onEvent(int eventType, Bundle params) {
          }
        };
        speech = SpeechRecognizer.createSpeechRecognizer(getInstance());
        speech.setRecognitionListener(recognitionListener);
        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, Locale.getDefault());
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_WEB_SEARCH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,2000000);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS,2000000);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,2000000);
        // Start the activity, the intent will be populated with the speech text
        recognizerIntent.putExtra("android.speech.extra.DICTATION_MODE", true);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        Log.d("readdata", "listening3=" + speech + " listener=" + recognitionListener);
        Log.d("readdata", "listening7=" + speech + " intent=" + recognizerIntent + "listener=" + recognitionListener);
        speech.startListening(recognizerIntent);
      }
    });
  }
  public double scanbg() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
      if (mAdapter.isDiscovering()) {
        // Bluetooth is already in modo discovery mode, we cancel to restart it again
        mAdapter.cancelDiscovery();
      }
      mAdapter.startDiscovery();
      registerReceiver(mBroadcastReceiversglucose, intentFilterActions());

      while (!m_mtbuf_glucose.flag) ;

      Log.i("TEST flag", m_mtbuf_glucose.mBg + "");

    }
    return m_mtbuf_glucose.mBg;
  }

  public String scanbc() {
    Log.i("TEST", " ScanBT called");
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter != null) {
      if (mAdapter.isDiscovering()) {
        // Bluetooth is already in modo discovery mode, we cancel to restart it again
        mAdapter.cancelDiscovery();
      }
      mAdapter.startDiscovery();
      registerReceiver(mBroadcastReceiversbc, intentFilterActions());

      while (!m_mtbuf_bc.flag) ;
      Log.i("TEST flag", m_mtbuf_bc.mURO + " " + m_mtbuf_bc.mBLD + " " + m_mtbuf_bc.mBIL + " " + m_mtbuf_bc.mKET + " " + m_mtbuf_bc.mGLU + " " + m_mtbuf_bc.mPRO + " " + m_mtbuf_bc.mPH + " " + m_mtbuf_bc.mNIT + " " + m_mtbuf_bc.mLEU + " " + m_mtbuf_bc.mSG + " " + m_mtbuf_bc.mVC);
    }
    return m_mtbuf_bc.mURO + " " + m_mtbuf_bc.mBLD + " " + m_mtbuf_bc.mBIL + " " + m_mtbuf_bc.mKET + " " + m_mtbuf_bc.mGLU + " " + m_mtbuf_bc.mPRO + " " + m_mtbuf_bc.mPH + " " + m_mtbuf_bc.mNIT + " " + m_mtbuf_bc.mLEU + " " + m_mtbuf_bc.mSG + " " + m_mtbuf_bc.mVC;
  }
//    public void returnValNative(char ch,double value){
//        Log.i("TEST Final value",""+value);
//    }

  public void scanAasha(String aashacomand){
    aasha=aashacomand;
    mAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mAdapter!= null){
//      mAdapter.startDiscovery();
//      registerReceiver(searchAasha,intentFilterActions());
      aashaDiscovery();
    }
  }
  public void startDoctorDashboardListening(){
    requestRecordAudioPermission();
    Log.d("readdata2","start called");
    audio.setStreamVolume(AudioManager.STREAM_MUSIC, 0,  AudioManager.ADJUST_MUTE);
    //startListening();
    speechToText3();
  }

  public void stopDoctorDashboardListening(){
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Log.d("readdata2","back called");
        // speech.stopListening();
        // speech.cancel();
        if(speech!=null) {
          //speech.stopListening();
          speech.destroy();
          speech = null;
        }
        audio.setStreamVolume(AudioManager.STREAM_MUSIC, audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC), AudioManager.ADJUST_UNMUTE);
      }
    });
  }

  public void getTabNameDetails(String tabname){

    box2=tabname;
    Log.d("readdata2","tabname="+box2);
  }

  public void getVoiceValue(String value){
    voiceValue=value;
    Log.d("readdata2","voiceValue="+voiceValue);
  }
    protected void onDestroy() {
    super.onDestroy();
try {

  if (mBroadcastReceivers != null) {
    unregisterReceiver(mBroadcastReceivers);
  }
  if (mBroadcastReceiverstemp != null) {
    unregisterReceiver(mBroadcastReceiverstemp);
  }
  if (mBroadcastReceiversbp != null) {
    unregisterReceiver(mBroadcastReceiversbp);
  }
  if (mBroadcastReceiversspo2 != null) {
    unregisterReceiver(mBroadcastReceiversspo2);
  }
  if (mBroadcastReceiversbc != null) {
    unregisterReceiver(mBroadcastReceiversbc);
  }
  if (mBroadcastReceiversglucose != null) {
    unregisterReceiver(mBroadcastReceiversglucose);
  }
}catch (Exception e){
  Log.d("readdata2","not registered");
}
  }
  private void requestRecordAudioPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      String requiredPermission = Manifest.permission.RECORD_AUDIO;

      // If the user previously denied this permission then show a message explaining why
      // this permission is needed
      if (checkCallingOrSelfPermission(requiredPermission) == PackageManager.PERMISSION_DENIED) {
        requestPermissions(new String[]{requiredPermission}, 101);
      }
    }
  }
  @Override
  public void onActivityResult(int reqCode, int resCode, Intent intent){
//    Log.d(TAG,"onActivRes="+resCode);

    if (reqCode == SPEECH_REQUEST_CODE && resCode == RESULT_OK) {

      List<String> results = intent.getStringArrayListExtra(
              RecognizerIntent.EXTRA_RESULTS);
      String spokenText = results.get(0);
      // Do something with spokenText
      Toast.makeText(this, spokenText, Toast.LENGTH_SHORT).show();
      setValue(box,spokenText);
      if(speech==null) {
        speechToText3();
      }
    }
    else if (reqCode == SPEECH_REQUEST_CODE && resCode == 0)
    {
     speechToText3();
    }
    super.onActivityResult(reqCode, resCode, intent);

  }

  public void setValue(String value, String spokenText){
    Log.d("readdata2","values="+value+" spoketext="+spokenText);
    final String respString=spokenText;
    switch(value){
      case "chief":
  //        webView.loadUrl("javascript:setChief('" + spokenText + "')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setchief", spokenText);
        break;
      case "sym":
//        webView.loadUrl("javascript:setSym('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setsym", spokenText);
        break;

      case "preill":
//        webView.loadUrl("javascript:setPreill('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setpreill", spokenText);
        break;
      case "pastill":
//        webView.loadUrl("javascript:setPastill('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setpastill", spokenText);
        break;
      case "famill":
//        webView.loadUrl("javascript:setFamill('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setfamill", spokenText);
        break;
      case "phyexam":
          Log.d("readdata2","spoketext="+spokenText);
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setphyexam", spokenText);
        break;
      case "docnotes":
//        webView.loadUrl("javascript:setDocnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setdocnotes", spokenText);
        break;
      case "assmnotes":
//        webView.loadUrl("javascript:setAssmnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setassmnotes", spokenText);
        break;
      case "diag":
//        webView.loadUrl("javascript:setDiag('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setdiag", spokenText);
        break;
      case "treatnotes":
//        webView.loadUrl("javascript:setTreatnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("settreatnotes", spokenText);
        break;
      case "dietnotes":
//        webView.loadUrl("javascript:setDietnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setdietnotes", spokenText);
        break;
      case "innotes":
//        webView.loadUrl("javascript:setInnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setinnotes", spokenText);
        break;
      case "laborders":
//        webView.loadUrl("javascript:setLabOrders('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setlaborders", spokenText);
        break;
      case "imagingorders":
//        webView.loadUrl("javascript:setImagingOrders('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setimagingorders", spokenText);
        break;
      case "nursingservices":
//        webView.loadUrl("javascript:setNursingServices('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setnursingservices", spokenText);
        break;
      case "vaccine":
//        webView.loadUrl("javascript:setVaccine('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setvaccine", spokenText);
        break;
      case "patnotes":
//        webView.loadUrl("javascript:setPatnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setpatnotes", spokenText);
        break;
      case "rxnotes":
//        webView.loadUrl("javascript:setRxnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setrxnotes", spokenText);
        break;
      case "nursenotes":
//        webView.loadUrl("javascript:setNursenotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setnursenotes", spokenText);
        break;
      case "addmedicine":
//        webView.loadUrl("javascript:setAddMedicine('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setaddmedicine", spokenText);
        break;
      case "nursevitals":
          Log.d("readdata2","value2="+value+" text245="+spokenText);
//        webView.loadUrl("javascript:setNurseVitals('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setnursevitals", spokenText);
        break;
      case "addsupplement":
//        webView.loadUrl("javascript:setAddSupplement('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setaddsupplement", spokenText);
        break;
      case "mednotes":
//        webView.loadUrl("javascript:setMednotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setmednotes", spokenText);
        break;
      case "supnotes":
//        webView.loadUrl("javascript:setSupnotes('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setsupnotes", spokenText);
        break;
      case "addmedicineout":
//        webView.loadUrl("javascript:setAddMedicineOut('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setaddmedicineout", spokenText);
        break;
      case "addsupplementout":
//        webView.loadUrl("javascript:setAddSupplementOut('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setaddsupplementout", spokenText);
        break;
      case "innotes1":
//        webView.loadUrl("javascript:setInnotes1('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setinnotes1", spokenText);
        break;

      case "sub":
//        webView.loadUrl("javascript:setSub('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setsub", spokenText);
        break;
      case "obj":
//        webView.loadUrl("javascript:setObj('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setobj", spokenText);
        break;
      case "assm":
        Log.d("readdata2","value2="+value+" text2="+spokenText);
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setassm", spokenText);
//        webView.loadUrl("javascript:setAssm('"+ spokenText +"')");
        Log.d("readdata2","value3="+value+" text3="+spokenText);
        break;
      case "plan":
//        webView.loadUrl("javascript:setPlandata('"+ spokenText +"')");
        SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("setplan", spokenText);
        break;
      case "vitals":
        Log.d("readdata2","values2="+value+" spoktext2="+respString);
//        runOnUiThread(new Runnable() {
//          @Override
//          public void run() {
//            webView.loadUrl("javascript:setVitalsData('" + respString + "')");
            SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("setvitals", spokenText);
//          }
//        });
        break;
    }
  }

  public void getVoiceToTextResponse(String url, String responsetext) throws JSONException {
    RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
    JSONObject jsonBody = new JSONObject();
    jsonBody.put("text", responsetext);
    final String requestBody = jsonBody.toString();
    Log.i("readdata2"," url="+url+ " data="+String.valueOf(requestBody));
    StringRequest stringRequest = new StringRequest(com.android.volley.Request.Method.POST, url, new com.android.volley.Response.Listener<String>() {
      @Override
      public void onResponse(String response) {
        try {
          JSONObject obj = new JSONObject(response);
          Log.d("readdata2", "box2=" + box2 + " res2=" + obj.getString("voice"));
          Log.d("readdata2", String.valueOf(box2.contentEquals("vitals")));
//                if(!obj.getString("voice").contentEquals("continue")){
          if (obj.getString("voice").contentEquals("vitals") ||
                  obj.getString("voice").contentEquals("vital") ||
                  obj.getString("voice").contentEquals("metals") ||
                  obj.getString("voice").contentEquals("metal") ||
                  obj.getString("voice").contentEquals("subjective") ||
                  obj.getString("voice").contentEquals("subject") ||
                  obj.getString("voice").contentEquals("objective") ||
                  obj.getString("voice").contentEquals("object") ||
                  obj.getString("voice").contentEquals("plan") ||
                  obj.getString("voice").contentEquals("plant") ||
                  obj.getString("voice").contentEquals("assess") ||
                  obj.getString("voice").contentEquals("assessment")) {
            if(
                    (
                            (obj.getString("voice").contentEquals("vitals") ||
                                    obj.getString("voice").contentEquals("vital") ||
                                    obj.getString("voice").contentEquals("metals") ||
                                    obj.getString("voice").contentEquals("metal")
                            )
                                    && box2.contentEquals("vitals")
                    )
                            ||
                            (
                                    (obj.getString("voice").contentEquals("assessment")||
                                            obj.getString("voice").contentEquals("assess")
                                    ) && box2.contentEquals("assm")
                            )
            )
            {
              Log.d("readdata2", "value4=" + box2 + "res4=" + obj.getString("voice"));
              setValue(box2, obj.getString("voice"));
            }else {
              Log.d("readdata2", "value=" + box2 + "res3=" + obj.getString("voice"));
              if (audio.getStreamVolume(AudioManager.STREAM_MUSIC) != audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC)) {
//                            audio.setStreamVolume(AudioManager.STREAM_MUSIC, 0,  AudioManager.FLAG_SHOW_UI);
                audio.setStreamVolume(AudioManager.STREAM_MUSIC, audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC), AudioManager.ADJUST_UNMUTE);
              }
              // audio.setStreamMute(AudioManager.STREAM_MUSIC, false);
              final String myres = obj.getString("voice");
//              webView.loadUrl("javascript:setTabData1('" + myres + "')");
              SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                      .emit("setTabData1", myres);
              Log.d("readdata2", "results2=" + myres);
            }
          }
          else if (obj.getString("voice").contentEquals("stop arya")) {
            Log.d("readdata2", "value=" + box2 + "res3=" + obj.getString("voice"));
            // audio.setStreamMute(AudioManager.STREAM_MUSIC, true);
            audio.setStreamVolume(AudioManager.STREAM_MUSIC, 0, AudioManager.ADJUST_MUTE);
          }
          else {
            Log.d("readdata2", "value=" + box2 + "res3=" + obj.getString("voice"));
            if(obj.getString("voice").contentEquals("continue")){
              setValue(box2,voiceValue);
            }
            else{
              setValue(box2, obj.getString("voice"));
            }
          }
        }
        catch (Exception e){
          Log.i("readdata2","res2="+e);
        }
      }
    }, new com.android.volley.Response.ErrorListener() {
      @Override
      public void onErrorResponse(VolleyError error) {
        Log.e("readdata", error.toString());
      }
    }) {
      @Override
      public String getBodyContentType() {
        return "application/json; charset=utf-8";
      }
      @Override
      public byte[] getBody() throws AuthFailureError {
        try {
          return requestBody == null ? null : requestBody.getBytes("utf-8");
        } catch (UnsupportedEncodingException uee) {
          VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
          return null;
        }
      }
      @Override
      protected com.android.volley.Response<String> parseNetworkResponse(NetworkResponse response) {
        String responseString = "";
        if (response != null) {
          Log.i("readdata2","res3="+response.headers);
          responseString = String.valueOf(response.statusCode);
          // can get more details such as response.headers
        }
        return super.parseNetworkResponse(response);
        //  return Response.success(responseString, HttpHeaderParser.parseCacheHeaders(response));
      }
    };
    requestQueue.add(stringRequest);
  }


  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
    // @Override
    //   protected ReactRootView createRootView() {
    //    return new RNGestureHandlerEnabledRootView(MainActivity.this);
    //   }
    // }
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

}
