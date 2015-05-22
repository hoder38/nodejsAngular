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
    $scope.cashData = [];
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
                for(var i in result.assetStatus[result.latestYear][result.latestQuarter-1]) {
                    if (i !== 'total') {
                        this_obj.assetLabels.push(i);
                        this_obj.assetData.push(result.assetStatus[result.latestYear][result.latestQuarter-1][i] * result.assetStatus[result.latestYear][result.latestQuarter-1].total / 100);
                    }
                }
                for(var i in result.salesStatus[result.latestYear][result.latestQuarter-1]) {
                    this_obj.salesLabels.push(i);
                    this_obj.salesData.push(result.salesStatus[result.latestYear][result.latestQuarter-1][i]);
                }
                for(var i in result.cashStatus[result.latestYear][result.latestQuarter-1]) {
                    this_obj.cashLabels.push(i);
                    this_obj.cashData.push(result.cashStatus[result.latestYear][result.latestQuarter-1][i]);
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