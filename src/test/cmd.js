//sudo -i node /home/pi/app/nodejsAngular/src/test/cmd.js
//sudo -i npm install torrent-stream -g --unsafe-perm
//記得等db connect

var stockTool = require("../web/models/stock-tool.js");
var util = require("../web/util/utility.js");
var mime = require('../web/util/mime.js');
var mongo = require("../web/models/mongo-tool.js");
var googleApi = require("../web/models/api-tool-google.js");
var mediaHandleTool = require("../web/models/mediaHandle-tool.js")(function() {});
var externalTool = require('../web/models/external-tool.js');
var tagTool = require("../web/models/tag-tool.js")("storage");

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function cmdUpdateExternal(updateType, clear) {
    console.log('cmdUpdateExternal');
    console.log(new Date());
    console.log('update external');
    externalTool.getList(updateType, function(err) {
        if (err) {
            err.hoerror = 2;
            util.handleError(err);
        } else {
            console.log('ok');
        }
    }, clear);
}

function cmdUpdateStock(updateType, singleIndex) {
    updateType = (typeof updateType !== 'undefined' && !isNaN(Number(updateType))) ? Number(updateType) : 1;
    console.log('cmdUpdateStock');
    console.log(new Date());
    console.log('update stock');
    if (singleIndex && singleIndex !== '1' && singleIndex !== '2' && singleIndex !== '3' && singleIndex !== '4') {
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
        }, Number(singleIndex));
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
            updateStock(updateType, type, stocklist, index, callback);
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
    var downloaded = null;
    var file_count = 0;
    getDriveList(function(err) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        if (util.checkAdmin(1, userlist[index])) {
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
                var doc_type = ['bls', 'cen', 'bea', 'ism', 'cbo', 'sem', 'oec', 'dol', 'rea', 'sca', 'fed'];
                console.log(downloadTime.getHours());
                function download_ext_doc(tIndex) {
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
                                            download_ext_doc(tIndex);
                                        } else {
                                            index++;
                                            if (index < userlist.length) {
                                                userDrive(drive_batch, userlist, index, callback);
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
                                    download_ext_doc(tIndex);
                                } else {
                                    index++;
                                    if (index < userlist.length) {
                                        userDrive(drive_batch, userlist, index, callback);
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
                if (downloadTime.getHours() === 0) {
                    //donwload doc
                    download_ext_doc(0);
                } else {
                    index++;
                    if (index < userlist.length) {
                        userDrive(drive_batch, userlist, index, callback);
                    } else {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                }
            });
        } else {
            index++;
            if (index < userlist.length) {
                userDrive(drive_batch, userlist, index, callback);
            } else {
                setTimeout(function(){
                    callback(null);
                }, 0);
            }
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

function completeMimeTag(add) {
    var search_number = 0;
    var complete_tag = [];
    var option_tag_eng = mime.getOptionTag('eng');
    var option_tag_cht = mime.getOptionTag('cht');
    var option_index = -1;
    recur_com();
    function recur_com() {
        mongo.orig("find", "storage", {}, {limit: 100, skip : search_number, sort: '_id'}, function(err, items){
            if(err) {
                util.handleError(err);
            } else {
                recur_item(0);
                function recur_item(index) {
                    complete_tag = [];
                    for (var i in items[index].tags) {
                        option_index = option_tag_eng.indexOf(items[index].tags[i]);
                        if (option_index !== -1) {
                            if (items[index].tags.indexOf(option_tag_cht[option_index]) === -1) {
                                for (var j in items[index]) {
                                    if (util.isValidString(j, 'uid') || j === 'kubo' || j === 'eztv' || j === 'lovetv') {
                                        if (items[index][j].indexOf(option_tag_eng[option_index]) !== -1) {
                                            complete_tag.push({owner: j, tag: option_tag_cht[option_index]});
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            option_index = option_tag_cht.indexOf(items[index].tags[i]);
                            if (option_index !== -1) {
                                if (items[index].tags.indexOf(option_tag_eng[option_index]) === -1) {
                                    for (var j in items[index]) {
                                        if (util.isValidString(j, 'uid') || j === 'kubo' || j === 'eztv' || j === 'lovetv') {
                                            if (items[index][j].indexOf(option_tag_cht[option_index]) !== -1) {
                                                complete_tag.push({owner: j, tag: option_tag_eng[option_index]});
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    function completeNext() {
                        index++;
                        if (index < items.length) {
                            recur_item(index);
                        } else {
                            search_number += items.length;
                            console.log(search_number);
                            if (items.length < 100) {
                                console.log('end');
                            } else {
                                recur_com();
                            }
                        }
                    }
                    if (complete_tag.length > 0) {
                        console.log(items[index].name);
                        console.log(complete_tag);
                        if (add) {
                            recur_add(0);
                        } else {
                            completeNext();
                        }
                        function recur_add(tIndex) {
                            tagTool.addTag(items[index]._id, complete_tag[tIndex].tag, {_id: complete_tag[tIndex].owner, perm: 1}, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                tIndex++;
                                if (tIndex < complete_tag.length) {
                                    recur_add(tIndex);
                                } else {
                                    completeNext();
                                }
                            }, function(err) {
                                if (err) {
                                    util.handleError(err);
                                }
                                tIndex++;
                                if (tIndex < complete_tag.length) {
                                    recur_add(tIndex);
                                } else {
                                    completeNext();
                                }
                            });
                        }
                    } else {
                        completeNext();
                    }
                }
            }
        });
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
        case 'external':
        console.log('external');
        cmdUpdateExternal(cmd[1], cmd[2]);
        break;
        case 'complete':
        console.log('complete');
        completeMimeTag(cmd[1]);
        break;
        default:
        console.log('help:');
        console.log('stock updateType [single index]');
        console.log('drive batchNumber [single username] (include download)');
        console.log('external type [clear]');
        console.log('complete [add]');
    }
});