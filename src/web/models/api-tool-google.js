var googleapis = require('googleapis'),
    fs = require('fs'),
    https = require('https'),
    urlMod = require('url'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    child_process = require('child_process'),
    youtubedl = require('youtube-dl'),
    xml2js = require('xml2js');

var api = require("../models/api-tool.js");

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var mongo = require("../models/mongo-tool.js");

var util = require("../util/utility.js");

var mime = require('../util/mime.js');

var xml_parser = new xml2js.Parser();

var CLIENT_ID = config_type.google_id,
    CLIENT_SECRET = config_type.google_secret,
    REDIRECT_URL = config_type.google_redirect;

var OAuth2 = googleapis.auth.OAuth2;
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var tokens = '';

var media_folder = config_glb.google_media_folder;
var backup_folder = config_glb.google_backup_folder;
//var auto_folder = '0B_BstyDfOj4RfkU3aGpIRDVXcEwxSkdQeEJnTWM0cG0tNk9Md0VoZ21RTkxGcUNsQUVyaW8';
var max_retry = 10;

var api_pool = [];

var api_ing = 0;

var api_duration = 0;

var api_expire = 86400;

var oath_waiting = 60000;

//index 10 CAoQAA
function youtubeAPI(method, data, callback) {
    var youtube = googleapis.youtube({ version: 'v3', auth: oauth2Client });
    var param = {};
    switch(method) {
        case 'y search':
        console.log(data);
        if (!data['order'] || !data['maxResults'] || !data['type']) {
            util.handleError({hoerror: 2, message: 'search parameter lost!!!'}, callback, callback);
        }
        if (data['id_arr'] && data['id_arr'].length > 0) {
            if (data['id_arr'].length > 20) {
                data['maxResults'] = 0;
            } else {
                data['maxResults'] -= data['id_arr'].length;
            }
        }
        var type = '';
        switch (data['type']) {
            case 1:
            case 2:
            type = 'video';
            break;
            case 10:
            case 20:
            type = 'playlist';
            break;
            default:
            type = 'video,playlist';
            break;
        }
        param = {
            part: 'id',
            maxResults: data['maxResults'],
            order: data['order'],
            type: type,
            //type: 'video'
        };
        if (data['keyword']) {
            param.q = data['keyword'];
        }
        if (data['channelId']) {
            param.channelId = data['channelId'];
        }
        if (data['pageToken']) {
            param.pageToken = data['pageToken'];
        }
        youtube.search.list(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'y video':
        if (!data['id']) {
            util.handleError({hoerror: 2, message: 'search parameter lost!!!'}, callback, callback);
        }
        param = {
            part: 'snippet,statistics',
            id: data['id']
        };
        youtube.videos.list(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'y channel':
        if (!data['id']) {
            util.handleError({hoerror: 2, message: 'channel parameter lost!!!'}, callback, callback);
        }
        param = {
            part: 'snippet, brandingSettings',
            id: data['id']
        };
        youtube.channels.list(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'y playlist':
        if (!data['id']) {
            util.handleError({hoerror: 2, message: 'search parameter lost!!!'}, callback, callback);
        }
        param = {
            part: 'snippet',
            id: data['id']
        };
        youtube.playlists.list(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'y playItem':
        if (!data['id']) {
            util.handleError({hoerror: 2, message: 'search parameter lost!!!'}, callback, callback);
        }
        param = {
            part: 'snippet',
            playlistId: data['id'],
            maxResults: 20
        };
        if (data['pageToken']) {
            param.pageToken = data['pageToken'];
        }
        youtube.playlistItems.list(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            var id_arr = [];
            for (var i in metadata.items) {
                id_arr.push({id: 'you_' + metadata.items[i].snippet.resourceId.videoId, index: metadata.items[i].snippet.position+1, showId: metadata.items[i].snippet.position+1});
            }
            setTimeout(function(){
                callback(null, id_arr, metadata.pageInfo.totalResults, metadata.nextPageToken, metadata.prevPageToken);
            }, 0);
        });
        break;
        default:
        util.handleError({hoerror: 2, message: 'youtube api unknown!!!'}, callback, callback);
    }
}

function sendAPI(method, data, callback) {
    var drive = googleapis.drive({ version: 'v2', auth: oauth2Client });
    var param = {};
    switch(method) {
        case 'get':
        if (!data['fileId']) {
            util.handleError({hoerror: 2, message: 'get parameter lost!!!'}, callback, callback);
        }
        param['fileId'] = data['fileId'];
        drive.files.get(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'create':
        if (!data['name'] || !data['parent']) {
            exports.getApiQueue();
            util.handleError({hoerror: 2, message: 'upload parameter lost!!!'}, callback, callback);
        }
        param['resource'] = {
            title: data['name'],
            mimeType: "application/vnd.google-apps.folder",
            parents: [{id: data['parent']}]
        };
        drive.files.insert(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'upload':
        if (!data['type'] || !data['name'] || (!data['filePath'] && !data['body'])) {
            exports.getApiQueue();
            util.handleError({hoerror: 2, message: 'upload parameter lost!!!'}, callback, callback);
        }
        var parent = {};
        var mimeType = '*/*';
        switch (data['type']) {
            case 'media':
                parent = {id: media_folder};
                mimeType = mime.mediaMIME(data['name']);
                if (!mimeType) {
                    exports.getApiQueue();
                    util.handleError({hoerror: 2, message: 'upload mime type unknown!!!'}, callback, callback);
                }
                break;
            case 'backup':
                parent = {id: backup_folder};
                break;
            case 'auto':
                parent = {id: data['parent']};
                mimeType = mime.mediaMIME(data['name']);
                if (!mimeType) {
                    mimeType = 'text/plain';
                }
                break;
            default:
                exports.getApiQueue();
                util.handleError({hoerror: 2, message: 'upload type unknown!!!'}, callback, callback);
        }

        if (data['filePath']) {
            param['resource'] = {
                title: data['name'],
                mimeType: mimeType,
                parents: [parent]
            };
            param['media'] = {
                mimeType: mimeType,
                body: fs.createReadStream(data['filePath'])
            }
        } else {
            param['resource'] = {
                title: data['name'],
                mimeType: 'text/plain',
                parents: [parent]
            };
            param['media'] = {
                mimeType: 'text/plain',
                body: data['body']
            }
        }
        if (data['convert'] && data['convert'] === true) {
            param['convert'] = true;
        }
        var retry = max_retry;
        uploadMul();
        function uploadMul() {
            drive.files.insert(param, function(err, metadata) {
                retry--;
                if (err && err.code !== 'ECONNRESET') {
                    if (retry === 0) {
                        exports.getApiQueue();
                        util.handleError(err, callback, callback, null);
                    } else {
                        if (tokens.expiry_date < (Date.now()-600000)) {
                            console.log('uplad expire');
                            oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
                                if (err) {
                                    exports.getApiQueue();
                                    util.handleError(err, callback, callback, null);
                                }
                                console.log(refresh_tokens);
                                mongo.orig("update", "accessToken", {api: "google"}, {$set: refresh_tokens}, function(err,token){
                                    if(err) {
                                        exports.getApiQueue();
                                        util.handleError(err, callback, callback, null);
                                    }
                                    tokens = refresh_tokens;
                                    oauth2Client.setCredentials(tokens);
                                    uploadMul();
                                });
                            });
                        }
                        uploadMul();
                    }
                } else {
                    exports.getApiQueue();
                    setTimeout(function(){
                        callback(null, metadata);
                    }, 0);
                }
            });
        }
        break;
        case 'list file':
        max = 100;
        if (!data['folderId']) {
            util.handleError({hoerror: 2, message: 'list parameter lost!!!'}, callback, callback);
        }
        if (data['max']) {
            max = data['max'];
        }
        drive.files.list({q: "'" + data['folderId'] + "' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'", maxResults: max}, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                if (err.code == '401') {
                    console.log(tokens);
                    console.log(oauth2Client);
                    setTimeout(function(){
                        oath_waiting *= 2;
                        checkOauth(function(err) {
                            if (err) {
                                util.handleError(err, callback, callback, null);
                            }
                            sendAPI(method, data, callback);
                        });
                    }, oath_waiting);
                } else {
                    oath_waiting = 60000;
                    util.handleError(err, callback, callback, null);
                }
            } else {
                oath_waiting = 60000;
                setTimeout(function(){
                    callback(null, metadata.items);
                }, 0);
            }
        });
        break;
        case 'list folder':
        max = 100;
        if (!data['folderId']) {
            util.handleError({hoerror: 2, message: 'list parameter lost!!!'}, callback, callback);
        }
        var find_name = '';
        if (data['name']) {
            find_name = " and title = '" + data['name'] + "'";
        }
        if (data['max']) {
            max = data['max'];
        }
        drive.files.list({q: "'" + data['folderId'] + "' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'" + find_name, maxResults: max}, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            if (metadata && metadata.items) {
                setTimeout(function(){
                    callback(null, metadata.items);
                }, 0);
            } else {
                console.log('google empty');
                console.log(metadata);
                setTimeout(function(){
                    drive.files.list({q: "'" + data['folderId'] + "' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'" + find_name, maxResults: max}, function(err, metadata) {
                        if (err && err.code !== 'ECONNRESET') {
                            util.handleError(err, callback, callback, null);
                        }
                        if (metadata && metadata.items) {
                            setTimeout(function(){
                                callback(null, metadata.items);
                            }, 0);
                        } else {
                            console.log('google empty');
                            console.log(metadata);
                            setTimeout(function(){
                                drive.files.list({q: "'" + data['folderId'] + "' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'" + find_name, maxResults: max}, function(err, metadata) {
                                    if (err && err.code !== 'ECONNRESET') {
                                        util.handleError(err, callback, callback, null);
                                    }
                                    if (metadata && metadata.items) {
                                        setTimeout(function(){
                                            callback(null, metadata.items);
                                        }, 0);
                                    } else {
                                        console.log('google empty');
                                        console.log(metadata);
                                        setTimeout(function(){
                                            callback(null, []);
                                        }, 0);
                                    }
                                });
                            }, 3000);
                        }
                    });
                }, 3000);
            }
        });
        break;
        case 'move parent':
        if (!data['fileId'] || !data['rmFolderId'] || !data['addFolderId']) {
            util.handleError({hoerror: 2, message: 'delete parent parameter lost!!!'}, callback, callback);
        }
        param['fileId'] = data['fileId'];
        param['removeParents'] = data['rmFolderId'];
        param['addParents'] = data['addFolderId'];
        drive.files.patch(param, function(err) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null);
            }, 0);
        });
        break;
        case 'copy':
        if (!data['fileId']) {
            util.handleError({hoerror: 2, message: 'copy parameter lost!!!'}, callback, callback);
        }
        param['fileId'] = data['fileId'];
        drive.files.copy(param, function(err, metadata) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata);
            }, 0);
        });
        break;
        case 'delete':
        if (!data['fileId']) {
            util.handleError({hoerror: 2, message: 'delete parameter lost!!!'}, callback, callback);
        }
        param['fileId'] = data['fileId'];
        drive.files.trash(param, function(err) {
            if (err && err.code !== 'ECONNRESET') {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null);
            }, 0);
        });
        break;
        default:
        util.handleError({hoerror: 2, message: 'google api unknown!!!'}, callback, callback);
    }
}

function checkOauth(callback) {
    if (!tokens.access_token || !tokens.expiry_date) {
        console.log('first');
        mongo.orig("find", "accessToken", {api: "google"}, {limit: 1}, function(err, token){
            if(err) {
                util.handleError(err, callback, callback, null);
            }
            if (token.length === 0) {
                util.handleError({hoerror: 2, message: "can not find token"}, callback, callback, null);
            }
            tokens = token[0];
            if (tokens.expiry_date < (Date.now()-600000)) {
                console.log('expire');
                oauth2Client.setCredentials(tokens);
                oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
                    if (err) {
                        util.handleError(err, callback, callback, null);
                    }
                    console.log(refresh_tokens);
                    mongo.orig("update", "accessToken", {api: "google"}, {$set: refresh_tokens}, function(err,token){
                        if(err) {
                            util.handleError(err, callback, callback, null);
                        }
                        tokens = refresh_tokens;
                        oauth2Client.setCredentials(tokens);
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            } else {
                oauth2Client.setCredentials(tokens);
                setTimeout(function(){
                    callback(null);
                }, 0);
            }
        });
    } else if (tokens.expiry_date < (Date.now()-600000)) {
        console.log('expire');
        oauth2Client.setCredentials(tokens);
        oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
            if (err) {
                util.handleError(err, callback, callback, null);
            }
            console.log(refresh_tokens);
            mongo.orig("update", "accessToken", {api: "google"}, {$set: refresh_tokens}, function(err,token){
                if(err) {
                    util.handleError(err, callback, callback, null);
                }
                tokens = refresh_tokens;
                oauth2Client.setCredentials(tokens);
                setTimeout(function(){
                    callback(null);
                }, 0);
            });
        });
    } else {
        oauth2Client.setCredentials(tokens);
        setTimeout(function(){
            callback(null);
        }, 0);
    }
}

var exports = module.exports = {
    googleApi: function (method, data, callback) {
        if (method === 'upload') {
            if (!this.setApiQueue('googleApi', [method, data, callback])) {
                return false;
            }
        }
        console.log('googleApi');
        console.log(method);
        console.log(data);
        var this_obj = this;
        checkOauth(function(err) {
            if (err) {
                if (method === 'upload') {
                    this_obj.getApiQueue();
                }
                util.handleError(err, callback, callback, null);
            }
            if (method.match(/^y /)) {
                youtubeAPI(method, data, callback);
            } else {
                sendAPI(method, data, callback);
            }
        });
    },
    googleDownload: function(url, filePath, callback, threshold, is_one) {
        if (!this.setApiQueue('googleDownload', [url, filePath, callback, threshold, is_one])) {
            return false;
        }
        threshold = typeof threshold !== 'undefined' ? threshold : null;
        is_back = typeof is_back !== 'undefined' ? is_back : false;
        if (threshold) {
            if (!is_one) {
                threshold = threshold > 600000 ? threshold : 600000;
            }
        }
        console.log(url);
        console.log(filePath);
        var urlParse = urlMod.parse(url);
        var this_obj = this;
        checkOauth(function(err) {
            if (err) {
                this_obj.getApiQueue();
                util.handleError(err, callback, callback, null);
            }
            var options = {
                host: urlParse.hostname,
                port: 443,
                path: urlParse.path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + oauth2Client.credentials.access_token
                }
            };
            var time = 1000;
            var retry = max_retry;
            if (is_one) {
                time = threshold;
            }
            recur_download(time);
            function recur_download(time) {
                setTimeout(function(){
                    checkOauth(function(err) {
                        if (err) {
                            this_obj.getApiQueue();
                            util.handleError(err, callback, callback, null);
                        }
                        options = {
                            host: urlParse.hostname,
                            port: 443,
                            path: urlParse.path,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': oauth2Client.credentials.token_type + ' ' + oauth2Client.credentials.access_token
                            }
                        };
                        var req = https.request(options, function(res) {
                            var length = 0;
                            if (res.statusCode === 200) {
                                if (res.headers['content-length']) {
                                    length = Number(res.headers['content-length']);
                                }
                                //complete = true;
                                var file_write =  fs.createWriteStream(filePath);
                                res.pipe(file_write);
                                file_write.on('finish', function(){
                                    console.log('finish');
                                    var stats = fs.statSync(filePath);
                                    if (!length || length === stats["size"]) {
                                        this_obj.getApiQueue();
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    } else {
                                        retry--;
                                        if (retry === 0) {
                                            console.log(options);
                                            this_obj.getApiQueue();
                                            util.handleError({hoerror: 2, message: "download not complete"}, callback, callback);
                                        } else {
                                            setTimeout(function(){
                                                recur_download(1000);
                                            }, 0);
                                        }
                                    }
                                });
                            } else if (res.statusCode === 301 || res.statusCode === 302){
                                this_obj.getApiQueue();
                                if (!res.headers.location) {
                                    console.log(res.headers);
                                    util.handleError({hoerror: 1, message: res.statusCode + ': download do not complete'}, callback, callback);
                                }
                                setTimeout(function(){
                                    this_obj.googleDownload(res.headers.location, filePath, callback);
                                }, 0);
                            } else if (res.statusCode >= 400 && res.statusCode < 500) {
                                console.log(res.statusCode);
                                time = time * 2;
                                console.log(time);
                                if (threshold) {
                                    if (time < threshold) {
                                        setTimeout(function(){
                                            recur_download(time);
                                        }, 0);
                                    } else {
                                        console.log(options);
                                        this_obj.getApiQueue();
                                        util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                    }
                                } else {
                                    if (time < 600000) {
                                        setTimeout(function(){
                                            recur_download(time);
                                        }, 0);
                                    } else {
                                        console.log(options);
                                        this_obj.getApiQueue();
                                        util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                    }
                                }
                            } else {
                                console.log(res);
                                this_obj.getApiQueue();
                                util.handleError({hoerror: 1, message: res.statusCode + ': download do not complete'}, callback, callback);
                            }
                            res.on('end', function() {
                                console.log('res end');
                            });
                        });
                        req.on('error', function(e) {
                            util.handleError(e);
                            if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND' || e.code === 'ETIMEDOUT') {
                                time = time * 2;
                                console.log(time);
                                if (threshold) {
                                    if (time < threshold) {
                                        setTimeout(function(){
                                            recur_download(time);
                                        }, 0);
                                    } else {
                                        console.log(options);
                                        this_obj.getApiQueue();
                                        util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                    }
                                } else {
                                    if (time < 600000) {
                                        setTimeout(function(){
                                            recur_download(time);
                                        }, 0);
                                    } else {
                                        console.log(options);
                                        this_obj.getApiQueue();
                                        util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                    }
                                }
                            } else if (e.code === 'HPE_INVALID_CONSTANT' || e.code === 'EAFNOSUPPORT'){
                                this_obj.getApiQueue();
                                util.handleError(e, callback, callback, 400, null);
                            }
                        });
                        req.end();
                    });
                }, time);
            }
        });
    },
    googleDownloadDoc: function(exportlink, filePath, ext, callback) {
        exportlink = exportlink.replace("=pdf", "=zip");
        this.googleDownload(exportlink, filePath + ".zip", function(err) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            if (!fs.existsSync(filePath + '.zip')) {
                console.log(filePath + '.zip');
                util.handleError({hoerror: 2, message: 'cannot find zip'}, callback, callback);
            }
            var cmdline = path.join(__dirname, "../util/myuzip.py") + ' ' + filePath + '.zip ' + filePath + '_doc';
            if (!fs.existsSync(filePath + '_doc')) {
                mkdirp(filePath + '_doc', function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    doc_unzip();
                });
            } else {
                doc_unzip();
            }
            function doc_unzip() {
                setTimeout(function(){
                    child_process.exec(cmdline, function (err, output) {
                        fs.unlink(filePath + '.zip', function (err1) {
                            if (err1) {
                                util.handleError(err, callback, callback);
                            }
                            if (err) {
                                console.log(cmdline);
                                util.handleError(err, callback, callback);
                            }
                            var doc_index = 1;
                            if(fs.existsSync(filePath + '_doc')) {
                                fs.readdirSync(filePath + '_doc').forEach(function(file,index){
                                    var curPath = filePath + '_doc/' + file;
                                    if(!fs.lstatSync(curPath).isDirectory()) { // recurse
                                        for (doc_index;doc_index < 100;doc_index++) {
                                            if (doc_index === 1) {
                                                if (!fs.existsSync(filePath + '_doc/doc.html')) {
                                                    fs.renameSync(curPath, filePath + '_doc/doc.html');
                                                    fs.appendFileSync(filePath + '_doc/doc.html', '<script type="text/javascript" charset="utf-8">document.domain = document.domain;</script></body></html>', 'utf-8');
                                                    break;
                                                }
                                            } else {
                                                if (!fs.existsSync(filePath + '_doc/doc' + doc_index + '.html')) {
                                                    fs.renameSync(curPath, filePath + '_doc/doc' + doc_index + '.html');
                                                    fs.appendFileSync(filePath + '_doc/doc' + doc_index + '.html', '<script type="text/javascript" charset="utf-8">document.domain = document.domain;</script></body></html>', 'utf-8');
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            setTimeout(function(){
                                callback(null, doc_index);
                            }, 0);
                        });
                    });
                }, 5000);
            }
        });
    },
    googleDownloadPresent: function(exportlink, alternate, filePath, ext, callback) {
        var this_obj = this;
        this.googleDownload(alternate, filePath + "_b.htm", function(err) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            exportlink = exportlink.replace("=pdf", "=svg&pageid=p");
            var number = 0;
            if (!fs.existsSync(filePath + '_present')) {
                mkdirp(filePath + '_present', function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    recur_present();
                });
            } else {
                recur_present();
            }
            function recur_present() {
                var cmdline = 'grep -o "12,\\\"p[0-9][0-9]*\\\",' + number + ',0" ' + filePath + "_b.htm";
                child_process.exec(cmdline, function (err, output) {
                    if (err) {
                        util.handleError(err);
                        setTimeout(function(){
                            callback(null, number);
                        }, 0);
                    } else {
                        console.log(output);
                        number++;
                        var pageid = output.match(/\"p(\d+)\"/);
                        if (pageid) {
                            this_obj.googleDownload(exportlink + pageid[1], filePath + "_present/" + number + ".svg", function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                recur_present();
                            });
                        } else {
                            util.handleError({hoerror: 2, message: 'can not find present'}, callback, callback);
                        }
                    }
                });
            }
        });
    },
    googleBackup: function(id, name, filePath, tags, recycle, callback, append) {
        switch (recycle) {
            case 1:
                if (append) {
                    filePath = filePath + append;
                }
                var data = {type: 'backup', name: id + '.' + name, filePath: filePath};
                this.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
                break;
            case 2:
                if (fs.existsSync(filePath + '.srt')) {
                    var data = {type: 'backup', name: id + '.' + name + '.srt', filePath: filePath + '.srt'};
                    this.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                } else if (fs.existsSync(filePath + '.ass')) {
                    var data = {type: 'backup', name: id + '.' + name + '.ass', filePath: filePath + '.ass'};
                    this.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                } else if (fs.existsSync(filePath + '.ssa')) {
                    var data = {type: 'backup', name: id + '.' + name + '.ssa', filePath: filePath + '.ssa'};
                    this.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                } else {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                }
                break;
            case 3:
                var data = {type: 'backup', name: id + '.' + name + '.txt', body: tags.toString()};
                this.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
                break;
            default:
                util.handleError({hoerror: 2, message: 'recycle ' + recycle + ' denied!!!'}, callback, callback);
        }
    },
    googleDownloadSubtitle: function(url, filePath, callback) {
        downloadSubtitle(url, filePath, callback);
    },
    //install youtube-dl
    //sudo wget https://yt-dl.org/latest/youtube-dl -O /usr/bin/youtube-dl
    //sudo chmod a+x /usr/bin/youtube-dl
    googleDownloadYoutube: function(url, filePath, callback, is_music) {
        var this_obj = this;
        var youtube_id = url.match(/v=([^&]+)/);
        if (!youtube_id) {
            util.handleError({hoerror: 2, message: 'can not find youtube id!!!'}, callback, callback);
        }
        youtube_id = youtube_id[1];
        this.googleApi('y video', {id: youtube_id, caption: true}, function(err, detaildata) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            if (detaildata.items.length < 1) {
                util.handleError({hoerror: 2, message: 'can not find video'}, callback, callback);
            }
            var media_name = null, tag_arr = [];
            media_name = detaildata.items[0].snippet.title;
            if (detaildata.items[0].snippet.tags) {
                tag_arr = detaildata.items[0].snippet.tags;
            }
            if (detaildata.items[0].snippet.channelTitle) {
                tag_arr.push(detaildata.items[0].snippet.channelTitle);
            }
            //media_thumb = detaildata.items[0].snippet.thumbnails.default.url;
            console.log(media_name);
            if (is_music) {
                var mp3_time = new Date;
                var push_url = '/a/pushItem/?item=http%3A//www.youtube.com/watch%3Fv%3D' + youtube_id + '&el=na&bf=false&r=' + mp3_time.getTime();
                var info_url = '/a/itemInfo/?video_id=' + youtube_id + '&ac=www&t=grp&r=' + mp3_time.getTime();
                var siged = sig_url(push_url);
                console.log('http://www.youtube-mp3.org' + siged);
                api.xuiteDownload('http://www.youtube-mp3.org' + siged, '', function(err, music_id) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    console.log(music_id);
                    if (music_id !== youtube_id) {
                        util.handleError({hoerror: 2, message: 'push music data failed!!!'}, callback, callback);
                    }
                    siged = sig_url(info_url);
                    console.log('http://www.youtube-mp3.org' + siged);
                    api.xuiteDownload('http://www.youtube-mp3.org' + siged, '', function(err, music_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        console.log(music_data);
                        var music_json = music_data.match(/^info = (.*);$/);
                        if (!music_json) {
                            util.handleError({hoerror: 2, message: 'get music info failed!!!'}, callback, callback);
                        }
                        try {
                            var music_info = JSON.parse(music_json[1]);
                            var ts_create = music_info.ts_create;
                            var r = encodeURIComponent(music_info.r);
                            var h2 = music_info.h2;
                            var download_url = '/get?video_id=' + youtube_id + '&ts_create=' + ts_create + '&r=' + r + '&h2=' + h2;
                            siged = sig_url(download_url);
                            console.log('http://www.youtube-mp3.org' + siged);
                            api.xuiteDownload('http://www.youtube-mp3.org' + siged, filePath, function(err, pathname, filename) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                if (!filename) {
                                    filename = path.basename(pathname);
                                }
                                if (tag_arr.indexOf('audio') === -1) {
                                    tag_arr.push('audio');
                                }
                                if (tag_arr.indexOf('音頻') === -1) {
                                    tag_arr.push('音頻');
                                }
                                setTimeout(function(){
                                    callback(null, media_name + '.mp3', tag_arr);
                                }, 0);
                            });
                        } catch (x) {
                            console.log(music_json[1]);
                            util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                        }
                    }, 60000, false, false);
                }, 60000, false, false);
            } else {
                console.log(url);
                console.log(filePath);
                youtubedl.exec(url, ['-o', filePath, '-f', 'mp4', '--write-thumbnail'], {}, function(err, output) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    if (fs.existsSync(filePath + '.jpg')) {
                        fs.rename(filePath + '.jpg', filePath + '_s.jpg', function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            downloadSubtitle(url, filePath, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                if (tag_arr.indexOf('video') === -1) {
                                    tag_arr.push('video');
                                }
                                if (tag_arr.indexOf('影片') === -1) {
                                    tag_arr.push('影片');
                                }
                                setTimeout(function(){
                                    callback(null, media_name + '.mp4', tag_arr);
                                }, 0);
                            });
                        });
                    }
                });
            }
        });
    },
    googleDownloadExternal: function(url, filePath, callback) {
        var this_obj = this;
        var external_id = url.match(/\/embed\/video\/([^&]+)/);
        if (!external_id) {
            util.handleError({hoerror: 2, message: 'can not find external id!!!'}, callback, callback);
        }
        console.log(url);
        console.log(filePath);
        var tag_arr = ['影片', 'video'];
        youtubedl.getInfo(url, [], function(err, info) {
            if (err) {
                err.hoerror = 2;
                util.handleError(err, callback, callback);
            }
            youtubedl.exec(url, ['-o', filePath, '-f', 'mp4', '--write-thumbnail'], {}, function(err, output) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                if (fs.existsSync(filePath + '.jpg')) {
                    fs.rename(filePath + '.jpg', filePath + '_s.jpg', function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    downloadSubtitle(url, filePath, function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                        setTimeout(function(){
                            callback(null, info.title + '.mp4', tag_arr);
                        }, 0);
                        });
                    });
                }
            });
        });
    },
    googleDownloadMedia: function(threshold, alternate, key, filePath, hd, callback, is_ok) {
        var this_obj = this;
        /*if (hd === 1080) {
            threshold = 3*threshold;
        } else if (hd === 720) {
            threshold = 2*threshold;
        }*/
        var img_threshold = threshold;
        if (is_ok) {
            img_threshold = 600000;
        }
        this.googleDownload("https://drive.google.com/thumbnail?id=" + key, filePath + "_s.jpg", function(err) {
            if (err && !is_ok) {
                util.handleError(err, callback, callback);
            }
            youtubedl.getInfo('https://drive.google.com/open?id=' + key, [], function(err, info) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                var media_location = null;
                var currentHeight = 0;
                if (info.formats) {
                    for (var i in info.formats) {
                        if (info.formats[i].format_note !== 'DASH video' && (info.formats[i].ext === 'mp4' || info.formats[i].ext === 'webm')) {
                            if (hd === 1081 && info.formats[i].height >= 1080) {
                                if (info.formats[i].height > currentHeight) {
                                    media_location = info.formats[i].url;
                                    currentHeight = info.formats[i].height;
                                }
                            } else if ((hd === 720 || hd === 1080) && info.formats[i].height >= 720) {
                                if (info.formats[i].height > currentHeight) {
                                    media_location = info.formats[i].url;
                                    currentHeight = info.formats[i].height;
                                }
                            } else if (hd !== 1080 && hd !== 720 && hd !== 1081){
                                if (info.formats[i].height > currentHeight) {
                                    media_location = info.formats[i].url;
                                    currentHeight = info.formats[i].height;
                                }
                            }
                        }
                    }
                } else {
                    for (var i in info) {
                        if (info[i].format_note !== 'DASH video' && (info[i].ext === 'mp4' || info[i].ext === 'webm')) {
                            if (hd === 1081 && info[i].height >= 1080) {
                                if (info[i].height > currentHeight) {
                                    media_location = info[i].url;
                                    currentHeight = info[i].height;
                                }
                            } else if ((hd === 720 || hd === 1080) && info[i].height >= 720) {
                                if (info[i].height > currentHeight) {
                                    media_location = info[i].url;
                                    currentHeight = info[i].height;
                                }
                            } else if (hd !== 1080 && hd !== 720 && hd !== 1081) {
                                if (info[i].height > currentHeight) {
                                    media_location = info[i].url;
                                    currentHeight = info[i].height;
                                }
                            }
                        }
                    }
                }
                if (!media_location) {
                    util.handleError({hoerror: 2, message: 'timeout'}, callback, callback);
                }
                if (fs.existsSync(filePath)) {
                    this_obj.googleDownload(media_location, filePath + '_t', function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        fs.unlink(filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            fs.rename(filePath + '_t', filePath, function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                if (hd === 1080 && currentHeight < 1080) {
                                    setTimeout(function(){
                                        callback(null, true);
                                    }, 0);
                                } else {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            });
                        });
                    }, threshold);
                } else {
                    this_obj.googleDownload(media_location, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        if (hd === 1080 && currentHeight < 1080) {
                            setTimeout(function(){
                                callback(null, true);
                            }, 0);
                        } else {
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        }
                    }, threshold);
                }
            });
        }, img_threshold);
    },
    setApiQueue: function(name, param) {
        var this_obj = this;
        console.log('google aping');
        console.log(api_ing);
        if (api_ing >= config_glb.api_limit) {
            console.log('reach limit');
            var now = new Date().getTime()/1000;
            if (!api_duration) {
                api_duration = now;
            } else if ((now - api_duration) > api_expire) {
                var item = api_pool.splice(0, 1)[0];
                if (item) {
                    console.log('expire go queue');
                    console.log(item.fun_name);
                    console.log(item.fun_param);
                    setTimeout(function(){
                        this_obj[item.fun_name].apply(this_obj, item.fun_param);
                    }, 0);
                }
            }
            api_pool.push({fun_name: name, fun_param: param});
            return false;
        } else {
            if (api_ing < config_glb.api_limit) {
                api_ing++;
            }
            return true;
        }
    },
    getApiQueue: function() {
        console.log('google aping');
        console.log(api_ing);
        var this_obj = this;
        if (api_ing > 0) {
            api_ing--;
        }
        api_duration = 0;
        var item = api_pool.splice(0, 1)[0];
        if (item) {
            console.log('go queue');
            console.log(api_pool.length);
            console.log(item.fun_name);
            console.log(item.fun_param);
            setTimeout(function(){
                this_obj[item.fun_name].apply(this_obj, item.fun_param);
            }, 0);
        }
    }
};

function downloadSubtitle (url, filePath, callback) {
    var sub_location = filePath + '_sub/youtube';
    var options = {
        auto: false,
        all: false,
        lang: 'zh-TW,zh-Hant,zh-CN,zh-Hans,zh-HK,zh-SG,en',
    };
    console.log(sub_location);
    if (fs.existsSync(sub_location)) {
        options.cwd = sub_location;
        youtubedl.getSubs(url, options, function(err, info) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            var choose = null, pri = 0, sub_match = null;
            fs.readdirSync(sub_location).forEach(function(file,index){
                sub_match = file.match(/\.([a-zA-Z\-]+)\.[a-zA-Z]{3}$/);
                if (sub_match) {
                    switch (sub_match[1]) {
                        case 'zh-TW':
                        if (pri < 7) {
                            pri = 7;
                            choose = file;
                        }
                        break;
                        case 'zh-Hant':
                        if (pri < 6) {
                            pri = 6;
                            choose = file;
                        }
                        break;
                        case 'zh-CN':
                        if (pri < 5) {
                            pri = 5;
                            choose = file;
                        }
                        break;
                        case 'zh-Hans':
                        if (pri < 4) {
                            pri = 4;
                            choose = file;
                        }
                        break;
                        case 'zh-HK':
                        if (pri < 3) {
                            pri = 3;
                            choose = file;
                        }
                        break;
                        case 'zh-SG':
                        if (pri < 2) {
                            pri = 2;
                            choose = file;
                        }
                        break;
                        case 'en':
                        if (pri < 1) {
                            pri = 1;
                            choose = file;
                        }
                        break;
                    }
                }
            });
            if (!choose) {
                util.handleError({hoerror: 2, message: "sub donot have chinese and english!!!"}, callback, callback);
            }
            var ext = mime.isSub(choose);
            if (!ext) {
                util.handleError({hoerror: 2, message: "sub ext not support!!!"}, callback, callback);
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
            fs.rename(sub_location + '/' + choose, filePath + '.' + ext, function(err) {
                if (err) {
                    util.handleError(err, next, res);
                }
                if (ext === 'vtt') {
                    util.deleteFolderRecursive(sub_location);
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                } else {
                    util.SRT2VTT(filePath, ext, function(err) {
                        if (err) {
                            util.handleError(err, next, res);
                        }
                        util.deleteFolderRecursive(sub_location);
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                }
            });
        });
    } else {
        mkdirp(sub_location, function(err) {
            if(err) {
                util.handleError(err, callback, callback);
            }
            options.cwd = sub_location;
            youtubedl.getSubs(url, options, function(err, info) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                var choose = null, pri = 0, sub_match = null;
                fs.readdirSync(sub_location).forEach(function(file,index){
                    sub_match = file.match(/\.([a-zA-Z\-]+)\.[a-zA-Z]{3}$/);
                    if (sub_match) {
                        switch (sub_match[1]) {
                            case 'zh-TW':
                            if (pri < 7) {
                                pri = 7;
                                choose = file;
                            }
                            break;
                            case 'zh-Hant':
                            if (pri < 6) {
                                pri = 6;
                                choose = file;
                            }
                            break;
                            case 'zh-CN':
                            if (pri < 5) {
                                pri = 5;
                                choose = file;
                            }
                            break;
                            case 'zh-Hans':
                            if (pri < 4) {
                                pri = 4;
                                choose = file;
                            }
                            break;
                            case 'zh-HK':
                            if (pri < 3) {
                                pri = 3;
                                choose = file;
                            }
                            break;
                            case 'zh-SG':
                            if (pri < 2) {
                                pri = 2;
                                choose = file;
                            }
                            break;
                            case 'en':
                            if (pri < 1) {
                                pri = 1;
                                choose = file;
                            }
                            break;
                        }
                    }
                });
                if (!choose) {
                    util.handleError({hoerror: 2, message: "sub donot have chinese and english!!!"}, callback, callback);
                }
                var ext = mime.isSub(choose);
                if (!ext) {
                    util.handleError({hoerror: 2, message: "sub ext not support!!!"}, callback, callback);
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
                fs.rename(sub_location + '/' + choose, filePath + '.' + ext, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    if (ext === 'vtt') {
                        util.deleteFolderRecursive(sub_location);
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    } else {
                        util.SRT2VTT(filePath, ext, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            util.deleteFolderRecursive(sub_location);
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    }
                });
            });
        });
    }
}

function deUnicode(x) {
    var r = /\\u([\d\w]{4})/gi;
    x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
    return unescape(x);
}

//http://www.youtube-mp3.org signature function
function sig(H){
    var x3 = ['a','c','e','i','h','m','l','o','n','s','t','.']
    ,G3 = [6,7,1,0,10,3,7,8,11,4,7,9,10,8,0,5,2]
    ,M = ['a','c','b','e','d','g','m','-','s','o','.','p','3','r','u','t','v','y','n']
    ,X = [[17,9,14,15,14,2,3,7,6,11,12,10,9,13,5],[11,6,4,1,9,18,16,10,0,11,11,8,11,9,15,10,1,9,6]]
    ,A = {"a":870,"b":906,"c":167,"d":119,"e":130,"f":899,"g":248,"h":123,"i":627,"j":706,"k":694,"l":421,"m":214,"n":561,"o":819,"p":925,"q":857,"r":539,"s":898,"t":866,"u":433,"v":299,"w":137,"x":285,"y":613,"z":635,"_":638,"&":639,"-":880,"/":687,"=":721}
    ,r3 = ["0","1","2","3","4","5","6","7","8","9"];
    var encode = function(arr, code_arr) {
        var out="";
        for(var i=0;i < arr.length;i++) {
            out += code_arr[arr[i]];
        };
        return out;
    };
    var check = function(arr, ch_str) {
        var ret = arr.indexOf(ch_str, arr.length-ch_str.length);
        return ret!==-1;
    };
    var findstr = function(arr, ch_str) {
        for (var i=0;i < arr.length;i++) {
            if(arr[i] == ch_str)
                return i;
        }
        return -1;
    };
    var L = [1.23413,1.51214,1.9141741,1.5123114,1.51214,1.2651], F = 1;
    F = L[1%2];
    var W = "www.youtube-mp3.org", S = encode(X[0], M), T = encode(X[1], M);
    if (check(W, S) || check(W, T)) {
        F = L[1];
    } else {
        F = L[5%3];
    }
    var N = 3219;
    for (var Y=0;Y < H.length;Y++) {
        var Q = H.substr(Y, 1).toLowerCase();
        if (findstr(r3, Q) > -1) {
            N += (parseInt(Q)*121*F);
        } else {
            if (Q in A) {
                N += (A[Q]*F);
            }
        }
        N *= 0.1;
    }
    N = Math.round(N*1000);
    return N;
};

function sig_url(a){
    var b = sig(a);
    return a + "&s=" + escape(b);
};