var config = 
					{
						user: 'RalphUser',
						password: 'abcd1234',
						server: 'RDONATO\\SQLEXPRESS', 
						database: 'RD' ,
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
						request.query('SELECT * from DPClient', function (err, recordset) 
						{
							if (err) 
								console.log(err);
							//socket.write(recordset.toString());
							 
							console.log("DoneWrite");
							console.log(recordset);
						});
					});