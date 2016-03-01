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

var external_interval = 604800000;

var external_time = 0;

var doc_interval = 3600000;

var doc_time = 0;

var drive_interval = 3600000;

var drive_size = 500 * 1024 * 1024;

var drive_time = {time: 0, size: 0};

var stock_interval = 86400000;

var stock_time = 0;

var stock_batch_list = [];

var drive_batch = 100;

var media_interval = 7200000;

var torrent_duration = 172800000;

var media_time = 0;

var torrent_pool = [];

var external_pool = [];

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
    readTorrent = require('read-torrent');
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

app.post('/upload/subtitle/:uid/:index(\\d+|v)?', function(req, res, next) {
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
        var id = req.params.uid.match(/^(you|dym|dri|bil|soh|let|vqq|fun|kdr|yuk|tud|fc1)_/);
        if (id) {
            var ex_type = 'youtube';
            if (id[1] === 'dym') {
                ex_type = 'dailymotion';
            } else if (id[1] === 'dri') {
                ex_type = 'drive';
            } else if (id[1] === 'bil') {
                ex_type = 'bilibili';
            } else if (id[1] === 'soh') {
                ex_type = 'sohu';
            } else if (id[1] === 'let') {
                ex_type = 'letv';
            } else if (id[1] === 'vqq') {
                ex_type = 'vqq';
            } else if (id[1] === 'fun') {
                ex_type = 'funshion';
            } else if (id[1] === 'kdr') {
                ex_type = 'kubodrive';
            } else if (id[1] === 'yuk') {
                ex_type = 'youku';
            } else if (id[1] === 'tud') {
                ex_type = 'tudou';
            } else if (id[1] === 'fc1') {
                ex_type = 'funcnd1';
            }
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            filePath = util.getFileLocation(ex_type, id);
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
                if ((items[0].status !== 3 && items[0].status !== 9) || items[0].owner === 'lovetv' || items[0].owner === 'eztv') {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                filePath = util.getFileLocation(items[0].owner, items[0]._id);
                if (items[0].status === 9 && req.params.index) {
                    if (req.params.index) {
                        if (req.params.index === 'v') {
                            for (var i in items[0]['playList']) {
                                if (mime.isVideo(items[0]['playList'][i])) {
                                    fileIndex = i;
                                    break;
                                }
                            }
                        } else {
                            fileIndex = Number(req.params.index);
                        }
                    }
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
                    sendWs({type: 'sub', data: id}, 0, 0);
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
                if (mime.isTorrent(req.files.file.name)) {
                    stream.on('close', function() {
                        readTorrent(filePath, function(err, torrent) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            var magnet = util.torrent2Magnet(torrent)
                            if (magnet) {
                                console.log(magnet);
                                var encodeTorrent = util.isValidString(magnet, 'url');
                                if (encodeTorrent === false) {
                                    util.handleError({hoerror: 2, message: "magnet is not vaild"}, next, res);
                                }
                                var shortTorrent = magnet.match(/^magnet:[^&]+/);
                                if (shortTorrent) {
                                    //delete torrent file
                                    shortTorrent = shortTorrent[0];
                                    fs.unlink(filePath, function(err) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        //create folder
                                        mkdirp(filePath, function(err) {
                                            if(err) {
                                                console.log(filePath);
                                                util.handleError(err, next, res);
                                            }
                                            //upload magnet
                                            var torrentHash = shortTorrent.match(/[^:]+$/);
                                            mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                                if (err) {
                                                    util.handleError(err, next, res);
                                                }
                                                if (items.length === 0) {
                                                    var realPath = filePath + '/real';
                                                    var engine = torrentStream(magnet, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                                        var filename = 'Playlist torrent';
                                                        if (engine.torrent.name) {
                                                            filename = 'Playlist ' + engine.torrent.name;
                                                        }
                                                        engine.destroy();
                                                        streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playList: playList});
                                                    });
                                                } else {
                                                    util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                                }
                                            });
                                        });
                                    });
                                } else {
                                    util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                                }
                            } else {
                                util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                            }
                        });
                    });
                } else {
                    stream.on('close', streamClose);
                }
                stream.pipe(fs.createWriteStream(filePath));
            });
        } else {
            var stream = fs.createReadStream(req.files.file.path);
            stream.on('error', function(err){
                console.log('save file error!!!');
                util.handleError(err, next, res);
            });
            if (mime.isTorrent(req.files.file.name)) {
                stream.on('close', function() {
                    readTorrent(filePath, function(err, torrent) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        var magnet = util.torrent2Magnet(torrent)
                        if (magnet) {
                            console.log(magnet);
                            var encodeTorrent = util.isValidString(magnet, 'url');
                            if (encodeTorrent === false) {
                                util.handleError({hoerror: 2, message: "magnet is not vaild"}, next, res);
                            }
                            var shortTorrent = magnet.match(/^magnet:[^&]+/);
                            if (shortTorrent) {
                                //delete torrent file
                                shortTorrent = shortTorrent[0];
                                fs.unlink(filePath, function(err) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    //create folder
                                    mkdirp(filePath, function(err) {
                                        if(err) {
                                            console.log(filePath);
                                            util.handleError(err, next, res);
                                        }
                                        //upload magnet
                                        var torrentHash = shortTorrent.match(/[^:]+$/);
                                        mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            if (items.length === 0) {
                                                var realPath = filePath + '/real';
                                                var engine = torrentStream(magnet, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                                    var filename = 'Playlist torrent';
                                                    if (engine.torrent.name) {
                                                        filename = 'Playlist ' + engine.torrent.name;
                                                    }
                                                    engine.destroy();
                                                    streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playList: playList});
                                                });
                                            } else {
                                                util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                            }
                                        });
                                    });
                                });
                            } else {
                                util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                            }
                        } else {
                            util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                        }
                    });
                });
            } else {
                stream.on('close', streamClose);
            }
            stream.pipe(fs.createWriteStream(filePath));
        }
        function streamClose(filename, tag_arr, opt_arr, db_obj){
            fs.unlink(req.files.file.path, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                var name = util.toValidName(req.files.file.name);
                if (filename) {
                    name = util.toValidName(filename);
                }
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
                if (db_obj && db_obj['magnet']) {
                    data['size'] = 0;
                } else {
                    data['size'] = req.files.file.size;
                }
                data['count'] = 0;
                data['first'] = 1;
                data['recycle'] = 0;
                if (util.checkAdmin(2 ,req.user) && Number(req.params.type) === 1) {
                    data['adultonly'] = 1;
                } else {
                    data['adultonly'] = 0;
                }
                data['untag'] = 1;
                if (db_obj && db_obj['magnet']) {
                    data['status'] = 9;//media type
                } else {
                    data['status'] = 0;//media type
                }
                mediaHandleTool.handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (mediaType.type === 'video') {
                        var is_preview = true;
                        var cProcess = avconv(['-i', filePath]);
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
                            if (is_preview) {
                                DBdata['status'] = 3;
                            }
                            save2DB(mediaType, mediaTag, DBdata);
                        });
                    } else {
                        save2DB(mediaType, mediaTag, DBdata);
                    }
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
                    if (tag_arr) {
                        var is_d = false;
                        var oIndex = -1;
                        var option_cht = mime.getOptionTag('cht');
                        var option_eng = mime.getOptionTag('eng');
                        for (var i in tag_arr) {
                            normal = tagTool.normalizeTag(tag_arr[i]);
                            is_d = tagTool.isDefaultTag(normal);
                            if (!is_d) {
                                if (mediaTag.def.indexOf(normal) === -1) {
                                    mediaTag.def.push(normal);
                                    oIndex = option_cht.indexOf(normal);
                                    if (oIndex !== -1) {
                                        if (mediaTag.def.indexOf(option_eng[oIndex]) === -1) {
                                            mediaTag.def.push(option_eng[oIndex]);
                                        }
                                    } else {
                                        oIndex = option_eng.indexOf(normal);
                                        if (oIndex !== -1) {
                                            if (mediaTag.def.indexOf(option_cht[oIndex]) === -1) {
                                                mediaTag.def.push(option_cht[oIndex]);
                                            }
                                        }
                                    }
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
                    for (var i in db_obj) {
                        DBdata[i] = db_obj[i];
                    }
                    mongo.orig("insert", "storage", DBdata, function(err, item){
                        if(err) {
                            util.handleError(err, next, res);
                        }
                        console.log(item);
                        console.log('save end');
                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                        tagTool.getRelativeTag(mediaTag.def[0], req.user, mediaTag.opt, next, function(err, relative) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            var reli = 5;
                            if (relative.length < reli) {
                                reli = relative.length;
                            }
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
                            var normal = '';
                            for (var i = 0; i < reli; i++) {
                                normal = tagTool.normalizeTag(relative[i]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1 && mediaTag.opt.indexOf(normal) === -1) {
                                        mediaTag.opt.push(normal);
                                    }
                                }
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
                        });
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
        var hide = req.body.hide;
        var is_media = 0;
        var encodeTorrent = url;
        var owner = req.user._id;
        url = decodeURIComponent(url);
        if (url.match(/^(https|http):\/\/(www\.youtube\.com|youtu\.be)\//)) {
            owner = 'youtube';
        }
        var oOID = mongo.objectID();
        var filePath = util.getFileLocation(owner, oOID);
        var folderPath = path.dirname(filePath);
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
                        var torrentHash = shortTorrent.match(/[^:]+$/);
                        mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            if (items.length === 0) {
                                var realPath = filePath + '/real';
                                var engine = torrentStream(url, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                    var filename = 'Playlist torrent';
                                    if (engine.torrent.name) {
                                        filename = 'Playlist ' + engine.torrent.name;
                                    }
                                    engine.destroy();
                                    streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playList: playList});
                                });
                            } else {
                                util.handleError({hoerror: 2, message: "already has one"}, next, res);
                            }
                        });
                    }
                } else if (url.match(/^(https|http):\/\/(www\.youtube\.com|youtu\.be)\//)) {
                    var is_music = url.match(/^(.*):music$/);
                    var youtube_id = false;
                    if (is_music) {
                        is_media = 4;
                        console.log('youtube music');
                        url = is_music[1];
                    } else {
                        is_media = 3;
                        console.log('youtube');
                    }
                    mongo.orig("find", "storage", {owner: 'youtube', url: encodeURIComponent(url)}, {limit: 2}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length > 0) {
                            for (var i in items) {
                                console.log(items[i]);
                                if (items[i].thumb && items[i].status === is_media) {
                                    util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                    break;
                                }
                            }
                        }
                        youtube_id = url.match(/list=([^&]+)/);
                        if (youtube_id) {
                            googleApi.googleApi('y playlist', {id: youtube_id[1], caption: true}, function(err, detaildata) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                if (detaildata.items.length < 1) {
                                    util.handleError({hoerror: 2, message: 'can not find video'}, next, res);
                                }
                                var media_name = detaildata.items[0].snippet.title, tag_arr = [], cid = detaildata.items[0].snippet.channelId, ctitle = detaildata.items[0].snippet.channelTitle, thumb = detaildata.items[0].snippet.thumbnails.default.url;
                                console.log(media_name);
                                url = util.isValidString(url, 'url');
                                if (url === false) {
                                    util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
                                }
                                if (detaildata.items[0].snippet.tags) {
                                    tag_arr = detaildata.items[0].snippet.tags;
                                }
                                if (ctitle) {
                                    tag_arr.push(detaildata.items[0].snippet.channelTitle);
                                }
                                if (tag_arr.indexOf('youtube') === -1) {
                                    tag_arr.push('youtube');
                                }
                                if (tag_arr.indexOf('youtube') === -1) {
                                    tag_arr.push('youtube');
                                }
                                if (is_music) {
                                    if (tag_arr.indexOf('audio') === -1) {
                                        tag_arr.push('audio');
                                    }
                                    if (tag_arr.indexOf('音頻') === -1) {
                                        tag_arr.push('音頻');
                                    }
                                } else {
                                    if (tag_arr.indexOf('video') === -1) {
                                        tag_arr.push('video');
                                    }
                                    if (tag_arr.indexOf('影片') === -1) {
                                        tag_arr.push('影片');
                                    }
                                }
                                streamClose(media_name, tag_arr, [], {owner: 'youtube', untag: 0, thumb: thumb, cid: cid, ctitle: ctitle, url: url});
                            });
                        } else {
                            youtube_id = url.match(/v=([^&]+)/);
                            if (!youtube_id) {
                                util.handleError({hoerror: 2, message: 'can not find youtube id!!!'}, next, res);
                            }
                            googleApi.googleApi('y video', {id: youtube_id[1], caption: true}, function(err, detaildata) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                if (detaildata.items.length < 1) {
                                    util.handleError({hoerror: 2, message: 'can not find video'}, next, res);
                                }
                                var media_name = detaildata.items[0].snippet.title, tag_arr = [], cid = detaildata.items[0].snippet.channelId, ctitle = detaildata.items[0].snippet.channelTitle, thumb = detaildata.items[0].snippet.thumbnails.default.url;
                                console.log(media_name);
                                url = util.isValidString(url, 'url');
                                if (url === false) {
                                    util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
                                }
                                if (detaildata.items[0].snippet.tags) {
                                    tag_arr = detaildata.items[0].snippet.tags;
                                }
                                if (ctitle) {
                                    tag_arr.push(detaildata.items[0].snippet.channelTitle);
                                }
                                if (tag_arr.indexOf('youtube') === -1) {
                                    tag_arr.push('youtube');
                                }
                                if (is_music) {
                                    if (tag_arr.indexOf('audio') === -1) {
                                        tag_arr.push('audio');
                                    }
                                    if (tag_arr.indexOf('音頻') === -1) {
                                        tag_arr.push('音頻');
                                    }
                                } else {
                                    if (tag_arr.indexOf('video') === -1) {
                                        tag_arr.push('video');
                                    }
                                    if (tag_arr.indexOf('影片') === -1) {
                                        tag_arr.push('影片');
                                    }
                                }
                                streamClose(media_name, tag_arr, [], {owner: 'youtube', untag: 0, thumb: thumb, cid: cid, ctitle: ctitle, url: url});
                            });
                        }
                    });
                } else if (url.match(/^(https|http):\/\/www\.123kubo\.com\//)) {
                    mongo.orig("find", "storage", {owner: 'kubo', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length > 0) {
                            util.handleError({hoerror: 2, message: "already has one"}, next, res);
                        }
                        var kubo_id = url.match(/vod-read-id-(\d+).html$/);
                        if (!kubo_id) {
                            util.handleError({hoerror: 2, message: "kubo url invalid"}, next, res);
                        }
                        is_media = 3;
                        externalTool.saveSingle('kubo', kubo_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                        });
                    });
                } else if (url.match(/^(https|http):\/\/yts\.ag\/movie\//)) {
                    mongo.orig("find", "storage", {owner: 'yify', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length > 0) {
                            util.handleError({hoerror: 2, message: "already has one"}, next, res);
                        }
                        var yify_id = url.match(/[^\/]+$/);
                        if (!yify_id) {
                            util.handleError({hoerror: 2, message: "yify url invalid"}, next, res);
                        }
                        is_media = 3;
                        externalTool.saveSingle('yify', yify_id[0], function(err, media_name, tag_arr, owner, thumb, url) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                        });
                    });
                } else if (url.match(/^(https|http):\/\/www\.cartoonmad\.com\/comic\//)) {
                    mongo.orig("find", "storage", {owner: 'cartoonmad', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length > 0) {
                            util.handleError({hoerror: 2, message: "already has one"}, next, res);
                        }
                        var cartoonmad_id = url.match(/([^\/]+)\.html$/);
                        if (!cartoonmad_id) {
                            util.handleError({hoerror: 2, message: "cartoonmad url invalid"}, next, res);
                        }
                        is_media = 2;
                        externalTool.saveSingle('cartoonmad', cartoonmad_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                        });
                    });
                } else if (url.match(/^(https|http):\/\/www\.bilibili\.com\//)) {
                    mongo.orig("find", "storage", {owner: 'bilibili', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length > 0) {
                            util.handleError({hoerror: 2, message: "already has one"}, next, res);
                        }
                        var bili_id = url.match(/([^\/]+)\/$/);
                        if (!bili_id) {
                            util.handleError({hoerror: 2, message: "bilibili url invalid"}, next, res);
                        }
                        is_media = 3;
                        externalTool.saveSingle('bilibili', bili_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                        });
                    });
                } else {
                    api.xuiteDownload(url, filePath, function(err, pathname, filename) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (!filename) {
                            filename = path.basename(pathname);
                        }
                        console.log(filename);
                        if (mime.isTorrent(filename)) {
                            readTorrent(filePath, function(err, torrent) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                var magnet = util.torrent2Magnet(torrent)
                                if (magnet) {
                                    console.log(magnet);
                                    encodeTorrent = util.isValidString(magnet, 'url');
                                    if (encodeTorrent === false) {
                                        util.handleError({hoerror: 2, message: "magnet is not vaild"}, next, res);
                                    }
                                    shortTorrent = magnet.match(/^magnet:[^&]+/);
                                    if (shortTorrent) {
                                        //delete torrent file
                                        shortTorrent = shortTorrent[0];
                                        fs.unlink(filePath, function(err) {
                                            if (err) {
                                                util.handleError(err, next, res);
                                            }
                                            //create folder
                                            mkdirp(filePath, function(err) {
                                                if(err) {
                                                    console.log(filePath);
                                                    util.handleError(err, next, res);
                                                }
                                                //upload magnet
                                                var torrentHash = shortTorrent.match(/[^:]+$/);
                                                mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                                    if (err) {
                                                        util.handleError(err, next, res);
                                                    }
                                                    if (items.length === 0) {
                                                        var realPath = filePath + '/real';
                                                        var engine = torrentStream(magnet, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                                            var filename = 'Playlist torrent';
                                                            if (engine.torrent.name) {
                                                                filename = 'Playlist ' + engine.torrent.name;
                                                            }
                                                            engine.destroy();
                                                            streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playList: playList});
                                                        });
                                                    } else {
                                                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                                    }
                                                });
                                            });
                                        });
                                    } else {
                                        util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                                    }
                                } else {
                                    util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                                }
                            });
                        } else {
                            streamClose(filename, [], []);
                        }
                    });
                }
            });
        } else {
            if (shortTorrent) {
                shortTorrent = shortTorrent[0];
                if (shortTorrent === 'magnet:stop') {
                    queueTorrent('stop', req.user);
                    res.json({stop: true});
                } else {
                    var torrentHash = shortTorrent.match(/[^:]+$/);
                    mongo.orig("find", "storage", {$regex: torrentHash[0], $options: 'i'}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        if (items.length === 0) {
                            var realPath = filePath + '/real';
                            var engine = torrentStream(url, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                var filename = 'Playlist torrent';
                                if (engine.torrent.name) {
                                    filename = 'Playlist ' + engine.torrent.name;
                                }
                                engine.destroy();
                                streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playlist: playList});
                            });
                        } else {
                            util.handleError({hoerror: 2, message: "already has one"}, next, res);
                        }
                    });
                }
            } else if (url.match(/^(https|http):\/\/(www\.youtube\.com|youtu\.be)\//)) {
                var is_music = url.match(/^(.*):music$/);
                var youtube_id = false;
                if (is_music) {
                    is_media = 4;
                    console.log('youtube music');
                    url = is_music[1];
                } else {
                    is_media = 3;
                    console.log('youtube');
                }
                mongo.orig("find", "storage", {owner: 'youtube', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length > 0) {
                        for (var i in items) {
                            console.log(items[i]);
                            if (items[i].thumb && items[i].status === is_media) {
                                util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                break;
                            }
                        }
                    }
                    youtube_id = url.match(/list=([^&]+)/);
                    if (youtube_id) {
                        googleApi.googleApi('y playlist', {id: youtube_id[1], caption: true}, function(err, detaildata) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            if (detaildata.items.length < 1) {
                                util.handleError({hoerror: 2, message: 'can not find video'}, next, res);
                            }
                            var media_name = detaildata.items[0].snippet.title, tag_arr = [], cid = detaildata.items[0].snippet.channelId, ctitle = detaildata.items[0].snippet.channelTitle, thumb = detaildata.items[0].snippet.thumbnails.default.url;
                            console.log(media_name);
                            url = util.isValidString(url, 'url');
                            if (url === false) {
                                util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
                            }
                            if (detaildata.items[0].snippet.tags) {
                                tag_arr = detaildata.items[0].snippet.tags;
                            }
                            if (ctitle) {
                                tag_arr.push(detaildata.items[0].snippet.channelTitle);
                            }
                            if (tag_arr.indexOf('youtube') === -1) {
                                tag_arr.push('youtube');
                            }
                            if (is_music) {
                                if (tag_arr.indexOf('audio') === -1) {
                                    tag_arr.push('audio');
                                }
                                if (tag_arr.indexOf('音頻') === -1) {
                                    tag_arr.push('音頻');
                                }
                            } else {
                                if (tag_arr.indexOf('video') === -1) {
                                    tag_arr.push('video');
                                }
                                if (tag_arr.indexOf('影片') === -1) {
                                    tag_arr.push('影片');
                                }
                            }
                            streamClose(media_name, tag_arr, [], {owner: 'youtube', untag: 0, thumb: thumb, cid: cid, ctitle: ctitle, url: url});
                        });
                    } else {
                        youtube_id = url.match(/v=([^&]+)/);
                        if (!youtube_id) {
                            util.handleError({hoerror: 2, message: 'can not find youtube id!!!'}, next, res);
                        }
                        googleApi.googleApi('y video', {id: youtube_id[1], caption: true}, function(err, detaildata) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            if (detaildata.items.length < 1) {
                                util.handleError({hoerror: 2, message: 'can not find video'}, next, res);
                            }
                            var media_name = detaildata.items[0].snippet.title, tag_arr = [], cid = detaildata.items[0].snippet.channelId, ctitle = detaildata.items[0].snippet.channelTitle, thumb = detaildata.items[0].snippet.thumbnails.default.url;
                            console.log(media_name);
                            url = util.isValidString(url, 'url');
                            if (url === false) {
                                util.handleError({hoerror: 2, message: "url is not vaild"}, next, res);
                            }
                            if (detaildata.items[0].snippet.tags) {
                                tag_arr = detaildata.items[0].snippet.tags;
                            }
                            if (ctitle) {
                                tag_arr.push(detaildata.items[0].snippet.channelTitle);
                            }
                            if (tag_arr.indexOf('youtube') === -1) {
                                tag_arr.push('youtube');
                            }
                            if (is_music) {
                                if (tag_arr.indexOf('audio') === -1) {
                                    tag_arr.push('audio');
                                }
                                if (tag_arr.indexOf('音頻') === -1) {
                                    tag_arr.push('音頻');
                                }
                            } else {
                                if (tag_arr.indexOf('video') === -1) {
                                    tag_arr.push('video');
                                }
                                if (tag_arr.indexOf('影片') === -1) {
                                    tag_arr.push('影片');
                                }
                            }
                            streamClose(media_name, tag_arr, [], {owner: 'youtube', untag: 0, thumb: thumb, cid: cid, ctitle: ctitle, url: url});
                        });
                    }
                });
            } else if (url.match(/^(https|http):\/\/www\.123kubo\.com\//)) {
                mongo.orig("find", "storage", {owner: 'kubo', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length > 0) {
                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                    }
                    var kubo_id = url.match(/vod-read-id-(\d+).html$/);
                    if (!kubo_id) {
                        util.handleError({hoerror: 2, message: "kubo url invalid"}, next, res);
                    }
                    is_media = 3;
                    externalTool.saveSingle('kubo', kubo_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                    });
                });
            } else if (url.match(/^(https|http):\/\/yts\.ag\/movie\//)) {
                mongo.orig("find", "storage", {owner: 'yify', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length > 0) {
                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                    }
                    var yify_id = url.match(/[^\/]+$/);
                    if (!yify_id) {
                        util.handleError({hoerror: 2, message: "yify url invalid"}, next, res);
                    }
                    is_media = 3;
                    externalTool.saveSingle('yify', yify_id[0], function(err, media_name, tag_arr, owner, thumb, url) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                    });
                });
            } else if (url.match(/^(https|http):\/\/www\.cartoonmad\.com\/comic\//)) {
                mongo.orig("find", "storage", {owner: 'cartoonmad', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length > 0) {
                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                    }
                    var cartoonmad_id = url.match(/([^\/]+)\.html$/);
                    if (!cartoonmad_id) {
                        util.handleError({hoerror: 2, message: "cartoonmad url invalid"}, next, res);
                    }
                    is_media = 2;
                    externalTool.saveSingle('cartoonmad', cartoonmad_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                    });
                });
            } else if (url.match(/^(https|http):\/\/www\.bilibili\.com\//)) {
                mongo.orig("find", "storage", {owner: 'bilibili', url: encodeURIComponent(url)}, {limit: 1}, function(err, items){
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (items.length > 0) {
                        util.handleError({hoerror: 2, message: "already has one"}, next, res);
                    }
                    var bili_id = url.match(/([^\/]+)\/$/);
                    if (!bili_id) {
                        util.handleError({hoerror: 2, message: "bilibili url invalid"}, next, res);
                    }
                    is_media = 3;
                    externalTool.saveSingle('bilibili', bili_id[1], function(err, media_name, tag_arr, owner, thumb, url) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        streamClose(media_name, tag_arr, [], {owner: owner, untag: 0, thumb: thumb, url: url});
                    });
                });
            } else {
                api.xuiteDownload(url, filePath, function(err, pathname, filename) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (!filename) {
                        filename = path.basename(pathname);
                    }
                    console.log(filename);
                    if (mime.isTorrent(filename)) {
                        readTorrent(filePath, function(err, torrent) {
                            if (err) {
                                util.handleError(err, next, res);
                            }
                            var magnet = util.torrent2Magnet(torrent)
                            if (magnet) {
                                console.log(magnet);
                                encodeTorrent = util.isValidString(magnet, 'url');
                                if (encodeTorrent === false) {
                                    util.handleError({hoerror: 2, message: "magnet is not vaild"}, next, res);
                                }
                                shortTorrent = magnet.match(/^magnet:[^&]+/);
                                if (shortTorrent) {
                                    //delete torrent file
                                    shortTorrent = shortTorrent[0];
                                    fs.unlink(filePath, function(err) {
                                        if (err) {
                                            util.handleError(err, next, res);
                                        }
                                        //create folder
                                        mkdirp(filePath, function(err) {
                                            if(err) {
                                                console.log(filePath);
                                                util.handleError(err, next, res);
                                            }
                                            //upload magnet
                                            var torrentHash = shortTorrent.match(/[^:]+$/);
                                            mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                                if (err) {
                                                    util.handleError(err, next, res);
                                                }
                                                if (items.length === 0) {
                                                    var realPath = filePath + '/real';
                                                    var engine = torrentStream(magnet, {tmp: config_glb.nas_tmp, path: realPath, connections: 20, uploads: 1});
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
                                                        var filename = 'Playlist torrent';
                                                        if (engine.torrent.name) {
                                                            filename = 'Playlist ' + engine.torrent.name;
                                                        }
                                                        engine.destroy();
                                                        streamClose(filename, tag_arr, opt_arr, {magnet: encodeTorrent, playList: playList});
                                                    });
                                                } else {
                                                    util.handleError({hoerror: 2, message: "already has one"}, next, res);
                                                }
                                            });
                                        });
                                    });
                                } else {
                                    util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                                }
                            } else {
                                util.handleError({hoerror: 2, message: "magnet create fail"}, next, res);
                            }
                        });
                    } else {
                        streamClose(filename, []);
                    }
                });
            }
        }
        function streamClose(filename, tag_arr, opt_arr, db_obj){
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
            if (fs.existsSync(filePath)) {
                var stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    data['size'] = stats["size"];
                } else {
                    data['size'] = 0;
                }
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
            if (hide) {
                data['untag'] = 0;
                data['first'] = 0;
            } else {
                data['untag'] = 1;
                data['first'] = 1;
            }
            if (db_obj && db_obj['magnet']) {
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
                    var oIndex = -1;
                    var option_cht = mime.getOptionTag('cht');
                    var option_eng = mime.getOptionTag('eng');
                    for (var i in tag_arr) {
                        normal = tagTool.normalizeTag(tag_arr[i]);
                        is_d = tagTool.isDefaultTag(normal);
                        if (!is_d) {
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                                oIndex = option_cht.indexOf(normal);
                                if (oIndex !== -1) {
                                    if (mediaTag.def.indexOf(option_eng[oIndex]) === -1) {
                                        mediaTag.def.push(option_eng[oIndex]);
                                    }
                                } else {
                                    oIndex = option_eng.indexOf(normal);
                                    if (oIndex !== -1) {
                                        if (mediaTag.def.indexOf(option_cht[oIndex]) === -1) {
                                            mediaTag.def.push(option_cht[oIndex]);
                                        }
                                    }
                                }
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
                for (var i in db_obj) {
                    DBdata[i] = db_obj[i];
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
                    tagTool.getRelativeTag(mediaTag.def[0], req.user, mediaTag.opt, next, function(err, relative) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        var reli = 5;
                        if (relative.length < reli) {
                            reli = relative.length;
                        }
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
                        var normal = '';
                        for (var i = 0; i < reli; i++) {
                            normal = tagTool.normalizeTag(relative[i]);
                            if (!tagTool.isDefaultTag(normal)) {
                                if (mediaTag.def.indexOf(normal) === -1 && mediaTag.opt.indexOf(normal) === -1) {
                                    mediaTag.opt.push(normal);
                                }
                            }
                        }
                        if (DBdata['untag']) {
                            res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                        } else {
                            res.json({id: item[0]._id});
                        }
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
                tagTool.getRelativeTag(mediaTag.def[0], req.user, mediaTag.opt, next, function(err, relative) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    var reli = 5;
                    if (relative.length < reli) {
                        reli = relative.length;
                    }
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
                    var normal = '';
                    for (var i = 0; i < reli; i++) {
                        normal = tagTool.normalizeTag(relative[i]);
                        if (!tagTool.isDefaultTag(normal)) {
                            if (mediaTag.def.indexOf(normal) === -1 && mediaTag.opt.indexOf(normal) === -1) {
                                mediaTag.opt.push(normal);
                            }
                        }
                    }
                    res.json({id: item[0]._id, name: item[0].name, select: mediaTag.def, option: mediaTag.opt});
                });
            });
        });
    });
});

app.get('/api/subtitle/fix/:uid/:adjust/:index(\\d+|v)?', function(req, res, next) {
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
        function fixSub(uid) {
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
                    sendWs({type: 'sub', data: id}, 0, 0);
                    res.json({apiOK: true});
                });
            });
        }
        var id = req.params.uid.match(/^(you|dym|dri|bil|soh|let|vqq|fun|kdr|yuk|tud|fc1)_/);
        if (id) {
            var ex_type = 'youtube';
            if (id[1] === 'dym') {
                ex_type = 'dailymotion';
            } else if (id[1] === 'dri') {
                ex_type = 'drive';
            } else if (id[1] === 'bil') {
                ex_type = 'bilibili';
            } else if (id[1] === 'soh') {
                ex_type = 'sohu';
            } else if (id[1] === 'let') {
                ex_type = 'letv';
            } else if (id[1] === 'vqq') {
                ex_type = 'vqq';
            } else if (id[1] === 'fun') {
                ex_type = 'funshion';
            } else if (id[1] === 'kdr') {
                ex_type = 'kubodrive';
            } else if (id[1] === 'yuk') {
                ex_type = 'youku';
            } else if (id[1] === 'tud') {
                ex_type = 'tudou';
            } else if (id[1] === 'fc1') {
                ex_type = 'funcnd1';
            }
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            filePath = util.getFileLocation(ex_type, id);
            fixSub(id);
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
                    if (req.params.index === 'v') {
                        for (var i in items[0]['playList']) {
                            if (mime.isVideo(items[0]['playList'][i])) {
                                fileIndex = i;
                                break;
                            }
                        }
                    } else {
                        fileIndex = Number(req.params.index);
                    }
                }
                if (items[0].status === 9 && !mime.isVideo(items[0]['playList'][fileIndex])) {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                filePath = util.getFileLocation(items[0].owner, items[0]._id);
                if (items[0].status === 9) {
                    filePath = filePath + '/' + fileIndex;
                }
                fixSub(id);
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
        var id = req.params.uid.match(/^(you|dym|bil|soh|let|vqq|fun|kdr|yuk|tud)_(.*)/);
        if (!id) {
            util.handleError({hoerror: 2, message: "file is not youtube video!!!"}, next, res);
        }
        var subIndex = 1;
        var url = null;
        if (id[1] === 'dym') {
            url = 'http://www.dailymotion.com/embed/video/' + id[2];
        } else if (id[1] === 'bil') {
            var idsub = id[2].match(/^([^_]+)_(\d+)$/);
            if (idsub) {
                url = 'http://www.bilibili.com/video/' + idsub[1] + '/index_' + idsub[2] + '.html';
            } else {
                url = 'http://www.bilibili.com/video/' + id[2] + '/';
            }
        } else if (id[1] === 'soh') {
            var idsub = id[2].match(/^([^_]+)_([^_]+)_(\d)$/);
            subIndex = Number(idsub[3]);
            url = 'http://tv.sohu.com/' + idsub[1] + '/' + idsub[2] + '.shtml';
        } else if (id[1] === 'let') {
            url = 'http://www.letv.com/ptv/vplay/' + id[2] + '.html';
        } else if (id[1] === 'vqq') {
            var idsub = id[2].match(/^([^_]+)_([^_]+)_([^_]+)$/);
            url = 'http://v.qq.com/cover/' + idsub[1] + '/' + idsub[2] + '/' + idsub[3] + '.html';
        } else if (id[1] === 'fun') {
            var idsub = id[2].match(/^([^_]+)_([^_]+)_([^_]+)$/);
            url = 'http://www.funshion.com/vplay/' + idsub[1] + '-' + idsub[2] + '.' + idsub[3];
        } else if (id[1] === 'kdr') {
            url = id[2];
        } else if (id[1] === 'yuk') {
            url = 'http://v.youku.com/v_show/id_' + id[2] + '.html';
        } else if (id[1] === 'tud') {
            var idsub = id[2].match(/^([^_]+)_([^_]+)$/);
            url = 'http://www.tudou.com/albumplay/' + idsub[1] +'/' + idsub[2] +'.html';
        } else {
            url = 'http://www.youtube.com/watch?v=' + id[2];
        }
        if (id[1] === 'soh' || id[1] === 'let' || id[1] === 'vqq' || id[1] === 'fun' || id[1] === 'yuk' || id[1] === 'tud') {
            var kubo_url = 'http://888blb1.flvapi.com/video.php?url=gq_' + new Buffer(url).toString('base64') + '_a';
            api.xuiteDownload(kubo_url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, next, res);
                }
                var video_list = raw_data.match(/\!\[CDATA\[[^\]]+/g);
                if (!video_list) {
                    util.handleError({hoerror: 2, message: id[1] + " video invaild!!!"}, next, res);
                }
                console.log(raw_data);
                var list_match = false;
                var list = [];
                for (var i in video_list) {
                    list_match = video_list[i].match(/^\!\[CDATA\[([^\]]+)$/);
                    if (list_match) {
                        list.push(list_match[1]);
                    }
                }
                if (list.length < 1) {
                    util.handleError({hoerror: 2, message: id[1] + " video invaild!!!"}, next, res);
                }
                if (!list[subIndex-1]) {
                    util.handleError({hoerror: 2, message: id[1] + " video index invaild!!!"}, next, res);
                }
                var ret_obj = {title: id[1], video: [list[subIndex-1]]};
                if (list.length > 1) {
                    ret_obj['sub'] = list.length;
                }
                console.log(ret_obj);
                res.json(ret_obj);
            }, 60000, false, false, 'http://888blb1.flvapi.com/');
        } else if (id[1] === 'kdr') {
            var kubo_url = 'http://jaiwen.com/jx/gg58/xml.php?url=gg_' + url + '_cq';
            api.xuiteDownload(kubo_url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, next, res);
                }
                var video_list = raw_data.match(/\!\[CDATA\[[^\]]+/g);
                if (!video_list) {
                    util.handleError({hoerror: 2, message: "video invaild!!!"}, next, res);
                }
                var list_match = false;
                var list = [];
                for (var i in video_list) {
                    list_match = video_list[i].match(/^\!\[CDATA\[([^\]]+)$/);
                    if (list_match) {
                        list.push(list_match[1]);
                    }
                }
                if (list.length < 1) {
                    util.handleError({hoerror: 2, message: "video invaild!!!"}, next, res);
                }
                if (!list[subIndex-1]) {
                    util.handleError({hoerror: 2, message: "video index invaild!!!"}, next, res);
                }
                if (list[subIndex-1].match(/&itag=35&/)) {
                    kubo_url = 'http://jaiwen.com/jx/gg58/xml.php?url=gg_' + url + '_gq';
                    api.xuiteDownload(kubo_url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, next, res);
                        }
                        var video_list = raw_data.match(/\!\[CDATA\[[^\]]+/g);
                        if (!video_list) {
                            util.handleError({hoerror: 2, message: "video invaild!!!"}, next, res);
                        }
                        list = [];
                        for (var i in video_list) {
                            list_match = video_list[i].match(/^\!\[CDATA\[([^\]]+)$/);
                            if (list_match) {
                                list.push(list_match[1]);
                            }
                        }
                        if (list.length < 1) {
                            util.handleError({hoerror: 2, message: "video invaild!!!"}, next, res);
                        }
                        if (!list[subIndex-1]) {
                            util.handleError({hoerror: 2, message: "video index invaild!!!"}, next, res);
                        }
                        var ret_obj = {title: id[1], video: [list[subIndex-1]]};
                        if (list.length > 1) {
                            ret_obj['sub'] = list.length;
                        }
                        res.json(ret_obj);
                    }, 60000, false, false, 'http://forum.123kubo.com/jx/gdplayer/ck.php?url=' + url);
                } else {
                    var ret_obj = {title: id[1], video: [list[subIndex-1]]};
                    if (list.length > 1) {
                        ret_obj['sub'] = list.length;
                    }
                    res.json(ret_obj);
                }
            }, 60000, false, false, 'http://forum.123kubo.com/jx/gdplayer/ck.php?url=' + url);
        } else if (id[1] === 'bil') {
            externalTool.bilibiliVideoUrl(url, function(err, title, videoUrl) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, next, res);
                }
                var ret_obj = {title: title, video: [videoUrl]};
                res.json(ret_obj);
            });
        } else {
            youtubedl.getInfo(url, [], function(err, info) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, next, res);
                }
                var ret_obj = {title: info.title, video: []};
                var audio_size = 0;
                if (id[1] === 'you') {
                    if (info.formats) {
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
                    } else {
                        for (var i in info) {
                            if (info[i].format_note === 'DASH audio') {
                                if (!audio_size) {
                                    audio_size = info[i].filesize;
                                    ret_obj['audio'] = info[i].url;
                                } else if (audio_size > info[i].filesize) {
                                    audio_size = info[i].filesize;
                                    ret_obj['audio'] = info[i].url;
                                }
                            } else if (info[i].format_note !== 'DASH video' && (info[i].ext === 'mp4' || info[i].ext === 'webm')) {
                                ret_obj['video'].splice(0, 0, info[i].url);
                            }
                        }
                    }
                } else if (id[1] === 'dym') {
                    console.log(info);
                    if (info.formats) {
                        for (var i in info.formats) {
                            if (info.formats[i].format_id.match(/^(http-)?\d+$/) && (info.formats[i].ext === 'mp4' || info.formats[i].ext === 'webm')) {
                                ret_obj['video'].splice(0, 0, info.formats[i].url);
                            }
                        }
                    } else {
                        for (var i in info) {
                            if (info[i].format_id.match(/^(http-)?\d+$/) && (info[i].ext === 'mp4' || info[i].ext === 'webm')) {
                                ret_obj['video'].splice(0, 0, info[i].url);
                            }
                        }
                    }
                }
                res.json(ret_obj);
            });
        }
    });
});

app.get('/api/external/getSubtitle/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log('external getSingle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.uid.match(/^(you|dym|dri)_(.*)/);
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
        } else if (id[1] === 'dri') {
            url = 'https://drive.google.com/open?id=' + id[2];
            filePath = util.getFileLocation('drive', id_valid);
        /*} else if (id[1] === 'bil') {
            url = 'http://www.bilibili.com/video/' + id[2];
            filePath = util.getFileLocation('bilibili', id_valid);*/
        } else {
            url = 'http://www.youtube.com/watch?v=' + id[2];
            filePath = util.getFileLocation('youtube', id_valid);
        }
        googleApi.googleDownloadSubtitle(url, filePath, function(err) {
            if (err) {
                util.handleError(err, next, res);
            }
            sendWs({type: 'sub', data: id_valid}, 0, 0);
            res.json({apiOK: true});
        });
    });
});

app.post('/api/subtitle/search/:uid/:index(\\d+|v)?', function(req, res, next) {
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
        var id = req.params.uid.match(/^(you|dym|dri|bil|soh|let|vqq|fun|kdr|yuk|tud|fc1)_/);
        if (id) {
            var ex_type = 'youtube';
            if (id[1] === 'dym') {
                ex_type = 'dailymotion';
            } else if (id[1] === 'dri') {
                ex_type = 'drive';
            } else if (id[1] === 'bil') {
                ex_type = 'bilibili';
            } else if (id[1] === 'soh') {
                ex_type = 'sohu';
            } else if (id[1] === 'let') {
                ex_type = 'letv';
            } else if (id[1] === 'vqq') {
                ex_type = 'vqq';
            } else if (id[1] === 'fun') {
                ex_type = 'funshion';
            } else if (id[1] === 'kdr') {
                ex_type = 'kubodrive';
            } else if (id[1] === 'yuk') {
                ex_type = 'youku';
            } else if (id[1] === 'tud') {
                ex_type = 'tudou';
            } else if (id[1] === 'fc1') {
                ex_type = 'funcnd1';
            }
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            filePath = util.getFileLocation(ex_type, id);
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
                if ((items[0].status !== 3 && items[0].status !== 9) || items[0].owner === 'lovetv' || items[0].owner === 'eztv') {
                    util.handleError({hoerror: 2, message: "file type error!!!"}, next, res);
                }
                if (req.params.index) {
                    if (req.params.index === 'v') {
                        for (var i in items[0]['playList']) {
                            if (mime.isVideo(items[0]['playList'][i])) {
                                fileIndex = i;
                                break;
                            }
                        }
                    } else {
                        fileIndex = Number(req.params.index);
                    }
                }
                if (items[0].status === 9 && !mime.isVideo(items[0]['playList'][fileIndex])) {
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
                        var folderPath = path.dirname(filePath);
                        if (!fs.existsSync(folderPath)) {
                            mkdirp(folderPath, function(err) {
                                if(err) {
                                    util.handleError(err, next, res);
                                }
                                SUB2VTT(sub_url, filePath, false, function(err) {
                                    if (err) {
                                        util.handleError(err, next, res);
                                    }
                                    sendWs({type: 'sub', data: id}, 0, 0);
                                    res.json({apiOK: true});
                                });
                            });
                        } else {
                            SUB2VTT(sub_url, filePath, false, function(err) {
                                if (err) {
                                    util.handleError(err, next, res);
                                }
                                sendWs({type: 'sub', data: id}, 0, 0);
                                res.json({apiOK: true});
                            });
                        }
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
                                sendWs({type: 'sub', data: id}, 0, 0);
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
                                        sendWs({type: 'sub', data: id}, 0, 0);
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
                                                    sendWs({type: 'sub', data: id}, 0, 0);
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
                                                            sendWs({type: 'sub', data: id}, 0, 0);
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
                                                                        sendWs({type: 'sub', data: id}, 0, 0);
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
                                                        sendWs({type: 'sub', data: id}, 0, 0);
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
                                sendWs({type: 'sub', data: id}, 0, 0);
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
            if (!choose_subtitle) {
                util.handleError({hoerror: 2, message: "donot have sub!!!"}, next, callback);
            }
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

app.get('/api/download2drive/:uid', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('download file 2 drive');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = util.isValidString(req.params.uid, 'uid');
        if (id === false) {
            util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
        }
        mongo.orig("find", "user", {_id: req.user._id}, {limit: 1}, function(err, userlist) {
            if (err) {
                util.handleError(err, next, res);
            }
            if (userlist.length < 1) {
                util.handleError({hoerror: 2, message: "do not find user!!!"}, next, res);
            }
            if (!userlist[0].auto) {
                util.handleError({hoerror: 2, message: "user dont have google drive!!!"}, next, res);
            }
            mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length < 1) {
                    util.handleError({hoerror: 2, message: "cannot find file!!!"}, next, res);
                }
                if (items[0].status === 7 || items[0].status === 8 || items[0].thumb) {
                    util.handleError({hoerror: 2, message: "file cannot downlad!!!"}, next, res);
                }
                var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                var downloaded = null;
                var downloaded_data = {folderId: userlist[0].auto, name: 'downloaded'};
                googleApi.googleApi('list folder', downloaded_data, function(err, downloadedList) {
                    if (err) {
                        util.handleError(err, next, res);
                    }
                    if (downloadedList.length < 1) {
                        util.handleError({hoerror: 2, message: "do not have downloaded folder!!!"}, next, res);
                    }
                    downloaded = downloadedList[0].id;
                    res.json({apiOK: true});
                    var data = {type: 'auto', name: items[0].name, filePath: filePath, parent: downloaded};
                    if (items[0].status === 9) {
                        if (items[0]['playList'].length > 0) {
                            var comPath = null;
                            var folderArr = [];
                            var fileArr = [];
                            var dirname = null;
                            var isExist = false;
                            var tempArr = null;
                            for (var i in items[0]['playList']) {
                                comPath = filePath + '/' + i + '_complete';
                                if (fs.existsSync(comPath)) {
                                    dirname = path.dirname(items[0]['playList'][i]);
                                    fileArr.push({name: path.basename(items[0]['playList'][i]), filePath: comPath, parent: dirname});
                                    for (;dirname !== '.';dirname = path.dirname(dirname)) {
                                        isExist = false;
                                        for (var j in folderArr) {
                                            if (folderArr[j].key === dirname) {
                                                isExist = true;
                                                tempArr = folderArr.splice(j, 1);
                                                folderArr.splice(0, 0, tempArr[0]);
                                                break;
                                            }
                                        }
                                        if (!isExist) {
                                            folderArr.splice(0, 0, {key: dirname, name: path.basename(dirname), parent: path.dirname(dirname)});
                                        }
                                    }
                                }
                            }
                            console.log(fileArr);
                            console.log(folderArr);
                            if (folderArr.length > 0) {
                                recur_upload(0, 'folder');
                            } else if (fileArr.length > 0) {
                                recur_upload(0, 'file');
                            } else {
                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                            }
                            function recur_upload(index, type) {
                                if (type === 'folder') {
                                    if (folderArr[index].parent === '.') {
                                        googleApi.googleApi('create', {name: folderArr[index].name, parent: downloaded}, function(err, metadata) {
                                            if (err) {
                                                util.handleError(err);
                                                sendWs({type: req.user.username, data: 'save to drive fail: ' + err.message}, 0);
                                            } else {
                                                console.log(metadata);
                                                folderArr[index].id = metadata.id;
                                            }
                                            index++;
                                            if (index < folderArr.length) {
                                                recur_upload(index, 'folder');
                                            } else if (fileArr.length > 0) {
                                                recur_upload(0, 'file');
                                            } else {
                                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                                            }
                                        });
                                    } else {
                                        for (var i in folderArr) {
                                            if (folderArr[index].parent === folderArr[i].key) {
                                                break;
                                            }
                                        }
                                        if (folderArr[i].id) {
                                            googleApi.googleApi('create', {name: folderArr[index].name, parent: folderArr[i].id}, function(err, metadata) {
                                                if (err) {
                                                    util.handleError(err);
                                                    sendWs({type: req.user.username, data: 'save to drive fail: ' + err.message}, 0);
                                                } else {
                                                    console.log(metadata);
                                                    folderArr[index].id = metadata.id;
                                                }
                                                index++;
                                                if (index < folderArr.length) {
                                                    recur_upload(index, 'folder');
                                                } else if (fileArr.length > 0) {
                                                    recur_upload(0, 'file');
                                                } else {
                                                    sendWs({type: req.user.username, data: 'save complete'}, 0);
                                                }
                                            });
                                        } else {
                                            util.handleError({hoerror: 2, message: "do not find parent!!!"});
                                            sendWs({type: req.user.username, data: 'save to drive fail: do not find parent!!!'}, 0);
                                            index++;
                                            if (index < folderArr.length) {
                                                recur_upload(index, 'folder');
                                            } else if (fileArr.length > 0) {
                                                recur_upload(0, 'file');
                                            } else {
                                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                                            }
                                        }
                                    }
                                } else if (type === 'file') {
                                    if (fileArr[index].parent === '.') {
                                        data['name'] = fileArr[index].name;
                                        data['filePath'] = fileArr[index].filePath;
                                        data['parent'] = downloaded;
                                        googleApi.googleApi('upload', data, function(err, metadata) {
                                            if (err) {
                                                util.handleError(err);
                                                sendWs({type: req.user.username, data: 'save to drive fail: ' + err.message}, 0);
                                            } else {
                                                console.log(metadata);
                                                console.log('done');
                                            }
                                            index++;
                                            if (index < fileArr.length) {
                                                recur_upload(index, 'file');
                                            } else {
                                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                                            }
                                        });
                                    } else {
                                        for (var i in folderArr) {
                                            if (fileArr[index].parent === folderArr[i].key) {
                                                break;
                                            }
                                        }
                                        if (folderArr[i].id) {
                                            data['name'] = fileArr[index].name;
                                            data['filePath'] = fileArr[index].filePath;
                                            data['parent'] = folderArr[i].id;
                                            googleApi.googleApi('upload', data, function(err, metadata) {
                                                if (err) {
                                                    util.handleError(err);
                                                    sendWs({type: req.user.username, data: 'save to drive fail: ' + err.message}, 0);
                                                } else {
                                                    console.log(metadata);
                                                }
                                                index++;
                                                if (index < fileArr.length) {
                                                    recur_upload(index, 'file');
                                                } else {
                                                    sendWs({type: req.user.username, data: 'save complete'}, 0);
                                                }
                                            });
                                        } else {
                                            util.handleError({hoerror: 2, message: "do not find parent!!!"});
                                            sendWs({type: req.user.username, data: 'save to drive fail: do not find parent!!!'}, 0);
                                            index++;
                                            if (index < fileArr.length) {
                                                recur_upload(index, 'file');
                                            } else {
                                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            sendWs({type: req.user.username, data: 'save complete'}, 0);
                        }
                    } else {
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err);
                                sendWs({type: req.user.username, data: 'save to drive fail: ' + err.message}, 0);
                            } else {
                                console.log(metadata);
                                console.log('done');
                                sendWs({type: req.user.username, data: 'save complete'}, 0);
                            }
                        });
                    }
                });
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

app.get('/api/torrent/all/download/:uid', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent all downlad");
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
                util.handleError({hoerror: 2, message: 'torrent can not be fund!!!'}, next, res);
            }
            var filePath = util.getFileLocation(items[0].owner, items[0]._id);
            var bufferPath = null;
            var comPath = null;
            var errPath = null;
            var queueItems = [];
            for (var i in items[0]['playList']) {
                bufferPath = filePath + '/' + i;
                comPath = bufferPath + '_complete';
                errPath = bufferPath + '_error';
                if (fs.existsSync(comPath)) {
                    continue;
                } else if (fs.existsSync(errPath)) {
                    continue;
                } else {
                    queueItems.push(i);
                }
            }
            if (queueItems.length > 0) {
                console.log(queueItems);
                res.json({complete: false});
                recur_queue(0, 1);
                function recur_queue(index, pType) {
                    queueTorrent('add', req.user, decodeURIComponent(items[0]['magnet']), queueItems[index], items[0]._id, items[0].owner, pType);
                    index++;
                    if (index < queueItems.length) {
                        setTimeout(function(){
                            recur_queue(index, 2);
                        }, 1000);
                    }
                }
            } else {
                res.json({complete: true});
            }
        });
    });
});

//只有torent check跟torrent有v, sub沒有
app.get('/api/torrent/check/:uid/:index(\\d+|v)/:size(\\d+)', function(req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent check");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var fileIndex = 0;
        if (req.params.index.match(/^\d+$/)) {
            fileIndex = Number(req.params.index);
        }
        var bufferSize = Number(req.params.size);
        var id = req.params.uid.match(/^(dri|fc1)_/);
        if (id) {
            var id_type = id[1];
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            var filePath = util.getFileLocation('drive', id);
            if (id_type === 'fc1') {
                filePath = util.getFileLocation('funcnd1', id);
            }
            var bufferPath = filePath + '/' + fileIndex;
            var comPath = bufferPath + '_complete';
            var errPath = bufferPath + '_error';
            if (fs.existsSync(errPath)) {
                util.handleError({hoerror: 2, message: 'torrent video error!!!'}, next, res);
            }
            var newBuffer = false;
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
                bufferExternal();
            } else {
                res.json({start: true});
                bufferExternal();
            }
            function bufferExternal() {
                if (external_pool.indexOf(id) === -1) {
                    external_pool.push(id);
                    console.log(external_pool);
                    var dri_id = req.params.uid.match(/^dri_(.*)$/);
                    if (dri_id) {
                        console.log(bufferPath);
                        if (!fs.existsSync(filePath)) {
                            mkdirp(filePath, function(err) {
                                if(err) {
                                    util.handleError(err);
                                    sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                } else {
                                    startBuffer();
                                }
                            });
                        } else {
                            startBuffer();
                        }
                        function startBuffer() {
                            var bufferP = youtubedl('https://drive.google.com/open?id=' + dri_id[1], [], {cwd: filePath});
                            bufferP.on('info', function(info) {
                                console.log('Download started');
                                console.log('filename: ' + info._filename);
                                console.log('size: ' + info.size);
                            });
                            bufferP.pipe(fs.createWriteStream(bufferPath));
                            bufferP.on('end', function() {
                                console.log('finished downloading!');
                                fs.rename(bufferPath, comPath, function(err) {
                                    if (err) {
                                        util.handleError(err);
                                        sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                    }
                                    external_pool.splice(external_pool.indexOf(id), 1);
                                    console.log(external_pool);
                                });
                            });
                        }
                    } else {
                        var fc1_id = req.params.uid.match(/^fc1_(.*)$/);
                        if (fc1_id) {
                            console.log(bufferPath);
                            if (!fs.existsSync(filePath)) {
                                mkdirp(filePath, function(err) {
                                    if(err) {
                                        util.handleError(err);
                                        sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                    } else {
                                        startBuffer2();
                                    }
                                });
                            } else {
                                startBuffer2();
                            }
                            function startBuffer2() {
                                var url = 'http://www.123kubo.com/happymonkey/GetPlayInfo.php?url=FunCnd1_' + fc1_id[1];
                                api.xuiteDownload(url, '', function(err, data) {
                                    if(err) {
                                        util.handleError(err);
                                        sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                    } else {
                                        data = decodeURIComponent(data);
                                        data = data.substr(7);
                                        var arr = data.split('?');
                                        var arr2 = arr[0].split('/');
                                        var d = [];
                                        for(var i = 0;i<arr2.length;i++){
                                            if(arr2[i] !== '.') {
                                                d.push(encodeURIComponent(arr2[i]));
                                            }
                                        }
                                        var videoUrl = 'http://' + d.join('/') + '?' + arr[1];
                                        console.log(videoUrl);
                                        api.xuiteDownload(videoUrl, bufferPath, function(err) {
                                            if(err) {
                                                util.handleError(err);
                                                sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                            } else {
                                                console.log('finished downloading!');
                                                fs.rename(bufferPath, comPath, function(err) {
                                                    if (err) {
                                                        util.handleError(err);
                                                        sendWs({type: req.user.username, data: 'buffer fail: ' + err.message}, 0);
                                                    }
                                                    external_pool.splice(external_pool.indexOf(id), 1);
                                                    console.log(external_pool);
                                                });
                                            }
                                        }, 60000, true, true, 'http://www.123kubo.com/happymonkey/?url=FunCnd1_' + fc1_id[1]);
                                    }
                                }, 60000, false, false, 'http://www.123kubo.com/happymonkey/?url=FunCnd1_' + fc1_id[1]);
                            }
                        } else {
                            console.log('drive id invalid');
                            console.log(req.params.uid);
                            sendWs({type: req.user.username, data: 'buffer fail: drive id invalid'}, 0);
                        }
                    }
                } else {
                    console.log('already buffering');
                }
            }
        } else {
            id = util.isValidString(req.params.uid, 'uid');
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
                if (req.params.index === 'v') {
                    for (var i in items[0]['playList']) {
                        if (mime.isVideo(items[0]['playList'][i])) {
                            fileIndex = i;
                            break;
                        }
                    }
                }
                var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                var bufferPath = filePath + '/' + fileIndex;
                var realPath = filePath + '/real/' + items[0]['playList'][fileIndex];
                var comPath = bufferPath + '_complete';
                var errPath = bufferPath + '_error';
                if (fs.existsSync(errPath)) {
                    util.handleError({hoerror: 2, message: 'torrent video error!!!'}, next, res);
                }
                var newBuffer = false;
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
                    queueTorrent('add', req.user, decodeURIComponent(items[0]['magnet']), fileIndex, items[0]._id, items[0].owner);
                } else {
                    res.json({start: true});
                    queueTorrent('add', req.user, decodeURIComponent(items[0]['magnet']), fileIndex, items[0]._id, items[0].owner);
                }
            });
        }
    });
});

function queueTorrent(action, user, torrent, fileIndex, id, owner, pType) {
    console.log(torrent_pool.length);
    var shortTorrent = null;
    var realPath = null;
    var bufferPath = null;
    var comPath = null;
    var engine = null;
    switch (action) {
        case 'add':
        console.log('torrent add');
        console.log(fileIndex);
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
                    if (torrent_pool[i].engine.files && torrent_pool[i].engine.files[fileIndex]) {
                        if (pType) {
                            if (pType === 1) {
                                var percent = 0;
                                var totalDSize = 0;
                                var totalSize = 0;
                                var DPath = null;
                                var CDPath = null;
                                var filename = 'Playlist torrent';
                                for (var j in torrent_pool[i].engine.files) {
                                    DPath = filePath + '/' + j;
                                    CDPath = DPath + '_complete';
                                    totalSize += torrent_pool[i].engine.files[j].length;
                                    if (fs.existsSync(CDPath)) {
                                        totalDSize += torrent_pool[i].engine.files[j].length;
                                    } else if (fs.existsSync(DPath)) {
                                        totalDSize += fs.statSync(DPath).size;
                                    }
                                }
                                if (totalSize > 0) {
                                    percent = Math.ceil(totalDSize/totalSize*100);
                                }
                                if (torrent_pool[i].engine.torrent.name) {
                                    filename = 'Playlist ' + torrent_pool[i].engine.torrent.name;
                                }
                                sendWs({type: user.username, data: filename + ': ' + percent + '%'}, 0);
                            }
                        } else {
                            var percent = 0;
                            if (fs.existsSync(bufferPath)) {
                                if (torrent_pool[i].engine.files[fileIndex].length > 0) {
                                    percent = Math.ceil(fs.statSync(bufferPath).size/torrent_pool[i].engine.files[fileIndex].length*100);
                                }
                            }
                            sendWs({type: user.username, data: torrent_pool[i].engine.files[fileIndex].path + ': ' + percent + '%'}, 0);
                        }
                    }
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
        if (!shortTorrent) {
            return false;
        }
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
            return true;
        } else {
            return false;
        }
        break;
        case 'stop':
        console.log('torrent stop');
        if (user) {
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
        } else {
            if (torrent_pool[torrent].engine) {
                torrent_pool[torrent].engine.destroy();
            }
            for (var j in torrent_pool) {
                if (torrent_pool[j].hash === torrent_pool[torrent].hash) {
                    torrent_pool.splice(j, 1);
                    break;
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
                    console.log('torrent real start');
                    console.log(bufferPath);
                    if (fs.existsSync(bufferPath)) {
                        console.log(fs.statSync(bufferPath).size);
                        if (fs.statSync(bufferPath).size >= file.length) {
                            torrentComplete(1, file.path);
                        } else {
                            console.log(fs.statSync(bufferPath).size);
                            console.log(bufferPath);
                            var fileStream = file.createReadStream({start: fs.statSync(bufferPath).size});
                            fileStream.pipe(fs.createWriteStream(bufferPath, {flags: 'a'}));
                            fileStream.on('end', function() {
                                torrentComplete(1, file.path);
                            });
                        }
                    } else {
                        var videoInfo = mime.isVideo(file.name);
                        if (videoInfo) {
                            console.log(bufferPath);
                            oth.computeHash(fileIndex, engine, function(err, hash_ret) {
                                if (err) {
                                    sendWs({type: user.username, data: 'buffer fail: ' + err.message}, 0);
                                    util.handleError(err);
                                    torrentComplete(10);
                                } else {
                                    console.log(hash_ret);
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
                                                            sendWs({type: 'sub', data: id}, 0, 0);
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
                                        torrentComplete(1, file.path);
                                    });
                                }
                            });
                        } else {
                            var fileStream = file.createReadStream();
                            fileStream.pipe(fs.createWriteStream(bufferPath));
                            fileStream.on('end', function() {
                                torrentComplete(1, file.path);
                            });
                        }
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
                    engine_del();
                    var videoInfo = mime.isVideo(exitPath);
                    if (videoInfo) {
                        //上傳drive
                        var dbName = path.basename(exitPath);
                        var dbPath = realPath + '/' + exitPath;
                        mediaHandleTool.handleTag(dbPath, {}, dbName, '', 0, function(err, mediaType, mediaTag, DBdata) {
                            if (err) {
                                util.handleError(err);
                            } else {
                                mediaType['fileIndex'] = fileIndex;
                                mediaType['realPath'] = exitPath;
                                DBdata['status'] = 9;
                                delete DBdata['mediaType'];
                                DBdata['mediaType.' + fileIndex] = mediaType;
                                console.log(DBdata);
                                mongo.orig("update", "storage", { _id: id }, {$set: DBdata}, function(err, item2){
                                    if(err) {
                                        util.handleError(err);
                                    } else {
                                        var dbStats = fs.statSync(dbPath);
                                        mediaHandleTool.handleMediaUpload(mediaType, filePath, id, dbName, dbStats['size'], user, function(err) {
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
                    }/* else {
                        fs.unlink(comPath, function(err) {
                            if (err) {
                                util.handleError(err);
                            } else {
                                fs.rename(realPath + '/' + exitPath, comPath, function(err) {
                                    if (err) {
                                        util.handleError(err);
                                    } else {
                                        console.log('delete real');
                                    }
                                });
                            }
                        });
                    }*/
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

app.get('/torrent/:index(\\d+|v)/:uid/:fresh(0+)?', function (req, res, next) {
    checkLogin(req, res, next, function(req, res, next) {
        console.log("torrent");
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var fileIndex = 0;
        if (req.params.index.match(/^\d+$/)) {
            fileIndex = Number(req.params.index);
        }
        var id = req.params.uid.match(/^(dri|fc1)_/);
        if (id) {
            var id_type = id[1];
            id = util.isValidString(req.params.uid, 'name');
            if (id === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            var filePath = util.getFileLocation('drive', id);
            if (id_type === 'fc1') {
                filePath = util.getFileLocation('funcnd1', id);
            }
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
        } else {
            id = util.isValidString(req.params.uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, res);
            }
            mongo.orig("find", "storage", {_id: id}, {limit: 1}, function(err, items) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (items.length === 0) {
                    util.handleError({hoerror: 2, message: 'torrent can not be fund!!!'}, next, res);
                }
                if (req.params.index === 'v') {
                    for (var i in items[0]['playList']) {
                        if (mime.isVideo(items[0]['playList'][i])) {
                            fileIndex = i;
                            break;
                        }
                    }
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
        }
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

app.get('/subtitle/:uid/:index(\\d+|v)?/:fresh(0+)?', function(req, res, next){
    checkLogin(req, res, next, function(req, res, next) {
        console.log('subtitle');
        console.log(new Date());
        console.log(req.url);
        console.log(req.body);
        var id = req.params.uid.match(/^(you|dym|dri|bil|soh|let|vqq|fun|kdr|yuk|tud|fc1)_/);
        if (id) {
            var id_valid = util.isValidString(req.params.uid, 'name');
            if (id_valid === false) {
                util.handleError({hoerror: 2, message: "external is not vaild"}, next, res);
            }
            var filePath = null;
            if (id[1] === 'dym') {
                filePath = util.getFileLocation('dailymotion', id_valid);
            } else if (id[1] === 'dri') {
                filePath = util.getFileLocation('drive', id_valid);
            } else if (id[1] === 'bil') {
                filePath = util.getFileLocation('bilibili', id_valid);
            } else if (id[1] === 'soh') {
                filePath = util.getFileLocation('sohu', id_valid);
            } else if (id[1] === 'let') {
                filePath = util.getFileLocation('letv', id_valid);
            } else if (id[1] === 'vqq') {
                filePath = util.getFileLocation('vqq', id_valid);
            } else if (id[1] === 'fun') {
                filePath = util.getFileLocation('funshion', id_valid);
            } else if (id[1] === 'kdr') {
                filePath = util.getFileLocation('kubodrive', id_valid);
            } else if (id[1] === 'yuk') {
                filePath = util.getFileLocation('youku', id_valid);
            } else if (id[1] === 'tud') {
                filePath = util.getFileLocation('tudou', id_valid);
            } else if (id[1] === 'fc1') {
                filePath = util.getFileLocation('funcnd1', id_valid);
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
                        if (req.params.index === 'v') {
                            for (var i in items[0]['playList']) {
                                if (mime.isVideo(items[0]['playList'][i])) {
                                    fileIndex = i;
                                    break;
                                }
                            }
                        } else {
                            fileIndex = Number(req.params.index);
                        }
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
                if (items[0].status === 7 || items[0].status === 8 || items[0].thumb) {
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
                if (!util.checkAdmin(1, req.user) && (!util.isValidString(items[0].owner, 'uid') || !req.user._id.equals(items[0].owner))) {
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
                if (items[0].status === 7 || items[0].status === 8 || items[0].thumb) {
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
                case 'act':
                    if (!items[0].mediaType) {
                        util.handleError({hoerror: 2, message: "this file is not media!!!"}, next, res);
                    }
                    var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                    if (items[0].mediaType.type) {
                        res.json({apiOK: true});
                        if(items[0].mediaType.key) {
                            mediaHandleTool.handleMedia(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].mediaType.key, req.user, function (err) {
                                sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                if (err) {
                                    util.handleError(err);
                                }
                                console.log('transcode done');
                                console.log(new Date());
                            });
                        } else {
                            mediaHandleTool.handleMediaUpload(items[0].mediaType, filePath, items[0]._id, items[0].name, items[0].size, req.user, function (err) {
                                sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                if (err) {
                                    util.handleError(err);
                                }
                                console.log('transcode done');
                                console.log(new Date());
                            });
                        }
                    } else {
                        var dbStats = null;
                        var dbName = null;
                        var handleItems = [];
                        for (var i in items[0].mediaType) {
                            if (fs.existsSync(filePath + '/' + items[0].mediaType[i]['fileIndex'] + '_complete')) {
                                handleItems.push(items[0].mediaType[i]);
                            }
                        }
                        if (handleItems.length < 1) {
                            util.handleError({hoerror: 2, message: "need complete first"}, next, res);
                        }
                        res.json({apiOK: true});
                        recur_handle(0);
                        function recur_handle(index) {
                            if(handleItems[index].key) {
                                mediaHandleTool.handleMedia(handleItems[index], filePath, items[0]._id, items[0].name, handleItems[index].key, req.user, function (err) {
                                    sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                    if (err) {
                                        util.handleError(err);
                                    }
                                    console.log('transcode done');
                                    console.log(new Date());
                                });
                            } else {
                                dbStats = fs.statSync(filePath + '/real/' + handleItems[index]['realPath']);
                                dbName = path.basename(handleItems[index]['realPath']);
                                mediaHandleTool.handleMediaUpload(handleItems[index], filePath, items[0]._id, dbName, dbStats['size'], req.user, function (err) {
                                    sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                    if (err) {
                                        util.handleError(err);
                                    }
                                    console.log('transcode done');
                                    console.log(new Date());
                                });
                            }
                            index++;
                            if (index < handleItems.length) {
                                setTimeout(function(){
                                    recur_handle(index);
                                }, 30000);
                            }
                        }
                    }
                    break;
                case 'del':
                    if (items[0].mediaType.type) {
                        res.json({apiOK: true});
                        mediaHandleTool.completeMedia(items[0]._id, 0, function (err) {
                            sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                            if (err) {
                                util.handleError(err);
                            }
                            console.log('delete media done');
                        });
                    } else {
                        var filePath = util.getFileLocation(items[0].owner, items[0]._id);
                        var rmPath = null;
                        var handleItems = [];
                        for (var i in items[0].mediaType) {
                            if (fs.existsSync(filePath + '/' + items[0].mediaType[i]['fileIndex'] + '_complete')) {
                                handleItems.push(items[0].mediaType[i]);
                            }
                        }
                        if (handleItems.length < 1) {
                            util.handleError({hoerror: 2, message: "need complete first"}, next, res);
                        }
                        res.json({apiOK: true});
                        recur_del(0);
                        function recur_del(index) {
                            rmPath = filePath + '/real/' + handleItems[index]['realPath'];
                            mediaHandleTool.completeMedia(items[0]._id, 0, function (err) {
                                sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
                                if (err) {
                                    util.handleError(err);
                                }
                                console.log('delete media done');
                            }, rmPath, handleItems[index]['fileIndex']);
                            index++;
                            if (index < handleItems.length) {
                                setTimeout(function(){
                                    recur_del(index);
                                }, 30000);
                            }
                        }
                    }
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

if (config_glb.autoDownload) {
    setTimeout(function() {
        loopDoc();
        setInterval(function(){
            console.log('loop Doc');
            console.log(doc_time);
            var now_time = new Date().getTime();
            if (doc_time === 1 || (now_time - doc_time) > doc_interval) {
                loopDoc();
            }
        }, doc_interval);
    }, 120000);
}

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
    }, 240000);
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
    }, 300000);
}

if (config_glb.checkMedia) {
    setTimeout(function() {
        loopHandleMedia();
        setInterval(function(){
            console.log('loop checkMedia');
            console.log(media_time);
            var now_time = new Date().getTime();
            if (media_time === 1 || (now_time - media_time) > media_interval) {
                loopHandleMedia();
            }
        }, media_interval);
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
        for (var i in mediaTag.opt) {
            if (item.tags.indexOf(mediaTag.opt[i]) === -1) {
                temp_tag.push(mediaTag.opt[i]);
            }
        }
        if (!util.checkAdmin(1, user)) {
            var index_tag = -1;
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

function loopHandleMedia() {
    console.log('loopCheckMedia');
    console.log(new Date());
    media_time = new Date().getTime();
    var kick_time = Math.round((media_time - torrent_duration)/ 1000);
    for (var i in torrent_pool) {
        if (torrent_pool[i].time < kick_time) {
            queueTorrent('stop', null, i);
            break;
        }
    }
    mediaHandleTool.checkMedia(function(err) {
        if (err) {
            util.handleError(err);
            media_time = 1;
            console.log('loopCheckMedia end');
        } else {
            media_time = 1;
            console.log('loopCheckMedia end');
            console.log(new Date());
        }
    });
}

function loopUpdateExternal() {
    console.log('loopUpdateExternal');
    console.log(new Date());
    external_time = new Date().getTime();
    console.log('lovetv');
    externalTool.getList('lovetv', function(err) {
        if (err) {
            util.handleError(err);
            external_time = 1;
            console.log('loopUpdateExternal end');
        } else {
            console.log('eztv');
            console.log(new Date());
            externalTool.getList('eztv', function(err) {
                if (err) {
                    util.handleError(err);
                    external_time = 1;
                    console.log('loopUpdateExternal end');
                } else {
                    external_time = 1;
                    console.log('loopUpdateExternal end');
                    console.log(new Date());
                }
            });
        }
    });
}

function loopUpdateStock() {
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

function loopDrive() {
    console.log('loopDrive');
    console.log(new Date());
    drive_time.time = new Date().getTime();
    drive_time.size = 0;
    mongo.orig("find", "user", {auto: {$exists: true}}, function(err, userlist){
        if(err) {
            util.handleError(err);
            drive_time.time = 1;
            drive_time.size = 0;
            console.log('loopDrive end');
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
}

function loopDoc() {
    console.log('loopDoc');
    console.log(new Date());
    doc_time = new Date().getTime();
    mongo.orig("find", "user", {auto: {$exists: true}, perm: 1}, function(err, userlist){
        if(err) {
            util.handleError(err);
            doc_time = 1;
            console.log('loopDoc end');
        } else {
            autoDoc(userlist, 0, function(err) {
                if(err) {
                    util.handleError(err);
                }
                doc_time = 1;
                console.log('loopDoc end');
            });
        }
    });
}

function autoDoc(userlist, index, callback) {
    doc_time = new Date().getTime();
    console.log('autoDoc');
    console.log(new Date());
    console.log(userlist[index].username);
    var downloaded = null;
    var downloaded_data = {folderId: userlist[index].auto, name: 'downloaded'};
    googleApi.googleApi('list folder', downloaded_data, function(err, downloadedList) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        if (downloadedList.length < 1) {
            util.handleError({hoerror: 2, message: "do not have downloaded folder!!!"}, callback, callback);
        }
        downloaded = downloadedList[0].id;
        var downloadTime = new Date();
        var doc_type_0 = ['bls', 'cen', 'bea', 'ism', 'cbo', 'sem', 'oec', 'dol', 'rea', 'sca', 'fed'];
        var doc_type_1 = ['sea'];
        var doc_type_2 = ['tri', 'ndc', 'sta', 'mof', 'moe', 'cbc'];
        function download_ext_doc(tIndex, doc_type) {
            externalTool.getSingleList(doc_type[tIndex], '', function(err, doclist) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                console.log(doclist);
                recur_download(0);
                function recur_download(dIndex) {
                    if (dIndex < doclist.length) {
                        externalTool.save2Drive(doc_type[tIndex], doclist[dIndex], downloaded, function(err) {
                            if (err) {
                                util.handleError(err);
                            }
                            dIndex++;
                            if (dIndex < doclist.length) {
                                recur_download(dIndex);
                            } else {
                                tIndex++;
                                if (tIndex < doc_type.length) {
                                    download_ext_doc(tIndex, doc_type);
                                } else {
                                    index++;
                                    if (index < userlist.length) {
                                        autoDoc(userlist, index, callback);
                                    } else {
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    }
                                }
                            }
                        });
                    } else {
                        tIndex++;
                        if (tIndex < doc_type.length) {
                            download_ext_doc(tIndex, doc_type);
                        } else {
                            index++;
                            if (index < userlist.length) {
                                autoDoc(userlist, index, callback);
                            } else {
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            }
                        }
                    }
                }
            });
        }
        if (downloadTime.getHours() === 11) {
            download_ext_doc(0, doc_type_0);
        } else if (downloadTime.getHours() === 17) {
            download_ext_doc(0, doc_type_1);
        } else if (downloadTime.getHours() === 18) {
            download_ext_doc(0, doc_type_2);
        } else {
            index++;
            if (index < userlist.length) {
                autoDoc(userlist, index, callback);
            } else {
                setTimeout(function(){
                    callback(null);
                }, 0);
            }
        }
    });
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
                                            if (folder_metadataList[i].title !== 'uploaded' && folder_metadataList[i].title !== 'downloaded') {
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
                                                if (folder_metadataList[i].title !== 'uploaded' && folder_metadataList[i].title !== 'downloaded') {
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
                                if (folder_metadataList[i].title !== 'uploaded' && folder_metadataList[i].title !== 'downloaded') {
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