const router = require('express').Router();

const usersRouter = require('./usersRouter');
router.use('/users', usersRouter);

const museumsRouter = require('./museumsRouter');
router.use('/museums', museumsRouter);

const reviewsRouter = require('./reviewsRouter');
router.use('/reviews', reviewsRouter);

const mediaRouter = require('./mediaRouter');
router.use('/media', mediaRouter);

module.exports = router;