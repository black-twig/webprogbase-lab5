const User = require('../models/user');
const MongoStorage = require('../mongoStorage');



class UserRepository {

    constructor() {
        this.storage = new MongoStorage();
    }

    async getUsers(selectedUserId) {
        const items = await this.storage.readItems("users", {});
        let users = [];
        for (const item of Object.values(items)) {
            let newU=new User(item._id, 
                            item.login, item.fullname,
                            item.role, item.registeredAt,
                            item.avaUrl, item.isEnabled)
                
            if (selectedUserId){//if the selectedUserId param is defined - check and set for user "selected" user 
                newU.selected = (String(newU._id)==selectedUserId ? "selected" : "");
            }
            users.push(newU);
        }
        return users;
    }

    async getUserById(userid) {
        const item = await this.storage.getItem("users", userid);
        if (item) {
            return new User(item._id, item.login, item.fullname,
                item.role, item.registeredAt,
                item.avaUrl, item.isEnabled);
        }
        return null;
    }
};

module.exports = UserRepository;

