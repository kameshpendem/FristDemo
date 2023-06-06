package com.healpha_doctor.aasha;


import java.text.DecimalFormat;

public class Complex {
    private double imag;
    private double real;

    public Complex(double real, double imag) {
        this.real = real;
        this.imag = imag;
    }

    public Complex(double real) {
        this.real = real;
        this.imag = 0.0d;
    }

    public static Complex ComplexFromPolar(double r, double phi) {
        return new Complex(Math.cos(phi) * r, Math.sin(phi) * r);
    }

    public static Complex add(double a, Complex c) {
        return new Complex(c.real + a, c.imag);
    }

    public static Complex add(Complex c, double a) {
        return add(a, c);
    }

    public static Complex subtract(Complex c, double a) {
        return new Complex(c.real - a, c.imag);
    }

    public static Complex subtract(double a, Complex c) {
        return new Complex(a - c.real, c.imag);
    }

    public static Complex unaryMinus(Complex c) {
        return new Complex(-c.real, -c.imag);
    }

    public static Complex multiply(double a, Complex c) {
        return new Complex(c.real * a, c.imag * a);
    }

    public static Complex multiply(Complex c, double a) {
        return multiply(a, c);
    }

    public static Complex add(Complex c1, Complex c2) {
        return new Complex(c1.real + c2.real, c1.imag + c2.imag);
    }

    public static Complex subtract(Complex c1, Complex c2) {
        return new Complex(c1.real - c2.real, c1.imag - c2.imag);
    }

    public static Complex multiply(Complex c1, Complex c2) {
        return new Complex((c1.real * c2.real) - (c1.imag * c2.imag), (c1.real * c2.imag) + (c1.imag * c2.real));
    }

    public static Complex divide(Complex c, double a) {
        return new Complex(c.real / a, c.imag / a);
    }

    public static Complex divide(double a, Complex c) {
        double scale = (c.real * c.real) + (c.imag * c.imag);
        return new Complex(c.real / scale, (-c.imag) / scale);
    }

    public static Complex divide(Complex c1, Complex c2) {
        double scale = (c2.real * c2.real) + (c2.imag * c2.imag);
        return new Complex(((c1.real * c2.real) + (c1.imag * c2.imag)) / scale, ((c1.imag * c2.real) - (c1.real * c2.imag)) / scale);
    }

    public static Complex sqrt(Complex c) {
        return ComplexFromPolar(Math.sqrt(abs(c)), angle(c) / 2.0d);
    }

    public static double abs(Complex c) {
        return Math.sqrt((c.real * c.real) + (c.imag * c.imag));
    }

    public static double angle(Complex c) {
        return Math.atan2(c.imag, c.real);
    }

    public static Complex exp(Complex c) {
        double r = Math.exp(c.real);
        return new Complex(Math.cos(c.imag) * r, Math.sin(c.imag) * r);
    }

    public static Complex conjugate(Complex c) {
        return new Complex(c.real, -c.imag);
    }

    public double real() {
        return this.real;
    }

    public double imag() {
        return this.imag;
    }

    public double abs() {
        return abs(this);
    }

    public double angle() {
        return angle(this);
    }

    public Complex times(Complex c) {
        return multiply(this, c);
    }

    public Complex times(double a) {
        return multiply(this, a);
    }

    public Complex conjugate() {
        return conjugate(this);
    }

    public Complex plus(Complex c) {
        return add(this, c);
    }

    public Complex plus(double a) {
        return add(this, a);
    }

    public Complex minus(Complex c) {
        return subtract(this, c);
    }

    public Complex minus(double a) {
        return subtract(this, a);
    }

    public Complex over(double a) {
        return divide(this, a);
    }

    public Complex over(Complex c) {
        return divide(this, c);
    }

    public void plusEquals(double a) {
        this.real += a;
    }

    public void plusEquals(Complex c) {
        this.real += c.real;
        this.imag += c.imag;
    }

    public void minusEquals(double a) {
        this.real -= a;
    }

    public void minusEquals(Complex c) {
        this.real -= c.real;
        this.imag -= c.imag;
    }

    public void timesEquals(double a) {
        this.real *= a;
        this.imag *= a;
    }

    public void timesEquals(Complex c) {
        double tmp = (this.real * c.real) - (this.imag * c.imag);
        this.imag = (this.real * c.imag) + (this.imag * c.real);
        this.real = tmp;
    }

    public void divideEquals(double a) {
        this.real /= a;
        this.imag /= a;
    }

    public void divideEquals(Complex c) {
        double scale = (c.real * c.real) + (c.imag * c.imag);
        double tmp = (c.real * this.real) + (c.imag * this.imag);
        this.imag = (c.real * this.imag) - (c.imag * this.real);
        this.real = tmp;
        divideEquals(scale);
    }

    public String toString() {
        DecimalFormat formatter = new DecimalFormat("0.00000E00");
        return formatter.format(this.real) + "  +  i * " + formatter.format(this.imag);
    }
}
