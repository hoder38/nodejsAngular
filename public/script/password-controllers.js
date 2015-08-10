function PasswordCntl($route, $routeParams, $location, $resource, $window, $cookies, $filter, $scope) {
    //left
    $scope.$parent.currentPage = 3;
    $scope.$parent.collapse.nav = true;
    //right
    $scope.$parent.isRight = true;
    $scope.bookmarkCollapse = false;
    $scope.bookmarkEdit = false;
    $scope.passwordDirList = [];
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
    $scope.relativeList = [];
    $scope.searchBlur = false;
    $scope.multiSearch = false;
    $scope.showPassword = false;
    $scope.showPasswordFocus = false;
    $scope.showClearPassword = false;
    $scope.toolList = {details: false, pw: false, url: false, email: false, del: false, dir: false, item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.dirLocation = 0;
    $scope.isRelative = false;
    //cookie initial
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/desc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};

    //password details
    $scope.userPW = '';
    $scope.userPWFocus = false;
    $scope.userName = '';
    $scope.userNameFocus = false;
    $scope.userUsername = '';
    $scope.userUsernameFocus = false;
    $scope.userPassword = '';
    $scope.userPasswordFocus = false;
    $scope.userConPassword = '';
    $scope.userConPasswordFocus = false;
    $scope.userUrl = '';
    $scope.userUrlFocus = false;
    $scope.userEmail = '';
    $scope.userEmailFocus = false;
    $scope.userImportant = false;
    $scope.edit = false;
    $scope.copyUsernameFocus = false;
    $scope.copyPasswordFocus = false;
    $scope.copyPrePasswordFocus = false;
    $scope.copyUrlFocus = false;
    $scope.copyEmailFocus = false;
    $scope.openPassword = false;
    $scope.showUserPassword = false;
    $scope.openPrePassword = false;
    $scope.showUserPrePassword = false;
    $scope.dbImportant = false;
    $scope.isNew = false;
    $scope.details = false;
    $scope.detailsId = false;
    $scope.showUsername = false;

    //websocket
    /*$scope.$on('password', function(e, d) {
        var id = JSON.parse(d);
        var index = arrayObjectIndexOf($scope.itemList, id, 'id');
        var storageApi = $resource('/api/stock/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
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
    });*/

    //taglist
    $scope.init = function(){
        getPasswordParentlist();
        this.page = 0;
        this.more = true;
        if ($cookies.passwordSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            }
        } else if ($cookies.passwordSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            }
        }
        if ($cookies.bookmarkPasswordSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkPasswordSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkPasswordSortType === 'desc') {
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

    getItemlist = function (this_obj, name, index, isExactly) {
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
            if (this_obj.multiSearch) {
                Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'password': { method:'GET' }
                });
            } else {
                Info = $resource('/api/password/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'password': { method:'GET' }
                });
            }
        } else if (name && !index) {
            if (isValidString(name, 'name')) {
                if (this_obj.multiSearch) {
                    Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'password': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/password/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'password': { method:'GET' }
                    });
                }
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if (isValidString(name, 'name') && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'password': { method:'GET' }
                });
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        }
        this_obj.moreDisabled = true;
        Info.password({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj.page === 0) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
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

    getBookmarklist = function() {
        var bookmarkapi = $resource('/api/bookmark/password/getlist/' + $scope.bookmarkSort.sort, {}, {
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

    getPasswordParentlist = function() {
        Info = $resource('/api/parent/password/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.stockDirList = [];
                for (var i in result.parentList) {
                    $scope.passwordDirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collapse: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
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

    $scope.submitText = function() {
        if (!this.inputText) {
            return false;
        }
        var this_obj = this;
        this.page = 0;
        this.more = true;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.resetStorage = function() {
        var this_obj = this;
        this.page = 0;
        $scope.more = true;
        $scope.moreDisabled = true;
        Info = $resource('/api/password/reset', {}, {
            'password': { method:'GET' }
        });
        Info.password({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
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

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
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
            getRelativeTag(tempList);
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getRelativeTag = function(oldList) {
        if ($scope.isRelative) {
            for (var i in $scope.tagList) {
                if (oldList.indexOf($scope.tagList[i]) === -1) {
                    var Info = $resource('/api/password/getRelativeTag/' + $scope.tagList[i], {}, {
                        'relativeTag': { method:'GET' }
                    });
                    Info.relativeTag({}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            for (var j in result.relative) {
                                if ($scope.relativeList.indexOf(result.relative[j]) === -1 && $scope.tagList.indexOf(result.relative[j]) === -1 && $scope.exceptList.indexOf(result.relative[j]) === -1 && $scope.isRelative) {
                                    $scope.relativeList.push(result.relative[j]);
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
            }
        }
    }

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.details = false;
        } else {
            this.$parent.toolList.dir = false;
            this.$parent.toolList.details = true;
        }
        this.toggleDropdown($event, 'item');
        this.$parent.toolList.item = item;
    }

    $scope.toggleDropdown = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown[type] = true;
    };

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.showPassword = false;
            this.userPassword = '';
            this.showUsername = false;
            this.tagNew = true;
            this.tagNewFocus = true;
            var oldList = [];
            if (this.isRelative) {
                oldList = this.tagList;
            }
            this.isRelative = true;
            getRelativeTag(oldList);
        }
        return false;
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

    $scope.submitTag = function() {
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                if (this.selectList.length > 0) {
                    var this_obj = this;
                    for (var i in this.selectList) {
                        var Info = $resource('/api/stock/addTag/' + this.selectList[i].id, {}, {
                            'addTag': { method:'PUT' }
                        });
                        Info.addTag({tag: this.newTagName}, function (result) {
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

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, 0, true);
    }

    $scope.addTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var this_obj = this;
                for (var i in this.selectList) {
                    var Info = $resource('/api/password/addTag/' + this.selectList[i].id, {}, {
                        'addTag': { method:'PUT' }
                    });
                    Info.addTag({tag: tag}, function (result) {
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
                }
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            var this_itemList = this.itemList;
            if (this.selectList.length > 0) {
                for (var i in this.selectList) {
                    var Info = $resource('/api/password/delTag/' + this.selectList[i].id, {}, {
                        'delTag': { method:'PUT' }
                    });
                    Info.delTag({tag: tag}, function (result) {
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
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, index+1);
    }

    $scope.add2Parent = function(item) {
        if (typeof this.toolList.item === 'string') {
            var Info = $resource('/api/parent/password/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                if (result.id) {
                    for (var i in this_obj.passwordDirList) {
                        if (this_obj.passwordDirList[i].name === item.name) {
                            this_obj.passwordDirList[i].list.push({name: result.name, id: result.id});
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

    $scope.showTaglist = function(item) {
        item.collapse = !item.collapse;
        if (item.list.length === 0) {
            if ($cookies['dirPassword' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dirPassword' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dirPassword' + item.name + 'SortType'] === 'desc') {
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

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/password/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
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

    $scope.dirItemlist = function(id) {
        var this_obj = this.$parent.$parent;
        if (this_obj.multiSearch) {
            var parentApi = $resource('/api/parent/password/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/password/query/' + id + '/single', {}, {
                'query': { method:'get' }
            });
        }
        this_obj.page = 0;
        this_obj.more = true;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
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
            this_obj.$parent.collapse.password = true;
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

    $scope.moreDirtaglist = function(item) {
        getTaglist(this, item);
    }

    $scope.del2Parent = function(id, dir) {
        var this_obj = this;
        var Info = $resource('/api/parent/password/del/' + id, {}, {
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
            var bookmarkapi = $resource('/api/bookmark/password/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
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

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/password/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        this.$parent.moreDisabled = true;
        this.$parent.more = true;
        bookmarkapi.getbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                } else {
                    this_obj.$parent.more = false;
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
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.delBookmark = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/password/del/' + id, {}, {
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

    $scope.changeSort = function(sort, name) {
        if (this[sort]) {
            if (name === 'name') {
                this[sort].sort = 'name/';
                if (this[sort].name === 'desc') {
                    this[sort].name = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].name = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].mtime = '';
                this[sort].count = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === 'desc') {
                    this[sort].mtime = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].mtime = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].count = '';
            } else if (name === 'count') {
                this[sort].sort = 'count/';
                if (this[sort].count === 'desc') {
                    this[sort].count = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].count = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].mtime = '';
            }
            if (sort === 'fileSort') {
                this.page = 0;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            }
        }
    }

    /*document.getElementById('testcopy').addEventListener('copy', function(e){
        e.clipboardData.setData('text/plain', 'Hello, world!');
        e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
    });*/

    //password
    $scope.sendForm = function() {
        if (this.isNew) {
            this.newRow();
        } else if (this.edit) {
            this.editRow();
        } else {
            this.isNew = false;
            this.edit = false;
            this.details = false;
        }
    }

    $scope.editRow = function() {
        var this_obj = this;
        var passwordapi = $resource('/api/password/editRow/' + this.detailsId, {}, {
            'editRow': { method:'PUT' }
        });
        if (!this.detailsId) {
            addAlert('select row first!!!');
        } else if (!isValidString(this.userName, 'name')) {
            addAlert('name not vaild!!!');
        } else if (!isValidString(this.userUsername, 'name')) {
            addAlert('username not vaild!!!');
        } else if (this.userPassword && (!isValidString(this.userPassword, 'passwd') || !isValidString(this.userConPassword, 'passwd'))) {
            addAlert('password not vaild!!!');
        } else if (this.userPassword && (this.userPassword !== this.userConPassword)) {
            addAlert('password is not equal!!!');
        } else if (this.userUrl && !isValidString(this.userUrl, 'url')) {
            addAlert('url is not vaild!!!');
        } else if (this.userEmail && !isValidString(this.userEmail, 'email')) {
            addAlert('email is not vaild!!!');
        } else {
            passwordapi.editRow({name: this.userName, username: this.userUsername, password: this.userPassword, conpassword: this.userConPassword, url: this.userUrl, email: this.userEmail, important: this.userImportant}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    console.log(result);
                    this_obj.isNew = false;
                    this_obj.edit = false;
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

    $scope.newRow = function() {
        var this_obj = this;
        var passwordapi = $resource('/api/password/newRow', {}, {
            'newRow': { method:'POST' }
        });
        if (!isValidString(this.userName, 'name')) {
            addAlert('name not vaild!!!');
        } else if (!isValidString(this.userUsername, 'name')) {
            addAlert('username not vaild!!!');
        } else if (!isValidString(this.userPassword, 'passwd') || !isValidString(this.userConPassword, 'passwd')) {
            addAlert('password not vaild!!!');
        } else if (this.userPassword !== this.userConPassword) {
            addAlert('password is not equal!!!');
        } else if (this.userUrl && !isValidString(this.userUrl, 'url')) {
            addAlert('url is not vaild!!!');
        } else if (this.userEmail && !isValidString(this.userEmail, 'email')) {
            addAlert('email is not vaild!!!');
        } else {
            passwordapi.newRow({name: this.userName, username: this.userUsername, password: this.userPassword, conpassword: this.userConPassword, url: this.userUrl, email: this.userEmail, important: this.userImportant}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    console.log(result);
                    this_obj.isNew = false;
                    this_obj.edit = false;
                    this_obj.details = false;
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

    $scope.getPassword = function(id) {
        var this_obj = this.$parent.$parent;
        var passwordapi = $resource('/api/password/getPW/' + id, {}, {
            'getPW': { method:'GET' }
        });
        passwordapi.getPW({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.userPassword = result.password;
                this_obj.showUsername = false;
                this_obj.showPassword = true;
                this_obj.showPasswordFocus = true;
                this_obj.showClearPassword = false;
                delete result;
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

    $scope.getUsername = function(item) {
        this.$parent.$parent.userUsername = item.username;
        this.$parent.$parent.showPassword = false;
        this.$parent.$parent.userPassword = '';
        this.$parent.$parent.showUsername = true;
        this.$parent.$parent.showUsernameFocus = true;
    }

    $scope.getDetails = function() {
        this.detailsId = this.toolList.item.id;
        this.userName = this.toolList.item.name;
        this.userUsername = this.toolList.item.username;
        this.userEmail = this.toolList.item.email;
        this.userUrl = decodeURIComponent(this.toolList.item.url);
        this.details = true;
        this.edit = false;
        this.isNew = false;
    }

    $scope.openNewrow = function() {
        this.detailsId = '';
        this.userName = '';
        this.userUsername = '';
        this.userEmail = '';
        this.userUrl = '';
        this.isNew = true;
        this.edit = true;
        this.details = true;
        this.userNameFocus = true;
    }

    $scope.gotoUrl = function() {
        var url = this.userUrl;
        if (!isValidString(url, 'url')) {
            addAlert('url is not vaild!!!');
        } else {
            $window.open(decodeURIComponent(url));
        }
    }

    $scope.gotoEmail = function() {
        var email = this.userEmail;
        if (!isValidString(email, 'email')) {
            addAlert('email is not vaild!!!');
        } else {
            if (email.match(/@gmail\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://mail.google.com/');
            } else if (email.match(/@yahoo\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://login.yahoo.com/config/mail?');
            } else if (email.match(/@(hotmail|msn|live)\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://www.live.com/');
            } else {
                addAlert('目前沒有此email類型請自行前往');
            }
        }
    }

    $scope.delPassword = function(id) {
        var this_obj = this;
        var passwordapi = $resource('/api/password/delRow/' + id, {}, {
            'delRow': { method:'PUT' }
        });
        passwordapi.delRow({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                console.log(result);
                this_obj.isNew = false;
                this_obj.edit = false;
                this_obj.details = false;
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