//xuite get access_token url: http://my.xuite.net/service/account/authorize.php?response_type=code_and_token&client_id=e4a4666f807878269c1501529b6ab98d&redirect_uri=http://devbox.example.com/oauth2callback
//再到https://my.xuite.net/service/account/token.php?grant_type=authorization_code&client_id=deb95e99de75da3104e70db4dc1e0a3e&client_secret=9582964790&code=754eb508c1aa9d00bf9e35643ddeae42&redirect_uri=http://devbox.example.com:8080/oauth2callback
var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var api_key = config_type.xuite_key;

var api_secret = config_type.xuite_secret;

var access_token = '';

var expire_in = '';

var mongo = require("../models/mongo-tool.js");

var chunk = 10000000;

var max_retry = 10;

var querystring = require('querystring');

var parent_key = config_glb.xuite_parent_key;

var util = require("../util/utility.js");

var api_pool = [];

var api_ing = 0;

var api_duration = 0;

var api_expire = 86400;

var crypto = require('crypto'),
    urlMod = require('url'),
    fs = require("fs"),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    zlib = require('zlib');

function signature(data, method) {
    data['api_key'] = api_key;
    data['auth'] = access_token;
    data['method'] = method;

    var keys = [], k, i, j, len;

    var sigStr = api_secret;

    for (k in data) {
        if (data.hasOwnProperty(k)) {
            keys.push(k);
        }
    }

    keys.sort();

    len = keys.length;

    for (i = 0; i < len; i++) {
        k = keys[i];
        sigStr = sigStr + data[k];
    }

    return crypto.createHash('md5').update(sigStr).digest('hex');
}

function sendAPI(data, method, callback) {
    var data_query = '', i;
    for (i in data) {
        data_query = data_query + '&' + i + '=' + data[i];
    }
    var sig = signature(data, method);
    var options = {
        host: "api.xuite.net",
        path: "/api.php?api_key=" + api_key + "&api_sig=" + sig + "&method=" + method + "&auth=" + access_token + data_query,
        port: 443,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Referer": "http://google.com/"
        }
    };

    // Set up the request
    var req = https.request(options, function(res) {
        var str = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(str);
            if (!result.ok) {
                console.log(result);
                util.handleError({hoerror: 2, message: result.msg}, callback, callback, 400, null);
            }
            setTimeout(function(){
                callback(null, result.rsp);
            }, 0);
        });
    });
    req.on('error', function(e) {
        console.log(options);
        util.handleError(e, callback, callback, 400, null);
    });
    req.end();
}

function getFormDataForPost(fields, files) {
    function encodeFieldPart(boundary,name,value) {
        var return_part = "--" + boundary + "\r\n";
        return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
        return_part += value + "\r\n";
        return return_part;
    }
    function encodeFilePart(boundary,type,name,filename) {
        var return_part = "--" + boundary + "\r\n";
        return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
        return_part += "Content-Type: " + type + "\r\n\r\n";
        return return_part;
    }
    var boundary = Math.random();
    var post_data = [];

    if (fields) {
        for (var key in fields) {
            var value = fields[key];
            post_data.push(new Buffer(encodeFieldPart(boundary, key, value), 'ascii'));
        }
    }
    if (files) {
        for (var key in files) {
            var value = files[key];
            post_data.push(new Buffer(encodeFilePart(boundary, value.type, value.keyname, value.valuename), 'ascii'));

            post_data.push(new Buffer(value.data, 'utf8'))
        }
    }
    post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
    var length = 0;

    for(var i = 0; i < post_data.length; i++) {
        length += post_data[i].length;
    }
    var params = {
        postdata : post_data,
        headers : {
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': length
        }
    };
    return params;
}

function postData(fields, files, options, headers, callback, filePath, not_utf8) {
    var headerparams = {}, post_options = {};
    if (files) {
        headerparams = getFormDataForPost(fields, files);
        var totalheaders = headerparams.headers;
        for (var key in headers) totalheaders[key] = headers[key];

        post_options = {
            host: options.host,
            port: options.port,
            path: options.path,
            method: options.method || 'POST',
            headers: totalheaders
        };
    } else {
        var post_data = querystring.stringify(fields);
        if (not_utf8) {
            post_data = '';
            for (var i in fields) {
                if (post_data) {
                    post_data = post_data + '&' + i + '=' + util.big5_encode(fields[i]);
                } else {
                    post_data = post_data + i + '=' + util.big5_encode(fields[i]);
                }
            }
        }
        headerparams = {postdata: [post_data]};
        post_options = {
            host: options.host,
            port: options.port,
            path: options.path,
            method: options.method || 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length}
        };
    }
    var request = http.request(post_options, function(response) {
        response.body = '';
        if (!not_utf8) {
            response.setEncoding(options.encoding);
        }

        if (filePath) {
            if (response.statusCode === 200) {
                var file_write =  fs.createWriteStream(filePath);
                response.pipe(file_write);
                file_write.on('finish', function(){
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            } else if (res.statusCode === 301 || res.statusCode === 302){
                if (!response.headers.location) {
                    console.log(response.headers);
                    util.handleError({hoerror: 1, message: response.statusCode + ': download do not complete'}, callback, callback, 400, null);
                }
                setTimeout(function(){
                    var urlParse = urlMod.parse(response.headers.location);
                    // An object of options to indicate where to post to
                    var new_options = {
                        host: urlParse.hostname,
                        port: options.port,
                        path: urlParse.path,
                        method: options.method,
                        encoding : options.encoding
                    };
                    postData(fields, files, new_options, headers, callback, filePath);
                }, 0);
            } else {
                console.log(response);
                util.handleError({hoerror: 1, message: response.statusCode + ': download do not complete'}, callback, callback, 400, null);
            }
            response.on('end', function() {
                end = true;
                console.log('response end');
            });
        } else {
            response.on('data', function(chunk){
                if (not_utf8) {
                    response.body = Buffer.concat([new Buffer(response.body, 'binary'), new Buffer(chunk, 'binary')]);
                } else {
                    response.body += chunk;
                }
            });
            response.on('end', function() {
                if (not_utf8) {
                    if (response.body) {
                        response.body = util.bufferToString(response.body);
                    }
                }
                setTimeout(function(){
                    callback(null, response);
                }, 0);
            });
        }
    });
    for (var i = 0; i < headerparams.postdata.length; i++) {
        request.write(headerparams.postdata[i]);
    }
    request.on('error', function(e) {
        console.log(post_options);
        if (e.code === 'HPE_INVALID_CONSTANT' || e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND' || e.code === 'ETIMEDOUT' || e.code === 'EAFNOSUPPORT') {
            util.handleError(e, callback, callback, 400, null);
        } else {
            util.handleError(e);
        }
    });
    request.end();
}

module.exports = {
    refreshToken: function(callback) {
        mongo.orig("find", "accessToken", {api: "xuite"}, {limit: 1}, function(err, tokens){
            if(err) {
                util.handleError(err, callback, callback);
            }
            if (tokens.length === 0) {
                util.handleError({hoerror: 1, message: "can not find token"}, callback, callback);
            }
            var options = {
                host: "my.xuite.net",
                path: "/service/account/token.php?grant_type=refresh_token&client_id=" + api_key + "&client_secret=" + api_secret + "&refresh_token=" + tokens[0]["refresh_token"] + "&redirect_uri=" + config_type.google_redirect,
                port: 443,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            // Set up the request
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var str = '';
                res.on('data', function (chunk) {
                    str += chunk;
                });
                res.on('end', function () {
                    console.log(str);
                    new_token = JSON.parse(str);
                    mongo.orig("update", "accessToken", {api: "xuite"}, {$set: new_token}, function(err,token){
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        access_token = new_token["access_token"];
                        expire_in = new_token["expire_in"];
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            });
            req.on('error', function(e) {
                util.handleError(e, callback, callback);
            });
            req.end();
        });
    },
    xuiteDownload: function(url, filePath, callback, threshold, is_check, is_file, referer, not_utf8, fake_ip, is_post) {
        if (is_file && !this.setApiQueue('xuiteDownload', [url, filePath, callback, threshold])) {
            return false;
        }
        threshold = typeof threshold !== 'undefined' ? threshold : null;
        is_check = typeof is_check !== 'undefined' ? is_check : true;
        is_file = typeof is_file !== 'undefined' ? is_file : true;
        var urlParse = urlMod.parse(url);
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'GET',
            family: 4,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        var requestUse = http;
        if (url.match(/^https/)) {
            requestUse = https;
            options = {
                host: urlParse.hostname,
                rejectUnauthorized : false,
                port: 443,
                path: urlParse.path,
                method: 'GET',
                family: 4,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
        }
        if (is_post) {
            options['method'] = 'POST';
        }
        if (referer) {
            options.headers['Referer'] = referer;
        }
        if (fake_ip) {
            options.headers['X-Forwarded-For'] = fake_ip;
            options.headers['Client-IP'] = fake_ip;
        }
        if (!is_file) {
            options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36';
        }
        var this_obj = this;
        var time = 1000;
        var retry = max_retry;
        recur_download(time);
        function recur_download(time) {
            setTimeout(function(){
                //var is_200 = false;
                var req = requestUse.request(options, function(res) {
                    res.body = '';
                    var length = 0;
                    var is_move = false;
                    if (res.statusCode === 200) {
                        if (res.headers['content-length'] && is_file) {
                            length = Number(res.headers['content-length']);
                            //complete = true;
                            var file_write =  fs.createWriteStream(filePath);
                            res.pipe(file_write);
                            file_write.on('finish', function(){
                                console.log(filePath);
                                var stats = fs.statSync(filePath);
                                if (length === stats["size"]) {
                                    var filename = null;
                                    if (res.headers['content-disposition']) {
                                        filename = res.headers['content-disposition'].match(/attachment; filename=(.*)/);
                                    }
                                    this_obj.getApiQueue();
                                    if (filename) {
                                        setTimeout(function(){
                                            callback(null, urlParse.pathname, filename[1]);
                                        }, 0);
                                    } else {
                                        setTimeout(function(){
                                            callback(null, urlParse.pathname);
                                        }, 0);
                                    }
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
                        } else if (!is_check) {
                            if (is_file) {
                                this_obj.getApiQueue();
                                var file_write =  fs.createWriteStream(filePath);
                                res.pipe(file_write);
                                file_write.on('finish', function(){
                                    console.log(filePath);
                                    setTimeout(function(){
                                        callback(null, urlParse.pathname);
                                    }, 0);
                                });
                            }
                        } else {
                            time = time * 2;
                            console.log(time);
                            if (threshold) {
                                if (time < threshold) {
                                    setTimeout(function(){
                                        recur_download(time);
                                    }, 0);
                                } else {
                                    console.log(options);
                                    if (is_file) {
                                        this_obj.getApiQueue();
                                    }
                                    util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                }
                            } else {
                                if (time < 600000) {
                                    setTimeout(function(){
                                        recur_download(time);
                                    }, 0);
                                } else {
                                    console.log(options);
                                    if (is_file) {
                                        this_obj.getApiQueue();
                                    }
                                    util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                                }
                            }
                        }
                    } else if (res.statusCode === 301 || res.statusCode === 302) {
                        if (is_file) {
                            this_obj.getApiQueue();
                        }
                        if (!res.headers.location) {
                            console.log(res.headers);
                            util.handleError({hoerror: 1, message: res.statusCode + ': download do not complete'}, callback, callback);
                        }
                        is_move = true;
                        setTimeout(function(){
                            this_obj.xuiteDownload(res.headers.location, filePath, callback, threshold, is_check, is_file, referer, not_utf8);
                        }, 0);
                        req.abort();
                    } else if (res.statusCode === 400) {
                        console.log(url);
                        console.log(options);
                        if (is_file) {
                            this_obj.getApiQueue();
                        }
                        util.handleError({hoerror: 2, message: res.statusCode + ': download location cannot be fund'}, callback, callback);
                    } else {
                        console.log(res);
                        if (is_file) {
                            this_obj.getApiQueue();
                        }
                        util.handleError({hoerror: 1, message: res.statusCode + ': download do not complete'}, callback, callback);
                    }
                    if (!is_move) {
                        if (is_file) {
                            res.on('end', function() {
                                console.log('res end');
                            });
                        } else {
                            res.on('data', function(chunk){
                                if (not_utf8) {
                                    res.body = Buffer.concat([new Buffer(res.body, 'binary'), new Buffer(chunk, 'binary')]);
                                } else {
                                    //is_200 = true;
                                    res.body += chunk;
                                }
                            });
                            res.on('end', function() {
                                req.abort();
                                if (not_utf8) {
                                    if (res.headers['content-encoding'] === 'gzip') {
                                        zlib.gunzip(res.body, function(err, decoded) {
                                            if (err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            res.body = decoded.toString();
                                            setTimeout(function(){
                                                callback(null, res.body);
                                            }, 0);
                                        });
                                    } else {
                                        if (res.body) {
                                            res.body = util.bufferToString(res.body);
                                        }
                                        setTimeout(function(){
                                            callback(null, res.body);
                                        }, 0);
                                    }
                                } else {
                                    setTimeout(function(){
                                        callback(null, res.body);
                                    }, 0);
                                }
                            });
                        }
                    }
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
                                if (is_file) {
                                    this_obj.getApiQueue();
                                }
                                util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                            }
                        } else {
                            if (time < 600000) {
                                setTimeout(function(){
                                    recur_download(time);
                                }, 0);
                            } else {
                                console.log(options);
                                if (is_file) {
                                    this_obj.getApiQueue();
                                }
                                util.handleError({hoerror: 2, message: "timeout"}, callback, callback);
                            }
                        }
                    } else if (e.code === 'HPE_INVALID_CONSTANT' || e.code === 'EAFNOSUPPORT') {
                        if (is_file) {
                            this_obj.getApiQueue();
                        }
                        util.handleError(e, callback, callback, 400, null);
                    }
                });
                /*if (!is_file) {
                    req.setTimeout(10000, function() {
                        console.log('timeout');
                        console.log(new Date());
                        if (!is_200) {
                            req.abort();
                            retry--;
                            console.log(retry);
                            if (retry === 0) {
                                console.log(options);
                                this_obj.getApiQueue();
                                util.handleError({hoerror: 2, message: "download not complete"}, callback, callback);
                            } else {
                                setTimeout(function(){
                                    recur_download(500);
                                }, 0);
                            }
                        }
                    });
                }*/
                req.end();
            }, time);
        }
    },
    xuiteUpload: function(url, fields, file_location, size, callback) {
        if (!this.setApiQueue('xuiteUpload', [url, fields, file_location, size, callback])) {
            return false;
        }
        var urlParse = urlMod.parse(url);

        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : 'utf8'
        };

        var start = 0, end = 0;
        var files = [{type: 'application/octet-stream', keyname: 'upload_file', valuename: 'temp'}];

        fields['api_key'] = api_key;
        recur_read(null, null);
        var this_obj = this;
        function recur_read(err, res) {
            if (err) {
                this_obj.getApiQueue();
                util.handleError(err, callback, callback, null);
            }
            if (start !== 0 && !res) {
                this_obj.getApiQueue();
                util.handleError({hoerror: 1, message: "error stream"}, callback, callback, null);
            }
            if (res) {
                var result = JSON.parse(res.body);
                if (!result.ok) {
                    console.log(result);
                    this_obj.getApiQueue();
                    util.handleError({hoerror: 2, message: result.msg}, callback, callback, null);
                }
                start = result.rsp.file_info.total_filesize;
            }
            if (end < size) {
                if (size < (end + chunk)) {
                    end = size;
                } else {
                    end = start + chunk;
                }
                fs.open(file_location, 'r', function(err, fd) {
                    if (err) {
                        this_obj.getApiQueue();
                        util.handleError(err, callback, callback, null);
                    }
                    var buffer = new Buffer(end - start);
                    fs.read(fd, buffer, 0, end - start, start, function(err, num) {
                        if (err) {
                            this_obj.getApiQueue();
                            util.handleError(err, callback, callback, null);
                        }
                        files[0]['data'] = buffer;
                        fields['p_size'] = buffer.length;
                        fields['action'] = "transfer";
                        fs.close(fd);
                        postData(fields, files, options, {}, recur_read);
                    });
                });
            } else {
                fields['action'] = "commit";
                postData(fields, null, options, {}, function(err, res) {
                    if (err) {
                        this_obj.getApiQueue();
                        util.handleError(err, callback, callback, null);
                    }
                    var result = JSON.parse(res.body);
                    if (!result.ok) {
                        console.log(result);
                        this_obj.getApiQueue();
                        util.handleError({hoerror: 2, message: result.msg}, callback, callback, null);
                    }
                    this_obj.getApiQueue();
                    setTimeout(function(){
                        callback(null, result.rsp);
                    }, 0);
                });
            }
        }
    },
    xuiteApi: function (method, data, callback) {
        var this_obj = this;
        if (!access_token || !expire_in) {
            mongo.orig("find", "accessToken", {api: "xuite"}, {limit: 1}, function(err, tokens){
                if(err) {
                    util.handleError(err, callback, callback, null);
                }
                if (tokens.length === 0) {
                    util.handleError({hoerror: 2, message: "can not find token"}, callback, callback, null);
                }
                access_token = tokens[0]["access_token"];
                expire_in = tokens[0]["expire_in"];
                if ((expire_in*1000) < (Date.now()-300000)) {
                    this_obj.refreshToken(function(err) {
                        if (err) {
                            util.handleError(err, callback, callback, null);
                        }
                        sendAPI(data, method, callback);
                    });
                } else {
                    sendAPI(data, method, callback);
                }
            });
        } else if ((expire_in*1000) < (Date.now()-300000)) {
            this_obj.refreshToken(function(err) {
                if (err) {
                    util.handleError(err, callback, callback, null);
                }
                sendAPI(data, method, callback);
            });
        } else {
            sendAPI(data, method, callback);
        }
    },
    xuiteDocurl: function(meta, type) {
        var secret = meta['sn'] + ':sync_1_' + meta['parent'] + '_' + meta['key'] + '_' + meta['version'] + meta['owner'] + ':20130516';
        var checksum = crypto.createHash('md5').update(secret).digest('hex');
        return 'http://f.sync.hamicloud.net/@docview/' + meta['sn'] + '/sync/pub/' + checksum + '/' + meta['parent'] + '/' + meta['key'] + '/' + meta['version'] + meta['owner'] + '.' + type;
    },
    xuiteDeleteFile: function(key, callback) {
        this.xuiteApi("xuite.webhd.private.cloudbox.deleteFile", {parent: parent_key, key: key}, function(err, deleteResult) {
            if (err) {
                util.handleError(err, callback, callback, null);
            }
            setTimeout(function(){
                callback(null);
            }, 0);
        });
    },
    xuiteDownloadMedia: function(time, threshold, key, filePath, is_thumb, is_hd, callback) {
        var this_obj = this;
        setTimeout(function(){
            this_obj.xuiteApi("xuite.webhd.private.cloudbox.gallery.getMediaStatus", {key: key}, function(err, statusResult) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (statusResult.status === '1') {
                    this_obj.xuiteApi("xuite.webhd.private.cloudbox.gallery.getSingleMedia", {key: key}, function(err, videoResult) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(videoResult);
                        var video_url = videoResult.video_url.replace(/video/, function (a) {
                            return 'stream';
                        });
                        console.log(video_url);
                        if (is_hd === 2) {
                            setTimeout(function(){
                                callback(null, is_hd, video_url.slice(0, video_url.length -1) + 'h');
                            }, 0);
                            return;
                        }
                        if (is_thumb) {
                            this_obj.xuiteDownload(videoResult.thumb, filePath + '_s.jpg', function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                this_obj.xuiteDownload(video_url, filePath + '_t', function(err) {
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
                                            if (is_hd === 0) {
                                                this_obj.xuiteDeleteFile(key, function(err) {
                                                    if (err) {
                                                        util.handleError(err, callback, callback, null);
                                                    }
                                                    setTimeout(function(){
                                                        callback(null, 0, '');
                                                    }, 0);
                                                });
                                            } else {
                                                setTimeout(function(){
                                                    callback(null, is_hd, video_url.slice(0, video_url.length -1) + 'h');
                                                }, 0);
                                            }
                                        });
                                    });
                                });
                            });
                        } else {
                            this_obj.xuiteDownload(video_url, filePath + '_t', function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback, null);
                                }
                                fs.unlink(filePath, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    fs.rename(filePath + '_t', filePath, function(err) {
                                        if (err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        if (is_hd === 0) {
                                            this_obj.xuiteDeleteFile(key, function(err) {
                                                if (err) {
                                                    util.handleError(err, callback, callback, null);
                                                }
                                                setTimeout(function(){
                                                    callback(null);
                                                }, 0);
                                            });
                                        } else {
                                            setTimeout(function(){
                                                callback(null, video_url, is_hd);
                                            }, 0);
                                        }
                                    });
                                });
                            });
                        }
                    });
                } else if (statusResult.status === '2') {
                    time = time * 2;
                    console.log(time);
                    var timeout = 600000;
                    var real_threshold = threshold;
                    /*if (is_hd) {
                        real_threshold = 2*threshold;
                    }*/
                    if (real_threshold > 600000) {
                        timeout = real_threshold;
                    }
                    if (time < timeout) {
                        this_obj.xuiteDownloadMedia(time, threshold, key, filePath, is_thumb, is_hd, callback);
                    } else {
                        util.handleError({hoerror: 2, message: "timeout"}, callback, callback, null);
                    }
                } else {
                    console.log(statusResult);
                    util.handleError({hoerror: 2, message: statusResult.status + ": video upload fail"}, callback, callback);
                }
            });
        }, time);
    },
    sendVideomega: function(url, callback) {
        this.xuiteDownload(url, '', function(err, raw_data) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            var link_match = raw_data.match(/(eval[^<]+)/)[1];
            if (!link_match) {
                util.handleError({hoerror: 2, message: "videomega url cannot find"}, callback, callback);
            }
            link_match = link_match.replace(/\$\("\d"\).\d/, "");
            var downloadLink =  eval(link_match);
            console.log(downloadLink);
            var access_match = raw_data.match(/id: "(\d+)", referal: "([^"]+)"/);
            if (!link_match) {
                util.handleError({hoerror: 2, message: "videomega id cannot find"}, callback, callback);
            }
            var id = access_match[1];
            var referal = access_match[2];
            var valid_url = 'http://videomega.tv/upd_views.php';
            var urlParse = urlMod.parse(valid_url);

            // An object of options to indicate where to post to
            var options = {
                host: urlParse.hostname,
                port: 80,
                path: urlParse.path,
                method: 'POST',
                encoding : 'utf8'
            };
            var fields = {};
            fields['id'] = id;
            fields['referal'] = referal;
            postData(fields, null, options, {}, function(err) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                setTimeout(function(){
                    callback(null, downloadLink);
                }, 0);
            });
        }, 60000, false, false);
    },
    getTwseAnnual: function(index, year, filePath, callback) {
        var this_obj = this;
        year = year - 1911;
        var url = 'http://doc.twse.com.tw/server-java/t57sb01?id=&key=&step=1&co_id=' + index + '&year=' + year + '&seamon=&mtype=F&dtype=F04';
        this.xuiteDownload(url, '', function(err, raw_data) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            var info_match = raw_data.match(/>([^>\.]+\.(pdf|zip|doc))</i);
            if (!info_match) {
                console.log(url);
                util.handleError({hoerror: 2, message: "cannot find annual location"}, callback, callback);
            }
            url = 'http://doc.twse.com.tw/server-java/t57sb01?step=9&kind=F&co_id=' + index + '&filename=' + info_match[1];
            var ori_name = info_match[1];
            this_obj.xuiteDownload(url, '', function(err, raw_data1) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                info_match = raw_data1.match(/<a href='([^']+)'/);
                if (!info_match) {
                    console.log(url);
                    this_obj.xuiteDownload(url, filePath, function(err, pathname, filename) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        setTimeout(function(){
                            callback(null, ori_name);
                        }, 0);
                    }, 60000, false);
                } else {
                    if (!info_match[1].match(/^(http|https):\/\//)) {
                        if (info_match[1].match(/^\//)) {
                            info_match[1] = 'http://doc.twse.com.tw' + info_match[1];
                        } else {
                            info_match[1] = 'http://doc.twse.com.tw/' + info_match[1];
                        }
                    }
                    this_obj.xuiteDownload(info_match[1], filePath, function(err, pathname, filename) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        if (!filename) {
                            filename = path.basename(pathname);
                        }
                        setTimeout(function(){
                            callback(null, filename);
                        }, 0);
                    });
                }
            }, 60000, false, false, 'http://doc.twse.com.tw/', true);
        }, 60000, false, false, 'http://doc.twse.com.tw/', true);
    },
    getTwseDay: function(stockCode, year, month, callback) {
        var url = 'http://www.twse.com.tw/ch/trading/exchange/STOCK_DAY/STOCK_DAYMAIN.php';
        var urlParse = urlMod.parse(url);

        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : 'utf8'
        };
        var fields = {};
        fields['download'] = 'csv';
        fields['query_year'] = year.toString();
        fields['query_month'] = month.toString();
        fields['CO_ID'] = stockCode;
        console.log(url);
        console.log(fields);
        postData(fields, null, options, {}, function(err, data) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            setTimeout(function(){
                callback(null, data.body);
            }, 0);
        }, null, true);
    },
    getTwseXml: function(stockCode, year, quarter, filePath, callback) {
        var url = 'http://mops.twse.com.tw/server-java/FileDownLoad';
        var urlParse = urlMod.parse(url);
        var is_end = false;

        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : 'utf8'
        };
        var fields = {};
        fields['step'] = 9;
        fields['co_id'] = stockCode;
        fields['year'] = year;
        fields['season'] = quarter;
        if (year > 2012) {
            fields['functionName'] = 't164sb01';
            fields['report_id'] = 'C';
        } else {
            fields['functionName'] = 't147sb02';
            fields['report_id'] = 'B';
        }
        postData(fields, null, options, {}, function(err) {
            if (err) {
                if (err.code === 'HPE_INVALID_CONSTANT') {
                    if (fields['report_id'] === 'C') {
                        fields['report_id'] = 'B';
                    } else if (fields['report_id'] === 'B') {
                        fields['report_id'] = 'A';
                    }
                    postData(fields, null, options, {}, function(err1) {
                        if (err1) {
                            if (err1.code === 'HPE_INVALID_CONSTANT') {
                                if (fields['report_id'] === 'B') {
                                    fields['report_id'] = 'A';
                                }
                                postData(fields, null, options, {}, function(err2) {
                                    if (err2) {
                                        if (!is_end) {
                                            is_end = true;
                                            util.handleError(err2, callback, callback);
                                        }
                                    }
                                    if (!is_end) {
                                        is_end = true;
                                        setTimeout(function(){
                                            callback(null, filePath);
                                        }, 0);
                                    }
                                }, filePath);
                            } else {
                                if (!is_end) {
                                    is_end = true;
                                    util.handleError(err1, callback, callback);
                                }
                            }
                        } else {
                            if (!is_end) {
                                is_end = true;
                                setTimeout(function(){
                                    callback(null, filePath);
                                }, 0);
                            }
                        }
                    }, filePath);
                } else {
                    if (!is_end) {
                        is_end = true;
                        util.handleError(err, callback, callback);
                    }
                }
            } else {
                //console.log(filePath);
                //var stats = fs.statSync(filePath);
                //console.log(stats);
                if (!is_end) {
                    is_end = true;
                    setTimeout(function(){
                        callback(null, filePath);
                    }, 0);
                }
            }
        }, filePath);
        setTimeout(function(){
            if (!is_end) {
                is_end = true;
                util.handleError({code: 'ETIMEDOUT', message: "xml time out"}, callback, callback);
            }
        }, 180000);
    },
    getSubHdUrl: function(id, callback) {
        var url = 'http://subhd.com/ajax/down_ajax';
        var urlParse = urlMod.parse(url);

        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : 'utf8'
        };
        postData({sub_id: id}, null, options, {}, function(err, res) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            //console.log(filePath);
            //var stats = fs.statSync(filePath);
            //console.log(stats);
            var result = JSON.parse(res.body);
            setTimeout(function(){
                callback(null, result);
            }, 0);
        });
    },
    madComicSearch: function(url, post, callback) {
        var urlParse = urlMod.parse(url);
        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : null
        };
        postData(post, null, options, {}, function(err, res) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            setTimeout(function(){
                callback(null, res.body);
            }, 0);
        }, null, true);
    },
    madComicSearch: function(url, post, callback) {
        var urlParse = urlMod.parse(url);
        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            encoding : null
        };
        postData(post, null, options, {}, function(err, res) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            setTimeout(function(){
                callback(null, res.body);
            }, 0);
        }, null, true);
    },
    kuboVideo: function(url, post, referer, callback) {
        var urlParse = urlMod.parse(url);
        // An object of options to indicate where to post to
        var options = {
            host: urlParse.hostname,
            port: 80,
            path: urlParse.path,
            method: 'POST',
            headers: {
                'Referer': referer
            }
        };
        postData(post, null, options, {}, function(err, res) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            setTimeout(function(){
                callback(null, res.body);
            }, 0);
        });
    },
    setApiQueue: function(name, param) {
        console.log('aping');
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
        console.log('aping');
        console.log(api_ing);
        api_duration = 0;
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
