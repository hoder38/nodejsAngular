var util = require("../util/utility.js");
var mongo = require("../models/mongo-tool.js");
var pwTagTool = require("../models/tag-tool.js")("password");
var config_type = require('../../../ver.js');

var generatePassword = require('password-generator'),
    crypto = require('crypto');

var algorithm = 'aes-256-ctr';

module.exports = {
    generatePW: function() {
        return generatePassword(12, false, /[0-9a-zA-Z!@#$%]/);
    },
    newRow: function(data, user, next, callback) {
        if (!data['username'] || !data['password']|| !data['conpassword'] || !data['name']) {
            util.handleError({hoerror: 2, message: 'parameter lost!!!'}, next, callback);
        }
        var name = util.isValidString(data['name'], 'name');
        var username = util.isValidString(data['username'], 'name');
        var password = util.isValidString(data['password'], 'passwd');
        var conpassword = util.isValidString(data['conpassword'], 'passwd');
        var url = '', email = '';
        if (data['url']) {
            url = util.isValidString(data['url'], 'url');
        }
        if (data['email']) {
            email = util.isValidString(data['email'], 'email');
        }
        if (name === false) {
            util.handleError({hoerror: 2, message: 'name not vaild!!!'}, next, callback);
        }
        if (username === false) {
            util.handleError({hoerror: 2, message: 'username not vaild!!!'}, next, callback);
        }
        if (password === false) {
            util.handleError({hoerror: 2, message: 'password not vaild!!!'}, next, callback);
        }
        if (conpassword === false) {
            util.handleError({hoerror: 2, message: 'password not vaild!!!'}, next, callback);
        }
        if (password !== conpassword) {
            util.handleError({hoerror: 2, message: 'password not equal!!!'}, next, callback);
        }
        if (url === false) {
            util.handleError({hoerror: 2, message: 'url not vaild!!!'}, next, callback);
        }
        if (email === false) {
            util.handleError({hoerror: 2, message: 'email not vaild!!!'}, next, callback);
        }
        var crypted_password = encrypt(password);
        var prePassword = crypted_password;
        var owner = user._id;
        var utime = Math.round(new Date().getTime() / 1000);
        var important = 0;
        if (data['important']) {
            important = 1;
        }
        var tags = [];
        var normal = pwTagTool.normalizeTag(name);
        if (!pwTagTool.isDefaultTag(normal)) {
            if (tags.indexOf(normal) === -1) {
                tags.push(normal);
            }
        }
        normal = pwTagTool.normalizeTag(username);
        if (!pwTagTool.isDefaultTag(normal)) {
            if (tags.indexOf(normal) === -1) {
                tags.push(normal);
            }
        }
        if (email) {
            normal = pwTagTool.normalizeTag(email);
            if (!pwTagTool.isDefaultTag(normal)) {
                if (tags.indexOf(normal) === -1) {
                    tags.push(normal);
                }
            }
        }
        if (url) {
            normal = pwTagTool.normalizeTag(url);
            if (!pwTagTool.isDefaultTag(normal)) {
                if (tags.indexOf(normal) === -1) {
                    tags.push(normal);
                }
            }
        }
        mongo.orig("insert", "password", {name: name, username: username, password: crypted_password, prePassword: prePassword, owner: owner, utime: utime, url: url, email: email, tags: tags, important: important}, function(err, item){
            if(err) {
                util.handleError(err, next, callback);
            }
            setTimeout(function(){
                callback(null, {id: item[0]._id});
            }, 0);
        });
    },
    getPassword: function(uid, user, next, callback) {
        id = util.isValidString(uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
        }
        mongo.orig("find", "password", {_id: id, owner: user._id}, {_id: 0, password: 1}, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, next, callback, null);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'can not password object!!!'}, next, callback, null);
            }
            var password = decrypt(items[0].password);
            setTimeout(function(){
                callback(null, {password: password});
                delete password;
            }, 0);
        });
    },
    delRow: function(id) {

    },
    editRow: function(id) {

    }
};

function encrypt(text){
    var cipher = crypto.createCipher(algorithm, config_type.password_private_key);
    var crypted = cipher.update(text + config_type.password_salt,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm, config_type.password_private_key);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    dec = dec.substr(0, dec.length-4);;
    return dec;
}