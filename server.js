const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//Handle uncaught Exception

process.on('uncaughtException', err => {
  console.log(err, err.message);
  console.log('UncaughtException');

  process.exit(1);
});

const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connect successfull.');
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//Handle unhandledPromiseRejection Error
process.on('unhandledRejection', err => {
  console.log(err, err.message);
  console.log('🔥 UnhandledRejection.Sutting down....');

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('🔥 SIGTERM RECEIVED. Sutting down gracefully');
  server.close(() => {
    console.log('🔥 Process terminated!');
  });
});
