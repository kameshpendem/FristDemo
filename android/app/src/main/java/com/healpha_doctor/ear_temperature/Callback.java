package com.healpha_doctor.ear_temperature;

/**
 * Created by concent on 30/5/18.
 */

public class Callback {
    public MtBuf m_mtbuf;
    public ICallBack m_icall;

    public Callback(MtBuf mtbuf, ICallBack icall)
    {
        m_mtbuf = mtbuf;
        m_icall = icall;
    }
    public void call()
    {
        m_icall.callTemp();
    }
}
