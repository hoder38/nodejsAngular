/* jslint node: true */
/*jslint nomen: true */
/*global require, module,  __dirname */
/*global console: false */

var mongo = require("../models/mongo-tool.js");

var api = require("../models/api-tool.js");

var tagTool = require("../models/tag-tool.js")('storage');

var util = require("../util/utility.js");

var mime = require('../util/mime.js');

var http = require('http'),
    express = require('express'),
    crypto = require('crypto'),
    passport = require('passport'),
    Transcoder = require('stream-transcoder'),
    LocalStrategy = require('passport-local').Strategy,
    WebSocketServer = require('websocket').server;
    app = express(),
    server = http.createServer(app),
    port = 80,
    ip = '114.32.213.158',
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    encode = "utf8",
    path = require('path'),
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
app.use(require('connect-multiparty')({ uploadDir: "/mnt/tmp" }));
//app.use(express.session({ secret: 'holyhoderhome' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(staticPath));

//global entry
app.use('/views', function (req, res, next) {
    "use strict";
    console.log('views');
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
    console.log(req.query);
    res.end("refresh");
});

app.get('/api/logout', function(req, res, next) {
    console.log("logout");
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
        var user_info = [];
        if (!util.checkAdmin(1, req.user)) {
            mongo.orig("findOne", "user", {_id: req.user._id}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
                user_info.push({name: user.username});
                res.json({user_info: user_info});
            });
        } else {
            mongo.orig("find", "user", function(err,users){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(users);
                for (var i in users) {
                    if (req.user._id.equals(users[i]._id)) {
                        user_info.push({name: users[i].username, perm: users[i].perm, desc: users[i].desc, key: users[i]._id});
                    } else {
                        user_info.push({name: users[i].username, perm: users[i].perm, desc: users[i].desc, key: users[i]._id, delable: true});
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
        console.log(req.body);
        var pwd = util.isValidString(req.body.pwd, 'passwd');
        if (pwd === false) {
            util.handleError({hoerror: 2, msg: "passwd is not vaild"}, next, res);
        }
        if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
            util.handleError({hoerror: 2, msg: "password error"}, next, res);
        }
        if (req.body.name) {
            var name = util.isValidString(req.body.name, 'name'), id;
            if (name === false) {
                util.handleError({hoerror: 2, msg: "name is not vaild"}, next, res);
            }
            if (util.checkAdmin(1, req.user)) {
                id = util.isValidString(req.params.uid, 'uid');
                if (id === false) {
                    util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
                }
            } else {
                id = req.user._id;
            }
            mongo.orig("findOne", "user", {username: name}, function(err, user){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (user) {
                    util.handleError({hoerror: 2, msg: 'already has one!!!'}, next, res);
                }
                var data = {};
                data['username'] = name;
                mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user2){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    console.log(user2);
                    res.json({apiOK: true});
                });
            });
        } else if (req.body.desc) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, msg: 'unknown type in edituser'}, next, res, 403);
            }
            var desc = util.isValidString(req.body.desc, 'desc'),
                id = util.isValidString(req.params.uid, 'uid');
            if (desc === false) {
                util.handleError({hoerror: 2, msg: "desc is not vaild"}, next, res);
            }
            if (id === false) {
                util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
            }
            var data = {};
            data['desc'] = desc;
            mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
                res.json({apiOK: true});
            });
        } else if (req.body.perm) {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, msg: 'unknown type in edituser'}, next, res, 403);
            }
            var perm = util.isValidString(perm, 'perm'),
                id = util.isValidString(req.params.uid, 'uid');
            if (perm === false) {
                util.handleError({hoerror: 2, msg: "perm is not vaild"}, next, res);
            }
            if (id === false) {
                util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
            }
            var data = {};
            data['perm'] = perm;
            mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
                res.json({apiOK: true});
            });
        } else if (req.body.newPwd && req.body.conPwd) {
            var newPwd = util.isValidString(req.body.newPwd, 'passwd'),
                conPwd = util.isValidString(req.body.conPwd, 'passwd'),
                id;
            if (newPwd === false) {
                util.handleError({hoerror: 2, msg: "new passwd is not vaild"}, next, res);
            }
            if (conPwd === false) {
                util.handleError({hoerror: 2, msg: "con passwd is not vaild"}, next, res);
            }
            if (newPwd !== conPwd) {
                util.handleError({hoerror: 2, msg: 'confirm password must equal!!!'}, next, res);
            }
            if (util.checkAdmin(1, req.user)) {
                id = util.isValidString(req.params.uid, 'uid');
                if (id === false) {
                    util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
                }
            } else {
                id = req.user._id;
            }
            var data = {};
            data['password'] = crypto.createHash('md5').update(newPwd).digest('hex');
            mongo.orig("update", "user", {_id: id}, {$set: data}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
                res.json({apiOK: true});
            });
        } else {
            util.handleError({hoerror: 2, msg: 'unknown type in edituser'}, next, res, 403);
        }
    });
});

app.post('/api/adduser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        if (util.checkAdmin(1, req.user)) {
            console.log("adduser");
            console.log(req.body);
            var pwd = util.isValidString(req.body.pwd, 'passwd');
            if (pwd === false) {
                util.handleError({hoerror: 2, msg: "passwd is not vaild"}, next, res);
            }
            if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
                util.handleError({hoerror: 2, msg: "password error"}, next, res);
            }
            var name = util.isValidString(name, 'name'),
                desc = util.isValidString(req.body.desc, 'desc'),
                perm = util.isValidString(perm, 'perm'),
                newPwd = util.isValidString(req.body.newPwd, 'passwd'),
                conPwd = util.isValidString(req.body.conPwd, 'passwd');
            if (name === false) {
                util.handleError({hoerror: 2, msg: "name is not vaild"}, next, res);
            }
            if (desc === false) {
                util.handleError({hoerror: 2, msg: "desc is not vaild"}, next, res);
            }
            if (perm === false) {
                util.handleError({hoerror: 2, msg: "perm is not vaild"}, next, res);
            }
            if (newPwd === false) {
                util.handleError({hoerror: 2, msg: "new passwd is not vaild"}, next, res);
            }
            if (conPwd === false) {
                util.handleError({hoerror: 2, msg: "con passwd is not vaild"}, next, res);
            }
            mongo.orig("count", "user" ,{username: name}, function(err,count){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (count > 0) {
                    console.log(count);
                    util.handleError({hoerror: 2, msg: 'already has one!!!'}, next, res);
                }
                if (newPwd !== conPwd) {
                    util.handleError({hoerror: 2, msg: 'password must equal!!!'}, next, res);
                }
                var data = {};
                data['username'] = name;
                data['desc'] = desc;
                data['perm'] = perm;
                data['password'] = crypto.createHash('md5').update(newPwd).digest('hex');
                mongo.orig("insert", "user", data, function(err,user){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    console.log(user);
                    var ret = {item: {newable: false, delable: true}, newItem: {name: '', perm: '', desc: '', newable: true}};
                    res.json(ret);
                });
            });
        } else {
            util.handleError({hoerror: 2, msg: 'unknown type in adduser'}, next, res, 403);
        }
    });
});

app.put('/api/deluser/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        if (!util.checkAdmin(1, req.user)) {
            util.handleError({hoerror: 2, msg: 'unknown type in deluser'}, next, res, 403);
        }
        console.log("deluser");
        console.log(req.body);
        console.log(req.params.uid);
        var pwd = util.isValidString(req.body.pwd, 'passwd'),
            id = util.isValidString(req.params.uid, 'uid');
        if (pwd === false) {
            util.handleError({hoerror: 2, msg: "passwd is not vaild"}, next, res);
        }
        if (req.user.password !== crypto.createHash('md5').update(pwd).digest('hex')) {
            util.handleError({hoerror: 2, msg: "password error"}, next, res);
        }
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "user" , {_id: id}, function(err,user){
            if(err) {
                util.handleError(err, next, res);
            }
            if (!user) {
                util.handleError({hoerror: 2, msg: 'user does not exist!!!'}, next, res);
            }
            if (util.checkAdmin(1, user)) {
                util.handleError({hoerror: 2, msg: 'owner cannot be deleted!!!'}, next, res);
            }
            console.log(user);
            mongo.orig("remove", "user", {_id: id, $isolated: 1}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
                res.json({apiOK: true});
            });
        });
    });
});

app.get('/api/storage/get/:sortName(name|mtime)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("storage");
        console.log(req.params.page);
        console.log(req.params.name);
        console.log(req.params.exactly);
        console.log(req.params.index);
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
        console.log(req.body.name);
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
        util.handleError({hoerror: 2, msg: "name is not vaild"}, next, callback);
    }
    if (id === false) {
        util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, callback);
    }
    mongo.orig("findOne", "storage", { _id: id }, function(err, item){
        if(err) {
            util.handleError(err, next, callback);
        }
        if (!item) {
            util.handleError({hoerror: 2, msg: 'file not exist!!!'}, next, callback);
        }
        if (!util.checkAdmin(1, user) && !user._id.equals(item.owner)) {
            util.handleError({hoerror: 2, msg: 'file is not yours!!!'}, next, callback);
        }
        mongo.orig("update", "storage", { _id: id }, {$set: {name: name}}, function(err, item2){
            if(err) {
                util.handleError(err, next, callback);
            }
            console.log(item2);
            tagTool.addTag(uid, name, user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, callback);
                }
                if (item.tags.indexOf(result.tag) === -1) {
                    item.tags.splice(0, 0, result.tag);
                }
                if (item[user._id.toString()].indexOf(result.tag) === -1) {
                    item[user._id.toString()].splice(0, 0, result.tag);
                }
                var filePath = util.getFileLocation(item.owner, item._id);
                var time = Math.round(new Date().getTime() / 1000);
                handleTag(filePath, {utime: time, mtime: time, untag: 1}, newName, item.name, item.status, function(err, mediaType, mediaTag, DBdata) {
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    console.log(mediaType);
                    console.log(mediaTag);
                    console.log(DBdata);
                    var temp_tag = [];
                    for (var i in mediaTag.def) {
                        if (item.tags.indexOf(mediaTag.def[i]) === -1) {
                            temp_tag.push(mediaTag.def[i]);
                        }
                    }
                    mediaTag.def = temp_tag;
                    var temp_tag2 = [];
                    for (var i in mediaTag.opt) {
                        if (item.tags.indexOf(mediaTag.opt[i]) === -1) {
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
                        var result_tag = mediaTag.def.concat(item[user._id.toString()]);
                        var index_tag = 0;
                        for (var i in result_tag) {
                            index_tag = item.tags.indexOf(result_tag[i]);
                            if (index_tag !== -1) {
                                item.tags.splice(index_tag, 1);
                            }
                        }
                        setTimeout(function(){
                            callback(null, {id: id, name: name, select: result_tag, option: mediaTag.opt, other: item.tags, adultonly: item.adultonly});
                        }, 0);
                        handleMediaUpload(mediaType, filePath, id, name, item.size, user, function(err) {
                            sendWs({type: 'file', data: item._id}, item.adultonly);
                            if(err) {
                                util.handleError(err, function(err) {
                                    console.log(err);
                                });
                            }
                            console.log('transcode done');
                        });
                    });
                });
            });
        });
    });
}

app.delete('/api/delFile/:uid/:recycle', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("delFile");
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err, item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (!item) {
                util.handleError({hoerror: 2, msg: 'file can not be fund!!!'}, next, res);
            }
            if (req.params.recycle === '1' && util.checkAdmin(1, req.user)) {
                if (item.recycle !== 1) {
                    util.handleError({hoerror: 2, msg: 'recycle file first!!!'}, next, res);
                }
                var filePath = util.getFileLocation(item.owner, item._id);
                var del_arr = [filePath];
                if (fs.existsSync(filePath + '.jpg')) {
                    del_arr.push(filePath + '.jpg');
                }
                if (fs.existsSync(filePath + '.htm')) {
                    del_arr.push(filePath + '.htm');
                }
                if (fs.existsSync(filePath + '.pdf')) {
                    del_arr.push(filePath + '.pdf');
                }
                if (fs.existsSync(filePath + '_s.jpg')) {
                    del_arr.push(filePath + '_s.jpg');
                }
                if (fs.existsSync(filePath + '.srt')) {
                    del_arr.push(filePath + '.srt');
                }
                if (fs.existsSync(filePath + '.vtt')) {
                    del_arr.push(filePath + '.vtt');
                }
                var index = 0;
                console.log(del_arr);
                recur_del(del_arr[0]);
                function recur_del(delPath) {
                    fs.unlink(delPath, function (err) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        index++;
                        if (index < del_arr.length) {
                            recur_del(del_arr[index]);
                        } else {
                            mongo.orig("remove", "storage", {_id: id, $isolated: 1}, function(err, item2){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                console.log('perm delete file');
                                sendWs({type: 'file', data: item._id}, 1, 1);
                                res.json({apiOK: true});
                            });
                        }
                    });
                }
            } else {
                if (!util.checkAdmin(1, req.user) && !req.user._id.equals(item.owner)) {
                    util.handleError({hoerror: 2, msg: 'file is not yours!!!'}, next, res);
                }
                var time = Math.round(new Date().getTime() / 1000);
                mongo.orig("update", "storage", { _id: id }, {$set: {recycle: 1, mtime: time}}, function(err, item2){
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    console.log(item2);
                    sendWs({type: 'file', data: item._id}, item.adultonly);
                    res.json({apiOK: true});
                });
            }
        });
    });
});

function handleTag(filePath, DBdata, newName, oldName, status, callback){
    var mediaType = mime.mediaType(newName),
        oldType = mime.mediaType(oldName),
        mediaTag = {def:[], opt:[]};
    var isVideo = false;
    if (mediaType && (status === 0 || status === 1 || status === 2 || status === 5) && (!oldType || (mediaType.ext !== oldType.ext))) {
        console.log(mediaType);
        switch(mediaType['type']) {
            case 'video':
            case 'music':
                new Transcoder(filePath)
                .on('metadata', function(meta) {
                    console.log(meta);
                    if (meta.input.streams) {
                        for (var i in meta.input.streams) {
                            console.log(meta.input.streams[i]);
                            if (meta.input.streams[i].size) {
                                if (meta.input.streams[i].size.height >= 720) {
                                    mediaType['hd'] = 1;
                                }
                                isVideo = true;
                            }
                        }
                        if ((isVideo && mediaType['type'] === 'video') || (!isVideo && mediaType['type'] === 'music')) {
                            DBdata['status'] = 1;
                            mediaTag = mime.mediaTag(mediaType['type']);
                            mediaType['time'] = meta.input.duration;
                            mediaType['hd'] = 0;
                            if (mediaType['time'] < 20 * 60 * 1000) {
                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 1));
                            } else if (mediaType['time'] < 40 * 60 * 1000) {
                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                            } else if (mediaType['time'] < 60 * 60 * 1000) {
                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
                            }
                            console.log(mediaTag);
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
                }).on('error', function(err) {
                    console.log(err);
                }).exec();
                return;
            case 'image':
            case 'doc':
            case 'rawdoc':
                DBdata['status'] = 1;
                mediaTag = mime.mediaTag(mediaType['type']);
                DBdata['mediaType'] = mediaType;
                break;
            default:
                util.handleError({hoerror: 2, msg: 'unknown media type!!!'}, callback, callback, null, null, null);
        }
        console.log(mediaTag);
    } else {
        mediaType = false;
    }
    setTimeout(function(){
        callback(null, mediaType, mediaTag, DBdata);
    }, 0);
}

app.post('/upload/subtitle/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('upload substitle');
        console.log(req.files);
        if (req.files.file.size > (10 * 1024 * 1024)) {
            util.handleError({hoerror: 2, msg: "size too large!!!"}, next, res);
        }
        var ext = mime.isSub(req.files.file.name);
        if (!ext) {
            util.handleError({hoerror: 2, msg: "not valid subtitle!!!"}, next, res);
        }
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", { _id: id }, function(err, item){
            if(err) {
                util.handleError(err, next, callback);
            }
            if (!item) {
                util.handleError({hoerror: 2, msg: 'file not exist!!!'}, next, callback);
            }
            var filePath = util.getFileLocation(item.owner, item._id);
            var folderPath = path.dirname(filePath);
            fs.exists(folderPath, function(exists) {
                if (!exists) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, next, res);
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
                    var stream = fs.createReadStream(req.files.file.path);
                    stream.on('error', function(err){
                        console.log('save file error!!!');
                        util.handleError(err, next, res);
                    });
                    stream.on('close', SRT2VTT);
                    stream.pipe(fs.createWriteStream(filePath + '.' + ext));
                }
            });
            function SRT2VTT() {
                fs.readFile(req.files.file.path, function (err,data) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    data = util.bufferToString(data);
                    var result = "WEBVTT\n\n";
                    result = result + data.replace(/,/g, '.');
                    console.log(filePath + '.vtt');
                    fs.writeFile(filePath + '.vtt', result, 'utf8', function (err) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        res.json({apiOK: true});
                    });
                });
            }
        });
    });
});

app.post('/upload/file', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('files');
        console.log(req.files);
        var oOID = mongo.objectID();
        var filePath = util.getFileLocation(req.user._id, oOID);
        var folderPath = path.dirname(filePath);
        console.log(filePath);
        console.log(folderPath);
        fs.exists(folderPath, function(exists) {
            if (!exists) {
                mkdirp(folderPath, function(err) {
                    if(err) {
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
        });
        function streamClose(){
            console.log('close');
            fs.unlink(req.files.file.path, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                var name = util.toValidName(req.files.file.name);
                var utime = Math.round(new Date().getTime() / 1000);
                var oUser_id = req.user._id;
                var ownerTag = [];
                var data = {};
                data['_id'] = oOID;
                data['name'] = name;
                data['owner'] = oUser_id;
                data['utime'] = utime;
                data['mtime'] = utime;
                data['size'] = req.files.file.size;
                data['count'] = 0;
                data['recycle'] = 0;
                data['adultonly'] = 0;
                data['untag'] = 1;
                data['status'] = 0;//media type
                handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    save2DB(mediaType, mediaTag, DBdata);
                });
                function save2DB(mediaType, mediaTag, DBdata) {
                    mediaTag.def.push(tagTool.normalizeTag(name), tagTool.normalizeTag(req.user.username));
                    if (util.checkAdmin(2 ,req.user)) {
                        mediaTag.opt.push('18禁');
                    }
                    var tags = tagTool.searchTags(req.session, 'parent');
                    if (tags) {
                        var parentList = tags.getArray();
                        console.log(parentList);
                        var normal = '';
                        for (var i in parentList.cur) {
                            normal = tagTool.normalizeTag(parentList.cur[i]);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                        }
                        var temp_tag = [];
                        for (var j in mediaTag.opt) {
                            if (mediaTag.def.indexOf(mediaTag.opt[j]) === -1) {
                                temp_tag.push(mediaTag.opt[j]);
                                //mediaTag.opt.splice(j, 1);
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
                        res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                            if(err) {
                                util.handleError(err, function(err) {
                                    console.log(err);
                                });
                            }
                            console.log('transcode done');
                        });
                    });
                }
            });
        };
    });
});


function handleMediaUpload(mediaType, filePath, fileID, fileName, fileSize, user, callback) {
    if (mediaType) {
        api.xuiteApi("xuite.webhd.prepare.cloudbox.postFile", {full_path: '/public/' + fileID.toString() + "." + mediaType['ext'], size: fileSize}, function(err, result) {
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
                        util.handleError(err, callback, callback);
                    }
                    console.log(item);
                    handleMedia(mediaType, filePath, fileID, fileName, uploadResult.key, user, callback);
                });
            });
        });
    }
}

function errerMedia(errMedia, fileID, callback) {
    mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.err": errMedia.msg}}, function(err, item){
        if(err) {
            util.handleError(err, callback, callback);
        }
        console.log(item);
        setTimeout(function(){
            callback(err);
        }, 0);
    });
}

function completeMedia(fileID, status, callback) {
    mongo.orig("update", "storage", { _id: fileID }, {$unset: {mediaType: ""}, $set: {status: status}}, function(err, item){
        if(err) {
            util.handleError(err, callback, callback);
        }
        console.log(item);
        setTimeout(function(){
            callback(null);
        }, 0);
    });
}

function handleMedia(mediaType, filePath, fileID, fileName, key, user, callback) {
    if (mediaType['type'] === 'image') {
        api.xuiteApi("xuite.webhd.private.cloudbox.gallery.getSingleImage", {key: key}, function(err, imageResult) {
            if (err) {
                util.handleError(err, callback, errerMedia, fileID, callback);
            }
            console.log(imageResult);
            api.xuiteDownload(imageResult.THUMB_PIC, filePath + ".jpg", function(err) {
                if (err) {
                    util.handleError(err, callback, errerMedia, fileID, callback);
                }
                api.xuiteDeleteFile(key, function(err) {
                    if (err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    completeMedia(fileID, 2, callback);
                });
            });
        });
    } else if (mediaType['type'] === 'video') {
        if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
            util.handleError({hoerror: 2, msg: 'video can not be decoded!!!'}, callback, errerMedia, fileID, callback);
        }
        api.xuiteDownloadMedia(1000, mediaType['time'], key, filePath, 1, mediaType['hd'], function(err, hd, video_url) {
            if(err) {
                util.handleError(err, callback, errerMedia, fileID, callback);
            }
            if (hd === 1) {
                mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.hd": 2, status: 3}}, function(err, item){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(item);
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
                                    util.handleError(err, callback, callback);
                                }
                                tagTool.addTag(fileID, '720p', user, callback, function(err, result) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
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
                                util.handleError(err, callback, callback);
                            }
                            tagTool.addTag(fileID, '720p', user, callback, function(err, result) {
                                if (err) {
                                    util.handleError(err, callback, callback);
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
    } else if (mediaType['type'] === 'music') {
        if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
            util.handleError({hoerror: 2, msg: 'music can not decode!!!'}, callback, errerMedia, fileID, callback);
        }
        api.xuiteDownloadMedia(1000, mediaType['time'], key, filePath, 0, 0, function(err) {
            if(err) {
                util.handleError(err, callback, errerMedia, fileID, callback);
            }
            completeMedia(fileID, 4, function(err) {
                if (err) {
                    util.handleError(err, callback, callback);
                } else {
                    editFile(fileID, mime.changeExt(fileName, 'mp3'), user, callback, function(err, result) {
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
    } else {
        api.xuiteApi("xuite.webhd.private.cloudbox.getMetadata", {key: key, type: 'file'}, function(err, metaResult) {
            if (err) {
                util.handleError(err, callback, errerMedia, fileID, callback);
            }
            console.log(metaResult);
            if (mediaType['type'] === 'doc') {
                var doc_url = api.xuiteDocurl(metaResult.file[0], 'pdf');
                console.log(doc_url);
                api.xuiteDownload(doc_url, filePath + ".pdf", function(err) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    api.xuiteDeleteFile(key, function(err) {
                        if(err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        completeMedia(fileID, 5, callback);
                    });
                });
            } else if (mediaType['type'] === 'rawdoc') {
                var doc_url = api.xuiteDocurl(metaResult.file[0], mediaType['ext']);
                console.log(doc_url);
                api.xuiteDownload(doc_url, filePath + ".htm", function(err) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    api.xuiteDeleteFile(key, function(err) {
                        if(err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        completeMedia(fileID, 6, callback);
                    });
                });
            }
        });
    }
}

app.get('/api/handleMedia/:uid/:action(act|del)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('handleMedia');
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (!item) {
                util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
            }
            console.log(item);
            switch(req.params.action) {
                case 'act':
                    if (!item.mediaType) {
                        util.handleError({hoerror: 2, msg: "this file is not media!!!"}, next, res);
                    }
                    var filePath = util.getFileLocation(item.owner, item._id);
                    console.log(filePath);
                    res.json({apiOK: true});
                    if(item.mediaType.key) {
                        handleMedia(item.mediaType, filePath, item._id, item.name, item.mediaType.key, req.user, function (err) {
                            sendWs({type: 'file', data: item._id}, item.adultonly);
                            util.handleError(err, function(err) {
                                console.log(err);
                            });
                            console.log('transcode done');
                        });
                    } else {
                        handleMediaUpload(item.mediaType, filePath, item._id, item.name, item.size, item.mediaType.key, req.user, function (err) {
                            sendWs({type: 'file', data: item._id}, item.adultonly);
                            util.handleError(err, function(err) {
                                console.log(err);
                            });
                            console.log('transcode done');
                        });
                    }
                    break;
                case 'del':
                    res.json({apiOK: true});
                    completeMedia(item._id, 0, function (err) {
                        sendWs({type: 'file', data: item._id}, item.adultonly);
                        util.handleError(err, function(err) {
                            console.log(err);
                        });
                        console.log('delete media done');
                    });
                    break;
                default:
                    util.handleError({hoerror: 2, msg: "unknown action"}, next, res);
                    break;
            }
        });
    });
});

app.get('/api/parent/list/:lang?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("parentList");
        var lang = typeof req.params.lang !== 'undefined' ? req.params.lang : 'tw';
        var list = tagTool.parentList();
        var ret = [];
        for (var i in list) {
            ret.push({'name':list[i].name, 'show':list[i][lang]});
            res.json({parentList: ret});
        }
    });
});

app.get('/api/parent/taglist/:name/:sortName(name|mtime)/:sortType(desc|asc)/:page(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("showTaglist");
        console.log(req.params.page);
        console.log(req.params.name);
        var page = Number(req.params.page);
        res.cookie('bookmarkSortName', req.params.sortName);
        res.cookie('bookmarkSortType', req.params.sortType);
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
        tagTool.addParent(req.body.name, req.body.tag, next, function(err, result) {
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
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        tagTool.delParent(id, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/parent/query/:id', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("parent query");
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'desc' || req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tagTool.queryParentTag(id, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/feedback/:scope?', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("feedback");
        if (req.params.scope === 'all') {
            if (!util.checkAdmin(1, req.user)) {
                util.handleError({hoerror: 2, msg: "permission denied"}, next, res);
            }
            mongo.orig("find", "storage", {untag: 1}, {sort: "mtime", limit: 20}, function(err, items){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(items);
                var feedback_arr = [];
                recur_feedback(0);
                function recur_feedback(index) {
                    getFeedback(items[index], function(err, feedback) {
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        feedback_arr.push(feedback);
                        index++;
                        if (index < items.length) {
                            recur_feedback(index);
                        } else {
                            res.json({feedbacks: feedback_arr});
                        }
                    });
                }
            });
        } else {
            mongo.orig("find", "storage", {untag: 1, owner: req.user._id}, {sort: ["mtime",'desc'], limit: 20}, function(err, items){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(items);
                var feedback_arr = [];
                recur_feedback(0);
                function recur_feedback(index) {
                    getFeedback(items[index], function(err, feedback) {
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        feedback_arr.push(feedback);
                        index++;
                        if (index < items.length) {
                            recur_feedback(index);
                        } else {
                            res.json({feedbacks: feedback_arr});
                        }
                    });
                }
            });
        }
    });
});

function getFeedback(item, callback, user_id) {
    var filePath = util.getFileLocation(item.owner, item._id);
    var owner_id = typeof user_id !== 'undefined' ? user_id : item.owner;
    handleTag(filePath, {}, item.name, '', 0, function(err, mediaType, mediaTag, DBdata) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        var temp_tag = [];
        for (var i in mediaTag.opt) {
            if (item.tags.indexOf(mediaTag.opt[i]) === -1) {
                temp_tag.push(mediaTag.opt[i]);
            }
        }
        var index_tag = 0;
        for (var i in item[owner_id.toString()]) {
            index_tag = item.tags.indexOf(item[owner_id.toString()][i]);
            if (index_tag !== -1) {
                item.tags.splice(index_tag, 1);
            }
        }
        setTimeout(function(){
            callback(null, {id: item._id, name: item.name, select: item[owner_id.toString()], option: temp_tag, other: item.tags});
        }, 0);
    });
}

app.get('/api/bookmark/getList/:sortName(name|mtime)/:sortType(desc|asc)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get bookmark list");
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
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "bookmark is not vaild"}, next, res);
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
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, msg: "name is not vaild"}, next, res);
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
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "bookmark is not vaild"}, next, res);
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
        if (req.params.type < 2 || req.params.type > 6) {
            util.handleError({hoerror: 2, msg: "media type error"}, next, res);
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
                saveName = 'rawdoc';
                break;
            default:
                util.handleError({hoerror: 2, msg: "unknown type"}, next, res);
        }
        var sql = tagTool.saveSql(page, saveName, req.params.back, req.user, req.session);
        if (!sql) {
            util.handleError({hoerror: 2, msg: "query error"}, next, res);
        }
        sql.nosql.$and.push({status: type});
        console.log(sql.options);
        console.log(sql.nosql.$and);
        mongo.orig("find", 'storage', sql.nosql, sql.options, function(err, items){
            if(err) {
                util.handleError(err, next, res);
            }
            console.log(items);
            var itemList = getStorageItem(req.user, items);
            res.json({itemList: itemList});
        });
    });
});

app.post('/api/media/saveParent', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('saveParent');
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, msg: "name is not vaild"}, next, res);
        }
        var tags = tagTool.searchTags(req.session, 'parent');
        if (!tags) {
            util.handleError({hoerror: 2, msg: 'error search var!!!'}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'name' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
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
        console.log('media record');
        console.log(req.params.time);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "file is not vaild"}, next, res);
        }
        if (req.params.time === '0') {
            mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: id, $isolated: 1}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                console.log(user);
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
                console.log('update');
                console.log(item);
                if (item === 0) {
                    mongo.orig("find", "storageRecord", {userId: req.user._id}, {"skip" : 50, "sort":  [["mtime", "desc"]]}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        console.log(items);
                        if (items.length === 0) {
                            data['userId'] = req.user._id;
                            data['fileId'] = id;
                            data['recordTime'] = req.params.time;
                            data['mtime'] = utime;
                            mongo.orig("insert", "storageRecord", data, function(err, item1){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                console.log(item1);
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
                                console.log(item1);
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

app.get('/api/media/setTime/:id', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('media setTime');
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "file is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storageRecord", {userId: req.user._id, fileId: id}, function(err, item){
            if (err) {
                util.handleError(err, next, res);
            }
            console.log(item);
            if (!item) {
                res.json({apiOK: true});
            } else {
                res.json({time: item.recordTime});
            }
        });
    });
});

app.get('/api/getUser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get user');
        var ws = 'node-angular-junior';
        var ws_url = 'ws://' + ip + ':1027';
        if (util.checkAdmin(1, req.user)) {
            ws = 'node-angular-senior';
            ws_url = 'ws://' + ip + ':1025';
        } else if (util.checkAdmin(2, req.user)) {
            ws = 'node-angular';
            ws_url = 'ws://' + ip + ':1026';
        }
        res.json({id: req.user.username, ws: ws, ws_url: ws_url});
    });
});

app.get('/download/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('download');
        console.log(req.params);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (!item) {
                util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
            }
            console.log(item);
            var filePath = util.getFileLocation(item.owner, item._id);
            tagTool.setLatest('', item._id, req.session, next, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                console.log('latest file: ' + item._id);
            });
            console.log(filePath);
            res.download(filePath, unescape(encodeURIComponent(item.name)));
        });
    });
});

app.get('/image/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('download');
        console.log(req.params);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (!item) {
                util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
            }
            console.log(item);
            var filePath = util.getFileLocation(item.owner, item._id);
            tagTool.setLatest('image', item._id, req.session, next, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                console.log('latest file: ' + item._id);
            });
            console.log(filePath);
            res.download(filePath, unescape(encodeURIComponent(item.name)));
        });
    });
});

app.get('/preview/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('preview');
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (item && (item.status === 2 || item.status === 3 || item.status === 5 || item.status === 6)) {
                console.log(item);
                var type = 'image/jpeg', ext = '.jpg';
                if (item.status === 3) {
                    ext = '_s.jpg';
                } else if (item.status === 6) {
                    type = 'text/html';
                    ext = '.htm';
                } else if (item.status === 5) {
                    type = 'application/pdf';
                    ext = '.pdf';
                }
                var filePath = util.getFileLocation(item.owner, item._id);
                if (item.status === 6 || item.status === 5) {
                    var saveType = 'doc';
                    if (item.status === 6) {
                        saveType = 'rawdoc';
                    }
                    tagTool.setLatest(saveType, item._id, req.session, next, function(err) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        console.log('latest file: ' + item._id);
                    });
                }
                fs.exists(filePath + ext, function (exists) {
                    if (!exists) {
                        util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
                    }
                    res.writeHead(200, { 'Content-Type': type });
                    var stream = fs.createReadStream(filePath + ext).pipe(res);
                });
            } else {
                util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
            }
        });
    });
});

app.get('/subtitle/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle');
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (item && item.status === 3) {
                console.log(item);
                var filePath = util.getFileLocation(item.owner, item._id);
                fs.exists(filePath + '.vtt', function (exists) {
                    res.writeHead(200, { 'Content-Type': 'text/vtt' });
                    if (!exists) {
                        var stream = fs.createReadStream('/home/pi/app/public/123.vtt').pipe(res);
                    } else {
                        var stream = fs.createReadStream(filePath + '.vtt').pipe(res);
                    }
                });
            } else {
                util.handleError({hoerror: 2, msg: "cannot find file!!!"}, next, res);
            }
        });
    });
});

app.get('/video/:uid', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("video");
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, msg: "uid is not vaild"}, next, res);
        }
        mongo.orig("findOne", "storage", {_id: id}, function(err,item){
            if (err) {
                util.handleError(err, next, res);
            }
            if (item && (item.status === 3 || item.status === 4)) {
                console.log(item);
                var videoPath = util.getFileLocation(item.owner, item._id);
                var saveType = 'video';
                if (item.status === 4) {
                    saveType = 'music';
                }
                tagTool.setLatest(saveType, item._id, req.session, next, function(err) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    console.log('latest file: ' + item._id);
                });
                console.log(videoPath);
                fs.stat(videoPath, function(err, video) {
                    if (err) {
                        console.log(err);
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
                        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
                        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(videoPath, {start: start, end: end}).pipe(res);
                    } else {
                        console.log('ALL: ' + total);
                        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(videoPath).pipe(res);
                    }
                });
            } else {
                util.handleError({hoerror: 2, msg: "cannot find video!!!"}, next, res);
            }
        });
    });
});

//passport
passport.use(new LocalStrategy(function(username, password, done){
    //記得檢查input!!!
    console.log('login');
    var name = util.isValidString(username, 'name'),
        pwd = util.isValidString(password, 'passwd');
    if (name === false) {
        util.handleError({hoerror: 2, msg: "username is not vaild"}, done);
        done(null, false, { message: "username is not vaild" });
    } else {
        if (pwd === false) {
            util.handleError({hoerror: 2, msg: "passwd is not vaild"}, done);
            done(null, false, { message: "passwd is not vaild" });
        } else {
            mongo.orig("findOne", "user" ,{username: name}, function(err,user){
                if(err) {
                    util.handleError(err, done, function(err) {
                        return done(err);
                    });
                }
                if(!user){
                    return done(null, false, { message: "Incorrect username." });
                }
                var encodePwd = crypto.createHash('md5').update(pwd).digest('hex');
                if (encodePwd === user.password) {
                    return done(null, user);
                }
                console.log('Incorrect password: ' + encodePwd + '  ' + user.password);
                return done(null, false, { message: 'Incorrect password.' });
            });
        }
    }
}));

passport.serializeUser(function(user, done) {
    console.log(user._id);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log(id);
    mongo.orig("findOne", "user", {_id: mongo.objectID(id)}, function(err,user){
        console.log(user);
        if(err) {
            util.handleError(err, done, function(err) {
                return done(err);
            });
        }
        done(null,user);
    });
});

//api error handle
app.post('/api*', passport.authenticate('local', { failureRedirect: '/api' }),
    function(req, res) {
        console.log("auth ok");
        //res.cookie('id', req.user.username);
        res.json({loginOK: true, id: req.user.username});
});

app.all('/api*', function(req, res, next) {
    "use strict";
    console.log('auth fail!!!');
    console.log(req.path);
    res.send('auth fail!!!', 401);
});

//view
app.get('/views/UserInfo', function(req, res, next) {
    "use strict";
    console.log("views/userinfo");
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
    console.log("views");
    var stream = fs.createReadStream(viewsPath + '/UserInfo.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.get('/views/Storage', function(req, res, next) {
    "use strict";
    console.log("views");
    var stream = fs.createReadStream(viewsPath + '/Storage.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.get('/views/:id(\\w+)', function(req, res) {
    "use strict";
    console.log("views");
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
                console.log('next');
                next();
            }
        } else {
            console.log('next');
            next();
        }
    } else {
        console.log('authed');
        setTimeout(function(){
            callback(req, res, next);
        }, 0);
    }
}

function getStorageItem(user, items, mediaHandle) {
    var itemList = [];
    if (util.checkAdmin(1, user)) {
        for (var i in items) {
            if (items[i].adultonly === 1) {
                items[i].tags.push('18禁');
            }
            if (mediaHandle === 1) {
                itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status, media: items[i].mediaType});
            } else {
                itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status});
            }
        }
    } else {
        for (var i in items) {
            if (items[i].adultonly === 1) {
                items[i].tags.push('18禁');
            }
            if (user._id.equals(items[i].owner)) {
                if (mediaHandle === 1) {
                    itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status, media: items[i].mediaType});
                } else {
                    itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: true, status: items[i].status});
                }
            } else {
                if (mediaHandle === 1) {
                    itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: false, status: items[i].status, media: items[i].mediaType});
                } else {
                    itemList.push({name: items[i].name, id: items[i]._id, tags: items[i].tags, recycle: items[i].recycle, isOwn: false, status: items[i].status});
                }
            }
        }
    }
    return itemList;
}

//default
app.get('*', function(req, res, next) {
    "use strict";
    console.log("index.html");
    var stream = fs.createReadStream(viewsPath + '/index.html');
    stream.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream.pipe(res);
});

app.all('*', function(req, res, next) {
    "use strict";
    console.log(req.path);
    res.send('Page not found!', 404);
});

//error handle
app.use(function(err, req, res, next) {
    "use strict";
    console.log(err);
    res.send('server error occur', 500);
});

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: ', err);
    if (err.stack) {
        console.log(err.stack);
    }
});

var server1 = http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(1025);

var server2 = http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(1026);

var server3 = http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(1027);

var wssServer = new WebSocketServer({
    httpServer: server1,
    autoAcceptConnections: false
});

var wsServer = new WebSocketServer({
    httpServer: server2,
    autoAcceptConnections: false
});

var wsjServer = new WebSocketServer({
    httpServer: server3,
    autoAcceptConnections: false
});

function onWsConnMessage(message) {
    console.log(message);
    if (message.type == 'utf8') {
        console.log('Received message: ' + message.utf8Data);
    } else if (message.type == 'binary') {
        console.log('Received binary data.');
    }
}

function onWsConnClose(reasonCode, description) {
    console.log(' Peer disconnected with reason: ' + reasonCode);
}

function onWsRequest(request) {
    var connection = request.accept('node-angular', request.origin);
    console.log("WebSocket connection accepted.");

    clients.push(connection);

    connection.on('message', onWsConnMessage);
    connection.on('close', onWsConnClose);
}

function onWsjRequest(request) {
    var connection = request.accept('node-angular-junior', request.origin);
    console.log("WebSocket connection accepted.");

    jclients.push(connection);

    connection.on('message', onWsConnMessage);
    connection.on('close', onWsConnClose);
}

function onWssRequest(request) {
    var connection = request.accept('node-angular-senior', request.origin);
    console.log("WebSocket connection accepted.");

    sclients.push(connection);

    connection.on('message', onWsConnMessage);
    connection.on('close', onWsConnClose);
}

function sendWs(data, adultonly, auth) {
    var sendData = JSON.stringify(data);
    for (var i = 0; i < sclients.length; i++) {
        sclients[i].sendUTF(sendData);
    }
    if (!auth) {
        for (var i = 0; i < clients.length; i++) {
            clients[i].sendUTF(sendData);
        }
        if (!adultonly) {
            for (var i = 0; i < jclients.length; i++) {
                jclients[i].sendUTF(sendData);
            }
        }
    }
}

server.listen(port, ip);

wssServer.on('request', onWssRequest);

wsServer.on('request', onWsRequest);

wsjServer.on('request', onWsjRequest);

console.log('start express server\n');

console.log("Server running at http://" + ip + ":" + port + ' ' + new Date());