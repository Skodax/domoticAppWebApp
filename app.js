const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//Initialize Application
const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// DB config
const db = require('./config/private/database');

//Connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Conected...'))
    .catch(err => console.log(err));

//CONSTANTS
const port = process.env.PORT || 5000;



//MIDDLEWARE

//Handlebars
app.engine('handlebars', exphbs(
    { defaultLayout: 'main' }
));
app.set('view engine', 'handlebars');

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

// parse application/json
app.use(bodyParser.json())

// Method Override with POST having ?_method = PUT and delete
app.use(methodOverride('_method'));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));


//Connect flash
app.use(flash());

//Global Varialbes - MIDDLEWARE
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    // call next piece of middleware
    next(); 
});






//INDEX ROUTE

//Main page
app.get('/', (req, res) => {
    res.send('index');
});

//About page
app.get('/about', (req, res) => {
    res.send('about');
});



//MAIN
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})