package com.healpha_doctor.aasha;

import java.io.PrintStream;

public class Rational {
    /* renamed from: D */
    private Polynomial f3D;
    /* renamed from: N */
    private Polynomial f4N;

    public Rational(double[] num, double[] denom) {
        this.f4N = new Polynomial(num);
        this.f3D = new Polynomial(denom);
    }

    public Rational(Polynomial N, Polynomial D) {
        this.f4N = new Polynomial(N);
        this.f3D = new Polynomial(D);
    }

    public Rational(Rational R) {
        this.f4N = new Polynomial(R.f4N);
        this.f3D = new Polynomial(R.f3D);
    }

    public Rational(double c) {
        this.f4N = new Polynomial(c);
        this.f3D = new Polynomial(1.0d);
    }

    public int[] order() {
        return new int[]{this.f4N.order(), this.f3D.order()};
    }

    public Polynomial numerator() {
        return new Polynomial(this.f4N);
    }

    public Polynomial denominator() {
        return new Polynomial(this.f3D);
    }

    public double canonicalForm() {
        int i;
        double scaleN = this.f4N.f2a[this.f4N.order];
        for (i = 0; i < this.f4N.f2a.length; i++) {
            double[] dArr = this.f4N.f2a;
            dArr[i] = dArr[i] / scaleN;
        }
        double scaleD = this.f3D.f2a[this.f3D.order];
        for (i = 0; i < this.f3D.f2a.length; i++) {
           double[] dArr = this.f3D.f2a;
            dArr[i] = dArr[i] / scaleD;
        }
        return scaleN / scaleD;
    }

    public void timesEquals(double A) {
        this.f4N.timesEquals(A);
    }

    public void timesEquals(Polynomial P) {
        this.f4N.timesEquals(P);
    }

    public void timesEquals(Rational R) {
        this.f4N.timesEquals(R.f4N);
        this.f3D.timesEquals(R.f3D);
    }

    public double evaluate(double x) {
        double num = this.f4N.evaluate(x);
        double denom = this.f3D.evaluate(x);
        if (denom != 0.0d) {
            return num / denom;
        }
        return 0.0d;
    }

    public Complex evaluate(Complex c) {
        Complex retval = new Complex(0.0d, 0.0d);
        Complex num = this.f4N.evaluate(c);
        Complex denom = this.f3D.evaluate(c);
        if (denom.abs() != 0.0d) {
            return num.over(denom);
        }
        return retval;
    }

    public Rational map(Rational S) {
        int i;
        Polynomial P = new Polynomial(this.f4N.f2a[this.f4N.order]);
        Polynomial T = new Polynomial(1.0d);
        for (i = this.f4N.order - 1; i >= 0; i--) {
            T = T.times(S.f3D);
            P = P.times(S.f4N).plus(T.times(this.f4N.f2a[i]));
        }
        Polynomial Q = new Polynomial(this.f3D.f2a[this.f3D.order]);
        T = new Polynomial(1.0d);
        for (i = this.f3D.order - 1; i >= 0; i--) {
            T = T.times(S.f3D);
            Q = Q.times(S.f4N).plus(T.times(this.f3D.f2a[i]));
        }
        if (this.f3D.order > this.f4N.order) {
            for (i = 0; i < this.f3D.order - this.f4N.order; i++) {
                P = P.times(S.f3D);
            }
        } else if (this.f4N.order > this.f3D.order) {
            for (i = 0; i < this.f4N.order - this.f3D.order; i++) {
                Q = Q.times(S.f3D);
            }
        }
        P.trim();
        Q.trim();
        return new Rational(P, Q);
    }

    public double residue(double pole) {
        return this.f4N.evaluate(pole) / this.f3D.derivative().evaluate(pole);
    }

    public Complex residue(Complex pole) {
        return this.f4N.evaluate(pole).over(this.f3D.derivative().evaluate(pole));
    }

    public double groupDelay(double omega) {
        return this.f4N.groupDelay(omega) - this.f3D.groupDelay(omega);
    }

    public double discreteTimeGroupDelay(double Omega) {
        return this.f4N.discreteTimeGroupDelay(Omega) - this.f3D.discreteTimeGroupDelay(Omega);
    }

    public void print(PrintStream ps) {
        ps.println("Numerator: ");
        this.f4N.print(ps);
        ps.println("Denominator: ");
        this.f3D.print(ps);
    }

    public static void main(String[] args) {
        double[] b = new double[]{1.0d};
        Rational R = new Rational(b, new double[]{1.0d, 2.0d, 2.0d, 1.0d});
        for (int i = 0; i < 100; i++) {
            double omega = ((double) i) / 25.0d;
            System.out.println(omega + "  " + R.evaluate(new Complex(0.0d, omega)).abs() + "   " + R.groupDelay(omega));
        }
    }
}
