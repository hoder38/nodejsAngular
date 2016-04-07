//壓縮 手動排序跟新增
//cat script/angular.min.js script/angular-route.min.js script/angular-resource.min.js script/angular-cookies.min.js script/angular-sanitize.min.js script/angular-file-upload.js script/Chart.min.js script/angular-chart.min.js script/controllers.js script/stock-controllers.js script/password-controllers.js script/frontend.js script/ui-bootstrap-tpls-0.12.0.min.js script/vtt.js > script/release.js
//cat css/angular-chart.css css/bootstrap.min.css css/bootstrap-theme.min.css font-awesome/css/font-awesome.min.css css/sb-admin.css > css/release.css
var video, music, videoStart=0, videoTimer=0, videoPre = 0, musicStart=0, confirm_str='', torrent, torrentStart=0, torrentTimer=0, torrentPre = 0;
var app = angular.module('app', ['ngResource', 'ngRoute', 'ngCookies', 'ngSanitize', 'angularFileUpload', 'ui.bootstrap', 'chart.js'], function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/homepage',
        controller: LoginCntl//,
        //controllerAs: 'login'
    }).when('/UserInfo', {
        templateUrl: '/views/UserInfo',
        controller: UserInfoCntl
    }).when('/Storage', {
        templateUrl: '/views/Storage',
        controller: StorageInfoCntl
    }).when('/Stock', {
        templateUrl: '/views/Stock',
        controller: StockCntl
    }).when('/Password', {
        templateUrl: '/views/Password',
        controller: PasswordCntl
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
            var msg2 = attr.ngSubMsg;
            if (msg2) {
                element.bind('click',function (event) {
                    openModal(msg+' '+confirm_str+' '+msg2).then(function () {
                        scope.$eval(clickAction);
                    }, function () {
                    });
                });
            } else {
                element.bind('click',function (event) {
                    openModal(msg).then(function () {
                        scope.$eval(clickAction);
                    }, function () {
                    });
                });
            }

        }
    };
}).directive('ngMusic', function() {
    return function (scope, element, attrs) {
        music = element[0];
        music.onplay = function() {
            music.focus();
        };
        music.addEventListener('loadedmetadata', function () {
            if (musicStart) {
                music.currentTime = musicStart;
                musicStart = 0;
            }
        });
    };
}).directive('ngVideo', function() {
    return function (scope, element, attrs) {
        video = element[0];
        video.onplay = function() {
            video.focus();
        };
        video.addEventListener('loadedmetadata', function () {
            if (videoStart) {
                video.currentTime = videoStart;
                videoStart = 0;
            }
        });
        video.addEventListener('playing', function () {
            //自己的計時器
            clearInterval(videoTimer);
            videoTimer = setInterval(function() {
                if (!video.paused && !video.seeking) {
                    videoPre = video.currentTime;
                }
            }, 1000);
        });
    };
}).directive('ngTorrent', function() {
    return function (scope, element, attrs) {
        torrent = element[0];
        torrent.onplay = function() {
            torrent.focus();
        };
        torrent.addEventListener('loadedmetadata', function () {
            if (torrentStart) {
                torrent.currentTime = torrentStart;
                torrentPre = torrentStart;
                torrentStart = 0;
            }
        });
        torrent.addEventListener('playing', function () {
            //自己的計時器
            clearInterval(torrentTimer);
            torrentTimer = setInterval(function() {
                if (!torrent.paused && !torrent.seeking) {
                    torrentPre = torrent.currentTime;
                }
            }, 1000);
        });
    };
}).directive('ngEnded', function() {
    return function (scope, element, attrs) {
        element.bind('ended',function (event) {
            //event.preventDefault();
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
}).directive('ngIframeBigpic', function(){
    //for pdf
    //doc 850px
    return function(scope, element, attrs){
        element.on('load', function(){
            if (!scope.doc.maxId) {
                var iframeBody = element[0].contentWindow.document.getElementsByTagName('body')[0];
                var childnode = iframeBody.childNodes;
                var iframeOffset = [];
                var iframeWin = element[0].contentWindow.window;
                scope.isPdf = false;
                var lastchild = childnode[childnode.length-2];
                var iframelength = lastchild.offsetTop + lastchild.offsetHeight;
                for (var i = 0; i < iframelength; i+=850) {
                    iframeOffset.push(i);
                }
                scope.$apply(function (){
                    scope.setDoc(iframeWin, iframeOffset);
                });
                element[0].contentWindow.document.onscroll = function() {
                    scope.$apply(function (){
                        scope.numberDoc();
                    });
                };
            }
        });
    }
}).directive('ngImageOnload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var extend = document.getElementById('extend-image-screen');
                if (extend) {
                    extend.scrollTop = 0;
                    extend.scrollLeft = extend.scrollWidth;
                }
            });
        }
    };
}).filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]).filter('clear', function () {
    return function(str) {
        var ret_str = '';
        for (var i in str) {
            if (str[i] === 'l') {
                ret_str += '<little L>';
            } else if (str[i] === 'I') {
                ret_str += '<big i>';
            } else if (str[i] === '1') {
                ret_str += '<number 1>';
            } else if (str[i] === 'O') {
                ret_str += '<big o>';
            } else if (str[i] === '0') {
                ret_str += '<number 0>';
            } else {
                ret_str += str[i];
            }
        }
        return ret_str;
    };
}).directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('focus', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

function UserInfoCntl($route, $routeParams, $resource, $scope, $window, $timeout, $location) {
    $scope.$parent.currentPage = -1;
    $scope.$parent.isRight = false;
    $scope.uInfo = [];
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
                    if (result.user_info[i].hasOwnProperty('unDay')) {
                        result.user_info[i].hasUnDay = true;
                    }
                    if (result.user_info[i].hasOwnProperty('unHit')) {
                        result.user_info[i].hasUnHit = true;
                    }
                    result.user_info[i].isDel = false;
                    this_obj.uInfo.push(result.user_info[i]);
                }
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
    $scope.preAddUser = function(item) {
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
                openBlockPW(this.addUser, this, item);
            }
        }
        return false;
    }
    $scope.addUser = function(item) {
        var addInfo = $resource('/api/adduser', {}, {
            'addinfo': { method:'POST' }
        });
        var this_obj = this;
        var this_uInfo = this.uInfo;
        addInfo.addinfo({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, userPW: this.$parent.userPW}, function (result) {
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
                }
                this_obj.$parent.closeBlockPW(true);
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
    $scope.editAll = function(item) {
        if (item.edit) {
            item["name"] = item['nameOrig'];
            item["desc"] = item['descOrig'];
            item["perm"] = item['permOrig'];
            item["unDay"] = item['unDayOrig'];
            item["unHit"] = item['unHitOrig'];
            item["auto"] = item['autoOrig'];
            item["newPwd"] = '';
            item["conPwd"] = '';
            item.edit = false;
        } else {
            item["nameOrig"] = item['name'];
            item["descOrig"] = item['desc'];
            item["permOrig"] = item['perm'];
            item["unDayOrig"] = item['unDay'];
            item["unHitOrig"] = item['unHit'];
            item["autoOrig"] = item['auto'];
            item.edit = true;
            item.nameFocus = true;
        }
    }
    $scope.preSaveAll = function(item) {
        if (!isValidString(item.name, 'name') && item.edit) {
            addAlert('name not vaild!!!');
        } else if (!isValidString(item.desc, 'desc') && item.edit && item.hasDesc) {
            addAlert('desc not vaild!!!');
        } else if (!isValidString(item.perm, 'perm') && item.edit && item.hasPerm) {
            addAlert('perm not vaild!!!');
        } else if (!isValidString(item.unDay, 'int') && item.edit && item.hasUnDay) {
            addAlert('unactive day not vaild!!!');
        } else if (!isValidString(item.unHit, 'int') && item.edit && item.hasUnHit) {
            addAlert('unactive hit not vaild!!!');
        } else if (item.auto && !isValidString(item.auto, 'url') && item.edit && item.editAuto) {
            addAlert('auto upload not vaild!!!');
        } else if ((item.newPwd || item.conPwd) && (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd'))) {
            item.newPwd = '';
            item.conPwd = '';
            addAlert('new password is not vaild!!!');
        } else if (item.newPwd !== item.conPwd) {
            item.newPwd = '';
            item.conPwd = '';
            addAlert('confirm password is not vaild!!!');
        } else {
            var set_obj = {};
            var differ = false;
            if (item.name !== item.nameOrig && item.edit) {
                differ = true;
                set_obj['name'] = item.name;
            }
            if (item.perm !== item.permOrig && item.edit) {
                differ = true;
                set_obj['perm'] = item.perm;
            }
            if (item.desc !== item.descOrig && item.edit) {
                differ = true;
                set_obj['desc'] = item.desc;
            }
            if (item.unDay !== item.unDayOrig && item.edit) {
                differ = true;
                set_obj['unDay'] = item.unDay;
            }
            if (item.unHit !== item.unHitOrig && item.edit) {
                differ = true;
                set_obj['unHit'] = item.unHit;
            }
            if (item.auto !== item.autoOrig && item.edit) {
                differ = true;
                set_obj['auto'] = item.auto;
            }
            if (item.newPwd) {
                differ = true;
                set_obj['newPwd'] = item.newPwd;
            }
            if (item.conPwd) {
                differ = true;
                set_obj['conPwd'] = item.conPwd;
            }
            if (differ) {
                openBlockPW(this.saveAll, this, item, set_obj);
            } else {
                this.editAll(item);
            }
        }
        return false;
    }
    $scope.saveAll = function(item, data) {
        var editInfo = null;
        if (item.key) {
            editInfo = $resource('/api/edituser/' + item.key, {}, {
                'editinfo': { method:'PUT' }
            });
        } else {
            editInfo = $resource('/api/edituser', {}, {
                'editinfo': { method:'PUT' }
            });
        }
        var this_obj = this;
        data["userPW"] = this.$parent.userPW;
        editInfo.editinfo(data, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
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
                if (result.hasOwnProperty('unDay')) {
                    item.unDay = result.unDay;
                }
                if (result.hasOwnProperty('unHit')) {
                    item.unHit = result.unHit;
                }
                if (result.hasOwnProperty('auto')) {
                    item.auto = result.auto;
                }
                if (result.hasOwnProperty('owner')) {
                    this_obj.$parent.$parent.id = result.owner;
                }
                item.edit = false;
                item["newPwd"] = '';
                item["conPwd"] = '';
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            item.newPwd = '';
            item.conPwd = '';
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.preDelUser = function(item) {
        openBlockPW(this.delUser, this, item);
        return false;
    }

    $scope.delUser = function(item) {
        var delInfo = $resource('/api/deluser/' + item.key, {}, {
            'delinfo': { method:'PUT' }
        });
        var this_obj = this;
        delInfo.delinfo({userPW: this.$parent.userPW}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert("user deleted successfully!");
                item.isDel = true;
                this_obj.$parent.closeBlockPW(true);
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
}

function LoginCntl($route, $routeParams, $resource, $scope, $location) {
    $scope.$parent.currentPage = 0;
    $scope.$parent.isRight = false;
    $scope.$parent.collapse.nav = true;
}

function StorageInfoCntl($route, $routeParams, $resource, $scope, $window, $cookies, $filter, FileUploader, $location) {
    //left
    $scope.$parent.collapse.nav = true;
    $scope.$parent.currentPage = 1;
    //right
    $scope.bookmarkCollapse = false;
    $scope.bookmarkEdit = false;
    $scope.$parent.isRight = true;
    //list
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.itemList = [];
    $scope.latest = '';
    $scope.bookmarkID = '';
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.searchBlur = false;
    $scope.multiSearch = false;
    $scope.toolList = {download: false, edit: false, upload: false, searchSub: false, del: false, dir: false, subscription: false, save2local: false, save2drive: false, recover: false, delMedia: false, allDownload: false, join: false, title: '', item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.itemNameNew = false;
    $scope.itemNameNewFocus = false;
    $scope.toolSearchSub = false;
    $scope.videoSearchSub = false;
    $scope.torrentSearchSub = false;
    $scope.searchSub = false;
    $scope.searchSubing = false;
    $scope.subNameFocus = false;
    $scope.episodeFocus = false;
    $scope.subName = '';
    $scope.subEpisode = '';
    $scope.uploadSub = false;
    $scope.toolSub = false;
    $scope.videoSub = false;
    $scope.torrentSub = false;
    $scope.feedbackBlur = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.dirLocation = 0;
    $scope.isRelative = false;
    $scope.tCD = false;
    $scope.relativeList = [];
    $scope.pageToken = '';
    //cookie
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
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
        url: '/upload/subtitle',
        withCredentials : true
    });

    miscUploader.onAfterAddingFile = function(fileItem) {
        //console.info('onAfterAddingFile', fileItem);
        if ($scope.toolSub && $scope.toolList.item) {
            fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.toolList.item.id;
            this.uploadAll();
        } else if ($scope.torrentSub && $scope.torrent.id) {
            fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.torrent.id + '/' + + $scope.torrent.index;
            this.uploadAll();
        } else if ($scope.videoSub && $scope.video.id) {
            if ($scope.video.playlist) {
                fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.video.playlist.obj.id;
            } else {
                fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.video.id;
            }
            this.uploadAll();
        } else {
            addAlert('Select item first!!!');
        }
    };
    miscUploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.uploadSub = false;
        $scope.toolSub = false;
        $scope.torrentSub = false;
        $scope.videoSub = false;
        this.clearQueue();
        addAlert('subtitle upload success');
    };
    miscUploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
        addAlert(response);
        this.clearQueue();
    };

    $scope.$watch("isExtend", function(newVal, oldVal) {
        if (newVal) {
            var extend = document.getElementById('extend-image-screen');
            if (extend) {
                extend.scrollTop = 0;
                extend.scrollLeft = extend.scrollWidth;
            }
        }
    }, true);

    $scope.$on('dir', function(e, d) {
        var result = JSON.parse(d);
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
    $scope.$on('subtitle', function(e, d) {
        if (d === 'uploadT') {
            $scope.uploadSub = true;
            $scope.torrentSub = true;
        } else if (d === 'searchT') {
            $scope.searchSub = true;
            $scope.torrentSearchSub = true;
            $scope.subNameFocus = true;
            $scope.subName = '';
            $scope.subEpisode = '';
        } else if (d === 'uploadV') {
            $scope.uploadSub = true;
            $scope.videoSub = true;
        } else if (d === 'searchV') {
            $scope.searchSub = true;
            $scope.videoSearchSub = true;
            $scope.subNameFocus = true;
            $scope.subName = '';
            $scope.subEpisode = '';
        }
    });
    $scope.$on('file', function(e, d) {
        var id = JSON.parse(d);
        var date;
        var storageApi = $resource('/api/storage/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf($scope.itemList, id, 'id');
                if (result.empty) {
                    if (index !== -1) {
                        $scope.itemList.splice(index, 1);
                        $scope.page--;
                    }
                } else {
                    //$scope.latest = result.latest;
                    //$scope.bookmarkID = result.bookmarkID;
                    if (index !== -1) {
                        result.item.select = $scope.itemList[index].select;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(index, 1, result.item);
                    } else {
                        result.item.select = false;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(0, 0, result.item);
                    }
                }
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
    });

    $scope.init = function(){
        this.page = 0;
        this.pageToken = '';
        this.more = true;
        if ($cookies.fileSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            }
        } else if ($cookies.fileSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
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
                this[sort].count = '';
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
                this[sort].count = '';
            } else if (name === 'count') {
                this[sort].sort = 'count/';
                if (this[sort].count === 'asc') {
                    this[sort].count = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].count = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].name = '';
                this[sort].mtime = '';
            }
            if (sort === 'fileSort') {
                this.page = 0;
                this.pageToken = '';
                this.image.end = false;
                this.video.end = false;
                this.music.end = false;
                this.doc.end = false;
                this.present.end = false;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
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
        if (!this.inputText && (this.parentList.length > 0 || this.historyList.length > 0)) {
            return false;
        }
        var this_obj = this;
        this.page = 0;
        this.pageToken = '';
        this.more = true;
        this.image.end = false;
        this.video.end = false;
        this.music.end = false;
        this.doc.end = false;
        this.present.end = false;
        getItemlist(this_obj, this.inputText, 0, null, true);
        this.inputText = '';
    }

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        getItemlist(this_obj, item, 0, true);
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        getItemlist(this_obj, item, index+1);
    }

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
    }

    $scope.dirItemlist = function(id) {
        var this_obj = this.$parent.$parent;
        if (this_obj.multiSearch) {
            var parentApi = $resource('/api/parent/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/query/' + id + '/single', {}, {
                'query': { method:'get' }
            });
        }
        var more = true;
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                var date;
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                more = false;
            }
            this_obj.page = result.itemList.length;
            this_obj.parentList = result.parentList.cur;
            this_obj.historyList = result.parentList.his;
            this_obj.exactlyList = result.parentList.exactly;
            //this_obj.moreDisabled = false;
            this_obj.$parent.collapse.storage = true;
            var Info = null;
            if (this_obj.pageToken) {
                Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                    'youtube': { method:'GET' }
                });
            } else {
                Info = $resource('/api/youtube/get', {}, {
                    'youtube': { method:'GET' }
                });
            }
            Info.youtube({}, function(result) {
                if (result.pageToken) {
                    this_obj.pageToken = result.pageToken;
                }
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                    $scope.more = true;
                } else {
                    if (!more) {
                        $scope.more = false;
                    } else {
                        $scope.more = true;
                    }
                }
                this_obj.moreDisabled = false;
            }, function(errorResult) {
                this_obj.moreDisabled = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getItemlist = function (this_obj, name, index, isExactly, isRandom) {
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info = null, exactly = 'false', more = true;
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
            if (isRandom) {
                Info = $resource('/api/storage/getRandom/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'storage': { method:'GET' }
                });
            }
        } else if (name && !index) {
            if (!isValidString(name, 'name')) {
                addAlert('search tag is not vaild!!!');
                return false;
            }
            if (this_obj.multiSearch) {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                Info = $resource('/api/storage/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                    'storage': { method:'GET' }
                });
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if (!isValidString(name, 'name')) {
                addAlert('search tag is not vaild!!!');
                return false;
            }
            Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                'storage': { method:'GET' }
            });
        }
        this_obj.moreDisabled = true;
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj.page === 0 && !this_obj.pageToken) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    more = false;
                }
                this_obj.page = this_obj.page + result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.moreDisabled = false;
                    this_obj.searchBlur = true;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
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
        this.pageToken = '';
        this.image.end = false;
        this.video.end = false;
        this.music.end = false;
        this.doc.end = false;
        this.present.end = false;
        $scope.more = true;
        $scope.moreDisabled = true;
        var Info = $resource('/api/storage/reset', {}, {
            'storage': { method:'GET' }
        });
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                var date;
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    date = new Date(result.itemList[i].utime*1000);
                    result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                    this_obj.itemList.push(result.itemList[i]);
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                //this_obj.moreDisabled = false;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                    }
                    this_obj.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
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
        var new_location = false;
        if ($scope.selectList.length === 0) {
            new_location = true;
        }
        $scope.selectList = $filter("filter")(newVal, {select:true});
        if ($scope.selectList.length > 0) {
            var tempList = $scope.tagList;
            if (new_location) {
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i].select) {
                        if (i === 0) {
                            $scope.dirLocation = -1;
                        } else if ((i+1) < newVal.length) {
                            $scope.dirLocation = i+1;
                        } else {
                            $scope.dirLocation = i;
                        }
                        break;
                    }
                }
            }
            $scope.tagList = $scope.selectList[0].tags;
            $scope.exceptList = [];
            for (var i = 1; i < $scope.selectList.length; i++) {
                $scope.tagList = intersect($scope.tagList, $scope.selectList[i].tags, $scope.exceptList);
            }
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getOptionTag = function() {
        var Info = $resource('/api/getOptionTag', {}, {
            'optionTag': { method:'POST' }
        });
        var tags = [];
        if ($scope.tagList.length > 0) {
            tags = $scope.tagList;
        }
        Info.optionTag({tags: tags}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                for (var i in result.relative) {
                    if ($scope.relativeList.indexOf(result.relative[i]) === -1 && $scope.tagList.indexOf(result.relative[i]) === -1 && $scope.exceptList.indexOf(result.relative[i]) === -1 && $scope.isRelative) {
                        $scope.relativeList.push(result.relative[i]);
                    }
                }
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

    $scope.submitSubtitle = function() {
        var this_obj = this;
        if (!this.searchSubing) {
            if (this.subName) {
                if (isValidString(this.subName, 'name')) {
                    var append = '';
                    if (this.toolSearchSub) {
                        append = this.toolList.item.id;
                    } else if (this.videoSearchSub && this.video.id) {
                        if (this.video.playlist) {
                            append = this.video.playlist.obj.id;
                        } else {
                            append = this.video.id;
                        }
                    } else if (this.torrentSearchSub && this.torrent.id) {
                        append = this.torrent.id + '/' + this.torrent.index;
                    } else {
                        addAlert('search item is not vaild!!!');
                    }
                    var Info = $resource(this.main_url + '/api/subtitle/search/' + append, {}, {
                        'searchSub': { method:'POST', withCredentials: true }
                    });
                    this.searchSubing = true;
                    var search = {name: this.subName};
                    if (this.subEpisode && isValidString(this.subEpisode, 'name')) {
                        search.episode = this.subEpisode;
                    }
                    Info.searchSub(search, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        addAlert('subtitle get');
                        this_obj.searchSub = false;
                        this_obj.searchSubing = false;
                    }, function(errorResult) {
                        this_obj.searchSubing = false;
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('search name is not vaild!!!');
                }
            } else {
                var id = null;
                if (this.toolSearchSub) {
                    id = this.toolList.item.id;
                } else if (this.videoSearchSub && this.video.id) {
                    if (this.video.playlist) {
                        id = this.video.playlist.obj.id;
                    } else {
                        id = this.video.id;
                    }
                } else {
                    addAlert('Please inputs search name!!!');
                    return false;
                }
                this.searchSubing = true;
                var externalApi = $resource(this.main_url + '/api/external/getSubtitle/' + id, {}, {
                    'getSingle': { method:'GET', withCredentials: true }
                });
                externalApi.getSingle({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        addAlert('subtitle get');
                        this_obj.searchSub = false;
                        this_obj.searchSubing = false;
                    }
                }, function(errorResult) {
                    this_obj.searchSubing = false;
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

    $scope.submitTag = function() {
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                if (this.selectList.length > 0) {
                    var uids = [];
                    var this_obj = this;
                    for (var i in this.selectList) {
                        uids.push(this.selectList[i].id);
                    }
                    var Info = $resource('/api/addTag/' + this.newTagName, {}, {
                        'addTag': { method:'PUT' }
                    });
                    Info.addTag({uids: uids}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        this_obj.tagNew = false;
                    }, function(errorResult) {
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('Please selects item!!!');
                }
            } else {
                if (!isValidString(this.newTagName, 'url')) {
                    addAlert('New tag is not vaild!!!');
                } else {
                    var tagUrlapi = $resource('/api/addTagUrl', {}, {
                        'addTagUrl': { method:'POST' }
                    });
                    var uids = [];
                    var this_obj = this;
                    for (var i in this.selectList) {
                        uids.push(this.selectList[i].id);
                    }
                    tagUrlapi.addTagUrl({url: this.newTagName, uids: uids}, function(result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        this_obj.tagNew = false;
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
            }
        } else {
            addAlert('Please inputs new tag!!!');
        }
    }

    $scope.addTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                var this_obj = this;
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/addTag/' + tag, {}, {
                    'addTag': { method:'PUT' }
                });
                Info.addTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                    if (Number(i) === this_obj.selectList.length -1) {
                        this_obj.tagNew = false;
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
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/delTag/' + tag, {}, {
                    'delTag': { method:'PUT' }
                });
                Info.delTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
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
                if (result.id) {
                    for (var i in this_obj.dirList) {
                        if (this_obj.dirList[i].name === item.name) {
                            this_obj.dirList[i].list.push({name: result.name, id: result.id});
                            break;
                        }
                    }
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
        } else {
            addAlert('select a tag!!!');
        }
    }

    $scope.del2Parent = function(id, dir) {
        var this_obj = this;
        var Info = $resource('/api/parent/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            if (result.id) {
                index = arrayObjectIndexOf(dir.list, result.id, "id");
                if (index !== -1) {
                    dir.list.splice(index, 1);
                    dir.page--;
                }
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

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
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
        item.collapse = !item.collapse;
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
            if (result.loginOK) {
                $window.location.href = $location.path();
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
        return false;
    }

    $scope.fileDel = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        var this_itemList = this.itemList;
        var Info = $resource(this.main_url + '/api/delFile/' + item.id + '/' + item.recycle, {}, {
            'delFile': { method:'DELETE', withCredentials: true }
        });
        Info.delFile({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
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
        return false;
    }

    $scope.fileJoin = function() {
        if (this.selectList.length > 0) {
            var uids = [];
            var this_obj = this;
            for (var i in this.selectList) {
                uids.push(this.selectList[i].id);
            }
            var Info = $resource(this.main_url + '/api/joinFile', {}, {
                'joinFile': { method:'PUT', withCredentials: true }
            });
            Info.joinFile({uids: uids}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    addAlert('joining completed');
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
        } else {
            addAlert('Please selects item!!!');
        }
    }

    $scope.fileEdit = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        if (isValidString(this.newItemName, 'name')) {
            var editFile = $resource(this.main_url + '/api/editFile/' + item.id, {}, {
                'editfile': { method:'PUT', withCredentials: true }
            });
            var this_obj = this;
            editFile.editfile({name: this.newItemName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    item.name = result.name;
                    this_obj.itemNameNew = false;
                    if (result.name) {
                        if (this_obj.feedback.run) {
                            if (this_obj.feedback.uid === result.id) {
                                showFeedback(result);
                            } else {
                                var index = arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id');
                                if (index === -1) {
                                    this_obj.feedback.queue.push(result);
                                } else {
                                    this_obj.feedback.queue.splice(index, 1, result);
                                }
                            }
                        } else {
                            this_obj.feedback.run = true;
                            showFeedback(result);
                        }
                    }
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
        } else {
            addAlert('name not vaild!!!');
        }
        return false;
    }

    $scope.showUrl = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        $window.open(decodeURIComponent(item.url));
        var mediaApi = $resource('/api/media/setTime/' + item.id + '/url', {}, {
            'setTime': { method:'GET' }
        });
        mediaApi.setTime({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if ($scope.bookmarkID) {
                    $scope.latest = item.id;
                }
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

    $scope.setBookmark = function(item) {
        var this_obj = this.$parent.$parent.$parent;
        var bookmarkapi = $resource('/api/bookmark/set/' + item.id, {}, {
            'setbookmark': { method:'GET' }
        });
        var more = true;
        this_obj.moreDisabled = true;
        this_obj.more = true;
        bookmarkapi.setbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                } else {
                    more = false;
                }
                this_obj.pageToken = '';
                this_obj.page = result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                //this_obj.moreDisabled = false;
                this_obj.$parent.collapse.storage = true;
                var Info = null;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.showMedia = function(item, type) {
        if (this[type] && (this[type].id === item.id)) {
            this.mediaToggle(type, true);
            return false;
        }
        this[type].end = false;
        var preType = '', status = 0, docRecord = 0;
        switch (type) {
            case 'image':
                preType = 'image';
                this.image.showId = this.image.presentId = 1;
                this.image.itemName = '';
                status = 2;
                break;
            case 'video':
                preType = 'video';
                status = 3;
                this.video.itemName = '';
                break;
            case 'music':
                preType = 'video';
                status = 4;
                this.music.itemName = '';
                break;
            case 'doc':
                preType = 'preview';
                docRecord = this.doc.showId;
                this.doc.showId = this.doc.presentId = 1;
                status = 5;
                break;
            case 'present':
                this.present.showId = this.present.presentId = 1;
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
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj[type].id) {
                    this_obj.mediaRecord(type, docRecord);
                }
                var append = '';
                if (item.url) {
                    append = '/external';
                }
                var mediaApi = $resource('/api/media/setTime/' + item.id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                } else {
                                    this_obj.$parent[type].presentId = this_obj.$parent[type].showId = setTime[1];
                                }
                            }
                        }
                        var videoId = item.id;
                        if (result.playlist) {
                            this_obj.$parent[type].playlist = result.playlist;
                        } else {
                            this_obj.$parent[type].playlist = null;
                        }
                        if (type === 'doc') {
                            this_obj.$parent[type].iframeOffset = null;
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id + '/doc';
                        } else if (item.thumb) {
                            if (this_obj.$parent[type].playlist && this_obj.$parent[type].playlist.obj.pre_url) {
                                this_obj.$parent[type].src = this_obj.$parent[type].playlist.obj.pre_url + this_obj.$parent[type].playlist.obj.pre_obj[Math.round(this_obj.$parent[type].playlist.obj.index*1000)%1000 - 1];
                                this_obj.$parent[type].itemName = ':' + this_obj.$parent[type].playlist.obj.title;
                                this_obj.$parent[type].showId = this_obj.$parent[type].playlist.obj.showId;
                                this_obj.$parent[type].presentId = this_obj.$parent[type].playlist.obj.index;
                                item.present = this_obj.$parent[type].playlist.total;
                            } else {
                                this_obj.$parent[type].pageToken = '';
                                if ($scope.pageToken) {
                                    this_obj.$parent[type].pageToken = $scope.pageToken;
                                }
                                this_obj.$parent[type].src = item.thumb;
                                if (type === 'video') {
                                    video.poster = this_obj.$parent[type].src;
                                }
                                var is_magnet = false;
                                if (this_obj.$parent[type].playlist) {
                                    if (this_obj.$parent[type].playlist.obj.id) {
                                        videoId = this_obj.$parent[type].playlist.obj.id;
                                    }
                                    if (this_obj.$parent[type].playlist.obj.is_magnet) {
                                        is_magnet = true;
                                        this_obj.$parent[type].itemName = ':' + this_obj.$parent[type].playlist.obj.title;
                                        if (this_obj.$parent[type].playlist.obj.id) {
                                            this_obj.$parent[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                        } else {
                                            if (isValidString(this_obj.$parent[type].playlist.obj.magnet, 'url')) {
                                                var uploadurl = $scope.main_url + '/api/upload/url';
                                                if (this_obj.$parent.adultonly) {
                                                    uploadurl = $scope.main_url + '/api/upload/url/1';
                                                }
                                                var upApi = $resource(uploadurl, {}, {
                                                    'uploadUrl': { method:'POST', withCredentials: true }
                                                });
                                                upApi.uploadUrl({url: this_obj.$parent[type].playlist.obj.magnet, hide: true}, function (result) {
                                                    if (result.loginOK) {
                                                        $window.location.href = $location.path();
                                                    } else {
                                                        videoId = this_obj.$parent[type].playlist.obj.id = result.id;
                                                        this_obj.$parent[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                        removeCue();
                                                        this_obj.$parent[type].sub = '/subtitle/' + videoId + '/v';
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
                                            } else {
                                                addAlert('magnet not valid');
                                            }
                                        }
                                    }
                                }
                                if (!is_magnet) {
                                    var externalApi = $resource(this_obj.main_url + '/api/external/getSingle/' + videoId, {}, {
                                        'getSingle': { method:'GET', withCredentials: true }
                                    });
                                    externalApi.getSingle({}, function (result) {
                                        if (result.loginOK) {
                                            $window.location.href = $location.path();
                                        } else {
                                            if (videoId === this_obj.$parent[type].id || (this_obj.$parent[type].playlist && videoId === this_obj.$parent[type].playlist.obj.id)) {
                                                if (this_obj.$parent[type].playlist) {
                                                    if (this_obj.$parent[type].playlist.obj.title) {
                                                        this_obj.$parent[type].itemName = ':' + this_obj.$parent[type].playlist.obj.title;
                                                    } else {
                                                        this_obj.$parent[type].itemName = ':' + result.title;
                                                    }
                                                }
                                                if (type === 'music') {
                                                    if (result.audio) {
                                                        this_obj.$parent[type].src = result.audio;
                                                    } else {
                                                        this_obj.$parent[type].src = result.video[0];
                                                    }
                                                } else {
                                                    this_obj.$parent[type].hd_list = result.video;
                                                    if (result.sub) {
                                                        this_obj.$parent[type].playlist.obj.sub = result.sub;
                                                    }
                                                    var hd = 0;
                                                    if (this_obj.$parent[type].hd < this_obj.$parent[type].hd_list.length) {
                                                        hd = this_obj.$parent[type].hd;
                                                    } else {
                                                        hd = this_obj.$parent[type].hd_list.length - 1;
                                                    }
                                                    this_obj.$parent[type].src = this_obj.$parent[type].hd_list[hd];
                                                }
                                            }
                                        }
                                    }, function(errorResult) {
                                        if (errorResult.status === 400) {
                                            addAlert(errorResult.data);
                                            if (type === 'music') {
                                                $scope.nextVideo('music');
                                            }
                                        } else if (errorResult.status === 403) {
                                            addAlert('unknown API!!!');
                                        } else if (errorResult.status === 401) {
                                            $window.location.href = $location.path();
                                        }
                                    });
                                }
                            }
                        } else {
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id;
                        }
                        this_obj.$parent[type].maxId = item.present;
                        if (type === 'video') {
                            removeCue();
                            this_obj.$parent[type].sub = '/subtitle/' + videoId;
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
                        for (var i in this_obj.$parent[type].list) {
                            if (!this_obj.$parent[type].list[i].noDb) {
                                this_obj.$parent[type].frontPage++;
                            }
                        }
                        var index = arrayObjectIndexOf(this_obj.$parent[type].list, item.id, 'id');
                        if (index !== -1) {
                            this_obj.$parent[type].index = index;
                        }
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

    $scope.showTorrent = function(item) {
        var this_obj = this;
        var torrentApi = $resource('/api/torrent/query/preview/' + item.id, {}, {
            'query': { method:'GET'}
        });
        torrentApi.query({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
            console.log(result);
            if (result.list.length > 0) {
                this_obj['torrent'].id = result.id;
                this_obj['torrent'].list = result.list;
                this_obj['torrent'].index = 0;
                if (result.time) {
                    var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                    if (setTime) {
                        torrentStart = setTime[1];
                        if (setTime[3]) {
                            this_obj['torrent'].index = Number(setTime[3]);
                        }
                    }
                }
                this_obj['torrent'].complete = false;
                this_obj['torrent'].name = this_obj['torrent'].list[this_obj['torrent'].index]['name'];
                this_obj['torrent'].src = $scope.main_url + '/torrent/' + this_obj['torrent'].index + '/' + this_obj['torrent'].id;
                this_obj['torrent'].type = this_obj['torrent'].list[this_obj['torrent'].index]['type'];
                removeCue('torrent');
                this_obj['torrent'].sub = '/subtitle/' + this_obj['torrent'].id + '/' + this_obj['torrent'].index;
                this_obj.mediaToggle('torrent', true);
            } else {
                addAlert('No preview file!!!');
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

    $scope.downloadFile = function (id){
        console.log(123);
        if (!id) {
            id = this.toolList.item.id;
        }
        if ($scope.bookmarkID) {
            $scope.latest = id;
        }
        $window.location.href = this.main_url + '/download/' + id;
    }

    $scope.save2drive = function(id) {
        if (!id) {
            id = this.toolList.item.id;
        }
        if ($scope.bookmarkID) {
            $scope.latest = id;
        }
        var saveApi = $resource(this.main_url + '/api/download2drive/' + id, {}, {
            'save2drive': { method:'GET', withCredentials: true }
        });
        saveApi.save2drive({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert('start saving to drive');
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

    $scope.handleMedia = function(action, item) {
        if (!item) {
            item = this.toolList.item;
        }
        if (action == 'act' || action == 'del') {
            var handleMedia = $resource(this.main_url + '/api/handleMedia/' + item.id + '/' + action, {}, {
                'handlemedia': { method:'GET', withCredentials: true }
            });
            handleMedia.handlemedia({}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {

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
            this.$parent.toolList.searchSub = false;
            this.$parent.toolList.delMedia = false;
            this.$parent.toolList.subscription = false;
            this.$parent.toolList.save2local = false;
            this.$parent.toolList.save2drive = false;
            this.$parent.toolList.allDownload = false;
            this.$parent.toolList.join = false;
            confirm_str = item;
        } else {
            if (item.status === 7 || item.status === 8 || item.status === 9 || item.thumb) {
                this.$parent.toolList.download = false;
            } else {
                this.$parent.toolList.download = true;
            }
            if (item.status === 7 || item.status === 8 || item.thumb) {
                this.$parent.toolList.save2drive = false;
            } else {
                this.$parent.toolList.save2drive = true;
            }
            if (item.status === 9) {
                this.$parent.toolList.allDownload = true;
            } else {
                this.$parent.toolList.allDownload = false;
            }
            if (item.status === 0 || item.status === 1 || item.status === 9) {
                this.$parent.toolList.join = true;
            } else {
                this.$parent.toolList.join = false;
            }
            this.$parent.toolList.dir = false;
            if (item.isOwn) {
                this.$parent.toolList.del = true;
                if (!item.thumb) {
                    this.$parent.toolList.edit = true;
                } else {
                    this.$parent.toolList.edit = false;
                }
            } else {
                this.$parent.toolList.edit = false;
                this.$parent.toolList.del = false;
            }
            if (item.recycle === 1 || item.recycle === 2 || item.recycle === 3 || item.recycle === 4) {
                this.$parent.toolList.recover = true;
            } else {
                this.$parent.toolList.recover = false;
            }
            if (item.status === 3) {
                this.$parent.toolList.upload = true;
                this.$parent.toolList.searchSub = true;
            } else {
                this.$parent.toolList.upload = false;
                this.$parent.toolList.searchSub = false;
            }
            if (item.media) {
                this.$parent.toolList.delMedia = true;
            } else {
                this.$parent.toolList.delMedia = false;
            }
            if (item.cid) {
                this.$parent.toolList.subscription = true;
                this.$parent.toolList.title = item.ctitle;
            } else {
                this.$parent.toolList.subscription = false;
            }
            if (item.noDb) {
                this.$parent.toolList.save2local = true;
            } else {
                this.$parent.toolList.save2local = false;
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
        } else {
            for (var i in this.itemList) {
                this.itemList[i].select = true;
            }
        }
        return false;
    }

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.tagNew = true;
            this.tagNewFocus = true;
            this.isRelative = true;
            getOptionTag();
        }
        return false;
    }

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        var more = true;
        this.$parent.moreDisabled = true;
        this.$parent.more = true;
        bookmarkapi.getbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                } else {
                    more = false;
                }
                this_obj.$parent.pageToken = '';
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                //this_obj.$parent.moreDisabled = false;
                this_obj.$parent.$parent.collapse.storage = true;
                var Info = null;
                if (this_obj.$parent.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.$parent.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.$parent.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.$parent.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.$parent.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.$parent.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.$parent.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
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
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.bookmarkList = result.bookmarkList;
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
            this.bookmarkNew = false;
            this.bookmarkName = '';
            var bookmarkapi = $resource('/api/bookmark/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push({id: result.id, name: result.name});
                    }
                    if (result.bid) {
                        result.id = result.bid;
                        result.name = result.bname;
                        if (result.name) {
                            if (this_obj.feedback.run) {
                                if (this_obj.feedback.uid === result.id) {
                                    showFeedback(result);
                                } else {
                                    if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                        this_obj.feedback.queue.push(result);
                                    } else {
                                        this_obj.feedback.queue.splice(index, 1, result);
                                    }
                                }
                            } else {
                                this_obj.feedback.run = true;
                                showFeedback(result);
                            }
                        }
                    }
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
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf(this_obj.$parent.bookmarkList, result.id, "id");
                if (index !== -1) {
                    this_obj.$parent.bookmarkList.splice(index, 1);
                }
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

app.controller('mainCtrl', ['$scope', '$http', '$resource', '$location', '$route', '$window', '$cookies', '$timeout', '$filter', '$modal', 'FileUploader', function($scope, $http, $resource, $location, $route, $window, $cookies, $timeout, $filter, $modal, FileUploader) {
    //login
    $scope.username = '';
    $scope.password = '';
    $scope.id = 'guest';
    $scope.main_url = '';
    $scope.loginFocus = {user: true, pwd:false};
    $scope.isLogin = false;
    //left
    $scope.currentPage = 0;
    $scope.collapse= {};
    $scope.collapse.nav = true;
    $scope.collapse.storage = true;
    $scope.collapse.stock = true;
    $scope.collapse.password = true;
    $scope.navList = [{title: "homepage", hash: "/", css: "fa fa-fw fa-dashboard"}, {title: "Storage", hash: "/Storage", css: "fa fa-fw fa-desktop"}, {title: "Password", hash: "/Password", css: "fa fa-fw fa-key"}];
    //right
    $scope.dirList = [];
    $scope.dirEdit = false;
    $scope.isRight = false;
    //feedback
    $scope.dropdown = {};
    $scope.dropdown.feedback = false;
    $scope.feedbackDisabled = true;
    $scope.feedbackSelectTag = '';
    $scope.feedback = {uid: '', name: '', relative: 0, list: [], run: false, queue: [], history: [], other: []};
    //dialog
    $scope.widget = {};
    $scope.widget.uploader = false;
    $scope.widget.feedback = false;
    $scope.mediaMoreDisabled = false;
    $scope.moveDisabled = {video: false, music: false};
    $scope.isFull = false;
    $scope.isVisible = false;
    $scope.isExtend = false;
    $scope.adultonly = false;
    $scope.mediaShow = [];
    $scope.image = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1, itemName: ""};
    $scope.video = {id: "", src: "", sub: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', option: 0, playlist: null, mode: 0, itemName: "", hd: 0, hd_list: []};
    $scope.music = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', option: 0, playlist: null, mode: 0, itemName: ""};
    $scope.doc = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1, mode: false};
    $scope.present = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1};
    $scope.torrent = {id: "", src: "", complete: "", sub: "", name: "null", list: [], index: 0, bookmarkID: '', option: 0, size: 0, type: 1};
    $scope.inputUrl = '';
    $scope.disableUrlSave = false;
    $scope.isAdult = false;
    $scope.curTorrentSub = '';
    $scope.curTorrentSubTime = 0;
    $scope.fixTorrentSub = false;
    $scope.curVideoSub = '';
    $scope.curVideoSubTime = 0;
    $scope.fixVideoSub = false;
    $scope.videoSwitch = false;
    $scope.musicSwitch = false;
    $scope.torrentSwitch = false;
    $scope.noEnd = false;
    //alert
    $scope.alerts = [];
    var alertTime;

    //block
    $scope.pwBlock = false;
    $scope.userPW = '';
    $scope.userPWFocus = false;
    $scope.pwObj = null;
    $scope.pwArgs = [];
    $scope.pwCallback = null;
    var need_auth = true;

    indexInit();

    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    $scope.videoToggle = function() {
        if (!is_firefox) {
            video.focus();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }

    $scope.torrentToggle = function() {
        if (!is_firefox) {
            torrent.focus();
            if (torrent.paused) {
                torrent.play();
            } else {
                torrent.pause();
            }
        }
    }

    if (!is_firefox) {
        document.getElementById('music-tag').onkeydown = function(evt) {
            evt = evt || window.event;
            switch(evt.keyCode) {
                case 32:
                if (music.paused) {
                    music.play();
                } else {
                    music.pause();
                }
                break;
                case 37:
                if (music.currentTime >= 15) {
                    music.currentTime -= 15;
                } else {
                    music.currentTime = 0;
                }
                break;
                case 38:
                if (music.volume < 0.9) {
                    music.volume+= 0.1;
                } else {
                    music.volume = 1;
                }
                break;
                case 39:
                music.currentTime += 15;
                break;
                case 40:
                if (music.volume > 0.1) {
                    music.volume-= 0.1;
                } else {
                    music.volume = 0;
                }
                break;
            }
        };
    }

    $scope.fixSub = function(type) {
        if (type === 'torrent') {
            if (this.fixTorrentSub) {
                this.mediaToggle('torrent');
                var adjust = Math.ceil((torrent.currentTime - this.curTorrentSubTime) * 10)/10;
                openModal("確定校準此字幕到此時間軸？").then(function () {
                    $scope.fixTorrentSub = false;
                    $scope.curTorrentSub = '';
                    fixSubtitle(adjust, 'torrent');
                }, function () {
                });
            } else {
                if (torrent && torrent.textTracks && torrent.textTracks[0].activeCues && torrent.textTracks[0].activeCues.length > 0) {
                    this.curTorrentSub = torrent.textTracks[0].activeCues[0].text;
                    this.curTorrentSubTime = torrent.textTracks[0].activeCues[0].startTime;
                    this.fixTorrentSub = true;
                    torrent.pause();
                }
            }
        } else {
            if (this.fixVideoSub) {
                this.mediaToggle('video');
                var adjust = Math.ceil((video.currentTime - this.curVideoSubTime) * 10)/10;
                openModal("確定校準此字幕到此時間軸？").then(function () {
                    $scope.fixVideoSub = false;
                    $scope.curVideoSub = '';
                    fixSubtitle(adjust, 'video');
                }, function () {
                });
            } else {
                if (video && video.textTracks && video.textTracks[0].activeCues && video.textTracks[0].activeCues.length > 0) {
                    this.curVideoSub = video.textTracks[0].activeCues[0].text;
                    this.curVideoSubTime = video.textTracks[0].activeCues[0].startTime;
                    this.fixVideoSub = true;
                    video.pause();
                }
            }
        }
    }
    $scope.backwardVideo = function(type) {
        if (type === 'torrent') {
            if ($scope.fixTorrentSub) {
                if (torrent.currentTime >= 0.5) {
                    torrent.currentTime -= 0.5;
                } else {
                    torrent.currentTime = 0;
                }
            } else {
                if (torrent.currentTime >= 15) {
                    torrent.currentTime -= 15;
                } else {
                    torrent.currentTime = 0;
                }
            }
        } else {
            if ($scope.fixVideoSub) {
                if (video.currentTime >= 0.5) {
                    video.currentTime -= 0.5;
                } else {
                    video.currentTime = 0;
                }
            } else {
                if (video.currentTime >= 15) {
                    video.currentTime -= 15;
                } else {
                    video.currentTime = 0;
                }
            }
        }
    }
    $scope.toggleSub = function(type) {
        var obj = video;
        if (type === 'torrent') {
            obj = torrent;
        }
        if (obj.textTracks[0].mode === 'showing') {
            obj.textTracks[0].mode = "hidden";
        } else {
            obj.textTracks[0].mode = "showing";
        }
    }

    document.getElementById('video-tag').onkeydown = function(evt) {
        evt = evt || window.event;
        if (is_firefox) {
            switch(evt.keyCode) {
                case 67:
                $scope.toggleSub();
                break;
                case 70:
                $scope.fixSub();
                break;
            }
        } else {
            switch(evt.keyCode) {
                case 32:
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                break;
                case 37:
                if ($scope.fixVideoSub) {
                    if (video.currentTime >= 0.5) {
                        video.currentTime -= 0.5;
                    } else {
                        video.currentTime = 0;
                    }
                } else {
                    if (video.currentTime >= 15) {
                        video.currentTime -= 15;
                    } else {
                        video.currentTime = 0;
                    }
                }
                break;
                case 38:
                if (video.volume < 0.9) {
                    video.volume+= 0.1;
                } else {
                    video.volume = 1;
                }
                break;
                case 39:
                if ($scope.fixVideoSub) {
                    video.currentTime += 0.5;
                } else {
                    video.currentTime += 15;
                }
                break;
                case 40:
                if (video.volume > 0.1) {
                    video.volume-= 0.1;
                } else {
                    video.volume = 0;
                }
                break;
                case 67:
                $scope.toggleSub();
                break;
                case 70:
                $scope.fixSub();
                break;
            }
        }
    };
    document.getElementById('torrent-tag').onkeydown = function(evt) {
        evt = evt || window.event;
        if (is_firefox) {
            switch(evt.keyCode) {
                case 67:
                $scope.toggleSub('torrent');
                break;
                case 70:
                $scope.fixSub('torrent');
                break;
            }
        } else {
            switch(evt.keyCode) {
                case 32:
                if (torrent.paused) {
                    torrent.play();
                } else {
                    torrent.pause();
                }
                break;
                case 37:
                if ($scope.fixTorrentSub) {
                    if (torrent.currentTime >= 0.5) {
                        torrent.currentTime -= 0.5;
                    } else {
                        torrent.currentTime = 0;
                    }
                } else {
                    if (torrent.currentTime >= 15) {
                        torrent.currentTime -= 15;
                    } else {
                        torrent.currentTime = 0;
                    }
                }
                break;
                case 38:
                if (torrent.volume < 0.9) {
                    torrent.volume+= 0.1;
                } else {
                    torrent.volume = 1;
                }
                break;
                case 39:
                if ($scope.fixTorrentSub) {
                    torrent.currentTime += 0.5;
                } else {
                    torrent.currentTime += 15;
                }
                break;
                case 40:
                if (torrent.volume > 0.1) {
                    torrent.volume-= 0.1;
                } else {
                    torrent.volume = 0;
                }
                break;
                case 67:
                $scope.toggleSub('torrent');
                break;
                case 70:
                $scope.fixSub('torrent');
                break;
            }
        }
    };
    function fixSubtitle(adjust, type) {
        var append = '';
        if (type === 'torrent') {
            append = $scope.torrent.id + '/' + adjust + '/' + $scope.torrent.index;
        } else {
            if ($scope.video.playlist.obj.id) {
                append = $scope.video.playlist.obj.id + '/' + adjust;
            } else {
                append = $scope.video.id + '/' + adjust;
            }
        }
        var subtitleApi = $resource($scope.main_url + '/api/subtitle/fix/' + append, {}, {
            'fix': { method:'GET', withCredentials: true }
        });
        subtitleApi.fix({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert('字幕校準成功');
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
    if (is_firefox) {
        $scope.$watch("video.sub", function(newVal, oldVal) {
            if (newVal) {
                if (!video.textTracks.length){
                    video.addTextTrack("subtitles", "English", "en-US");
                    video.textTracks[0].mode = "showing";
                }
                // Create XMLHttpRequest object
                var xhr;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE8
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
                            parser.oncue = function(cue) {
                                video.textTracks[0].addCue(cue);
                            };
                            parser.parse(xhr.responseText);
                            parser.flush();
                        }
                    }
                }
                xhr.open("get", newVal, true);
                xhr.send();
            }
        }, true);
        $scope.$watch("torrent.sub", function(newVal, oldVal) {
            if (newVal) {
                if (!torrent.textTracks.length){
                    torrent.addTextTrack("subtitles", "English", "en-US");
                    torrent.textTracks[0].mode = "showing";
                }
                // Create XMLHttpRequest object
                var xhr;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE8
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
                            parser.oncue = function(cue) {
                                torrent.textTracks[0].addCue(cue);
                            };
                            parser.parse(xhr.responseText);
                            parser.flush();
                        }
                    }
                }
                xhr.open("get", newVal, true);
                xhr.send();
            }
        }, true);
    }

    removeCue = function(type) {
        var track = null;
        if (type === 'torrent') {
            track = torrent.textTracks[0];
        } else {
            track = video.textTracks[0];
        }
        if (track) {
            var cues = track.cues;
            if (cues && cues.length > 0) {
                for (var i=cues.length-1;i>=0;i--) {
                    track.removeCue(cues[i]);
                }
            }
        }
    }

    openBlockPW = function(callback, obj) {
        if (need_auth) {
            $scope.pwBlock = true;
            $scope.userPW = '';
            $scope.userPWFocus = true;
            $scope.pwArgs = Array.prototype.slice.call(arguments, 2);
            $scope.pwObj = obj;
            $scope.pwCallback = callback;
        } else {
            callback.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
    }

    $scope.closeBlockPW = function(is_auth) {
        if ($scope.userPW && is_auth) {
            need_auth = false;
            setTimeout(function() {
                need_auth = true;
            }, 60000);
        }
        $scope.pwBlock = false;
        $scope.userPW = '';
        $scope.userPWFocus = false;
        $scope.pwObj = null;
        $scope.pwCallback = null;
        $scope.pwArgs = [];
    }

    $scope.sendPW = function() {
        if (this.userPW && !isValidString(this.userPW, 'passwd')) {
            addAlert('user password is not vaild!!!');
        } else {
            this.pwCallback.apply(this.pwObj, this.pwArgs);
        }
    }

    addAlert = function(msg) {
        $scope.alerts.splice(0,0,{type: 'danger', msg: msg});
        $timeout.cancel(alertTime);
        alertTime = $timeout(function() {
            $scope.alerts = [];
        }, 5000);
    };

    window.onbeforeunload = function (event) {
        var vId = $scope.video.id;
        if (vId && video.duration) {
            var vTime = 0;
            vTime = parseInt(video.currentTime);
            var vXmlhttp = new XMLHttpRequest();
            if ($scope.video.playlist) {
                vId = $scope.video.playlist.obj.id;
            }
            vXmlhttp.open("GET", "/api/media/record/" + vId + '/' + vTime, false);//the false is for making the call synchronous
            vXmlhttp.setRequestHeader("Content-type", "application/json");
            vXmlhttp.send('');
        }
        var tId = $scope.torrent.id;
        if (tId && torrent && torrent.duration) {
            var tTime = parseInt(torrent.currentTime) + '&' + $scope.torrent.index;
            var vXmlhttp = new XMLHttpRequest();
            vXmlhttp.open("GET", "/api/media/record/" + tId + '/' + tTime, false);//the false is for making the call synchronous
            vXmlhttp.setRequestHeader("Content-type", "application/json");
            vXmlhttp.send('');
        }
        var mId = $scope.music.id;
        if (mId && music.duration) {
            var mTime = parseInt(music.currentTime);
            var mXmlhttp = new XMLHttpRequest();
            if ($scope.music.playlist) {
                mId = $scope.music.playlist.obj.id;
            }
            mXmlhttp.open("GET", "/api/media/record/" + mId + '/' + mTime, false);//the false is for making the call synchronous
            mXmlhttp.setRequestHeader("Content-type", "application/json");
            mXmlhttp.send('');
        }
        var dId = $scope.doc.id;
        if (dId && $scope.doc.iframeOffset) {
            var dTime = $scope.doc.showId;
            var mXmlhttp = new XMLHttpRequest();
            mXmlhttp.open("GET", "/api/media/record/" + dId + '/' + dTime, false);//the false is for making the call synchronous
            mXmlhttp.setRequestHeader("Content-type", "application/json");
            mXmlhttp.send('');
        }
        if (uploader.isUploading) {
            return "You have uploaded files. Are you sure you want to navigate away from this page?";
        }
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
        confirm_str = tag;
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
        url: 'upload/file',
        withCredentials : true
    });
    uploader.onAfterAddingFile = function(fileItem) {
        $scope.widget.uploader = true;
        //console.info('onAfterAddingFile', fileItem);
    };
    uploader.onBeforeUploadItem = function(item) {
        if ($scope.adultonly) {
            item.url = $scope.main_url + '/upload/file/1';
        } else {
            item.url = $scope.main_url + '/upload/file';
        }
        //console.info('onBeforeUploadItem', item);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        if (response.id) {
            if ($scope.feedback.run) {
                if ($scope.feedback.uid === response.id) {
                    showFeedback(response);
                } else {
                    if (arrayObjectIndexOf($scope.feedback.queue, response.id, 'id') === -1) {
                        $scope.feedback.queue.push(response);
                    } else {
                        $scope.feedback.queue.splice(index, 1, response);
                    }
                }
            } else {
                $scope.feedback.run = true;
                showFeedback(response);
            }
        }
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
        addAlert(response);
    };

    $scope.doLogout = function(login_url){
        login_url = typeof login_url !== 'undefined' ? login_url : '';
        var Users = $resource(login_url + '/api/logout', {}, {
            'logout': { method:'GET', withCredentials: true }
        });
        var this_obj = this;
        Users.logout({}, function (user) {
            if (user.loginOK) {
                if (user.url) {
                    this_obj.doLogin(user.url);
                } else {
                    $window.location.href = $location.path();
                }
            } else {
                if (user.url) {
                    this_obj.doLogout(user.url);
                } else {
                    $window.location.href = $location.path();
                }
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
    $scope.doLogin = function(login_url) {
        login_url = typeof login_url !== 'undefined' ? login_url : '';
        if (isValidString(this.username, 'name') && isValidString(this.password, 'passwd')) {
            var Users = $resource(login_url + '/api', {}, {
                'login': { method:'POST', withCredentials: true }
            });
            var this_obj = this;
            Users.login({ username: this.username, password: this.password}, function (user) {
                if (user.loginOK) {
                    if (user.url) {
                        this_obj.doLogin(user.url);
                    } else {
                        $window.location.href = $location.path();
                    }
                }
            }, function (errorResult) {
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
        var this_obj = this;
        if (this.feedbackInput) {
            if (!isValidString(this.feedbackInput, 'name')) {
                if (!isValidString(this.feedbackInput, 'url')) {
                    addAlert('feedback name is not valid!!!');
                    this.feedbackInput = '';
                    this.feedbackBlur = true;
                } else {
                    var tagUrlapi = $resource('/api/addTagUrl', {}, {
                        'addTagUrl': { method:'POST' }
                    });
                    tagUrlapi.addTagUrl({url: this.feedbackInput}, function(result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            this_obj.feedbackInput = '';
                            this_obj.feedbackBlur = true;
                            var index = -1;
                            for (var i in result.tags) {
                                index = arrayObjectIndexOf(this_obj.feedback.list, result.tags[i], 'tag');
                                if (index === -1) {
                                    this_obj.feedback.list.splice(0, 0, {tag: result.tags[i], select: true});
                                } else {
                                    this_obj.feedback.list[index].select = true;
                                }
                            }
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
            } else {
                var this_obj = this;
                var index = arrayObjectIndexOf(this.feedback.list, this.feedbackInput, 'tag');
                if (index === -1) {
                    this.feedback.list.splice(0, 0, {tag: this.feedbackInput, select: true});
                    this.feedbackInput = '';
                    this.feedbackBlur = true;
                } else {
                    this.feedback.list[index].select = true;
                    this.feedbackInput = '';
                    this.feedbackBlur = true;
                }
            }
        }
        return false;
    }
    $scope.delayFeedback = function() {
        if (this.feedback.queue.length > 0) {
            var response = this.feedback.queue.splice(0, 1);
            showFeedback(response[0]);
        } else {
            this.feedback.run = false;
            getFeedbacks(0);
        }
    }
    $scope.sendFeedback = function() {
        this.feedbackDisabled = true;
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
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.feedback.history = result.history;
                    if (this_obj.feedback.queue.length > 0) {
                        var response = this_obj.feedback.queue.splice(0, 1);
                        showFeedback(response[0]);
                    } else {
                        this_obj.feedback.run = false;
                        getFeedbacks(0);
                    }
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
        } else {
            addAlert('feed back name is not valid!!!');
        }
        return false;
    }

    showFeedback = function (response) {
        if (response.id) {
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
            var historyRelative = [];
            for (var i in $scope.feedback.history) {
                searchTag = $scope.feedback.history[i].tag;
                index = arrayObjectIndexOf($scope.feedback.list, searchTag, "tag");
                if (index === -1) {
                    $scope.feedback.history[i].history = true;
                    if ($scope.feedback.history[i].select) {
                        $scope.feedback.list.splice(0, 0, $scope.feedback.history[i]);
                        historyRelative.push($scope.feedback.history[i].tag);
                    }
                } else {
                    if ($scope.feedback.list[index].select !== $scope.feedback.history[i].select) {
                        $scope.feedback.list[index].history = true;
                        $scope.feedback.list[index].select = $scope.feedback.history[i].select;
                        $scope.feedback.list.splice(0, 0, $scope.feedback.list.splice(index, 1)[0]);
                    }
                }
            }
        }
        $scope.feedbackDisabled = false;
    };

    function indexInit() {
        var Info = $resource('/api/getUser', {}, {
            'getUser': { method:'GET' }
        });
        Info.getUser({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                getParentlist();
                for (var i in result.nav) {
                    $scope.navList.push(result.nav[i]);
                }
                $scope.isLogin = true;
                $scope.id = result.id;
                $scope.main_url = result.main_url;
                document.domain = document.domain;
                $scope.level = result.level;
                getFeedbacks(1);
                if (window.MozWebSocket) {
                    window.WebSocket = window.MozWebSocket;
                }
                var ws = new WebSocket(result.ws_url);
                ws.onopen = function(){
                    console.log(result.ws_url + ": Socket has been opened!");
                    //var obj = {type:'test', data: '12345'};
                    //ws.send(JSON.stringify(obj));
                };

                ws.onmessage = function(message) {
                    var wsmsg = JSON.parse(message.data);
                    if ($scope.level >= wsmsg.level) {
                        switch (wsmsg.type) {
                            case 'file':
                                $scope.$broadcast('file', JSON.stringify(wsmsg.data));
                                break;
                            case 'stock':
                                $scope.$broadcast('stock', JSON.stringify(wsmsg.data));
                                break;
                            case 'password':
                                $scope.$broadcast('password', JSON.stringify(wsmsg.data));
                                break;
                            case 'sub':
                                if ($scope.video.sub && $scope.video.sub.match(wsmsg.data)) {
                                    var urlmatch = $scope.video.sub.match(/(.*)\/(0+)$/);
                                    removeCue();
                                    if (urlmatch) {
                                        var fresh = urlmatch[2] + '0';
                                        $scope.video.sub = urlmatch[1] + '/' + fresh;
                                    } else {
                                        $scope.video.sub = $scope.video.sub + '/0';
                                    }
                                } else if ($scope.torrent.sub && $scope.torrent.sub.match(wsmsg.data)) {
                                    removeCue('torrent');
                                    var urlmatch = $scope.torrent.sub.match(/(.*)\/(0+)$/);
                                    if (urlmatch) {
                                        var fresh = urlmatch[2] + '0';
                                        $scope.torrent.sub = urlmatch[1] + '/' + fresh;
                                    } else {
                                        $scope.torrent.sub = $scope.torrent.sub + '/0';
                                    }
                                }
                                break;
                            /*case 'torrent':
                                if (wsmsg.data.id === $scope.torrent.id && wsmsg.data.index === $scope.torrent.index) {
                                    $scope.torrentCheck();
                                }
                                break;*/
                            case $scope.id:
                                $scope.$apply(function() {
                                    addAlert(wsmsg.data);
                                });
                                if (wsmsg.zip) {
                                    openModal('want to input password?').then(function () {
                                        openBlockPW($scope.zipPW, $scope, wsmsg.zip);
                                    }, function () {
                                        openModal('unzip error want to download zip?').then(function () {
                                            $window.location.href = $scope.main_url + '/download/' + wsmsg.zip + '/zip';
                                        }, function () {
                                        });
                                    });
                                }
                                break;
                            default:
                                console.log(wsmsg);
                        }
                    }
                };
                $scope.testLogin();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            }
        });
    }

    $scope.zipPW = function(id) {
        var this_obj = this;
        var api = $resource('/api/zipPassword/' + id, {}, {
            'zipPW': { method:'PUT' }
        });
        api.zipPW({pwd: this.userPW}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.closeBlockPW();
                addAlert('password update completed, please unzip again');
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

    $scope.urlUpload = function() {
        var url = this.inputUrl;
        var this_obj = this;
        this.inputUrl = '';
        if (isValidString(url, 'url')) {
            var uploadurl = this.main_url + '/api/upload/url';
            if (this.adultonly) {
                uploadurl = this.main_url + '/api/upload/url/1';
            }
            var api = $resource(uploadurl, {}, {
                'uploadUrl': { method:'POST', withCredentials: true }
            });
            api.uploadUrl({url: url}, function (result) {
                this_obj.inputUrl = '';
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.stop) {
                        addAlert('torrent was stoped');
                    } else {
                        if (result.name) {
                            if (this_obj.feedback.run) {
                                if (this_obj.feedback.uid === result.id) {
                                    showFeedback(result);
                                } else {
                                    var index = arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id');
                                    if (index === -1) {
                                        this_obj.feedback.queue.push(result);
                                    } else {
                                        this_obj.feedback.queue.splice(index, 1, result);
                                    }
                                }
                            } else {
                                this_obj.feedback.run = true;
                                showFeedback(result);
                            }
                        }
                    }
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
        } else {
            addAlert("invalid url!!!");
        }
    }

    $scope.save2local = function(music, id) {
        if (!id) {
            if (this.toolList.item.id.substr(0, 4) === 'you_') {
                url =  'https://www.youtube.com/watch?v=' + this.toolList.item.id.substr(4);
            } else if (this.toolList.item.id.substr(0, 4) === 'ypl_') {
                url =  'https://www.youtube.com/watch?list=' + this.toolList.item.id.substr(4);
            } else if (this.toolList.item.id.substr(0, 4) === 'kub_') {
                url =  'http://www.123kubo.com/vod-read-id-' + this.toolList.item.id.substr(4) + '.html';
            } else if (this.toolList.item.id.substr(0, 4) === 'yif_') {
                url =  'https://yts.ag/movie/' + this.toolList.item.id.substr(4);
            } else if (this.toolList.item.id.substr(0, 4) === 'mad_') {
                url =  'http://www.cartoonmad.com/comic/' + this.toolList.item.id.substr(4) + '.html';
            } else if (this.toolList.item.id.substr(0, 4) === 'c99_') {
                url =  'http://www.99comic.com/comic/' + this.toolList.item.id.substr(4) + '/';
            } else if (this.toolList.item.id.substr(0, 4) === 'bbl_') {
                if (this.toolList.item.id.substr(4).match(/^av/)) {
                    url =  'http://www.bilibili.com/video/' + this.toolList.item.id.substr(4) + '/';
                } else {
                    url =  'http://www.bilibili.com/bangumi/i/' + this.toolList.item.id.substr(4) + '/';
                }
            } else {
                addAlert('not external video');
                return false;
            }
            if (this.toolList.item.status === 4) {
                url = url + ':music';
            }
        } else {
            if (id.substr(0, 4) === 'you_') {
                url =  'https://www.youtube.com/watch?v=' + id.substr(4);
            } else if (id.substr(0, 4) === 'ypl_') {
                url =  'https://www.youtube.com/watch?list=' + id.substr(4);
            } else if (id.substr(0, 4) === 'kub_') {
                url =  'http://www.123kubo.com/vod-read-id-' + id.substr(4) + '.html';
            } else if (id.substr(0, 4) === 'yif_') {
                url =  'https://yts.ag/movie/' + id.substr(4);
            } else if (id.substr(0, 4) === 'mad_') {
                url =  'http://www.cartoonmad.com/comic/' + id.substr(4) + '.html';
            } else if (id.substr(0, 4) === 'c99_') {
                url =  'http://www.99comic.com/comic/' + id.substr(4) + '/';
            } else if (id.substr(0, 4) === 'bbl_') {
                if (id.substr(4).match(/^av/)) {
                    url =  'http://www.bilibili.com/video/' + id.substr(4) + '/';
                } else {
                    url =  'http://www.bilibili.com/bangumi/i/' + id.substr(4) + '/';
                }
            } else {
                addAlert('not external video');
                return false;
            }
            if (music) {
                url = url + ':music';
            }
        }
        var this_obj = this;
        if (isValidString(url, 'url')) {
            var uploadurl = this.main_url + '/api/upload/url';
            if (this.adultonly) {
                uploadurl = this.main_url + '/api/upload/url/1';
            }
            var api = $resource(uploadurl, {}, {
                'uploadUrl': { method:'POST', withCredentials: true }
            });
            api.uploadUrl({url: url}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.name) {
                        if (this_obj.feedback.run) {
                            if (this_obj.feedback.uid === result.id) {
                                showFeedback(result);
                            } else {
                                var index = arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id');
                                if (index === -1) {
                                    this_obj.feedback.queue.push(result);
                                } else {
                                    this_obj.feedback.queue.splice(index, 1, result);
                                }
                            }
                        } else {
                            this_obj.feedback.run = true;
                            showFeedback(result);
                        }
                    }
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
        } else {
            addAlert("invalid url!!!");
        }
    }

    $scope.subscription = function(cid, ctitle, type) {
        if (!cid) {
            cid = this.toolList.item.cid;
            ctitle = this.toolList.title;
            if (this.toolList.item.status === 3) {
                type = 'video';
            } else if (this.toolList.item.status === 4) {
                type = 'music';
            }
        }
        if (type !== 'music' && type !== 'video') {
            addAlert('Type is not valid!!!');
        } else {
            if (isValidString(ctitle, 'name')) {
                var this_obj = this;
                var bookmarkapi = $resource('/api/bookmark/subscipt', {}, {
                    'subscipt': { method:'POST' }
                });
                bookmarkapi.subscipt({name: ctitle, path: ['ych_' + cid, 'no local', 'youtube playlist', 'youtube ' + type], exactly: [false, false]}, function(result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.id) {
                            this_obj.bookmarkList.push({id: result.id, name: result.name});
                        }
                        if (result.bid) {
                            result.id = result.bid;
                            result.name = result.bname;
                            if (result.name) {
                                if (this_obj.feedback.run) {
                                    if (this_obj.feedback.uid === result.id) {
                                        showFeedback(result);
                                    } else {
                                        if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                            this_obj.feedback.queue.push(result);
                                        } else {
                                            this_obj.feedback.queue.splice(index, 1, result);
                                        }
                                    }
                                } else {
                                    this_obj.feedback.run = true;
                                    showFeedback(result);
                                }
                            }
                        }
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
            } else {
                addAlert('Bookmark name is not valid!!!');
            }
        }
    }

    $scope.urlSave = function() {
        var url = this.inputUrl;
        this.inputUrl = '';
        var this_obj = this;
        if (isValidString(url, 'url') && !this.disableUrlSave) {
            this.disableUrlSave = true;
            var addurl = this.main_url + '/api/addurl';
            if (this.adultonly) {
                addurl = this.main_url + '/api/addurl/1';
            }
            var api = $resource(addurl, {}, {
                'addurl': { method:'POST', withCredentials: true }
            });
            api.addurl({url: url}, function (result) {
                this_obj.disableUrlSave = false;
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.name) {
                        if (this_obj.feedback.run) {
                            if (this_obj.feedback.uid === result.id) {
                                showFeedback(result);
                            } else {
                                if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                    this_obj.feedback.queue.push(result);
                                } else {
                                    this_obj.feedback.queue.splice(index, 1, result);
                                }
                            }
                        } else {
                            this_obj.feedback.run = true;
                            showFeedback(result);
                        }
                    }
                }
            }, function(errorResult) {
                this_obj.disableUrlSave = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert("invalid url!!!");
        }
    }

    function getFeedbacks(init) {
        init = typeof init !== 'undefined' ? init : 0;
        var Info = $resource($scope.main_url + '/api/feedback', {}, {
            'getFeedback': { method:'GET', withCredentials: true }
        });
        Info.getFeedback({}, function (result) {
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
            if (errorResult.status === 400) {
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401 && !init) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.torrentCheck = function(type) {
        var this_obj = null;
        var src_obj = null;
        var index = 'v';
        if (type === 'video') {
            this_obj = this['video'].playlist.obj;
            src_obj = this['video'];
        } else {
            this_obj = src_obj = this['torrent'];
            index = this['torrent'].index;
        }
        if (!this_obj.id || this_obj.complete) {
            return;
        }
        var id = this_obj.id;
        var size = 0;
        if (this_obj.size) {
            size = parseInt(this_obj.size);
        }
        var torrentApi = $resource($scope.main_url + '/api/torrent/check/' + id + '/' + index + '/' + size, {}, {
            'check': { method:'GET', withCredentials: true }
        });
        torrentApi.check({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
            //console.log(result);
            if (result.start) {
                addAlert('File start buffering, Mp4 may preview');
            } else {
                this_obj.size = result.ret_size;
                if (result.newBuffer) {
                    if (type === 'video') {
                        videoStart = video.currentTime;
                    } else {
                        torrentStart = torrent.currentTime;
                    }
                    var urlmatch = src_obj.src.match(/(.*)\/(0+)$/);
                    if (urlmatch) {
                        var fresh = urlmatch[2] + '0';
                        src_obj.src = urlmatch[1] + '/' + fresh;
                    } else {
                        src_obj.src = src_obj.src + '/0';
                    }
                }
                this_obj.complete = result.complete;
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

    $scope.downloadTorrent = function() {
        $window.location.href = this['torrent'].src;
    }

    $scope.downloadAll = function() {
        if (!this.toolList.item) {
            return;
        }
        var torrentApi = $resource($scope.main_url + '/api/torrent/all/download/' + this.toolList.item.id, {}, {
            'allDownload': { method:'GET', withCredentials: true }
        });
        torrentApi.allDownload({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
            if (result.complete) {
                addAlert('download complete!!!');
            } else {
                addAlert('starting download');
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

    $scope.torrentMove = function(number, end) {
        if (end && torrentPre < torrent.duration - 3) {
            torrent.currentTime = torrentPre;
            torrent.pause();
        } else {
            if (this.torrent.id && this.torrent.type === 1) {
                this.mediaRecord('torrent', 0, end);
            }
            var count = this.torrent.list.length;
            if (count === 1) {
                if (this.torrent.type === 1 && (!end || this.torrent.complete)) {
                    torrent.currentTime = 0;
                    torrent.pause();
                }
            } else {
                if (+this.torrent.index + number >= count) {
                    this.torrent.index = +this.torrent.index + number - count;
                } else if (+this.torrent.index + number < 0) {
                    this.torrent.index = +this.torrent.index + number + count;
                } else {
                    this.torrent.index = +this.torrent.index + number;
                }
                this.torrent.size = 0;
                this.torrent.complete = false;
                this.torrent.name = this.torrent.list[this.torrent.index]['name'];
                this.torrent.type = this.torrent.list[this.torrent.index]['type'];
                this.torrent.src = $scope.main_url + '/torrent/' + this.torrent.index + '/' + this.torrent.id;
                removeCue('torrent');
                this.torrent.sub = '/subtitle/' + this.torrent.id + '/' + this.torrent.index;
            }
        }
    }

    $scope.mediaRecord = function(type, record, end, is_playlist, callback) {
        var id = this[type].id;
        var time = 0;
        var index = -1;
        var append = '';
        if (id) {
            if (type === 'video') {
                if (!video.duration) {
                    if (callback) {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                    return false;
                }
                if (!end) {
                    time = parseInt(video.currentTime);
                }
                if (is_playlist && this[type].playlist) {
                    append = '/' + id;
                }
                if (this[type].playlist) {
                    id = this[type].playlist.obj.id;
                }
            } else if (type === 'music') {
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                }
                if (!end) {
                    time = parseInt(music.currentTime);
                }
                if (is_playlist && this[type].playlist) {
                    append = '/' + id;
                }
                if (this[type].playlist) {
                    id = this[type].playlist.obj.id;
                }
            } else if (type === 'torrent') {
                if (!torrent || !torrent.duration) {
                    if (callback) {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                    return;
                }
                if (!end || !this.torrent.complete) {
                    time = parseInt(torrent.currentTime) + '&' + this.torrent.index;
                }
            } else if (this[type].iframeOffset) {
                if (record !== 1) {
                    time = record;
                }
            } else {
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                }
                return;
            }
            var mediaApi = $resource('/api/media/record/' + id + '/' + time + append, {}, {
                'record': { method:'GET' }
            });
            mediaApi.record({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                }
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
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
    }

    $scope.testLogin = function() {
        var testApi = $resource(this.main_url + '/api/testLogin', {}, {
            'testLogin': { method:'GET', withCredentials: true }
        });
        var this_obj = this;
        testApi.testLogin({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                //$window.location.href = $location.path();
                this_obj.doLogout();
            }
        });
    }

    $scope.presentMove = function(number) {
        if (number === 0) {
            if (this.present.showId >= 1 && this.present.showId <= this.present.maxId) {
                this.present.presentId = this.present.showId;
            } else {
                this.present.showId = this.present.presentId;
                return false;
            }
        } else {
            var newIndex = +this.present.presentId + number;
            if (newIndex >= 1 && newIndex <= this.present.maxId) {
                this.present.presentId = newIndex;
                this.present.showId = this.present.presentId;
            } else {
                this.present.showId = this.present.presentId;
                return false;
            }
        }
        this.present.src = this.main_url + '/preview/' + this.present.list[this.present.index + this.present.back].id + '/' + this.present.presentId;
    }

    $scope.docMove = function(number) {
        if (number === 0) {
            if (this.doc.showId >= 1 && this.doc.showId <= this.doc.maxId) {
                this.doc.presentId = this.doc.showId;
            } else {
                this.doc.showId = this.doc.presentId;
                return false;
            }
        } else {
            var newIndex = +this.doc.presentId + number;
            if (newIndex >= 1 && newIndex <= this.doc.maxId) {
                this.doc.presentId = newIndex;
                this.doc.showId = this.doc.presentId;
            } else {
                this.doc.showId = this.doc.presentId;
                return false;
            }
        }
        if (this.doc.iframeOffset) {
            this.doc.win.scrollTo(0, this.doc.iframeOffset[this.doc.presentId-1]);
        } else {
            this.doc.src = this.main_url + '/preview/' + this.doc.list[this.doc.index + this.doc.back].id + '/' + this.doc.presentId;
        }
    }

    $scope.videoMove = function(type, direction, ended) {
        if (this[type].playlist) {
            if (this[type].playlist.obj.is_magnet) {
                if (ended && videoPre < video.duration - 3) {
                    video.currentTime = videoPre;
                    video.pause();
                    return ;
                }
            }
            this[type].itemName = '';
            var newIndex = 0;
            if (direction && direction.toString().match(/^\d+(\.\d+)?$/)) {
                direction = +direction;
                if (direction === +this[type].playlist.obj.index) {
                    return false;
                } else {
                    if (this[type].playlist.obj_arr) {
                        newIndex = Math.floor(+this[type].playlist.obj.index);
                        if (direction < 1) {
                            newIndex = 1;
                        } else if (direction > this[type].playlist.total+1) {
                            newIndex = this[type].playlist.total;
                        } else {
                            newIndex = direction;
                        }
                    } else {
                        if (direction < 1) {
                            newIndex = 1;
                        } else if (direction > this[type].playlist.total+1) {
                            newIndex = this[type].playlist.total;
                        } else {
                            newIndex = direction;
                        }
                    }
                }
            } else {
                if (this[type].playlist.obj.sub) {
                    newIndex = Math.round(this[type].playlist.obj.index*1000);
                    if (newIndex%1000 === 0) {
                        newIndex++;
                    }
                    if (direction === 'previous') {
                        newIndex--;
                    } else {
                        newIndex++;
                    }
                    if (newIndex%1000 === 0) {
                        newIndex = newIndex/1000 - 1;
                    } else if (newIndex%1000 > this[type].playlist.obj.sub) {
                        newIndex = Math.floor(newIndex/1000) + 1;
                    } else {
                        newIndex = newIndex/1000;
                    }
                } else {
                    newIndex = Math.floor(+this[type].playlist.obj.index);
                    if (direction === 'previous') {
                        newIndex--;
                    } else {
                        newIndex++;
                    }
                }
            }
            if (newIndex >= 1 && newIndex < this[type].playlist.total + 1 && !this.moveDisabled[type]) {
                this.moveDisabled[type] = true;
                var append = '';
                this.mediaRecord('video', 0, ended);
                if (this[type].playlist.obj_arr) {
                    var realIndex = arrayObjectIndexOf(this[type].playlist.obj_arr, newIndex, 'index');
                    if (realIndex !== -1) {
                        this[type].playlist.obj = this[type].playlist.obj_arr[realIndex];
                        append = '/' + this[type].playlist.obj.id;
                        if (this[type].playlist.pageToken) {
                            append = append + '/' + this[type].playlist.pageToken;
                        }
                    } else {
                        append = '/' + this[type].playlist.obj.id;
                        if (direction === 'previous') {
                            if (this[type].playlist.pageP) {
                                append = append + '/' + this[type].playlist.pageP + '/back';
                            }
                        } else {
                            if (this[type].playlist.pageN) {
                                append = append + '/' + this[type].playlist.pageN;
                            }
                        }
                    }
                } else {
                    append = '/' + newIndex;
                }
                var this_obj = this;
                this[type].src = this[type].list[this[type].index + this[type].back].thumb;
                var mediaApi = $resource('/api/media/setTime/' + this[type].id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                }
                            }
                        }
                        if (result.playlist) {
                            this_obj[type].playlist = result.playlist;
                        } else {
                            this_obj[type].playlist = null;
                        }
                        this_obj.moveDisabled[type] = false;
                        var videoId = this_obj[type].id;
                        var is_magnet = false;
                        if (this_obj[type].playlist.obj.id) {
                            videoId = this_obj[type].playlist.obj.id;
                        }
                        if (this_obj[type].playlist.obj.is_magnet) {
                            is_magnet = true;
                            this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                            if (this_obj[type].playlist.obj.id) {
                                this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                            } else {
                                if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                    var uploadurl = $scope.main_url + '/api/upload/url';
                                    if (this_obj.adultonly) {
                                        uploadurl = $scope.main_url + '/api/upload/url/1';
                                    }
                                    var upApi = $resource(uploadurl, {}, {
                                        'uploadUrl': { method:'POST', withCredentials: true }
                                    });
                                    upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                        if (result.loginOK) {
                                            $window.location.href = $location.path();
                                        } else {
                                            console.log(result);
                                            videoId = this_obj[type].playlist.obj.id = result.id;
                                            this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                            removeCue();
                                            this_obj[type].sub = '/subtitle/' + videoId + '/v';
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
                                } else {
                                    addAlert('magnet not valid');
                                }
                            }
                        }
                        if (!is_magnet) {
                            var externalApi = $resource(this_obj.main_url + '/api/external/getSingle/' + videoId, {}, {
                                'getSingle': { method:'GET', withCredentials: true }
                            });
                            externalApi.getSingle({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (videoId === this_obj[type].playlist.obj.id) {
                                        if (this_obj[type].playlist.obj.title) {
                                            this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                        } else {
                                            this_obj[type].itemName = ':' + result.title;
                                        }
                                        if (type === 'music') {
                                            if (result.audio) {
                                                this_obj[type].src = result.audio;
                                            } else {
                                                this_obj[type].src = result.video[0];
                                            }
                                        } else {
                                            this_obj[type].hd_list = result.video;
                                            if (result.sub) {
                                                this_obj[type].playlist.obj.sub = result.sub;
                                            }
                                            var hd = 0;
                                            if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                hd = this_obj[type].hd;
                                            } else {
                                                hd = this_obj[type].hd_list.length - 1;
                                            }
                                            this_obj[type].src = this_obj[type].hd_list[hd];
                                        }
                                    }
                                }
                            }, function(errorResult) {
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                    if (type === 'music') {
                                        $scope.nextVideo('music');
                                    }
                            } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        }
                        if (type === 'video') {
                            removeCue();
                            this_obj[type].sub = '/subtitle/' + videoId;
                        }
                    }
                }, function(errorResult) {
                    this_obj.moveDisabled[type] = false;
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

    $scope.nextVideo = function(type) {
        if (this[type].playlist) {
            if (this[type].playlist.obj.sub) {
                if (Math.round(this[type].playlist.obj.index) < this[type].playlist.total * 1000 + this[type].playlist.obj.sub) {
                    this.videoMove(type, 'next', true);
                    return true;
                }
            } else {
                if (this[type].playlist.obj.index < this[type].playlist.total) {
                    this.videoMove(type, 'next', true);
                    return true;
                }
            }
        }
        if (!this.noEnd && this[type].playlist) {
            return false;
        } else {
            if (type === 'music') {
                this.musicShuffle();
            } else {
                switch (this[type].mode) {
                    case 1:
                    this.mediaMove(-1, type, true);
                    break;
                    case 2:
                    this.mediaMove(0, type, true, true);
                    break;
                    case 0:
                    default:
                    this.mediaMove(1, type, true);
                    break;
                }
            }
        }
    }

    $scope.changeMode = function(type) {
        if (this[type].mode < 2) {
            this[type].mode++;
        } else {
            if (type === 'music' && this[type].mode < 3) {
                this[type].mode++;
            } else {
                this[type].mode = 0;
            }
        }
    }

    $scope.imgMove = function(number) {
        //playlist 跟local分開
        if (this.image.playlist) {
            var this_obj = this;
            if (number === 0) {
                var subIndex = Math.round(this.image.showId*1000)%1000;
                var sIndex = Math.floor(this.image.showId);
                if (subIndex >= 1 && subIndex <= this.image.playlist.obj.sub) {
                    this.image.presentId = this.image.showId;
                    recordExternalImg();
                } else {
                    if (subIndex < 1 && sIndex > 1) {
                        //settime
                        sIndex--;
                        subIndex = 1;
                        this.image.presentId = this.image.showId = (sIndex*1000 + subIndex)/1000;
                    } else if (subIndex > this.image.playlist.obj.sub && pIndex < this.image.maxId) {
                        //settime
                        sIndex++;
                        subIndex = 1;
                        this.image.presentId = this.image.showId = (sIndex*1000 + subIndex)/1000;
                    } else {
                        this.image.showId = this.image.presentId;
                        return false;
                    }
                    recordExternalImg('new');
                }
            } else {
                var subIndex = Math.round(this.image.presentId*1000)%1000;
                var pIndex = Math.floor(this.image.presentId);
                var newIndex = subIndex + number;
                if (newIndex >= 1 && newIndex <= this.image.playlist.obj.sub) {
                    this.image.presentId = (pIndex*1000 + newIndex)/1000;
                    this.image.showId = this.image.presentId;
                    recordExternalImg();
                } else {
                    if (newIndex < 1 && pIndex > 1) {
                        //settime
                        pIndex--;
                        newIndex = 1;
                        this.image.showId = this.image.presentId = (pIndex*1000 + newIndex)/1000;
                    } else if (newIndex > this.image.playlist.obj.sub && pIndex < this.image.maxId) {
                        //settime
                        pIndex++;
                        newIndex = 1;
                        this.image.showId = this.image.presentId = (pIndex*1000 + newIndex)/1000;
                    } else {
                        this.image.showId = this.image.presentId;
                        return false;
                    }
                    recordExternalImg('new');
                }
            }

            function recordExternalImg(type) {
                if (type === 'new') {
                    var mediaApi = $resource('/api/media/setTime/' + this_obj.image.id + '/image/' + this_obj.image.presentId, {}, {
                        'setTime': { method:'GET' }
                    });
                    mediaApi.setTime({}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            this_obj.image.playlist = result.playlist;
                            this_obj.image.showId = this_obj.image.playlist.obj.showId;
                            this_obj.image.presentId = this_obj.image.playlist.obj.index;
                            this_obj.image.itemName = ':' + this_obj.image.playlist.obj.title;
                            this_obj.image.src = this_obj.image.playlist.obj.pre_url + this_obj.image.playlist.obj.pre_obj[Math.round(this_obj.image.playlist.obj.index*1000)%1000 -1];
                            this_obj.image.maxId = this_obj.image.playlist.total;
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
                } else {
                    this_obj.image.src = this_obj.image.playlist.obj.pre_url + this_obj.image.playlist.obj.pre_obj[Math.round(this_obj.image.presentId*1000)%1000 -1];
                    var mediaApi = $resource('/api/media/record/' + this_obj.image.id + '/' + this_obj.image.presentId, {}, {
                        'record': { method:'GET' }
                    });
                    mediaApi.record({}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
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
            }
        } else {
            if (number === 0) {
                this.image.showId = Math.floor(this.image.showId);
                if (this.image.showId >= 1 && this.image.showId <= this.image.maxId) {
                    this.image.presentId = this.image.showId;
                } else {
                    this.image.showId = this.image.presentId;
                    return false;
                }
            } else {
                this.image.presentId = Math.floor(this.image.presentId);
                var newIndex = this.image.presentId + number;
                if (newIndex >= 1 && newIndex <= this.image.maxId) {
                    this.image.showId = this.image.presentId = newIndex;
                } else {
                    this.image.showId = this.image.presentId;
                    return false;
                }
            }
            this.image.src = this.main_url + '/image/' + this.image.list[this.image.index + this.image.back].id + '/' + this.image.presentId;
        }
    }

    $scope.nextImage = function() {
        if (this.image.playlist) {
            var pIndex = Math.round(this.image.presentId*1000);
            if (Math.floor(pIndex/1000) === this.image.maxId && pIndex%1000 === this.image.playlist.obj.sub) {
                this.mediaMove(1, 'image');
            } else {
                this.imgMove(1);
            }
        } else {
            this.image.presentId = Math.floor(this.image.presentId);
            if (this.image.presentId === this.image.maxId) {
                this.mediaMove(1, 'image');
            } else {
                this.imgMove(1);
            }
        }
    }

    $scope.prevImage = function() {
        if (this.image.playlist) {
            var pIndex = Math.round(this.image.presentId*1000);
            if (Math.floor(pIndex/1000) === 1 && pIndex%1000 === 1) {
                this.mediaMove(-1, 'image');
            } else {
                this.imgMove(-1);
            }
        } else {
            this.image.presentId = Math.floor(this.image.presentId);
            if (this.image.presentId === 1) {
                this.mediaMove(-1, 'image');
            } else {
                this.imgMove(-1);
            }
        }
    }

    $scope.mediaMove = function(number, type, ended) {
        var preType = '', status = 0, isLoad = false, docRecord = 0;
        switch (type) {
            case 'image':
                preType = 'image';
                status = 2;
                this.image.showId = this.image.presentId = 1;
                this.video.itemName = '';
                break;
            case 'video':
                preType = 'video';
                status = 3;
                if (document.webkitFullScreen) {
                    document.webkitFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else {
                    video.webkitExitFullScreen();
                }
                this.video.itemName = '';
                video.pause();
                break;
            case 'music':
                preType = 'video';
                status = 4;
                music.pause();
                this.music.itemName = '';
                break;
            case 'doc':
                preType = 'preview';
                status = 5;
                docRecord = this.doc.showId;
                this.doc.showId = this.doc.presentId = 1;
                break;
            case 'present':
                preType = 'preview';
                status = 6;
                this.present.showId = this.present.presentId = 1;
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        var this_obj = this;
        var end = false;
        var ori_index = +this[type].index;
        function isOri() {
            if (ori_index === this_obj[type].index) {
                if (type === 'video') {
                    video.currentTime = 0;
                    video.play();
                } else if (type === 'music') {
                    music.currentTime = 0;
                    music.play();
                }
            }
        }
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
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (length > 0) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.push(result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = this_obj[type].list.concat(result.itemList);
                            }
                            if (length === this_obj[type].list.length) {
                                //this_obj[type].index = -this_obj[type].back;
                            } else {
                                this_obj[type].front = this_obj[type].front + this_obj[type].list.length - length;
                            }
                            this_obj[type].frontPage = this_obj[type].frontPage + result.itemList.length;
                        } else {
                            end = true;
                            //this_obj[type].index = -this_obj[type].back;
                        }
                        function front(yend) {
                            if (end && yend) {
                                $scope[type].end = true;
                            } else {
                                $scope[type].end = false;
                            }
                            if (this_obj[type].index >= this_obj[type].front) {
                                this_obj[type].index = -this_obj[type].back;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                                this_obj.mediaRecord(type, docRecord, ended, true);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                                append = '/external';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    //var videoIndex = 0;
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                //if (setTime[3]) {
                                                //    videoIndex = setTime[3];
                                                //}
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    if (result.playlist) {
                                        this_obj[type].playlist = result.playlist;
                                    } else {
                                        this_obj[type].playlist = null;
                                    }
                                    this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                    if (type === 'doc') {
                                        this_obj[type].iframeOffset = null;
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                    } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                        if (this_obj[type].playlist && this_obj[type].playlist.obj.pre_url) {
                                            this_obj[type].src = this_obj[type].playlist.obj.pre_url + this_obj[type].playlist.obj.pre_obj[Math.round(this_obj[type].playlist.obj.index*1000)%1000 -1];
                                            this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                            this_obj[type].showId = this_obj[type].playlist.obj.showId;
                                            this_obj[type].presentId = this_obj[type].playlist.obj.index;
                                            this_obj[type].maxId = this_obj[type].playlist.total;
                                        } else {
                                            this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                                            if (type === 'video') {
                                                video.poster = this_obj[type].src;
                                            }
                                            var is_magnet = false;
                                            if (this_obj[type].playlist) {
                                                if (this_obj[type].playlist.obj.id) {
                                                    videoId = this_obj[type].playlist.obj.id;
                                                }
                                                if (this_obj[type].playlist.obj.is_magnet) {
                                                    is_magnet = true;
                                                    this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                                    if (this_obj[type].playlist.obj.id) {
                                                        this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                        isOri();
                                                    } else {
                                                        if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                                            var uploadurl = $scope.main_url + '/api/upload/url';
                                                            if (this_obj.adultonly) {
                                                                uploadurl = $scope.main_url + '/api/upload/url/1';
                                                            }
                                                            var upApi = $resource(uploadurl, {}, {
                                                                'uploadUrl': { method:'POST', withCredentials: true }
                                                            });
                                                            upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                                if (result.loginOK) {
                                                                    $window.location.href = $location.path();
                                                                } else {
                                                                    videoId = this_obj[type].playlist.obj.id = result.id;
                                                                    this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                                    isOri();
                                                                    removeCue();
                                                                    this_obj[type].sub = '/subtitle/' + videoId + '/v';
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
                                                        } else {
                                                            addAlert('magnet not valid');
                                                        }
                                                    }
                                                }
                                            }
                                            if (!is_magnet) {
                                                var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                                    'getSingle': { method:'GET', withCredentials: true }
                                                });
                                                externalApi.getSingle({}, function (result) {
                                                    if (result.loginOK) {
                                                        $window.location.href = $location.path();
                                                    } else {
                                                        if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                                            if (this_obj[type].playlist) {
                                                                this_obj[type].itemName = ':' + result.title;
                                                            }
                                                            if (type === 'music') {
                                                                if (result.audio) {
                                                                    this_obj[type].src = result.audio;
                                                                } else {
                                                                    this_obj[type].src = result.video[0];
                                                                }
                                                            } else {
                                                                this_obj[type].hd_list = result.video;
                                                                if (result.sub) {
                                                                    this_obj[type].playlist.obj.sub = result.sub;
                                                                }
                                                                var hd = 0;
                                                                if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                                    hd = this_obj[type].hd;
                                                                } else {
                                                                    hd = this_obj[type].hd_list.length - 1;
                                                                }
                                                                this_obj[type].src = this_obj[type].hd_list[hd];
                                                            }
                                                            isOri();
                                                        }
                                                    }
                                                }, function(errorResult) {
                                                    if (errorResult.status === 400) {
                                                        addAlert(errorResult.data);
                                                        if (type === 'music') {
                                                            $scope.nextVideo('music');
                                                        }
                                                    } else if (errorResult.status === 403) {
                                                        addAlert('unknown API!!!');
                                                    } else if (errorResult.status === 401) {
                                                        $window.location.href = $location.path();
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        isOri();
                                    }
                                    if (type === 'video') {
                                        removeCue();
                                        this_obj[type].sub = '/subtitle/' + videoId;
                                    }
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
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
                        if (type === 'video' || type === 'music' || type === 'image') {
                            var Info = null;
                            if (this_obj[type].pageToken) {
                                Info = $resource('/api/youtube/get/' + this_obj[type].pageToken, {}, {
                                    'youtube': { method:'GET' }
                                });
                            } else {
                                Info = $resource('/api/youtube/get', {}, {
                                    'youtube': { method:'GET' }
                                });
                            }
                            Info.youtube({}, function(result) {
                                if (result.pageToken) {
                                    this_obj[type].pageToken = result.pageToken;
                                }
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
                                        //this_obj[type].index = -this_obj[type].back;
                                    } else {
                                        this_obj[type].front = this_obj[type].front + this_obj[type].list.length - length;
                                    }
                                    front(false);
                                } else {
                                    front(true);
                                }
                            }, function(errorResult) {
                                this_obj.mediaMoreDisabled = false;
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        } else {
                            front(true);
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
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
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (length > 0) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.splice(0, 0, result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = result.itemList.reverse().concat(this_obj[type].list);
                            }
                            if (length === this_obj[type].list.length) {
                                //this_obj[type].index = this_obj[type].front - 1;
                            } else {
                                this_obj[type].back = this_obj[type].back + this_obj[type].list.length - length;
                            }
                            this_obj[type].backPage = this_obj[type].backPage + result.itemList.length;
                        } else {
                            //this_obj[type].index = this_obj[type].front - 1;
                            end = true;
                        }
                        function backend(yend) {
                            if (end && yend) {
                                $scope[type].end = true;
                            } else {
                                $scope[type].end = false;
                            }
                            if (this_obj[type].index < -this_obj[type].back) {
                                this_obj[type].index = this_obj[type].front - 1;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, docRecord, ended, true);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                                append = '/external';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    //var videoIndex = 0;
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                //if (setTime[3]) {
                                                //    videoIndex = setTime[3];
                                                //}
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    if (result.playlist) {
                                        this_obj[type].playlist = result.playlist;
                                    } else {
                                        this_obj[type].playlist = null;
                                    }
                                    this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                    if (type === 'doc') {
                                        this_obj[type].iframeOffset = null;
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                    } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                        if (this_obj[type].playlist && this_obj[type].playlist.obj.pre_url) {
                                            this_obj[type].src = this_obj[type].playlist.obj.pre_url + this_obj[type].playlist.obj.pre_obj[Math.round(this_obj[type].playlist.obj.index*1000)%1000 -1];
                                            this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                            this_obj[type].showId = this_obj[type].playlist.obj.showId;
                                            this_obj[type].presentId = this_obj[type].playlist.obj.index;
                                            this_obj[type].maxId = this_obj[type].playlist.total;
                                        } else {
                                            this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                                            if (type === 'video') {
                                                video.poster = this_obj[type].src;
                                            }
                                            var is_magnet = false;
                                            if (this_obj[type].playlist) {
                                                if (this_obj[type].playlist.obj.id) {
                                                    videoId = this_obj[type].playlist.obj.id;
                                                }
                                                if (this_obj[type].playlist.obj.is_magnet) {
                                                    is_magnet = true;
                                                    this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                                    if (this_obj[type].playlist.obj.id) {
                                                        this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                        isOri();
                                                    } else {
                                                        if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                                            var uploadurl = $scope.main_url + '/api/upload/url';
                                                            if (this_obj.adultonly) {
                                                                uploadurl = $scope.main_url + '/api/upload/url/1';
                                                            }
                                                            var upApi = $resource(uploadurl, {}, {
                                                                'uploadUrl': { method:'POST', withCredentials: true }
                                                            });
                                                            upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                                if (result.loginOK) {
                                                                    $window.location.href = $location.path();
                                                                } else {
                                                                    videoId = this_obj[type].playlist.obj.id = result.id;
                                                                    this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                                    isOri();
                                                                    removeCue();
                                                                    this_obj[type].sub = '/subtitle/' + videoId + '/v';
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
                                                        } else {
                                                            addAlert('magnet not valid');
                                                        }
                                                    }
                                                }
                                            }
                                            if (!is_magnet) {
                                                var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                                    'getSingle': { method:'GET', withCredentials: true }
                                                });
                                                externalApi.getSingle({}, function (result) {
                                                    if (result.loginOK) {
                                                        $window.location.href = $location.path();
                                                    } else {
                                                        if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                                            if (this_obj[type].playlist) {
                                                                this_obj[type].itemName = ':' + result.title;
                                                            }
                                                            if (type === 'music') {
                                                                if (result.audio) {
                                                                    this_obj[type].src = result.audio;
                                                                } else {
                                                                    this_obj[type].src = result.video[0];
                                                                }
                                                            } else {
                                                                this_obj[type].hd_list = result.video;
                                                                if (result.sub) {
                                                                    this_obj[type].playlist.obj.sub = result.sub;
                                                                }
                                                                var hd = 0;
                                                                if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                                    hd = this_obj[type].hd;
                                                                } else {
                                                                    hd = this_obj[type].hd_list.length - 1;
                                                                }
                                                                this_obj[type].src = this_obj[type].hd_list[hd];
                                                            }
                                                            isOri();
                                                        }
                                                    }
                                                }, function(errorResult) {
                                                    if (errorResult.status === 400) {
                                                        addAlert(errorResult.data);
                                                        if (type === 'music') {
                                                            $scope.nextVideo('music');
                                                        }
                                                    } else if (errorResult.status === 403) {
                                                        addAlert('unknown API!!!');
                                                    } else if (errorResult.status === 401) {
                                                        $window.location.href = $location.path();
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        isOri();
                                    }
                                    if (type === 'video') {
                                        removeCue();
                                        this_obj[type].sub = '/subtitle/' + videoId;
                                    }
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
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
                        var Info = null;
                        if (this_obj[type].pageToken) {
                            Info = $resource('/api/youtube/get/' + this_obj[type].pageToken, {}, {
                                'youtube': { method:'GET' }
                            });
                        } else {
                            Info = $resource('/api/youtube/get', {}, {
                                'youtube': { method:'GET' }
                            });
                        }
                        if (type === 'video' || type === 'music' || type === 'image') {
                            Info.youtube({}, function(result) {
                                if (result.pageToken) {
                                    this_obj[type].pageToken = result.pageToken;
                                }
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
                                        //this_obj[type].index = this_obj[type].front - 1;
                                    } else {
                                        this_obj[type].back = this_obj[type].back + this_obj[type].list.length - length;
                                    }
                                    backend(false);
                                } else {
                                    backend(true);
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
                        } else {
                            backend(true);
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
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
            if (this[type].id) {
                this.mediaRecord(type, docRecord, ended, true, function() {
                    afterRecord();
                });
            } else {
                afterRecord();
            }
            function afterRecord() {
                var append = '';
                if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                    append = '/external';
                }
                var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                } else {
                                    this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                }
                            }
                        }
                        var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        if (result.playlist) {
                            this_obj[type].playlist = result.playlist;
                        } else {
                            this_obj[type].playlist = null;
                        }
                        this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                        if (type === 'doc') {
                            this_obj[type].iframeOffset = null;
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                        } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                            if (this_obj[type].playlist && this_obj[type].playlist.obj.pre_url) {
                                this_obj[type].src = this_obj[type].playlist.obj.pre_url + this_obj[type].playlist.obj.pre_obj[Math.round(this_obj[type].playlist.obj.index*1000)%1000 -1];
                                this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                this_obj[type].showId = this_obj[type].playlist.obj.showId;
                                this_obj[type].presentId = this_obj[type].playlist.obj.index;
                                this_obj[type].maxId = this_obj[type].playlist.total;
                            } else {
                                this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                                if (type === 'video') {
                                    video.poster = this_obj[type].src;
                                }
                                var is_magnet = false;
                                if (this_obj[type].playlist) {
                                    if (this_obj[type].playlist.obj.id) {
                                        videoId = this_obj[type].playlist.obj.id;
                                    }
                                    if (this_obj[type].playlist.obj.is_magnet) {
                                        is_magnet = true;
                                        this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                        if (this_obj[type].playlist.obj.id) {
                                            this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                            isOri();
                                        } else {
                                            if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                                var uploadurl = $scope.main_url + '/api/upload/url';
                                                if (this_obj.adultonly) {
                                                    uploadurl = $scope.main_url + '/api/upload/url/1';
                                                }
                                                var upApi = $resource(uploadurl, {}, {
                                                    'uploadUrl': { method:'POST', withCredentials: true }
                                                });
                                                upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                    if (result.loginOK) {
                                                        $window.location.href = $location.path();
                                                    } else {
                                                        videoId = this_obj[type].playlist.obj.id = result.id;
                                                        this_obj[type].src = $scope.main_url + '/torrent/v/' + videoId;
                                                        isOri();
                                                        removeCue();
                                                        this_obj[type].sub = '/subtitle/' + videoId + '/v';
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
                                            } else {
                                                addAlert('magnet not valid');
                                            }
                                        }
                                    }
                                }
                                if (!is_magnet) {
                                    var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                        'getSingle': { method:'GET', withCredentials: true }
                                    });
                                    externalApi.getSingle({}, function (result) {
                                        if (result.loginOK) {
                                            $window.location.href = $location.path();
                                        } else {
                                            if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                                if (this_obj[type].playlist) {
                                                    this_obj[type].itemName = ':' + result.title;
                                                }
                                                if (type === 'music') {
                                                    if (result.audio) {
                                                        this_obj[type].src = result.audio;
                                                    } else {
                                                        this_obj[type].src = result.video[0];
                                                    }
                                                } else {
                                                    this_obj[type].hd_list = result.video;
                                                    if (result.sub) {
                                                        this_obj[type].playlist.obj.sub = result.sub;
                                                    }
                                                    var hd = 0;
                                                    if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                        hd = this_obj[type].hd;
                                                    } else {
                                                        hd = this_obj[type].hd_list.length - 1;
                                                    }
                                                    this_obj[type].src = this_obj[type].hd_list[hd];
                                                }
                                                isOri();
                                            }
                                        }
                                    }, function(errorResult) {
                                        if (errorResult.status === 400) {
                                            addAlert(errorResult.data);
                                            if (type === 'music') {
                                                $scope.nextVideo('music');
                                            }
                                        } else if (errorResult.status === 403) {
                                            addAlert('unknown API!!!');
                                        } else if (errorResult.status === 401) {
                                            $window.location.href = $location.path();
                                        }
                                    });
                                }
                            }
                        } else {
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                            isOri();
                        }
                        if (type === 'video') {
                            removeCue();
                            this_obj[type].sub = '/subtitle/' + videoId;
                        }
                        this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                        this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
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
        }
    }
    $scope.musicShuffle = function() {
        var index = 0;
        switch (this.music.mode) {
            case 1:
            this.mediaMove(-1, 'music', true);
            break;
            case 2:
            this.mediaMove(0, 'music', true);
            break;
            case 3:
            if (this.music.end) {
                do {
                    index = randomFloor(-this.music.back, +this.music.front-1);
                } while(index === +this.music.index);
            } else {
                do {
                    index = randomFloor(-this.music.back - 20, +this.music.front + 19);
                } while(index === +this.music.index);
            }
            this.mediaMove(index - this.music.index, 'music', true, true);
            break;
            case 0:
            default:
            this.mediaMove(1, 'music', true);
            break;
        }
    }
    $scope.$watch("this.torrent.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('torrent');
                openModal("請在 Storage 下搜尋，並且只保留上一個版本的字幕").then(function () {
                    $scope.$broadcast('subtitle', 'searchT');
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.mediaToggle('torrent');
                openModal("請在 Storage 下上傳，並且只保留上一個版本的字幕").then(function () {
                    $scope.$broadcast('subtitle', 'uploadT');
                }, function () {
                });
            }
            $scope.torrent.option = 0;
        }
    }, true);
    $scope.$watch("this.music.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('music');
                openModal("確定要儲存到網站?").then(function () {
                    $scope.save2local(true, $scope.music.id);
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.subscription($scope.music.list[$scope.music.index].cid, $scope.music.list[$scope.music.index].ctitle, 'music');
            }
            $scope.music.option = 0;
        }
    }, true);
    $scope.$watch("this.video.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('video');
                openModal("請在 Storage 下搜尋，並且只保留上一個版本的字幕").then(function () {
                    $scope.$broadcast('subtitle', 'searchV');
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.mediaToggle('video');
                openModal("請在 Storage 下上傳，並且只保留上一個版本的字幕").then(function () {
                    $scope.$broadcast('subtitle', 'uploadV');
                }, function () {
                });
            } else if (newVal === 3) {
                $scope.mediaToggle('video');
                openModal("確定要儲存到網站?").then(function () {
                    $scope.save2local(false, $scope.video.id);
                }, function () {
                });
            } else if (newVal === 4) {
                $scope.subscription($scope.video.list[$scope.video.index].cid, $scope.video.list[$scope.video.index].ctitle, 'video');
            }
            $scope.video.option = 0;
        }
    }, true);
    $scope.$watch("this.video.hd", function(newVal, oldVal) {
        var hd = 0;
        if ($scope.video.hd < $scope.video.hd_list.length) {
            hd = $scope.video.hd;
        } else {
            hd = $scope.video.hd_list.length - 1;
        }
        if (hd >= 0) {
            videoStart = video.currentTime;
            $scope.video.src = $scope.video.hd_list[hd];
        }
    }, true);
    $scope.numberDoc = function() {
        if (this.doc.iframeOffset) {
            for (var i in this.doc.iframeOffset) {
                if (this.doc.win.pageYOffset < this.doc.iframeOffset[i]) {
                    this.doc.showId = this.doc.presentId = i;
                    break;
                }
            }
        }
    }
    $scope.setDoc = function(iframeWindow, iframeOffset, textNode) {
        this.doc.win = typeof iframeWindow !== 'undefined' ? iframeWindow : this.doc.win;
        this.doc.iframeOffset = typeof iframeOffset !== 'undefined' ? iframeOffset : this.doc.iframeOffset;
        if (this.doc.win) {
            this.doc.win.scrollTo(0, this.doc.iframeOffset[this.doc.presentId-1]);
        }
        if (this.doc.iframeOffset) {
            this.doc.maxId = this.doc.iframeOffset.length-1;
        }
    }
    $scope.mediaToggle = function(type, open) {
        switch (type) {
            case 'image':
            case 'video':
            case 'music':
            case 'doc':
            case 'present':
            case 'torrent':
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
                } else if (type === 'doc' && this.doc.iframeOffset) {
                    this.mediaRecord(type, this.doc.showId);
                } else if (type === 'torrent') {
                    torrent.pause();
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
        var Info = $resource('/api/parent/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.dirEdit = result.isEdit;
                $scope.dirList = [];
                for (var i in result.parentList) {
                    $scope.dirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collapse: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
                }
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
    $scope.feedbackAdd2Parent = function(name) {
        if (isValidString(name, 'name') && isValidString($scope.feedbackSelectTag, 'name')) {
            var Info = $resource('/api/parent/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this.$parent;
            Info.addDir({ name: name, tag: $scope.feedbackSelectTag}, function (result) {
                if (result.id) {
                    this_obj.$broadcast('dir', JSON.stringify({id: result.id, name: result.name, parent: name}));
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
        } else {
            addAlert('add parent is not valid!!');
        }
        return false;
    }
}]);
