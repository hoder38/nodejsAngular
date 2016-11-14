var util = require("../util/utility.js");
var mongo = require("../models/mongo-tool.js");
var mime = require('../util/mime.js');

var default_tags = ['18+', 'handlemedia', 'unactive', 'handlerecycle', 'first item', 'all item', 'important', 'no local', 'youtube video', 'youtube playlist', 'youtube music', 'youtube music playlist', 'playlist unactive', 'kubo movie', 'kubo tv series', 'kubo tv show', 'kubo animation', 'yify movie', 'cartoonmad comic', 'bilibili animation', 'bilibili movie', 'comic99 comic', '18-'];

//var storage_parent_arr = [{'name': 'command', 'tw': '指令'}, {'name': 'media type', 'tw': '媒體種類'}, {'name': 'country', 'tw': '國家'}, {'name': 'year', 'tw': '年份'}, {'name': 'category', 'tw': '劇情分類'}, {'name': 'game_type', 'tw': '遊戲種類'}, {'name': 'music_style', 'tw': '曲風'}, {'name': 'serial', 'tw': '連載中'}, {'name': 'album', 'tw': '專輯'}, {'name': 'author', 'tw': '作者'}, {'name': 'actor', 'tw': '演員'}, {'name': 'singer', 'tw': '歌手'}, {'name': 'director', 'tw': '導演'}, {'name': 'developer', 'tw': '開發商'}, {'name': 'animate_producer', 'tw': '動畫工作室'}, {'name': 'publisher', 'tw': '出版社'}, {'name': 'language', 'tw': '語言'}];
var storage_parent_arr = [{'name': 'command', 'tw': '指令'}, {'name': 'media type', 'tw': '媒體種類'}, {'name': 'country', 'tw': '國家'}, {'name': 'category', 'tw': '劇情分類'}, {'name': 'game_type', 'tw': '遊戲種類'}, {'name': 'music_style', 'tw': '曲風'}];
var stock_parent_arr = [{'name': 'command', 'tw': '指令'}, {'name': 'country', 'tw': '國家'}, {'name': 'market type', 'tw': '市場種類'}, {'name': 'category', 'tw': '產業分類'}];
var password_parent_arr = [{'name': 'command', 'tw': '指令'}, {'name': 'category', 'tw': '功能分類'}, {'name': 'platform', 'tw': '平台'}];
var adultonly_arr = [{'name': 'adult_command', 'tw': '18+指令'}, {'name': 'adultonly_category', 'tw': '18+分類'}, {'name': 'av_actress', 'tw': 'AV女優'}, {'name': 'adultonly_producer', 'tw': '成人創作者'}];

var kubo_country = ['香港', '台灣', '大陸', '日本', '韓國', '歐美', '泰國', '新馬', '印度', '海外'];

var yify_type = mime.getOptionTag('eng');

var yify_type_cht = mime.getOptionTag('cht');

var mad_type = mime.getOptionTag('anime');

var mad_index = ['01', '02', '03', '04', '10', '07', '08', '09', '16', '17', '13', '14', '18', '21', '22'];

var c99_type = mime.getOptionTag('comic');

var c99_index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24 ,25];

var bili_type = ['大陸', '日本', '歐美', '香港', '台灣', '韓國', '法國', '泰國', '西班牙', '俄羅斯', '德國', '海外', '完結'];

var bili_index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16];

var queryLimit = 20;

var handleTime = 7200,
    unactive_day = 5,
    unactive_hit = 10;

var bookmarkLimit = 100;

//relative
var search_limit = 100;
var union_number = 2;
var inter_number = 3;

var youtube_id_pattern = /^y(ou|ch|pl)_([a-zA-z\d\-\_]+)/;

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var is_hint = config_glb.hint;

module.exports = function(collection) {
    var getQuerySql = null;
    var getQueryTag = null;
    var getSortName = null;
    var parent_arr = [];
    switch(collection) {
        case 'storage':
        getQuerySql = getStorageQuerySql;
        getQueryTag = getStorageQueryTag;
        parent_arr = storage_parent_arr;
        getSortName = getStorageSortName;
        break;
        case 'stock':
        getQuerySql = getStockQuerySql;
        getQueryTag = getStockQueryTag;
        parent_arr = stock_parent_arr;
        getSortName = getStockSortName;
        break;
        case 'password':
        getQuerySql = getPasswordQuerySql;
        getQueryTag = getPasswordQueryTag;
        parent_arr = password_parent_arr;
        getSortName = getPasswordSortName;
        break;
        default:
        return false;
    }
    function inParentArray(parent) {
        for (var i in parent_arr) {
            if (parent_arr[i].name === parent) {
                return true;
            }
        }
        return false;
    }
    return {
        searchTags: function (search) {
            var name = collection;
            if (!search[name]) {
                search[name] = {tags: [], exactly: [], index: 0, bookmark: '', markIndex: 0, save: {}};
            } else if (typeof search[name] !== 'object') {
                console.log('bad search tags');
                console.log(typeof search[name]);
                console.log(search[name]);
                return false;
            } else {
                if(!search[name].hasOwnProperty('tags')){
                    search[name].tags = [];
                }
                if(!search[name].hasOwnProperty('exactly')){
                    search[name].exactly = [];
                }
                if(!search[name].hasOwnProperty('index')){
                    search[name].index = 0;
                }
                if(!search[name].hasOwnProperty('bookmark')){
                    search[name].bookmark = '';
                }
                if(!search[name].hasOwnProperty('markIndex')){
                    search[name].markIndex = 0;
                }
                if(!search[name].hasOwnProperty('save')){
                    search[name].save = {};
                }
            }
            return {
                getArray: function(value, exactly, index) {
                    value = typeof value !== 'undefined' ? value : null;
                    exactly = typeof exactly !== 'undefined' ? exactly : false;
                    index = typeof index !== 'undefined' ? index : 0;
                    if (value) {
                        var pos_exactly = false;
                        var pos = search[name].tags.indexOf(value);
                        if (index <= 0) {
                            if (search[name].index > search[name].tags.length) {
                                if (pos === -1) {
                                    search[name].tags.push(value);
                                }
                                search[name].index = search[name].tags.length;
                            } else {
                                if (pos === -1 || pos >= search[name].index) {
                                    if (pos > search[name].index) {
                                        search[name].tags.splice(pos, 1);
                                    }
                                    search[name].tags[search[name].index] = value;
                                    search[name].index++;
                                } else {
                                    pos_exactly = true;
                                }
                            }
                        } else if (index < search[name].tags.length) {
                            if (pos === -1) {
                                search[name].tags[index-1] = value;
                            }
                            if (pos >= index) {
                                search[name].tags.splice(pos, 1);
                                search[name].tags.splice(index-1, 0, value);
                            }
                            search[name].index = index;
                        } else {
                            if (pos === -1) {
                                search[name].tags.push(value);
                            }
                            search[name].index = search[name].tags.length;
                        }
                        if (pos_exactly) {
                            search[name].exactly[pos] = exactly;
                        } else {
                            search[name].exactly[search[name].index-1] = exactly;
                        }
                    } else {
                        if (index <= 0) {
                            if (search[name].index > search[name].tags.length) {
                                search[name].index = search[name].tags.length;
                            }
                        } else if (index < search[name].tags.length) {
                            search[name].index = index;
                        } else {
                            search[name].index = search[name].tags.length;
                        }
                    }
                    if (search[name].index < search[name].markIndex) {
                        search[name].bookmark = '';
                        search[name].markIndex = 0;
                    }
                    return {cur: search[name].tags.slice(0, search[name].index), his: search[name].tags.slice(search[name].index), exactly: search[name].exactly, bookmark: search[name].bookmark};
                },
                resetArray: function() {
                    search[name] = {tags:[], exactly: [], index: 0, bookmark: '', markIndex: 0, save: search[name].save};
                    return {cur: [], his: [], exactly: [], bookmark: ''};
                },
                setArray: function(bookmark, tagList, exactly) {
                    if (tagList) {
                        search[name] = {tags: tagList, exactly: exactly, index: tagList.length, save: search[name].save};
                    }
                    if (bookmark) {
                        search[name].bookmark = bookmark;
                        search[name].markIndex = search[name].tags.length;
                    }
                },
                getBookmark: function() {
                    if (search[name].bookmark) {
                        return search[name].bookmark;
                    } else {
                        return false;
                    }
                },
                saveArray: function(saveName, sortName, sortType) {
                    search[name].save[saveName] = {};
                    search[name].save[saveName].tags = search[name].tags.slice(0, search[name].index);
                    search[name].save[saveName].exactly = search[name].exactly;
                    search[name].save[saveName].bookmark = search[name].bookmark;
                    search[name].save[saveName].sortName = sortName;
                    search[name].save[saveName].sortType = sortType;
                },
                loadArray: function(saveName) {
                    if(!search[name].save.hasOwnProperty(saveName)){
                        return false;
                    }
                    return {tags: search[name].save[saveName].tags, exactly: search[name].save[saveName].exactly, bookmark: search[name].save[saveName].bookmark, sortName: search[name].save[saveName].sortName, sortType: search[name].save[saveName].sortType};
                }
            };
        },
        addTag: function(uid, tag, user, next, callback) {
            var name = util.isValidString(tag, 'name'),
            id = util.isValidString(uid, 'uid');
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback, null);
            }
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
            }
            var tagType = getQueryTag(user, name);
            if (!tagType.type) {
                console.log(tagType);
                util.handleError({hoerror: 2, message: 'not authority set default tag!!!'}, next, callback, null);
            }
            if (tagType.type === 2) {
                mongo.orig("find", collection, {_id: id}, {limit: 1}, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback, null);
                    }
                    if (items.length === 0) {
                        util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                    }
                    if ((tagType.tag.hasOwnProperty('adultonly') && items[0].adultonly === tagType.tag.adultonly) || (tagType.tag.hasOwnProperty('first') && items[0].first === tagType.tag.first) || (tagType.tag.hasOwnProperty('important') && items[0].important === tagType.tag.important)) {
                        setTimeout(function(){
                            callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.name});
                        }, 0);
                    } else {
                        mongo.orig("update", collection, {_id: id}, {$set: tagType.tag}, function(err, item2){
                            if(err) {
                                util.handleError(err, next, callback, null);
                            }
                            setTimeout(function(){
                                callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.name});
                            }, 0);
                        });
                    }
                });
            } else if (tagType.type === 3) {
                setTimeout(function(){
                    callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.name});
                }, 0);
            } else if (tagType.type === 1) {
                mongo.orig("find", collection, {_id: id}, {limit: 1}, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback, null);
                    }
                    if (items.length === 0) {
                        util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                    }
                    if (items[0].tags.indexOf(tagType.tag.tags) === -1) {
                        tagType.tag[user._id.toString()] = tagType.tag.tags;
                        mongo.orig("update", collection, { _id: id }, {$addToSet: tagType.tag}, {upsert: true}, function(err, item2){
                            if(err) {
                                util.handleError(err, next, callback, null);
                            }
                            setTimeout(function(){
                                callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.tag.tags});
                            }, 0);
                        });
                    } else {
                        setTimeout(function(){
                            callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.tag.tags});
                        }, 0);
                    }
                });
            } else {
                console.log(tagType);
                util.handleError({hoerror: 1, message: 'unknown add tag type!!!'}, next, callback, null);
            }
        },
        delTag: function(uid, tag, user, next, callback) {
            var name = util.isValidString(tag, 'name'),
            id = util.isValidString(uid, 'uid');
            if (name === false) {
                name = util.isValidString(tag, 'url')
                if (name === false) {
                    util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback, null);
                }
            }
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
            }
            var tagType = getQueryTag(user, name, 0);
            if (!tagType.type) {
                console.log(tagType);
                util.handleError({hoerror: 2, message: 'not authority delete default tag!!!'}, next, callback, null);
            }
            mongo.orig("find", collection, {_id: id}, {limit: 1}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback, null);
                }
                if (items.length === 0) {
                    util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                }
                if (tagType.type === 2) {
                    mongo.orig("update", collection, { _id: id }, {$set: tagType.tag}, function(err, item1){
                        if(err) {
                            util.handleError(err, next, callback, null);
                        }
                        setTimeout(function(){
                            callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.name});
                        }, 0);
                    });
                } else if (tagType.type === 1) {
                    if (tagType.tag.tags === normalize(items[0].name)) {
                        console.log(tagType.tag.tags);
                        console.log(normalize(items[0].name));
                        util.handleError({hoerror: 2, message: 'can not delete file name!!!'}, next, callback, null);
                    }
                    if (util.checkAdmin(1, user)) {
                        console.log('authority del tag');
                        if (items[0].tags.indexOf(tagType.tag.tags) === -1) {
                            setTimeout(function(){
                                callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: ''});
                            }, 0);
                        } else {
                            for (var i in items[0]) {
                                if (util.isValidString(i, 'uid') || i === 'lovetv' || i === 'eztv') {
                                    tagType.tag[i] = tagType.tag.tags;
                                    mongo.orig("update", collection, {_id: id}, {$pull: tagType.tag}, function(err, item2){
                                        if(err) {
                                            util.handleError(err, next, callback, null);
                                        }
                                        setTimeout(function(){
                                            callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.tag.tags});
                                        }, 0);
                                    });
                                }
                            }
                        }
                    } else {
                        if (items[0][user._id.toString()].indexOf(tagType.tag.tags) === -1) {
                            setTimeout(function(){
                                callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: ''});
                            }, 0);
                        } else {
                            tagType.tag[user._id.toString()] = tagType.tag.tags;
                            mongo.orig("update", collection, { _id: id }, {$pull: tagType.tag}, function(err, item2){
                                if(err) {
                                    util.handleError(err, next, callback, null);
                                }
                                setTimeout(function(){
                                    callback(null, {id: items[0]._id, adultonly: items[0].adultonly, tag: tagType.tag.tags});
                                }, 0);
                            });
                        }
                    }
                } else {
                    console.log(tagType);
                    util.handleError({hoerror: 1, message: 'unknown del tag type!!!'}, next, callback, null);
                }
            });
        },
        sendTag: function(uid, objName, tags, user, next, callback) {
            tags.reverse();
            var this_obj = this;
            var history = [];
            var name = util.isValidString(objName, 'name');
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
            }
            var normal = normalize(name);
            recur_tag(0);
            function recur_tag(index) {
                if (tags[index].select) {
                    this_obj.addTag(uid, tags[index].tag, user, next, function(err, result) {
                        if (err) {
                            util.handleError(err, next);
                        } else {
                            if (result.tag !== normal) {
                                history.push({tag: result.tag, select: true});
                            }
                        }
                        index++;
                        if (index < tags.length) {
                            setTimeout(function(){
                                recur_tag(index);
                            }, 0);
                        } else {
                            id = util.isValidString(uid, 'uid');
                            if (id === false) {
                                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
                            }
                            mongo.orig("update", collection, {_id: id}, {$set: {untag: 0}}, function(err, item){
                                if(err) {
                                    util.handleError(err, next, callback, null);
                                }
                                mongo.orig("find", collection, { _id: id }, {limit: 1}, function(err, item1s){
                                    if(err) {
                                        util.handleError(err, next, callback, null);
                                    }
                                    setTimeout(function(){
                                        callback(null, {history: history, id: item1s[0]._id, adultonly: item1s[0].adultonly});
                                    }, 0);
                                });
                            });
                        }
                    });
                } else {
                    this_obj.delTag(uid, tags[index].tag, user, next, function (err, result) {
                        if (err) {
                            util.handleError(err, next);
                        } else {
                            if (result.tag !== normal) {
                                history.push({tag: result.tag, select: false});
                            }
                        }
                        index++;
                        if (index < tags.length) {
                            setTimeout(function(){
                                recur_tag(index);
                            }, 0);
                        } else {
                            id = util.isValidString(uid, 'uid');
                            if (id === false) {
                                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
                            }
                            mongo.orig("update", collection, {_id: id}, {$set: {untag: 0}}, function(err, item){
                                if(err) {
                                    util.handleError(err, next, callback, null);
                                }
                                mongo.orig("find", collection, { _id: id }, {limit: 1}, function(err, item1s){
                                    if(err) {
                                        util.handleError(err, next, callback, null);
                                    }
                                    setTimeout(function(){
                                        callback(null, {history: history, id: item1s[0]._id, adultonly: item1s[0].adultonly});
                                    }, 0);
                                });
                            });
                        }
                    });
                }
            }
        },
        resetQuery: function(sortName, sortType, user, session, next, callback) {
            var tags = this.searchTags(session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            var parentList = tags.resetArray();
            var sql = getQuerySql(user, parentList.cur, parentList.exactly);
            delete tags;
            if (sql) {
                var options = {"limit": queryLimit, "sort": [[getSortName(sortName), sortType]]};
                if (sql.hint) {
                    options["hint"] = sql.hint;
                }
                var select = {};
                if (sql.select) {
                    select = sql.select;
                }
                mongo.orig("find", collection, sql.nosql, select, options, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    setTimeout(function(){
                        callback(null, {items: items, parentList: parentList});
                    }, 0);
                });
            } else {
                setTimeout(function(){
                    callback(null, {items: [], parentList: parentList});
                }, 0);
            }
        },
        tagQuery: function(page, tagName, exactly, index, sortName, sortType, user, session, next, callback, customLimit) {
            var this_obj = this;
            if (!customLimit) {
                customLimit = queryLimit;
            }
            var options = {"limit": customLimit, "skip" : page, "sort": [[getSortName(sortName), sortType]]};
            if (!tagName) {
                var tags = this.searchTags(session);
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray();
                var sql = getQuerySql(user, parentList.cur, parentList.exactly);
                delete tags;
                if (sql) {
                    if (sql.skip) {
                        options["skip"] = page + sql.skip;
                    }
                    if (sql.hint) {
                        options["hint"] = sql.hint;
                    }
                    var select = {};
                    if (sql.select) {
                        select = sql.select;
                    }
                    mongo.orig("find", collection, sql.nosql, select, options, function(err, items){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        if (sql.nosql.mediaType) {
                            setTimeout(function(){
                                callback(null, {items: items, parentList: parentList, mediaHadle: 1});
                            }, 0);
                        } else {
                            if (parentList.bookmark) {
                                this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                                    if (latest) {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                        }, 0);
                                    } else {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, bookmark: parentList.bookmark});
                                        }, 0);
                                    }
                                });
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: items, parentList: parentList});
                                }, 0);
                            }
                        }
                    });
                } else {
                    if (parentList.bookmark) {
                        this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                            if (latest) {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                }, 0);
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, bookmark: parentList.bookmark});
                                }, 0);
                            }
                        });
                    } else {
                        setTimeout(function(){
                            callback(null, {items: [], parentList: parentList});
                        }, 0);
                    }
                }
            } else if (!index) {
                var defau = isDefaultTag(normalize(tagName));
                if (collection === 'stock' && defau.index === 31) {
                    name = tagName;
                } else if (collection === 'storage' && defau.index === 31) {
                    name = tagName;
                } else {
                    name = util.isValidString(tagName, 'name');
                }
                if (name === false) {
                    util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
                }
                var tags = this_obj.searchTags(session);
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray(name, exactly);
                var sql = getQuerySql(user, parentList.cur, parentList.exactly);
                delete tags;
                if (sql) {
                    if (sql.skip) {
                        options["skip"] = page + sql.skip;
                    }
                    if (sql.hint) {
                        options["hint"] = sql.hint;
                    }
                    var select = {};
                    if (sql.select) {
                        select = sql.select;
                    }
                    mongo.orig("find", collection, sql.nosql, select, options, function(err, items){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        if (sql.nosql.mediaType) {
                            setTimeout(function(){
                                callback(null, {items: items, parentList: parentList, mediaHadle: 1});
                            }, 0);
                        } else {
                            if (parentList.bookmark) {
                                this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                                    if (latest) {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                        }, 0);
                                    } else {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, bookmark: parentList.bookmark});
                                        }, 0);
                                    }
                                });
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: items, parentList: parentList});
                                }, 0);
                            }
                        }
                    });
                } else {
                    if (parentList.bookmark) {
                        this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                            if (latest) {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                }, 0);
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, bookmark: parentList.bookmark});
                                }, 0);
                            }
                        });
                    } else {
                        setTimeout(function(){
                            callback(null, {items: [], parentList: parentList});
                        }, 0);
                    }
                }
            } else {
                var name = false,
                    Pindex = util.isValidString(index, 'parentIndex');
                var defau = isDefaultTag(normalize(tagName));
                if (collection === 'stock' && defau.index === 31) {
                    name = tagName;
                } else if (collection === 'storage' && defau.index === 31) {
                    name = tagName;
                } else {
                    name = util.isValidString(tagName, 'name');
                }
                if (name === false) {
                    util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
                }
                if (Pindex === false) {
                    util.handleError({hoerror: 2, message: "parentIndex is not vaild"}, next, callback);
                }
                var tags = this_obj.searchTags(session);
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray(name, exactly, Pindex);
                var sql = getQuerySql(user, parentList.cur, parentList.exactly);
                delete tags;
                if (sql) {
                    if (sql.skip) {
                        options["skip"] = page + sql.skip;
                    }
                    if (sql.hint) {
                        options["hint"] = sql.hint;
                    }
                    var select = {};
                    if (sql.select) {
                        select = sql.select;
                    }
                    mongo.orig("find", collection, sql.nosql, select, options, function(err, items){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        if (sql.nosql.mediaType) {
                            setTimeout(function(){
                                callback(null, {items: items, parentList: parentList, mediaHadle: 1});
                            }, 0);
                        } else {
                            if (parentList.bookmark) {
                                this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                                    if (latest) {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                        }, 0);
                                    } else {
                                        setTimeout(function(){
                                            callback(null, {items: items, parentList: parentList, bookmark: parentList.bookmark});
                                        }, 0);
                                    }
                                });
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: items, parentList: parentList});
                                }, 0);
                            }
                        }
                    });
                } else {
                    if (parentList.bookmark) {
                        this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                            if (latest) {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, latest: latest, bookmark: parentList.bookmark});
                                }, 0);
                            } else {
                                setTimeout(function(){
                                    callback(null, {items: [], parentList: parentList, bookmark: parentList.bookmark});
                                }, 0);
                            }
                        });
                    } else {
                        setTimeout(function(){
                            callback(null, {items: [], parentList: parentList});
                        }, 0);
                    }
                }
            }
        },
        singleQuery: function(uid, user, session, next, callback) {
            var this_obj = this;
            var id = util.isValidString(uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
            }
            var tags = this.searchTags(session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            var parentList = tags.getArray();
            var sql = getQuerySql(user, parentList.cur, parentList.exactly);
            delete tags;
            if (sql) {
                sql.nosql['_id'] = id;
                var select = {};
                if (sql.select) {
                    select = sql.select;
                }
                mongo.orig("find", collection, sql.nosql, select, {limit: 1, hint: {_id: 1}}, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    if (items.length === 0) {
                        setTimeout(function(){
                            callback(null, {empty: true});
                        }, 0);
                    } else {
                        if (sql.nosql.mediaType) {
                            setTimeout(function(){
                                callback(null, {item: items[0], mediaHadle: 1});
                            }, 0);
                        } else {
                            /*if (parentList.bookmark) {
                                this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                                    if (latest) {
                                        setTimeout(function(){
                                            callback(null, {item: items[0], latest: latest, bookmark: parentList.bookmark});
                                        }, 0);
                                    } else {
                                        setTimeout(function(){
                                            callback(null, {item: items[0], bookmark: parentList.bookmark});
                                        }, 0);
                                    }
                                });
                            } else {*/
                                setTimeout(function(){
                                    callback(null, {item: items[0]});
                                }, 0);
                            //}
                        }
                    }
                });
            } else {
                setTimeout(function(){
                    callback(null, {empty: true});
                }, 0);
            }
        },
        saveSql: function(page, saveName, back, user, session) {
            var this_obj = this;
            var tags = this.searchTags(session);
            if (!tags) {
                return false;
            }
            var save = tags.loadArray(saveName);
            if (!save) {
                return false;
            }
            if (back === 'back') {
                if (save.sortType === 'desc') {
                    save.sortType = 'asc';
                } else {
                    save.sortType = 'desc';
                }
            }
            var options = {"limit": queryLimit, "skip" : page, "sort": [[save.sortName, save.sortType]]};
            var sql = getQuerySql(user, save.tags, save.exactly);
            delete tags;
            if (sql) {
                if (sql.skip) {
                    options['skip'] = page + sql.skip;
                }
                if (sql.hint) {
                    options["hint"] = sql.hint;
                }
                var select = {};
                if (sql.select) {
                    select = sql.select;
                }
                return {nosql: sql.nosql, options: options, select: select};
            } else {
                return {empty: true};
            }
        },
        normalizeTag: function(tag) {
            return normalize(tag);
        },
        parentList: function() {
            return parent_arr;
        },
        adultonlyParentList: function() {
            return adultonly_arr;
        },
        isDefaultTag: function(tag) {
            return isDefaultTag(tag);
        },
        parentQuery: function(tagName, sortName, sortType, page, user, next, callback) {
            var name = util.isValidString(tagName, 'name');
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
            }
            if (!inParentArray(name)) {
                if (util.checkAdmin(2, user)) {
                    if(!inAdultonlyArray(name)) {
                        console.log(name);
                        util.handleError({hoerror: 2, message: "name is not allow"}, next, callback);
                    }
                } else {
                    console.log(name);
                    util.handleError({hoerror: 2, message: "name is not allow"}, next, callback);
                }
            }
            if (sortName === 'mtime') {
                sortName = 'qtime';
            }
            var options = {"limit": queryLimit, "skip" : page, "sort": [[sortName, sortType]]};
            mongo.orig("find", collection + "Dir" ,{parent: name}, options, function(err, taglist){
                if(err) {
                    util.handleError(err, next, callback);
                }
                var list = [];
                for (var i in taglist) {
                    list.push({id: taglist[i]._id, name: taglist[i].name});
                }
                setTimeout(function(){
                    callback(null, {taglist: list});
                }, 0);
            });
        },
        addParent: function(parentName, tagName, user, next, callback) {
            var name = util.isValidString(parentName, 'name');
            if (name === false) {
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
            }
            var tag = util.isValidString(tagName, 'name');
            if (tag === false) {
                util.handleError({hoerror: 2, message: "tag name is not vaild"}, next, callback);
            }
            if (!inParentArray(name)) {
                if (util.checkAdmin(2, user)) {
                    if(!inAdultonlyArray(name)) {
                        console.log(name);
                        util.handleError({hoerror: 2, message: "name is not allow"}, next, callback);
                    }
                } else {
                    console.log(name);
                    util.handleError({hoerror: 2, message: "name is not allow"}, next, callback);
                }
            }
            var normal = normalize(tag);
            mongo.orig("find", collection + "Dir" ,{parent: name, name: normal}, {limit: 1}, function(err,parents){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (parents.length === 0) {
                    mongo.orig("insert", collection + "Dir", {parent: name, name: normal, qtime: Math.round(new Date().getTime() / 1000)}, function(err, parent1){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        setTimeout(function(){
                            callback(null, {name: parent1[0].name, id: parent1[0]._id});
                        }, 0);
                    });
                } else {
                    setTimeout(function(){
                        callback(null, {name: parents[0].name, id: parents[0]._id});
                    }, 0);
                }
            });
        },
        delParent: function(id, user, next, callback) {
            if (!util.checkAdmin(1, user)) {
                console.log(user);
                util.handleError({hoerror: 2, message: "permission denied"}, next, callback);
            }
            mongo.orig("remove", collection + "Dir", {_id: id, $isolated: 1}, function(err, parent){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (parent) {
                    setTimeout(function(){
                        callback(null, {id: id});
                    }, 0);
                } else {
                    setTimeout(function(){
                        callback(null, {apiOK: true});
                    }, 0);
                }
            });
        },
        queryParentTag: function(id, single, sortName, sortType, user, session, next, callback) {
            var this_obj = this;
            mongo.orig("find", collection + "Dir" ,{_id: id}, {limit: 1}, function(err,parents){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (parents.length === 0) {
                    util.handleError({hoerror: 2, message: "can not find dir"}, next, callback);
                } else {
                    if (single === 'single') {
                        var tags = this_obj.searchTags(session);
                        if (!tags) {
                            util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                        }
                        tags.resetArray();
                    }
                    this_obj.tagQuery(0, parents[0].name, true, null, sortName, sortType, user, session, next, function(err, result) {
                        if (err) {
                            util.handleError(err, next, callback);
                        }
                        mongo.orig("update", collection + "Dir", {_id: parents[0]._id}, {$set: {qtime: Math.round(new Date().getTime() / 1000)}}, function(err, parent1){
                            if(err) {
                                util.handleError(err, next, callback);
                            }
                            setTimeout(function(){
                                callback(null, result);
                            }, 0);
                        });
                    });
                }
            });
        },
        getLatest: function(bookmark, next, callback) {
            mongo.orig("find", collection + "User" ,{_id: mongo.objectID(bookmark)}, {limit: 1}, function(err,items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                var latest = false;
                if (items.length > 0 && items[0].latest) {
                    var youtubeMatch = items[0].latest.toString().match(/^y_(.*)$/);
                    if (youtubeMatch) {
                        latest = youtubeMatch[1];
                    } else {
                        latest = items[0].latest;
                    }
                }
                setTimeout(function(){
                    callback(null, latest);
                }, 0);
            });
        },
        setLatest: function(saveName, latest, session, callback) {
            var tags = this.searchTags(session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, callback, callback);
            }
            var bookmark = '';
            if (saveName) {
                var save = tags.loadArray(saveName);
                if (save) {
                    bookmark = save.bookmark;
                }
            } else {
                bookmark = tags.getBookmark();
            }
            if (bookmark) {
                mongo.orig("update", collection + "User", {_id: mongo.objectID(bookmark)}, {$set: {latest: latest}}, function(err, item){
                    if(err) {
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
        },
        getBookmarkList: function(sortName, sortType, user, next, callback) {
            mongo.orig("find", collection + "User", {userId: user._id}, {"sort": [[sortName, sortType]]}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                var bookmarklist = [];
                for (var i in items) {
                   bookmarklist.push({name: items[i].name, id: items[i]._id});
                }
                setTimeout(function(){
                    callback(null, {bookmarkList: bookmarklist});
                }, 0);
            });
        },
        getBookmark: function(id, sortName, sortType, user, session, next, callback) {
            var this_obj = this;
            mongo.orig("find", collection + "User", {_id: id}, {limit: 1}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (items.length === 0) {
                    util.handleError({hoerror: 2, message: "can not find bookmark!!!"}, next, callback);
                }
                var tags = this_obj.searchTags(session);
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                tags.setArray(items[0]._id, items[0].tag, items[0].exactly);
                this_obj.tagQuery(0, null, null, null, sortName, sortType, user, session, next, function(err, result) {
                    if (err) {
                        util.handleError(err, next, callback);
                    }
                    setTimeout(function(){
                        callback(null, result);
                    }, 0);
                });
            });
        },
        setBookmark: function(btag, bexactly, sortName, sortType, user, session, next, callback) {
            var tags = this.searchTags(session);
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            tags.setArray('', btag, bexactly);
            this.tagQuery(0, null, null, null, sortName, sortType, user, session, next, function(err, result) {
                if (err) {
                    util.handleError(err, next, callback);
                }
                setTimeout(function(){
                    callback(null, result);
                }, 0);
            });
        },
        delBookmark: function(id, next, callback) {
            mongo.orig("remove", collection + "User", {_id: id, $isolated: 1}, function(err,item){
                if(err) {
                    util.handleError(err, next, callback);
                }
                setTimeout(function(){
                    callback(null, {id: id});
                }, 0);
            });
        },
        addBookmark: function(name, user, session, next, callback, bpath, bexactly) {
            if (!bpath || !bexactly) {
                var tags = this.searchTags(session);
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray();
                bpath = parentList.cur;
                bexactly = parentList.exactly;
            }
            if (bpath.length <= 0) {
                util.handleError({hoerror: 2, message: 'empty parent list!!!'}, next, callback);
            }
            mongo.orig("find", collection + "User", {userId: user._id, name: name}, {limit: 1}, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (items.length > 0) {
                    var utime = Math.round(new Date().getTime() / 1000);
                    var data = {};
                    data['tag'] = bpath;
                    data['exactly'] = bexactly;
                    data['mtime'] = utime;
                    mongo.orig("update", collection + "User", {userId: user._id, name: name}, {$set: data}, function(err, item1){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        if (tags) {
                            tags.setArray(items[0]._id);
                        }
                        setTimeout(function(){
                            callback(null, {apiOk: true});
                        }, 0);
                    });
                } else {
                    mongo.orig("count", collection + "User", {userId: user._id}, function(err, count){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        if (count >= bookmarkLimit) {
                            console.log(count);
                            util.handleError({hoerror: 2, message: 'too much bookmark!!!'}, next, callback);
                        }
                        var utime = Math.round(new Date().getTime() / 1000);
                        var data = {};
                        data['userId'] = user._id;
                        data['name'] = name;
                        data['tag'] = bpath;
                        data['exactly'] = bexactly;
                        data['mtime'] = utime;
                        mongo.orig("insert", collection + "User", data, function(err, item1){
                            if(err) {
                                util.handleError(err, next, callback);
                            }
                            if (tags) {
                                tags.setArray(item1[0]._id);
                            }
                            setTimeout(function(){
                                callback(null, {name: item1[0].name, id: item1[0]._id});
                            }, 0);
                        });
                    });
                }
            });
        },
        getUnactive: function(type) {
            if (type === 'day') {
                return unactive_day;
            } else if (type === 'hit') {
                return unactive_hit;
            } else {
                return 0;
            }
        },
        getRelativeTag: function(tag_arr, user, pre_arr, next, callback, exactly_arr) {
            var name = false, q_path = [], index = -1, normal = null;
            if (Array.isArray(tag_arr)) {
                q_path = tag_arr;
            } else {
                q_path = ['all item'];
                name = util.isValidString(tag_arr, 'name');
                if (name === false) {
                    setTimeout(function(){
                        callback(null, pre_arr);
                    }, 0);
                    return false;
                }
                normal = normalize(tag_arr);
                if (isDefaultTag(normal)) {
                    setTimeout(function(){
                        callback(null, pre_arr);
                    }, 0);
                    return false;
                }
                q_path.push(normal);
                exactly_arr = [true, false];
            }
            var hint = {};
            var options = {"limit": queryLimit, "sort": [[getSortName('name'), 'desc']]};
            var sql = getQuerySql(user, q_path, exactly_arr);
            if (sql.hint) {
                options["hint"] = sql.hint;
            }
            mongo.orig("find", collection, sql.nosql, {_id: 0, tags: 1, name: 1}, options, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                var relative_arr = [];
                if (items.length > 0) {
                    var u = union_number;
                    var t = inter_number;
                    var nIndex = -1;
                    var counter_arr = [];
                    var temp = [];
                    nIndex = items[0].tags.indexOf(normalize(items[0].name));
                    if (nIndex !== -1) {
                        items[0].tags.splice(nIndex, 1);
                    }
                    items[0].tags.forEach(function (e) {
                        if (pre_arr.indexOf(e) === -1 && normal !== e) {
                            relative_arr.push(e);
                            counter_arr.push(0);
                        }
                    });
                    for (var i = 1; i < items.length; i++) {
                        if (t) {
                            nIndex = items[i].tags.indexOf(normalize(items[i].name));
                            if (nIndex !== -1) {
                                items[i].tags.splice(nIndex, 1);
                            }
                            items[i].tags.forEach(function (e) {
                                if (pre_arr.indexOf(e) === -1 && normal !== e) {
                                    nIndex = relative_arr.indexOf(e);
                                    if (nIndex === -1) {
                                        relative_arr.push(e);
                                        counter_arr.push(0);
                                    } else {
                                        counter_arr[nIndex]++;
                                    }
                                }
                            });
                            t--;
                        } else {
                            break;
                        }
                    }
                    for (var i = inter_number+1; i < items.length; i++) {
                        nIndex = items[i].tags.indexOf(normalize(items[i].name));
                        if (nIndex !== -1) {
                            items[i].tags.splice(nIndex, 1);
                        }
                        temp = [];
                        relative_arr = relative_arr.filter(function (e, j) {
                            if (pre_arr.indexOf(e) === -1 && normal !== e) {
                                if (items[i].tags.indexOf(e) !== -1) {
                                    temp.push(counter_arr[j]+1);
                                    return true;
                                } else {
                                    if ((counter_arr[j] + inter_number) >= i) {
                                        temp.push(counter_arr[j]);
                                        return true;
                                    }
                                }
                            }
                        });
                        counter_arr = temp;
                    }
                    for (var i in items) {
                        if (u) {
                            items[i].tags.forEach(function (e) {
                                if (pre_arr.indexOf(e) === -1 && normal !== e) {
                                    if (relative_arr.indexOf(e) === -1) {
                                        relative_arr.push(e);
                                    }
                                }
                            });
                            u--;
                        } else {
                            break;
                        }
                    }
                }
                /*if (collection === 'storage') {
                    if (relative_arr.indexOf('first item') === -1) {
                        relative_arr.push('first item');
                    }
                } else if (collection === 'stock') {
                    if (relative_arr.indexOf('important') === -1) {
                        relative_arr.push('important');
                    }
                }*/
                setTimeout(function(){
                    callback(null, pre_arr.concat(relative_arr));
                }, 0);
            });
        },
        getYoutubeQuery: function(search_arr, sortName, pageToken) {
            var query = {};
            var index = -1;
            var query_arr = [];
            var id_arr = [];
            var pl_arr = [];
            var is_y = false;
            var ch = false;
            query.type = 0;
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22){
                    query_arr.push(denormalize(search_arr[i]));
                //ymp
                } else if (index.index === 11) {
                    query.type = 20 + query.type%10;
                //ym
                } else if (index.index === 10) {
                    query.type = Math.floor(query.type/10)*10 + 2;
                //yp
                } else if (index.index === 9) {
                    query.type = 10 + query.type%10;
                //yv
                } else if (index.index === 8) {
                    query.type = Math.floor(query.type/10)*10 + 1;
                } else if (index.index === 30) {
                    index = isDefaultTag(search_arr[i]);
                    if (index[1] === 'ou') {
                        id_arr.push(index[2]);
                    } else if (index[1] === 'pl') {
                        pl_arr.push(index[2]);
                    } else if (index[1] === 'ch') {
                        query.channelId = index[2];
                    } else {
                        query_arr.push(search_arr[i]);
                    }
                }
            }
            if (!query.type) {
                return false;
            }
            if (!query.channelId) {
                if (query_arr.length > 0) {
                    query.keyword = query_arr.join(' ');
                /*} else {
                    //#YouTube熱門影片台灣
                    query.channelId = 'UCBcIWZhWqUwknlxikVHQoyA';*/
                }
            }
            query.maxResults = queryLimit;
            if (sortName === 'count') {
                query.order = 'viewCount';
            } else if (sortName === 'mtime') {
                query.order = 'date';
            } else {
                query.order = 'relevance';
            }
            if (pageToken) {
                query.pageToken = pageToken;
            } else {
                if (id_arr.length > 0) {
                    query.id_arr = id_arr;
                }
                if (pl_arr.length > 0) {
                    query.pl_arr = pl_arr;
                }
            }
            return query;
        },
        getKuboQuery: function(search_arr, sortName, page) {
            var order = 'vod_hits_month';
            var sOrder = 2;
            if (sortName === 'count') {
                sOrder = 2;
                order = 'vod_hits_month';
            } else if (sortName === 'mtime') {
                sOrder = 1;
                order = 'vod_addtime';
            }
            var searchWord = null;
            var year = 0;
            var type = 0;
            var country = '';
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22) {
                    if (search_arr[i].match(/^\d\d\d\d$/)) {
                        if (Number(search_arr[i]) < 2100 && Number(search_arr[i]) > 1800) {
                            year = Number(search_arr[i]);
                            searchWord = null;
                            country = '';
                        } else {
                            searchWord = denormalize(search_arr[i]);
                            year = 0;
                            country = '';
                        }
                    } else if (kubo_country.indexOf(search_arr[i]) !== -1) {
                        country = kubo_country[kubo_country.indexOf(search_arr[i])];
                        searchWord = null;
                        year = 0;
                    } else {
                        searchWord = denormalize(search_arr[i]);
                        year = 0;
                        country = '';
                    }
                //movie
                } else if (index.index === 13) {
                    type = 1;
                //tv series
                } else if (index.index === 14) {
                    type = 2;
                //tv show
                } else if (index.index === 15) {
                    type = 41;
                //animation
                } else if (index.index === 16) {
                    type = 3;
                }
            }
            if (type) {
                var url = null;
                if (searchWord) {
                    url = 'http://www.123kubo.com/index.php?s=home-Vod-innersearch-q-' + searchWord + '-order-' + sOrder;
                    if (page > 1) {
                        url = 'http://www.123kubo.com/index.php?s=Vod-innersearch-q-' + searchWord + '-order-' + sOrder + '-page-' + page;
                    }
                    return url;
                } else {
                    var url = 'http://www.123kubo.com/vod-search-id-' + type + '-cid--tag--area-' + country + '-tag--year-' + year + '-wd--actor--order-' + order + '%20desc-p-';
                    return url + page + '.html';
                }
            } else {
                return false;
            }
        },
        getYifyQuery: function(search_arr, sortName, page) {
            var url = 'https://yts.ag/api/v2/list_movies.json';
            var search = false;
            var genre = null;
            var query_term = null;
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22) {
                    if (yify_type.indexOf(normalize(search_arr[i])) !== -1) {
                        genre = normalize(search_arr[i]);
                        query_term = null;
                    } else if (yify_type_cht.indexOf(normalize(search_arr[i])) !== -1) {
                        genre = yify_type[yify_type_cht.indexOf(normalize(search_arr[i]))];
                        query_term = null;
                    } else {
                        query_term = denormalize(search_arr[i]);
                        genre = null;
                    }
                } else if (index.index === 17) {
                    search = true;
                }
            }
            if (search) {
                var order = 'date_added';
                if (sortName === 'count') {
                    order = 'rating';
                } else if (sortName === 'mtime') {
                    order = 'year';
                }
                url = url + '?sort_by=' + order;
                if (page > 1) {
                    url =  url + '&page=' + page;
                }
                if (query_term) {
                    url =  url + '&query_term=' + query_term;
                }
                if (genre) {
                    url =  url + '&genre=' + genre;
                }
                console.log(url);
                return url;
            } else {
                return false;
            }
        },
        getMadQuery: function(search_arr, sortName, page) {
            var url = 'http://www.cartoonmad.com/';
            var comic_type = -1;
            var query_term = null;
            var search = false;
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22) {
                    if (mad_type.indexOf(normalize(search_arr[i])) !== -1) {
                        comic_type = mad_type.indexOf(normalize(search_arr[i]));
                        query_term = null;
                    } else {
                        query_term = denormalize(search_arr[i]);
                        comic_type = -1;
                    }
                } else if (index.index === 18) {
                    search = true;
                }
            }
            if (search) {
                if (query_term) {
                    url =  url + 'search.html';
                    var post = {keyword: query_term, searchtype: 'all'};
                    console.log(url);
                    console.log(post);
                    return {url: url, post: post};
                } else {
                    var comic_index = '99';
                    if (comic_type !== -1) {
                        comic_index = mad_index[comic_type];
                    }
                    url = url + 'comic' + comic_index;
                    if (page > 1 && page < 10) {
                        url =  url + '.0' + page + '.html';
                    } else if (page >= 10) {
                        url =  url + '.' + page + '.html';
                    } else {
                        url = url + '.html';
                    }
                    console.log(url);
                    return url;
                }
            } else {
                return false;
            }
        },
        getC99Query: function(search_arr, sortName, page) {
            var url = 'http://www.99comic.com/lists/';
            var search = false;
            var comic_type = -1;
            var query_term = null;
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22) {
                    if (c99_type.indexOf(normalize(search_arr[i])) !== -1) {
                        comic_type = c99_type.indexOf(normalize(search_arr[i]));
                        query_term = null;
                    } else {
                        query_term = denormalize(search_arr[i]);
                        comic_type = -1;
                    }
                } else if (index.index === 21) {
                    search = true;
                }
            }
            if (search) {
                if (query_term) {
                    url = 'http://www.99comic.com/search/s.aspx?search_keyword=' + query_term + '&Submit=%E6%90%9C%E5%B0%8B';
                    if (page > 1) {
                        return false;
                    }
                } else {
                    if (comic_type !== -1) {
                        url = 'http://www.99comic.com/comiclist/' + c99_index[comic_type] + '/';
                    }
                    if (page > 1) {
                        url = url + '2/';
                    }
                }
                return url;
            } else {
                return false;
            }
        },
        getBiliQuery: function(search_arr, sortName, page) {
            var url = 'http://www.bilibili.com/api_proxy?app=bangumi&pagesize=20&action=site_season_index';
            var order = 0;
            var mOrder = 'default';
            var sOrder = null;
            if (sortName === 'count') {
                order = 0;
                mOrder = 'hot';
                sOrder = 'click';
            } else if (sortName === 'mtime') {
                order = 2;
                mOrder = 'default';
            }
            var s_country = -1;
            var s_year = 0;
            var query_term = null;
            var search = 0;
            for (var i in search_arr) {
                index = isDefaultTag(normalize(search_arr[i]));
                if (!index || index.index === 0 || index.index === 6 || index.index === 22) {
                    if (search_arr[i].match(/^\d\d\d\d$/)) {
                        if (Number(search_arr[i]) < 2100 && Number(search_arr[i]) > 1800) {
                            s_year = Number(search_arr[i]);
                            query_term = null;
                            s_country = -1;
                        } else {
                            query_term = denormalize(search_arr[i]);
                            s_year = 0;
                            s_country = -1;
                        }
                    } else if (bili_type.indexOf(normalize(search_arr[i])) !== -1) {
                        s_year = 0;
                        s_country = bili_type.indexOf(normalize(search_arr[i]));
                        query_term = null;
                    } else {
                        s_year = 0;
                        query_term = denormalize(search_arr[i]);
                        s_country = -1;
                    }
                } else if (index.index === 19) {
                    search = 1;
                } else if (index.index === 20) {
                    search = 2;
                }
            }
            if (search) {
                if (query_term) {
                    var s_type = 'bangumi';
                    var s_append = '';
                    if (search === 2) {
                        s_type = 'video';
                        s_append = '&tids_1=23&duration=4';
                        if (sOrder) {
                            s_append = s_append + '&order=' + sOrder;
                        }
                    }
                    url = 'http://search.bilibili.com/ajax_api/' + s_type + '?keyword=' + encodeURIComponent(query_term) + s_append;
                    if (page > 1) {
                        url = url + '&page=' + page;
                    }
                } else {
                    if (search === 2) {
                        var ch_type = 0;
                        var ch_page = 0;
                        if (s_country !== -1 && s_country !== 12) {
                            switch(s_country) {
                                case 0:
                                case 3:
                                case 4:
                                ch_type = 147;
                                break;
                                case 1:
                                ch_type = 146;
                                break;
                                case 2:
                                ch_type = 145;
                                break;
                                default:
                                ch_type = 83;
                                break;
                            }
                            ch_page = page;
                        } else {
                            if (page%4 === 1) {
                                ch_type = 147;
                                ch_page = Math.round((page+3)/4);
                            } else if (page%4 === 2) {
                                ch_type = 146;
                                ch_page = Math.round((page+2)/4);
                            } else if (page%4 === 3) {
                                ch_type = 145;
                                ch_page = Math.round((page+1)/4);
                            } else {
                                ch_type = 83;
                                ch_page = Math.round(page/4);
                            }
                        }
                        var d = new Date();
                        var y = d.getFullYear();
                        var m = d.getMonth() + 1;
                        var day = d.getDate();
                        var pd = new Date(new Date(d).setMonth(d.getMonth()-3));
                        var py = pd.getFullYear();
                        var pm = pd.getMonth() + 1;
                        var pday = pd.getDate() + 1;
                        url = 'http://www.bilibili.com/list/' + mOrder + '-' + ch_type + '-'+ ch_page + '-'+ py + '-' + pm + '-' + pday + '~' + y + '-' + m + '-' + day + '.html';
                    } else {
                        if (s_country === 12) {
                            var d = new Date();
                            var y = d.getFullYear();
                            var m = d.getMonth() + 1;
                            var day = d.getDate();
                            var pd = new Date(new Date(d).setMonth(d.getMonth()-3));
                            var py = pd.getFullYear();
                            var pm = pd.getMonth() + 1;
                            var pday = pd.getDate() + 1;
                            url = 'http://www.bilibili.com/list/' + mOrder + '-32-'+ page + '-'+ py + '-' + pm + '-' + pday + '~' + y + '-' + m + '-' + day + '.html';
                        } else {
                            url = url + '&page=' + page;
                            url = url + '&indexType=' + order;
                            if (s_country !== -1) {
                                url = url + '&seasonArea=' + bili_index[s_country];
                            }
                            if (s_year) {
                                url = url + '&startYear=' + s_year;
                            }
                        }
                    }
                }
                console.log(url);
                return url;
            } else {
                return false;
            }
        },
        completeMimeTag: function(add) {
            var this_obj = this;
            var search_number = 0;
            var complete_tag = [];
            var game_list = mime.getOptionTag('game');
            var game_list_ch = mime.getOptionTag('gamech');
            var media_list = mime.getOptionTag('media');
            var media_list_ch = mime.getOptionTag('mediach');
            var trans_list = mime.getOptionTag('trans');
            var trans_list_ed = mime.getOptionTag('transed');
            var option_index = -1;
            var tran_tag = null;
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
                                option_index = trans_list.indexOf(items[index].tags[i]);
                                if (option_index !== -1) {
                                    if (items[index].tags.indexOf(trans_list_ed[option_index]) === -1) {
                                        for (var j in items[index]) {
                                            if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                if (items[index][j].indexOf(trans_list[option_index]) !== -1) {
                                                    tran_tag = trans_list_ed[option_index];
                                                    complete_tag.push({owner: j, tag: tran_tag});
                                                    option_index = yify_type_cht.indexOf(tran_tag);
                                                    if (option_index !== -1) {
                                                        if (items[index].tags.indexOf(yify_type[option_index]) === -1) {
                                                            complete_tag.push({owner: j, tag: yify_type[option_index]});
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                option_index = yify_type.indexOf(items[index].tags[i]);
                                if (option_index !== -1) {
                                    if (items[index].tags.indexOf(yify_type_cht[option_index]) === -1) {
                                        for (var j in items[index]) {
                                            if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                if (items[index][j].indexOf(yify_type[option_index]) !== -1) {
                                                    complete_tag.push({owner: j, tag: yify_type_cht[option_index]});
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    option_index = yify_type_cht.indexOf(items[index].tags[i]);
                                    if (option_index !== -1) {
                                        if (items[index].tags.indexOf(yify_type[option_index]) === -1) {
                                            for (var j in items[index]) {
                                                if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                    if (items[index][j].indexOf(yify_type_cht[option_index]) !== -1) {
                                                        complete_tag.push({owner: j, tag: yify_type[option_index]});
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                option_index = game_list.indexOf(items[index].tags[i]);
                                if (option_index !== -1) {
                                    if (items[index].tags.indexOf(game_list_ch[option_index]) === -1) {
                                        for (var j in items[index]) {
                                            if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                if (items[index][j].indexOf(game_list[option_index]) !== -1) {
                                                    complete_tag.push({owner: j, tag: game_list_ch[option_index]});
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    option_index = game_list_ch.indexOf(items[index].tags[i]);
                                    if (option_index !== -1) {
                                        if (items[index].tags.indexOf(game_list[option_index]) === -1) {
                                            for (var j in items[index]) {
                                                if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                    if (items[index][j].indexOf(game_list_ch[option_index]) !== -1) {
                                                        complete_tag.push({owner: j, tag: game_list[option_index]});
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                option_index = media_list.indexOf(items[index].tags[i]);
                                if (option_index !== -1) {
                                    if (items[index].tags.indexOf(media_list_ch[option_index]) === -1) {
                                        for (var j in items[index]) {
                                            if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                if (items[index][j].indexOf(media_list[option_index]) !== -1) {
                                                    complete_tag.push({owner: j, tag: media_list_ch[option_index]});
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    option_index = media_list_ch.indexOf(items[index].tags[i]);
                                    if (option_index !== -1) {
                                        if (items[index].tags.indexOf(media_list[option_index]) === -1) {
                                            for (var j in items[index]) {
                                                if (util.isValidString(j, 'uid') || j === 'eztv' || j === 'lovetv') {
                                                    if (items[index][j].indexOf(media_list_ch[option_index]) !== -1) {
                                                        complete_tag.push({owner: j, tag: media_list[option_index]});
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
                                    this_obj.addTag(items[index]._id, complete_tag[tIndex].tag, {_id: complete_tag[tIndex].owner, perm: 1}, function(err) {
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
    };
};

function inAdultonlyArray(parent) {
    for (var i in adultonly_arr) {
        if (adultonly_arr[i].name === parent) {
            return true;
        }
    }
    return false;
}

var getStorageQuerySql = function(user, tagList, exactly) {
    var nosql = {first: 1};
    var is_first = true;
    var is_adultonly = false;
    var is_tags = false;
    var skip = 0;
    if (tagList.length === 0) {
        if (!util.checkAdmin(2, user)) {
            nosql['adultonly'] = 0;
            is_adultonly = true;
        }
        if (!util.checkAdmin(1, user)) {
            nosql['recycle'] = 0;
        }
    } else {
        var isAdult = false;
        nosql['$and'] = [];
        for (var i in tagList) {
            var normal = normalize(tagList[i]);
            var index = isDefaultTag(normal);
            if (index.index === 30) {
                continue;
            } else if (index.index === 31) {
                if (index[1] === '') {
                    skip = Number(index.index[2]);
                }
                continue;
            } else if (index.index === 0) {
                if (util.checkAdmin(2, user)) {
                    nosql['adultonly'] = 1;
                    is_adultonly = true;
                }
            } else if (index.index === 22) {
                if (util.checkAdmin(2, user)) {
                    nosql['adultonly'] = 0;
                    is_adultonly = true;
                }
            } else if (index.index === 1) {
                if (util.checkAdmin(1, user)) {
                    var time = Math.round(new Date().getTime() / 1000) - handleTime;
                    console.log({mediaType: {$exists: true}, utime: {$lt: time}});
                    return {nosql: {mediaType: {$exists: true}, utime: {$lt: time}}};
                }
            } else if (index.index === 2) {
                if (util.checkAdmin(1, user)) {
                    var unDay = user.unDay? user.unDay: unactive_day;
                    var unHit = user.unHit? user.unHit: unactive_hit;
                    var time = Math.round(new Date().getTime() / 1000) - unDay * 86400;
                    console.log({count: {$lt: unHit}, utime: {$lt: time}});
                    return {nosql: {count: {$lt: unHit}, utime: {$lt: time}}};
                }
            } else if (index.index === 12) {
                if (util.checkAdmin(1, user)) {
                    var unDay = user.unDay? user.unDay: unactive_day;
                    var unHit = user.unHit? user.unHit: unactive_hit;
                    var time = Math.round(new Date().getTime() / 1000) - unDay * 86400;
                    console.log({count: {$lt: unHit}, utime: {$lt: time}, tags: 'playlist'});
                    return {nosql: {count: {$lt: unHit}, utime: {$lt: time}, tags: 'playlist'}};
                }
            } else if (index.index === 3) {
                if (util.checkAdmin(1, user)) {
                    var time = Math.round(new Date().getTime() / 1000) - handleTime;
                    console.log({recycle: {$ne: 0}, utime: {$lt: time}});
                    return {nosql: {recycle: {$ne: 0}, utime: {$lt: time}}};
                }
            } else if (index.index === 4 || index.index === 6 || index.index === 8 || index.index === 9 || index.index === 10 || index.index === 11 || index.index === 13 || index.index === 14 || index.index === 15 || index.index === 16 || index.index === 17 || index.index === 18 || index.index === 19 || index.index === 20 || index.index === 21) {
            } else if (index.index === 5) {
                delete nosql['first'];
                is_first = false;
            } else if (index.index === 7) {
                return false;
            } else {
                if (exactly[i]) {
                    nosql.$and.push({tags: normal});
                    is_tags = true;
                } else {
                    var es_reg = escapeRegExp(normal);
                    nosql.$and.push({tags: { $regex: es_reg }});
                }
            }
        }
        if (!util.checkAdmin(1, user)) {
            nosql['recycle'] = 0;
        }
        if (!util.checkAdmin(2, user)) {
            nosql['adultonly'] = 0;
            is_adultonly = true;
        }
    }
    console.log(nosql);
    if (nosql.$and) {
        console.log(nosql.$and);
        if (nosql.$and.length === 0) {
            delete(nosql.$and);
        }
    }
    var hint = {};
    if (is_adultonly) {
        hint['adultonly'] = 1;
    }
    if (is_tags) {
        hint['tags'] = 1;
    }
    if (is_first) {
        hint['first'] = 1;
    }
    hint['name'] = 1;
    var sql = {nosql: nosql};
    if (is_hint) {
        sql['hint'] = hint;
    }
    if (skip) {
        console.log('skip:' + skip);
        sql['skip'] = skip;
    }
    return sql;
}

function getStockQuerySql(user, tagList, exactly) {
    var nosql = {};
    var is_tags = false;
    var is_important = false;
    var skip = 0;
    if (tagList.length === 0) {
    } else {
        nosql['$and'] = [];
        for (var i in tagList) {
            var normal = normalize(tagList[i]);
            var index = isDefaultTag(normal);
            if (index.index === 6) {
                nosql['important'] = 1;
                is_important = true;
            } else if (index.index === 31) {
                if (index.index[1] === '') {
                    skip = Number(index.index[1]);
                } else if (index.index[1] === 'profit') {
                    nosql['profitIndex'] = {$gte: Number(index.index[1])};
                } else if (index.index[1] === 'safety') {
                    nosql['safetyIndex'] = {$gte: Number(index.index[1])};
                } else if (index.index[1] === 'manag') {
                    nosql['managementIndex'] = {$gte: Number(index.index[1])};
                }
                continue;
            } else if (index) {
            } else {
                if (exactly[i]) {
                    nosql.$and.push({tags: normal});
                    is_tags = true;
                } else {
                    var es_reg = escapeRegExp(normal);
                    nosql.$and.push({tags: { $regex: es_reg }});
                }
            }
        }
    }
    console.log(nosql);
    if (nosql.$and) {
        console.log(nosql.$and);
        if (nosql.$and.length === 0) {
            delete(nosql.$and);
        }
    }
    var hint = {};
    if (is_tags) {
        hint['tags'] = 1;
    }
    if (is_important) {
        hint['important'] = 1;
    }
    hint['profitIndex'] = 1;
    var sql = {nosql: nosql};
    if (is_hint) {
        sql['hint'] = hint;
    }
    sql['select'] = {cash: 0, asset: 0, sales: 0};
    if (skip) {
        console.log('skip:' + skip);
        sql['skip'] = skip;
    }
    return sql;
}

function getPasswordQuerySql(user, tagList, exactly) {
    var nosql = {owner: user._id};
    var is_tags = false;
    var is_important = false;
    var skip = 0;
    if (tagList.length === 0) {
    } else {
        nosql['$and'] = [];
        for (var i in tagList) {
            var normal = normalize(tagList[i]);
            var index = isDefaultTag(normal);
            if (index.index === 6) {
                nosql['important'] = 1;
                is_important = true;
            } else if (index.index === 31) {
                if (index.index[1] === '') {
                    skip = Number(index.index[1]);
                }
                continue;
            } else if (index) {
            } else {
                if (exactly[i]) {
                    nosql.$and.push({tags: normal});
                    is_tags = true;
                } else {
                    var es_reg = escapeRegExp(normal);
                    nosql.$and.push({tags: { $regex: es_reg }});
                }
            }
        }
    }
    console.log(nosql);
    if (nosql.$and) {
        console.log(nosql.$and);
        if (nosql.$and.length === 0) {
            delete(nosql.$and);
        }
    }
    var hint = {};
    hint['owner'] = 1;
    if (is_tags) {
        hint['tags'] = 1;
    }
    if (is_important) {
        hint['important'] = 1;
    }
    hint['name'] = 1;
    var sql = {nosql: nosql};
    if (is_hint) {
        sql['hint'] = hint;
    }
    sql['select'] = {password: 0, prePassword: 0, owner: 0};
    if (skip) {
        console.log('skip:' + skip);
        sql['skip'] = skip;
    }
    return sql;
}

function getStorageQueryTag(user, tag, del) {
    del = typeof del !== 'undefined' ? del : 1;
    var normal = normalize(tag);
    var index = isDefaultTag(normal);
    if (index.index === 0) {
        if (util.checkAdmin(2, user)) {
            return {tag: {adultonly: del}, type: 2, name: default_tags[0]};
        } else {
            return {type: 0};
        }
    } else if (index.index === 4) {
        return {tag: {first: del}, type: 2, name: default_tags[4]};
    } else if (index) {
        return {type: 0};
    } else {
        return {tag: {tags: normal}, type: 1};
    }
}

function getStockQueryTag(user, tag, del) {
    del = typeof del !== 'undefined' ? del : 1;
    var normal = normalize(tag);
    var index = isDefaultTag(normal);
    if (index.index === 6) {
        return {tag: {important: del}, type: 2, name: default_tags[6]};
    } else if (index) {
        return {type: 0};
    } else {
        return {tag: {tags: normal}, type: 1};
    }
}

function getPasswordQueryTag(user, tag, del) {
    del = typeof del !== 'undefined' ? del : 1;
    var normal = normalize(tag);
    var index = isDefaultTag(normal);
    if (index.index === 6) {
        return {type: 3, name: ''};
    } else if (index) {
        return {type: 0};
    } else {
        return {tag: {tags: normal}, type: 1};
    }
}

function normalize(tag) {
    var result = '';
    for (var i=0; i<tag.length; i++) {
        if (tag.charCodeAt(i) === 12288){
            result += " ";
        } else {
            if (tag.charCodeAt(i) > 65280 && tag.charCodeAt(i) < 65375) {
                result += String.fromCharCode(tag.charCodeAt(i) - 65248);
            } else {
                result += String.fromCharCode(tag.charCodeAt(i));
            }
        }
    }
    result = result.toLowerCase(result);
    result = result.replace(/[零一二三四五六七八九十百千萬0123456789]+/g, function (a) {
        return CN2ArabNum(a);
    });
    return result;
}
function CN2ArabNum(cn) {
    var cnChars = '零一二三四五六七八九',
    mulChars = '十百千萬',
    arab = 0, tmp = [], mul = 0, state = 0, aum = 0;
    if (!cn) {
        return 0;
    }
    cn = cn.replace(/[零一二三四五六七八九]/g, function (a) {
        return cnChars.indexOf(a);
    });
    if (cn.match(/^[十百千萬]/)) {
        cn = '1' + cn;
    }
    var pow = 1, i = 0;
    while(cn.length > 0) {
        tmp = cn.match(/[\d]+$/);
        if (tmp) {
            pow = 1;
            for (i = 0;i<(aum + mul);i++) {
                pow = pow * 10;
            }
            arab = arab + tmp[0] * pow;
            state = mul;
            mul = 0;
            cn = cn.slice(0, tmp.index);
        } else {
            if (mul > 0) {
                pow = 1;
                for (i = 0;i<(aum + mul);i++) {
                    pow = pow * 10;
                }
                arab = arab + pow;
                state = mul;
                mul = 0;
            }
            mul = Math.floor(((mulChars.indexOf(cn[cn.length-1])))+1);
            if (mul <= state) {
                aum = aum + state;
                state = 0;
            }
            cn = cn.slice(0, -1);
        }
    }
    return arab;
}

function isDefaultTag(tag) {
    var ret = {index: default_tags.indexOf(tag)};
    if (ret.index !== -1) {
        return ret;
    } else {
        ret = tag.match(youtube_id_pattern);
        if (ret) {
            ret.index = 30;
            return ret;
        }
        ret = tag.match(/^(profit|safety|manag|)>(-?\d+)$/)
        if (ret) {
            ret.index = 31;
            return ret;
        }
    }
    return false;
}

function getStorageSortName(sortName) {
    var sort = 'name';
    switch (sortName) {
        case 'count':
        sort = sortName;
        break;
        case 'mtime':
        sort = 'utime';
        break;
        case 'name':
        default:
        break;
    }
    return sort;
}

function getStockSortName(sortName) {
    var sort = 'profitIndex';
    switch (sortName) {
        case 'count':
        sort = 'managementIndex';
        break;
        case 'mtime':
        sort = 'safetyIndex';
        break;
        case 'name':
        default:
        break;
    }
    return sort;
}

function getPasswordSortName(sortName) {
    var sort = 'name';
    switch (sortName) {
        case 'count':
        sort = 'username';
        break;
        case 'mtime':
        sort = 'utime';
        break;
        case 'name':
        default:
        break;
    }
    return sort;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

//[^\x00-\x7F]+ 非英數
function denormalize(tag) {
    var o = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000, 10000];
    var r = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '萬'];
    var regex = null;
    for (var i in o) {
        regex = new RegExp('(^|[^\x00-\x7F])' + o[i] + '([^\x00-\x7F]|$)');
        tag = tag.replace(regex, "$1" + r[i] + "$2");
    }
    return tag;
}