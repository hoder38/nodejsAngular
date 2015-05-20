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
            } else if (xml_date[2] === '0930') {
                quarter = 3;
            } else if (xml_date[2] === '0630') {
                quarter = 2;
            } else {
                quarter = 1;
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
            if (quarter === 3 || quarter === 2) {
                cash[year][quarter+2] = cash[year][quarter-1];
                cash[year-1][quarter+2] = cash[year-1][quarter-1];
            }
        } else {
            cash[year][quarter-1] = {profitBT: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][0]['_']), operation: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedOperatingActivities'][0]['_']), invest: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedInvestingActivities'][0]['_']), finance: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedFinancingActivities'][0]['_']), dividends: 0, change: Number(xml.xbrl['tw-gaap-ci:NetChangesCashCashEquivalents'][0]['_']), begin: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][1]['_']), end: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['_'])};
            cash[year-1][quarter-1] = {profitBT: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][1]['_']), operation: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedOperatingActivities'][1]['_']), invest: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedInvestingActivities'][1]['_']), finance: Number(xml.xbrl['tw-gaap-ci:NetCashProvidedUsedFinancingActivities'][1]['_']), dividends: 0, change: Number(xml.xbrl['tw-gaap-ci:NetChangesCashCashEquivalents'][1]['_']), begin: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][3]['_']), end: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][2]['_'])};
            if (xml.xbrl['tw-gaap-ci:CashDividends']) {
                cash[year][quarter-1].dividends = Number(xml.xbrl['tw-gaap-ci:CashDividends'][0]['_']);
                cash[year-1][quarter-1].dividends = Number(xml.xbrl['tw-gaap-ci:CashDividends'][1]['_']);
            }
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
            } else if (xml_date[2] === '0930') {
                quarter = 3;
            } else if (xml_date[2] === '0630') {
                quarter = 2;
            } else {
                quarter = 1;
            }
        }
        if (type === 1) {
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
                asset[year][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][0]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherReceivables'][0]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][0]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][0]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][0]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][0]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][0]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][0]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][0]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][0]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][0]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][0]['_']), total: Number(xml.xbrl['ifrs:Assets'][0]['_']), longterm: 0};
                asset[year-1][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][1]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherReceivables'][1]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][1]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][1]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][1]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][1]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][1]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][1]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][1]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][1]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][1]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][1]['_']), total: Number(xml.xbrl['ifrs:Assets'][1]['_']), longterm: 0};
                if (xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][2]) {
                    asset[year-2][quarter-1] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][2]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherReceivables'][2]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][2]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][2]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][2]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][2]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][2]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][2]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][2]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][2]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][2]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][2]['_']), total: Number(xml.xbrl['ifrs:Assets'][2]['_']), longterm: 0};
                }
                if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod']) {
                    asset[year][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][0]['_']);
                    asset[year-1][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][1]['_']);
                    if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][2]) {
                        asset[year-2][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][2]['_']);
                    }
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
                if (xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][3]) {
                    asset[year-2][3] = {receivable: Number(xml.xbrl['tifrs-bsci-ci:AccountsReceivableNet'][3]['_']), payable: Number(xml.xbrl['tifrs-bsci-ci:AccountsPayable'][3]['_']) + Number(xml.xbrl['tifrs-bsci-ci:OtherPayables'][3]['_']), cash: Number(xml.xbrl['ifrs:CashAndCashEquivalents'][3]['_']), inventories: Number(xml.xbrl['ifrs:Inventories'][3]['_']), property: Number(xml.xbrl['ifrs:PropertyPlantAndEquipment'][3]['_']), current_liabilities: Number(xml.xbrl['ifrs:CurrentLiabilities'][3]['_']), noncurrent_liabilities: Number(xml.xbrl['ifrs:NoncurrentLiabilities'][3]['_']), equityParent: Number(xml.xbrl['ifrs:EquityAttributableToOwnersOfParent'][3]['_']), equityChild: Number(xml.xbrl['ifrs:NoncontrollingInterests'][3]['_']), share: Number(xml.xbrl['tifrs-bsci-ci:OrdinaryShare'][3]['_']), total: Number(xml.xbrl['ifrs:Assets'][3]['_']), longterm: 0};
                }
                if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod']) {
                    asset[year][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][0]['_']);
                    asset[year-1][3].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][1]['_']);
                    asset[year-1][quarter-1].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][2]['_']);
                    if (xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][3]) {
                        asset[year-2][3].longterm = Number(xml.xbrl['ifrs:InvestmentAccountedForUsingEquityMethod'][3]['_']);
                    }
                }
            }
            if (quarter === 3 || quarter === 2) {
                asset[year][quarter+2] = asset[year][quarter-1];
                asset[year-1][quarter+2] = asset[year-1][quarter-1];
            }
        } else {
            if (!asset[year]) {
                asset[year] = [];
            }
            if (!asset[year-1]) {
                asset[year-1] = [];
            }
            asset[year][quarter-1] = {receivable: Number(xml.xbrl['tw-gaap-ci:NetAccountsReceivable'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherReceivables'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:NetNotesReceivable'][0]['_']), payable: Number(xml.xbrl['tw-gaap-ci:AccountsPayable'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:NotesPayable'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxPayable'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:AccruedExpenses'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherPayables'][0]['_']), cash: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['_']), inventories: Number(xml.xbrl['tw-gaap-ci:Inventories'][0]['_']), property: Number(xml.xbrl['tw-gaap-ci:FixedAssets'][0]['_']), current_liabilities: Number(xml.xbrl['tw-gaap-ci:CurrentLiabilities'][0]['_']), noncurrent_liabilities: Number(xml.xbrl['tw-gaap-ci:LongtermBorrowings'][0]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherLiabilities'][0]['_']), equityParent: Number(xml.xbrl['tw-gaap-ci:TotalParentCompanyStockholdersEquities'][0]['_']), equityChild: Number(xml.xbrl['tw-gaap-ci:MinorityInterest'][0]['_']), share: Number(xml.xbrl['tw-gaap-ci:Capital'][0]['_']), total: Number(xml.xbrl['tw-gaap-ci:Assets'][0]['_']), longterm: 0};
            asset[year-1][quarter-1] = {receivable: Number(xml.xbrl['tw-gaap-ci:NetAccountsReceivable'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherReceivables'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:NetNotesReceivable'][1]['_']), payable: Number(xml.xbrl['tw-gaap-ci:AccountsPayable'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:NotesPayable'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:IncomeTaxPayable'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:AccruedExpenses'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherPayables'][1]['_']), cash: Number(xml.xbrl['tw-gaap-ci:CashCashEquivalents'][1]['_']), inventories: Number(xml.xbrl['tw-gaap-ci:Inventories'][1]['_']), property: Number(xml.xbrl['tw-gaap-ci:FixedAssets'][1]['_']), property: Number(xml.xbrl['tw-gaap-ci:FixedAssets'][1]['_']), current_liabilities: Number(xml.xbrl['tw-gaap-ci:CurrentLiabilities'][1]['_']), noncurrent_liabilities: Number(xml.xbrl['tw-gaap-ci:LongtermBorrowings'][1]['_']) + Number(xml.xbrl['tw-gaap-ci:OtherLiabilities'][1]['_']), equityParent: Number(xml.xbrl['tw-gaap-ci:TotalParentCompanyStockholdersEquities'][1]['_']), equityChild: Number(xml.xbrl['tw-gaap-ci:MinorityInterest'][1]['_']), share: Number(xml.xbrl['tw-gaap-ci:Capital'][1]['_']), total: Number(xml.xbrl['tw-gaap-ci:Assets'][1]['_']), longterm: 0};
            if (xml.xbrl['tw-gaap-ci:LongtermInvestments']) {
                asset[year][quarter-1].longterm = Number(xml.xbrl['tw-gaap-ci:LongtermInvestments'][0]['_']);
                asset[year-1][quarter-1].longterm = Number(xml.xbrl['tw-gaap-ci:LongtermInvestments'][1]['_']);
            }
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
            } else if (xml_date[2] === '0930') {
                quarter = 3;
            } else if (xml_date[2] === '0630') {
                quarter = 2;
            } else {
                quarter = 1;
            }
        }
        if (type === 1) {
            if (quarter === 4 || quarter === 1) {
                if (!sales[year]) {
                    sales[year] = [];
                }
                if (!sales[year-1]) {
                    sales[year-1] = [];
                }
                sales[year][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][0]['_']), profit: Number(xml.xbrl['ifrs:ProfitLoss'][0]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][0]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][0]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][0]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][0]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][0]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][0]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][0]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][0]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][0]['_'])};
                sales[year-1][quarter-1] = {gross_profit: Number(xml.xbrl['tifrs-bsci-ci:GrossProfitLossFromOperations'][1]['_']), profit: Number(xml.xbrl['ifrs:ProfitLoss'][1]['_']), comprehensive: Number(xml.xbrl['ifrs:ComprehensiveIncome'][1]['_']), revenue: Number(xml.xbrl['tifrs-bsci-ci:OperatingRevenue'][1]['_']), expenses: Number(xml.xbrl['tifrs-bsci-ci:OperatingExpenses'][1]['_']), tax: Number(xml.xbrl['ifrs:IncomeTaxExpenseContinuingOperations'][1]['_']), eps: Number(xml.xbrl['ifrs:DilutedEarningsLossPerShare'][1]['_']), nonoperating: Number(xml.xbrl['tifrs-bsci-ci:NonoperatingIncomeAndExpenses'][1]['_']), finance_cost: Number(xml.xbrl['ifrs:FinanceCosts'][1]['_']), cost: Number(xml.xbrl['ifrs:CostOfSales'][1]['_']), operating: Number(xml.xbrl['tifrs-bsci-ci:NetOperatingIncomeLoss'][1]['_'])};
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
        } else {
            if (!sales[year]) {
                sales[year] = [];
            }
            if (!sales[year-1]) {
                sales[year-1] = [];
            }
            sales[year][quarter-1] = {gross_profit: Number(xml.xbrl['tw-gaap-ci:GrossProfitLossOperations'][0]['_']), profit: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome'][0]['_']), comprehensive: 0, revenue: Number(xml.xbrl['tw-gaap-ci:NetSales'][0]['_']), expenses: Number(xml.xbrl['tw-gaap-ci:OperatingExpenses'][0]['_']), tax: Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][0]['_']), eps: Number(xml.xbrl['tw-gaap-ci:DilutedEarningsPerShare'][0]['_']), nonoperating: Number(xml.xbrl['tw-gaap-ci:NonOperatingExpenses'][0]['_']), finance_cost: Number(xml.xbrl['tw-gaap-ci:InterestExpense'][0]['_']), cost: Number(xml.xbrl['tw-gaap-ci:OperatingCosts'][0]['_']), operating: Number(xml.xbrl['tw-gaap-ci:GrossProfitLossOperations'][0]['_'])};
            sales[year-1][quarter-1] = {gross_profit: Number(xml.xbrl['tw-gaap-ci:GrossProfitLossOperations'][1]['_']), profit: Number(xml.xbrl['tw-gaap-ci:ConsolidatedTotalIncome'][1]['_']), comprehensive: 0, revenue: Number(xml.xbrl['tw-gaap-ci:NetSales'][1]['_']), expenses: Number(xml.xbrl['tw-gaap-ci:OperatingExpenses'][1]['_']), tax: Number(xml.xbrl['tw-gaap-ci:IncomeTaxExpenseBenefit'][1]['_']), eps: Number(xml.xbrl['tw-gaap-ci:DilutedEarningsPerShare'][1]['_']), nonoperating: Number(xml.xbrl['tw-gaap-ci:NonOperatingExpenses'][1]['_']), finance_cost: Number(xml.xbrl['tw-gaap-ci:InterestExpense'][1]['_']), cost: Number(xml.xbrl['tw-gaap-ci:OperatingCosts'][1]['_']), operating: Number(xml.xbrl['tw-gaap-ci:GrossProfitLossOperations'][1]['_'])};
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
    },
    getManagementStatus: function(sales, asset) {
        var managementStatus = {};
        var revenue = [];
        var profit = [];
        var cash = [];
        var inventories = [];
        var receivable = [];
        var payable = [];
        var startY = 0;
        var startQ = 0;
        for (var i in sales) {
            managementStatus[i] = [];
            for (var j in sales[i]) {
                if (j < 4) {
                    if (sales[i][j-1]) {
                        if (!startY && !startQ) {
                            startY = i;
                            startQ = j;
                        }
                        revenue.push(sales[i][j].revenue - sales[i][j-1].revenue);
                        profit.push(sales[i][j].profit - sales[i][j-1].profit);
                        cash.push(asset[i][j].cash);
                        inventories.push(asset[i][j].inventories);
                        receivable.push(asset[i][j].receivable);
                        payable.push(asset[i][j].payable);
                        managementStatus[i][j] = {revenue: sales[i][j].revenue - sales[i][j-1].revenue, profit: sales[i][j].profit - sales[i][j-1].profit, cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
                    } else if (j === '0'){
                        if (!startY && !startQ) {
                            startY = i;
                            startQ = j;
                        }
                        revenue.push(sales[i][j].revenue);
                        profit.push(sales[i][j].profit);
                        cash.push(asset[i][j].cash);
                        inventories.push(asset[i][j].inventories);
                        receivable.push(asset[i][j].receivable);
                        payable.push(asset[i][j].payable);
                        managementStatus[i][j] = {revenue: sales[i][j].revenue, profit: sales[i][j].profit, cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
                    }
                }
            }
        }
        if (revenue.length < 3) {
            return false;
        }
        if (startQ === '0') {
            startQ = 2;
            startY = Number(startY);
        } else if (startQ === '2') {
            startQ = 0;
            startY = Number(startY) + 1;
        } else if (startQ === '3') {
            startQ = 1;
            startY = Number(startY) + 1;
        } else {
            return false;
        }

        var revenueEven = caculateEven(revenue);
        var revenueVariance = caculateVariance(revenue, revenueEven);

        var profitEven = caculateEven(profit);
        var profitVariance = caculateVariance(profit, profitEven);

        var cashEven = caculateEven(cash);
        var cashVariance = caculateVariance(cash, cashEven);

        var inventoriesEven = caculateEven(inventories);
        var inventoriesVariance = caculateVariance(inventories, inventoriesEven);

        var receivableEven = caculateEven(receivable);
        var receivableVariance = caculateVariance(receivable, receivableEven);

        var payableEven = caculateEven(payable);
        var payableVariance = caculateVariance(payable, payableEven);

        revenueRelative(profit, profitEven, profitVariance, 'profitRelative');
        revenueRelative(cash, cashEven, cashVariance, 'cashRelative');
        revenueRelative(inventories, inventoriesEven, inventoriesVariance, 'inventoriesRelative');
        revenueRelative(receivable, receivableEven, receivableVariance, 'receivableRelative');
        revenueRelative(payable, payableEven, payableVariance, 'payableRelative');

        function revenueRelative(data, dataEven, dataVariance, dataRelative) {
            var Y = startY;
            var Q = startQ;
            var Relative = 0;
            for (var i = 2; i < revenue.length; i++) {
                if (Q > 3) {
                    Q = 0;
                    Y++;
                }
                Relative = 0;
                for (var j = 0; j <= i; j++) {
                    Relative += (revenue[j] - revenueEven[i-2]) * (data[j] - dataEven[i-2]);
                }
                managementStatus[Y][Q][dataRelative] = Math.ceil(Relative / dataVariance[i-2] / revenueVariance[i-2] * 1000) / 1000;
                Q++;
            }
        }
        return managementStatus;
    }
};

function caculateEven(data) {
    var dataSum = [];
    var dataEven = [];
    var Sum = 0;
    for (var i = 2; i < data.length; i++) {
        Sum = 0;
        for (var j = 0; j <= i; j++) {
            Sum += data[j];
        }
        dataSum.push(Sum);
    }
    for (var i in dataSum) {
        dataEven.push(Math.ceil(dataSum[i] / (Number(i)+3)));
    }
    return dataEven;
}

function caculateVariance(data, dataEven) {
    var dataVariance = [];
    var Variance = 0;
    for (var i = 2; i < data.length; i++) {
        Variance = 0;
        for (var j = 0; j <= i; j++) {
            Variance += (data[j] - dataEven[i-2]) * (data[j] - dataEven[i-2]);
        }
        dataVariance.push(Math.ceil(Math.sqrt(Variance)));
    }
    return dataVariance;
}
