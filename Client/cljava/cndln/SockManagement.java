/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cndln;

import java.net.*;
import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author ralph
 */
public class SockManagement {
    //cimmunicationcharacters
    final char CommTerm  = '|';
    final char CommSplit = '+';

    // output codes  -- codes sent from a client
    final char inJoin   = 'N';  // new client  
    final char Sorted   = 'S';  // sorted String
    final char PIRETCNT = 'Q';  // pi hits
    final char BUSY     = 'B';  // B
    final char AVAIL    = 'V';

    //input codes -- codes recvd from server
    final char cMergeJob ='M'; // send merge request to client MTasKID+commaseparatedData|
    final char CPIJob    ='P';
    final char ACKNS     ='A';  // acks new slave with a client ID
    private boolean Running;
    public void SENDBUSYMSG()
    {
        Running=false;
        try{
            dos.writeBytes(BUSY+CommTerm);
        }
        catch(IOException exp){
            //add exception logging
        }


    }

    DataInputStream  dis  = null;
    OutputStream     outS = null;
    DataOutputStream dos  = null;
    public String PROCINPUT() {
        Thread readMessage = new Thread(new Runnable() {
            @Override
            public void run() {

                while (true) {
                    try {
                        char input =(char) dis.readByte();
                        System.out.println(input);
                        //process input
                        if(input ==CPIJob)
                        {
                            System.out.println("PI CALC");
                            String TaskID ="";
                            // get taskID
                            while (input != CommSplit)
                            {
                                TaskID +=input;
                                input = (char) dis.readByte();
                            }




                            String strTries = "";
                            input = (char) dis.readByte();
                            
                            while(input !=CommTerm)
                            {
                                strTries +=input;
                                input = (char) dis.readByte();
                            }
                            long calLen = Long.parseLong(strTries);
                            int tskID = Integer.parseInt(TaskID);
                            //convert string to long and send on to 
                            PICalc piC = new PICalc( 
                                 tskID,calLen
                            );
                            PICalc.PIRet rv =piC.numhits();
                            // send back to socetHere
                            /* return taskID numhits         */
                            try{
                                /*build output string*/
                                String tskIDSt = Integer.toString(tskID);
                                String res = PIRETCNT  +tskIDSt +CommSplit + 
                                Long.toString(rv.Hits) +CommTerm;
                                dos.writeBytes(res);
                            }
                            catch(IOException exp){
                                //add exception logging
                            }
                        }
                        if( input==cMergeJob)
                        {
                            //save for later
                            // copy from adroid
                        
                        }
                        
                        

                    } catch (IOException e) {
                        System.out.println("Error");
                    }
                }
            }
        });

        String retval = "";
        try {

            client = new Socket("127.0.0.1", 1337);
            outS = client.getOutputStream();
            dos = new DataOutputStream(outS);

            dos.writeChar('N');
            dis = new DataInputStream(client.getInputStream());
            readMessage.start();

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
