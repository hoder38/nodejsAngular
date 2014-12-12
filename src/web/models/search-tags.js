module.exports = function(search, name) {
    if (!search[name]) {
        search[name] = {tags: [], index: 0};
    } else if (typeof search[name] !== 'object') {
        console.log('bad search tags');
        console.log(typeof search[name]);
        console.log(search[name]);
        return false;
    } else {
        if(!search[name].hasOwnProperty('tags')){
            search[name].tags = [];
        }
        if(!search[name].hasOwnProperty('index')){
            search[name].index = 0;
        }
    }
    return {
        getArray: function(value, index) {
            value = typeof value !== 'undefined' ? value : null;
            index = typeof index !== 'undefined' ? index : 0;
            if (value) {
                var pos = search[name].tags.indexOf(value);
                if (index <= 0) {
                    if (search[name].index > search[name].tags.length) {
                        if (pos === -1) {
                            search[name].tags.push(value);
                        }
                        search[name].index = search[name].tags.length;
                    } else {
                        if (pos === -1 || pos >= search[name].index) {
                            search[name].tags[search[name].index] = value;
                            search[name].index++;
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
            return {cur: search[name].tags.slice(0, search[name].index), his: search[name].tags.slice(search[name].index)};
        },
        resetArray: function() {
            search[name] = {tags:[], index: 0};
            return {cur: [], his: []};
        }
    };
};