using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cshaprClient
{
    class MonteCarloPi
    {
        public int NumAttemps{get;set;}
        public int hits      {get;set;}
        public void runMC()
        {
            for( int i=0; i<NumAttemps; ++i)
            {
                double x = 0;
                double y = 0;
                //x = Math.
            
            
            
            
            
            }
        }
        public double GetRandomNumber(double minimum, double maximum)
        {
            Random random = new Random();
            return random.NextDouble() * (maximum - minimum) + minimum;
        }
    }
}
