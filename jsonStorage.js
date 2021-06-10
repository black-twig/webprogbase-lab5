const fs = require('fs');

class JsonStorage {

    // filePath - path to JSON file
    constructor(filePath) {
        this.filePath = filePath;
    }
    readItems() {
        const jsonText = fs.readFileSync(this.filePath);
        const jsonArray = JSON.parse(jsonText);
        return jsonArray.items;
    }
    get nextId() {
        const jsonText = fs.readFileSync(this.filePath.slice(0, -6)+'_id.json');
        const Id = JSON.parse(jsonText);
        return Id.nextId;
    }
    incrementNextId() {
        let newId = this.nextId;
        newId +=1;
        fs.writeFileSync(this.filePath.slice(0, -6)+'_id.json', JSON.stringify({nextId : newId}, null, 4));
    }
    writeItems(items) {
        fs.writeFileSync(this.filePath, JSON.stringify(items, null, 4));
    }
};

module.exports = JsonStorage;
