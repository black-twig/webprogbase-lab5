/**
 * @typedef User
 * @property {integer} id
 * @property {string} login.required - unique username
 * @property {string} fullname - some description here
 * @property {integer} role
 * @property {string} registeredAt
 * @property {string} avaUrl
 * @property {boolean} isEnabled
 */

class User {

    constructor(id, login, fullname, role, registeredAt, avaUrl, isEnabled) {
        this._id = id; // number
        this.login = login;  // string
        this.fullname = fullname;  // string
        this.role = role; //integer
        this.registeredAt = registeredAt; //date
        this.avaUrl = avaUrl; //string
        this.isEnabled = isEnabled; //boolean
    }
};
 
 module.exports = User;
 