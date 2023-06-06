package com.healpha_doctor;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import okhttp3.MediaType;

public class SpiroReactModule extends ReactContextBaseJavaModule {
    private Context mContext;
    private static final String TYPE_PDF = MediaType.parse("application/pdf").toString();
    private static final String PDF_CACHE_DIR = "/Download";
   private static ReactApplicationContext mReactContext;
   public SpiroReactModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native		        super(reactContext); //required by React Native
        this.mReactContext=reactContext;
    }


public static ReactApplicationContext getReactAppContext(){
        return mReactContext;
}
    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "SpiroReact";
    }
    

    @ReactMethod
    public void sayHi(Callback errorCallback, Callback successCallback) {
        try {
            System.out.println("Greetings from Java");
            successCallback.invoke("Callback : Greetings from Java");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public String  startSpiro(Callback errorCallback, Callback successCallback) {
        double p=0.0;
        try {
    p=MainActivity.getInstance().scanSpiro();
    Log.i("Test output=",Double.toString(p));
            successCallback.invoke(p);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        return Double.toString(p);
    }

    @ReactMethod
    public void speechToTextData(String text) {
        Log.i("Test output=","speech to text called");
        String p="";
        try {
            MainActivity.getInstance().speechToText(text);
            Log.i("Test output=",p);
        } catch (IllegalViewOperationException e) {

        }
    }
    @ReactMethod
    public void getVoiceValue(String text) {
        Log.i("Test output=","speech to text called");
        String p="";
        try {
            MainActivity.getInstance().getVoiceValue(text);
            Log.i("Test output=",p);
        } catch (IllegalViewOperationException e) {

        }
    }
    @ReactMethod
    public void getTabNameDetails(String text) {
        Log.i("Test output=","speech to text called");
        String p="";
        try {
            MainActivity.getInstance().getTabNameDetails(text);
            Log.i("Test output=",p);
        } catch (IllegalViewOperationException e) {

        }
    }
    @ReactMethod
    public void startDoctorDashboardListening() {
        Log.i("Test output=","speech to text called");
        String p="";
        try {
            MainActivity.getInstance().startDoctorDashboardListening();
            Log.i("Test output=",p);
        } catch (IllegalViewOperationException e) {

        }
    }
    @ReactMethod
    public void stopDoctorDashboardListening() {
        Log.i("Test output=","speech to text called");
        String p="";
        try {
            MainActivity.getInstance().stopDoctorDashboardListening();
            Log.i("Test output=",p);
        } catch (IllegalViewOperationException e) {

        }
    }
    @ReactMethod
    public String  startBloodGlucose(Callback errorCallback, Callback successCallback) {
        double p=0.0;
        try {
            p=MainActivity.getInstance().scanbg();
            Log.i("Test output=",Double.toString(p));
            successCallback.invoke(p);

        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        return Double.toString(p);
    }

    @ReactMethod
    public void scanayuble() {
        Log.i("Test output=","scanning ayu ble");
//        try {
//            MainActivity.getInstance().scanayuble();
//            Log.i("Test output=","done");
//        } catch (IllegalViewOperationException e) {
//            Log.i("Test output=","scanning ayu ble");
//        }
    }
    @ReactMethod
    public String startayuble() {
        Log.i("Test output=","scanning ayu ble");
        String ayupath="";
//        try {
//            ayupath=MainActivity.getInstance().ayublestart();
//            Log.i("Test output=","done");
//        } catch (IllegalViewOperationException e) {
//            Log.i("Test output=","scanning ayu ble");
//        }
//        Log.i("Test output","ayupath"+ayupath);
        return ayupath;
    }
    @ReactMethod
    public void stopayuble() {
        Log.i("Test1 output=","stop ayu ble");
//        try {
//            MainActivity.getInstance().stopayuble();
//            Log.i("Test1 output=","stop done");
//        } catch (IllegalViewOperationException e) {
//            Log.i("Test1 output=","stop ayu ble1");
//        }
    }
    @ReactMethod
    public String  startUrineAnalyzer(Callback errorCallback, Callback successCallback) {
        String p="";
        try {
            p=MainActivity.getInstance().scanbc();
            Log.i("Test output=",p);
            successCallback.invoke(p);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        return p;
    }
    @ReactMethod
    public void  startBp(Callback errorCallback, Callback successCallback) {
        String p="";
        try {
           p=MainActivity.getInstance().scanbp();
            Log.i("Test output=",p);
            successCallback.invoke(p);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        //return p;
    }
    @ReactMethod
    public String  startSpo2(Callback errorCallback, Callback successCallback) {
        String p="";
        try {
            p=MainActivity.getInstance().scanSpo2();
            Log.i("Test output=",p);
            successCallback.invoke(p);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        return p;
    }
    @ReactMethod
    public String  startTemp(Callback errorCallback, Callback successCallback) {
        double p=0.0;
        try {
            p=MainActivity.getInstance().scanTemp();
            Log.i("Test output=",Double.toString(p));
            successCallback.invoke(p);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
        return Double.toString(p);
    }
    @ReactMethod
    public void TurnBT(Callback errorCallback, Callback successCallback) {
        try {
            MainActivity.getInstance().turnOnBT();
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }



    @ReactMethod
    public void share(String base64pdf, String filename, Promise promise) {
        try {
           // cleanSharedFiles();
            File pdfFile = writeFile(base64pdf, filename);
            shareFile(pdfFile);
            promise.resolve(true);
        } catch (IOException e) {
            promise.reject(e);
        }
    }

    private void cleanSharedFiles() {
        File directoryPath = getDirectoryPath();
        if (directoryPath.isDirectory()) {
            for (String file : directoryPath.list()) {
                new File(directoryPath, file).delete();
            }
        }
    }

    private File writeFile(String base64pdf, String filename) throws IOException {
        File directoryPath = getDirectoryPath();
        directoryPath.mkdir();
        File newFilePath = new File(directoryPath.getPath(), filename);

        byte[] pdfAsBytes = Base64.decode(base64pdf, Base64.DEFAULT);

        try (FileOutputStream os = new FileOutputStream(newFilePath, false)) {
            os.write(pdfAsBytes);
            os.flush();
        }

        return newFilePath;
    }

    private void shareFile(File file)
    {
        Uri outputFileUri = FileProvider.getUriForFile(getReactAppContext(), "com.healpha_doctor.provider", file);
        Intent intentShareFile = new Intent(Intent.ACTION_SEND);
        intentShareFile.setType(TYPE_PDF);
         intentShareFile.putExtra(Intent.EXTRA_STREAM, outputFileUri);
        intentShareFile.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_NEW_TASK);
        intentShareFile.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        Log.d("Test","got p="+getReactAppContext());
        Intent new_intent = Intent.createChooser(intentShareFile, "");
        new_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 
        getReactAppContext().startActivity(new_intent);
    }



    private File getDirectoryPath() {
        return new File(Environment.getExternalStorageDirectory(),PDF_CACHE_DIR);
    }
}