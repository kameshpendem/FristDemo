package com.healpha_doctor.blood_glucose;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Vector;

import android.os.Environment;
import android.util.Log;
import cn.com.contec.jar.cmssxt.DeviceCommand;
import cn.com.contec.jar.cmssxt.DevicePackManager;

public class MtBuf {
	public double mBg;
	private static final String TAG = "com.testBlueTooth.Mtbuf";
	public static Vector<Integer> m_buf = null;
	private DevicePackManager m_DevicePackManager = new DevicePackManager();
	public boolean flag=false;
	public MtBuf() {
		mPacks = new byte[1024];
		mCount = 0;
		m_buf = new Vector<Integer>();
	}

	public synchronized int Count() {
		return m_buf.size();
	}

	int mSettimeCount = 0;
	private byte[] mPacks;
	private int mCount;

	public synchronized void write(byte[] buf, int count,
			final OutputStream pOutputStream) throws Exception {
		int _receiveNum = m_DevicePackManager.arrangeMessage(buf, count);
		Log.i(TAG, "jar�����ص���Ϣ��" + _receiveNum);
		switch (_receiveNum) {
		case 8:// ���豸�Ǿ��豸 ���Ͳ�����Ķ�ʱ����
			new Thread() {
				public void run() {
					try {
						Thread.sleep(1000);
						pOutputStream.write(DeviceCommand.command_VerifyTime());// �����������ݵ�����
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 9:// ���豸�����豸 ���ʹ���Ķ�ʱ����
			new Thread() {
				public void run() {
					try {
						Thread.sleep(1000);
						pOutputStream.write(DeviceCommand
								.command_VerifyTimeSS());// �����������ݵ�����
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();
			break;
		case 1:// �ɹ���������
			for (int i = 0; i < m_DevicePackManager.m_DeviceDatas.size(); i++) {
				saveAsString(m_DevicePackManager.m_DeviceDatas.toString()
						+ "\n");
			}
			double bg = m_DevicePackManager.m_DeviceDatas.get(m_DevicePackManager.m_DeviceDatas.size()-1).m_data;
			Log.i("Test bg",Double.toString(bg));
			mBg=bg;
			flag=true;
			m_DevicePackManager.m_DeviceDatas.clear();// ������ݼ��� �����ظ�����
//			new Thread() {
//				public void run() {
//					try {
//						Thread.sleep(1000);
//						Log.i(TAG, "�ɹ��������� ����ɾ������");
//						pOutputStream.write(DeviceCommand.command_delData());// ����ɾ�����ݵ�����
//						//BluetoothChatService.run = false;
//					} catch (Exception e) {
//						e.printStackTrace();
//					}
//				};
//			}.start();

			break;
		case 2:// ��������ʧ��
			Log.i(TAG, "��������ʧ��");
			break;
		case 3:// ��ʱ�ɹ�;
			Log.i(TAG, "��ʱ��ɹ�");
			new Thread() {
				public void run() {
					try {
						Thread.sleep(1000);
						pOutputStream
								.write(DeviceCommand.command_requestData());// �����������ݵ�����
					} catch (Exception e) {
						e.printStackTrace();
					}
				};
			}.start();

			break;
		case 4:// ��ʱʧ��;
			Log.i(TAG, "��ʱ��ʧ��");
			break;
		case 5: // ɾ���ɹ�
			Log.i(TAG, "ɾ���ɹ�");
			pOutputStream.close();
			break;
		case 6:// ɾ��ʧ�ܣ�
			Log.i(TAG, "ɾ��ʧ��");
			pOutputStream.close();
			break;
		case 7:// �豸�����ݣ�
			Log.i(TAG, "�豸������");
			break;
		}
	}

	/**
	 * ���յ������ݴ������ļ���
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
					new FileOutputStream(_file + "/Sp10w_Data.txt", true));
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
