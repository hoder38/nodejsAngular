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
    Chart.defaults.global.animation = false;
    $scope.$parent.currentPage = 2;
    $scope.$parent.collapse.nav = true;
    $scope.stockIndex = '';
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
            assetEndDate.year = assetStartDate.year;
        }
        if (assetStartDate.year === assetEndDate.year && assetStartDate.quarter > assetEndDate.quarter) {
            assetEndDate.quarter = assetStartDate.quarter;
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
        this.salesLabels = [];
        this.salesData = [];
        this.salesTotal = 0;
        this.salesTotalCommas = '0';
        this.eps = 0;
        for(var i in this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            if (i === 'cost' || i === 'expenses' || i === 'finance_cost') {
                this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
            } else if (i === 'nonoperating_without_FC' || (i === 'comprehensive' && comprehensive)) {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if (i === 'tax') {
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
            } else if (i === 'tax') {
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
        this.eps = this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].eps;
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
                if (this.parseResult.cashStatus[i][j] && j < 4) {
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
                if (this.parseResult.safetyStatus[i][j] && j < 4) {
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
                if (this.parseResult.profitStatus[i][j] && j < 4) {
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
                if (this.parseResult.managementStatus[i][j] && j < 4) {
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
    $scope.submitIndex = function() {
        var this_obj = this;
        if (!this.inputIndex) {
            return false;
        }
        this.isParse = false;
        this.parseResult = {};
        this.parseYear = [];
        this.accumulate = false;
        this.comprehensive = true;
        this.relative = {profit: true, cash: true, inventories: true, receivable: true, payable: true};
        if (!isNaN(this.inputIndex)) {
            var stockApi = $resource('/api/stock/query/' + Number(this.inputIndex), {}, {
                'query': { method:'get' }
            });
            this.stockIndex = this.inputIndex;
            this.inputIndex = '';
            this.searchBlur = true;
            stockApi.query({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    //console.log(result);
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
                    for (var i = this_obj.parseResult.earliestYear; i <= this_obj.parseResult.latestYear; i++) {
                        this_obj.parseYear.push({name: i, value: i});
                    }
                    this_obj.isParse = true;
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
        } else {
            addAlert('Please input index!!!');
        }
    }
}