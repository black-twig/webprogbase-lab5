const express = require('express');
const bodyParser = require('body-parser');

const busboyBodyParser = require('busboy-body-parser');

const mstRouter = require('./routes/mstRouter');
const apiRouter = require('./routes/apiRouter');
const morgan = require('morgan');
const consolidate = require('consolidate');
const path = require('path');
const mustache = require('mustache-express');
//
const UserRepository = require('./repositories/userRepository');
const userRepository = new UserRepository('data/users.json');
const MuseumRepository = require('./repositories/museumRepository');
const museumRepository = new MuseumRepository('data/museums.json');
const config = require('./config');
const http = require('http');
//


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(busboyBodyParser());

app.use(morgan('dev'));

const expressSwagger = require('express-swagger-generator')(app);

app.use(express.static('./public'));
app.use(express.static('./data'));

app.engine('mst', mustache());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mst');


app.get('/', function (req, res) {
    res.render('index', {});
});


app.get('/about', function (req, res) {
    res.render('about', {});
});


app.use('/api', apiRouter);
app.use('', mstRouter);
app.use((req, res) => {

    res.status(400).send({ message: "Error in route."});
});

// app.get('/users/:id', function (req, res) {
//     const user = userRepository.getUserById(parseInt(req.params._id));
//     res.render('user', { user });
// });

// app.listen(config.app.port, function() {
//     console.log('Server is ready');
// });

//websocket server + http
const server = http.createServer(app);
//
// … @todo setup app here
//
const WsServer = require('./websocketserver');
global.wsServer = new WsServer(server);
//
// Note: now you can use wsServer in your web handlers 
//       to send notifications to all connected websockets
//
server.listen(config.app.port, () => console.log(`Web server started at ${config.app.port}`));
