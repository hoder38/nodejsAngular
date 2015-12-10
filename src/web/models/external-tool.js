var util = require("../util/utility.js");
var api = require("../models/api-tool.js");
var tagTool = require("../models/tag-tool.js")("storage");
var mime = require('../util/mime.js');
var mongo = require("../models/mongo-tool.js");

module.exports = {
    getList: function(type, callback, is_clear) {
        switch (type) {
            case 'lovetv':
            var dramaList = ['http://tw.lovetvshow.info/2013/05/drama-list.html', 'http://cn.lovetvshow.info/2012/05/drama-list.html', 'http://kr5.vslovetv.com/2012/04/drama-list.html', 'http://jp.jplovetv.com/2012/08/drama-list.html'];
            if (is_clear) {
                mongo.orig("remove", "storage", {owner: type, $isolated: 1}, function(err, item2){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log('perm external file');
                    console.log(item2);
                    recur_list(0);
                });
            } else {
                recur_list(0);
            }
            function recur_list(dramaIndex) {
                api.xuiteDownload(dramaList[dramaIndex], '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var raw_list = [];
                    if (dramaIndex === 0) {
                        raw_list = raw_data.match(/(<h3[^>]*><a href="[^">]+"[^>]*>[^<]+<\/a>|20\d\d台灣電視劇<\/span>)/g);
                    } else if (dramaIndex === 1) {
                        raw_list = raw_data.match(/(<h3[^>]*><a href="[^">]+"[^>]*>[^<]+<\/a>\([^\)]+\)|20\d\d大陸電視劇<\/font>)/g);
                    } else if (dramaIndex === 2) {
                        raw_list = raw_data.match(/(<h3[^>]*><a href="[^">]+"[^>]*>[^<]+<\/a>\([^\)]+\)|20\d\d韓國電視劇<\/font>)/g);
                    } else if (dramaIndex === 3) {
                        raw_list = raw_data.match(/(<h3[^>]*><a href="[^">]+"[^>]*>[^<]+<\/a>\([^\)]+\)|20\d\d日本電視劇<\/font>)/g);
                    }
                    var list = [];
                    var list_year = null;
                    var list_match = false;
                    for (var i in raw_list) {
                        if (dramaIndex === 0){
                            list_match = raw_list[i].match(/^(20\d\d)台灣電視劇<\/span>$/);
                        } else if (dramaIndex === 1) {
                            list_match = raw_list[i].match(/^(20\d\d)大陸電視劇<\/font>$/);
                        } else if (dramaIndex === 2) {
                            list_match = raw_list[i].match(/^(20\d\d)韓國電視劇<\/font>$/);
                        } else if (dramaIndex === 3) {
                            list_match = raw_list[i].match(/^(20\d\d)日本電視劇<\/font>$/);
                        }
                        if (list_match) {
                            list_year = list_match[1];
                        } else {
                            if (list_year) {
                                if (dramaIndex === 0) {
                                    list_match = raw_list[i].match(/^<h3[^>]*><a href="([^">]+)"[^>]*>([^<]+)<\/a>$/);
                                } else if (dramaIndex === 1) {
                                    list_match = raw_list[i].match(/^<h3[^>]*><a href="([^">]+)"[^>]*>([^<]+)<\/a>\(([^\)]+)\)$/);
                                } else if (dramaIndex === 2) {
                                    list_match = raw_list[i].match(/^<h3[^>]*><a href="([^">]+)"[^>]*>([^<]+)<\/a>\(([^\)]+)\)$/);
                                } else if (dramaIndex === 3) {
                                    list_match = raw_list[i].match(/^<h3[^>]*><a href="([^">]+)"[^>]*>([^<]+)<\/a>\(([^\)]+)\)$/);
                                }
                                if (list_match) {
                                    if (!list_match[1].match(/^http:\/\//)) {
                                        if (dramaIndex === 0) {
                                            list_match[1] = 'http://tw.lovetvshow.info' + list_match[1];
                                        } else if (dramaIndex === 1) {
                                            list_match[1] = 'http://cn.lovetvshow.info' + list_match[1];
                                        } else if (dramaIndex === 2) {
                                            list_match[1] = 'http://kr5.vslovetv.com' + list_match[1];
                                        } else if (dramaIndex === 3) {
                                            list_match[1] = 'http://jp.jplovetv.com' + list_match[1];
                                        }
                                    }
                                    if (list_match[3]) {
                                        list.push({name: list_match[2], type: list_match[3], year: list_year, url: list_match[1]});
                                    } else {
                                        list.push({name: list_match[2], year: list_year, url: list_match[1]});
                                    }
                                }
                            }
                        }
                    }
                    console.log(list.length);
                    if (list.length < 1) {
                        dramaIndex++;
                        if (dramaIndex < dramaList.length) {
                            recur_list(dramaIndex);
                        } else {
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        }
                    } else {
                        recur_save(type, 0, list);
                    }
                }, 60000, false, false);
                function recur_save(type, index, list_arr) {
                    var external_item = list_arr[index];
                    var name = util.toValidName(external_item.name);
                    if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                        name = mime.addPost(name, '1');
                    }
                    mongo.orig("count", "storage", {owner: type, name: name}, {limit: 1}, function(err, count){
                        if (err === false) {
                            util.handleError(err, callback, callback);
                        }
                        if (count === 0) {
                            var url = util.isValidString(external_item.url, 'url');
                            if (url === false) {
                                util.handleError({hoerror: 2, message: "url is not vaild"}, callback, callback);
                            }
                            var oOID = mongo.objectID();
                            var tags = [];
                            if (dramaIndex === 0){
                                tags = ['tv show', '電視劇', '台灣', '臺灣'];
                            } else if (dramaIndex === 1) {
                                tags = ['tv show', '電視劇', '大陸', '中國'];
                            } else if (dramaIndex === 2) {
                                tags = ['tv show', '電視劇', '韓國'];
                            } else if (dramaIndex === 3) {
                                tags = ['tv show', '電視劇', '日本'];
                            }
                            var utime = Math.round(new Date().getTime() / 1000);
                            var normal = tagTool.normalizeTag(type);
                            if (!tagTool.isDefaultTag(normal)) {
                                tags.push(normal);
                            }
                            normal = tagTool.normalizeTag(name);
                            if (!tagTool.isDefaultTag(normal)) {
                                tags.push(normal);
                            }
                            if (external_item.type) {
                                normal = tagTool.normalizeTag(external_item.type);
                                if (!tagTool.isDefaultTag(normal)) {
                                    tags.push(normal);
                                }
                            }
                            normal = tagTool.normalizeTag(external_item.year);
                            if (!tagTool.isDefaultTag(normal)) {
                                tags.push(normal);
                            }
                            var data = {};
                            data['_id'] = oOID;
                            data['name'] = name;
                            data['owner'] = type;
                            data['utime'] = utime;
                            data['url'] = url;
                            data['size'] = 0;
                            data['count'] = 0;
                            data['first'] = 1;
                            data['recycle'] = 0;
                            data['adultonly'] = 0;
                            data['untag'] = 0;
                            data['status'] = 3;//media type
                            data['tags'] = tags;
                            data['thumb'] = 'love-thumb-md.png';
                            data[type] = tags;
                            mongo.orig("insert", "storage", data, function(err, item){
                                if(err) {
                                    util.handleError(err, callback, callback);
                                }
                                //console.log(item);
                                //console.log('save end');
                                index++;
                                if (index < list_arr.length) {
                                    recur_save(type, index, list_arr);
                                } else {
                                    dramaIndex++;
                                    if (dramaIndex < dramaList.length) {
                                        recur_list(dramaIndex);
                                    } else {
                                        setTimeout(function(){
                                            callback(null);
                                        }, 0);
                                    }
                                }
                            });
                        } else {
                            index++;
                            if (index < list_arr.length) {
                                recur_save(type, index, list_arr);
                            } else {
                                dramaIndex++;
                                if (dramaIndex < dramaList.length) {
                                    recur_list(dramaIndex);
                                } else {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            }
                        }
                    });
                }
            }
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    getSingleId: function(type, url, index, callback) {
        if (index < 1) {
            util.handleError({hoerror: 2, message: 'index must > 1'}, callback, callback);
        }
        var sub_index = (+index)*10%10;
        if (sub_index === 0) {
            sub_index++;
        }
        index = Math.floor(+index);
        switch (type) {
            case 'lovetv':
            var prefix = url.match(/^(http:\/\/[^\/]+)\//);
            if (!prefix) {
                util.handleError({hoerror: 2, message: 'invaild url'}, callback, callback);
            }
            prefix = prefix[1];
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<td><h3[^>]*><a href="[^>"]+">[^<]+Ep\d+<\/a><\/h3>/g);
                if (!raw_list[index-1]) {
                    util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                }
                var list_match = raw_list[raw_list.length - index].match(/^<td><h3[^>]*><a href="([^>"]+)">([^<]+)Ep\d+<\/a><\/h3>$/);
                if (!list_match) {
                    util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                }
                var choose_url = list_match[1];
                var is_end = false;
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/^<td><h3[^>]*><a href="[^>"]+">[^<]+大結局[^<]+<\/a><\/h3>$/);
                    if (list_match) {
                        is_end = true;
                        break;
                    }
                }
                if (!choose_url.match(/^http:\/\//)) {
                    choose_url = prefix + choose_url;
                }
                api.xuiteDownload(choose_url, '', function(err, raw_single) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var choose = 0;
                    var result = [];
                    var s = raw_single.match(/<div id="video_type"[^>]*>(\d+)<\/div>/);
                    var ids = raw_single.match(/<div id="video_ids"[^>]*>([^<]+)<\/div>/);
                    if (s && ids) {
                        ids = ids[1].match(/[^,]+/g);
                        if (ids.length > 0) {
                            result.push({s: Number(s[1]), ids: ids});
                        }
                    }
                    s = raw_single.match(/<div id="video_type_s2"[^>]*>(\d+)<\/div>/);
                    ids = raw_single.match(/<div id="video_ids_s2"[^>]*>([^<]+)<\/div>/);
                    if (s && ids) {
                        ids = ids[1].match(/[^,]+/g);
                        if (ids.length > 0) {
                            result.push({s: Number(s[1]), ids: ids});
                        }
                    }
                    s = raw_single.match(/<div id="video_type_s3"[^>]*>(\d+)<\/div>/);
                    ids = raw_single.match(/<div id="video_ids_s3"[^>]*>([^<]+)<\/div>/);
                    if (s && ids) {
                        ids = ids[1].match(/[^,]+/g);
                        if (ids.length > 0) {
                            result.push({s: Number(s[1]), ids: ids});
                        }
                    }
                    var obj = null;
                    for (var i in result) {
                        if (!obj) {
                            if (result[i].s === 2 && result[i].ids.length > 0) {
                                obj = result[i];
                            }
                        } else {
                            if (result[i].s === 2 && result[i].ids.length > 0 && obj.ids.length > result[i].ids.length) {
                                obj = result[i];
                            }
                        }
                    }
                    if (!obj) {
                        util.handleError({hoerror: 2, message: 'no source'}, callback, callback);
                    }
                    if (sub_index > obj.ids.length) {
                        sub_index = 1;
                    }
                    var ret_obj = {id: 'dym_' + obj.ids[sub_index-1]};
                    if (obj.ids.length > 1) {
                        index = (index*10 + sub_index)/10;
                        ret_obj.sub = obj.ids.length;
                    }
                    ret_obj.index = index;
                    ret_obj.showId = index;
                    setTimeout(function(){
                        callback(null, ret_obj, is_end, raw_list.length);
                    }, 0);
                }, 60000, false, false);
            }, 60000, false, false);
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    }
};