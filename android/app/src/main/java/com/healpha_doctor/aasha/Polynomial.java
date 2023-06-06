package com.healpha_doctor.aasha;
import java.io.PrintStream;
import java.util.Arrays;

public class Polynomial {
    /* renamed from: a */
    protected double[] f2a;
    protected int order;

    public Polynomial(double[] a) {
        this.order = a.length - 1;
        this.f2a = new double[a.length];
        System.arraycopy(a, 0, this.f2a, 0, a.length);
    }

    public Polynomial(Polynomial B) {
        this.order = B.order;
        this.f2a = new double[(this.order + 1)];
        System.arraycopy(B.f2a, 0, this.f2a, 0, this.f2a.length);
    }

    public Polynomial(int order) {
        this.order = order;
        this.f2a = new double[(order + 1)];
        Arrays.fill(this.f2a, 0.0d);
    }

    public Polynomial(double c) {
        this.order = 0;
        this.f2a = new double[1];
        this.f2a[0] = c;
    }

    public void trim() {
        int n = 0;
        for (int i = this.order; this.f2a[i] == 0.0d; i--) {
            n++;
        }
        if (n > 0) {
            double[] b = new double[((this.order + 1) - n)];
            System.arraycopy(this.f2a, 0, b, 0, this.f2a.length - n);
            this.f2a = b;
            this.order -= n;
        }
    }

    public int order() {
        return this.order;
    }

    public double[] coefficients() {
        double[] retval = new double[(this.order + 1)];
        System.arraycopy(this.f2a, 0, retval, 0, this.order + 1);
        return retval;
    }

    public Polynomial plus(double c) {
        Polynomial retval = new Polynomial(this.order);
        System.arraycopy(this.f2a, 0, retval.f2a, 0, this.f2a.length);
        double[] dArr = retval.f2a;
        dArr[0] = dArr[0] + c;
        return retval;
    }

    public void plusEquals(double c) {
        double[] dArr = this.f2a;
        dArr[0] = dArr[0] + c;
    }

    public Polynomial plus(Polynomial B) {
        int i;
        Polynomial retval = new Polynomial(Math.max(this.order, B.order));
        for (i = 0; i <= this.order; i++) {
            retval.f2a[i] = this.f2a[i];
        }
        for (i = 0; i <= B.order; i++) {
            double[] dArr = retval.f2a;
            dArr[i] = dArr[i] + B.f2a[i];
        }
        return retval;
    }

    public void plusEquals(Polynomial B) {
        int i;
        double[] A = new double[Math.max(this.order, B.order)];
        for (i = 0; i <= this.order; i++) {
            A[i] = this.f2a[i];
        }
        for (i = 0; i <= B.order; i++) {
            A[i] = A[i] + B.f2a[i];
        }
        this.f2a = A;
        this.order = A.length - 1;
    }

    public Polynomial minus(double c) {
        return plus(-c);
    }

    public void minusEquals(double c) {
        plusEquals(-c);
    }

    public Polynomial minus(Polynomial B) {
        int i;
        Polynomial retval = new Polynomial(Math.max(this.order, B.order));
        for (i = 0; i <= this.order; i++) {
            retval.f2a[i] = this.f2a[i];
        }
        for (i = 0; i <= B.order; i++) {
            double[] dArr = retval.f2a;
            dArr[i] = dArr[i] - B.f2a[i];
        }
        return retval;
    }

    public void minusEquals(Polynomial B) {
        int i;
        double[] A = new double[Math.max(this.order, B.order)];
        for (i = 0; i <= this.order; i++) {
            A[i] = this.f2a[i];
        }
        for (i = 0; i <= B.order; i++) {
            A[i] = A[i] - B.f2a[i];
        }
        this.f2a = A;
        this.order = A.length - 1;
    }

    public Polynomial times(double c) {
        Polynomial retval = new Polynomial(this.order);
        for (int i = 0; i <= this.order; i++) {
            retval.f2a[i] = this.f2a[i] * c;
        }
        return retval;
    }

    public void timesEquals(double c) {
        for (int i = 0; i <= this.order; i++) {
            double[] dArr = this.f2a;
            dArr[i] = dArr[i] * c;
        }
    }

    public Polynomial times(Polynomial B) {
        double[] b = B.f2a;
        double[] prod = new double[((this.order + B.order) + 1)];
        Arrays.fill(prod, 0.0d);
        for (int i = 0; i <= B.order; i++) {
            for (int j = 0; j <= this.order; j++) {
                int i2 = i + j;
                prod[i2] = prod[i2] + (b[i] * this.f2a[j]);
            }
        }
        return new Polynomial(prod);
    }

    public void timesEquals(Polynomial B) {
        double[] b = B.f2a;
        double[] prod = new double[((this.order + B.order) + 1)];
        Arrays.fill(prod, 0.0d);
        for (int i = 0; i <= B.order; i++) {
            for (int j = 0; j <= this.order; j++) {
                int i2 = i + j;
                prod[i2] = prod[i2] + (b[i] * this.f2a[j]);
            }
        }
        this.f2a = prod;
        this.order += B.order;
    }

    public Polynomial over(double c) {
        double[] tmp = new double[(this.order + 1)];
        for (int i = 0; i < this.order + 1; i++) {
            tmp[i] = this.f2a[i] / c;
        }
        return new Polynomial(tmp);
    }

    public void overEquals(double c) {
        for (int i = 0; i < this.order + 1; i++) {
            double[] dArr = this.f2a;
            dArr[i] = dArr[i] / c;
        }
    }

    public Rational over(Polynomial B) {
        return new Rational(this, B);
    }

    public Polynomial derivative() {
        double[] tmp = new double[this.order];
        for (int i = 0; i < this.order; i++) {
            tmp[i] = ((double) (i + 1)) * this.f2a[i + 1];
        }
        return new Polynomial(tmp);
    }

    public double evaluate(double x) {
        double retval = this.f2a[this.order];
        for (int i = this.order - 1; i >= 0; i--) {
            retval = (x * retval) + this.f2a[i];
        }
        return retval;
    }

    public Complex evaluate(Complex c) {
        Complex retval = new Complex(this.f2a[this.order]);
        for (int i = this.order - 1; i >= 0; i--) {
            retval = retval.times(c).plus(this.f2a[i]);
        }
        return retval;
    }

    public double groupDelay(double omega) {
        if (this.order == 0) {
            return 0.0d;
        }
        Complex c = new Complex(0.0d, omega);
        return -derivative().evaluate(c).over(evaluate(c)).real();
    }

    public double discreteTimeGroupDelay(double Omega) {
        Complex c = Complex.exp(new Complex(0.0d, -Omega));
        Complex N = new Complex(this.f2a[this.order] * ((double) this.order));
        for (int i = this.order - 1; i >= 0; i--) {
            N = N.times(c).plus(this.f2a[i] * ((double) i));
        }
        return N.over(evaluate(c)).real();
    }

    public double[] reflectionCoefficients() {
        int i;
        double[] k = new double[this.order];
        double[] b = new double[(this.order + 1)];
        b[0] = 1.0d;
        for (i = 0; i < this.order; i++) {
            b[i + 1] = this.f2a[i + 1] / this.f2a[0];
        }
        double[] c = new double[this.order];
        for (i = this.order; i > 0; i--) {
            k[i - 1] = b[i];
            double scale = 1.0d - (k[i - 1] * k[i - 1]);
            Arrays.fill(c, 0.0d);
            for (int j = 0; j < i; j++) {
                c[j] = (b[j] - (k[i - 1] * b[i - j])) / scale;
            }
            System.arraycopy(c, 0, b, 0, i);
        }
        return k;
    }

    public void print(PrintStream ps) {
        int i = 0;
        while (i <= this.order) {
            if (i >= 0 && i < 10) {
                ps.println(i + "    " + this.f2a[i]);
            } else if (i >= 10 && i <= 100) {
                ps.println(i + "   " + this.f2a[i]);
            }
            i++;
        }
    }
}
