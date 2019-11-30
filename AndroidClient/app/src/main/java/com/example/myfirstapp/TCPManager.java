package com.example.myfirstapp;

import android.widget.TextView;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class TCPManager  {
    public TCPManager( TextView Status)
    {
        StatusView =  Status;
    }

    public final String IPAddress = "192.168.1.17";//"127.0.0.1"; //
    public final int Port = 9911;
    public char CommTerm  = '|';
    public char CommSplit = '+';
    public char arrSplit  = ',';

    // objects used by entire communication
    private Socket client;
    private DataInputStream dis  = null;
    private OutputStream outS = null;
    private DataOutputStream dos  = null;
    private PrintWriter pw ;

    private InputStream is;
    private InputStreamReader ISReader;// = new InputStreamReader(input);
    BufferedReader Breader;
    // control variables

    private boolean running;  // use this to stop listening


    //Sending Characters
    public final char JoinDistProc = 'N'; // JOIN DISTRIBUTED PROCESSING
    public final char SortedData   = 'S'; // return a soreted array
    // receving chars
    char MS ='M'; //Merge Sort request

    private TextView StatusView;

    private Thread readMessage;

    public void ConnectToServer()
    {
        Thread MainProcessor = new Thread(new Runnable() {
            @Override
            public void run()
            {
                StatusView.setText("CTS1");
                try
                {
                    client = new Socket(IPAddress, Port);
                    StatusView.setText("CTS2");
                    outS = client.getOutputStream();
                    StatusView.setText("CTS3");
                    pw = new PrintWriter(outS, true);
                    StatusView.setText("CTS4");
                    pw.print(JoinDistProc);
                    StatusView.setText("CTS5");
                    pw.print(CommTerm);
                    StatusView.setText("CTS6");
                    pw.flush();
                    StatusView.setText("CTS7");
                    StatusView.setText(StatusView.getText() + "Flushed ");
                    is = client.getInputStream();
                    ISReader = new InputStreamReader(is);
                    running = true;
                    readMessage = new Thread(new SockListen());
                    readMessage.start();
                }catch(Exception exp)
                {
                    String msg ="- AAA - \n";
                    msg += exp.getMessage();
                    msg+=exp.toString();
                    StatusView.setText(msg);
                        //exp.printStackTrace();

                }
            }
        });
        MainProcessor.start();
    }

    public class SockListen implements Runnable{
        @Override
        public void run() {
            while(running)
            {
                try
                {
                    char command=(char)ISReader.read();
                    // do stuff based on char
                    // recv req for merge sort

                    if(command ==MS)
                    {
                        // consume the space char
                        ISReader.read();
                        char input = (char) ISReader.read();
                        String StrtaskID ="";
                        while (input != CommTerm && input != CommSplit)
                        {
                            // get taskID
                            StrtaskID += input;
                            input=(char) ISReader.read();
                        }
                        if(input==CommSplit){
                            StringBuilder sb = new StringBuilder();
                            while (input!=CommTerm)
                            {
                                sb.append(input);
                                input=(char) ISReader.read();
                            }
                            // do the merge
                            MergeSort st = new MergeSort();
                            String sorted =st.Sort(sb.toString()         );
                            // return sorted
                            pw.print( SortedData);
                            pw.print( StrtaskID );
                            pw.print( CommSplit );
                            pw.print( sorted    );
                            pw.print( CommTerm  );
                            pw.flush();
                            StatusView.setText(sorted);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
