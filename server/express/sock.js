var net = require('net');
var cntr =0;
var server = net.createServer(function(socket){
	socket.write('Echo server');
	console.log( socket.remoteAddress);
	socket.on('data', function(data){
		console.log("DT-" +data);
		textChunk = data.toString('utf8');
		console.log(textChunk);
		socket.write(textChunk);

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