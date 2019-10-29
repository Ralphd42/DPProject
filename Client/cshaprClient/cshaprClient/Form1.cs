using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
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
            sm.ConnectToServer(this.textBox1);
        }
    }
}
