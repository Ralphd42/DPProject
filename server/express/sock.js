var net = require('net');
var cntr =0;
var server = net.createServer(function(socket) {
	socket.write('Echo server');
	socket.on('data', function(data){
		console.log("DT-" +data);
		textChunk = data.toString('utf8');
		console.log(textChunk);
		socket.write(textChunk);
    });
    socket.on('error', () => console.log('errored'));
});
server.listen(1337, '127.0.0.1');

