var net   = require('net'  );
console.log("-- 1 --");
var server = net.createServer(function(socket)
{
    console.log("--2--");
    socket.on('data', function(data)
	{
        console.log("--3--");
        if( data.length>0)
		{
            console.log("--4--");
        }
    });
});
server.listen(9911 );