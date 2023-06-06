package com.healpha_doctor.blood_pressure;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.contec.jar.contec08a.DeviceCommand;
import com.contec.jar.contec08a.DevicePackManager;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.healpha_doctor.SpiroReactModule;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Vector;


import org.greenrobot.eventbus.EventBus;


public class MtBuf {
	private static final String TAG = "com.testBlueTooth.Mtbuf";
	public static Vector<Integer> m_buf = null;
	private Context mContext;
	public static final int e_pack_pressure_back = 0x46;
	private Handler handler = new Handler(Looper.getMainLooper());
	public int caller_type;
    public int highbp=0;
    public int lowbp=0;
    public boolean flag=false;

	public MtBuf(Context context) {
		m_buf = new Vector<Integer>();
		mContext = context;
	}

	public synchronized int Count() {
		return m_buf.size();
	}

	DevicePackManager mPackManager = new DevicePackManager();
	public static final int e_pack_hand_back = 0x48;
	public static final int e_pack_oxygen_back = 0x47;
	private int mType = 0;
	private int mHiPressure,mLowPressure;
	public synchronized void write(byte[] buf, int count,
								   OutputStream pOutputStream) throws Exception {

		int state = mPackManager.arrangeMessage(buf, count, mType);
		Log.e("=============", "数据类型"+mType); //type of data
		int x = DevicePackManager.Flag_User;
		switch (state) {
			case e_pack_hand_back:
				Log.i(TAG,"Successfully executed handshake");
				switch (mType) {
					case 9:
						mType = 5;
						Log.i(TAG,"Trying to delete data because mtype is 5");
						pOutputStream.write(DeviceCommand.DELETE_BP());
						break;
					case 0:
						mType = 3;
						Log.i(TAG,"Trying to correct time notice because mtype is 3");
						pOutputStream.write(DeviceCommand.correct_time_notice);
						break;
					case 1:
						mType = 2;
						Log.i(TAG,"Trying to request blood pressure because mtype is 2");
						pOutputStream.write(DeviceCommand.REQUEST_BLOOD_PRESSURE());
						break;
					case 7:
						mType = 8;
						Log.i(TAG,"Trying to request oxygen because mtype is 8");
						pOutputStream.write(DeviceCommand.REQUEST_OXYGEN());
						break;
					case 2:
						mType = 5;
						Log.i(TAG,"Trying to request data because mtype is 5");
						pOutputStream.write(DeviceCommand.REQUEST_BLOOD_PRESSURE());
						break;
					case 8:
						mType = 5;
						Log.i(TAG,"Trying to delete oxygen because mtype is 5");
						pOutputStream.write(DeviceCommand.DELETE_OXYGEN());
						break;
					case 3:
						mType = 1;

						if (x == 0x11) {
							mType = 7;// three users
						} else {
							mType = 1;// one user
						}

						pOutputStream.write(DeviceCommand.REQUEST_BLOOD_PRESSURE());
						break;
				}
				break;
			case 0x30:// Confirm that the correct time is correct
				Log.i(TAG,"Trying to correct time");
				pOutputStream.write(DeviceCommand.Correct_Time());
				break;
			case 0x40:// Correct time
				pOutputStream.write(DeviceCommand.REQUEST_HANDSHAKE());
				break;
			case e_pack_pressure_back:
				try {
					Thread.sleep(300);
				} catch (InterruptedException e) {////Prevent last command to blood pressure device not receive
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				ArrayList<byte[]> _dataList = mPackManager.mDeviceData.mData_blood;
				int _size = _dataList.size();
				for (int i = 0; i < _size; i++) {
					byte[] _byte = _dataList.get(i);
					byte[] _data = new byte[12];
//				int hiPre = ((_data[5] << 8 )|( _data[6] & 0xff)) & 0xffff;// 高压
//				int lowPre = _data[7] & 0xff;// 低压

					int lowPre = mPackManager.mDeviceData.mData_blood.get(i)[2] & 0xff;
					int hiPre = (mPackManager.mDeviceData.mData_blood.get(i)[0] << 8 | mPackManager.mDeviceData.mData_blood.get(i)[1]) & 0xff;
					int mPluse = mPackManager.mDeviceData.mData_blood.get(i)[3] & 0xff;
					int mAvager = mPackManager.mDeviceData.mData_blood.get(i)[4] & 0xff;

					int mYear = (mPackManager.mDeviceData.mData_blood.get(i)[5] & 0xff) + 2000;
					int mMouth = mPackManager.mDeviceData.mData_blood.get(i)[6] & 0xff;
					int mDay = mPackManager.mDeviceData.mData_blood.get(i)[7] & 0xff;
					int mHour = mPackManager.mDeviceData.mData_blood.get(i)[8] & 0xff;
					int mMin = mPackManager.mDeviceData.mData_blood.get(i)[9] & 0xff;
					int mSec = mPackManager.mDeviceData.mData_blood.get(i)[10] & 0xff;
					//year  //month  //day   //Time   //Minute  //Second
					String mData = mYear + "year" + mMouth + "month" + mDay + "day" + mHour + "Hour" + mMin + "Minute" + mSec + "second";
					//EventBus.getDefault().post(new AnyEventType("对时成功"+"\n"+"设备有数据"+"\n"+"日期："+mData+"\n"+"High pressure"+hiPre+"Low pressure"+lowPre+"Pulse rate"+mPluse+"平均压"+mAvager+"\n"+"进行删除数据"));
					// Successful on time   //Equipment has data   //date   //high pressure  //Low pressure  //Pulse rate  //Average pressure  //Delete data
					flag=true;
					highbp=hiPre;
					lowbp=lowPre;
					SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
							.emit("getBpData", hiPre+"-"+lowPre);
					EventBus.getDefault().post(new AnyEventType(String.valueOf(hiPre),String.valueOf(lowPre)));


					//set flag variable


					if(this.caller_type==1) {
						try {
						} catch (NullPointerException e) {
							e.printStackTrace();
						}
					}
				}
				Log.i(TAG,"Data revceived");
				if (_size == 0) {
					EventBus.getDefault().post(new AnyEventType("No Data","No Data")); //Successful on time   //Device without data
					pOutputStream.write(DeviceCommand.REPLAY_CONTEC08A());
					try {
						Thread.sleep(300);
					} catch (InterruptedException e) {////Prevent last command to blood pressure device not receive
						// TODO Auto-generated catch block
						Log.i(TAG,"Preventing last data");
						e.printStackTrace();
					}
					pOutputStream.write(DeviceCommand.DELETE_BP());
					mType = 0;

				}else{
					Log.i(TAG,"Trying to send response command");
					pOutputStream.write(DeviceCommand.REPLAY_CONTEC08A());
					try {
						Thread.sleep(300);
					} catch (InterruptedException e) {////防止最后一条命令血压设备接收不到
						// TODO Auto-generated catch block
						e.printStackTrace();
						Log.i(TAG,"Error in sending response command");
					}
					mType=0;
					Log.i(TAG,"Trying to send delete command");
					pOutputStream.write(DeviceCommand.DELETE_BP());
					Log.i(TAG,"Delete command sent");

				}
				break;
			case 0x31://Time correction failed
				Log.e("===========", "\n" +
						"Failed to confirm the correction time"); //Failed to confirm the correction time
				Log.i(TAG,"Failed to confirm correction time");
				break;
			case 0x41:
				Log.e("===========", "\n" +
						"Correction time failed");  //Correction time failed
				Log.i(TAG,"Correction time failed");
				break;
			case 0x50:
				Log.e("===========", "successfully deleted\n");
				Log.i(TAG,"Data successfully deleted");//successfully deleted
				break;
			case 0x51:
				Log.e("===========", "failed to delete\n");
				Log.i(TAG,"Failed to delete data");//failed to delete
				break;
		}

	}

}