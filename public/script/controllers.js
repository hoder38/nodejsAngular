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
}).directive('blurMe', function() {
    return {
        scope: { trigger: '=blurMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].blur();
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
    $scope.$parent.currentPage = -1;
    $scope.uInfo = [];
    $scope.password = "";
    $scope.timer = false;
    $scope.init = function(){
        var Info = $resource('/api/userinfo', {}, {
            'userinfo': { method:'GET' }
        });
        var this_obj = this;
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
                    this_obj.uInfo.push(result.user_info[i]);
                }
                console.log(this_obj.uInfo);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.addUser = function(item) {
        if (!isValidString(item.password, 'passwd')) {
            addAlert('password error!!!');
        } else {
            if (item.newable) {
                if (!isValidString(item.name, 'name')) {
                    addAlert('name not vaild!!!');
                } else if (!isValidString(item.desc, 'desc')) {
                    addAlert('desc not vaild!!!');
                } else if (!isValidString(item.perm, 'perm')) {
                    addAlert('perm not vaild!!!');
                } else if (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd')) {
                    addAlert('new password is not valid!!!');
                    item.newPwd = '';
                    item.conPwd = '';
                } else if (item.newPwd !== item.conPwd) {
                    addAlert('confirm password must equal!!!');
                    item.newPwd = '';
                    item.conPwd = '';
                } else {
                    var addInfo = $resource('/api/adduser', {}, {
                        'addinfo': { method:'POST' }
                    });
                    console.log({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, pwd: item.password});
                    var this_uInfo = this.uInfo;
                    addInfo.addinfo({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, pwd: item.password}, function (result) {
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
                                item["password"] = '';
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
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                }
            }
        }
        item.password = '';
        return false;
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
            addAlert('password error!!!');
        } else {
            if (!isValidString(item.name, 'name') && item.edit) {
                addAlert('name not vaild!!!');
            } else if (!isValidString(item.desc, 'desc') && item.edit && item.hasDesc) {
                addAlert('desc not vaild!!!');
            } else if (!isValidString(item.perm, 'perm') && item.edit && item.hasPerm) {
                addAlert('perm not vaild!!!');
            } else if ((item.newPwd || item.conPwd) && (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd'))) {
                item.newPwd = '';
                item.conPwd = '';
                addAlert('new password is not vaild!!!');
            } else if (item.newPwd !== item.conPwd) {
                item.newPwd = '';
                item.conPwd = '';
                addAlert('confirm password is not vaild!!!');
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
                        console.log(result);
                        addAlert('edit complete');
                        if (result.hasOwnProperty('name')) {
                            item.name = result.name;
                        }
                        if (result.hasOwnProperty('desc')) {
                            item.desc = result.desc;
                        }
                        if (result.hasOwnProperty('perm')) {
                            item.perm = result.perm;
                        }
                        if (result.hasOwnProperty('owner')) {
                            this_obj.$parent.$parent.id = result.owner;
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
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }
        item.password = '';
        return false;
    }
    $scope.delUser = function(item) {
        if (!isValidString(item.password, 'passwd')) {
            addAlert('password error!!!');
        } else {
            var delInfo = $resource('/api/deluser/' + item.key, {}, {
                'delinfo': { method:'PUT' }
            });
            var this_obj = this;
            delInfo.delinfo({pwd: item.password}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    addAlert("user deleted successfully!");
                    item.isDel = true;
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
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
    $scope.$parent.currentPage = 0;
    $scope.$parent.collapse.nav = true;
}

function StorageInfoCntl($route, $routeParams, $location, $resource, $scope, $location, $window, $cookies, $filter, FileUploader) {
    $scope.$parent.collapse.nav = true;
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.itemList = [];
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.exactlyMatch = false;
    $scope.bookmarkCollpase = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.itemNameNew = false;
    $scope.itemNameNewFocus = false;
    $scope.tagNew = false;
    $scope.uploadSub = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.bookmarkID = '';
    $scope.bookmarkEdit = false;
    $scope.latest = '';
    $scope.dropdown.item = false;
    $scope.searchBlur = false;
    $scope.feedbackBlur = false;
    $scope.toolList = {download: false, edit: false, upload:false, del: false, item: null};
    $scope.$parent.currentPage = 1;
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
    var miscUploader = $scope.miscUploader = new FileUploader({
        url: 'upload/subtitle'
    });

    miscUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    miscUploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        if ($scope.toolList.item) {
            fileItem.url = 'upload/subtitle/' + $scope.toolList.item.id;
            this.uploadAll();
        } else {
            addAlert('Select item first!!!');
        }
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
        $scope.uploadSub = false;
        this.clearQueue();
    };
    miscUploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        addAlert(response);
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

    $scope.$on('dir', function(e, d) {
        var result = JSON.parse(d);
        console.log(result);
        for (var i in $scope.dirList) {
            if ($scope.dirList[i].name === result.parent) {
                $scope.dirList[i].list.push({name: result.name, id: result.id});
                break;
            }
        }
    });
    $scope.$on('latest', function(e, d) {
        var result = JSON.parse(d);
        if ($scope.bookmarkID && $scope.bookmarkID === result.id) {
            $scope.latest = result.latest;
        }
    });
    $scope.$on('file', function(e, d) {
        var id = JSON.parse(d);
        console.log(id);
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
                        var date;
                        result.item.select = false;
                        date = new Date(result.item.mtime*1000);
                        result.item.mtime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.push(result.item);
                    }
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                this.fileSort.mtime = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            }
        }
        if ($cookies.bookmarkSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.name = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.name = 'asc';
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
                if (this[sort].name === 'asc') {
                    this[sort].name = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].name = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].mtime = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === 'asc') {
                    this[sort].mtime = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].mtime = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].name = '';
            }
            console.log(sort);
            if (sort === 'fileSort') {
                this.page = 0;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            /*} else if (sort === 'dirSort') {
                //this.parentPage = 0;
                //this.parentMore = true;
                getTaglist(this);*/
            }
        }
    }

    $scope.changeDirSort = function(item, name) {
        if (name === 'name') {
            item.sort = 'name/';
            if (item.sortName === 'asc') {
                item.sortName = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortName = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortMtime = '';
        } else if (name === 'mtime') {
            item.sort = 'mtime/';
            if (item.sortMtime === 'asc') {
                item.sortMtime = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortMtime = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortName = '';
        }
        item.page = 0;
        item.more = true;
        getTaglist(this, item);
    }

    $scope.submitText = function() {
        console.log(this.inputText);
        var this_obj = this;
        this.page = 0;
        this.more = true;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, 0, true);
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
        var this_obj = this.$parent.$parent;
        this_obj.page = 0;
        this_obj.more = true;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            console.log(result);
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                var date;
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].mtime*1000);
                        result.itemList[i].mtime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                this_obj.more = false;
            }
            this_obj.page = result.itemList.length;
            this_obj.parentList = result.parentList.cur;
            this_obj.historyList = result.parentList.his;
            this_obj.exactlyList = result.parentList.exactly;
            this_obj.moreDisabled = false;
            this_obj.$parent.collapse.storage = true;
            console.log(this_obj.itemList);
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getItemlist = function (this_obj, name, index, isExactly) {
        console.log(this_obj.page);
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info, exactly = 'false';
        if (isExactly) {
            exactly = 'true';
        } else if (index) {
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
                addAlert('search tag is not vaild!!!');
                return false;
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if (isValidString(name, 'name') && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                addAlert('search tag is not vaild!!!');
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
                    var date;
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].mtime*1000);
                            result.itemList[i].mtime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
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
                this_obj.searchBlur = true;
                console.log(this_obj.itemList);
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                var date;
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    date = new Date(result.itemList[i].mtime*1000);
                    result.itemList[i].mtime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
        console.log(this.newTagName);
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                console.log(this.selectList);
                if (this.selectList.length > 0) {
                    var this_obj = this;
                    for (var i in this.selectList) {
                        var Info = $resource('/api/addTag/' + this.selectList[i].id, {}, {
                            'addTag': { method:'PUT' }
                        });
                        Info.addTag({tag: this.newTagName}, function (result) {
                            console.log(result);
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            }
                            if (Number(i) === this_obj.selectList.length -1) {
                                this_obj.tagNew = false;
                            }
                        }, function(errorResult) {
                            console.log(errorResult);
                            if (errorResult.status === 400) {
                                addAlert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                addAlert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    }
                } else {
                    addAlert('Please selects item!!!');
                }
            } else {
                addAlert('New tag is not vaild!!!');
            }
        } else {
            addAlert('Please inputs new tag!!!');
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
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                }
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.add2Parent = function(item) {
        if (typeof this.toolList.item === 'string') {
            var Info = $resource('/api/parent/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                console.log(result);
                if (result.id) {
                    for (var i in this_obj.dirList) {
                        if (this_obj.dirList[i].name === item.name) {
                            this_obj.dirList[i].list.push({name: result.name, id: result.id});
                            break;
                        }
                    }
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a tag!!!');
        }
    }

    $scope.del2Parent = function(id, dir) {
        console.log(id);
        var this_obj = this;
        var Info = $resource('/api/parent/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            console.log(result);
            if (result.id) {
                index = arrayObjectIndexOf(dir.list, result.id, "id");
                if (index !== -1) {
                    dir.list.splice(index, 1);
                    dir.page--;
                }
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
                console.log(result);
                if (item.page === 0) {
                    item.list = [];
                }
                if (result.taglist.length > 0) {
                    for (var i in result.taglist) {
                        if (arrayObjectIndexOf(item.list, result.taglist[i].id, 'id') === -1) {
                            item.list.push(result.taglist[i]);
                        }
                    }
                    item.page = item.page + result.taglist.length;
                } else {
                    item.more = false;
                }
                item.moreDisabled = false;
            }, function(errorResult) {
                item.moreDisabled = false;
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Parent name is not vaild!!!');
        }
    }

    $scope.showTaglist = function(item) {
        console.log(item);
        item.collpase = !item.collpase;
        if (item.list.length === 0) {
            if ($cookies['dir' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dir' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dir' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortName = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortName = 'asc';
                }
            }
            getTaglist(this.$parent, item);
        }
    }

    $scope.moreDirtaglist = function(item) {
        getTaglist(this, item);
    }

    $scope.fileRecover = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        var this_itemList = this.itemList;
        var Info = $resource('/api/recoverFile/' + item.id, {}, {
            'recoverFile': { method:'PUT' }
        });
        Info.recoverFile({}, function (result) {
            console.log(result);
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
        return false;
    }

    $scope.fileDel = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
        return false;
    }

    $scope.fileEdit = function(item) {
        console.log('edit');
        if (!item) {
            item = this.toolList.item;
        }
        if (isValidString(this.newItemName, 'name')) {
            var editFile = $resource('/api/editFile/' + item.id, {}, {
                'editfile': { method:'PUT' }
            });
            var this_obj = this;
            editFile.editfile({name: this.newItemName}, function(result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    item.name = result.name;
                    this_obj.itemNameNew = false;
                    if (this_obj.feedback.run) {
                        this_obj.feedback.queue.push(result);
                    } else {
                        this_obj.feedback.run = true;
                        showFeedback(result);
                    }
                    //delete item["Edit"];
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('name not vaild!!!');
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
                addAlert('unknown type');
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
                            this_obj.$parent.mediaToggle(type, true);
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
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
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
                    this_obj.$parent.mediaToggle(type, true)
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.downloadFile = function (id) {
        if (!id) {
            id = this.toolList.item.id;
        }
        console.log('/download/' + id);
        $window.location.href = '/download/' + id;
    }

    $scope.handleMedia = function(action, item) {
        if (!item) {
            item = this.toolList.item;
        }
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
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('handle action not vaild!!!');
        }
        return false;
    }

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.download = false;
            this.$parent.toolList.edit = false;
            this.$parent.toolList.del = false;
            this.$parent.toolList.recover = false;
            this.$parent.toolList.upload = false;
            this.$parent.toolList.delMedia = false;
        } else {
            this.$parent.toolList.download = true;
            this.$parent.toolList.dir = false;
            if (item.isOwn) {
                this.$parent.toolList.edit = true;
                this.$parent.toolList.del = true;
            } else {
                this.$parent.toolList.edit = false;
                this.$parent.toolList.del = false;
            }
            if (item.recycle === 1) {
                this.$parent.toolList.recover = true;
            } else {
                this.$parent.toolList.recover = false;
            }
            if (item.status === 3) {
                this.$parent.toolList.upload = true;
            } else {
                this.$parent.toolList.upload = false;
            }
            if (item.media) {
                this.$parent.toolList.delMedia = true;
            } else {
                this.$parent.toolList.delMedia = false;
            }
        }
        this.toggleDropdown($event, 'item');
        this.$parent.toolList.item = item;
    }

    $scope.cancelSelect = function() {
        if (this.selectList.length) {
            for (var i in this.itemList) {
                this.itemList[i].select = false;
            }
        }
        return false;
    }

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.tagNew = true;
            this.tagNewFocus = true;
        }
        return false;
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
                var date;
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    date = new Date(result.itemList[i].mtime*1000);
                    result.itemList[i].mtime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                    this_obj.$parent.itemList.push(result.itemList[i]);
                }
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                this_obj.$parent.moreDisabled = false;
                this_obj.$parent.$parent.collapse.storage = true;
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.addBookmark = function(bookmarkName) {
        if (!bookmarkName) {
            bookmarkName = this.bookmarkName;
        }
        if (this.parentList.length <= 0) {
            addAlert('Empty parent list!!!');
            return false;
        }
        if (isValidString(bookmarkName, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
                console.log(result);
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push(result);
                    }
                    this_obj.bookmarkNew = false;
                    this_obj.bookmarkName = '';
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Bookmark name is not valid!!!');
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
    $scope.collapse.storage = true;
    $scope.widget = {};
    $scope.widget.uploader = false;
    $scope.widget.feedback = false;
    $scope.dropdown = {};
    $scope.feedbackSelectTag = '';
    $scope.mediaMoreDisabled = false;
    $scope.isLogin = false;
    $scope.isFull = false;
    $scope.loginFocus = {user: true, pwd:false};
    $scope.alerts = [
    ];
    $scope.currentPage = 0;
    $scope.alertTime;
    addAlert = function(msg) {
        $scope.alerts.splice(0,0,{type: 'danger', msg: msg});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
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
        this.toggleDropdown($event, 'feedback');
    }
    $scope.toggleWidget = function (type) {
        if (!this.widget[type]) {
            this.widget[type] = true;
        } else {
            this.widget[type] = false;
        }
    }
    $scope.toggleDropdown = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown[type] = true;
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
    /*uploader.bind('beforeupload', function (event, item) {
        item.url = uploader.url;
    });*/

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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('user name or password is not vaild!!!');
            this.username = '';
            this.password = '';
        }
    }
    $scope.addFeedback = function() {
        console.log(this.feedbackInput);
        if (this.feedbackInput) {
            this.feedback.list.splice(0, 0, {tag: this.feedbackInput, select: true});
            this.feedbackInput = '';
            this.feedbackBlur = true;
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
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('feed back name is not valid!!!');
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

    /*var updateClock = function() {
        var date = new Date();
        $scope.clock = date.toString();
    };
    var timer = setInterval(function() {
        $scope.$apply(updateClock);
    }, 1000);
    updateClock();*/
    console.log($cookies);
    $scope.id = 'guest';
    /*if ($cookies.id) {
        $scope.id = $cookies.id;
    } else {
        $scope.id = 'guest';
    }*/
    $scope.feedback = {uid: '', name: '', list: [], run: false, queue: [], history: [], other: []};
    $scope.mediaShow = [];
    $scope.navList = [{title: "homepage", hash: "/", css: "fa fa-fw fa-dashboard"}, {title: "Storage", hash: "/Storage", css: "fa fa-fw fa-desktop"}];
    $scope.image = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.video = {id: "", src: "", sub: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.music = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.doc = {id: "", src: "123.pdf", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.rawdoc = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: ''};
    $scope.dirList = [];
    $scope.dirEdit = false;

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
                var ws = new WebSocket(result.ws_url);
                ws.onopen = function(){
                    console.log(result.ws_url + ": Socket has been opened!");
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
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
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
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
                addAlert('unknown type');
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
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
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
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
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
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
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
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
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
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
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
    $scope.mediaToggle = function(type, open) {
        switch (type) {
            case 'image':
            case 'video':
            case 'music':
            case 'doc':
            case 'rawdoc':
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        if (this.mediaShow[0] === type) {
            if (!open) {
                this.mediaShow.splice(0,1);
                if (type === 'video') {
                    video.pause();
                }
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
                $scope.dirEdit = result.isEdit;
                $scope.dirList = [];
                for (var i in result.parentList) {
                    $scope.dirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collpase: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
                }
                console.log($scope.dirList);
            }
        }, function(errorResult) {
            console.log(errorResult);
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
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
            var this_obj = this.$parent;
            Info.addDir({ name: name, tag: $scope.feedbackSelectTag}, function (result) {
                console.log(result);
                if (result.id) {
                    this_obj.$broadcast('dir', JSON.stringify({id: result.id, name: result.name, parent: name}));
                }
            }, function(errorResult) {
                console.log(errorResult);
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('add parent is not valid!!');
        }
        return false;
    }
}]);