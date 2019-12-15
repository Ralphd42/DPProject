var net   = require('net'  );
var mysql = require('mysql');
 

const SQLServer = false;
// an array of the clients
var clientSockets = [];

//cimmunicationcharacters
var CommTerm  = '|';
var CommSplit = '+';

// input codes  -- codes received from a client
var inJoin = 'N';  //  
var Sorted = 'S';  // sorted String
// output to client 
var cMergeJob ='M'; // send merge request to client MTasKID+commaseparatedData|

//input codes from management console
var newSort ='M';  // new array to Merge Sort

// db connection info
const dbConn =Object.freeze({
    host: 'localhost',
    user: 'dpuser',
    password: 'abc123',
    database: 'DPProject'});

 
var server = net.createServer(function(socket)
{
    console.log("Server");
    socket.on('data', function(data)
	{
        if( data.length>0)
		{
            if( data.length>0)
		    {
                var datastring = data.toString('utf8').trim();
			    var ds =data.toString().trim();
                console.log("Rcvd call from client");
                console.log( data);
                console.log( datastring);
                console.log( ds);
                console.log("END Rcvd call from client");
			    if( 
                    datastring[0]== inJoin || 
				    datastring[1]== inJoin ||
			    	datastring   == inJoin || 
				    ds           == inJoin)
			    {
                    AddNewClient(socket);
                }else if (
                    datastring[0]== Sorted || 
                    datastring[1]== Sorted ||
                    datastring   == Sorted || 
                    ds           == Sorted)
                {
                    console.log("Recvd S");
                    console.log( data);
                    console.log( datastring);
                    console.log( ds);
                    console.log("END Rcvd S");
                    var parsObject ={};
                    parseInputSort(datastring, parsObject);
                    /*
                        parseout.TaskID =ID;
                        parseout.SortedData =SortedData;
                    
                    */

                    console.log("----Parsed-Sort-------------");
                    console.log(parsObject.TaskID);
                    console.log(parsObject.SortedData);
                    console.log("----DoneParsed-Sort-------------");
                    /*1) parse
                    2)   update database
                    3) merge
                     */
                      
                      

                }else if(
                    datastring[0]== newSort || 
                    datastring[1]== newSort ||
                    datastring   == newSort || 
                    ds           == newSort    )
                {
                    var ArrayText = datastring.substring(2,datastring.length-2);
                    console.log( ArrayText);
                    addMergeSortJob(ArrayText, socket );
                }
            }
        }
    });
});

function addMergeSortJob(  MSData, CmdConSocket)
{
    console.log("addMergeSortJob");
    const connection = mysql.createConnection(dbConn);
    connection.connect((err) => 
    {
        if (err)
        {
            console.log("Failed to connect For Job Creation");
            CmdConSocket.write("E Failed to Add Job|");
            CmdConSocket.destroy();
        }else
        {
            connection.query('INSERT INTO DPProject.Jobs Set ?',
                {JobType: 'M' ,MergeData:  MSData } ,
                (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to Insert into Job");
                    CmdConSocket.write("AE Failed to ADDJOB to DB|");
                }else
                {
                    console.log('Created  Merge job in DB:\n');
                    var JobID = results.insertId;
                    var jobDataArray = MSData.split(',').map(Number);
                    var lendata =jobDataArray.length;
                    var numclients =clientSockets.length;
                    var slicelen = lendata/ (numclients);
                    var extra = lendata%numclients;
                        // create tasks
                    for( i=0;i< numclients ;i++)
                    {
                        jobdata = jobDataArray.slice(i*slicelen,  (i+1)*slicelen  );
                        if(     i==(numclients-1))
                        {
                            jobdata = jobDataArray.slice(i*slicelen,  (i+1)*slicelen  +extra   );
                        }
                        var jobdataString = jobdata.join(",");
                        connection.query('INSERT INTO DPProject.Tasks Set ?',{
                            ClientID: 0 ,
                            JobID:JobID,
                            TaskData:  jobdataString },
                            (error, results, fields) => 
                            {
                                if(error) {
                                    console.log("Failed to Insert into Job");
                                    CmdConSocket.write("E Failed to Task to DB|");
                                }else
                                {
                                    var TaskID = results.insertId;
                                    var sortmsg =cMergeJob + TaskID.toString();
                                    sortmsg +=CommSplit;
                                    sortmsg += jobdataString;
                                    sortmsg += CommTerm;
                                    clientSockets[i].write(sortmsg);
                                }
                            }
                        );
                    }
                }
            });
        }
    });
    
}

/***
 * Handles adding new client to system 
 sNewClientSock new client id
 */
function AddNewClient( sNewClientSock)
{
    console.log("ANC");
    const connection = mysql.createConnection(dbConn);
    connection.connect(
    (err) => 
    {
        if (err)
        {
            console.log("Failed to connect");
            socket.write("AE Failed to connect|");
            socket.destroy();
        }else
        {
            connection.query('INSERT INTO DPProject.Clients Set ?',
            {IPAddress: sNewClientSock.remoteAddress  } ,
            (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to Insert");
                    socket.write("AE Failed to ADDCLIENT|");
                    socket.destroy();
                }
                //sNewClientSock.write("A"+ results.insertId.toString()+"|");
                sNewClientSock.write("M"+ results.insertId.toString()+"+23,5,72,12,8,1,45,33|");
                
                sNewClientSock.ClientID =results.insertId;
                clientSockets.push(sNewClientSock);
            });
        }
    });
}






/**
 * saveTaskData
 * Saves sorted data for a task to database
 * 
 * @param {*} csock  client socket sending the data
 * @param {*} TaskID the task ID of the this task
 * @param {*} SortedData the data in a comm separated string array
 */
function saveTaskData( csock, TaskID, SortedData )
{
    // write data to tasks 
    const connection = mysql.createConnection(dbConn);
    connection.connect(
    (err) => 
    {
        if (err)
        {
            console.log("Failed to connect");
            socket.write("AE Failed to connect|");
            socket.destroy();
        }else
        {
            connection.query('Update  INTO DPProject.Tasks Set ?',
            {IPAddress: sNewClientSock.remoteAddress  } ,
            (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to Insert");
                    socket.write("AE Failed to ADDCLIENT|");
                    socket.destroy();
                }
                sNewClientSock.write("A"+ results.insertId.toString()+"|");
                sNewClientSock.ClientID =results.insertId;
                //clientSockets.push(sNewClientSock);
            });
        }
    });
}


/**
 * 
 * @param {*} inputData       
 * @param {*} parseout     
 */
function parseInputSort( inputData, parseout)
{
    var startTID = inputData.indexOf(Sorted   );
    var endID   =  inputData.indexOf(CommSplit);
    var ID = inputData.substring (startTID+1,endID      );
    var dataEnd=  inputData.indexOf(CommTerm);
    var SortedData = inputData.substring(endID+1, dataEnd);
    parseout.TaskID =ID;
    parseout.SortedData =SortedData;
}
server.listen(9911, );
//"192.168.1.17"
function merge( arr1, arr2)
{





}


/*
FileReader fr = 
      new FileReader("C:\\Users\\pankaj\\Desktop\\test.txt"); 
  
    int i; 
    while ((i=fr.read()) != -1) 
      System.out.print((char) i); 
*/



