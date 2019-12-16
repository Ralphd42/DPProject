/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cndln;

/**
 *
 * @author ralph
 */
public class PICalc {
    
    public class PIRet
    {
        public double pidiv4;
        public double PIest;
        public long tries;
        public long Hits;
    }
    public PICalc( int tskID, long clcCount)
    {
        taskID =tskID;
        calcCount =clcCount;
    }
    private int taskID;
    private long calcCount; //number of items to calculate
    
    public PIRet numhits ()
    {
        PIRet retval =new PIRet();
        double randX;
        double randY;
        long hits =0;
        for( long i =0;i<calcCount;++i)
        {
            randX = Math.random();
            randY = Math.random();
            if( (Math.pow(randY, 2.0) + Math.pow(randX,2.0)   )<=1)
            {
                ++ hits;
            }
        
        
        
        }
        retval.PIest =4.0 * (double)hits/(double) calcCount;
        retval.pidiv4 = (double)hits/(double) calcCount;
        retval.tries =calcCount;
        retval.Hits = hits;
        
        return retval;
    }
    
}
