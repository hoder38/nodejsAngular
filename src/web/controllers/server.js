/* jslint node: true */
/*jslint nomen: true */
/*global require, module,  __dirname */
/*global console: false */

var fs = require("fs"),
    path = require('path');

if(!fs.existsSync(path.join(__dirname, "../../../ver.js"))) {
    throw new Error('can not find ver.js');
}

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var mongo = require("../models/mongo-tool.js");

var api = require("../models/api-tool.js");

var googleApi = require("../models/api-tool-google.js");

var tagTool = require("../models/tag-tool.js")("storage");

var util = require("../util/utility.js");

var mime = require('../util/mime.js');

var drive_interval = 3600000;

var drive_batch = 100;

var http = require('http'),
    https = require('https'),
    privateKey  = fs.readFileSync(config_type.privateKey, 'utf8'),
    certificate = fs.readFileSync(config_type.certificate, 'utf8'),
    credentials = {key: privateKey, cert: certificate},
    express = require('express'),
    crypto = require('crypto'),
    child_process = require('child_process'),
    passport = require('passport'),
    Transcoder = require('stream-transcoder'),
    LocalStrategy = require('passport-local').Strategy,
    WebSocketServer = require('ws').Server,
    //WebSocketServer = require('websocket').server;
    app = express(),
    server = https.createServer(credentials, app),
    //port = 443,
    serverHttp = http.createServer(app),
    //port = 80,
    mkdirp = require('mkdirp'),
    encode = "utf8",
    viewsPath = path.join(__dirname, "../../../views"),
    staticPath = path.join(__dirname, "../../../public"),
    sessionStore = require("../models/session-tool.js")(express),
    sclients = [],
    jclients = [],
    clients = [];

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.session(sessionStore.config));
app.use(require('connect-multiparty')({ uploadDir: config_glb.nas_tmp }));
//app.use(express.session({ secret: 'holyhoderhome' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(staticPath));

//global entry
app.use('/views', function (req, res, next) {
    "use strict";
    console.log('views');
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    if (req.isAuthenticated()) {
        next();
    } else {
        fs.readFile(viewsPath + '/login.html', encode, function(err, file) {
            res.write(file);
            res.end();
        });
    }
});

app.get('/refresh', function (req, res, next) {
    console.log('refresh');
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    res.end("refresh");
});

app.get('/api/logout', function(req, res, next) {
    console.log("logout");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    if (req.isAuthenticated()) {
        //req.logout();
        req.session.destroy();
    }
    //res.clearCookie('id');
    res.json({apiOK: true});
});

app.get('/api/userinfo', function (req, res, next) {
    checkLogin(req, res, next, function(req, res) {
        console.log("userinfo");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var user_info = [];
        if (!util.checkAdmin(1, req.user)) {
            mongo.orig("find", "user", {_id: req.user._id}, {limit: 1}, function(err,users){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (users.length > 0 && users[0].auto) {
                    users[0].auto = 'https://drive.google.com/open?id=' + users[0].auto + '&authuser=0';
                }
                user_info.push({name: users[0].username, newable: false, auto: users[0].auto, editAuto: false});
                res.json({user_info: user_info});
            });
        } else {
            mongo.orig("find", "user", function(err,users){
                if(err) {
                    util.handleError(err, next, res);
                }
                for (var i in users) {
                    if (users[i].auto) {
                        users[i].auto = 'https://drive.google.com/open?id=' + users[i].auto + '&authuser=0';
                    }
                    if (users[i].perm === 1) {
                        users[i].unDay = users[i].unDay ? users[i].unDay : tagTool.getUnactive('day');
                        users[i].unHit = users[i].unHit ? users[i].unHit : tagTool.getUnactive('hit');
                        user_info.push({name: users[i].username, perm: users[i].perm, desc: users[i].desc, key: users[i]._id, newable: false, unDay: users[i].unDay, unHit: users[i].unHit, editAuto: true, auto: users[i].auto});
                    } else {
                        user_info.push({name: users[i].username, perm: users[i].perm, desc: users[i].desc, key: users[i]._id, delable: true, newable: false, editAuto: true, auto: users[i].auto});
                    }
                }
                user_info.push({name: '', perm: '', desc: '', newable: true});
                res.json({user_info: user_info});
            });
        }
    });
});

app.put('/api/edituser/(:uid)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("edituser");
        console.log(new Date());
        console.log(req.url);
        var pwd = util.isValidString(req.body.pwd, 'passwd');
        if (pwd === false) {
            util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
        }
        if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
            util.handleError({hoerror: 2, message: "password error"}, next, res);
        }
        var ret = {};
        var data = {};
        var needPerm = false;
        var id;
        if (req.body.auto) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            }
            var auto = util.isValidString(req.body.auto, 'url');
            if (auto === false) {
                util.handleError({hoerror: 2, message: "auto is not vaild"}, next, res);
            }
            var autoId = req.body.auto.match(/id=([^\&]*)/);
            if (!autoId || !autoId[1]) {
                util.handleError({hoerror: 2, message: "auto is not vaild"}, next, res);
            }
            data['auto'] = autoId[1];
            ret['auto'] = 'https://drive.google.com/open?id=' + autoId[1] + '&authuser=0';
            needPerm = true;
        }
        if (req.body.desc === '' || req.body.desc) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            }
            var desc = util.isValidString(req.body.desc, 'desc');
            if (desc === false) {
                util.handleError({hoerror: 2, message: "desc is not vaild"}, next, res);
            }
            data['desc'] = desc;
            ret['desc'] = desc;
            needPerm = true;
        }
        if (req.body.perm === '' || req.body.perm) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            }
            var perm = util.isValidString(req.body.perm, 'perm');
            if (perm === false) {
                util.handleError({hoerror: 2, message: "perm is not vaild"}, next, res);
            }
            if (req.user._id.equals(util.isValidString(req.params.uid, 'uid'))) {
                util.handleError({hoerror: 2, message: "owner can not eidt self perm"}, next, res);
            }
            data['perm'] = perm;
            ret['perm'] = perm;
            needPerm = true;
        }
        if (req.body.unDay && req.body.unDay) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            }
            var unDay = util.isValidString(req.body.unDay, 'int');
            if (unDay === false) {
                util.handleError({hoerror: 2, message: "unactive day is not vaild"}, next, res);
            }
            data['unDay'] = unDay;
            ret['unDay'] = unDay;
            needPerm = true;
        }
        if (req.body.unHit && req.body.unHit) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            }
            var unHit = util.isValidString(req.body.unHit, 'int');
            if (unHit === false) {
                util.handleError({hoerror: 2, message: "unactive hit is not vaild"}, next, res);
            }
            data['unHit'] = unHit;
            ret['unHit'] = unHit;
            needPerm = true;
        }
        if (req.body.newPwd && req.body.conPwd) {
            var newPwd = util.isValidString(req.body.newPwd, 'passwd'),
                conPwd = util.isValidString(req.body.conPwd, 'passwd');
            if (newPwd === false) {
                util.handleError({hoerror: 2, message: "new passwd is not vaild"}, next, res);
            }
            if (conPwd === false) {
                util.handleError({hoerror: 2, message: "con passwd is not vaild"}, next, res);
            }
            if (newPwd !== conPwd) {
                util.handleError({hoerror: 2, message: 'confirm password must equal!!!'}, next, res);
            }
            data['password'] = crypto.createHash('md5').update(newPwd).digest('hex');
        }
        if (util.checkAdmin(1, req.user)) {
            id = util.isValidString(req.params.uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
            }
        } else {
            if (needPerm) {
                util.handleError({hoerror: 2, message: 'unknown type in edituser'}, next, res, 403);
            } else {
                id = req.user._id;
            }
        }
        if (req.body.name) {
            var name = util.isValidString(req.body.name, 'name');
            if (name === false || tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            mongo.orig("find", "user", {username: name}, {username: 1, _id: 0}, {limit: 1}, function(err, users){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (users.length > 0) {
                    console.log(users);
                    util.handleError({hoerror: 2, message: 'already has one!!!'}, next, res);
                }
                data['username'] = name;
                ret['name'] = name;
                if (req.user._id.equals(id)) {
                    ret.owner = name;
                }
                console.log(data);
                mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user2){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    res.json(ret);
                });
            });
        } else {
            if (Object.getOwnPropertyNames(data).length === 0) {
                util.handleError({hoerror: 2, message: 'nothing to change!!!'}, next, res);
            }
            console.log(data);
            console.log(id);
            mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (Object.getOwnPropertyNames(ret).length === 0) {
                    res.json({apiOK: true});
                } else {
                    res.json(ret);
                }
            });
        }
    });
});

app.post('/api/adduser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        if (util.checkAdmin(1, req.user)) {
            console.log("adduser");
            console.log(new Date());
            console.log(req.url);
            var pwd = util.isValidString(req.body.pwd, 'passwd');
            if (pwd === false) {
                util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
            }
            if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
                util.handleError({hoerror: 2, message: "password error"}, next, res);
            }
            var name = util.isValidString(req.body.name, 'name'),
                desc = util.isValidString(req.body.desc, 'desc'),
                perm = util.isValidString(req.body.perm, 'perm'),
                newPwd = util.isValidString(req.body.newPwd, 'passwd'),
                conPwd = util.isValidString(req.body.conPwd, 'passwd');
            if (name === false || tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            if (desc === false) {
                util.handleError({hoerror: 2, message: "desc is not vaild"}, next, res);
            }
            if (perm === false) {
                util.handleError({hoerror: 2, message: "perm is not vaild"}, next, res);
            }
            if (newPwd === false) {
                util.handleError({hoerror: 2, message: "new passwd is not vaild"}, next, res);
            }
            if (conPwd === false) {
                util.handleError({hoerror: 2, message: "con passwd is not vaild"}, next, res);
            }
            mongo.orig("find", "user" , {username: name}, {username: 1,_id: 0}, {limit: 1}, function(err, users){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (users.length > 0) {
                    console.log(users);
                    util.handleError({hoerror: 2, message: 'already has one!!!'}, next, res);
                }
                if (newPwd !== conPwd) {
                    util.handleError({hoerror: 2, message: 'password must equal!!!'}, next, res);
                }
                var data = {};
                var item = {newable: false, delable: true, editAuto: true};
                item['name'] = name;
                item['desc'] = desc;
                item['perm'] = perm;
                data['username'] = name;
                data['desc'] = desc;
                data['perm'] = perm;
                data['password'] = crypto.createHash('md5').update(newPwd).digest('hex');
                console.log(data);
                mongo.orig("insert", "user", data, function(err, user){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    var ret = {item: item, newItem: {name: '', perm: '', desc: '', newable: true}};
                    res.json(ret);
                });
            });
        } else {
            util.handleError({hoerror: 2, message: 'unknown type in adduser'}, next, res, 403);
        }
    });
});

app.put('/api/deluser/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        if (!util.checkAdmin(1, req.user)) {
            util.handleError({hoerror: 2, message: 'unknown type in deluser'}, next, res, 403);
        }
        console.log("deluser");
        console.log(new Date());
        console.log(req.url);
        var pwd = util.isValidString(req.body.pwd, 'passwd'),
            id = util.isValidString(req.params.uid, 'uid');
        if (pwd === false) {
            util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
        }
        if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
            util.handleError({hoerror: 2, message: "password error"}, next, res);
        }
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "user" , {_id: id}, {limit: 1}, function(err,users){
            if(err) {
                util.handleError(err, next, res);
            }
            if (users.length === 0) {
                util.handleError({hoerror: 2, message: 'user does not exist!!!'}, next, res);
            }
            if (util.checkAdmin(1, users[0])) {
                util.handleError({hoerror: 2, message: 'owner cannot be deleted!!!'}, next, res);
            }
            mongo.orig("remove", "user", {_id: id, $isolated: 1}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                res.json({apiOK: true});
            });
        });
    });
});

app.get('/api/storage/getSingle/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("storage single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('fileSortName', req.params.sortName);
        res.cookie('fileSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        if (page === 0 && req.params.name) {
            var tags = tagTool.searchTags(req.session, 'parent');
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
            }
            var name = util.isValidString(req.params.name, 'name');
            if (req.params.name.match(/^>(\d+)$/)) {
                name = req.params.name;
            }
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            tags.setSingleArray(name);
        }
        tagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/storage/get/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("storage");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('fileSortName', req.params.sortName);
        res.cookie('fileSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        tagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/storage/single/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("storage single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        tagTool.singleQuery(req.params.uid, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            if (result.empty) {
                res.json(result);
            } else {
                var itemList = getStorageItem(req.user, [result.item], result.mediaHadle);
                res.json({item: itemList[0], latest: result.latest, bookmarkID: result.bookmark});
            }
        });
    });
});

app.get('/api/storage/reset', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("resetStorage");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'desc' || req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tagTool.resetQuery(sortName, sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList});
        });
    });
});

app.put('/api/addTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        tagTool.addTag(req.params.uid, req.body.tag, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'file', data: result.id}, result.adultonly);
            res.json(result);
        });
    });
});

app.put('/api/sendTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("sendTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        tagTool.sendTag(req.params.uid, req.body.name, req.body.tags, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'file', data: result.id}, result.adultonly);
            res.json(result);
        });
    });
});

app.put('/api/delTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        tagTool.delTag(req.params.uid, req.body.tag, req.user, next, function (err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'file', data: result.id}, result.adultonly);
            res.json(result);
        });
    });
});

app.put('/api/editFile/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("editFile");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        editFile(req.params.uid, req.body.name, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'file', data: result.id}, result.adultonly);
            delete result.adultonly;
            res.json(result);
        });
    });
});

function editFile(uid, newName, user, next, callback) {
    var name = util.isValidString(newName, 'name'),
        id = util.isValidString(uid, 'uid');
    if (name === false) {
        util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
    }
    if (id === false) {
        util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
    }
    mongo.orig("find", "storage", { _id: id }, {limit: 1}, function(err, items){
        if(err) {
            util.handleError(err, next, callback);
        }
        if (items.length === 0) {
            util.handleError({hoerror: 2, message: 'file not exist!!!'}, next, callback);
        }
        if (!util.checkAdmin(1, user) && !user._id.equals(items[0].owner)) {
            util.handleError({hoerror: 2, message: 'file is not yours!!!'}, next, callback);
        }
        mongo.orig("update", "storage", { _id: id }, {$set: {name: name}}, function(err, item2){
            if(err) {
                util.handleError(err, next, callback);
            }
            tagTool.addTag(uid, name, user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, callback);
                }
                if (items[0].tags.indexOf(result.tag) === -1) {
                    items[0].tags.splice(0, 0, result.tag);
                }
                if (items[0][user._id.toString()].indexOf(result.tag) === -1) {
                    items[0][user._id.toString()].splice(0, 0, result.tag);
                }
                var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                var time = Math.round(new Date().getTime() / 1000);
                handleTag(filePath, {utime: time, untag: 1}, newName, items[0].name, items[0].status, function(err, mediaType, mediaTag, DBdata) {
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    var temp_tag = [];
                    for (var i in mediaTag.def) {
                        if (items[0].tags.indexOf(mediaTag.def[i]) === -1) {
                            temp_tag.push(mediaTag.def[i]);
                        }
                    }
                    mediaTag.def = temp_tag;
                    var temp_tag2 = [];
                    for (var i in mediaTag.opt) {
                        if (items[0].tags.indexOf(mediaTag.opt[i]) === -1) {
                            temp_tag2.push(mediaTag.opt[i]);
                        }
                    }
                    mediaTag.opt = temp_tag2;
                    var tagsAdd = {$set: DBdata};
                    if (mediaTag.def.length > 0) {
                        tagsAdd['$addToSet'] = {tags: {$each: mediaTag.def}};
                        tagsAdd['$addToSet'][user._id.toString()] = {$each: mediaTag.def};
                    }
                    console.log(tagsAdd);
                    mongo.orig("update", "storage", {_id: id}, tagsAdd, {upsert: true}, function(err,item2){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        var result_tag = mediaTag.def.concat(items[0][user._id.toString()]);
                        var index_tag = 0;
                        for (var i in result_tag) {
                            index_tag = items[0].tags.indexOf(result_tag[i]);
                            if (index_tag !== -1) {
                                items[0].tags.splice(index_tag, 1);
                            }
                        }
                        if (items[0].adultonly === 1) {
                            result_tag.push('18禁');
                        } else {
                            if (util.checkAdmin(2, user)) {
                                mediaTag.opt.push('18禁');
                            }
                        }
                        if (items[0].first === 1) {
                            result_tag.push('first item');
                        } else {
                            mediaTag.opt.push('first item');
                        }
                        setTimeout(function(){
                            callback(null, {id: id, name: name, select: result_tag, option: mediaTag.opt, other: items[0].tags, adultonly: items[0].adultonly});
                        }, 0);
                        handleMediaUpload(mediaType, filePath, id, name, items[0].size, user, function(err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            if(err) {
                                util.handleError(err);
                            }
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    });
                });
            });
        });
    });
}

app.put('/api/recoverFile/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("recoverFile");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        if (!util.checkAdmin(1, req.user)) {
            console.log(user);
            util.handleError({hoerror: 2, message: "permission denied"}, next, res);
        }
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'file can not be fund!!!'}, next, res);
            }
            if (items[0].recycle !== 1 && items[0].recycle !== 2 && items[0].recycle !== 3 && items[0].recycle !== 4) {
                util.handleError({hoerror: 2, message: 'recycle file first!!!'}, next, res);
            }
            mongo.orig("update", "storage", { _id: id }, {$set: {recycle: 0}}, function(err, item2){
                if(err) {
                    util.handleError(err, next, res);
                }
                sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                res.json({apiOK: true});
            });
        });
    });
});

function deleteFolderRecursive(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

app.delete('/api/delFile/:uid/:recycle', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("delFile");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'file can not be fund!!!'}, next, res);
            }
            var recycle = 1;
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            if (req.params.recycle === '4' && util.checkAdmin(1, req.user)) {
                if (items[0].recycle !== 4) {
                    util.handleError({hoerror: 2, message: 'recycle file first!!!'}, next, res);
                }
                if (items[0].status === 7) {
                    mongo.orig("remove", "storage", {_id: id, $isolated: 1}, function(err, item2){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        console.log('perm delete file');
                        sendWs({type: 'file', data: items[0]._id}, 1, 1);
                        res.json({apiOK: true});
                    });
                } else {
                    var del_arr = [filePath];
                    if (fs.existsSync(filePath + '.jpg')) {
                        del_arr.push(filePath + '.jpg');
                    }
                    if (fs.existsSync(filePath + '_s.jpg')) {
                        del_arr.push(filePath + '_s.jpg');
                    }
                    if (fs.existsSync(filePath + '.srt')) {
                        del_arr.push(filePath + '.srt');
                    }
                    if (fs.existsSync(filePath + '.srt1')) {
                        del_arr.push(filePath + '.srt1');
                    }
                    if (fs.existsSync(filePath + '.vtt')) {
                        del_arr.push(filePath + '.vtt');
                    }
                    var index = 0;
                    console.log(del_arr);
                    deleteFolderRecursive(filePath + '_doc');
                    deleteFolderRecursive(filePath + '_img');
                    deleteFolderRecursive(filePath + '_present');
                    recur_del(del_arr[0]);
                    function recur_del(delPath) {
                        fs.unlink(delPath, function (err) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            index++;
                            if (index < del_arr.length) {
                                setTimeout(function(){
                                    recur_del(del_arr[index]);
                                }, 0);
                            } else {
                                mongo.orig("remove", "storage", {_id: id, $isolated: 1}, function(err, item2){
                                    if(err) {
                                        util.handleError(err, next, res);
                                    }
                                    console.log('perm delete file');
                                    sendWs({type: 'file', data: items[0]._id}, 1, 1);
                                    res.json({apiOK: true});
                                });
                            }
                        });
                    }
                }
            } else if (req.params.recycle === '0'){
                if (!util.checkAdmin(1, req.user) && !req.user._id.equals(items[0].owner)) {
                    util.handleError({hoerror: 2, message: 'file is not yours!!!'}, next, res);
                }
                mongo.orig("update", "storage", { _id: id }, {$set: {recycle: recycle, utime: Math.round(new Date().getTime() / 1000)}}, function(err, item2){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                    res.json({apiOK: true});
                    recur_backup();
                });
            } else {
                if (!util.checkAdmin(1, req.user)) {
                    util.handleError({hoerror: 2, message: 'permission dined!!!'}, next, res);
                }
                recycle = items[0].recycle;
                res.json({apiOK: true});
                recur_backup();
            }
            function recur_backup() {
                if (items[0].status === 7) {
                    mongo.orig("update", "storage", { _id: id }, {$set: {recycle: 4}}, function(err, item3){
                        if(err) {
                            util.handleError(err);
                        }
                        sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                    });
                } else {
                    googleApi.googleBackup(items[0]._id, items[0].name, filePath, items[0].tags, recycle, function(err) {
                        if(err) {
                            util.handleError(err);
                        } else {
                            recycle++;
                            mongo.orig("update", "storage", { _id: id }, {$set: {recycle: recycle}}, function(err, item3){
                                if(err) {
                                    util.handleError(err);
                                } else {
                                    sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                    if (recycle < 4) {
                                        setTimeout(function(){
                                            recur_backup();
                                        }, 0);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    });
});

function handleTag(filePath, DBdata, newName, oldName, status, callback){
    if (status === 7) {
        setTimeout(function(){
            callback(null, false, mime.mediaTag('url'), DBdata);
        }, 0);
    } else {
        var mediaType = mime.mediaType(newName),
            oldType = mime.mediaType(oldName),
            mediaTag = {def:[], opt:[]};
        var isVideo = false;
        if (mediaType && (status === 0 || status === 1 || status === 5) && (!oldType || (mediaType.ext !== oldType.ext))) {
            switch(mediaType['type']) {
                case 'video':
                case 'vlog':
                case 'music':
                    new Transcoder(filePath)
                    .on('metadata', function(meta) {
                        console.log(meta);
                        if (meta.input.streams) {
                            for (var i in meta.input.streams) {
                                if (meta.input.streams[i].size) {
                                    if (meta.input.streams[i].size.height >= 1080) {
                                        if (mediaType['type'] === 'vlog') {
                                            mediaType['hd'] = 1;
                                        } else {
                                            mediaType['hd'] = 1080;
                                        }
                                    } else if (meta.input.streams[i].size.height >= 720) {
                                        if (mediaType['type'] === 'vlog') {
                                            mediaType['hd'] = 1;
                                        } else {
                                            mediaType['hd'] = 720;
                                        }
                                    } else {
                                        mediaType['hd'] = 0;
                                    }
                                    isVideo = true;
                                }
                            }
                            mediaTag = mime.mediaTag(mediaType['type']);
                            if (!isVideo && mediaType['type'] === 'music') {
                                DBdata['status'] = 4;
                                mediaType = false;
                            } else if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                mediaType['time'] = meta.input.duration;
                                DBdata['status'] = 1;
                                if (mediaType['time'] < 20 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 1));
                                } else if (mediaType['time'] < 40 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                } else if (mediaType['time'] < 60 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
                                }
                                DBdata['mediaType'] = mediaType;
                            } else {
                                mediaType = false;
                            }
                        } else {
                            mediaType = false;
                        }
                        setTimeout(function(){
                            callback(null, mediaType, mediaTag, DBdata);
                        }, 0);
                    }).on('finish', function() {
                        console.log('metadata get');
                    }).on('error', function(err) {
                        util.handleError(err);
                    }).exec();
                    return;
                case 'image':
                case 'doc':
                case 'rawdoc':
                case 'sheet':
                case 'present':
                case 'zipbook':
                    DBdata['status'] = 1;
                    mediaTag = mime.mediaTag(mediaType['type']);
                    DBdata['mediaType'] = mediaType;
                    break;
                default:
                    util.handleError({hoerror: 2, message: 'unknown media type!!!'}, callback, callback, null, null, null);
            }
        } else {
            if (mediaType) {
                mediaTag = mime.mediaTag(mediaType['type']);
                switch(mediaType['type']) {
                    case 'video':
                    case 'vlog':
                        new Transcoder(filePath)
                        .on('metadata', function(meta) {
                            console.log(meta);
                            for (var i in meta.input.streams) {
                                if (meta.input.streams[i].size) {
                                    isVideo = true;
                                    break;
                                }
                            }
                            if (meta.input.streams) {
                                if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                    if (meta.input.duration < 20 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 1));
                                    } else if (meta.input.duration < 40 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                    } else if (meta.input.duration < 60 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
                                    }
                                }
                            }
                            mediaType = false;
                            setTimeout(function(){
                                callback(null, mediaType, mediaTag, DBdata);
                            }, 0);
                        }).on('finish', function() {
                            console.log('metadata get');
                        }).on('error', function(err) {
                            util.handleError(err);
                        }).exec();
                        return;
                }
                mediaType = false;
            }
        }
        setTimeout(function(){
            callback(null, mediaType, mediaTag, DBdata);
        }, 0);
    }
}

app.post('/upload/subtitle/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('upload substitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.files);
        if (req.files.file.size > (10 * 1024 * 1024)) {
            util.handleError({hoerror: 2, message: "size too large!!!"}, next, res);
        }
        var ext = mime.isSub(req.files.file.name);
        if (!ext) {
            util.handleError({hoerror: 2, message: "not valid subtitle!!!"}, next, res);
        }
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", { _id: id }, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, next, callback);
            }
            if (items.length === 0 ) {
                util.handleError({hoerror: 2, message: 'file not exist!!!'}, next, callback);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            var folderPath = path.dirname(filePath);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    if (fs.existsSync(filePath + '.' + ext)) {
                        fs.renameSync(filePath + '.' + ext, filePath + '.' + ext + '1');
                    }
                    var stream = fs.createReadStream(req.files.file.path);
                    stream.on('error', function(err){
                        console.log('save file error!!!');
                        util.handleError(err, next, res);
                    });
                    stream.on('close', SRT2VTT);
                    stream.pipe(fs.createWriteStream(filePath + '.' + ext));
                });
            } else {
                if (fs.existsSync(filePath + '.' + ext)) {
                    fs.renameSync(filePath + '.' + ext, filePath + '.' + ext + '1');
                }
                var stream = fs.createReadStream(req.files.file.path);
                stream.on('error', function(err){
                    console.log('save file error!!!');
                    util.handleError(err, next, res);
                });
                stream.on('close', SRT2VTT);
                stream.pipe(fs.createWriteStream(filePath + '.' + ext));
            }
            function SRT2VTT() {
                fs.readFile(req.files.file.path, function (err,data) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    data = util.bufferToString(data);
                    var result = "WEBVTT\n\n";
                    result = result + data.replace(/,/g, '.');
                    fs.writeFile(filePath + '.vtt', result, 'utf8', function (err) {
                        if (err) {
                            console.log(filePath + '.vtt');
                            util.handleError(err, next, res);
                        }
                        res.json({apiOK: true});
                    });
                });
            }
        });
    });
});

app.post('/upload/file/:type(\\d)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('upload files');
        console.log(new Date());
        console.log(req.url);
        console.log(req.files);
        console.log(req.body);
        var oOID = mongo.objectID();
        var filePath = util.getFileLocation(req.user._id, oOID);
        var folderPath = path.dirname(filePath);
        if (!fs.existsSync(folderPath)) {
            mkdirp(folderPath, function(err) {
                if(err) {
                    console.log(filePath);
                    util.handleError(err, next, res);
                }
                var stream = fs.createReadStream(req.files.file.path);
                stream.on('error', function(err){
                    console.log('save file error!!!');
                    util.handleError(err, next, res);
                });
                stream.on('close', streamClose);
                stream.pipe(fs.createWriteStream(filePath));
            });
        } else {
            var stream = fs.createReadStream(req.files.file.path);
            stream.on('error', function(err){
                console.log('save file error!!!');
                util.handleError(err, next, res);
            });
            stream.on('close', streamClose);
            stream.pipe(fs.createWriteStream(filePath));
        }
        function streamClose(){
            fs.unlink(req.files.file.path, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                var name = util.toValidName(req.files.file.name);
                if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                    name = mime.addPost(name, '1');
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var oUser_id = req.user._id;
                var ownerTag = [];
                var data = {};
                data['_id'] = oOID;
                data['name'] = name;
                data['owner'] = oUser_id;
                data['utime'] = utime;
                data['size'] = req.files.file.size;
                data['count'] = 0;
                data['first'] = 1;
                data['recycle'] = 0;
                if (util.checkAdmin(2 ,req.user) && Number(req.params.type) === 1) {
                    data['adultonly'] = 1;
                } else {
                    data['adultonly'] = 0;
                }
                data['untag'] = 1;
                data['status'] = 0;//media type
                handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    save2DB(mediaType, mediaTag, DBdata);
                });
                function save2DB(mediaType, mediaTag, DBdata) {
                    var normal = tagTool.normalizeTag(name);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    normal = tagTool.normalizeTag(req.user.username);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    var tags = tagTool.searchTags(req.session, 'parent');
                    if (tags) {
                        var parentList = tags.getArray();
                        for (var i in parentList.cur) {
                            normal = tagTool.normalizeTag(parentList.cur[i]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    mediaTag.def.push(normal);
                                }
                            } else {
                                if (normal === '18禁') {
                                    DBdata['adultonly'] = 1;
                                }
                            }
                        }
                        var temp_tag = [];
                        for (var j in mediaTag.opt) {
                            normal = tagTool.normalizeTag(mediaTag.opt[j]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    temp_tag.push(normal);
                                }
                            }
                        }
                        mediaTag.opt = temp_tag;
                    }
                    DBdata['tags'] = mediaTag.def;
                    DBdata[oUser_id] = mediaTag.def;
                    mongo.orig("insert", "storage", DBdata, function(err, item){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        console.log(item);
                        console.log('save end');
                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                        if (util.checkAdmin(2 ,req.user)) {
                            if (item[0].adultonly === 1) {
                                mediaTag.def.push('18禁');
                            } else {
                                mediaTag.opt.push('18禁');
                            }
                        }
                        if (item[0].first === 1) {
                            mediaTag.def.push('first item');
                        } else {
                            mediaTag.opt.push('first item');
                        }
                        res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                            if(err) {
                                util.handleError(err);
                            }
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    });
                }
            });
        };
    });
});

function handleMediaUpload(mediaType, filePath, fileID, fileName, fileSize, user, callback, vlog_act) {
    if (mediaType) {
        if (mediaType['type'] === 'vlog' || (mediaType['type'] === 'video' && vlog_act)) {
            api.xuiteApi("xuite.webhd.prepare.cloudbox.postFile", {full_path: '/AnNoPiHo/' + fileID.toString() + "." + mediaType['ext'], size: fileSize}, function(err, result) {
                if (err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                console.log(result);
                api.xuiteUpload(result.url, {auth_key: result.auth_key, checksum: result.checksum, api_otp: result.otp}, filePath, fileSize, function(err, uploadResult) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    console.log(uploadResult);
                    mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.key": uploadResult.key}}, function(err, item){
                        if(err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        handleMedia(mediaType, filePath, fileID, fileName, uploadResult.key, user, callback, vlog_act);
                    });
                });
            });
        } else if (mediaType['type'] === 'zipbook') {
            var zip_ext = mime.isZip(fileName);
            if (!zip_ext) {
                util.handleError({hoerror: 2, message: 'is not zip'}, callback, errerMedia, fileID, callback);
            }
            if (!fs.existsSync(filePath + '_img/temp')) {
                mkdirp(filePath + '_img/temp', function(err) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    zipbook();
                });
            } else {
                deleteFolderRecursive(filePath + '_img/temp');
                zipbook();
            }
            function zipbook() {
                var cmdline = 'unzip ' + filePath + ' -d ' + filePath + '_img/temp';
                if (zip_ext === 'rar') {
                    cmdline = 'unrar x ' + filePath + ' ' + filePath + '_img/temp';
                } else if (zip_ext === '7z') {
                    cmdline = '7za x ' + filePath + ' -o' + filePath + '_img/temp';
                }
                var folder = null;
                child_process.exec(cmdline, function (err, output) {
                    if (err) {
                        console.log(cmdline);
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    var zip_arr = [];
                    fs.readdirSync(filePath + '_img/temp').forEach(function(file,index){
                        var curPath = filePath + '_img/temp/' + file;
                        if(fs.lstatSync(curPath).isDirectory()) {
                            if (!folder) {
                                folder = file;
                            }
                        } else {
                            var ext = mime.isImage(file);
                            if (ext) {
                                var zip_number = file.match(/\d+/g);
                                if (!zip_number) {
                                    zip_number = [];
                                }
                                zip_arr.push({name: file, ext: ext, number: zip_number});
                            }
                        }
                    });
                    if (folder) {
                        fs.readdirSync(filePath + '_img/temp/' + folder).forEach(function(file,index){
                            var curPath = filePath + '_img/temp/' + folder + '/' + file;
                            if(!fs.lstatSync(curPath).isDirectory()) {
                                var ext = mime.isImage(file);
                                if (ext) {
                                    var zip_number = file.match(/\d+/g);
                                    if (!zip_number) {
                                        zip_number = [];
                                    }
                                    zip_arr.push({name: folder + '/' + file, ext: ext, number: zip_number});
                                }
                            }
                        });
                    }
                    var sort_result = zip_arr.sort(function(a, b) {
                        if (a.number.length === b.number.length) {
                            if (a.number.length > 0) {
                                for (var i in a.number) {
                                    if (Number(a.number[i]) !== Number(b.number[i])) {
                                        return (Number(a.number[i]) - Number(b.number[i]))*10;
                                    }
                                }
                            } else {
                                return 0;
                            }
                        } else {
                            return a.number.length - b.number.length;
                        }
                    });
                    for (var i in sort_result) {
                        var j = Number(i)+1;
                        fs.renameSync(filePath + '_img/temp/' + sort_result[i].name, filePath + '_img/' + j);
                    }
                    deleteFolderRecursive(filePath + '_img/temp');
                    var data = {type: 'media', name: fileID.toString() + "." + sort_result[0].ext, filePath: filePath + '_img/1'};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        if (metadata.thumbnailLink) {
                            mediaType['thumbnail'] = metadata.thumbnailLink;
                        } else {
                            console.log(metadata);
                            util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                        }
                        mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.key": metadata.id, present: sort_result.length}}, function(err, item){
                            if(err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            handleMedia(mediaType, filePath, fileID, fileName, metadata.id, user, callback, vlog_act);
                        });
                    });
                });
            }
        } else {
            if (mediaType['type'] === 'rawdoc') {
                mediaType['ext'] = 'txt';
            }
            var data = {type: 'media', name: fileID.toString() + "." + mediaType['ext'], filePath: filePath};
            if (mediaType['split']) {
                data['filePath'] = filePath + '_doc/split/' + mediaType['split'] + '.pdf';
            }
            if (mediaType['type'] === 'doc' || mediaType['type'] === 'rawdoc' || mediaType['type'] === 'sheet' || mediaType['type'] === 'present') {
                data['convert'] = true;
            }
            googleApi.googleApi('upload', data, function(err, metadata) {
                if (err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if(metadata.exportLinks && metadata.exportLinks['application/pdf']) {
                    mediaType['thumbnail'] = metadata.exportLinks['application/pdf'];
                    if (mediaType['type'] === 'present') {
                        if (metadata.alternateLink) {
                            mediaType['alternate'] = metadata.alternateLink;
                        } else {
                            console.log(metadata);
                            util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                        }
                    }
                } else if (mediaType['type'] === 'video' && metadata.alternateLink) {
                    mediaType['thumbnail'] = metadata.alternateLink;
                } else if (metadata.thumbnailLink) {
                    mediaType['thumbnail'] = metadata.thumbnailLink;
                } else {
                    console.log(metadata);
                    util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                }
                mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.key": metadata.id}}, function(err, item){
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    handleMedia(mediaType, filePath, fileID, fileName, metadata.id, user, callback, vlog_act);
                });
            });
        }
    }
}

function errerMedia(errMedia, fileID, callback) {
    mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.err": errMedia}}, function(err, item){
        if(err) {
            util.handleError(err, callback, callback);
        }
        console.log(item);
        setTimeout(function(){
            callback(err);
        }, 0);
    });
}

function completeMedia(fileID, status, callback, number) {
    var data = {status: status};
    if (number && number > 1) {
        data['present'] = number;
    }
    mongo.orig("update", "storage", { _id: fileID }, {$unset: {mediaType: ""}, $set: data}, function(err, item){
        if(err) {
            util.handleError(err, callback, callback);
        }
        setTimeout(function(){
            callback(null);
        }, 0);
    });
}

function handleMedia(mediaType, filePath, fileID, fileName, key, user, callback, vlog_act) {
    if (mediaType['type'] === 'image' || mediaType['type'] === 'zipbook') {
        if (mediaType['thumbnail']) {
            googleApi.googleDownload(mediaType['thumbnail'], filePath + ".jpg", function(err) {
                if (err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if (!mediaType['notOwner']) {
                    var data = {fileId: key};
                    googleApi.googleApi('delete', data, function(err) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        completeMedia(fileID, 2, callback);
                    });
                } else {
                    completeMedia(fileID, 2, callback);
                }
            });
        } else {
            var data = {fileId: key};
            googleApi.googleApi('get', data, function(err, filedata) {
                if (err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if (!filedata['thumbnailLink']) {
                    console.log(filedata);
                    util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                }
                googleApi.googleDownload(filedata['thumbnailLink'], filePath + ".jpg", function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    if (!mediaType['notOwner']) {
                        googleApi.googleApi('delete', data, function(err) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            completeMedia(fileID, 2, callback);
                        });
                    } else {
                        completeMedia(fileID, 2, callback);
                    }
                });
            });
        }
    } else if (mediaType['type'] === 'vlog' || (mediaType['type'] === 'video' && vlog_act)) {
        if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
            console.log(mediaType);
            util.handleError({hoerror: 2, message: 'video can not be decoded!!!'}, callback, errerMedia, fileID, callback);
        }
        api.xuiteDownloadMedia(1000, mediaType['time'], key, filePath, 1, mediaType['hd'], function(err, hd, video_url) {
            if(err) {
                util.handleError(err, callback, errerMedia, fileID, callback);
            }
            if (hd === 1) {
                mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.hd": 2, status: 3}}, function(err, item){
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    api.xuiteDownload(video_url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        api.xuiteDeleteFile(key, function(err) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            tagTool.addTag(fileID, 'hd', user, callback, function(err, result) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                tagTool.addTag(fileID, '720p', user, callback, function(err, result) {
                                    if (err) {
                                        util.handleError(err, callback, errerMedia, fileID, callback);
                                    }
                                    completeMedia(fileID, 3, function(err) {
                                        if (err) {
                                            util.handleError(err, callback, callback);
                                        } else {
                                            editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                                if(err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                setTimeout(function(){
                                                    callback(null);
                                                }, 0);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }, mediaType['time']);
                });
            } else if (hd === 2) {
                api.xuiteDownload(video_url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    api.xuiteDeleteFile(key, function(err) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        tagTool.addTag(fileID, 'hd', user, callback, function(err, result) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            tagTool.addTag(fileID, '720p', user, callback, function(err, result) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                completeMedia(fileID, 3, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    } else {
                                        editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                            if(err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    }
                                });
                            });
                        });
                    });
                }, mediaType['time']);
            } else {
                completeMedia(fileID, 3, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    } else {
                        editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    }
                });
            }
        });
    } else if (mediaType['type'] === 'video') {
        if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
            console.log(mediaType);
            util.handleError({hoerror: 2, message: 'video can not be decoded!!!'}, callback, errerMedia, fileID, callback);
        }
        if (mediaType['thumbnail']) {
            googleApi.googleDownloadMedia(mediaType['time'], mediaType['thumbnail'], key, filePath, mediaType['hd'], function(err) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                var data = {fileId: key};
                googleApi.googleApi('delete', data, function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    completeMedia(fileID, 3, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        } else {
                            editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        }
                    });
                });
            });
        } else {
            var data = {fileId: key};
            googleApi.googleApi('get', data, function(err, filedata) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if (!filedata['alternateLink']) {
                    console.log(filedata);
                    util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                }
                var is_ok = false;
                if (filedata['videoMediaMetadata'])  {
                    is_ok = true;
                }
                googleApi.googleDownloadMedia(mediaType['time'], filedata['alternateLink'], key, filePath, mediaType['hd'], function(err) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    googleApi.googleApi('delete', data, function(err) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        completeMedia(fileID, 3, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            } else {
                                editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                    if(err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                });
                            }
                        });
                    });
                }, is_ok);
            });
        }
    } else if (mediaType['type'] === 'doc' || mediaType['type'] === 'rawdoc' || mediaType['type'] === 'sheet') {
        var realPath = filePath;
        if (mediaType['split']) {
            realPath = filePath + '_doc/split/' + mediaType['split'] + '.pdf';
        }
        if (mediaType['thumbnail']) {
            googleApi.googleDownloadDoc(mediaType['thumbnail'], realPath, mediaType['ext'], function(err, number) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                rest_doc(number);
            });
        } else {
            var data = {fileId: key};
            googleApi.googleApi('get', data, function(err, filedata) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if (!filedata.exportLinks || !filedata.exportLinks['application/pdf']) {
                    console.log(filedata);
                    util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                }
                googleApi.googleDownloadDoc(filedata.exportLinks['application/pdf'], filePath, mediaType['ext'], function(err, number) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    rest_doc(number);
                });
            });
        }
        function rest_doc(number) {
            if (mediaType['ext'] === 'pdf') {
                if (!mediaType['split']) {
                    var cmdline = "pdftk " + filePath + " dump_data";
                    child_process.exec(cmdline, function (err, output) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        console.log(output);
                        var page = output.match(/NumberOfPages: (\d+)/);
                        if (page && page[1] > 10) {
                            mediaType['split'] = '10-' + page[1];
                            SMPdf(filePath, mediaType['split'], filePath + '_doc/split', function(err, is_finish, split) {
                                if(err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                var data = {fileId: key};
                                googleApi.googleApi('delete', data, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, errerMedia, fileID, callback);
                                    }
                                    mediaType['split'] = split;
                                    mongo.orig("update", "storage", { _id: fileID }, {$unset: {'mediaType.key': ""}, $set: {'media.split': mediaType['split']}}, function(err, item){
                                        if(err) {
                                            util.handleError(err, callback, errerMedia, fileID, callback);
                                        }
                                        if (is_finish) {
                                            deleteFolderRecursive(filePath + '_doc/split');
                                            var data = {fileId: key};
                                            googleApi.googleApi('delete', data, function(err) {
                                                if (err) {
                                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                                }
                                                completeMedia(fileID, 5, callback, number);
                                            });
                                        } else {
                                            handleMediaUpload(mediaType, filePath, fileID, fileName, 0, user, callback);
                                        }
                                    });
                                });
                            });
                        } else {
                            var data = {fileId: key};
                            googleApi.googleApi('delete', data, function(err) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                completeMedia(fileID, 5, callback, number);
                            });
                        }
                    });
                } else {
                    SMPdf(filePath, mediaType['split'], filePath + '_doc/split', function(err, is_finish, split) {
                        if(err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        var data = {fileId: key};
                        googleApi.googleApi('delete', data, function(err) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            mediaType['split'] = split;
                            mongo.orig("update", "storage", { _id: fileID }, {$unset: {'mediaType.key': ""}, $set: {'media.split': mediaType['split']}}, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                if (is_finish) {
                                    deleteFolderRecursive(filePath + '_doc/split');
                                    var data = {fileId: key};
                                    googleApi.googleApi('delete', data, function(err) {
                                        if (err) {
                                            util.handleError(err, callback, errerMedia, fileID, callback);
                                        }
                                        completeMedia(fileID, 5, callback, number);
                                    });
                                } else {
                                    handleMediaUpload(mediaType, filePath, fileID, fileName, 0, user, callback);
                                }
                            });
                        });
                    });
                }
            } else {
                var data = {fileId: key};
                googleApi.googleApi('delete', data, function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    completeMedia(fileID, 5, callback, number);
                });
            }
        }
    } else if (mediaType['type'] === 'present') {
        if (mediaType['thumbnail']) {
            googleApi.googleDownloadPresent(mediaType['thumbnail'], mediaType['alternate'], filePath, mediaType['ext'], function(err, number) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                var data = {fileId: key};
                googleApi.googleApi('delete', data, function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    completeMedia(fileID, 6, callback, number);
                });
            });
        } else {
            var data = {fileId: key};
            googleApi.googleApi('get', data, function(err, filedata) {
                if(err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                if (!filedata.exportLinks || !filedata.exportLinks['application/pdf']) {
                    console.log(filedata);
                    util.handleError({hoerror: 2, message: "error type"}, callback, errerMedia, fileID, callback);
                }
                googleApi.googleDownloadPresent(filedata.exportLinks['application/pdf'], filedata.alternateLink, filePath, mediaType['ext'], function(err, number) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    googleApi.googleApi('delete', data, function(err) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        completeMedia(fileID, 6, callback, number);
                    });
                });
            });
        }
    }
}

function SMPdf(filePath, progress, dir, callback) {
    var match = progress.match(/^(\d+)-(\d+)$/);
    if (!match) {
        util.handleError({hoerror: 2, message: match + " split progress error"}, callback, callback);
    }
    var j = Math.ceil(match[1]/10) - 1;
    if (j > 0) {
        fs.readFile(filePath + '_doc/split/' + progress + '.pdf_doc/doc.html', 'utf-8', function(err, htmlData){
            if (err) {
                util.handleError(err, callback, callback);
            }
            var newStyle = htmlData.match(/<style type="text\/css">.*<\/style>/);
            var newBody = htmlData.match(/<body class=[^>]+>(.*)$/);
            var finalStyle = newStyle[0];
            var finalBody = newBody[1];
            var i = 0;
            var k = (j - 1) * 30;
            var reg = new RegExp('c' + i + "\{");
            var reg1 = new RegExp('class="c' + i + '">', "g");
            while(newStyle[0].match(reg)) {
                finalStyle = finalStyle.replace(reg, 'd' + k + '{');
                finalBody = finalBody.replace(reg1, 'class="d' + k + '">');
                i++;
                k++;
                reg = new RegExp('c' + i + "\{");
                reg1 = new RegExp('class="c' + i + '">', "g");
            }
            finalBody = finalBody.replace(/src="images\/image0/g, 'src="images/image' + j);
            fs.appendFile(filePath + '_doc/doc.html', finalStyle + finalBody, 'utf-8', function (err) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if(fs.existsSync(filePath + '_doc/split/' + progress + '.pdf_doc/images')) {
                    fs.readdirSync(filePath + '_doc/split/' + progress + '.pdf_doc/images').forEach(function(file,index){
                        fs.renameSync(filePath + '_doc/split/' + progress + '.pdf_doc/images/' + file, filePath + '_doc/images/' + file.replace(/image0/, 'image' + j));
                    });
                }
                splitPdf();
            });
        });
    } else {
        splitPdf();
    }

    function splitPdf() {
        var end = Number(match[1]) + 10;
        var begin = Number(match[1]) + 1;
        if (match[1] === match[2]) {
            setTimeout(function(){
                callback(null, true);
            }, 0);
        } else {
            if (end > match[2]) {
                end = match[2];
            }
            var split = end + '-' + match[2];
            var cmdline = 'pdftk ' + filePath + ' cat ' + begin + '-' + end + ' output ' + dir + '/' + split + '.pdf';
            if (!fs.existsSync(dir)) {
                mkdirp(dir, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    child_process.exec(cmdline, function (err, output) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(output);
                        setTimeout(function(){
                            callback(null, false, split);
                        }, 0);
                    });
                });
            } else {
                child_process.exec(cmdline, function (err, output) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(output);
                    setTimeout(function(){
                        callback(null, false, split);
                    }, 0);
                });
            }
        }
    }
}

app.get('/api/handleMedia/:uid/:action(act|vlog|del)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('handle media');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
            console.log(items);
            switch(req.params.action) {
                case 'vlog':
                    if (!items[0].mediaType) {
                        util.handleError({hoerror: 2, message: "this file is not media!!!"}, next, res);
                    }
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    res.json({apiOK: true});
                    handleMediaUpload(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].size, req.user, function (err) {
                        sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                        util.handleError(err);
                        console.log('transcode done');
                        console.log(new Date());
                    }, true);
                case 'act':
                    if (!items[0].mediaType) {
                        util.handleError({hoerror: 2, message: "this file is not media!!!"}, next, res);
                    }
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    res.json({apiOK: true});
                    if(items[0].mediaType.key) {
                        handleMedia(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].mediaType.key, req.user, function (err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            util.handleError(err);
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    } else {
                        handleMediaUpload(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].size, req.user, function (err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            util.handleError(err);
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    }
                    break;
                case 'del':
                    res.json({apiOK: true});
                    completeMedia(items[0]._id, 0, function (err) {
                        sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                        util.handleError(err);
                        console.log('delete media done');
                    });
                    break;
                default:
                    util.handleError({hoerror: 2, message: "unknown action"}, next, res);
                    break;
            }
        });
    });
});

app.get('/api/parent/list/:lang?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('parent list');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var lang = typeof req.params.lang !== 'undefined' ? req.params.lang : 'tw';
        var list = tagTool.parentList();
        if (util.checkAdmin(2, req.user)) {
            list = list.concat(tagTool.adultonlyParentList());
        }
        var ret = [];
        for (var i in list) {
            ret.push({'name':list[i].name, 'show':list[i][lang]});
        }
        if (util.checkAdmin(1, req.user)) {
            res.json({parentList: ret, isEdit: true});
        } else {
            res.json({parentList: ret, isEdit: false});
        }
    });
});

app.get('/api/parent/taglist/:name/:sortName(name|mtime)/:sortType(desc|asc)/:page(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("showTaglist");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var page = Number(req.params.page);
        res.cookie('dir' + req.params.name + 'SortName', req.params.sortName);
        res.cookie('dir' + req.params.name + 'SortType', req.params.sortType);
        tagTool.parentQuery(req.params.name, req.params.sortName, req.params.sortType, page, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.post('/api/parent/add', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("parentAdd");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        tagTool.addParent(req.body.name, req.body.tag, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.delete('/api/parent/del/:id', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("parentDel");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        tagTool.delParent(id, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/parent/query/:id/:single?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("parent query");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'desc' || req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tagTool.queryParentTag(id, req.params.single, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/feedback', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("feedback");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        mongo.orig("find", "storage", {untag: 1, owner: req.user._id}, {sort: ["utime",'desc'], limit: 20}, function(err, items){
            if(err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0 && util.checkAdmin(1, req.user)) {
                mongo.orig("find", "storage", {untag: 1}, {sort: ["utime",'desc'], limit: 20}, function(err, items2){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    var feedback_arr = [];
                    if (items2.length === 0) {
                        res.json({feedbacks: feedback_arr});
                    } else {
                        recur_feedback(0);
                    }
                    function recur_feedback(index) {
                        getFeedback(items2[index], function(err, feedback) {
                            if(err) {
                                util.handleError(err, next, res);
                            }
                            feedback_arr.push(feedback);
                            index++;
                            if (index < items2.length) {
                                setTimeout(function(){
                                    recur_feedback(index);
                                }, 0);
                            } else {
                                res.json({feedbacks: feedback_arr});
                            }
                        }, req.user);
                    }
                });
            } else {
                var feedback_arr = [];
                if (items.length === 0) {
                    res.json({feedbacks: feedback_arr});
                } else {
                    recur_feedback(0);
                }
                function recur_feedback(index) {
                    getFeedback(items[index], function(err, feedback) {
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        feedback_arr.push(feedback);
                        index++;
                        if (index < items.length) {
                            setTimeout(function(){
                                recur_feedback(index);
                            }, 0);
                        } else {
                            res.json({feedbacks: feedback_arr});
                        }
                    }, req.user);
                }
            }
        });
    });
});

//user_id是改不是owner的時候用
function getFeedback(item, callback, user) {
    var filePath = util.getFileLocation(item.owner, item._id);
    handleTag(filePath, {}, item.name, '', item.status, function(err, mediaType, mediaTag, DBdata) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        var temp_tag = [];
        for (var i in mediaTag.opt) {
            if (item.tags.indexOf(mediaTag.opt[i]) === -1) {
                temp_tag.push(mediaTag.opt[i]);
            }
        }
        if (item.first === 1) {
            item.tags.push('first item');
        } else {
            temp_tag.push('first item');
        }
        if (item.adultonly === 1) {
            item.tags.push('18禁');
        } else {
            if (util.checkAdmin(2, user)) {
                temp_tag.push('18禁');
            }
        }
        if (!util.checkAdmin(1, user)) {
            var index_tag = 0;
            for (var i in item[user._id.toString()]) {
                index_tag = item.tags.indexOf(item[user._id.toString()][i]);
                if (index_tag !== -1) {
                    item.tags.splice(index_tag, 1);
                }
            }
            setTimeout(function(){
                callback(null, {id: item._id, name: item.name, select: item[user._id.toString()], option: temp_tag, other: item.tags});
            }, 0);
        } else {
            setTimeout(function(){
                callback(null, {id: item._id, name: item.name, select: item.tags, option: temp_tag, other: []});
            }, 0);
        }
    });
}

app.get('/api/bookmark/getList/:sortName(name|mtime)/:sortType(desc|asc)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get bookmark list");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.cookie('bookmarkSortName', req.params.sortName);
        res.cookie('bookmarkSortType', req.params.sortType);
        tagTool.getBookmarkList(req.params.sortName, req.params.sortType, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({bookmarkList: result.bookmarkList});
        });
    });
});

app.get('/api/bookmark/get/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'desc' || req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tagTool.getBookmark(id, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.post('/api/bookmark/add', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("addbookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        tagTool.addBookmark(name, req.user, req.session, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.delete('/api/bookmark/del/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("del bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        tagTool.delBookmark(id, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({id: result.id});
        });
    });
});

app.get('/api/media/more/:type(\\d+)/:page(\\d+)/:back(back)?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('more media');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        if (req.params.type < 2 || req.params.type > 6) {
            util.handleError({hoerror: 2, message: "media type error"}, next, res);
        }
        var saveName = '';
        var type = Number(req.params.type);
        var page = Number(req.params.page);
        switch (type) {
            case 2:
                saveName = 'image';
                break;
            case 3:
                saveName = 'video';
                break;
            case 4:
                saveName = 'music';
                break;
            case 5:
                saveName = 'doc';
                break;
            case 6:
                saveName = 'present';
                break;
            default:
                util.handleError({hoerror: 2, message: "unknown type"}, next, res);
        }
        var sql = tagTool.saveSql(page, saveName, req.params.back, req.user, req.session);
        if (!sql) {
            util.handleError({hoerror: 2, message: "query error"}, next, res);
        }
        sql.nosql['status'] = type;
        mongo.orig("find", "storage", sql.nosql, sql.options, function(err, items){
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, items);
            res.json({itemList: itemList});
        });
    });
});

app.post('/api/media/saveParent', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('saveParent');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        var tags = tagTool.searchTags(req.session, 'parent');
        if (!tags) {
            util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
            if (sortName === 'mtime') {
                sortName = 'utime';
            }
        }
        if (req.cookies.fileSortType === 'desc' || req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tags.saveArray(name, sortName, sortType);
        res.json({apiOK: true});
    });
});

app.get('/api/media/record/:id/:time(\\d+)', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('media doc record');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "file is not vaild"}, next, res);
        }
        if (req.params.time === '0') {
            mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: id, $isolated: 1}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                res.json({apiOK: true});
            });
        } else {
            var utime = Math.round(new Date().getTime() / 1000);
            var data = {};
            data['recordTime'] = req.params.time;
            data['mtime'] = utime;
            mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: id}, {$set: data}, function(err, item){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (item === 0) {
                    mongo.orig("find", "storageRecord", {userId: req.user._id}, {"skip" : 100, "sort":  [["mtime", "desc"]]}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length === 0) {
                            data['userId'] = req.user._id;
                            data['fileId'] = id;
                            data['recordTime'] = req.params.time;
                            data['mtime'] = utime;
                            mongo.orig("insert", "storageRecord", data, function(err, item1){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                res.json({apiOK: true});
                            });
                        } else {
                            data['fileId'] = id;
                            data['recordTime'] = req.params.time;
                            data['mtime'] = utime;
                            mongo.orig("update", "storageRecord", {_id: items[0]._id}, {$set: data}, function(err, item1){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                res.json({apiOK: true});
                            });
                        }
                    });
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

app.get('/api/media/setTime/:id/:type', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('media setTime');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "file is not vaild"}, next, res);
        }
        var type = util.isValidString(req.params.type, 'name');
        if (type === false) {
            util.handleError({hoerror: 2, message: "type is not vaild"}, next, res);
        }
        if (type === 'url') {
            res.json({apiOK: true});
            tagTool.setLatest('', id, req.session, next, function(err) {
                if (err) {
                    util.handleError(err);
                }
                mongo.orig("update", "storage", {_id: id}, {$inc: { count: 1}}, function(err, item2){
                    if(err) {
                        util.handleError(err);
                    }
                });
            });
        } else {
            mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: id}, {limit: 1}, function(err, items){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length === 0) {
                    res.json({apiOK: true});
                } else {
                    res.json({time: items[0].recordTime});
                }
                tagTool.setLatest(type, id, req.session, next, function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                    mongo.orig("update", "storage", {_id: id}, {$inc: { count: 1}}, function(err, item2){
                        if(err) {
                            util.handleError(err);
                        }
                    });
                });
            });
        }
    });
});

app.post('/api/upload/url/:type(\\d)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('upload url');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var url = util.isValidString(req.body.url, 'url');
        if (url === false) {
            util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
        }
        var oOID = mongo.objectID();
        var filePath = util.getFileLocation(req.user._id, oOID);
        var folderPath = path.dirname(filePath);
        if (!fs.existsSync(folderPath)) {
            mkdirp(folderPath, function(err) {
                if(err) {
                    console.log(filePath);
                    util.handleError(err, next, res);
                }
                streamClose();
            });
        } else {
            streamClose();
        }
        function streamClose(){
            api.xuiteDownload(decodeURIComponent(url), filePath, function(err, pathname, filename) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (!filename) {
                    filename = path.basename(pathname);
                }
                var name = util.toValidName(filename);
                if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                    name = mime.addPost(name, '1');
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var oUser_id = req.user._id;
                var ownerTag = [];
                var data = {};
                data['_id'] = oOID;
                data['name'] = name;
                data['owner'] = oUser_id;
                data['utime'] = utime;
                var stats = fs.statSync(filePath);
                data['size'] = stats["size"];
                data['count'] = 0;
                data['recycle'] = 0;
                if (util.checkAdmin(2 ,req.user) && Number(req.params.type) === 1) {
                    data['adultonly'] = 1;
                } else {
                    data['adultonly'] = 0;
                }
                data['untag'] = 1;
                data['first'] = 1;
                data['status'] = 0;//media type
                handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    var normal = tagTool.normalizeTag(name);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    normal = tagTool.normalizeTag(req.user.username);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    if (mediaTag.def.indexOf('url upload') === -1) {
                        mediaTag.def.push('url upload');
                    }
                    var tags = tagTool.searchTags(req.session, 'parent');
                    if (tags) {
                        var parentList = tags.getArray();
                        for (var i in parentList.cur) {
                            normal = tagTool.normalizeTag(parentList.cur[i]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    mediaTag.def.push(normal);
                                }
                            } else {
                                if (normal === '18禁') {
                                    DBdata['adultonly'] = 1;
                                }
                            }
                        }
                        var temp_tag = [];
                        for (var j in mediaTag.opt) {
                            normal = tagTool.normalizeTag(mediaTag.opt[j]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    temp_tag.push(normal);
                                }
                            }
                        }
                        mediaTag.opt = temp_tag;
                    }
                    DBdata['tags'] = mediaTag.def;
                    DBdata[oUser_id] = mediaTag.def;
                    mongo.orig("insert", "storage", DBdata, function(err, item){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        console.log(item);
                        console.log('save end');
                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                        if (util.checkAdmin(2 ,req.user)) {
                            if (item[0].adultonly === 1) {
                                mediaTag.def.push('18禁');
                            } else {
                                mediaTag.opt.push('18禁');
                            }
                        }
                        if (item[0].first === 1) {
                            mediaTag.def.push('first item');
                        } else {
                            mediaTag.opt.push('first item');
                        }
                        res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                            if(err) {
                                util.handleError(err);
                            }
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    });
                });
            });
        }
    });
});

app.post('/api/addurl/:type(\\d)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('add url');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var url = util.isValidString(req.body.url, 'url');
        if (url === false) {
            util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
        }
        var url_name = util.toValidName(url);
        if (tagTool.isDefaultTag(tagTool.normalizeTag(url_name))) {
            url_name = mime.addPost(url_name, '1');
        }
        var oOID = mongo.objectID();
        var utime = Math.round(new Date().getTime() / 1000);
        var oUser_id = req.user._id;
        var ownerTag = [];
        var data = {};
        data['_id'] = oOID;
        data['name'] = url_name;
        data['owner'] = oUser_id;
        data['utime'] = utime;
        data['url'] = url;
        data['size'] = 0;
        data['count'] = 0;
        data['first'] = 1;
        data['recycle'] = 0;
        if (util.checkAdmin(2 ,req.user) && Number(req.params.type) === 1) {
            data['adultonly'] = 1;
        } else {
            data['adultonly'] = 0;
        }
        data['untag'] = 1;
        data['status'] = 7;//media type
        handleTag('', data, url_name, '', 7, function(err, mediaType, mediaTag, DBdata) {
            if (err) {
                util.handleError(err, next, res);
            }
            var normal = tagTool.normalizeTag(url_name);
            if (mediaTag.def.indexOf(normal) === -1) {
                mediaTag.def.push(normal);
            }
            normal = tagTool.normalizeTag(req.user.username);
            if (mediaTag.def.indexOf(normal) === -1) {
                mediaTag.def.push(normal);
            }
            var tags = tagTool.searchTags(req.session, 'parent');
            if (tags) {
                var parentList = tags.getArray();
                for (var i in parentList.cur) {
                    normal = tagTool.normalizeTag(parentList.cur[i]);
                    if (!tagTool.isDefaultTag(normal)) {
                        if (mediaTag.def.indexOf(normal) === -1) {
                            mediaTag.def.push(normal);
                        }
                    } else {
                        if (normal === '18禁') {
                            DBdata['adultonly'] = 1;
                        }
                    }
                }
                var temp_tag = [];
                for (var j in mediaTag.opt) {
                    normal = tagTool.normalizeTag(mediaTag.opt[j]);
                    if (!tagTool.isDefaultTag(normal)) {
                        if (mediaTag.def.indexOf(normal) === -1) {
                            temp_tag.push(normal);
                        }
                    }
                }
                mediaTag.opt = temp_tag;
            }
            data['tags'] = mediaTag.def;
            data[oUser_id] = mediaTag.def;
            mongo.orig("insert", "storage", data, function(err, item){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(item);
                console.log('save end');
                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                if (util.checkAdmin(2 ,req.user)) {
                    if (item[0].adultonly === 1) {
                        mediaTag.def.push('18禁');
                    } else {
                        mediaTag.opt.push('18禁');
                    }
                }
                if (item[0].first === 1) {
                    mediaTag.def.push('first item');
                } else {
                    mediaTag.opt.push('first item');
                }
                res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
            });
        });
    });
});

app.get('/api/getUser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get user');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var ws_url = 'wss://' + config_glb.ip + ':' + config_glb.wsj_port;
        if (util.checkAdmin(1, req.user)) {
            ws_url = 'wss://' + config_glb.ip + ':' + config_glb.wss_port;
        } else if (util.checkAdmin(2, req.user)) {
            ws_url = 'wss://' + config_glb.ip + ':' + config_glb.ws_port;
        }
        var isAdult = false;
        if (util.checkAdmin(2 ,req.user)) {
            isAdult = true;
        }
        res.json({id: req.user.username, ws_url: ws_url, isAdult: isAdult});
    });
});

app.get('/download/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('download file');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            console.log(filePath);
            if (!fs.existsSync(filePath)) {
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
            tagTool.setLatest('', items[0]._id, req.session, next, function(err) {
                if (err) {
                    util.handleError(err);
                }
                mongo.orig("update", "storage", {_id: items[0]._id}, {$inc: { count: 1}}, function(err, item2){
                    if(err) {
                        util.handleError(err);
                    }
                    //sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                });
            });
            res.download(filePath, unescape(encodeURIComponent(items[0].name)));
        });
    });
});

app.get('/image/:uid/:number(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('download img');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                console.log(filePath);
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            if (items[0].present) {
                if (req.params.number) {
                    index = Number(req.params.number);
                    filePath = filePath + "_img/" + index;
                    console.log('image record');
                    if (index === 1 || index === items[0].present) {
                        mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: items[0]._id, $isolated: 1}, function(err,user){
                            if(err) {
                                util.handleError(err, next, res);
                            }
                            getImage(filePath);
                        });
                    } else {
                        var utime = Math.round(new Date().getTime() / 1000);
                        var data = {};
                        data['recordTime'] = index;
                        data['mtime'] = utime;
                        mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {$set: data}, function(err, item2){
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            if (item2 === 0) {
                                mongo.orig("find", "storageRecord", {userId: req.user._id}, {"skip" : 100, "sort":  [["mtime", "desc"]]}, function(err, items2){
                                    console.log(items2);
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (items2.length === 0) {
                                        data['userId'] = req.user._id;
                                        data['fileId'] = items[0]._id;
                                        data['recordTime'] = index;
                                        data['mtime'] = utime;
                                        mongo.orig("insert", "storageRecord", data, function(err, item3){
                                            if(err) {
                                                util.handleError(err, next, res);
                                            }
                                            getImage(filePath);
                                        });
                                    } else {
                                        data['fileId'] = items[0]._id;
                                        data['recordTime'] = index;
                                        data['mtime'] = utime;
                                        mongo.orig("update", "storageRecord", {_id: items2[0]._id}, {$set: data}, function(err, item3){
                                            if(err) {
                                                util.handleError(err, next, res);
                                            }
                                            getImage(filePath);
                                        });
                                    }
                                });
                            } else {
                                getImage(filePath);
                            }
                        });
                    }
                } else {
                    console.log('image settime');
                    mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {limit: 1}, function(err, items3){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items3.length === 0) {
                            filePath = filePath + "_img/1";
                        } else {
                            filePath = filePath + "_img/" + items3[0].recordTime;
                        }
                        getImage(filePath);
                    });
                }
            } else {
                getImage(filePath);
            }
            function getImage(imageFilePath) {
                /*tagTool.setLatest('image', items[0]._id, req.session, next, function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                    if (is_count) {
                        mongo.orig("update", "storage", {_id: items[0]._id}, {$set: {count: items[0].count+1}}, function(err, item4){
                            if(err) {
                                util.handleError(err, next, res);
                            }
                            //sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                        });
                    }
                });*/
                if (!fs.existsSync(imageFilePath)) {
                    console.log(imageFilePath);
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                res.download(imageFilePath, unescape(encodeURIComponent(items[0].name)));
            }
        });
    });
});

app.get('/preview/:uid/:type(doc|images|resources|\\d+)?/:imgName(image\\d+.png||sheet\.css)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('preview');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length > 0 && (items[0].status === 2 || items[0].status === 3 || items[0].status === 5 || items[0].status === 6)) {
                var type = 'image/jpeg', ext = '.jpg';
                if (items[0].status === 2) {
                    getDoc(type, ext);
                } else if (items[0].status === 3) {
                    ext = '_s.jpg';
                    getDoc(type, ext);
                } else if (items[0].status === 5) {
                    if (req.params.type) {
                        if (req.params.type === 'doc' && !req.params.imgName) {
                            type = 'text/html';
                            console.log('doc xls settime');
                            mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {limit: 1}, function(err, items2){
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                if (items2.length === 0 || !items[0].present) {
                                    ext = '_doc/doc.html';
                                } else {
                                    ext = '_doc/doc' + items2[0].recordTime + '.html';
                                }
                                getDoc(type, ext);
                            });
                        } else if (req.params.type === 'images' && req.params.imgName) {
                            ext = '_doc/images/' + req.params.imgName;
                            getDoc(type, ext);
                        } else if (req.params.type === 'resources' && req.params.imgName === 'sheet.css'){
                            type = 'text/css';
                            ext = '_doc/resources/sheet.css';
                            getDoc(type, ext);
                        } else if (Number(req.params.type) > 0){
                            type = 'text/html';
                            var index = Number(req.params.type);
                            console.log('xls record');
                            if (index === 1) {
                                ext = '_doc/doc.html';
                                mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: items[0]._id, $isolated: 1}, function(err,user){
                                    if(err) {
                                        util.handleError(err, next, res);
                                    }
                                    getDoc(type, ext);
                                });
                            } else {
                                ext = '_doc/doc' + index + '.html';
                                var utime = Math.round(new Date().getTime() / 1000);
                                var data = {};
                                data['recordTime'] = index;
                                data['mtime'] = utime;
                                mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {$set: data}, function(err, item2){
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (item2 === 0) {
                                        mongo.orig("find", "storageRecord", {userId: req.user._id}, {"skip" : 100, "sort":  [["mtime", "desc"]]}, function(err, items3){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items3.length === 0) {
                                                data['userId'] = req.user._id;
                                                data['fileId'] = items[0]._id;
                                                data['recordTime'] = index;
                                                data['mtime'] = utime;
                                                mongo.orig("insert", "storageRecord", data, function(err, item3){
                                                    if(err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    getDoc(type, ext);
                                                });
                                            } else {
                                                data['fileId'] = items[0]._id;
                                                data['recordTime'] = index;
                                                data['mtime'] = utime;
                                                mongo.orig("update", "storageRecord", {_id: items3[0]._id}, {$set: data}, function(err, item3){
                                                    if(err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    getDoc(type, ext);
                                                });
                                            }
                                        });
                                    } else {
                                        getDoc(type, ext);
                                    }
                                });
                            }
                        } else {
                            util.handleError({hoerror: 2, message: "cannot find doc!!!"}, next, res);
                        }
                    } else {
                        util.handleError({hoerror: 2, message: "cannot find doc!!!"}, next, res);
                    }
                } else if (items[0].status === 6) {
                    if (req.params.type) {
                        var index = Number(req.params.type);
                        if (index > 0) {
                            type = 'image/svg+xml';
                            ext = '_present/' + index + '.svg';
                            console.log('present record');
                            if (index === 1) {
                                mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: items[0]._id, $isolated: 1}, function(err,user){
                                    if(err) {
                                        util.handleError(err, next, res);
                                    }
                                    getDoc(type, ext);
                                });
                            } else {
                                var utime = Math.round(new Date().getTime() / 1000);
                                var data = {};
                                data['recordTime'] = index;
                                data['mtime'] = utime;
                                mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {$set: data}, function(err, item2){
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (item2 === 0) {
                                        mongo.orig("find", "storageRecord", {userId: req.user._id}, {"skip" : 100, "sort":  [["mtime", "desc"]]}, function(err, items3){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items3.length === 0) {
                                                data['userId'] = req.user._id;
                                                data['fileId'] = items[0]._id;
                                                data['recordTime'] = index;
                                                data['mtime'] = utime;
                                                mongo.orig("insert", "storageRecord", data, function(err, item3){
                                                    if(err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    getDoc(type, ext);
                                                });
                                            } else {
                                                data['fileId'] = items[0]._id;
                                                data['recordTime'] = index;
                                                data['mtime'] = utime;
                                                mongo.orig("update", "storageRecord", {_id: items3[0]._id}, {$set: data}, function(err, item3){
                                                    if(err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    getDoc(type, ext);
                                                });
                                            }
                                        });
                                    } else {
                                        getDoc(type, ext);
                                    }
                                });
                            }
                        } else {
                            util.handleError({hoerror: 2, message: "cannot find present!!!"}, next, res);
                        }
                    } else {
                        console.log('present settime');
                        mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {limit: 1}, function(err, items2){
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            type = 'image/svg+xml';
                            if (items2.length === 0) {
                                ext = '_present/1.svg';
                            } else {
                                ext = '_present/' + items2[0].recordTime + '.svg';
                            }
                            getDoc(type, ext);
                        });
                    }
                }
                function getDoc(docMime, docExt) {
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    /*if (items[0].status === 6 || (items[0].status === 5 && (req.params.type === 'doc' || Number(req.params.type) > 0))) {
                        var saveType = 'doc';
                        if (items[0].status === 6) {
                            saveType = 'present';
                        }
                        tagTool.setLatest(saveType, items[0]._id, req.session, next, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            if (is_count) {
                                mongo.orig("update", "storage", {_id: items[0]._id}, {$set: {count: items[0].count+1}}, function(err, item2){
                                    if(err) {
                                        util.handleError(err, next, res);
                                    }
                                    //sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                });
                            }
                        });
                    }*/
                    if (!fs.existsSync(filePath + docExt)) {
                        console.log(filePath + docExt);
                        util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                    }
                    res.writeHead(200, { 'Content-Type': docMime });
                    var stream = fs.createReadStream(filePath + docExt).pipe(res);
                }
            } else {
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
        });
    });
});

app.get('/subtitle/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length > 0 && items[0].status === 3) {
                var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                fs.exists(filePath + '.vtt', function (exists) {
                    res.writeHead(200, { 'Content-Type': 'text/vtt' });
                    if (!exists) {
                        var stream = fs.createReadStream('/home/pi/app/public/123.vtt').pipe(res);
                    } else {
                        var stream = fs.createReadStream(filePath + '.vtt').pipe(res);
                    }
                });
            } else {
                util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
            }
        });
    });
});

app.get('/video/:uid', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("video");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length > 0 && (items[0].status === 3 || items[0].status === 4)) {
                var videoPath = util.getFileLocation(items[0].owner, items[0]._id);
                /*var saveType = 'video';
                if (items[0].status === 4) {
                    saveType = 'music';
                }
                tagTool.setLatest(saveType, items[0]._id, req.session, next, function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                    mongo.orig("update", "storage", {_id: items[0]._id}, {$set: {count: items[0].count+1}}, function(err, item2){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        //sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                    });
                });*/
                if (!fs.existsSync(videoPath)) {
                    console.log(videoPath);
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                fs.stat(videoPath, function(err, video) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    var total = video.size;
                    if (req.headers['range']) {
                        var range = req.headers.range;
                        var parts = range.replace(/bytes=/, "").split("-");
                        var partialstart = parts[0];
                        var partialend = parts[1];

                        var start = parseInt(partialstart, 10);
                        var end = partialend ? parseInt(partialend, 10) : total-1;
                        var chunksize = (end-start)+1;
                        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(videoPath, {start: start, end: end}).pipe(res);
                    } else {
                        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(videoPath).pipe(res);
                    }
                });
            } else {
                util.handleError({hoerror: 2, message: "cannot find video!!!"}, next, res);
            }
        });
    });
});

//passport
passport.use(new LocalStrategy(function(username, password, done){
    //記得檢查input!!!
    console.log('login');
    console.log(username);
    var name = util.isValidString(username, 'name'),
        pwd = util.isValidString(password, 'passwd');
    if (name === false) {
        util.handleError({hoerror: 2, message: "username is not vaild"}, done);
        done(null, false, { message: "username is not vaild" });
    } else {
        if (pwd === false) {
            util.handleError({hoerror: 2, message: "passwd is not vaild"}, done);
            done(null, false, { message: "passwd is not vaild" });
        } else {
            mongo.orig("find", "user" ,{username: name}, {limit: 1}, function(err,users){
                if(err) {
                    util.handleError(err, done, function(err) {
                        return done(err);
                    });
                }
                if(users.length === 0){
                    return done(null, false, { message: "Incorrect username." });
                }
                var encodePwd = crypto.createHash('md5').update(pwd).digest('hex');
                if (encodePwd === users[0].password) {
                    return done(null, users[0]);
                }
                return done(null, false, { message: 'Incorrect password.' });
            });
        }
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    mongo.orig("find", "user", {_id: mongo.objectID(id)}, {limit: 1}, function(err,users){
        if(err) {
            util.handleError(err, done, function(err) {
                return done(err);
            });
        }
        done(null,users[0]);
    });
});

//api error handle
app.post('/api*', passport.authenticate('local', { failureRedirect: '/api' }),
    function(req, res) {
        console.log("auth ok");
        res.json({loginOK: true, id: req.user.username});
});

app.all('/api*', function(req, res, next) {
    "use strict";
    console.log('auth fail!!!');
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    res.send('auth fail!!!', 401);
});

//view
app.get('/views/UserInfo', function(req, res, next) {
    "use strict";
    console.log("views/userinfo");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    if (!util.checkAdmin(1, req.user)) {
        next();
    } else {
        var stream = fs.createReadStream(viewsPath + '/UserInfo.html');
        stream.on('error', function(err){
            util.handleError(err, next, res);
        });
        stream.pipe(res);
    }
});

app.get('/views/UserInfo', function(req, res, next) {
    "use strict";
    console.log("views userinfo");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var stream = fs.createReadStream(viewsPath + '/UserInfo.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.get('/views/Storage', function(req, res, next) {
    "use strict";
    console.log("views storage");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var stream = fs.createReadStream(viewsPath + '/Storage.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.get('/views/homepage', function(req, res, next) {
    "use strict";
    console.log("views homepage");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var msg = "hello<br/> 壓縮檔加上.book可以解壓縮，當作書本觀看<br/>如: xxx.book.zip , aaa.book.rar , bbb.book.7z<br/><br/>指令：<br/>>50: 搜尋大於編號50<br/>all item: 顯示子項目<br/><br/>指令不算在單項搜尋裡<br/>預設只會搜尋到有first item的檔案<br/>方便尋找，可以縮小範圍後再下all item顯示全部";
    var adult_msg = "<br/><br/>18禁指令: <br/><br/>18禁: 只顯示十八禁的檔案"
    if (util.checkAdmin(2, req.user)) {
        msg += adult_msg;
    }
    res.send(msg);
});

app.get('/views/:id(\\w+)', function(req, res) {
    "use strict";
    console.log("views id");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    res.send(req.params.id);
});

function checkLogin(req, res, next, callback) {
    if(!req.isAuthenticated()){
        if (util.isMobile(req.headers['user-agent'])) {
            if (/^\/video\//.test(req.path)) {
                console.log("mobile");
                setTimeout(function(){
                    callback(req, res, next);
                }, 0);
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        console.log(req.user._id);
        setTimeout(function(){
            callback(req, res, next);
        }, 0);
    }
}

function getStorageItem(user, items, mediaHandle) {
    var itemList = [];
    if (mediaHandle === 1) {
        if (util.checkAdmin(1, user)) {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18禁');
                }
                if (items[i].first === 1) {
                    items[i].tags.push('first item');
                }
                var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status, utime: items[i].utime, count: items[i].count, media: items[i].mediaType};
                if (items[i].present) {
                    data.present = items[i].present;
                }
                if (items[i].url) {
                    data.url = items[i].url;
                }
                itemList.push(data);
            }
        } else {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18禁');
                }
                if (items[i].first === 1) {
                    items[i].tags.push('first item');
                }
                var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: false, status: items[i].status, utime: items[i].utime, count: items[i].count, media: items[i].mediaType};
                if (items[i].present) {
                    data.present = items[i].present;
                }
                if (items[i].url) {
                    data.url = items[i].url;
                }
                if (user._id.equals(items[i].owner)) {
                    data.isOwn = true;
                }
                itemList.push(data);
            }
        }
    } else {
        if (util.checkAdmin(1, user)) {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18禁');
                }
                if (items[i].first === 1) {
                    items[i].tags.push('first item');
                }
                var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status, utime: items[i].utime, count: items[i].count};
                if (items[i].present) {
                    data.present = items[i].present;
                }
                if (items[i].url) {
                    data.url = items[i].url;
                }
                itemList.push(data);
            }
        } else {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18禁');
                }
                if (items[i].first === 1) {
                    items[i].tags.push('first item');
                }
                var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: false, status: items[i].status, utime: items[i].utime, count: items[i].count};
                if (items[i].present) {
                    data.present = items[i].present;
                }
                if (items[i].url) {
                    data.url = items[i].url;
                }
                if (user._id.equals(items[i].owner)) {
                    data.isOwn = true;
                }
                itemList.push(data);
            }
        }
    }
    return itemList;
}

//default
app.get('*', function(req, res, next) {
    "use strict";
    console.log("index.html");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var stream = fs.createReadStream(viewsPath + '/index.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.all('*', function(req, res, next) {
    "use strict";
    console.log('page not found');
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    //console.log(req.path);
    res.send('Page not found!', 404);
});

//error handle
app.use(function(err, req, res, next) {
    "use strict";
    util.handleError(err);
    res.send('server error occur', 500);
});

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: %s  %s', err.name, err.message);
    if (err.stack) {
        console.log(err.stack);
    }
});

var server1 = https.createServer(credentials, function (req, res) {
    res.writeHead(200);
    res.end("hello world websocket1\n");
}).listen(config_glb.wss_port);

var server2 = https.createServer(credentials, function (req, res) {
    res.writeHead(200);
    res.end("hello world websocket2\n");
}).listen(config_glb.ws_port);

var server3 = https.createServer(credentials, function (req, res) {
    res.writeHead(200);
    res.end("hello world websocket3\n");
}).listen(config_glb.wsj_port);

var wssServer = new WebSocketServer({
    server: server1
});

var wsServer = new WebSocketServer({
    server: server2
});

var wsjServer = new WebSocketServer({
    server: server3
});

function onWsConnMessage(message) {
    console.log(message);
    var recvData = JSON.parse(message);
    console.log(recvData);
    //sendWs(sendData, 1, 1);
}

function onWsConnClose(reasonCode, description) {
    console.log(' Peer disconnected with reason: ' + reasonCode);
}

function sendWs(data, adultonly, auth) {
    var sendData = JSON.stringify(data);
    wssServer.clients.forEach(function each(client) {
        client.send(sendData);
    });
    if (!auth) {
        wsServer.clients.forEach(function each(client) {
            client.send(sendData);
        });
        if (!adultonly) {
            wsjServer.clients.forEach(function each(client) {
                client.send(sendData);
            });
        }
    }
}

server.listen(config_glb.port, config_glb.ip);

serverHttp.listen(config_glb.http_port, config_glb.ip);

wssServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});

wsServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});

wsjServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});

function loopDrive(error, countdown) {
    console.log('loopDrive');
    console.log(new Date());
    if (error) {
        util.handleError(error);
    }
    if (!countdown) {
        countdown = 60000;
    }
    console.log(countdown);
    setTimeout(function() {
        mongo.orig("find", "user", {auto: {$exists: true}}, function(err, userlist){
            if(err) {
                util.handleError(err);
                loopDrive(null, drive_interval);
            } else {
                userDrive(userlist, 0, loopDrive);
            }
        });
    }, countdown);
}

if (config_glb.autoUpload) {
    loopDrive();
}

function userDrive(userlist, index, callback) {
    console.log('userDrive');
    console.log(new Date());
    console.log(userlist[index].username);
    var folderlist = [{id: userlist[index].auto, title: 'drive upload'}];
    var dirpath = [];
    var is_root = true;
    var uploaded = null;
    var file_count = 0;
    getDriveList(function(err) {
        if (err) {
            util.handleError(err, callback, callback, drive_interval);
        }
        index++;
        if (index < userlist.length) {
            userDrive(userlist, index, callback);
        } else {
            setTimeout(function(){
                callback(null, drive_interval);
            }, 0);
        }
    });
    function getDriveList(next) {
        var current = folderlist.pop();
        while (folderlist.length !== 0 && !current.id) {
            dirpath.pop();
            current = folderlist.pop();
        }
        if (!current || !current.id) {
            setTimeout(function(){
                next(null);
            }, 0);
        } else {
            dirpath.push(current.title);
            var data = {folderId: current.id};
            googleApi.googleApi('list file', data, function(err, metadataList) {
                if (err) {
                    util.handleError(err, callback, callback, drive_interval);
                }
                if (metadataList.length > 0) {
                    if (uploaded) {
                        singleDrive(metadataList, 0, userlist[index], data['folderId'], uploaded, dirpath, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            file_count += metadataList.length;
                            if (file_count >= drive_batch) {
                                setTimeout(function(){
                                    next(null);
                                }, 0);
                            } else {
                                googleApi.googleApi('list folder', data, function(err, folder_metadataList) {
                                    if (err) {
                                        util.handleError(err, callback, callback, drive_interval);
                                    }
                                    if (is_root) {
                                        var templist = [];
                                        for (var i in folder_metadataList) {
                                            if (folder_metadataList[i].title !== 'uploaded') {
                                                templist.push(folder_metadataList[i]);
                                            }
                                        }
                                        folder_metadataList = templist;
                                    }
                                    if (folder_metadataList.length > 0) {
                                        folderlist.push({id:null});
                                        folderlist = folderlist.concat(folder_metadataList);
                                    } else {
                                        dirpath.pop();
                                    }
                                    is_root = false;
                                    setTimeout(function(){
                                        getDriveList(next);
                                    }, 0);
                                });
                            }
                        });
                    } else {
                        var uploaded_data = {folderId: userlist[index].auto, name: 'uploaded'};
                        googleApi.googleApi('list folder', uploaded_data, function(err, uploadedList) {
                            if (err) {
                                util.handleError(err, callback, callback, drive_interval);
                            }
                            if (uploadedList.length < 1 ) {
                                util.handleError({hoerror: 2, message: "do not have uploaded folder!!!"}, callback, callback, drive_interval);
                            }
                            uploaded = uploadedList[0].id;
                            singleDrive(metadataList, 0, userlist[index], data['folderId'], uploaded, dirpath, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                file_count += metadataList.length;
                                if (file_count >= drive_batch) {
                                    setTimeout(function(){
                                        next(null);
                                    }, 0);
                                } else {
                                    googleApi.googleApi('list folder', data, function(err, folder_metadataList) {
                                        if (err) {
                                            util.handleError(err, callback, callback, drive_interval);
                                        }
                                        if (is_root) {
                                            var templist = [];
                                            for (var i in folder_metadataList) {
                                                if (folder_metadataList[i].title !== 'uploaded') {
                                                    templist.push(folder_metadataList[i]);
                                                }
                                            }
                                            folder_metadataList = templist;
                                        }
                                        if (folder_metadataList.length > 0) {
                                            folderlist.push({id:null});
                                            folderlist = folderlist.concat(folder_metadataList);
                                        } else {
                                            dirpath.pop();
                                        }
                                        is_root = false;
                                        setTimeout(function(){
                                            getDriveList(next);
                                        }, 0);
                                    });
                                }
                            });
                        });
                    }
                } else {
                    googleApi.googleApi('list folder', data, function(err, folder_metadataList) {
                        if (err) {
                            util.handleError(err, callback, callback, drive_interval);
                        }
                        if (is_root) {
                            var templist = [];
                            for (var i in folder_metadataList) {
                                if (folder_metadataList[i].title !== 'uploaded') {
                                    templist.push(folder_metadataList[i]);
                                }
                            }
                            folder_metadataList = templist;
                        }
                        if (folder_metadataList.length > 0) {
                            folderlist.push({id:null});
                            folderlist = folderlist.concat(folder_metadataList);
                        } else {
                            dirpath.pop();
                        }
                        is_root = false;
                        setTimeout(function(){
                            getDriveList(next);
                        }, 0);
                    });
                }
            });
        }
    }
}

function singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next) {
    var metadata = metadatalist[index];
    var oOID = mongo.objectID();
    var filePath = util.getFileLocation(user._id, oOID);
    var folderPath = path.dirname(filePath);

    if (!fs.existsSync(folderPath)) {
        mkdirp(folderPath, function(err) {
            if(err) {
                console.log(filePath);
                util.handleError(err, next, next);
            }
            streamClose(function(err) {
                if (err) {
                    util.handleError(err);
                    index++;
                    if (index < metadatalist.length) {
                        singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                    } else {
                        setTimeout(function(){
                            next(null);
                        }, 0);
                    }
                } else {
                    if (!metadata.userPermission || metadata.userPermission.role !== 'owner') {
                        var data = {fileId: metadata.id, rmFolderId: folderId, addFolderId: uploaded};
                        googleApi.googleApi('move parent', data, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            index++;
                            if (index < metadatalist.length) {
                                singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                            } else {
                                setTimeout(function(){
                                    next(null);
                                }, 0);
                            }
                        });
                    } else {
                        var data = {fileId: metadata.id};
                        googleApi.googleApi('delete', data, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            index++;
                            if (index < metadatalist.length) {
                                singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                            } else {
                                setTimeout(function(){
                                    next(null);
                                }, 0);
                            }
                        });
                    }
                }
            });
        });
    } else {
        streamClose(function(err) {
            if (err) {
                util.handleError(err);
                index++;
                if (index < metadatalist.length) {
                    singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                } else {
                    setTimeout(function(){
                        next(null);
                    }, 0);
                }
            } else {
                if (!metadata.userPermission || metadata.userPermission.role !== 'owner') {
                    var data = {fileId: metadata.id, rmFolderId: folderId, addFolderId: uploaded};
                    googleApi.googleApi('move parent', data, function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                        index++;
                        if (index < metadatalist.length) {
                            singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                        } else {
                            setTimeout(function(){
                                next(null);
                            }, 0);
                        }
                    });
                } else {
                    var data = {fileId: metadata.id};
                    googleApi.googleApi('delete', data, function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                        index++;
                        if (index < metadatalist.length) {
                            singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                        } else {
                            setTimeout(function(){
                                next(null);
                            }, 0);
                        }
                    });
                }
            }
        });
    }
    function streamClose(callback){
        var name = util.toValidName(metadata.title);
        if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
            name = mime.addPost(name, '1');
        }
        var utime = Math.round(new Date().getTime() / 1000);
        var oUser_id = user._id;
        var ownerTag = [];
        var data = {};
        data['_id'] = oOID;
        data['name'] = name;
        data['owner'] = oUser_id;
        data['utime'] = utime;
        data['size'] = metadata.fileSize;
        data['count'] = 0;
        data['first'] = 1;
        data['recycle'] = 0;
        data['status'] = 0;
        data['adultonly'] = 0;
        if (util.checkAdmin(2 ,user)) {
            for (var i in dirpath) {
                if (tagTool.normalizeTag(dirpath[i]) === '18禁') {
                    data['adultonly'] = 1;
                    break;
                }
            }
        }
        data['untag'] = 1;
        data['status'] = 0;//media type
        var mediaType = mime.mediaType(name);
        switch(mediaType['type']) {
            case 'video':
            if (!metadata.videoMediaMetadata) {
                if (!metadata.userPermission || metadata.userPermission.role === 'owner') {
                    util.handleError({hoerror: 2, message: "not transcode yet"}, callback, callback);
                }
                var copydata = {fileId: metadata.id};
                googleApi.googleApi('copy', copydata, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            } else {
                var hd = 0;
                if (metadata.videoMediaMetadata.height >= 1080) {
                    hd = 1080;
                } else if (metadata.videoMediaMetadata.height >= 720) {
                    hd = 720;
                }
                googleApi.googleDownloadMedia(0, metadata.alternateLink, metadata.id, filePath, hd, function(err) {
                    if(err) {
                        if (fs.existsSync(filePath + "_s.jpg")) {
                            fs.unlink(filePath + "_s.jpg", function (error) {
                                if (error) {
                                    util.handleError(error, callback, callback);
                                }
                                if (fs.existsSync(filePath + "_a.htm")) {
                                    fs.unlink(filePath + "_a.htm", function (error) {
                                        if (error) {
                                            util.handleError(error, callback, callback);
                                        }
                                        if (fs.existsSync(filePath)) {
                                            fs.unlink(filePath, function (error) {
                                                if (error) {
                                                    util.handleError(error, callback, callback);
                                                }
                                                restHandle();
                                            });
                                        } else {
                                            restHandle();
                                        }
                                    });
                                } else {
                                    restHandle();
                                }
                            });
                        } else {
                            restHandle();
                        }
                        function restHandle() {
                            if (!metadata.userPermission || metadata.userPermission.role === 'owner') {
                                util.handleError(err, callback, callback);
                            }
                            var copydata = {fileId: metadata.id};
                            googleApi.googleApi('copy', copydata, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        }
                    } else {
                        name = mime.changeExt(name, 'mp4');
                        data['name'] = name;
                        data['status'] = 3;//media type
                        handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            var normal = tagTool.normalizeTag(name);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            normal = tagTool.normalizeTag(user.username);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            for(var i in dirpath) {
                                normal = tagTool.normalizeTag(dirpath[i]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                }
                            }
                            DBdata['tags'] = mediaTag.def;
                            DBdata[oUser_id] = mediaTag.def;
                            mongo.orig("insert", "storage", DBdata, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(item);
                                console.log('save end');
                                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    }
                }, true);
            }
            break;
            case 'doc':
            case 'sheet':
            if (metadata.exportLinks) {
                var exportlink = metadata.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                var new_ext = 'docx';
                if (mediaType['type'] === 'sheet') {
                    exportlink = metadata.exportLinks['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                    new_ext = 'xlsx';
                }
                googleApi.googleDownload(exportlink, filePath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    googleApi.googleDownloadDoc(metadata.exportLinks['application/pdf'], metadata.id, filePath, mediaType['ext'], function(err, number) {
                        if(err) {
                            if (fs.existsSync(filePath)) {
                                fs.unlink(filePath, function (error) {
                                    if (error) {
                                        util.handleError(error, callback, callback);
                                    }
                                });
                            } else {
                                util.handleError(err, callback, callback);
                            }
                        }
                        data['status'] = 5;
                        if (number > 1) {
                            data['present'] = number;
                        }
                        var reg = new RegExp(mediaType['ext'] + "$", "i");
                        name = name.replace(reg, new_ext);
                        data['name'] = name;
                        handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            var normal = tagTool.normalizeTag(name);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            normal = tagTool.normalizeTag(user.username);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            for(var i in dirpath) {
                                normal = tagTool.normalizeTag(dirpath[i]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                }
                            }
                            DBdata['tags'] = mediaTag.def;
                            DBdata[oUser_id] = mediaTag.def;
                            DBdata['status'] = 5;
                            delete DBdata['mediaType'];
                            mongo.orig("insert", "storage", DBdata, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(item);
                                console.log('save end');
                                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                });
                break;
            }
            case 'present':
            if (metadata.exportLinks) {
                googleApi.googleDownload(metadata.exportLinks['application/vnd.openxmlformats-officedocument.presentationml.presentation'], filePath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    googleApi.googleDownloadPresent(metadata.exportLinks['application/pdf'], metadata.id, filePath, mediaType['ext'], function(err, number) {
                        if(err) {
                            if (fs.existsSync(filePath)) {
                                fs.unlink(filePath, function (error) {
                                    if (error) {
                                        util.handleError(error, callback, callback);
                                    }
                                });
                            } else {
                                util.handleError(err, callback, callback);
                            }
                        }
                        if (number > 1) {
                            data['present'] = number;
                        }
                        data['status'] = 6;
                        var reg = new RegExp(mediaType['ext'] + "$", "i");
                        name = name.replace(reg, 'pptx');
                        data['name'] = name;
                        handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            var normal = tagTool.normalizeTag(name);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            normal = tagTool.normalizeTag(user.username);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            for(var i in dirpath) {
                                normal = tagTool.normalizeTag(dirpath[i]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                }
                            }
                            DBdata['tags'] = mediaTag.def;
                            DBdata[oUser_id] = mediaTag.def;
                            mongo.orig("insert", "storage", DBdata, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(item);
                                console.log('save end');
                                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                });
                break;
            }
            default:
            googleApi.googleDownload(metadata.downloadUrl, filePath, function(err) {
                if(err) {
                    util.handleError(err, callback, callback);
                }
                handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    var normal = tagTool.normalizeTag(name);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    normal = tagTool.normalizeTag(user.username);
                    if (mediaTag.def.indexOf(normal) === -1) {
                        mediaTag.def.push(normal);
                    }
                    for(var i in dirpath) {
                        normal = tagTool.normalizeTag(dirpath[i]);
                        if (!tagTool.isDefaultTag(normal)) {
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                        }
                    }
                    DBdata['tags'] = mediaTag.def;
                    DBdata[oUser_id] = mediaTag.def;
                    mongo.orig("insert", "storage", DBdata, function(err, item){
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(item);
                        console.log('save end');
                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                        if (mediaType['type'] !== 'image') {
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        }
                        if (mediaType['type'] === 'image') {
                            if (metadata.thumbnailLink) {
                                mediaType.thumbnail = metadata.thumbnailLink;
                                mediaType.key = metadata.id;
                                mediaType.notOwner = true;
                                mongo.orig("update", "storage", { _id: item[0]._id }, {$set: {"mediaType.key": mediaType.key, "mediaType.notOwner": mediaType.notOwner}}, function(err, item1){
                                    if(err) {
                                        errerMedia(err, item[0]._id, function() {
                                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                            console.log('auto upload media error');
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    } else {
                                        handleMedia(mediaType, filePath, DBdata['_id'], DBdata['name'], metadata.id, user, function(err) {
                                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                            if(err) {
                                                util.handleError(err);
                                            }
                                            console.log('transcode done');
                                            console.log(new Date());
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    }
                                });
                            } else {
                                errerMedia({hoerror: 2, message: "error type"}, item[0]._id, function() {
                                    sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                    console.log('auto upload media error');
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                });
                            }
                        } else {
                            handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], user, function(err) {
                                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                if(err) {
                                    util.handleError(err);
                                }
                                console.log('transcode done');
                                console.log(new Date());
                            });
                        }
                    });
                });
            });
            break;
        }
    }
}

console.log('start express server\n');

console.log("Server running at http://" + config_glb.ip + ":" + config_glb.http_port + ' ' + new Date());

console.log("Server running at https://" + config_glb.ip + ":" + config_glb.port + ' ' + new Date());