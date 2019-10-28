using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Sockets;
namespace cshaprClient
{
    class SocketManager
    {
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
