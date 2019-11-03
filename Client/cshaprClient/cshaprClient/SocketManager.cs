using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Sockets;
using System.Threading;
namespace cshaprClient
{
    class SocketManager
    {
        const int bufsz = 10025;
        System.Windows.Forms.TextBox tb;
        TcpClient tcpC = new  TcpClient();
        NetworkStream ss = default(NetworkStream);
        private bool running = false;
        bool connected = false;
        public void ConnectToServer(System.Windows.Forms.TextBox txtBx)
        {
            connected = true;
            tb= txtBx;
            tcpC.Connect("127.0.0.1",1337);
            ss = tcpC.GetStream();
            byte[] oByte = System.Text.Encoding.ASCII.GetBytes("L");
            ss.Write(oByte, 0, oByte.Length);
            ss.Flush();
            
            Thread msgLoop = new Thread(responseWatch);
            running = true;
            msgLoop.Start();

        }
        string readData = "";
        private void responseWatch()
        {
            while (running)
            {
                ss = tcpC.GetStream();
                int buffSize = 0;
               
                buffSize = tcpC.ReceiveBufferSize;
                byte[] inStream = new byte[buffSize];
                //ss.Read(inStream, 0, buffSize);
                ss.Read(inStream, 0, buffSize);
                string returndata = System.Text.Encoding.ASCII.GetString(inStream);
                readData =   "" + returndata;
                ShowOutput();
            }
        }

        public string sendMsg(string msg)
        {
            string retval = "SENT";
            if (running && connected)
            {
                byte[] outStream = System.Text.Encoding.ASCII.GetBytes(msg);
                ss.Write(outStream, 0, outStream.Length);
                ss.Flush();
            }
            else
            {
                retval = "Not ready for messages";
            }
            return retval;
        }







        private void ShowOutput()
        {
            if (this.tb.InvokeRequired)
                this.tb.Invoke(new System.Windows.Forms.MethodInvoker(ShowOutput));
            else
                tb.Text = tb.Text + Environment.NewLine + "" + readData;
        } 






        public static string test()
        {
            string retval = string.Empty;
            Socket soc = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            System.Net.IPAddress ipAdd = System.Net.IPAddress.Parse("127.0.0.1");
            System.Net.IPEndPoint remoteEP = new IPEndPoint(ipAdd, 1337);
            soc.Connect(remoteEP);
            byte[] byData = System.Text.Encoding.ASCII.GetBytes("|1");
            soc.Send(byData);
            byte[] buffer = new byte[1024];
            int iRx = soc.Receive(buffer);
            char[] chars = new char[iRx];
            System.Text.Decoder d = System.Text.Encoding.UTF8.GetDecoder();
            int charLen = d.GetChars(buffer, 0, iRx, chars, 0);
            System.String recv = new System.String(chars);

            retval += recv;
            byData = System.Text.Encoding.ASCII.GetBytes("|2");
            soc.Send(byData);
            buffer = new byte[1024];
            iRx = soc.Receive(buffer);
            chars = new char[iRx];
            d = System.Text.Encoding.UTF8.GetDecoder();
            charLen = d.GetChars(buffer, 0, iRx, chars, 0);
            recv = new System.String(chars);
            soc.Close();



            retval += recv;
            return retval;
        }
        public static string GetCLients()
        {
             
            string retval = string.Empty;
            Socket soc = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            System.Net.IPAddress ipAdd = System.Net.IPAddress.Parse("127.0.0.1");
            System.Net.IPEndPoint remoteEP = new IPEndPoint(ipAdd, 1337);
            soc.Connect(remoteEP);
            byte[] byData = System.Text.Encoding.ASCII.GetBytes("L");
            soc.Send(byData);
            byte[] buffer = new byte[1024];
            int iRx = soc.Receive(buffer);
            char[] chars = new char[iRx];
            System.Text.Decoder d = System.Text.Encoding.UTF8.GetDecoder();
            int charLen = d.GetChars(buffer, 0, iRx, chars, 0);
            System.String recv = new System.String(chars);

            retval = recv;
            //soc.Close();
            return retval;
        
        }

    }
}
