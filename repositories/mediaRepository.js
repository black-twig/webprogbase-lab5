const config = require('../config');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

class MediaRepository {

    async addMedia(media) {

        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader
                .upload_stream(
                  { resource_type: 'raw' }, 
                  (err, result) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  })
                .end(media);
          });
        
    }
}

module.exports = MediaRepository;