var util = require("../util/utility.js");

var xml2js = require('xml2js'),
    fs = require('fs');
var parser = new xml2js.Parser();

module.exports = {
    initXml: function(filelocation, callback) {
        fs.readFile(filelocation, 'utf8', function(err, data) {
            parser.parseString(data, function (err, result) {
                if(err) {
                    util.handleError(err, callback, callback);
                }
                setTimeout(function(){
                    callback(null, result);
                }, 0);
            });
        });
    },
    getCashflow: function(xml, cash) {
        if (!cash) {
            cash = {};
        }
        var year = 0;
        var quarter = 0;
        var type = 0;
        if (xml.xbrl['tifrs-notes:Year']) {
            type = 1;
            year = Number(xml.xbrl['tifrs-notes:Year'][0]['_']);
            quarter = Number(xml.xbrl['tifrs-notes:Quarter'][0]['_']);
        } else {
            var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            if (!xml_date) {
                return false;
            }
            year = Number(xml_date[1]);
            if (xml_date[2] === '1231') {
                quarter = 4;
            }
        }
        if (!cash[year]) {
            cash[year] = [];
        }
        if (!cash[year-1]) {
            cash[year-1] = [];
        }
        if (type === 1) {
            cash[year][quarter-1] = {profitBT: Number(xml.xbrl['tifrs-SCF:ProfitLossBeforeTax'][0]['_']), operation: Number(xml.xbrl['ifrs:CashFlowsFromUsedInOperatingActivities'][0]['_']), invest: Number(xml.xbrl['tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities'][0]['_']), finance: Number(xml.xbrl['tifrs-SCF:CashFlowsFromUsedInFinancingActivities'][0]['_']), dividends: 0, change: Number(xml.xbrl['ifrs:IncreaseDecreaseInCashAndCashEquivalents'][0]['_']), begin: Number(xml.xbrl['tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod'][0]['_']), end: Number(xml.xbrl['tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod'][0]['_'])};
            cash[year-1][quarter-1] = {profitBT: Number(xml.xbrl['tifrs-SCF:ProfitLossBeforeTax'][1]['_']), operation: Number(xml.xbrl['ifrs:CashFlowsFromUsedInOperatingActivities'][1]['_']), invest: Number(xml.xbrl['tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities'][1]['_']), finance: Number(xml.xbrl['tifrs-SCF:CashFlowsFromUsedInFinancingActivities'][1]['_']), dividends: 0, change: Number(xml.xbrl['ifrs:IncreaseDecreaseInCashAndCashEquivalents'][1]['_']), begin: Number(xml.xbrl['tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod'][1]['_']), end: Number(xml.xbrl['tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod'][1]['_'])};
            if (xml.xbrl['tifrs-SCF:CashDividendsPaid']) {
                cash[year][quarter-1].dividends = Number(xml.xbrl['tifrs-SCF:CashDividendsPaid'][0]['_']);
                cash[year-1][quarter-1].dividends = Number(xml.xbrl['tifrs-SCF:CashDividendsPaid'][1]['_']);
            }
        } else {
            cash[year][quarter-1] = {profitBT: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][0]['_']), operation: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedOperatingActivities'][0]['_']), invest: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedInvestingActivities'][0]['_']), finance: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedFinancingActivities'][0]['_']), dividends: 0, change: Number(xml.xbrl['tw-gaap-ci:NetChangesCashCashEquivalents'][0]['_']), begin: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['_']), end: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['_'])};
            cash[year-1][quarter-1] = {profitBT: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][1]['_']), operation: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedOperatingActivities'][1]['_']), invest: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedInvestingActivities'][1]['_']), finance: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedFinancingActivities'][1]['_']), dividends: 0, change: Number(xml.xbrl['tw-gaap-ci:NetChangesCashCashEquivalents'][1]['_']), begin: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][1]['_']), end: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][1]['_'])};
            if (xml.xbrl['tw-gaap-ci:CashDividends']) {
                cash[year][quarter-1].dividends = Number(xml.xbrl['tw-gaap-ci:CashDividends'][0]['_']);
                cash[year-1][quarter-1].dividends = Number(xml.xbrl['tw-gaap-ci:CashDividends'][1]['_']);
            }
        }
        if (quarter === 3 || quarter === 2) {
            cash[year][quarter+2] = cash[year][quarter-1];
            cash[year-1][quarter+2] = cash[year-1][quarter-1];
        }
        return cash;
    },
    getAsset: function(xml, asset) {
        if (!asset) {
            asset = {};
        }
        var year = 0;
        var quarter = 0;
        var type = 0;
        if (xml.xbrl['tifrs-notes:Year']) {
            type = 1;
            year = Number(xml.xbrl['tifrs-notes:Year'][0]['_']);
            quarter = Number(xml.xbrl['tifrs-notes:Quarter'][0]['_']);
        } else {
            var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            if (!xml_date) {
                return false;
            }
            year = Number(xml_date[1]);
            if (xml_date[2] === '1231') {
                quarter = 4;
            }
        }
        if (quarter === 4) {
            if (!asset[year]) {
                asset[year] = [];
            }
            if (!asset[year-1]) {
                asset[year-1] = [];
            }
            if (!asset[year-2]) {
                asset[year-2] = [];
            }
            if (type === 1) {
                asset[year][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][0]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][0]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][0]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][0]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][0]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][0]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][0]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][0]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][0]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][0]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][0]['_']), total: Number(xml.xbrl['ifrs:Assets'][0]['_']), longterm: 0};
                asset[year-1][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][1]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][1]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][1]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][1]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][1]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][1]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][1]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][1]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][1]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][1]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][1]['_']), total: Number(xml.xbrl['ifrs:Assets'][1]['_']), longterm: 0};
                asset[year-2][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][2]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][2]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][2]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][2]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][2]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][2]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][2]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][2]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][2]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][2]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][2]['_']), total: Number(xml.xbrl['ifrs:Assets'][2]['_']), longterm: 0};
                if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod']) {
                    asset[year][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][0]['_']);
                    asset[year-1][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][1]['_']);
                    asset[year-2][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][2]['_']);
                }
            } else {
                asset[year][quarter-1] = {};
                asset[year-1][quarter-1] = {};
                asset[year-2][quarter-1] = {};
            }
        } else {
            if (!asset[year]) {
                asset[year] = [];
            }
            if (!asset[year-1]) {
                asset[year-1] = [];
            }
            if (!asset[year-2]) {
                asset[year-2] = [];
            }
            asset[year][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][0]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][0]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][0]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][0]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][0]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][0]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][0]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][0]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][0]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][0]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][0]['_']), total: Number(xml.xbrl['ifrs:Assets'][0]['_']), longterm: 0};
            asset[year-1][3] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][1]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][1]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][1]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][1]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][1]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][1]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][1]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][1]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][1]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][1]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][0]['_']), total: Number(xml.xbrl['ifrs:Assets'][1]['_']), longterm: 0};
            asset[year-1][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][2]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][2]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][2]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][2]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][2]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][2]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][2]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][2]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][2]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][2]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][2]['_']), total: Number(xml.xbrl['ifrs:Assets'][2]['_']), longterm: 0};
            asset[year-2][3] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][3]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][3]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][3]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][3]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][3]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][3]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][3]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][3]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][3]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][3]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][3]['_']), total: Number(xml.xbrl['ifrs:Assets'][3]['_']), longterm: 0};
            if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod']) {
                asset[year][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][0]['_']);
                asset[year-1][3].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][1]['_']);
                asset[year-1][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][2]['_']);
                asset[year-2][3].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][3]['_']);
            }
        }
        if (quarter === 3 || quarter === 2) {
            asset[year][quarter+2] = asset[year][quarter-1];
            asset[year-1][quarter+2] = asset[year-1][quarter-1];
        }
        return asset;
    },
    getSales: function(xml, sales) {
        if (!sales) {
            sales = {};
        }
        var year = 0;
        var quarter = 0;
        var type = 0;
        if (xml.xbrl['tifrs-notes:Year']) {
            type = 1;
            year = Number(xml.xbrl['tifrs-notes:Year'][0]['_']);
            quarter = Number(xml.xbrl['tifrs-notes:Quarter'][0]['_']);
        } else {
            var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            if (!xml_date) {
                return false;
            }
            year = Number(xml_date[1]);
            if (xml_date[2] === '1231') {
                quarter = 4;
            }
        }
        if (quarter === 4 || quarter === 1) {
            if (!sales[year]) {
                sales[year] = [];
            }
            if (!sales[year-1]) {
                sales[year-1] = [];
            }
            sales[year][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][0]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][0]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][0]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][0]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][0]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][0]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][0]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][0]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][0]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][0]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][0]['_'])};
            sales[year-1][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][1]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][1]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][1]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][1]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][1]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][1]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][1]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][1]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][1]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][1]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][1]['_'])};
        } else if (quarter === 3 || quarter === 2) {
            if (!sales[year]) {
                sales[year] = [];
            }
            if (!sales[year-1]) {
                sales[year-1] = [];
            }
            sales[year][quarter+2] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][0]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][0]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][0]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][0]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][0]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][0]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][0]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][0]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][0]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][0]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][0]['_'])};
            sales[year-1][quarter+2] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][1]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][1]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][1]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][1]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][1]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][1]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][1]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][1]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][1]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][1]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][1]['_'])};
            sales[year][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][2]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][2]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][2]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][2]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][2]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][2]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][2]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][2]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][2]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][2]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][2]['_'])};
            sales[year-1][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][3]['_']), profit: Number(xml.xbrl['ifrs:ProfitLossFromContinuingOperations'][3]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][3]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][3]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][3]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][3]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][3]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][3]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][3]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][3]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][3]['_'])};
        }
        return sales;
    },
    getCashStatus: function(cash, asset) {
        var cashStatus = {};
        for (var i in cash) {
            cashStatus[i] = [];
            for (var j in cash[i]) {
                cashStatus[i][j] = {profitBT: Math.ceil(cash[i][j].profitBT/cash[i][j].begin*100), real: Math.ceil(cash[i][j].change/cash[i][j].begin*100), operation: Math.ceil(cash[i][j].operation/cash[i][j].begin*100), invest: Math.ceil(cash[i][j].invest/cash[i][j].begin*100), dividends: Math.ceil(cash[i][j].dividends/cash[i][j].begin*100), without_dividends: Math.ceil((cash[i][j].finance - cash[i][j].dividends)/cash[i][j].begin*100), end: Math.ceil(cash[i][j].end/cash[i][j].begin*100), minor: Math.ceil((cash[i][j].change - cash[i][j].operation - cash[i][j].invest - cash[i][j].finance)/cash[i][j].begin*100), asset: Math.ceil(cash[i][j].end/asset[i][j].total*100), equity: Math.ceil(cash[i][j].end/(asset[i][j].equityParent + asset[i][j].equityChild)*100), investPerProperty: Math.ceil(cash[i][j].operation/asset[i][j].property*100), financePerLiabilities: Math.ceil((cash[i][j].finance - cash[i][j].dividends)/(asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)*100)};
            }
        }
        return cashStatus;
    },
    getAssetStatus: function(asset) {
        var assetStatus = {};
        for (var i in asset) {
            assetStatus[i] = [];
            for (var j in asset[i]) {
                assetStatus[i][j] = {cash: Math.ceil(asset[i][j].cash/asset[i][j].total*100), inventories: Math.ceil(asset[i][j].inventories/asset[i][j].total*100), receivable: Math.ceil(asset[i][j].receivable/asset[i][j].total*100), payable: Math.ceil(asset[i][j].payable/asset[i][j].total*100), property: Math.ceil(asset[i][j].property/asset[i][j].total*100), current_liabilities_without_payable: Math.ceil((asset[i][j].current_liabilities - asset[i][j].payable)/asset[i][j].total*100), noncurrent_liabilities: Math.ceil(asset[i][j].noncurrent_liabilities/asset[i][j].total*100), equityParent: Math.ceil(asset[i][j].equityParent/asset[i][j].total*100), equityChild: Math.ceil(asset[i][j].equityChild/asset[i][j].total*100), share: Math.ceil(asset[i][j].share/asset[i][j].total*100)
                    , longterm: Math.ceil(asset[i][j].longterm/asset[i][j].total*100), other: Math.ceil((asset[i][j].total - asset[i][j].cash - asset[i][j].inventories - asset[i][j].receivable - asset[i][j].property - asset[i][j].longterm)/asset[i][j].total*100)};
            }
        }
        return assetStatus;
    },
    getSalesStatus: function(sales, asset) {
        var salesStatus = {};
        for (var i in sales) {
            salesStatus[i] = [];
            for (var j in sales[i]) {
                salesStatus[i][j] = {gross_profit: Math.ceil(sales[i][j].gross_profit/sales[i][j].revenue*100), profit: Math.ceil(sales[i][j].profit/sales[i][j].revenue*100), comprehensive: Math.ceil(sales[i][j].comprehensive/sales[i][j].revenue*100), expenses: Math.ceil(sales[i][j].expenses/sales[i][j].revenue*100), tax: Math.ceil(sales[i][j].tax/sales[i][j].revenue*100), nonoperating: Math.ceil(sales[i][j].nonoperating/sales[i][j].revenue*100), cost: Math.ceil(sales[i][j].cost/sales[i][j].revenue*100), finance_cost: Math.ceil(sales[i][j].finance_cost/sales[i][j].revenue*100), operating: Math.ceil(sales[i][j].operating/sales[i][j].revenue*100), eps: sales[i][j].eps, salesPerAsset: Math.ceil(sales[i][j].revenue/asset[i][j].total*100)/100, salesPerInventories: Math.ceil(sales[i][j].revenue/asset[i][j].inventories*100)/100, salesPerProperty: Math.ceil(sales[i][j].revenue/asset[i][j].property*100)/100};
            }
        }
        return salesStatus;
    },
    getProfitStatus: function(salesStatus, cash, asset, sales) {
        var profitStatus = {};
        for (var i in salesStatus) {
            profitStatus[i] = [];
            for (var j in salesStatus[i]) {
                profitStatus[i][j] = {gross_profit: salesStatus[i][j].gross_profit, operating_profit: salesStatus[i][j].operating, profit: salesStatus[i][j].profit, turnover: salesStatus[i][j].salesPerAsset, asset_growth: salesStatus[i][j].profit*salesStatus[i][j].salesPerAsset, operationAG: Math.ceil(cash[i][j].operation/asset[i][j].total*100), oiAG: Math.ceil((cash[i][j].operation + cash[i][j].invest)/asset[i][j].total*100), realAG: Math.ceil(cash[i][j].change/asset[i][j].total*100), realAG_dividends: Math.ceil((cash[i][j].change - cash[i][j].dividends)/asset[i][j].total*100), operatingP: Math.ceil(cash[i][j].operation/sales[i][j].revenue*100), oiP: Math.ceil((cash[i][j].operation + cash[i][j].invest)/sales[i][j].revenue*100), realP: Math.ceil(cash[i][j].change/sales[i][j].revenue*100), realP_dividends: Math.ceil((cash[i][j].change - cash[i][j].dividends)/sales[i][j].revenue*100), salesPerShare: Math.ceil(sales[i][j].revenue/sales[i][j].eps)};
            }
        }
        return profitStatus;
    },
    getSafetyStatus: function(salesStatus, cash, asset) {
        var safetyStatus = {};
        for (var i in salesStatus) {
            safetyStatus[i] = [];
            for (var j in salesStatus[i]) {
                safetyStatus[i][j] = {prMinusProfit: Math.ceil(asset[i][j].payable/asset[i][j].receivable*100) - 100 + salesStatus[i][j].profit, prRatio: Math.ceil(asset[i][j].payable/asset[i][j].receivable*100), shortCash: Math.ceil((asset[i][j].receivable - asset[i][j].payable*2 + asset[i][j].current_liabilities - salesStatus[i][j].profit*asset[i][j].receivable/100 - cash[i][j].invest)/cash[i][j].end*100), shortCashWithoutCL: Math.ceil((asset[i][j].receivable - asset[i][j].payable - salesStatus[i][j].profit*asset[i][j].receivable/100 - cash[i][j].invest)/cash[i][j].end*100), shortCashWithoutInvest: Math.ceil((asset[i][j].receivable - asset[i][j].payable*2 + asset[i][j].current_liabilities - salesStatus[i][j].profit*asset[i][j].receivable/100)/cash[i][j].end*100), current_liabilitiesCashRatio: Math.ceil(asset[i][j].current_liabilities/asset[i][j].cash*100), current_liabilitiesCurrentRatio: Math.ceil(asset[i][j].current_liabilities/(asset[i][j].cash+asset[i][j].receivable)*100), liabilitiesCashRatio: Math.ceil((asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)/asset[i][j].cash*100), liabilitiesCurrentRatio: Math.ceil((asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)/(asset[i][j].cash+asset[i][j].receivable)*100)};
            }
        }
        return safetyStatus;
    }
};
