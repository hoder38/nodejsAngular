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

var util = require("../util/utility.js");

var https = require('https'),
    privateKey  = fs.readFileSync(config_type.privateKey, 'utf8'),
    certificate = fs.readFileSync(config_type.certificate, 'utf8'),
    credentials = {key: privateKey, cert: certificate},
    express = require('express'),
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
    sessionStore = require("../models/session-tool.js")(express);

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.session(sessionStore.config));
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
    res.json({apiOK: true, url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.file_port});
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
            var tags = tagTool.searchTags(req.session);
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
            var name = util.isValidString(req.params.name, 'name');
            if (req.params.name.match(/^>\d+$/) || req.params.name.match(/^profit>\d+$/) || req.params.name.match(/^safety>-?\d+$/) || req.params.name.match(/^manag>\d+$/)) {
                name = req.params.name;
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
            console.log(result.items);
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

app.put('/api/stock/addTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        stockTagTool.addTag(req.params.uid, req.body.tag, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'stock', data: result.id}, 0, 1);
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

app.put('/api/stock/delTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("stock delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        stockTagTool.delTag(req.params.uid, req.body.tag, req.user, next, function (err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'stock', data: result.id}, 0, 1);
            res.json(result);
        });
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
        sql.nosql['status'] = type;
        mongo.orig("find", "storage", sql.nosql, sql.select, sql.options, function(err, items){
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
        var tags = tagTool.searchTags(req.session);
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
        if (type === 'url' || type === 'music') {
            res.json({apiOK: true});
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
        stockTool.getStockPER(id, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({per:result});
        });
    });
});

app.get('/api/stock/getYield/:uid', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock get yield');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        stockTool.getStockYield(id, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({yield:result});
        });
    });
});

app.get('/api/getRelativeTag/:tag', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get relative tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var tag = util.isValidString(req.params.tag, 'name');
        if (tag === false) {
            util.handleError({hoerror: 2, message: "tag is not vaild"}, next, res);
        }
        tagTool.getRelativeTag(tag, req.user, next, function(err, relative) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({relative: relative});
        });
    });
});

app.get('/api/stock/getRelativeTag/:tag', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get stock relative tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var tag = util.isValidString(req.params.tag, 'name');
        if (tag === false) {
            util.handleError({hoerror: 2, message: "tag is not vaild"}, next, res);
        }
        stockTagTool.getRelativeTag(tag, req.user, next, function(err, relative) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({relative: relative});
        });
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
            console.log(result.items);
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
            var name = util.isValidString(req.params.name, 'name');
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
            }
            tags.setSingleArray(name);
        }
        pwTagTool.tagQuery(page, req.params.name, exactly, req.params.index, req.params.sortName, req.params.sortType, req.user, req.session, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            console.log(result);
            var itemList = getPasswordItem(req.user, result.items);
            console.log(itemList);
            res.json({itemList: itemList, parentList: result.parentList, latest: result.latest, bookmarkID: result.bookmark});
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

app.get('/api/password/getRelativeTag/:tag', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get password relative tag');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var tag = util.isValidString(req.params.tag, 'name');
        if (tag === false) {
            util.handleError({hoerror: 2, message: "tag is not vaild"}, next, res);
        }
        pwTagTool.getRelativeTag(tag, req.user, next, function(err, relative) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({relative: relative});
        });
    });
});

app.put('/api/password/addTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password addTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        pwTagTool.addTag(req.params.uid, req.body.tag, req.user, next, function(err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'password', data: result.id}, 0, 1);
            res.json(result);
        });
    });
});

app.put('/api/password/delTag/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("password delTag");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        pwTagTool.delTag(req.params.uid, req.body.tag, req.user, next, function (err, result) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'password', data: result.id}, 0, 1);
            res.json(result);
        });
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
        //console.log(req.body);
        pwTool.newRow(req.body, req.user, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({id: result.id});
        });
    });
});

app.get('/api/password/getPW/:uid', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("get password");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        pwTool.getPassword(req.params.uid, req.user, next, function(err, result){
            if(err) {
                util.handleError(err, next, res);
            }
            res.json({password: result.password});
        });
    });
});

app.get('/api/getUser', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('get user');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var nav = [];
        var ws_url = 'wss://' + config_glb.extent_ip + ':' + config_glb.wsj_port;
        if (util.checkAdmin(1, req.user)) {
            ws_url = 'wss://' + config_glb.extent_ip + ':' + config_glb.wss_port;
            nav = [{title: "Stock", hash: "/Stock", css: "fa fa-fw fa-line-chart"}, {title: "Password", hash: "/Password", css: "fa fa-fw fa-key"}];
        } else if (util.checkAdmin(2, req.user)) {
            ws_url = 'wss://' + config_glb.extent_ip + ':' + config_glb.ws_port;
        }
        var isAdult = false;
        if (util.checkAdmin(2 ,req.user)) {
            isAdult = true;
        }
        res.json({id: req.user.username, ws_url: ws_url, isAdult: isAdult, nav: nav, file_url: 'http://' + config_glb.extent_file_ip + ':' + config_glb.file_http_port, main_url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.file_port});
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
        res.json({loginOK: true, id: req.user.username, url: 'https://' + config_glb.extent_file_ip + ':' + config_glb.file_port});
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
    if (util.checkAdmin(1, req.user)) {
         var stream = fs.createReadStream(viewsPath + '/Password.html');
        stream.on('error', function(err){
            util.handleError(err, next, res);
        });
        stream.pipe(res);
    } else {
        res.send('permission denied');
    }
});

app.get('/views/homepage', function(req, res, next) {
    "use strict";
    console.log("views homepage");
    console.log(new Date());
    console.log(req.url);
    console.log(req.body);
    var msg = "hello<br/> 壓縮檔加上.book或是cbr、cbz檔可以解壓縮，當作書本觀看<br/>如: xxx.book.zip , aaa.book.rar , bbb.book.7z<br/><br/>指令：<br/>>50: 搜尋大於編號50<br/>all item: 顯示子項目<br/><br/>指令不算在單項搜尋裡<br/>預設只會搜尋到有first item的檔案<br/>方便尋找，可以縮小範圍後再下all item顯示全部";
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

var client = net.connect({port: config_glb.com_port},
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
    var sendData = JSON.stringify({send: 'web 1', data: data, adultonly: adultonly, auth: auth});
    client.write(sendData);
}

server.listen(config_glb.port, config_glb.ip);

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
    if (util.checkAdmin(1, user)) {
        for (var i in items) {
            if (items[i].important === 1) {
                items[i].tags.push('important');
            }
            var data = {name: items[i].name, id: items[i]._id, tags: items[i].tags, username: items[i].username, url: items[i].url, email: items[i].email, utime: items[i].utime};
            itemList.push(data);
        }
    }
    return itemList;
}

console.log('start express server\n');

console.log("Server running at https://" + config_glb.extent_ip + ":" + config_glb.port + ' ' + new Date());
