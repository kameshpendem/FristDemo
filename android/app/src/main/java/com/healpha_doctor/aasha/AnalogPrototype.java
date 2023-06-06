package com.healpha_doctor.aasha;


import android.util.Log;

import java.io.PrintStream;
import java.util.ArrayList;

public class AnalogPrototype {
    /* renamed from: T */
    protected Rational f0T = null;
    protected ArrayList<Rational> sections = new ArrayList();

    public void addSection(Rational R) {
        Log.d("BluetoothPlugin", "filter55");
        this.sections.add(R);
        Log.d("BluetoothPlugin", "filter56");
    }

    public int nSections() {
        return this.sections.size();
    }

    public Rational getSection(int index) {
        return new Rational((Rational) this.sections.get(index));
    }

    public AnalogPrototype lptolp(double omega0) {
        Log.d("BluetoothPlugin", "filter52");
        Rational T = new Rational(new double[]{0.0d, 1.0d}, new double[]{omega0});
        AnalogPrototype retval = new AnalogPrototype();
        Log.d("BluetoothPlugin", "filter53: " + this.sections.size());
        Log.d("BluetoothPlugin", "filter57");
        for (int i = 0; i < this.sections.size(); i++) {
            retval.addSection(((Rational) this.sections.get(i)).map(T));
        }
        Log.d("BluetoothPlugin", "filter54");
        return retval;
    }

    public AnalogPrototype lptohp(double omega0) {
        Rational T = new Rational(new double[]{omega0}, new double[]{0.0d, 1.0d});
        AnalogPrototype retval = new AnalogPrototype();
        for (int i = 0; i < this.sections.size(); i++) {
            retval.addSection(((Rational) this.sections.get(i)).map(T));
        }
        return retval;
    }

    public AnalogPrototype lptobp(double omega1, double omega2) {
        double BW = omega2 - omega1;
        double prod = omega1 * omega2;
        Rational T = new Rational(new double[]{prod, 0.0d, 1.0d}, new double[]{0.0d, BW});
        AnalogPrototype retval = new AnalogPrototype();
        double A = 1.0d;
        for (int i = 0; i < this.sections.size(); i++) {
            Rational section = (Rational) this.sections.get(i);
            Rational Tsection = section.map(T);
            A *= Tsection.canonicalForm();
            int[] order = section.order();
            if (order[0] < 2 && order[1] < 2) {
                retval.addSection(Tsection);
            } else if (order[1] == 2) {
                Polynomial[] DT = lptobpFactors(section.denominator(), BW, prod);
                double[] dArr = new double[2];
                dArr = new double[]{0.0d, 1.0d};
                if (order[0] == 0) {
                    retval.addSection(new Rational(new Polynomial(dArr), DT[0]));
                    retval.addSection(new Rational(new Polynomial(dArr), DT[1]));
                } else if (order[0] == 1) {
                    retval.addSection(new Rational(new Polynomial(dArr), DT[0]));
                    double[] t2 = new double[3];
                    double[] tc = Tsection.numerator().coefficients();
                    for (int j = 0; j < 3; j++) {
                        t2[j] = tc[j + 1];
                    }
                    retval.addSection(new Rational(new Polynomial(t2), DT[1]));
                } else if (order[0] == 2) {
                    Polynomial[] NT = lptobpFactors(section.numerator(), BW, prod);
                    retval.addSection(new Rational(NT[0], DT[0]));
                    retval.addSection(new Rational(NT[1], DT[1]));
                }
            }
        }
        ((Rational) retval.sections.get(0)).timesEquals(A);
        return retval;
    }

    private static Polynomial[] lptobpFactors(Polynomial P, double BW, double prod) {
        Polynomial[] retval = new Polynomial[2];
        double[] p = P.coefficients();
        double b = p[1] / p[2];
        double discriminant = (b * b) - (4.0d * (p[0] / p[2]));
        Complex C;
        if (discriminant >= 0.0d) {
            double f1 = ((((-b) + Math.sqrt(discriminant)) / 2.0d) * BW) / 2.0d;
            C = new Complex(f1).plus(Complex.sqrt(new Complex((f1 * f1) - prod)));
            retval[0] = new Polynomial(new double[]{C.conjugate().times(C).real(), -2.0d * C.real(), 1.0d});
            f1 = ((((-b) - Math.sqrt(discriminant)) / 2.0d) * BW) / 2.0d;
            C = new Complex(f1).plus(Complex.sqrt(new Complex((f1 * f1) - prod)));
            retval[1] = new Polynomial(new double[]{C.conjugate().times(C).real(), -2.0d * C.real(), 1.0d});
        } else {
            Complex f12 = new Complex((-b) / 2.0d, Math.sqrt(-discriminant) / 2.0d).times(BW / 2.0d);
            Complex f2 = f12.times(f12).minus(prod);
            C = f12.plus(Complex.sqrt(f2));
            retval[0] = new Polynomial(new double[]{C.conjugate().times(C).real(), -2.0d * C.real(), 1.0d});
            C = f12.minus(Complex.sqrt(f2));
            retval[1] = new Polynomial(new double[]{C.conjugate().times(C).real(), -2.0d * C.real(), 1.0d});
        }
        return retval;
    }

    protected void computeTransferFunction() {
        this.f0T = new Rational(1.0d);
        for (int i = 0; i < this.sections.size(); i++) {
            this.f0T.timesEquals((Rational) this.sections.get(i));
        }
    }

    public Rational getTransferFunction() {
        if (this.f0T == null) {
            computeTransferFunction();
        }
        return new Rational(this.f0T);
    }

    protected Complex evaluate(double omega) {
        if (this.f0T == null) {
            computeTransferFunction();
        }
        return this.f0T.evaluate(new Complex(0.0d, omega));
    }

    protected double groupDelay(double omega) {
        if (this.f0T == null) {
            computeTransferFunction();
        }
        return this.f0T.groupDelay(omega);
    }

    public void print(PrintStream ps) {
        ps.println("AnalogPrototype: \n");
        for (int i = 0; i < this.sections.size(); i++) {
            ps.println("  section " + i + ":");
            ((Rational) this.sections.get(i)).print(ps);
        }
    }
}