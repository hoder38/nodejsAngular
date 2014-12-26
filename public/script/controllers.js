var video, music, subtitles, videoStart=0, musicStart=0;
var app = angular.module('app', ['ngResource', 'ngRoute', 'ngCookies', 'angularFileUpload', 'ui.bootstrap'], function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/hello',
        controller: LoginCntl//,
        //controllerAs: 'login'
    }).when('/UserInfo', {
        templateUrl: '/views/UserInfo',
        controller: UserInfoCntl
    }).when('/Storage', {
        templateUrl: '/views/Storage',
        controller: StorageInfoCntl
    }).otherwise({ redirectTo: '/' });
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}).directive('focusMe', function() {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            });
        }
    };
}).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
}).directive('ngConfirmClick', function() {
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click',function (event) {
                openModal(msg).then(function () {
                    scope.$eval(clickAction);
                }, function () {
                });
            });
        }
    };
}).directive('ngMusic', function() {
    return function (scope, element, attrs) {
        music = element[0];
        music.addEventListener('loadedmetadata', function () {
            if (musicStart) {
                music.currentTime = musicStart;
                musicStart = 0;
            }
        });
        console.log(music);
    };
}).directive('ngVideo', function() {
    return function (scope, element, attrs) {
        video = element[0];
        video.addEventListener('loadedmetadata', function () {
            if (videoStart) {
                video.currentTime = videoStart;
                videoStart = 0;
            }
        });
        console.log(video);
    };
}).directive('ngEnded', function() {
    return function (scope, element, attrs) {
        element.bind('ended',function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngEnded);
            });
        });
    };
}).directive('ngPause', function() {
    return function (scope, element, attrs) {
        element.bind('pause',function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngPause);
            });
        });
    };
}).directive('ngPlay', function() {
    return function (scope, element, attrs) {
        element.bind('play',function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngPlay);
            });
        });
    };
}).directive('ngRepeatValue', function() {
    return function (scope, element, attrs) {
        scope.$watch(attrs.ngModel, function(value) {
            scope.$parent[attrs.ngModel] = value;
        });
        var clickAction = attrs.ngRepeatValue;
        if (clickAction) {
            element.bind('click',function (event) {
                scope.$apply(function (){
                    scope.$eval(clickAction);
                });
            });
        }
    };
}).filter('gtFilter', function () {
    return function (items, prop, num, obj) {
        var filtered = [];
        var isEqual = true;
        var item;
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            if (obj) {
                isEqual = true;
                for (var j in obj) {
                    if (obj[j] !== item[j]) {
                        isEqual = false;
                        break;
                    }
                }
            }
            if (isEqual && item[prop] > num) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});

function UserInfoCntl($route, $routeParams, $location, $resource, $scope, $location, $window, $timeout) {
    $scope.userCollapse = {owner: false, priority: true, normal: true};
    $scope.uInfo = [];
    $scope.password = "";
    $scope.timer = false;
    $scope.init = function(){
        var Info = $resource('/api/userinfo', {}, {
            'userinfo': { method:'GET' }
        });
        var this_uInfo = this.uInfo;
        Info.userinfo({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                for (var i in result.user_info) {
                    if (result.user_info[i].hasOwnProperty('desc')) {
                        result.user_info[i].hasDesc = true;
                    }
                    if (result.user_info[i].hasOwnProperty('perm')) {
                        result.user_info[i].hasPerm = true;
                    }
                    result.user_info[i].isDel = false;
                    this_uInfo.push(result.user_info[i]);
                }
                console.log(this_uInfo);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.editAll = function(item) {
        if (item.edit) {
            item["name"] = item['nameOrig'];
            item["desc"] = item['descOrig'];
            item["perm"] = item['permOrig'];
            item["newPwd"] = '';
            item["conPwd"] = '';
            item["password"] = '';
            item.edit = false;
        } else {
            item["nameOrig"] = item['name'];
            item["descOrig"] = item['desc'];
            item["permOrig"] = item['perm'];
            item.edit = true;
            item.nameFocus = true;
        }
    }
    $scope.saveAll = function(item) {
        if (!isValidString(item.password, 'passwd')) {
            alert('password error!!!');
        } else {
            if (!isValidString(item.name, 'name') && item.edit) {
                alert('name not vaild!!!');
            } else if (!isValidString(item.desc, 'desc') && item.edit) {
                alert('desc not vaild!!!');
            } else if (!isValidString(item.perm, 'perm') && item.edit) {
                alert('perm not vaild!!!');
            } else if ((item.newPwd || item.conPwd) && (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd'))) {
                item.newPwd = '';
                item.conPwd = '';
                alert('new password is not valid!!!');
            } else if (item.newPwd !== item.conPwd) {
                item.newPwd = '';
                item.conPwd = '';
                alert('confirm password must equal!!!');
            } else {
                if (item.key) {
                    var editInfo = $resource('/api/edituser/' + item.key, {}, {
                        'editinfo': { method:'PUT' }
                    });
                } else {
                    var editInfo = $resource('/api/edituser', {}, {
                        'editinfo': { method:'PUT' }
                    });
                }
                var this_obj = this;
                var set_obj = {pwd: item.password};
                if (item.name !== item.nameOrig && item.edit) {
                    set_obj['name'] = item.name;
                }
                if (item.perm !== item.permOrig && item.edit) {
                    set_obj['perm'] = item.perm;
                }
                if (item.desc !== item.descOrig && item.edit) {
                    set_obj['desc'] = item.desc;
                }
                if (item.newPwd) {
                    set_obj['newPwd'] = item.newPwd;
                }
                if (item.conPwd) {
                    set_obj['conPwd'] = item.conPwd;
                }
                editInfo.editinfo(set_obj, function(result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        alert('edit complete');
                        if (item.perm === '') {
                            item.perm = 0;
                        }
                        item.edit = false;
                        item["newPwd"] = '';
                        item["conPwd"] = '';
                        item["password"] = '';
                    }
                }, function(errorResult) {
                    item.newPwd = '';
                    item.conPwd = '';
                    console.log(errorResult);
                    if (errorResult.status === 400) {
                        alert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        alert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }
        item.password = '';
        return false;
    }
    $scope.edit = function(item, type){
        item[type+"orig"] = item[type];
        item[type+"Edit"] = true;
        item[type+"Focus"] = true;
    }
    $scope.save = function(item, type){
        console.log(type);
        if (!isValidString(this.password, 'passwd')) {
            alert('password error!!!');
        } else {
            if (isValidString(item[type], type)) {
                if (item.key) {
                    var editInfo = $resource('/api/edituser/' + item.key, {}, {
                        'editinfo': { method:'PUT' }
                    });
                } else {
                    var editInfo = $resource('/api/edituser', {}, {
                        'editinfo': { method:'PUT' }
                    });
                }
                var this_obj = this;
                var set_obj = {pwd: this.password};
                set_obj[type] = item[type];
                console.log(set_obj);
                editInfo.editinfo(set_obj, function(result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        this_obj.cleanPwd();
                        delete item[type+"Edit"];
                    }
                }, function(errorResult) {
                    console.log(errorResult);
                    if (errorResult.status === 400) {
                        alert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        alert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                alert(type + ' not vaild!!!');
            }
        }
        return false;
    }
    $scope.esc = function(item, type) {
        //recover
        item[type] = item[type+"orig"];
        delete item[type+"Edit"];
    }
    $scope.focusPwd = function(item, type) {
        item[type+"FocusPwd"] = true;
    }
    $scope.cleanPwd = function() {
        var this_obj = this;
        if (this.timer) {
            $timeout.cancel(this.timer);
        }
        this.timer = $timeout(function() {
            this_obj.password = '';
        }, 60000);
    }
    $scope.saveClean = function(item) {
        if (!isValidString(this.password, 'passwd')) {
            alert('password error!!!');
        } else {
            if (item.newable) {
                if (!isValidString(item.name, 'name')) {
                    alert('name not vaild!!!');
                } else if (!isValidString(item.desc, 'desc')) {
                    alert('desc not vaild!!!');
                } else if (!isValidString(item.perm, 'perm')) {
                    alert('perm not vaild!!!');
                } else if (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd')) {
                    alert('new password is not valid!!!');
                } else if (item.newPwd !== item.conPwd) {
                    alert('confirm password must equal!!!');
                } else {
                    var addInfo = $resource('/api/adduser', {}, {
                        'addinfo': { method:'POST' }
                    });
                    console.log({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, pwd: this.password});
                    var this_uInfo = this.uInfo;
                    addInfo.addinfo({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, pwd: this.password}, function (result) {
                        console.log(result);
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            if (result.item) {
                                for (var i in result.item) {
                                    item[i] = result.item[i];
                                }
                                item.newPwd = '';
                                item.conPwd = '';
                            }
                            if (result.newItem) {
                                if (result.newItem.hasOwnProperty('desc')) {
                                    result.newItem.hasDesc = true;
                                }
                                if (result.newItem.hasOwnProperty('perm')) {
                                    result.newItem.hasPerm = true;
                                }
                                result.newItem.isDel = false;
                                this_uInfo.push(result.newItem);
                                console.log(this_uInfo);
                            }
                        }
                    }, function(errorResult) {
                        console.log(errorResult);
                        if (errorResult.status === 400) {
                            alert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            alert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                }
            } else {
                if (isValidString(item.newPwd, 'passwd') && isValidString(item.conPwd, 'passwd')) {
                    if (item.newPwd === item.conPwd) {
                        if (item.key) {
                            var editInfo = $resource('/api/edituser/' + item.key, {}, {
                                'editinfo': { method:'PUT' }
                            });
                        } else {
                            var editInfo = $resource('/api/edituser', {}, {
                                'editinfo': { method:'PUT' }
                            });
                        }
                        console.log({newPwd: item.newPwd, conPwd: item.conPwd, pwd: this.password});
                        var this_obj = this;
                        editInfo.editinfo({newPwd: item.newPwd, conPwd: item.conPwd, pwd: this.password}, function (result) {
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            } else {
                                alert("password is changed successfully!");
                            }
                        }, function(errorResult) {
                            console.log(errorResult);
                            if (errorResult.status === 400) {
                                alert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                alert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    } else {
                        alert('confirm password must equal!!!');
                    }
                } else {
                    alert('new password is not valid!!!');
                }
                item.newPwd = '';
                item.conPwd = '';
            }
        }
        this.cleanPwd();
        return false;
    }
    $scope.delUser = function(item) {
        if (!isValidString(item.password, 'passwd')) {
            alert('password error!!!');
        } else {
            var delInfo = $resource('/api/deluser/' + item.key, {}, {
                'delinfo': { method:'PUT' }
            });
            var this_obj = this;
            delInfo.delinfo({pwd: item.password}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    alert("user deleted successfully!");
                    item.isDel = true;
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }
        item.password = '';
        //this.cleanPwd();
        return false;
    }
}

function LoginCntl($route, $routeParams, $location, $resource, $scope, $location) {
}

function StorageInfoCntl($route, $routeParams, $location, $resource, $scope, $location, $window, $cookies, $filter, FileUploader) {
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.itemList = [];
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.dirTaglist = {isDel: false, list: [], show: false};
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.exactlyMatch = false;
    $scope.parentPage = 0;
    $scope.parentName = '';
    $scope.parentMore = true;
    $scope.parentMoreDisabled = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.bookmarkID = '';
    $scope.latest = '';
    $scope.fileSort = {name:'', mtime: '', sort: 'name/asc'};
    $scope.dirSort = {name:'', mtime: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};
    var lastRoute = $route.current;
    $scope.$on('$locationChangeSuccess', function(event) {
        if ($window.location.pathname === '/Storage') {
            $route.current = lastRoute;
        }
    });
    //$scope.navList.splice(0,1);
    //console.log($routeParams);

    window.onbeforeunload = function (event) {
        /*var mediaApi = $resource('/api/media/record', {}, {
            'record': { method:'get' }
        });
        mediaApi.record({}, function (result) {
            console.log(result);
        });
        return 'window close';*/
        var vId = $scope.video.id;
        if (vId) {
            var vTime = parseInt(video.currentTime);
            var vXmlhttp = new XMLHttpRequest();
            vXmlhttp.open("GET", "/api/media/record/" + vId + '/' + vTime, false);//the false is for making the call synchronous
            vXmlhttp.setRequestHeader("Content-type", "application/json");
            vXmlhttp.send('');
        }
        var mId = $scope.music.id;
        if (mId) {
            var mTime = parseInt(music.currentTime);
            var mXmlhttp = new XMLHttpRequest();
            mXmlhttp.open("GET", "/api/media/record/" + mId + '/' + mTime, false);//the false is for making the call synchronous
            mXmlhttp.setRequestHeader("Content-type", "application/json");
            mXmlhttp.send('');
        }
    };

    $scope.$on('dirTaglist', function(e, d) {
        var result = JSON.parse(d);
        $scope.dirTaglist.list.push({name: result.name, id: result.id});
    });
    $scope.$on('latest', function(e, d) {
        var result = JSON.parse(d);
        console.log($scope);
        if ($scope.bookmarkID && $scope.bookmarkID === result.id) {
            $scope.latest = result.latest;
        }
    });
    $scope.$on('file', function(e, d) {
        var id = JSON.parse(d);
        var index = arrayObjectIndexOf($scope.itemList, id, 'id');
        var storageApi = $resource('/api/storage/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (result.empty) {
                    if (index !== -1) {
                        $scope.itemList.splice(index, 1);
                        $scope.page--;
                    }
                } else {
                    $scope.latest = result.latest;
                    $scope.bookmarkID = result.bookmarkID;
                    if (index !== -1) {
                        result.item.select = $scope.itemList[index].select;
                        $scope.itemList.splice(index, 1, result.item);
                    } else {
                        result.item.select = false;
                        $scope.itemList.push(result.item);
                    }
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    });

    $scope.init = function(){
        this.page = 0;
        this.more = true;
        if ($scope.dirList.length === 0){
            getParentlist();
        }
        if ($cookies.fileSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'v';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = '^';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'v';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = '^';
            }
        }
        if ($cookies.dirSortName === 'mtime') {
            this.dirSort.sort = 'mtime/';
            if ($cookies.dirSortType === 'desc') {
                this.dirSort.sort = this.dirSort.sort + 'desc';
                this.dirSort.mtime = 'v';
            } else {
                this.dirSort.sort = this.dirSort.sort + 'asc';
                this.dirSort.mtime = '^';
            }
        } else {
            this.dirSort.sort = 'name/';
            if ($cookies.dirSortType === 'desc') {
                this.dirSort.sort = this.dirSort.sort + 'desc';
                this.dirSort.name = 'v';
            } else {
                this.dirSort.sort = this.dirSort.sort + 'asc';
                this.dirSort.name = '^';
            }
        }
        if ($cookies.bookmarkSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'v';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = '^';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.name = 'v';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.name = '^';
            }
        }
        getItemlist(this);
        getBookmarklist();
    }

    /*console.log($scope.uploader);
    $scope.uploader.onCompleteAll = function() {
        console.info('storage');
    };*/

    $scope.changeSort = function(sort, name) {
        if (this[sort]) {
            if (name === 'name') {
                this[sort].sort = 'name/';
                if (this[sort].name === '^') {
                    this[sort].name = 'v';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].name = '^';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].mtime = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === '^') {
                    this[sort].mtime = 'v';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].mtime = '^';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].name = '';
            }
            console.log(sort);
            if (sort === 'fileSort') {
                this.page = 0;
                getItemlist(this);
                this.more = true;
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            } else if (sort === 'dirSort') {
                this.parentPage = 0;
                this.parentMore = true;
                getTaglist(this);
            }
        }
    }

    $scope.submitText = function() {
        console.log(this.inputText);
        var this_obj = this;
        this.page = 0;
        this.more = true;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, index+1);
    }

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
    }

    $scope.dirItemlist = function(id) {
        var parentApi = $resource('/api/parent/query/' + id, {}, {
            'query': { method:'get' }
        });
        var this_obj = this;
        this.$parent.page = 0;
        this.$parent.more = true;
        this.$parent.moreDisabled = true;
        parentApi.query({}, function (result) {
            console.log(result);
            this_obj.$parent.itemList = [];
            if (result.itemList.length > 0) {
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.$parent.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                $scope.more = false;
            }
            this_obj.$parent.page = result.itemList.length;
            this_obj.$parent.parentList = result.parentList.cur;
            this_obj.$parent.historyList = result.parentList.his;
            this_obj.$parent.exactlyList = result.parentList.exactly;
            this_obj.$parent.moreDisabled = false;
            console.log(this_obj.$parent.itemList);
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getItemlist = function (this_obj, name, index) {
        console.log(this_obj.page);
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info, exactly = 'false';
        if (index) {
            if (this_obj.exactlyList[index-1]) {
                exactly = 'true';
            }
        } else if (this_obj.exactlyMatch){
            exactly = 'true';
        }
        if (!name && !index) {
            Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                'storage': { method:'GET' }
            });
        } else if (name && !index) {
            if (isValidString(name, 'name')) {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                console.log(name);
                alert('search tag is not vaild!!!');
                return false;
            }
        } else if (!name && index) {
            alert("not enough parameter");
            return false;
        } else {
            if (isValidString(name, 'name') && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                alert('search tag is not vaild!!!');
                return false;
            }
        }
        this_obj.moreDisabled = true;
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                console.log(result);
                if (this_obj.page === 0) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.page = this_obj.page + result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
                console.log(this_obj.itemList);
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.resetStorage = function() {
        var this_obj = this;
        this.page = 0;
        $scope.more = true;
        $scope.moreDisabled = true;
        Info = $resource('/api/storage/reset', {}, {
            'storage': { method:'GET' }
        });
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                console.log(result);
                this_obj.itemList = [];
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    this_obj.itemList.push(result.itemList[i]);
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
                console.log(this_obj.itemList);
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.$watch("itemList", function(newVal, oldVal) {
        $scope.selectList = $filter("filter")(newVal, {select:true});
        if ($scope.selectList.length > 0) {
            $scope.tagList = $scope.selectList[0].tags;
            for (var i = 1; i < $scope.selectList.length; i++) {
                $scope.tagList = intersect($scope.tagList, $scope.selectList[i].tags);
            }
        } else {
            $scope.tagList = [];
        }
        console.log($scope.selectList);
        console.log($scope.tagList);
    }, true);

    $scope.submitTag = function() {
        console.log(this.inputTag);
        if (this.inputTag) {
            if (isValidString(this.inputTag, 'name')) {
                console.log(this.selectList);
                var this_itemList = this.itemList;
                var this_inputTag = this.inputTag;
                if (this.selectList.length > 0) {
                    for (var i in this.selectList) {
                        var Info = $resource('/api/addTag/' + this.selectList[i].id, {}, {
                            'addTag': { method:'PUT' }
                        });
                        Info.addTag({tag: this.inputTag}, function (result) {
                            console.log(result);
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            }
                        }, function(errorResult) {
                            console.log(errorResult);
                            if (errorResult.status === 400) {
                                alert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                alert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    }
                } else {
                    alert('Please selects item!!!');
                }
            } else {
                alert('New tag is not vaild!!!');
            }
            this.inputTag = '';
        } else {
            alert('Please inputs new tag!!!');
        }
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            console.log(this.selectList);
            var this_itemList = this.itemList;
            if (this.selectList.length > 0) {
                for (var i in this.selectList) {
                    var Info = $resource('/api/delTag/' + this.selectList[i].id, {}, {
                        'delTag': { method:'PUT' }
                    });
                    Info.delTag({tag: tag}, function (result) {
                        console.log(result);
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                    }, function(errorResult) {
                        console.log(errorResult);
                        if (errorResult.status === 400) {
                            alert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            alert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                }
            } else {
                alert('Please selects item!!!');
            }
        } else {
            alert('Tag is not vaild!!!');
        }
    }

    $scope.add2Parent = function() {
        console.log(this.selectTag);
        console.log(this.addDir);
        var Info = $resource('/api/parent/add', {}, {
            'addDir': { method:'POST' }
        });
        var this_obj = this;
        Info.addDir({ name: this.addDir, tag: this.selectTag}, function (result) {
            console.log(result);
            if (result.id) {
                this_obj.dirTaglist.list.push({name: result.name, id: result.id});
                console.log(this_obj.dirTaglist);
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.del2Parent = function(id) {
        console.log(id);
        var this_obj = this;
        var Info = $resource('/api/parent/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            console.log(result);
            if (result.id) {
                index = arrayObjectIndexOf(this_obj.$parent.dirTaglist.list, result.id, "id");
                if (index !== -1) {
                    this_obj.$parent.dirTaglist.list.splice(index, 1);
                    this_obj.parentPage--;
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getTaglist = function(this_obj) {
        console.log(this_obj);
        if (isValidString(this_obj.parentName, 'name')) {
            this_obj.parentMoreDisabled = true;
            var Info = $resource('/api/parent/taglist/' + this_obj.parentName + '/' + this_obj.dirSort.sort + '/' + this_obj.parentPage, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
                console.log(result);
                if (this_obj.parentPage === 0) {
                    this_obj.dirTaglist.list = [];
                }
                if (result.taglist.length > 0) {
                    for (var i in result.taglist) {
                        if (arrayObjectIndexOf(this_obj.dirTaglist.list, result.taglist[i].id, 'id') === -1) {
                            this_obj.dirTaglist.list.push(result.taglist[i]);
                        }
                    }
                    this_obj.parentPage = this_obj.parentPage + result.taglist.length;
                    this_obj.dirTaglist.isDel = result.isDel;
                    this_obj.dirTaglist.show = true;
                } else {
                    $scope.parentMore = false;
                }
                $scope.parentMoreDisabled = false;
            }, function(errorResult) {
                $scope.parentMoreDisabled = false;
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('Parent name is not vaild!!!');
        }
    }

    $scope.showTaglist = function(name) {
        console.log(name);
        this.$parent.parentName = name;
        this.$parent.parentPage = 0;
        this.$parent.parentMore = true;
        getTaglist(this.$parent);
    }

    $scope.moreDirtaglist = function() {
        getTaglist(this);
    }

    $scope.fileDel = function(item) {
        var this_itemList = this.itemList;
        var Info = $resource('/api/delFile/' + item.id + '/' + item.recycle, {}, {
            'delFile': { method:'DELETE' }
        });
        Info.delFile({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            /*} else {
                if (result.del) {
                    for (var i in this_itemList) {
                        if (result.key === this_itemList[i].id) {
                            this_itemList.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    item.recycle = 1;
                }*/
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
        return false;
    }

    $scope.fileEdit = function(item) {
        console.log('edit');
        if (isValidString(item.name, 'name')) {
            var editFile = $resource('/api/editFile/' + item.id, {}, {
                'editfile': { method:'PUT' }
            });
            var this_obj = this;
            editFile.editfile({name: item.name}, function(result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (this_obj.$parent.feedback.run) {
                        this_obj.$parent.feedback.queue.push(result);
                    } else {
                        this_obj.$parent.feedback.run = true;
                        showFeedback(result);
                    }
                    delete item["Edit"];
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('name not vaild!!!');
        }
        return false;
    }

    $scope.edit = function(item){
        if (item["Edit"]) {
            this.fileEdit(item);
        } else if (item.isOwn) {
            item["orig"] = item.name;
            item["Edit"] = true;
        }
    }

    $scope.esc = function(item) {
        //recover
        item.name = item["orig"];
        delete item["Edit"];
        $window.location.href = '#image';
    }

    $scope.showMedia = function(item, type) {
        var preType = '', status = 0;
        switch (type) {
            case 'image':
                preType = 'image';
                status = 2;
                break;
            case 'video':
                preType = 'video';
                status = 3;
                break;
            case 'music':
                preType = 'video';
                status = 4;
                break;
            case 'doc':
                preType = 'preview';
                status = 5;
                break;
            case 'rawdoc':
                preType = 'preview';
                status = 6;
                break;
            default:
                alert('unknown type');
                return false;
        }
        var this_obj = this;
        var apiMedia = $resource('/api/media/saveParent', {}, {
            'saveParent': { method:'POST' }
        });
        apiMedia.saveParent({name: type}, function(result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (type === 'video' || type === 'music') {
                    if (this_obj[type].id) {
                        this_obj.mediaRecord(type);
                    }
                    var mediaApi = $resource('/api/media/setTime/' + item.id, {}, {
                        'setTime': { method:'GET' }
                    });
                    mediaApi.setTime({}, function (result) {
                        console.log(result);
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            if (result.time) {
                                if (type === 'video') {
                                    videoStart = result.time;
                                } else {
                                    musicStart = result.time;
                                }
                            }
                            this_obj.$parent[type].src = '/' + preType + '/' + item.id;
                            if (type === 'video') {
                                var track = video.textTracks[0];
                                if (track.activeCues) {
                                    var activeCue = track.activeCues[0];
                                    track.removeCue(activeCue);
                                }
                                this_obj.$parent[type].sub = '/subtitle/' + item.id;
                            }
                            var tempList = $filter("filter")(this_obj.itemList, {status: status});
                            this_obj.$parent[type].name = item.name;
                            this_obj.$parent[type].bookmarkID = $scope.bookmarkID;
                            this_obj.$parent[type].id = item.id;
                            if ($scope.bookmarkID) {
                                $scope.latest = item.id;
                            }
                            this_obj.$parent.mediaToggle(type);
                            this_obj.$parent[type].list = clone(tempList);
                            this_obj.$parent[type].front = this_obj.$parent[type].list.length;
                            this_obj.$parent[type].frontPage = this_obj.$parent[type].front;
                            var index = arrayObjectIndexOf(this_obj.$parent[type].list, item.id, 'id');
                            if (index !== -1) {
                                this_obj.$parent[type].index = index;
                            }
                        }
                    }, function(errorResult) {
                        console.log(errorResult);
                        if (errorResult.status === 400) {
                            alert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            alert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    this_obj.$parent[type].src = '/' + preType + '/' + item.id;
                    if (type === 'video') {
                        var track = video.textTracks[0];
                        if (track.activeCues) {
                            var activeCue = track.activeCues[0];
                            track.removeCue(activeCue);
                        }
                        this_obj.$parent[type].sub = '/subtitle/' + item.id;
                    }
                    var tempList = $filter("filter")(this_obj.itemList, {status: status});
                    this_obj.$parent[type].name = item.name;
                    this_obj.$parent[type].bookmarkID = $scope.bookmarkID;
                    this_obj.$parent[type].id = item.id;
                    if ($scope.bookmarkID) {
                        $scope.latest = item.id;
                    }
                    this_obj.$parent.mediaToggle(type)
                    this_obj.$parent[type].list = clone(tempList);
                    this_obj.$parent[type].front = this_obj.$parent[type].list.length;
                    this_obj.$parent[type].frontPage = this_obj.$parent[type].front;
                    var index = arrayObjectIndexOf(this_obj.$parent[type].list, item.id, 'id');
                    if (index !== -1) {
                        this_obj.$parent[type].index = index;
                    }
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.downloadFile = function (id) {
        console.log('/download/' + id);
        $window.location.href = '/download/' + id;
    }

    $scope.handleMedia = function(item, action) {
        if (action == 'act' || action == 'del') {
            var handleMedia = $resource('/api/handleMedia/' + item.id + '/' + action, {}, {
                'handlemedia': { method:'GET' }
            });
            handleMedia.handlemedia({}, function(result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {

                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('handle action not vaild!!!');
        }
        return false;
    }

    $scope.uploaderSub = function(id) {
        this.miscUploader.url = 'upload/subtitle/' + id;
        this.miscUploader.open = true;
        console.log(this.miscUploader);
    }

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        this.$parent.moreDisabled = true;
        bookmarkapi.getbookmark({}, function(result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    this_obj.$parent.itemList.push(result.itemList[i]);
                }
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                this_obj.$parent.moreDisabled = false;
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getBookmarklist = function() {
        var bookmarkapi = $resource('/api/bookmark/getlist/' + $scope.bookmarkSort.sort, {}, {
            'getbookmarklist': { method:'GET' }
        });
        bookmarkapi.getbookmarklist({}, function(result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.bookmarkList = result.bookmarkList;
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.addBookmark = function() {
        if (this.parentList.length <= 0) {
            alert('Empty parent list!!!');
            return false;
        }
        if (isValidString(this.bookmarkName, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: this.bookmarkName}, function(result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push(result);
                    }
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('Bookmark name is not valid!!!');
        }
    }

    $scope.delBookmark = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/del/' + id, {}, {
            'delbookmark': { method:'DELETE' }
        });
        bookmarkapi.delbookmark({}, function(result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf(this_obj.$parent.bookmarkList, result.id, "id");
                console.log(index);
                if (index !== -1) {
                    this_obj.$parent.bookmarkList.splice(index, 1);
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
}

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, msg) {
    $scope.msg = msg;
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

app.controller('TodoCrtlRemovable', ['$scope', '$http', '$resource', '$location', '$route', '$window', '$cookies', '$timeout', '$filter', '$modal', 'FileUploader', function($scope, $http, $resource, $location, $route, $window, $cookies, $timeout, $filter, $modal, FileUploader) {
    $scope.newItem = "";
    $scope.username = '';
    $scope.password = '';
    $scope.collapse= {};
    $scope.collapse.nav = true;
    $scope.widget = {};
    $scope.widget.uploader = false;
    $scope.widget.feedback = false;
    $scope.dropdown = {};
    $scope.feedbackSelectTag = '';
    $scope.mediaMoreDisabled = false;
    $scope.isLogin = false;
    $scope.isFull = false;
    $scope.loginFocus = {user: true, pwd:false};
    openModal = function (msg) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        });
        return modalInstance.result;
    };

    $scope.selectFeedbackTag = function($event, tag) {
        var pre = $scope.feedbackSelectTag;
        $scope.feedbackSelectTag = tag;
        console.log($scope.feedbackSelectTag);
        if (!pre || tag === pre) {
            this.toggleDropdown($event, 'feedback');
        } else {
            this.toggleDropdown($event, 'feedback', true);
        }
    }
    $scope.toggleWidget = function (type) {
        if (!this.widget[type]) {
            this.widget[type] = true;
        } else {
            this.widget[type] = false;
        }
    }
    $scope.toggleDropdown = function($event, type, action) {
        $event.preventDefault();
        $event.stopPropagation();
        if (typeof action !== 'undefined') {
            $scope.dropdown[type] = action;
        } else {
            $scope.dropdown[type] = !$scope.dropdown[type];
        }
    };
    var uploader = $scope.uploader = new FileUploader({
        url: 'upload/file'
    });
    /*uploader.bind('beforeupload', function (event, item) {
        item.url = uploader.url;
    });*/
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        $scope.widget.uploader = true;
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        if ($scope.feedback.run) {
            $scope.feedback.queue.push(response);
        } else {
            $scope.feedback.run = true;
            showFeedback(response);
        }
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    var miscUploader = $scope.miscUploader = new FileUploader({
        url: 'upload/subtitle'
    });
    /*uploader.bind('beforeupload', function (event, item) {
        item.url = uploader.url;
    });*/
    miscUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    miscUploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        this.uploadAll()
    };
    miscUploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    miscUploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    miscUploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    miscUploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    miscUploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        alert('done');
        this.open = false;
        this.clearQueue();
    };
    miscUploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        alert(response);
        this.open = false;
        this.clearQueue();
    };
    miscUploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    miscUploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    miscUploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    $scope.addItem = function() {
        if(this.newItem) {
            this.todoList.push({label:this.newItem,isFinish:false});
            this.newItem = "";
        }
    }
    $scope.removeItem = function(item){
        item.isFinish = true;
    }
    $scope.main_edit = function(item, type){
        item[type+"Edit"] = true;
        console.log(item[type+"Edit"]);
    }
    $scope.main_save = function(item, type){
        console.log(type);
        this.editType = type;
        console.log(this.editType);
        delete item[type+"Edit"];
    }

    $scope.doLogout = function(){
        var Users = $resource('/api/logout', {}, {
            'logout': { method:'GET' }
        });
        Users.logout({}, function (user) {
            if (user.loginOK) {
                $window.location.href = $location.path();
            } else {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.doLogin = function() {
        if (isValidString(this.username, 'name') && isValidString(this.password, 'passwd')) {
            var Users = $resource('/api', {}, {
                'login': { method:'POST' }
            });

            Users.login({ username: this.username, password: this.password}, function (user) {
                console.log(user);
                if (user.loginOK) {
                    $window.location.href = $location.path();
                }
            }, function (errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('user name or password is not vaild!!!');
            this.username = '';
            this.password = '';
        }
    }
    $scope.addFeedback = function() {
        console.log(this.feedbackInput);
        if (this.feedbackInput) {
            this.feedback.list.splice(0, 0, {tag: this.feedbackInput, select: true});
            this.feedbackInput = '';
        }
    }
    $scope.sendFeedback = function() {
        var this_obj = this;
        var sendList = [];
        for (var i in this.feedback.list) {
            if (isValidString(this.feedback.list[i].tag, 'name')) {
                sendList.push(this.feedback.list[i]);
            }
        }
        if (isValidString(this.feedback.name, 'name')) {
            var Info = $resource('/api/sendTag/' + this.feedback.uid, {}, {
                'sendTag': { method:'PUT' }
            });
            Info.sendTag({tags: sendList, name: this.feedback.name}, function (result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.feedback.history = result.history;
                    console.log(this_obj.feedback.history);
                    if (this_obj.feedback.queue.length > 0) {
                        var response = this_obj.feedback.queue.splice(0, 1);
                        showFeedback(response[0]);
                    } else {
                        this_obj.feedback.run = false;
                        getFeedbacks(0);
                    }
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('feed back name is not valid!!!');
        }
        return false;
    }

    showFeedback = function (response) {
        console.log(response);
        if ($scope.dirList.length === 0){
            getParentlist();
        }
        $scope.feedback.name = response.name;
        $scope.feedback.uid = response.id;
        $scope.feedback.list = [];
        for (var i in response.select) {
            $scope.feedback.list.push({tag: response.select[i], select: true});
        }
        for (var i in response.option) {
            $scope.feedback.list.push({tag: response.option[i], select: false});
        }
        $scope.feedback.other = response.other;
        var index = 0, searchTag='';
        for (var i in $scope.feedback.history) {
            searchTag = $scope.feedback.history[i].tag;
            index = arrayObjectIndexOf($scope.feedback.list, searchTag, "tag");
            if (index === -1) {
                if ($scope.feedback.history[i].select) {
                    $scope.feedback.list.push($scope.feedback.history[i]);
                }
            } else {
                $scope.feedback.list[index].select = $scope.feedback.history[i].select;
            }
        }
        console.log($scope.feedback);
    };

    var updateClock = function() {
        var date = new Date();
        $scope.clock = date.toString();
    };
    var timer = setInterval(function() {
        $scope.$apply(updateClock);
    }, 1000);
    updateClock();
    console.log($cookies);
    $scope.id = 'guest';
    /*if ($cookies.id) {
        $scope.id = $cookies.id;
    } else {
        $scope.id = 'guest';
    }*/
    $scope.feedback = {uid: '', name: '', list: [], run: false, queue: [], history: [], other: []};
    $scope.mediaShow = [];
    $scope.navList = [{title: "homepage", hash: "/", css: "fa fa-fw fa-dashboard", active: true}, {title: "Storage", hash: "/Storage", css: "fa fa-fw fa-desktop", active: false}];
    $scope.image = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.video = {id: "", src: "", sub: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.music = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.doc = {id: "", src: "123.pdf", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.rawdoc = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.dirList = [];

    indexInit();

    function indexInit() {
        var Info = $resource('/api/getUser', {}, {
            'getUser': { method:'GET' }
        });
        Info.getUser({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.isLogin = true;
                $scope.id = result.id;
                var ws = new WebSocket(result.ws_url, result.ws);
                ws.onopen = function(){
                    console.log(result.ws + ": Socket has been opened!");
                    //var obj = {type:'test', data: '12345'};
                    //ws.send(JSON.stringify(obj));
                };

                ws.onmessage = function(message) {
                    var wsmsg = JSON.parse(message.data);
                    switch (wsmsg.type) {
                        case 'file':
                            console.log(wsmsg);
                            $scope.$broadcast('file', JSON.stringify(wsmsg.data));
                            break;
                        default:
                            console.log(wsmsg);
                    }
                };
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                //alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            }
        });
        getFeedbacks(1);
    }

    function getFeedbacks(init) {
        init = typeof init !== 'undefined' ? init : 0;
        var Info = $resource('/api/feedback', {}, {
            'getFeedback': { method:'GET' }
        });
        Info.getFeedback({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.feedback.queue = $scope.feedback.queue.concat(result.feedbacks);
                if ($scope.feedback.queue.length > 0 && !$scope.feedback.run) {
                    $scope.feedback.run = true;
                    var response = $scope.feedback.queue.splice(0, 1);
                    showFeedback(response[0]);
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                //alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401 && !init) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.mediaRecord = function(type, end) {
        console.log('record');
        var id = this[type].id;
        var time = 0;
        if (id) {
            if (type === 'video') {
                if (!end) {
                    time = parseInt(video.currentTime);
                }
            } else if (type === 'music') {
                if (!end) {
                    time = parseInt(music.currentTime);
                }
            } else {
                return;
            }
            var mediaApi = $resource('/api/media/record/' + id + '/' + time, {}, {
                'record': { method:'GET' }
            });
            mediaApi.record({}, function (result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }
    }

    $scope.testLogin = function() {
        var testApi = $resource('/api/getUser', {}, {
            'testLogin': { method:'GET' }
        });
        testApi.testLogin({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.mediaMove = function(number, type, end) {
        console.log(this[type]);
        var preType = '', status = 0, isLoad = false;
        switch (type) {
            case 'image':
                preType = 'image';
                status = 2;
                break;
            case 'video':
                preType = 'video';
                status = 3;
                break;
            case 'music':
                preType = 'video';
                status = 4;
                break;
            case 'doc':
                preType = 'preview';
                status = 5;
                break;
            case 'rawdoc':
                preType = 'preview';
                status = 6;
                break;
            default:
                alert('unknown type');
                return false;
        }
        var this_obj = this;
        this[type].index = +this[type].index + number;
        if (this[type].index >= this[type].front) {
            if (!this[type].end) {
                isLoad = true;
                if ($scope.mediaMoreDisabled) {
                    this[type].index = +this[type].index - number;
                    return false;
                }
                $scope.mediaMoreDisabled = true;
                var mediaApi = $resource('/api/media/more/' + status + '/' + this[type].frontPage, {}, {
                    'more': { method:'GET' }
                });
                mediaApi.more({}, function (result) {
                    console.log(result);
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (this_obj[type].back) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.push(result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = this_obj[type].list.concat(result.itemList);
                            }
                            if (length === this_obj[type].list.length) {
                                this_obj[type].index = -this_obj[type].back;
                            } else {
                                this_obj[type].front = this_obj[type].front + this_obj[type].list.length - length;
                            }
                            this_obj[type].frontPage = this_obj[type].frontPage + result.itemList.length;
                            console.log(this_obj[type].list);
                        } else {
                            $scope[type].end = true;
                            console.log($scope[type].end);
                            this_obj[type].index = -this_obj[type].back;
                        }
                        $scope.mediaMoreDisabled = false;
                        console.log(this_obj[type].end);
                        if (type === 'video' || type === 'music') {
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, end);
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                console.log(result);
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (result.time) {
                                        if (type === 'video') {
                                            videoStart = result.time;
                                        } else {
                                            musicStart = result.time;
                                        }
                                    }
                                    if (this_obj[type].list.length === 1 && type === 'video') {
                                        video.currentTime = 0;
                                        //video.play();
                                    } else if (this_obj[type].list.length === 1 && type === 'music') {
                                        music.currentTime = 0;
                                        //music.play();
                                    } else {
                                        this_obj[type].src = '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        if (type === 'video') {
                                            var track = video.textTracks[0];
                                            if (track.activeCues) {
                                                var activeCue = track.activeCues[0];
                                                track.removeCue(activeCue);
                                                this_obj[type].sub = '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                            }
                                        }
                                    }
                                    console.log(this_obj[type].index);
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                                }
                            }, function(errorResult) {
                                console.log(errorResult);
                                if (errorResult.status === 400) {
                                    alert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    alert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        } else {
                            if (this_obj[type].list.length === 1 && type === 'video') {
                                video.currentTime = 0;
                                //video.play();
                            } else if (this_obj[type].list.length === 1 && type === 'music') {
                                music.currentTime = 0;
                                //music.play();
                            } else {
                                this_obj[type].src = '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                if (type === 'video') {
                                    var track = video.textTracks[0];
                                    if (track.activeCues) {
                                        var activeCue = track.activeCues[0];
                                        track.removeCue(activeCue);
                                        this_obj[type].sub = '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    }
                                }
                            }
                            console.log(this_obj[type].index);
                            this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                            this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                            this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
                    console.log(errorResult);
                    if (errorResult.status === 400) {
                        alert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        alert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                this[type].index = -this[type].back;
            }
        } else if (this[type].index < -this[type].back) {
            if (!this[type].end) {
                isLoad = true;
                var mediaApi = $resource('/api/media/more/' + status + '/' + this[type].backPage + '/back', {}, {
                    'more': { method:'GET' }
                });
                var this_obj = this;
                if ($scope.mediaMoreDisabled) {
                    this[type].index = +this[type].index - number;
                    return false;
                }
                $scope.mediaMoreDisabled = true;
                mediaApi.more({}, function (result) {
                    console.log(result);
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (this_obj[type].front) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.splice(0, 0, result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = result.itemList.reverse().concat(this_obj[type].list);
                            }
                            if (length === this_obj[type].list.length) {
                                this_obj[type].index = this_obj[type].front - 1;
                            } else {
                                this_obj[type].back = this_obj[type].back + this_obj[type].list.length - length;
                            }
                            this_obj[type].backPage = this_obj[type].backPage + result.itemList.length;
                            console.log(this_obj[type].list);
                        } else {
                            this_obj[type].index = this_obj[type].front - 1;
                            this_obj[type].end = true;
                        }
                        console.log(this_obj[type].end);
                        $scope.mediaMoreDisabled = false;
                        if (type === 'video' || type === 'music') {
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, end);
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                console.log(result);
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (result.time) {
                                        if (type === 'video') {
                                            videoStart = result.time;
                                        } else {
                                            musicStart = result.time;
                                        }
                                    }
                                    if (this_obj[type].list.length === 1 && type === 'video') {
                                        video.currentTime = 0;
                                        //video.play();
                                    } else if (this_obj[type].list.length === 1 && type === 'music') {
                                        music.currentTime = 0;
                                        //music.play();
                                    } else {
                                        this_obj[type].src = '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        if (type === 'video') {
                                            var track = video.textTracks[0];
                                            if (track.activeCues) {
                                                var activeCue = track.activeCues[0];
                                                track.removeCue(activeCue);
                                                this_obj[type].sub = '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                            }
                                        }
                                    }
                                    console.log(this_obj[type].index);
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                                }
                            }, function(errorResult) {
                                console.log(errorResult);
                                if (errorResult.status === 400) {
                                    alert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    alert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        } else {
                            if (this_obj[type].list.length === 1 && type === 'video') {
                                video.currentTime = 0;
                                //video.play();
                            } else if (this_obj[type].list.length === 1 && type === 'music') {
                                music.currentTime = 0;
                                //music.play();
                            } else {
                                this_obj[type].src = '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                if (type === 'video') {
                                    var track = video.textTracks[0];
                                    if (track.activeCues) {
                                        var activeCue = track.activeCues[0];
                                        track.removeCue(activeCue);
                                        this_obj[type].sub = '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    }
                                }
                            }
                            console.log(this_obj[type].index);
                            this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                            this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                            this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
                    console.log(errorResult);
                    if (errorResult.status === 400) {
                        alert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        alert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                this[type].index = this[type].front - 1;
            }
        }
        if (!isLoad) {
            if (type === 'video' || type === 'music') {
                if (this[type].id) {
                    this.mediaRecord(type, end);
                }
                var mediaApi = $resource('/api/media/setTime/' + this[type].list[this[type].index + this[type].back].id, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    console.log(result);
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.time) {
                            if (type === 'video') {
                                videoStart = result.time;
                            } else {
                                musicStart = result.time;
                            }
                        }
                        if (this_obj[type].list.length === 1 && type === 'video') {
                            video.currentTime = 0;
                            //video.play();
                        } else if (this_obj[type].list.length === 1 && type === 'music') {
                            music.currentTime = 0;
                            //music.play();
                        } else {
                            this_obj[type].src = '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                            if (type === 'video') {
                                var track = video.textTracks[0];
                                if (track.activeCues) {
                                    var activeCue = track.activeCues[0];
                                    track.removeCue(activeCue);
                                    this_obj[type].sub = '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                }
                            }
                        }
                        console.log(this_obj[type].index);
                        this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                        this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                    }
                }, function(errorResult) {
                    console.log(errorResult);
                    if (errorResult.status === 400) {
                        alert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        alert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                if (this_obj[type].list.length === 1 && type === 'video') {
                    video.currentTime = 0;
                    //video.play();
                } else if (this_obj[type].list.length === 1 && type === 'music') {
                    music.currentTime = 0;
                    //music.play();
                } else {
                    this[type].src = '/' + preType + '/' + this[type].list[this[type].index + this[type].back].id;
                    if (type === 'video') {
                        var track = video.textTracks[0];
                        if (track.activeCues) {
                            var activeCue = track.activeCues[0];
                            track.removeCue(activeCue);
                            this[type].sub = '/subtitle/' + this[type].list[this[type].index + this[type].back].id;
                        }
                    }
                }
                console.log(this[type].index);
                this[type].id = this[type].list[this[type].index + this[type].back].id;
                this.$broadcast('latest', JSON.stringify({id: this[type].bookmarkID, latest: this[type].id}));
                this[type].name = this[type].list[this[type].index + this[type].back].name;
            }
        }
    }
    $scope.mediaToggle = function(type) {
        switch (type) {
            case 'image':
            case 'video':
            case 'music':
            case 'doc':
            case 'rawdoc':
                break;
            default:
                alert('unknown type');
                return false;
        }
        if (this.mediaShow[0] === type) {
            this.mediaShow.splice(0,1);
            if (type === 'video') {
                video.pause();
            }
        } else {
            var index = this.mediaShow.indexOf(type);
            if (index === -1) {
                this.mediaShow.splice(0,0, type);
            } else {
                this.mediaShow.splice(index, 1);
                this.mediaShow.splice(0,0, type);
            }
        }
    }
    getParentlist = function() {
        Info = $resource('/api/parent/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.dirList = result.parentList;
                console.log($scope.dirList);
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                alert(errorResult.data);
            } else if (errorResult.status === 403) {
                alert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.feedbackAdd2Parent = function(name) {
        console.log(name);
        console.log($scope.feedbackSelectTag);
        if (isValidString(name, 'name') && isValidString($scope.feedbackSelectTag, 'name')) {
            var Info = $resource('/api/parent/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: name, tag: $scope.feedbackSelectTag}, function (result) {
                console.log(result);
                if (result.id) {
                    this_obj.$broadcast('dirTaglist', JSON.stringify({id: result.id, name: result.name}));
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    alert(errorResult.data);
                } else if (errorResult.status === 403) {
                    alert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            alert('add parent is not valid!!');
        }
        return false;
    }
}]);