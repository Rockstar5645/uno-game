// read dotenv environment configurationn
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let sessions = require('client-sessions');

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let testRouter = require("./routes/test");
let loginRouter = require("./routes/login");
let signupRouter = require("./routes/signup");
const deckRouter = require("./routes/deck");
const gamesRouter = require("./routes/games");
const lobbyRouter = require("./routes/lobby");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: process.env.SESSION_SECRET, // should be a large unguessable string
  duration: 6000 * 1000, // how long the session will stay valid in ms
}));
*/

if (process.env.NODE_ENV === 'development') {
  app.use('/test', testRouter); 
}

// unauthenticated routes 
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.use(function (req, res, next) {
  if (req.cookies.user_id) {
    next();
  } else {
    res.redirect('/login');
  }
});

// authenticated routes 
app.use('/users', usersRouter);
app.use('/deck', deckRouter);
app.use('/games', gamesRouter);
app.use('/lobby', lobbyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // console.log(err); 
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.local.something is creating a local variable for use in our view engine for this request.
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app; 
