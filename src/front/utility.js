import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'
import { LOGIN_PAGE } from './constants'

const re_weburl = new RegExp(
    "^(url:)?" +
    // protocol identifier
    "(?:(?:https?|ftp|wss?)://)" +
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

export function isValidString(str, type) {
    if (typeof str !== 'string' && typeof str !== 'number') {
        return false
    }
    switch (type) {
        case 'name':
        //為了方便開放 < ，但是後端只接受default的
        str = str.trim()
        return str.match(/^[^\\\/\|\*\?"<:]{1,255}$/)
        case 'passwd':
        return str.match(/^[0-9a-zA-Z!@#$%]{2,30}$/)
        case 'desc':
        return str.match(/^[^\\\/\|\*\?\'"<>`:&]{0,250}$/)
        case 'int':
        if (Number(str) && Number(str) > 0) {
            return true;
        }
        break
        case 'perm':
        if ((Number(str) || Number(str) === 0) && Number(str) < 32 && Number(str) >= 0) {
            return true
        }
        break
        case 'url':
        return str.match(re_weburl) || str.match(/^magnet:(\?xt=urn:btih:[a-z0-9]{20,50}|stop)/i)
    }
    return false
}

export function killEvent(e, func) {
    e.preventDefault()
    e.stopPropagation()
    func()
}

//api
function errorHandle(response, relogin) {
    if (!response.ok) {
        switch(response.status) {
            case 400:
                return response.text().then(err => {throw err})
            case 401:
                if (relogin) {
                    browserHistory.push(LOGIN_PAGE)
                    throw Error('')
                } else {
                    return response.text().then(err => {throw err})
                }
            case 403:
                throw Error('unknown API!!!')
            case 404:
                return response.text().then(err => {throw err})
            case 500:
                return response.text().then(err => {throw err})
            default:
                throw Error('unknown error')
        }
    }
    return response.json()
}

export const api = (url, data = null, method = 'POST', relogin = true) => {
    if (data) {
        let myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        return fetch(url, {
            method: method,
            headers: myHeaders,
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(resp => errorHandle(resp, relogin))
    } else {
        if (method === 'DELETE') {
            return fetch(url, {
                credentials: 'include',
                method: method,
            }).then(resp => errorHandle(resp, relogin))
        } else {
            return fetch(url, {credentials: 'include'}).then(resp => errorHandle(resp, relogin))
        }
    }
}

//login
export const doLogin = (username, password, url = '') => api(`${url}/api`, {
    username: username,
    password: password,
}, 'POST', false).then(info => {
    if (info.loginOK){
        if (info.url) {
            return doLogin(username, password, info.url)
        }
    } else {
        throw Error('auth fail!!!')
    }
})

export const doLogout = (url = '') => api(`${url}/api/logout`).then(info => {
    if (info.url) {
        return doLogout(info.url)
    }
})

export const testLogin = () => api('/api/testLogin', null, 'GET', false)

//array object
export const arrayObjectIncludes = (myArray, searchTerm, property) => {
    for(let i of myArray) {
        if (i[property] === searchTerm) {
            return true
        }
    }
    return false
}

export const arrayObjectIndexOf = (myArray, searchTerm, property) => {
    for(let i of myArray.entries()) {
        if (i[1][property] === searchTerm) {
            return i[0]
        }
    }
    return -1
}

export const arrayObjectPush = (myArray, pushTerm, property, rest=item=>item) => {
    if (Array.isArray(pushTerm)) {
        let new_list = myArray.map(item => {
            for (let i of pushTerm.entries()) {
                if (item[property] === i[1][property]) {
                    pushTerm.splice(i[0], 1)
                    return rest(i[1], item)
                }
            }
            return item
        })
        pushTerm.forEach(item => new_list.push(rest(item)))
        return new_list
    } else {
        let is_add = false
        let new_list = myArray.map(item => {
            if (item[property] === pushTerm[property]) {
                is_add = true
                return rest(pushTerm, item)
            } else {
                return item
            }
        })
        if (!is_add) {
            new_list.push(rest(pushTerm))
        }
        return new_list
    }
}

//itemlist
const youtubeList = (pageToken, set, parentList) => api(`/api/youtube/get/${pageToken}`).then(result => set(result.itemList, parentList, null, null, null, null, result.pageToken))

export const getItemList = (sortname, type, set, page=0, pageToken='', push=false, name=null, index=0, exact=false, multi=false, random=false) => {
    const rest = result => push ? set(result.itemList, result.parentList, result.bookmarkID, result.latest) : set(result.itemList, result.parentList, result.bookmarkID, result.latest, sortname, type)
    let queryItem = null
    if (name === null) {
        queryItem = random ? api(`/api/storage/getRandom/${sortname}/${type}/${page}`) : api(`/api/storage/get/${sortname}/${type}/${page}`)
    } else {
        if (!isValidString(name, 'name')) {
            return Promise.reject('search tag is not vaild!!!')
        }
        queryItem = (multi || index > 0) ? api(`/api/storage/get/${sortname}/${type}/${page}/${name}/${exact}/${index}`) : api(`/api/storage/getSingle/${sortname}/${type}/${page}/${name}/${exact}/${index}`)
    }
    return queryItem.then(result => {
        rest(result)
        return youtubeList(pageToken, set, result.parentList)
    })
}

export const resetItemList = (sortname, type, set) => api('/api/storage/reset').then(result => {
    set(result.itemList, result.parentList, result.bookmarkID, result.latest, sortname, type)
    return youtubeList('', set, result.parentList)
})

export const dirItemList = (sortname, type, set, id, multi) => {
    const queryItem = multi ? api(`/api/parent/query/${id}/${sortname}/${type}`) : api(`/api/parent/query/${id}/${sortname}/${type}/single`)
    return queryItem.then(result => {
        set(result.itemList, result.parentList, result.bookmarkID, result.latest, sortname, type)
        return youtubeList('', set, result.parentList)
    })
}

export const bookmarkItemList = (sortname, type, set, id) => api(`/api/bookmark/get/${id}/${sortname}/${type}`).then(result => {
    set(result.itemList, result.parentList, result.bookmarkID, result.latest, sortname, type)
    return youtubeList('', set, result.parentList)
})