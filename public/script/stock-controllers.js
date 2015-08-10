function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function StockCntl($route, $routeParams, $resource, $window, $cookies, $filter, $scope, $location) {
    //left
    $scope.$parent.currentPage = 2;
    $scope.$parent.collapse.nav = true;
    //right
    $scope.$parent.isRight = true;
    $scope.bookmarkCollpase = false;
    $scope.bookmarkEdit = false;
    $scope.stockDirList = [];
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
    $scope.parseIndex = false;
    $scope.parseIndexFocus = false;
    $scope.toolList = {per: false, yield: false,dir: false, item: null};
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
    $scope.relativeList = [];
    //cookie initial
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/desc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};

    //stock
    Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= addCommas(value) %>";
    Chart.defaults.global.animation = false;
    $scope.stockName = '';
    $scope.assetLabels = [];
    $scope.assetData = [];
    $scope.assetCompareLabels = [];
    $scope.assetCompareData = [];
    $scope.assetCompare = false;
    $scope.assetTotalCommas = '0';
    $scope.salesLabels = [];
    $scope.salesData = [];
    $scope.salesTotal = 0;
    $scope.salesTotalCommas = '0';
    $scope.eps = 0;
    $scope.cashSumLabels = [];
    $scope.cashSumData = [];
    $scope.cashSumSeries = [];
    $scope.cashLabels = [];
    $scope.cashData = [];
    $scope.cashSeries = [];
    $scope.cashRatioLabels = [];
    $scope.cashRatioData = [];
    $scope.cashRatioSeries = [['investPerProperty'], ['financePerLiabilities']];
    $scope.isParse = false;
    $scope.parseYear = [];
    $scope.parseQuarter = [{name: 'One', value: 1}, {name: 'Two', value: 2}, {name: 'Three', value: 3}, {name: 'Four', value: 4}];
    $scope.parseCashMode = [{name: 'R,D,O,I', value: 1}, {name: 'R+D,O,I', value: 2}, {name: 'R,D,O+I', value: 3}, {name: 'R+D,O+I', value: 4}];
    $scope.parseResult = {};
    $scope.accumulate = false;
    $scope.comprehensive = true;
    $scope.safetyLabels = [];
    $scope.safetyData = [[], [], []];
    $scope.safetySeries = ['prMinusProfit', 'prRatio', 'shortCash'];
    $scope.parseSafetyMode = [{name: 'CL&Invest', value: 1}, {name: 'Invest', value: 2}, {name: 'CL', value: 3}];
    $scope.profitLabels = [];
    $scope.profitData = [[], [], []];
    $scope.profitSeries = ['Gross', 'Operating', 'Profit'];
    $scope.profitTrioLabels = [];
    $scope.profitTrioData = [[], [], []];
    $scope.profitTrioSeries = ['leverage', 'turnover', 'Profit'];
    $scope.profitROELabels = [];
    $scope.profitROEData = [[], [], []];
    $scope.profitROESeries = ['ROE', 'Asset Growth', 'Profit'];
    $scope.profitSalesLabels = [];
    $scope.profitSalesData = [[], []];
    $scope.profitSalesSeries = ['salesPerShare', 'sales'];
    $scope.parseProfitMode = [{name: 'Profit', value: 1}, {name: 'Operating', value: 2}, {name: 'O+I', value: 3}, {name: 'Real', value: 4}, {name: 'R+D', value: 5}];
    $scope.managementLabels = [];
    $scope.managementData = [];
    $scope.managementSeries = [];
    $scope.managementNumberLabels = [];
    $scope.managementNumberData = [];
    $scope.managementNumberSeries = [];
    $scope.relative = {profit: true, cash: true, inventories: true, receivable: true, payable: true};
    $scope.profitIndex = 0;
    $scope.safetyIndex = 0;
    $scope.managementIndex = 0;

    //websocket
    $scope.$on('stock', function(e, d) {
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
    });

    //taglist
    $scope.init = function(){
        getStockParentlist();
        this.page = 0;
        this.more = true;
        if ($cookies.stockSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            }
        } else if ($cookies.stockSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            }
        }
        if ($cookies.bookmarkStockSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkStockSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkStockSortType === 'desc') {
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
                Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'stock': { method:'GET' }
                });
            } else {
                Info = $resource('/api/stock/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                    'stock': { method:'GET' }
                });
            }
        } else if (name && !index) {
            if (name.match(/^>\d+$/) || name.match(/^profit>\d+$/) || name.match(/^safety>-?\d+$/) || name.match(/^manag>\d+$/) || isValidString(name, 'name')) {
                if (this_obj.multiSearch) {
                    Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'stock': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/stock/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'stock': { method:'GET' }
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
            if ((name.match(/^>\d+$/) || name.match(/^profit>\d+$/) || name.match(/^safety>-?\d+$/) || name.match(/^manag>\d+$/) || isValidString(name, 'name')) && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'stock': { method:'GET' }
                });
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        }
        this_obj.moreDisabled = true;
        Info.stock({}, function (result) {
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
        var bookmarkapi = $resource('/api/bookmark/stock/getlist/' + $scope.bookmarkSort.sort, {}, {
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

    getStockParentlist = function() {
        Info = $resource('/api/parent/stock/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.stockDirList = [];
                for (var i in result.parentList) {
                    $scope.stockDirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collpase: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
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
        Info = $resource('/api/stock/reset', {}, {
            'stock': { method:'GET' }
        });
        Info.stock({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
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

    $scope.openChart = function() {
        if (this.isParse) {
            this.$parent.isRight = !this.$parent.isRight;
        } else {
            if (this.$parent.isRight) {
                addAlert('select stock index first!!!');
            } else {
                this.$parent.isRight = true;
            }
        }
    }

    /*$scope.openParseIndex = function() {
        this.inputIndex = '';
        this.parseIndex = true;
        this.parseIndexFocus = true;
        return false;
    }*/

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
                    var Info = $resource('/api/stock/getRelativeTag/' + $scope.tagList[i], {}, {
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
            this.$parent.toolList.per = false;
            this.$parent.toolList.yield = false;
        } else {
            this.$parent.toolList.dir = false;
            this.$parent.toolList.per = true;
            this.$parent.toolList.yield = true;
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

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            var this_itemList = this.itemList;
            if (this.selectList.length > 0) {
                for (var i in this.selectList) {
                    var Info = $resource('/api/stock/delTag/' + this.selectList[i].id, {}, {
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
            var Info = $resource('/api/parent/stock/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                if (result.id) {
                    for (var i in this_obj.stockDirList) {
                        if (this_obj.stockDirList[i].name === item.name) {
                            this_obj.stockDirList[i].list.push({name: result.name, id: result.id});
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
        item.collpase = !item.collpase;
        if (item.list.length === 0) {
            if ($cookies['dirStock' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dirStock' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dirStock' + item.name + 'SortType'] === 'desc') {
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
            var Info = $resource('/api/parent/stock/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
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
            var parentApi = $resource('/api/parent/stock/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/stock/query/' + id + '/single', {}, {
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
            this_obj.$parent.collapse.stock = true;
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
        var Info = $resource('/api/parent/stock/del/' + id, {}, {
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
            var bookmarkapi = $resource('/api/bookmark/stock/add', {}, {
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
        var bookmarkapi = $resource('/api/bookmark/stock/get/' + id, {}, {
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
        var bookmarkapi = $resource('/api/bookmark/stock/del/' + id, {}, {
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

    //stock
    caculateDate = function(data, year, quarter, is_start) {
        if (!quarter) {
            if (is_start) {
                quarter = data.earliestQuarter;
            } else {
                quarter = data.latestQuarter;
            }
        }
        if (!year) {
            if (is_start) {
                year = data.earliestYear;
            } else {
                year = data.latestYear;
            }
        }
        if (year > data.latestYear) {
            year = data.latestYear;
        } else if (year < data.earliestYear) {
            year = data.earliestYear;
        }
        if (quarter > 4) {
            quarter = 4;
        } else if (quarter < 1) {
            quarter = 1;
        }
        if (year === data.latestYear && quarter > data.latestQuarter) {
            quarter = data.latestQuarter;
        } else if (year === data.earliestYear && quarter < data.earliestQuarter) {
            quarter = data.earliestQuarter;
        }
        return {year: year, quarter: quarter};
    }
    $scope.drawAsset = function(startYear, startQuarter, endYear, endQuarter) {
        var assetStartDate = caculateDate(this.parseResult, startYear, startQuarter);
        var assetEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (assetStartDate.year > assetEndDate.year) {
            assetStartDate.year = assetEndDate.year;
        }
        assetStartDate = caculateDate(this.parseResult, assetStartDate.year, assetStartDate.quarter);
        if (assetStartDate.year === assetEndDate.year && assetStartDate.quarter > assetEndDate.quarter) {
            assetStartDate.quarter = assetEndDate.quarter;
        }
        if (!this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1] || !this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1] ) {
            addAlert('no this date data!!!');
            return false;
        }
        this.assetLabels = [];
        this.assetData = [];
        this.assetCompareLabels = [];
        this.assetCompareData = [];
        this.assetCompare = false;
        this.assetTotalCommas = '0';
        var diff = 0;
        var diff_percent = 0;
        var total_diff = 0;
        if (assetStartDate.year !== assetEndDate.year || assetStartDate.quarter !== assetEndDate.quarter) {
            this.assetCompare = true;
        }
        if (!this.assetCompare) {
            for(var i in this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1]) {
                if (i !== 'total') {
                    this.assetLabels.push(i + ':' + this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] + '%');
                    this.assetData.push(Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100));
                }
            }
        } else {
            total_diff = this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total;
            if (total_diff < 0) {
                this.assetLabels.push('total_diff');
                this.assetData.push(total_diff);
                this.assetCompareLabels.push('total_diff');
                this.assetCompareData.push(total_diff);
            }
            for(var i in this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1]) {
                if (i !== 'total') {
                    diff = Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100 - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1][i] * this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total / 100);
                    if (diff > 0) {
                        diff_percent = Math.ceil(diff / Math.abs(total_diff) * 1000) / 10;
                        if (i === 'receivable' || i === 'cash' || i === 'OCFA' || i === 'inventories' || i === 'property' || i === 'longterm' || i === 'other') {
                            this.assetLabels.push(i + ':+' + diff_percent + '%');
                            this.assetData.push(diff);
                        } else {
                            this.assetCompareLabels.push(i + ':+' + diff_percent + '%');
                            this.assetCompareData.push(diff);
                        }
                    }
                }
            }
            for(var i in this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1]) {
                if (i !== 'total') {
                    diff = Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100 - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1][i] * this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total / 100);
                    if (diff < 0) {
                        diff_percent = Math.ceil(diff / Math.abs(total_diff) * 1000) / 10;
                        if (i === 'receivable' || i === 'cash' || i === 'OCFA' || i === 'inventories' || i === 'property' || i === 'longterm' || i === 'other') {
                            this.assetLabels.push(i + ':' + diff_percent + '%');
                            this.assetData.push(diff);
                        } else {
                            this.assetCompareLabels.push(i + ':' + diff_percent + '%');
                            this.assetCompareData.push(diff);
                        }
                    }
                }
            }
            if (total_diff > 0) {
                this.assetLabels.push('total_diff');
                this.assetData.push(total_diff);
                this.assetCompareLabels.push('total_diff');
                this.assetCompareData.push(total_diff);
            }
        }

        if (this.assetCompare) {
            var total_diff_percent = Math.ceil(total_diff/this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total * 1000) / 10;
            this.assetTotalCommas = addCommas(this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total);
            if (total_diff > 0) {
                this.assetTotalCommas = this.assetTotalCommas + ':+' + total_diff_percent + '%:+' + addCommas(total_diff);
            } else {
                this.assetTotalCommas = this.assetTotalCommas + ':' + total_diff_percent + '%:' + addCommas(total_diff);
            }
        } else {
            this.assetTotalCommas = addCommas(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total);
        }
        this.assetStartYear = assetStartDate.year;
        this.assetStartQuarter = assetStartDate.quarter;
        this.assetEndYear = assetEndDate.year;
        this.assetEndQuarter = assetEndDate.quarter;
    }
    $scope.drawSales = function(comprehensive, year, quarter) {
        var salesDate = caculateDate(this.parseResult, year, quarter);
        if (!this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            addAlert('no this date data!!!');
            return false;
        }
        this.salesLabels = [];
        this.salesData = [];
        this.salesTotal = 0;
        this.salesTotalCommas = '0';
        this.eps = 0;
        for(var i in this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            if (i === 'cost' || i === 'expenses') {
                this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
            } else if (i === 'nonoperating_without_FC' || (i === 'comprehensive' && comprehensive)) {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if (i === 'tax' || i === 'finance_cost') {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if ((i === 'profit_comprehensive' && comprehensive) || (i === 'profit' && !comprehensive)) {
                this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                } else if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            }
        }
        this.salesLabels.push('revenue');
        this.salesData.push(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue);
        for(var i in this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            if (i === 'nonoperating_without_FC' || (i === 'comprehensive' && comprehensive)) {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesTotal += Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100);
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if (i === 'tax' || i === 'finance_cost') {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesTotal -= Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100);
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            }
        }
        this.salesYear = salesDate.year;
        this.salesQuarter = salesDate.quarter;
        this.salesTotal += this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue;
        this.salesTotalCommas = addCommas(this.salesTotal);
        this.eps = this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].quarterEPS;
    }
    $scope.drawCash = function(mode, accumulate, startYear, startQuarter, endYear, endQuarter) {
        var cashStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var cashEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (cashStartDate.year > cashEndDate.year) {
            cashEndDate.year = cashStartDate.year;
        }
        if (cashStartDate.year === cashEndDate.year && cashStartDate.quarter > cashEndDate.quarter) {
            cashEndDate.quarter = cashStartDate.quarter;
        }
        this.cashLabels = [];
        this.cashSumLabels = [];
        this.cashRatioLabels = [];
        this.cashRatioData = [[], []];
        switch(mode) {
            case 2:
            this.cashSumData = [[], []];
            this.cashSumSeries = [['profitBT'], ['real+dividends']];
            this.cashData = [[], [], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation'], ['invest']];
            break;
            case 3:
            this.cashSumData = [[], [], []];
            this.cashSumSeries = [['profitBT'], ['real'], ['dividends']];
            this.cashData = [[], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation+invest']];
            break;
            case 4:
            this.cashSumData = [[], []];
            this.cashSumSeries = [['profitBT'], ['real+dividends']];
            this.cashData = [[], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation+invest']];
            break;
            case 1:
            default:
            mode = 1;
            this.cashSumData = [[], [], []];
            this.cashSumSeries = [['profitBT'], ['real'], ['dividends']];
            this.cashData = [[], [], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation'], ['invest']];
        }
        for(var i = cashStartDate.year; i<=cashEndDate.year; i++) {
            for (var j in this.parseResult.cashStatus[i]) {
                if (this.parseResult.cashStatus[i][j]) {
                    if ((i === cashStartDate.year && j < (cashStartDate.quarter-1)) || (i === cashEndDate.year && j > (cashEndDate.quarter-1))) {
                        continue;
                    }
                    this.cashLabels.push(i.toString() + (Number(j)+1));
                    this.cashSumLabels.push(i.toString() + (Number(j)+1));
                    this.cashRatioLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.cashStatus[i][j]) {
                        switch(k) {
                            case 'profitBT':
                            if (accumulate && this.cashSumData[0].length > 0) {
                                this.cashSumData[0].push(this.cashSumData[0][this.cashSumData[0].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashSumData[0].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'without_dividends':
                            if (accumulate && this.cashData[0].length > 0) {
                                this.cashData[0].push(this.cashData[0][this.cashData[0].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashData[0].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'minor':
                            if (accumulate && this.cashData[1].length > 0) {
                                this.cashData[1].push(this.cashData[1][this.cashData[1].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashData[1].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'real':
                            if (mode === 1 || mode === 3) {
                                if (accumulate && this.cashSumData[1].length > 0) {
                                    this.cashSumData[1].push(this.cashSumData[1][this.cashSumData[1].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashSumData[1].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'dividends':
                            if (mode === 1 || mode === 3) {
                                if (accumulate && this.cashSumData[2].length > 0) {
                                    this.cashSumData[2].push(this.cashSumData[2][this.cashSumData[2].length -1] - Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashSumData[2].push(-Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'operation':
                            if (mode === 1 || mode === 2) {
                                if (accumulate && this.cashData[2].length > 0) {
                                    this.cashData[2].push(this.cashData[2][this.cashData[2].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashData[2].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'invest':
                            if (mode === 1 || mode === 2) {
                                if (accumulate && this.cashData[3].length > 0) {
                                    this.cashData[3].push(this.cashData[3][this.cashData[3].length -1] - Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashData[3].push(-Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'investPerProperty':
                            this.cashRatioData[0].push(this.parseResult.cashStatus[i][j][k]);
                            break;
                            case 'financePerLiabilities':
                            this.cashRatioData[1].push(this.parseResult.cashStatus[i][j][k]);
                            break;
                        }
                    }
                    if (mode === 2 || mode === 4) {
                        if (accumulate && this.cashSumData[1].length > 0) {
                            this.cashSumData[1].push(this.cashSumData[1][this.cashSumData[1].length -1] + Math.ceil((this.parseResult.cashStatus[i][j].real - this.parseResult.cashStatus[i][j].dividends) * this.parseResult.cashStatus[i][j].end/100000000));
                        } else {
                            this.cashSumData[1].push(Math.ceil((this.parseResult.cashStatus[i][j].real - this.parseResult.cashStatus[i][j].dividends) * this.parseResult.cashStatus[i][j].end/100000000));
                        }
                    }
                    if (mode === 3 || mode === 4) {
                        if (accumulate && this.cashData[2].length > 0) {
                            this.cashData[2].push(this.cashData[2][this.cashData[2].length -1] + Math.ceil((this.parseResult.cashStatus[i][j].operation + this.parseResult.cashStatus[i][j].invest) * this.parseResult.cashStatus[i][j].end/100000000));
                        } else {
                            this.cashData[2].push(Math.ceil((this.parseResult.cashStatus[i][j].operation + this.parseResult.cashStatus[i][j].invest) * this.parseResult.cashStatus[i][j].end/100000000));
                        }
                    }
                }
            }
        }
        this.cashStartYear = cashStartDate.year;
        this.cashStartQuarter = cashStartDate.quarter;
        this.cashEndYear = cashEndDate.year;
        this.cashEndQuarter = cashEndDate.quarter;
        this.cashMode = mode;
    }
    $scope.drawSafety = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var safetyStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var safetyEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (safetyStartDate.year > safetyEndDate.year) {
            safetyEndDate.year = safetyStartDate.year;
        }
        if (safetyStartDate.year === safetyEndDate.year && safetyStartDate.quarter > safetyEndDate.quarter) {
            safetyEndDate.quarter = safetyStartDate.quarter;
        }
        this.safetyLabels = [];
        this.safetyData = [[], [], []];
        for(var i = safetyStartDate.year; i<=safetyEndDate.year; i++) {
            for (var j in this.parseResult.safetyStatus[i]) {
                if (this.parseResult.safetyStatus[i][j]) {
                    if ((i === safetyStartDate.year && j < (safetyStartDate.quarter-1)) || (i === safetyEndDate.year && j > (safetyEndDate.quarter-1))) {
                        continue;
                    }
                    this.safetyLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.safetyStatus[i][j]) {
                        switch(k) {
                            case 'prMinusProfit':
                            this.safetyData[0].push(this.parseResult.safetyStatus[i][j][k]);
                            break;
                            case 'prRatio':
                            this.safetyData[1].push(this.parseResult.safetyStatus[i][j][k]);
                            break;
                            case 'shortCash':
                            if (mode === 1) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                            case 'shortCashWithoutCL':
                            if (mode === 2) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                            case 'shortCashWithoutInvest':
                            if (mode === 3) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.safetyStartYear = safetyStartDate.year;
        this.safetyStartQuarter = safetyStartDate.quarter;
        this.safetyEndYear = safetyEndDate.year;
        this.safetyEndQuarter = safetyEndDate.quarter;
        this.safetyMode = mode;
    }
    $scope.drawProfit = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var profitStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var profitEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (profitStartDate.year > profitEndDate.year) {
            profitEndDate.year = profitStartDate.year;
        }
        if (profitStartDate.year === profitEndDate.year && profitStartDate.quarter > profitEndDate.quarter) {
            profitEndDate.quarter = profitStartDate.quarter;
        }
        this.profitLabels = [];
        this.profitData = [[], [], []];
        this.profitTrioLabels = [];
        this.profitTrioData = [[], [], []];
        this.profitROELabels = [];
        this.profitROEData = [[], [], []];
        this.profitSalesLabels = [];
        this.profitSalesData = [[], []];
        for(var i = profitStartDate.year; i<=profitEndDate.year; i++) {
            for (var j in this.parseResult.profitStatus[i]) {
                if (this.parseResult.profitStatus[i][j]) {
                    if ((i === profitStartDate.year && j < (profitStartDate.quarter-1)) || (i === profitEndDate.year && j > (profitEndDate.quarter-1))) {
                        continue;
                    }
                    this.profitLabels.push(i.toString() + (Number(j)+1));
                    this.profitTrioLabels.push(i.toString() + (Number(j)+1));
                    this.profitROELabels.push(i.toString() + (Number(j)+1));
                    this.profitSalesLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.profitStatus[i][j]) {
                        switch(k) {
                            case 'gross_profit':
                            this.profitData[0].push(this.parseResult.profitStatus[i][j][k]);
                            break;
                            case 'operating_profit':
                            this.profitData[1].push(this.parseResult.profitStatus[i][j][k]);
                            break;
                            case 'profit':
                            if (mode === 1) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'leverage':
                            this.profitTrioData[0].push(Math.ceil(this.parseResult.profitStatus[i][j][k]*1000)/10);
                            break;
                            case 'turnover':
                            this.profitTrioData[1].push(Math.ceil(this.parseResult.profitStatus[i][j][k]*1000)/10);
                            break;
                            case 'roe':
                            if (mode === 1) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'asset_growth':
                            if (mode === 1) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'salesPerShare':
                            this.profitSalesData[0].push(Math.ceil(this.parseResult.profitStatus[i][j][k]/1000000));
                            break;
                            case 'quarterSales':
                            this.profitSalesData[1].push(Math.ceil(this.parseResult.profitStatus[i][j][k]/1000000));
                            break;
                            case 'operationRoe':
                            if (mode === 2) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'operationAG':
                            if (mode === 2) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'operatingP':
                            if (mode === 2) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiRoe':
                            if (mode === 3) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiAG':
                            if (mode === 3) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiP':
                            if (mode === 3) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realRoe':
                            if (mode === 4) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realAG':
                            if (mode === 4) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realP':
                            if (mode === 4) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realRoe_dividends':
                            if (mode === 5) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realAG_dividends':
                            if (mode === 5) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realP_dividends':
                            if (mode === 5) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.profitStartYear = profitStartDate.year;
        this.profitStartQuarter = profitStartDate.quarter;
        this.profitEndYear = profitEndDate.year;
        this.profitEndQuarter = profitEndDate.quarter;
        this.profitMode = mode;
    }
    $scope.drawManagement = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var managementStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var managementEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (managementStartDate.year > managementEndDate.year) {
            managementEndDate.year = managementStartDate.year;
        }
        if (managementStartDate.year === managementEndDate.year && managementStartDate.quarter > managementEndDate.quarter) {
            managementEndDate.quarter = managementStartDate.quarter;
        }
        this.managementLabels = [];
        this.managementData = [];
        this.managementSeries = [];
        this.managementNumberLabels = [];
        this.managementNumberData = [];
        this.managementNumberSeries = [];
        for (var i in mode) {
            if (mode[i]) {
                this.managementSeries.push(i);
                this.managementData.push([]);
                this.managementNumberSeries.push(i);
                this.managementNumberData.push([]);
            }
        }
        this.managementNumberSeries.push('revenue');
        this.managementNumberData.push([]);
        var index = -1;
        for(var i = managementStartDate.year; i<=managementEndDate.year; i++) {
            for (var j in this.parseResult.managementStatus[i]) {
                if (this.parseResult.managementStatus[i][j]) {
                    if ((i === managementStartDate.year && j < (managementStartDate.quarter-1)) || (i === managementEndDate.year && j > (managementEndDate.quarter-1))) {
                        continue;
                    }
                    this.managementLabels.push(i.toString() + (Number(j)+1));
                    this.managementNumberLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.managementStatus[i][j]) {
                        switch(k) {
                            case 'profitRelative':
                            index = this.managementSeries.indexOf('profit');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'cashRelative':
                            index = this.managementSeries.indexOf('cash');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'inventoriesRelative':
                            index = this.managementSeries.indexOf('inventories');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'receivableRelative':
                            index = this.managementSeries.indexOf('receivable');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'payableRelative':
                            index = this.managementSeries.indexOf('payable');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'profit':
                            index = this.managementNumberSeries.indexOf('profit');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'cash':
                            index = this.managementNumberSeries.indexOf('cash');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'inventories':
                            index = this.managementNumberSeries.indexOf('inventories');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'receivable':
                            index = this.managementNumberSeries.indexOf('receivable');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'payable':
                            index = this.managementNumberSeries.indexOf('payable');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'revenue':
                            index = this.managementNumberSeries.indexOf('revenue');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                        }
                    }
                }
            }
        }

        this.managementStartYear = managementStartDate.year;
        this.managementStartQuarter = managementStartDate.quarter;
        this.managementEndYear = managementEndDate.year;
        this.managementEndQuarter = managementEndDate.quarter;
    }
    $scope.submitIndex = function(item) {
        item = typeof item !== 'undefined' ? item : null;
        var this_obj = this;
        if (!item && !this.inputIndex) {
            addAlert('Please input index or select item!!!');
            return false;
        } else {
            if (item) {
                this_obj = this.$parent.$parent;
            }
        }
        var stockApi = null;
        if (item) {
            stockApi = $resource('/api/stock/querySimple/' + item.id, {}, {
                'query': { method:'get' }
            });
        } else {
            if (isNaN(this_obj.inputIndex)) {
                addAlert('Please input index!!!');
                return false;
            }
            stockApi = $resource('/api/stock/query/' + Number(this_obj.inputIndex), {}, {
                'query': { method:'get' }
            });
            this_obj.parseIndex = false;
        }
        stockApi.query({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (!result) {
                    addAlert('empty stock parse!!!');
                    return false;
                }
                this_obj.parseResult = {};
                this_obj.parseYear = [];
                this_obj.accumulate = false;
                this_obj.comprehensive = true;
                this_obj.relative = {profit: true, cash: true, inventories: true, receivable: true, payable: true};
                console.log(result);
                if ($scope.bookmarkID) {
                    $scope.latest = item.id;
                }
                this_obj.parseResult.assetStatus = result.assetStatus;
                this_obj.parseResult.salesStatus = result.salesStatus;
                this_obj.parseResult.cashStatus = result.cashStatus;
                this_obj.parseResult.safetyStatus = result.safetyStatus;
                this_obj.parseResult.profitStatus = result.profitStatus;
                this_obj.parseResult.managementStatus = result.managementStatus;
                this_obj.parseResult.latestYear = result.latestYear;
                this_obj.parseResult.latestQuarter = result.latestQuarter;
                this_obj.parseResult.earliestYear = result.earliestYear;
                this_obj.parseResult.earliestQuarter = result.earliestQuarter;
                this_obj.profitIndex = result.profitIndex;
                this_obj.safetyIndex = result.safetyIndex;
                this_obj.managementIndex = result.managementIndex;
                this_obj.stockName = result.stockName;
                for (var i = this_obj.parseResult.earliestYear; i <= this_obj.parseResult.latestYear; i++) {
                    this_obj.parseYear.push({name: i, value: i});
                }
                this_obj.isParse = true;
                this_obj.$parent.isRight = false;
                //assetStatus
                this_obj.drawAsset();
                //salesStatus
                this_obj.drawSales(this_obj.comprehensive);
                //cashStatus
                this_obj.drawCash(4, this_obj.accumulate);
                this_obj.drawSafety(1);
                this_obj.drawProfit(1);
                this_obj.drawManagement(this_obj.relative);
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
    $scope.stockPer = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var stockApi = $resource('/api/stock/getPER/' + this.toolList.item.id, {}, {
                'getPER': { method:'get' }
            });
            stockApi.getPER({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.inputIndex = result.per;
                    this_obj.parseIndex = true;
                    this_obj.parseIndexFocus = true;
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
            addAlert('select a stock!!!');
        }
    }
    $scope.stockYield = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var stockApi = $resource('/api/stock/getYield/' + this.toolList.item.id, {}, {
                'getYield': { method:'get' }
            });
            stockApi.getYield({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.inputIndex = result.yield;
                    this_obj.parseIndex = true;
                    this_obj.parseIndexFocus = true;
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
            addAlert('select a stock!!!');
        }
    }
}