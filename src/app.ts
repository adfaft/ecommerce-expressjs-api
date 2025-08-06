import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import { ErrorStatus } from './utils/error.js';
import { connect } from './database/mongodb.js';

import indexRouter from './routes/index.js';
import adminRouter from './routes/admins.js';
import memberRouter from './routes/member.js';
import postsRouter from './routes/post.js';
import postsCategoryRouter from './routes/post_categories.js';
import addressProvinceRouter from './routes/address_provinces.js';
import addressRegencyRouter from './routes/address_regencies.js';
import addressDistrictRouter from './routes/address_districts.js';
import productRouter from './routes/product.js';
import producCategoryRouter from './routes/product_categories.js';
import productSkuRouter from './routes/product_skus.js';
import productDiscountRouter from './routes/product_discounts.js';

// import ordersRouter from './routes/order';


var app = express();

let __dirname = path.dirname(fileURLToPath(import.meta.url));
__dirname = path.join(__dirname, '../')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


// middleware
app.use(logger('dev')); // show log such as from supertest
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ExpressMongoSanitize())

app.use('/', indexRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/post-categories', postsCategoryRouter);
app.use('/api/v1/admins', adminRouter);
// app.use('/api/v1/admins/auth', usersAuthRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/address/provinces', addressProvinceRouter);
app.use('/api/v1/address/regencies', addressRegencyRouter);
app.use('/api/v1/address/districts', addressDistrictRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/product-categories', producCategoryRouter);
app.use('/api/v1/product-skus', productSkuRouter);
app.use('/api/v1/product-discounts', productDiscountRouter);
// app.use('/api/v1/orders', orderRouter);

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
