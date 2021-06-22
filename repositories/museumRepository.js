const ArtMuseum = require('../models/museum');
const MongoStorage = require('../mongoStorage');



class ArtMuseumRepository {

    constructor() {
        this.storage = new MongoStorage();
    }

    async getArtMuseums(name, sort) {
        let findQry = {};
        
        let sortQry = { name: 1};
        if (sort=='addDate')
            sortQry = { addDate: -1, name: 1};
            
        if (name)
            findQry = { name: { $regex: ".*" + name + ".*" } };

        const items = await this.storage.readItems("museums", findQry, sortQry);
        let artMuseums = [];
        for (const item of Object.values(items)) {
            artMuseums.push(new ArtMuseum(
                item._id, item.name, item.country,
                item.founded, item.artistNum,
                item.exhibitNum, item.imageUrl, item.addDate));
        }
        return artMuseums;
    }


    async getMuseumsPaginated(page, per_page, name, sort) {

        let museums_res = await this.getArtMuseums(name,sort);
        // console.log(museums_res);
        // console.log ("------------------------------------------------------");
        let paging = this.paginate(museums_res.length, page, per_page);
        museums_res = museums_res.slice(paging.startIndex, paging.endIndex + 1);
        //console.log(museums_res);
        return {
            museums_res: museums_res,
            currentPage: paging.currentPage,
            totalPages: paging.totalPages
        };

    }

    paginate(totalItems, currentPage, pageSize) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        // calculate start and end item indexes in the search results
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // return object with all pager properties required by the results-view
        return {
            currentPage: currentPage,
            totalPages: totalPages,
            startIndex: startIndex,
            endIndex: endIndex
        };
    }

    async getArtMuseumById(artMuseumid) {
        const item = await this.storage.getItem("museums", artMuseumid);
        if (item) {
            return new ArtMuseum(item._id,
                item.name, item.country,
                item.founded, item.artistNum,
                item.exhibitNum, item.imageUrl, item.addDate);
        }
        return null;
    }

    async addArtMuseum(newMuseum) {
        //console.log("ADD MUSEUM");
        //console.log(newMuseum);
        let newId = await this.storage.writeItem("museums", newMuseum);
        if (newId) {
            console.log(newId);
            return newId;
        }
        else
            return null;
    }

    updateArtMuseum(artMuseumModel) {
        const artMuseums = this.getArtMuseums();
        for (let i in artMuseums) {
            if (artMuseums[i]._id === artMuseumModel._id) {
                artMuseums[i] = artMuseumModel;
                this.storage.writeItems({ items: artMuseums });
                return artMuseumModel._id;
            }
        }
        return null;
    }

    async deleteArtMuseum(artMuseumid) {
        const deletedItem = await this.storage.deleteItem("museums", artMuseumid);
        if (deletedItem) {
            return new ArtMuseum(deletedItem._id,
                deletedItem.name, deletedItem.country,
                deletedItem.founded, deletedItem.artistNum,
                deletedItem.exhibitNum, deletedItem.imageUrl, 
                deletedItem.addDate);
        }
        return null;
    }
};

module.exports = ArtMuseumRepository;

