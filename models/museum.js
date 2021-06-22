
class ArtMuseum {

    constructor(_id, name, country, founded, artistNum, exhibitNum, imageUrl, addDate) {
        this._id = _id; // ObjectId
        this.name = name;  // string
        this.country = country;  // string
        this.founded = founded; // date
        this.artistNum = artistNum; // integer
        this.exhibitNum = exhibitNum; // integer
        this.imageUrl = imageUrl; //string
        this.addDate = addDate; //date
    }
};
 
 module.exports = ArtMuseum;