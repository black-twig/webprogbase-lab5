const express = require('express');
const router = express.Router();
const museumController = require('../controllers/museumsController');

router.get('/', museumController.getMuseumsListPage);

router.get('/list', museumController.getArtMuseums);

router.get('/:_id', museumController.getArtMuseumById);

router.post('/add', museumController.addArtMuseum);

router.get("/del/:_id", museumController.deleteArtMuseum);


module.exports = router;