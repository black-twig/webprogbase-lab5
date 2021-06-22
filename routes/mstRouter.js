const router = require('express').Router();

const usersRouter = require('./usersRouter');
router.use('/users', usersRouter);

const museumsRouter = require('./museumsRouter');
router.use('/museums', museumsRouter);


module.exports = router;