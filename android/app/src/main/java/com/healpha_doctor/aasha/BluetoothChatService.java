package com.healpha_doctor.aasha;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import com.healpha_doctor.MainActivity;


/**
 * Created by concent on 30/5/18.
 */

public class BluetoothChatService {

    private static final String TAG = "BluetoothChatService";
    private static final boolean D = true;

    // Name for the SDP record when creating server socket
    private static final String NAME = "BluetoothChat";

    // Unique UUID for this application
    private  final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");//00001101-0000-1000-8000-00805f9b34fb

    // Member fields
    private final BluetoothAdapter mAdapter;
   // private final Callback call;
    private AcceptThread mAcceptThread;
    private ConnectThread mConnectThread;
    private ConnectedThread mConnectedThread;

    private Handler handler = new Handler(Looper.getMainLooper());
    private Context mContext;
    public String getValue="";
    private int mState;

    // Constants that indicate the current connection state
    public static final int STATE_NONE = 0;       // we're doing nothing
    public static final int STATE_LISTEN = 1;     // now listening for incoming connections
    public static final int STATE_CONNECTING = 2; // now initiating an outgoing connection
    public static final int STATE_CONNECTED = 3;  // now connected to a remote device

//    /**
//     * Constructor. Prepares a new BluetoothChat session.
//     *
//     * @param context The UI Activity Context
//     // @param  A Handler to send messages back to the UI Activity
//     */
    public BluetoothChatService() {
        mAdapter = BluetoothAdapter.getDefaultAdapter();
      mState = STATE_NONE;
//        call = c;
//        mContext = context;
    }

    private synchronized void setState(int state) {
        if (D) Log.d(TAG, "setState() " + mState + " -> " + state);
        mState = state;

        // Give the new state to the Handler so the UI Activity can update
        //mHandler.obtainMessage(Constants.MESSAGE_STATE_CHANGE, state, -1).sendToTarget();
    }

    /**
     * Return the current connection state.
     */
    public synchronized int getState() {
        return mState;
    }

    /**
     * Start the chat service. Specifically start AcceptThread to begin a
     * session in listening (server) mode. Called by the Activity onResume()
     */
    public synchronized void start() {
        if (D) Log.d(TAG, "start");

        // Cancel any thread attempting to make a connection
        if (mConnectThread != null) {
            mConnectThread.cancel();
            mConnectThread = null;
        }

        // Cancel any thread currently running a connection
        if (mConnectedThread != null) {
            mConnectedThread.cancel();
            mConnectedThread = null;
        }

        // Start the thread to listen on a BluetoothServerSocket
               setState(STATE_LISTEN);
    }

    /**
     * Start the ConnectThread to initiate a connection to a remote device.
     * @param device  The BluetoothDevice to connect
     */
    public synchronized void connect(BluetoothDevice device) {
        if (D) Log.d(TAG, "connect to: " + device);

        // Cancel any thread attempting to make a connection
        if (mState == STATE_CONNECTING) {
            if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}
        }

        // Cancel any thread currently running a connection
        if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

        // Start the thread to connect with the given device
        mConnectThread = new ConnectThread(device);
        mConnectThread.start();
        setState(STATE_CONNECTING);
    }


    /**
     * This thread runs while listening for incoming connections. It behaves
     * like a server-side client. It runs until a connection is accepted
     * (or until cancelled).
     */
    private class AcceptThread extends Thread {
        // The local server socket
        private final BluetoothServerSocket mmServerSocket;

        public AcceptThread() {
            BluetoothServerSocket tmp = null;

            // Create a new listening server socket
            try {
                tmp = mAdapter.listenUsingRfcommWithServiceRecord(NAME, MY_UUID);
            } catch (IOException e) {
                Log.e(TAG, "listen() failed", e);
            }
            mmServerSocket = tmp;
        }

        public void run() {
            if (D) Log.d(TAG, "BEGIN mAcceptThread" + this);
            setName("AcceptThread");
            BluetoothSocket socket = null;

            // Listen to the server socket if we're not connected
            while (mState != STATE_CONNECTED) {
                try {
                    // This is a blocking call and will only return on a
                    // successful connection or an exception
                    socket = mmServerSocket.accept();
                } catch (IOException e) {
                    Log.e(TAG, "accept() failed", e);
                    break;
                }

                // If a connection was accepted
                if (socket != null) {
                    synchronized (BluetoothChatService.this) {
                        switch (mState) {
                            case STATE_LISTEN:
                            case STATE_CONNECTING:
                                // Situation normal. Start the connected thread.
                                connected(socket, socket.getRemoteDevice());
                                break;
                            case STATE_NONE:
                            case STATE_CONNECTED:
                                // Either not ready or already connected. Terminate new socket.
                                try {
                                    socket.close();
                                } catch (IOException e) {
                                    Log.e(TAG, "Could not close unwanted socket", e);
                                }
                                break;
                        }
                    }
                }
            }
            if (D) Log.i(TAG, "END mAcceptThread");
        }

        public void cancel() {
            if (D) Log.d(TAG, "cancel " + this);
            try {
                mmServerSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of server failed", e);
            }
        }
    }

    /**
     * Start the ConnectedThread to begin managing a Bluetooth connection
     * @param socket  The BluetoothSocket on which the connection was made
     * @param device  The BluetoothDevice that has been connected
     */
    public synchronized void connected(BluetoothSocket socket, BluetoothDevice device) {
        if (D) Log.d(TAG, "connected");

        // Cancel the thread that completed the connection
        if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}

        // Cancel any thread currently running a connection
       if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

        // Cancel the accept thread because we only want to connect to one device
        if (mAcceptThread != null) {mAcceptThread.cancel(); mAcceptThread = null;}

        // Start the thread to manage the connection and perform transmissions
        mConnectedThread = new ConnectedThread(socket);
        mConnectedThread.start();
            if(MainActivity.aasha!=null) {
                switch(MainActivity.aasha){
                    case "s": mConnectedThread.write("s");
                        break;
                    case "p": mConnectedThread.write("p");
                        break;
                    case "m": mConnectedThread.write("m");
                        break;
                    case "b":mConnectedThread.write("b");
                    break;
                    default:
                }
            }

//        if(MainActivity.aasha_bp!=null) {
//            mConnectedThread.write(MainActivity.aasha_bp);
//            MainActivity.aasha_bp=null;
//        }
//        else if(MainActivity.aasha_pulse!=null) {
//            mConnectedThread.write(MainActivity.aasha_pulse);
//            MainActivity.aasha_pulse=null;
//        }
//       else if(MainActivity.aasha_temp!=null) {
//            mConnectedThread.write(MainActivity.aasha_temp);
//            MainActivity.aasha_temp=null;
//        }
        // Send the name of the connected device back to the UI Activity

        setState(STATE_CONNECTED);
    }

    /**
     * Indicate that the connection attempt failed and notify the UI Activity.
     */
    private void connectionFailed() {
        setState(STATE_LISTEN);

        // Send a failure message back to the Activity

    }

    /**
     * Indicate that the connection was lost and notify the UI Activity.
     */
    private void connectionLost() {
        setState(STATE_LISTEN);

        // Send a failure message back to the Activity


    }

    /**
     * This thread runs while attempting to make an outgoing connection
     * with a device. It runs straight through; the connection either
     * succeeds or fails.
     */
    private class ConnectThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final BluetoothDevice mmDevice;

        public ConnectThread(BluetoothDevice device) {
            mmDevice = device;
            BluetoothSocket tmp = null;

            // Get a BluetoothSocket for a connection with the
            // given BluetoothDevice
            try {
                tmp = device.createRfcommSocketToServiceRecord(MY_UUID);
                
                /*   tmp = (BluetoothSocket)device.getClass().getMethod("createRfcommSocket", new Class[] {int.class}).invoke(device,1);
                     tmp.connect();
                */

            } catch (Exception e) {
                Log.e(TAG, "create() failed", e);
            }
            mmSocket = tmp;
        }

        public void run() {
            Log.i(TAG, "BEGIN mConnectThread");
            setName("ConnectThread");
//            handler.post(new Runnable() {
//                @Override
//                public void run() {
//                    PrintLogger.showToast(mContext,"Connecting to device");
//                }
//            });
            Log.d("readdata","Connecting to device");

            // Always cancel discovery because it will slow down a connection
            mAdapter.cancelDiscovery();

            // Make a connection to the BluetoothSocket
            try {
                // This is a blocking call and will only return on a
                // successful connection or an exception
                mmSocket.connect();
            } catch (IOException e) {
                connectionFailed();
                // Close the socket
                try {
                    mmSocket.close();
                } catch (IOException e2) {
                    Log.e(TAG, "unable to close() socket during connection failure", e2);
                }
                // Start the service over to restart listening mode
                BluetoothChatService.this.start();
                return;
            }

            // Reset the ConnectThread because we're done
            synchronized (BluetoothChatService.this) {
                mConnectThread = null;
            }

            // Start the connected thread
            connected(mmSocket, mmDevice);
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of connect socket failed", e);
            }
        }


    }        /**
         * This thread runs during a connection with a remote device.
         * It handles all incoming and outgoing transmissions.
         */
        private class ConnectedThread extends Thread {
            private final BluetoothSocket mmSocket;
            private final InputStream mmInStream;
            private final OutputStream mmOutStream;

            public ConnectedThread(BluetoothSocket socket) {
                Log.d(TAG, "create ConnectedThread");
                mmSocket = socket;
                InputStream tmpIn = null;
                OutputStream tmpOut = null;

                // Get the BluetoothSocket input and output streams
                try {
                    tmpIn = socket.getInputStream();
                    tmpOut = socket.getOutputStream();
                    //tmpOut.write(DeviceCommand.commandConfirmEquipment());
                } catch (IOException e) {
                    Log.e(TAG, "temp sockets not created", e);
                }
                mmInStream = tmpIn;
                mmOutStream = tmpOut;
            }

            public void run() {
                Log.i(TAG, "BEGIN mConnectedThread");
                byte[] buffer = new byte[1024];
                int bytes;

                // Keep listening to the InputStream while connected
                while (true) {
                    try {
                        // Read from the InputStream
                        bytes = mmInStream.read(buffer);
                        String readMessage = new String(buffer, 0, bytes);

                       // Log.d("readdata", readMessage);
//                        if(readMessage.contains("T_")) {
//                            MainActivity.getInstance().getTemperature(readMessage);
//                        }
//                        else if(readMessage.contains("O_")){
//                            MainActivity.getInstance().getPulse(readMessage);
//                        }
//                        else if(readMessage.contains("B_")){
//                            MainActivity.getInstance().getBPData(readMessage);
//                        }
                        if(!MainActivity.aasha.contentEquals("s")& !MainActivity.aasha.contentEquals("e") && !MainActivity.aasha.contentEquals("x")) {

                            Log.d("readdata", "problem");
                            Log.d("readdata", readMessage);
                        }
                        else  if(MainActivity.aasha.contentEquals("s") && !MainActivity.aasha.contentEquals("x")){
                            File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "Steth");
                            if (!mediaStorageDir.exists()) {
                                if (!mediaStorageDir.mkdirs()) {
                                    Log.d("readdata", "failed to create directory");
                                }
                            } else {

                                try {
                                    // socketId = args.getInt(0);
                                    Log.d("readdata", "Get Steth Data...");
                                    //inputStream = ((BluetoothSocket) this.m_bluetoothSockets.get(socketId)).getInputStream();
                                    Date startTime = Calendar.getInstance().getTime();
                                    String recvdString = "";
                                    int i = 0;
                                    int endofFileDetect = 0;
                                    byte[] firstChar = new byte[1];
                                    int writetoFile = 0;
                                    boolean startdetect = false;
                                    boolean j = true;
                                    byte[] buf = new byte[10000];
                                    firstChar[0] = (byte) 82;
                                    File stethPath = Environment.getExternalStorageDirectory();
                                    //File r0 = new File(stethPath, "/steth/steth1.wav");
                                    File r0 = new File(stethPath, "/steth/steth4_filter.wav");
                                    FileOutputStream r1 = new FileOutputStream(r0);
                                    MainFilter audio_filter = new MainFilter();
                                    while (j) {

                                        if (Calendar.getInstance().getTime().getTime() - startTime.getTime() >= 690000) {
                                            Log.d("readdata", "called1");
                                            j = false;
                                            Log.d("readdata", "Steth Read TimeOut");
                                            r1.flush();
                                            r1.close();
                                            audio_filter.filter(stethPath + "/steth/steth4", 2);
                                            Log.d("readdata", "File: " + stethPath + "/steth/steth4.wav");
                                            recvdString = r0.getPath();
                                            Log.d("readdata", "File: " + recvdString);
                                        } else if (mmInStream.available() > 0) {
                                            Log.d("readdata", "called2");
                                            int k = mmInStream.read(buf, 0, mmInStream.available());

                                            if (writetoFile == 0) {
                                                if ((buf[0] & 255) == 82) {
                                                    if (k <= 1) {
                                                        startdetect = true;
                                                    } else if ((buf[1] & 255) == 73) {
                                                        writetoFile = 1;
                                                        i = 0;
                                                    }
                                                } else if ((buf[0] & 255) == 73 && startdetect) {
                                                    r1.write(firstChar, 0, 1);
                                                    writetoFile = 1;
                                                    i = 0;
                                                } else {
                                                    startdetect = false;
                                                }
                                            }
                                            if (writetoFile == 1) {
                                                Log.d("readdata", "called3");
                                                i += k;
                                                r1.write(buf, 0, k);
                                                if (k > 1 && (buf[k - 2] & 255) == 170 && (buf[k - 1] & 255) == 187) {
                                                    endofFileDetect = 2;
                                                } else if (k == 1 && (buf[0] & 255) == 170) {
                                                    endofFileDetect = 1;
                                                } else if ((buf[0] & 255) == 187 && endofFileDetect == 1) {
                                                    endofFileDetect++;
                                                } else {
                                                    endofFileDetect = 0;
                                                }
                                                if (endofFileDetect == 2) {

                                                    Log.d("readdata", "File Write Complete");
                                                    r1.flush();
                                                    r1.close();
                                                    j = false;
                                                    audio_filter.filter(stethPath + "/steth/steth4", 2);
                                                    Log.d("readdata", "File: " + stethPath + "/steth/steth4");
                                                    recvdString = r0.getPath();
                                                }
                                            }
                                        }
                                    }
                                    //    this.pluginResult = new PluginResult(Status.OK, recvdString);
                                } catch (Exception e3222) {

                                }

                            }
                        }
                        else{
                            try {
                                // socketId = args.getInt(0);
                                Date startTime = Calendar.getInstance().getTime();
                                //   inputStream = ((BluetoothSocket) this.m_bluetoothSockets.get(socketId)).getInputStream();
                                byte[] buf = new byte[75000];
                                String recvdString = "";
                                int i = 0;
                                int k = 0;
                                boolean j = true;
                                Log.d("readdata", "StartTime: " + new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(startTime));
                                boolean timeOut = false;
                                while (j) {
                                    if (Calendar.getInstance().getTime().getTime() - startTime.getTime() <20000) {
                                        if (mmInStream.available() > 0) {
                                            i += mmInStream.read(buf, k, mmInStream.available());
                                            k = i;
                                            Log.d("readdata", "i=" + i);
                                        }
                                        // if (i > 51180) {
                                        if (i > 51180) {
                                            // && buf[0] == (byte) 75) || (i > 63975 && buf[0] == (byte) 87)
                                            j = false;
                                        }
                                    } else {
                                        j = false;
                                        timeOut = true;
                                        Log.d("readdata", "ECG Read TimeOut");
                                    }
                                }
                                if (timeOut) {
                                    recvdString = "Aborted";
                                } else {
                                    File r0 = new File(Environment.getExternalStorageDirectory(), "/steth/ecg.txt");
                                    FileWriter fileWriter = new FileWriter(r0, false);
                                    //r0 = new String("");
                                    int byteCnt = (i - 1) / 3;
                                    long[] buf2 = new long[byteCnt];
                                    for (k = 0; k < byteCnt; k++) {
                                        int index = k * 3;
                                        buf2[k] = ((long) ((((buf[index + 1] & 255) << 16) | ((buf[index + 2] & 255) << 8)) | (buf[index + 3] & 255))) & 4294967295L;
                                        fileWriter.write(buf2[k] + ",");
                                    }
                                    fileWriter.flush();
                                    fileWriter.close();
                                    byteCnt = i;
                                    recvdString = r0.getPath();

                                }
                                Log.d("readdata",recvdString);
                                //this.pluginResult = new PluginResult(Status.OK, recvdString);
                            } catch (Exception e322) {
                                Log.e("readdata", e322.toString() + " / " + e322.getMessage());
                                // this.pluginResult = new PluginResult(Status.JSON_EXCEPTION, e322.getMessage());
                            }
                        }

//                        if(readMessage.contains("T_")||readMessage.contains("O_")||readMessage.contains("B_")||readMessage.contains("G_")) {
//
//                            mConnectedThread.interrupt();
//                            mConnectThread.interrupt();
//
//                            BluetoothChatService.this.start();
//                        }
                        // Send the obtained bytes to the UI Activity
                    } catch (Exception e) {
                        Log.e(TAG, "disconnected", e);
//                        handler.post(new Runnable() {
//                            @Override
//                            public void run() {
//                                PrintLogger.showToast(mContext,"aasha disconnected");
//                            }
//                        });
                        if(mmInStream!=null){
                            try{
                                mmInStream.close();
                            }catch (IOException exc){
                                e.printStackTrace();
                            }
                        }
                        connectionLost();
                        break;
                    }
                }
            }

//            /**
//             * Write to the connected OutStream.
//             * @param buffer  The bytes to write
//             */
//            public void write(byte[] buffer) {
//                try {
//                    mmOutStream.write(buffer);
//
//                    // Share the sent message back to the UI Activity
//
//                } catch (IOException e) {
//                    Log.e(TAG, "Exception during write", e);
//                }
//            }
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
                    mmSocket.close();
                } catch (IOException e) {
                    Log.e(TAG, "close() of connect socket failed", e);
                }
            }
        }

//    public void write(byte[] out) {
//        // Create temporary object
//        ConnectedThread r;
//        // Synchronize a copy of the ConnectedThread
//        synchronized (this) {
//            if (mState != STATE_CONNECTED) return;
//            r = mConnectedThread;
//        }
//        // Perform the write unsynchronized
//        r.write(out);
//    }
}



