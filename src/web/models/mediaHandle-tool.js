var util = require("../util/utility.js");

var api = require("../models/api-tool.js");

var googleApi = require("../models/api-tool-google.js");

var tagTool = require("../models/tag-tool.js")("storage");

var mongo = require("../models/mongo-tool.js");

var mime = require('../util/mime.js');

var child_process = require('child_process'),
    Transcoder = require('stream-transcoder'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require("fs");

var transTime = 3300000;
module.exports = function(sendWs) {
    return {
        handleMediaUpload: function(mediaType, filePath, fileID, fileName, fileSize, user, callback, vlog_act) {
            var this_obj = this;
            if (mediaType) {
                var uploadPath = filePath;
                if (mediaType['realPath']) {
                    uploadPath = filePath + '/real/' + mediaType['realPath'];
                }
                if (mediaType['type'] === 'vlog' || (mediaType['type'] === 'video' && vlog_act)) {
                    api.xuiteApi("xuite.webhd.prepare.cloudbox.postFile", {full_path: '/AnNoPiHo/' + fileID.toString() + "." + mediaType['ext'], size: fileSize}, function(err, result) {
                        if (err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        console.log(result);
                        api.xuiteUpload(result.url, {auth_key: result.auth_key, checksum: result.checksum, api_otp: result.otp}, uploadPath, fileSize, function(err, uploadResult) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            console.log(uploadResult);
                            mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.key": uploadResult.key}}, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                this_obj.handleMedia(mediaType, filePath, fileID, fileName, uploadResult.key, user, callback, vlog_act);
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
                        util.deleteFolderRecursive(filePath + '_img/temp');
                        zipbook();
                    }
                    function zipbook() {
                        var cmdline = path.join(__dirname, "../util/myuzip.py") + ' ' + filePath + ' ' + filePath + '_img/temp';
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
                            util.deleteFolderRecursive(filePath + '_img/temp');
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
                                    this_obj.handleMedia(mediaType, filePath, fileID, fileName, metadata.id, user, callback, vlog_act);
                                });
                            });
                        });
                    }
                } else {
                    if (mediaType['type'] === 'rawdoc') {
                        mediaType['ext'] = 'txt';
                    }
                    var data = {type: 'media', name: fileID.toString() + "." + mediaType['ext'], filePath: uploadPath};
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
                            this_obj.handleMedia(mediaType, filePath, fileID, fileName, metadata.id, user, callback, vlog_act);
                        });
                    });
                }
            }
        },
        completeMedia: function (fileID, status, callback, rmPath, number) {
            var data = {status: status};
            if (number && number > 1) {
                data['present'] = number;
            }
            if (rmPath) {
                data['status'] = 9;
            }
            mongo.orig("update", "storage", { _id: fileID }, {$unset: {mediaType: ""}, $set: data}, function(err, item){
                if(err) {
                    util.handleError(err, callback, callback);
                }
                if (rmPath) {
                    fs.unlink(rmPath, function(err) {
                        if (err) {
                            util.handleError(err);
                        }
                    });
                }
                setTimeout(function(){
                    callback(null);
                }, 0);
            });
        },
        handleMedia: function (mediaType, filePath, fileID, fileName, key, user, callback, vlog_act) {
            var this_obj = this;
            var savePath = filePath;
            var rmPath = null;
            if (mediaType['realPath']) {
                savePath = filePath + '/' + mediaType['fileIndex'] + '_complete';
                rmPath = filePath + '/real/' + mediaType['realPath'];
            }
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
                                this_obj.completeMedia(fileID, 2, callback);
                            });
                        } else {
                            this_obj.completeMedia(fileID, 2, callback);
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
                                    this_obj.completeMedia(fileID, 2, callback);
                                });
                            } else {
                                this_obj.completeMedia(fileID, 2, callback);
                            }
                        });
                    });
                }
            } else if (mediaType['type'] === 'vlog' || (mediaType['type'] === 'video' && vlog_act)) {
                if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
                    console.log(mediaType);
                    util.handleError({hoerror: 2, message: 'video can not be decoded!!!'}, callback, errerMedia, fileID, callback);
                }
                api.xuiteDownloadMedia(1000, transTime, key, savePath, 1, mediaType['hd'], function(err, hd, video_url) {
                    if(err) {
                        util.handleError(err, callback, errerMedia, fileID, callback);
                    }
                    if (hd === 1 || hd === 720 || hd === 1080) {
                        mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.hd": 2, status: 3}}, function(err, item){
                            if(err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            api.xuiteDownload(video_url, savePath + '_t', function(err) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                fs.unlink(savePath, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, errerMedia, fileID, callback);
                                    }
                                    fs.rename(savePath + '_t', savePath, function(err) {
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
                                                    this_obj.completeMedia(fileID, 3, function(err) {
                                                        if (err) {
                                                            util.handleError(err, callback, callback);
                                                        } else {
                                                            if (mediaType['realPath']) {
                                                                var newName = {};
                                                                newName['playList.' + mediaType['fileIndex']] = mime.changeExt(fileName, 'mp4');
                                                                mongo.orig("update", "storage", { _id: fileID }, {$set: newName}, function(err, item){
                                                                    if(err) {
                                                                        util.handleError(err, callback, callback);
                                                                    }
                                                                    setTimeout(function(){
                                                                        callback(null);
                                                                    }, 0);
                                                                });
                                                            } else {
                                                                this_obj.editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                                                    if(err) {
                                                                        util.handleError(err, callback, callback);
                                                                    }
                                                                    setTimeout(function(){
                                                                        callback(null);
                                                                    }, 0);
                                                                });
                                                            }
                                                        }
                                                    }, rmPath);
                                                });
                                            });
                                        });
                                    });
                                });
                            }, transTime);
                        });
                    } else if (hd === 2) {
                        api.xuiteDownload(video_url, savePath + '_t', function(err) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            fs.unlink(savePath, function(err) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                fs.rename(savePath + '_t', savePath, function(err) {
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
                                                this_obj.completeMedia(fileID, 3, function(err) {
                                                    if (err) {
                                                        util.handleError(err, callback, callback);
                                                    } else {
                                                        if (mediaType['realPath']) {
                                                            var newName = {};
                                                            newName['playList.' + mediaType['fileIndex']] = mime.changeExt(fileName, 'mp4');
                                                            mongo.orig("update", "storage", { _id: fileID }, {$set: newName}, function(err, item){
                                                                if(err) {
                                                                    util.handleError(err, callback, callback);
                                                                }
                                                                setTimeout(function(){
                                                                    callback(null);
                                                                }, 0);
                                                            });
                                                        } else {
                                                            this_obj.editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                                                if(err) {
                                                                    util.handleError(err, callback, callback);
                                                                }
                                                                setTimeout(function(){
                                                                    callback(null);
                                                                }, 0);
                                                            });
                                                        }
                                                    }
                                                }, rmPath);
                                            });
                                        });
                                    });
                                });
                            });
                        }, transTime);
                    } else {
                        this_obj.completeMedia(fileID, 3, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            } else {
                                if (mediaType['realPath']) {
                                    var newName = {};
                                        newName['playList.' + mediaType['fileIndex']] = mime.changeExt(fileName, 'mp4');
                                        mongo.orig("update", "storage", { _id: fileID }, {$set: newName}, function(err, item){
                                            if(err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                } else {
                                    this_obj.editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                }
                            }
                        }, rmPath);
                    }
                });
            } else if (mediaType['type'] === 'video') {
                if (!mediaType.hasOwnProperty('time') && !mediaType.hasOwnProperty('hd')) {
                    console.log(mediaType);
                    util.handleError({hoerror: 2, message: 'video can not be decoded!!!'}, callback, errerMedia, fileID, callback);
                }
                if (mediaType['thumbnail']) {
                    googleApi.googleDownloadMedia(transTime, mediaType['thumbnail'], key, savePath, mediaType['hd'], function(err) {
                        if(err) {
                            util.handleError(err, callback, errerMedia, fileID, callback);
                        }
                        var data = {fileId: key};
                        googleApi.googleApi('delete', data, function(err) {
                            if (err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            this_obj.completeMedia(fileID, 3, function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                } else {
                                    if (mediaType['realPath']) {
                                        var newName = {};
                                        newName['playList.' + mediaType['fileIndex']] = mime.changeExt(fileName, 'mp4');
                                        mongo.orig("update", "storage", { _id: fileID }, {$set: newName}, function(err, item){
                                            if(err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    } else {
                                        this_obj.editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                            if(err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    }
                                }
                            }, rmPath);
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
                        googleApi.googleDownloadMedia(transTime, filedata['alternateLink'], key, savePath, mediaType['hd'], function(err) {
                            if(err) {
                                util.handleError(err, callback, errerMedia, fileID, callback);
                            }
                            googleApi.googleApi('delete', data, function(err) {
                                if (err) {
                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                }
                                this_obj.completeMedia(fileID, 3, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    } else {
                                        if (mediaType['realPath']) {
                                            var newName = {};
                                            newName['playList.' + mediaType['fileIndex']] = mime.changeExt(fileName, 'mp4');
                                            mongo.orig("update", "storage", { _id: fileID }, {$set: newName}, function(err, item){
                                                if(err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                setTimeout(function(){
                                                    callback(null);
                                                }, 0);
                                            });
                                        } else {
                                            this_obj.editFile(fileID, mime.changeExt(fileName, 'mp4'), user, callback, function(err, result) {
                                                if(err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                setTimeout(function(){
                                                    callback(null);
                                                }, 0);
                                            });
                                        }
                                    }
                                }, rmPath);
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
                                                    util.deleteFolderRecursive(filePath + '_doc/split');
                                                    var data = {fileId: key};
                                                    googleApi.googleApi('delete', data, function(err) {
                                                        if (err) {
                                                            util.handleError(err, callback, errerMedia, fileID, callback);
                                                        }
                                                        this_obj.completeMedia(fileID, 5, callback, number);
                                                    });
                                                } else {
                                                    this_obj.handleMediaUpload(mediaType, filePath, fileID, fileName, 0, user, callback);
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
                                        this_obj.completeMedia(fileID, 5, callback, number);
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
                                            util.deleteFolderRecursive(filePath + '_doc/split');
                                            var data = {fileId: key};
                                            googleApi.googleApi('delete', data, function(err) {
                                                if (err) {
                                                    util.handleError(err, callback, errerMedia, fileID, callback);
                                                }
                                                this_obj.completeMedia(fileID, 5, callback, number);
                                            });
                                        } else {
                                            this_obj.handleMediaUpload(mediaType, filePath, fileID, fileName, 0, user, callback);
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
                            this_obj.completeMedia(fileID, 5, callback, number);
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
                            this_obj.completeMedia(fileID, 6, callback, number);
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
                                this_obj.completeMedia(fileID, 6, callback, number);
                            });
                        });
                    });
                }
            }
        },
        editFile: function (uid, newName, user, next, callback) {
            var name = util.isValidString(newName, 'name'),
                id = util.isValidString(uid, 'uid'),
                this_obj = this;
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
                if (!util.checkAdmin(1, user) && (!util.isValidString(items[0].owner, 'uid') || !user._id.equals(items[0].owner))) {
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
                        console.log(items[0]);
                        this_obj.handleTag(filePath, {utime: time, untag: 1, time: items[0].time, height: items[0].height}, newName, items[0].name, items[0].status, function(err, mediaType, mediaTag, DBdata) {
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
                                tagTool.getRelativeTag(result_tag[0], user, mediaTag.opt, next, function(err, relative) {
                                    if (err) {
                                        util.handleError(err, next, callback);
                                    }
                                    var reli = 5;
                                    if (relative.length < reli) {
                                        reli = relative.length;
                                    }
                                    if (util.checkAdmin(2, user)) {
                                        if (items[0].adultonly === 1) {
                                            result_tag.push('18+');
                                        } else {
                                            mediaTag.opt.push('18+');
                                        }
                                    }
                                    if (items[0].first === 1) {
                                        result_tag.push('first item');
                                    } else {
                                        mediaTag.opt.push('first item');
                                    }
                                    var normal = '';
                                    for (var i = 0; i < reli; i++) {
                                        normal = tagTool.normalizeTag(relative[i]);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (result_tag.indexOf(normal) === -1 && mediaTag.opt.indexOf(normal) === -1) {
                                                mediaTag.opt.push(normal);
                                            }
                                        }
                                    }
                                    setTimeout(function(){
                                        callback(null, {id: id, name: name, select: result_tag, option: mediaTag.opt, other: items[0].tags, adultonly: items[0].adultonly});
                                    }, 0);
                                    this_obj.handleMediaUpload(mediaType, filePath, id, name, items[0].size, user, function(err) {
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
            });
        },
        singleDrive: function(metadatalist, index, user, folderId, uploaded, dirpath, next, drive_info) {
            var metadata = metadatalist[index];
            console.log('singleDrive');
            console.log(new Date());
            if (drive_info) {
                drive_info.time = new Date().getTime();
                drive_info.size = metadata.fileSize;
            }
            var oOID = mongo.objectID();
            var filePath = util.getFileLocation(user._id, oOID);
            var folderPath = path.dirname(filePath);
            var this_obj = this;

            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        console.log(filePath);
                        util.handleError(err, next, next);
                    }
                    streamClose(function(err) {
                        if (err) {
                            util.handleError(err);
                            index++;
                            if (index < metadatalist.length) {
                                this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                            } else {
                                setTimeout(function(){
                                    next(null);
                                }, 0);
                            }
                        } else {
                            if (!metadata.userPermission || metadata.userPermission.role !== 'owner') {
                                var data = {fileId: metadata.id, rmFolderId: folderId, addFolderId: uploaded};
                                googleApi.googleApi('move parent', data, function(err) {
                                    if (err) {
                                        util.handleError(err);
                                    }
                                    index++;
                                    if (index < metadatalist.length) {
                                        this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                                    } else {
                                        setTimeout(function(){
                                            next(null);
                                        }, 0);
                                    }
                                });
                            } else {
                                var data = {fileId: metadata.id};
                                googleApi.googleApi('delete', data, function(err) {
                                    if (err) {
                                        util.handleError(err);
                                    }
                                    index++;
                                    if (index < metadatalist.length) {
                                        this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                                    } else {
                                        setTimeout(function(){
                                            next(null);
                                        }, 0);
                                    }
                                });
                            }
                        }
                    });
                });
            } else {
                streamClose(function(err) {
                    if (err) {
                        util.handleError(err);
                        index++;
                        if (index < metadatalist.length) {
                            this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                        } else {
                            setTimeout(function(){
                                next(null);
                            }, 0);
                        }
                    } else {
                        if (!metadata.userPermission || metadata.userPermission.role !== 'owner') {
                            var data = {fileId: metadata.id, rmFolderId: folderId, addFolderId: uploaded};
                            googleApi.googleApi('move parent', data, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                index++;
                                if (index < metadatalist.length) {
                                    this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                                } else {
                                    setTimeout(function(){
                                        next(null);
                                    }, 0);
                                }
                            });
                        } else {
                            var data = {fileId: metadata.id};
                            googleApi.googleApi('delete', data, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                index++;
                                if (index < metadatalist.length) {
                                    this_obj.singleDrive(metadatalist, index, user, folderId, uploaded, dirpath, next);
                                } else {
                                    setTimeout(function(){
                                        next(null);
                                    }, 0);
                                }
                            });
                        }
                    }
                });
            }
            function streamClose(callback){
                var name = util.toValidName(metadata.title);
                if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                    name = mime.addPost(name, '1');
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var oUser_id = user._id;
                var ownerTag = [];
                var data = {};
                data['_id'] = oOID;
                data['name'] = name;
                data['owner'] = oUser_id;
                data['utime'] = utime;
                data['size'] = metadata.fileSize;
                data['count'] = 0;
                data['first'] = 1;
                data['recycle'] = 0;
                data['status'] = 0;
                data['adultonly'] = 0;
                if (util.checkAdmin(2 ,user)) {
                    for (var i in dirpath) {
                        if (tagTool.isDefaultTag(tagTool.normalizeTag(dirpath[i])).index === 0) {
                            data['adultonly'] = 1;
                            break;
                        }
                    }
                }
                data['untag'] = 1;
                data['status'] = 0;//media type
                var mediaType = mime.mediaType(name);
                switch(mediaType['type']) {
                    case 'video':
                    if (!metadata.videoMediaMetadata) {
                        if (!metadata.userPermission || metadata.userPermission.role === 'owner') {
                            util.handleError({hoerror: 2, message: "not transcode yet"}, callback, callback);
                        }
                        var copydata = {fileId: metadata.id};
                        googleApi.googleApi('copy', copydata, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    } else {
                        var hd = 0;
                        if (metadata.videoMediaMetadata.height >= 1080) {
                            hd = 1080;
                        } else if (metadata.videoMediaMetadata.height >= 720) {
                            hd = 720;
                        }
                        googleApi.googleDownloadMedia(0, metadata.alternateLink, metadata.id, filePath, hd, function(err) {
                            if(err) {
                                if (fs.existsSync(filePath + "_s.jpg")) {
                                    fs.unlink(filePath + "_s.jpg", function (error) {
                                        if (error) {
                                            util.handleError(error, callback, callback);
                                        }
                                        if (fs.existsSync(filePath + "_a.htm")) {
                                            fs.unlink(filePath + "_a.htm", function (error) {
                                                if (error) {
                                                    util.handleError(error, callback, callback);
                                                }
                                                if (fs.existsSync(filePath)) {
                                                    fs.unlink(filePath, function (error) {
                                                        if (error) {
                                                            util.handleError(error, callback, callback);
                                                        }
                                                        restHandle();
                                                    });
                                                } else {
                                                    restHandle();
                                                }
                                            });
                                        } else {
                                            restHandle();
                                        }
                                    });
                                } else {
                                    restHandle();
                                }
                                function restHandle() {
                                    if (!metadata.userPermission || metadata.userPermission.role === 'owner') {
                                        util.handleError(err, callback, callback);
                                    }
                                    var copydata = {fileId: metadata.id};
                                    googleApi.googleApi('copy', copydata, function(err, metadata) {
                                        if (err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                }
                            } else {
                                name = mime.changeExt(name, 'mp4');
                                data['name'] = name;
                                data['status'] = 3;//media type
                                this_obj.handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                                    if(err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    var normal = tagTool.normalizeTag(name);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    normal = tagTool.normalizeTag(user.username);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    for(var i in dirpath) {
                                        normal = tagTool.normalizeTag(dirpath[i]);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (mediaTag.def.indexOf(normal) === -1) {
                                                mediaTag.def.push(normal);
                                            }
                                        }
                                    }
                                    DBdata['tags'] = mediaTag.def;
                                    DBdata[oUser_id] = mediaTag.def;
                                    mongo.orig("insert", "storage", DBdata, function(err, item){
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        console.log(item);
                                        console.log('save end');
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                });
                            }
                        }, true);
                    }
                    break;
                    case 'doc':
                    case 'sheet':
                    if (metadata.exportLinks) {
                        var exportlink = metadata.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        var new_ext = 'docx';
                        if (mediaType['type'] === 'sheet') {
                            exportlink = metadata.exportLinks['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                            new_ext = 'xlsx';
                        }
                        googleApi.googleDownload(exportlink, filePath, function(err) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            googleApi.googleDownloadDoc(metadata.exportLinks['application/pdf'], metadata.id, filePath, mediaType['ext'], function(err, number) {
                                if(err) {
                                    if (fs.existsSync(filePath)) {
                                        fs.unlink(filePath, function (error) {
                                            if (error) {
                                                util.handleError(error, callback, callback);
                                            }
                                        });
                                    } else {
                                        util.handleError(err, callback, callback);
                                    }
                                }
                                data['status'] = 5;
                                if (number > 1) {
                                    data['present'] = number;
                                }
                                var reg = new RegExp(mediaType['ext'] + "$", "i");
                                name = name.replace(reg, new_ext);
                                data['name'] = name;
                                this_obj.handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                                    if(err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    var normal = tagTool.normalizeTag(name);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    normal = tagTool.normalizeTag(user.username);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    for(var i in dirpath) {
                                        normal = tagTool.normalizeTag(dirpath[i]);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (mediaTag.def.indexOf(normal) === -1) {
                                                mediaTag.def.push(normal);
                                            }
                                        }
                                    }
                                    DBdata['tags'] = mediaTag.def;
                                    DBdata[oUser_id] = mediaTag.def;
                                    DBdata['status'] = 5;
                                    delete DBdata['mediaType'];
                                    mongo.orig("insert", "storage", DBdata, function(err, item){
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        console.log(item);
                                        console.log('save end');
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                });
                            });
                        });
                        break;
                    }
                    case 'present':
                    if (metadata.exportLinks) {
                        googleApi.googleDownload(metadata.exportLinks['application/vnd.openxmlformats-officedocument.presentationml.presentation'], filePath, function(err) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            googleApi.googleDownloadPresent(metadata.exportLinks['application/pdf'], metadata.id, filePath, mediaType['ext'], function(err, number) {
                                if(err) {
                                    if (fs.existsSync(filePath)) {
                                        fs.unlink(filePath, function (error) {
                                            if (error) {
                                                util.handleError(error, callback, callback);
                                            }
                                        });
                                    } else {
                                        util.handleError(err, callback, callback);
                                    }
                                }
                                if (number > 1) {
                                    data['present'] = number;
                                }
                                data['status'] = 6;
                                var reg = new RegExp(mediaType['ext'] + "$", "i");
                                name = name.replace(reg, 'pptx');
                                data['name'] = name;
                                this_obj.handleTag(filePath, data, name, '', data['status'], function(err, mediaType, mediaTag, DBdata) {
                                    if(err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    var normal = tagTool.normalizeTag(name);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    normal = tagTool.normalizeTag(user.username);
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                    for(var i in dirpath) {
                                        normal = tagTool.normalizeTag(dirpath[i]);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (mediaTag.def.indexOf(normal) === -1) {
                                                mediaTag.def.push(normal);
                                            }
                                        }
                                    }
                                    DBdata['tags'] = mediaTag.def;
                                    DBdata[oUser_id] = mediaTag.def;
                                    mongo.orig("insert", "storage", DBdata, function(err, item){
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        console.log(item);
                                        console.log('save end');
                                        sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    });
                                });
                            });
                        });
                        break;
                    }
                    default:
                    googleApi.googleDownload(metadata.downloadUrl, filePath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        this_obj.handleTag(filePath, data, name, '', 0, function(err, mediaType, mediaTag, DBdata) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            var normal = tagTool.normalizeTag(name);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            normal = tagTool.normalizeTag(user.username);
                            if (mediaTag.def.indexOf(normal) === -1) {
                                mediaTag.def.push(normal);
                            }
                            for(var i in dirpath) {
                                normal = tagTool.normalizeTag(dirpath[i]);
                                if (!tagTool.isDefaultTag(normal)) {
                                    if (mediaTag.def.indexOf(normal) === -1) {
                                        mediaTag.def.push(normal);
                                    }
                                }
                            }
                            DBdata['tags'] = mediaTag.def;
                            DBdata[oUser_id] = mediaTag.def;
                            mongo.orig("insert", "storage", DBdata, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(item);
                                console.log('save end');
                                sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                if (mediaType['type'] !== 'image') {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                                if (mediaType['type'] === 'image') {
                                    if (metadata.thumbnailLink) {
                                        mediaType.thumbnail = metadata.thumbnailLink;
                                        mediaType.key = metadata.id;
                                        mediaType.notOwner = true;
                                        mongo.orig("update", "storage", { _id: item[0]._id }, {$set: {"mediaType.key": mediaType.key, "mediaType.notOwner": mediaType.notOwner}}, function(err, item1){
                                            if(err) {
                                                errerMedia(err, item[0]._id, function() {
                                                    sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                                    console.log('auto upload media error');
                                                    setTimeout(function(){
                                                        callback(null);
                                                    }, 0);
                                                });
                                            } else {
                                                this_obj.handleMedia(mediaType, filePath, DBdata['_id'], DBdata['name'], metadata.id, user, function(err) {
                                                    sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                                    if(err) {
                                                        util.handleError(err);
                                                    }
                                                    console.log('transcode done');
                                                    console.log(new Date());
                                                    setTimeout(function(){
                                                        callback(null);
                                                    }, 0);
                                                });
                                            }
                                        });
                                    } else {
                                        errerMedia({hoerror: 2, message: "error type"}, item[0]._id, function() {
                                            sendWs({type: 'file', data: item[0]._id}, item[0].adultonly);
                                            console.log('auto upload media error');
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        });
                                    }
                                } else {
                                    this_obj.handleMediaUpload(mediaType, filePath, DBdata['_id'], DBdata['name'], DBdata['size'], user, function(err) {
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
                    break;
                }
            }
        },
        handleTag: function(filePath, DBdata, newName, oldName, status, callback){
            if (status === 7) {
                setTimeout(function(){
                    callback(null, false, mime.mediaTag('url'), DBdata);
                }, 0);
            } else if (status === 8) {
                setTimeout(function(){
                    callback(null, false, {def: [], opt: mime.getOptionTag()}, DBdata);
                }, 0);
            } else if (status === 9) {
                setTimeout(function(){
                    callback(null, false, {def: [], opt: []}, DBdata);
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
                                            } else if (mediaType['time'] < 40 * 60 * 1000) {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 2));
                                            } else if (mediaType['time'] < 60 * 60 * 1000) {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(4, 2));
                                            } else {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
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
                                        } else if (mediaType['time'] < 40 * 60 * 1000) {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 2));
                                        } else if (mediaType['time'] < 60 * 60 * 1000) {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(4, 2));
                                        } else {
                                            mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
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
                                                if (mediaType['time'] < 20 * 60 * 1000) {
                                                } else if (mediaType['time'] < 40 * 60 * 1000) {
                                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 2));
                                                } else if (mediaType['time'] < 60 * 60 * 1000) {
                                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(4, 2));
                                                } else {
                                                    mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
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
                                            mediaType['time'] = DBdata['time'];
                                            if (mediaType['time'] < 20 * 60 * 1000) {
                                            } else if (mediaType['time'] < 40 * 60 * 1000) {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(2, 2));
                                            } else if (mediaType['time'] < 60 * 60 * 1000) {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(4, 2));
                                            } else {
                                                mediaTag.def = mediaTag.def.concat(mediaTag.opt.splice(0, 2));
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
        },
        checkMedia: function(callback){
            var this_obj = this;
            mongo.orig("find", "storage", {'mediaType.timeout': {$exists: true}}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback, null);
                }
                console.log(items);
                if (items.length > 0) {
                    var filePath = null;
                    var dbStats = null;
                    var dbName = null;
                    for (var i in items) {
                        filePath = util.getFileLocation(items[i].owner, items[i]._id);
                        if(items[i].mediaType.key) {
                            this_obj.handleMedia(items[i].mediaType, filePath, items[i]._id, items[i].name, items[i].mediaType.key, {_id: items[i].owner, perm: 1}, function (err) {
                                sendWs({type: 'file', data: items[i]._id}, items[i].adultonly);
                                if (err) {
                                    util.handleError(err);
                                }
                                console.log('transcode done');
                                console.log(new Date());
                            });
                        } else {
                            if (items[i].mediaType['realPath']) {
                                if (fs.existsSync(filePath + '/' + items[i].mediaType['fileIndex'] + '_complete')) {
                                    dbStats = fs.statSync(filePath + '/real/' + items[i].mediaType['realPath']);
                                    dbName = path.basename(items[i].mediaType['realPath']);
                                    this_obj.handleMediaUpload(items[i].mediaType, filePath, items[i]._id, dbName, dbStats['size'], {_id: items[i].owner, perm: 1}, function (err) {
                                        sendWs({type: 'file', data: items[i]._id}, items[i].adultonly);
                                        if (err) {
                                            util.handleError(err);
                                        }
                                        console.log('transcode done');
                                        console.log(new Date());
                                    });
                                }
                            } else {
                                this_obj.handleMediaUpload(items[i].mediaType, filePath, items[i]._id, items[i].name, items[i].size, {_id: items[i].owner, perm: 1}, function (err) {
                                    sendWs({type: 'file', data: items[i]._id}, items[i].adultonly);
                                    if (err) {
                                        util.handleError(err);
                                    }
                                    console.log('transcode done');
                                    console.log(new Date());
                                });
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null);
                }, 0);
            });
        }
    };
};
function errerMedia(errMedia, fileID, callback) {
    if (errMedia.hoerror === 2 && errMedia.message === 'timeout') {
        mongo.orig("update", "storage", { _id: fileID }, {$set: {"mediaType.timeout": true}}, function(err, item){
            if(err) {
                util.handleError(err, callback, callback);
            }
            console.log(item);
            setTimeout(function(){
                callback(err);
            }, 0);
        });
    } else {
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
}
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