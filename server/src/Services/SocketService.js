class SocketService {
    constructor() {
        this.io = require('socket.io')();
    }

    setup(server) {
        this.io.attach(server);

        this.io.of('/my_app').on('connection', (io) => {
            io.on('hello', function (from, msg) {
                console.log(`I received a private message from '${from}' saying '${msg}'`);
            });

            io.on('disconnect', () => {
                console.log("Someone disconnected...");
            });
        });
    }

    postedData(msg, dataType, id) {
        this.io.of('/my_app').emit('new-data', {msg: msg, dataType: dataType, id: id});
    };
}

module.exports = () => new SocketService();