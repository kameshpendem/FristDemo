package com.healpha_doctor.aasha;

import android.util.Log;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

public class IIRFilter {
    /* renamed from: T */
    protected Rational f1T;
    protected ArrayList<SecondOrderSection> sections;

    public IIRFilter(AnalogPrototype baseFilter, PassbandType type, double f1, double f2, double delta) {
        AnalogPrototype prototype;
        switch (type) {
            case LOWPASS:
                Log.d("BluetoothPlugin", "filter50");
                prototype = baseFilter.lptolp(warp(f2, delta));
                Log.d("BluetoothPlugin", "filter51");
                break;
            case BANDPASS:
                prototype = baseFilter.lptobp(warp(f1, delta), warp(f2, delta));
                break;
            case HIGHPASS:
                prototype = baseFilter.lptohp(warp(f1, delta));
                break;
            default:
                throw new IllegalStateException("Undefined passband type");
        }
        double[] tn = new double[2];
        double[] td = new double[]{1.0d, -1.0d};
        td[0] = 1.0d;
        td[1] = 1.0d;
        Rational rational = new Rational(tn, td);
        this.f1T = new Rational(1.0d);
        this.sections = new ArrayList();
        for (int i = 0; i < prototype.nSections(); i++) {
            Rational R = prototype.getSection(i).map(rational);
            this.f1T.timesEquals(R);
            double[] cn = R.numerator().coefficients();
            double[] cd = R.denominator().coefficients();
            double s = 1.0d;
            if (cd[0] != 0.0d) {
                s = cd[0];
            }
            double b0 = cn[0] / s;
            double b1 = 0.0d;
            if (cn.length >= 2) {
                b1 = cn[1] / s;
            }
            double b2 = 0.0d;
            if (cn.length >= 3) {
                b2 = cn[2] / s;
            }
            double a1 = 0.0d;
            if (cd.length >= 2) {
                a1 = cd[1] / s;
            }
            double a2 = 0.0d;
            if (cd.length >= 3) {
                a2 = cd[2] / s;
            }
            this.sections.add(new SecondOrderSection(b0, b1, b2, a1, a2));
        }
    }

    public void initialize() {
        for (int i = 0; i < this.sections.size(); i++) {
            ((SecondOrderSection) this.sections.get(i)).initialize();
        }
    }

    public double filter(double x) {
        double retval = ((SecondOrderSection) this.sections.get(0)).filter(x);
        for (int i = 1; i < this.sections.size(); i++) {
            retval = ((SecondOrderSection) this.sections.get(i)).filter(retval);
        }
        return retval;
    }

    public void filter(double[] x, double[] y) {
        Arrays.fill(y, 0.0d);
        ((SecondOrderSection) this.sections.get(0)).filter(x, y);
        for (int i = 1; i < this.sections.size(); i++) {
            ((SecondOrderSection) this.sections.get(i)).filter(y, y);
        }
    }

    public void filter(double[] x) {
        Iterator it = this.sections.iterator();
        while (it.hasNext()) {
            ((SecondOrderSection) it.next()).filter(x, x);
        }
    }

    public Complex evaluate(double Omega) {
        return this.f1T.evaluate(Complex.exp(new Complex(0.0d, -Omega)));
    }

    public double groupDelay(double Omega) {
        return this.f1T.discreteTimeGroupDelay(Omega);
    }

    public void print(PrintStream ps) {
        ps.println("IIR Filter:");
        for (int i = 0; i < this.sections.size(); i++) {
            ps.println("\n  Section " + i + "\n");
            ((SecondOrderSection) this.sections.get(i)).print(ps);
            ps.println();
        }
    }

    private double warp(double f, double delta) {
        return Math.tan((3.141592653589793d * f) * delta);
    }
}
