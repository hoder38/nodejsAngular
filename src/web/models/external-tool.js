var util = require("../util/utility.js");

var api = require("../models/api-tool.js");

var tagTool = require("../models/tag-tool.js")("storage");

var mime = require('../util/mime.js');

var mongo = require("../models/mongo-tool.js");

var genre_list = mime.getOptionTag('eng');

var genre_list_ch = mime.getOptionTag('cht');

var trans_list = mime.getOptionTag('trans');

var trans_list_ed = mime.getOptionTag('transed');

var game_list = mime.getOptionTag('game');

var game_list_ch = mime.getOptionTag('gamech');

var music_list = mime.getOptionTag('music');

var music_list_web = mime.getOptionTag('musicweb');

var googleApi = require("../models/api-tool-google.js");

var kubo_type = [['動作片', '喜劇片', '愛情片', '科幻片', '恐怖片', '劇情片', '戰爭片', '動畫片', '微電影'], ['台灣劇', '港劇', '大陸劇', '歐美劇', '韓劇', '日劇', '新/馬/泰/其他劇', '布袋戲', '綜藝', '美食旅遊', '訪談節目', '男女交友', '選秀競賽', '典禮晚會', '新聞時事', '投資理財', '歌劇戲曲'], ['動漫', '電影動畫片']];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthNameShorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var comic99_pre = ['http://99.1112223333.com/dm01/', 'http://99.1112223333.com/dm02/', 'http://99.1112223333.com/dm03/', 'http://99.1112223333.com/dm04/', 'http://99.1112223333.com/dm05/', 'http://99.1112223333.com/dm06/', 'http://99.1112223333.com/dm07/', 'http://99.1112223333.com/dm08/', 'http://99.1112223333.com/dm09/', 'http://99.1112223333.com/dm10/', 'http://99.1112223333.com/dm11/', 'http://99.1112223333.com/dm12/', 'http://99.1112223333.com/dm13/', 'http://173.231.57.238/dm14/', 'http://99.1112223333.com/dm15/', 'http://142.4.34.102/dm16/'];
var OpenCC = require('opencc'),
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    path = require('path');
var opencc = new OpenCC('s2t.json');
var cache_expire = 86400;
//type要補到deltag裡
module.exports = {
    getSingleList: function(type, url, callback, post) {
        switch (type) {
            case 'kubo':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/(.*)data\-original[\s\S]+?更新：\d\d\d\d-\d\d-\d\d/g);
                var list = [];
                var list_match = false;
                var item_match = false;
                var data = null;
                var tags = [];
                var act_match = false;
                if (raw_list) {
                    var type_id = url.match(/vod-search-id-(\d+)/);
                    if (!type_id) {
                        util.handleError({hoerror: 2, message: 'unknown kubo type'}, callback, callback);
                    }
                    type_id = type_id[1];
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/href=".*-(\d+)\.html".*data\-original="([^"]+)".*alt="([^"]+)"/);
                        if (list_match) {
                            data = {name: list_match[3], id: list_match[1], thumb: list_match[2]};
                            if (type_id === '1') {
                                tags = ['電影', 'movie'];
                            } else if (type_id === '3') {
                                tags = ['動畫', 'animation'];
                            } else {
                                tags = ['電視劇', 'tv show'];
                            }
                            item_match = raw_list[i].match(/地區\/年份：(.*)\/(\d+)/);
                            if (item_match) {
                                if (tags.indexOf(item_match[1]) === -1) {
                                    tags.push(item_match[1]);
                                }
                                if (tags.indexOf(item_match[2]) === -1) {
                                    tags.push(item_match[2]);
                                }
                            }
                            item_match = raw_list[i].match(/主演：(.*)<\/p>/);
                            if (item_match) {
                                act_match = item_match[0].match(/>[^<>]+<\/a/g);
                                if (act_match) {
                                    for (var j in act_match) {
                                        item_match = act_match[j].match(/>([^<>]+)<\/a/);
                                        if (item_match) {
                                            if (tags.indexOf(item_match[1]) === -1) {
                                                tags.push(item_match[1]);
                                            }
                                        }
                                    }
                                }
                            }
                            data['tags'] = tags;
                            item_match = raw_list[i].match(/月熱度：(\d+)/);
                            if (item_match) {
                                data['count'] = Number(item_match[1]);
                            } else {
                                data['count'] = 0;
                            }
                            item_match = raw_list[i].match(/更新：(\d\d\d\d-\d\d-\d\d)/);
                            if (item_match) {
                                data['date'] = item_match[1];
                            } else {
                                data['date'] = '1970-01-01';
                            }
                            list.push(data);
                        }
                    }
                } else {
                    raw_list = raw_data.match(/\.html"><img src="[\s\S]+?\d\d:\d\d<\/cite>/g);
                    if (raw_list) {
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/<img src="([^"]+)"/);
                            if (list_match) {
                                data = {thumb: list_match[1]};
                                list_match = raw_list[i].match(/vod-read-id-(\d+).html">(.*?)\-([^\-]+?)<\/a>/);
                                if (list_match) {
                                    data['id'] = list_match[1];
                                    data['name'] = list_match[2].replace(/<\/?b>/g, '');
                                    tags = [list_match[3]];
                                    for (var j in kubo_type) {
                                        if (kubo_type[j].indexOf(list_match[3]) !== -1) {
                                            if (j === '2') {
                                                if (tags.indexOf('animation') === -1) {
                                                    tags.push('animation');
                                                }
                                                if (tags.indexOf('動畫') === -1) {
                                                    tags.push('動畫');
                                                }
                                            } else if (j === '0') {
                                                if (tags.indexOf('movie') === -1) {
                                                    tags.push('movie');
                                                }
                                                if (tags.indexOf('電影') === -1) {
                                                    tags.push('電影');
                                                }
                                                switch (kubo_type[j].indexOf(list_match[3])) {
                                                    case 0:
                                                    if (tags.indexOf('action') === -1) {
                                                        tags.push('action');
                                                    }
                                                    if (tags.indexOf('動作') === -1) {
                                                        tags.push('動作');
                                                    }
                                                    break;
                                                    case 1:
                                                    if (tags.indexOf('comedy') === -1) {
                                                        tags.push('comedy');
                                                    }
                                                    if (tags.indexOf('喜劇') === -1) {
                                                        tags.push('喜劇');
                                                    }
                                                    break;
                                                    case 2:
                                                    if (tags.indexOf('romance') === -1) {
                                                        tags.push('romance');
                                                    }
                                                    if (tags.indexOf('浪漫') === -1) {
                                                        tags.push('浪漫');
                                                    }
                                                    break;
                                                    case 3:
                                                    if (tags.indexOf('sci-fi') === -1) {
                                                        tags.push('sci-fi');
                                                    }
                                                    if (tags.indexOf('科幻') === -1) {
                                                        tags.push('科幻');
                                                    }
                                                    break;
                                                    case 4:
                                                    if (tags.indexOf('horror') === -1) {
                                                        tags.push('horror');
                                                    }
                                                    if (tags.indexOf('恐怖') === -1) {
                                                        tags.push('恐怖');
                                                    }
                                                    break;
                                                    case 5:
                                                    if (tags.indexOf('drama') === -1) {
                                                        tags.push('drama');
                                                    }
                                                    if (tags.indexOf('劇情') === -1) {
                                                        tags.push('劇情');
                                                    }
                                                    break;
                                                    case 6:
                                                    if (tags.indexOf('war') === -1) {
                                                        tags.push('war');
                                                    }
                                                    if (tags.indexOf('戰爭') === -1) {
                                                        tags.push('戰爭');
                                                    }
                                                    break;
                                                    case 7:
                                                    if (tags.indexOf('animation') === -1) {
                                                        tags.push('animation');
                                                    }
                                                    if (tags.indexOf('動畫') === -1) {
                                                        tags.push('動畫');
                                                    }
                                                    break;
                                                }
                                            } else if (j === '1') {
                                                if (tags.indexOf('tv show') === -1) {
                                                    tags.push('tv show');
                                                }
                                                if (tags.indexOf('電視劇') === -1) {
                                                    tags.push('電視劇');
                                                }
                                            }
                                        }
                                    }
                                    item_match = raw_list[i].match(/地區:<a[^>]+>([^<]+)/);
                                    if (item_match) {
                                        if (tags.indexOf(item_match[1]) === -1) {
                                            tags.push(item_match[1]);
                                        }
                                    }
                                    item_match = raw_list[i].match(/年份:<a[^>]+>(\d+)/);
                                    if (item_match) {
                                        if (tags.indexOf(item_match[1]) === -1) {
                                            tags.push(item_match[1]);
                                        }
                                    }
                                    item_match = raw_list[i].match(/演出:(.*)/);
                                    if (item_match) {
                                        act_match = item_match[0].match(/>[^<>]+<\/a/g);
                                        if (act_match) {
                                            for (var j in act_match) {
                                                item_match = act_match[j].match(/>([^<>]+)<\/a/);
                                                if (item_match) {
                                                    if (tags.indexOf(item_match[1]) === -1) {
                                                        tags.push(item_match[1]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    data['tags'] = tags;
                                    item_match = raw_list[i].match(/月熱度:(\d+)/);
                                    if (item_match) {
                                        data['count'] = Number(item_match[1]);
                                    } else {
                                        data['count'] = 0;
                                    }
                                    item_match = raw_list[i].match(/更新時間:(\d\d\d\d)年(\d\d)月(\d\d)日/);
                                    if (item_match) {
                                        data['date'] = item_match[1] + '-' + item_match[2] + '-' + item_match[3];
                                    } else {
                                        data['date'] = '1970-01-01';
                                    }
                                }
                            }
                            list.push(data);
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false, 'http://www.123kubo.com/');
            break;
            case 'yify':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var json_data = null;
                try {
                    json_data = JSON.parse(raw_data);
                } catch (x) {
                    console.log(raw_data);
                    util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                }
                if (json_data['status'] !== 'ok' || !json_data['data']) {
                    util.handleError({hoerror: 2, message: 'yify api fail'}, callback, callback);
                }
                var list = [];
                var data = null;
                var tags = [];
                var genre_item = null;
                if (json_data['data']['movies']) {
                    for (var i in json_data['data']['movies']) {
                        data = {name: json_data['data']['movies'][i]['title'], id: json_data['data']['movies'][i]['id'], thumb: json_data['data']['movies'][i]['small_cover_image'], date: json_data['data']['movies'][i]['year'] + '-01-01', rating: json_data['data']['movies'][i]['rating'], };
                        tags = ['movie', '電影'];
                        if (tags.indexOf(json_data['data']['movies'][i]['year'].toString()) === -1) {
                            tags.push(json_data['data']['movies'][i]['year'].toString());
                        }
                        for (var j in json_data['data']['movies'][i]['genres']) {
                            genre_item = tagTool.normalizeTag(json_data['data']['movies'][i]['genres'][j]);
                            if (genre_list.indexOf(genre_item) !== -1) {
                                if (tags.indexOf(genre_item) === -1) {
                                    tags.push(genre_item);
                                }
                                if (tags.indexOf(genre_list_ch[genre_list.indexOf(genre_item)]) === -1) {
                                    tags.push(genre_list_ch[genre_list.indexOf(genre_item)]);
                                }
                            }
                        }
                        data['tags'] = tags;
                        list.push(data);
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false, 'https://yts.ag/');
            break;
            case 'cartoonmad':
            if (post) {
                api.madComicSearch(url, post, function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var comic_data = raw_data.match(/<span class="covertxt">.*/);
                    var list = [];
                    if (comic_data) {
                        var raw_list = comic_data[0].match(/<a href=.*?.jpg/g);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'unknown comic type'}, callback, callback);
                        }
                        list = [];
                        var list_match = false;
                        var tags = [];
                        var data = null;
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/(\d+).*?title="([^"]+)".*?src="(.*)$/);
                            if (list_match) {
                                data = {id: list_match[1], name: list_match[2], thumb: list_match[3]};
                                tags = ['漫畫', 'comic'];
                                data['tags'] = tags;
                                list.push(data);
                            }
                        }
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                });
            } else {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var comic_data = raw_data.match(/<span class="covertxt">.*/);
                    var raw_list = comic_data[0].match(/<a href=.*?.jpg/g);
                    var list = [];
                    var list_match = false;
                    var tags = [];
                    var data = null;
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/(\d+).*?title="([^"]+)".*?src="(.*)$/);
                        if (list_match) {
                            data = {id: list_match[1], name: list_match[2], thumb: list_match[3]};
                            tags = ['漫畫', 'comic'];
                            data['tags'] = tags;
                            list.push(data);
                        }
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }, 60000, false, false, 'http://www.cartoonmad.com/', true);
            }
            break;
            case 'comic99':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var list = [];
                var comic_data = raw_data.match(/<ul class="hd-txt TopList_11">[\s\S]+?<\/ul>/);
                if (comic_data) {
                    var raw_list = comic_data[0].match(/<a href=[^>]+><[^>]+>/g);
                    var list_match = false;
                    var tags = [];
                    var data = null;
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/href='\/comic\/(\d+)\/' title='([^']+)'.*src='([^']+)'/);
                        if (list_match) {
                            data = {id: list_match[1], name: list_match[2], thumb: list_match[3]};
                            tags = ['漫畫', 'comic'];
                            data['tags'] = tags;
                            list.push(data);
                        }
                    }
                } else {
                    comic_data = raw_data.match(/<div class='cListSlt'>.*/);
                    if (comic_data[0]) {
                        var raw_list = comic_data[0].match(/<div class='cListSlt'>.*?<div class='cListh2'>/g);
                        var list_match = false;
                        var tags = [];
                        var data = null;
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/href='\/comic\/(\d+)\/'><img src='([^']+)'/);
                            if (list_match) {
                                data = {id: list_match[1], thumb: list_match[2]};
                                list_match = raw_list[i].match(/<div class='cListTitle'><[^>]+>(.*?)<span class='clw/);
                                if (list_match) {
                                    data['name'] = list_match[1].replace(/<[^<]+>/g,'');
                                    tags = ['漫畫', 'comic'];
                                    list_match = raw_list[i].match(/<span class='cl1_1'>漫畫類型：<[^>]+>([^<]+)<\/a><\/span><span class='cl1_2'>漫畫作者：([^<]+)/);
                                    if (list_match) {
                                        if (trans_list.indexOf(list_match[1]) !== -1) {
                                            tags.push(trans_list_ed[trans_list.indexOf(list_match[1])]);
                                        } else {
                                            tags.push(list_match[1]);
                                        }
                                        tags.push(list_match[2]);
                                    }
                                    data['tags'] = tags;
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false, 'http://www.99comic.com/');
            break;
            case 'bilibili':
            if (url.match(/(https|http):\/\/www\.bilibili\.com\/list\//)) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var list = [];
                    var data = null;
                    var tags = [];
                    var info_match = false;
                    var raw_list = raw_data.match(/class="l-item">[\s\S]+?<span number="\d+/g);
                    if (raw_list) {
                        var bDate = new Date('1970-01-01');
                        bDate = bDate.getTime()/1000;
                        for (var i in raw_list) {
                            info_match = raw_list[i].match(/a href="\/video\/(av\d+).*?title="([^"]+)">.*?"([^"]+)/);
                            if (info_match) {
                                data = {id: info_match[1], name: opencc.convertSync(info_match[2]), thumb: info_match[3], date: bDate};
                                info_match = raw_list[i].match(/<span number="(\d+)/);
                                if (info_match) {
                                    data['count'] = Number(info_match[1]);
                                } else {
                                    data['count'] = 0;
                                }
                                tags = ['movie', '電影'];
                                data['tags'] = tags;
                                list.push(data);
                            }
                        }
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }, 60000, false, false, 'http://www.bilibili.com/');
            } else if (url.match(/(https|http):\/\/www\.bilibili\.com\//)) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var json_data = null;
                    try {
                        json_data = JSON.parse(raw_data);
                    } catch (x) {
                        console.log(raw_data);
                        util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                    }
                    if (!json_data || json_data['message'] !== 'success' || !json_data['result'] || !json_data['result']['list']) {
                        console.log(raw_data);
                        util.handleError({hoerror: 2, message: 'bilibili api fail'}, callback, callback);
                    }
                    var list = [];
                    var data = null;
                    var tags = [];
                    for (var i in json_data['result']['list']) {
                        data = {id: json_data['result']['list'][i]['season_id'], name: opencc.convertSync(json_data['result']['list'][i]['title']), thumb: json_data['result']['list'][i]['cover'], date: json_data['result']['list'][i]['pub_time'], count: 0};
                        tags = ['animation', '動畫'];
                        data['tags'] = tags;
                        list.push(data);
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }, 60000, false, false, 'http://www.bilibili.com/');
            } else {
                api.xuiteDownload(url, '', function(err, json_data_r) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var json_data = null;
                    try {
                        json_data = JSON.parse(json_data_r);
                    } catch (x) {
                        console.log(json_data_r);
                        util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                    }
                    var list = [];
                    if (json_data['html']) {
                        var raw_data = json_data['html'];
                        var raw_list = raw_data.match(/<img src="[\s\S]+?<span class="year">[\s\S]+?\(\d\d\d\d\)/g);
                        var data = null;
                        var tags = [];
                        var info_match = false;
                        var info_item = null;
                        if (raw_list) {
                            for (var i in raw_list) {
                                info_match = raw_list[i].match(/href="[^\d]+(\d+)\/"[^>]*>[\s]+(.*)/);
                                if (info_match) {
                                    info_item = info_match[2].replace(/<[^<]+>/g,'');
                                    data = {id: info_match[1], name: opencc.convertSync(info_item.trim()), count: 0};
                                    info_match = raw_list[i].match(/<img src="([^"]+)/);
                                    if (info_match) {
                                        data['thumb'] = info_match[1];
                                        info_match = raw_list[i].match(/\((\d\d\d\d)/);
                                        if (info_match) {
                                            info_item = new Date(info_match[1] + '-01-01');
                                            data['date'] = info_item.getTime()/1000;
                                            tags = ['animation', '動畫'];
                                            if (tags.indexOf(info_match[1]) === -1) {
                                                tags.push(info_match[1]);
                                            }
                                            data['tags'] = tags;
                                            list.push(data);
                                        }
                                    }
                                }
                            }
                        } else {
                            raw_list = raw_data.match(/<img src="[\s\S]+?<i class="icon-playtime"[\s\S]+?(\d+(\.\d+)?万?|--)/g);
                            if (raw_list) {
                                var bDate = new Date('1970-01-01');
                                bDate = bDate.getTime()/1000;
                                for (var i in raw_list) {
                                    info_match = raw_list[i].match(/href="[^"]+?(av\d+)/);
                                    if (info_match) {
                                        data = {id: info_match[1], date: bDate};
                                        info_match = raw_list[i].match(/<img src="([^"]+)".*?title="([^"]+)/);
                                        if (info_match) {
                                            data['name'] = opencc.convertSync(info_match[2]);
                                            data['thumb'] = info_match[1];
                                            info_match = raw_list[i].match(/((\d+)(\.\d+)?(万)?|--)$/);
                                            if (info_match && info_match[2]) {
                                                info_item = info_match[2];
                                                if (info_match[3]) {
                                                    info_item = info_item + info_match[3];
                                                }
                                                info_item = Number(info_item);
                                                if (info_match[4]) {
                                                    info_item = Math.round(info_item * 10000);
                                                }
                                                data['count'] = info_item;
                                            } else {
                                                data['count'] = 0;
                                            }
                                            tags = ['movie', '電影'];
                                            data['tags'] = tags;
                                            list.push(data);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }, 60000, false, false, 'http://www.bilibili.com/');
            }
            break;
            case 'bls':
            url = 'http://www.bls.gov/bls/newsrels.htm#latest-releases';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = '/' + date.getFullYear();
                if (date.getDate() < 10) {
                    docDate = '/0' + date.getDate() + docDate;
                } else {
                    docDate = '/' + date.getDate() + docDate;
                }
                if (date.getMonth()+1 < 10) {
                    docDate = '0'+ (date.getMonth()+1) + docDate;
                } else {
                    docDate = (date.getMonth()+1) + docDate;
                }
                console.log(docDate);
                var raw_list = raw_data.match(/<h2 id="latest-releases">LATEST RELEASES<\/h2>[\s\S]+?<\/ul>/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find bls latest'}, callback, callback);
                }
                raw_list = raw_list[0].match(/href="[^"]+">[^<]+<\/a> \d\d\/\d\d\/\d\d\d\d/g);
                var list = [];
                var list_match = false;
                if (raw_list) {
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/^href="([^"]+)">([^<]+)<\/a> (\d\d\/\d\d\/\d\d\d\d)$/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://www.bls.gov' + list_match[1];
                                } else {
                                    list_match[1] = 'http://www.bls.gov/' + list_match[1];
                                }
                            }
                            if (docDate === list_match[3]) {
                                list.push({url: list_match[1], name: util.toValidName(list_match[2]), date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()});
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'cen':
            url = 'http://www.census.gov/economic-indicators/';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<h3>[\s\S]+?<strong>Next Release:/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find census latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/<a href="([^"]+)" title="Download: (.*?) in PDF">/);
                    if (list_match) {
                        if (!list_match[1].match(/^(http|https):\/\//)) {
                            if (list_match[1].match(/^\//)) {
                                list_match[1] = 'http://www.census.gov' + list_match[1];
                            } else {
                                list_match[1] = 'http://www.census.gov/' + list_match[1];
                            }
                        }
                        data = {url: list_match[1], name: util.toValidName(list_match[2])};
                        list_match = raw_list[i].match(/<span class="release_date">([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                        if (list_match) {
                            if (docDate === list_match[1]) {
                                data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                                list.push(data);
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'bea':
            url = 'http://www.bea.gov/';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/class="first"[\s\S]+?class="releaseFooter"/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find bea latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                console.log(docDate);
                list_match = raw_list[0].match(/class="first" href="([^"]+)/);
                if (list_match) {
                    if (!list_match[1].match(/^(http|https):\/\//)) {
                        if (list_match[1].match(/^\//)) {
                            list_match[1] = 'http://www.bea.gov' + list_match[1];
                        } else {
                            list_match[1] = 'http://www.bea.gov/' + list_match[1];
                        }
                    }
                    data = {url: list_match[1]};
                    list_match = raw_list[0].match(/<li>([^<]+)/);
                    if (list_match) {
                        data['name'] = util.toValidName(list_match[1]);
                        list_match = raw_list[0].match(/class="date"><span>(\d\d?\/\d\d?\/\d\d\d\d)/);
                        if (list_match) {
                            if (list_match[1] === docDate) {
                                data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                                list.push(data);
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'ism':
            url = 'https://www.instituteforsupplymanagement.org/ISMReport/PastRob.cfm';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<h4>Manufacturing<\/h4>[\s\S]+?<\/li>/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find bea latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
                console.log(docDate);
                list_match = raw_list[0].match(/href="([^"]+)">[a-zA-Z]+ Report<\/a> \(released ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                if (list_match) {
                    if (!list_match[1].match(/^(http|https):\/\//)) {
                        if (list_match[1].match(/^\//)) {
                            list_match[1] = 'https://www.instituteforsupplymanagement.org' + list_match[1];
                        } else {
                            list_match[1] = 'https://www.instituteforsupplymanagement.org/' + list_match[1];
                        }
                    }
                    data = {url: list_match[1], name: util.toValidName('Manufacturing ISM')};
                    if (docDate === list_match[2]) {
                        data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                        list.push(data);
                    }
                }
                raw_list = raw_data.match(/<h4>Non-Manufacturing<\/h4>[\s\S]+?<\/li>/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find ism latest'}, callback, callback);
                }
                list_match = raw_list[0].match(/href="([^"]+)">[a-zA-Z]+ Report<\/a> \(released ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                if (list_match) {
                    if (!list_match[1].match(/^(http|https):\/\//)) {
                        if (list_match[1].match(/^\//)) {
                            list_match[1] = 'https://www.instituteforsupplymanagement.org' + list_match[1];
                        } else {
                            list_match[1] = 'https://www.instituteforsupplymanagement.org/' + list_match[1];
                        }
                    }
                    data = {url: list_match[1], name: util.toValidName('Non-Manufacturing ISM')};
                    if (docDate === list_match[2]) {
                        data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                        list.push(data);
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'cbo':
            url = 'https://www.conference-board.org/data/consumerconfidence.cfm';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/class="date">(\d\d? [a-zA-Z][a-zA-Z][a-zA-Z]\. \d\d\d\d)/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find cbo latest'}, callback, callback);
                }
                var list = [];
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getDate() + ' ' + monthNameShorts[date.getMonth()]+'. '+date.getFullYear();
                console.log(docDate);
                if (raw_list[1] === docDate) {
                    list.push({url: 'https://www.conference-board.org/data/consumerconfidence.cfm', name: util.toValidName('Consumer Confidence Survey'), date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()});
                }
                url = 'https://www.conference-board.org/data/bcicountry.cfm?cid=1';
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    docDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                    console.log(docDate);
                    raw_list = raw_data.match(/class="date">Released: [a-zA-Z]+, ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find cbo latest'}, callback, callback);
                    }
                    if (raw_list[1] === docDate) {
                        list.push({url: 'https://www.conference-board.org/data/bcicountry.cfm?cid=1', name: util.toValidName('US Business Cycle Indicators'), date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()});
                    }
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }, 60000, false, false);
            }, 60000, false, false);
            break;
            case 'sem':
            url = 'http://www.semi.org/en/NewsFeeds/SEMIHighlights/index.rss';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<item>[\s\S]+?<\/item>/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find sem latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getDate() + ' ' + monthNameShorts[date.getMonth()] + ' ' + date.getFullYear();
                if (date.getDate() < 10) {
                    docDate = '0' + docDate;
                }
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/<title>([^<]+)/);
                    if (list_match) {
                        data = {name: util.toValidName(list_match[1])};
                        list_match = raw_list[i].match(/<link>([^<]+)/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://www.semi.org' + list_match[1];
                                } else {
                                    list_match[1] = 'http://www.semi.org/' + list_match[1];
                                }
                            }
                            data['url'] = list_match[1];
                            list_match = raw_list[i].match(/<pubDate>[a-zA-Z][a-zA-Z][a-zA-Z], (\d\d [a-zA-Z][a-zA-Z][a-zA-Z] \d\d\d\d)/);
                            if (list_match) {
                                if (list_match[1] === docDate) {
                                    data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'oec':
            url = 'http://www.oecd.org/newsroom/';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<span>Monthly<br>Statistics[\s\S]+?<li class="morebttm more">/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find oec latest'}, callback, callback);
                }
                raw_list = raw_list[0].match(/<li class='news-event-item linked[\s\S]+?<\/li>/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find oec latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/class="block-date">(\d\d? [a-zA-Z]+ \d\d\d\d)/);
                    if (list_match) {
                        if (list_match[1] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[i].match(/href="([^"]+)">([^<]+)/);
                            if (list_match) {
                                if (!list_match[1].match(/^(http|https):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.oecd.org' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.oecd.org/' + list_match[1];
                                    }
                                    data['url'] = list_match[1];
                                    data['name'] = util.toValidName(list_match[2]);
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'dol':
            url = 'http://www.dol.gov/newsroom/releases';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/.+Unemployment Insurance Weekly Claims Report.+/);
                var list = [];
                if (raw_list) {
                    var list_match = false;
                    var data = null;
                    var date = new Date();
                    date = new Date(new Date(date).setDate(date.getDate()-1));
                    var docDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                    console.log(docDate);
                    list_match = raw_list[0].match(/class="date-display-single">[a-zA-Z]+, ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                    if (list_match) {
                        if (list_match[1] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[0].match(/href="([^"]+)">([^<]+)/);
                            if (list_match) {
                                if (!list_match[1].match(/^(http|https):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.dol.gov' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.dol.gov/' + list_match[1];
                                    }
                                    data['url'] = list_match[1];
                                    data['name'] = util.toValidName(list_match[2]);
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'rea':
            url = 'http://www.realtor.org/topics/existing-home-sales';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/(\d\d\d\d-\d\d-\d\d)\.xls">View supplemental market data/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find rea latest'}, callback, callback);
                }
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getFullYear() + '-';
                if (date.getMonth()+1 < 10) {
                    docDate = docDate + '0' + (date.getMonth()+1) + '-';
                } else {
                    docDate = docDate + (date.getMonth()+1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                console.log(docDate);
                var list = [];
                if (docDate === raw_list[1]) {
                    raw_list = raw_data.match(/href="([^"]+)">Read the full news release/);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                    }
                    if (!raw_list[1].match(/^(http|https):\/\//)) {
                        if (raw_list[1].match(/^\//)) {
                            raw_list[1] = 'http://www.realtor.org' + raw_list[1];
                        } else {
                            raw_list[1] = 'http://www.realtor.org/' + raw_list[1];
                        }
                    }
                    list.push({url: raw_list[1], name: util.toValidName('Existing-Home Sales'), date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()});
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'sca':
            url = 'http://press.sca.isr.umich.edu/press/press_release';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/class="list">[\s\S]+?<\/li>/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find sca latest'}, callback, callback);
                }
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                console.log(docDate);
                var list = [];
                var list_match = false;
                var data = null;
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/href="([^"]+)/);
                    if (list_match) {
                        if (!list_match[1].match(/^(http|https):\/\//)) {
                            if (list_match[1].match(/^\//)) {
                                list_match[1] = 'http://press.sca.isr.umich.edu' + list_match[1];
                            } else {
                                list_match[1] = 'http://press.sca.isr.umich.edu/' + list_match[1];
                            }
                        }
                        data = {url: list_match[1]};
                        list_match = raw_list[i].match(/\(released ([a-zA-Z]+)[\s]+(\d\d?, \d\d\d\d)/);
                        if (list_match) {
                            if (list_match[1] + ' ' + list_match[2] === docDate) {
                                data['date'] = (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear();
                                data['name'] = util.toValidName('Michigan Consumer Sentiment Index');
                                list.push(data);
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'fed':
            url = 'http://www.federalreserve.gov/feeds/speeches_and_testimony.xml';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<item [\s\S]+?<\/item>/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find fed latest'}, callback, callback);
                }
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getFullYear() + '-';
                if (date.getMonth() + 1 < 10) {
                    docDate = docDate + '0' + (date.getMonth() + 1) + '-';
                } else {
                    docDate = docDate + (date.getMonth() + 1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                var list = [];
                var list_match = false;
                var data = null;
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/<dc:date>(\d\d\d\d-\d\d-\d\d)/);
                    if (list_match) {
                        if (list_match[1] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[i].match(/<link>([^<]+)/);
                            if (list_match) {
                                if (!list_match[1].match(/^(http|https):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.federalreserve.gov' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.federalreserve.gov/' + list_match[1];
                                    }
                                }
                                data['url'] = list_match[1];
                                list_match = raw_list[i].match(/<title>([^<]+)/);
                                if (list_match) {
                                    data['name'] = util.toValidName(list_match[1]);
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                url = 'http://www.federalreserve.gov/releases/g17/Current/default.htm';
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    docDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                    console.log(docDate);
                    raw_list = raw_data.match(/class="dates">Release Date:  ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find sca latest'}, callback, callback);
                    }
                    if (docDate === raw_list[1]) {
                        data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                        raw_list = raw_data.match(/Current Release[\s]*<a href="([^"]+)/i);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find fed latest'}, callback, callback);
                        }
                        if (!raw_list[1].match(/^(http|https):\/\//)) {
                            if (raw_list[1].match(/^\//)) {
                                raw_list[1] = 'http://www.federalreserve.gov/releases/g17/Current' + raw_list[1];
                            } else {
                                raw_list[1] = 'http://www.federalreserve.gov/releases/g17/Current/' + raw_list[1];
                            }
                        }
                        data['url'] = raw_list[1];
                        data['name'] = util.toValidName('INDUSTRIAL PRODUCTION AND CAPACITY UTILIZATION');
                        list.push(data);
                    }
                    url = 'http://www.federalreserve.gov/releases/g19/current/default.htm';
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        raw_list = raw_data.match(/">Last update: ([a-zA-Z]+ \d\d?, \d\d\d\d)/);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find fed latest'}, callback, callback);
                        }
                        if (docDate === raw_list[1]) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            raw_list = raw_data.match(/Current Release[\s]*<a href="([^"]+)/i);
                            if (!raw_list) {
                                util.handleError({hoerror: 2, message: 'cannot find fed latest'}, callback, callback);
                            }
                            if (!raw_list[1].match(/^(http|https):\/\//)) {
                                if (raw_list[1].match(/^\//)) {
                                    raw_list[1] = 'http://www.federalreserve.gov/releases/g19/current' + raw_list[1];
                                } else {
                                    raw_list[1] = 'http://www.federalreserve.gov/releases/g19/current/' + raw_list[1];
                                }
                            }
                            data['url'] = raw_list[1];
                            data['name'] = util.toValidName('Consumer Credit');
                            list.push(data);
                        }
                        setTimeout(function(){
                            callback(null, list);
                        }, 0);
                    }, 60000, false, false);
                }, 60000, false, false);
            }, 60000, false, false);
            break;
            case 'sea':
            url = 'http://www.seaj.or.jp/english/statistics/page_en.php?CMD=1';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<td class="lft">Book-to-Bill Ratio\(Express Report\).*/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find sea latest'}, callback, callback);
                }
                var date = new Date();
                var docDate = date.getFullYear() + '-';
                if (date.getMonth() + 1 < 10) {
                    docDate = docDate + '0' + (date.getMonth() + 1) + '-';
                } else {
                    docDate = docDate + (date.getMonth() + 1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                console.log(docDate);
                var list = [];
                var list_match = false;
                var item_match = false;
                var data = null;
                list_match = raw_list[0].match(/<td class="lft">.+?\d\d\d\d-\d\d-\d\d/g);
                if (!list_match) {
                    util.handleError({hoerror: 2, message: 'cannot find sea latest'}, callback, callback);
                }
                for (var i in list_match) {
                    item_match = list_match[i].match(/\d\d\d\d-\d\d-\d\d$/);
                    if (item_match) {
                        if (docDate === item_match[0]) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            item_match = list_match[i].match(/class="lft">([^<]+)<br>([^<]+)/);
                            if (item_match) {
                                data['name'] = util.toValidName(item_match[1] + ' ' + item_match[2]);
                                item_match = list_match[i].match(/href="([^"]+)/);
                                if (item_match) {
                                    if (!item_match[1].match(/^(http|https):\/\//)) {
                                        item_match[1] = path.join('www.seaj.or.jp/english/statistics', item_match[1]);
                                        item_match[1] = 'http://' + item_match[1];
                                    }
                                    data['url'] = item_match[1];
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'tri':
            url = 'http://www.tri.org.tw/index.html';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<div class="consumerText">.*/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find tri latest'}, callback, callback);
                }
                raw_list = raw_list[0].match(/\d\d\d\.\d\d?\.\d\d?/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find tri latest'}, callback, callback);
                }
                var date = new Date();
                var docDate = (date.getFullYear()-1911) + '.' + (date.getMonth() + 1) + '.' + date.getDate();
                console.log(docDate);
                var list = [];
                if (raw_list[0] === docDate) {
                    url = 'http://www.tri.org.tw/page/consumer.php';
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        var raw_list = raw_data.match(/id="">1<\/td>.*/);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find tri latest'}, callback, callback);
                        }
                        var list_match = false;
                        list_match = raw_list[0].match(/href="([^"]+)/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://www.tri.org.tw/page' + list_match[1];
                                } else {
                                    list_match[1] = 'http://www.tri.org.tw/page/' + list_match[1];
                                }
                            }
                            list.push({url: list_match[1], name: util.toValidName('消費者信心指數調查報告'), date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()});
                        }
                        setTimeout(function(){
                            callback(null, list);
                        }, 0);
                    }, 60000, false, false, null, true);
                } else {
                    setTimeout(function(){
                        callback(null, list);
                    }, 0);
                }
            }, 60000, false, false, null, true);
            break;
            case 'ndc':
            url = 'http://index.ndc.gov.tw/n/json/data/news';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var json_data = null;
                try {
                    json_data = JSON.parse(raw_data);
                } catch (x) {
                    console.log(raw_data);
                    util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                }
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getFullYear() + '-';
                if (date.getMonth() + 1 < 10) {
                    docDate = docDate + '0' + (date.getMonth() + 1) + '-';
                } else {
                    docDate = docDate + (date.getMonth() + 1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                console.log(docDate);
                var list = [];
                var list_match = false;
                var data = null;
                for (var i in json_data) {
                    if (json_data[i].date === docDate) {
                        list_match = json_data[i].content.match(/href="([^"]+)".*title="(\d\d\d\d?年\d\d?月臺灣製造業採購經理人指數\(PMI\)完整報告)/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://index.ndc.gov.tw' + list_match[1];
                                } else {
                                    list_match[1] = 'http://index.ndc.gov.tw/' + list_match[1];
                                }
                            }
                            list_match[1] =  list_match[1].replace(/&amp;/g, '&');
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName(list_match[2]), url: list_match[1]};
                            list.push(data);
                        }
                        list_match = json_data[i].content.match(/href="([^"]+)".*title="(\d\d\d\d?年\d\d?月臺灣非製造業經理人指數\(NMI\)完整報告)/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://index.ndc.gov.tw' + list_match[1];
                                } else {
                                    list_match[1] = 'http://index.ndc.gov.tw/' + list_match[1];
                                }
                            }
                            list_match[1] =  list_match[1].replace(/&amp;/g, '&');
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName(list_match[2]), url: list_match[1]};
                            list.push(data);
                        }
                        list_match = json_data[i].content.match(/href="([^"]+)".*title="([^"]+)">\d\d\d\d?年\d\d?月份景氣概況新聞稿\.pdf/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://index.ndc.gov.tw' + list_match[1];
                                } else {
                                    list_match[1] = 'http://index.ndc.gov.tw/' + list_match[1];
                                }
                            }
                            list_match[1] =  list_match[1].replace(/&amp;/g, '&');
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName(list_match[2]), url: list_match[1]};
                            list.push(data);
                        }
                        list_match = json_data[i].content.match(/href="([^"]+)".*title="([^"]+)">\d\d\d\d?年\d\d?月臺灣採購經理人指數新聞稿\.pdf/);
                        if (list_match) {
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://index.ndc.gov.tw' + list_match[1];
                                } else {
                                    list_match[1] = 'http://index.ndc.gov.tw/' + list_match[1];
                                }
                            }
                            list_match[1] =  list_match[1].replace(/&amp;/g, '&');
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName(list_match[2]), url: list_match[1]};
                            list.push(data);
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false, null, false, null, true);
            break;
            case 'sta':
            url = 'http://www.stat.gov.tw/lp.asp?ctNode=489&CtUnit=1818&BaseDSD=29';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<td><a href="[\s\S]+?>\d\d\d\d\/\d\d?\/\d\d?/ig);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find sta latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                var docDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/\d\d\d\d\/\d\d?\/\d\d?$/);
                    if (list_match) {
                        if (list_match[0] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[i].match(/href="([^"]+)/);
                            if (list_match) {
                                if (!list_match[1].match(/^(http|https):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.stat.gov.tw' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.stat.gov.tw/' + list_match[1];
                                    }
                                }
                                data['url'] = list_match[1];
                                data['name'] = util.toValidName('物價指數');
                                list.push(data);
                            }
                        }
                    }
                }
                url = 'http://www.stat.gov.tw/lp.asp?ctNode=497&CtUnit=1818&BaseDSD=29';
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    raw_list = raw_data.match(/<td><a href="[\s\S]+?>\d\d\d\d\/\d\d?\/\d\d?/ig);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find sta latest'}, callback, callback);
                    }
                    for (var i in raw_list) {
                        list_match = raw_list[i].match(/\d\d\d\d\/\d\d?\/\d\d?$/);
                        if (list_match) {
                            if (list_match[0] === docDate) {
                                data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                                list_match = raw_list[i].match(/href="([^"]+)/);
                                if (list_match) {
                                    if (!list_match[1].match(/^(http|https):\/\//)) {
                                        if (list_match[1].match(/^\//)) {
                                            list_match[1] = 'http://www.stat.gov.tw' + list_match[1];
                                        } else {
                                            list_match[1] = 'http://www.stat.gov.tw/' + list_match[1];
                                        }
                                    }
                                    data['url'] = list_match[1];
                                    data['name'] = util.toValidName('經濟成長率');
                                    list.push(data);
                                }
                            }
                        }
                    }
                    url = 'http://www.stat.gov.tw/lp.asp?ctNode=527&CtUnit=1818&BaseDSD=29&MP=4';
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        raw_list = raw_data.match(/<td><a href="[\s\S]+?>\d\d\d\d\/\d\d?\/\d\d?/ig);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find sta latest'}, callback, callback);
                        }
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/\d\d\d\d\/\d\d?\/\d\d?$/);
                            if (list_match) {
                                if (list_match[0] === docDate) {
                                    data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                                    list_match = raw_list[i].match(/href="([^"]+)/);
                                    if (list_match) {
                                        if (!list_match[1].match(/^(http|https):\/\//)) {
                                            if (list_match[1].match(/^\//)) {
                                                list_match[1] = 'http://www.stat.gov.tw' + list_match[1];
                                            } else {
                                                list_match[1] = 'http://www.stat.gov.tw/' + list_match[1];
                                            }
                                        }
                                        data['url'] = list_match[1];
                                        data['name'] = util.toValidName('受僱員工薪資與生產力');
                                        list.push(data);
                                    }
                                }
                            }
                        }
                        url = 'http://www.stat.gov.tw/lp.asp?ctNode=2294&CtUnit=1818&BaseDSD=29&mp=4';
                        api.xuiteDownload(url, '', function(err, raw_data) {
                            if (err) {
                                err.hoerror = 2;
                                util.handleError(err, callback, callback);
                            }
                            raw_list = raw_data.match(/<li><a href="[^"]+"[^>]*>\d\d\d年\d\d?月/g);
                            if (!raw_list) {
                                util.handleError({hoerror: 2, message: 'cannot find sta latest'}, callback, callback);
                            }
                            var pDate = new Date(new Date(date).setMonth(date.getMonth()-1));
                            var goed = false;
                            for (var i in raw_list) {
                                list_match = raw_list[i].match(/href="([^"]+)"[^>]*>(\d\d\d)年(\d\d?)月$/);
                                if (list_match) {
                                    if (Number(list_match[2]) === (pDate.getFullYear() - 1911) && Number(list_match[3]) === (pDate.getMonth() + 1)) {
                                        goed = true;
                                        if (!list_match[1].match(/^(http|https):\/\//)) {
                                            if (list_match[1].match(/^\//)) {
                                                list_match[1] = 'http://www.stat.gov.tw' + list_match[1];
                                            } else {
                                                list_match[1] = 'http://www.stat.gov.tw/' + list_match[1];
                                            }
                                        }
                                        api.xuiteDownload(list_match[1], '', function(err, raw_data) {
                                            if (err) {
                                                err.hoerror = 2;
                                                util.handleError(err, callback, callback);
                                            }
                                            raw_list = raw_data.match(/>張貼日期：(\d\d\d\d\/\d\d?\/\d\d?)/);
                                            if (!raw_list) {
                                                util.handleError({hoerror: 2, message: 'cannot find sta latest'}, callback, callback);
                                            }
                                            if (raw_list[1] === docDate) {
                                                list.push({date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName('失業率'), url: list_match[1]});
                                            }
                                            setTimeout(function(){
                                                callback(null, list);
                                            }, 0);
                                        }, 60000, false, false, null, true);
                                        break;
                                    }
                                }
                            }
                            if (!goed) {
                                setTimeout(function(){
                                    callback(null, list);
                                }, 0);
                            }
                        }, 60000, false, false, null, true);
                    }, 60000, false, false, null, true);
                }, 60000, false, false, null, true);
            }, 60000, false, false, null, true);
            break;
            case 'mof':
            url = 'http://www.mof.gov.tw/Pages/List.aspx?nodeid=281';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                var docDate = date.getFullYear() + '-';
                if (date.getMonth() + 1 < 10) {
                    docDate = docDate + '0' + (date.getMonth() + 1) + '-';
                } else {
                    docDate = docDate + (date.getMonth() + 1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                console.log(docDate);
                var raw_list = raw_data.match(/href="[^"]+" title="[^"]+">\d\d\d年\d\d?月海關進出口貿易(統計速報|初步統計)<[\s\S]+?>\d\d\d\d-\d\d-\d\d/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find mof latest'}, callback, callback);
                }
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/\d\d\d\d-\d\d-\d\d$/);
                    if (list_match) {
                        if (list_match[0] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[i].match(/href="([^"]+)/);
                            if (list_match) {
                                if (!list_match[1].match(/^(http|https):\/\//)) {
                                    if (list_match[1].match(/^\//)) {
                                        list_match[1] = 'http://www.mof.gov.tw' + list_match[1];
                                    } else {
                                        list_match[1] = 'http://www.mof.gov.tw/' + list_match[1];
                                    }
                                }
                                data['url'] = list_match[1];
                                data['name'] = util.toValidName('海關進出口貿易統計');
                                list.push(data);
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            case 'moe':
            url = 'http://www.stat.gov.tw/lp.asp?ctNode=2299&CtUnit=1818&BaseDSD=29';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var goed = false;
                var raw_list = raw_data.match(/<li><a href="[^"]+" title="\d\d\d年\d\d?月/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find moe latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-20));
                var docDate = date.getFullYear() + '-';
                if (date.getMonth() + 1 < 10) {
                    docDate = docDate + '0' + (date.getMonth() + 1) + '-';
                } else {
                    docDate = docDate + (date.getMonth() + 1) + '-';
                }
                if (date.getDate() < 10) {
                    docDate = docDate + '0' + date.getDate();
                } else {
                    docDate = docDate + date.getDate();
                }
                console.log(docDate);
                var pDate = new Date(new Date(date).setMonth(date.getMonth()-1));
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/href="([^"]+)" title="(\d\d\d)年(\d\d?)月$/);
                    if (list_match) {
                        if (Number(list_match[2]) === (pDate.getFullYear() - 1911) && Number(list_match[3]) === (pDate.getMonth() + 1)) {
                            goed = true;
                            if (!list_match[1].match(/^(http|https):\/\//)) {
                                if (list_match[1].match(/^\//)) {
                                    list_match[1] = 'http://www.moea.gov.tw' + list_match[1];
                                } else {
                                    list_match[1] = 'http://www.moea.gov.tw/' + list_match[1];
                                }
                            }
                            api.xuiteDownload(list_match[1], '', function(err, raw_data) {
                                if (err) {
                                    err.hoerror = 2;
                                    util.handleError(err, callback, callback);
                                }
                                raw_list = raw_data.match(/發布日期：(\d\d\d\d-\d\d-\d\d)/);
                                if (!raw_list) {
                                    util.handleError({hoerror: 2, message: 'cannot find moe latest'}, callback, callback);
                                }
                                if (raw_list[1] === docDate) {
                                    list.push({date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName('工業生產'), url: list_match[1]});
                                }
                                stage2();
                            }, 60000, false, false);
                            break;
                        }
                    }
                }
                if (!goed) {
                    stage2();
                }
                function stage2() {
                    url = 'http://www.stat.gov.tw/lp.asp?ctNode=2300&CtUnit=1818&BaseDSD=29';
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        var goed_1 = false;
                        raw_list = raw_data.match(/<li><a href="[^"]+" title="\d\d\d年\d\d?月/g);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find moe latest'}, callback, callback);
                        }
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/href="([^"]+)" title="(\d\d\d)年(\d\d?)月$/);
                            if (list_match) {
                                if (Number(list_match[2]) === (pDate.getFullYear() - 1911) && Number(list_match[3]) === (pDate.getMonth() + 1)) {
                                    goed_1 = true;
                                    if (!list_match[1].match(/^(http|https):\/\//)) {
                                        if (list_match[1].match(/^\//)) {
                                            list_match[1] = 'http://www.moea.gov.tw' + list_match[1];
                                        } else {
                                            list_match[1] = 'http://www.moea.gov.tw/' + list_match[1];
                                        }
                                    }
                                    api.xuiteDownload(list_match[1], '', function(err, raw_data) {
                                        if (err) {
                                            err.hoerror = 2;
                                            util.handleError(err, callback, callback);
                                        }
                                        raw_list = raw_data.match(/發布日期：(\d\d\d\d-\d\d-\d\d)/);
                                        if (!raw_list) {
                                            util.handleError({hoerror: 2, message: 'cannot find moe latest'}, callback, callback);
                                        }
                                        if (raw_list[1] === docDate) {
                                            list.push({date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear(), name: util.toValidName('外銷訂單統計'), url: list_match[1]});
                                        }
                                        setTimeout(function(){
                                            callback(null, list);
                                        }, 0);
                                    }, 60000, false, false);
                                    break;
                                }
                            }
                        }
                        if (!goed_1) {
                            setTimeout(function(){
                                callback(null, list);
                            }, 0);
                        }
                    }, 60000, false, false, null, true);
                }
            }, 60000, false, false, null, true);
            break;
            case 'cbc':
            url = 'http://www.cbc.gov.tw/rss.asp?ctNodeid=302';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<title>[\s\S]+?\d\d [a-zA-Z][a-zA-Z][a-zA-Z] \d\d\d\d/g);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find moe latest'}, callback, callback);
                }
                var list = [];
                var list_match = false;
                var data = null;
                var date = new Date();
                date = new Date(new Date(date).setDate(date.getDate()-1));
                var docDate = date.getDate() + ' ' + monthNameShorts[date.getMonth()]+' '+date.getFullYear();
                if (date.getDate() < 10) {
                    docDate = '0' + docDate;
                }
                console.log(docDate);
                for (var i in raw_list) {
                    list_match = raw_list[i].match(/\d\d [a-zA-Z][a-zA-Z][a-zA-Z] \d\d\d\d$/);
                    if (list_match) {
                        if (list_match[0] === docDate) {
                            data = {date: (date.getMonth()+1)+'_'+date.getDate()+'_'+date.getFullYear()};
                            list_match = raw_list[i].match(/<title>([^<]+)/);
                            if (list_match) {
                                data['name'] = util.toValidName(list_match[1]);
                                list_match = raw_list[i].match(/<link><\!\[CDATA\[([^\]]+)/);
                                if (list_match) {
                                    if (!list_match[1].match(/^(http|https):\/\//)) {
                                        if (list_match[1].match(/^\//)) {
                                            list_match[1] = 'http://www.cbc.gov.tw' + list_match[1];
                                        } else {
                                            list_match[1] = 'http://www.cbc.gov.tw/' + list_match[1];
                                        }
                                    }
                                    data['url'] = list_match[1];
                                    list.push(data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function(){
                    callback(null, list);
                }, 0);
            }, 60000, false, false);
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    saveSingle: function(type, id, callback) {
        switch (type) {
            case 'kubo':
            var url = 'http://www.123kubo.com/vod-read-id-' + id + '.html';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                if (!raw_data.match(/>(FLV|YouTube)</i)) {
                    util.handleError({hoerror: 2, message: "kubo no source"}, callback, callback);
                }
                var info = raw_data.match(/"vpic"[^"]+"([^"]+)" alt="([^"]+)/);
                if (!info) {
                    util.handleError({hoerror: 2, message: "kubo no info"}, callback, callback);
                }
                var name = info[2];
                var thumb = info[1];
                info = raw_data.match(/.*<p>分類：<a.*/);
                var info_tag = ['kubo', '酷播123', '123kubo', '酷播', '影片', 'video'];
                if (info) {
                    var info_list = info[0].match(/>[^<：\s]+</g);
                    if (info_list) {
                        var info_match = false;
                        var nick_list = false;
                        var nick_match = false;
                        if (!info_list[info_list.length-1].match(/^>\d\d\d\d<$/)) {
                            info_list.splice(info_list.length-1, 1);
                        }
                        for (var i in info_list) {
                            info_match = info_list[i].match(/^>([^<]+)<$/);
                            if (info_match) {
                                nick_list = info_match[1].match(/(^別名:|\/)[^\/]+/g);
                                if (nick_list) {
                                    for (var j in nick_list) {
                                        nick_match = nick_list[j].match(/(^別名:|\/)([^\/]+)/);
                                        if (nick_match) {
                                            if (info_tag.indexOf(nick_match[2]) === -1) {
                                                info_tag.push(nick_match[2]);
                                            }
                                        }
                                    }
                                } else {
                                    if (info_tag.indexOf(info_match[1]) === -1) {
                                        info_tag.push(info_match[1]);
                                    }
                                    for (var j in kubo_type) {
                                        if (kubo_type[j].indexOf(info_match[1]) !== -1) {
                                            if (j === '2') {
                                                if (info_tag.indexOf('animation') === -1) {
                                                    info_tag.push('animation');
                                                }
                                                if (info_tag.indexOf('動畫') === -1) {
                                                    info_tag.push('動畫');
                                                }
                                            } else if (j === '0') {
                                                if (info_tag.indexOf('movie') === -1) {
                                                    info_tag.push('movie');
                                                }
                                                if (info_tag.indexOf('電影') === -1) {
                                                    info_tag.push('電影');
                                                }
                                                switch (kubo_type[j].indexOf(info_match[1])) {
                                                    case 0:
                                                    if (info_tag.indexOf('action') === -1) {
                                                        info_tag.push('action');
                                                    }
                                                    if (info_tag.indexOf('動作') === -1) {
                                                        info_tag.push('動作');
                                                    }
                                                    break;
                                                    case 1:
                                                    if (info_tag.indexOf('comedy') === -1) {
                                                        info_tag.push('comedy');
                                                    }
                                                    if (info_tag.indexOf('喜劇') === -1) {
                                                        info_tag.push('喜劇');
                                                    }
                                                    break;
                                                    case 2:
                                                    if (info_tag.indexOf('romance') === -1) {
                                                        info_tag.push('romance');
                                                    }
                                                    if (info_tag.indexOf('浪漫') === -1) {
                                                        info_tag.push('浪漫');
                                                    }
                                                    break;
                                                    case 3:
                                                    if (info_tag.indexOf('sci-fi') === -1) {
                                                        info_tag.push('sci-fi');
                                                    }
                                                    if (info_tag.indexOf('科幻') === -1) {
                                                        info_tag.push('科幻');
                                                    }
                                                    break;
                                                    case 4:
                                                    if (info_tag.indexOf('horror') === -1) {
                                                        info_tag.push('horror');
                                                    }
                                                    if (info_tag.indexOf('恐怖') === -1) {
                                                        info_tag.push('恐怖');
                                                    }
                                                    break;
                                                    case 5:
                                                    if (info_tag.indexOf('drama') === -1) {
                                                        info_tag.push('drama');
                                                    }
                                                    if (info_tag.indexOf('劇情') === -1) {
                                                        info_tag.push('劇情');
                                                    }
                                                    break;
                                                    case 6:
                                                    if (info_tag.indexOf('war') === -1) {
                                                        info_tag.push('war');
                                                    }
                                                    if (info_tag.indexOf('戰爭') === -1) {
                                                        info_tag.push('戰爭');
                                                    }
                                                    break;
                                                    case 7:
                                                    if (info_tag.indexOf('animation') === -1) {
                                                        info_tag.push('animation');
                                                    }
                                                    if (info_tag.indexOf('動畫') === -1) {
                                                        info_tag.push('動畫');
                                                    }
                                                    break;
                                                }
                                            } else if (j === '1') {
                                                if (info_tag.indexOf('tv show') === -1) {
                                                    info_tag.push('tv show');
                                                }
                                                if (info_tag.indexOf('電視劇') === -1) {
                                                    info_tag.push('電視劇');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in info_tag) {
                    if (trans_list.indexOf(info_tag[i]) !== -1) {
                        info_tag[i] = trans_list_ed[trans_list.indexOf(info_tag[i])];
                    }
                }
                setTimeout(function(){
                    callback(null, name, info_tag, 'kubo', thumb, url);
                }, 0);
            }, 60000, false, false, 'http://www.123kubo.com/');
            break;
            case 'yify':
            var url = 'https://yts.ag/api/v2/movie_details.json?with_cast=true&movie_id=' + id;
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var json_data = null;
                try {
                    json_data = JSON.parse(raw_data);
                } catch (x) {
                    console.log(raw_data);
                    util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                }
                if (json_data['status'] !== 'ok' || !json_data['data']['movie']) {
                    util.handleError({hoerror: 2, message: 'yify api fail'}, callback, callback);
                }
                var name = json_data['data']['movie']['title'];
                var thumb = json_data['data']['movie']['small_cover_image'];
                var info_tag = ['yify', 'video', '影片', 'movie', '電影'];
                if (info_tag.indexOf(json_data['data']['movie']['imdb_code']) === -1) {
                    info_tag.push(json_data['data']['movie']['imdb_code']);
                }
                if (info_tag.indexOf(json_data['data']['movie']['year'].toString()) === -1) {
                    info_tag.push(json_data['data']['movie']['year'].toString());
                }
                for (var i in json_data['data']['movie']['genres']) {
                    if (info_tag.indexOf(json_data['data']['movie']['genres'][i]) === -1) {
                        info_tag.push(json_data['data']['movie']['genres'][i]);
                    }
                }
                for (var i in json_data['data']['movie']['cast']) {
                    if (info_tag.indexOf(json_data['data']['movie']['cast'][i]['name']) === -1) {
                        info_tag.push(json_data['data']['movie']['cast'][i]['name']);
                    }
                }
                for (var i in info_tag) {
                    if (trans_list.indexOf(info_tag[i]) !== -1) {
                        info_tag[i] = trans_list_ed[trans_list.indexOf(info_tag[i])];
                    }
                }
                setTimeout(function(){
                    callback(null, name, info_tag, 'yify', thumb, url);
                }, 0);
            }, 60000, false, false, 'https://yts.ag/');
            break;
            case 'comic99':
            var url = 'http://www.99comic.com/comic/' + id + '/';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var name = raw_data.match(/<div class="block"><img alt='([^']+)' src='([^']+)/);
                if (!name) {
                    util.handleError({hoerror: 2, message: 'unknown comic name'}, callback, callback);
                }
                var thumb = name[2];
                name = name[1];
                console.log(name);
                var info_tag = ['comic99', '漫畫', 'comic', '圖片集', 'image book', '圖片', 'image'];
                var info_list = [];
                var info_match = raw_data.match(/漫畫作者：<\/b><[^>]+>([^<]+)/);
                if (info_match) {
                    if (info_tag.indexOf(info_match[1]) === -1) {
                        info_tag.push(info_match[1]);
                    }
                }
                info_match = raw_data.match(/漫畫類型：<\/b><[^>]+>([^<]+)/);
                if (info_match) {
                    if (info_tag.indexOf(info_match[1]) === -1) {
                        info_tag.push(info_match[1]);
                    }
                }
                for (var i in info_tag) {
                    if (trans_list.indexOf(info_tag[i]) !== -1) {
                        info_tag[i] = trans_list_ed[trans_list.indexOf(info_tag[i])];
                    }
                }
                setTimeout(function(){
                    callback(null, name, info_tag, 'comic99', thumb, url);
                }, 0);

            }, 60000, false, false, 'http://www.99comic.com/');
            break;
            case 'cartoonmad':
            var url = 'http://www.cartoonmad.com/comic/' + id + '.html';
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var pattern = new RegExp('<a href=\\/comic\\/' + id + '\\.html>([^<]+)');
                var name = raw_data.match(pattern);
                if (!name) {
                    util.handleError({hoerror: 2, message: 'unknown comic name'}, callback, callback);
                }
                name = name[1];
                console.log(name);
                var thumb = raw_data.match(/class="cover"><\/div><img src="([^"]+)"/);
                if (!name) {
                    util.handleError({hoerror: 2, message: 'unknown comic thumb'}, callback, callback);
                }
                thumb = thumb[1];
                var info_tag = ['cartoonmad', '漫畫', 'comic', '圖片集', 'image book', '圖片', 'image'];
                var info_list = [];
                var info_match = raw_data.match(/漫畫分類： <a href="[^"]+">(.*)系列/);
                if (info_match) {
                    if (info_tag.indexOf(info_match[1]) === -1) {
                        info_tag.push(info_match[1]);
                    }
                }
                info_match = raw_data.match(/原創作者： ([^<]+)/);
                if (info_match) {
                    info_list = info_match[1].split(/\s+/);
                    for (var i in info_list) {
                        if (info_tag.indexOf(info_list[i]) === -1) {
                            info_tag.push(info_list[i]);
                        }
                    }
                }
                info_match = raw_data.match(/漫畫標籤： ([^<]+)/);
                if (info_match) {
                    info_list = info_match[1].split(/\s+/);
                    for (var i in info_list) {
                        if (info_tag.indexOf(info_list[i]) === -1) {
                            info_tag.push(info_list[i]);
                        }
                    }
                }
                for (var i in info_tag) {
                    if (trans_list.indexOf(info_tag[i]) !== -1) {
                        info_tag[i] = trans_list_ed[trans_list.indexOf(info_tag[i])];
                    }
                }
                setTimeout(function(){
                    callback(null, name, info_tag, 'cartoonmad', thumb, url);
                }, 0);
            }, 60000, false, false, 'http://www.cartoonmad.com/', true);
            break;
            case 'bilibili':
            var url = null;
            if (id.match(/^av/)) {
                url = 'http://www.bilibili.com/video/' + id + '/';
            } else {
                url = 'http://www.bilibili.com/bangumi/i/' + id + '/';
            }
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var info_match = raw_data.match(/class="bangumi-preview".*?"([^"]+)" alt="([^"]+)/);
                var name = '';
                var thumb = '';
                var info_list = false;
                var info_item = false;
                var info_tag = ['bilibili', '影片', 'video'];
                if (info_match) {
                    name = info_match[2] + ' ' + id;
                    thumb = info_match[1];
                    if (info_tag.indexOf('動畫') === -1) {
                        info_tag.push('動畫');
                    }
                    if (info_tag.indexOf('animation') === -1) {
                        info_tag.push('animation');
                    }
                    info_match = raw_data.match(/info-detail-item-date">.*?(\d\d\d\d)年.*?"info-detail-item".*?<em>([^<]+)/);
                    if (info_match) {
                        if (info_tag.indexOf(info_match[1]) === -1) {
                            info_tag.push(info_match[1]);
                        }
                        info_match[2] = opencc.convertSync(info_match[2]);
                        if (info_tag.indexOf(info_match[2]) === -1) {
                            info_tag.push(info_match[2]);
                        }
                    }
                    info_match = raw_data.match(/class="info-row info-cv".*/);
                    if (info_match) {
                        info_list = info_match[0].match(/class="separator">\/<\/span>[^<]+/g);
                        if (info_list) {
                            for (var i in info_list) {
                                info_item = info_list[i].match(/[^<>]+$/);
                                if (info_item) {
                                    info_item[0] = info_item[0];
                                    if (info_tag.indexOf(info_item[0]) === -1) {
                                        info_tag.push(info_item[0]);
                                    }
                                }
                            }
                        }
                    }
                    info_match = raw_data.match(/class="info-row info-style".*/);
                    if (info_match) {
                        info_list = info_match[0].match(/class="info-style-item">[^<]+/g);
                        if (info_list) {
                            for (var i in info_list) {
                                info_item = info_list[i].match(/[^<>]+$/);
                                if (info_item) {
                                    info_item[0] = opencc.convertSync(info_item[0]);
                                    if (info_tag.indexOf(info_item[0]) === -1) {
                                        info_tag.push(info_item[0]);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    var info_match = raw_data.match(/class="v-title"><h1 title="([^"]+)/);
                    if (!info_match) {
                        util.handleError({hoerror: 2, message: 'bilibili info unknown'}, callback, callback);
                    }
                    name = info_match[1];
                    info_match = raw_data.match(/<img src="([^"]+)/);
                    if (!info_match) {
                        util.handleError({hoerror: 2, message: 'bilibili info unknown'}, callback, callback);
                    }
                    thumb = info_match[1];
                    info_match = raw_data.match(/动画<\/a><\/span>/);
                    if (info_match) {
                        if (info_tag.indexOf('動畫') === -1) {
                            info_tag.push('動畫');
                        }
                        if (info_tag.indexOf('animation') === -1) {
                            info_tag.push('animation');
                        }
                    }
                    info_match = raw_data.match(/电影<\/a><\/span>/);
                    if (info_match) {
                        if (info_tag.indexOf('電影') === -1) {
                            info_tag.push('電影');
                        }
                        if (info_tag.indexOf('movie') === -1) {
                            info_tag.push('movie');
                        }
                    }
                    info_match = raw_data.match(/"tag-val".*?title="[^"]+/g);
                    if (info_match) {
                        for (var i in info_match) {
                            info_item = info_match[i].match(/[^"]+$/);
                            if (info_item) {
                                info_item[0] = opencc.convertSync(info_item[0]);
                                if (info_tag.indexOf(info_item[0]) === -1) {
                                    info_tag.push(info_item[0]);
                                }
                            }
                        }
                    }
                }
                for (var i in info_tag) {
                    if (trans_list.indexOf(info_tag[i]) !== -1) {
                        info_tag[i] = trans_list_ed[trans_list.indexOf(info_tag[i])];
                    }
                }
                setTimeout(function(){
                    callback(null, opencc.convertSync(name), info_tag, 'bilibili', thumb, url);
                }, 0);
            }, 60000, false, false, 'http://www.bilibili.com/', true);
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
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
                                            list_match[1] = list_match[1];
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
                                    setTimeout(function(){
                                        recur_save(type, index, list_arr);
                                    }, 30000);
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
                                setTimeout(function(){
                                    recur_save(type, index, list_arr);
                                }, 30000);
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
                                    list_match[1] = 'https://eztv.ag/' + list_match[1];
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
                                        err.hoerror = 2;
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
                                            setTimeout(function(){
                                                recur_save(type, index, list_arr);
                                            }, 30000);
                                        } else {
                                            setTimeout(function(){
                                                callback(null);
                                            }, 0);
                                        }
                                    });
                                }, 60000, false, false, 'https://eztv.ag/');
                            } else {
                                index++;
                                if (index < list_arr.length) {
                                    setTimeout(function(){
                                        recur_save(type, index, list_arr);
                                    }, 30000);
                                } else {
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            }
                        });
                    }
                }, 60000, false, false, 'https://eztv.ag/');
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
                                            setTimeout(function(){
                                                recur_save(type, index, list_arr);
                                            }, 30000);
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
                                                setTimeout(function(){
                                                    recur_save(type, index, list_arr);
                                                }, 30000);
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
                                                    setTimeout(function(){
                                                        recur_save(type, index, list_arr);
                                                    }, 30000);
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
                                    setTimeout(function(){
                                        recur_save(type, index, list_arr);
                                    }, 30000);
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
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    getSingleId: function(type, url, index, callback, pageToken, back) {
        if ((typeof index) === 'number' || index.match(/^[\d\.]+$/)) {
            if (index < 1) {
                util.handleError({hoerror: 2, message: 'index must > 1'}, callback, callback);
            }
            var sub_index = Math.round((+index)*1000)%1000;
            if (sub_index === 0) {
                sub_index++;
            }
            index = Math.floor(+index);
        } else if (type !== 'youtube'){
            util.handleError({hoerror: 2, message: 'index invalid'}, callback, callback);
        }
        switch (type) {
            case 'lovetv':
            var prefix = url.match(/^((http|https):\/\/[^\/]+)\//);
            if (!prefix) {
                util.handleError({hoerror: 2, message: 'invaild url'}, callback, callback);
            }
            prefix = prefix[1];
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].raw_list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    var list_match = eItems[0].raw_list[eItems[0].raw_list.length - index].match(/^<td><h3[^>]*><a href="([^>"]+)">([^<]+)Ep\d+<\/a><\/h3>$/);
                    if (!list_match) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    var choose_url = list_match[1];
                    var is_end = false;
                    for (var i in eItems[0].raw_list) {
                        list_match = eItems[0].raw_list[i].match(/^<td><h3[^>]*><a href="[^>"]+">[^<]+大結局[^<]+<\/a><\/h3>$/);
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
                            index = (index*1000 + sub_index)/1000;
                            ret_obj.sub = obj.ids.length;
                        }
                        ret_obj.index = index;
                        ret_obj.showId = index;
                        setTimeout(function(){
                            callback(null, ret_obj, is_end, eItems[0].raw_list.length);
                        }, 0);
                        if (eItems[0].etime < (new Date().getTime()/1000)) {
                            lovetvGetlist(function(err, raw_list) {
                                if (err) {
                                    util.handleError(err);
                                }
                                var data = {raw_list: raw_list, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                                mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                    if(err) {
                                        util.handleError(err);
                                    }
                                    console.log('update ok');
                                });
                            });
                        }
                    }, 60000, false, false);
                } else {
                    lovetvGetlist(function(err, raw_list) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {raw_list: raw_list, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
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
                                    index = (index*1000 + sub_index)/1000;
                                    ret_obj.sub = obj.ids.length;
                                }
                                ret_obj.index = index;
                                ret_obj.showId = index;
                                setTimeout(function(){
                                    callback(null, ret_obj, is_end, raw_list.length);
                                }, 0);
                            }, 60000, false, false);
                        });
                    });
                }
            });
            function lovetvGetlist(callback2) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
                    }
                    var raw_list = raw_data.match(/<td><h3[^>]*><a href="[^>"]+">[^<]+Ep\d+<\/a><\/h3>/g);
                    setTimeout(function(){
                        callback2(null, raw_list);
                    }, 0);
                }, 60000, false, false);
            }
            break;
            case 'eztv':
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    var choose = -1;
                    var cSize = 0;
                    for (var i in eItems[0].list[index-1]) {
                        if (eItems[0].list[index-1][i].size > cSize) {
                            choose = i;
                            cSize = eItems[0].list[index-1][i].size;
                        }
                    }
                    var chooseMag = eItems[0].list[index-1].splice(choose, 1);
                    chooseMag = chooseMag[0];
                    var encodeTorrent = false;
                    var torrentHash = null;
                    var ret_obj = {index: index, showId: index, is_magnet: true, complete: false};
                    if (eItems[0].list[index-1].length > 1) {
                        recur_check(0);
                    } else {
                        ret_obj['title'] = chooseMag.name;
                        encodeTorrent = util.isValidString(chooseMag.magnet, 'url');
                        if (encodeTorrent === false) {
                            util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                        }
                        torrentHash = chooseMag.magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                        mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (items.length > 0) {
                                ret_obj['id'] = items[0]._id;
                            } else {
                                ret_obj['magnet'] = chooseMag.magnet;
                            }
                            setTimeout(function(){
                                callback(null, ret_obj, eItems[0].is_end, eItems[0].list.length);
                            }, 0);
                        });
                    }
                    function recur_check(mIndex) {
                        encodeTorrent = util.isValidString(eItems[0].list[index-1][mIndex].magnet, 'url');
                        if (encodeTorrent === false) {
                            util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                        }
                        torrentHash = eItems[0].list[index-1][mIndex].magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                        mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if (items.length > 0) {
                                ret_obj['id'] = items[0]._id;
                                ret_obj['title'] = eItems[0].list[index-1][mIndex].name;
                                setTimeout(function(){
                                    callback(null, ret_obj, eItems[0].is_end, eItems[0].list.length);
                                }, 0);
                            } else {
                                mIndex++;
                                if (mIndex < eItems[0].list[index-1].length) {
                                    recur_check(mIndex);
                                } else {
                                    ret_obj['title'] = chooseMag.name;
                                    encodeTorrent = util.isValidString(chooseMag.magnet, 'url');
                                    if (encodeTorrent === false) {
                                        util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                                    }
                                    torrentHash = chooseMag.magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                                    mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                        if (err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        if (items.length > 0) {
                                            ret_obj['id'] = items[0]._id;
                                        } else {
                                            ret_obj['magnet'] = chooseMag.magnet;
                                        }
                                        setTimeout(function(){
                                            callback(null, ret_obj, eItems[0].is_end, eItems[0].list.length);
                                        }, 0);
                                    });
                                }
                            }
                        });
                    }
                    if (eItems[0].etime < (new Date().getTime()/1000)) {
                        eztvGetlist(function(err, list, is_end) {
                            if (err) {
                                util.handleError(err);
                            }
                            var data = {list: list, is_end: is_end, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                            mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                if(err) {
                                    util.handleError(err);
                                }
                                console.log('update ok');
                            });
                        });
                    }
                } else {
                    eztvGetlist(function(err, list, is_end) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {list: list, is_end: is_end, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            if (!list[index-1]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            var choose = -1;
                            var cSize = 0;
                            for (var i in list[index-1]) {
                                if (list[index-1][i].size > cSize) {
                                    choose = i;
                                    cSize = list[index-1][i].size;
                                }
                            }
                            var chooseMag = list[index-1].splice(choose, 1);
                            chooseMag = chooseMag[0];
                            var encodeTorrent = false;
                            var torrentHash = null;
                            var ret_obj = {index: index, showId: index, is_magnet: true, complete: false};
                            if (list[index-1].length > 1) {
                                recur_check2(0);
                            } else {
                                ret_obj['title'] = chooseMag.name;
                                encodeTorrent = util.isValidString(chooseMag.magnet, 'url');
                                if (encodeTorrent === false) {
                                    util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                                }
                                torrentHash = chooseMag.magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                                mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    if (items.length > 0) {
                                        ret_obj['id'] = items[0]._id;
                                    } else {
                                        ret_obj['magnet'] = chooseMag.magnet;
                                    }
                                    setTimeout(function(){
                                        callback(null, ret_obj, is_end, list.length);
                                    }, 0);
                                });
                            }
                            function recur_check2(mIndex) {
                                encodeTorrent = util.isValidString(list[index-1][mIndex].magnet, 'url');
                                if (encodeTorrent === false) {
                                    util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                                }
                                torrentHash = list[index-1][mIndex].magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                                mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    if (items.length > 0) {
                                        ret_obj['id'] = items[0]._id;
                                        ret_obj['title'] = list[index-1][mIndex].name;
                                        setTimeout(function(){
                                            callback(null, ret_obj, is_end, list.length);
                                        }, 0);
                                    } else {
                                        mIndex++;
                                        if (mIndex < list[index-1].length) {
                                            recur_check2(mIndex);
                                        } else {
                                            ret_obj['title'] = chooseMag.name;
                                            encodeTorrent = util.isValidString(chooseMag.magnet, 'url');
                                            if (encodeTorrent === false) {
                                                util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                                            }
                                            torrentHash = chooseMag.magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                                            mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                                if (err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                if (items.length > 0) {
                                                    ret_obj['id'] = items[0]._id;
                                                } else {
                                                    ret_obj['magnet'] = chooseMag.magnet;
                                                }
                                                setTimeout(function(){
                                                    callback(null, ret_obj, is_end, list.length);
                                                }, 0);
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            });
            function eztvGetlist(callback2) {
                if (url.match(/^https:\/\/eztv\.ag\/search\//)) {
                    console.log('start more');
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback2, callback2);
                        }
                        var is_end = false;
                        var show_name = url.match(/([^\/]+)$/);
                        if (!show_name) {
                            util.handleError({hoerror: 2, message: 'unknown name!!!'}, callback2, callback2);
                        }
                        var show_name_s = show_name[1].replace(/\-/g, ' ');
                        console.log(show_name_s);
                        var pattern = new RegExp('<a href="magnet:\\?xt=urn:btih:[^"]+".*?class="magnet" title="' + show_name_s + '.+?( Torrent:)? Magnet Link"[\\s\\S]+?\\d+(\\.\\d+)? [MG]B<\\/td>', 'ig');
                        console.log(pattern);
                        var raw_list = raw_data.match(pattern);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'empty list'}, callback2, callback2);
                        }
                        var list = [];
                        var list_match = false;
                        var episode_match = false;
                        var season = -1;
                        var size = 0;
                        var ll = 0;
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/^<a href="(magnet:\?xt=urn:btih:[^"]+)".*?class="magnet" title="(.+?)( Torrent:)? Magnet Link"[\s\S]+?(\d+(\.\d+)?) ([MG])B<\/td>/);
                            if (list_match) {
                                episode_match = list_match[2].match(/ S?(\d+)[XE](\d+) /i);
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
                                    if (list_match[6] === 'G') {
                                        size = Number(list_match[4])*1000;
                                    } else {
                                        size = Number(list_match[4]);
                                    }
                                    var sIndex = -1;
                                    for (var j = 0, len = list.length; j < len; j++) {
                                        if (list[j][0]['season'] === season) {
                                            sIndex = j;
                                            break;
                                        }
                                    }
                                    if (sIndex === -1) {
                                        for (var j = 0, len = list.length; j < len; j++) {
                                            if (list[j][0]['season'] > season) {
                                                list.splice(j, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                                break;
                                            }
                                        }
                                        if (j === len) {
                                            list.splice(len, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                        }
                                    } else {
                                        ll = list[j].length;
                                        if (list[j][ll-1].size <= 2000 && size <= 2000) {
                                            list[j].push({magnet: list_match[1], name: list_match[2], season: season, size: size});
                                        } else if (list[j][ll-1].size > 2000 && size > 2000) {
                                            if (list[j][ll-1].size > size) {
                                                list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                            }
                                        } else if (size <= 2000) {
                                            list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                        }
                                    }
                                }
                            }
                        }
                        if (!list[index-1]) {
                            util.handleError({hoerror: 2, message: 'cannot find external index'}, callback2, callback2);
                        }
                        setTimeout(function(){
                            callback2(null, list, is_end);
                        }, 0);
                    }, 60000, false, false, 'https://eztv.ag/');
                } else {
                    api.xuiteDownload(url, '', function(err, raw_data) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback2, callback2);
                        }
                        var status = raw_data.match(/Status: <b>([^<]+)<\/b>/);
                        var is_end = false;
                        if (!status) {
                            util.handleError({hoerror: 2, message: 'unknown status!!!'}, callback2, callback2);
                        }
                        if (status[1] === 'Ended') {
                            is_end = true;
                        }
                        var show_name = url.match(/^https:\/\/[^\/]+\/shows\/\d+\/([^\/]+)/);
                        if (!show_name) {
                            util.handleError({hoerror: 2, message: 'unknown name!!!'}, callback2, callback2);
                        }
                        var show_name_s = show_name[1].replace(/\-/g, ' ');
                        console.log(show_name_s);
                        var test_list = raw_data.match(/\d+(\.\d+)? [MG]B<\/td>/g);
                        var raw_list = raw_data.match(/<a href="magnet:\?xt=urn:btih:[^"]+".*?class="magnet" title=".+?( Torrent:)? Magnet Link"[\s\S]+?\d+(\.\d+)? [MG]B<\/td>/g);
                        var list = [];
                        var list_match = false;
                        var episode_match = false;
                        var season = -1;
                        var size = 0;
                        if (raw_list) {
                            console.log(raw_list.length);
                            if (test_list.length < 100) {
                                for (var i in raw_list) {
                                    list_match = raw_list[i].match(/^<a href="(magnet:\?xt=urn:btih:[^"]+)".*?class="magnet" title="(.+?)( Torrent:)? Magnet Link"[\s\S]+?(\d+(\.\d+)?) ([MG])B<\/td>/);
                                    if (list_match) {
                                        episode_match = list_match[2].match(/ S?(\d+)[XE](\d+) /i);
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
                                            if (list_match[6] === 'G') {
                                                size = Number(list_match[4])*1000;
                                            } else {
                                                size = Number(list_match[4]);
                                            }
                                            var sIndex = -1;
                                            for (var j = 0, len = list.length; j < len; j++) {
                                                if (list[j][0]['season'] === season) {
                                                    sIndex = j;
                                                    break;
                                                }
                                            }
                                            if (sIndex === -1) {
                                                for (var j = 0, len = list.length; j < len; j++) {
                                                    if (list[j][0]['season'] > season) {
                                                        list.splice(j, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                                        break;
                                                    }
                                                }
                                                if (j === len) {
                                                    list.splice(len, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                                }
                                            } else {
                                                ll = list[j].length;
                                                if (list[j][ll-1].size <= 2000 && size <= 2000) {
                                                    list[j].push({magnet: list_match[1], name: list_match[2], season: season, size: size});
                                                } else if (list[j][ll-1].size > 2000 && size > 2000) {
                                                    if (list[j][ll-1].size > size) {
                                                        list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                                    }
                                                } else if (size <= 2000) {
                                                    list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!list[index-1]) {
                                    util.handleError({hoerror: 2, message: 'cannot find external index'}, callback2, callback2);
                                }
                                setTimeout(function(){
                                    callback2(null, list, is_end);
                                }, 0);
                            } else {
                                var is_more = false;
                                console.log('too much');
                                api.xuiteDownload('https://eztv.ag/search/' + show_name[1], '', function(err, more_data) {
                                    if (err) {
                                        err.hoerror = 2;
                                        util.handleError(err, callback2, callback2);
                                    }
                                    var pattern = new RegExp('<a href="magnet:\\?xt=urn:btih:[^"]+".*?class="magnet" title="' + show_name_s + '.+?( Torrent:)? Magnet Link"[\\s\\S]+?\\d+(\\.\\d+)? [MG]B<\\/td>', 'ig');
                                    console.log(pattern);
                                    var raw_list_m = more_data.match(pattern);
                                    if (raw_list_m) {
                                        console.log(raw_list_m.length);
                                    } else {
                                        console.log('more empty');
                                        raw_list_m = [];
                                    }
                                    if (raw_list_m.length > raw_list.length) {
                                        is_more = true;
                                        raw_list = raw_list_m;
                                    }
                                    for (var i in raw_list) {
                                        list_match = raw_list[i].match(/^<a href="(magnet:\?xt=urn:btih:[^"]+)".*?class="magnet" title="(.+?)( Torrent:)? Magnet Link"[\s\S]+?(\d+(\.\d+)?) ([MG])B<\/td>/);
                                        if (list_match) {
                                            episode_match = list_match[2].match(/ S?(\d+)[XE](\d+) /i);
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
                                                if (list_match[6] === 'G') {
                                                    size = Number(list_match[4])*1000;
                                                } else {
                                                    size = Number(list_match[4]);
                                                }
                                                var sIndex = -1;
                                                for (var j = 0, len = list.length; j < len; j++) {
                                                    if (list[j][0]['season'] === season) {
                                                        sIndex = j;
                                                        break;
                                                    }
                                                }
                                                if (sIndex === -1) {
                                                    for (var j = 0, len = list.length; j < len; j++) {
                                                        if (list[j][0]['season'] > season) {
                                                            list.splice(j, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                                            break;
                                                        }
                                                    }
                                                    if (j === len) {
                                                        list.splice(len, 0, [{magnet: list_match[1], name: list_match[2], season: season, size: size}]);
                                                    }
                                                } else {
                                                    ll = list[j].length;
                                                    if (list[j][ll-1].size <= 2000 && size <= 2000) {
                                                        list[j].push({magnet: list_match[1], name: list_match[2], season: season, size: size});
                                                    } else if (list[j][ll-1].size > 2000 && size > 2000) {
                                                        if (list[j][ll-1].size > size) {
                                                            list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                                        }
                                                    } else if (size <= 2000) {
                                                        list[j][ll-1] = {magnet: list_match[1], name: list_match[2], season: season, size: size};
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!list[index-1]) {
                                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback2, callback2);
                                    }
                                    setTimeout(function(){
                                        callback2(null, list, is_end);
                                    }, 0);
                                }, 60000, false, false, 'https://eztv.ag/');
                            }
                        } else {
                            util.handleError({hoerror: 2, message: 'empty list'}, callback2, callback2);
                        }
                    }, 60000, false, false, 'https://eztv.ag/');
                }
            }
            break;
            case 'kubo':
            //bj58 fun58 drive youtube dl fun23 bilibili
            //bj wd youku
            //bj11 fun10 tudou
            //bj6 fun3 qq
            //bj5 fun1 letv
            //bj8 fun9 funshion
            //bj7 fun5 sohu
            //bj10 fun8 iqiyi f4v
            //bj12 fun19 pptv x
            //bj9 fun7 pps x
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    var ret_obj = null;
                    if (eItems[0].list[index-1].type) {
                        if (sub_index > eItems[0].list[index-1].ids.length) {
                            sub_index = 1;
                        }
                        var rid = false;
                        if (eItems[0].list[index-1].type === 2) {
                            rid = 'dym_' + eItems[0].list[index-1].ids[sub_index-1];
                        } else if (eItems[0].list[index-1].type === 17) {
                            rid = 'bil_av' + eItems[0].list[index-1].ids[sub_index-1];
                        } else {
                            rid = 'you_' + eItems[0].list[index-1].ids[sub_index-1];
                        }
                        ret_obj = {id: rid, title: eItems[0].list[index-1].name};
                        if (eItems[0].list[index-1].ids.length > 1) {
                            ret_obj.sub = eItems[0].list[index-1].ids.length;
                            index = (index*1000 + sub_index)/1000;
                        }
                        ret_obj.index = index;
                        ret_obj.showId = index;
                    } else {
                        ret_obj = {index: index, showId: index, title: eItems[0].list[index-1].name, id: eItems[0].list[index-1].id};
                        if (eItems[0].list[index-1].id.match(/^(yuk|soh)_/)) {
                            ret_obj.index = ret_obj.showId = (index*1000 + sub_index)/1000;
                        }
                    }
                    setTimeout(function(){
                        callback(null, ret_obj, eItems[0].is_end, eItems[0].list.length);
                    }, 0);
                    if (eItems[0].etime < (new Date().getTime()/1000)) {
                        kuboGetlist(function(err, list, is_end) {
                            if (err) {
                                util.handleError(err);
                            }
                            var data = {list: list, is_end: is_end, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                            mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                if(err) {
                                    util.handleError(err);
                                }
                                console.log('update ok');
                            });
                        });
                    }
                } else {
                    kuboGetlist(function(err, list, is_end) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {list: list, is_end: is_end, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            if (!list[index-1]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            var ret_obj = null;
                            if (list[index-1].type) {
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
                                ret_obj = {id: rid, title: list[index-1].name};
                                if (list[index-1].ids.length > 1) {
                                    ret_obj.sub = list[index-1].ids.length;
                                    index = (index*1000 + sub_index)/1000;
                                }
                                ret_obj.index = index;
                                ret_obj.showId = index;
                            } else {
                                ret_obj = {index: index, showId: index, title: list[index-1].name, id: list[index-1].id};
                                if (list[index-1].id.match(/^(yuk|soh)_/)) {
                                    ret_obj.index = ret_obj.showId = (index*1000 + sub_index)/1000;
                                }
                            }
                            setTimeout(function(){
                                callback(null, ret_obj, is_end, list.length);
                            }, 0);
                        });
                    });
                }
            });
            function kuboGetlist(callback2) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
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
                        setTimeout(function(){
                            callback2(null, list, is_end);
                        }, 0);
                    } else {
                        flv_url = raw_data.match(/id="\d_FLV(58||11|6|5|8|7)">[\s\S]+?href="([^"]+)/);
                        if (!flv_url) {
                            util.handleError({hoerror: 2, message: 'no source'}, callback2, callback2);
                        }
                        if (!flv_url[2].match(/^(https|http):\/\//)) {
                            if (flv_url[2].match(/^\//)) {
                                flv_url[2] = 'http://www.123kubo.com' + flv_url[2];
                            } else {
                                flv_url[2] = 'http://www.123kubo.com/' + flv_url[2];
                            }
                        }
                        console.log(flv_url[2]);
                        api.xuiteDownload(flv_url[2], '', function(err, flv_data) {
                            if (err) {
                                err.hoerror = 2;
                                util.handleError(err, callback2, callback2);
                            }
                            var eval_data = flv_data.match(/>(eval\(.*)/);
                            if (!eval_data) {
                                util.handleError({hoerror: 2, message: 'empty list'}, callback2, callback2);
                            }
                            eval(eval_data[1]);
                            var raw_multi_list = ff_urls;
                            var ret_list = driveSource();
                            if (!ret_list) {
                                ret_list = youkuSource();
                                if (!ret_list) {
                                    ret_obj = otherSource();
                                    if (!ret_list) {
                                        util.handleError({hoerror: 2, message: 'not flv'}, callback2, callback2);
                                    }
                                }
                            }
                            setTimeout(function(){
                                callback2(null, ret_list, is_end);
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
                                        list.push({name: list_match[1], id: 'kdr_' + new Buffer(list_match[2]).toString('base64')});
                                    }
                                }
                                if (list.length > 0) {
                                    if (!list[index-1]) {
                                        return false;
                                    }
                                    return list;
                                } else {
                                    for (var i in raw_list) {
                                        list_match = raw_list[i].match(/^\["([^"]+)","([^_]+)_wd1"/);
                                        if (list_match) {
                                            list.push({name: list_match[1], id: 'yuk_' + list_match[2] + '_' + sub_index});
                                        }
                                    }
                                    if (list.length > 0) {
                                        if (!list[index-1]) {
                                            return false;
                                        }
                                        return list;
                                    } else {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun23_video\/([^"]+)\/"/);
                                            if (list_match) {
                                                list.push({name: list_match[1], id: 'bil_' + list_match[2]});
                                            }
                                        }
                                        if (list.length > 0) {
                                            if (!list[index-1]) {
                                                return false;
                                            }
                                            return list;
                                        } else {
                                            for (var i in raw_list) {
                                                list_match = raw_list[i].match(/^\["([^"]+)","FunCnd1_([^"]+)"/);
                                                if (list_match) {
                                                    list.push({name: list_match[1], id: 'fc1_' + list_match[2]});
                                                }
                                                return list;
                                            }
                                        }
                                    }
                                }
                            }
                            function youkuSource() {
                                var flv_list = raw_multi_list.match(/"bj".*?\}/);
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
                                    list_match = raw_list[i].match(/^\["([^"]+)","([^_]+)_wd1"/);
                                    if (list_match) {
                                        list.push({name: list_match[1], id: 'yuk_' + list_match[2] + '_' + sub_index});
                                    }
                                }
                                if (!list[index-1]) {
                                    return false;
                                }
                                return list;
                            }
                            function otherSource() {
                                var flv_list11 = raw_multi_list.match(/"bj11".*?\}/);
                                var flv_list6 = raw_multi_list.match(/"bj6".*?\}/);
                                var flv_list5 = raw_multi_list.match(/"bj5".*?\}/);
                                var flv_list8 = raw_multi_list.match(/"bj8".*?\}/);
                                var flv_list7 = raw_multi_list.match(/"bj7".*?\}/);
                                if (!flv_list11 && !flv_list6 && !flv_list5 && !flv_list8 && !flv_list7) {
                                    return false;
                                }
                                var list11 = [];
                                var list6 = [];
                                var list5 = [];
                                var list8 = [];
                                var list7 = [];
                                var list_match = false;
                                var raw_list = false;
                                if (flv_list11) {
                                    raw_list = flv_list11[0].match(/\[[^\[\]]+\]/g);
                                    if (raw_list) {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun10_([^\/]+)\/([^\/]+)\.[^"]+"/);
                                            if (list_match) {
                                                list11.push({name: list_match[1], id: 'tud_' + list_match[2] + '_' + list_match[3]});
                                            }
                                        }
                                    }
                                }
                                if (flv_list6) {
                                    raw_list = flv_list6[0].match(/\[[^\[\]]+\]/g);
                                    if (raw_list) {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun3_([^\/]+)\/([^\/]+)\/([^\.]+)\.[^"]+"/);
                                            if (list_match) {
                                                list6.push({name: list_match[1], id: 'vqq_' + list_match[2] + '_' + list_match[3] + '_' + list_match[4]});
                                            }
                                        }
                                    }
                                }
                                if (flv_list5) {
                                    raw_list = flv_list5[0].match(/\[[^\[\]]+\]/g);
                                    if (raw_list) {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun1_([^\.]+)\.[^"]+"/);
                                            if (list_match) {
                                                list5.push({name: list_match[1], id: 'let_' + list_match[2]});
                                            }
                                        }
                                    }
                                }
                                if (flv_list8) {
                                    raw_list = flv_list8[0].match(/\[[^\[\]]+\]/g);
                                    if (raw_list) {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun9_([^\.]+)\.([^"]+)"/);
                                            if (list_match) {
                                                list8.push({name: list_match[1], id: 'fun_m_' + list_match[2] + '_' + list_match[3]});
                                            }
                                        }
                                    }
                                }
                                if (flv_list7) {
                                    raw_list = flv_list7[0].match(/\[[^\[\]]+\]/g);
                                    if (raw_list) {
                                        for (var i in raw_list) {
                                            list_match = raw_list[i].match(/^\["([^"]+)","fun5_(\d+)\/([^\.]+)\.[^"]+"/);
                                            if (list_match) {
                                                list7.push({name: list_match[1], id: 'soh_' + list_match[2] + '_' + list_match[3] + '_' + sub_index});
                                            }
                                        }
                                    }
                                }
                                var list = list11;
                                var is_sub = false;
                                if (list6.length > list.length) {
                                    list = list6;
                                }
                                if (list5.length > list.length) {
                                    list = list5;
                                }
                                if (list8.length > list.length) {
                                    list = list8;
                                }
                                if (list7.length > list.length) {
                                    list = list7;
                                    //is_sub = true;
                                }
                                console.log(list11.length);
                                console.log(list6.length);
                                console.log(list5.length);
                                console.log(list8.length);
                                console.log(list7.length);
                                if (!list[index-1]) {
                                    return false;
                                }
                                return list;
                            }
                        }, 60000, false, false, 'http://www.123kubo.com/');
                    }
                }, 60000, false, false, 'http://www.123kubo.com/');
            }
            break;
            case 'youtube':
            var youtube_id = false;
            youtube_id = url.match(/list=([^&]+)/);
            if (youtube_id) {
                this.youtubePlaylist(youtube_id[1], index, function(err, obj, is_end, total, obj_arr, pageN, pageP, pageToken, is_new) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null, obj, false, total, obj_arr, pageN, pageP, pageToken, is_new);
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
            case 'yify':
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    var ret_obj = {index: 1, showId: 1, title: eItems[0].show_name, is_magnet: true, complete: false};
                    var encodeTorrent = util.isValidString(eItems[0].magnet, 'url');
                    if (encodeTorrent === false) {
                        util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                    }
                    var torrentHash = eItems[0].magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                    mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        if (items.length > 0) {
                            ret_obj['id'] = items[0]._id;
                        } else {
                            ret_obj['magnet'] = eItems[0].magnet;
                        }
                        setTimeout(function(){
                            callback(null, ret_obj, false, 1);
                        }, 0);
                        if (eItems[0].etime < (new Date().getTime()/1000)) {
                            yifyGetlist(function(err, magnet, show_name) {
                                if (err) {
                                    util.handleError(err);
                                }
                                var data = {magnet: magnet, show_name: show_name, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                                mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                    if(err) {
                                        util.handleError(err);
                                    }
                                    console.log('update ok');
                                });
                            });
                        }
                    });
                } else {
                    yifyGetlist(function(err, magnet, show_name) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {magnet: magnet, show_name: show_name, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            var ret_obj = {index: 1, showId: 1, title: show_name, is_magnet: true, complete: false};
                            var encodeTorrent = util.isValidString(magnet, 'url');
                            if (encodeTorrent === false) {
                                util.handleError({hoerror: 2, message: "magnet is not vaild"}, callback, callback);
                            }
                            var torrentHash = magnet.match(/^magnet:[^&]+/)[0].match(/[^:]+$/);
                            mongo.orig("find", "storage", {magnet: {$regex: torrentHash[0], $options: 'i'}}, {limit: 1}, function(err, items){
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                if (items.length > 0) {
                                    ret_obj['id'] = items[0]._id;
                                } else {
                                    ret_obj['magnet'] = magnet;
                                }
                                setTimeout(function(){
                                    callback(null, ret_obj, false, 1);
                                }, 0);
                            });
                        });
                    });
                }
            });
            function yifyGetlist(callback2) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
                    }
                    var json_data = null;
                    try {
                        json_data = JSON.parse(raw_data);
                    } catch (x) {
                        console.log(raw_data);
                        util.handleError({hoerror: 2, message: 'json parse error'}, callback2, callback2);
                    }
                    if (json_data['status'] !== 'ok' || !json_data['data']['movie']) {
                        util.handleError({hoerror: 2, message: 'yify api fail'}, callback2, callback2);
                    }
                    var show_name = json_data['data']['movie']['title'];
                    var magnet = null;
                    for (var i in json_data['data']['movie']['torrents']) {
                        if (json_data['data']['movie']['torrents'][i]['quality'] === '1080p' || (!magnet && json_data['data']['movie']['torrents'][i]['quality'] === '720p')) {
                            magnet = 'magnet:?xt=urn:btih:' + json_data['data']['movie']['torrents'][i]['hash'] + '&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969';
                        }
                    }
                    setTimeout(function(){
                        callback2(null, magnet, show_name);
                    }, 0);
                }, 60000, false, false, 'https://yts.ag/');
            }
            break;
            case 'comic99':
            var c99_id = url.match(/\d+/);
            if (!c99_id) {
                util.handleError({hoerror: 2, message: 'comic id invalid'}, callback, callback);
            }
            var is_end = false;
            c99_id = c99_id[0];
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].raw_list || !eItems[0].raw_list[eItems[0].raw_list.length - index]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    var info = eItems[0].raw_list[eItems[0].raw_list.length - index].match(/href='([^']+)'>([^<]+)/);
                    if (!info) {
                        util.handleError({hoerror: 2, message: 'comic info unknown'}, callback, callback);
                    }
                    var url_s = null;
                    if (!info[1].match(/^(https|http):\/\//)) {
                        if (info[1].match(/^\//)) {
                            url_s = 'http://www.99comic.com' + info[1];
                        } else {
                            url_s = 'http://www.99comic.com/' + info[1];
                        }
                    } else {
                        url_s = info[1];
                    }
                    api.xuiteDownload(url_s, '', function(err, raw_data_s) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        comic_data = raw_data_s.match(/var sFiles="([^"]+)";var sPath="(\d+)/);
                        var pre_list = comic_data[1].split('|');
                        var pre = Number(comic_data[2]);
                        var ret = {title: info[2], pre_url: comic99_pre[pre-1], sub: pre_list.length, pre_obj: pre_list};
                        ret.index = ret.showId = (index*1000 + sub_index)/1000;
                        setTimeout(function(){
                            callback(null, ret, eItems[0].is_end, eItems[0].raw_list.length);
                        }, 0);
                        if (eItems[0].etime < (new Date().getTime()/1000)) {
                            c99Getlist(function(err, raw_list, is_end) {
                                if (err) {
                                    util.handleError(err);
                                }
                                var data = {raw_list: raw_list, is_end: is_end, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                                mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                    if(err) {
                                        util.handleError(err);
                                    }
                                    console.log('update ok');
                                });
                            });
                        }
                    }, 60000, false, false, 'http://www.99comic.com/');
                } else {
                    c99Getlist(function(err, raw_list, is_end) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {raw_list: raw_list, is_end: is_end, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            if (!raw_list || !raw_list[raw_list.length - index]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            var info = raw_list[raw_list.length - index].match(/href='([^']+)'>([^<]+)/);
                            if (!info) {
                                util.handleError({hoerror: 2, message: 'comic info unknown'}, callback, callback);
                            }
                            var url_s = null;
                            if (!info[1].match(/^(https|http):\/\//)) {
                                if (info[1].match(/^\//)) {
                                    url_s = 'http://www.99comic.com' + info[1];
                                } else {
                                    url_s = 'http://www.99comic.com/' + info[1];
                                }
                            } else {
                                url_s = info[1];
                            }
                            api.xuiteDownload(url_s, '', function(err, raw_data_s) {
                                if (err) {
                                    err.hoerror = 2;
                                    util.handleError(err, callback, callback);
                                }
                                comic_data = raw_data_s.match(/var sFiles="([^"]+)";var sPath="(\d+)/);
                                var pre_list = comic_data[1].split('|');
                                var pre = Number(comic_data[2]);
                                var ret = {title: info[2], pre_url: comic99_pre[pre-1], sub: pre_list.length, pre_obj: pre_list};
                                ret.index = ret.showId = (index*1000 + sub_index)/1000;
                                setTimeout(function(){
                                    callback(null, ret, is_end, raw_list.length);
                                }, 0);
                            }, 60000, false, false, 'http://www.99comic.com/');
                        });
                    });
                }
            });
            function c99Getlist(callback2) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
                    }
                    if (raw_data.match(/<b class="red">完結<\/b>/)) {
                        is_end = true;
                    }
                    var comic_data = raw_data.match(/<div class='cVolList'>.*/);
                    var raw_list = comic_data[0].match(/href='[^']+'>[^<]+/g);
                    setTimeout(function(){
                        callback2(null, raw_list, is_end);
                    }, 0);
                }, 60000, false, false, 'http://www.99comic.com/');
            }
            break;
            case 'cartoonmad':
            var mad_id = url.match(/\d+/);
            if (!mad_id) {
                util.handleError({hoerror: 2, message: 'comic id invalid'}, callback, callback);
            }
            var is_end = false;
            mad_id = mad_id[0];
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].raw_list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    pattern = new RegExp('^' + '\\/comic\\/' + mad_id + '(\\d\\d\\d\\d)(\\d)(\\d\\d\\d)');
                    var info = eItems[0].raw_list[index-1].match(pattern);
                    if (!info) {
                        util.handleError({hoerror: 2, message: 'comic info unknown'}, callback, callback);
                    }
                    var url_s = null;
                    if (!eItems[0].raw_list[index-1].match(/^(https|http):\/\//)) {
                        if (eItems[0].raw_list[index-1].match(/^\//)) {
                            url_s = 'http://www.cartoomad.com' + eItems[0].raw_list[index-1];
                        } else {
                            url_s = 'http://www.cartoomad.com/' + eItems[0].raw_list[index-1];
                        }
                    } else {
                        url_s = eItems[0].raw_list[index-1];
                    }
                    api.xuiteDownload(url_s, '', function(err, raw_data_s) {
                        if (err) {
                            err.hoerror = 2;
                            util.handleError(err, callback, callback);
                        }
                        pattern = new RegExp('src="(http:\\/\\/.*?\\/' + mad_id + '\\/[^"]+)');
                        var img_url = raw_data_s.match(pattern);
                        if (!img_url) {
                            util.handleError({hoerror: 2, message: 'comic url unknown'}, callback, callback);
                        }
                        img_url = img_url[1].match(/^(.*?)[^\/]+$/);
                        var title = '第' + info[1] + '卷';
                        if (info[2] === '2') {
                            title = '第' + info[1] + '話';
                        }
                        var sub = Number(info[3]);
                        var pre_list = [];
                        for (var i = 1; i <= sub; i++) {
                            if (i < 10) {
                                pre_list.push('00' + i + '.jpg');
                            } else if (i < 100) {
                                pre_list.push('0' + i + '.jpg');
                            } else {
                                pre_list.push(i + '.jpg');
                            }
                        }
                        var ret = {title: title, pre_url: img_url[1], sub: sub, pre_obj: pre_list};
                        ret.index = ret.showId = (index*1000 + sub_index)/1000;
                        setTimeout(function(){
                            callback(null, ret, eItems[0].is_end, eItems[0].raw_list.length);
                        }, 0);
                        if (eItems[0].etime < (new Date().getTime()/1000)) {
                            madGetlist(function(err, raw_list, is_end) {
                                if (err) {
                                    util.handleError(err);
                                }
                                var data = {raw_list: raw_list, is_end: is_end, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                                mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                    if(err) {
                                        util.handleError(err);
                                    }
                                    console.log('update ok');
                                });
                            });
                        }
                    }, 60000, false, false, 'http://www.cartoonmad.com/', true);
                } else {
                    madGetlist(function(err, raw_list, is_end) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {raw_list: raw_list, is_end: is_end, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            if (!raw_list[index-1]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            pattern = new RegExp('^' + '\\/comic\\/' + mad_id + '(\\d\\d\\d\\d)(\\d)(\\d\\d\\d)');
                            var info = raw_list[index-1].match(pattern);
                            if (!info) {
                                util.handleError({hoerror: 2, message: 'comic info unknown'}, callback, callback);
                            }
                            var url_s = null;
                            if (!raw_list[index-1].match(/^(https|http):\/\//)) {
                                if (raw_list[index-1].match(/^\//)) {
                                    url_s = 'http://www.cartoomad.com' + raw_list[index-1];
                                } else {
                                    url_s = 'http://www.cartoomad.com/' + raw_list[index-1];
                                }
                            } else {
                                url_s = raw_list[index-1];
                            }
                            api.xuiteDownload(url_s, '', function(err, raw_data_s) {
                                if (err) {
                                    err.hoerror = 2;
                                    util.handleError(err, callback, callback);
                                }
                                pattern = new RegExp('src="(http:\\/\\/.*?\\/' + mad_id + '\\/[^"]+)');
                                var img_url = raw_data_s.match(pattern);
                                if (!img_url) {
                                    util.handleError({hoerror: 2, message: 'comic url unknown'}, callback, callback);
                                }
                                img_url = img_url[1].match(/^(.*?)[^\/]+$/);
                                var title = '第' + info[1] + '卷';
                                if (info[2] === '2') {
                                    title = '第' + info[1] + '話';
                                }
                                var sub = Number(info[3]);
                                var pre_list = [];
                                for (var i = 1; i <= sub; i++) {
                                    if (i < 10) {
                                        pre_list.push('00' + i + '.jpg');
                                    } else if (i < 100) {
                                        pre_list.push('0' + i + '.jpg');
                                    } else {
                                        pre_list.push(i + '.jpg');
                                    }
                                }
                                var ret = {title: title, pre_url: img_url[1], sub: sub, pre_obj: pre_list};
                                ret.index = ret.showId = (index*1000 + sub_index)/1000;
                                setTimeout(function(){
                                    callback(null, ret, is_end, raw_list.length);
                                }, 0);
                            }, 60000, false, false, 'http://www.cartoonmad.com/', true);
                        });
                    });
                }
            });
            function madGetlist(callback2) {
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
                    }
                    if (raw_data.match(/http:\/\/img\.cartoonmad\.com\/image\/chap9\.gif/)) {
                        is_end = true;
                    }
                    var pattern = new RegExp('\\/comic\\/' + mad_id + '\\d+\\.html', 'g');
                    var raw_list = raw_data.match(pattern);
                    setTimeout(function(){
                        callback2(null, raw_list, is_end);
                    }, 0);
                }, 60000, false, false, 'http://www.cartoonmad.com/', true);
            }
            break;
            case 'bilibili':
            mongo.orig("find", "externalCache", {url: encodeURIComponent(url)}, {limit: 1}, function(err, eItems){
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if (eItems.length > 0) {
                    if (!eItems[0].list[index-1]) {
                        util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                    }
                    setTimeout(function(){
                        callback(null, {index: index, showId: index, id: eItems[0].list[index-1].id, title: eItems[0].list[index-1].name}, false, eItems[0].list.length);
                    }, 0);
                    if (eItems[0].etime < (new Date().getTime()/1000)) {
                        bilibiliGetlist(function(err, list) {
                            if (err) {
                                util.handleError(err);
                            }
                            var data = {list: list, etime: Math.round(new Date().getTime()/1000) + cache_expire};
                            mongo.orig("update", "externalCache", {url: encodeURIComponent(url)}, {$set: data}, function(err, item3){
                                if(err) {
                                    util.handleError(err);
                                }
                                console.log('update ok');
                            });
                        });
                    }
                } else {
                    bilibiliGetlist(function(err, list) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {list: list, etime: Math.round(new Date().getTime()/1000 + cache_expire), url: encodeURIComponent(url)};
                        mongo.orig("insert", "externalCache", data, function(err, item3){
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(item3);
                            if (!list[index-1]) {
                                util.handleError({hoerror: 2, message: 'cannot find external index'}, callback, callback);
                            }
                            setTimeout(function(){
                                callback(null, {index: index, showId: index, id: list[index-1].id, title: list[index-1].name}, false, list.length);
                            }, 0);
                        });
                    });
                }
            });
            function bilibiliGetlist(callback2) {
                var bili_id = url.match(/(av)?\d+/);
                if (!bili_id) {
                    util.handleError({hoerror: 2, message: 'bilibili id invalid'}, callback2, callback2);
                }
                api.xuiteDownload(url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback2, callback2);
                    }
                    var raw_list = false;
                    var list = [];
                    var list_match = false;
                    if (bili_id[1]) {
                        var pattern = new RegExp("<option value='\\/video\\/" + bili_id[0] + "\\/index_\\d+\\.html'>[^<]+", 'g');
                        raw_list = raw_data.match(pattern);
                        if (!raw_list) {
                            index = 1;
                            list.push({id: 'bil_' + bili_id[0], name: 'bil'});
                        } else {
                            pattern = new RegExp('^' + "<option value='\\/video\\/(" + bili_id[0] + ")\\/index_(\\d+)\\.html'>([^<]+)" + '$');
                            for (var i in raw_list) {
                                list_match = raw_list[i].match(pattern);
                                if (list_match) {
                                    list.push({id: 'bil_' + list_match[1] + '_' + list_match[2], name: list_match[3]});
                                }
                            }
                        }
                    } else {
                        raw_list = raw_data.match(/class="e-item("|-l")[\s\S]+?a href="\/video\/[^>]+/g);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'empty list'}, callback2, callback2);
                        }
                        for (var i in raw_list) {
                            list_match = raw_list[i].match(/a href="\/video\/(av\d+)\/(index_(\d+)\.html)?.*?title="([^"]*)/);
                            if (list_match) {
                                if (list_match[3]) {
                                    list.splice(0, 0, {id: 'bil_' + list_match[1] + '_' + list_match[3], name: list_match[4]});
                                } else {
                                    list.splice(0, 0, {id: 'bil_' + list_match[1], name: list_match[4]});
                                }
                            }
                        }
                    }
                    if (!list[index-1]) {
                        util.handleError({hoerror: 2, message: 'index invaild'}, callback2, callback2);
                    }
                    setTimeout(function(){
                        callback2(null, list);
                    }, 0);
                }, 60000, false, false, 'http://www.bilibili.com/', true);
            }
            break;
        default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    youtubePlaylist: function(id, index, callback, pageToken, back) {
        var query = {id: id};
        if (pageToken) {
            query['pageToken'] = pageToken;
        }
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
            var is_new = true;
            if (index === 1) {
                is_new = false;
            } else {
                for (var i in vId_arr) {
                    if (vId_arr[i].id === index) {
                        ret_obj = vId_arr[i];
                        is_new = false;
                        break;
                    }
                }
            }
            setTimeout(function(){
                callback(null, ret_obj, false, total, vId_arr, nPageToken, pPageToken, pageToken, is_new);
            }, 0);
        });
    },
    parseTagUrl: function(type, url, callback) {
        var taglist = [];
        switch (type) {
            case 'imdb':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/<title>(.*?) \((\d\d\d\d)\) - IMDb<\/title>/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                    if (taglist.indexOf(raw_list[2].toLowerCase()) === -1) {
                        taglist.push(raw_list[2].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/<span itemprop="director"[\s\S]+?<\/span>/g);
                if (raw_list) {
                    for (var i in raw_list) {
                        match_list = raw_list[i].match(/([^>]+)<\/span>/);
                        if (match_list) {
                            if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                                taglist.push(match_list[1].toLowerCase());
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/<span itemprop="creator"[\s\S]+?<\/span>/g);
                if (raw_list) {
                    for (var i in raw_list) {
                        match_list = raw_list[i].match(/([^>]+)<\/span>/);
                        if (match_list) {
                            if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                                taglist.push(match_list[1].toLowerCase());
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/<span itemprop="actors"[\s\S]+?<\/span>/g);
                if (raw_list) {
                    for (var i in raw_list) {
                        match_list = raw_list[i].match(/([^>]+)<\/span>/);
                        if (match_list) {
                            if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                                taglist.push(match_list[1].toLowerCase());
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/<h4.*?>Country:[\s\S]+?<\/a>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/([^>]+)<\/a>/);
                    if (match_list) {
                        if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                            taglist.push(match_list[1].toLowerCase());
                        }
                    }
                }
                raw_list = raw_data.match(/<h4.*?>Genres:[\s\S]+?<\/div>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/[^>]+<\/a>/g);
                    if (match_list) {
                        for (var i in match_list) {
                            match_item = match_list[i].match(/[a-zA-Z\-]+/);
                            if (match_item) {
                                match_item = match_item[0].toLowerCase();
                                if (genre_list.indexOf(match_item) !== -1) {
                                    if (taglist.indexOf(match_item) === -1) {
                                        taglist.push(match_item);
                                    }
                                    if (taglist.indexOf(genre_list_ch[genre_list.indexOf(match_item)]) === -1) {
                                        taglist.push(genre_list_ch[genre_list.indexOf(match_item)]);
                                    }
                                } else {
                                    if (taglist.indexOf(match_item) === -1) {
                                        taglist.push(match_item);
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            case 'steam':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                taglist.push('遊戲');
                taglist.push('game');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/<b>Title:<\/b> (.*?)<br>/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/<b>Release Date:<\/b> \d?\d [a-zA-Z][a-zA-Z][a-zA-Z], (\d\d\d\d)<br>/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/<b>Genre:<\/b>.*<br>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/[^>]+<\/a>/g);
                    if (match_list) {
                        for (var i in match_list) {
                            match_item = match_list[i].match(/[^<]+/);
                            if (match_item) {
                                match_item = match_item[0].toLowerCase();
                                if (match_item === 'sports') {
                                    match_item = 'sport';
                                }
                                if (game_list.indexOf(match_item) !== -1) {
                                    if (taglist.indexOf(match_item) === -1) {
                                        taglist.push(match_item);
                                    }
                                    if (taglist.indexOf(game_list_ch[game_list.indexOf(match_item)]) === -1) {
                                        taglist.push(game_list_ch[game_list.indexOf(match_item)]);
                                    }
                                } else {
                                    if (taglist.indexOf(match_item) === -1) {
                                        taglist.push(match_item);
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/<b>Developer:<\/b>[\s\S]+?<br>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/[^>]+<\/a>/g);
                    if (match_list) {
                        for (var i in match_list) {
                            match_item = match_list[i].match(/[^<]+/);
                            if (match_item) {
                                match_item = match_item[0].toLowerCase();
                                if (taglist.indexOf(match_item) === -1) {
                                    taglist.push(match_item);
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/<b>Publisher:<\/b>[\s\S]+?<br>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/[^>]+<\/a>/g);
                    if (match_list) {
                        for (var i in match_list) {
                            match_item = match_list[i].match(/[^<]+/);
                            if (match_item) {
                                match_item = match_item[0].toLowerCase();
                                if (taglist.indexOf(match_item) === -1) {
                                    taglist.push(match_item);
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            case 'allmusic':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                taglist.push('音樂');
                taglist.push('music');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/data-artist="([^"]+)/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                } else {
                    raw_list = raw_data.match(/<title>(.*?) \|/);
                    if (raw_list) {
                        if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                            taglist.push(raw_list[1].toLowerCase());
                        }
                    }
                }
                raw_list = raw_data.match(/data-album="([^"]+)/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/data-release-date="(\d\d\d\d)/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/<h4>Genre<\/h4>[\s\S]+?<\/div>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/[^>]+<\/a>/g);
                    if (match_list) {
                        for (var i in match_list) {
                            match_item = match_list[i].match(/[^<]+/);
                            if (match_item) {
                                match_item = match_item[0].toLowerCase();
                                if (music_list_web.indexOf(match_item) !== -1) {
                                    if (taglist.indexOf(music_list[music_list_web.indexOf(match_item)]) === -1) {
                                        taglist.push(music_list[music_list_web.indexOf(match_item)]);
                                    }
                                } else {
                                    if (taglist.indexOf(match_item) === -1) {
                                        taglist.push(match_item);
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            case 'marvel':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                taglist.push('漫畫');
                taglist.push('comic');
                taglist.push('marvel');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/<title>(.*) - Marvel Database - Wikia<\/title>/i);
                if (raw_list) {
                    match_list = raw_list[1].match(/^(.*) Vol/i);
                    if (match_list) {
                        if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                            taglist.push(match_list[1].toLowerCase());
                        }
                    } else {
                        match_list = raw_list[1].match(/^(.*) \d+/i);
                        if (match_list) {
                            if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                                taglist.push(match_list[1].toLowerCase());
                            }
                        } else {
                            if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                                taglist.push(raw_list[1].toLowerCase());
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>[a-zA-Z]+ \d?\d, (\d\d\d\d)</i);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/>Editor-in-Chief<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'editor-in-chief' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Cover Artists<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'cover artists' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Writers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'writers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Pencilers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'pencilers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Inkers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'inkers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Letterers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'letterers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Editors<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'editors' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            case 'dc':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                taglist.push('漫畫');
                taglist.push('comic');
                taglist.push('dc');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/<title>(.*) - DC Database - Wikia<\/title>/i);
                if (raw_list) {
                    match_list = raw_list[1].match(/^(.*) Vol/i);
                    if (match_list) {
                        if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                            taglist.push(match_list[1].toLowerCase());
                        }
                    } else {
                        match_list = raw_list[1].match(/^(.*) \d+/i);
                        if (match_list) {
                            if (taglist.indexOf(match_list[1].toLowerCase()) === -1) {
                                taglist.push(match_list[1].toLowerCase());
                            }
                        } else {
                            if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                                taglist.push(raw_list[1].toLowerCase());
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/title="Category\:(\d\d\d\d), [a-zA-Z]+">[a-zA-Z]+</i);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/>Editor-in-Chief<.*<\/div>[\s\S]+?<\/div>/i);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'editor-in-chief' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Cover Artists<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'cover artists' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Writers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'writers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Pencilers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'pencilers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Inkers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'inkers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Letterers<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'letterers' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Editors<.*<\/div>[\s\S]+?<\/div>/ig);
                if (raw_list) {
                    for (var j in raw_list) {
                        match_list = raw_list[j].match(/>[^><]+</g);
                        if (match_list) {
                            for (var i in match_list) {
                                if (match_list[i].length > 4) {
                                    match_item = match_list[i].match(/^>(.*)<$/);
                                    if (match_item) {
                                        if (match_item[1].toLowerCase() !== 'editors' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                            taglist.push(match_item[1].toLowerCase());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            case 'tvdb':
            api.xuiteDownload(url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                taglist.push('歐美');
                taglist.push('電視劇');
                taglist.push('tv show');
                var match_list = false;
                var match_item = false;
                var raw_list = raw_data.match(/<h1>(.*)<\/h1>/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/[a-zA-Z]+ \d?\d, (\d\d\d\d)/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/[a-zA-Z]+ \d?\d, (\d\d\d\d)/);
                if (raw_list) {
                    if (taglist.indexOf(raw_list[1].toLowerCase()) === -1) {
                        taglist.push(raw_list[1].toLowerCase());
                    }
                }
                raw_list = raw_data.match(/>Network:<[\s\S]+?<\/td>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/>[^><]+</g);
                    if (match_list) {
                        for (var i in match_list) {
                            if (match_list[i].length > 4) {
                                match_item = match_list[i].match(/^>(.*)<$/);
                                if (match_item) {
                                    if (match_item[1].toLowerCase() !== 'network:' && taglist.indexOf(match_item[1].toLowerCase()) === -1) {
                                        taglist.push(match_item[1].toLowerCase());
                                    }
                                }
                            }
                        }
                    }
                }
                raw_list = raw_data.match(/>Genre:<[\s\S]+?<\/td>/);
                if (raw_list) {
                    match_list = raw_list[0].match(/>[^><]+</g);
                    if (match_list) {
                        for (var i in match_list) {
                            if (match_list[i].length > 4) {
                                match_item = match_list[i].match(/^>(.*)<$/);
                                if (match_item) {
                                    match_item = match_item[1].toLowerCase();
                                    if (match_item !== 'genre:') {
                                        if (match_item === 'science-fiction') {
                                            match_item = 'sci-fi';
                                        }
                                        if (genre_list.indexOf(match_item) !== -1) {
                                            if (taglist.indexOf(match_item) === -1) {
                                                taglist.push(match_item);
                                            }
                                            if (taglist.indexOf(genre_list_ch[genre_list.indexOf(match_item)]) === -1) {
                                                taglist.push(genre_list_ch[genre_list.indexOf(match_item)]);
                                            }
                                        } else {
                                            if (taglist.indexOf(match_item) === -1) {
                                                taglist.push(match_item);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i in taglist) {
                    taglist[i] = util.toValidName(taglist[i]);
                }
                setTimeout(function(){
                    callback(null, taglist);
                }, 0);
            }, 60000, false, false);
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    },
    bilibiliVideoUrl: function(url, callback) {
        var id = url.match(/(\d+)\/(index_(\d+)\.html)?$/);
        if (!id) {
            util.handleError({hoerror: 2, message: 'bilibili id invalid'}, callback, callback);
        }
        var page = 0;
        if (id[2]) {
            page = Number(id[3]);
            page--;
        }
        id = id[1];
        var infoUrl = 'http://api.bilibili.com/view?type=json&appkey=95acd7f6cc3392f3&id=' + id + '&page=1&batch=true';
        api.xuiteDownload(infoUrl, '', function(err, raw_data) {
            if (err) {
                err.hoerror = 2;
                util.handleError(err, callback, callback);
            }
            var json_data = null;
            try {
                json_data = JSON.parse(raw_data);
            } catch (x) {
                console.log(raw_data);
                util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
            }
            if (!json_data.list) {
                util.handleError({hoerror: 2, message: 'cannot get list'}, callback, callback);
            }
            var cid = json_data.list[page].cid;
            if (!cid) {
                util.handleError({hoerror: 2, message: 'cannot get cid'}, callback, callback);
            }
            var title = json_data.list[page].part;
            var playUrl = 'http://interface.bilibili.com/playurl?platform=bilihelper&otype=json&appkey=95acd7f6cc3392f3&cid=' + cid + '&quality=4&type=mp4';
            api.xuiteDownload(playUrl, '', function(err, raw_data_1) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var json_data_1 = null;
                try {
                    json_data_1 = JSON.parse(raw_data_1);
                } catch (x) {
                    console.log(raw_data_1);
                    util.handleError({hoerror: 2, message: 'json parse error'}, callback, callback);
                }
                if (!json_data_1.durl || !json_data_1.durl[0] || !json_data_1.durl[0].url) {
                    console.log(json_data_1);
                    util.handleError({hoerror: 2, message: 'cannot find videoUrl'}, callback, callback);
                }
                setTimeout(function(){
                    callback(null, title, json_data_1.durl[0].url);
                }, 0);
            }, 60000, false, false, 'http://interface.bilibili.com/', false, '220.181.111.228');
        }, 60000, false, false, 'http://api.bilibili.com/');
    },
    save2Drive: function(type, obj, parent, callback) {
        switch (type) {
            case 'bls':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/.*?The PDF version of the news release/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                var list_match = raw_list[0].match(/"([^"]+)/);
                if (!list_match) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!list_match[1].match(/^(http|https):\/\//)) {
                    if (list_match[1].match(/^\//)) {
                        list_match[1] = 'http://www.bls.gov' + list_match[1];
                    } else {
                        list_match[1] = 'http://www.bls.gov/' + list_match[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(list_match[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(list_match[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(list_match[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false);
            break;
            case 'cen':
            console.log(obj);
            var utime = Math.round(new Date().getTime() / 1000);
            var filePath = util.getFileLocation(type, utime);
            console.log(filePath);
            var folderPath = path.dirname(filePath);
            var ext = path.extname(obj.url);
            var driveName = obj.name + ' ' + obj.date + ext;
            console.log(driveName);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                });
            } else {
                api.xuiteDownload(obj.url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(metadata);
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            }
            break;
            case 'bea':
            console.log(obj);
            var ext = path.extname(obj.url);
            if (ext === '.pdf') {
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(obj.url, filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            } else {
                api.xuiteDownload(obj.url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var raw_list = raw_data.match(/<li><a href="([^"]+)">Full Release/);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                    }
                    if (!raw_list[1].match(/^(http|https):\/\//)) {
                        if (raw_list[1].match(/^\//)) {
                            raw_list[1] = 'http://www.bea.gov' + raw_list[1];
                        } else {
                            raw_list[1] = 'http://www.bea.gov/' + raw_list[1];
                        }
                    }
                    var utime = Math.round(new Date().getTime() / 1000);
                    var filePath = util.getFileLocation(type, utime);
                    console.log(filePath);
                    var folderPath = path.dirname(filePath);
                    var ext = path.extname(raw_list[1]);
                    var driveName = obj.name + ' ' + obj.date + ext;
                    console.log(driveName);
                    if (!fs.existsSync(folderPath)) {
                        mkdirp(folderPath, function(err) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            api.xuiteDownload(raw_list[1], filePath, function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                                googleApi.googleApi('upload', data, function(err, metadata) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    console.log(metadata);
                                    console.log('done');
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                });
                            });
                        });
                    } else {
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    }
                }, 60000, false, false);
            }
            break;
            case 'ism':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/href="([^"]+)".*?PDF Download of this month\'s report/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    if (raw_list[1].match(/^\//)) {
                        raw_list[1] = 'https://www.instituteforsupplymanagement.org' + raw_list[1];
                    } else {
                        raw_list[1] = 'https://www.instituteforsupplymanagement.org/' + raw_list[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(raw_list[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false);
            break;
            case 'cbo':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/<h2>([^<]+)/);
                if (raw_list) {
                    raw_list = raw_list[1];
                } else {
                    raw_list = 'US Business Cycle Indicators';
                }
                var driveName = obj.name + ' ' + obj.date + '.txt';
                console.log(driveName);
                var data = {type: 'auto', name: driveName, body: raw_list + '\n\n\r\r' + obj.url, parent: parent};
                googleApi.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(metadata);
                    console.log('done');
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            }, 60000, false, false);
            break;
            case 'sem':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/class="page-header">([^<]+)/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                var driveName = obj.name + ' ' + obj.date + '.txt';
                console.log(driveName);
                var data = {type: 'auto', name: driveName, body: raw_list[1] + '\n\n\r\r' + obj.url, parent: parent};
                googleApi.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(metadata);
                    console.log('done');
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            }, 60000, false, false);
            break;
            case 'oec':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/href="([^"]+)">Download the entire news release/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    if (raw_list[1].match(/^\//)) {
                        raw_list[1] = 'http://www.oecd.org' + raw_list[1];
                    } else {
                        raw_list[1] = 'http://www.oecd.org/' + raw_list[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(raw_list[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false);
            break;
            case 'dol':
            console.log(obj);
            var utime = Math.round(new Date().getTime() / 1000);
            var filePath = util.getFileLocation(type, utime);
            console.log(filePath);
            var folderPath = path.dirname(filePath);
            var driveName = obj.name + ' ' + obj.date + '.pdf';
            console.log(driveName);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                });
            } else {
                api.xuiteDownload(obj.url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(metadata);
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            }
            break;
            case 'rea':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/class="page-title">([^<]+)/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                var driveName = obj.name + ' ' + obj.date + '.txt';
                console.log(driveName);
                var data = {type: 'auto', name: driveName, body: raw_list[1] + '\n\n\r\r' + obj.url, parent: parent};
                googleApi.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(metadata);
                    console.log('done');
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                });
            }, 60000, false, false);
            break;
            case 'sca':
            console.log(obj);
            var utime = Math.round(new Date().getTime() / 1000);
            var filePath = util.getFileLocation(type, utime);
            console.log(filePath);
            var folderPath = path.dirname(filePath);
            var driveName = obj.name + ' ' + obj.date + '.pdf';
            console.log(driveName);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    }, 60000, false);
                });
            } else {
                api.xuiteDownload(obj.url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(metadata);
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                }, 60000, false);
            }
            break;
            case 'fed':
            console.log(obj);
            if (path.extname(obj.url) === '.pdf') {
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(obj.url);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(obj.url, filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            } else {
                api.xuiteDownload(obj.url, '', function(err, raw_data) {
                    if (err) {
                        err.hoerror = 2;
                        util.handleError(err, callback, callback);
                    }
                    var raw_list = raw_data.match(/<li class="stayconnected3"><a href="([^"]+)/);
                    if (!raw_list) {
                        util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                    }
                    if (!raw_list[1].match(/^(http|https):\/\//)) {
                        if (raw_list[1].match(/^\//)) {
                            raw_list[1] = 'http://www.federalreserve.gov' + raw_list[1];
                        } else {
                            raw_list[1] = 'http://www.federalreserve.gov/' + raw_list[1];
                        }
                    }
                    var utime = Math.round(new Date().getTime() / 1000);
                    var filePath = util.getFileLocation(type, utime);
                    console.log(filePath);
                    var folderPath = path.dirname(filePath);
                    var ext = path.extname(raw_list[1]);
                    var driveName = obj.name + ' ' + obj.date + ext;
                    console.log(driveName);
                    if (!fs.existsSync(folderPath)) {
                        mkdirp(folderPath, function(err) {
                            if(err) {
                                util.handleError(err, callback, callback);
                            }
                            api.xuiteDownload(raw_list[1], filePath, function(err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                                googleApi.googleApi('upload', data, function(err, metadata) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    console.log(metadata);
                                    console.log('done');
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                });
                            });
                        });
                    } else {
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    }
                }, 60000, false, false);
            }
            break;
            case 'sea':
            console.log(obj);
            var utime = Math.round(new Date().getTime() / 1000);
            var filePath = util.getFileLocation(type, utime);
            console.log(filePath);
            var folderPath = path.dirname(filePath);
            var driveName = obj.name + ' ' + obj.date + '.pdf';
            console.log(driveName);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    }, 60000, false);
                });
            } else {
                api.xuiteDownload(obj.url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(metadata);
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                }, 60000, false);
            }
            break;
            case 'tri':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/href="([^"]+)".*下載PDF檔案/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    if (raw_list[1].match(/^\//)) {
                        raw_list[1] = 'http://www.tri.org.tw' + raw_list[1];
                    } else {
                        raw_list[1] = 'http://www.tri.org.tw/' + raw_list[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(raw_list[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false, null, true);
            break;
            case 'ndc':
            console.log(obj);
            var utime = Math.round(new Date().getTime() / 1000);
            var filePath = util.getFileLocation(type, utime);
            console.log(filePath);
            var folderPath = path.dirname(filePath);
            var ext = path.extname(obj.url);
            var driveName = obj.name + ' ' + obj.date + ext;
            console.log(driveName);
            if (!fs.existsSync(folderPath)) {
                mkdirp(folderPath, function(err) {
                    if(err) {
                        util.handleError(err, callback, callback);
                    }
                    api.xuiteDownload(obj.url, filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                });
            } else {
                api.xuiteDownload(obj.url, filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                    googleApi.googleApi('upload', data, function(err, metadata) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        console.log(metadata);
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    });
                });
            }
            break;
            case 'sta':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/本文及附表電子檔下載.*?href="([^"]+)/);
                if (!raw_list) {
                    raw_list = raw_data.match(/新聞稿本文.*?href="([^"]+)/);
                    if (!raw_list) {
                    raw_list = raw_data.match(/href="([^"]+)" title="\d\d\d年\d\d?月新聞稿\.pdf"/);
                        if (!raw_list) {
                            util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                        }
                    }
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    if (raw_list[1].match(/^\//)) {
                        raw_list[1] = 'http://www.stat.gov.tw' + raw_list[1];
                    } else {
                        raw_list[1] = 'http://www.stat.gov.tw/' + raw_list[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(raw_list[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false, null, true);
            break;
            case 'mof':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/新聞稿本文.*href="([^"]+)/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    if (raw_list[1].match(/^\//)) {
                        raw_list[1] = 'http://www.mof.gov.tw' + raw_list[1];
                    } else {
                        raw_list[1] = 'http://www.mof.gov.tw/' + raw_list[1];
                    }
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var ext = path.extname(raw_list[1]);
                var driveName = obj.name + ' ' + obj.date + ext;
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false, 'http://www.mof.gov.tw/Pages/List.aspx?nodeid=281');
            break;
            case 'moe':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var raw_list = raw_data.match(/title="開啟新聞稿[^\.]*\.pdf檔" href="([^"]+)/);
                if (!raw_list) {
                    util.handleError({hoerror: 2, message: 'cannot find release'}, callback, callback);
                }
                if (!raw_list[1].match(/^(http|https):\/\//)) {
                    raw_list[1] = path.join('www.moea.gov.tw/MNS/populace/news/', raw_list[1]);
                    raw_list[1] = 'http://' + raw_list[1];
                }
                var utime = Math.round(new Date().getTime() / 1000);
                var filePath = util.getFileLocation(type, utime);
                console.log(filePath);
                var folderPath = path.dirname(filePath);
                var driveName = obj.name + ' ' + obj.date + '.pdf';
                console.log(driveName);
                if (!fs.existsSync(folderPath)) {
                    mkdirp(folderPath, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        api.xuiteDownload(raw_list[1], filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                            googleApi.googleApi('upload', data, function(err, metadata) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                console.log(metadata);
                                console.log('done');
                                setTimeout(function(){
                                    callback(null);
                                }, 0);
                            });
                        });
                    });
                } else {
                    api.xuiteDownload(raw_list[1], filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                        googleApi.googleApi('upload', data, function(err, metadata) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            console.log(metadata);
                            console.log('done');
                            setTimeout(function(){
                                callback(null);
                            }, 0);
                        });
                    });
                }
            }, 60000, false, false, null, true);
            break;
            case 'cbc':
            console.log(obj);
            api.xuiteDownload(obj.url, '', function(err, raw_data) {
                if (err) {
                    err.hoerror = 2;
                    util.handleError(err, callback, callback);
                }
                var driveName = obj.name + ' ' + obj.date + '.txt';
                console.log(driveName);
                var data = {type: 'auto', name: driveName, body: obj.name + '\n\n\r\r' + obj.url, parent: parent};
                googleApi.googleApi('upload', data, function(err, metadata) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    console.log(metadata);
                    var raw_list = raw_data.match(/.*(XLS|PDF)檔">/ig);
                    if (raw_list) {
                        recur_down(0);
                        function recur_down(dIndex) {
                            var downUrl = raw_list[dIndex].match(/<a href="([^"]+)".*?alt="([^"]+)/);
                            if (downUrl) {
                                if (!downUrl[1].match(/^(http|https):\/\//)) {
                                    if (downUrl[1].match(/^\//)) {
                                        downUrl[1] = 'http://www.cbc.gov.tw' + downUrl[1];
                                    } else {
                                        downUrl[1] = 'http://www.cbc.gov.tw/' + downUrl[1];
                                    }
                                }
                                var utime = Math.round(new Date().getTime() / 1000);
                                var filePath = util.getFileLocation(type, utime);
                                console.log(filePath);
                                var folderPath = path.dirname(filePath);
                                var ext = path.extname(downUrl[1]);
                                var driveName = obj.name + ' ' + obj.date + ' ' + util.toValidName(downUrl[2]) + ext;
                                console.log(driveName);
                                if (!fs.existsSync(folderPath)) {
                                    mkdirp(folderPath, function(err) {
                                        if(err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        api.xuiteDownload(downUrl[1], filePath, function(err) {
                                            if (err) {
                                                util.handleError(err);
                                                dIndex++;
                                                if (dIndex < raw_list.length) {
                                                    recur_down(dIndex);
                                                } else {
                                                    console.log('done');
                                                    setTimeout(function(){
                                                        callback(null);
                                                    }, 0);
                                                }
                                            } else {
                                                var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                                                googleApi.googleApi('upload', data, function(err, metadata) {
                                                    if (err) {
                                                        util.handleError(err, callback, callback);
                                                    }
                                                    dIndex++;
                                                    if (dIndex < raw_list.length) {
                                                        recur_down(dIndex);
                                                    } else {
                                                        console.log('done');
                                                        setTimeout(function(){
                                                            callback(null);
                                                        }, 0);
                                                    }
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    api.xuiteDownload(downUrl[1], filePath, function(err) {
                                        if (err) {
                                            util.handleError(err);
                                            dIndex++;
                                            if (dIndex < raw_list.length) {
                                                recur_down(dIndex);
                                            } else {
                                                console.log('done');
                                                setTimeout(function(){
                                                    callback(null);
                                                }, 0);
                                            }
                                        } else {
                                            var data = {type: 'auto', name: driveName, filePath: filePath, parent: parent};
                                            googleApi.googleApi('upload', data, function(err, metadata) {
                                                if (err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                dIndex++;
                                                if (dIndex < raw_list.length) {
                                                    recur_down(dIndex);
                                                } else {
                                                    console.log('done');
                                                    setTimeout(function(){
                                                        callback(null);
                                                    }, 0);
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                dIndex++;
                                if (dIndex < raw_list.length) {
                                    recur_down(dIndex);
                                } else {
                                    console.log('done');
                                    setTimeout(function(){
                                        callback(null);
                                    }, 0);
                                }
                            }
                        }
                    } else {
                        console.log('done');
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                });
            }, 60000, false, false);
            break;
            default:
            util.handleError({hoerror: 2, message: 'unknown external type'}, callback, callback);
            break;
        }
    }
};