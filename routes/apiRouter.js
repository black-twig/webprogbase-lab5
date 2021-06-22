const express = require('express');
const usersRouter = require('./usersRouter');
const museumsRouter = require('./museumsRouter');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/museums', museumsRouter);

module.exports = router;