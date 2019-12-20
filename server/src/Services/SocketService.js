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

    emitNewBookAdded(bookTitle, bookId) {
        this.io.of("/my_app").emit('new-data', {msg: `${bookTitle} has been added as a new book!`, action: 'UPDATE_BOOKS', dataId: bookId, dataType: "book"})
    }

    emitNewCategoryAdded(categoryTitle, categoryId) {
        this.io.of("/my_app").emit('new-data', {msg: `${categoryTitle} has been added as a new category!`, action: 'UPDATE_CATEGORIES', dataId: categoryId, dataType: "category"})
    }
}

module.exports = () => new SocketService();