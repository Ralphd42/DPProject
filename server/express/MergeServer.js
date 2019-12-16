var net   = require('net'  );
var mysql = require('mysql');
 
const SQLServer = false;
// an array of the clients
var clientSockets = [];
var ConsoleSocket;
const REQDB=false;

 //cimmunicationcharacters
var CommTerm  = '|';
var CommSplit = '+';

// input codes  -- codes received from a client
var inJoin   = 'N';  // new client  
var Sorted   = 'S';  // sorted String
var PIRETCNT = 'Q';

// output to client 
var cMergeJob ='M'; // send merge request to client MTasKID+commaseparatedData|
var CPIJob    ='P';
var ACKNS     ='A';  // acks new slave with a client ID


//input codes from management console(MC)
var newSort ='M';  // new array to Merge Sort
var PI='P';

//output codes to (MC)
var DoneMerge ='D';
var DonePi    ='E';

// db connection info
const dbConn =Object.freeze(
{
    host: 'ralphmysql.cqnc6tzk60xy.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'abcd1234',
    database: 'DPPROJ'
});
 
 



var server = net.createServer(function(socket)
{
    var MergeJobData ={};
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
                    var jbdataArr = MSData.split(',').map(Number);
                    saveTaskData( socket, parseout.TaskID, SortedData )
                    console.log("----Parsed-Sort-------------");
                    console.log(parsObject.TaskID);
                    console.log(parsObject.SortedData);
                    console.log("----DoneParsed-Sort-------------");
                }else if(
                    datastring[0]== newSort || 
                    datastring[1]== newSort ||
                    datastring   == newSort || 
                    ds           == newSort    )
                {
                    ConsoleSocket = socket;
                    var ArrayText = datastring.substring(2,datastring.length-2);
                    console.log( ArrayText);
                    addMergeSortJob(ArrayText, socket );
                }
            }
        }
    });
});

function AddPiJob( PiCount, CmdConSocket)
{
    console.log("addMergeSortJob");    
    const connection = mysql.createConnection(dbConn);
    var freeClients =freeClientCount();
    if(freeClients<1)
    {
        CmdConSocket.write("R Server busy try job later|");
        return;
    }

    var piJob =
    {
        jobID:0,
        jobcount:PiCount,
        socks:[],
        slicecount:0, 
        TasksUsed:0,    
        TasksRunning:0,
        numProc:0,
        hits:0

    }; // use PiJob.socks.pus
    

    connection.connect((err) => 
    {
        if (err)
        {
            console.log("Failed to connect For Job Creation");
            CmdConSocket.write("E Failed to Add Job|");
            CmdConSocket.destroy();
            return;
        }else
        {
            connection.query('INSERT INTO DPProject.Jobs Set ?',
                {JobType: 'P' ,PiCount:  PiCount } ,
                (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to Insert into Job");
                    CmdConSocket.write("AE Failed to ADDJOB to DB|");
                    return;
                }else
                {
                    var JobID = results.insertId;
                    piJob.jobID= JobID;
                    var numclients =freeClients;
                    var slicelen = PiCount/ (numclients);
                    var extra = PiCount%numclients;
                    var jobPiCount=0;
                    for( i=0;i< numclients ;i++)
                    {
                        jobPiCount = slicelen;
                        if( i==(numclients-1) )
                        {
                            jobPiCount += extra;
                        }
                    
                        connection.query('INSERT INTO DPProject.Tasks Set ?',{
                            ClientID: 0 ,
                            JobID:JobID,
                            TaskData:  jobdataString },
                            (error, results, fields) => 
                            {
                                if(error  && REQDB) 
                                {
                                    console.log("Failed to Insert into Job");
                                    if(REQDB)
                                    {
                                        CmdConSocket.write("E Failed to Task to DB|");
                                    }
                                }else
                                {
                                    var TaskID="";
                                    if(!error)
                                    {
                                        TaskID = results.insertId;
                                    }
                                    var sortmsg =piJob + TaskID.toString();
                                    sortmsg +=CommSplit;
                                    sortmsg +=jobPiCount.toString();
                                    sortmsg += CommTerm;
                                    piJob.socks.push(clientSockets[i]);
                                    clientSockets[i].WORKING =true;
                                    clientSockets[i].BUSY=true;
                                    clientSockets[i].write(sortmsg);
                                    clientSockets[i].TASKID = TaskID.toString();
                                    piJob.TasksUsed++;    
                                    piJob.TasksRunning++; 
                                    clientSockets[i].pJob =piJob;
                                }
                            });
                    }
                }
            });
            
        }





});
}













function addMergeSortJob(  MSData, CmdConSocket)
{
    console.log("addMergeSortJob");
    const connection = mysql.createConnection(dbConn);
    var freeClients =freeClientCount();
    if(freeClients<0)
    {
        CmdConSocket.write("R Server busy try job later|");
        return;
    }
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
                    MergeJobData.UnSorted = MSData;
                    MergeJobData.Running  = true;
                    MergeJobData.Sorted   =[];
                    MergeJobData.TasksUsed=0;    
                    MergeJobData.TasksRunning=0;
                    
                    console.log('Created  Merge job in DB:\n');
                    var JobID = results.insertId;
                    var jobDataArray = MSData.split(',').map(Number);
                    var lendata =jobDataArray.length;
                    var numclients =freeClients;
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
                                    if(REQDB)
                                    {
                                        CmdConSocket.write("E Failed to Task to DB|");
                                    }
                                }else
                                {
                                    var TaskID = results.insertId;
                                    var sortmsg =cMergeJob + TaskID.toString();
                                    sortmsg +=CommSplit;
                                    sortmsg += jobdataString;
                                    sortmsg += CommTerm;
                                    clientSockets[i].BUSY=true;
                                    clientSockets[i].write(sortmsg);
                                    MergeJobData.TasksUsed++;    
                                    MergeJobData.TasksRunning++; 
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
 Adds to database sends user and ID that might not be needed
 */
function AddNewClient( sNewClientSock)
{
    console.log("ANC");
    sNewClientSock.WORKING =false;
    sNewClientSock.BUSY    =false;
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
                // send back client ID and end here
                sNewClientSock.write("A"+ results.insertId.toString()+"|");
                //sNewClientSock.write("M"+ results.insertId.toString()+"+23,5,72,12,8,1,45,33|");
                
                sNewClientSock.ClientID =results.insertId;  // add client to internal list
                clientSockets.push(sNewClientSock);
            });
        }
    });
}
/**
 * saveTaskData  --  should Be merge task
 * Saves sorted data for a task to database
 * This writes and manages a task after merge is returned
 * 
 * @param {*} csock  client socket sending the data
 * @param {*} TaskID the task ID of the this task
 * @param {*} SortedData the data in a comm separated string array
 */
function saveTaskData( csock, TaskID, SortedData )
{
    
    // 1 PARSE THE DATA
    var prseObject ;
    parseInputSort(sortedData,prseObject);
    /*parseout.TaskID =ID;
    parseout.SortedData =SortedData; */
    // get array
    var newData = prseObject.SortedData.split(',').map(Number);
    if(MergeJobData.Sorted.length==0)
    {
        ConsoleSocket.MergeJobData.Sorted = newData;
    }
    else
    {
        ConsoleSocket.MergeJobData.Sorted =merge( newData,MergeJobData.Sorted );
    }
    
    // mark this task done
    MergeJobData.TasksRunning--;
    // check for done
    if( MergeJobDataTasksRunning<=0)
    {
        ReturnMergeSortJob(MergeJobData.Sorted);
    }


    // write data to tasks 
    const connection = mysql.createConnection(dbConn);
    connection.connect(
    (err) => 
    {
        if (err)
        {
            console.log("Failed to connect TO DB");
            console.log(err);
            if(REQDB)
            {
                socket.write("AE Failed to connect|");
                socket.destroy();
            }
        }
        else
        {
            connection.query(
                'Update DPProj.Tasks set SortedData=? CompleteTime=now() where TaskID=?',
            [   newData,   parseout.TaskID       ] ,
            (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to UPDATE A TASK");
                    if(REQDB)
                    {
                        socket.write("E FAILED TO UPDATE A TASK|");
                        socket.destroy();
                    }
                }
            });
        }
        csock.BUSY=false;
    });
}

/**
 * savePITaskData  --   
 * Saves PI data
 * This writes and manages a task and job after pi
 * 
 * @param {*} csock  client socket sending the data
 * @param {*} TaskID the task ID of the this task
 * @param {*} Hits the number of hits returned
 */
function savePITaskData( csock, TaskID, Hits )
{
    csock.pJob.TasksRunning--;
    csock.pJob.hits+=Hits;
    csock.BUSY=false;
    // check for done
    if( csock.pJob<=0)
    {
        ReturnPIJob(csock.pJob);
    }
    const connection = mysql.createConnection(dbConn);
    connection.connect(
    (err) => 
    {
        if (err)
        {
            console.log("Failed to connect TO DB");
            console.log(err);
            if(REQDB)
            {
                socket.write("AE Failed to connect|");
                socket.destroy();
                return;
            }
        }
        else
        {
            connection.query(
                'Update DPProj.Tasks set Hits=? CompleteTime=now() where TaskID=?',
            [   newData,   TaskID       ] ,
            (error, results, fields) => 
            {
                if(error) 
                {
                    console.log("Failed to UPDATE A PI TASK");
                    if(REQDB)
                    {
                        socket.write("E FAILED TO UPDATE A TASK|");
                        socket.destroy();
                        return;
                    }
                }
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
    var res =[];
    var leftIndex = 0, rightIndex = 0;
    var resultArray;
  // We will concatenate values into the resultArray in order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // move left array cursor
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++; // move right array cursor
    }
  }
  return resultArray;}


/**
 * Send Merge job back to Client
 */
function ReturnMergeSortJob(lsttskData)
{
    console.log("ReturnSortJob");
    // send data back to client first


    var output = sortmsg.join(",");
     
    ConsoleSocket.Write(DoneMerge);
    ConsoleSocket.write(sortmsg);
    ConsoleSocket.write(CommTerm);





    // job i done 

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
                    MergeJobData.UnSorted = MSData;
                    MergeJobData.Running  = true;
                    MergeJobData.Sorted   =[];
                    MergeJobData.TasksUsed=0;    
                    MergeJobData.TasksRunning=0;
                    
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
                                    MergeJobData.TasksUsed++;    
                                    MergeJobData.TasksRunning++; 
                                }
                            }
                        );
                    }
                }
            });
        }
    });
    
}

function ReturnMergeSortJob_NA()
{
    console.log("ReturnSortJob");
    // send data back to client first
    var output = sortmsg.join(",");
    ConsoleSocket.Write(DoneMerge);
    ConsoleSocket.write(sortmsg);
    ConsoleSocket.write(CommTerm);
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
                    MergeJobData.UnSorted = MSData;
                    MergeJobData.Running  = true;
                    MergeJobData.Sorted   =[];
                    MergeJobData.TasksUsed=0;    
                    MergeJobData.TasksRunning=0;
                    
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
                                    MergeJobData.TasksUsed++;    
                                    MergeJobData.TasksRunning++; 
                                }
                            }
                        );
                    }
                }
            });
        }
    });
}

function ReturnPiJob( PiInfo)
{
    console.log("ReturnPIJob");
    // send data back to client first
    var szJob   = PiInfo.jobcount;
    var numHits = PiInfo.hits;

    var pi = numHits/szJob   * 4.00000;


    ConsoleSocket.Write(DoneMerge);
    ConsoleSocket.write(pi.toString());
    ConsoleSocket.write(CommTerm);
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
                    MergeJobData.UnSorted = MSData;
                    MergeJobData.Running  = true;
                    MergeJobData.Sorted   =[];
                    MergeJobData.TasksUsed=0;    
                    MergeJobData.TasksRunning=0;
                    
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
                                    MergeJobData.TasksUsed++;    
                                    MergeJobData.TasksRunning++; 
                                }
                            }
                        );
                    }
                }
            });
        }
    });
}










freeClientCount()
{
    var freecount=0;
    clientSockets.forEach(function (arrayItem) {
        if(arrayItem.BUSY)
        {
            freecount++;
        }
    });
    return freecount;
}