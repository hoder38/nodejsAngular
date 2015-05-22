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
function StockCntl($route, $routeParams, $location, $resource, $scope, $location) {
    Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= addCommas(value) %>";
    $scope.$parent.currentPage = 2;
    $scope.$parent.collapse.nav = true;
    $scope.stockIndex = '';
    $scope.assetLabels = [];
    $scope.assetData = [];
    $scope.salesLabels = [];
    $scope.salesData = [];
    $scope.cashLabels = [];
    $scope.cashData = [[], [], [], [], [], [], []];
    $scope.cashSeries = ['profitBT', 'real', 'dividends', 'operation', 'invest', 'without_dividends', 'minor'];
    $scope.isParse = false;
    $scope.init = function(){
        /*var stockApi = $resource('/api/stock/init', {}, {
            'init': { method:'get' }
        });
        stockApi.init({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                console.log(result);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });*/
    }
    $scope.submitIndex = function() {
        var this_obj = this;
        if (!this.inputIndex) {
            return false;
        }
        this.assetLabels = [];
        this.assetData = [];
        this.salesLabels = [];
        this.salesData = [];
        this.cashData = [[], [], [], [], [], [], []];
        this.cashLabels = [];
        this.isParse = false;
        var stockApi = $resource('/api/stock/query/' + Number(this.inputIndex), {}, {
            'query': { method:'get' }
        });
        this.stockIndex = this.inputIndex;
        this.inputIndex = '';
        stockApi.query({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                console.log(result);
                this_obj.isParse = true;
                //assetStatus
                for(var i in result.assetStatus[result.latestYear][result.latestQuarter-1]) {
                    if (i !== 'total') {
                        this_obj.assetLabels.push(i + ':' + result.assetStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                        if (result.assetStatus[result.latestYear][result.latestQuarter-1][i] !== 0) {
                            this_obj.assetData.push(Math.ceil(result.assetStatus[result.latestYear][result.latestQuarter-1][i] * result.assetStatus[result.latestYear][result.latestQuarter-1].total / 100));
                        }
                    }
                }
                //salesStatus
                for(var i in result.salesStatus[result.latestYear][result.latestQuarter-1]) {
                    if (i === 'cost' || i === 'expenses' || i === 'finance_cost') {
                        this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] !== 0) {
                            this_obj.salesData.push(Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    } else if (i === 'nonoperating_without_FC' || i === 'comprehensive') {
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] < 0) {
                            this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                            this_obj.salesData.push(-Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    } else if (i === 'tax') {
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] > 0) {
                            this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                            this_obj.salesData.push(Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    } else if (i === 'profit_comprehensive') {
                        this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] > 0) {
                            this_obj.salesData.push(-Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        } else if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] < 0) {
                            this_obj.salesData.push(Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    }
                }
                this_obj.salesLabels.push('revenue');
                this_obj.salesData.push(result.salesStatus[result.latestYear][result.latestQuarter-1].revenue);
                for(var i in result.salesStatus[result.latestYear][result.latestQuarter-1]) {
                    if (i === 'nonoperating_without_FC' || i === 'comprehensive') {
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] > 0) {
                            this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                            this_obj.salesData.push(Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    } else if (i === 'tax') {
                        if (result.salesStatus[result.latestYear][result.latestQuarter-1][i] < 0) {
                            this_obj.salesLabels.push(i + ':' + result.salesStatus[result.latestYear][result.latestQuarter-1][i] + '%');
                            this_obj.salesData.push(-Math.ceil(result.salesStatus[result.latestYear][result.latestQuarter-1][i] * result.salesStatus[result.latestYear][result.latestQuarter-1].revenue / 100));
                        }
                    }
                }
                //cashStatus
                var cashIndex = -1;
                for(var i in result.cashStatus) {
                    for (var j in result.cashStatus[i]) {
                        if (result.cashStatus[i][j] && j < 4) {
                            this_obj.cashLabels.push(i.toString() + (Number(j)+1));
                            for (var k in result.cashStatus[i][j]) {
                                switch (k){
                                    case 'profitBT':
                                    //cashIndex = 0;
                                    break;
                                    case 'real':
                                    //cashIndex = 1;
                                    break;
                                    case 'dividends':
                                    //cashIndex = 2;
                                    break;
                                    case 'operation':
                                    //cashIndex = 3;
                                    break;
                                    case 'invest':
                                    //cashIndex = 4;
                                    break;
                                    case 'without_dividends':
                                    cashIndex = 5;
                                    break;
                                    case 'minor':
                                    cashIndex = 6;
                                    break;
                                }
                                if (cashIndex >= 0) {
                                    if (k === 'minor') {
                                        console.log(i);
                                        console.log(j);
                                        console.log(result.cashStatus[i][j][k]);
                                        console.log(result.cashStatus[i][j][k] * result.cashStatus[i][j].begin);
                                        console.log(result.cashStatus[i][j][k] * result.cashStatus[i][j].begin/100000000);
                                    }
                                    if (result.cashStatus[i][j][k] !== 0) {
                                        this_obj.cashData[cashIndex].push(Math.ceil(result.cashStatus[i][j][k] * result.cashStatus[i][j].begin/100000000));
                                    } else {
                                        this_obj.cashData[cashIndex].push(0);
                                    }
                                }
                            }
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
    }
}