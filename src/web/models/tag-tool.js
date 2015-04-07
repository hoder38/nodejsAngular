var util = require("../util/utility.js");
var mongo = require("../models/mongo-tool.js");

var default_tags = ['18禁', 'handlemedia', 'unactive', 'handlerecycle'];

var parent_arr = [{'name': 'media type', 'tw': '媒體種類'}, {'name': 'category', 'tw': '分類'}, {'name': 'franchise', 'tw': '單集'}, {'name': 'complete', 'tw': '完結'}, {'name': 'serial', 'tw': '連載中'}, {'name': 'game', 'tw': '遊戲'}, {'name': 'album', 'tw': '專輯'}, {'name': 'author', 'tw': '作者'}, {'name': 'actor', 'tw': '演員'}, {'name': 'director', 'tw': '導演'}, {'name': 'developer', 'tw': '開發商'}, {'name': 'animate_producer', 'tw': '動畫工作室'}, {'name': 'year', 'tw': '年份'}, {'name': 'country', 'tw': '國家'}, {'name': 'language', 'tw': '語言'}];
var adultonly_arr = [{'name': 'av_actress', 'tw': 'AV女優'}, {'name': 'adultonly_category', 'tw': '18禁分類'}, {'name': 'adultonly_producer', 'tw': '成人片商'}, {'name': 'adultonly_franchise', 'tw': '成人系列作'}];

var queryLimit = 20;

var handleTime = 7200,
    unactive_day = 5,
    unactive_hit = 10;

var bookmarkLimit = 50;

module.exports = function(collection) {
    return {
        searchTags: function (search, name) {
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
                        search[name] = {tags: tagList, exactly: exactly, index: tagList.length+1, save: search[name].save};
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
                mongo.orig("findOne", collection, {_id: id}, function(err, item){
                    if(err) {
                        util.handleError(err, next, callback, null);
                    }
                    if (!item) {
                        util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                    }
                    if (item.adultonly === tagType.tag.adultonly) {
                        setTimeout(function(){
                            callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.name});
                        }, 0);
                    } else {
                        mongo.orig("update", collection, {_id: id}, {$set: tagType.tag}, function(err, item2){
                            if(err) {
                                util.handleError(err, next, callback, null);
                            }
                            setTimeout(function(){
                                callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.name});
                            }, 0);
                        });
                    }
                });
            } else if (tagType.type === 1) {
                mongo.orig("findOne", collection, {_id: id}, function(err, item){
                    if(err) {
                        util.handleError(err, next, callback, null);
                    }
                    if (!item) {
                        util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                    }
                    if (item.tags.indexOf(tagType.tag.tags) === -1) {
                        tagType.tag[user._id.toString()] = tagType.tag.tags;
                        mongo.orig("update", collection, { _id: id }, {$addToSet: tagType.tag}, {upsert: true}, function(err, item2){
                            if(err) {
                                util.handleError(err, next, callback, null);
                            }
                            setTimeout(function(){
                                callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.tag.tags});
                            }, 0);
                        });
                    } else {
                        setTimeout(function(){
                            callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.tag.tags});
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
                util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback, null);
            }
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback, null);
            }
            var tagType = getQueryTag(user, name, 0);
            if (!tagType.type) {
                console.log(tagType);
                util.handleError({hoerror: 2, message: 'not authority delete default tag!!!'}, next, callback, null);
            }
            mongo.orig("findOne", collection, {_id: id}, function(err, item){
                if(err) {
                    util.handleError(err, next, callback, null);
                }
                if (!item) {
                    util.handleError({hoerror: 2, message: 'can not find object!!!'}, next, callback, null);
                }
                if (tagType.type === 2) {
                    mongo.orig("update", collection, { _id: id }, {$set: tagType.tag}, function(err, item1){
                        if(err) {
                            util.handleError(err, next, callback, null);
                        }
                        setTimeout(function(){
                            callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.name});
                        }, 0);
                    });
                } else if (tagType.type === 1) {
                    if (tagType.tag.tags === normalize(item.name)) {
                        console.log(tagType.tag.tags);
                        console.log(normalize(item.name));
                        util.handleError({hoerror: 2, message: 'can not delete file name!!!'}, next, callback, null);
                    }
                    if (util.checkAdmin(1, user)) {
                        console.log('authority del tag');
                        if (item.tags.indexOf(tagType.tag.tags) === -1) {
                            util.handleError({hoerror: 2, message: 'do not has tag!!!'}, next, callback, null);
                        }
                        for (var i in item) {
                            if (util.isValidString(i, 'uid')) {
                                tagType.tag[i] = tagType.tag.tags;
                                mongo.orig("update", collection, {_id: id}, {$pull: tagType.tag}, function(err, item2){
                                    if(err) {
                                        util.handleError(err, next, callback, null);
                                    }
                                    setTimeout(function(){
                                        callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.tag.tags});
                                    }, 0);
                                });
                            }
                        }
                    } else {
                        if (item[user._id.toString()].indexOf(tagType.tag.tags) === -1) {
                            tagType.tag[user._id.toString()] = tagType.tag.tags;
                            mongo.orig("update", collection, { _id: id }, {$pull: tagType.tag}, function(err, item2){
                                if(err) {
                                    util.handleError(err, next, callback, null);
                                }
                                setTimeout(function(){
                                    callback(null, {id: item._id, adultonly: item.adultonly, tag: tagType.tag.tags});
                                }, 0);
                            });
                        } else {
                            util.handleError({hoerror: 2, message: 'do not has authority!!!'}, next, callback, null);
                        }
                    }
                } else {
                    console.log(tagType);
                    util.handleError({hoerror: 1, message: 'unknown del tag type!!!'}, next, callback, null);
                }
            });
        },
        sendTag: function(uid, objName, tags, user, next, callback) {
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
                                mongo.orig("findOne", "storage", { _id: id }, function(err, item1){
                                    if(err) {
                                        util.handleError(err, next, callback, null);
                                    }
                                    setTimeout(function(){
                                        callback(null, {history: history, id: item1._id, adultonly: item1.adultonly});
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
                                mongo.orig("findOne", "storage", { _id: id }, function(err, item1){
                                    if(err) {
                                        util.handleError(err, next, callback, null);
                                    }
                                    setTimeout(function(){
                                        callback(null, {history: history, id: item1._id, adultonly: item1.adultonly});
                                    }, 0);
                                });
                            });
                        }
                    });
                }
            }
        },
        resetQuery: function(sortName, sortType, user, session, next, callback) {
            var tags = this.searchTags(session, 'parent');
            if (sortName === 'mtime') {
                sortName = 'utime';
            }
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            var parentList = tags.resetArray();
            var nosql = getQuerySql(user, parentList.cur, parentList.exactly);
            if (nosql.skip) {
                nosql = nosql.nosql;
            }
            var options = {"limit": queryLimit, "sort": [[sortName, sortType]]};
            delete tags;
            mongo.orig("find", collection, nosql, options, function(err, items){
                if(err) {
                    util.handleError(err, next, callback);
                }
                setTimeout(function(){
                    callback(null, {items: items, parentList: parentList});
                }, 0);
            });
        },
        tagQuery: function(page, tagName, exactly, index, sortName, sortType, user, session, next, callback) {
            var this_obj = this;
            if (sortName === 'mtime') {
                sortName = 'utime';
            }
            var options = {"limit": queryLimit, "skip" : page, "sort": [[sortName, sortType]]};
            if (!tagName) {
                var tags = this.searchTags(session, 'parent');
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray();
                var nosql = getQuerySql(user, parentList.cur, parentList.exactly);
                if (nosql.skip) {
                    options = {"limit": queryLimit, "skip" : page + nosql.skip, "sort": [[sortName, sortType]]};
                    nosql = nosql.nosql;
                }
                delete tags;
                mongo.orig("find", collection, nosql, options, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    if (nosql.mediaType) {
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
            } else if (!index) {
                var name = false;
                if (tagName.match(/^>\d+$/)) {
                    name = tagName;
                } else {
                    name = util.isValidString(tagName, 'name');
                }
                if (name === false) {
                    util.handleError({hoerror: 2, message: "name is not vaild"}, next, callback);
                }
                var tags = this_obj.searchTags(session, 'parent');
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray(name, exactly);
                var nosql = getQuerySql(user, parentList.cur, parentList.exactly);
                if (nosql.skip) {
                    options = {"limit": queryLimit, "skip" : page + nosql.skip, "sort": [[sortName, sortType]]};
                    nosql = nosql.nosql;
                }
                delete tags;
                mongo.orig("find", collection, nosql, options, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    if (nosql.mediaType) {
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
                var name = false,
                    Pindex = util.isValidString(index, 'parentIndex');
                if (tagName.match(/^>\d+$/)) {
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
                var tags = this_obj.searchTags(session, 'parent');
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                var parentList = tags.getArray(name, exactly, Pindex);
                var nosql = getQuerySql(user, parentList.cur, parentList.exactly);
                if (nosql.skip) {
                    options = {"limit": queryLimit, "skip" : page + nosql.skip, "sort": [[sortName, sortType]]};
                    nosql = nosql.nosql;
                }
                delete tags;
                mongo.orig("find", collection, nosql, options, function(err, items){
                    if(err) {
                        util.handleError(err, next, callback);
                    }
                    if (nosql.mediaType) {
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
            }
        },
        singleQuery: function(uid, user, session, next, callback) {
            var this_obj = this;
            var id = util.isValidString(uid, 'uid');
            if (id === false) {
                util.handleError({hoerror: 2, message: "uid is not vaild"}, next, callback);
            }
            var tags = this.searchTags(session, 'parent');
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            var parentList = tags.getArray();
            var nosql = getQuerySql(user, parentList.cur, parentList.exactly);
            if (nosql.skip) {
                nosql = nosql.nosql;
            }
            if (!nosql.hasOwnProperty('$and')) {
                nosql._id = id;
            } else {
                nosql.$and.push({_id: id});
            }
            delete tags;
            mongo.orig("findOne", collection, nosql, function(err, item){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (!item) {
                    setTimeout(function(){
                        callback(null, {empty: true});
                    }, 0);
                } else {
                    if (nosql.mediaType) {
                        setTimeout(function(){
                            callback(null, {item: item, mediaHadle: 1});
                        }, 0);
                    } else {
                        if (parentList.bookmark) {
                            this_obj.getLatest(parentList.bookmark, next, function(err, latest) {
                                if (latest) {
                                    setTimeout(function(){
                                        callback(null, {item: item, latest: latest, bookmark: parentList.bookmark});
                                    }, 0);
                                } else {
                                    setTimeout(function(){
                                        callback(null, {item: item, bookmark: parentList.bookmark});
                                    }, 0);
                                }
                            });
                        } else {
                            setTimeout(function(){
                                callback(null, {item: item});
                            }, 0);
                        }
                    }
                }
            });
        },
        saveSql: function(page, saveName, back, user, session) {
            var this_obj = this;
            var tags = this.searchTags(session, 'parent');
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
            var nosql = getQuerySql(user, save.tags, save.exactly);
            if (nosql.skip) {
                options = {"limit": queryLimit, "skip" : page + nosql.skip, "sort": [[save.sortName, save.sortType]]};
                nosql = nosql.nosql;
            }
            if (!nosql.hasOwnProperty('$and')) {
                nosql.$and = [];
            }

            delete tags;
            return {nosql: nosql, options: options};
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
            if (default_tags.indexOf(tag) !== -1) {
                return true;
            } else {
                return false;
            }
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
            mongo.orig("findOne", collection + "Dir" ,{parent: name, name: normal}, function(err,parent){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (!parent) {
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
                        callback(null, {name: parent.name, id: parent._id});
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
        queryParentTag: function(id, sortName, sortType, user, session, next, callback) {
            var this_obj = this;
            mongo.orig("findOne", collection + "Dir" ,{_id: id}, function(err,parent){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (!parent) {
                    util.handleError({hoerror: 2, message: "can not find dir"}, next, callback);
                } else {
                    this_obj.tagQuery(0, parent.name, true, null, sortName, sortType, user, session, next, function(err, result) {
                        if (err) {
                            util.handleError(err, next, callback);
                        }
                        mongo.orig("update", collection + "Dir", {_id: parent._id}, {$set: {qtime: Math.round(new Date().getTime() / 1000)}}, function(err, parent1){
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
            mongo.orig("findOne", collection + "User" ,{_id: mongo.objectID(bookmark)}, function(err,item){
                if(err) {
                    util.handleError(err, next, callback);
                }
                var latest = false;
                if (item.latest) {
                    latest = item.latest;
                }
                setTimeout(function(){
                    callback(null, latest);
                }, 0);
            });
        },
        setLatest: function(saveName, latest, session, next, callback) {
            var tags = this.searchTags(session, 'parent');
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
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
                        util.handleError(err, next, callback);
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
            mongo.orig("findOne", collection + "User", {_id: id}, function(err, item){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (!item) {
                    util.handleError({hoerror: 2, message: "can not find bookmark!!!"}, next, callback);
                }
                var tags = this_obj.searchTags(session, 'parent');
                if (!tags) {
                    util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
                }
                tags.setArray(item._id, item.tag, item.exactly);
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
        addBookmark: function(name, user, session, next, callback) {
            var tags = this.searchTags(session, 'parent');
            if (!tags) {
                util.handleError({hoerror: 2, message: 'error search var!!!'}, next, callback);
            }
            var parentList = tags.getArray();
            if (parentList.cur.length <= 0) {
                util.handleError({hoerror: 2, message: 'empty parent list!!!'}, next, callback);
            }
            mongo.orig("findOne", collection + "User", {userId: user._id, name: name}, function(err, item){
                if(err) {
                    util.handleError(err, next, callback);
                }
                if (item) {
                    var utime = Math.round(new Date().getTime() / 1000);
                    var data = {};
                    data['tag'] = parentList.cur;
                    data['exactly'] = parentList.exactly;
                    data['mtime'] = utime;
                    mongo.orig("update", collection + "User", {userId: user._id, name: name}, {$set: data}, function(err, item1){
                        if(err) {
                            util.handleError(err, next, callback);
                        }
                        tags.setArray(item._id);
                        setTimeout(function(){
                            callback(null, {apiOk: true});
                        }, 0);
                    });
                } else {
                    mongo.orig("count", collection + "User", {userId: user._id}, function(err, count){
                        if (count >= bookmarkLimit) {
                            console.log(count);
                            util.handleError({hoerror: 2, message: 'too much bookmark!!!'}, next, callback);
                        }
                        var utime = Math.round(new Date().getTime() / 1000);
                        var data = {};
                        data['userId'] = user._id;
                        data['name'] = name;
                        data['tag'] = parentList.cur;
                        data['exactly'] = parentList.exactly;
                        data['mtime'] = utime;
                        mongo.orig("insert", collection + "User", data, function(err, item1){
                            if(err) {
                                util.handleError(err, next, callback);
                            }
                            tags.setArray(item1[0]._id);
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
        }
    };
};

function inParentArray(parent) {
    for (var i in parent_arr) {
        if (parent_arr[i].name === parent) {
            return true;
        }
    }
    return false;
}

function inAdultonlyArray(parent) {
    for (var i in adultonly_arr) {
        if (adultonly_arr[i].name === parent) {
            return true;
        }
    }
    return false;
}

function getQuerySql(user, tagList, exactly) {
    var nosql = {};
    var skip = 0;
    if (tagList.length === 0) {
        if (!util.checkAdmin(2, user)) {
            nosql['adultonly'] = 0;
        }
        if (!util.checkAdmin(1, user)) {
            nosql['recycle'] = 0;
        }
    } else {
        var isAdult = false;
        nosql = {$and: []};
        for (var i in tagList) {
            var skip_number = tagList[i].match(/^>(\d+)$/);
            if (skip_number) {
                skip = Number(skip_number[1]);
                continue;
            }
            var normal = normalize(tagList[i]);
            var index = default_tags.indexOf(normal);
            if (index === 0) {
                if (util.checkAdmin(2, user)) {
                    isAdult = true;
                }
            } else if (index === 1) {
                if (util.checkAdmin(1, user)) {
                    var time = Math.round(new Date().getTime() / 1000) - handleTime;
                    console.log({mediaType: {$exists: true}, utime: {$lt: time}});
                    return {mediaType: {$exists: true}, utime: {$lt: time}};
                }
            } else if (index === 2) {
                if (util.checkAdmin(1, user)) {
                    var unDay = user.unDay? user.unDay: unactive_day;
                    var unHit = user.unHit? user.unHit: unactive_hit;
                    var time = Math.round(new Date().getTime() / 1000) - unDay * 86400;
                    console.log({count: {$lt: unHit}, utime: {$lt: time}});
                    return {count: {$lt: unHit}, utime: {$lt: time}};
                }
            } else if (index === 3) {
                if (util.checkAdmin(1, user)) {
                    var time = Math.round(new Date().getTime() / 1000) - handleTime;
                    console.log({recycle: {$ne: 0}, utime: {$lt: time}});
                    return {recycle: {$ne: 0}, utime: {$lt: time}};
                }
            } else {
                if (exactly[i]) {
                    nosql.$and.push({tags: normal});
                } else {
                    nosql.$and.push({tags: { $regex: normal }});
                }
            }
        }
        if (!util.checkAdmin(1, user)) {
            nosql.$and.push({recycle: 0});
        }
        if (isAdult) {
            nosql.$and.push({adultonly: 1});
        }
        if (!util.checkAdmin(2, user)) {
            nosql.$and.push({adultonly: 0});
        }
    }
    console.log(nosql);
    if (nosql.$and) {
        console.log(nosql.$and);
    }
    if (skip) {
        console.log('skip:' + skip);
        if (nosql.$and.length === 0) {
            nosql = {};
        }
        nosql = {skip: skip, nosql: nosql};
    }
    return nosql;
}

function getQueryTag(user, tag, del) {
    del = typeof del !== 'undefined' ? del : 1;
    var normal = normalize(tag);
    var index = default_tags.indexOf(normal);
    if (index === 0) {
        if (util.checkAdmin(2, user)) {
            return {tag: {adultonly: del}, type: 2, name: default_tags[0]};
        } else {
            return {type: 0};
        }
    } else if (index === 1 || index === 2 || index === 3) {
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
    result = result.replace(/[零一二三四五六七八九十十百佰千仟万萬0123456789]+/g, function (a) {
        return CN2ArabNum(a);
    });
    return result;
}
function CN2ArabNum(cn) {
    var cnChars = '零一二三四五六七八九',
    mulChars = '十十百佰千仟万萬',
    arab = 0, tmp = [], mul = 0, state = 0, aum = 0;
    if (!cn) {
        return 0;
    }
    cn = cn.replace(/[零一二三四五六七八九]/g, function (a) {
        return cnChars.indexOf(a);
    });
    if (cn.match(/^[十百佰千仟万萬]/)) {
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
            mul = Math.floor(((mulChars.indexOf(cn[cn.length-1])) /2) +1);
            if (mul <= state) {
                aum = aum + state;
                state = 0;
            }
            cn = cn.slice(0, -1);
        }
    }
    return arab;
}