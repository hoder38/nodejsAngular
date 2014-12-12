/*jslint regexp: true*/
var ext_filename = /(?:\.([^.]+))?$/;
var image_arr = ['jpg', 'gif', 'bmp', 'jpeg', 'png'];
var video_arr = ['mp4', 'rm', 'mts', 'm2ts', '3gp2', '3gp', 'mpg', 'asf', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'rmvb', 'webm', 'm4v', 'f4v', 'mkv'];
var music_arr = ['mp3', 'wma', 'wav', 'mid', 'm4a'];
var doc_arr = ["doc","docx", "odp", "odt","ppt", "pps", "pptx","xls", "xlsx","xlsm", "ods","pdf","rtf","csv"];
var rawdoc_arr = ["c", "cc", "cpp", "cs", "h", "sh", "csh", "bash", "tcsh", "htm", "html", "java", "js", "m", "mxml", "pl", "pm", "py", "rb", "xhtml", "xml", "xsl", "txt", "php", "json", "sql", "css", "ini", "conf", "patch", "vim", "eml"];
var type_arr = {image: {def: ['圖片', 'image'], opt: ['相片', '漫畫', 'picture', 'comic', 'CG']}, video: {def:['影片', 'video'], opt: ['電影', 'movie', '動畫', 'anime', 'cartoon', 'OVA', '連續劇', '短片']}, music: {def: ['音樂', 'music'], opt: ['歌曲', 'song']}, doc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel']}, rawdoc: {def: ['文件', 'doc'], opt: ['書籍', 'book', '小說', 'novel']}};
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
            return extName;
        } else {
            return false;
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
        if (doc_arr.indexOf(extName) !== -1) {
            return extName;
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
        } else if (music_arr.indexOf(extName) !== -1) {
            return {type: 'music', ext: extName};
        } else if (doc_arr.indexOf(extName) !== -1) {
            return {type: 'doc', ext: extName};
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
