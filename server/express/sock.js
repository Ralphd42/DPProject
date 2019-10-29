var net = require('net');
var cntr =0;
console.log("aaaa");
var server = net.createServer(function(socket){
	//socket.write('Echo server');
	console.log("cREATED sOCKET");
	socket.on('data', function(data){
		if( data.length>0)
		{
			var datastring = data.toString('utf8').trim();
			console.log(data);
			var ds =data.toString().trim();
			console.log (ds);
			console.log(datastring.charCodeAt(1) );
			console.log(ds.charCodeAt(1) );
			if( datastring[0]=='L'|| datastring[1] =="L" ||datastring =="L" || ds =="L")
			{
			 	console.log("L from " +socket.remoteAddress);
			 	 
			 	console.log("------------------\n\n");
				socket.write("Sent an L  +socket.remoteAddress");
				//socket.write("Sent an L2");
				var clientList ="";
if(false){
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
			else
			{

				console.log("|"+datastring+"|");
				console.log("|"+datastring[0]+"|");
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