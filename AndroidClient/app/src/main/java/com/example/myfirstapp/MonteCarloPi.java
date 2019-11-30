package com.example.myfirstapp;

public class MonteCarloPi {
    public static int DoMCPi( int numtries)
    {
        int retval =0;
        int hits =0;
        double  x;
        double  y;
        for( int i =0;i<numtries;++i)
        {
            x = Math.random();
            y = Math.random();
            if(hit(x,y))
            {
                ++hits;
            }
        }
        return retval;
    }
    public static boolean hit(double x, double y)
    {
        boolean retval =false;
        retval = ((x * x) + (y * y)) <= 1;
        return retval;
    }
}
