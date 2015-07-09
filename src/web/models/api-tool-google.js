var googleapis = require('googleapis'),
    fs = require('fs'),
    https = require('https'),
    urlMod = require('url'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    child_process = require('child_process');

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var mongo = require("../models/mongo-tool.js");

var util = require("../util/utility.js");

var mime = require('../util/mime.js');

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
                        if (tokens.expiry_date < (Date.now())) {
                            oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
                                if (err) {
                                    exports.getApiQueue();
                                    util.handleError(err, callback, callback, null);
                                }
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
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null, metadata.items);
            }, 0);
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
            setTimeout(function(){
                callback(null, metadata.items);
            }, 0);
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
        mongo.orig("find", "accessToken", {api: "google"}, {limit: 1}, function(err, token){
            if(err) {
                util.handleError(err, callback, callback, null);
            }
            if (token.length === 0) {
                util.handleError({hoerror: 2, message: "can not find token"}, callback, callback, null);
            }
            tokens = token[0];
            if (tokens.expiry_date < (Date.now())) {
                oauth2Client.setCredentials(tokens);
                oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
                    if (err) {
                        util.handleError(err, callback, callback, null);
                    }
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
    } else if (tokens.expiry_date < (Date.now())) {
        oauth2Client.setCredentials(tokens);
        oauth2Client.refreshAccessToken(function(err, refresh_tokens) {
            if (err) {
                util.handleError(err, callback, callback, null);
            }
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
            sendAPI(method, data, callback);
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
                            } else if (res.statusCode === 302){
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
                            } else if (e.code === 'HPE_INVALID_CONSTANT'){
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
            var cmdline = 'unzip ' + filePath + '.zip -d ' + filePath + '_doc';
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
                                                    break;
                                                }
                                            } else {
                                                if (!fs.existsSync(filePath + '_doc/doc' + doc_index + '.html')) {
                                                    fs.renameSync(curPath, filePath + '_doc/doc' + doc_index + '.html');
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
    googleBackup: function(id, name, filePath, tags, recycle, callback) {
        switch (recycle) {
            case 1:
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
    googleDownloadMedia: function(threshold, alternate, key, filePath, hd, callback, is_ok) {
        var this_obj = this;
        if (hd === 1080) {
            threshold = 3*threshold;
        } else if (hd === 720) {
            threshold = 2*threshold;
        }
        var img_threshold = threshold;
        if (is_ok) {
            img_threshold = 60000;
        }
        this.googleDownload("https://drive.google.com/thumbnail?id=" + key, filePath + "_s.jpg", function(err) {
            if (err && !is_ok) {
                util.handleError(err, callback, callback);
            }
            this_obj.googleDownload(alternate, filePath + "_a.htm", function(err) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                var cmdline = 'grep ^,.\\\"fmt_stream_map\\\", ' + filePath + "_a.htm";
                var media_code = 0;
                if (hd === 1080) {
                    media_code = 37;
                } else if(hd === 720) {
                    media_code = 22;
                } else {
                    media_code = 18;
                }
                child_process.exec(cmdline, function (err, output) {
                    var pattern = media_code + '\\|(https\:\/\/[^,"]+)';
                    var media_location;
                    if (err) {
                        util.handleError(err);
                        alternate = alternate.replace(/\/a\/g2\.nctu\.edu\.tw\//,'/');
                        this_obj.googleDownload(alternate, filePath + "_a.htm", function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            child_process.exec(cmdline, function (err, output) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                media_location = output.match(pattern);
                                if (!media_location) {
                                    console.log(output);
                                    util.handleError({hoerror: 2, message: 'google media location unknown!!!'}, callback, callback);
                                }
                                media_location = media_location[1];
                                media_location = deUnicode(media_location);
                                this_obj.googleDownload(media_location, filePath, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }, threshold);
                            });
                        }, threshold);
                    } else {
                        media_location = output.match(pattern);
                        if (!media_location) {
                            console.log(output);
                            if (media_code === 18) {
                                media_code = 43;
                                pattern = media_code + '\\|(https\:\/\/[^,"]+)';
                                media_location = output.match(pattern);
                                if (!media_location) {
                                    util.handleError({hoerror: 2, message: 'google media location unknown!!!'}, callback, callback);
                                }
                            } else {
                                util.handleError({hoerror: 2, message: 'google media location unknown!!!'}, callback, callback);
                            }
                        }
                        media_location = media_location[1];
                        media_location = deUnicode(media_location);
                        this_obj.googleDownload(media_location, filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            } else {
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            }
                        }, threshold);
                    }
                });
            }, threshold);
        }, img_threshold);
    },
    setApiQueue: function(name, param) {
        if (api_ing >= config_glb.api_limit) {
            console.log('reach limit');
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
        var this_obj = this;
        if (api_ing > 0) {
            api_ing--;
        }
        var item = api_pool.splice(0, 1)[0];
        if (item) {
            console.log('go queue');
            console.log(item.fun_name);
            console.log(item.fun_param);
            setTimeout(function(){
                this_obj[item.fun_name].apply(this_obj, item.fun_param);
            }, 0);
        }
    }
};

function deUnicode(x) {
    var r = /\\u([\d\w]{4})/gi;
    x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
    return unescape(x);
}