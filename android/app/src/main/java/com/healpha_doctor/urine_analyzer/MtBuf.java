package com.healpha_doctor.urine_analyzer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Vector;

import com.contec.jar.BC401.BC401_Data;
import com.contec.jar.BC401.BC401_Struct;
import com.contec.jar.BC401.DeviceCommand;
import com.contec.jar.BC401.DevicePackManager;

import org.greenrobot.eventbus.EventBus;

import android.os.Environment;
import android.util.Log;

public class MtBuf {
	private static final String TAG = "lz";
	public static Vector<Integer> m_buf = null;
	private boolean mReceiveDataFailed = true;
	public boolean flag=false;
	private boolean mFlage = false;
	public  String mURO, mBLD, mBIL, mKET, mGLU, mPRO, mPH, mNIT, mLEU, mSG,
			mVC,mMAL,mCR,mUCA;

	private int i = 0;
	private String mAllData = "";

	public MtBuf() {
		m_buf = new Vector<Integer>();
	}

	public synchronized int Count() {
		return m_buf.size();
	}

	DevicePackManager mPackManager = new DevicePackManager();
	int mSettimeCount = 0;

	public synchronized void write(byte[] buf, int count,
			OutputStream pOutputStream) throws Exception {
		int _back = mPackManager.arrangeMessage(buf, count);
		switch (_back) {
		case (byte) 0x02:// Уʱ�ɹ�
			Log.e("�������ݳ��Ƚ��������¾ɰ汾", "===============");
			Log.e("��ǰ�����ݳ�����", "==============="+count);
			Log.e("�������ݳ��Ƚ��������¾ɰ汾", "===============");
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(count < 14){
				pOutputStream.write(DeviceCommand.Request_AllData());
			}
			else{
				pOutputStream.write(DeviceCommand.Request_AllData_all());
			}
			
			break;
		case (byte) 0x05:// �������ݰ�ͷ
			int version = mPackManager.mVersion;
			if (mPackManager.Percent == 100) {// ��ʾȫ�����ݽ������
					for (int i = 0; i < mPackManager.mBc401_Data.Structs.size(); i++) {
						Log.e("��ǰ���ݵ�ֵ��", "====="
								+ mPackManager.mBc401_Data.Structs.get(i));
						setData(mPackManager.mBc401_Data.Structs.get(i));

						if(mMAL =="-8" || mMAL.equalsIgnoreCase("-8") && mCR =="-8" || mCR.equalsIgnoreCase("-8")&& mUCA =="-8" ||mUCA.equalsIgnoreCase("-8")){
							mAllData = mAllData
									+ "\n"+ (mPackManager.mBc401_Data.Structs.get(i).Year + 2000)
									+ "��"
									+ mPackManager.mBc401_Data.Structs.get(i).Month
									+ "��"
									+ mPackManager.mBc401_Data.Structs.get(i).Date
									+ "��"
									+ mPackManager.mBc401_Data.Structs.get(i).Hour
									+ "ʱ"
									+ mPackManager.mBc401_Data.Structs.get(i).Min
									+ "��"
									+ mPackManager.mBc401_Data.Structs.get(i).Sec
									+ "��" + "\n" 
//									+ "URO:" + mPackManager.mBc401_Data.Structs.get(i).URO + " BLD:" + mPackManager.mBc401_Data.Structs.get(i).BLD
//									+ " BIL:" + mPackManager.mBc401_Data.Structs.get(i).BIL + " KET:" + mPackManager.mBc401_Data.Structs.get(i).KET + " LEU:"
//									+ mPackManager.mBc401_Data.Structs.get(i).LEU + " GLU:" + mPackManager.mBc401_Data.Structs.get(i).GLU + " PRO:" + mPackManager.mBc401_Data.Structs.get(i).PRO
//									+ " PH:" + mPackManager.mBc401_Data.Structs.get(i).PH + " NIT:" + mPackManager.mBc401_Data.Structs.get(i).NIT + " SG:" + mPackManager.mBc401_Data.Structs.get(i).SG
//									+ " VC:" + mPackManager.mBc401_Data.Structs.get(i).VC+" MAL:"+mPackManager.mBc401_Data.Structs.get(i).MAL+" CR:"+mPackManager.mBc401_Data.Structs.get(i).CR+" UCA:"+mPackManager.mBc401_Data.Structs.get(i).UCA;
									+ "URO:" + mURO + " BLD:" + mBLD
									+ " BIL:" + mBIL + " KET:" + mKET + " LEU:"
									+ mLEU + " GLU:" + mGLU + " PRO:" + mPRO
									+ " PH:" + mPH + " NIT:" + mNIT + " SG:" + mSG
									+ " VC:" + mVC;
						}
						else{
						mAllData = mAllData
								+ "\n"+(mPackManager.mBc401_Data.Structs.get(i).Year + 2000)
								+ "��"
								+ mPackManager.mBc401_Data.Structs.get(i).Month
								+ "��"
								+ mPackManager.mBc401_Data.Structs.get(i).Date
								+ "��"
								+ mPackManager.mBc401_Data.Structs.get(i).Hour
								+ "ʱ"
								+ mPackManager.mBc401_Data.Structs.get(i).Min
								+ "��"
								+ mPackManager.mBc401_Data.Structs.get(i).Sec
								+ "��" + "\n" 
//								+ "URO:" + mPackManager.mBc401_Data.Structs.get(i).URO + " BLD:" + mPackManager.mBc401_Data.Structs.get(i).BLD
//								+ " BIL:" + mPackManager.mBc401_Data.Structs.get(i).BIL + " KET:" + mPackManager.mBc401_Data.Structs.get(i).KET + " LEU:"
//								+ mPackManager.mBc401_Data.Structs.get(i).LEU + " GLU:" + mPackManager.mBc401_Data.Structs.get(i).GLU + " PRO:" + mPackManager.mBc401_Data.Structs.get(i).PRO
//								+ " PH:" + mPackManager.mBc401_Data.Structs.get(i).PH + " NIT:" + mPackManager.mBc401_Data.Structs.get(i).NIT + " SG:" + mPackManager.mBc401_Data.Structs.get(i).SG
//								+ " VC:" + mPackManager.mBc401_Data.Structs.get(i).VC+" MAL:"+mPackManager.mBc401_Data.Structs.get(i).MAL+" CR:"+mPackManager.mBc401_Data.Structs.get(i).CR+" UCA:"+mPackManager.mBc401_Data.Structs.get(i).UCA;
								+ "URO:" + mURO + " BLD:" + mBLD
								+ " BIL:" + mBIL + " KET:" + mKET + " LEU:"
								+ mLEU + " GLU:" + mGLU + " PRO:" + mPRO
								+ " PH:" + mPH + " NIT:" + mNIT + " SG:" + mSG
								+ " VC:" + mVC+" MAL:"+mMAL+" CR:"+mCR+" UCA:"+mUCA;
						}
					}
					EventBus.getDefault().post(
							new AnyEventType("��ʱ�ɹ�" + "\n" + "�豸������" + "\n"
									+ mAllData + "\n" + "����ɾ������"));
					pOutputStream.write(DeviceCommand.Delete_AllData());
				}
			break;
		case (byte) 0x15:
			BC401_Data _alldata = mPackManager.mBc401_Data;
			int _alldataSize = _alldata.Structs.size();
			Log.e("ִ������������������", "ʲô���" + _alldataSize);
			for (int j = 0; j < _alldataSize; j++) {
				setData(mPackManager.mBc401_Data.Structs.get(i));
				if(mMAL == "-8" || mMAL.equalsIgnoreCase("-8")&&mCR == "-8" || mCR.equalsIgnoreCase("-8")&&mUCA == "-8" || mUCA.equalsIgnoreCase("-8")){
					mAllData = mAllData
							+ "\n"+(mPackManager.mBc401_Data.Structs.get(i).Year + 2000)
							+ "��"
							+ mPackManager.mBc401_Data.Structs.get(i).Month
							+ "��"
							+ mPackManager.mBc401_Data.Structs.get(i).Date
							+ "��"
							+ mPackManager.mBc401_Data.Structs.get(i).Hour
							+ "ʱ"
							+ mPackManager.mBc401_Data.Structs.get(i).Min
							+ "��"
							+ mPackManager.mBc401_Data.Structs.get(i).Sec
							+ "��" + "\n" 
//							+ "URO:" + mPackManager.mBc401_Data.Structs.get(i).URO + " BLD:" + mPackManager.mBc401_Data.Structs.get(i).BLD
//							+ " BIL:" + mPackManager.mBc401_Data.Structs.get(i).BIL + " KET:" + mPackManager.mBc401_Data.Structs.get(i).KET + " LEU:"
//							+ mPackManager.mBc401_Data.Structs.get(i).LEU + " GLU:" + mPackManager.mBc401_Data.Structs.get(i).GLU + " PRO:" + mPackManager.mBc401_Data.Structs.get(i).PRO
//							+ " PH:" + mPackManager.mBc401_Data.Structs.get(i).PH + " NIT:" + mPackManager.mBc401_Data.Structs.get(i).NIT + " SG:" + mPackManager.mBc401_Data.Structs.get(i).SG
//							+ " VC:" + mPackManager.mBc401_Data.Structs.get(i).VC+" MAL:"+mPackManager.mBc401_Data.Structs.get(i).MAL+" CR:"+mPackManager.mBc401_Data.Structs.get(i).CR+" UCA:"+mPackManager.mBc401_Data.Structs.get(i).UCA;
							+ "URO:" + mURO + " BLD:" + mBLD
							+ " BIL:" + mBIL + " KET:" + mKET + " LEU:"
							+ mLEU + " GLU:" + mGLU + " PRO:" + mPRO
							+ " PH:" + mPH + " NIT:" + mNIT + " SG:" + mSG
							+ " VC:" + mVC;
				}
				else{
				mAllData = mAllData
						+"\n"+ (mPackManager.mBc401_Data.Structs.get(i).Year + 2000)
						+ "��"
						+ mPackManager.mBc401_Data.Structs.get(i).Month
						+ "��"
						+ mPackManager.mBc401_Data.Structs.get(i).Date
						+ "��"
						+ mPackManager.mBc401_Data.Structs.get(i).Hour
						+ "ʱ"
						+ mPackManager.mBc401_Data.Structs.get(i).Min
						+ "��"
						+ mPackManager.mBc401_Data.Structs.get(i).Sec
						+ "��" + "\n" 
//						+ "URO:" + mPackManager.mBc401_Data.Structs.get(i).URO + " BLD:" + mPackManager.mBc401_Data.Structs.get(i).BLD
//						+ " BIL:" + mPackManager.mBc401_Data.Structs.get(i).BIL + " KET:" + mPackManager.mBc401_Data.Structs.get(i).KET + " LEU:"
//						+ mPackManager.mBc401_Data.Structs.get(i).LEU + " GLU:" + mPackManager.mBc401_Data.Structs.get(i).GLU + " PRO:" + mPackManager.mBc401_Data.Structs.get(i).PRO
//						+ " PH:" + mPackManager.mBc401_Data.Structs.get(i).PH + " NIT:" + mPackManager.mBc401_Data.Structs.get(i).NIT + " SG:" + mPackManager.mBc401_Data.Structs.get(i).SG
//						+ " VC:" + mPackManager.mBc401_Data.Structs.get(i).VC+" MAL:"+mPackManager.mBc401_Data.Structs.get(i).MAL+" CR:"+mPackManager.mBc401_Data.Structs.get(i).CR+" UCA:"+mPackManager.mBc401_Data.Structs.get(i).UCA;
						+ "URO:" + mURO + " BLD:" + mBLD
						+ " BIL:" + mBIL + " KET:" + mKET + " LEU:" + mLEU
						+ " GLU:" + mGLU + " PRO:" + mPRO
						+ " PH:" + mPH + " NIT:" + mNIT + " SG:" + mSG + " VC:" + mVC
						+" MAL:"+mMAL+" CR:"+mCR+" UCA:"+mUCA;
				}
				flag=true;

			}
			EventBus.getDefault().post(
					new AnyEventType("��ʱ�ɹ�" + "\n" + "�豸������" + "\n"
							+ mAllData + "\n" + "����ɾ������"));
			Log.e("%%%%%%%%%%%%%%", "%%%%%%%%%%%%%%");
			pOutputStream.write(DeviceCommand.Delete_AllData());
			break;
		case (byte) 0x08:
			EventBus.getDefault().post(
					new AnyEventType("��ʱ�ɹ�" + "\n" + "�豸������" + "\n"));
			break;
		case (byte) 0x06:// ɾ���ɹ�

			break;
		default:
			break;
		}
	}

	private void setData(BC401_Struct mBC401_Struct) {
		// TODO Auto-generated method stub
		Log.e("===========", "==========");
		Log.e("===========", "==========������ʾ����"+mBC401_Struct.URO1+" "+mBC401_Struct.BLD1+" "+mBC401_Struct.BIL1+" "+mBC401_Struct.KET1+" "+mBC401_Struct.GLU1+" "+mBC401_Struct.PRO1+" "+mBC401_Struct.PH1+" "+mBC401_Struct.NIT1+" "
				+mBC401_Struct.LEU1+" "+mBC401_Struct.SG1+" "+mBC401_Struct.VC1+" "+mBC401_Struct.MAL1+" "+mBC401_Struct.CR1+" "+mBC401_Struct.UCA1);
		Log.e("===========", "==========");
		
		Log.e("===========", "==========");
		Log.e("===========", "==========�Ƕ�����ʾ����"+mBC401_Struct.URO+" "+mBC401_Struct.BLD+" "+mBC401_Struct.BIL+" "+mBC401_Struct.KET+" "+mBC401_Struct.GLU+" "+mBC401_Struct.PRO+" "+mBC401_Struct.PH+" "+mBC401_Struct.NIT+" "
				+mBC401_Struct.LEU+" "+mBC401_Struct.SG+" "+mBC401_Struct.VC+" "+mBC401_Struct.MAL+" "+mBC401_Struct.CR+" "+mBC401_Struct.UCA);
		Log.e("===========", "==========");
		
		if (mBC401_Struct.URO == 0) {
			mURO = "Norm";
		} else if (mBC401_Struct.URO == 1) {
			mURO = "1+";
		} else if (mBC401_Struct.URO == 2) {
			mURO = "2+";
		} else {
			mURO = ">=3+";
		}
		if (mBC401_Struct.BLD == 0) {
			mBLD = "-";
		} else if (mBC401_Struct.BLD == 1) {
			mBLD = "+-";
		} else if (mBC401_Struct.BLD == 2) {
			mBLD = "1+";
		} else if (mBC401_Struct.BLD == 3) {
			mBLD = "2+";
		} else {
			mBLD = "3+";
		}

		if (mBC401_Struct.BIL == 0) {
			mBIL = "-";
		} else if (mBC401_Struct.BIL == 1) {
			mBIL = "1+";
		} else if (mBC401_Struct.BIL == 2) {
			mBIL = "2+";
		} else {
			mBIL = "3+";
		}

		if (mBC401_Struct.KET == 0) {
			mKET = "-";
		} else if (mBC401_Struct.BIL == 1) {
			mKET = "1+";
		} else if (mBC401_Struct.BIL == 2) {
			mKET = "2+";
		} else {
			mKET = "3+";
		}

		if (mBC401_Struct.GLU == 0) {
			mGLU = "-";
		} else if (mBC401_Struct.GLU == 1) {
			mGLU = "+-";
		} else if (mBC401_Struct.GLU == 2) {
			mGLU = "1+";
		} else if (mBC401_Struct.GLU == 3) {
			mGLU = "2+";
		} else if (mBC401_Struct.GLU == 4) {
			mGLU = "3+";
		}

		else {
			mGLU = "4+";
		}

		if (mBC401_Struct.PRO == 0) {
			mPRO = "-";
		} else if (mBC401_Struct.PRO == 1) {
			mPRO = "+-";
		} else if (mBC401_Struct.PRO == 2) {
			mPRO = "1+";
		} else if (mBC401_Struct.PRO == 3) {
			mPRO = "2+";
		} else {
			mPRO = ">=3+";
		}

		if (mBC401_Struct.PH == 0) {
			mPH = "5";
		} else if (mBC401_Struct.PH == 1) {
			mPH = "6";
		} else if (mBC401_Struct.PH == 2) {
			mPH = "7";
		} else if (mBC401_Struct.PH == 3) {
			mPH = "8";
		} else {
			mPH = "9";
		}
		if (mBC401_Struct.NIT == 0) {
			mNIT = "-";
		} else {
			mNIT = "1+";
		}

		if (mBC401_Struct.LEU == 0) {
			mLEU = "-";
		} else if (mBC401_Struct.LEU == 1) {
			mLEU = "+-";
		} else if (mBC401_Struct.LEU == 2) {
			mLEU = "1+";
		} else if (mBC401_Struct.LEU == 3) {
			mLEU = "2+";
		} else {
			mLEU = "3+";
		}

		if (mBC401_Struct.SG == 0) {
			mSG = "<=1.005";
		} else if (mBC401_Struct.SG == 1) {
			mSG = "1.010";
		} else if (mBC401_Struct.SG == 2) {
			mSG = "1.015";
		} else if (mBC401_Struct.SG == 3) {
			mSG = "1.020";
		} else if (mBC401_Struct.SG == 4) {
			mSG = "1.025";
		} else {
			mSG = ">=1.030";
		}

		if (mBC401_Struct.VC == 0) {
			mVC = "-";
		} else if (mBC401_Struct.VC == 1) {
			mVC = "+-";
		} else if (mBC401_Struct.VC == 2) {
			mVC = "1+";
		} else if (mBC401_Struct.VC == 3) {
			mVC = "2+";
		} else {
			mVC = "3+";
		}
		
		
		if(mBC401_Struct.MAL == 0){
			mMAL ="-";
		}
		else if(mBC401_Struct.MAL == 1){
			mMAL ="1+";
		}
		else if(mBC401_Struct.MAL == 2){
			mMAL ="2+";
		}
		else if(mBC401_Struct.MAL == 3){
			mMAL ="3+";
		}
		else if(mBC401_Struct.MAL == -8){//��Ч����
			mMAL ="-8";
		}
		else{
			mMAL="";
		}
		
		
		if(mBC401_Struct.CR == 0){
			mCR = "-";	
		}
		else if (mBC401_Struct.CR == 1) {
			mCR = "+-";
		}
		else if (mBC401_Struct.CR == 2) {
			mCR = "1+";
		}
		else if (mBC401_Struct.CR == 3) {
			mCR = "2+";
		}
		else if (mBC401_Struct.CR == 4){
			mCR = "3+";	
				}
		else if(mBC401_Struct.CR == -8){//��Ч����
			mCR ="-8";
		}
		else{
			mCR="";
		}
		
		if(mBC401_Struct.UCA == 0){
			mUCA = "-";	
		}
		else if (mBC401_Struct.UCA == 1) {
			mUCA = "1+";
		}
		else if (mBC401_Struct.UCA == 2) {
			mUCA = "2+";
		}
		else if (mBC401_Struct.UCA == 3){
			mUCA = "3+";
		}
		else if(mBC401_Struct.UCA == -8){//��Ч����
			mUCA ="-8";
		}
		else{
			mUCA ="";
		}
		

	}

	String PATH_BASE = Environment.getExternalStorageDirectory()
			.getAbsolutePath() + "/contec";

	/**
	 * ���յ������ݴ������ļ���
	 * 
	 * @param pContent
	 */
	public void saveAsString(String pContent) {
		File _file = new File(PATH_BASE);
		if (!_file.exists()) {
			_file.mkdirs();
		}
		try {
			OutputStreamWriter os = new OutputStreamWriter(
					new FileOutputStream(_file + "/WT_Data.txt"));
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
