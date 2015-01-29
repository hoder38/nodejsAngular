/*jslint regexp: true*/
var ext_filename = /(?:\.([^.]+))?$/;
var image_arr = ['jpg', 'gif', 'bmp', 'jpeg', 'png'];
//vlog
//var video_arr = ['mp4', 'rm', 'mts', 'm2ts', '3gp2', '3gp', 'mpg', 'asf', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'rmvb', 'webm', 'm4v', 'f4v', 'mkv'];
var video_vlog_arr = ['rm', 'rmvb'];
var video_arr = ['webm', 'mp4', 'mts', 'm2ts', '3gp', 'mov', 'avi', 'mpg', 'wmv', 'flv', 'ogv', 'asf', 'mkv', 'm4v'];
//vlog
//var music_arr = ['mp3', 'wma', 'wav', 'mid', 'm4a'];
var music_arr = ['mp3', 'wav', 'ogg', 'm4a'];
//xuide
//var doc_arr = ["doc","docx", "odp", "odt","ppt", "pps", "pptx","xls", "xlsx","xlsm", "ods","pdf","rtf","csv"];
//var rawdoc_arr = ["c", "cc", "cpp", "cs", "h", "sh", "csh", "bash", "tcsh", "htm", "html", "java", "js", "m", "mxml", "pl", "pm", "py", "rb", "xhtml", "xml", "xsl", "txt", "php", "json", "sql", "css", "ini", "conf", "patch", "vim", "eml"];
var doc_arr = {doc: ["rtf", "txt", "doc", "docx", "pdf", "odt", 'htm', 'html', "conf"], present: ["ppt", "pps", "pptx", "odp"], sheet: ["xls", "xlsx", "xlsm", "csv", "ods"]};
var rawdoc_arr = ["c", 'cc', 'cpp', 'cs', 'm', 'h', 'sh', 'csh', 'bash', "tcsh", "java", 'js', "mxml", "pl", "pm", "py", "sql", "php", "rb", "xhtml", "xml", "xsl", "json", "css", "ini", "patch", "vim", "eml"];
var type_arr = {image: {def: ['圖片', 'image'], opt: ['相片', '漫畫', 'picture', 'comic', 'CG']}, video: {def:['影片', 'video'], opt: ['電影', 'movie', '動畫', 'anime', 'cartoon', 'OVA', '連續劇', '短片']}, music: {def: ['音樂', 'music'], opt: ['歌曲', 'song']}, doc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel']}, present: {def: ['簡報', 'presentation'], opt: ['投影片']}, sheet: {def: ['試算表', 'sheet'], opt: ['報表']}, rawdoc: {def: ['純文字', 'doc'], opt: ['書籍', 'book', '小說', 'novel', '程式碼', 'code', '網頁', 'web']}};
type_arr.vlog = type_arr.video;
var sub_arr = ['srt'];
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
        return util.clone(type_arr[type]);
    },
    changeExt: function(str, ext) {
        return str.replace(ext_filename, function (a) {
            return '.' + ext;
        });
    }
};
