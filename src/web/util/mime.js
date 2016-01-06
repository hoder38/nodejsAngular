/*jslint regexp: true*/
var ext_filename = /(?:\.([^.]+))?$/;
var image_arr = ['jpg', 'gif', 'bmp', 'jpeg', 'png'];
var zip_arr = ['zip', 'rar', '7z', 'cbr', 'cbz'];
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
var doc_arr = {doc: ["rtf", "txt", "doc", "docx", "pdf", "odt", 'htm', 'html', "conf"], present: ["ppt", "pps", "pptx", "odp"], sheet: ["xls", "xlsx", "xlsm", "csv", "ods"]};
var rawdoc_arr = ["c", 'cc', 'cpp', 'cs', 'm', 'h', 'sh', 'csh', 'bash', "tcsh", "java", 'js', "mxml", "pl", "pm", "py", "sql", "php", "rb", "xhtml", "xml", "xsl", "json", "css", "ini", "patch", "vim", "eml"];
var type_arr = {image: {def: ['圖片', 'image'], opt: ['相片', 'photo', '漫畫', 'comic']}, zipbook: {def: ['圖片集', 'image book', '圖片', 'image'], opt: ['相片', 'photo', '漫畫', 'comic']}, video: {def:['影片', 'video'], opt: ['電影', 'movie', '動畫', 'animation', '電視劇', 'tv show']}, music: {def: ['音頻', 'audio'], opt: ['歌曲', 'song', '音樂', 'music']}, doc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel']}, present: {def: ['簡報', 'presentation'], opt: []}, sheet: {def: ['試算表', 'sheet'], opt: []}, rawdoc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel', '程式碼', 'code', '網頁', 'web']}, url: {def: ['網址', 'url'], opt: ['論壇', 'forum', '介紹', 'wiki']}};
var mime_arr = {jpg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', jpeg: 'image/jpeg', png: 'image/png', webm: 'video/webm', mp4: 'video/mp4', mts: 'model/vnd.mts', m2ts: 'video/MP2T', '3gp': 'video/3gpp', mov: 'video/quicktime', avi: 'video/x-msvideo', mpg: 'video/mpeg', wmv: 'video/x-ms-wmv', flv: 'video/x-flv', ogv: 'video/ogg', asf: 'video/x-ms-asf', mkv: 'video/x-matroska', m4v: 'video/x-m4v', rm: 'application/vnd.rn-realmedia', rmvb: 'application/vnd.rn-realmedia-vbr', rtf: 'application/rtf', txt: 'text/plain', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', odt: 'application/vnd.oasis.opendocument.text', htm: 'text/html', html: 'text/html', conf: 'text/plain', xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12', csv: 'text/csv', ods: 'application/vnd.oasis.opendocument.spreadsheet', ppt: 'application/vnd.ms-powerpoint', pps: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', odp: 'application/vnd.oasis.opendocument.presentation'};
type_arr.vlog = type_arr.video;

var genre_list = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'sport', 'thriller', 'war', 'western'];
var genre_list_ch = ['動作', '冒險', '動畫', '傳記', '喜劇', '犯罪', '記錄', '劇情', '家庭', '奇幻', '黑色電影', '歷史', '恐怖', '音樂', '音樂劇', '神祕', '浪漫', '科幻', '運動', '驚悚', '戰爭', '西部'];
var sub_arr = ['srt', 'ass', 'ssa'];
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
            if (video_arr.indexOf(extName) !== -1) {
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
            name = name.replace(ext_filename, function (a) {
                return '';
            });
            if (name.match(/\.book$/)) {
                return {type: 'zipbook', ext: extName};
            } else if (extName === 'cbr' || extName === 'cbz') {
                return {type: 'zipbook', ext: extName};
            } else {
                return false;
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
        if (type === 'video' || type === 'vlog' || type === 'image' || type === 'zipbook' || type === 'doc'|| type === 'rawdoc') {
            for (var i in genre_list) {
                if (mTag.opt.indexOf(genre_list_ch[i]) === -1) {
                    mTag.opt.push(genre_list_ch[i]);
                }
                if (mTag.opt.indexOf(genre_list[i]) === -1) {
                    mTag.opt.push(genre_list[i]);
                }
            }
        }
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
        } else {
            for (var i in genre_list) {
                option.push(genre_list_ch[i]);
                option.push(genre_list[i]);
            }
        }
        return option;
    }
};
