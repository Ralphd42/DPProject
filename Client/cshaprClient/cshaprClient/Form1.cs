using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace cshaprClient
{
    public partial class Form1 : Form
    {
        SocketManager sm = new SocketManager();
        public Form1()
        {
            InitializeComponent();
           
        }

        private void button1_Click(object sender, EventArgs e)
        {
           // this.textBox1.Text =SocketManager.test();
        }

        private void btnClient_Click(object sender, EventArgs e)
        {
            //this.textBox1.Text = SocketManager.GetCLients();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
         //   sm.ConnectToServer(this.textBox1);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Enabled = false;
            MonteCarloPi p = new MonteCarloPi();
            double dmax = -9999;
            double dmin = 999999;
            long mx =   int.MaxValue;
            mx = mx * 10;
            for (long i = 0; i < mx; ++i)
            {
                double rand = p.GetRandomNumber(0, 1);
                if (rand > dmax)
                {
                    dmax = rand;
                    if (i > int.MaxValue)
                    {
                        this.textBox1.Text = "dmax = " + dmax.ToString() + " dmin = " + dmin.ToString();
                        Thread.Sleep(1);
                    }
                }
                if (rand < dmin)
                {
                    dmin = rand;
                    if (i > int.MaxValue)
                    {
                        this.textBox1.Text = "dmax = " + dmax.ToString() + " dmin = " + dmin.ToString();
                        Thread.Sleep(1);
                    }
                }
            }
            this.textBox1.Text = "dmax = " + dmax.ToString() + " dmin = " + dmin.ToString();

            this.Enabled = true;
        }
    }
}
