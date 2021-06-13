const fs = require('fs');
const path = require('path');
const Media = require('../models/media');
const { fileFormat } = require('express-swagger-generator/lib/swagger');

class MediaRepository {

    constructor(storage) {
        this.storage = storage;
    }
    addMedia(media) {

        const fileFormat = media.mimetype.split('/')[1];  //media = req.files['imageUrl']

        const nextMediaId = JSON.parse(fs.readFileSync(`${this.storage}/media_id.json`));

        const imageUrl = '/media/m' + nextMediaId.nextId + '.' + fileFormat;

        fs.writeFileSync(path.resolve(__dirname, '../data' + imageUrl), media.data, (err) => {
            if (err) {

                console.log("Can't load this photo.");

            }
        });

        //generate and store next id
        nextMediaId.nextId += 1;
        fs.writeFileSync(`${this.storage}/media_id.json`, JSON.stringify(nextMediaId, null, 4));

        //
        return imageUrl;
    }
    getMediaById(mediaId) {
        const dir = `${this.storage}/`;
        const searchCrit = 'm' + String(mediaId) + '.';
        let media_dir = null;

        fs.readdirSync(dir).forEach(file => {

            if (fs.lstatSync(path.resolve(dir, file)).isFile()) {
                if (String(file).startsWith(searchCrit)) {
                    console.log(dir + file);
                    media_dir = dir + file;
                }
            }
        });

        if (media_dir !== null)
            return new Media(media_dir);
        return null;
    }
}

module.exports = MediaRepository;