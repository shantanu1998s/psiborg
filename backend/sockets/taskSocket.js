const socketIo = require('socket.io');

const taskSocket = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('newTask', (task) => {
            io.emit('taskCreated', task);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

module.exports = taskSocket;
