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

var tagTool = require("../models/tag-tool.js")("storage");

var stockTagTool = require("../models/tag-tool.js")("stock");

var stockTool = require("../models/stock-tool.js");

var pwTagTool = require("../models/tag-tool.js")("password");

var pwTool = require("../models/password-tool.js");

var googleApi = require("../models/api-tool-google.js");

var externalTool = require('../models/external-tool.js');

var util = require("../util/utility.js");

var mime = require('../util/mime.js');

var https = require('https'),
    //privateKey  = fs.readFileSync(config_type.privateKey, 'utf8'),
    //certificate = fs.readFileSync(config_type.certificate, 'utf8'),
    pfx = fs.readFileSync(config_type.pfx),
    credentials = {pfx: pfx, passphrase: config_type.pfx_pwd, ciphers: [
        "ECDHE-RSA-AES256-SHA384",
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "DHE-RSA-AES256-SHA256",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES128-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA"
    ].join(':'), honorCipherOrder: true};
    credentials.agent = new https.Agent(credentials);
var express = require('express'),
    express_session = require('express-session'),
    crypto = require('crypto'),
    net = require('net'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express(),
    server = https.createServer(credentials, app),
    //port = 443,
    encode = "utf8",
    viewsPath = path.join(__dirname, "../../../views"),
    staticPath = path.join(__dirname, "../../../public"),
    sessionStore = require("../models/session-tool.js")(express_session),
    stockFiltering = false;

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express_session(sessionStore.config));
//app.use(require('connect-multiparty')({ uploadDir: config_glb.nas_tmp }));
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

app.get('/s', function (req, res, next) {
    console.log('short');
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    mongo.orig("find", 'storage', {status: 7}, {sort: [['utime', 'desc']], limit: 1}, function(err, items){
        if(err) {
            util.handleError(err, next, res);
        }
        if (items.length < 1) {
            util.handleError({hoerror: 2, message: "cannot find url"}, next, res);
        }
        if (!items[0].url) {
            util.handleError({hoerror: 2, message: "dont have url"}, next, res);
        }
        var url = decodeURIComponent(items[0].url);
        var body = '302. Redirecting to ' + url;
        res.header('Content-Type', 'text/plain');
        res.statusCode = 302;
        res.header('Location', url);
        res.end(body);
    });
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
    res.json({apiOK: true, url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.extent_file_port});
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

app.put('/api/edituser/:uid?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("edituser");
        console.log(new Date());
        console.log(req.url);
        var userPW = '';
        if (req.body.userPW) {
            userPW = util.isValidString(req.body.userPW, 'passwd');
        }
        if (userPW === false) {
            util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
        }
        if (!util.userPWCheck(req.user, userPW)) {
            util.handleError({hoerror: 2, message: "permission denied"}, next, res);
        }
        delete req.body.userPW;
        delete userPW;
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
            var userPW = '';
            if (req.body.userPW) {
                userPW = util.isValidString(req.body.userPW, 'passwd');
            }
            if (userPW === false) {
                util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
            }
            if (!util.userPWCheck(req.user, userPW)) {
                util.handleError({hoerror: 2, message: "permission denied"}, next, res);
            }
            delete req.body.userPW;
            delete userPW;
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
        var userPW = '';
        if (req.body.userPW) {
            userPW = util.isValidString(req.body.userPW, 'passwd');
        }
        if (userPW === false) {
            util.handleError({hoerror: 2, message: "passwd is not vaild"}, next, res);
        }
        if (!util.userPWCheck(req.user, userPW)) {
            util.handleError({hoerror: 2, message: "permission denied"}, next, res);
        }
        delete req.body.userPW;
        delete userPW;
        var id = util.isValidString(req.params.uid, 'uid');
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
            var tags = tagTool.searchTags(req.session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
            }
            var name = false;
            if (tagTool.isDefaultTag(req.params.name).index === 31) {
                name = req.params.name;
            } else {
                name = util.isValidString(req.params.name, 'name');
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

app.get('/api/youtube/get/:pageToken?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("youtube get");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var tags = tagTool.searchTags(req.session);
        if (!tags) {
            util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
        }
        var parentList = tags.getArray();
        var sortName = 'name';
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        var index = 1;
        var pageToken = false;
        if (req.params.pageToken) {
            index = Number(req.params.pageToken.match(/^\d+/));
            pageToken = req.params.pageToken.match(/^[^\d]+$/);
        }
        var nextIndex = index + 1;
        nextIndex = nextIndex.toString();
        var itemList = [];
        var retPageToken = '';
        var query = tagTool.getKuboQuery(parentList.cur, sortName, index);
        if (query) {
            externalTool.getSingleList('kubo', query, function(err, list) {
                if (err) {
                    util.handleError(err, next, res);
                }
                itemList = getKuboItem(list);
                retPageToken = nextIndex;
                yifyQuery();
            });
        } else {
            yifyQuery();
        }
        function biliQuery() {
            var query = tagTool.getBiliQuery(parentList.cur, sortName, index);
            if (query) {
                externalTool.getSingleList('bilibili', query, function(err, list) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    itemList = itemList.concat(getBiliItem(list));
                    retPageToken = nextIndex;
                    madQuery();
                });
            } else {
                madQuery();
            }
        }
        function yifyQuery() {
            var query = tagTool.getYifyQuery(parentList.cur, sortName, index);
            if (query) {
                externalTool.getSingleList('yify', query, function(err, list) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    itemList = itemList.concat(getYifyItem(list));
                    retPageToken = nextIndex;
                    biliQuery();
                });
            } else {
                biliQuery();
            }
        }
        function madQuery() {
            var query = tagTool.getMadQuery(parentList.cur, sortName, index);
            if (query) {
                if (query.post) {
                    externalTool.getSingleList('cartoonmad', query.url, function(err, list) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        itemList = itemList.concat(getMadItem(list));
                        retPageToken = nextIndex;
                        c99Query();
                    }, query.post);
                } else {
                    externalTool.getSingleList('cartoonmad', query, function(err, list) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        itemList = itemList.concat(getMadItem(list));
                        retPageToken = nextIndex;
                        c99Query();
                    });
                }
            } else {
                c99Query();
            }
        }
        function c99Query() {
            var query = tagTool.getC99Query(parentList.cur, sortName, index);
            if (query) {
                externalTool.getSingleList('comic99', query, function(err, list) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    itemList = itemList.concat(getC99Item(list));
                    retPageToken = nextIndex;
                    youtubeQuery();
                });
            } else {
                youtubeQuery();
            }
        }
        function youtubeQuery() {
            query = tagTool.getYoutubeQuery(parentList.cur, sortName, pageToken);
            if (query) {
                googleApi.googleApi('y search', query, function(err, metadata) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (!metadata.items) {
                        util.handleError({hoerror: 2, message: "search error"}, next, res);
                    }
                    var video_id = [];
                    var playlist_id = [];
                    if (metadata.items.length > 0 || (query.id_arr && query.id_arr.length > 0) || (query.pl_arr && query.pl_arr.length > 0)) {
                        if (query.id_arr) {
                            for (var i in query.id_arr) {
                                video_id.push(query.id_arr[i]);
                            }
                        }
                        if (query.pl_arr) {
                            for (var i in query.pl_arr) {
                                playlist_id.push(query.pl_arr[i]);
                            }
                        }
                        for (var i in metadata.items) {
                            if (metadata.items[i].id) {
                                if (metadata.items[i].id.videoId) {
                                    video_id.push(metadata.items[i].id.videoId);
                                } else if (metadata.items[i].id.playlistId) {
                                    playlist_id.push(metadata.items[i].id.playlistId);
                                }
                            }
                        }
                        if (video_id.length > 0) {
                            googleApi.googleApi('y video', {id: video_id.join(',')}, function(err, detaildata) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                if (playlist_id.length > 0) {
                                    googleApi.googleApi('y playlist', {id: playlist_id.join(',')}, function(err, detaildata1) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        for (var i in query.pl_arr) {
                                            for (var j in detaildata1.items) {
                                                if (detaildata1.items[j].id === query.pl_arr[i]) {
                                                    detaildata.items.splice(0, 0, detaildata1.items.splice(j, 1)[0]);
                                                    break;
                                                }
                                            }
                                        }
                                        detaildata.items = detaildata.items.concat(detaildata1.items);
                                        itemList = itemList.concat(getYoutubeItem(detaildata.items, query.type));
                                        if (metadata.nextPageToken) {
                                            retPageToken = retPageToken + metadata.nextPageToken;
                                            res.json({itemList: itemList, pageToken: retPageToken});
                                        } else if (retPageToken) {
                                            res.json({itemList: itemList, pageToken: retPageToken});
                                        } else {
                                            res.json({itemList: itemList});
                                        }
                                    });
                                } else {
                                    itemList = itemList.concat(getYoutubeItem(detaildata.items, query.type));
                                    if (metadata.nextPageToken) {
                                        retPageToken = retPageToken + metadata.nextPageToken;
                                        res.json({itemList: itemList, pageToken: retPageToken});
                                    } else if (retPageToken) {
                                        res.json({itemList: itemList, pageToken: retPageToken});
                                    } else {
                                        res.json({itemList: itemList});
                                    }
                                }
                            });
                        } else if (playlist_id.length > 0) {
                            googleApi.googleApi('y playlist', {id: playlist_id.join(',')}, function(err, detaildata) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                itemList = itemList.concat(getYoutubeItem(detaildata.items, query.type));
                                if (metadata.nextPageToken) {
                                    retPageToken = retPageToken + metadata.nextPageToken;
                                    res.json({itemList: itemList, pageToken: retPageToken});
                                } else if (retPageToken) {
                                    res.json({itemList: itemList, pageToken: retPageToken});
                                } else {
                                    res.json({itemList: itemList});
                                }
                            });
                        }
                    } else {
                        if (metadata.nextPageToken) {
                            retPageToken = retPageToken + metadata.nextPageToken;
                            res.json({itemList: itemList, pageToken: retPageToken});
                        } else if (retPageToken) {
                            res.json({itemList: itemList, pageToken: retPageToken});
                        } else {
                            res.json({itemList: itemList});
                        }
                    }
                });
            } else {
                if (retPageToken) {
                    res.json({itemList: itemList, pageToken: retPageToken});
                } else {
                    res.json({itemList: itemList});
                }
            }
        }
    });
});

app.get('/api/stock/getSingle/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('stockSortName', req.params.sortName);
        res.cookie('stockSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        if (page === 0 && req.params.name) {
            var tags = stockTagTool.searchTags(req.session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
            }
            var name = false;
            if (stockTagTool.isDefaultTag(req.params.name).index === 31) {
                name = req.params.name;
            } else {
                name = util.isValidString(req.params.name, 'name');
            }
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            tags.setSingleArray(name);
        }
        stockTagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStockItem(req.user, result.items);
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

app.get('/api/stock/get/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('stockSortName', req.params.sortName);
        res.cookie('stockSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        stockTagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStockItem(req.user, result.items);
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

app.get('/api/stock/single/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        stockTagTool.singleQuery(req.params.uid, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            if (result.empty) {
                res.json(result);
            } else {
                var itemList = getStockItem(req.user, [result.item]);
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
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'asc') {
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

app.get('/api/stock/reset', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("resetStock");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.stockSortName === 'name' || req.cookies.stockSortName === 'mtime') {
            sortName = req.cookies.stockSortName;
        }
        if (req.cookies.stockSortType === 'desc' || req.cookies.stockSortType === 'asc') {
            sortType = req.cookies.stockSortType;
        }
        stockTagTool.resetQuery(sortName, sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getStockItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList});
        });
    });
});

app.put('/api/addTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_add();
        } else {
            res.json({apiOK: true});
        }
        function recur_add() {
            tagTool.addTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    if (err.message === 'uid is not vaild') {
                        util.handleError(err);
                    } else {
                        util.handleError(err, next, res);
                    }
                } else {
                    sendWs({type: 'file', data: result.id}, result.adultonly);
                }
                index++;
                if (index < req.body.uids.length) {
                    recur_add(index);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

app.post('/api/addTagUrl', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("addTagUrl");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var url = util.isValidString(req.body.url, 'url');
        if (req.body.url.match(/^(http|https):\/\/store\.steampowered\.com\/app\//)) {
            console.log('steam');
            externalTool.parseTagUrl('steam', req.body.url, function(err, taglist) {
                if (err) {
                    util.handleError(err, next, res);
                }
                console.log(taglist);
                if (req.body.uids) {
                    recur_add(0, 0);
                    function recur_add(index, tagIndex) {
                        tagTool.addTag(req.body.uids[index], taglist[tagIndex], req.user, next, function(err, result) {
                            if (err) {
                                if (err.message === 'uid is not vaild') {
                                    util.handleError(err);
                                } else {
                                    util.handleError(err, next, res);
                                }
                            }
                            tagIndex++;
                            if (tagIndex < taglist.length) {
                                recur_add(index, tagIndex);
                            } else {
                                sendWs({type: 'file', data: result.id}, result.adultonly);
                                index++;
                                if (index < req.body.uids.length) {
                                    recur_add(index, tagIndex);
                                } else {
                                    res.json({apiOK: true});
                                }
                            }
                        });
                    }
                } else {
                    res.json({tags: taglist});
                }
            });
        } else if (req.body.url.match(/^(http|https):\/\/www\.imdb\.com\/title\//)) {
            console.log('imdb');
            externalTool.parseTagUrl('imdb', req.body.url, function(err, taglist) {
                if (err) {
                    util.handleError(err, next, res);
                }
                console.log(taglist);
                if (req.body.uids) {
                    recur_add(0, 0);
                    function recur_add(index, tagIndex) {
                        tagTool.addTag(req.body.uids[index], taglist[tagIndex], req.user, next, function(err, result) {
                            if (err) {
                                if (err.message === 'uid is not vaild') {
                                    util.handleError(err);
                                } else {
                                    util.handleError(err, next, res);
                                }
                            }
                            tagIndex++;
                            if (tagIndex < taglist.length) {
                                recur_add(index, tagIndex);
                            } else {
                                sendWs({type: 'file', data: result.id}, result.adultonly);
                                tagIndex = 0;
                                index++;
                                if (index < req.body.uids.length) {
                                    recur_add(index, tagIndex);
                                } else {
                                    res.json({apiOK: true});
                                }
                            }
                        });
                    }
                } else {
                    res.json({tags: taglist});
                }
            });
        } else if (req.body.url.match(/^(http|https):\/\/www\.allmusic\.com\//)) {
            console.log('allmusic');
            externalTool.parseTagUrl('allmusic', req.body.url, function(err, taglist) {
                if (err) {
                    util.handleError(err, next, res);
                }
                console.log(taglist);
                if (req.body.uids) {
                    recur_add(0, 0);
                    function recur_add(index, tagIndex) {
                        tagTool.addTag(req.body.uids[index], taglist[tagIndex], req.user, next, function(err, result) {
                            if (err) {
                                if (err.message === 'uid is not vaild') {
                                    util.handleError(err);
                                } else {
                                    util.handleError(err, next, res);
                                }
                            }
                            tagIndex++;
                            if (tagIndex < taglist.length) {
                                recur_add(index, tagIndex);
                            } else {
                                sendWs({type: 'file', data: result.id}, result.adultonly);
                                tagIndex = 0;
                                index++;
                                if (index < req.body.uids.length) {
                                    recur_add(index, tagIndex);
                                } else {
                                    res.json({apiOK: true});
                                }
                            }
                        });
                    }
                } else {
                    res.json({tags: taglist});
                }
            });
        } else {
            util.handleError({hoerror: 2, message: "invalid tag url"}, next, res);
        }
    });
});

app.put('/api/stock/addTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_add();
        } else {
            res.json({apiOK: true});
        }
        function recur_add() {
            stockTagTool.addTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, res);
                }
                index++;
                sendWs({type: 'stock', data: result.id}, 0, 1);
                if (index < req.body.uids.length) {
                    recur_add(index);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
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

app.put('/api/delTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_del();
        } else {
            res.json({apiOK: true});
        }
        function recur_del() {
            tagTool.delTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    if (err.message === 'uid is not vaild') {
                        util.handleError(err);
                    } else {
                        util.handleError(err, next, res);
                    }
                } else {
                    sendWs({type: 'file', data: result.id}, result.adultonly);
                }
                index++;
                if (index < req.body.uids.length) {
                    setTimeout(function() {
                        recur_del();
                    }, 500);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

app.put('/api/stock/delTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_del();
        } else {
            res.json({apiOK: true});
        }
        function recur_del() {
            stockTagTool.delTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, res);
                }
                index++;
                sendWs({type: 'stock', data: result.id}, 0, 1);
                if (index < req.body.uids.length) {
                    setTimeout(function() {
                        recur_del();
                    }, 500);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

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

app.get('/api/parent/stock/list/:lang?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stockparent list');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var lang = typeof req.params.lang !== 'undefined' ? req.params.lang : 'tw';
        var list = stockTagTool.parentList();
        var ret = [];
        for (var i in list) {
            ret.push({'name':list[i].name, 'show':list[i][lang]});
        }
        res.json({parentList: ret});
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

app.get('/api/parent/stock/taglist/:name/:sortName(name|mtime)/:sortType(desc|asc)/:page(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock showTaglist");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var page = Number(req.params.page);
        res.cookie('dirStock' + req.params.name + 'SortName', req.params.sortName);
        res.cookie('dirStock' + req.params.name + 'SortType', req.params.sortType);
        stockTagTool.parentQuery(req.params.name, req.params.sortName, req.params.sortType, page, req.user, next, function(err, result) {
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

app.post('/api/parent/stock/add', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock parentAdd");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        stockTagTool.addParent(req.body.name, req.body.tag, req.user, next, function(err, result) {
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

app.delete('/api/parent/stock/del/:id', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock parentDel");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        stockTagTool.delParent(id, req.user, next, function(err, result) {
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
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'asc') {
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

app.get('/api/parent/stock/query/:id/:single?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock parent query");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.stockSortName === 'name' || req.cookies.stockSortName === 'mtime') {
            sortName = req.cookies.stockSortName;
        }
        if (req.cookies.stockSortType === 'desc' || req.cookies.stockSortType === 'asc') {
            sortType = req.cookies.stockSortType;
        }
        stockTagTool.queryParentTag(id, req.params.single, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStockItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

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

app.get('/api/bookmark/stock/getList/:sortName(name|mtime)/:sortType(desc|asc)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock get bookmark list");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.cookie('bookmarkStockSortName', req.params.sortName);
        res.cookie('bookmarkStockSortType', req.params.sortType);
        stockTagTool.getBookmarkList(req.params.sortName, req.params.sortType, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({bookmarkList: result.bookmarkList});
        });
    });
});

app.get('/api/bookmark/set/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("set bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        mongo.orig("find", "storage", {_id: id, status: 8}, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, next, res);
            }
            if (items.length < 1 || !items[0].btag || !items[0].bexactly) {
                util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, res);
            }
            tagTool.setBookmark(items[0].btag, items[0].bexactly, sortName, sortType, req.user, req.session, next, function(err, result) {
                if(err) {
                    util.handleError(err, next, res);
                }
                var itemList = getStorageItem(req.user, result.items, result.mediaHadle);
                res.json({itemList: itemList, parentList: result.parentList, latest: result.latest});
                tagTool.setLatest('', id, req.session, function(err) {
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
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
        }
        if (req.cookies.fileSortType === 'asc') {
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

app.get('/api/bookmark/stock/get/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get stock bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.stockSortName === 'name' || req.cookies.stockSortName === 'mtime') {
            sortName = req.cookies.stockSortName;
        }
        if (req.cookies.stockSortType === 'desc' || req.cookies.stockSortType === 'asc') {
            sortType = req.cookies.stockSortType;
        }
        stockTagTool.getBookmark(id, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getStockItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.post('/api/bookmark/subscipt', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("subscipt bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        var bpath = [];
        var bexactly = [];
        var path_name = false;
        if (req.body.path.length <= 0 || req.body.exactly.length <= 0) {
            util.handleError({hoerror: 2, message: "empty parent list!!!"}, next, res);
        }
        for (var i in req.body.path) {
            path_name = util.isValidString(req.body.path[i], 'name');
            if (path_name === false) {
                util.handleError({hoerror: 2, message: "path name is not vaild"}, next, res);
            }
            bpath.push(path_name);
        }
        for (var i in req.body.exactly) {
            if (req.body.exactly[i]) {
                bexactly.push(true);
            } else {
                bexactly.push(false);
            }
        }
        tagTool.addBookmark(name, req.user, req.session, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            newBookmarkItem(name, req.user, req.session, bpath, bexactly, function (err, bid, bname, select, option) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (bid) {
                    result['bid'] = bid;
                    result['bname'] = bname;
                }
                if (select) {
                    result['select'] = select;
                }
                if (option) {
                    result['option'] = option;
                }
                res.json(result);
            });
        }, bpath, bexactly);
    });
});

function newBookmarkItem(name, user, session, bpath, bexactly, callback) {
    var bookmark_path = [];
    for (var i = 0; i < bpath.length; i++) {
        if (bexactly[i]) {
            bookmark_path.push(bpath[i] + '/1');
        } else {
            bookmark_path.push(bpath[i] + '/0');
        }
    }
    var bookmark_md5 = crypto.createHash('md5').update(bookmark_path.join('/')).digest('hex');
    console.log(bookmark_path.join('/'));
    console.log(bookmark_md5);
    mongo.orig("count", "storage", {bmd5: bookmark_md5}, function(err, count){
        if (err) {
            util.handleError(err, callback, callback);
        }
        if (count > 0) {
            setTimeout(function(){
                callback(null, null, null, null, null);
            }, 0);
        } else {
            //000開頭讓排序在前
            if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                name = mime.addPost(name, '1');
            }
            var bookName = '000 Bookmark ' + name;
            var oOID = mongo.objectID();
            var utime = Math.round(new Date().getTime() / 1000);
            var oUser_id = user._id;
            var ownerTag = [];
            var data = {};
            data['_id'] = oOID;
            data['owner'] = oUser_id;
            data['utime'] = utime;

            data['bmd5'] = bookmark_md5;
            data['btag'] = bpath;
            data['bexactly'] = bexactly;

            data['size'] = 0;
            data['count'] = 0;
            data['first'] = 1;
            data['recycle'] = 0;
            data['adultonly'] = 0;
            data['untag'] = 1;
            data['status'] = 8;//media type
            var tags = ['bookmark', '書籤'];
            var normal = tagTool.normalizeTag(name);
            if (tags.indexOf(normal) === -1) {
                tags.push(normal);
            }
            normal = tagTool.normalizeTag(user.username);
            if (tags.indexOf(normal) === -1) {
                tags.push(normal);
            }
            var is_d = false;
            var channel = false;
            for (var i in bpath) {
                normal = tagTool.normalizeTag(bpath[i]);
                is_d = tagTool.isDefaultTag(normal);
                if (!is_d) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                } else if (is_d.index === 0) {
                    data['adultonly'] = 1;
                } else if (is_d.index === 30) {
                    is_d = tagTool.isDefaultTag(bpath[i]);
                    if (is_d[1] === 'ch') {
                        channel = is_d[2];
                    }
                }
            }
            var stags = tagTool.searchTags(session);
            if (!stags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, callback, callback);
            }
            var parentList = stags.getArray();
            for (var i in parentList.cur) {
                normal = tagTool.normalizeTag(parentList.cur[i]);
                is_d = tagTool.isDefaultTag(normal);
                if (!is_d) {
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                } else if (is_d.index === 0) {
                    data['adultonly'] = 1;
                }
            }
            function saveDB() {
                data['tags'] = tags;
                data[oUser_id] = tags;
                mongo.orig("insert", "storage", data, function(err, item){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(item);
                    console.log('save end');
                    sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                    var optiontag = mime.getOptionTag('cht');
                    var opt = [];
                    for (var i in optiontag) {
                        if (tags.indexOf(optiontag[i]) === -1) {
                            opt.push(optiontag[i]);
                        }
                    }
                    tagTool.getRelativeTag(tags[0], user, opt, callback, function(err, relative) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var reli = 5;
                        if (relative.length < reli) {
                            reli = relative.length;
                        }
                        if (util.checkAdmin(2, user)) {
                            if (item[0].adultonly === 1) {
                                tags.push('18+');
                            } else {
                                opt.push('18+');
                            }
                        }
                        if (item[0].first === 1) {
                            tags.push('first item');
                        } else {
                            opt.push('first item');
                        }
                        var normal = '';
                        for (var i = 0; i < reli; i++) {
                            normal = tagTool.normalizeTag(relative[i]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (tags.indexOf(normal) === -1 && opt.indexOf(normal) === -1) {
                                    opt.push(normal);
                                }
                            }
                        }
                        setTimeout(function(){
                            callback(null, item[0]._id, bookName, tags, opt);
                        }, 0);
                    });
                });
            }
            if (channel) {
                googleApi.googleApi('y channel', {id: channel}, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    bookName = '000 Channel ' + name;
                    normal = tagTool.normalizeTag(bookName);
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                    data['name'] = bookName;
                    if (tags.indexOf('channel') === -1) {
                        tags.push('channel');
                    }
                    if (tags.indexOf('youtube') === -1) {
                        tags.push('youtube');
                    }
                    if (tags.indexOf('頻道') === -1) {
                        tags.push('頻道');
                    }
                    var keywords = metadata.items[0].brandingSettings.channel.keywords;
                    if (keywords) {
                        keywords = keywords.split(',');
                        if (keywords.length === 1) {
                            var k1 = keywords[0].match(/\"[^\"]+\"/g);
                            var k2 = keywords[0].replace(/\"[^\"]+\"/g,'');
                            keywords = k2.trim().split(/[\s]+/);
                            for (var i in k1) {
                                keywords.push(k1[i].match(/[^\"]+/)[0]);
                            }
                        }
                        for (var i in keywords) {
                            normal = tagTool.normalizeTag(keywords[i]);
                            is_d = tagTool.isDefaultTag(normal);
                            if (!is_d) {
                                if (tags.indexOf(normal) === -1) {
                                    tags.push(normal);
                                }
                            } else if (is_d.index === 0) {
                                data['adultonly'] = 1;
                            }
                        }
                    }
                    saveDB();
                });
            } else {
                tagTool.getRelativeTag(bpath, user, [], callback, function(err, btags) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    for (var i in btags) {
                        if (tags.indexOf(btags[i]) === -1) {
                            tags.push(btags[i]);
                        }
                    }
                    normal = tagTool.normalizeTag(bookName);
                    if (tags.indexOf(normal) === -1) {
                        tags.push(normal);
                    }
                    data['name'] = bookName;
                    saveDB();
                }, bexactly);
            }
        }
    });
}

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
            var tags = tagTool.searchTags(req.session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
            }
            var parentList = tags.getArray();
            if (parentList.cur.length <= 0) {
                util.handleError({hoerror: 2, message: 'empty parent list!!!'}, next, res);
            }
            newBookmarkItem(name, req.user, req.session, parentList.cur, parentList.exactly, function (err, bid, bname, select, option) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (bid) {
                    result['bid'] = bid;
                    result['bname'] = bname;
                }
                if (select) {
                    result['select'] = select;
                }
                if (option) {
                    result['option'] = option;
                }
                res.json(result);
            });
        });
    });
});

app.post('/api/bookmark/stock/add', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock addbookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        stockTagTool.addBookmark(name, req.user, req.session, next, function(err, result){
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

app.delete('/api/bookmark/stock/del/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("del stock bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        stockTagTool.delBookmark(id, next, function(err, result){
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
        console.log(sql);
        if (sql.empty) {
            res.json({itemList: []});
        } else {
            sql.nosql['status'] = type;
            mongo.orig("find", "storage", sql.nosql, sql.select, sql.options, function(err, items){
                if(err) {
                    util.handleError(err, next, res);
                }
                var itemList = getStorageItem(req.user, items);
                res.json({itemList: itemList});
            });
        }
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
        var tags = tagTool.searchTags(req.session);
        if (!tags) {
            util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.fileSortName === 'count' || req.cookies.fileSortName === 'mtime') {
            sortName = req.cookies.fileSortName;
            if (sortName === 'mtime') {
                sortName = 'utime';
            }
        }
        if (req.cookies.fileSortType === 'asc') {
            sortType = req.cookies.fileSortType;
        }
        tags.saveArray(name, sortName, sortType);
        res.json({apiOK: true});
    });
});

app.get('/api/media/record/:id/:time/:pId?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('media doc record');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        if (!req.params.time.match(/^\d+(&\d+|\.\d+)?$/)) {
            util.handleError({hoerror: 2, message: "timestamp is not vaild"}, next, res);
        }
        var id = req.params.id.match(/^(you|dym|dri|bil|soh|let|vqq|fun|kdr|yuk|tud|mad|fc1|c99)_/);
        if (id) {
            id = util.isValidString(req.params.id, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
        } else {
            id = util.isValidString(req.params.id, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "file is not vaild"}, next, res);
            }
        }
        if (req.params.time === '0') {
            mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: id, $isolated: 1}, function(err,user){
                if(err) {
                    util.handleError(err, next, res);
                }
                if (req.params.pId) {
                    var pId = req.params.pId.match(/^ypl_/);
                    if (pId) {
                        pId = util.isValidString(req.params.pId, 'name');
                        if (pId === false) {
                            util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
                        }
                    } else {
                        pId = util.isValidString(req.params.pId, 'uid');
                        if (id === false) {
                            util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
                        }
                    }
                    mongo.orig("remove", "storageRecord", {userId: req.user._id, fileId: pId, $isolated: 1}, function(err,user1){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        res.json({apiOK: true});
                    });
                } else {
                    res.json({apiOK: true});
                }
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

app.get('/api/torrent/query/preview/:id', function (req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent query preview");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items){
            if (err) {
                util.handleError(err, next, res);
            }
            console.log(items);
            if (items.length === 0 || items[0].status !== 9) {
                util.handleError({hoerror: 2, message: 'playlist can not be fund!!!'}, next, res);
            }
            mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: items[0]._id}, {limit: 1}, function(err, items2){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items2.length === 0) {
                    res.json({id: items[0]._id, list: items[0].playList});
                } else {
                    res.json({id: items[0]._id, list: items[0].playList, time: items2[0].recordTime});
                }
                tagTool.setLatest('', id, req.session, function(err) {
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
        });
    });
});

app.get('/api/media/setTime/:id/:type/:obj?/:pageToken?/:back(back)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('media setTime');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.id.match(/^(you|ypl|kub|yif|mad|bbl|c99)_(.*)$/);
        var playlist = 0;
        var playlistId = null;
        var obj = req.params.obj;
        if (id) {
            if (id[1] === 'ypl') {
                playlist = 1;
                playlistId = id[2];
            } else if (id[1] === 'kub') {
                playlist = 3;
                playlistId = id[2];
            } else if (id[1] === 'yif') {
                playlist = 4;
                playlistId = id[2];
            } else if (id[1] === 'mad') {
                playlist = 5;
                playlistId = id[2];
            } else if (id[1] === 'bbl') {
                playlist = 6;
                playlistId = id[2];
            } else if (id[1] === 'c99') {
                playlist = 7;
                playlistId = id[2];
            }
            id = util.isValidString(req.params.id, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "youtube is not vaild"}, next, res);
            }
        } else {
            id = util.isValidString(req.params.id, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "file is not vaild"}, next, res);
            }
            if (obj && obj.match(/^(you_.*|external|\d+(\.\d+)?)$/)) {
                playlist = 2;
                if (obj === 'external') {
                    obj = null;
                }
            }
        }
        var type = util.isValidString(req.params.type, 'name');
        if (type === false) {
            util.handleError({hoerror: 2, message: "type is not vaild"}, next, res);
        }
        function getRecord() {
            if (type === 'url') {
                res.json({apiOK: true});
                if (type === 'url') {
                    type = '';
                }
                tagTool.setLatest(type, id, req.session, function(err) {
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
                        if (playlist) {
                            if (playlist === 1) {
                                externalTool.youtubePlaylist(playlistId, 1, function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (total <= 0) {
                                        util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                    }
                                    mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj}, {limit: 1}, function(err, items1){
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        if (items1.length === 0 || type === 'music') {
                                            res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                        } else {
                                            res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                        }
                                    });
                                });
                            } else if (playlist === 2) {
                                mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items1){
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (items1.length === 0) {
                                        util.handleError({hoerror: 2, message: "cannot find external"}, next, res);
                                    }
                                    externalTool.getSingleId(items1[0].owner, decodeURIComponent(items1[0].url), 1, function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        if (total <= 0) {
                                            util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                        }
                                        if (obj.id) {
                                            mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                                if (err) {
                                                    util.handleError(err, next, res);
                                                }
                                                if (obj_arr) {
                                                    if (items1.length === 0 || type === 'music') {
                                                        res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                    } else {
                                                        res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                    }
                                                } else {
                                                    if (items1.length === 0 || type === 'music') {
                                                        res.json({playlist: {obj: obj, end: is_end, total: total}});
                                                    } else {
                                                        res.json({time: items1[0].recordTime, playlist: {obj: obj, end: is_end, total: total}});
                                                    }
                                                }
                                            });
                                        } else {
                                            res.json({playlist: {obj: obj, end: is_end, total: total}});
                                        }
                                    });
                                });
                            } else if (playlist > 2) {
                                var playurl = 'http://www.123kubo.com/vod-read-id-' + playlistId + '.html';
                                var playtype = 'kubo';
                                if (playlist === 4) {
                                    playurl = 'https://yts.ag/api/v2/movie_details.json?movie_id=' + playlistId;
                                    playtype = 'yify';
                                } else if (playlist === 5) {
                                    playurl = 'http://www.cartoomad.com/comic/' + playlistId + '.html';
                                    playtype = 'cartoonmad';
                                } else if (playlist === 6) {
                                    if (playlistId.match(/^av/)) {
                                        playurl = 'http://www.bilibili.com/video/' + playlistId + '/';
                                    } else {
                                        playurl = 'http://www.bilibili.com/bangumi/i/' + playlistId + '/';
                                    }
                                    playtype = 'bilibili';
                                } else if (playlist === 7) {
                                    playurl = 'http://www.99comic.com/comic/' + playlistId + '/';
                                    playtype = 'comic99';
                                }
                                externalTool.getSingleId(playtype, playurl, 1, function(err, obj, is_end, total) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (total <= 0) {
                                        util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                    }
                                    if (obj.id) {
                                        mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items1.length === 0 || type === 'music') {
                                                res.json({playlist: {obj: obj, end: is_end, total: total}});
                                            } else {
                                                res.json({time: items1[0].recordTime, playlist: {obj: obj, end: is_end, total: total}});
                                            }
                                        });
                                    } else {
                                        res.json({playlist: {obj: obj, end: is_end, total: total}});
                                    }
                                });
                            }
                        } else {
                            res.json({apiOK: true});
                        }
                    } else {
                        if (playlist) {
                            if (playlist === 1) {
                                externalTool.youtubePlaylist(playlistId, items[0].recordTime, function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken, is_new) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (total <= 0) {
                                        util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                    }
                                    if (is_new) {
                                        mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: id}, {$set: {recordTime: obj.id}}, function(err, item){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                                if (err) {
                                                    util.handleError(err, next, res);
                                                }
                                                if (items1.length === 0 || type === 'music') {
                                                    res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                } else {
                                                    res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                }
                                            });
                                        });
                                    } else {
                                        mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items1.length === 0 || type === 'music') {
                                                res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                            } else {
                                                res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                            }
                                        });
                                    }
                                }, items[0].pageToken, req.params.back);
                            } else if (playlist === 2) {
                                mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items1){
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (items1.length === 0) {
                                        util.handleError({hoerror: 2, message: "cannot find external"}, next, res);
                                    }
                                    externalTool.getSingleId(items1[0].owner, decodeURIComponent(items1[0].url), items[0].recordTime, function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken, is_new) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        if (total <= 0) {
                                            util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                        }
                                        if (obj.id) {
                                            if (is_new) {
                                                mongo.orig("update", "storageRecord", {userId: req.user._id, fileId: id}, {$set: {recordTime: obj.id}}, function(err, item){
                                                    if (err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                                        if (err) {
                                                            util.handleError(err, next, res);
                                                        }
                                                        if (items1.length === 0 || type === 'music') {
                                                            res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                        } else {
                                                            res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                        }
                                                    });
                                                });
                                            } else {
                                                mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                                    if (err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    if (obj_arr) {
                                                        if (items1.length === 0 || type === 'music') {
                                                            res.json({playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                        } else {
                                                            res.json({time: items1[0].recordTime, playlist: {obj_arr: obj_arr, obj: obj, pageN: pageN, pageP: pageP, pageToken: pageToken, end: is_end, total: total}});
                                                        }
                                                    } else {
                                                        if (items1.length === 0 || type === 'music') {
                                                            res.json({playlist: {obj: obj, end: is_end, total: total}});
                                                        } else {
                                                            res.json({time: items1[0].recordTime, playlist: {obj: obj, end: is_end, total: total}});
                                                        }
                                                    }
                                                });
                                            }
                                        } else {
                                            res.json({playlist: {obj: obj, end: is_end, total: total}});
                                        }
                                    }, items[0].pageToken, req.params.back);
                                });
                            } else if (playlist > 2) {
                                var playurl = 'http://www.123kubo.com/vod-read-id-' + playlistId + '.html';
                                var playtype = 'kubo';
                                if (playlist === 4) {
                                    playurl = 'https://yts.ag/api/v2/movie_details.json?movie_id=' + playlistId;
                                    playtype = 'yify';
                                } else if (playlist === 5) {
                                    playurl = 'http://www.cartoomad.com/comic/' + playlistId + '.html';
                                    playtype = 'cartoonmad';
                                } else if (playlist === 6) {
                                    if (playlistId.match(/^av/)) {
                                        playurl = 'http://www.bilibili.com/video/' + playlistId + '/';
                                    } else {
                                        playurl = 'http://www.bilibili.com/bangumi/i/' + playlistId + '/';
                                    }
                                    playtype = 'bilibili';
                                } else if (playlist === 7) {
                                    playurl = 'http://www.99comic.com/comic/' + playlistId + '/';
                                    playtype = 'comic99';
                                }
                                externalTool.getSingleId(playtype, playurl, items[0].recordTime, function(err, obj, is_end, total) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    if (total <= 0) {
                                        util.handleError({hoerror: 2, message: "playlist is empty"}, next, res);
                                    }
                                    if (obj.id) {
                                        mongo.orig("find", "storageRecord", {userId: req.user._id, fileId: obj.id}, {limit: 1}, function(err, items1){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items1.length === 0 || type === 'music') {
                                                res.json({playlist: {obj: obj, end: is_end, total: total}});
                                            } else {
                                                res.json({time: items1[0].recordTime, playlist: {obj: obj, end: is_end, total: total}});
                                            }
                                        });
                                    } else {
                                        res.json({playlist: {obj: obj, end: is_end, total: total}});
                                    }
                                });
                            }
                        } else {
                            if (type === 'music') {
                                res.json({apiOK: true});
                            } else {
                                res.json({time: items[0].recordTime});
                            }
                        }
                    }
                    tagTool.setLatest(type, id, req.session, function(err) {
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
        }
        if (playlist && obj) {
            var obj_match = obj.match(/^(you_|\d+(\.\d+)?$)/);
            if (!obj_match) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            obj = util.isValidString(obj, 'name');
            if (obj === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            var utime = Math.round(new Date().getTime() / 1000);
            var data = {};
            data['recordTime'] = obj;
            var pageToken = false;
            if (req.params.pageToken) {
                pageToken = util.isValidString(req.params.pageToken, 'name');
                if (pageToken !== false) {
                    data['pageToken'] = pageToken;
                }
            }
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
                            mongo.orig("insert", "storageRecord", data, function(err, item1){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                getRecord();
                            });
                        } else {
                            data['fileId'] = id;
                            mongo.orig("update", "storageRecord", {_id: items[0]._id}, {$set: data}, function(err, item1){
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                getRecord();
                            });
                        }
                    });
                } else {
                    getRecord();
                }
            });
        } else {
            getRecord();
        }
    });
});

app.get('/api/stock/querySimple/:uid', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock query simple');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        stockTool.getSingleStock(id, req.session, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/stock/getPER/:uid', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock get per');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        stockTool.getStockPER(id, function(err, result, index) {
            if (err) {
                util.handleError(err, next, res);
            }
            stockTool.getStockYield(id, function(err, result_1, index) {
                if (err) {
                    util.handleError(err, next, res);
                }
                res.json({per:index + ': ' + result + ' ' +result_1});
            });
        });
    });
});

/*app.get('/api/stock/getYield/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock get yield');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        stockTool.getStockYield(id, function(err, result, index) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({yield:index + ': ' + result});
        });
    });
});*/

app.get('/api/stock/getPoint/:uid/:price?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock get point');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        var price = 0;
        if (req.params.price) {
            if (!req.params.price.match(/\d+(\.\d+)?/)) {
                util.handleError({hoerror: 2, message: "price is not vaild"}, next, res);
            }
            price = Number(req.params.price);
        }
        stockTool.getStockPoint(id, price, function(err, point) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({point: point});
        });
    });
});

app.put('/api/stock/filter/:tag', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock filter');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.params.tag, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        var limit = 100;
        if (typeof req.body.limit !== 'number') {
            util.handleError({hoerror: 2, message: "limit is not vaild"}, next, res);
        }
        if (req.body.limit > 0) {
            limit = req.body.limit;
        }
        var per = false;
        if (req.body.per) {
            per = req.body.per.match(/^([<>])(\d+)$/);
            if (!per) {
                util.handleError({hoerror: 2, message: "per is not vaild"}, next, res);
            }
            per[2] = Number(per[2]);
        }
        var yield = false;
        if (req.body.yield) {
            yield = req.body.yield.match(/^([<>])(\d+)$/);
            if (!yield) {
                util.handleError({hoerror: 2, message: "yield is not vaild"}, next, res);
            }
            yield[2] = Number(yield[2]);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.stockSortName === 'count' || req.cookies.stockSortName === 'mtime') {
            sortName = req.cookies.stockSortName;
        }
        if (req.cookies.stockSortType === 'asc') {
            sortType = req.cookies.stockSortType;
        }
        if (stockFiltering) {
            util.handleError({hoerror: 2, message: "there is another filter running"}, next, res);
        }
        stockFiltering = true;
        stockTagTool.tagQuery(0, '', false, 0, sortName, sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                stockFiltering = false;
                util.handleError(err, next, res);
            }
            res.json({apiOK: true});
            var filterNum = 0;
            if (result.items.length > 0) {
                recur_per(0);
                function recur_per(index) {
                    if (per) {
                        stockTool.getStockPER(result.items[index]._id, function(err, stockPer) {
                            if (err) {
                                stockFiltering = false;
                                sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                util.handleError(err);
                            } else {
                                if (per && (per[1] === '>' && stockPer > per[2]) || per[1] === '<' && stockPer < per[2]) {
                                    console.log(stockPer);
                                    console.log(result.items[index].name);
                                    if (yield) {
                                        stockTool.getStockYield(result.items[index]._id, function(err, stockYield) {
                                            if (err) {
                                                stockFiltering = false;
                                                sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                                util.handleError(err);
                                            } else {
                                                if (yield && (yield[1] === '>' && stockYield > yield[2]) || (yield[1] === '<' && stockYield < yield[2])) {
                                                    console.log(stockYield);
                                                    filterNum++;
                                                    stockTagTool.addTag(result.items[index]._id, name, req.user, next, function(err, add_result) {
                                                        if (err) {
                                                            stockFiltering = false;
                                                            sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                                            util.handleError(err);
                                                        } else {
                                                            sendWs({type: 'stock', data: add_result.id}, 0, 1);
                                                            index++;
                                                            if (index < result.items.length) {
                                                                recur_per(index);
                                                            } else {
                                                                stockFiltering = false;
                                                                sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    index++;
                                                    if (index < result.items.length) {
                                                        recur_per(index);
                                                    } else {
                                                        stockFiltering = false;
                                                        sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        filterNum++;
                                        stockTagTool.addTag(result.items[index]._id, name, req.user, next, function(err, add_result) {
                                            if (err) {
                                                stockFiltering = false;
                                                sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                                util.handleError(err);
                                            } else {
                                                sendWs({type: 'stock', data: add_result.id}, 0, 1);
                                                index++;
                                                if (index < result.items.length) {
                                                    recur_per(index);
                                                } else {
                                                    stockFiltering = false;
                                                    sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    index++;
                                    if (index < result.items.length) {
                                        recur_per(index);
                                    } else {
                                        stockFiltering = false;
                                        sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                    }
                                }
                            }
                        });
                    } else if (yield) {
                        stockTool.getStockYield(result.items[index]._id, function(err, stockYield) {
                            if (err) {
                                stockFiltering = false;
                                sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                util.handleError(err);
                            } else {
                                if (yield && (yield[1] === '>' && stockYield > yield[2]) || (yield[1] === '<' && stockYield < yield[2])) {
                                    console.log(stockYield);
                                    console.log(result.items[index].name);
                                    filterNum++;
                                    stockTagTool.addTag(result.items[index]._id, name, req.user, next, function(err, add_result) {
                                        if (err) {
                                            stockFiltering = false;
                                            sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                            util.handleError(err);
                                        } else {
                                            sendWs({type: 'stock', data: add_result.id}, 0, 1);
                                            index++;
                                            if (index < result.items.length) {
                                                recur_per(index);
                                            } else {
                                                stockFiltering = false;
                                                sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                            }
                                        }
                                    });
                                } else {
                                    index++;
                                    if (index < result.items.length) {
                                        recur_per(index);
                                    } else {
                                        stockFiltering = false;
                                        sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                    }
                                }
                            }
                        });
                    } else {
                        filterNum++;
                        stockTagTool.addTag(result.items[index]._id, name, req.user, next, function(err, add_result) {
                            if (err) {
                                stockFiltering = false;
                                sendWs({type: req.user.username, data: 'Filter fail: ' + err.message}, 0);
                                util.handleError(err);
                            } else {
                                sendWs({type: 'stock', data: add_result.id}, 0, 1);
                                index++;
                                if (index < result.items.length) {
                                    recur_per(index);
                                } else {
                                    stockFiltering = false;
                                    sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
                                }
                            }
                        });
                    }
                }
            } else {
                stockFiltering = false;
                sendWs({type: req.user.username, data: 'Filter ' + name + ': ' + filterNum}, 0);
            }
        }, limit);
    });
});

app.post('/api/getOptionTag', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get option tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var optionList = ['first item'];
        if (req.body.tags.length > 0) {
            tagTool.getRelativeTag(req.body.tags[0], req.user, optionList, next, function(err, relative) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (req.body.tags.indexOf('first item') === -1) {
                    optionList.push('first item');
                }
                if (util.checkAdmin(2 ,req.user) && req.body.tags.indexOf('18+') === -1) {
                    optionList.push('18+');
                }
                var reli = 5;
                if (relative.length < reli) {
                    reli = relative.length;
                }
                for (var i = 0; i < reli; i++) {
                    if (optionList.indexOf(relative[i]) === -1) {
                        optionList.push(relative[i]);
                    }
                }

                if (req.body.tags.indexOf('18+') !== -1) {
                    var mo = mime.getOptionTag('adult');
                    for (var i in mo) {
                        if (optionList.indexOf(mo[i]) === -1) {
                            optionList.push(mo[i]);
                        }
                    }
                } else if (req.body.tags.indexOf('game') !== -1 || req.body.tags.indexOf('遊戲') !== -1) {
                    var mo = mime.getOptionTag('gamech');
                    for (var i in mo) {
                        if (optionList.indexOf(mo[i]) === -1) {
                            optionList.push(mo[i]);
                        }
                    }
                } else if (req.body.tags.indexOf('audio') !== -1 || req.body.tags.indexOf('音頻') !== -1) {
                    var mo = mime.getOptionTag('music');
                    for (var i in mo) {
                        if (optionList.indexOf(mo[i]) === -1) {
                            optionList.push(mo[i]);
                        }
                    }
                } else {
                    var mo = mime.getOptionTag('cht');
                    for (var i in mo) {
                        if (optionList.indexOf(mo[i]) === -1) {
                            optionList.push(mo[i]);
                        }
                    }
                }
                res.json({relative: optionList});
            });
        } else {
            if (util.checkAdmin(2 ,req.user)) {
                optionList.push('18+');
            }
            var mo = mime.getOptionTag('cht');
            for (var i in mo) {
                optionList.push(mo[i]);
            }
            res.json({relative: optionList});
        }
    });
});

app.get('/api/stock/getOptionTag/:tag?', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get stock option tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var optionList = ['important'];
        if (req.params.tag) {
            stockTagTool.getRelativeTag(req.params.tag, req.user, optionList, next, function(err, relative) {
                if (err) {
                    util.handleError(err, next, res);
                }
                var reli = 5;
                if (relative.length < reli) {
                    reli = relative.length;
                }
                for (var i = 0; i < reli; i++) {
                    if (optionList.indexOf(relative[i]) === -1) {
                        optionList.push(relative[i]);
                    }
                }
                res.json({relative: optionList});
            });
        } else {
            res.json({relative: optionList});
        }
    });
});

//password
app.get('/api/parent/password/list/:lang?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('password parent list');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var lang = typeof req.params.lang !== 'undefined' ? req.params.lang : 'tw';
        var list = pwTagTool.parentList();
        var ret = [];
        for (var i in list) {
            ret.push({'name':list[i].name, 'show':list[i][lang]});
        }
        res.json({parentList: ret});
    });
});

app.get('/api/password/get/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('passwordSortName', req.params.sortName);
        res.cookie('passwordSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        pwTagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getPasswordItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/password/getSingle/:sortName(name|mtime|count)/:sortType(desc|asc)/:page(\\d+)/:name?/:exactly(true|false)?/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var exactly = false;
        res.cookie('passwordSortName', req.params.sortName);
        res.cookie('passwordSortType', req.params.sortType);
        if (req.params.exactly === 'true') {
            exactly = true;
        }
        var page = Number(req.params.page);
        if (page === 0 && req.params.name) {
            var tags = pwTagTool.searchTags(req.session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, res);
            }
            var name = false;
            if (pwTagTool.isDefaultTag(req.params.name).index === 31) {
                name = req.params.name;
            } else {
                name = util.isValidString(req.params.name, 'name');
            }
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            tags.setSingleArray(name);
        }
        pwTagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getPasswordItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.get('/api/password/single/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password single");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        pwTagTool.singleQuery(req.params.uid, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            if (result.empty) {
                res.json(result);
            } else {
                var itemList = getPasswordItem(req.user, [result.item]);
                res.json({item: itemList[0], latest: result.latest, bookmarkID: result.bookmark});
            }
        });
    });
});

app.get('/api/bookmark/password/getList/:sortName(name|mtime)/:sortType(desc|asc)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password get bookmark list");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.cookie('bookmarkPasswordSortName', req.params.sortName);
        res.cookie('bookmarkPasswordSortType', req.params.sortType);
        pwTagTool.getBookmarkList(req.params.sortName, req.params.sortType, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({bookmarkList: result.bookmarkList});
        });
    });
});

app.get('/api/password/reset', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("reset password");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.passwordSortName === 'name' || req.cookies.passwordSortName === 'mtime') {
            sortName = req.cookies.passwordSortName;
        }
        if (req.cookies.passwordSortType === 'desc' || req.cookies.passwordSortType === 'asc') {
            sortType = req.cookies.passwordSortType;
        }
        pwTagTool.resetQuery(sortName, sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            var itemList = getPasswordItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList});
        });
    });
});

app.get('/api/password/getOptionTag/:tag?', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get password option tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var optionList = [];
        if (req.params.tag) {
            pwTagTool.getRelativeTag(req.params.tag, req.user, optionList, next, function(err, relative) {
                if (err) {
                    util.handleError(err, next, res);
                }
                var reli = 5;
                if (relative.length < reli) {
                    reli = relative.length;
                }
                for (var i = 0; i < reli; i++) {
                    if (optionList.indexOf(relative[i]) === -1) {
                        optionList.push(relative[i]);
                    }
                }
                res.json({relative: optionList});
            });
        } else {
            res.json({relative: optionList});
        }
    });
});

app.put('/api/password/addTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_add();
        } else {
            res.json({apiOK: true});
        }
        function recur_add() {
            pwTagTool.addTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, res);
                }
                index++;
                sendWs({type: 'password', data: result.id});
                if (index < req.body.uids.length) {
                    recur_add(index);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

app.put('/api/password/delTag/:tag', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var index = 0;
        if (req.body.uids.length > 0) {
            recur_del();
        } else {
            res.json({apiOK: true});
        }
        function recur_del() {
            pwTagTool.delTag(req.body.uids[index], req.params.tag, req.user, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, res);
                }
                index++;
                sendWs({type: 'password', data: result.id});
                if (index < req.body.uids.length) {
                    setTimeout(function() {
                        recur_del();
                    }, 500);
                } else {
                    res.json({apiOK: true});
                }
            });
        }
    });
});

app.post('/api/parent/password/add', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password parentAdd");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        pwTagTool.addParent(req.body.name, req.body.tag, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/parent/password/taglist/:name/:sortName(name|mtime)/:sortType(desc|asc)/:page(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password showTaglist");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var page = Number(req.params.page);
        res.cookie('dirPassword' + req.params.name + 'SortName', req.params.sortName);
        res.cookie('dirPassword' + req.params.name + 'SortType', req.params.sortType);
        pwTagTool.parentQuery(req.params.name, req.params.sortName, req.params.sortType, page, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/parent/password/query/:id/:single?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password parent query");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        var sortName = 'name';
        var sortType = 'desc';
        if (req.cookies.passwordSortName === 'name' || req.cookies.passwordSortName === 'mtime') {
            sortName = req.cookies.passwordSortName;
        }
        if (req.cookies.passwordSortType === 'desc' || req.cookies.passwordSortType === 'asc') {
            sortType = req.cookies.passwordSortType;
        }
        pwTagTool.queryParentTag(id, req.params.single, sortName, sortType, req.user, req.session, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            var itemList = getPasswordItem(req.user, result.items);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
        });
    });
});

app.delete('/api/parent/password/del/:id', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password parentDel");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        pwTagTool.delParent(id, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.post('/api/bookmark/password/add', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password addbookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        pwTagTool.addBookmark(name, req.user, req.session, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json(result);
        });
    });
});

app.get('/api/bookmark/password/getList/:sortName(name|mtime)/:sortType(desc|asc)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password get bookmark list");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.cookie('bookmarkPasswordSortName', req.params.sortName);
        res.cookie('bookmarkPasswordSortType', req.params.sortType);
        pwTagTool.getBookmarkList(req.params.sortName, req.params.sortType, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({bookmarkList: result.bookmarkList});
        });
    });
});

app.delete('/api/bookmark/password/del/:id', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("del password bookmark");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.id, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "bookmark is not vaild"}, next, res);
        }
        pwTagTool.delBookmark(id, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({id: result.id});
        });
    });
});

app.post('/api/password/newRow', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("new password");
        console.log(new Date());
        console.log(req.url);
        pwTool.newRow(req.body, req.user, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'password', data: result.id});
            res.json({id: result.id});
        });
    });
});

app.put('/api/password/editRow/:uid', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("edit row");
        console.log(new Date());
        console.log(req.url);
        pwTool.editRow(req.params.uid, req.body, req.user, next, function(err){
            if(err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'password', data: req.params.uid});
            res.json({apiOK: true});
        });
    });
});

app.put('/api/password/getPW/:uid/:type?', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get password");
        console.log(new Date());
        console.log(req.url);
        pwTool.getPassword(req.params.uid, req.params.type, req.body.userPW, req.user, req.session, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({password: result.password});
        });
    });
});

app.put('/api/password/delRow/:uid', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("del row");
        console.log(new Date());
        console.log(req.url);
        //console.log(req.body);
        pwTool.delRow(req.params.uid, req.body.userPW, req.user, next, function(err){
            if(err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'password', data: req.params.uid});
            res.json({apiOK: true});
        });
    });
});

app.get('/api/password/generate/:type(\\d)', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("generate password");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.json({password: pwTool.generatePW(Number(req.params.type))});
    });
});

app.get('/api/getUser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get user');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var nav = [];
        var level = 0;
        if (util.checkAdmin(1, req.user)) {
            level = 2;
            nav = [{title: "Stock", hash: "/Stock", css: "fa fa-fw fa-line-chart"}];
        } else if (util.checkAdmin(2, req.user)) {
            level = 1;
        }
        var isAdult = false;
        if (util.checkAdmin(2 ,req.user)) {
            isAdult = true;
        }
        res.json({id: req.user.username, ws_url: 'wss://' + config_glb.extent_ip + ':' + config_glb.ws_port, level: level, nav: nav, main_url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.extent_file_port});
    });
});

app.get('/subtitle/:uid/:index(\\d+|v)?/:fresh(0+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var url = 'https://' + config_glb.extent_file_ip + ':' + config_glb.extent_file_port + '/subtitle/' + req.params.uid;
        if (req.params.index) {
            url = url + '/' + req.params.index;
        }
        var body = '302. Redirecting to ' + url;
        res.header('Content-Type', 'text/plain');
        // Respond
        res.statusCode = 302;
        res.header('Location', url);
        res.end(body);
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
        res.json({loginOK: true, id: req.user.username, url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.extent_file_port});
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

app.get('/views/Stock', function(req, res, next) {
    "use strict";
    console.log("views stock");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    if (util.checkAdmin(1, req.user)) {
         var stream = fs.createReadStream(viewsPath + '/Stock.html');
        stream.on('error', function(err){
            util.handleError(err, next, res);
        });
        stream.pipe(res);
    } else {
        res.send('permission denied');
    }
});

app.get('/views/Password', function(req, res, next) {
    "use strict";
    console.log("views stock");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var stream = fs.createReadStream(viewsPath + '/Password.html');
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
    var msg = "hello<br/> 壓縮檔加上.book或是cbr、cbz檔可以解壓縮，當作書本觀看<br/>如: xxx.book.zip , aaa.book.rar , bbb.book.7z<br/><br/>指令：<br/>>50: 搜尋大於編號50<br/>all item: 顯示子項目<br/>no local: 不顯示本地搜尋結果<br/>youtube (music) video: 顯示youtube vidoe搜尋結果<br/>youtube playlist: 顯示youtube playlist<br/>youtube music: 顯示youtube video搜尋結果<br/>youtube music playlist: 顯示youtube (music) playlist搜尋結果(可支援多字詞搜尋)<br/>kubo movie: 顯示kubo123電影搜尋結果<br/>kubo tv series: 顯示kubo123電視劇搜尋結果<br/>kubo tv show: 顯示kubo123電視秀搜尋結果<br/>kubo animation: 顯示kubo123動畫搜尋結果(可支援國家[台灣, 香港, 大陸, 日本, 韓國, 歐美, 泰國, 新馬, 印度, 海外]、年份、字詞搜尋)<br/>yify movie: 顯示yify電影搜尋結果(可支援劇情分類[動作, 冒險, 動畫, 傳記, 喜劇, 犯罪, 記錄, 劇情, 家庭, 奇幻, 黑色電影, 歷史, 恐怖, 音樂, 音樂劇, 神祕, 浪漫, 科幻, 運動, 驚悚, 戰爭, 西部]、字詞搜尋)<br/>cartoonmad comic: 顯示cartoonmad漫畫搜尋結果(可支援劇情分類[動作, 奇幻, 犯罪, 運動, 恐怖, 歷史, 神秘, 冒險, 校園, 喜劇, 浪漫, 少男, 科幻, 香港, 其他]、字詞搜尋)<br/>comic99 comic: 顯示comic99漫畫搜尋結果(可支援劇情分類[萌系, 喜劇, 動作, 科幻, 劇情, 犯罪, 運動, 奇幻, 神秘, 校園, 驚悚, 廚藝, 偽娘, 圖片, 冒險, 小說, 香港, 耽美, 經典, 歐美, 日文, 家庭]、字詞搜尋)<br/>bilibili movie: 顯示bilibili電影搜尋結果<br/>bilibili animation: 顯示bilibili動畫搜尋結果(可支援國家[台灣, 香港, 大陸, 日本, 歐美, 韓國, 法國, 泰國, 西班牙, 俄羅斯, 德國, 海外, 完結]、年份、字詞搜尋)<br/><br/>增加bookmark物件：<br/>在儲存bookmark或訂閱youtube channel時產生，<br/>方便整理完的bookmark給其它人參考<br/><br/>指令不算在單項搜尋裡<br/>預設只會搜尋到有first item的檔案<br/>方便尋找，可以縮小範圍後再下all item顯示全部<br/><br/>播放器 快捷鍵:<br/>空白鍵: 播放/暫停<br/>c: 字幕 開/關<br/>f: 校準字幕，固定目前字幕，左右鍵變成移動0.5秒，再按一次 f 鍵發送校正<br/>左: 後退15秒<br/>右: 前進15秒<br/>上: 音量變大<br/>下: 音量變小<br/>影片跟音樂點擊 [選項] 有可開啟選項模式<br/>播放模式: 循環播放, 倒敘播放, 單首播放, 隨機播放(只有music)<br/><br/>URL上傳支援:<br/>Youtube<br/>Youtube music: url結尾加上 :music 會儲存成音樂<br/>Magnet (bit torrent url)<br/>Torrent<br/>Mega<br/>Kubo123<br/>YIFY<br/>CartoonMad<br/>Comic99<br/>Bilibili";
    var adult_msg = "<br/><br/>18+指令: <br/><br/>18+: 只顯示十八禁的檔案<br/>18-: 不顯示十八禁的檔案";
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

//default
app.get('*', function(req, res, next) {
    "use strict";
    console.log("index.html");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var stream_header = fs.createReadStream(viewsPath + '/' + config_type.dev_type + '-header.html');
    stream_header.on('error', function(err){
        util.handleError(err, next, res);
    });
    stream_header.pipe(res, { end: false });
    stream_header.on('close', function() {
        var stream = fs.createReadStream(viewsPath + '/index.html');
        stream.on('error', function(err){
            util.handleError(err, next, res);
        });
        stream.pipe(res);
    });
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: %s  %s', err.name, err.message);
    if (err.stack) {
        console.log(err.stack);
    }
});
var client = net.connect(config_glb.com_port, config_glb.file_ip,
    function() { //'connect' listener
    console.log('connected to server!');
});
/*client.on('data', function(data) {
    console.log(data.toString());
});*/
client.on('end', function() {
    console.log('disconnected from server');
});
function sendWs(data, adultonly, auth) {
    var ad = 0, au = 0;
    if (adultonly) {
        ad = 1;
    }
    if (auth) {
        au = 1;
    }
    var sendData = JSON.stringify({send: 'web 1', data: data, adultonly: ad, auth: au});
    client.write(sendData);
}

server.listen(config_glb.port, config_glb.ip);

function checkLogin(req, res, next, callback) {
    if(!req.isAuthenticated()){
        if (util.isMobile(req.headers['user-agent']) || req.headers['user-agent'].match(/Firefox/i)) {
            if (/^\/video\//.test(req.path)) {
                console.log("mobile or firefox");
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

function getKuboItem(items) {
    var itemList = [];
    var data = null;
    var yd = null;
    for (var i in items) {
        yd = new Date(items[i].date);
        items[i].tags.push('first item');
        data = {name: items[i].name, id: 'kub_' + items[i].id, tags: items[i].tags, recycle: 0, isOwn: false, utime: yd.getTime()/1000, thumb: items[i].thumb, noDb: true, status: 3, count: items[i].count};
        itemList.push(data);
    }
    return itemList;
}

function getYifyItem(items) {
    var itemList = [];
    var data = null;
    var yd = null;
    for (var i in items) {
        yd = new Date(items[i].date);
        items[i].tags.push('first item');
        data = {name: items[i].name, id: 'yif_' + items[i].id, tags: items[i].tags, recycle: 0, isOwn: false, utime: yd.getTime()/1000, thumb: items[i].thumb, noDb: true, status: 3, count: items[i].rating};
        itemList.push(data);
    }
    return itemList;
}

function getMadItem(items) {
    var itemList = [];
    var data = null;
    for (var i in items) {
        items[i].tags.push('first item');
        data = {name: items[i].name, id: 'mad_' + items[i].id, tags: items[i].tags, recycle: 0, isOwn: false, utime: 0, thumb: items[i].thumb, noDb: true, status: 2, count: 0};
        itemList.push(data);
    }
    return itemList;
}

function getC99Item(items) {
    var itemList = [];
    var data = null;
    for (var i in items) {
        items[i].tags.push('first item');
        data = {name: items[i].name, id: 'c99_' + items[i].id, tags: items[i].tags, recycle: 0, isOwn: false, utime: 0, thumb: items[i].thumb, noDb: true, status: 2, count: 0};
        itemList.push(data);
    }
    return itemList;
}

function getBiliItem(items) {
    var itemList = [];
    var data = null;
    for (var i in items) {
        items[i].tags.push('first item');
        data = {name: items[i].name, id: 'bbl_' + items[i].id, tags: items[i].tags, recycle: 0, isOwn: false, utime: items[i].date, thumb: items[i].thumb, noDb: true, status: 3, count: items[i].count};
        itemList.push(data);
    }
    return itemList;
}

function getYoutubeItem(items, type) {
    var itemList = [];
    var yd = null;
    var data = null;
    for (var i in items) {
        if (items[i].snippet) {
            if (items[i].snippet.tags) {
                items[i].snippet.tags.push('first item');
            } else {
                items[i].snippet.tags = ['first item'];
            }
            yd = new Date(items[i].snippet.publishedAt.match(/^\d\d\d\d-\d\d-\d\d/)[0]);
            data = {name: items[i].snippet.title, id: 'you_' + items[i].id, tags: items[i].snippet.tags, recycle: 0, isOwn: false, utime: yd.getTime()/1000, thumb: items[i].snippet.thumbnails.default.url, cid: items[i].snippet.channelId, ctitle: items[i].snippet.channelTitle, noDb: true};
            if (items[i].statistics) {
                data['count'] = items[i].statistics.viewCount;
            } else {
                data['count'] = 301;
            }
            if (items[i].kind === 'youtube#playlist') {
                data['id'] = 'ypl_' + items[i].id;
                data['name'] = data['name'] + ' [playlist]';
                switch(Math.floor(type/10)) {
                    case 2:
                    data['status'] = 4;
                    break;
                    default:
                    data['status'] = 3;
                    break;
                }
            } else {
                switch(type%10) {
                    case 2:
                    data['status'] = 4;
                    break;
                    default:
                    data['status'] = 3;
                    break;
                }
            }
            itemList.push(data);
        }
    }
    return itemList;
}

function getStorageItem(user, items, mediaHandle) {
    var itemList = [];
    if (mediaHandle === 1) {
        if (util.checkAdmin(1, user)) {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18+');
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
                if (items[i].thumb) {
                    data.thumb = items[i].thumb;
                }
                if (items[i].cid) {
                    data.cid = items[i].cid;
                }
                if (items[i].ctitle) {
                    data.ctitle = items[i].ctitle;
                }
                if (!items[i].mediaType.type) {
                    data['media'] = {};
                    data['media']['type'] = '';
                    data['media']['key'] = '';
                    data['media']['err'] = '';
                    data['media']['timeout'] = '';
                    for (var j in items[i].mediaType) {
                        data['media']['type'] = data['media']['type'] + j + '.' + items[i].mediaType[j].type + ' ';
                        if (items[i].mediaType[j].key) {
                            data['media']['key'] = data['media']['key'] + j + '.' + items[i].mediaType[j].key + ' ';
                        }
                        if (items[i].mediaType[j].err) {
                            data['media']['err'] = data['media']['err'] + j + '.' + items[i].mediaType[j].err + ' ';
                        }
                        if (items[i].mediaType[j].timeout) {
                            data['media']['timeout'] = data['media']['timeout'] + j + '.' + items[i].mediaType[j].timeout + ' ';
                        }
                    }
                }
                itemList.push(data);
            }
        } else {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18+');
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
                if (items[i].thumb) {
                    data.thumb = items[i].thumb;
                }
                if (items[i].cid) {
                    data.cid = items[i].cid;
                }
                if (items[i].ctitle) {
                    data.ctitle = items[i].ctitle;
                }
                if (util.isValidString(items[i].owner, 'uid') && user._id.equals(items[i].owner)) {
                    data.isOwn = true;
                }
                if (!items[i].mediaType.type) {
                    data['media'] = {};
                    data['media']['type'] = '';
                    data['media']['key'] = '';
                    data['media']['err'] = '';
                    data['media']['timeout'] = '';
                    for (var j in items[i].mediaType) {
                        data['media']['type'] = data['media']['type'] + j + '.' + items[i].mediaType[j].type + ' ';
                        if (items[i].mediaType[j].key) {
                            data['media']['key'] = data['media']['key'] + j + '.' + items[i].mediaType[j].key + ' ';
                        }
                        if (items[i].mediaType[j].err) {
                            data['media']['err'] = data['media']['err'] + j + '.' + items[i].mediaType[j].err + ' ';
                        }
                        if (items[i].mediaType[j].timeout) {
                            data['media']['timeout'] = data['media']['timeout'] + j + '.' + items[i].mediaType[j].timeout + ' ';
                        }
                    }
                }
                itemList.push(data);
            }
        }
    } else {
        if (util.checkAdmin(1, user)) {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18+');
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
                if (items[i].thumb) {
                    data.thumb = items[i].thumb;
                }
                if (items[i].cid) {
                    data.cid = items[i].cid;
                }
                if (items[i].ctitle) {
                    data.ctitle = items[i].ctitle;
                }
                itemList.push(data);
            }
        } else {
            for (var i in items) {
                if (items[i].adultonly === 1) {
                    items[i].tags.push('18+');
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
                if (items[i].thumb) {
                    data.thumb = items[i].thumb;
                }
                if (items[i].cid) {
                    data.cid = items[i].cid;
                }
                if (items[i].ctitle) {
                    data.ctitle = items[i].ctitle;
                }
                if (util.isValidString(items[i].owner, 'uid') && user._id.equals(items[i].owner)) {
                    data.isOwn = true;
                }
                itemList.push(data);
            }
        }
    }
    return itemList;
}

function getStockItem(user, items) {
    var itemList = [];
    if (util.checkAdmin(1, user)) {
        for (var i in items) {
            if (items[i].important === 1) {
                items[i].tags.push('important');
            }
            var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, profit: items[i].profitIndex, safety: items[i].safetyIndex, management: items[i].managementIndex, index: items[i].index, type: items[i].type};
            itemList.push(data);
        }
    }
    return itemList;
}

function getPasswordItem(user, items) {
    var itemList = [];
    for (var i in items) {
        if (items[i].important === 1) {
            items[i].tags.push('important');
        }
        var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, username: items[i].username, url: items[i].url, email: items[i].email, utime: items[i].utime};
        if (items[i].important === 0) {
            data['important'] = false;
        } else {
            data['important'] = true;
        }
        itemList.push(data);
    }
    return itemList;
}

console.log('start express server\n');

console.log("Server running at https://" + config_glb.extent_ip + ":" + config_glb.extent_port + ' ' + new Date());
