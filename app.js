var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require("ejs-locals");
const passport = require('passport')  
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)
var indexRouter = require('./routes/index.js');
var interfaceRouter = require('./routes/clientInterface');
/*  */
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
//midlewares
require('./auth')(passport);
app.use(session({  
  store: new MongoStore({
    db: global.db,
    ttl: 30 * 60,// = 30 minutos de sessão,
    collection:'session',
    url:process.env.MONGO_CONNECTION
  }),
  secret: '123',//configure um segredo seu aqui
  resave: false,
  saveUninitialized: false
}))
var compression = require("compression");
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* _routes */
app.use('/export',express.static(path.resolve(__dirname,'export')));


app.get("/partials/:document",(req,res)=>{
  res.sendFile(__dirname+"/views/partials/"+req.params.document);
});



app.use(indexRouter);
app.use(interfaceRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error-view');
});
module.exports = app;
