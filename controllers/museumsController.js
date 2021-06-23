const path = require('path');
const MuseumRepository = require('../repositories/museumRepository');
const museumRepository = new MuseumRepository();
const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository(path.resolve(__dirname, '../data/media'));
const Museum = require('../models/museum');
const WsServer = require('../websocketserver');

module.exports = {
    async getMuseumsListPage(req, res) {
        try {
            res.status(200).render('museums', {});
        } catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
    },
    async getArtMuseums(req, res) {
        try {
            let page = req.query.page;
            let name = req.query.name;
            let sort = req.query.sort;
            const page_size = 7;

            if (!page) page = 1;
            else page = Number(page);

            let result = await museumRepository.getMuseumsPaginated(Number(page), page_size, name, sort);


            res.send(result);
            res.end();
        } catch (err) {

            console.log(err.message);
            res.sendStatus(500);
        }
    },

    async getArtMuseumById(req, res) {
        const museum = await museumRepository.getArtMuseumById(req.params._id);
        if (museum) {
            res.send(museum);
            res.end();
        }
        else {
            res.sendStatus(404);
        }
    },


    async addArtMuseum(req, res) {

        const image = await mediaRepository.addMedia(req.files['imageUrl'].data);
        let datenow = new Date().toISOString();
        //let dateStr = dateNow.getDate() +'/'+(dateNow.getMonth()+1)+'/'+dateNow.getFullYear();
        console.log(datenow);
        //console.log(req.body);
        const new_museum = new Museum(null, req.body.Mname, req.body.country, req.body.founded,
            Number(req.body.artistNum), Number(req.body.exhibitNum), image.url, datenow);
        const newId = await museumRepository.addArtMuseum(new_museum);
        //console.log(newId);
        new_museum._id = newId;
        if (new_museum) {
            let ws = require('../app.js');
            ws.notifyAll("New Museum", new_museum.name, new_museum._id);
            res.send(new_museum);
            res.end();
        }
        else
            res.sendStatus(500);
    },

    async deleteArtMuseum(req, res) {
        //console.log("DELETE " + req.params._id);
        if (!req.body)
            res.sendStatus(400);
        else {
            const deletedMuseum = await museumRepository.deleteArtMuseum(req.params._id);
            console.log(deletedMuseum);
            if (deletedMuseum) {
                res.send(deletedMuseum);
                res.end();
            }
            else
                res.sendStatus(404);
        }

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