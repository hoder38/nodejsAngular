function isValidString(str, type)
{
    if (typeof str !== 'string' && typeof str !== 'number'){
        return false;
    }
    if (type === 'name')
    {
        if (str !== '.' && str !== '..') {
            //if (str.search(/^[^\\\/\|\*\?"<>:]{1,255}$/) != -1)
            //為了方便開放 < ，但是後端只接受default的
            if (str.search(/^[^\\\/\|\*\?"<:]{1,255}$/) != -1)
            {
                if (str.replace(/[\s　]+/g, '') !== '')
                {
                    return true;
                }
            }
        }
    }

    if (type === 'desc')
    {
        if (str.search(/^[^\\\/\|\*\?\'"<>`:&]{0,250}$/) !== -1)
        {
            return true;
        }
    }

    if (type === 'perm')
    {
        if ((Number(str) || Number(str) === 0) && Number(str) < 32 && Number(str) >=0) {
            return true;
        }
    }

    if (type === 'int')
    {
        if (Number(str) && Number(str) > 0) {
            return true;
        }
    }

    if (type === 'parentIndex')
    {
        if (Number(str) && Number(str) <= 10 && Number(str) > 0) {
            return true;
        }
    }

    if (type === 'passwd')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^[0-9a-zA-Z!@#$%]{2,30}$/) != -1)
        {
            return true;
        }
    }

    //較寬鬆
    if (type === 'altpwd')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^[0-9a-zA-Z\._!@#$%;\u4e00-\u9fa5]{2,30}$/) != -1)
        {
            return true;
        }
    }

    if (type === 'email')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) != -1)
        {
            return true;
        }
    }

    var re_weburl = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:/\\S*)?" +
        "$", "i"
    );

    if (type === 'url')
    {
        if (str.search(re_weburl) != -1 || str.search(/^magnet:(\?xt=urn:btih:[a-z0-9]{20,50}|stop)/i) != -1)
        {
            return true;
        }
    }
    return false;
}

//不能有重複的物件
function intersect(a, b, c) {
    /*var t;
    if (b.length > a.length) {
        t = b;
        b = a;
        a = t;
    }*/
    var temp = clone(b);
    var intersect = a.filter(function (e) {
        var index = temp.indexOf(e);
        if (index !== -1) {
            temp.splice(index, 1);
            return true;
        } else {
            if (c.indexOf(e) === -1) {
                c.push(e);
            }
        }
    });
    temp.forEach(function (e) {
        if (c.indexOf(e) === -1) {
            c.push(e);
        }
    });
    return intersect;
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) {
            return i;
        }
    }
    return -1;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function randomFloor(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}