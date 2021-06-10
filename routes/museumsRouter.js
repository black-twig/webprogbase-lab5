const express = require('express');
const router = express.Router();
const museumController = require('../controllers/museumsController');
const reviewController = require('../controllers/reviewsController');

router.get("/newm", (req, res) => { res.status(200).render('newm') ;});

router.get('/', museumController.getArtMuseums);

router.get('/:_id', museumController.getArtMuseumById);

router.post('/', museumController.addArtMuseum);

router.post("/del:_id", museumController.deleteArtMuseum);

router.get("/newrw/:museum_id", reviewController.getReviewAddOrEdit);

router.post("/addreview", reviewController.addMuseumReview);

router.get("/editrw/:_id", reviewController.getReviewAddOrEdit);

router.get("/deleterw/:_id", reviewController.deleteReview);

module.exports = router;