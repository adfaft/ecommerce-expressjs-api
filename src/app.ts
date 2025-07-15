import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';

interface ErrorStatus extends Error{
  status: number
}

import indexRouter from './routes/index.js';
// import postsRouter from './routes/post';
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/api/v1/posts', postsRouter);
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
app.use(function(err: ErrorStatus, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
