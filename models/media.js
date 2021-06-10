const Path = require('path');

class Media {
    constructor(path) {
        this.path = Path.resolve(path); // number
    }
}

module.exports = Media;