var net = require('net');
const SQLServer = true;
var mysql = require('mysql');
var cntr =0;
console.log("aaaa");
var server = net.createServer(function(socket)
{
	socket.on('data', function(data)
	{
		if( data.length>0)
		{
			var datastring = data.toString('utf8').trim();
			var ds =data.toString().trim();
			if( datastring[0]=='L'|| 
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
						password: 'ent_*1RW',
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




				}




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