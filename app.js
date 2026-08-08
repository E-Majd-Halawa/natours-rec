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
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./Controller/bookingController');
const viewRouter = require('./routes/viewRoutes');
//Start express app
const app = express();
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://unpkg.com', 'https://js.stripe.com'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://unpkg.com',
          'https://fonts.googleapis.com',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: [
          "'self'",
          'https://*.openstreetmap.org',
          'https://unpkg.com',
          'https://api.stripe.com',
          // السماح بالاتصال من أي مكان في بيئة التطوير (سواء Localhost أو IP الجوال)
          ...(process.env.NODE_ENV === 'development'
            ? [
                'ws:',
                'http://localhost:*',
                'http://127.0.0.1:*',
                'http://192.168.*:*',
              ]
            : []),
        ],
        frameSrc: [
          "'self'",
          'https://js.stripe.com',
          'https://hooks.stripe.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://res.cloudinary.com', // 🟢 إضـافـة Cloudinary لظهور الصور
          'https://*.openstreetmap.org',
          'https://*.tile.openstreetmap.org',
          'https://unpkg.com',
        ],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
      },
    },
    // 🟢 منع حظر الموارد عبر الأجهزة المختلفة في الشبكة (الجوال)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  validate: { trustProxy: false },
});
app.use('/api', limiter);
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
