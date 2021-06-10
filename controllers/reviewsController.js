const Review = require('../models/review');
const ReviewRepository = require('../repositories/reviewRepository');
const reviewRepository = new ReviewRepository();
const UserRepository = require('../repositories/userRepository');
const userRepository = new UserRepository('data/users.json');
const MuseumRepository = require('../repositories/museumRepository');
const museumRepository = new MuseumRepository();
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    async getReviewAddOrEdit(req, res) {
        //console.log("getNewReviewForm PARAMS");
        //console.log(req.params) ;
        //console.log("END") ;
        let mode = "New";
        let review = null;
        if (req.params._id) //edit review mode
        {
            review = await reviewRepository.getRewiewById(req.params._id);
            if (review)
                museumId = review.museum_id;
            else {
                res.status(500).send({ review: null, message: "Problem getting review." });
                return null;
            }
            mode = "Edit";
        }
        else {// new review mode
            review = new Review();
            review.museum_id = req.params.museum_id;
        }

        const museum = await museumRepository.getArtMuseumById(review.museum_id);

        if (museum) {

            const users = await userRepository.getUsers(review.user_id);
            res.status(200).render('reviewform', { lblNewOrEdit: mode, review: review, museum_name: museum.name, users: users });
        }
        else {
            res.status(500).send({ museum: null, message: "Museum id is incorrect." });
        }
    },

    async addMuseumReview(req, res) {
        if (!req.body)
            res.sendStatus(400);
        else {
            //console.log("ADD museumReview");
            //console.log(req.body);

            if (!req.body.museum_id) {
                res.status(500).send({ museumId: null, message: "Museum id is incorrect." });
            }
            else {
                if (!req.body.user_id) {
                    res.status(500).send({ userId: null, message: "User id is incorrect." });
                }
                else {
                    const museumId = new ObjectId(req.body.museum_id);
                    const userId = new ObjectId(req.body.user_id);
                    let reviewId = null;
                    if (req.body._id)
                        reviewId = new ObjectId(req.body._id);

                    //console.log("museumId "+museumId);
                    //console.log("userId "+userId);
                    //console.log("reviewId "+reviewId);
                    const obj_review = new Review(reviewId, museumId, userId,
                        Number(req.body.rating), req.body.comment);

                    const newId = await reviewRepository.addOrUpdateReview(obj_review);
                    //console.log(newId);
                    res.redirect('/museums/' + req.body.museum_id);
                }
            }
        }
    },

    async deleteReview(req, res) {
        console.log("DELETE review " + req.params._id);
        if (req.params._id) {
            const deletedReview = await reviewRepository.deleteReview(req.params._id);
            if (deletedReview)
                res.redirect('/museums/' + String(deletedReview.museum_id));
            else
                res.status(500).send();
        }
        else
            res.status(404).send({ message: "Review's not found." });
    },

};