package com.healpha_doctor.aasha;

import android.util.Log;

public class AnalogButterworth extends AnalogPrototype {
    public AnalogButterworth(int order) {
        int nRealPoles = order - ((order / 2) * 2);
        int nComplexPolePairs = order / 2;
        int nPoles = nRealPoles + (nComplexPolePairs * 2);
        Log.d("BluetoothPlugin", "filter38");
        if (nRealPoles == 1) {
            Log.d("BluetoothPlugin", "filter39");
            addSection(new Rational(new Polynomial(1.0d), new Polynomial(new double[]{1.0d, 1.0d})));
        }
        double dAngle = 3.141592653589793d / ((double) nPoles);
        for (int i = 0; i < nComplexPolePairs; i++) {
            double angle = (-1.5707963267948966d + ((dAngle / 2.0d) * ((double) (nRealPoles + 1)))) + (((double) i) * dAngle);
            addSection(new Rational(new Polynomial(1.0d), new Polynomial(new double[]{1.0d, -2.0d * Math.sin(angle), 1.0d})));
        }
        Log.d("BluetoothPlugin", "filter40");
    }
}
