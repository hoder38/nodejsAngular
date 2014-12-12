function isValidString(str, type)
{
    if (typeof str !== 'string' && typeof str !== 'number'){
        return false;
    }
    if (type === 'name')
    {
        if (str.search(/^[^\\\/\|\*\?"<>:]{1,255}$/) != -1)
        {
            if (str.replace(/[\s　]+/g, '') !== '')
            {
                return true;
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

    if (type === 'parentIndex')
    {
        if (Number(str) && Number(str) <= 10 && Number(str) > 0) {
            return true;
        }
    }

    if (type === 'passwd')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%\!]{6,20}$/) != -1)
        {
            return true;
        }
    }
    return false;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) {
        t = b;
        b = a;
        a = t;
    }
    return a.filter(function (e) {
        console.log(e);
        if (b.indexOf(e) !== -1) {
            return true;
        }
    });
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