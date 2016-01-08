var util = require("../util/utility.js");

var api = require("../models/api-tool.js");

var tagTool = require("../models/tag-tool.js")("storage");

var mime = require('../util/mime.js');

var mongo = require("../models/mongo-tool.js");

var genre_list = mime.getOptionTag('eng');

var genre_list_ch = mime.getOptionTag('cht');

var googleApi = require("../models/api-tool-google.js");

//type要補到deltag裡

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
                                    if (!list_match[1].match(/^(http|https):\/\//)) {
                                        if (list_match[1].match(/^\//)) {
                                            list_match[1] = '/' + list_match[1];
                                        } else {
                                            list_match[1] = '/' + list_match[1];
                                        }
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
                        if (err) {
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
                                tags = ['tv show', '電視劇', '影片', 'video', '台灣', '臺灣'];
                            } else if (dramaIndex === 1) {
                                tags = ['tv show', '電視劇', '影片', 'video', '大陸', '中國'];
                            } else if (dramaIndex === 2) {
                                tags = ['tv show', '電視劇', '影片', 'video', '韓國'];
                            } else if (dramaIndex === 3) {
                                tags = ['tv show', '電視劇', '影片', 'video', '日本'];
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
                                console.log('lovetv save');
                                console.log(name);
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
            case 'eztv':
            if (is_clear) {
                mongo.orig("remove", "storage", {owner: type, $isolated: 1}, function(err, item2){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log('perm external file');
                    console.log(item2);
                    eztvlist();
                });
            } else {
                eztvlist();
            }
            function eztvlist() {
                api.xuiteDownload('https://eztv.ag/showlist/', '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var raw_list = raw_data.match(/<td class="forum_thread_post"><a href="[^"]+" class="thread_link">[^<]+/g);
                    var list = [];
                    var list_match = false;
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/^<td class="forum_thread_post"><a href="([^"]+)" class="thread_link">([^<]+)$/);
                        if (list_match) {
                            if (!list_match[1].match(/^(https|http):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'https://eztv.ag' + list_match[1];
                                } else {
                                    list_match[1] = 'https://eztv.ag' + list_match[1];
                                }
                            }
                            list.push({name: list_match[2], url: list_match[1]});
                        }
                    }
                    console.log(list.length);
                    if (list.length < 1) {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    } else {
                        recur_save(type, 0, list);
                    }
                    function recur_save(type, index, list_arr) {
                        var external_item = list_arr[index];
                        var name = util.toValidName(external_item.name);
                        if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                            name = mime.addPost(name, '1');
                        }
                        mongo.orig("count", "storage", {owner: type, name: name}, {limit: 1}, function(err, count){
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (count === 0) {
                                var url = util.isValidString(external_item.url, 'url');
                                if (url === false) {
                                    util.handleError({hoerror: 2, message: "url is not vaild"}, callback, callback);
                                }
                                api.xuiteDownload(external_item.url, '', function(err, raw_data1) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    var genre = raw_data1.match(/(<br\/>|<br \/>)Genre:([^<]*)(<br\/>|<br \/>)/);
                                    if (genre) {
                                        genre = genre[2].match(/([a-zA-Z\-]+)/g);
                                    }
                                    var year = raw_data1.match(/\((\d\d\d\d)\) \- TV Show/);
                                    if (year) {
                                        year = year[1];
                                    }
                                    var imdb = raw_data1.match(/http:\/\/www\.imdb\.com\/title\/(tt\d+)\//);
                                    if (imdb) {
                                        imdb = imdb[1];
                                    }
                                    var show_name = external_item.url.match(/https:\/\/[^\/]+\/shows\/\d+\/([^\/]+)\//);
                                    if (show_name) {
                                        show_name = show_name[1].replace(/\-/g, ' ');
                                    }
                                    var oOID = mongo.objectID();
                                    var tags = [];
                                    tags = ['tv show', '電視劇', '歐美', '西洋', '影片', 'video'];
                                    var utime = Math.round(new Date().getTime() / 1000);
                                    var normal = tagTool.normalizeTag(type);
                                    if (!tagTool.isDefaultTag(normal)) {
                                        if (tags.indexOf(normal) === -1) {
                                            tags.push(normal);
                                        }
                                    }
                                    normal = tagTool.normalizeTag(name);
                                    if (!tagTool.isDefaultTag(normal)) {
                                        if (tags.indexOf(normal) === -1) {
                                            tags.push(normal);
                                        }
                                    }
                                    if (year) {
                                        normal = tagTool.normalizeTag(year);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (tags.indexOf(normal) === -1) {
                                                tags.push(normal);
                                            }
                                        }
                                    }
                                    if (imdb) {
                                        normal = tagTool.normalizeTag(imdb);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (tags.indexOf(normal) === -1) {
                                                tags.push(normal);
                                            }
                                        }
                                    }
                                    if (show_name) {
                                        normal = tagTool.normalizeTag(show_name);
                                        if (!tagTool.isDefaultTag(normal)) {
                                            if (tags.indexOf(normal) === -1) {
                                                tags.push(normal);
                                            }
                                        }
                                    }
                                    if (genre && genre.length > 0) {
                                        for (var j in genre) {
                                            normal = tagTool.normalizeTag(genre[j]);
                                            if (!tagTool.isDefaultTag(normal)) {
                                                if (tags.indexOf(normal) === -1) {
                                                    tags.push(normal);
                                                }
                                            }
                                            var gindex = genre_list.indexOf(normal);
                                            if (gindex !== -1) {
                                                normal = tagTool.normalizeTag(genre_list_ch[gindex]);
                                                if (!tagTool.isDefaultTag(normal)) {
                                                    if (tags.indexOf(normal) === -1) {
                                                        tags.push(normal);
                                                    }
                                                }
                                            }

                                        }
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
                                    data['thumb'] = 'eztv-logo-small.png';
                                    data[type] = tags;
                                    mongo.orig("insert", "storage", data, function(err, item){
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        //console.log(item);
                                        console.log('eztv save');
                                        console.log(name);
                                        index++;
                                        if (index < list_arr.length) {
                                            recur_save(type, index, list_arr);
                                        } else {
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        }
                                    });
                                }, 60000, false, false);
                            } else {
                                index++;
                                if (index < list_arr.length) {
                                    recur_save(type, index, list_arr);
                                } else {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            }
                        });
                    }
                }, 60000, false, false);
            }
            break;
            case 'kubo':
            var kubo_item = [{url: 'http://www.123kubo.com/vod-search-id-3-cid--tag--area-%E6%97%A5%E6%9C%AC-tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 50}, {url: 'http://www.123kubo.com/vod-search-id-3-cid--tag--area-%E6%AD%90%E7%BE%8E-tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-8-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-9-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-10-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-11-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-12-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-14-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-13-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-1-cid-72-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-4-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-42-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-45-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-44-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-46-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-41-cid-43-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 5}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-16-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-65-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-15-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-17-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-18-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}, {url: 'http://www.123kubo.com/vod-search-id-2-cid-66-area--tag--year--wd--actor--order-vod_hits_month%20desc-p-', page: 10}];
            if (is_clear) {
                mongo.orig("remove", "storage", {owner: type, $isolated: 1}, function(err, item2){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log('perm external file');
                    console.log(item2);
                    recur_kubolist(0, 1);
                });
            } else {
                recur_kubolist(0, 1);
            }
            function recur_kubolist(kuboIndex, page) {
                api.xuiteDownload(kubo_item[kuboIndex].url + page + '.html', '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err);
                        page = 1;
                        kuboIndex++;
                        if (kuboIndex < kubo_item.length) {
                            recur_kubolist(kuboIndex, page);
                        } else {
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        }
                    } else {
                        //console.log(raw_data);
                        var raw_list = raw_data.match(/(.*)data\-original(.*)/g);
                        var list = [];
                        var list_match = false;
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/href="([^"]+)".*data\-original="([^"]+)".*alt="([^"]+)"/);
                            if (list_match) {
                                if (!list_match[1].match(/^(https|http):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.123kubo.com' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.123kubo.com/' + list_match[1];
                                    }
                                }
                                list.push({name: list_match[3], url: list_match[1], thumb: list_match[2]});
                            }
                        }
                        //console.log(list);
                        //console.log(list.length);
                        if (list.length < 1) {
                            page++;
                            if (page < kubo_item[kuboIndex].page+1) {
                                recur_kubolist(kuboIndex, page);
                            } else {
                                page = 1;
                                kuboIndex++;
                                if (kuboIndex < kubo_item.length) {
                                    recur_kubolist(kuboIndex, page);
                                } else {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            }
                        } else {
                            recur_save(type, 0, list);
                        }
                    }
                    function recur_save(type, index, list_arr) {
                        var external_item = list_arr[index];
                        var name = util.toValidName(external_item.name);
                        if (tagTool.isDefaultTag(tagTool.normalizeTag(name))) {
                            name = mime.addPost(name, '1');
                        }
                        mongo.orig("count", "storage", {owner: type, name: name}, {limit: 1}, function(err, count){
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (count === 0) {
                                var url = util.isValidString(external_item.url, 'url');
                                if (url === false) {
                                    util.handleError({hoerror: 2, message: "url is not vaild"}, callback, callback);
                                }
                                api.xuiteDownload(external_item.url, '', function(err, raw_data1) {
                                    if (err) {
                                        util.handleError(err);
                                        console.log('kubo fail');
                                        index++;
                                        if (index < list_arr.length) {
                                            recur_save(type, index, list_arr);
                                        } else {
                                            page++;
                                            if (page < kubo_item[kuboIndex].page+1) {
                                                recur_kubolist(kuboIndex, page);
                                            } else {
                                                page = 1;
                                                kuboIndex++;
                                                if (kuboIndex < kubo_item.length) {
                                                    recur_kubolist(kuboIndex, page);
                                                } else {
                                                    setTimeout(function(){
                                                        callback(null);
                                                    }, 0);
                                                }
                                            }
                                        }
                                    } else {
                                        if (!raw_data1.match(/>(FLV|YouTube)</i)) {
                                            console.log('kubo no source');
                                            console.log(name);
                                            index++;
                                            if (index < list_arr.length) {
                                                recur_save(type, index, list_arr);
                                            } else {
                                                page++;
                                                if (page < kubo_item[kuboIndex].page+1) {
                                                    recur_kubolist(kuboIndex, page);
                                                } else {
                                                    page = 1;
                                                    kuboIndex++;
                                                    if (kuboIndex < kubo_item.length) {
                                                        recur_kubolist(kuboIndex, page);
                                                    } else {
                                                        setTimeout(function(){
                                                            callback(null);
                                                        }, 0);
                                                    }
                                                }
                                            }
                                        } else {
                                            var info = raw_data1.match(/.*<p>分類：<a.*/);
                                            var info_tag = [];
                                            if (info) {
                                                var info_list = info[0].match(/>[^<：\s]+</g);
                                                if (info_list) {
                                                    var info_match = false;
                                                    var nick_list = false;
                                                    var nick_match = false;
                                                    info_list.splice(info_list.length-1, 1);
                                                    for (var i in info_list) {
                                                        info_match = info_list[i].match(/^>([^<]+)<$/);
                                                        if (info_match) {
                                                            nick_list = info_match[1].match(/(^別名:|\/)[^\/]+/g);
                                                            if (nick_list) {
                                                                for (var j in nick_list) {
                                                                    nick_match = nick_list[j].match(/(^別名:|\/)([^\/]+)/);
                                                                    if (nick_match) {
                                                                        info_tag.push(nick_match[2]);
                                                                    }
                                                                }
                                                            } else {
                                                                info_tag.push(info_match[1]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            var oOID = mongo.objectID();
                                            var tags = [];
                                            tags = ['酷播123', '123kubo', '酷播', '影片', 'video'];
                                            if (kuboIndex === 0 || kuboIndex === 1) {
                                                tags.push('animation');
                                                tags.push('動畫');
                                            } else if (kuboIndex > 1 && kuboIndex < 10) {
                                                tags.push('movie');
                                                tags.push('電影');
                                                switch (kuboIndex) {
                                                    case 2:
                                                    tags.push('action');
                                                    tags.push('動作');
                                                    break;
                                                    case 3:
                                                    tags.push('comedy');
                                                    tags.push('喜劇');
                                                    break;
                                                    case 4:
                                                    tags.push('romance');
                                                    tags.push('浪漫');
                                                    break;
                                                    case 5:
                                                    tags.push('sci-fi');
                                                    tags.push('科幻');
                                                    break;
                                                    case 6:
                                                    tags.push('horror');
                                                    tags.push('恐怖');
                                                    break;
                                                    case 7:
                                                    tags.push('drama');
                                                    tags.push('劇情');
                                                    break;
                                                    case 8:
                                                    tags.push('war');
                                                    tags.push('戰爭');
                                                    break;
                                                    case 9:
                                                    tags.push('animation');
                                                    tags.push('動畫');
                                                    break;
                                                }
                                            } else {
                                                tags.push('tv show');
                                                tags.push('電視劇');
                                            }
                                            var utime = Math.round(new Date().getTime() / 1000);
                                            var normal = tagTool.normalizeTag(type);
                                            if (!tagTool.isDefaultTag(normal)) {
                                                if (tags.indexOf(normal) === -1) {
                                                    tags.push(normal);
                                                }
                                            }
                                            normal = tagTool.normalizeTag(name);
                                            if (!tagTool.isDefaultTag(normal)) {
                                                if (tags.indexOf(normal) === -1) {
                                                    tags.push(normal);
                                                }
                                            }
                                            for (var i in info_tag) {
                                                normal = tagTool.normalizeTag(info_tag[i]);
                                                if (!tagTool.isDefaultTag(normal)) {
                                                    if (tags.indexOf(normal) === -1) {
                                                        tags.push(normal);
                                                    }
                                                }
                                                var gindex = genre_list_ch.indexOf(normal);
                                                if (gindex !== -1) {
                                                    normal = tagTool.normalizeTag(genre_list[gindex]);
                                                    if (!tagTool.isDefaultTag(normal)) {
                                                        if (tags.indexOf(normal) === -1) {
                                                            tags.push(normal);
                                                        }
                                                    }
                                                }
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
                                            data['thumb'] = external_item.thumb;
                                            data[type] = tags;
                                            mongo.orig("insert", "storage", data, function(err, item){
                                                if(err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                //console.log(item);
                                                console.log('kubo save');
                                                console.log(name);
                                                index++;
                                                if (index < list_arr.length) {
                                                    recur_save(type, index, list_arr);
                                                } else {
                                                    page++;
                                                    if (page < kubo_item[kuboIndex].page+1) {
                                                        recur_kubolist(kuboIndex, page);
                                                    } else {
                                                        page = 1;
                                                        kuboIndex++;
                                                        if (kuboIndex < kubo_item.length) {
                                                            recur_kubolist(kuboIndex, page);
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
                                }, 60000, false, false, 'http://www.123kubo.com/');
                            } else {
                                index++;
                                if (index < list_arr.length) {
                                    recur_save(type, index, list_arr);
                                } else {
                                    page++;
                                    if (page < kubo_item[kuboIndex].page+1) {
                                        recur_kubolist(kuboIndex, page);
                                    } else {
                                        page = 1;
                                        kuboIndex++;
                                        if (kuboIndex < kubo_item.length) {
                                            recur_kubolist(kuboIndex, page);
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
                }, 60000, false, false, 'http://www.123kubo.com/');
            }
            break;
            /*case 'yify':
            if (is_clear) {
                mongo.orig("remove", "storage", {owner: type, $isolated: 1}, function(err, item2){
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log('perm external file');
                    console.log(item2);
                    yifylist();
                });
            } else {
                yifylist();
            }
            function yifylist() {
                api.xuiteDownload('http://www.dm5.com/m122029/history.ashx?cid=122029&mid=4389&page=23&uid=0&language=1', '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    console.log(raw_data);
                    //api.xuiteDownload('https://yts.ag/movie/the-animatrix-2003', '', function(err, raw_data) {
                    api.xuiteDownload('http://www.dm5.com/m122029/chapterfun.ashx?cid=122029&page=23&key=&language=1&gtk=6', '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        console.log(raw_data);
                    }, 60000, false, false, 'http://www.dm5.com/');
                }, 60000, false, false, 'http://www.dm5.com/');
            }
            break;*/
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    getSingleId: function(type, url, index, callback, pageToken, back) {
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
            var prefix = url.match(/^((http|https):\/\/[^\/]+)\//);
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
                if (!choose_url.match(/^(http|https):\/\//)) {
                    if (choose_url.match(/^\//)) {
                        choose_url = prefix + choose_url;
                    } else {
                        choose_url = prefix + choose_url;
                    }
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
            case 'eztv':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var status = raw_data.match(/Status: <b>([^<]+)<\/b>/);
                var is_end = false;
                if (!status) {
                    util.handleError({hoerror: 2, message: 'unknown status!!!'}, callback, callback);
                }
                if (status[1] === 'Ended') {
                    is_end = true;
                }
                var show_name = url.match(/https:\/\/[^\/]+\/shows\/\d+\/([^\/]+)\//);
                if (!show_name) {
                    util.handleError({hoerror: 2, message: 'unknown name!!!'}, callback, callback);
                }
                var show_name_s = show_name[1].replace(/\-/g, ' ');
                console.log(show_name_s);
                var test_list = raw_data.match(/\d+(\.\d+)? [MG]B<\/td>/g);
                var raw_list = raw_data.match(/<a href="magnet:\?xt=urn:btih:[^"]+" (target="_blank" rel="nofollow" )?class="magnet" title=".+?( Torrent:)? Magnet Link"[\s\S]+?\d+(\.\d+)? [MG]B<\/td>/g);
                var list = [];
                var list_match = false;
                var episode_match = false;
                var size_match = false;
                var season = -1;
                var size = 0;
                if (raw_list) {
                    console.log(raw_list.length);
                    if (test_list.length < 100) {
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/^<a href="(magnet:\?xt=urn:btih:[^"]+)" (target="_blank" rel="nofollow" )?class="magnet" title="(.+?)( Torrent:)? Magnet Link"[\s\S]+?(\d+(\.\d+)?) ([MG])B<\/td>/);
                            if (list_match) {
                                var episode_match = list_match[3].match(/ S?(\d+)[XE](\d+) /i);
                                if (episode_match) {
                                    if (episode_match[1].length === 1) {
                                        season = '00' + episode_match[1];
                                    } else if (episode_match[1].length === 2) {
                                        season = '0' + episode_match[1];
                                    } else {
                                        season = episode_match[1];
                                    }
                                    if (episode_match[2].length === 1) {
                                        season = season + '00' + episode_match[2];
                                    } else if (episode_match[2].length === 2) {
                                        season = season + '0' + episode_match[2];
                                    } else {
                                        season = season + episode_match[2];
                                    }
                                    if (list_match[7] === 'G') {
                                        size = Number(list_match[5])*1000;
                                    } else {
                                        size = Number(list_match[5]);
                                    }
                                    var sIndex = -1;
                                    for (var j = 0, len = list.length; j < len; j++) {
                                        if (list[j]['season'] === season) {
                                            sIndex = j;
                                            break;
                                        }
                                    }
                                    if (sIndex === -1) {
                                        for (var j = 0, len = list.length; j < len; j++) {
                                            if (list[j]['season'] > season) {
                                                list.splice(j, 0, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                                break;
                                            }
                                        }
                                        if (j === len) {
                                            list.splice(len, 0, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                        }
                                    } else {
                                        if (list[j].size <= 2000 && size <= 2000) {
                                            if (list[j].size < size) {
                                                list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                            }
                                        } else if (list[j].size > 2000 && size > 2000) {
                                            if (list[j].size > size) {
                                                list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                            }
                                        } else if (size <= 2000) {
                                            list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                        }
                                    }
                                }
                            }
                        }
                        if (!list[index-1]) {
                            util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                        }
                        var ret_obj = {index: index, showId: index, title: list[index-1].name, is_magnet: true, complete: false};
                        var encodeTorrent = util.isValidString(list[index-1].magnet, 'url');
                        if (encodeTorrent === false) {
                            util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                        }
                        mongo.orig("find", "storage", {magnet: encodeTorrent}, {limit: 1}, function(err, items){
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (items.length > 0) {
                                ret_obj['id'] = items[0]._id;
                            } else {
                                ret_obj['magnet'] = list[index-1].magnet;
                            }
                            //ret_obj['id'] = 'dri_0B2mid6JabOnnSFpYcmtSd3F5aDQ';
                            setTimeout(function(){
                                callback(null, ret_obj, is_end, list.length);
                            }, 0);
                        });
                    } else {
                        console.log('too much');
                        api.xuiteDownload('https://eztv.ag/search/' + show_name[1], '', function(err, more_data) {
                            if (err) {
                                err.hoerror = 2;
                                util.handleError(err, callback, callback);
                            }
                            var pattern = new RegExp('<a href="magnet:\\?xt=urn:btih:[^"]+" (target="_blank" rel="nofollow" )?class="magnet" title="' + show_name_s + '.+?( Torrent:)? Magnet Link"[\\s\\S]+?\\d+(\\.\\d+)? [MG]B<\\/td>', 'ig');
                            console.log(pattern);
                            var raw_list_m = more_data.match(pattern);
                            if (raw_list_m) {
                                console.log(raw_list_m.length);
                            } else {
                                console.log('more empty');
                                raw_list_m = [];
                            }
                            if (raw_list_m.length > raw_list.length) {
                                raw_list = raw_list_m;
                            }
                            for (var i in raw_list) {
                                list_match = raw_list[i].match(/^<a href="(magnet:\?xt=urn:btih:[^"]+)" (target="_blank" rel="nofollow" )?class="magnet" title="(.+?)( Torrent:)? Magnet Link"[\s\S]+?(\d+(\.\d+)?) ([MG])B<\/td>/);
                                if (list_match) {
                                    var episode_match = list_match[3].match(/ S?(\d+)[XE](\d+) /i);
                                    if (episode_match) {
                                        if (episode_match[1].length === 1) {
                                            season = '00' + episode_match[1];
                                        } else if (episode_match[1].length === 2) {
                                            season = '0' + episode_match[1];
                                        } else {
                                            season = episode_match[1];
                                        }
                                        if (episode_match[2].length === 1) {
                                            season = season + '00' + episode_match[2];
                                        } else if (episode_match[2].length === 2) {
                                            season = season + '0' + episode_match[2];
                                        } else {
                                            season = season + episode_match[2];
                                        }
                                        if (list_match[7] === 'G') {
                                            size = Number(list_match[5])*1000;
                                        } else {
                                            size = Number(list_match[5]);
                                        }
                                        var sIndex = -1;
                                        for (var j = 0, len = list.length; j < len; j++) {
                                            if (list[j]['season'] === season) {
                                                sIndex = j;
                                                break;
                                            }
                                        }
                                        if (sIndex === -1) {
                                            for (var j = 0, len = list.length; j < len; j++) {
                                                if (list[j]['season'] > season) {
                                                    list.splice(j, 0, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                                    break;
                                                }
                                            }
                                            if (j === len) {
                                                list.splice(len, 0, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                            }
                                        } else {
                                            if (list[j].size <= 2000 && size <= 2000) {
                                                if (list[j].size < size) {
                                                    list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                                }
                                            } else if (list[j].size > 2000 && size > 2000) {
                                                if (list[j].size > size) {
                                                    list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                                }
                                            } else if (size <= 2000) {
                                                list.splice(j, 1, {magnet: list_match[1], name: list_match[3], season: season, size: size});
                                            }
                                        }
                                    }
                                }
                            }
                            if (!list[index-1]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            var ret_obj = {index: index, showId: index, title: list[index-1].name, is_magnet: true, complete: false};
                            var encodeTorrent = util.isValidString(list[index-1].magnet, 'url');
                            if (encodeTorrent === false) {
                                util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                            }
                            mongo.orig("find", "storage", {magnet: encodeTorrent}, {limit: 1}, function(err, items){
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                if (items.length > 0) {
                                    ret_obj['id'] = items[0]._id;
                                } else {
                                    ret_obj['magnet'] = list[index-1].magnet;
                                }
                                setTimeout(function(){
                                    callback(null, ret_obj, is_end, list.length);
                                }, 0);
                            });
                        }, 60000, false, false);
                    }
                } else {
                    util.handleError({hoerror: 2, message: 'empty list'}, callback, callback);
                }
            }, 60000, false, false);
            break;
            case 'kubo':
            //bj58 fun58 drive youtube dl  fun23 bilibili
            //bj6 fun3 qq
            //bj5 fun1 letv
            //bj8 fun9 funshion
            //bj7 fun5 sohu
            //bj wd youku flv
            //bj10 fun8 iqiyi f4v
            //bj11 fun10 tudou flv
            //bj12 fun19 pptv x
            //bj9 fun7 pps x
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var status = raw_data.match(/連載：完結/);
                var is_end = false;
                if (status) {
                    is_end = true;
                }
                var flv_url = raw_data.match(/<a href="http:\/\/www\.123kubo\.com\/168player\/youtube\.php\?[^"]+"[^>]+>[^<]+/g);
                if (flv_url) {
                    var list = [];
                    var list_match = false;
                    var ids = false;
                    var idType = 0;
                    for (var i in flv_url) {
                        list_match = flv_url[i].match(/(168player568|type\d\d?\=)[^\&]+/g);
                        //console.log(list_match);
                        if (list_match) {
                            idType = 0;
                            for (var j in list_match) {
                                ids = list_match[j].match(/(168player568|type1\=)([^\=]+)$/);
                                if (ids) {
                                    ids = ids[2];
                                    idType = 1;
                                    break;
                                } else {
                                    ids = list_match[j].match(/type2\=([^\=]+)$/);
                                    if (ids) {
                                        ids = ids[1];
                                        idType = 2;
                                        break;
                                    } else {
                                        ids = list_match[j].match(/type17\=([^\=,]+)/);
                                        if (ids) {
                                            ids = ids[1];
                                            idType = 17;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (idType) {
                                list_match = flv_url[i].match(/[^>]+$/);
                                if (list_match) {
                                    list.push({name: list_match[0], type: idType, ids: ids.match(/[^,]+/g)});
                                }
                            }
                        }
                    }
                    //console.log(list);
                    //console.log(list.length);
                    if (!list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    if (sub_index > list[index-1].ids.length) {
                        sub_index = 1;
                    }
                    var rid = false;
                    if (list[index-1].type === 2) {
                        rid = 'dym_' + list[index-1].ids[sub_index-1];
                    } else if (list[index-1].type === 17) {
                        rid = 'bil_av' + list[index-1].ids[sub_index-1];
                    } else {
                        rid = 'you_' + list[index-1].ids[sub_index-1];
                    }
                    var ret_obj = {id: rid, title: list[index-1].name};
                    if (list[index-1].ids.length > 1) {
                        ret_obj.sub = list[index-1].ids.length;
                        index = (index*10 + sub_index)/10;
                    }
                    ret_obj.index = index;
                    ret_obj.showId = index;
                    setTimeout(function(){
                        callback(null, ret_obj, is_end, list.length);
                    }, 0);
                } else {
                    flv_url = raw_data.match(/id="\d_FLV(58|7|5|8|6|9)">[\s\S]+?href="([^"]+)/);
                    if (!flv_url) {
                        util.handleError({hoerror: 2, message: 'no source'}, callback, callback);
                    }
                    if (!flv_url[2].match(/^(https|http):\/\//)) {
                        if (flv_url[2].match(/^\//)) {
                            flv_url[2] = 'http://www.123kubo.com' + flv_url[2];
                        } else {
                            flv_url[2] = 'http://www.123kubo.com' + flv_url[2];
                        }
                    }
                    console.log(flv_url[2]);
                    api.xuiteDownload(flv_url[2], '', function(err, flv_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        var eval_data = flv_data.match(/>(eval\(.*)/);
                        if (!eval_data) {
                            util.handleError({hoerror: 2, message: 'empty list'}, callback, callback);
                        }
                        var raw_multi_list = eval(eval_data[1]);
                        var ret_obj = driveSource();
                        if (!ret_obj) {
                            ret_obj = otherSource(6);
                            if (!ret_obj) {
                                ret_obj = otherSource(5);
                                if (!ret_obj) {
                                    ret_obj = otherSource(8);
                                    if (!ret_obj) {
                                        ret_obj = otherSource(7);
                                        if (!ret_obj) {
                                            util.handleError({hoerror: 2, message: 'not flv'}, callback, callback);
                                        }
                                    }
                                }
                            }
                        }
                        setTimeout(function(){
                            callback(null, ret_obj.ret, is_end, ret_obj.total);
                        }, 0);
                        function driveSource() {
                            var flv_list = raw_multi_list.match(/"bj58".*?\}/);
                            if (!flv_list) {
                                return false;
                            }
                            var raw_list = flv_list[0].match(/\[[^\[\]]+\]/g);
                            if (!raw_list) {
                                return false;
                            }
                            var list = [];
                            var list_match = false;
                            for (var i in raw_list) {
                                list_match = raw_list[i].match(/^\["([^"]+)","fun58_([^"]+)"/);
                                if (list_match) {
                                    list.push({name: list_match[1], id: 'dri_' + list_match[2]});
                                }
                            }
                            //console.log(list);
                            //console.log(list.length);
                            if (!list[index-1]) {
                                return false;
                            }
                            return {ret: {index: index, showId: index, title: list[index-1].name, is_magnet: true, complete: false, id: list[index-1].id}, total: list.length};
                        }
                        function otherSource(source) {
                            var flv_list = false;
                            switch (source) {
                                case 7:
                                flv_list = raw_multi_list.match(/"bj7".*?\}/);
                                break;
                                case 5:
                                flv_list = raw_multi_list.match(/"bj5".*?\}/);
                                break;
                                case 8:
                                flv_list = raw_multi_list.match(/"bj8".*?\}/);
                                break;
                                case 6:
                                flv_list = raw_multi_list.match(/"bj6".*?\}/);
                                break;
                                default:
                                return false;
                                break;
                            }
                            if (!flv_list) {
                                return false;
                            }
                            var raw_list = flv_list[0].match(/\[[^\[\]]+\]/g);
                            if (!raw_list) {
                                return false;
                            }
                            var list = [];
                            var list_match = false;
                            switch (source) {
                                case 7:
                                for (var i in raw_list) {
                                    list_match = raw_list[i].match(/^\["([^"]+)","fun5_(\d+)\/([^\.]+)\.[^"]+"/);
                                    if (list_match) {
                                        list.push({name: list_match[1], id: 'soh_' + list_match[2] + '_' + list_match[3] + '_' + sub_index});
                                    }
                                }
                                break;
                                case 5:
                                for (var i in raw_list) {
                                    list_match = raw_list[i].match(/^\["([^"]+)","fun1_([^\.]+)\.[^"]+"/);
                                    if (list_match) {
                                        list.push({name: list_match[1], id: 'let_' + list_match[2]});
                                    }
                                }
                                break;
                                case 8:
                                for (var i in raw_list) {
                                    list_match = raw_list[i].match(/^\["([^"]+)","fun9_([^\.]+)\.([^"]+)"/);
                                    if (list_match) {
                                        list.push({name: list_match[1], id: 'fun_m_' + list_match[2] + '_' + list_match[3]});
                                    }
                                }
                                break;
                                case 6:
                                for (var i in raw_list) {
                                    list_match = raw_list[i].match(/^\["([^"]+)","fun3_([^\/]+)\/([^\/]+)\/([^\.]+)\.[^"]+"/);
                                    if (list_match) {
                                        list.push({name: list_match[1], id: 'vqq_' + list_match[2] + '_' + list_match[3] + '_' + list_match[4]});
                                    }
                                }
                                break;
                                default:
                                return false;
                                break;
                            }
                            //console.log(list);
                            //console.log(list.length);
                            if (!list[index-1]) {
                                return false;
                            }
                            var ret = {index: index, showId: index, title: list[index-1].name, id: list[index-1].id};
                            switch (source) {
                                case 7:
                                ret.index = ret.showId = (index*10 + sub_index)/10;
                                break;
                            }
                            return {ret: ret, total: list.length};
                        }
                    }, 60000, false, false, 'http://www.123kubo.com/');
                }
            }, 60000, false, false, 'http://www.123kubo.com/');
            break;
            case 'youtube':
            var youtube_id = false;
            youtube_id = url.match(/list=([^&]+)/);
            if (youtube_id) {
                this.youtubePlaylist(youtube_id[1], function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null, obj, false, total, obj_arr, pageN, pageP, pageToken);
                    }, 0);
                }, pageToken, back);
            } else {
                youtube_id = url.match(/v=([^&]+)/);
                var ret_obj = {id: 'you_' + youtube_id[1], index: 1, showId: 1};
                setTimeout(function(){
                    callback(null, ret_obj, false, 1);
                }, 0);
            }
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    youtubePlaylist: function(id, callback, pageToken, back) {
        var query = {id: id};
        if (pageToken) {
            query['pageToken'] = pageToken;
        }
        console.log(query);
        googleApi.googleApi('y playItem', query, function(err, vId_arr, total, nPageToken, pPageToken) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            if (total <= 0) {
                util.handleError({hoerror: 2, message: "playlist is empty"}, callback, callback);
            }
            var ret_obj = vId_arr[0];
            if (back) {
                ret_obj = vId_arr[vId_arr.length-1];
            }
            setTimeout(function(){
                callback(null, ret_obj, false, total, vId_arr, nPageToken, pPageToken, pageToken);
            }, 0);
        });
    }
};