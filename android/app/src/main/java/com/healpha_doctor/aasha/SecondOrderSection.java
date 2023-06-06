package com.healpha_doctor.aasha;


import java.io.PrintStream;
import java.text.DecimalFormat;

public class SecondOrderSection {
    double a1;
    double a2;
    double b0;
    double b1;
    double b2;
    double s1;
    double s2;

    public SecondOrderSection(double b0, double b1, double b2, double a1, double a2) {
        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;
        this.a1 = a1;
        this.a2 = a2;
        initialize();
    }

    public void initialize() {
        this.s1 = 0.0d;
        this.s2 = 0.0d;
    }

    public double filter(double x) {
        double s0 = (x - (this.a1 * this.s1)) - (this.a2 * this.s2);
        double retval = ((this.b0 * s0) + (this.b1 * this.s1)) + (this.b2 * this.s2);
        this.s2 = this.s1;
        this.s1 = s0;
        return retval;
    }

    public void filter(double[] x, double[] y) {
        int n = Math.min(x.length, y.length);
        for (int i = 0; i < n; i++) {
            double s0 = (x[i] - (this.a1 * this.s1)) - (this.a2 * this.s2);
            y[i] = ((this.b0 * s0) + (this.b1 * this.s1)) + (this.b2 * this.s2);
            this.s2 = this.s1;
            this.s1 = s0;
        }
    }

    public void print(PrintStream ps) {
        DecimalFormat formatter = new DecimalFormat("##0.00000");
        ps.println("  coefficients: \n");
        ps.println("    b0: " + formatter.format(this.b0));
        ps.println("    b1: " + formatter.format(this.b1));
        ps.println("    b2: " + formatter.format(this.b2));
        ps.println();
        ps.println("    a1: " + formatter.format(this.a1));
        ps.println("    a2: " + formatter.format(this.a2));
        ps.println("\n  states:  \n");
        ps.println("    s1: " + formatter.format(this.s1));
        ps.println("    s2: " + formatter.format(this.s2));
    }
}
