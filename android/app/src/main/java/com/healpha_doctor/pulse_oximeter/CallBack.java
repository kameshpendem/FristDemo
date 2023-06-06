package com.healpha_doctor.pulse_oximeter;


public class CallBack {
	public MtBuf m_mtbuf;
	public  ICallBack m_icall;
	public CallBack( MtBuf mtbuf,ICallBack icall)
	{
		m_mtbuf = mtbuf;
		m_icall = icall;
	}
	public void call()
	{
		m_icall.callPulseOxi();
	}
}
