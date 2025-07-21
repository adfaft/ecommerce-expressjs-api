import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import { ErrorStatus } from './utils/error.js';
import { connect } from './database/mongodb.js';

import indexRouter from './routes/index.js';
import postsRouter from './routes/post.js';
// import usersRouter from './routes/users';
// import usersAuthRouter from './routes/users-auth';
// import membersRouter from './routes/member';
// import productsRouter from './routes/product';
// import ordersRouter from './routes/order';


var app = express();

let __dirname = path.dirname(fileURLToPath(import.meta.url));
__dirname = path.join(__dirname, '../')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ExpressMongoSanitize())

app.use('/', indexRouter);
app.use('/api/v1/posts', postsRouter);
// app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/users/auth', usersAuthRouter);
// app.use('/api/v1/members', membersRouter);
// app.use('/api/v1/products', productsRouter);
// app.use('/api/v1/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(
    err: ErrorStatus, 
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {

  if( typeof err.status === "undefined" ){
    err = new ErrorStatus(500, err.message, {}, err);
  }

  let { status, message, error } = err;
  status = status || 500;

  // set locals, only providing error in development
  res.locals.message = message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status);

  // console.log(err);
  
  res.json({ status, message, error });
});



/**
 * Connnect DB
 */

connect().catch( (err) => { console.log(err) } )


export default app;
