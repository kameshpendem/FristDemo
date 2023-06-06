package com.healpha_doctor.blood_pressure;

/**
 *
 * */
public class AnyEventType {
	private String mHiPre;
	private String mLowPre;
	public AnyEventType(String hiPre,String lowPre) {
		// TODO Auto-generated constructor stub
		mHiPre = hiPre;
		mLowPre = lowPre;
	}
	public String getHiPres(){
		return mHiPre;
	}

	public String getLowPre(){
		return mLowPre;
	}

}
