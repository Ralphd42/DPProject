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
                    console.log("New Client " + datastring    );
				    console.log(socket.remoteAddress);
				    const connection = mysql.createConnection(dbConn);
                    connection.connect((err) => {
                        if (err)
                        {
                            console.log("Failed to connect");
                            socket.write("AE Failed to connect|");
                            socket.destroy();
                        }else
                        {

                            console.log('Connected! to DB');
                            console.log(datastring[0]);
                            console.log(datastring[1]);
                            // add client

                            //socket.write("M+12342+123,45,37,2,5,221|");
                        }
                    });
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
                    ds           == newSort
                    )
                {

                    var ArrayText = datastring.substring(2,datastring.length-2);
                    // arrayText = the array - all extras
                    console.log( ArrayText);
                    //add to database
                    //split up and send to clients
                        // build tasks
                        // loop connections
                    //?? acknowledge
                    /* Add Job to Database */
                    addMergeSortJob(ArrayText, socket );






                }
            }
        }
    });
});

function addMergeSortJob(  MSData, CmdConSocket)
{
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

function AddNewClient( sNewClientSock)
{
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
                sNewClientSock.write("A"+ results.insertId.toString()+"|");
                sNewClientSock.ClientID =results.insertId;
                clientSockets.push(sNewClientSock);
            });
        }
    });
}


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
server.listen(9911);