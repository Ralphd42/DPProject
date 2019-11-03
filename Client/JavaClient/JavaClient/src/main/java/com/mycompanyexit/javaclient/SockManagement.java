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
    DataInputStream dis=null;
    
    
    
public String ProcL()
{
    Thread readMessage = new Thread(new Runnable()  
        { 
            @Override
            public void run() { 
  
                while (true) { 
                    try { 
                        // read the message sent to this client 
                      //  String msg = dis.readUTF(); 
                      
                        System.out.println((char)dis.readByte());
                        //System.out.println(msg); 
                        
                    } catch (IOException e) { 
                        System.out.println("Error");
                    } 
                } 
            } 
        }); 
    
    
    
    
    String retval = "";
    try {
        
        Socket client = new Socket("127.0.0.1", 1337);
         OutputStream outS = client.getOutputStream();
         DataOutputStream dos = new DataOutputStream(outS);
         
         dos.writeChar('L');//   .writeUTF("L");
        // InputStream inFromServer = client.getInputStream();
        dis = new DataInputStream(client.getInputStream()); 
        //BufferedReader rd = new BufferedReader(new InputStreamReader(inFromServer)); 
         //retval = in.//in.readUTF();
        //retval =rd.readLine();
        readMessage.start();
        
    } catch (IOException ex) {
        Logger.getLogger(SockManagement.class.getName()).log(Level.SEVERE, null, ex);
    }
    return retval;
}
    
    
    
    
    
    
    
}
