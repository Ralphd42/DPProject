/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompanyexit.javaclient;

 
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author ralph
 * 
 * Class to handle managing application
 */
public class MgmtCons {
    DataInputStream dis = null;
    OutputStream outS =null;
    DataOutputStream dos =null;
    public String ProcL() {
        Thread readMessage = new Thread(new Runnable() {
            @Override
            public void run() {

                while (true) {
                    try {
                        // read the message sent to this client 
                        //  String msg = dis.readUTF(); 
                        char input =(char) dis.readByte();
                        System.out.println(input);
                        //process input
                        if(input =='A')
                        {
                            System.out.println(" ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ");
                            String ClientIDS = "";
                            input = (char) dis.readByte();
                            System.out.println(" Z ");
                            while(input !=' ')
                            {
                                System.out.println(" Z 2");
                                ClientIDS +=input;
                                System.out.println(" CLIENT input " +input);
                                System.out.println(" CLIENT QID " +ClientIDS);
                                System.out.println(" Z 3");
                                input = (char) dis.readByte();
                                System.out.println(" CLIENT IAF " +input);
                            }
                            System.out.println(" CLIENT ID " +ClientIDS);
                        }
                        if( input =='I')
                        {
                            String TaskID ="";
                            // get taskID
                            while (input != ' ')
                            {
                                TaskID +=input;
                                input = (char) dis.readByte();
                            }
                            String PILenString ="";
                            int PILen =0;
                            while (input != 'z')
                            {
                                PILenString +=input;
                                input = (char) dis.readByte();
                            }
                            long calLen = Long.parseLong(PILenString);
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
                                String res = "" + " " +tskIDSt +" " + 
                                Long.toString(rv.Hits) +"";
                                dos.writeBytes(res);
                            
                            }
                            catch(IOException exp){
                                //add exception logging
                            }
                        
                        }
                        
                        

                    } catch (IOException e) {
                        System.out.println("Error");
                    }
                }
            }
        });

        String retval = "";
        try {

            Socket client = new Socket("127.0.0.1", 1337);
            outS = client.getOutputStream();
            dos = new DataOutputStream(outS);

            dos.writeChar('J');
            dis = new DataInputStream(client.getInputStream());
            readMessage.start();

        } catch (IOException ex) {
            Logger.getLogger(SockManagement.class.getName()).log(Level.SEVERE, null, ex);
        }
        return retval;
    }


    
    
}
