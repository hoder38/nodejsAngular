var crypto = require('crypto'),
    path = require('path'),
    MobileDetect = require('mobile-detect');
var mongo = require("../models/mongo-tool.js"),
    charsetDetector = require("node-icu-charset-detector");
module.exports = {
    toValidName: function(str) {
        var buf = new Buffer(str, 'utf-8');
        str = buf.toString();
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
                    if (trim.search(/^[^\\\/\|\*\?"<>:]{1,255}$/) != -1) {
                        if (trim.replace(/[\s　]+/g, '') !== '') {
                            return trim;
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
                case 'passwd':
                    if (str.match(/^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%\!]{6,20}$/)) {
                        return str;
                    }
                    break;
                case 'uid':
                    if (str.match(/^[0-9a-f]{24}$/)) {
                        return mongo.objectID(str);
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
        console.log(str);
        return false;
    },
    handleError: function(err, next, callback, code) {
        callback = typeof callback !== 'undefined' ? callback : null;
        if (err) {
            if (typeof err === 'object' && err.hoerror) {
                if (err.hoerror === 1) {
                    next(new Error('server error: ' + err.msg));
                    throw new Error('terminal');
                } else if (err.hoerror === 2) {
                    if (!callback) {
                        console.log("ignored error: " + err.msg);
                    } else if (typeof callback === 'object') {
                        code = typeof code !== 'undefined' ? code : 400;
                        console.log("user error: " + err.msg);
                        callback.send(err.msg, code);
                        throw new Error('terminal');
                    } else if (typeof callback === 'function') {
                        console.log("delay error: " + err.msg);
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
                        next(new Error(err));
                        throw new Error('terminal');
                    }
                } else {
                    next(new Error(err));
                    throw new Error('terminal');
                }
            } else {
                next(new Error(err));
                throw new Error('terminal');
            }
        }
    },
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    getFileLocation: function (owner, uid) {
        var owner_S = owner.toString();
        var owner_md5 = crypto.createHash('md5').update(owner_S).digest('hex');
        var uid_S = uid.toString();
        var uid_md5 = crypto.createHash('md5').update(uid_S).digest('hex');
        return path.join("/mnt/storage", owner_md5.substr(0, 2), owner_S, uid_md5.substr(0, 2), uid_S);
    },
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
        console.log(charset);
        try {
            return buffer.toString(charset);
        } catch (x) {
            var Iconv = require("iconv").Iconv;
            var charsetConverter = new Iconv(charset, "utf8");
            return charsetConverter.convert(buffer).toString();
        }
    }
};