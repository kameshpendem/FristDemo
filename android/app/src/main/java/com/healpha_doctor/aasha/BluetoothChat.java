package com.healpha_doctor.aasha;

import androidx.appcompat.app.AppCompatActivity;
//import android.support.v4.app.ActivityCompat;

import android.os.Bundle;

import android.os.Environment;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothAdapter;
import java.util.UUID;
import java.io.IOException;
import android.widget.Toast;
import java.io.InputStream;
import java.io.OutputStream;
import android.os.Handler;
import android.util.Log;
import android.content.Intent;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Date;
import com.healpha_doctor.aasha.MainFilter;
import android.content.Context;

class BluetoothChat  {

   public File f1;
   public File stethPath;
   private ConnectThread mConnectThread;
   private ConnectedThread mConnectedThread;
   public static String getvalue;
   private BluetoothAdapter btAdapter = null;

   private boolean D=true;
//    public void BluetoothChatService(){
//
//    }
 //  @Override
 //  protected void onCreate(Bundle savedInstanceState) {
      // super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_aasha);
//        b1=(Button) findViewById(R.id.button);
//        e1=(EditText) findViewById(R.id.editText);
//        t1=(TextView) findViewById(R.id.textView);
//        Intent intent = getIntent();
//        final String address = intent.getStringExtra("deviceid");
    //   Log.d("readdata2",address);
//        b1.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//               // String st=e1.getText().toString();
//                //getvalue=st;
//               // mConnectThread=new ConnectThread(address,st);
//                mConnectThread.start();
//
//                //   t1.setText(st);
//            }
//        });
//    }
 public synchronized void start() {
     if (D) Log.d("readdata", "start");

     // Cancel any thread attempting to make a connection
     if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}

    //  Cancel any thread currently running a connection
     if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

     // Start the thread to listen on a BluetoothServerSocket

     //setState(STATE_LISTEN);
 }


   private class ConnectThread extends Thread{

       private BluetoothSocket btSocket = null;
       private  final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
       private String st=null;
       public ConnectThread(String address,String str) {
           st=str;
           Log.d("readdata3",st);
           btAdapter = BluetoothAdapter.getDefaultAdapter();
           BluetoothDevice device = btAdapter.getRemoteDevice(address);
           try {
               btSocket = device.createRfcommSocketToServiceRecord(MY_UUID);
           } catch (IOException e) {
               //Toast.makeText(getBaseContext(), "Socket creation failed", Toast.LENGTH_LONG).show();
           }
       }

       public void run() {
           Log.d("readdata4",st);
           if(btSocket==null)
               Log.d("readdata2","empty");
           try
           {
               btSocket.connect();
           } catch (IOException e) {
               try
               {
                   btSocket.close();
               } catch (IOException e2)
               {
                   //insert code to deal with this
               }
           }
           Log.d("readdata2","cONNECTED");
           mConnectedThread = new ConnectedThread(btSocket);
           mConnectedThread.start();
           mConnectedThread.write(st);
       }
       public void cancel() {
           try {
               btSocket.close();
           } catch (IOException e) {
               Log.e("readdata", "close() of connect socket failed", e);
           }
       }
   }
   private class ConnectedThread extends Thread {
       private BluetoothSocket btSocket = null;
       private final InputStream mmInStream;
       private final OutputStream mmOutStream;

       //creation of the connect thread
       public ConnectedThread(BluetoothSocket socket) {
           InputStream tmpIn = null;
           OutputStream tmpOut = null;

           try {
               //Create I/O streams for connection
               tmpIn = socket.getInputStream();
               tmpOut = socket.getOutputStream();
           } catch (IOException e) { }

           mmInStream = tmpIn;
           mmOutStream = tmpOut;
       }

       public void run() {
           byte[] buffer = new byte[256];
           int bytes;
//        Log.d("readdatavalues", aashaActivity.getvalue);
//        // Keep looping to listen for received messages
//        if(!aashaActivity.getvalue.contentEquals("s")) {
//            //String readMessage = new String(buffer, 0, bytes);
//            Log.d("readdata", "problem");
//              //Log.d("readdata", readMessage);
//        }
//        else {
//            Log.d("readdata", "no problem");
//        }

           while (true) {
               try {
                   bytes = mmInStream.read(buffer);
                   //read bytes from input buffer
//                Log.d("readdatavalue ",aashaActivity.getvalue);
//                if(!aashaActivity.getvalue.contentEquals("s") && !aashaActivity.getvalue.contentEquals("x")) {
                   String readMessage = new String(buffer, 0, bytes);
                  // Log.d("readdata", "problem");
                   Log.d("readdata", readMessage);
//                }
//                else {
//                    File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "Steth");
//                    if (!mediaStorageDir.exists()) {
//                        if (!mediaStorageDir.mkdirs()) {
//                            Log.d("readdata", "failed to create directory");
//                        }
//                    } else {
//
//                        try {
//                            // socketId = args.getInt(0);
//                            Log.d("BluetoothPlugin", "Get Steth Data...");
//                            //inputStream = ((BluetoothSocket) this.m_bluetoothSockets.get(socketId)).getInputStream();
//                            Date startTime = Calendar.getInstance().getTime();
//                            String recvdString = "";
//                            int i = 0;
//                            int endofFileDetect = 0;
//                            byte[] firstChar = new byte[1];
//                            int writetoFile = 0;
//                            boolean startdetect = false;
//                            boolean j = true;
//                            byte[] buf = new byte[10000];
//                            firstChar[0] = (byte) 82;
//                            File stethPath = Environment.getExternalStorageDirectory();
//                            //File r0 = new File(stethPath, "/steth/steth1.wav");
//                            File r0 = new File(stethPath, "/steth/steth4_filter.wav");
//                            FileOutputStream r1 = new FileOutputStream(r0);
//                            MainFilter audio_filter = new MainFilter();
//                            while (j) {
//
//                                if (Calendar.getInstance().getTime().getTime() - startTime.getTime() >= 690000) {
//                                    Log.d("readdata", "called1");
//                                    j = false;
//                                    Log.d("readdata", "Steth Read TimeOut");
//                                    r1.flush();
//                                    r1.close();
//                                    audio_filter.filter(stethPath + "/steth/steth4", 2);
//                                    Log.d("readdata", "File: " + stethPath + "/steth/steth4.wav");
//                                    recvdString = r0.getPath();
//                                    Log.d("readdata", "File: " + recvdString);
//                                } else if (mmInStream.available() > 0) {
//                                    Log.d("readdata", "called2");
//                                    int k = mmInStream.read(buf, 0, mmInStream.available());
//
//                                    if (writetoFile == 0) {
//                                        if ((buf[0] & 255) == 82) {
//                                            if (k <= 1) {
//                                                startdetect = true;
//                                            } else if ((buf[1] & 255) == 73) {
//                                                writetoFile = 1;
//                                                i = 0;
//                                            }
//                                        } else if ((buf[0] & 255) == 73 && startdetect) {
//                                            r1.write(firstChar, 0, 1);
//                                            writetoFile = 1;
//                                            i = 0;
//                                        } else {
//                                            startdetect = false;
//                                        }
//                                    }
//                                    if (writetoFile == 1) {
//                                        Log.d("readdata", "called3");
//                                        i += k;
//                                        r1.write(buf, 0, k);
//                                        if (k > 1 && (buf[k - 2] & 255) == 170 && (buf[k - 1] & 255) == 187) {
//                                            endofFileDetect = 2;
//                                        } else if (k == 1 && (buf[0] & 255) == 170) {
//                                            endofFileDetect = 1;
//                                        } else if ((buf[0] & 255) == 187 && endofFileDetect == 1) {
//                                            endofFileDetect++;
//                                        } else {
//                                            endofFileDetect = 0;
//                                        }
//                                        if (endofFileDetect == 2) {
//
//                                            Log.d("readdata", "File Write Complete");
//                                            r1.flush();
//                                            r1.close();
//                                            j = false;
//                                            audio_filter.filter(stethPath + "/steth/steth4", 2);
//                                            Log.d("readdata", "File: " + stethPath + "/steth/steth4");
//                                            recvdString = r0.getPath();
//                                        }
//                                    }
//                                }
//                            }
//                            //    this.pluginResult = new PluginResult(Status.OK, recvdString);
//                        } catch (Exception e3222) {
//
//                        }
//
//                    }
                   //   }

                   // Send the obtained bytes to the UI Activity via handler
                   //  bluetoothIn.obtainMessage(handlerState, bytes, -1, readMessage).sendToTarget();
               } catch (IOException e) {
                   break;
               }
           }
       }

       //write method
       public void write(String input) {
           Log.d("readdata","write data");
           byte[] msgBuffer = input.getBytes();
           //   byte[] msgBuffer = input.getBytes("UTF-8");//converts entered String into bytes
           try {
               for(int i=0;i<msgBuffer.length;i++){
                   Log.d("readdata",String.valueOf(msgBuffer[i]));
               }
               if(mmOutStream==null){
                   Log.d("readdata","writing222 data");
               }
               //   OutputStream outputStream = ((BluetoothSocket) this.btSocket.get(socketId)).getOutputStream();
               mmOutStream.write(msgBuffer);
               mmOutStream.flush();


               Log.d("readdata","writing data");//write bytes over BT connection via outstream
           } catch (IOException e) {
               Log.d("readdata","stopped writing data");
               //if you cannot write, close the application
               //Toast.makeText(getBaseContext(), "Connection Failure", Toast.LENGTH_LONG).show();
               //finish();
           }
       }
       public void cancel() {
           try {
               btSocket.close();
           } catch (IOException e) {
               Log.e("readdata", "close() of connect socket failed", e);
           }
       }
   }

}

