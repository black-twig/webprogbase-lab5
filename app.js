const express = require('express');
const bodyParser = require('body-parser');

const busboyBodyParser = require('busboy-body-parser');

const mstRouter = require('./routes/mstRouter');
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



app.use('', mstRouter);
app.use((req, res) => {
    res.status(400).send({ message: "Error in route."});
});

app.get('/users/:id', function (req, res) {
    const user = userRepository.getUserById(parseInt(req.params._id));
    res.render('user', { user });
});


app.listen(config.app.port, function() {
    console.log('Server is ready');
});