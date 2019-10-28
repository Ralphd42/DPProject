var net = require('net');
var cntr =0;
var server = net.createServer(function(socket){
	//socket.write('Echo server');
	
	socket.on('data', function(data){
		if( data.length>0)
		{
			var datastring = data.toString('utf8');
			if( datastring[0]=='L')
			{
			 	console.log("L from " +socket.remoteAddress);
			 	 
			 	console.log("------------------\n\n");
				socket.write("Sent an L");
				var clientList ="";

				var config = {
					user: 'enterprise_rw',
					password: 'ent_*1RW',
					server: 'T1DNDB001.nyserdaweb.ny.gov', 
					database: 'ENTERPRISE' ,
					connectionTimeout: 99999
				};
				console.log("\n--1--\n");
				var sql = require("mssql");
				console.log("\n--1--\n");
				sql.connect(config, function (err) {
					console.log("\n--2--\n");
					if (err) console.log(err);
					console.log("\n--3--\n");
					// create Request object
					var request = new sql.Request(); 
					console.log("\n--4--\n");
					// query to the database and get the records
					console.log("\nQuery\n");
					request.query('SELECT [City] FROM [dbo].[Buildings]', function (err, recordset) {
						console.log("\nret\n");
						if (err) console.log(err);
			
						// send records as a response
						socket.write(recordset.toString());
						console.log(recordset);
					});
				});




			}
		}
		/*console.log("DT-" +data);
		textChunk = data.toString('utf8');
		console.log(textChunk);
		socket.write(textChunk);
		*/
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