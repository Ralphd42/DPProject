var net   = require('net'  );
var mysql = require('mysql');
 

const SQLServer = false;
// an array of the clients
var clientSockets = [];

//cimmunicationcharacters
var CommTerm  = '|';
var CommSplit = '+';

// input codes  -- codes received from a client
var inJoin = 'N';
var Sorted = 'S';  // sorted String
// db connection info
const dbConn =Object.freeze({
    host: 'localhost',
    user: 'dpuser',
    password: 'abc123',
    database: 'DPProject'});

console.log("1-");
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
                            socket.write("M+12342+123,45,37,2,5,221|");
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
                    /*1) parse
                    2)   update database
                    3) merge
                     */
                    

                }
            }
        }
    });
});
server.listen(9911);