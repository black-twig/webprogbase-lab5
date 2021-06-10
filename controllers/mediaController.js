const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository('data/media');
const Media = require('../models/media');

module.exports = {
    getMediaById(req, res) {

        const media = mediaRepository.getMediaById(req.params._id);
        if (media!==null)
            res.sendFile(media.path);
        else
            res.status(404).send({message: "Media id is incorrect." });
    },
    addMedia(req, res)
    {
        try {
            const id = mediaRepository.addMedia(new Media(req.file.path));
            res.status(201).json(id).end();
        } catch (error) {
            res.status(404).send({message: "Problems adding media." });
        }
    }
};