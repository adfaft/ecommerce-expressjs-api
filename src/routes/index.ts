import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { 
    title: 'Hi!',
    message: 'No direct access is allowed.' 
  });
});

/* GET 404 page. */
router.get('/404', function(req: Request, res: Response, next: NextFunction) {
  res.status(404).render('error', { 
    message: 'Page not found.' 
  });
});

export default router;
