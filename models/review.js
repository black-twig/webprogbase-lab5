
class Review {

    constructor(_id, museum_id, user_id, rating, comment) {
        this._id = _id; // ObjectId
        this.museum_id = museum_id;  // ObjectId
        this.user_id = user_id;  // ObjectId
        this.rating = rating; // number
        this.comment = comment; // string
    
    }

};
 
 module.exports = Review;