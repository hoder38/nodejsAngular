//sudo -i node /home/pi/app/nodejsAngular/src/test/cmd.js
//記得等db connect

var stockTool = require("../web/models/stock-tool.js");
var util = require("../web/util/utility.js");
var mime = require('../web/util/mime.js');
var mongo = require("../web/models/mongo-tool.js");
var googleApi = require("../web/models/api-tool-google.js");
var mediaHandleTool = require("../web/models/mediaHandle-tool.js")(function() {});

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function cmdUpdateStock(updateType, singleIndex) {
    updateType = (typeof updateType !== 'undefined' && !isNaN(Number(updateType))) ? Number(updateType) : 1;
    console.log('cmdUpdateStock');
    console.log(new Date());
    console.log('update stock');
    if (singleIndex) {
        updateStock(updateType, 'twse', [singleIndex], 0, function(err) {
            if(err) {
                util.handleError(err);
            } else {
                console.log('stock update complete');
            }
        });
    } else {
        stockTool.getStockList('twse', function(err, stocklist){
            if(err) {
                util.handleError(err);
            } else {
                if (stocklist.length < 1) {
                    console.log('empty stock list');
                } else {
                    updateStock(updateType, 'twse', stocklist, 0, function(err) {
                        if(err) {
                            util.handleError(err);
                        } else {
                            console.log('stock update complete');
                        }
                    });
                }
            }
        });
    }
}

function updateStock(updateType, type, stocklist, index, callback) {
    console.log('updateStock');
    console.log(new Date());
    console.log(stocklist[index]);
    stockTool.getSingleStock(type, stocklist[index], function(err) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        index++;
        if (index < stocklist.length) {
            updateStock(type, stocklist, index, callback);
        } else {
            setTimeout(function(){
                callback(null);
            }, 0);
        }
    }, updateType);
}

function cmdUpdateDrive(drive_batch, sungleUser) {
    drive_batch = (typeof drive_batch !== 'undefined' && !isNaN(Number(drive_batch))) ? Number(drive_batch) : 100;
    console.log(drive_batch);
    console.log('cmdUpdateDrive');
    console.log(new Date());
    if (sungleUser) {
        var name = util.isValidString(sungleUser, 'name');
        if (name === false) {
            console.log('user name not valid!!!');
            return false;
        }
        mongo.orig("find", "user", {auto: {$exists: true}, username: sungleUser}, function(err, userlist){
            if(err) {
                util.handleError(err);
            } else {
                userDrive(drive_batch, userlist, 0, function(err) {
                    if(err) {
                        util.handleError(err);
                    } else {
                        console.log('update drive complete');
                    }
                });
            }
        });
    } else {
        mongo.orig("find", "user", {auto: {$exists: true}}, function(err, userlist){
            if(err) {
                util.handleError(err);
            } else {
                userDrive(drive_batch, userlist, 0, function(err) {
                    if(err) {
                        util.handleError(err);
                    } else {
                        console.log('update drive complete');
                    }
                });
            }
        });
    }
}

function userDrive(drive_batch, userlist, index, callback) {
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
            userDrive(drive_batch, userlist, index, callback);
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
                        });
                    } else {
                        var uploaded_data = {folderId: userlist[index].auto, name: 'uploaded'};
                        googleApi.googleApi('list folder', uploaded_data, function(err, uploadedList) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (uploadedList.length < 1 ) {
                                util.handleError({hoerror: 2, message: "do not have uploaded folder!!!"}, callback, callback);
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
                            });
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

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: %s  %s', err.name, err.message);
    if (err.stack) {
        console.log(err.stack);
    }
});

rl.on('line', function(line){
    var cmd = line.split(" ");
    switch (cmd[0]) {
        case 'stock':
        console.log('stock');
        cmdUpdateStock(cmd[1], cmd[2]);
        break;
        case 'drive':
        console.log('drive');
        cmdUpdateDrive(cmd[1], cmd[2]);
        break;
        default:
        console.log('help:');
        console.log('stock updateType [single index]');
        console.log('drive batchNumber [single username]');
    }
});