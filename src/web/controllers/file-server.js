var fs = require("fs"),
    path = require('path');

if(!fs.existsSync(path.join(__dirname, "../../../ver.js"))) {
    throw new Error('can not find ver.js');
}

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var mongo = require("../models/mongo-tool.js");

var util = require("../util/utility.js");

var tagTool = require("../models/tag-tool.js")("storage");

var api = require("../models/api-tool.js");

var googleApi = require("../models/api-tool-google.js");

var stockTool = require("../models/stock-tool.js");

var mime = require('../util/mime.js');

var mediaHandleTool = require("../models/mediaHandle-tool.js")(sendWs);

var drive_interval = 3600000;

var stock_interval = 86400000;

var drive_batch = 100;

var http = require('http'),
    https = require('https'),
    net = require('net'),
    privateKey  = fs.readFileSync(config_type.privateKey, 'utf8'),
    certificate = fs.readFileSync(config_type.certificate, 'utf8'),
    credentials = {key: privateKey, cert: certificate, ciphers: [
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
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    WebSocketServer = require('ws').Server,
    app = express(),
    server = https.createServer(credentials, app),
    mkdirp = require('mkdirp'),
    //port = 443,
    serverHttp = http.createServer(app),
    //port = 80,
    encode = "utf8",
    sessionStore = require("../models/session-tool.js")(express);

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.session(sessionStore.config));
app.use(require('connect-multiparty')({ uploadDir: config_glb.nas_tmp }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    if (req.method === 'OPTIONS') {
        res.json({apiOK: true});
    } else {
        next();
    }
});

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
                fs.unlink(req.files.file.path, function(err) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    fs.readFile(filePath + '.' + ext, function (err,data) {
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
                mediaHandleTool.handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
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
                    var tags = tagTool.searchTags(req.session);
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
                        var relative_arr = [];
                        mediaTag.def.forEach(function (e) {
                            relative_arr.push(e);
                        });
                        mediaTag.opt.forEach(function (e) {
                            relative_arr.push(e);
                        });
                        var index = 0;
                        recur_relative();
                        function recur_relative() {
                            tagTool.getRelativeTag(relative_arr[index], req.user, mediaTag.opt, next, function(err, relative) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                index++;
                                mediaTag.opt = relative;
                                if (index < relative_arr.length) {
                                    recur_relative();
                                } else {
                                    res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                                    mediaHandleTool.handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        if(err) {
                                            util.handleError(err);
                                        }
                                        console.log('transcode done');
                                        console.log(new Date());
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
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
                mediaHandleTool.handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
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
                    var tags = tagTool.searchTags(req.session);
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
                        var relative_arr = [];
                        mediaTag.def.forEach(function (e) {
                            relative_arr.push(e);
                        });
                        mediaTag.opt.forEach(function (e) {
                            relative_arr.push(e);
                        });
                        var index = 0;
                        recur_relative();
                        function recur_relative() {
                            tagTool.getRelativeTag(relative_arr[index], req.user, mediaTag.opt, next, function(err, relative) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                index++;
                                mediaTag.opt = relative;
                                if (index < relative_arr.length) {
                                    recur_relative();
                                } else {
                                    res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                                    mediaHandleTool.handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        if(err) {
                                            util.handleError(err);
                                        }
                                        console.log('transcode done');
                                        console.log(new Date());
                                    });
                                }
                            });
                        }
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
        mediaHandleTool.handleTag('', data, url_name, '', 7, function(err, mediaType, mediaTag, DBdata) {
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
            var tags = tagTool.searchTags(req.session);
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
                var relative_arr = [];
                mediaTag.def.forEach(function (e) {
                    relative_arr.push(e);
                });
                mediaTag.opt.forEach(function (e) {
                    relative_arr.push(e);
                });
                var index = 0;
                recur_relative();
                function recur_relative() {
                    tagTool.getRelativeTag(relative_arr[index], req.user, mediaTag.opt, next, function(err, relative) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        index++;
                        mediaTag.opt = relative;
                        if (index < relative_arr.length) {
                            recur_relative();
                        } else {
                            res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        }
                    });
                }
            });
        });
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
            tagTool.setLatest('', items[0]._id, req.session, function(err) {
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
                /*tagTool.setLatest('image', items[0]._id, req.session, function(err) {
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
                        tagTool.setLatest(saveType, items[0]._id, req.session, function(err) {
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
                    console.log(filePath);
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
                tagTool.setLatest(saveType, items[0]._id, req.session, function(err) {
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
                    util.deleteFolderRecursive(filePath + '_doc');
                    util.deleteFolderRecursive(filePath + '_img');
                    util.deleteFolderRecursive(filePath + '_present');
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

app.put('/api/editFile/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log("editFile");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        mediaHandleTool.editFile(req.params.uid, req.body.name, req.user, next, function(err, result) {
            if(err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'file', data: result.id}, result.adultonly);
            delete result.adultonly;
            res.json(result);
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
                    mediaHandleTool.handleMediaUpload(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].size, req.user, function (err) {
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
                        mediaHandleTool.handleMedia(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].mediaType.key, req.user, function (err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            util.handleError(err);
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    } else {
                        mediaHandleTool.handleMediaUpload(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].size, req.user, function (err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            util.handleError(err);
                            console.log('transcode done');
                            console.log(new Date());
                        });
                    }
                    break;
                case 'del':
                    res.json({apiOK: true});
                    mediaHandleTool.completeMedia(items[0]._id, 0, function (err) {
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

/*
app.get('/api/stock/query/:index', function(req, res,next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('stock query');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        if (!util.checkAdmin(1 ,req.user)) {
            util.handleError({hoerror: 2, message: "permission denied"}, next, res);
        }
        var index = req.params.index.match(/^\d+$/);
        if (index) {
            stockTool.getSingleStock('twse', index[0], function(err, result) {
                if (err) {
                    util.handleError(err, next, res);
                }
                sendWs({type: 'stock', data: result.id}, 0, 1);
                res.json(result);
            }, 1);
        } else {
            util.handleError({hoerror: 2, message: "invalid stock index"}, next, res);
        }
    });
});*/

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

var server0 = net.createServer(function(c) { //'connection' listener
    console.log('client connected');
    c.on('end', function() {
        console.log('client disconnected');
    });
    c.on('data', function(data) {
        var recvData = JSON.parse(data.toString());
        console.log('websocket: ' + recvData.send);
        sendWs(recvData.data, recvData.adultonly, recvData.auth);
    });
}).listen(config_glb.com_port);

/*var server1 = https.createServer(credentials, function (req, res) {
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
});*/

var wsServer = new WebSocketServer({
    server: server
});

/*var wsjServer = new WebSocketServer({
    server: server3
});*/

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
    if (auth && adultonly) {
        data.level = 2;
    } else if (adultonly) {
        data.level = 1;
    } else {
        data.level = 0;
    }
    var sendData = JSON.stringify(data);
    wsServer.clients.forEach(function each(client) {
        client.send(sendData);
    });
    /*
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
    }*/
}

/*wssServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});*/

wsServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});

/*wsjServer.on('connection', function(ws) {
    ws.on('message', onWsConnMessage);
    ws.on('close', onWsConnClose);
});*/

server.listen(config_glb.file_port, config_glb.file_ip);

serverHttp.listen(config_glb.file_http_port, config_glb.file_ip);

if (config_glb.updateStock) {
    loopUpdateStock();
}

if (config_glb.autoUpload) {
    loopDrive();
}

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

//user_id是改不是owner的時候用
function getFeedback(item, callback, user) {
    var filePath = util.getFileLocation(item.owner, item._id);
    mediaHandleTool.handleTag(filePath, {time: item.time, height: item.height}, item.name, '', item.status, function(err, mediaType, mediaTag, DBdata) {
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
        var relative_arr = [];
        item.tags.forEach(function (e) {
            relative_arr.push(e);
        });
        temp_tag.forEach(function (e) {
            relative_arr.push(e);
        });
        var index = 0;
        recur_relative();
        function recur_relative() {
            tagTool.getRelativeTag(relative_arr[index], user, temp_tag, callback, function(err, relative) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                index++;
                temp_tag = relative;
                if (index < relative_arr.length) {
                    recur_relative();
                } else {
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
                }
            });
        }
    });
}

function loopUpdateStock(error, countdown) {
    console.log('loopUpdateStock');
    console.log(new Date());
    if (error) {
        util.handleError(error);
    }
    if (!countdown) {
        countdown = 120000;
    }
    console.log(countdown);
    setTimeout(function() {
        var day = new Date().getDate();
        if (day === config_type.updateStockDate[0]) {
            console.log('update stock');
            stockTool.getStockList('twse', function(err, stocklist){
                if(err) {
                    util.handleError(err);
                    loopUpdateStock(null, stock_interval);
                } else {
                    if (stocklist.length < 1) {
                        console.log('empty stock list');
                        loopUpdateStock(null, stock_interval);
                    } else {
                        updateStock('twse', stocklist, 0, loopUpdateStock);
                    }
                }
            });
        } else if (config_type.updateStockDate.indexOf(day) !== -1) {
            console.log('update important stock');
            mongo.orig("find", "stock", {important: 1}, function(err, items){
                if(err) {
                    util.handleError(err);
                    loopUpdateStock(null, stock_interval);
                } else {
                    var stocklist = [];
                    for (var i in items) {
                        stocklist.push(items[i].index);
                    }
                    if (stocklist.length < 1) {
                        console.log('empty stock list');
                        loopUpdateStock(null, stock_interval);
                    } else {
                        updateStock('twse', stocklist, 0, loopUpdateStock);
                    }
                }
            });
        }
    }, countdown);
}

function updateStock(type, stocklist, index, callback) {
    console.log('updateStock');
    console.log(new Date());
    console.log(stocklist[index]);
    stockTool.getSingleStock(type, stocklist[index], function(err) {
        if (err) {
            util.handleError(err, callback, callback, stock_interval);
        }
        index++;
        if (index < stocklist.length) {
            updateStock(type, stocklist, index, callback);
        } else {
            setTimeout(function(){
                callback(null, stock_interval);
            }, 0);
        }
    }, config_type.updateStockMode);
}

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
                    if (metadataList.length > (drive_batch - file_count)) {
                        metadataList.splice(drive_batch - file_count);
                    }
                    if (uploaded) {
                        mediaHandleTool.singleDrive(metadataList, 0, userlist[index], data['folderId'], uploaded, dirpath, function(err) {
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
                            mediaHandleTool.singleDrive(metadataList, 0, userlist[index], data['folderId'], uploaded, dirpath, function(err) {
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

console.log('start express server\n');

console.log("Server running at https://" + config_glb.extent_file_ip + ":" + config_glb.extent_file_port + ' ' + new Date());

console.log("Server running at http://" + config_glb.extent_file_ip + ":" + config_glb.extent_file_http_port + ' ' + new Date());