package com.healpha_doctor.aasha;

public class Butterworth extends IIRFilter {
    public Butterworth(int order, PassbandType type, double f1, double f2, double delta) {
        super(new AnalogButterworth(order), type, f1, f2, delta);
    }

    public double[] filter_output(double[] raw_data) {
        double[] tmp = new double[201];
        for (int i = 0; i < 201; i++) {
            tmp[i] = Complex.abs(evaluate(0.015707963267948967d * ((double) i)));
        }
        double[] x = new double[raw_data.length];
        filter(raw_data, x);
        return x;
    }
}
