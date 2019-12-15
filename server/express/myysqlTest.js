var mysql = require('mysql');

const dbConn =Object.freeze({
    host: 'ralphmysql.cqnc6tzk60xy.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'abcd1234',
    database: 'DPPROJ'});
    AddNewClient();
    function AddNewClient(  )
    {
        console.log("ANC");
        const connection = mysql.createConnection(dbConn);
        connection.connect(
        (err) => 
        {
            if (err)
            {
                console.log("Failed to connect");
                
            }else
            {
                connection.query('INSERT INTO DPPROJ.Clients Set ?',
                {IPAddress: 'TEST'  } ,
                (error, results, fields) => 
                {
                    if(error) 
                    {
                        console.log("Failed to Insert");
                        console.log(error);
                         
                    }});
            }
        });
    }