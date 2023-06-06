package com.healpha_doctor.Spirometer;

import android.os.Environment;
import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.healpha_doctor.SpiroReactModule;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Vector;

import cn.com.contec.jar.sp10w.DeviceCommand;
import cn.com.contec.jar.sp10w.DevicePackManager;

public class MtBuf {
	public double mPef;
	private static final String TAG = "MtBuf";
	public static Vector<Integer> m_buf = null;
	public boolean flag=false;
	private DevicePackManager m_DevicePackManager = new DevicePackManager();
	public MtBuf() {
		m_buf = new Vector<Integer>();
	}

	public synchronized int Count() {
		return m_buf.size();
	}


	public synchronized void write(byte[] buf, int count,
								   final OutputStream pOutputStream) throws Exception {

		int _receiveNum = m_DevicePackManager.arrangeMessage(buf, count);
		switch (_receiveNum){
			case 1:
				if(m_DevicePackManager.mDeviceDataJarsList.size() > 0){
					for (int i=0;i<m_DevicePackManager.mDeviceDataJarsList.size();i++){
//						Log.d(TAG,"We got data " +m_DevicePackManager.mDeviceDataJarsList
//								.get(m_DevicePackManager.mDeviceDataJarsList.size()-1)
//								.mParamInfo.mPEF * 60);
						double PEF = m_DevicePackManager.mDeviceDataJarsList.get(m_DevicePackManager.mDeviceDataJarsList.size()-1).mParamInfo.mPEF * 60;
						Log.d(TAG,"We got data " +PEF);
						mPef = PEF;
						SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
								.emit("getSpiroData", PEF);
						flag=true;
						break;
					}
				}
				pOutputStream.write(DeviceCommand.command_delData());
				break;
			case 2:
				Log.d(TAG,"No data :: returns case 2");
				break;
			case 3:
				pOutputStream.write(DeviceCommand.command_requestData());
				Log.d(TAG,"Set time successfully");

				break;
			case 4:
				Log.d(TAG,"Set time unsuccessfully");
				break;
			case 5:
				Log.d(TAG,"deletes data successfully");
				break;
			case 6:
				Log.d(TAG,"returns data unsuccessfully");
				break;
			case 7:
				Log.d(TAG,"set date successfully");
				pOutputStream.write(DeviceCommand.command_Time());
				break;
			case 8:
				Log.d(TAG,"set date unsuccessfully ");
				break;

		}
	}

	/**
	 * ?????????????????????
	 *
	 * @param pContent
	 */
	public void saveAsString(String pContent) {
		String PATH_BASE = Environment.getExternalStorageDirectory()
				.getAbsolutePath() + "/contec";
		File _file = new File(PATH_BASE);
		if (!_file.exists()) {
			_file.mkdirs();
		}
		try {
			OutputStreamWriter os = new OutputStreamWriter(
					new FileOutputStream(_file + "/Cmssxt_Data.txt", true));
			os.write(pContent);
			os.close();
		} catch (Exception e) {
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
