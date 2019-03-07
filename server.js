const express = require('express');
const app = express();
var path = require('path');
let desktopRouter = require('./routes/desktop.js');


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/img', express.static('static/img'));
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));

app.use('/desktop', desktopRouter);

app.get('/', (req, res) => {
    res.redirect('/desktop');
})

app.get('*', (req, res, next) => {
    if (req.headers['content-type'] == 'application/json') {
        res.status(404)
    } else {
        res.status(404).send("Path doesn't exist.");
    }
});

app.listen(5000, "localhost", () => {
    console.log('listening on localhost:5000');
});