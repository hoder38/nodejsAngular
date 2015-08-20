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
        var url = '', email = '', userPW = '';
        if (data['url']) {
            url = util.isValidString(data['url'], 'url');
        }
        if (data['email']) {
            email = util.isValidString(data['email'], 'email');
        }
        if (data['userPW']) {
            userPW = util.isValidString(data['userPW'], 'passwd');
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
        if (userPW === false) {
            util.handleError({hoerror: 2, message: 'user password not vaild!!!'}, next, callback);
        }
        var crypted_password = encrypt(password);
        var prePassword = crypted_password;
        var owner = user._id;
        var utime = Math.round(new Date().getTime() / 1000);
        var important = 0;
        if (data['important']) {
            important = 1;
        }
        if (important !== 0) {
            if (!util.userPWCheck(user, userPW)) {
                util.handleError({hoerror: 2, message: "permission denied"}, next, callback);
            }
            delete data['userPW'];
            delete userPW;
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
        var new_data = {name: name, username: username, password: crypted_password, prePassword: prePassword, owner: owner, utime: utime, url: url, email: email, tags: tags, important: important};
        console.log(new_data);
        mongo.orig("insert", "password", new_data, function(err, item){
            if(err) {
                util.handleError(err, next, callback);
            }
            setTimeout(function(){
                callback(null, {id: item[0]._id});
            }, 0);
        });
    },
    getPassword: function(uid, type, userPW, user, next, callback) {
        type = typeof type !== 'undefined' ? type : null;
        var select = {_id: 0, important: 1};
        if (type === 'pre') {
            select['prePassword'] = 1;
        } else {
            select['password'] = 1;
        }
        var id = util.isValidString(uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
        }
        if (userPW) {
            userPW = util.isValidString(userPW, 'passwd');
        } else {
            userPW = '';
        }
        if (userPW === false) {
            util.handleError({hoerror: 2, message: 'user password not vaild!!!'}, next, callback);
        }
        mongo.orig("find", "password", {_id: id, owner: user._id}, select, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, next, callback);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'can not password object!!!'}, next, callback);
            }
            if (items[0].important !== 0) {
                if (!util.userPWCheck(user, userPW)) {
                    util.handleError({hoerror: 2, message: "permission denied"}, next, callback);
                }
                delete userPW;
            }
            var password = '';
            if (type === 'pre') {
                password = decrypt(items[0].prePassword);
            } else {
                password = decrypt(items[0].password);
            }
            setTimeout(function(){
                callback(null, {password: password});
                delete password;
            }, 0);
        });
    },
    delRow: function(uid, userPW, user, next, callback) {
        var id = util.isValidString(uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
        }
        if (userPW) {
            userPW = util.isValidString(userPW, 'passwd');
        } else {
            userPW = '';
        }
        if (userPW === false) {
            util.handleError({hoerror: 2, message: 'user password not vaild!!!'}, next, callback);
        }
        mongo.orig("find", "password" , {_id: id, owner: user._id}, {limit: 1}, function(err, pws){
            if(err) {
                util.handleError(err, next, callback);
            }
            if (pws.length === 0) {
                util.handleError({hoerror: 2, message: 'password row does not exist!!!'}, next, callback);
            }
            if (pws[0].important !== 0) {
                if (!util.userPWCheck(user, userPW)) {
                    util.handleError({hoerror: 2, message: "permission denied"}, next, callback);
                }
                delete userPW;
            }
            mongo.orig("remove", "password", {_id: id, owner: user._id, $isolated: 1}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                setTimeout(function(){
                    callback(null);
                }, 0);
            });
        });
    },
    editRow: function(uid, data, user, next, callback) {
        var id = util.isValidString(uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
        }
        var password = '', conpassword = '', name = '', username = '', url = '', email = '', userPW = '';
        if (data['password']) {
            password = util.isValidString(data['password'], 'passwd');
            conpassword = util.isValidString(data['conpassword'], 'passwd');
        }
        if (data['name']) {
            name = util.isValidString(data['name'], 'name');
        }
        if (data['username']) {
            username = util.isValidString(data['username'], 'name');
        }
        if (data['url']) {
            url = util.isValidString(data['url'], 'url');
        }
        if (data['email']) {
            email = util.isValidString(data['email'], 'email');
        }
        if (data['userPW']) {
            userPW = util.isValidString(data['userPW'], 'passwd');
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
        if (userPW === false) {
            util.handleError({hoerror: 2, message: 'user password not vaild!!!'}, next, callback);
        }
        mongo.orig("find", "password" , {_id: id, owner: user._id}, {limit: 1}, function(err, pws){
            if(err) {
                util.handleError(err, next, callback);
            }
            if (pws.length === 0) {
                util.handleError({hoerror: 2, message: 'password row does not exist!!!'}, next, callback);
            }
            var update_data = {};
            if (data.hasOwnProperty('important')) {
                if (data['important']) {
                    update_data['important'] = 1;
                } else {
                    update_data['important'] = 0;
                }
            }
            if (pws[0].important !== 0 || (data.hasOwnProperty('important') && pws[0].important !== update_data['important'])) {
                if (!util.userPWCheck(user, userPW)) {
                    util.handleError({hoerror: 2, message: "permission denied"}, next, callback);
                }
                delete data['userPW'];
                delete userPW;
            }
            var tags = pws[0].tags;
            var normal = '';
            if (name) {
                normal = pwTagTool.normalizeTag(name);
                if (!pwTagTool.isDefaultTag(normal)) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                }
                update_data['name'] = name;
            }
            if (username) {
                normal = pwTagTool.normalizeTag(username);
                if (!pwTagTool.isDefaultTag(normal)) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                }
                update_data['username'] = username;
            }
            if (email) {
                normal = pwTagTool.normalizeTag(email);
                if (!pwTagTool.isDefaultTag(normal)) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                }
                update_data['email'] = email;
            }
            if (url) {
                normal = pwTagTool.normalizeTag(url);
                if (!pwTagTool.isDefaultTag(normal)) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                }
                update_data['url'] = url;
            }
            update_data['tags'] = tags;

            if (password) {
                var crypted_password = encrypt(password);
                var prePassword = pws[0].password;
                var utime = Math.round(new Date().getTime() / 1000);
                update_data['password'] = crypted_password;
                update_data['prePassword'] = prePassword;
                update_data['utime'] = utime;
                console.log(update_data);
                mongo.orig("update", "password", {_id: id, owner: user._id}, {$set: update_data}, function(err, item){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            } else {
                console.log(update_data);
                mongo.orig("update", "password", {_id: id, owner: user._id}, {$set: update_data}, function(err, item){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            }
        });
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