const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const config = require('./config');
const { db: { host, login, password, name } } = config;
const dbName = `${name}`;
const uri = `mongodb+srv://${login}:${password}@${host}/?writeConcern=majority`;
//const uri = "mongodb+srv://User123:123qweasd@lab4.0pfe1.mongodb.net/?writeConcern=majority";


class MongoStorage {
    
    async readItems(collectionName, findQry) {
        //console.log("readItemsCall");
        let result = null;
        const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            
            await mongoClient.connect();
            const collection = mongoClient.db(dbName).collection(collectionName);
            result = await collection.find(findQry).toArray();
            //console.log(result);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            //console.log("closingClient")
            mongoClient.close();
            return result;
        }
    }

    async getItem(collectionName, id) {
        let item = null;
        const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await mongoClient.connect();
            const collection = mongoClient.db(dbName).collection(collectionName);
            const objectId = new ObjectId(id);
            item = await collection.findOne({_id: objectId});
            //console.log(item);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            mongoClient.close();
            return item;
        }
    }

    //insert multiple documents
    async writeItem(collectionName, item) {
        let newItemId = null;
        const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await mongoClient.connect();
            const itemsCollection = mongoClient.db(dbName).collection(collectionName);
            console.log("writeItem id: "+item._id);
            if (!item._id){//new entry mode
                item._id = new ObjectId();
            
                newItemId = (await itemsCollection.insertOne(item)).insertedId;
            }
            else{ //update existing doc mode
                const fltr = {_id : item._id};//define filter to update existing item document
                const optns = {upsert: true}; //instruct mongodb to create a doc if it's not mached by filter
                newItemId = (await itemsCollection.replaceOne(fltr,item,optns)).upsertedId;
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            mongoClient.close();
            return newItemId;
        }
    }

    async deleteItem(collectionName, id) {
        let item = null;
        const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await mongoClient.connect();
            const collection = mongoClient.db(dbName).collection(collectionName);
            const objectId = new ObjectId(id);
            item = await collection.findOneAndDelete({_id: objectId});
            //console.log(item);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            mongoClient.close();
            return item;
        }
    }

};

module.exports = MongoStorage;
