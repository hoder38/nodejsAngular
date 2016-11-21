var crypto = require('crypto'),
    path = require('path'),
    MobileDetect = require('mobile-detect'),
    fs = require("fs"),
    iconv = require("iconv-lite");
var mongo = require("../models/mongo-tool.js"),
    charsetDetector = require("node-icu-charset-detector"),
    ass2vtt = require('ass-to-vtt');
var config_type = require('../../../ver.js');

var pwCheck = {};

var re_weburl = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:/\\S*)?" +
        "$", "i"
    );

var config_glb = require('../../../config/' + config_type.dev_type + '.js');
module.exports = {
    toValidName: function(str) {
        var buf = new Buffer(str, 'utf-8');
        str = buf.toString();
        str = str.replace(/&#\d+;/g, ' ');
        str = str.trim();
        if (str.replace(/[\s　]+/g, '') === '') {
            str = 'empty';
        }
        str = str.replace(/[\\\/\|\*\?"<>:]+/g, ',');
        str = str.slice(0, 255);
        return str;
    },
    isValidString: function(str, type) {
        if (typeof str === 'string' || typeof str === 'number') {
            var buf = new Buffer(str, 'utf-8');
            str = buf.toString();
            switch (type) {
                case 'name':
                    var trim = str.trim();
                    //改為 \ / : ? < > * " |  允許 ' ` &
                    if (trim !== '.' && trim !== '..') {
                        if (trim.search(/^[^\\\/\|\*\?"<>:]{1,255}$/) != -1) {
                            if (trim.replace(/[\s　]+/g, '') !== '') {
                                return trim;
                            }
                        }
                    }
                    break;
                case 'desc':
                    //不合法字元: \ / | * ? ' " < > ` : &
                    if (str.search(/^[^\\\/\|\*\?\'"<>`:&]{0,250}$/) !== -1) {
                        return str;
                    }
                    break;
                case 'perm':
                    if ((Number(str) || Number(str) === 0) && Number(str) < 32 && Number(str) >= 0) {
                        return Number(str);
                    }
                    break;
                case 'parentIndex':
                    if (Number(str) && Number(str) <= 10 && Number(str) > 0) {
                        return Number(str);
                    }
                    break;
                case 'int':
                    if (Number(str) && Number(str) > 0) {
                        return Number(str);
                    }
                    break;
                case 'passwd':
                    if (str.match(/^[0-9a-zA-Z!@#$%]{6,20}$/)) {
                        return str;
                    }
                    break;
                case 'altpwd':
                    if (str.match(/^[0-9a-zA-Z\._!@#$%;\u4e00-\u9fa5]{2,30}$/)) {
                        return str;
                    }
                    break;
                case 'uid':
                    if (str.match(/^[0-9a-f]{24}$/)) {
                        return mongo.objectID(str);
                    }
                    break;
                case 'url':
                    if (str.match(re_weburl) || str.match(/^magnet:(\?xt=urn:btih:[a-z0-9]{20,50}|stop)/i)) {
                        return encodeURIComponent(str);
                    }
                    break;
                case 'email':
                    if (str.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/)) {
                        return str;
                    }
                    break;
                default:
                    break;
            }
        } else if (type === 'uid' && typeof str === 'object') {
            str = str.toString();
            if (str.match(/^[0-9a-f]{24}$/)) {
                return mongo.objectID(str);
            }
        }
        console.log('invalid string');
        console.log(str);
        return false;
    },
    handleError: function(err, next, callback, code) {
        callback = typeof callback !== 'undefined' ? callback : null;
        if (err) {
            if (!callback && !next) {
                if (err.hoerror) {
                    console.log("ignored error: %s [%s]", err.message, err.code);
                    err = new Error("ignored error: " + err.message);
                } else {
                    console.log('ignored error: ');
                    console.log("%s %s [%s]", err.name, err.message, err.code);
                }
                if (err.stack) {
                    console.log(err.stack);
                }
            } else {
                if (typeof err === 'object' && err.hoerror) {
                    if (err.hoerror === 1) {
                        next(new Error('server error: ' + err.message));
                        throw new Error('terminal');
                    } else if (err.hoerror === 2) {
                        if (!callback) {
                            console.log("ignored error: %s [%s]", err.message, err.code);
                            var ig_err = new Error("ignored error: "+ err.message);
                            if (ig_err.stack) {
                                console.log(ig_err.stack);
                            }
                        } else if (typeof callback === 'object') {
                            code = typeof code !== 'undefined' ? code : 400;
                            console.log("user error: %s [%s]", err.message, err.code);
                            callback.send(err.message, code);
                            throw new Error('terminal');
                        } else if (typeof callback === 'function') {
                            console.log("delay error: %s [%s]", err.message, err.code);
                            var this_obj = this;
                            var args = Array.prototype.slice.call(arguments, 3);
                            if (args.length > 0 ) {
                                args.splice(0, 0, err);
                                setTimeout(function(){
                                    callback.apply(this_obj, args);
                                }, 0);
                            } else {
                                setTimeout(function(){
                                    callback(err);
                                }, 0);
                            }
                            throw new Error('terminal');
                        } else {
                            console.log(callback);
                            next(new Error("unknown callback error: " + err.message));
                            throw new Error('terminal');
                        }
                    } else {
                        next(new Error("hoerror " + err.hoerror + ": " + err.message));
                        throw new Error('terminal');
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments, 3);
                    if (args.length > 0 ) {
                        args.splice(0, 0, err);
                        next.apply(this, args);
                    } else {
                        next(err);
                    }
                    throw new Error('terminal');
                }
            }
        }
    },
    clone: function (obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (x) {
            console.log(obj);
            return {};
        }
    },
    getFileLocation: function (owner, uid) {
        var owner_S = owner.toString();
        var owner_md5 = crypto.createHash('md5').update(owner_S).digest('hex');
        var uid_S = uid.toString();
        var uid_md5 = crypto.createHash('md5').update(uid_S).digest('hex');
        return path.join(config_glb.nas_prefix, owner_md5.substr(0, 2), owner_S, uid_md5.substr(0, 2), uid_S);
    },
    //記得修改
    /*getRandomLocation: function () {
        var parent = Math.random().toString();
        var parent_md5 = crypto.createHash('md5').update(parent).digest('hex');
        var uid = new Date().getTime().toString();
        var uid_md5 = crypto.createHash('md5').update(uid).digest('hex');
        //return path.join(config_glb.nas_prefix, parent_md5.substr(0, 2), parent, uid_md5.substr(0, 2), uid);
        return path.join(config_glb.nas_tmp, 'temp', uid);
    },*/
    isMobile: function(agent) {
        var md = new MobileDetect(agent);
        return md.mobile();
    },
    checkAdmin: function(perm, user) {
        if (user.perm > 0 && user.perm <= perm) {
            return true;
        } else {
            return false;
        }
    },
    bufferToString: function(buffer) {
        var charset = charsetDetector.detectCharset(buffer).toString();
        try {
            return buffer.toString(charset);
        } catch (x) {
            return iconv.decode(buffer, charset);
        }
    },
    big5_encode: function(str) {
        var buf = null;
        var rtn = "";
        for (var j = 0 ; j < str.length; j++) {
            if (str[j].match(/^[\x00-\x7F]$/)) {
                rtn += encodeURIComponent(str[j]);
            } else {
                buf = iconv.encode(str[j], 'big5');
                for(var i=0;i<buf.length;i+=2) {
                    rtn += '%' + buf[i].toString(16).toUpperCase();
                    rtn += ((buf[i+1] >= 65 && buf[i+1] <= 90)||(buf[i+1]>=97 && buf[i+1]<=122))? String.fromCharCode(buf[i+1]): '%' + buf[i+1].toString(16).toUpperCase();
                }
            }
        }
        return rtn;
    },
    deleteFolderRecursive: function(path) {
        var this_obj = this;
        if(fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    this_obj.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    userPWCheck: function(user, pw) {
        if (user.password === crypto.createHash('md5').update(pw).digest('hex')) {
            pwCheck[user._id] = 1;
            setTimeout(function() {
                pwCheck[user._id] = 0;
            }, 70000);
            return true;
        } else if (pwCheck[user._id] === 1){
            return true;
        }
        return false;
    },
    SRT2VTT: function(filePath, ext, callback) {
        var this_obj = this;
        fs.readFile(filePath + '.' + ext, function (err,data) {
            if (err) {
                this_obj.handleError(err, callback, callback);
            }
            data = this_obj.bufferToString(data);
            if (ext === 'srt') {
                var result = "WEBVTT\n\n";
                result = result + data.replace(/,/g, '.');
                fs.writeFile(filePath + '.vtt', result, 'utf8', function (err) {
                    if (err) {
                        console.log(filePath + '.vtt');
                        this_obj.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            } else {
                fs.writeFile(filePath + '.sub', data, 'utf8', function (err) {
                    if (err) {
                        console.log(filePath + '.sub');
                        this_obj.handleError(err, callback, callback);
                    }
                    var subfs = fs.createReadStream(filePath + '.sub');
                    subfs.pipe(ass2vtt()).pipe(fs.createWriteStream(filePath + '.vtt'));
                    subfs.on('end', function() {
                        fs.unlink(filePath + '.sub', function(err) {
                            if (err) {
                                this_obj.handleError(err, callback, callback);
                            }
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                });
            }
        });
    },
    torrent2Magnet: function(torInfo) {
        if (!torInfo.infoHash) {
            console.log('miss infoHash');
            return false;
        }
        var magnet = 'magnet:?xt=urn:btih:' + torInfo.infoHash + '&dn=';
        if (torInfo.announceList) {
            for (var i = 0; i < 10; i++) {
                magnet = magnet + '&tr=' + encodeURIComponent(torInfo.announceList[i]);
            }
        } else if (torInfo.announce) {
            for (var i = 0; i < 10; i++) {
                magnet = magnet + '&tr=' + encodeURIComponent(torInfo.announce[i]);
            }
        }
        return magnet;
    }
};