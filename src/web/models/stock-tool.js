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
        if (!xml.xbrl) {
            return false;
        }
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
        } else if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
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
        } else {
            return false;
        }
        if (!cash[year]) {
            cash[year] = [];
        }
        if (!cash[year-1]) {
            cash[year-1] = [];
        }
        if (type === 1) {
            cash[year][quarter-1] = {profitBT: getParameter(xml, 'tifrs-SCF:ProfitLossBeforeTax', 0), operation: getParameter(xml, 'ifrs:CashFlowsFromUsedInOperatingActivities', 0), invest: getParameter(xml, 'tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities', 0), finance: getParameter(xml, 'tifrs-SCF:CashFlowsFromUsedInFinancingActivities', 0), dividends: getParameter(xml, 'tifrs-SCF:CashDividendsPaid', 0), change: getParameter(xml, 'ifrs:IncreaseDecreaseInCashAndCashEquivalents', 0), begin: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod', 0), end: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod', 0)};
            cash[year-1][quarter-1] = {profitBT: getParameter(xml, 'tifrs-SCF:ProfitLossBeforeTax', 1), operation: getParameter(xml, 'ifrs:CashFlowsFromUsedInOperatingActivities', 1), invest: getParameter(xml, 'tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities', 1), finance: getParameter(xml, 'tifrs-SCF:CashFlowsFromUsedInFinancingActivities', 1), dividends: getParameter(xml, 'tifrs-SCF:CashDividendsPaid', 1), change: getParameter(xml, 'ifrs:IncreaseDecreaseInCashAndCashEquivalents', 1), begin: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod', 1), end: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod', 1)};
            if (quarter === 3 || quarter === 2) {
                if (quarterIsEmpty(cash[year][quarter-1])) {
                    cash[year].splice(quarter-1, 1);
                } else {
                    cash[year][quarter+2] = cash[year][quarter-1];
                }
                if (quarterIsEmpty(cash[year-1][quarter-1])) {
                    cash[year-1].splice(quarter-1, 1);
                } else {
                    cash[year-1][quarter+2] = cash[year-1][quarter-1];
                }
            }
        } else {
            cash[year][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 0), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 0), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 0), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 0), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 0), begin: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0)};
            cash[year-1][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 1), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 1), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 1), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 1), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 1), begin: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 3), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 2)};
            if (quarterIsEmpty(cash[year][quarter-1])) {
                cash[year].splice(quarter-1, 1);
            }
            if (quarterIsEmpty(cash[year-1][quarter-1])) {
                cash[year-1].splice(quarter-1, 1);
            }
        }
        if (quarterIsEmpty(cash[year])) {
            delete cash[year];
        }
        if (quarterIsEmpty(cash[year-1])) {
            delete cash[year-1];
        }
        return cash;
    },
    getAsset: function(xml, asset) {
        if (!xml.xbrl) {
            return false;
        }
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
        } else if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
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
        } else {
            return false;
        }
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
            if (quarter === 4) {
                asset[year][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 0), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 0), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 0), inventories: getParameter(xml, 'ifrs:Inventories', 0), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 0), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 0), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 0), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 0), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 0), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 0), total: getParameter(xml, 'ifrs:Assets', 0), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 0)};
                asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 1), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 1), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 1), inventories: getParameter(xml, 'ifrs:Inventories', 1), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 1), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 1), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 1), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 1), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 1), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 1), total: getParameter(xml, 'ifrs:Assets', 1), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 1)};
                asset[year-2][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 2), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 2), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 2), inventories: getParameter(xml, 'ifrs:Inventories', 2), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 2), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 2), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 2), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 2), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 2), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 2), total: getParameter(xml, 'ifrs:Assets', 2), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 2)};
                if (quarterIsEmpty(asset[year][quarter-1])) {
                    asset[year].splice(quarter-1, 1);
                }
                if (quarterIsEmpty(asset[year-1][quarter-1])) {
                    asset[year-1].splice(quarter-1, 1);
                }
                if (quarterIsEmpty(asset[year-2][quarter-1])) {
                    asset[year-2].splice(quarter-1, 1);
                }
            } else {
                asset[year][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 0), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 0), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 0), inventories: getParameter(xml, 'ifrs:Inventories', 0), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 0), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 0), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 0), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 0), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 0), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 0), total: getParameter(xml, 'ifrs:Assets', 0), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 0)};
                asset[year-1][3] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 1), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 1), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 1), inventories: getParameter(xml, 'ifrs:Inventories', 1), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 1), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 1), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 1), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 1), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 1), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 1), total: getParameter(xml, 'ifrs:Assets', 1), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 1)};
                asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 2), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 2), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 2), inventories: getParameter(xml, 'ifrs:Inventories', 2), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 2), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 2), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 2), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 2), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 2), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 2), total: getParameter(xml, 'ifrs:Assets', 2), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 2)};
                asset[year-2][3] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 3) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 3), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 3) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 3), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 3), inventories: getParameter(xml, 'ifrs:Inventories', 3), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 3), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 3), noncurrent_liabilities: getParameter(xml, 'ifrs:NoncurrentLiabilities', 3), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 3), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 3), share: getParameter(xml, 'tifrs-bsci-ci:OrdinaryShare', 3), total: getParameter(xml, 'ifrs:Assets', 3), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 3)};
                if (quarter === 3 || quarter === 2) {
                    if (quarterIsEmpty(asset[year][quarter-1])) {
                        asset[year].splice(quarter-1, 1);
                    } else {
                        asset[year][quarter+2] = asset[year][quarter-1];
                    }
                    if (quarterIsEmpty(asset[year-1][quarter-1])) {
                        asset[year-1].splice(quarter-1, 1);
                    } else {
                        asset[year-1][quarter+2] = asset[year-1][quarter-1];
                    }
                } else {
                    if (quarterIsEmpty(asset[year][quarter-1])) {
                        asset[year].splice(quarter-1, 1);
                    }
                    if (quarterIsEmpty(asset[year-1][quarter-1])) {
                        asset[year-1].splice(quarter-1, 1);
                    }
                }
                if (quarterIsEmpty(asset[year][3])) {
                    asset[year].splice(3, 1);
                }
                if (quarterIsEmpty(asset[year-2][3])) {
                    asset[year-2].splice(3, 1);
                }
            }
        } else {
            asset[year][quarter-1] = {receivable: getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 0) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 0) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 0), payable: getParameter(xml, 'tw-gaap-ci:AccountsPayable', 0) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 0) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 0) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 0), cash: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0), inventories: getParameter(xml, 'tw-gaap-ci:Inventories', 0), property: getParameter(xml, 'tw-gaap-ci:FixedAssets', 0), current_liabilities: getParameter(xml, 'tw-gaap-ci:CurrentLiabilities', 0), noncurrent_liabilities: getParameter(xml, 'tw-gaap-ci:LongtermBorrowings', 0) + getParameter(xml, 'tw-gaap-ci:OtherLiabilities', 0), equityParent: getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 0), equityChild: getParameter(xml, 'tw-gaap-ci:MinorityInterest', 0), share: getParameter(xml, 'tw-gaap-ci:Capital', 0), total: getParameter(xml, 'tw-gaap-ci:Assets', 0), longterm: getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 0)};
            asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 1) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 1) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 1), payable: getParameter(xml, 'tw-gaap-ci:AccountsPayable', 1) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 1) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 1) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 1), cash: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1), inventories: getParameter(xml, 'tw-gaap-ci:Inventories', 1), property: getParameter(xml, 'tw-gaap-ci:FixedAssets', 1), property: getParameter(xml, 'tw-gaap-ci:FixedAssets', 1), current_liabilities: getParameter(xml, 'tw-gaap-ci:CurrentLiabilities', 1), noncurrent_liabilities: getParameter(xml, 'tw-gaap-ci:LongtermBorrowings', 1) + getParameter(xml, 'tw-gaap-ci:OtherLiabilities', 1), equityParent: getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 1), equityChild: getParameter(xml, 'tw-gaap-ci:MinorityInterest', 1), share: getParameter(xml, 'tw-gaap-ci:Capital', 1), total: getParameter(xml, 'tw-gaap-ci:Assets', 1), longterm: getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 1)};
            if (quarterIsEmpty(asset[year][quarter-1])) {
                asset[year].splice(quarter-1, 1);
            }
            if (quarterIsEmpty(asset[year-1][quarter-1])) {
                asset[year-1].splice(quarter-1, 1);
            }
        }
        if (quarterIsEmpty(asset[year])) {
            delete asset[year];
        }
        if (quarterIsEmpty(asset[year-1])) {
            delete asset[year-1];
        }
        if (quarterIsEmpty(asset[year-2])) {
            delete asset[year-2];
        }
        return asset;
    },
    getSales: function(xml, sales) {
        if (!xml.xbrl) {
            return false;
        }
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
        } else if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
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
        } else {
            return false;
        }
        if (!sales[year]) {
            sales[year] = [];
        }
        if (!sales[year-1]) {
            sales[year-1] = [];
        }
        if (type === 1) {
            if (quarter === 4 || quarter === 1) {
                sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 0), profit: getParameter(xml, 'ifrs:ProfitLoss', 0), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 0), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 0), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 0), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 0), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 0), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 0), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 0), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 0), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 0)};
                sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 1), profit: getParameter(xml, 'ifrs:ProfitLoss', 1), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 1), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 1), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 1), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 1), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 1), nonoperating: getParameter(xml, 'ttifrs-bsci-ci:NonoperatingIncomeAndExpenses', 1), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 1), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 1), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 1)};
            } else if (quarter === 3 || quarter === 2) {
                sales[year][quarter+2] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 0), profit: getParameter(xml, 'ifrs:ProfitLoss', 0), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 0), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 0), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 0), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 0), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 0), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 0), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 0), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 0), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 0)};
                sales[year-1][quarter+2] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 1), profit: getParameter(xml, 'ifrs:ProfitLoss', 1), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 1), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 1), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 1), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 1), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 1), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 1), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 1), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 1), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 1)};
                sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 2), profit: getParameter(xml, 'ifrs:ProfitLoss', 2), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 2), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 2), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 2), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 2), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 2), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 2), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 2), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 2), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 2)};
                sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 3), profit: getParameter(xml, 'ifrs:ProfitLoss', 3), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 3), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 3), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 3), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 3), eps: getParameter(xml, 'ifrs:DilutedEarningsLossPerShare', 3), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 3), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 3), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 3), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 3)};
                if (quarterIsEmpty(sales[year][quarter+2])) {
                    sales[year].splice(quarter+2, 1);
                }
                if (quarterIsEmpty(sales[year-1][quarter+2])) {
                    sales[year-1].splice(quarter+2, 1);
                }
            }
        } else {
            sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 0), profit: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 0), comprehensive: 0, revenue: getParameter(xml, 'tw-gaap-ci:NetSales', 0), expenses: getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 0), tax: getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0), eps: getParameter(xml, 'tw-gaap-ci:DilutedEarningsPerShare', 0), nonoperating: getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 0), finance_cost: getParameter(xml, 'tw-gaap-ci:InterestExpense', 0), cost: getParameter(xml, 'tw-gaap-ci:OperatingCosts', 0), operating: getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 0)};
            sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 1), profit: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 1), comprehensive: 0, revenue: getParameter(xml, 'tw-gaap-ci:NetSales', 1), expenses: getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 1), tax: getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1), eps: getParameter(xml, 'tw-gaap-ci:DilutedEarningsPerShare', 1), nonoperating: getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 1), finance_cost: getParameter(xml, 'tw-gaap-ci:InterestExpense', 1), cost: getParameter(xml, 'tw-gaap-ci:OperatingCosts', 1), operating: getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 1)};
        }
        if (quarterIsEmpty(sales[year][quarter-1])) {
            sales[year].splice(quarter-1, 1);
        }
        if (quarterIsEmpty(sales[year-1][quarter-1])) {
            sales[year-1].splice(quarter-1, 1);
        }
        if (quarterIsEmpty(sales[year])) {
            delete sales[year];
        }
        if (quarterIsEmpty(sales[year-1])) {
            delete sales[year-1];
        }
        return sales;
    },
    getCashStatus: function(cash, asset) {
        var cashStatus = {};
        for (var i in cash) {
            cashStatus[i] = [];
            for (var j in cash[i]) {
                cashStatus[i][j] = {begin: cash[i][j].begin, profitBT: Math.ceil(cash[i][j].profitBT/cash[i][j].begin*100), real: Math.ceil(cash[i][j].change/cash[i][j].begin*100), operation: Math.ceil(cash[i][j].operation/cash[i][j].begin*100), invest: Math.ceil(cash[i][j].invest/cash[i][j].begin*100), dividends: Math.ceil(cash[i][j].dividends/cash[i][j].begin*100), without_dividends: Math.ceil((cash[i][j].finance - cash[i][j].dividends)/cash[i][j].begin*100), end: Math.ceil(cash[i][j].end/cash[i][j].begin*100), minor: Math.ceil((cash[i][j].change - cash[i][j].operation - cash[i][j].invest - cash[i][j].finance)/cash[i][j].begin*100), asset: Math.ceil(cash[i][j].end/asset[i][j].total*100), equity: Math.ceil(cash[i][j].end/(asset[i][j].equityParent + asset[i][j].equityChild)*100), investPerProperty: Math.ceil(cash[i][j].operation/asset[i][j].property*100), financePerLiabilities: Math.ceil((cash[i][j].finance - cash[i][j].dividends)/(asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)*100)};
                if ((j === '1' || j === '2' || j === '3') && cashStatus[i][Number(j)-1]) {
                    cashStatus[i][j].profitBT -= cashStatus[i][Number(j)-1].profitBT;
                    cashStatus[i][j].real -= cashStatus[i][Number(j)-1].real;
                    cashStatus[i][j].dividends -= cashStatus[i][Number(j)-1].dividends;
                    cashStatus[i][j].operation -= cashStatus[i][Number(j)-1].operation;
                    cashStatus[i][j].invest -= cashStatus[i][Number(j)-1].invest;
                    cashStatus[i][j].without_dividends -= cashStatus[i][Number(j)-1].without_dividends;
                    cashStatus[i][j].minor -= cashStatus[i][Number(j)-1].minor;
                }
            }
        }
        return cashStatus;
    },
    getAssetStatus: function(asset) {
        var assetStatus = {};
        for (var i in asset) {
            assetStatus[i] = [];
            for (var j in asset[i]) {
                assetStatus[i][j] = {total: asset[i][j].total, receivable: Math.ceil(asset[i][j].receivable/asset[i][j].total*1000)/10, cash: Math.ceil(asset[i][j].cash/asset[i][j].total*1000)/10, inventories: Math.ceil(asset[i][j].inventories/asset[i][j].total*1000)/10, property: Math.ceil(asset[i][j].property/asset[i][j].total*1000)/10, longterm: Math.ceil(asset[i][j].longterm/asset[i][j].total*1000)/10, other: Math.ceil((asset[i][j].total - asset[i][j].cash - asset[i][j].inventories - asset[i][j].receivable - asset[i][j].property - asset[i][j].longterm)/asset[i][j].total*1000)/10, equityChild: Math.ceil(asset[i][j].equityChild/asset[i][j].total*1000)/10 , equityParent_without_share: Math.ceil((asset[i][j].equityParent - asset[i][j].share)/asset[i][j].total*1000)/10, share: Math.ceil(asset[i][j].share/asset[i][j].total*1000)/10, noncurrent_liabilities: Math.ceil(asset[i][j].noncurrent_liabilities/asset[i][j].total*1000)/10, current_liabilities_without_payable: Math.ceil((asset[i][j].current_liabilities - asset[i][j].payable)/asset[i][j].total*1000)/10, payable: Math.ceil(asset[i][j].payable/asset[i][j].total*1000)/10};
            }
        }
        return assetStatus;
    },
    getSalesStatus: function(sales, asset) {
        var salesStatus = {};
        for (var i in sales) {
            salesStatus[i] = [];
            for (var j in sales[i]) {
                salesStatus[i][j] = {revenue: sales[i][j].revenue, cost: Math.ceil(sales[i][j].cost/sales[i][j].revenue*1000)/10, expenses: Math.ceil(sales[i][j].expenses/sales[i][j].revenue*1000)/10, finance_cost: Math.ceil(sales[i][j].finance_cost/sales[i][j].revenue*1000)/10, nonoperating_without_FC: Math.ceil((sales[i][j].nonoperating+sales[i][j].finance_cost)/sales[i][j].revenue*1000)/10, tax: Math.ceil(sales[i][j].tax/sales[i][j].revenue*1000)/10, comprehensive: Math.ceil(sales[i][j].comprehensive/sales[i][j].revenue*1000)/10, gross_profit: Math.ceil(sales[i][j].gross_profit/sales[i][j].revenue*1000)/10, operating: Math.ceil(sales[i][j].operating/sales[i][j].revenue*1000)/10, profit: Math.ceil(sales[i][j].profit/sales[i][j].revenue*1000)/10, profit_comprehensive: Math.ceil((sales[i][j].profit+sales[i][j].comprehensive)/sales[i][j].revenue*1000)/10, eps: sales[i][j].eps, salesPerAsset: Math.ceil(sales[i][j].revenue/asset[i][j].total*1000)/1000, salesPerInventories: Math.ceil(sales[i][j].revenue/asset[i][j].inventories*1000)/1000, salesPerProperty: Math.ceil(sales[i][j].revenue/asset[i][j].property*1000)/1000};
            }
        }
        return salesStatus;
    },
    getProfitStatus: function(salesStatus, cash, asset, sales) {
        var profitStatus = {};
        for (var i in salesStatus) {
            profitStatus[i] = [];
            for (var j in salesStatus[i]) {
                profitStatus[i][j] = {gross_profit: salesStatus[i][j].gross_profit, operating_profit: salesStatus[i][j].operating, profit: salesStatus[i][j].profit, turnover: salesStatus[i][j].salesPerAsset, leverage: Math.ceil((asset[i][j].equityParent + asset[i][j].equityChild)/asset[i][j].total*100)/100, asset_growth: salesStatus[i][j].profit*salesStatus[i][j].salesPerAsset, roe: Math.ceil(salesStatus[i][j].profit*salesStatus[i][j].salesPerAsset*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*100)/100, operationAG: Math.ceil(cash[i][j].operation/asset[i][j].total*100), oiAG: Math.ceil((cash[i][j].operation + cash[i][j].invest)/asset[i][j].total*100), realAG: Math.ceil(cash[i][j].change/asset[i][j].total*100), realAG_dividends: Math.ceil((cash[i][j].change - cash[i][j].dividends)/asset[i][j].total*100), operatingP: Math.ceil(cash[i][j].operation/sales[i][j].revenue*100), oiP: Math.ceil((cash[i][j].operation + cash[i][j].invest)/sales[i][j].revenue*100), realP: Math.ceil(cash[i][j].change/sales[i][j].revenue*100), realP_dividends: Math.ceil((cash[i][j].change - cash[i][j].dividends)/sales[i][j].revenue*100), salesPerShare: Math.ceil(sales[i][j].revenue/sales[i][j].eps), operationRoe: Math.ceil(cash[i][j].operation/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*100), oiRoe: Math.ceil((cash[i][j].operation + cash[i][j].invest)/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*100), realRoe: Math.ceil(cash[i][j].change/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*100), realRoe_dividends: Math.ceil((cash[i][j].change - cash[i][j].dividends)/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*100)};
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

function getParameter(xml, name, index) {
    if (xml.xbrl[name] && xml.xbrl[name][index] && xml.xbrl[name][index]['_']) {
        return Number(xml.xbrl[name][index]['_']);
    } else {
        return 0;
    }
}

function quarterIsEmpty(quarter) {
    if (!quarter) {
        return true;
    }
    for (var i in quarter) {
        if (quarter[i]) {
            return false;
        }
    }
    return true;
}
