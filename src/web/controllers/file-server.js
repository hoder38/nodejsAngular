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

var externalTool = require('../models/external-tool.js');

var external_interval = 172800000;

var external_time = 0;

var drive_interval = 3600000;

var drive_size = 500 * 1024 * 1024;

var drive_time = {time: 0, size: 0};

var stock_interval = 86400000;

var stock_time = 0;

var stock_batch_list = [];

var drive_batch = 100;

var torrent_pool = [];

var https = require('https'),
    net = require('net'),
    child_process = require('child_process'),
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
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    WebSocketServer = require('ws').Server,
    openSubtitle = require('opensubtitles-api'),
    oth = require('os-torrent-hash'),
    app = express(),
    youtubedl = require('youtube-dl'),
    server = https.createServer(credentials, app),
    mkdirp = require('mkdirp'),
    readline = require('readline'),
    sessionStore = require("../models/session-tool.js")(express_session);

var torrentStream = require('torrent-stream');
var avconv = require('avconv');

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express_session(sessionStore.config));
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

app.post('/upload/subtitle/:uid/:index(\\d+)?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('upload subtitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.files);
        if (req.files.file.size > (10 * 1024 * 1024)) {
            util.handleError({hoerror: 2, message: "size too large!!!"}, next, res);
        }
        var fileIndex = 0;
        var ext = mime.isSub(req.files.file.name);
        if (!ext) {
            util.handleError({hoerror: 2, message: "not valid subtitle!!!"}, next, res);
        }
        var filePath = null;
        var id = req.params.uid.match(/^you_/);
        if (id) {
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "youtube is not vaild"}, next, res);
            }
            filePath = util.getFileLocation('youtube', id);
            var folderPath = path.dirname(filePath);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, next, res);
                    }
                    if (fs.existsSync(filePath + '.srt')) {
                        fs.renameSync(filePath + '.srt', filePath + '.srt1');
                    }
                    if (fs.existsSync(filePath + '.ass')) {
                        fs.renameSync(filePath + '.ass', filePath + '.ass1');
                    }
                    if (fs.existsSync(filePath + '.ssa')) {
                        fs.renameSync(filePath + '.ssa', filePath + '.ssa1');
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
                if (fs.existsSync(filePath + '.srt')) {
                    fs.renameSync(filePath + '.srt', filePath + '.srt1');
                }
                if (fs.existsSync(filePath + '.ass')) {
                    fs.renameSync(filePath + '.ass', filePath + '.ass1');
                }
                if (fs.existsSync(filePath + '.ssa')) {
                    fs.renameSync(filePath + '.ssa', filePath + '.ssa1');
                }
                var stream = fs.createReadStream(req.files.file.path);
                stream.on('error', function(err){
                    console.log('save file error!!!');
                    util.handleError(err, next, res);
                });
                stream.on('close', SRT2VTT);
                stream.pipe(fs.createWriteStream(filePath + '.' + ext));
            }
        } else {
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
                filePath = util.getFileLocation(items[0].owner, items[0]._id);
                if (items[0].status === 9 && req.params.index) {
                    fileIndex = Number(req.params.index);
                    filePath = filePath + '/' + fileIndex;
                }
                var folderPath = path.dirname(filePath);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        if (fs.existsSync(filePath + '.srt')) {
                            fs.renameSync(filePath + '.srt', filePath + '.srt1');
                        }
                        if (fs.existsSync(filePath + '.ass')) {
                            fs.renameSync(filePath + '.ass', filePath + '.ass1');
                        }
                        if (fs.existsSync(filePath + '.ssa')) {
                            fs.renameSync(filePath + '.ssa', filePath + '.ssa1');
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
                    if (fs.existsSync(filePath + '.srt')) {
                        fs.renameSync(filePath + '.srt', filePath + '.srt1');
                    }
                    if (fs.existsSync(filePath + '.ass')) {
                        fs.renameSync(filePath + '.ass', filePath + '.ass1');
                    }
                    if (fs.existsSync(filePath + '.ssa')) {
                        fs.renameSync(filePath + '.ssa', filePath + '.ssa1');
                    }
                    var stream = fs.createReadStream(req.files.file.path);
                    stream.on('error', function(err){
                        console.log('save file error!!!');
                        util.handleError(err, next, res);
                    });
                    stream.on('close', SRT2VTT);
                    stream.pipe(fs.createWriteStream(filePath + '.' + ext));
                }
            });
        }
        function SRT2VTT() {
            fs.unlink(req.files.file.path, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                util.SRT2VTT(filePath, ext, function(err) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    res.json({apiOK: true});
                });
            });
        }
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
                        var is_d = false;
                        for (var i in parentList.cur) {
                            normal = tagTool.normalizeTag(parentList.cur[i]);
                            is_d = tagTool.isDefaultTag(normal);
                            if (!is_d) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    mediaTag.def.push(normal);
                                }
                            } else {
                                if (is_d.index === 0) {
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
                                    var temp_arr = [];
                                    var normal = '';
                                    for (var j in mediaTag.opt) {
                                        normal = tagTool.normalizeTag(mediaTag.opt[j]);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (mediaTag.def.indexOf(normal) === -1) {
                                                temp_arr.push(normal);
                                            }
                                        }
                                    }
                                    mediaTag.opt = temp_arr;
                                    if (util.checkAdmin(2 ,req.user)) {
                                        if (item[0].adultonly === 1) {
                                            mediaTag.def.push('18+');
                                        } else {
                                            mediaTag.opt.push('18+');
                                        }
                                    }
                                    if (item[0].first === 1) {
                                        mediaTag.def.push('first item');
                                    } else {
                                        mediaTag.opt.push('first item');
                                    }
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
        var is_media = 0;
        var encodeTorrent = url;
        url = decodeURIComponent(url);
        var shortTorrent = url.match(/^magnet:[^&]+/);
        if (shortTorrent) {
            folderPath = filePath;
        }
        if (!fs.existsSync(folderPath)) {
            mkdirp(folderPath, function(err) {
                if(err) {
                    console.log(filePath);
                    util.handleError(err, next, res);
                }
                if (shortTorrent) {
                    shortTorrent = shortTorrent[0];
                    if (shortTorrent === 'magnet:stop') {
                        queueTorrent('stop', req.user);
                        res.json({stop: true});
                    } else {
                        mongo.orig("find", "storage", {magnet: encodeTorrent}, {limit: 1}, function(err, items){
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            if (items.length === 0) {
                                var realPath = folderPath + '/real';
                                var engine = torrentStream(url, {tmp: config_glb.nas_tmp, path: realPath, connections: 100, uploads: 5});
                                var playList = [];
                                var tag_arr = ['torrent', 'playlist'];
                                var opt_arr = [];
                                var mediaType = null, mediaTag = null;
                                engine.on('ready', function() {
                                    engine.files.forEach(function(file) {
                                        //if (file.name.match(/\.mp4$/i) || file.name.match(/\.mkv$/i)) {
                                        playList.push(file.path);
                                        console.log(file.name);
                                        mediaType = mime.mediaType(file.name);
                                            if (mediaType) {
                                            mediaTag = mime.mediaTag(mediaType['type']);
                                            for (var i in mediaTag.def) {
                                                if (tag_arr.indexOf(mediaTag.def[i]) === -1) {
                                                    tag_arr.push(mediaTag.def[i]);
                                                }
                                            }
                                            for (var i in mediaTag.opt) {
                                                if (tag_arr.indexOf(mediaTag.opt[i]) === -1 && opt_arr.indexOf(mediaTag.opt[i]) === -1) {
                                                    opt_arr.push(mediaTag.opt[i]);
                                                }
                                            }
                                        }
                                        //}
                                    });
                                    //insert
                                    if (playList.length <= 0) {
                                        engine.destroy();
                                        util.handleError({hoerror: 2, message: "empty content!!!"}, next, res);
                                    }
                                    var filename = 'Playlist torrent ';
                                    if (engine.torrent.name) {
                                        filename = 'Playlist ' + engine.torrent.name;
                                    }
                                    engine.destroy();
                                    streamClose(filename, tag_arr, opt_arr, encodeTorrent, playList);
                                });
                            } else {
                                util.handleError({hoerror: 2, message: "already has one"}, next, res);
                            }
                        });
                    }
                } else if (url.match(/^(https|http):\/\/(www\.youtube\.com|youtu\.be)\//)) {
                    var is_music = url.match(/^(.*):music$/);
                    if (is_music) {
                        is_media = 4;
                        console.log('youtube music');
                        googleApi.googleDownloadYoutube(is_music[1], filePath, function(err, filename, tag_arr) {
                            if (err) {
                                sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                                util.handleError(err, next, res);
                            }
                            streamClose(filename, tag_arr);
                        }, true);
                    } else {
                        is_media = 3;
                        console.log('youtube');
                        googleApi.googleDownloadYoutube(url, filePath, function(err, filename, tag_arr) {
                            if (err) {
                                sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, item[0].adultonly);
                                util.handleError(err, next, res);
                            }
                            streamClose(filename, tag_arr);
                        });
                    }
                } else {
                    api.xuiteDownload(url, filePath, function(err, pathname, filename) {
                        if (err) {
                            sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                            util.handleError(err, next, res);
                        }
                        if (!filename) {
                            filename = path.basename(pathname);
                        }
                        streamClose(filename, []);
                    });
                }
            });
        } else {
            if (shortTorrent) {
                shortTorrent = shortTorrent[0];
                mongo.orig("find", "storage", {magnet: encodeTorrent}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length === 0) {
                        var realPath = folderPath + '/real';
                        var engine = torrentStream(url, {tmp: config_glb.nas_tmp, path: realPath, connections: 100, uploads: 5});
                        var playList = [];
                        var tag_arr = ['torrent', 'playlist'];
                        var opt_arr = [];
                        var mediaType = null, mediaTag = null;
                        engine.on('ready', function() {
                            engine.files.forEach(function(file) {
                                //if (file.name.match(/\.mp4$/i) || file.name.match(/\.mkv$/i)) {
                                playList.push(file.path);
                                console.log(file.name);
                                mediaType = mime.mediaType(file.name);
                                if (mediaType) {
                                    mediaTag = mime.mediaTag(mediaType['type']);
                                    for (var i in mediaTag.def) {
                                        if (tag_arr.indexOf(mediaTag.def[i]) === -1) {
                                            tag_arr.push(mediaTag.def[i]);
                                        }
                                    }
                                    for (var i in mediaTag.opt) {
                                        if (tag_arr.indexOf(mediaTag.opt[i]) === -1 && opt_arr.indexOf(mediaTag.opt[i]) === -1) {
                                            opt_arr.push(mediaTag.opt[i]);
                                        }
                                    }
                                }
                                //}
                            });
                            //insert
                            if (playList.length <= 0) {
                                engine.destroy();
                                util.handleError({hoerror: 2, message: "empty content!!!"}, next, res);
                            }
                            var filename = 'Playlist torrent ';
                            if (engine.torrent.name) {
                                filename = 'Playlist ' + engine.torrent.name;
                            }
                            engine.destroy();
                            streamClose(filename, tag_arr, opt_arr, encodeTorrent, playList);
                        });
                    } else {
                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                    }
                });
            } else if (url.match(/^(https|http):\/\/(www\.youtube\.com|youtu\.be)\//)) {
                var is_music = url.match(/^(.*):music$/);
                if (is_music) {
                    is_media = 4;
                    console.log('youtube music');
                    googleApi.googleDownloadYoutube(is_music[1], filePath, function(err, filename, tag_arr) {
                        if (err) {
                            sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                            util.handleError(err, next, res);
                        }
                        streamClose(filename, tag_arr);
                    }, true);
                } else {
                    is_media = 3;
                    console.log('youtube');
                    googleApi.googleDownloadYoutube(url, filePath, function(err, filename, tag_arr) {
                        if (err) {
                            sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                            util.handleError(err, next, res);
                        }
                        streamClose(filename, tag_arr);
                    });
                }
            } else {
                api.xuiteDownload(url, filePath, function(err, pathname, filename) {
                    if (err) {
                        sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                        util.handleError(err, next, res);
                    }
                    if (!filename) {
                        filename = path.basename(pathname);
                    }
                    streamClose(filename, []);
                });
            }
        }
        function streamClose(filename, tag_arr, opt_arr, magnet, playlist){
            var name = util.toValidName(filename);
            if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                name = mime.addPost(name, '1');
            }
            var utime = Math.round(new Date().getTime() / 1000);
            var oUser_id = req.user._id;
            var data = {};
            data['_id'] = oOID;
            data['name'] = name;
            data['owner'] = oUser_id;
            data['utime'] = utime;
            var stats = fs.statSync(filePath);
            if (stats.isFile()) {
                data['size'] = stats["size"];
            } else {
                data['size'] = 0;
            }
            data['count'] = 0;
            data['recycle'] = 0;
            if (util.checkAdmin(2 ,req.user) && Number(req.params.type) === 1) {
                data['adultonly'] = 1;
            } else {
                data['adultonly'] = 0;
            }
            data['untag'] = 1;
            data['first'] = 1;
            if (magnet) {
                data['status'] = 9;//media type
            } else {
                data['status'] = 0;//media type
            }
            mediaHandleTool.handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                if (err) {
                    sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                    util.handleError(err, next, res);
                }
                if (is_media) {
                    DBdata['status'] = is_media;
                    delete DBdata['mediaType'];
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
                if (tag_arr) {
                    var is_d = false;
                    for (var i in tag_arr) {
                        normal = tagTool.normalizeTag(tag_arr[i]);
                        is_d = tagTool.isDefaultTag(normal);
                        if (!is_d) {
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                        } else {
                            if (is_d.index === 0) {
                                DBdata['adultonly'] = 1;
                            }
                        }
                    }
                }
                if (opt_arr) {
                    var is_d = false;
                    for (var i in opt_arr) {
                        normal = tagTool.normalizeTag(opt_arr[i]);
                        is_d = tagTool.isDefaultTag(normal);
                        if (!is_d) {
                            if (mediaTag.def.indexOf(normal) === -1 && mediaTag.opt.indexOf(normal) === -1) {
                                mediaTag.opt.push(normal);
                            }
                        }
                    }
                }
                var tags = tagTool.searchTags(req.session);
                if (tags) {
                    var parentList = tags.getArray();
                    var is_d = false;
                    for (var i in parentList.cur) {
                        normal = tagTool.normalizeTag(parentList.cur[i]);
                        is_d = tagTool.isDefaultTag(normal);
                        if (!is_d) {
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                        } else {
                            if (is_d.index === 0) {
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
                if (magnet) {
                    DBdata['magnet'] = magnet;
                }
                if (playlist) {
                    DBdata['playList'] = playlist;
                }
                mongo.orig("insert", "storage", DBdata, function(err, item){
                    if(err) {
                        sendWs({type: req.user.username, data: 'upload fail: ' + err.message}, 0);
                        util.handleError(err, next, res);
                    }
                    console.log(item);
                    console.log('save end');
                    sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                    sendWs({type: req.user.username, data: name + ' upload complete'}, item[0].adultonly);
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
                                var temp_tag = [];
                                var normal = '';
                                for (var j in mediaTag.opt) {
                                    normal = tagTool.normalizeTag(mediaTag.opt[j]);
                                    if (!tagTool.isDefaultTag(normal)) {
                                        if (mediaTag.def.indexOf(normal) === -1) {
                                            temp_tag.push(normal);
                                        }
                                    }
                                }
                                mediaTag.opt = temp_tag;
                                if (util.checkAdmin(2 ,req.user)) {
                                    if (item[0].adultonly === 1) {
                                        mediaTag.def.push('18+');
                                    } else {
                                        mediaTag.opt.push('18+');
                                    }
                                }
                                if (item[0].first === 1) {
                                    mediaTag.def.push('first item');
                                } else {
                                    mediaTag.opt.push('first item');
                                }
                                res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                                if (!is_media) {
                                    mediaHandleTool.handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], req.user, function(err) {
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        if(err) {
                                            util.handleError(err);
                                        }
                                        console.log('transcode done');
                                        console.log(new Date());
                                    });
                                }
                            }
                        });
                    }
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
                var is_d = false;
                for (var i in parentList.cur) {
                    normal = tagTool.normalizeTag(parentList.cur[i]);
                    is_d = tagTool.isDefaultTag(normal);
                    if (!is_d) {
                        if (mediaTag.def.indexOf(normal) === -1) {
                            mediaTag.def.push(normal);
                        }
                    } else {
                        if (is_d.index === 0) {
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
                            var temp_tag = [];
                            var normal = '';
                            for (var j in mediaTag.opt) {
                                normal = tagTool.normalizeTag(mediaTag.opt[j]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        temp_tag.push(normal);
                                    }
                                }
                            }
                            mediaTag.opt = temp_tag;
                            if (util.checkAdmin(2 ,req.user)) {
                                if (item[0].adultonly === 1) {
                                    mediaTag.def.push('18+');
                                } else {
                                    mediaTag.opt.push('18+');
                                }
                            }
                            if (item[0].first === 1) {
                                mediaTag.def.push('first item');
                            } else {
                                mediaTag.opt.push('first item');
                            }
                            res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        }
                    });
                }
            });
        });
    });
});

app.get('/api/subtitle/fix/:uid/:adjust/:index(\\d+)?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle fix');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var fileIndex = 0;
        if (!req.params.adjust.match(/^\-?\d+(\.\d+)?$/)) {
            util.handleError({hoerror: 2, message: "adjust time is not vaild"}, next, res);
        }
        var filePath = null;
        var adjust = Number(req.params.adjust);
        function fixSub() {
            if (!fs.existsSync(filePath + '.vtt')) {
                util.handleError({hoerror: 2, message: "do not have subtitle!!!"}, next, res);
            }
            var rl = readline.createInterface({
                input: fs.createReadStream(filePath + '.vtt'),
                terminal: false
            });
            var time_match = false;
            var stime = 0;
            var etime = 0;
            adjust = adjust * 1000;
            var atime = '';
            var temp = 0;
            var write_data = '';
            rl.on('line', function (line) {
                time_match = line.match(/^(\d\d):(\d\d):(\d\d)\.(\d\d\d) --> (\d\d):(\d\d):(\d\d)\.(\d\d\d)$/);
                if (time_match) {
                    //console.log('Line from file:', line);
                    stime = Number(time_match[1]) * 3600000 + Number(time_match[2]) * 60000 + Number(time_match[3]) * 1000 + Number(time_match[4]);
                    etime = Number(time_match[5]) * 3600000 + Number(time_match[6]) * 60000 + Number(time_match[7]) * 1000 + Number(time_match[8]);
                    stime = stime + adjust;
                    if (stime < 0) {
                        stime = 0;
                    }
                    etime = etime + adjust;
                    if (etime < 0) {
                        etime = 0;
                    }
                    temp = Math.floor(stime/3600000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    stime = stime % 3600000;
                    atime = temp + ':';
                    temp = Math.floor(stime/60000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    stime = stime % 60000;
                    atime = atime + temp + ':';
                    temp = Math.floor(stime/1000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    stime = stime % 1000;
                    if (stime < 10) {
                        stime = '00' + stime;
                    } else if (stime < 100) {
                        stime = '0' + stime;
                    }
                    atime = atime + temp + '.' + stime + ' --> ';
                    temp = Math.floor(etime/3600000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    etime = etime % 3600000;
                    atime = atime + temp + ':';
                    temp = Math.floor(etime/60000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    etime = etime % 60000;
                    atime = atime + temp + ':';
                    temp = Math.floor(etime/1000);
                    if (temp < 10) {
                        temp = '0' + temp;
                    }
                    etime = etime % 1000;
                    if (etime < 10) {
                        etime = '00' + etime;
                    } else if (etime < 100) {
                        etime = '0' + etime;
                    }
                    atime = atime + temp + '.' + etime;
                    //console.log(atime);
                    write_data = write_data + atime + "\r\n";
                } else {
                    write_data = write_data + line + "\r\n";
                }
            }).on('close', function() {
                //console.log(write_data);
                fs.writeFile(filePath + '.vtt', write_data, 'utf8', function (err) {
                    if (err) {
                        console.log(filePath + '.vtt');
                        util.handleError(err, next, res);
                    }
                    res.json({apiOK: true});
                });
            });
        }
        var id = req.params.uid.match(/^you_/);
        if (id) {
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "youtube is not vaild"}, next, res);
            }
            filePath = util.getFileLocation('youtube', id);
            fixSub();
        } else {
            id = util.isValidString(req.params.uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
            }
            mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length <= 0) {
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                if (items[0].status !== 3 && items[0].status !== 9) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                if (req.params.index) {
                    fileIndex = Number(req.params.index);
                }
                if (items[0].status === 9 && !items[0]['playList'][fileIndex].match(/\.mp4$/i) && !items[0]['playList'][fileIndex].match(/\.mkv$/i)) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                filePath = util.getFileLocation(items[0].owner, items[0]._id);
                if (items[0].status === 9) {
                    filePath = filePath + '/' + fileIndex;
                }
                fixSub();
            });
        }
    });
});

//youtube url
app.get('/api/external/getSingle/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('external getSingle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.uid.match(/^(you|dym)_(.*)/);
        if (!id) {
            util.handleError({hoerror: 2, message: "file is not youtube video!!!"}, next, res);
        }
        var url = null;
        if (id[1] === 'dym') {
            url = 'http://www.dailymotion.com/embed/video/' + id[2];
        } else {
            url = 'http://www.youtube.com/watch?v=' + id[2];
        }
        youtubedl.getInfo(url, [], function(err, info) {
            if (err) {
                err.hoerror = 2;
                util.handleError(err, next, res);
            }
            var ret_obj = {title: info.title, video: []};
            var audio_size = 0;
            if (id[1] === 'you') {
                for (var i in info.formats) {
                    if (info.formats[i].format_note === 'DASH audio') {
                        if (!audio_size) {
                            audio_size = info.formats[i].filesize;
                            ret_obj['audio'] = info.formats[i].url;
                        } else if (audio_size > info.formats[i].filesize) {
                            audio_size = info.formats[i].filesize;
                            ret_obj['audio'] = info.formats[i].url;
                        }
                    } else if (info.formats[i].format_note !== 'DASH video' && (info.formats[i].ext === 'mp4' || info.formats[i].ext === 'webm')) {
                        ret_obj['video'].splice(0, 0, info.formats[i].url);
                    }
                }
            } else if (id[1] === 'dym') {
                for (var i in info.formats) {
                    if (info.formats[i].format_id.match(/^\d+$/) && (info.formats[i].ext === 'mp4' || info.formats[i].ext === 'webm')) {
                        ret_obj['video'].splice(0, 0, info.formats[i].url);
                    }
                }
            }
            res.json(ret_obj);
        });
    });
});

app.get('/api/external/getSubtitle/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('external getSingle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.uid.match(/^(you|dym)_(.*)/);
        if (!id) {
            util.handleError({hoerror: 2, message: "file is not youtube video!!!"}, next, res);
        }
        var url = null;
        var filePath = null;
        var id_valid = util.isValidString(req.params.uid, 'name');
        if (id_valid === false) {
            util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
        }
        if (id[1] === 'dym') {
            url = 'http://www.dailymotion.com/embed/video/' + id[2];
            filePath = util.getFileLocation('dailymotion', id_valid);
        } else {
            url = 'http://www.youtube.com/watch?v=' + id[2];
            filePath = util.getFileLocation('youtube', id_valid);
        }
        googleApi.googleDownloadSubtitle(url, filePath, function(err) {
            if (err) {
                util.handleError(err, next, res);
            }
            res.json({apiOK: true});
        });
    });
});

app.post('/api/subtitle/search/:uid/:index(\\d+)?', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle search');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var name = util.isValidString(req.body.name, 'name');
        if (name === false) {
            util.handleError({hoerror: 2, message: "name is not vaild"}, next, res);
        }
        var episode_match = false;
        if(req.body.episode) {
            episode_match = req.body.episode.match(/^(s(\d*))?(e)?(\d+)$/i);
        }
        var episode = 0;
        var season = 0;
        var episode_1 = null;
        var episode_2 = null;
        var episode_3 = null;
        var episode_4 = null;
        if (episode_match) {
            if (!episode_match[1] && !episode_match[3]) {
                episode = Number(episode_match[4]);
                season = 1;
            } else if (!episode_match[1]){
                episode = Number(episode_match[4]);
                season = 1;
            } else if (!episode_match[3]){
                episode = 1;
                season = Number(episode_match[2] + episode_match[4]);
            } else if (episode_match[2] === ''){
                episode = Number(episode_match[4]);
                season = 1;
            } else {
                episode = Number(episode_match[4]);
                season = Number(episode_match[2]);
            }
            if (episode < 10) {
                if (season < 10) {
                    episode_1 = ' s0' + season + 'e0' + episode;
                    episode_2 = ' s' + season + 'e0' + episode;
                    episode_3 = ' s0' + season;
                    episode_4 = ' s' + season;
                } else {
                    episode_1 = ' s' + season + 'e0' + episode;
                    episode_2 = ' s' + season;
                }
            } else {
                if (season < 10) {
                    episode_1 = ' s0' + season + 'e' + episode;
                    episode_2 = ' s' + season + 'e' + episode;
                    episode_3 = ' s0' + season;
                    episode_4 = ' s' + season;
                } else {
                    episode_1 = ' s' + season + 'e' + episode;
                    episode_2 = ' s' + season;
                }
            }
        }
        var filePath = null;
        var id = req.params.uid.match(/^you_/);
        if (id) {
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "youtube is not vaild"}, next, res);
            }
            filePath = util.getFileLocation('youtube', id);
            searchSub();
        } else {
            id = util.isValidString(req.params.uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
            }
            var fileIndex = 0;
            mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length <= 0) {
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                if (items[0].status !== 3 && items[0].status !== 9) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                if (req.params.index) {
                    fileIndex = Number(req.params.index);
                }
                if (items[0].status === 9 && !items[0]['playList'][fileIndex].match(/\.mp4$/i) && !items[0]['playList'][fileIndex].match(/\.mkv$/i)) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                filePath = util.getFileLocation(items[0].owner, items[0]._id);
                if (items[0].status === 9) {
                    filePath = filePath + '/' + fileIndex;
                }
                searchSub();
            });
        }
        function searchSub() {
            var search = {extensions: 'srt'};
            if (name.match(/^tt\d+$/i)) {
                search.imdbid = name;
                if (episode) {
                    search.episode = episode;
                    search.season = season;
                }
                var OpenSubtitles = new openSubtitle('hoder agent v0.1');
                /*OpenSubtitles.search({
                    //extensions: ['srt', 'vtt'],
                    extensions: 'srt',
                    sublanguageid: 'chi',
                    //hash: '500bcd4c30be3195',
                    //filesize: '3437197194'
                    //imdbid: 'tt1638355'
                    //query: 'game of thrones s05e10'*/
                OpenSubtitles.search(search).then(function (subtitles) {
                    var sub_url = null;
                    console.log(subtitles);
                    if (subtitles.ze) {
                        sub_url = subtitles.ze.url;
                    } else if (subtitles.zt) {
                        sub_url = subtitles.zt.url;
                    } else if (subtitles.zh) {
                        sub_url = subtitles.zh.url;
                    }
                    if (sub_url) {
                        SUB2VTT(sub_url, filePath, false, function(err) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            res.json({apiOK: true});
                        });
                    } else {
                        util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                    }
                }).catch(function(err) {
                    console.log(err);
                    res.send("open subtitle error!!!", 400);
                });
            } else {
                if (episode_1) {
                    subHd(name + episode_1, function(err, subtitles) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (subtitles) {
                            unzipSubHd(subtitles.url, function(err) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                res.json({apiOK: true});
                            });
                        } else {
                            subHd(name + episode_2, function(err, subtitles) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                if (subtitles) {
                                    unzipSubHd(subtitles.url, function(err) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        res.json({apiOK: true});
                                    });
                                } else {
                                    if (episode_3) {
                                        subHd(name + episode_3, function(err, subtitles) {
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (subtitles) {
                                                unzipSubHd(subtitles.url, function(err) {
                                                    if (err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    res.json({apiOK: true});
                                                });
                                            } else {
                                                subHd(name + episode_4, function(err, subtitles) {
                                                    if (err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    if (subtitles) {
                                                        unzipSubHd(subtitles.url, function(err) {
                                                        if (err) {
                                                                util.handleError(err, next, res);
                                                            }
                                                            res.json({apiOK: true});
                                                        });
                                                    } else {
                                                        if (season === 1) {
                                                            subHd(name, function(err, subtitles) {
                                                                if (err) {
                                                                    util.handleError(err, next, res);
                                                                }
                                                                if (subtitles) {
                                                                    unzipSubHd(subtitles.url, function(err) {
                                                                        if (err) {
                                                                            util.handleError(err, next, res);
                                                                        }
                                                                        res.json({apiOK: true});
                                                                    });
                                                                } else {
                                                                    util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                                                                }
                                                            });
                                                        } else {
                                                            util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        if (season === 1) {
                                            subHd(name, function(err, subtitles) {
                                                if (err) {
                                                    util.handleError(err, next, res);
                                                }
                                                if (subtitles) {
                                                    unzipSubHd(subtitles.url, function(err) {
                                                        if (err) {
                                                            util.handleError(err, next, res);
                                                        }
                                                        res.json({apiOK: true});
                                                    });
                                                } else {
                                                    util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                                                }
                                            });
                                        } else {
                                            util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    subHd(name, function(err, subtitles) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (subtitles) {
                            unzipSubHd(subtitles.url, function(err) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                res.json({apiOK: true});
                            });
                        } else {
                            util.handleError({hoerror: 2, message: "cannot find subtitle!!!"}, next, res);
                        }
                    });
                }
            }
        }
        function unzipSubHd(url, callback) {
            var zip_ext = mime.isZip(url);
            if (!zip_ext) {
                util.handleError({hoerror: 2, message: "is not zip!!!"}, next, callback);
            }
            var sub_location = filePath + '_sub';
            var sub_temp_location = sub_location + '/0';
            var sub_zip_location = sub_location + '/0.' + zip_ext;
            if (!fs.existsSync(sub_location)) {
                mkdirp(sub_location, function(err) {
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    for (var i = 0; i < 10; i++) {
                        sub_temp_location = sub_location + '/' + i;
                        if (!fs.existsSync(sub_temp_location)) {
                            break;
                        }
                    }
                    if (i >= 10) {
                        util.handleError({hoerror: 2, message: "too many sub!!!"}, next, callback);
                    }
                    sub_zip_location = sub_location + '/' + i + '.' + zip_ext;
                    api.xuiteDownload(url, sub_zip_location, function(err) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        var cmdline = path.join(__dirname, "../util/myuzip.py") + ' ' + sub_zip_location + ' ' + sub_temp_location;
                        if (zip_ext === 'rar' || zip_ext === 'cbr') {
                            cmdline = 'unrar x ' + sub_zip_location + ' ' + sub_temp_location;
                        } else if (zip_ext === '7z') {
                            cmdline = '7za x ' + sub_zip_location + ' -o' + sub_temp_location;
                        }
                        mkdirp(sub_temp_location, function(err) {
                            if(err) {
                                util.handleError(err, next, callback);
                            }
                            child_process.exec(cmdline, function (err, output) {
                                if (err) {
                                    console.log(cmdline);
                                    util.handleError(err, next, callback);
                                }
                                var choose = null;
                                var pri_choose = 9;
                                var pri_choose_temp = 8;
                                var pri_match = false;
                                var pri_choose_arr = ['big5', 'cht', '繁體', '繁体', 'gb', 'chs', '簡體', '简体'];
                                var curPath = null;
                                var episode_pattern = new RegExp('(第0*' + episode + '集|ep?0*' + episode + ')', 'i');
                                var episode_choose = null;
                                var episode_pri_choose = 9;
                                var episode_pri_choose_temp = 8;

                                recur_dir(sub_temp_location);
                                function recur_dir(dir) {
                                    fs.readdirSync(dir).forEach(function(file,index){
                                        curPath = dir + '/' + file;
                                        if(fs.lstatSync(curPath).isDirectory()) {
                                            recur_dir(curPath);
                                        } else {
                                            if (mime.isSub(file)) {
                                                if (episode && file.match(episode_pattern)) {
                                                    pri_match = file.match(/(big5|cht|繁體|繁体|gb|chs|簡體|简体)/);
                                                    if (pri_match) {
                                                        episode_pri_choose_temp = pri_choose_arr.indexOf(pri_match[1]);
                                                    }
                                                    if (episode_pri_choose > episode_pri_choose_temp) {
                                                        episode_pri_choose = episode_pri_choose_temp;
                                                        episode_choose = curPath;
                                                    }
                                                }
                                                pri_match = file.match(/(big5|cht|繁體|繁体|gb|chs|簡體|简体)/);
                                                if (pri_match) {
                                                    pri_choose_temp = pri_choose_arr.indexOf(pri_match[1]);
                                                }
                                                if (pri_choose > pri_choose_temp) {
                                                    pri_choose = pri_choose_temp;
                                                    choose = curPath;
                                                }
                                            }
                                        }
                                    });
                                }
                                if (episode_choose) {
                                    choose = episode_choose;
                                }
                                console.log('choose');
                                console.log(choose);
                                SUB2VTT(choose, filePath, true, function(err) {
                                    if (err) {
                                        util.handleError(err, next, callback);
                                    }
                                    util.deleteFolderRecursive(sub_temp_location);
                                    fs.unlink(sub_zip_location, function(err) {
                                        if (err) {
                                            util.handleError(err, next, callback);
                                        }
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                for (var i = 0; i < 10; i++) {
                    sub_temp_location = sub_location + '/' + i;
                    if (!fs.existsSync(sub_temp_location)) {
                        break;
                    }
                }
                if (i >= 10) {
                    util.handleError({hoerror: 2, message: "too many sub!!!"}, next, callback);
                }
                sub_zip_location = sub_location + '/' + i + '.' + zip_ext;
                api.xuiteDownload(url, sub_zip_location, function(err) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    var cmdline = path.join(__dirname, "../util/myuzip.py") + ' ' + sub_zip_location + ' ' + sub_temp_location;
                    if (zip_ext === 'rar' || zip_ext === 'cbr') {
                        cmdline = 'unrar x ' + sub_zip_location + ' ' + sub_temp_location;
                    } else if (zip_ext === '7z') {
                        cmdline = '7za x ' + sub_zip_location + ' -o' + sub_temp_location;
                    }
                    mkdirp(sub_temp_location, function(err) {
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        child_process.exec(cmdline, function (err, output) {
                            if (err) {
                                console.log(cmdline);
                                util.handleError(err, next, callback);
                            }
                            var choose = null;
                            var pri_choose = 9;
                            var pri_choose_temp = 8;
                            var pri_match = false;
                            var pri_choose_arr = ['big5', 'cht', '繁體', '繁体', 'gb', 'chs', '簡體', '简体'];
                            var curPath = null;
                            var episode_pattern = new RegExp('(第0*' + episode + '集|ep?0*' + episode + ')', 'i');
                            var episode_choose = null;
                            var episode_pri_choose = 9;
                            var episode_pri_choose_temp = 8;

                            recur_dir(sub_temp_location);
                            function recur_dir(dir) {
                                fs.readdirSync(dir).forEach(function(file,index){
                                    curPath = dir + '/' + file;
                                    if(fs.lstatSync(curPath).isDirectory()) {
                                        recur_dir(curPath);
                                    } else {
                                        if (mime.isSub(file)) {
                                            if (episode && file.match(episode_pattern)) {
                                                pri_match = file.match(/(big5|cht|繁體|繁体|gb|chs|簡體|简体)/);
                                                if (pri_match) {
                                                    episode_pri_choose_temp = pri_choose_arr.indexOf(pri_match[1]);
                                                }
                                                if (episode_pri_choose > episode_pri_choose_temp) {
                                                    episode_pri_choose = episode_pri_choose_temp;
                                                    episode_choose = curPath;
                                                }
                                            }
                                            pri_match = file.match(/(big5|cht|繁體|繁体|gb|chs|簡體|简体)/);
                                            if (pri_match) {
                                                pri_choose_temp = pri_choose_arr.indexOf(pri_match[1]);
                                            }
                                            if (pri_choose > pri_choose_temp) {
                                                pri_choose = pri_choose_temp;
                                                choose = curPath;
                                            }
                                        }
                                    }
                                });
                            }
                            if (episode_choose) {
                                choose = episode_choose;
                            }
                            console.log('choose');
                            console.log(choose);
                            SUB2VTT(choose, filePath, true, function(err) {
                                if (err) {
                                    util.handleError(err, next, callback);
                                }
                                util.deleteFolderRecursive(sub_temp_location);
                                fs.unlink(sub_zip_location, function(err) {
                                    if (err) {
                                        util.handleError(err, next, callback);
                                    }
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                });
                            });
                        });
                    });
                });
            }
        }
        function subHd(str, callback) {
            console.log(str);
            api.xuiteDownload('http://subhd.com/search/' + encodeURIComponent(str) , '', function(err, data) {
                if (err) {
                    util.handleError(err, next, callback);
                }
                var big_item = data.match(/pull\-left lb\_l\">([\s\S]+?)<\/div>/);
                if (big_item) {
                    var big_item = big_item[1].match(/\/d\/(\d+)/);
                    if (big_item) {
                        api.xuiteDownload('http://subhd.com/d/' + big_item[1], '', function(err, Ddata) {
                            if (err) {
                                util.handleError(err, next, callback);
                            }
                            if (episode) {
                                var episode_match = new RegExp('第 ' + episode + ' 集[\\s\\S]+?dt_edition"><a href="/a/(\\d+)');
                                var sub_item = Ddata.match(episode_match);
                                if (sub_item) {
                                    api.getSubHdUrl(sub_item[1], function(err, subtitles) {
                                        if (err) {
                                            util.handleError(err, next, callback);
                                        }
                                        setTimeout(function(){
                                            callback(null, subtitles);
                                        }, 0);
                                    });
                                } else {
                                    sub_item = Ddata.match(/合集[\s\S]+?dt_edition\"><a href=\"\/a\/(\d+)/);
                                    if (sub_item) {
                                        api.getSubHdUrl(sub_item[1], function(err, subtitles) {
                                            if (err) {
                                                util.handleError(err, next, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null, subtitles);
                                            }, 0);
                                        });
                                    } else {
                                        sub_item = Ddata.match(/dt_edition\"><a href=\"\/a\/(\d+)/);
                                        if (sub_item) {
                                            api.getSubHdUrl(sub_item[1], function(err, subtitles) {
                                                if (err) {
                                                    util.handleError(err, next, callback);
                                                }
                                                setTimeout(function(){
                                                    callback(null, subtitles);
                                                }, 0);
                                            });
                                        } else {
                                            console.log(Ddata);
                                            util.handleError({hoerror: 2, message: "sub data error!!!"}, next, callback);
                                        }
                                    }
                                }
                            } else {
                                var sub_item = Ddata.match(/dt_edition\"><a href=\"\/a\/(\d+)/);
                                if (sub_item) {
                                    api.getSubHdUrl(sub_item[1], function(err, subtitles) {
                                        if (err) {
                                            util.handleError(err, next, callback);
                                        }
                                        setTimeout(function(){
                                            callback(null, subtitles);
                                        }, 0);
                                    });
                                } else {
                                    console.log(Ddata);
                                    util.handleError({hoerror: 2, message: "sub data error!!!"}, next, callback);
                                }
                            }
                        }, null, false, false);
                    } else {
                        console.log('no big');
                        var sub_item = data.match(/pull\-left lb\_r\">[\s\S]+?<a href=\"\/a\/(\d+)/);
                        if (sub_item) {
                            api.getSubHdUrl(sub_item[1], function(err, subtitles) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                setTimeout(function(){
                                    callback(null, subtitles);
                                }, 0);
                            });
                        } else {
                            console.log(data);
                            util.handleError({hoerror: 2, message: "sub data error!!!"}, next, callback);
                        }
                    }
                } else {
                    if (data.match(/暂时没有/)) {
                        console.log('no subtitle');
                        setTimeout(function(){
                            callback(null, null);
                        }, 0);
                    } else {
                        console.log(data);
                        util.handleError({hoerror: 2, message: "sub data error!!!"}, next, callback);
                    }
                }
            }, null, false, false);
        }
        function SUB2VTT(choose_subtitle, subPath, is_file, callback) {
            var ext = mime.isSub(choose_subtitle);
            if (!ext) {
                util.handleError({hoerror: 2, message: "is not sub!!!"}, next, callback);
            }
            if (fs.existsSync(subPath + '.srt')) {
                fs.renameSync(subPath + '.srt', subPath + '.srt1');
            }
            if (fs.existsSync(subPath + '.ass')) {
                fs.renameSync(subPath + '.ass', subPath + '.ass1');
            }
            if (fs.existsSync(subPath + '.ssa')) {
                fs.renameSync(subPath + '.ssa', subPath + '.ssa1');
            }
            if (is_file) {
                fs.rename(choose_subtitle, subPath + '.' + ext, function(err) {
                    if (err) {
                        util.handleError(err, next, callback);
                    }
                    util.SRT2VTT(subPath, ext, function(err) {
                        if (err) {
                            util.handleError(err, next, callback);
                        }
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            } else {
                api.xuiteDownload(choose_subtitle, subPath + '.' + ext, function(err) {
                    if (err) {
                        util.handleError(err, next, callback);
                    }
                    util.SRT2VTT(subPath, ext, function(err) {
                        if (err) {
                            util.handleError(err, next, callback);
                        }
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                }, null, false);
            }
        }
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

app.get('/api/torrent/check/:uid/:index(\\d+)/:size(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent check");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);

        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        var fileIndex = Number(req.params.index);
        var bufferSize = Number(req.params.size);
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'torrent can not be fund!!!'}, next, res);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            var bufferPath = filePath + '/' + fileIndex;
            var comPath = bufferPath + '_complete';
            //var playPath = bufferPath + '_temp';
            var errPath = bufferPath + '_error';
            if (fs.existsSync(errPath)) {
                util.handleError({hoerror: 2, message: 'torrent video error!!!'}, next, res);
            }
            var newBuffer = false;
            //var torrent = decodeURIComponent(items[0]['magnet']);
            //var shortTorrent = torrent.match(/^[^&]+/)[0];
            if (fs.existsSync(comPath)) {
                var total = fs.statSync(comPath).size;
                if (total > bufferSize) {
                    newBuffer = true;
                }
                res.json({newBuffer: newBuffer, complete: true, ret_size: total});
            } else if (fs.existsSync(bufferPath)) {
                var total = fs.statSync(bufferPath).size;
                console.log(total);
                if (total > bufferSize + 10 * 1024 * 1024) {
                    newBuffer = true;
                }
                res.json({newBuffer: newBuffer, complete: false, ret_size: total});
                //if (util.checkAdmin(1, req.user)) {
                    queueTorrent('add', req.user, decodeURIComponent(items[0]['magnet']), fileIndex, items[0]._id, items[0].owner);
                //}
            } else {
                if (items[0]['playList'][fileIndex].match(/\.mp4$/i) || items[0]['playList'][fileIndex].match(/\.mkv$/i)) {
                    //if (util.checkAdmin(1, req.user)) {
                        res.json({start: true});
                        queueTorrent('add', req.user, decodeURIComponent(items[0]['magnet']), fileIndex, items[0]._id, items[0].owner);
                    /*} else {
                        util.handleError({hoerror: 2, message: 'no permission to download!!!'}, next, res);
                    }*/
                } else {
                    util.handleError({hoerror: 2, message: 'torrent file cannot preview!!!'}, next, res);
                }
            }
        });
    });
});

function queueTorrent(action, user, torrent, fileIndex, id, owner) {
    var shortTorrent = null;
    var realPath = null;
    var bufferPath = null;
    var comPath = null;
    var engine = null;
    switch (action) {
        case 'add':
        console.log('torrent add');
        shortTorrent = torrent.match(/^[^&]+/)[0];
        var filePath = util.getFileLocation(owner, id);
        realPath = filePath + '/real';
        bufferPath = filePath + '/' + fileIndex;
        comPath = bufferPath + '_complete';
        var is_queue = false;
        for (var i in torrent_pool) {
            if (torrent_pool[i].hash === shortTorrent) {
                is_queue = true;
                if (util.checkAdmin(1, user)) {
                    torrent_pool[i].user = user;
                }
                if (torrent_pool[i].index.indexOf(fileIndex) === -1) {
                    torrent_pool[i].index.push(fileIndex);
                    if (torrent_pool[i].engine) {
                        engine = torrent_pool[i].engine;
                    }
                } else {
                    return;
                }
                break;
            }
        }
        if (engine){
            console.log('torrent go');
            if (engine.files && engine.files.length > 0) {
                startTorrent(fileIndex, bufferPath, comPath);
            } else {
                engine.on('ready', function() {
                    console.log('torrent ready');
                    startTorrent(fileIndex, bufferPath, comPath);
                });
            }
        } else {
            var runNum = 0;
            for (var i in torrent_pool) {
                if (torrent_pool[i].engine) {
                    runNum++;
                }
            }
            var is_run = false;
            if (runNum < config_glb.torrent_limit) {
                is_run = true;
            } else if (util.checkAdmin(1, user)) {
                runNum = 0;
                for (var i in torrent_pool) {
                    if (torrent_pool[i].engine && util.checkAdmin(1, torrent_pool[i].user)) {
                        runNum++;
                    }
                }
                if (runNum < config_glb.torrent_limit) {
                    is_run = true;
                }
            }
            if (is_run) {
                engine = torrentStream(torrent, {tmp: config_glb.nas_tmp, path: realPath, connections: 100, uploads: 5});
                console.log('new engine');
                if (!is_queue) {
                    console.log('torrent new');
                    torrent_pool.push({hash: shortTorrent, index: [fileIndex], engine: engine, user: user, time: Math.round(new Date().getTime() / 1000), fileId: id, fileOwner: owner, torrent: torrent});
                    engine.on('ready', function() {
                        console.log('torrent ready');
                        startTorrent(fileIndex, bufferPath, comPath);
                    });
                } else {
                    console.log('torrent old');
                    for (var i in torrent_pool) {
                        if (torrent_pool[i].hash === shortTorrent) {
                            torrent_pool[i].engine = engine;
                            for (var j in torrent_pool[i].index) {
                                fileIndex = torrent_pool[i].index[j];
                                console.log(fileIndex);
                                bufferPath = filePath + '/' + fileIndex;
                                comPath = bufferPath + '_complete';
                                if (engine){
                                    if (engine.files && engine.files.length > 0) {
                                        startTorrent(fileIndex, bufferPath, comPath);
                                    } else {
                                        engine.on('ready', function() {
                                            console.log('torrent ready');
                                            startTorrent(fileIndex, bufferPath, comPath);
                                        });
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                runNum = 0;
                for (var i in torrent_pool) {
                    if (torrent_pool[i].engine) {
                        runNum++;
                    }
                }
                if (runNum > config_glb.torrent_limit) {
                    var time = 0;
                    var out_shortTorrent = null;
                    for (var i in torrent_pool) {
                        if (torrent_pool[i].engine && !util.checkAdmin(1, torrent_pool[i].user)) {
                            if (time < torrent_pool[i].time) {
                                time = torrent_pool[i].time;
                                out_shortTorrent = torrent_pool[i].hash;
                            }
                        }
                    }
                    console.log('torrent kick');
                    console.log(time);
                    console.log(out_shortTorrent);
                    for (var i in torrent_pool) {
                        if (out_shortTorrent === torrent_pool[i].hash) {
                            if (torrent_pool[i].engine) {
                                torrent_pool[i].engine.destroy();
                                torrent_pool[i].engine = null;
                            }
                        }
                    }
                }
            } else {
                console.log('torrent wait');
                if (!is_queue) {
                    console.log('torrent new');
                    torrent_pool.push({hash: shortTorrent, index: [fileIndex], engine: null, user: user, time: Math.round(new Date().getTime() / 1000), fileId: id, fileOwner: owner, torrent: torrent});
                }
            }
        }
        break;
        case 'pop':
        console.log('torrent pop');
        var pri = 0;
        var time = 0;
        for (var i in torrent_pool) {
            if (!torrent_pool[i].engine) {
                if (util.checkAdmin(1, torrent_pool[i].user)) {
                    if (!pri) {
                        pri = 1;
                        time = torrent_pool[i].time;
                        shortTorrent = torrent_pool[i].hash;
                    } else if (time > torrent_pool[i].time) {
                        time = torrent_pool[i].time;
                        shortTorrent = torrent_pool[i].hash;
                    }
                } else {
                    if (!pri) {
                        if (!time) {
                            time = torrent_pool[i].time;
                            shortTorrent = torrent_pool[i].hash;
                        } else if (time > torrent_pool[i].time) {
                            time = torrent_pool[i].time;
                            shortTorrent = torrent_pool[i].hash;
                        }
                    }
                }
            }
        }
        console.log(pri);
        console.log(time);
        console.log(shortTorrent);
        var runNum = 0;
        for (var i in torrent_pool) {
            if (torrent_pool[i].engine) {
                runNum++;
            }
        }
        if (runNum < config_glb.torrent_limit) {
            for (var i in torrent_pool) {
                if (torrent_pool[i].hash === shortTorrent) {
                    torrent = torrent_pool[i].torrent;
                    var filePath = util.getFileLocation(torrent_pool[i].fileOwner, torrent_pool[i].fileId);
                    realPath = filePath + '/real';
                    engine = torrentStream(torrent, {tmp: config_glb.nas_tmp, path: realPath, connections: 100, uploads: 5});
                    console.log('new engine');
                    torrent_pool[i].engine = engine;
                    user = torrent_pool[i].user;
                    id = torrent_pool[i].fileId;
                    for (var j in torrent_pool[i].index) {
                        console.log(fileIndex);
                        fileIndex = torrent_pool[i].index[j];
                        bufferPath = filePath + '/' + fileIndex;
                        comPath = bufferPath + '_complete';
                        if (engine){
                            if (engine.files && engine.files.length > 0) {
                                startTorrent(fileIndex, bufferPath, comPath);
                            } else {
                                engine.on('ready', function() {
                                    console.log('torrent ready');
                                    startTorrent(fileIndex, bufferPath, comPath);
                                });
                            }
                        }
                    }
                    break;
                }
            }
            return true;
        } else {
            return false;
        }
        break;
        case 'stop':
        console.log('torrent stop');
        for (var i in torrent_pool) {
            if (user._id.equals(torrent_pool[i].user._id)) {
                console.log('engine stop');
                console.log(torrent_pool[i].hash);
                if (torrent_pool[i].engine) {
                    torrent_pool[i].engine.destroy();
                }
                for (var j in torrent_pool) {
                    if (torrent_pool[j].hash === torrent_pool[i].hash) {
                        torrent_pool.splice(j, 1);
                        break;
                    }
                }
            }
        }
        var is_solt = true;
        while(is_solt) {
            is_solt = queueTorrent('pop');
        }
        break;
        default:
        util.handleError({hoerror: 2, message: 'unknown torrent action!!!'});
    }
    function startTorrent(fileIndex, bufferPath, comPath) {
        mongo.orig("update", "storage", {_id: id}, {$set: {utime: Math.round(new Date().getTime() / 1000)}}, function(err, item2){
            if(err) {
                sendWs({type: user.username, data: 'buffer fail: ' + err.message}, 0);
                util.handleError(err);
            } else {
                if (fileIndex < 0 || fileIndex >= engine.files.length) {
                    sendWs({type: user.username, data: 'buffer fail: unknown index'}, 0);
                    util.handleError({hoerror: 2, message: 'unknown index'});
                    torrentComplete(10);
                } else {
                    var file = engine.files[fileIndex];
                    console.log(fileIndex);
                    console.log(file.name);
                    console.log(file.length);
                    if (file.name.match(/\.mp4$/i)) {
                        console.log('torrent real start');
                        if (fs.existsSync(bufferPath)) {
                            console.log(fs.statSync(bufferPath).size);
                            if (fs.statSync(bufferPath).size >= file.length) {
                                torrentComplete(1);
                            } else {
                                console.log(fs.statSync(bufferPath).size);
                                console.log(bufferPath);
                                var fileStream = file.createReadStream({start: fs.statSync(bufferPath).size});
                                fileStream.pipe(fs.createWriteStream(bufferPath, {flags: 'a'}));
                                fileStream.on('end', function() {
                                    torrentComplete(1);
                                });
                            }
                        } else {
                            console.log(bufferPath);
                            oth.computeHash(fileIndex, engine, function(err, hash_ret) {
                                if (err) {
                                    sendWs({type: user.username, data: 'buffer fail: ' + err.message}, 0);
                                    util.handleError(err);
                                    torrentComplete(10);
                                } else {
                                    console.log(hash_ret);
                                    //預設可撥
                                    var is_preview = true;
                                    var cProcess = avconv(['-i', realPath + '/' + file.path]);
                                    cProcess.once('exit', function(exitCode, signal, metadata2) {
                                        if (metadata2 && metadata2.input && metadata2.input.stream) {
                                            for (var i in metadata2.input.stream[0]) {
                                                console.log(metadata2.input.stream[0][i].type);
                                                console.log(metadata2.input.stream[0][i].codec);
                                                if (metadata2.input.stream[0][i].type === 'video' && metadata2.input.stream[0][i].codec !== 'h264') {
                                                    is_preview = false;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!is_preview) {
                                            sendWs({type: user.username, data: 'buffer fail: video codec is not h264'}, 0);
                                            util.handleError({hoerror: 2, message: 'video codec is not h264'});
                                            torrentComplete(10);
                                        } else {
                                            var OpenSubtitles = new openSubtitle('hoder agent v0.1');
                                            OpenSubtitles.search({
                                                extensions: 'srt',
                                                //sublanguageid: 'chi',
                                                hash: hash_ret.movieHash,
                                                filesize: hash_ret.fileSize
                                            }).then(function (subtitles) {
                                                var sub_url = null;
                                                console.log(subtitles);
                                                if (subtitles.ze) {
                                                    sub_url = subtitles.ze.url;
                                                } else if (subtitles.zt) {
                                                    sub_url = subtitles.zt.url;
                                                } else if (subtitles.zh) {
                                                    sub_url = subtitles.zh.url;
                                                }
                                                if (sub_url) {
                                                    if (fs.existsSync(bufferPath + '.srt')) {
                                                        fs.renameSync(bufferPath + '.srt', bufferPath + '.srt1');
                                                    }
                                                    if (fs.existsSync(bufferPath + '.ass')) {
                                                        fs.renameSync(bufferPath + '.ass', bufferPath + '.ass1');
                                                    }
                                                    if (fs.existsSync(bufferPath + '.ssa')) {
                                                        fs.renameSync(bufferPath + '.ssa', bufferPath + '.ssa1');
                                                    }
                                                    api.xuiteDownload(sub_url, bufferPath + '.srt', function(err) {
                                                        if (err) {
                                                            util.handleError(err);
                                                        } else {
                                                            util.SRT2VTT(bufferPath, 'srt', function(err) {
                                                                if (err) {
                                                                    util.handleError(err);
                                                                } else {
                                                                    console.log('sub end');
                                                                }
                                                            });
                                                        }
                                                    }, null, false);
                                                }
                                            }).catch(function (err) {
                                                util.handleError(err);
                                            });
                                            var fileStream = file.createReadStream();
                                            fileStream.pipe(fs.createWriteStream(bufferPath));
                                            fileStream.on('end', function() {
                                                torrentComplete(1);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    } else if (file.name.match(/\.mkv$/i)) {
                        console.log('torrent real start');
                        var tempPath = bufferPath + '_temp';
                        var time = 0;
                        var mkvBuffering = false;
                        if (fs.existsSync(tempPath)) {
                            fs.unlink(tempPath, function (err) {
                                if (err) {
                                    sendWs({type: user.username, data: 'buffer fail: ' + err.message}, 0);
                                    util.handleError(err);
                                    torrentComplete(10);
                                } else {
                                    var aProcess = avconv(['-i', '-', '-strict', 'experimental', '-c:a', 'aac', '-c:v', 'copy', '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', tempPath]);
                                    file.createReadStream().pipe(aProcess);
                                    aProcess.on('message', function(data) {
                                        mkv2buffer(data);
                                    });
                                    aProcess.once('exit', function(exitCode, signal, metadata1) {
                                        torrentComplete(2, tempPath);
                                    });
                                }
                            });
                        } else {
                            oth.computeHash(fileIndex, engine, function(err, hash_ret) {
                                if (err) {
                                    sendWs({type: user.username, data: 'buffer fail: ' + err.message}, 0);
                                    util.handleError(err);
                                    torrentComplete(10);
                                } else {
                                    console.log(hash_ret);
                                    //預設可撥
                                    var is_preview = true;
                                    var cProcess = avconv(['-i', realPath + '/' + file.path]);
                                    cProcess.once('exit', function(exitCode, signal, metadata2) {
                                        if (metadata2 && metadata2.input && metadata2.input.stream) {
                                            for (var i in metadata2.input.stream[0]) {
                                                console.log(metadata2.input.stream[0][i].type);
                                                console.log(metadata2.input.stream[0][i].codec);
                                                if (metadata2.input.stream[0][i].type === 'video' && metadata2.input.stream[0][i].codec !== 'h264') {
                                                    is_preview = false;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!is_preview) {
                                            sendWs({type: user.username, data: 'buffer fail: video codec is not h264'}, 0);
                                            util.handleError({hoerror: 2, message: 'video codec is not h264'});
                                            torrentComplete(10);
                                        } else {
                                            var OpenSubtitles = new openSubtitle('hoder agent v0.1');
                                            OpenSubtitles.search({
                                                extensions: 'srt',
                                                hash: hash_ret.movieHash,
                                                filesize: hash_ret.fileSize
                                            }).then(function (subtitles) {
                                                var sub_url = null;
                                                console.log(subtitles);
                                                if (subtitles.ze) {
                                                    sub_url = subtitles.ze.url;
                                                } else if (subtitles.zt) {
                                                    sub_url = subtitles.zt.url;
                                                } else if (subtitles.zh) {
                                                    sub_url = subtitles.zh.url;
                                                }
                                                if (sub_url) {
                                                    if (fs.existsSync(bufferPath + '.srt')) {
                                                        fs.renameSync(bufferPath + '.srt', bufferPath + '.srt1');
                                                    }
                                                    if (fs.existsSync(bufferPath + '.ass')) {
                                                        fs.renameSync(bufferPath + '.ass', bufferPath + '.ass1');
                                                    }
                                                    if (fs.existsSync(bufferPath + '.ssa')) {
                                                        fs.renameSync(bufferPath + '.ssa', bufferPath + '.ssa1');
                                                    }
                                                    api.xuiteDownload(sub_url, bufferPath + '.srt', function(err) {
                                                        if (err) {
                                                            util.handleError(err);
                                                        } else {
                                                            util.SRT2VTT(bufferPath, 'srt', function(err) {
                                                                if (err) {
                                                                    util.handleError(err);
                                                                } else {
                                                                    console.log('sub end');
                                                                }
                                                            });
                                                        }
                                                    }, null, false);
                                                }
                                            }).catch(function (err) {
                                                util.handleError(err);
                                            });
                                            var aProcess = avconv(['-i', '-', '-strict', 'experimental', '-c:a', 'aac', '-c:v', 'copy', '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', tempPath]);
                                            file.createReadStream().pipe(aProcess);
                                            aProcess.on('message', function(data) {
                                                mkv2buffer(data);
                                            });
                                            aProcess.once('exit', function(exitCode, signal, metadata1) {
                                                torrentComplete(2, tempPath);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        function mkv2buffer(data, end) {
                            if (!mkvBuffering) {
                                var parseTime = data.match(/ time=(\d+\.\d+) /);
                                if (parseTime) {
                                    var currentTime = Number(parseTime[1]);
                                    console.log(currentTime);
                                    if (currentTime > time + 300) {
                                        time = currentTime;
                                        console.log('start copy');
                                        var splicePath = null;
                                        for (var i = 0; i < 10; i++) {
                                            splicePath = bufferPath + '_' + i;
                                            if (!fs.existsSync(splicePath)) {
                                                break;
                                            }
                                        }
                                        if (i >= 10) {
                                            return;
                                        }
                                        mkvBuffering = true;
                                        var tProcess = avconv(['-i', tempPath, '-c', 'copy', '-f', 'mp4', splicePath]);
                                        tProcess.once('exit', function(exitCode, signal, metadata1) {
                                            fs.rename(splicePath, bufferPath, function(err) {
                                                mkvBuffering = false;
                                                if (err) {
                                                    util.handleError(err);
                                                    torrentComplete(3, tempPath);
                                                }
                                                //如果比compplete慢 砍掉自己
                                                if (fs.existsSync(bufferPath + '_complete')) {
                                                    fs.unlink(bufferPath, function(err) {
                                                        if (err) {
                                                            util.handleError(err);
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        sendWs({type: user.username, data: 'not previewable'}, 0);
                        util.handleError({hoerror: 2, message: 'not previewable'});
                        torrentComplete(10);
                    }
                }
            }
        });
        function torrentComplete(exitCode, exitPath) {
            console.log('torrentComplete');
            var comPath = bufferPath + '_complete';
            if (exitCode === 1) {
                fs.rename(bufferPath, comPath, function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                    //sendWs({type: 'torrent', data: {id: items[0]._id, index: fileIndex}}, 0, 0);
                    engine_del();
                });
            } else if (exitCode === 2) {
                console.log('complete copy');
                var splicePath = null;
                for (var i = 0; i < 10; i++) {
                    splicePath = bufferPath + '_' + i;
                    if (!fs.existsSync(splicePath)) {
                        break;
                    }
                }
                if (i >= 10) {
                    engine_del();
                }
                var tProcess = avconv(['-i', exitPath, '-c', 'copy', '-f', 'mp4', splicePath]);
                tProcess.once('exit', function(exitCode, signal, metadata1) {
                    fs.rename(splicePath, comPath, function() {
                        if (err) {
                            util.handleError(err);
                        }
                        fs.unlink(bufferPath, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            fs.unlink(exitPath, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                engine_del();
                            });
                        });
                    });
                });
            } else if (exitCode === 3) {
                if (!exitPath) {
                    exitPath = bufferPath;
                }
                fs.rename(exitPath, bufferPath + '_error', function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                    engine_del();
                });
            } else {
                engine_del();
            }
            function engine_del() {
                for (var i in torrent_pool) {
                    if (torrent_pool[i].hash === shortTorrent) {
                        var pindex = torrent_pool[i].index.indexOf(fileIndex);
                        if (pindex !== -1) {
                            torrent_pool[i].index.splice(pindex, 1);
                        }
                        if (torrent_pool[i].index.length <= 0) {
                            if (torrent_pool[i].engine) {
                                torrent_pool[i].engine.destroy();
                            }
                            torrent_pool.splice(i, 1);
                            queueTorrent('pop');
                        }
                        break;
                    }
                }
            }
        }
    }
}

app.get('/torrent/:index(\\d+)/:uid/:fresh(\\d+)?', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid'), fileIndex = Number(req.params.index);
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items){
            if (err) {
                util.handleError(err, next, res);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: 'torrent can not be fund!!!'}, next, res);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            var bufferPath = filePath + '/' + fileIndex;
            var comPath = bufferPath + '_complete';
            var errPath = bufferPath + '_error';
            if (fs.existsSync(comPath)) {
                var total = fs.statSync(comPath).size;
                console.log('complete');
                if (req.headers['range']) {
                    var range = req.headers.range;
                    var parts = range.replace(/bytes(=|: )/, "").split("-");
                    var partialstart = parts[0];
                    var partialend = parts[1];

                    var start = parseInt(partialstart, 10);
                    var end = partialend ? parseInt(partialend, 10) : total-1;
                    var chunksize = (end-start)+1;
                    //console.log(start);
                    //console.log(end);
                    //console.log(total);
                    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                    fs.createReadStream(comPath, {start: start, end: end}).pipe(res);
                } else {
                    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
                    fs.createReadStream(comPath).pipe(res);
                }
            } else {
                if (fs.existsSync(errPath)) {
                    util.handleError({hoerror: 2, message: 'video error!!!'}, next, res);
                }
                if (fs.existsSync(bufferPath)) {
                    console.log('play');
                    var total = fs.statSync(bufferPath).size;
                    if (req.headers['range']) {
                        var range = req.headers.range;
                        var parts = range.replace(/bytes(=|: )/, "").split("-");
                        var partialstart = parts[0];
                        var partialend = parts[1];

                        var start = parseInt(partialstart, 10);
                        var end = partialend ? parseInt(partialend, 10) : total-1;
                        var chunksize = (end-start)+1;
                        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(bufferPath, {start: start, end: end}).pipe(res);
                    } else {
                        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
                        fs.createReadStream(bufferPath).pipe(res);
                    }
                }
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
                        var parts = range.replace(/bytes(=|: )/, "").split("-");
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

app.get('/subtitle/:uid/:index(\\d+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.uid.match(/^(you|dym)_/);
        if (id) {
            var id_valid = util.isValidString(req.params.uid, 'name');
            if (id_valid === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            var filePath = null;
            if (id[1] === 'dym') {
                filePath = util.getFileLocation('dailymotion', id_valid);
            } else {
                filePath = util.getFileLocation('youtube', id_valid);
            }
            fs.exists(filePath + '.vtt', function (exists) {
                res.writeHead(200, { 'Content-Type': 'text/vtt' });
                if (!exists) {
                    var stream = fs.createReadStream('/home/pi/app/public/123.vtt').pipe(res);
                } else {
                    var stream = fs.createReadStream(filePath + '.vtt').pipe(res);
                }
            });
        } else {
            id = util.isValidString(req.params.uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
            }
            mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err,items){
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length <= 0) {
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                if (items[0].status !== 3 && items[0].status !== 9) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                if (items[0].status === 3) {
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    fs.exists(filePath + '.vtt', function (exists) {
                        res.writeHead(200, { 'Content-Type': 'text/vtt' });
                        if (!exists) {
                            var stream = fs.createReadStream('/home/pi/app/public/123.vtt').pipe(res);
                        } else {
                            var stream = fs.createReadStream(filePath + '.vtt').pipe(res);
                        }
                    });
                } else if (items[0].status === 9) {
                    var fileIndex = 0;
                    if (req.params.index) {
                        fileIndex = Number(req.params.index);
                    }
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    fs.exists(filePath + '/' + fileIndex + '.vtt', function (exists) {
                        res.writeHead(200, { 'Content-Type': 'text/vtt' });
                        if (!exists) {
                            var stream = fs.createReadStream('/home/pi/app/public/123.vtt').pipe(res);
                        } else {
                            var stream = fs.createReadStream(filePath + '/' + fileIndex + '.vtt').pipe(res);
                        }
                    });
                }
            });
        }
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
                if (items[0].status === 7 || items[0].status === 8) {
                    mongo.orig("remove", "storage", {_id: id, $isolated: 1}, function(err, item2){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        console.log('perm delete file');
                        sendWs({type: 'file', data: items[0]._id}, 1, 1);
                        res.json({apiOK: true});
                    });
                } else if (items[0].status === 9) {
                    util.deleteFolderRecursive(filePath);
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
                    if (fs.existsSync(filePath + '.ass')) {
                        del_arr.push(filePath + '.ass');
                    }
                    if (fs.existsSync(filePath + '.ass1')) {
                        del_arr.push(filePath + '.ass1');
                    }
                    if (fs.existsSync(filePath + '.ssa')) {
                        del_arr.push(filePath + '.ssa');
                    }
                    if (fs.existsSync(filePath + '.ssa1')) {
                        del_arr.push(filePath + '.ssa1');
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
                if (items[0].status === 7 || items[0].status === 8) {
                    mongo.orig("update", "storage", { _id: id }, {$set: {recycle: 4}}, function(err, item3){
                        if(err) {
                            util.handleError(err);
                        }
                        sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                    });
                } else if (items[0].status === 9) {
                    var total_file = items[0].playList.length;
                    if (total_file > 0) {
                        recur_playlist_backup(0);
                    }
                    function recur_playlist_backup(index) {
                        var bufferPath = filePath + '/' + index;
                        if (fs.existsSync(bufferPath + '_complete')) {
                            googleApi.googleBackup(items[0]._id, items[0].playList[index], bufferPath, items[0].tags, recycle, function(err) {
                                if(err) {
                                    util.handleError(err);
                                } else {
                                    index++;
                                    if (index < total_file) {
                                        recur_playlist_backup(index);
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
                                }
                            }, '_complete');
                        } else {
                            index++;
                            if (index < total_file) {
                                recur_playlist_backup(index);
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
                        }
                    }
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

app.get('/api/testLogin', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('test login');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        res.json({apiOK: true});
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

var wsServer = new WebSocketServer({
    server: server
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

if (config_glb.autoUpload) {
    setTimeout(function() {
        loopDrive();
        setInterval(function(){
            console.log('loop Drive');
            console.log(drive_time);
            var now_time = new Date().getTime();
            var idle_time = drive_interval * (Math.floor(drive_time.size / drive_size) + 1);
            console.log(idle_time);
            if (drive_time.time === 1 || (now_time - drive_time.time) > idle_time) {
                loopDrive();
            }
        }, drive_interval);
    }, 60000);
}

if (config_glb.updateExternal) {
    setTimeout(function() {
        loopUpdateExternal();
        setInterval(function(){
            console.log('loop Update External');
            console.log(external_time);
            var now_time = new Date().getTime();
            if (external_time === 1 || (now_time - external_time) > external_interval) {
                loopUpdateExternal();
            }
        }, external_interval);
    }, 120000);
}

if (config_glb.updateStock) {
    setTimeout(function() {
        loopUpdateStock();
        setInterval(function(){
            console.log('loop UpdateStock');
            console.log(stock_time);
            var now_time = new Date().getTime();
            if (stock_time === 1 || (now_time - stock_time) > stock_interval) {
                loopUpdateStock();
            }
        }, stock_interval);
    }, 180000);
}

function checkLogin(req, res, next, callback) {
    if(!req.isAuthenticated()){
        if (util.isMobile(req.headers['user-agent']) || req.headers['user-agent'].match(/Firefox/i)|| req.headers['user-agent'].match(/armv7l/i)) {
            if (/^\/video\//.test(req.path) || /^\/subtitle\//.test(req.path) || /^\/torrent\//.test(req.path)) {
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
                    var temp_arr = [];
                    var normal = '';
                    for (var j in temp_tag) {
                        normal = tagTool.normalizeTag(temp_tag[j]);
                        if (!tagTool.isDefaultTag(normal)) {
                            if (item.tags.indexOf(normal) === -1) {
                                temp_arr.push(normal);
                            }
                        }
                    }
                    temp_tag = temp_arr;
                    if (item.first === 1) {
                        item.tags.push('first item');
                    } else {
                        temp_tag.push('first item');
                    }
                    if (item.adultonly === 1) {
                        item.tags.push('18+');
                    } else {
                        if (util.checkAdmin(2, user)) {
                            temp_tag.push('18+');
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
                }
            });
        }
    });
}

function loopUpdateExternal(error, countdown) {
    console.log('loopUpdateExternal');
    console.log(new Date());
    external_time = new Date().getTime();
    externalTool.getList('lovetv', function(err) {
        if (err) {
            util.handleError(err);
            external_time = 1;
            console.log('loopUpdateExternal end');
        } else {
            external_time = 1;
            console.log('loopDrive end');
        }
    });
}

function loopUpdateStock(error, countdown) {
    console.log('loopUpdateStock');
    console.log(new Date());
    stock_time = new Date().getTime();
    var day = new Date().getDate();
    if (stock_batch_list.length > 0) {
        console.log('stock_batch_list remain');
        console.log(stock_batch_list.length);
    }
    if (day === config_type.updateStockDate[0]) {
        console.log('update stock');
        stockTool.getStockList('twse', function(err, tw_stocklist){
            if(err) {
                util.handleError(err);
                stock_time = 1;
                console.log('loopUpdateStock end');
            } else {
                for (var i in tw_stocklist) {
                    if (stock_batch_list.indexOf(tw_stocklist[i]) === -1) {
                        stock_batch_list.push(tw_stocklist[i]);
                    }
                }
                if (stock_batch_list.length > 0) {
                    updateStock('twse', function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                        stock_time = 1;
                        console.log('loopUpdateStock end');
                    });
                } else {
                    console.log('empty stock list');
                    stock_time = 1;
                    console.log('loopUpdateStock end');
                }
            }
        });
    } else if (config_type.updateStockDate.indexOf(day) !== -1) {
        console.log('update important stock');
        mongo.orig("find", "stock", {important: 1}, function(err, items){
            if(err) {
                util.handleError(err);
                stock_time = 1;
                console.log('loopUpdateStock end');
            } else {
                for (var i in items) {
                    if (stock_batch_list.indexOf(items[i].index) === -1) {
                        stock_batch_list.push(items[i].index);
                    }
                }
                if (stock_batch_list.length > 0) {
                    updateStock('twse', function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                        stock_time = 1;
                        console.log('loopUpdateStock end');
                    });
                } else {
                    console.log('empty stock list');
                    stock_time = 1;
                    console.log('loopUpdateStock end');
                }
            }
        });
    } else {
        if (stock_batch_list.length > 0) {
            updateStock('twse', function(err) {
                if (err) {
                    util.handleError(err);
                }
                stock_time = 1;
                console.log('loopUpdateStock end');
            });
        } else {
            console.log('empty stock list');
            stock_time = 1;
            console.log('loopUpdateStock end');
        }
    }
}

function updateStock(type, callback) {
    stock_time = new Date().getTime();
    console.log('updateStock');
    console.log(new Date());
    console.log(stock_batch_list[0]);
    stockTool.getSingleStock(type, stock_batch_list[0], function(err) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        stock_batch_list.splice(0, 1);
        if (stock_batch_list.length > 0) {
            updateStock(type, callback);
        } else {
            setTimeout(function(){
                callback(null);
            }, 0);
        }
    }, config_type.updateStockMode);
}

function loopDrive(error, countdown) {
    console.log('loopDrive');
    console.log(new Date());
    drive_time.time = new Date().getTime();
    drive_time.size = 0;
    /*if (error) {
        util.handleError(error);
    }
    if (!countdown) {
        countdown = 60000;
    }
    console.log(countdown);
    setTimeout(function() {*/
    mongo.orig("find", "user", {auto: {$exists: true}}, function(err, userlist){
        if(err) {
            util.handleError(err);
            drive_time.time = 1;
            drive_time.size = 0;
            console.log('loopDrive end');
            //loopDrive(null, drive_interval);
        } else {
            userDrive(userlist, 0, function(err) {
                if(err) {
                    util.handleError(err);
                }
                drive_time.time = 1;
                drive_time.size = 0;
                console.log('loopDrive end');
            });
        }
    });
    //}, countdown);
}

function userDrive(userlist, index, callback) {
    drive_time.time = new Date().getTime();
    drive_time.size = 0;
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
            util.handleError(err, callback, callback);
        }
        index++;
        if (index < userlist.length) {
            userDrive(userlist, index, callback);
        } else {
            setTimeout(function(){
                callback(null);
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
                    util.handleError(err, callback, callback);
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
                                        util.handleError(err, callback, callback);
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
                        }, drive_time);
                    } else {
                        var uploaded_data = {folderId: userlist[index].auto, name: 'uploaded'};
                        googleApi.googleApi('list folder', uploaded_data, function(err, uploadedList) {
                            if (err) {
                                util.handleError(err, callback, callback);
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
                                            util.handleError(err, callback, callback);
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
                            }, drive_time);
                        });
                    }
                } else {
                    googleApi.googleApi('list folder', data, function(err, folder_metadataList) {
                        if (err) {
                            util.handleError(err, callback, callback);
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