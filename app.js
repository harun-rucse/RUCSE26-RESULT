const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const resultRouter = require('./routes/resultRoutes');
const courseRouter = require('./routes/courseRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// 1. Global Middleware

// Set security HTTP headers
app.use(helmet());

//Development Logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit Request from same IP
const Limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000, //Its allowed 100 request from same IP with 1 hour
  message: 'To many requests with that IP! Please try again in an hour'
});

app.use('/api', Limiter);

//Body parser, read data from req.body
app.use(express.json({ limit: '10KB' }));
app.use(cookieParser());

//Data sanitization against NoSQL query inject
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
app.use(hpp());

// Compression
app.use(compression());

//Testing middleware
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// Routes

app.use('/api/v1/user', userRouter);
app.use('/api/v1/result', resultRouter);
app.use('/api/v1/course', courseRouter);
app.use('/', viewRouter);
app.get('/hello', (req, res) => {
  res.status(200).end('Hello');
});

app.all('*', (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
  } else {
    res.status(200).render('errorPage', {
      statusCode: 404,
      message: `Can't find ${req.originalUrl} on the server`
    });
  }
});

app.use(globalErrorHandler);

//Export app.js
module.exports = app;
