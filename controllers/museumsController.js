const path = require('path');
const MuseumRepository = require('../repositories/museumRepository');
const museumRepository = new MuseumRepository();
const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository(path.resolve(__dirname, '../data/media'));
const Museum = require('../models/museum');
const ReviewRepository = require('../repositories/reviewRepository');
const reviewRepository = new ReviewRepository();

module.exports = {
    async getArtMuseums(req, res) {
        try {
            let page = req.query.page;
            let name = req.query.name;
            const page_size = 10;

            if (!page) page = 1;
            else page = Number(page);

            let result = await museumRepository.getMuseumsPaginated(Number(page), page_size, name);
            let museums = result.museums_res;
            //console.log(museums);
            let pagesNumber = Number(result.totalPages);

            let pages = { currentPage: Number(result.currentPage) };

            if (page !== 1) pages.prevPage = page - 1;
            if (page !== pagesNumber) pages.nextPage = page + 1;
            if (name) pages.namePage = name;

            res.status(200).render('museums', { museums: museums, pagesNumber: pagesNumber, pages: pages});

        } catch (err) {

            console.log(err.message);
            res.status(500).send({ museums: null, message: 'Server error.' });

        }
    },
   
    async getArtMuseumById(req, res) {
        //console.log("GET ArtMuseumById"+req.params._id);

        const museum = await museumRepository.getArtMuseumById(req.params._id);

        if (museum) {
            const reviews = await reviewRepository.getRewiewsByMuseumId(req.params._id);
            res.status(200).render('museum', { museum: museum, reviews: reviews});
        }
        else {

            res.status(404).send({ museum: null, message: "Museum id is incorrect." });

        }
    },
   

    async  addArtMuseum(req, res) {

        const image = await mediaRepository.addMedia(req.files['imageUrl'].data);

        //console.log(req.body);
        const new_museum = new Museum(null, req.body.Mname, req.body.country, req.body.founded, 
             Number(req.body.artistNum), Number(req.body.exhibitNum), image.url);
        const newId = await museumRepository.addArtMuseum(new_museum);
        //console.log(newId);
        res.redirect('/museums/' + newId);
    },
  
    async  deleteArtMuseum(req, res) {
        //console.log("DELETE " + req.params._id);
        const deletedId = await museumRepository.deleteArtMuseum(req.params._id);
        res.redirect('/museums');
    },
    
    async updateArtMuseum(req, res) {
        if (!req.body)
            res.sendStatus(400);
        else {
            const museum = museumRepository.getArtMuseumById(req.body._id);
            if (museum) {
                museumRepository.updateArtMuseum(req.body);
                res.send(museumRepository.getArtMuseumById(req.body._id));
                res.end();
            }
            else
                res.sendStatus(404);
        }
    }
};