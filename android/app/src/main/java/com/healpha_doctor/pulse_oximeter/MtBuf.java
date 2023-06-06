package com.healpha_doctor.pulse_oximeter;

import java.io.OutputStream;
import java.util.List;
import java.util.Vector;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.contec.cms50dj_jar.DeviceCommand;
import com.contec.cms50dj_jar.DeviceData50DJ_Jar;
import com.contec.cms50dj_jar.DeviceDataPedometerJar;
import com.contec.cms50dj_jar.DevicePackManager;
import com.contec.cms50dj_jar.MinData;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.healpha_doctor.SpiroReactModule;


public class MtBuf {
	private static final String TAG = "com.testBlueTooth.Mtbuf";
	public static Vector<Integer> m_buf = null;
	private DevicePackManager m_DevicePackManager = new DevicePackManager();
	Handler handler = new Handler(Looper.getMainLooper());
	private Context mContext;
	public int caller_type;
    public boolean flag=false;
	private Activity mActivity;

	public MtBuf(Context context) {
		m_buf = new Vector<Integer>();
		mContext = context;
	}

	public void setWebView(Activity activity){
		mActivity = activity;
	}
	public synchronized int Count() {
		return m_buf.size();
	}

	public synchronized void write(byte[] buf, int count,
			final OutputStream pOutputStream) throws Exception {
		int _receiveNum = m_DevicePackManager.arrangeMessage(buf, count);
		Log.i(TAG, "write: _receiveNum: " + _receiveNum);
		switch (_receiveNum) {
		case 1:// �õ��豸�� ����Уʱ����
				// DeviceManager.m_DeviceBean.mProgress = 5;
				// App_phms.getInstance().mEventBusPostOnBackGround
				// .postInMainThread(DeviceManager.m_DeviceBean);
			// success in obtaining connection (connection successful and device is ready for bluetooth operations),
			// then send the correction time command
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.correctionDateTime());
						Log.i(TAG, "�õ��豸�� ����Уʱ����");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 2:// ��ʱ�ɹ�
				// DeviceManager.m_DeviceBean.mProgress = 10;
				// App_phms.getInstance().mEventBusPostOnBackGround
				// .postInMainThread(DeviceManager.m_DeviceBean);
			// success in correction time,
			// then send the command of setting the Pedometer information
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.setPedometerInfo(
								"175", "75", 0, 24, 10000,
								1,0x02));
						Log.i(TAG, "��ʱ�ɹ�  ���üƲ�����Ϣ");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 3:// ��ʱʧ�� �ر�socket
			// failure in correction time
			Log.i(TAG, "��ʱ��ʧ��");
			break;
		case 4:// ��������;

			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.dayPedometerDataCommand());
						Log.i(TAG, "Ѫ����������  ��������Ϊ��λ�� �Ʋ�������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 5: // �������ݽ������
			Log.i(TAG, " ����Ѫ�����ݽ������  ��������Ϊ��λ������������");
			// ��������
			// all SpO2 and PR data have been received.
			// then process the SpO2 and PR data
			saveSpo2Data();
			// and send the command for requesting the Pedometer data in unit of day.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.dayPedometerDataCommand());
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}.start();

			break;
		case 6:// һ�����ݽ������ ��
			Log.i(TAG, "һ��Ѫ�����ݽ������ ");
			// one package of data has been received;
			// send the command for success in uploading data(it must be sent in this way)
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
//						SendCommand.send(DeviceCommand.dataUploadSuccessCommand());
						pOutputStream.write(DeviceCommand.dataUploadSuccessCommand());
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 7:// ����ʧ��
			Log.i(TAG, "Ѫ�����ݽ���ʧ��  ��������Ϊ��λ�� �Ʋ�������");
			// dataUploadSuccessCommand
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.dayPedometerDataCommand());
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 8:// 8:���üƲ��� �ɹ�
				// DeviceManager.m_DeviceBean.mProgress = 20;
				// App_phms.getInstance().mEventBusPostOnBackGround
				// .postInMainThread(DeviceManager.m_DeviceBean);
			// success in setting the Pedometer information,
			// then the command of requesting the SpO2 and PR data can be sent.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
//						SendCommand.send(DeviceCommand.getDataFromDevice());
						pOutputStream.write(DeviceCommand.getDataFromDevice());
						Log.i(TAG, "���üƲ��� �ɹ�  ���� ����Ѫ����������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 9:// 9: ���üƲ���ʧ��
			// failure in setting, because the SpO2 and PR data has not relation with Pedometer,
			// the command of requesting the SpO2 and PR data can be sent.

			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.getDataFromDevice());
						Log.i(TAG, "���üƲ��� ʧ��    ���� ����Ѫ���������� ");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 10:// ����Ϊ��λ �Ʋ������� һ���ϴ����
			// one package of Pedometer data in unit of day has been uploaded, send the command of finishing uploading.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.dayPedometerDataSuccessCommand());
						Log.i(TAG, "����Ϊ��λ�Ʋ��� ���� һ���ϴ����  �����ϴ��������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 11:// ����Ϊ��λ�Ʋ��� ������һ���ϴ��ɹ� ������һ������
			// the last package of Pedometer data in unit of day has been uploaded successfully, request the next package of data

			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.dayPedometerDataCommand());
						Log.i(TAG, "����Ϊ��λ�Ʋ��� ������һ���ϴ��ɹ�  ������һ������ ");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 12:// ����Ϊ��λ�Ʋ��� ���� ȫ�� �ϴ��ɹ� �����Է�Ϊ��λ������
			// TODO �˴�����Ʋ���һ��Ϊ��λ������
			// all Pedometer data in unit of day have been uploaded
			saveDaypedometerData();
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.minPedometerDataCommand());
						Log.i(TAG, "����Ϊ��λ�Ʋ��� ����  ȫ��   �ϴ��ɹ�  �����Է�Ϊ��λ������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 13:// ����Ϊ��λ�Ʋ��� �����ϴ�ʧ�� �����Է�Ϊ��λ������
			// failure in uploading the Pedometer data in unit of day.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.minPedometerDataCommand());
						Log.i(TAG, " ����Ϊ��λ�Ʋ��� �����ϴ�ʧ�� �����Է�Ϊ��λ������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 14:// �Է�Ϊ��λ �Ʋ������� һ���ϴ����
			// one package of Pedometer data in unit of minute has been uploaded.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand.minPedometerDataSuccessCommand());
						Log.i(TAG, "�� �� Ϊ��λ �Ʋ������� һ���ϴ���� �����ϴ��������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 15:// �Է�Ϊ��λ �Ʋ������� һ���ϴ����
			// one package of Pedometer data in unit of minute has been uploaded, request the next package of data.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.minPedometerDataCommand());
						Log.i(TAG, "�Է�Ϊ��λ�Ʋ��� ���� һ���ϴ����  ����������һ��������");
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 16:
			// �Է�Ϊ��λ�Ʋ��� ���� ȫ�� �ϴ��ɹ� �ر�socket
			// TODO �洢�Է�Ϊ��λ������
			savePedometerMindata();
//			App_phms.getInstance().mEventBusPostOnBackGround
//					.postInMainThread(DeviceManager.m_DeviceBean);
			// all Pedometer data in unit of minute have been uploaded successfully
			Log.i(TAG, " �Է�Ϊ��λ�Ʋ��� ���� ȫ�� �ϴ��ɹ� �ر�socket ");
			DeviceDataPedometerJar _pedometerDatamin = m_DevicePackManager
					.getM_DeviceDataPedometers();
			List<MinData> _list =	_pedometerDatamin.getmPedometerDataMinList();
			for (int i = 0; i < _list.size(); i++) {
				_pedometerDatamin.getMinString(_list.get(i).mStartDate);
			}
			break;
		case 17:// ����Ϊ��λ �Ʋ�����������
			// no new Pedometer data in unit of day
			Log.i(TAG, " ����Ϊ��λ �Ʋ�����������    �����Է�Ϊ��λ������");
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						pOutputStream.write(DeviceCommand
								.minPedometerDataCommand());
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 18:// �Է�Ϊ��λ �Ʋ�����������
			// no new data in unit of minute
			Log.i(TAG, " �Է�Ϊ��λ �Ʋ�����������   ");
			break;
		case 19:// �Է�Ϊ��λ �Ʋ��������ϴ�ʧ��
			// failure in receiving the data in unit of minute
			Log.i(TAG, " �Է�Ϊ��λ �Ʋ��������ϴ�ʧ��   ");
			break;
		case 20:// ������һ��Ѫ������
			// the command that the last package of data has been received,
			// has been sent successfully,
			// then the command for requesting the next package should be sent.
			new Thread() {
				public void run() {
					try {
						Thread.sleep(500);
						Log.i(TAG, " ������һ��Ѫ������   ");
						pOutputStream.write(DeviceCommand.getDataFromDevice());
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		}
	}

	String minPedometerData = "";
	private void savePedometerMindata() {
		minPedometerData = "";
		DeviceDataPedometerJar _pedometerDatamin = m_DevicePackManager
				.getM_DeviceDataPedometers();
		List<MinData> _list = _pedometerDatamin.getmPedometerDataMinList();
		for (int i = 0; i < _list.size(); i++) {
			MinData minData = _list.get(i);
			byte[] mStartDate = minData.mStartDate;
			String startDateStr = "year:" + mStartDate[0] + " month:" + mStartDate[1] + "  day:" + mStartDate[2] + " hour:" + mStartDate[3];
			minPedometerData += "\n" + startDateStr;
			Log.i(TAG, "savePedometerMindata: startDateStr: " + startDateStr);
			minPedometerData += " " + minData.mEndTime;
			Log.i(TAG, "savePedometerMindata: mEndTime: " + minData.mEndTime);
			List<byte[]> mMinDataList = minData.mMinDataList;
			for (int j = 0; j < mMinDataList.size(); j++) {
				minPedometerData += " " + _pedometerDatamin.getMinString(mMinDataList.get(j));
				Log.i(TAG, "savePedometerMindata: " + _pedometerDatamin.getMinString(mMinDataList.get(j)));
			}
		}
		Log.i(TAG, "savePedometerMindata: " + minPedometerData);
	}

	String dayPedometerData = "";
	private void saveDaypedometerData() {
		dayPedometerData = "";
		DeviceDataPedometerJar _pedometerData = m_DevicePackManager
				.getM_DeviceDataPedometers();
		List<byte[]> byteList = _pedometerData.getmPedometerDataDayList();
		for (int i = 0; i < byteList.size(); i++) {
			byte[] _datadate = byteList.get(i);
			Log.i(TAG, "saveDaypedometerData: getDayString: " + _pedometerData.getDayString(_datadate));
			dayPedometerData += "\n" + _pedometerData.getDayString(_datadate);
		}
		Log.i(TAG, "saveDaypedometerData: " + dayPedometerData);
	}

	public int spo2Data ;
	public int PRData;
	private void saveSpo2Data() {
		spo2Data = 0;
		PRData = 0;
		// all SpO2 and PR data have been received.
        //then process the SpO2 and PR data and send the command for requesting the Pedometer data in unit of day.
		DeviceData50DJ_Jar _djData = m_DevicePackManager.getDeviceData50dj();
		for (int i = 0; i < _djData.getmSp02DataList().size(); i++) {
			byte[] _data = _djData.getmSp02DataList().get(i);
            //_data[]  Refer to the descriptions of "DeviceData50DJ_Jar" class for concrete meaning.
            _djData.setmSpoData(_data);
            Log.i(TAG, "saveSpo2Data: " +_djData.getmSpoData()[6]);
            Log.i(TAG,"savePRData: "+_djData.getmSpoData()[7]);
            //spo2Data += "\n" + _djData.toString();
			spo2Data= _djData.getmSpoData()[6];
			PRData= _djData.getmSpoData()[7];

			SpiroReactModule.getReactAppContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
					.emit("getPulseData", _djData.getmSpoData()[6]+"-"+_djData.getmSpoData()[7]);
		}


		//set flag variable

        flag=true;

		Log.d(TAG, "Spo2Data: " + spo2Data +" PRData " +PRData);
		if (this.caller_type == 1) {
			try {

			} catch (NullPointerException e) {
				e.printStackTrace();
			}
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
