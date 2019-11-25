var net = require('net');
const SQLServer = false;
const PISIZE =100000;
var mysql = require('mysql');
var cntr =0;
console.log("Server Started");
var clientSockets=[];

var server = net.createServer(function(socket)
{
	socket.on('data', function(data)
	{
		if( data.length>0)
		{
			var datastring = data.toString('utf8').trim();
			var ds =data.toString().trim();
			 
			if( datastring[0]=='N'|| 
				datastring[1]=="N"||
				datastring   =="N"|| 
				ds           =="N")
			{
				console.log("New Client " + datastring    );
				console.log(socket.remoteAddress);
				const connection = mysql.createConnection(
				{
					host: 'localhost',
					user: 'dpuser',
					password: 'abc123',
					database: 'DPProject'}
				);
				
				connection.connect((err) => {
					if (err){
						console.log("Failed to connect");
						socket.write("AE Failed to connect|");
					}
					console.log('Connected!');
				});
				//var insQry =(IPAddress )VALUES ('')";
				
				connection.query('INSERT INTO DPProject.Clients Set ?',{IPAddress: socket.remoteAddress  } ,(error, results, fields) => {
					if(error) {
						console.log("Failed to Insert");
						socket.write("AE Failed to ADDCLIENT|");
					}
					console.log('Data received from Db:\n');
					console.log(results.insertId);
					socket.write("A"+ results.insertId.toString()+"|");
					socket.ClientID =results.insertId;
					clientSockets.push(socket);
				});
				
				





			}

			else if( datastring[0]=='L'|| 
				datastring[1]=="L"||
				datastring   =="L"|| 
				ds           =="L")
			{
				var clientList ="";
				if(SQLServer)
				{
					var config = 
					{
						user: 'enterprise_rw',
						password: '*1RW',
						server: 'T1DNDB001.nyserdaweb.ny.gov', 
						database: 'ENTERPRISE' ,
						connectionTimeout: 99999
					};
					var sql = require("mssql");
					sql.connect(config, function (err) 
					{
						if (err)
						{ 
							console.log(err);
						}
						var request = new sql.Request();
						request.query('SELECT [City] FROM [dbo].[Buildings]', function (err, recordset) 
						{
							if (err) 
								console.log(err);
							socket.write(recordset.toString());
							console.log("DoneWrite");
							console.log(recordset);
						});
					});
				}else
				{
					// mysql
					//IPAddress
					const connection = mysql.createConnection
					(
						{
							host: 'localhost',
							user: 'test',
							password: 'abc123',
							database: 'DPProject'
						}
					);
					connection.connect((err) => 
					{
						if (err) 
						{
							console.log("Failed to connect");
							throw err;
						}
						console.log('Connected!');
					});
					connection.query('SELECT * FROM Clients', (err,rows) => {
						if(err) throw err;
					  
						console.log('Data received from Db:\n');
						console.log(rows);
						socket.write("Rcevd");
					});
				}
			}
			else if( 
				datastring[0]=="J"|| 
				datastring[1]=="J"||
				datastring   =="J"|| 
				ds           =="J"   )
			{
				//add job to database jobs table
				//jobs
				/*
					INSERT INTO DPProject.Jobs
					(JobType, Running, StartTime, EndTime, ErrorStatus, Finished)
					VALUES('P', b'0', '', '', '', b'0');
				*/

				const connection = mysql.createConnection(
				{
					host: 'localhost',
					user: 'dpuser',
					password: 'abc123',
					database: 'DPProject'}
				);
				connection.connect((err) => {
					if (err){
							console.log("Failed to connect For Job Creation");
							socket.write("JE Failed to Add Job|");
					}
						console.log('Connected!');
				});
				connection.query('INSERT INTO DPProject.Jobs Set ?',{JobType: 'P'  } ,(error, results, fields) => {
					if(error) {
						console.log("Failed to Insert into Job");
						socket.write("AE Failed to ADDJOB to DB|");
					}
					console.log('Data received from Db:\n');
					var JobID = results.insertId;
					console.log(results.insertId);
					socket.write("B"+ results.insertId.toString() +"|");
					// get available clients
					connection.query('Select clientID from DPProject.',(err, result, fields) => {
						if(err) throw err;
					  
						console.log('Data received from Db:\n');
						var avail=result.length;
						console.log(result.length);
						socket.write("Rcevd");

						var itmsper =0;
						var rem = PISIZE%(avail-1);

						itmsper = PISIZE/(avail-1);




						for( var i=0;i<(avail-1);i++)
						{
							console.log(fields[i].clientID);
							var sock = clientSockets.find(sck=>sck.ClientID==fields[i]);
							// sock send job
							// add a task
							/*INSERT INTO DPProject.Tasks (ClientID, JobID, SentTime, CompleteTime, 
								Errors) VALUES(0, 0, '', '', ''); */
								connection.query('INSERT INTO DPProject.Tasks Set ?',{ClientID: fields[i].clientID,
									JobID: JobID,SentTime: new Date()} ,
								(error, results, fields) => {
									if(error) {
										console.log("Failed to Insert into Job");
										socket.write("AE Failed to ADDJOB to DB|");
									}
									var output = "I" + " " + results.insertId + " " +itemsper.toString() +"|";
									sock.write(output);

								});
						}
						var sock = clientSockets.find(sck=>sck.ClientID==fields[i]);
						connection.query('INSERT INTO DPProject.Tasks Set ?',{ClientID: fields[i].clientID,
							JobID: JobID,SentTime: new Date()} ,
						(error, results, fields) => {
							if(error) {
								console.log("Failed to Insert into Job");
								socket.write("AE Failed to ADDJOB to DB|");
							}
							var output = "I" + " " + results.insertId + " " +rem.toString() +"|";
							sock.write(output);

						});
						// get last

					});
				
				
				
				
				});







			}

			else
			{
				console.log("INvalid Entry type");
				console.log("|"+datastring+"|");
				console.log("|"+datastring[0]+"|");
			}
		}
	});
	socket.on('close',(c)=>{
		console.log('CLosed' );
		console.log(c );
	});
    socket.on('error',(err)=>{
		console.log('errored') ;
		console.log(err);
	});
});
server.listen(1337, '127.0.0.1');
/*
CREATE TABLE `Clients` (
  `ClientID` int(11) NOT NULL AUTO_INCREMENT,
  `IPAddress` varchar(45) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT NULL,
  `IsProcessing` bit(1) DEFAULT NULL,
  `NOTES` text,
  `ClientName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ClientID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

sudo mysql-workbench  DBBBeaver
https://www.w3schools.com/nodejs/nodejs_mysql_select.asp






*/