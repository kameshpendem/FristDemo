package com.healpha_doctor.ear_temperature;

import android.content.Context;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.healpha_doctor.SpiroReactModule;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Vector;


import cn.com.contec.jar.eartemperture.DeviceCommand;
import cn.com.contec.jar.eartemperture.DevicePackManager;

public class MtBuf {
    private static final String TAG = "com.testBlueTooth.Mtbuf";
	public static Vector<Integer> m_buf = null;
	public double mTempData ;
	private Context mContext = null;
    public boolean flag=false;
	Handler handler = new Handler(Looper.getMainLooper());
	public int caller_type ;

	public MtBuf(Context context) {
		m_buf = new Vector<Integer>();
		mContext = context;
	}

	public synchronized int Count() {
		return m_buf.size();
	}

	DevicePackManager mDevicePackManager = new DevicePackManager();

	public synchronized void write(byte[] buf, int count,
			OutputStream pOutputStream) throws Exception {
		Log.i("Test","temp write started");
		int state = mDevicePackManager.arrangeMessage(buf, count);
		Log.i("Test","temp write called");
		switch (state) {
		case 1:// 接收成功
			getData();
			pOutputStream.write(DeviceCommand.command_delData());
			break;

		case 2:// Data receive failed ...
			getData(); // If data receive failed, pull data again..
			pOutputStream.write(DeviceCommand.command_delData());
			break;

		case 3:// set time success
			pOutputStream.write(DeviceCommand.command_queryDataNum());
			break;
		case 4:// set time failed
			break;
		case 5://del data success
			Log.e(TAG, "Successfully deleted..."); //successfully deleted
			break;
		case 6://del data failed
			break;
		case 7:

			break;
		case 8:// 进行设备校

			pOutputStream.write(DeviceCommand.command_VerifyTime());
			break;
		case 9:// 设备有数据 发送请求所有数据的命令
			pOutputStream.write(DeviceCommand.command_requestAllData());
			break;
		}

	}

	private void getData(){
		if (mDevicePackManager.m_DeviceDatas.size() > 0) {
			int _saveNum = 0;
			int datalength = mDevicePackManager.m_DeviceDatas.size();
			Log.d(TAG,"Data length ::: "+datalength);
			for (int i = 0; i < datalength; i++) {
				Log.d(TAG,"deviceDatas:----- "+i);
				Log.d(TAG,"Device data "+mDevicePackManager.m_DeviceDatas.toString());
				Log.d(TAG,"device data''''' "+mDevicePackManager.m_DeviceDatas.get(datalength-1));
				break;
			}

			mTempData = mDevicePackManager.m_DeviceDatas.get(datalength-1).m_data;

			SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
					.emit("getTempData", mDevicePackManager.m_DeviceDatas.get(datalength-1).m_data);
			//set flag variable
            flag=true;

			if(this.caller_type==1) {
				try {

				} catch (NullPointerException e) {
					e.printStackTrace();
				}
			}

		}
	}

	String PATH_BASE = Environment.getExternalStorageDirectory()
			.getAbsolutePath() + "/Healpha";

	/**
	 * 接收到的数据存数到文件中
	 * 
	 * @param pContent
	 */
	public void saveAsString(String pContent) {
		File _file = new File(PATH_BASE);
		if (!_file.exists()) {
			_file.mkdirs();
			Log.d(TAG,"dir created!");
		}
		try {
			// OutputStreamWriter os=new FileOutputStream(_file+"trend.txt");
			OutputStreamWriter os = new OutputStreamWriter(
					new FileOutputStream(_file + "/EW_Data.txt"));
			os.write(pContent);
			os.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public synchronized int read(int[] buf) {
		int len = 0;
		if (buf.length <= m_buf.size()) {
			for (int i = 0; i < buf.length; i++) {
				buf[i] = (int) (m_buf.get(i));
			}
			len = buf.length;
			for (int j = 0; j < len; j++) {
				m_buf.remove(0);
			}

		} else if (buf.length > m_buf.size()) {
			for (int i = 0; i < m_buf.size(); i++) {
				buf[i] = m_buf.get(i);
			}
			len = m_buf.size();
			for (int j = 0; j < len; j++) {
				m_buf.remove(0);
			}

		}
		return len;
	}


}
