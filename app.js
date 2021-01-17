// app.js =>> frameWork , functions, methods
const path = require('path'); 
const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport'); 
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// load Config =>> Google
dotenv.config({ path: './config/config.env'});

//Passport Config
require('./config/passport')(passport);

// Connect To MONGODB 
connectDB();
const app = express();


// Body parser 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// method-override =>> PUT AND DELETE comes in 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }));

// Morgan Request 
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
};

// Handelbars FormatDate helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');


// Template Engine 
app.engine('.hbs', exphbs({helpers: {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');


// Session =>> express-session-npm.com  ==>> Middleware till Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }));


// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

// Global Variable to Users _Id
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next();
})

// Sttatic folder ==>> CSS 
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running In Port ${process.env.NODE_ENV} Node On Port ${PORT}`);
});