/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompanyexit.javaclient;

import java.net.*;
import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author ralph
 */
public class SockManagement {
    public final String IP="localhost";
    public final int PORT=9977;
    public SockManagement()
    {
        running =false;
    
    }
    // commands to send
    final char CommTerm  = '|';
    final char CommSplit = '+';

    ///console msgs
    
    //input codes from management console(MC)
    final char newSort ='M';  // new array to Merge Sort
    final char PI='P';

    //output codes to (MC)
    final char  DoneMerge ='D';
    final char  DonePi    ='E';
    final char  BUSY      ='B';
    final char  FAILED    ='F';
    boolean running =false;
    
    
    //socket classes
    DataInputStream dis = null;
    OutputStream outS =null;
    DataOutputStream dos =null;
    public String StartProc( boolean MS  , String filename  , String PiNum   ) {
        Thread readMessage = new Thread(new Runnable() {
            @Override
            public void run() {

                while (true) {
                    try {
                        // read the message sent to this client 
                        //  String msg = dis.readUTF(); 
                        char input =(char) dis.readByte();
                         
                        //process input
                        if(input ==DoneMerge)
                        {
                            input = (char) dis.readByte();
                            while(input !=CommTerm)
                            {
                                System.out.print(input);
                            }
                        }
                        if( input ==DonePi)
                        {
                            input = (char) dis.readByte();
                            System.out.print("PI Estimate");
                            while(input !=CommTerm)
                            {
                                System.out.print(input);
                            } 
                            System.out.println();
                        }
                        
                        if( input ==BUSY)
                        {
                            input = (char) dis.readByte();
                            System.out.print("Busy Try again later");
                            while(input !=CommTerm)
                            {
                                System.out.print(input);
                            } 
                            System.out.println();
                        }
                        if( input ==FAILED)
                        {
                            input = (char) dis.readByte();
                            System.out.print("Job Failed try again later");
                            while(input !=CommTerm)
                            {
                                System.out.print(input);
                            } 
                            System.out.println();
                        }
                        
                        
                        

                    } catch (IOException e) {
                        System.out.println("Error");
                    }
                }
            }
        });

        String retval = "";
        try {
            if(!running)
            {
                client = new Socket(IP, PORT);
                outS = client.getOutputStream();
                dos = new DataOutputStream(outS);
            }if(MS)
            {
                PrintWriter  pwMgmt = new PrintWriter(outS, false);
                pwMgmt.print('M');
                FileReader fr =  new FileReader(filename); 
                int i;
                while ((i=fr.read()) != -1)
                {
                    char iChar =(char)i;
                    // if comma or number sendq
                    System.out.println(iChar);
                    pwMgmt.print(iChar);
                    
                }
                pwMgmt.print(CommTerm);
                pwMgmt.flush();
            }
            else
            {
                PrintWriter  pwMgmt = new PrintWriter(outS, false);
                pwMgmt.print(PI+PiNum+CommTerm);
                pwMgmt.flush();
                
                //dos.writeBytes(PI+PiNum+CommTerm);
                //dos.flush();
            }
            if(!running){
                running =true;
                dis = new DataInputStream(client.getInputStream());
                readMessage.start();
            }
        } catch (IOException ex) {
            Logger.getLogger(SockManagement.class.getName()).log(Level.SEVERE, null, ex);
        }
        return retval;
    }
    
    
    
    
    private Socket client;
    
    private PrintWriter pw ;

    private InputStream is;
    private InputStreamReader ISReader;// = new InputStreamReader(input);
    BufferedReader Breader;
    
    
    
    
    
    
    public void SendFileToServer( String filename, String IP, Integer port)
    {
        try
        {
            PrintWriter pwMgmt ;
            Socket MgmSock = new Socket(IP,port );
            OutputStream mgmOs = MgmSock.getOutputStream();
            pwMgmt = new PrintWriter(mgmOs, false);
            pwMgmt.print('M');
            try
            {
                FileReader fr =  new FileReader(filename); 
                int i;
                while ((i=fr.read()) != -1)
                {
                    char iChar =(char)i;
                    // if comma or number sendq
                    System.out.println(iChar);
                    pwMgmt.print(iChar);
                    
                }
                pwMgmt.flush();
                
            }catch(IOException exp)
            {
                exp.toString();
            }
        }catch(IOException ex)
        {
            Logger.getLogger(SockManagement.class.getName()).log(Level.SEVERE, null, ex);
        
        }
    }
}
