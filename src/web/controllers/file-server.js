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

var mime = require('../util/mime.js');

var http = require('http'),
    https = require('https'),
    privateKey  = fs.readFileSync(config_type.privateKey, 'utf8'),
    certificate = fs.readFileSync(config_type.certificate, 'utf8'),
    credentials = {key: privateKey, cert: certificate},
    express = require('express'),
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express(),
    server = https.createServer(credentials, app),
    child_process = require('child_process'),
    mkdirp = require('mkdirp'),
    //port = 443,
    serverHttp = http.createServer(app),
    Transcoder = require('stream-transcoder'),
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
                        //sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
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
                            //sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
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

server.listen(config_glb.file_port, config_glb.file_ip);

serverHttp.listen(config_glb.file_http_port, config_glb.file_ip);

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
                    if (!DBdata['height'] && !DBdata['time']) {
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
                                        DBdata['height'] = meta.input.streams[i].size.height;
                                        break;
                                    }
                                }
                                mediaTag = mime.mediaTag(mediaType['type']);
                                if (!isVideo && mediaType['type'] === 'music') {
                                    DBdata['status'] = 4;
                                    mediaType = false;
                                } else if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                    mediaType['time'] = DBdata['time'] = meta.input.duration;
                                    DBdata['status'] = 1;
                                    if (mediaType['time'] < 20 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 2));
                                    } else if (mediaType['time'] < 40 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                    } else if (mediaType['time'] < 60 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(6, 1));
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
                    } else {
                        if (DBdata['height']) {
                            if (DBdata['height'] >= 1080) {
                                if (mediaType['type'] === 'vlog') {
                                    mediaType['hd'] = 1;
                                } else {
                                    mediaType['hd'] = 1080;
                                }
                            } else if (DBdata['height'] >= 720) {
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
                        if (DBdata['time']) {
                            mediaTag = mime.mediaTag(mediaType['type']);
                            if (!isVideo && mediaType['type'] === 'music') {
                                DBdata['status'] = 4;
                                mediaType = false;
                            } else if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                mediaType['time'] = DBdata['time'];
                                DBdata['status'] = 1;
                                if (mediaType['time'] < 20 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 2));
                                } else if (mediaType['time'] < 40 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                } else if (mediaType['time'] < 60 * 60 * 1000) {
                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(6, 1));
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
                    }
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
                        if (!DBdata['height'] && !DBdata['time']) {
                            new Transcoder(filePath)
                            .on('metadata', function(meta) {
                                console.log(meta);
                                for (var i in meta.input.streams) {
                                    if (meta.input.streams[i].size) {
                                        DBdata['height'] = meta.input.streams[i].size.height;
                                        isVideo = true;
                                        break;
                                    }
                                }
                                if (meta.input.streams) {
                                    if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                        if (meta.input.duration < 20 * 60 * 1000) {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 2));
                                        } else if (meta.input.duration < 40 * 60 * 1000) {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                        } else if (meta.input.duration < 60 * 60 * 1000) {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(6, 1));
                                        }
                                        DBdata['time'] = meta.input.duration;
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
                        } else {
                            if (DBdata['height']) {
                                isVideo = true;
                            }
                            if (DBdata['time']) {
                                if (isVideo && (mediaType['type'] === 'video' || mediaType['type'] === 'vlog')) {
                                    if (DBdata['time'] < 20 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(7, 2));
                                    } else if (DBdata['time'] < 40 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 3));
                                    } else if (DBdata['time'] < 60 * 60 * 1000) {
                                        mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(6, 1));
                                    }
                                }
                            }
                            mediaType = false;
                            setTimeout(function(){
                                callback(null, mediaType, mediaTag, DBdata);
                            }, 0);
                        }
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
                if (zip_ext === 'rar' || zip_ext === 'cbr') {
                    cmdline = 'unrar x ' + filePath + ' ' + filePath + '_img/temp';
                } else if (zip_ext === '7z') {
                    cmdline = '7za x ' + filePath + ' -o' + filePath + '_img/temp';
                }
                var folder = null;
                var sub_folder = null;
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
                            if(fs.lstatSync(curPath).isDirectory()) {
                                if (!sub_folder) {
                                    sub_folder = file;
                                }
                            } else {
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
                        if (sub_folder) {
                            fs.readdirSync(filePath + '_img/temp/' + folder + '/' + sub_folder).forEach(function(file,index){
                                var curPath = filePath + '_img/temp/' + folder + '/' + sub_folder + '/' + file;
                                if(!fs.lstatSync(curPath).isDirectory()) {
                                    var ext = mime.isImage(file);
                                    if (ext) {
                                        var zip_number = file.match(/\d+/g);
                                        if (!zip_number) {
                                            zip_number = [];
                                        }
                                        zip_arr.push({name: folder + '/' + sub_folder + '/' + file, ext: ext, number: zip_number});
                                    }
                                }
                            });
                        }
                    }
                    //只比較前面數字
                    var sort_result = zip_arr.sort(function(a, b) {
                        if (a.number.length > 0) {
                            for (var i in a.number) {
                                if (!b.number[i]) {
                                    return 1;
                                }
                                if (Number(a.number[i]) !== Number(b.number[i])) {
                                    return Number(a.number[i]) - Number(b.number[i]);
                                }
                            }
                            return -1;
                        } else {
                            return -1;
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
                handleTag(filePath, {utime: time, untag: 1, time: items[0].time, height: items[0].height}, newName, items[0].name, items[0].status, function(err, mediaType, mediaTag, DBdata) {
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
                            //sendWs({type: 'file', data: items[0]._id}, items[0].adultonly);
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

console.log('start express server\n');

console.log("Server running at https://" + config_glb.file_ip + ":" + config_glb.file_port + ' ' + new Date());

console.log("Server running at http://" + config_glb.file_ip + ":" + config_glb.file_http_port + ' ' + new Date());