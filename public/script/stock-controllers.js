function StockCntl($route, $routeParams, $location, $resource, $scope, $location) {
    $scope.$parent.currentPage = 2;
    $scope.$parent.collapse.nav = true;
    $scope.init = function(){
        var stockApi = $resource('/api/stock/init', {}, {
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
        });
    }
}