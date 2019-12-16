/* External libraries */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const database = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const socket = require('./src/Services/SocketService')();

/** Security **/
const encryptionAlgorithm = require('bcryptjs');
const webToken = require('jsonwebtoken');
const tokenValidator = require('express-jwt');
const unauthorizedHandler = require('./src/Middleware/UnauthorizedRouteHandler');

/* Data access layers */
const userDal = require('./src/Database/UserDal')(database);
const categoryDal = require('./src/Database/CategoryDal')(database);
const bookDal = require('./src/Database/BookDal')(database);

/* Environment variables */
const port = (process.env.PORT || 8080);
const connectionString = (process.env.CONNECTION_STRING || `mongodb://localhost:27017/marketplace-development`);
const securitySecret = (process.env.SECURITY_SECRET || "tHe CakE IS not A LiE!");
const encryptionLevel = (process.env.ENCRYPTION_LEVEL || 10);

/* Services */
const authService = require('./src/Services/AuthenticationService')(userDal, securitySecret, encryptionAlgorithm, webToken, encryptionLevel);
const userService = require('./src/Services/UserService')(userDal);
const bookService = require('./src/Services/BookService')(bookDal, categoryDal);

/* Path setup */
const openPaths = [...require('./src/Configuration/paths.json'),
    {
        "url": /\/api\/books\/[\w]+/ig,
        "method": "GET"
    },
    {
        "url": /\/api\/books\/[\w]+\//ig,
        "method": "GET"
    }
];

/* Server configuration */
const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(tokenValidator({secret: securitySecret}).unless({path: openPaths}));
app.use(unauthorizedHandler);

/* Routes */
const userPaths = require('./src/Routes/UserRoutes')(authService, userService);
app.use('/api/users', userPaths);

const categoryRoutes = require('./src/Routes/CategoryRoutes')(bookService);
app.use('/api/categories', categoryRoutes);

const bookRoutes = require('./src/Routes/BookRoutes')(bookService);
app.use('/api/books', bookRoutes);

/* Resolves paths regarding the React app and its routes */
const pathResolver = require('./src/Routes/PathResolver');
app.use('*', pathResolver);

/* Server startup */
database.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
            console.log(`Connected to database!`);

            const server = await app.listen(port);
            socket.setup(server);

            const appName = (process.env.APP_NAME || "Marketplace development");
            console.log(`'${appName}' now listening on port: ${port}`);
        }
    ).catch((error) => {
        console.log(`An error happened with following message: ${error}`)
    }
);