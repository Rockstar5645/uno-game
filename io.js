

module.exports = async (io) => {
    io.on('connection', (socket) => {
        
        socket.on('chat message', (msg) => {
            console.log(msg);
        });
    });
}