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
var upload_retry = 10;

function sendAPI(method, data, callback) {
    var drive = googleapis.drive({ version: 'v2', auth: oauth2Client });
    var param = {};
    switch(method) {
        case 'upload':
        console.log(data);
        if (!data['type'] || !data['name'] || (!data['filePath'] && !data['body'])) {
            util.handleError({hoerror: 2, msg: 'upload parameter lost!!!'}, callback, callback);
        }
        var parent = {};
        var mimeType = '*/*';
        switch (data['type']) {
            case 'media':
                parent = {id: media_folder};
                mimeType = mime.mediaMIME(data['name']);
                if (!mimeType) {
                    util.handleError({hoerror: 2, msg: 'upload mime type unknown!!!'}, callback, callback);
                }
                break;
            case 'backup':
                parent = {id: backup_folder};
                break;
            default:
                util.handleError({hoerror: 2, msg: 'upload type unknown!!!'}, callback, callback);
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
        var retry = upload_retry;
        uploadMul();
        function uploadMul() {
            console.log(param);
            drive.files.insert(param, function(err, metadata) {
                retry--;
                if (err) {
                    if (retry === 0) {
                        util.handleError(err, callback, callback, null);
                    } else {
                        if (tokens.expiry_date < (Date.now())) {
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
                                    uploadMul();
                                });
                            });
                        }
                        uploadMul();
                    }
                } else {
                    setTimeout(function(){
                        callback(null, metadata);
                    }, 0);
                }
            });
        }
        break;
        case 'delete':
        if (!data['fileId']) {
            util.handleError({hoerror: 2, msg: 'delete parameter lost!!!'}, callback, callback);
        }
        param['fileId'] = data['fileId'];
        drive.files.trash(param, function(err) {
            if (err) {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null);
            }, 0);
        });
        break;
        default:
        util.handleError({hoerror: 2, msg: 'google api unknown!!!'}, callback, callback);
    }
}

function checkOauth(callback) {
    if (!tokens.access_token || !tokens.expiry_date) {
        mongo.orig("findOne", "accessToken", {api: "google"}, function(err, token){
            if(err) {
                util.handleError(err, callback, callback, null);
            }
            if (!token) {
                util.handleError({hoerror: 2, msg: "can not find token"}, callback, callback, null);
            }
            tokens = token;
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

module.exports = {
    googleApi: function (method, data, callback) {
        console.log('googleApi');
        checkOauth(function(err) {
            if (err) {
                util.handleError(err, callback, callback, null);
            }
            sendAPI(method, data, callback);
        });
    },
    googleDownload: function(url, filePath, callback, threshold, is_back) {
        threshold = typeof threshold !== 'undefined' ? threshold : null;
        is_back = typeof is_back !== 'undefined' ? is_back : false;
        if (threshold) {
            if (!is_back) {
                threshold = threshold > 600000 ? threshold : 600000;
            }
        }
        console.log(url);
        var urlParse = urlMod.parse(url);
        var this_obj = this;
        checkOauth(function(err) {
            if (err) {
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
            recur_download(time);
            function recur_download(time) {
                setTimeout(function(){
                    checkOauth(function(err) {
                        if (err) {
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
                        console.log(options);
                        var req = https.request(options, function(res) {
                            var err = null;
                            var complete = false;
                            if (res.statusCode === 200) {
                                complete = true;
                                res.pipe(fs.createWriteStream(filePath));
                            } else if (res.statusCode === 302){
                                if (!res.headers.location) {
                                    util.handleError({hoerror: 1, msg: res.statusCode + ': download do not complete'}, callback, callback);
                                }
                                this_obj.googleDownload(res.headers.location, filePath, callback);
                            } else if (res.statusCode >= 400 && res.statusCode < 500) {
                                console.log(res.statusCode);
                                time = time * 2;
                                console.log(time);
                                if (threshold) {
                                    if (time < threshold) {
                                        recur_download(time);
                                    } else {
                                        util.handleError({hoerror: 2, msg: "timeout"}, callback, callback);
                                    }
                                } else {
                                    if (time < 600000) {
                                        recur_download(time);
                                    } else {
                                        util.handleError({hoerror: 2, msg: "timeout"}, callback, callback);
                                    }
                                }
                            } else {
                                console.log(res);
                                util.handleError({hoerror: 1, msg: res.statusCode + ': download do not complete'}, callback, callback);
                            }
                            res.on('end', function() {
                                if (complete) {
                                    console.log(filePath);
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            });
                        });
                        req.on('error', function(e) {
                            console.log(e);
                            //util.handleError(e, callback, callback);
                            time = time * 2;
                            console.log(time);
                            if (threshold) {
                                if (time < threshold) {
                                    recur_download(time);
                                } else {
                                    util.handleError({hoerror: 2, msg: "timeout"}, callback, callback);
                                }
                            } else {
                                if (time < 600000) {
                                    recur_download(time);
                                } else {
                                    util.handleError({hoerror: 2, msg: "timeout"}, callback, callback);
                                }
                            }
                        });
                        req.end();
                    });
                }, time);
            }
        });
    },
    googleDownloadDoc: function(exportlink, key, filePath, ext, callback) {
        exportlink = exportlink.replace("=pdf", "=zip");
        this.googleDownload(exportlink, filePath + ".zip", function(err) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            if (!fs.existsSync(filePath + '.zip')) {
                util.handleError({hoerror: 2, msg: 'cannot find zip'}, callback, callback);
            }
            var cmdline = 'unzip ' + filePath + '.zip -d ' + filePath + '_doc';
            console.log(cmdline);
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
                                util.handleError(err, callback, callback);
                            }
                            if (!fs.existsSync(filePath + '_doc/' + path.basename(filePath) + '.' + ext + '.html')) {
                                util.handleError({hoerror: 2, msg: 'cannot find html'}, callback, callback);
                            }
                            console.log(output);
                            fs.rename(filePath + '_doc/' + path.basename(filePath) + '.' + ext + '.html', filePath + '_doc/doc.html', function (err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                }, 5000);
            }
        });
    },
    googleDownloadPresent: function(exportlink, key, filePath, ext, callback) {
        var this_obj = this;
        exportlink = exportlink.replace("=pdf", "=svg&pageid=p");
        var pageid = 3;
        var number = 1;
        recur_present(false);
        function recur_present(is_back) {
            this_obj.googleDownload(exportlink + pageid, filePath + "." + number + ".svg", function(err) {
                if (err) {
                    if (pageid === 3) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(err);
                    setTimeout(function(){
                        callback(null, number-1);
                    }, 0);
                } else {
                    if (pageid === 3) {
                        pageid+= 2;
                    } else {
                        pageid++;
                    }
                    number++;
                    recur_present(true);
                }
            }, 10000, is_back);
        }
    },
    googleBackup: function(id, name, filePath, tags, recycle, callback) {
        switch (recycle) {
            case 1:
                var data = {type: 'backup', name: id + '.' + name, filePath: filePath};
                this.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(metadata);
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
                        console.log(metadata);
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
                    console.log(metadata);
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
                break;
            default:
                util.handleError({hoerror: 2, msg: 'recycle ' + recycle + ' denied!!!'}, callback, callback);
        }
    },
    googleDownloadMedia: function(threshold, alternate, key, filePath, hd, callback) {
        var this_obj = this;
        this.googleDownload("https://drive.google.com/thumbnail?id=" + key, filePath + "_s.jpg", function(err) {
            if (err) {
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
                    media_code = 59;
                }
                child_process.exec(cmdline, function (err, output) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var pattern = media_code + '\\|(https\:\/\/[^,"]+)';
                    var media_location = output.match(pattern);
                    if (!media_location) {
                        util.handleError({hoerror: 2, msg: 'google media location unknown!!!'}, callback, callback);
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
        }, threshold);
    }
};

function deUnicode(x) {
    var r = /\\u([\d\w]{4})/gi;
    x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
    return unescape(x);
}