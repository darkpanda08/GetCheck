const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const passport = require('passport');
const connectDB = require('./config/db')
const path = require('path')
require('dotenv').config()

const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
connectDB()

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout.ejs');
app.set('views', path.join(__dirname, '/views'))

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Static Folder
app.use('/public', express.static('public'))

// Express Session
app.use(session({
    secret: process.env.Cookie_Secret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.error_msg_logged = req.flash('error_msg_logged')  // to inform alredy logged in messages
    next()
})

// Routes
app.use('/', require('./routes/indexRoute'))
app.use('/users', require('./routes/usersRoute'))
app.use('/book', require('./routes/bookRoute'))
app.use('/reports', require('./routes/checkRoute'))
app.use('/allreports', require('./routes/allReports'))
app.use('/appointments', require('./routes/allAppointments'))
app.use('/update', require('./routes/updateReport'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/verify', require('./routes/verifyRoute'))
app.use('/getpdf', require('./routes/getpdf'))
app.use('/api', require('./routes/api'))

const PORT = process.env.PORT || 5000;

app.listen(PORT , console.log(`Server running on ${PORT}`));