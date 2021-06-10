const Review = require('../models/review');
const MongoStorage = require('../mongoStorage');
const cons = require('consolidate');
const ObjectId = require('mongodb').ObjectId;


class ReviewRepository {

    constructor() {
        this.storage = new MongoStorage();
    }

    async getRewiewById(reviewId) {
        //console.log("GET getRewiewById");
        //console.log(reviewId);
        const item = await this.storage.getItem("reviews", reviewId);
        if (item) {
            return new Review(
                item._id, item.museum_id, item.user_id, 
                item.rating, item.comment);
        }
        return null;
    }

    async getRewiewsByMuseumId(museumId) {
        //console.log("MUSEuM ID");
        //console.log(museumId);
        let findQry = {};
        if (museumId){
            const objectId = new ObjectId(museumId);
            findQry = { museum_id: objectId };
        }
        const items = await this.storage.readItems("reviews", findQry);
        //console.log("ITEMS");
        //console.log(items);
        let reviews = [];
        for (const item of Object.values(items)) {
            let review = new Review(
                item._id, item.museum_id, item.user_id, 
                item.rating, item.comment)
            review.user_name = (await this.storage.getItem("users", item.user_id)).login;
            reviews.push(review);
        }
        return reviews;
    }

    async addOrUpdateReview(newReview) {
        let new_item = await this.storage.writeItem("reviews", newReview);
        if (new_item)
            return new_item._id;
        else
            return null;
    }

    async deleteReview(reviewid) {
        const deletedItem = await this.storage.deleteItem("reviews", reviewid);
        if (deletedItem) {
            return deletedItem.value;
        }
        return null;
    }
};

module.exports = ReviewRepository;

