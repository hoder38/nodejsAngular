/*jslint regexp: true*/
var ext_filename = /(?:\.([^.]+))?$/;
var image_arr = ['jpg', 'gif', 'bmp', 'jpeg', 'png'];
var zip_arr = ['zip', 'rar', '7z', 'cbr', 'cbz', '001'];
var tor_arr = ['torrent'];
//vlog
//var video_arr = ['mp4', 'rm', 'mts', 'm2ts', '3gp2', '3gp', 'mpg', 'asf', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'rmvb', 'webm', 'm4v', 'f4v', 'mkv'];
var video_vlog_arr = ['rm', 'rmvb'];
var video_arr = ['webm', 'mp4', 'mts', 'm2ts', '3gp', 'mov', 'avi', 'mpg', 'wmv', 'flv', 'f4v', 'ogv', 'asf', 'mkv', 'm4v'];
//vlog
//var music_arr = ['mp3', 'wma', 'wav', 'mid', 'm4a'];
var music_arr = ['mp3', 'wav', 'ogg', 'm4a'];
//xuite
//var doc_arr = ["doc","docx", "odp", "odt","ppt", "pps", "pptx","xls", "xlsx","xlsm", "ods","pdf","rtf","csv"];
//var rawdoc_arr = ["c", "cc", "cpp", "cs", "h", "sh", "csh", "bash", "tcsh", "htm", "html", "java", "js", "m", "mxml", "pl", "pm", "py", "rb", "xhtml", "xml", "xsl", "txt", "php", "json", "sql", "css", "ini", "conf", "patch", "vim", "eml"];
//var doc_arr = {doc: ["rtf", "txt", "doc", "docx", "pdf", "odt", 'htm', 'html', "conf"], present: ["ppt", "pps", "pptx", "odp"], sheet: ["xls", "xlsx", "xlsm", "csv", "ods"]};
var doc_arr = {doc: ["rtf", "txt", "doc", "docx", "odt", 'htm', 'html', "conf"], present: ["ppt", "pps", "pptx", "odp"], sheet: ["xls", "xlsx", "xlsm", "csv", "ods"]};
var rawdoc_arr = ["c", 'cc', 'cpp', 'cs', 'm', 'h', 'sh', 'csh', 'bash', "tcsh", "java", 'js', "mxml", "pl", "pm", "py", "sql", "php", "rb", "xhtml", "xml", "xsl", "json", "css", "ini", "patch", "vim", "eml"];
var type_arr = {image: {def: ['圖片', 'image'], opt: ['相片', 'photo', '漫畫', 'comic']}, zipbook: {def: ['圖片集', 'image book', '圖片', 'image'], opt: ['相片', 'photo', '漫畫', 'comic']}, video: {def:['影片', 'video'], opt: ['電影', 'movie', '動畫', 'animation', '電視劇', 'tv show']}, music: {def: ['音頻', 'audio'], opt: ['歌曲', 'song', '音樂', 'music', '有聲書', 'audio book']}, doc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel']}, present: {def: ['簡報', 'presentation'], opt: []}, sheet: {def: ['試算表', 'sheet'], opt: []}, rawdoc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel', '程式碼', 'code', '網頁', 'web']}, url: {def: ['網址', 'url'], opt: ['論壇', 'forum', '維基', 'wiki']}, zip: {def: ['壓縮檔', 'zip', '播放列表', 'playlist'], opt: []}};
var mime_arr = {jpg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', jpeg: 'image/jpeg', png: 'image/png', webm: 'video/webm', mp4: 'video/mp4', mts: 'model/vnd.mts', m2ts: 'video/MP2T', '3gp': 'video/3gpp', mov: 'video/quicktime', avi: 'video/x-msvideo', mpg: 'video/mpeg', wmv: 'video/x-ms-wmv', flv: 'video/x-flv', ogv: 'video/ogg', asf: 'video/x-ms-asf', mkv: 'video/x-matroska', m4v: 'video/x-m4v', rm: 'application/vnd.rn-realmedia', rmvb: 'application/vnd.rn-realmedia-vbr', rtf: 'application/rtf', txt: 'text/plain', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', odt: 'application/vnd.oasis.opendocument.text', htm: 'text/html', html: 'text/html', conf: 'text/plain', xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12', csv: 'text/csv', ods: 'application/vnd.oasis.opendocument.spreadsheet', ppt: 'application/vnd.ms-powerpoint', pps: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', odp: 'application/vnd.oasis.opendocument.presentation', mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4'};
type_arr.vlog = type_arr.video;

var media_list = ['image', 'photo', 'comic', 'image book', 'video', 'movie', 'animation', 'tv show', 'audio', 'song', 'music', 'audio book', 'doc', 'book', 'novel', 'presentation', 'sheet', 'code', 'web', 'url', 'forum', 'wiki', 'zip', 'playlist'];

var media_list_ch = ['圖片', '相片', '漫畫', '圖片集', '影片', '電影', '動畫', '電視劇', '音頻', '歌曲', '音樂', '有聲書', '文件', '書籍', '小說', '簡報', '試算表', '程式碼', '網頁', '網址', '論壇', '維基', '壓縮檔', '播放列表'];

var genre_list = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'sport', 'thriller', 'war', 'western'];
var genre_list_ch = ['動作', '冒險', '動畫', '傳記', '喜劇', '犯罪', '記錄', '劇情', '家庭', '奇幻', '黑色電影', '歷史', '恐怖', '音樂', '音樂劇', '神祕', '浪漫', '科幻', '運動', '驚悚', '戰爭', '西部'];

var game_list = ['casual', 'adventure', 'action', 'massively multiplayer', 'simulation', 'indie', 'racing', 'strategy', 'rpg', 'sport'];

var game_list_ch = ['休閒', '冒險', '動作', '大型多人連線', '模擬', '獨立', '競速', '策略', '角色扮演', '運動'];

var music_list_web = ['avant-garde', 'blues', 'children\'s', 'classical', 'comedy/spoken', 'country', 'easy listening', 'electronic', 'folk', 'holiday', 'international', 'jazz', 'latin', 'new age', 'pop/rock', 'r&b', 'rap', 'reggae', 'religious', 'stage & screen', 'vocal'];

var music_list = ['avant-garde', 'blues', 'children\'s', 'classical', 'comedy or spoken', 'country', 'easy listening', 'electronic', 'folk', 'holiday', 'international', 'jazz', 'latin', 'new age', 'pop or rock', 'r&b', 'rap', 'reggae', 'religious', 'stage and screen', 'vocal'];

var adult_list = ['ol', '中出', '同人誌', '多p', '多人合集', '女僕', '學生', '巨乳', '教師', '泳裝', '溫泉', '無碼', '熟女', '特殊制服', '痴女', '痴漢', '素人', '美腿', '藝能人', '護士', '野外', '風俗店', '魔物'];

var anime_list = ['動作', '奇幻', '犯罪', '運動', '恐怖', '歷史', '神祕', '冒險', '校園', '喜劇', '浪漫', '少男', '科幻', '香港', '其他'];

var comic_list = ['萌系', '喜劇', '動作', '科幻', '劇情', '犯罪', '運動', '奇幻', '神祕', '校園', '驚悚', '廚藝', '偽娘', '圖片', '冒險', '小說', '香港', '耽美', '經典', '歐美', '日文', '家庭'];

var trans_list = ['格鬥', '魔法', '偵探', '競技', '戰國', '魔幻', '搞笑', '少女', '港產', '格斗', '神鬼', '驚栗', '港漫', '親情', '臺灣', '美國', '英國', '中國'];

var trans_list_ch = ['動作', '奇幻', '犯罪', '運動', '歷史', '神祕', '喜劇', '浪漫', '香港', '動作', '神祕', '驚悚', '香港', '家庭', '台灣', '歐美', '歐美', '大陸'];

var sub_arr = ['srt', 'ass', 'ssa', 'vtt'];
var util = require("../util/utility.js");
module.exports = {
    isImage: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (image_arr.indexOf(extName) !== -1) {
            return extName;
        } else {
            return false;
        }
    },
    isVideo: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (video_arr.indexOf(extName) !== -1) {
            return {type: 'video', ext: extName};
        } else {
            if (video_vlog_arr.indexOf(extName) !== -1) {
                return {type: 'vlog', ext: extName};
            } else {
                return false;
            }
        }
    },
    isMusic: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (music_arr.indexOf(extName) !== -1) {
            return extName;
        } else {
            return false;
        }
    },
    isDoc: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (doc_arr.doc.indexOf(extName) !== -1) {
            return {type: 'doc', ext: extName};
        } else if (doc_arr.present.indexOf(extName) !== -1) {
            return {type: 'present', ext: extName};
        } else if (doc_arr.sheet.indexOf(extName) !== -1) {
            return {type: 'sheet', ext: extName};
        } else {
            return false;
        }
    },
    isRawdoc: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (rawdoc_arr.indexOf(extName) !== -1) {
            return extName;
        } else {
            return false;
        }
    },
    isSub: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (sub_arr.indexOf(extName) !== -1) {
            return extName;
        } else {
            return false;
        }
    },
    isZip: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (zip_arr.indexOf(extName) !== -1) {
            if (extName === '001') {
                if (name.match(/zip\.001$/)) {
                    return 'zip';
                } else if (name.match(/7z\.001$/)) {
                    return '7z';
                }
            } else {
                return extName;
            }
        } else {
            return false;
        }
    },
    isTorrent: function(name) {
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (tor_arr.indexOf(extName) !== -1) {
            return extName;
        } else {
            return false;
        }
    },
    mediaType: function(name) {
        'use strict';
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (image_arr.indexOf(extName) !== -1) {
            return {type: 'image', ext: extName};
        } else if (zip_arr.indexOf(extName) !== -1) {
            if (name.match(/\.book\.(zip|7z|rar)$/)) {
                return {type: 'zipbook', ext: extName};
            } else if (extName === 'cbr' || extName === 'cbz') {
                return {type: 'zipbook', ext: extName};
            } else {
                if (extName === '001') {
                    if (name.match(/\.zip\.001$/)) {
                        return {type: 'zip', ext: 'zip'};
                    } else if (name.match(/\.7z\.001$/)) {
                        return {type: 'zip', ext: '7z'};
                    }
                } else {
                    return {type: 'zip', ext: extName};
                }
            }
        } else if (video_arr.indexOf(extName) !== -1) {
            return {type: 'video', ext: extName};
        } else if (video_vlog_arr.indexOf(extName) !== -1) {
            return {type: 'vlog', ext: extName};
        } else if (music_arr.indexOf(extName) !== -1) {
            return {type: 'music', ext: extName};
        } else if (doc_arr.doc.indexOf(extName) !== -1) {
            return {type: 'doc', ext: extName};
        } else if (doc_arr.present.indexOf(extName) !== -1) {
            return {type: 'present', ext: extName};
        } else if (doc_arr.sheet.indexOf(extName) !== -1) {
            return {type: 'sheet', ext: extName};
        } else if (rawdoc_arr.indexOf(extName) !== -1) {
            return {type: 'rawdoc', ext: extName};
        } else {
            return false;
        }
    },
    mediaTag: function(type) {
        'use strict';
        var mTag = util.clone(type_arr[type]);
        /*if (type === 'video' || type === 'vlog' || type === 'doc'|| type === 'rawdoc' || type === 'image' || type === 'zipbook') {
            for (var i in genre_list_ch) {
                if (mTag.opt.indexOf(genre_list_ch[i]) === -1) {
                    mTag.opt.push(genre_list_ch[i]);
                }
            }
        }*/
        return mTag;
    },
    changeExt: function(str, ext) {
        return str.replace(ext_filename, function (a) {
            return '.' + ext;
        });
    },
    addPost: function(str, post) {
        var result = str.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
            return str.replace(ext_filename, function (a) {
                return '(' + post + ').' + extName;
            });
        } else {
            return str + '(' + post + ')';
        }
    },
    mediaMIME: function(name) {
        var result = name.match(ext_filename), extName = '';
        if (result && result[1]) {
            extName = result[1].toLowerCase();
        } else {
            return false;
        }
        if (mime_arr[extName]) {
            return mime_arr[extName];
        } else {
            return false;
        }
    },
    getOptionTag: function(lang) {
        var option = [];
        if (lang === 'eng') {
            for (var i in genre_list) {
                option.push(genre_list[i]);
            }
        } else if (lang === 'cht') {
            for (var i in genre_list) {
                option.push(genre_list_ch[i]);
            }
        } else if (lang === 'anime') {
            for (var i in anime_list) {
                option.push(anime_list[i]);
            }
        } else if (lang === 'comic') {
            for (var i in comic_list) {
                option.push(comic_list[i]);
            }
        } else if (lang === 'trans') {
            for (var i in trans_list) {
                option.push(trans_list[i]);
            }
        } else if (lang === 'transed') {
            for (var i in trans_list_ch) {
                option.push(trans_list_ch[i]);
            }
        } else if (lang === 'game') {
            for (var i in game_list) {
                option.push(game_list[i]);
            }
        } else if (lang === 'gamech') {
            for (var i in game_list_ch) {
                option.push(game_list_ch[i]);
            }
        } else if (lang === 'adult') {
            for (var i in adult_list) {
                option.push(adult_list[i]);
            }
        } else if (lang === 'music') {
            for (var i in music_list) {
                option.push(music_list[i]);
            }
        } else if (lang === 'musicweb') {
            for (var i in music_list_web) {
                option.push(music_list_web[i]);
            }
        } else if (lang === 'media') {
            for (var i in media_list) {
                option.push(media_list[i]);
            }
        } else if (lang === 'mediach') {
            for (var i in media_list_ch) {
                option.push(media_list_ch[i]);
            }
        } else {
            for (var i in media_list_ch) {
                if (option.indexOf(media_list_ch[i]) === -1) {
                    option.push(media_list_ch[i]);
                }
            }
            for (var i in genre_list_ch) {
                if (option.indexOf(genre_list_ch[i]) === -1) {
                    option.push(genre_list_ch[i]);
                }
            }
            for (var i in game_list_ch) {
                if (option.indexOf(game_list_ch[i]) === -1) {
                    option.push(game_list_ch[i]);
                }
            }
            for (var i in music_list) {
                if (option.indexOf(music_list[i]) === -1) {
                    option.push(music_list[i]);
                }
            }
            for (var i in adult_list) {
                if (option.indexOf(adult_list[i]) === -1) {
                    option.push(adult_list[i]);
                }
            }
            /*for (var i in anime_list) {
                if (option.indexOf(anime_list[i]) === -1) {
                    option.push(anime_list[i]);
                }
            }
            for (var i in comic_list) {
                if (option.indexOf(comic_list[i]) === -1) {
                    option.push(comic_list[i]);
                }
            }*/
        }
        return option;
    },
    getExtname: function(name) {
        var result = name.match(ext_filename);
        var extName = '';
        if (result && result[0]) {
            extName = result[0].toLowerCase();
        }
        var frontName = name.substr(0, name.length - extName.length);
        return {front: frontName, ext: extName};
    }
};
