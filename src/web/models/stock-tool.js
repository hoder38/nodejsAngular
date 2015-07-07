var util = require("../util/utility.js");
var mongo = require("../models/mongo-tool.js");
var api = require("../models/api-tool.js");
var stockTagTool = require("../models/tag-tool.js")("stock");
var config_type = require('../../../ver.js');
var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var xml2js = require('xml2js'),
    fs = require('fs'),
    mkdirp = require('mkdirp');
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
    getCashflow: function(xml, cash, no_cover) {
        if (!xml.xbrl) {
            for (var i in xml) {
                xml.xbrl = xml[i];
                break;
            }
            if (!xml.xbrl) {
                console.log('xml lost');
                return false;
            }
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
        } else {
            if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-mim:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-mim:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-basi:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-basi:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-bd:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-bd:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else {
                console.log('umknown date');
                return false;
            }
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
            if (!cash[year][quarter-1] || !no_cover) {
                cash[year][quarter-1] = {profitBT: getParameter(xml, 'tifrs-SCF:ProfitLossBeforeTax', 0), operation: getParameter(xml, 'ifrs:CashFlowsFromUsedInOperatingActivities', 0), invest: getParameter(xml, 'tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities', 0), finance: getParameter(xml, 'tifrs-SCF:CashFlowsFromUsedInFinancingActivities', 0), dividends: getParameter(xml, 'tifrs-SCF:CashDividendsPaid', 0), change: getParameter(xml, 'ifrs:IncreaseDecreaseInCashAndCashEquivalents', 0), begin: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod', 0), end: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod', 0)};
            }
            if (!cash[year-1][quarter-1] || !no_cover) {
                cash[year-1][quarter-1] = {profitBT: getParameter(xml, 'tifrs-SCF:ProfitLossBeforeTax', 1), operation: getParameter(xml, 'ifrs:CashFlowsFromUsedInOperatingActivities', 1), invest: getParameter(xml, 'tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities', 1), finance: getParameter(xml, 'tifrs-SCF:CashFlowsFromUsedInFinancingActivities', 1), dividends: getParameter(xml, 'tifrs-SCF:CashDividendsPaid', 1), change: getParameter(xml, 'ifrs:IncreaseDecreaseInCashAndCashEquivalents', 1), begin: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod', 1), end: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod', 1)};
            }
            if (quarter === 3 || quarter === 2) {
                if (quarterIsEmpty(cash[year][quarter-1])) {
                    cash[year].splice(quarter-1, 1);
                }
                if (quarterIsEmpty(cash[year-1][quarter-1])) {
                    cash[year-1].splice(quarter-1, 1);
                }
            }
        } else {
            var cash1 = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 1);
            var cash2 = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 2) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 2) + getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 2) + getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 2) + getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 2);
            if (!cash[year][quarter-1] || !no_cover) {
                cash[year][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0) + getParameter(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', 0) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 0) + getParameter(xml, 'tw-gaap-basi:ConsolidatedTotalIncome_StatementCashFlows', 0) - getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', 0) + getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-CashFlowStatement', 0) + getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', 0) + getParameter(xml, 'tw-gaap-bd:ConsolidatedTotalIncome_StatementCashFlows', 0) + getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', 0), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedOperatingActivities', 0) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedOperatingActivities', 0) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedOperatingActivities', 0) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedOperatingActivities', 0), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedInvestingActivities', 0) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedInvestingActivities', 0) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedInvestingActivities', 0) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedInvestingActivities', 0), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedFinancingActivities', 0) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedFinancingActivities', 0) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedFinancingActivities', 0) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedFinancingActivities', 0), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 0) + getParameter(xml, 'tw-gaap-fh:CashDividends', 0) + getParameter(xml, 'tw-gaap-mim:CashDividends', 0) + getParameter(xml, 'tw-gaap-basi:CashDividends', 0) + getParameter(xml, 'tw-gaap-bd:CashDividends', 0), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-fh:NetChangesCashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-mim:NetChangesCashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-basi:NetChangesCashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-bd:NetChangesCashCashEquivalents', 0), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 0)};
                if (cash1 > cash2) {
                    cash[year][quarter-1].begin = cash1;
                } else {
                    cash[year][quarter-1].begin = cash2;
                }
            }
            if (!cash[year-1][quarter-1] || !no_cover) {
                cash[year-1][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1) + getParameter(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', 1) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 1) + getParameter(xml, 'tw-gaap-basi:ConsolidatedTotalIncome_StatementCashFlows', 1) - getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', 1) + getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-CashFlowStatement', 1) + getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', 1) + getParameter(xml, 'tw-gaap-bd:ConsolidatedTotalIncome_StatementCashFlows', 1) + getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', 1), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedOperatingActivities', 1) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedOperatingActivities', 1) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedOperatingActivities', 1) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedOperatingActivities', 1), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedInvestingActivities', 1) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedInvestingActivities', 1) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedInvestingActivities', 1) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedInvestingActivities', 1), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedFinancingActivities', 1) + getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedFinancingActivities', 1) + getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedFinancingActivities', 1) + getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedFinancingActivities', 1), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 1) + getParameter(xml, 'tw-gaap-fh:CashDividends', 1) + getParameter(xml, 'tw-gaap-mim:CashDividends', 1) + getParameter(xml, 'tw-gaap-basi:CashDividends', 1) + getParameter(xml, 'tw-gaap-bd:CashDividends', 1), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-fh:NetChangesCashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-mim:NetChangesCashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-basi:NetChangesCashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-bd:NetChangesCashCashEquivalents', 1), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 3) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 3) + getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 3) + getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 3) + getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 3)};
                if (cash1 > cash2) {
                    cash[year-1][quarter-1].end = cash2;
                } else {
                    cash[year-1][quarter-1].end = cash1;
                }
            }
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
    getAsset: function(xml, asset, no_cover) {
        if (!xml.xbrl) {
            for (var i in xml) {
                xml.xbrl = xml[i];
                break;
            }
            if (!xml.xbrl) {
                console.log('xml lost');
                return false;
            }
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
        } else {
            if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-mim:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-mim:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-basi:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-basi:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-bd:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-bd:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else {
                console.log('umknown date');
                return false;
            }
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
                if (!asset[year][quarter-1] || !no_cover) {
                    if (!califrsAsset(year, quarter-1, 0, 1)) {
                        return false;
                    }
                }
                if (!asset[year-1][quarter-1] || !no_cover) {
                    if (!califrsAsset(year-1, quarter-1, 1)) {
                        return false;
                    }
                }
                if (!asset[year-2][quarter-1] || !no_cover) {
                    if (!califrsAsset(year-2, quarter-1, 2)) {
                        return false;
                    }
                }
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
                if (!asset[year][quarter-1] || !no_cover) {
                    if (!califrsAsset(year, quarter-1, 0, 1)) {
                        return false;
                    }
                }
                if (!asset[year-1][3] || !no_cover) {
                    if (!califrsAsset(year-1, 3, 1)) {
                        return false;
                    }
                }
                if (!asset[year-1][quarter-1] || !no_cover) {
                    if (!califrsAsset(year-1, quarter-1, 2)) {
                        return false;
                    }
                }
                if (!asset[year-2][3] || !no_cover) {
                    if (!califrsAsset(year-2, 3, 3)) {
                        return false;
                    }
                }
                if (quarter === 3 || quarter === 2) {
                    if (quarterIsEmpty(asset[year][quarter-1])) {
                        asset[year].splice(quarter-1, 1);
                    }
                    if (quarterIsEmpty(asset[year-1][quarter-1])) {
                        asset[year-1].splice(quarter-1, 1);
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
            if (!asset[year][quarter-1] || !no_cover) {
                asset[year][quarter-1] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                if (getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0)) {
                    asset[year][quarter-1].share = getParameter(xml, 'tw-gaap-ci:Capital', 0);
                    asset[year][quarter-1].cash = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0);
                    asset[year][quarter-1].property = getParameter(xml, 'tw-gaap-ci:FixedAssets', 0);
                    asset[year][quarter-1].equityParent = getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 0);
                    asset[year][quarter-1].equityChild = getParameter(xml, 'tw-gaap-ci:MinorityInterest', 0);
                    asset[year][quarter-1].total = getParameter(xml, 'tw-gaap-ci:Assets', 0);
                    asset[year][quarter-1].longterm = getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 0);
                    asset[year][quarter-1].receivable = getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 0) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 0) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 0) + getParameter(xml, 'tw-gaap-ci:NetAccountsReceivableRelatedParties', 0) + getParameter(xml, 'tw-gaap-ci:OtherReceivablesRelatedParties', 0) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivableRelatedParties', 0) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', 0);
                    asset[year][quarter-1].inventories = getParameter(xml, 'tw-gaap-ci:Inventories', 0);
                    asset[year][quarter-1].payable = getParameter(xml, 'tw-gaap-ci:AccountsPayable', 0) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 0) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 0) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 0) + getParameter(xml, 'tw-gaap-ci:BillingsConstructionProcess_2264yy', 0) + getParameter(xml, 'tw-gaap-ci:AdvanceReceipts', 0) + getParameter(xml, 'tw-gaap-ci:AccountsPayableRelatedParties', 0) + getParameter(xml, 'tw-gaap-ci:NotesPayableRelatedParties', 0) + getParameter(xml, 'tw-gaap-ci:ReceiptsCustody', 0);
                    asset[year][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-ci:LongTermLiabilities', 0);
                    asset[year][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-ci:Liabilities', 0) - asset[year][quarter-1].noncurrent_liabilities;
                } else if (getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 0)) {
                    asset[year][quarter-1].share = getParameter(xml, 'tw-gaap-fh:Capital', 0);
                    asset[year][quarter-1].cash = getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 0);
                    asset[year][quarter-1].property = getParameter(xml, 'tw-gaap-fh:FixAssetsNet', 0);
                    asset[year][quarter-1].equityParent = getParameter(xml, 'tw-gaap-fh:StockholdersEquityParentCompany', 0);
                    asset[year][quarter-1].equityChild = getParameter(xml, 'tw-gaap-fh:OtherEquity-MinorityInterest', 0);
                    asset[year][quarter-1].total = getParameter(xml, 'tw-gaap-fh:Assets', 0);
                    asset[year][quarter-1].longterm = getParameter(xml, 'tw-gaap-fh:EquityInvestmentsEquityMethodNet', 0) + getParameter(xml, 'tw-gaap-fh:HeldMaturityFinancialAssetsNet', 0);
                    asset[year][quarter-1].receivable = getParameter(xml, 'tw-gaap-fh:ReceivablesNet', 0) + getParameter(xml, 'tw-gaap-fh:DueCentralBankCallLoansBanks', 0);
                    asset[year][quarter-1].inventories = getParameter(xml, 'tw-gaap-fh:LoansDiscountedNet', 0) + getParameter(xml, 'tw-gaap-fh:SecuritiesPurchasedResellAgreements', 0);
                    asset[year][quarter-1].payable = getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 0) + getParameter(xml, 'tw-gaap-fh:Deposits', 0) + getParameter(xml, 'tw-gaap-fh:Payables', 0);
                    asset[year][quarter-1].current_liabilities = asset[year][quarter-1].payable + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 0) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 0) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 0) + getParameter(xml, 'tw-gaap-fh:DueCentralBankOtherBanks', 0);
                    asset[year][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-fh:Liabilities', 0) - asset[year][quarter-1].current_liabilities;
                } else if (getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 0)) {
                    asset[year][quarter-1].share = getParameter(xml, 'tw-gaap-basi:Capital', 0);
                    asset[year][quarter-1].cash = getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 0);
                    asset[year][quarter-1].property = getParameter(xml, 'tw-gaap-basi:FixedAssets-Net', 0);
                    asset[year][quarter-1].equityParent = getParameter(xml, 'tw-gaap-basi:StockholdersEquityParentCompany', 0);
                    asset[year][quarter-1].equityChild = getParameter(xml, 'tw-gaap-basi:MinorityInterest', 0);
                    asset[year][quarter-1].total = getParameter(xml, 'tw-gaap-basi:Assets', 0);
                    asset[year][quarter-1].longterm = getParameter(xml, 'tw-gaap-basi:HeldMaturityFinancialAssetsNet', 0);
                    asset[year][quarter-1].receivable = getParameter(xml, 'tw-gaap-basi:ReceivablesNet', 0) + getParameter(xml, 'tw-gaap-basi:DueTheCentralBankCallLoansBanks-BalanceSheet', 0);
                    asset[year][quarter-1].inventories = getParameter(xml, 'tw-gaap-basi:DiscountsLoansNet', 0);
                    asset[year][quarter-1].payable = getParameter(xml, 'tw-gaap-basi:DepositsTheCentralBankBanks', 0) + getParameter(xml, 'tw-gaap-basi:DepositsRemittances', 0) + getParameter(xml, 'tw-gaap-basi:Payables', 0);
                    asset[year][quarter-1].current_liabilities = asset[year][quarter-1].payable + getParameter(xml, 'tw-gaap-basi:FinancialLiabilitiesMeasuredFairValueProfitLoss', 0) + getParameter(xml, 'tw-gaap-basi:NotesBondsIssuedRepurchaseAgreement', 0);
                    asset[year][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-basi:Liabilities', 0) - asset[year][quarter-1].current_liabilities;
                } else if (getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 0)) {
                    asset[year][quarter-1].share = getParameter(xml, 'tw-gaap-bd:CapitalStock', 0);
                    asset[year][quarter-1].cash = getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 0);
                    asset[year][quarter-1].property = getParameter(xml, 'tw-gaap-bd:FixedAssets', 0);
                    asset[year][quarter-1].equityParent = getParameter(xml, 'tw-gaap-bd:TotalParentCompanyStockholdersEquities', 0);
                    asset[year][quarter-1].equityChild = getParameter(xml, 'tw-gaap-bd:MinorityInterest', 0);
                    asset[year][quarter-1].total = getParameter(xml, 'tw-gaap-bd:Assets', 0);
                    asset[year][quarter-1].longterm = getParameter(xml, 'tw-gaap-bd:FundsLongTermInvestments', 0);
                    asset[year][quarter-1].OCFA = asset[year][quarter-1].OCFA + getParameter(xml, 'tw-gaap-bd:CustomerMarginAccount', 0);
                    asset[year][quarter-1].receivable = getParameter(xml, 'tw-gaap-bd:MarginLoansReceivable', 0) + getParameter(xml, 'tw-gaap-bd:NotesReceivable', 0) + getParameter(xml, 'tw-gaap-bd:AccountsReceivable', 0) + getParameter(xml, 'tw-gaap-bd:Prepayments', 0) + getParameter(xml, 'tw-gaap-bd:OtherReceivables', 0) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingCollateralPrice', 0) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingMargin', 0) + getParameter(xml, 'tw-gaap-bd:RefinancingMargin', 0) + getParameter(xml, 'tw-gaap-bd:RefinancingCollateralReceivable', 0) + getParameter(xml, 'tw-gaap-bd:PrepaidPensionCurrent', 0);
                    asset[year][quarter-1].inventories = getParameter(xml, 'tw-gaap-bd:FinancialAssetsMeasuredFairValueProfitLossCurrent', 0) + getParameter(xml, 'tw-gaap-bd:AvailableSaleFinancialAssetsCurrent-BalanceSheet', 0) + getParameter(xml, 'tw-gaap-bd:BondInvestmentsResaleAgreements', 0);
                    asset[year][quarter-1].payable = getParameter(xml, 'tw-gaap-bd:CommercialPaperPayable', 0) + getParameter(xml, 'tw-gaap-bd:SecuritiesFinancingRefundableDeposits', 0) + getParameter(xml, 'tw-gaap-bd:DepositsPayableSecuritiesFinancing', 0) + getParameter(xml, 'tw-gaap-bd:SecuritiesLendingRefundableDeposits', 0) + getParameter(xml, 'tw-gaap-bd:AccountsPayable', 0) + getParameter(xml, 'tw-gaap-bd:AmountsReceivedAdvance', 0) + getParameter(xml, 'tw-gaap-bd:ReceiptsCustody', 0) + getParameter(xml, 'tw-gaap-bd:OtherPayable', 0);
                    asset[year][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-bd:LongTermLiability', 0);

                    asset[year][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-bd:Liabilities', 0) - asset[year][quarter-1].noncurrent_liabilities;
                } else if (getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 0)) {
                    asset[year][quarter-1].share = getParameter(xml, 'tw-gaap-mim:Capital', 0);
                    asset[year][quarter-1].cash = getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 0);
                    asset[year][quarter-1].property = getParameter(xml, 'tw-gaap-mim:FixedAssets', 0);
                    asset[year][quarter-1].equityParent = getParameter(xml, 'tw-gaap-mim:TotalParentCompanyStockholdersEquities', 0);
                    asset[year][quarter-1].equityChild = getParameter(xml, 'tw-gaap-mim:MinorityInterest', 0);
                    asset[year][quarter-1].total = getParameter(xml, 'tw-gaap-mim:Assets', 0);
                    asset[year][quarter-1].longterm = getParameter(xml, 'tw-gaap-mim:EquityInvestmentsEquityMethod', 0) + getParameter(xml, 'tw-gaap-mim:HeldMaturityFinancialAssetsNoncurrent', 0);
                    asset[year][quarter-1].receivable = getParameter(xml, 'tw-gaap-mim:Receivables', 0) + getParameter(xml, 'tw-gaap-mim:DueCentralBankCallLoansBanks', 0) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', 0);
                    asset[year][quarter-1].inventories = getParameter(xml, 'tw-gaap-mim:Inventories', 0) + getParameter(xml, 'tw-gaap-mim:SecuritiesPurchasedResellAgreements', 0) + getParameter(xml, 'tw-gaap-mim:DiscountsLoansNet', 0);
                    asset[year][quarter-1].payable = getParameter(xml, 'tw-gaap-mim:Payables', 0) + getParameter(xml, 'tw-gaap-mim:DepositsCentralBankBanks', 0) + getParameter(xml, 'tw-gaap-mim:DepositsRemittances', 0);
                    asset[year][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-mim:LongtermLiabilities', 0);
                    asset[year][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-mim:Liabilities', 0) - asset[year][quarter-1].noncurrent_liabilities;
                } else {
                    console.log('unknown finance data');
                    return false;
                }
            }
            if (!asset[year-1][quarter-1] || !no_cover) {
                asset[year-1][quarter-1] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                if (getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1)) {
                    asset[year-1][quarter-1].share = getParameter(xml, 'tw-gaap-ci:Capital', 1);
                    asset[year-1][quarter-1].cash = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1);
                    asset[year-1][quarter-1].property = getParameter(xml, 'tw-gaap-ci:FixedAssets', 1);
                    asset[year-1][quarter-1].equityParent = getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 1);
                    asset[year-1][quarter-1].equityChild = getParameter(xml, 'tw-gaap-ci:MinorityInterest', 1);
                    asset[year-1][quarter-1].total = getParameter(xml, 'tw-gaap-ci:Assets', 1);
                    asset[year-1][quarter-1].longterm = getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 1);
                    asset[year-1][quarter-1].receivable = getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 1) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 1) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 1) + getParameter(xml, 'tw-gaap-ci:NetAccountsReceivableRelatedParties', 1) + getParameter(xml, 'tw-gaap-ci:OtherReceivablesRelatedParties', 1) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivableRelatedParties', 1) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', 1);
                    asset[year-1][quarter-1].inventories = getParameter(xml, 'tw-gaap-ci:Inventories', 1);
                    asset[year-1][quarter-1].payable = getParameter(xml, 'tw-gaap-ci:AccountsPayable', 1) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 1) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 1) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 1);
                    asset[year-1][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-ci:LongTermLiabilities', 1);
                    asset[year-1][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-ci:Liabilities', 1) - asset[year-1][quarter-1].noncurrent_liabilities;
                } else if (getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 1)) {
                    asset[year-1][quarter-1].share = getParameter(xml, 'tw-gaap-fh:Capital', 1);
                    asset[year-1][quarter-1].cash = getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 1);
                    asset[year-1][quarter-1].property = getParameter(xml, 'tw-gaap-fh:FixAssetsNet', 1);
                    asset[year-1][quarter-1].equityParent = getParameter(xml, 'tw-gaap-fh:StockholdersEquityParentCompany', 1);
                    asset[year-1][quarter-1].equityChild = getParameter(xml, 'tw-gaap-fh:OtherEquity-MinorityInterest', 1);
                    asset[year-1][quarter-1].total = getParameter(xml, 'tw-gaap-fh:Assets', 1);
                    asset[year-1][quarter-1].longterm = getParameter(xml, 'tw-gaap-fh:EquityInvestmentsEquityMethodNet', 1) + getParameter(xml, 'tw-gaap-fh:HeldMaturityFinancialAssetsNet', 1);
                    asset[year-1][quarter-1].receivable = getParameter(xml, 'tw-gaap-fh:ReceivablesNet', 1) + getParameter(xml, 'tw-gaap-fh:DueCentralBankCallLoansBanks', 1);
                    asset[year-1][quarter-1].inventories = getParameter(xml, 'tw-gaap-fh:LoansDiscountedNet', 1) + getParameter(xml, 'tw-gaap-fh:SecuritiesPurchasedResellAgreements', 1);
                    asset[year-1][quarter-1].payable = getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 1) + getParameter(xml, 'tw-gaap-fh:Deposits', 1) + getParameter(xml, 'tw-gaap-fh:Payables', 1);
                    asset[year-1][quarter-1].current_liabilities = asset[year-1][quarter-1].payable + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 1) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 1) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 1) + getParameter(xml, 'tw-gaap-fh:DueCentralBankOtherBanks', 1);
                    asset[year-1][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-fh:Liabilities', 1) - asset[year-1][quarter-1].current_liabilities;
                } else if (getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 1)) {
                    asset[year-1][quarter-1].share = getParameter(xml, 'tw-gaap-basi:Capital', 1);
                    asset[year-1][quarter-1].cash = getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', 1);
                    asset[year-1][quarter-1].property = getParameter(xml, 'tw-gaap-basi:FixedAssets-Net', 1);
                    asset[year-1][quarter-1].equityParent = getParameter(xml, 'tw-gaap-basi:StockholdersEquityParentCompany', 1);
                    asset[year-1][quarter-1].equityChild = getParameter(xml, 'tw-gaap-basi:MinorityInterest', 1);
                    asset[year-1][quarter-1].total = getParameter(xml, 'tw-gaap-basi:Assets', 1);
                    asset[year-1][quarter-1].longterm = getParameter(xml, 'tw-gaap-basi:HeldMaturityFinancialAssetsNet', 1);
                    asset[year-1][quarter-1].receivable = getParameter(xml, 'tw-gaap-basi:ReceivablesNet', 1) + getParameter(xml, 'tw-gaap-basi:DueTheCentralBankCallLoansBanks-BalanceSheet', 1);
                    asset[year-1][quarter-1].inventories = getParameter(xml, 'tw-gaap-basi:DiscountsLoansNet', 1);
                    asset[year-1][quarter-1].payable = getParameter(xml, 'tw-gaap-basi:DepositsTheCentralBankBanks', 1) + getParameter(xml, 'tw-gaap-basi:DepositsRemittances', 1) + getParameter(xml, 'tw-gaap-basi:Payables', 1);
                    asset[year-1][quarter-1].current_liabilities = asset[year-1][quarter-1].payable + getParameter(xml, 'tw-gaap-basi:FinancialLiabilitiesMeasuredFairValueProfitLoss', 1) + getParameter(xml, 'tw-gaap-basi:NotesBondsIssuedRepurchaseAgreement', 1);
                    asset[year-1][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-basi:Liabilities', 1) - asset[year-1][quarter-1].current_liabilities;
                } else if (getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 1)) {
                    asset[year-1][quarter-1].share = getParameter(xml, 'tw-gaap-bd:CapitalStock', 1);
                    asset[year-1][quarter-1].cash = getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', 1);
                    asset[year-1][quarter-1].property = getParameter(xml, 'tw-gaap-bd:FixedAssets', 1);
                    asset[year-1][quarter-1].equityParent = getParameter(xml, 'tw-gaap-bd:TotalParentCompanyStockholdersEquities', 1);
                    asset[year-1][quarter-1].equityChild = getParameter(xml, 'tw-gaap-bd:MinorityInterest', 1);
                    asset[year-1][quarter-1].total = getParameter(xml, 'tw-gaap-bd:Assets', 1);
                    asset[year-1][quarter-1].longterm = getParameter(xml, 'tw-gaap-bd:FundsLongTermInvestments', 1);
                    asset[year-1][quarter-1].OCFA = asset[year-1][quarter-1].OCFA + getParameter(xml, 'tw-gaap-bd:CustomerMarginAccount', 1);
                    asset[year-1][quarter-1].receivable = getParameter(xml, 'tw-gaap-bd:MarginLoansReceivable', 1) + getParameter(xml, 'tw-gaap-bd:NotesReceivable', 1) + getParameter(xml, 'tw-gaap-bd:AccountsReceivable', 1) + getParameter(xml, 'tw-gaap-bd:Prepayments', 1) + getParameter(xml, 'tw-gaap-bd:OtherReceivables', 1) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingCollateralPrice', 1) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingMargin', 1) + getParameter(xml, 'tw-gaap-bd:RefinancingMargin', 1) + getParameter(xml, 'tw-gaap-bd:RefinancingCollateralReceivable', 1) + getParameter(xml, 'tw-gaap-bd:PrepaidPensionCurrent', 1);
                    asset[year-1][quarter-1].inventories = getParameter(xml, 'tw-gaap-bd:FinancialAssetsMeasuredFairValueProfitLossCurrent', 1) + getParameter(xml, 'tw-gaap-bd:AvailableSaleFinancialAssetsCurrent-BalanceSheet', 1) + getParameter(xml, 'tw-gaap-bd:BondInvestmentsResaleAgreements', 1);
                    asset[year-1][quarter-1].payable = getParameter(xml, 'tw-gaap-bd:CommercialPaperPayable', 1) + getParameter(xml, 'tw-gaap-bd:SecuritiesFinancingRefundableDeposits', 1) + getParameter(xml, 'tw-gaap-bd:DepositsPayableSecuritiesFinancing', 1) + getParameter(xml, 'tw-gaap-bd:SecuritiesLendingRefundableDeposits', 1) + getParameter(xml, 'tw-gaap-bd:AccountsPayable', 1) + getParameter(xml, 'tw-gaap-bd:AmountsReceivedAdvance', 1) + getParameter(xml, 'tw-gaap-bd:ReceiptsCustody', 1) + getParameter(xml, 'tw-gaap-bd:OtherPayable', 1);
                    asset[year-1][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-bd:LongTermLiability', 1);

                    asset[year-1][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-bd:Liabilities', 1) - asset[year-1][quarter-1].noncurrent_liabilities;
                } else if (getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 1)) {
                    asset[year-1][quarter-1].share = getParameter(xml, 'tw-gaap-mim:Capital', 1);
                    asset[year-1][quarter-1].cash = getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', 1);
                    asset[year-1][quarter-1].property = getParameter(xml, 'tw-gaap-mim:FixedAssets', 1);
                    asset[year-1][quarter-1].equityParent = getParameter(xml, 'tw-gaap-mim:TotalParentCompanyStockholdersEquities', 1);
                    asset[year-1][quarter-1].equityChild = getParameter(xml, 'tw-gaap-mim:MinorityInterest', 1);
                    asset[year-1][quarter-1].total = getParameter(xml, 'tw-gaap-mim:Assets', 1);
                    asset[year-1][quarter-1].longterm = getParameter(xml, 'tw-gaap-mim:EquityInvestmentsEquityMethod', 1) + getParameter(xml, 'tw-gaap-mim:HeldMaturityFinancialAssetsNoncurrent', 1);
                    asset[year-1][quarter-1].receivable = getParameter(xml, 'tw-gaap-mim:Receivables', 1) + getParameter(xml, 'tw-gaap-mim:DueCentralBankCallLoansBanks', 1) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', 1);
                    asset[year-1][quarter-1].inventories = getParameter(xml, 'tw-gaap-mim:Inventories', 1) + getParameter(xml, 'tw-gaap-mim:SecuritiesPurchasedResellAgreements', 1) + getParameter(xml, 'tw-gaap-mim:DiscountsLoansNet', 1);
                    asset[year-1][quarter-1].payable = getParameter(xml, 'tw-gaap-mim:Payables', 1) + getParameter(xml, 'tw-gaap-mim:DepositsCentralBankBanks', 1) + getParameter(xml, 'tw-gaap-mim:DepositsRemittances', 1);
                    asset[year-1][quarter-1].noncurrent_liabilities = getParameter(xml, 'tw-gaap-mim:LongtermLiabilities', 1);
                    asset[year-1][quarter-1].current_liabilities = getParameter(xml, 'tw-gaap-mim:Liabilities', 1) - asset[year-1][quarter-1].noncurrent_liabilities;
                }
            }
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
        function califrsAsset(y, q, ai, is_must) {
            asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
            if (getParameter(xml, 'tifrs-bsci-ci:CapitalStock', ai)) {
                asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai);
                asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                asset[y][q].share = getParameter(xml, 'tifrs-bsci-ci:CapitalStock', ai);
                asset[y][q].inventories = getParameter(xml, 'ifrs:Inventories', ai);
                asset[y][q].longterm = getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai);
                asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', ai) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesReceivableNet', ai) + getParameter(xml, 'tifrs-bsci-ci:ConstructionContractsReceivable', ai) + getParameter(xml, 'tifrs-bsci-ci:Prepayments', ai);
                asset[y][q].payable = getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:AccountsPayableToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', ai) + getParameter(xml, 'tifrs-bsci-ci:ShorttermNotesAndBillsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesPayableToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-ci:ConstructionContractsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:ReceiptsUnderCustody', ai);
                asset[y][q].current_liabilities = getParameter(xml, 'ifrs:CurrentLiabilities', ai);
                asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
            } else if (getParameter(xml, 'tifrs-bsci-fh:Capital', ai)) {
                asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                asset[y][q].share = getParameter(xml, 'tifrs-bsci-fh:Capital', ai);
                asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai);
                asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', ai) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', ai);
                asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', ai) + getParameter(xml, 'tifrs-bsci-fh:HeldToMaturityFinancialAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-fh:ReinsuranceContractAssetsNet', ai);
                asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', ai) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', ai);
                asset[y][q].payable = getParameter(xml, 'tifrs-bsci-fh:Payables', ai) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-fh:Deposits', ai);
                asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tifrs-bsci-fh:DueToTheCentralBankAndBanks', ai) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', ai) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', ai) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialLiabilitiesForHedging', ai) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', ai);
                asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
            } else if (getParameter(xml, 'tifrs-bsci-basi:Capital', ai)) {
                asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                asset[y][q].share = getParameter(xml, 'tifrs-bsci-basi:Capital', ai);
                asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai);
                asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-basi:DiscountsAndLoansNet', ai);
                asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-basi:HeldToMaturityFinancialAssets', ai);
                asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-basi:Receivables', ai) + getParameter(xml, 'tifrs-bsci-basi:DueFromTheCentralBankAndCallLoansToBanks', ai);
                asset[y][q].payable = getParameter(xml, 'tifrs-bsci-basi:Payables', ai) + getParameter(xml, 'tifrs-bsci-basi:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-basi:DepositsAndRemittances', ai);
                asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tifrs-bsci-basi:DueToTheCentralBankAndBanks', ai) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-basi:NotesAndBondsIssuedUnderRepurchaseAgreement', ai) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', ai);
                asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
            } else if (getParameter(xml, 'tifrs-bsci-bd:CapitalStock', ai)) {
                asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai) + getParameter(xml, 'tifrs-bsci-bd:CustomerMarginAccount', ai);;
                asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai) + getParameter(xml, 'tifrs-bsci-bd:PropertyAndEquipment', ai);
                asset[y][q].share = getParameter(xml, 'tifrs-bsci-bd:CapitalStock', ai);
                asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai);
                asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-bd:CurrentFinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-bd:AvailableForSaleCurrentFinancialAssets', ai) + getParameter(xml, 'tifrs-bsci-bd:BondInvestmentsUnderResaleAgreements', ai);
                asset[y][q].longterm = getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai) + getParameter(xml, 'tifrs-bsci-bd:NoncurrentFinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-bd:NoncurrentFinancialAssetsAtCost', ai) + getParameter(xml, 'tifrs-bsci-bd:AvailableForSaleNoncurrentFinancialAssets', ai);
                asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-bd:MarginLoansReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:NotesReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:AccountsReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:Prepayments', ai) + getParameter(xml, 'tifrs-bsci-bd:OtherReceivables', ai) + getParameter(xml, 'tifrs-bsci-bd:SecurityBorrowingCollateralPrice', ai) + getParameter(xml, 'tifrs-bsci-bd:SecurityBorrowingMargin', ai) + getParameter(xml, 'tifrs-bsci-bd:RefinancingMargin', ai) + getParameter(xml, 'tifrs-bsci-bd:RefinancingCollateralReceivable', ai);
                asset[y][q].payable = getParameter(xml, 'tifrs-bsci-bd:CommercialPaperPayable', ai) + getParameter(xml, 'tifrs-bsci-bd:SecuritiesFinancingRefundableDeposits', ai) + getParameter(xml, 'tifrs-bsci-bd:DepositsPayableForSecuritiesFinancing', ai) + getParameter(xml, 'tifrs-bsci-bd:SecuritiesLendingRefundableDeposits', ai) + getParameter(xml, 'tifrs-bsci-bd:AccountsPayable', ai) + getParameter(xml, 'tifrs-bsci-bd:AdvanceReceipts', ai) + getParameter(xml, 'tifrs-bsci-bd:ReceiptsUnderCustody', ai) + getParameter(xml, 'tifrs-bsci-bd:OtherPayables', ai);
                asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:NoncurrentLiabilities', ai);
                asset[y][q].current_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
            } else if (getParameter(xml, 'tifrs-bsci-mim:Capital', ai)) {
                asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                asset[y][q].share = getParameter(xml, 'tifrs-bsci-mim:Capital', ai);
                asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai);
                asset[y][q].inventories = getParameter(xml, 'ifrs:Inventories', ai) + getParameter(xml, 'tifrs-bsci-mim:SecuritiesPurchasedUnderResellAgreements', ai) + getParameter(xml, 'tifrs-bsci-mim:DiscountsAndLoansNet', ai);
                asset[y][q].longterm = getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai) + getParameter(xml, 'tifrs-bsci-mim:NoncurrentHeldToMaturityFinancialAssetsNet', ai);
                asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-mim:ReceivablesNet', ai) + getParameter(xml, 'tifrs-bsci-mim:ReceivablesDueFromRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-mim:DueFromTheCentralBankAndCallLoansToBanks', ai) + getParameter(xml, 'tifrs-bsci-mim:Prepayments', ai);
                asset[y][q].payable = getParameter(xml, 'tifrs-bsci-mim:Payables', ai) + getParameter(xml, 'tifrs-bsci-mim:PayablesToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-mim:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-mim:DepositsAndRemittances', ai);
                asset[y][q].current_liabilities = getParameter(xml, 'ifrs:CurrentLiabilities', ai);
                asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
            } else if (is_must) {
                console.log('unknown finance data');
                return false;
            }
            return true;
        }
    },
    getSales: function(xml, sales, no_cover) {
        if (!xml.xbrl) {
            for (var i in xml) {
                xml.xbrl = xml[i];
                break;
            }
            if (!xml.xbrl) {
                console.log('xml lost');
                return false;
            }
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
        } else {
            if (xml.xbrl['tw-gaap-ci:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-ci:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-mim:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-mim:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-basi:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-basi:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else if (xml.xbrl['tw-gaap-bd:CashCashEquivalents']){
                var xml_date = xml.xbrl['tw-gaap-bd:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
            } else {
                console.log('umknown date');
                return false;
            }
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
        if (!sales[year]) {
            sales[year] = [];
        }
        if (!sales[year-1]) {
            sales[year-1] = [];
        }
        if (type === 1) {
            if (quarter === 4 || quarter === 1) {
                if (!sales[year][quarter-1] || !no_cover) {
                    if (!califrsSales(year, quarter-1, 0, 1)) {
                        return false;
                    }
                }
                if (!sales[year-1][quarter-1] || !no_cover) {
                    if (!califrsSales(year-1, quarter-1, 1)) {
                        return false;
                    }
                }
            } else if (quarter === 3 || quarter === 2) {
                if (!sales[year][quarter-1] || !no_cover) {
                    if (!califrsSales(year, quarter-1, 2, 1)) {
                        return false;
                    }
                }
                if (!sales[year-1][quarter-1] || !no_cover) {
                    if (!califrsSales(year-1, quarter-1, 3)) {
                        return false;
                    }
                }
            }
        } else {
            if (!sales[year][quarter-1] || !no_cover) {
                sales[year][quarter-1] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                if (getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 0)) {
                    sales[year][quarter-1].revenue = getParameter(xml, 'tw-gaap-ci:OperatingRevenue', 0);
                    sales[year][quarter-1].cost = getParameter(xml, 'tw-gaap-ci:OperatingCosts', 0);
                    sales[year][quarter-1].gross_profit = getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 0);
                    sales[year][quarter-1].expenses = getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 0);
                    sales[year][quarter-1].operating = getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 0);
                    sales[year][quarter-1].profit = getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 0);
                    sales[year][quarter-1].tax = getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0);
                    sales[year][quarter-1].nonoperating = getParameter(xml, 'tw-gaap-ci:NonOperatingIncomeGains', 0) - getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 0);
                    sales[year][quarter-1].eps = getParameter(xml, 'tw-gaap-ci:PrimaryEarningsPerShare', 0);
                    sales[year][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-ci:InterestExpense', 0);
                } else if (getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 0)) {
                    sales[year][quarter-1].revenue = getParameter(xml, 'tw-gaap-fh:InterestIncomes', 0) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 0) + getParameter(xml, 'tw-gaap-fh:NetServiceFeeChargeCommissionsIncomeLoss', 0);
                    sales[year][quarter-1].cost = getParameter(xml, 'tw-gaap-fh:InterestExpenses', 0) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 0) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 0);
                    sales[year][quarter-1].gross_profit = sales[year][quarter-1].revenue - sales[year][quarter-1].cost;
                    sales[year][quarter-1].expenses = getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 0);
                    sales[year][quarter-1].operating = sales[year][quarter-1].gross_profit - sales[year][quarter-1].expenses;
                    sales[year][quarter-1].profit = getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 0);
                    sales[year][quarter-1].tax = -getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 0);
                    sales[year][quarter-1].nonoperating = sales[year][quarter-1].profit + sales[year][quarter-1].tax - sales[year][quarter-1].operating;
                    sales[year][quarter-1].eps = getParameter(xml, 'tw-gaap-fh:PrimaryEarningsPerShare', 0);
                    sales[year][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-fh:BadDebtExpensesLoan', 0);
                } else if (getParameter(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', 0)) {
                    sales[year][quarter-1].revenue = getParameter(xml, 'tw-gaap-basi:InterestIncomes', 0) + getParameter(xml, 'tw-gaap-basi:ServiceFee', 0);
                    sales[year][quarter-1].cost = getParameter(xml, 'tw-gaap-basi:InterestExpenses', 0) + getParameter(xml, 'tw-gaap-basi:ServiceCharge', 0);
                    sales[year][quarter-1].gross_profit = sales[year][quarter-1].revenue - sales[year][quarter-1].cost;
                    sales[year][quarter-1].expenses = getParameter(xml, 'tw-gaap-basi:PersonnelExpenses', 0) + getParameter(xml, 'tw-gaap-basi:DepreciationAmortizationExpense', 0) + getParameter(xml, 'tw-gaap-basi:OtherGeneralAdministrativeExpenses', 0);
                    sales[year][quarter-1].operating = sales[year][quarter-1].gross_profit - sales[year][quarter-1].expenses;
                    sales[year][quarter-1].profit = getParameter(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', 0);
                    sales[year][quarter-1].tax = -getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', 0);
                    sales[year][quarter-1].nonoperating = sales[year][quarter-1].profit + sales[year][quarter-1].tax - sales[year][quarter-1].operating;
                    sales[year][quarter-1].eps = getParameter(xml, 'tw-gaap-basi:PrimaryEarningsPerShare', 0);
                    sales[year][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-basi:BadDebtExpensesLoan', 0);
                } else if (getParameter(xml, 'tw-gaap-bd:ConsolidatedNetIncome', 0)) {
                    sales[year][quarter-1].revenue = getParameter(xml, 'tw-gaap-bd:Revenue', 0) - getParameter(xml, 'tw-gaap-bd:ValuationGainsOperatingSecurities', 0) - getParameter(xml, 'tw-gaap-bd:ValuationGainsBorrowedSecuritiesBondsResaleAgreementsShortSales', 0) - getParameter(xml, 'tw-gaap-bd:NonOperatingRevenuesGains', 0);
                    sales[year][quarter-1].expenses = getParameter(xml, 'tw-gaap-bd:OperatingExpenses', 0);
                    sales[year][quarter-1].cost = getParameter(xml, 'tw-gaap-bd:Expenditure', 0) - sales[year][quarter-1].expenses - getParameter(xml, 'tw-gaap-bd:NonOperatingExpenseLoss', 0);
                    sales[year][quarter-1].gross_profit = sales[year][quarter-1].revenue - sales[year][quarter-1].cost;
                    sales[year][quarter-1].operating = sales[year][quarter-1].gross_profit - sales[year][quarter-1].expenses;
                    sales[year][quarter-1].profit = getParameter(xml, 'tw-gaap-bd:ConsolidatedNetIncome', 0);
                    sales[year][quarter-1].tax = getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', 0);
                    sales[year][quarter-1].nonoperating = sales[year][quarter-1].profit + sales[year][quarter-1].tax - sales[year][quarter-1].operating;
                    sales[year][quarter-1].eps = getParameter(xml, 'tw-gaap-bd:PrimaryEarningsPerShare', 0);
                    sales[year][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-bd:InterestExpenses', 0);
                } else if (getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', 0)) {
                    sales[year][quarter-1].revenue = getParameter(xml, 'tw-gaap-mim:InterestIncomes', 0) + getParameter(xml, 'tw-gaap-mim:ServiceFee', 0) + getParameter(xml, 'tw-gaap-mim:NetSales', 0);
                    sales[year][quarter-1].cost = getParameter(xml, 'tw-gaap-mim:InterestExpenses', 0) + getParameter(xml, 'tw-gaap-mim:CostSales', 0);
                    sales[year][quarter-1].gross_profit = sales[year][quarter-1].revenue - sales[year][quarter-1].cost;
                    sales[year][quarter-1].expenses = getParameter(xml, 'tw-gaap-mim:OperatingExpenses', 0);
                    sales[year][quarter-1].operating = sales[year][quarter-1].gross_profit - sales[year][quarter-1].expenses;
                    sales[year][quarter-1].profit = getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', 0);
                    sales[year][quarter-1].tax = getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', 0);
                    sales[year][quarter-1].nonoperating = sales[year][quarter-1].profit + sales[year][quarter-1].tax - sales[year][quarter-1].operating;
                    sales[year][quarter-1].eps = getParameter(xml, 'tw-gaap-mim:PrimaryEarningsPerShare', 0);
                    sales[year][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-mim:BadDebtExpensesLoan', 0);

                } else {
                    console.log('unknown finance data');
                    return false;
                }
            }
            if (!sales[year-1][quarter-1] || !no_cover) {
                sales[year-1][quarter-1] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                if (getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 1)) {
                    sales[year-1][quarter-1].revenue = getParameter(xml, 'tw-gaap-ci:OperatingRevenue', 1);
                    sales[year-1][quarter-1].cost = getParameter(xml, 'tw-gaap-ci:OperatingCosts', 1);
                    sales[year-1][quarter-1].gross_profit = getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 1);
                    sales[year-1][quarter-1].expenses = getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 1);
                    sales[year-1][quarter-1].operating = getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 1);
                    sales[year-1][quarter-1].profit = getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 1);
                    sales[year-1][quarter-1].tax = getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1);
                    sales[year-1][quarter-1].nonoperating = getParameter(xml, 'tw-gaap-ci:NonOperatingIncomeGains', 1) - getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 1);
                    sales[year-1][quarter-1].eps = getParameter(xml, 'tw-gaap-ci:PrimaryEarningsPerShare', 1);
                    sales[year-1][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-ci:InterestExpense', 1);
                } else if (getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 1)) {
                    sales[year-1][quarter-1].revenue = getParameter(xml, 'tw-gaap-fh:InterestIncomes', 1) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 1) + getParameter(xml, 'tw-gaap-fh:NetServiceFeeChargeCommissionsIncomeLoss', 1);
                    sales[year-1][quarter-1].cost = getParameter(xml, 'tw-gaap-fh:InterestExpenses', 1) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 1) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 1);
                    sales[year-1][quarter-1].gross_profit = sales[year-1][quarter-1].revenue - sales[year-1][quarter-1].cost;
                    sales[year-1][quarter-1].expenses = getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 1);
                    sales[year-1][quarter-1].operating = sales[year-1][quarter-1].gross_profit - sales[year-1][quarter-1].expenses;
                    sales[year-1][quarter-1].profit = getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 1);
                    sales[year-1][quarter-1].tax = -getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 1);
                    sales[year-1][quarter-1].nonoperating = sales[year-1][quarter-1].profit + sales[year-1][quarter-1].tax - sales[year-1][quarter-1].operating;
                    sales[year-1][quarter-1].eps = getParameter(xml, 'tw-gaap-fh:PrimaryEarningsPerShare', 1);
                    sales[year-1][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-fh:BadDebtExpensesLoan', 1);
                } else if (getParameter(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', 1)) {
                    sales[year-1][quarter-1].revenue = getParameter(xml, 'tw-gaap-basi:InterestIncomes', 1) + getParameter(xml, 'tw-gaap-basi:ServiceFee', 1);
                    sales[year-1][quarter-1].cost = getParameter(xml, 'tw-gaap-basi:InterestExpenses', 1) + getParameter(xml, 'tw-gaap-basi:ServiceCharge', 1);
                    sales[year-1][quarter-1].gross_profit = sales[year-1][quarter-1].revenue - sales[year-1][quarter-1].cost;
                    sales[year-1][quarter-1].expenses = getParameter(xml, 'tw-gaap-basi:PersonnelExpenses', 1) + getParameter(xml, 'tw-gaap-basi:DepreciationAmortizationExpense', 1) + getParameter(xml, 'tw-gaap-basi:OtherGeneralAdministrativeExpenses', 1);
                    sales[year-1][quarter-1].operating = sales[year-1][quarter-1].gross_profit - sales[year-1][quarter-1].expenses;
                    sales[year-1][quarter-1].profit = getParameter(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', 1);
                    sales[year-1][quarter-1].tax = -getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', 1);
                    sales[year-1][quarter-1].nonoperating = sales[year-1][quarter-1].profit + sales[year-1][quarter-1].tax - sales[year-1][quarter-1].operating;
                    sales[year-1][quarter-1].eps = getParameter(xml, 'tw-gaap-basi:PrimaryEarningsPerShare', 1);
                    sales[year-1][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-basi:BadDebtExpensesLoan', 1);
                } else if (getParameter(xml, 'tw-gaap-bd:ConsolidatedNetIncome', 1)) {
                    sales[year-1][quarter-1].revenue = getParameter(xml, 'tw-gaap-bd:Revenue', 1) - getParameter(xml, 'tw-gaap-bd:ValuationGainsOperatingSecurities', 1) - getParameter(xml, 'tw-gaap-bd:ValuationGainsBorrowedSecuritiesBondsResaleAgreementsShortSales', 1) - getParameter(xml, 'tw-gaap-bd:NonOperatingRevenuesGains', 1);
                    sales[year-1][quarter-1].expenses = getParameter(xml, 'tw-gaap-bd:OperatingExpenses', 1);
                    sales[year-1][quarter-1].cost = getParameter(xml, 'tw-gaap-bd:Expenditure', 1) - sales[year-1][quarter-1].expenses - getParameter(xml, 'tw-gaap-bd:NonOperatingExpenseLoss', 1);
                    sales[year-1][quarter-1].gross_profit = sales[year-1][quarter-1].revenue - sales[year-1][quarter-1].cost;
                    sales[year-1][quarter-1].operating = sales[year-1][quarter-1].gross_profit - sales[year-1][quarter-1].expenses;
                    sales[year-1][quarter-1].profit = getParameter(xml, 'tw-gaap-bd:ConsolidatedNetIncome', 1);
                    sales[year-1][quarter-1].tax = getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', 1);
                    sales[year-1][quarter-1].nonoperating = sales[year-1][quarter-1].profit + sales[year-1][quarter-1].tax - sales[year-1][quarter-1].operating;
                    sales[year-1][quarter-1].eps = getParameter(xml, 'tw-gaap-bd:PrimaryEarningsPerShare', 1);
                    sales[year-1][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-bd:InterestExpenses', 1);
                } else if (getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', 1)) {
                    sales[year-1][quarter-1].revenue = getParameter(xml, 'tw-gaap-mim:InterestIncomes', 1) + getParameter(xml, 'tw-gaap-mim:ServiceFee', 1) + getParameter(xml, 'tw-gaap-mim:NetSales', 1);
                    sales[year-1][quarter-1].cost = getParameter(xml, 'tw-gaap-mim:InterestExpenses', 1) + getParameter(xml, 'tw-gaap-mim:CostSales', 1);
                    sales[year-1][quarter-1].gross_profit = sales[year-1][quarter-1].revenue - sales[year-1][quarter-1].cost;
                    sales[year-1][quarter-1].expenses = getParameter(xml, 'tw-gaap-mim:OperatingExpenses', 1);
                    sales[year-1][quarter-1].operating = sales[year-1][quarter-1].gross_profit - sales[year-1][quarter-1].expenses;
                    sales[year-1][quarter-1].profit = getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', 1);
                    sales[year-1][quarter-1].tax = getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', 1);
                    sales[year-1][quarter-1].nonoperating = sales[year-1][quarter-1].profit + sales[year-1][quarter-1].tax - sales[year-1][quarter-1].operating;
                    sales[year-1][quarter-1].eps = getParameter(xml, 'tw-gaap-mim:PrimaryEarningsPerShare', 1);
                    sales[year-1][quarter-1].finance_cost = getParameter(xml, 'tw-gaap-mim:BadDebtExpensesLoan', 1);
                }
            }
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
        function califrsSales(y, q, si, is_must) {
            sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
            if (getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', si)) {
                sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                sales[y][q].revenue = getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', si);
                sales[y][q].cost = getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', si);
                sales[y][q].gross_profit = getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', si);
                sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', si);
                sales[y][q].operating = getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', si);
                sales[y][q].finance_cost = getParameter(xml, 'ifrs:FinanceCosts', si);
                sales[y][q].tax = getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', si);
                sales[y][q].nonoperating = getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', si);
                sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
            } else if (getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', si)) {
                sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                sales[y][q].revenue = getParameter(xml, 'ifrs:RevenueFromInterest', si) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', si) + getParameter(xml, 'tifrs-bsci-fh:NetServiceFeeChargeAndCommissionsIncomeLoss', si);
                sales[y][q].cost = getParameter(xml, 'ifrs:InterestExpense', si) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', si);
                sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', si);
                sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', si);
                sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', si);
                sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
            } else if (getParameter(xml, 'tifrs-bsci-basi:NetIncomeLossOfInterest', si)) {
                sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                sales[y][q].revenue = getParameter(xml, 'ifrs:RevenueFromInterest', si) + getParameter(xml, 'tifrs-bsci-basi:ServiceFee', si);
                sales[y][q].cost = getParameter(xml, 'ifrs:InterestExpense', si) + getParameter(xml, 'tifrs-bsci-basi:ServiceCharge', si);
                sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-basi:OperatingExpense', si);
                sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-basi:BadDebtExpensesAndGuaranteeLiabilityProvision', si);
                sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-basi:TaxIncomeExpenseRelatedToComponentsOfNetIncome', si);
                sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
            } else if (getParameter(xml, 'tifrs-bsci-bd:TotalRevenue', si)) {
                sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                sales[y][q].revenue = getParameter(xml, 'tifrs-bsci-bd:TotalRevenue', si) - getParameter(xml, 'tifrs-bsci-bd:ValuationGainsLossesOnOperatingSecuritiesAtFairValueThroughProfitOrLoss', si) - getParameter(xml, 'tifrs-bsci-bd:ValuationGainsLossesOnBorrowedSecuritiesAndBondsWithResaleAgreementsShortSalesAtFairValueThroughProfitOrLoss', si);
                sales[y][q].expenses = getParameter(xml, 'ifrs:EmployeeBenefitsExpense', si) + getParameter(xml, 'ifrs:DepreciationAndAmortisationExpense', si);
                sales[y][q].finance_cost = getParameter(xml, 'ifrs:FinanceCosts', si);
                sales[y][q].cost = getParameter(xml, 'tifrs-bsci-bd:TotalExpenditureAndExpense', si) - sales[y][q].expenses - sales[y][q].finance_cost;
                sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-bd:IncomeTaxBenefitExpense', si);
                sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
            } else if (getParameter(xml, 'ifrs:Revenue', si)) {
                sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                sales[y][q].revenue = getParameter(xml, 'ifrs:RevenueFromInterest', si) + getParameter(xml, 'tifrs-bsci-mim:FeeIncome', si) + getParameter(xml, 'ifrs:RevenueFromSaleOfGoods', si) + getParameter(xml, 'ifrs:RevenueFromRenderingOfServices', si);
                sales[y][q].cost = getParameter(xml, 'ifrs:InterestExpense', si) + getParameter(xml, 'tifrs-bsci-mim:FeeExpense', si) + getParameter(xml, 'ifrs:CostOfSales', si) + getParameter(xml, 'tifrs-bsci-mim:CostOfServices', si);
                sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-mim:OperatingExpenses', si);
                sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-mim:BadDebtExpensesAndGuaranteeLiabilityProvisions', si);
                sales[y][q].tax = getParameter(xml, 'ifrs:TaxExpenseIncome', si);
                sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
            } else if (is_must){
                console.log('unknown finance data');
                return false;
            }
            return true;
        }
    },
    getCashStatus: function(cash, asset) {
        var cashStatus = {};
        for (var i in cash) {
            cashStatus[i] = [];
            for (var j in cash[i]) {
                if (cash[i][j]) {
                    cashStatus[i][j] = {end: cash[i][j].end, begin: Math.ceil(cash[i][j].begin/cash[i][j].end*100)};
                    if ((j === '1' || j === '2' || j === '3') && cash[i][Number(j)-1]) {
                        cashStatus[i][j].profitBT = Math.ceil((cash[i][j].profitBT - cash[i][Number(j)-1].profitBT)/cash[i][j].end*100);
                        cashStatus[i][j].real = Math.ceil((cash[i][j].change - cash[i][Number(j)-1].change)/cash[i][j].end*100);
                        cashStatus[i][j].operation = Math.ceil((cash[i][j].operation - cash[i][Number(j)-1].operation)/cash[i][j].end*100);
                        cashStatus[i][j].invest = Math.ceil((cash[i][j].invest - cash[i][Number(j)-1].invest)/cash[i][j].end*100);
                        cashStatus[i][j].dividends = Math.ceil((cash[i][j].dividends - cash[i][Number(j)-1].dividends)/cash[i][j].end*100);
                        cashStatus[i][j].without_dividends = Math.ceil(((cash[i][j].finance - cash[i][j].dividends) - (cash[i][Number(j)-1].finance - cash[i][Number(j)-1].dividends))/cash[i][j].end*100);
                        cashStatus[i][j].minor = Math.ceil(((cash[i][j].change - cash[i][j].operation - cash[i][j].invest - cash[i][j].finance) - (cash[i][Number(j)-1].change - cash[i][Number(j)-1].operation - cash[i][Number(j)-1].invest - cash[i][Number(j)-1].finance))/cash[i][j].end*100);
                        cashStatus[i][j].investPerProperty = Math.ceil((cash[i][j].operation - cash[i][Number(j)-1].operation)/asset[i][j].property*100);
                        cashStatus[i][j].financePerLiabilities = Math.ceil(((cash[i][j].finance - cash[i][j].dividends) - (cash[i][Number(j)-1].finance - cash[i][Number(j)-1].dividends))/(asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)*100);
                    } else {
                        cashStatus[i][j].profitBT = Math.ceil(cash[i][j].profitBT/cash[i][j].end*100);
                        cashStatus[i][j].real = Math.ceil(cash[i][j].change/cash[i][j].end*100);
                        cashStatus[i][j].operation = Math.ceil(cash[i][j].operation/cash[i][j].end*100);
                        cashStatus[i][j].invest = Math.ceil(cash[i][j].invest/cash[i][j].end*100);
                        cashStatus[i][j].dividends = Math.ceil(cash[i][j].dividends/cash[i][j].end*100);
                        cashStatus[i][j].without_dividends = Math.ceil((cash[i][j].finance - cash[i][j].dividends)/cash[i][j].end*100);
                        cashStatus[i][j].minor = Math.ceil((cash[i][j].change - cash[i][j].operation - cash[i][j].invest - cash[i][j].finance)/cash[i][j].end*100);
                        cashStatus[i][j].investPerProperty = Math.ceil(cash[i][j].operation/asset[i][j].property*100);
                        cashStatus[i][j].financePerLiabilities = Math.ceil((cash[i][j].finance - cash[i][j].dividends)/(asset[i][j].current_liabilities + asset[i][j].noncurrent_liabilities)*100);
                    }
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
                if (asset[i][j]) {
                    assetStatus[i][j] = {total: asset[i][j].total, receivable: Math.ceil(asset[i][j].receivable/asset[i][j].total*1000)/10, cash: Math.ceil(asset[i][j].cash/asset[i][j].total*1000)/10, OCFA: Math.ceil(asset[i][j].OCFA/asset[i][j].total*1000)/10, inventories: Math.ceil(asset[i][j].inventories/asset[i][j].total*1000)/10, property: Math.ceil(asset[i][j].property/asset[i][j].total*1000)/10, longterm: Math.ceil(asset[i][j].longterm/asset[i][j].total*1000)/10, other: Math.ceil((asset[i][j].total - asset[i][j].cash - asset[i][j].inventories - asset[i][j].receivable - asset[i][j].OCFA - asset[i][j].property - asset[i][j].longterm)/asset[i][j].total*1000)/10, equityChild: Math.ceil(asset[i][j].equityChild/asset[i][j].total*1000)/10 , equityParent_without_share: Math.ceil((asset[i][j].equityParent - asset[i][j].share)/asset[i][j].total*1000)/10, share: Math.ceil(asset[i][j].share/asset[i][j].total*1000)/10, noncurrent_liabilities: Math.ceil(asset[i][j].noncurrent_liabilities/asset[i][j].total*1000)/10, current_liabilities_without_payable: Math.ceil((asset[i][j].current_liabilities - asset[i][j].payable)/asset[i][j].total*1000)/10, payable: Math.ceil(asset[i][j].payable/asset[i][j].total*1000)/10};
                }
            }
        }
        return assetStatus;
    },
    getSalesStatus: function(sales, asset) {
        var salesStatus = {};
        for (var i in sales) {
            salesStatus[i] = [];
            for (var j in sales[i]) {
                if (sales[i][j]) {
                    salesStatus[i][j] = {revenue: sales[i][j].revenue, cost: Math.ceil(sales[i][j].cost/sales[i][j].revenue*1000)/10, expenses: Math.ceil(sales[i][j].expenses/sales[i][j].revenue*1000)/10, finance_cost: Math.ceil(sales[i][j].finance_cost/sales[i][j].revenue*1000)/10, nonoperating_without_FC: Math.ceil((sales[i][j].nonoperating+sales[i][j].finance_cost)/sales[i][j].revenue*1000)/10, tax: Math.ceil(sales[i][j].tax/sales[i][j].revenue*1000)/10, comprehensive: Math.ceil(sales[i][j].comprehensive/sales[i][j].revenue*1000)/10, profit: Math.ceil(sales[i][j].profit/sales[i][j].revenue*1000)/10, profit_comprehensive: Math.ceil((sales[i][j].profit+sales[i][j].comprehensive)/sales[i][j].revenue*1000)/10, eps: sales[i][j].eps};
                    if ((j === '1' || j === '2' || j === '3') && sales[i][Number(j)-1]) {
                        salesStatus[i][j].quarterRevenue = sales[i][j].revenue - sales[i][Number(j)-1].revenue;
                        salesStatus[i][j].quarterGross = Math.ceil((sales[i][j].gross_profit - sales[i][Number(j)-1].gross_profit)/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterOperating = Math.ceil((sales[i][j].operating - sales[i][Number(j)-1].operating)/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterProfit = Math.ceil((sales[i][j].profit - sales[i][Number(j)-1].profit)/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterEPS = sales[i][j].eps - sales[i][Number(j)-1].eps;
                    } else {
                        salesStatus[i][j].quarterRevenue = sales[i][j].revenue;
                        salesStatus[i][j].quarterGross = Math.ceil(sales[i][j].gross_profit/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterOperating = Math.ceil(sales[i][j].operating/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterProfit = Math.ceil(sales[i][j].profit/salesStatus[i][j].quarterRevenue*1000)/10;
                        salesStatus[i][j].quarterEPS = sales[i][j].eps;
                    }
                    salesStatus[i][j].salesPerAsset = Math.ceil(sales[i][j].revenue/asset[i][j].total*1000)/1000;
                    salesStatus[i][j].quarterSalesPerAsset = Math.ceil(salesStatus[i][j].quarterRevenue/asset[i][j].total*1000)/1000;
                }
            }
        }
        return salesStatus;
    },
    getProfitStatus: function(salesStatus, cashStatus, asset) {
        var profitStatus = {};
        for (var i in salesStatus) {
            profitStatus[i] = [];
            for (var j in salesStatus[i]) {
                profitStatus[i][j] = {gross_profit: salesStatus[i][j].quarterGross, operating_profit: salesStatus[i][j].quarterOperating, profit: salesStatus[i][j].quarterProfit, turnover: salesStatus[i][j].quarterSalesPerAsset, leverage: Math.ceil((asset[i][j].equityParent + asset[i][j].equityChild)/asset[i][j].total*1000)/1000, asset_growth: Math.ceil(salesStatus[i][j].quarterProfit*salesStatus[i][j].quarterSalesPerAsset*1000)/1000, roe: Math.ceil(salesStatus[i][j].quarterProfit*salesStatus[i][j].quarterSalesPerAsset*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*1000)/1000, operatingP: Math.ceil(cashStatus[i][j].operation*cashStatus[i][j].end/salesStatus[i][j].quarterRevenue*10)/10, operationAG: Math.ceil(cashStatus[i][j].operation*cashStatus[i][j].end/asset[i][j].total*1000)/1000, operationRoe: Math.ceil(cashStatus[i][j].operation*cashStatus[i][j].end/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*1000)/1000, oiP: Math.ceil((cashStatus[i][j].operation + cashStatus[i][j].invest)*cashStatus[i][j].end/salesStatus[i][j].quarterRevenue*10)/10, oiAG: Math.ceil((cashStatus[i][j].operation + cashStatus[i][j].invest)*cashStatus[i][j].end/asset[i][j].total*1000)/1000, oiRoe: Math.ceil((cashStatus[i][j].operation + cashStatus[i][j].invest)*cashStatus[i][j].end/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*1000)/1000, realP: Math.ceil(cashStatus[i][j].real*cashStatus[i][j].end/salesStatus[i][j].quarterRevenue*10)/10, realAG: Math.ceil(cashStatus[i][j].real*cashStatus[i][j].end/asset[i][j].total*1000)/1000, realRoe: Math.ceil(cashStatus[i][j].real*cashStatus[i][j].end/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*1000)/1000, realP_dividends: Math.ceil((cashStatus[i][j].real - cashStatus[i][j].dividends)*cashStatus[i][j].end/salesStatus[i][j].quarterRevenue*10)/10, realAG_dividends: Math.ceil((cashStatus[i][j].real - cashStatus[i][j].dividends)*cashStatus[i][j].end/asset[i][j].total*1000)/1000, realRoe_dividends: Math.ceil((cashStatus[i][j].real - cashStatus[i][j].dividends)*cashStatus[i][j].end/asset[i][j].total*(asset[i][j].total/(asset[i][j].equityParent + asset[i][j].equityChild))*1000)/1000, salesPerShare: Math.ceil(salesStatus[i][j].quarterRevenue/salesStatus[i][j].quarterEPS), quarterSales: salesStatus[i][j].quarterRevenue};
            }
        }
        return profitStatus;
    },
    getProfitIndex: function(profitStatus, startYear, endYear) {
        var index = 0;
        var denominator = 1;
        for (var i = endYear; i >= startYear; i--) {
            for (var j = 3; j >=0; j--) {
                if (profitStatus[i] && profitStatus[i][j]) {
                    index += (profitStatus[i][j].profit+profitStatus[i][j].gross_profit+profitStatus[i][j].operating_profit)*profitStatus[i][j].turnover/profitStatus[i][j].leverage/denominator;
                    denominator++;
                }
            }
        }
        return Math.ceil(index*1000)/1000;
    },
    getSafetyStatus: function(salesStatus, cashStatus, asset) {
        var safetyStatus = {};
        for (var i in salesStatus) {
            safetyStatus[i] = [];
            for (var j in salesStatus[i]) {
                safetyStatus[i][j] = {prMinusProfit: Math.ceil(asset[i][j].payable/asset[i][j].receivable*1000 - 1000 + salesStatus[i][j].quarterProfit*10)/10, prRatio: Math.ceil(asset[i][j].payable/asset[i][j].receivable*1000)/10, shortCash: Math.ceil((asset[i][j].receivable - asset[i][j].payable*2 + asset[i][j].current_liabilities - salesStatus[i][j].quarterProfit*asset[i][j].receivable/100 - cashStatus[i][j].invest * cashStatus[i][j].end / 100)/(asset[i][j].cash + asset[i][j].OCFA)*1000)/10, shortCashWithoutCL: Math.ceil((asset[i][j].receivable - asset[i][j].payable - salesStatus[i][j].quarterProfit*asset[i][j].receivable/100 - cashStatus[i][j].invest * cashStatus[i][j].end / 100)/(asset[i][j].cash + asset[i][j].OCFA)*1000)/10, shortCashWithoutInvest: Math.ceil((asset[i][j].receivable - asset[i][j].payable*2 + asset[i][j].current_liabilities - salesStatus[i][j].quarterProfit*asset[i][j].receivable/100)/(asset[i][j].cash + asset[i][j].OCFA)*1000)/10};
            }
        }
        return safetyStatus;
    },
    getSafetyIndex: function(safetyStatus) {
        var index = 0;
        var multiple = 0;
        for (var i in safetyStatus) {
            for (var j in safetyStatus[i]) {
                multiple++;
                index += (safetyStatus[i][j].shortCash+safetyStatus[i][j].shortCashWithoutCL+safetyStatus[i][j].shortCashWithoutInvest)*multiple;
            }
        }
        return -Math.ceil(index/(1+multiple)/multiple*2000)/1000;
    },
    getManagementStatus: function(salesStatus, asset) {
        var managementStatus = {};
        var revenue = [];
        var profit = [];
        var cash = [];
        var inventories = [];
        var receivable = [];
        var payable = [];
        var startY = 0;
        var startQ = 0;
        var realY = 0;
        var realQ = 0;
        for (var i in salesStatus) {
            managementStatus[i] = [];
            for (var j in salesStatus[i]) {
                if (salesStatus[i][j-1]) {
                    if (!startY && !startQ) {
                        startY = i;
                        startQ = j;
                    }
                    if (!realY && !realQ) {
                        realY = Number(i);
                        realQ = Number(j);
                    }
                    revenue.push(salesStatus[i][j].quarterRevenue);
                    profit.push(Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100));
                    cash.push(asset[i][j].cash);
                    inventories.push(asset[i][j].inventories);
                    receivable.push(asset[i][j].receivable);
                    payable.push(asset[i][j].payable);
                    managementStatus[i][j] = {revenue: salesStatus[i][j].quarterRevenue, profit: Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100), cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
                } else if (j === '0'){
                    if (!startY && !startQ) {
                        startY = i;
                        startQ = j;
                    }
                    if (!realY && !realQ) {
                        realY = Number(i);
                        realQ = Number(j);
                    }
                    revenue.push(salesStatus[i][j].quarterRevenue);
                    profit.push(Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100));
                    cash.push(asset[i][j].cash);
                    inventories.push(asset[i][j].inventories);
                    receivable.push(asset[i][j].receivable);
                    payable.push(asset[i][j].payable);
                    managementStatus[i][j] = {revenue: salesStatus[i][j].quarterRevenue, profit: Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100), cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
                } else {
                    if (!realY && !realQ) {
                        realY = Number(i);
                        realQ = Number(j);
                    }
                    managementStatus[i][j] = {revenue: salesStatus[i][j].quarterRevenue, profit: Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100), cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
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
            var bY = realY;
            var bQ = realQ;
            for (var i = 0; i < 4; i++) {
                if (bQ > 3) {
                    bQ = 0;
                    bY++;
                }
                if (managementStatus[bY][bQ]) {
                    managementStatus[bY][bQ][dataRelative] = 0;
                }
                bQ++;
            }
            for (var i = 2; i < revenue.length; i++) {
                if (Q > 3) {
                    Q = 0;
                    Y++;
                }
                Relative = 0;
                for (var j = 0; j <= i; j++) {
                    Relative += (revenue[j] - revenueEven[i-2]) * (data[j] - dataEven[i-2]);
                }
                if (managementStatus[Y][Q]) {
                    managementStatus[Y][Q][dataRelative] = Math.ceil(Relative / dataVariance[i-2] / revenueVariance[i-2] * 1000) / 1000;
                }
                Q++;
            }
        }
        return managementStatus;
    },
    getManagementIndex: function(managementStatus, year, quarter) {
        if (managementStatus) {
            return Math.ceil((managementStatus[year][quarter-1].profitRelative+managementStatus[year][quarter-1].cashRelative+managementStatus[year][quarter-1].inventoriesRelative+managementStatus[year][quarter-1].receivableRelative+managementStatus[year][quarter-1].payableRelative)*1000)/1000;
        } else {
            return 0;
        }
    },
    getSingleStock: function(type, index, callback, stage) {
        stage = typeof stage !== 'undefined' ? stage : 0;
        var cash = {};
        var asset = {};
        var sales = {};
        var this_obj = this;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var quarter = 3;
        if (month < 4) {
            quarter = 4;
            year-- ;
        } else if (month < 7) {
            quarter = 1;
        } else if (month < 10) {
            quarter = 2;
        }
        var is_start = false;
        var not = 0;
        var id_db = null;
        var wait = 0;
        var latestQuarter = 0;
        var latestYear = 0;
        var normal_tags = [];
        if (stage === 0) {
            mongo.orig("find", "stock", {_id: type}, {limit: 1}, function(err, items){
                if(err) {
                    util.handleError(err, callback, callback);
                }
                if (items.length === 0) {
                    util.handleError({hoerror: 2, message: "can not find stock!!!"}, callback, callback);
                }
                cash = items[0].cash;
                asset = items[0].asset;
                sales = items[0].sales;
                var cashStatus = this_obj.getCashStatus(cash, asset);
                var assetStatus = this_obj.getAssetStatus(asset);
                var salesStatus = this_obj.getSalesStatus(sales, asset);
                var profitStatus = this_obj.getProfitStatus(salesStatus, cashStatus, asset);
                var safetyStatus = this_obj.getSafetyStatus(salesStatus, cashStatus, asset);
                var managementStatus = this_obj.getManagementStatus(salesStatus, asset);
                var earliestYear = 0;
                var earliestQuarter = 0;
                for (var i in cash) {
                    if (!earliestYear) {
                        earliestYear = Number(i);
                    }
                    latestYear = Number(i);
                    for (var j in cash[i]) {
                        if (cash[i][j]) {
                            if (!earliestQuarter) {
                                earliestQuarter = Number(j) + 1;
                            }
                            latestQuarter = Number(j) + 1;
                        }
                    }
                }
                var profitIndex = items[0].profitIndex;
                var safetyIndex = items[0].safetyIndex;
                var managementIndex = items[0].managementIndex;
                stockTagTool.setLatest('', items[0]._id, index, function(err) {
                    if (err) {
                        util.handleError(err);
                    }
                });
                setTimeout(function(){
                    callback(null, {cash: cash, asset: asset, sales: sales, cashStatus: cashStatus, assetStatus: assetStatus, salesStatus: salesStatus, profitStatus: profitStatus, safetyStatus: safetyStatus, managementStatus: managementStatus, latestYear: latestYear, latestQuarter: latestQuarter, earliestYear: earliestYear, earliestQuarter: earliestQuarter, profitIndex: profitIndex, managementIndex: managementIndex, safetyIndex: safetyIndex, stockName: items[0].type+items[0].index+items[0].name});
                }, 0);
            });
        } else {
            mongo.orig("find", "stock", {type: type, index: index}, {limit: 1}, function(err, items){
                if(err) {
                    util.handleError(err, callback, callback);
                }
                if (items.length > 0) {
                    id_db = items[0]._id;
                    normal_tags = items[0].tags;
                    if (stage < 2) {
                        cash = items[0].cash;
                        asset = items[0].asset;
                        sales = items[0].sales;
                    }
                }
                if (!fs.existsSync('/mnt/stock/' + type + '/' + index)) {
                    mkdirp('/mnt/stock/' + type + '/' + index, function(err) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        recur_getTwseXml();
                    });
                } else {
                    recur_getTwseXml();
                }
            });
        }
        function recur_getTwseXml() {
            console.log(year);
            console.log(quarter);
            var xml_path = '/mnt/stock/' + type + '/' + index + '/' + year + quarter + '.xml';
            if (stage < 3 && is_start && fs.existsSync(xml_path)) {
                console.log('exist');
                if (!latestQuarter && !latestYear) {
                    latestQuarter = quarter;
                    latestYear = year;
                }
                if (stage < 2 && cash[year-1] && cash[year-1][quarter-1] && asset[year-1] && asset[year-1][quarter-1] && sales[year-1] && sales[year-1][quarter-1]) {
                    console.log('done');
                    wait = 0;
                    quarter--;
                    if (quarter < 1) {
                        quarter = 4;
                        year--;
                    }
                    setTimeout(function(){
                        recur_getTwseXml();
                    }, wait);
                } else {
                    console.log('parse');
                    this_obj.initXml(xml_path, function (err, xml) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        cash = this_obj.getCashflow(xml, cash, is_start);
                        if (!cash) {
                            util.handleError({hoerror: 2, message: "xml cash parse error!!!"}, callback, callback);
                        }
                        asset = this_obj.getAsset(xml, asset, is_start);
                        if (!asset) {
                            util.handleError({hoerror: 2, message: "xml asset parse error!!!"}, callback, callback);
                        }
                        sales = this_obj.getSales(xml, sales, is_start);
                        if (!sales) {
                            util.handleError({hoerror: 2, message: "xml sales parse error!!!"}, callback, callback);
                        }
                        is_start = true;
                        wait = 0;
                        quarter--;
                        if (quarter < 1) {
                            quarter = 4;
                            year--;
                        }
                        setTimeout(function(){
                            recur_getTwseXml();
                        }, wait);
                    });
                }
            } else {
                api.getTwseXml(index, year, quarter, xml_path, function(err, xmlPath) {
                    if (err) {
                        if (err.code !== 'HPE_INVALID_CONSTANT' && err.code !== 'ECONNREFUSED' && err.code !== 'ENOTFOUND' && e.code !== 'ETIMEDOUT') {
                            util.handleError(err, callback, callback);
                        }
                    }
                    if (err) {
                        util.handleError(err);
                        if (err.code === 'HPE_INVALID_CONSTANT') {
                            if (is_start) {
                                var cashStatus = this_obj.getCashStatus(cash, asset);
                                var assetStatus = this_obj.getAssetStatus(asset);
                                var salesStatus = this_obj.getSalesStatus(sales, asset);
                                var profitStatus = this_obj.getProfitStatus(salesStatus, cashStatus, asset);
                                var safetyStatus = this_obj.getSafetyStatus(salesStatus, cashStatus, asset);
                                var managementStatus = this_obj.getManagementStatus(salesStatus, asset);
                                var earliestYear = 0;
                                var earliestQuarter = 0;
                                for (var i in cash) {
                                    earliestYear = Number(i);
                                    for (var j in cash[i]) {
                                        if (cash[i][j]) {
                                            earliestQuarter = Number(j) + 1;
                                            break;
                                        }
                                    }
                                    break;
                                }
                                var profitIndex = this_obj.getProfitIndex(profitStatus, earliestYear, latestYear);
                                var safetyIndex = this_obj.getSafetyIndex(safetyStatus, earliestYear, latestYear);
                                var managementIndex = this_obj.getManagementIndex(managementStatus, latestYear, latestQuarter);
                                handleStockTag(type, index, function (err, name, tags){
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    var normal = '';
                                    for (var i in tags) {
                                        normal = stockTagTool.normalizeTag(tags[i]);
                                        if (!stockTagTool.isDefaultTag(normal)) {
                                            if (normal_tags.indexOf(normal) === -1) {
                                                normal_tags.push(normal);
                                            }
                                        }
                                    }
                                    if (id_db) {
                                        mongo.orig("update", "stock", {_id: id_db}, {$set: {cash: cash, asset: asset, sales: sales, profitIndex: profitIndex, safetyIndex: safetyIndex, managementIndex: managementIndex, tags: normal_tags, name: name}}, function(err, item2){
                                            if(err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null, {cash: cash, asset: asset, sales: sales, cashStatus: cashStatus, assetStatus: assetStatus, salesStatus: salesStatus, profitStatus: profitStatus, safetyStatus: safetyStatus, managementStatus: managementStatus, latestYear: latestYear, latestQuarter: latestQuarter, earliestYear: earliestYear, earliestQuarter: earliestQuarter, profitIndex: profitIndex, managementIndex: managementIndex, safetyIndex: safetyIndex, stockName: type+index+name, id: id_db});
                                            }, 0);
                                        });
                                    } else {
                                        mongo.orig("insert", "stock", {type: type, index: index, name: name, cash: cash, asset: asset, sales: sales, profitIndex: profitIndex, safetyIndex: safetyIndex, managementIndex: managementIndex, tags: normal_tags, important: 0}, function(err, item2){
                                            if(err) {
                                                util.handleError(err, next, callback);
                                            }
                                            setTimeout(function(){
                                                callback(null, {cash: cash, asset: asset, sales: sales, cashStatus: cashStatus, assetStatus: assetStatus, salesStatus: salesStatus, profitStatus: profitStatus, safetyStatus: safetyStatus, managementStatus: managementStatus, latestYear: latestYear, latestQuarter: latestQuarter, earliestYear: earliestYear, earliestQuarter: earliestQuarter, profitIndex: profitIndex, managementIndex: managementIndex, safetyIndex: safetyIndex, stockName: type+index+name, id: item2[0]._id});
                                            }, 0);
                                        });
                                    }
                                });
                            } else {
                                console.log('not');
                                if (not > 4) {
                                    setTimeout(function(){
                                        callback(null, null);
                                    }, 0);
                                } else {
                                    not++;
                                    quarter--;
                                    if (quarter < 1) {
                                        quarter = 4;
                                        year--;
                                    }
                                    wait = 0;
                                    setTimeout(function(){
                                        recur_getTwseXml();
                                    }, wait);
                                }
                            }
                        } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || e.code === 'ETIMEDOUT') {
                            wait += 10000;
                            setTimeout(function(){
                                recur_getTwseXml();
                            }, wait);
                        }
                    } else {
                        var stats = fs.statSync(xmlPath);
                        console.log(stats.size);
                        if (stats.size < 10000) {
                            fs.unlink(xmlPath, function (err) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                wait += 10000;
                                setTimeout(function(){
                                    recur_getTwseXml();
                                }, wait);
                            });
                        } else {
                            console.log('ok');
                            this_obj.initXml(xmlPath, function (err, xml) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                cash = this_obj.getCashflow(xml, cash, is_start);
                                if (!cash) {
                                    util.handleError({hoerror: 2, message: "xml cash parse error!!!"}, callback, callback);
                                }
                                asset = this_obj.getAsset(xml, asset, is_start);
                                if (!asset) {
                                    util.handleError({hoerror: 2, message: "xml asset parse error!!!"}, callback, callback);
                                }
                                sales = this_obj.getSales(xml, sales, is_start);
                                if (!sales) {
                                    util.handleError({hoerror: 2, message: "xml sales parse error!!!"}, callback, callback);
                                }
                                is_start = true;
                                wait = 0;
                                if (!latestQuarter && !latestYear) {
                                    latestQuarter = quarter;
                                    latestYear = year;
                                }
                                quarter--;
                                if (quarter < 1) {
                                    quarter = 4;
                                    year--;
                                }
                                setTimeout(function(){
                                    recur_getTwseXml();
                                }, wait);
                            });
                        }
                    }
                });
            }
        }
    },
    //先只抓上市
    getStockList: function(type, callback) {
        switch(type) {
            case 'twse':
            var url = 'http://mops.twse.com.tw/mops/web/ajax_t51sb01?encodeURIComponent=1&step=1&firstin=1&code=&TYPEK=';
            //sii otc rotc pub
            var filePath = config_glb.nas_tmp + "/twselist";
            var raw = [];
            var list = [];
            var index = [];
            api.xuiteDownload(url + "sii", filePath, function(err) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                if(!fs.existsSync(filePath)) {
                    util.handleError({hoerror: 2, message: "cannot get basic data"}, callback, callback);
                }
                fs.readFile(filePath, function (err,data) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    data = util.bufferToString(data);
                    fs.unlink(filePath, function(err) {
                        if (err) {
                            util.handleError(err, callback, callback);
                        }
                        raw = data.match(/<tr class=\'even\'><td nowrap>\&nbsp\;\d+\&nbsp\;/g);
                        for (var i in raw) {
                            index = raw[i].match(/\d+/);
                            if (index) {
                                list.push(index[0]);
                            }
                        }
                        /*api.xuiteDownload(url + "otc", filePath, function(err) {
                            if (err) {
                                util.handleError(err, callback, callback);
                            }
                            if(!fs.existsSync(filePath)) {
                                util.handleError({hoerror: 2, message: "cannot get basic data"}, callback, callback);
                            }
                            fs.readFile(filePath, function (err,data) {
                                if (err) {
                                    util.handleError(err, callback, callback);
                                }
                                data = util.bufferToString(data);
                                fs.unlink(filePath, function(err) {
                                    if (err) {
                                        util.handleError(err, callback, callback);
                                    }
                                    raw = data.match(/<tr class=\'even\'><td nowrap>\&nbsp\;\d+\&nbsp\;/g);
                                    for (var i in raw) {
                                        index = raw[i].match(/\d+/);
                                        if (index) {
                                            list.push(index[0]);
                                        }
                                    }
                                    api.xuiteDownload(url + "rotc", filePath, function(err) {
                                        if (err) {
                                            util.handleError(err, callback, callback);
                                        }
                                        if(!fs.existsSync(filePath)) {
                                            util.handleError({hoerror: 2, message: "cannot get basic data"}, callback, callback);
                                        }
                                        fs.readFile(filePath, function (err,data) {
                                            if (err) {
                                                util.handleError(err, callback, callback);
                                            }
                                            data = util.bufferToString(data);
                                            fs.unlink(filePath, function(err) {
                                                if (err) {
                                                    util.handleError(err, callback, callback);
                                                }
                                                raw = data.match(/<tr class=\'even\'><td nowrap>\&nbsp\;\d+\&nbsp\;/g);
                                                for (var i in raw) {
                                                    index = raw[i].match(/\d+/);
                                                    if (index) {
                                                        list.push(index[0]);
                                                    }
                                                }
                                                api.xuiteDownload(url + "pub", filePath, function(err) {
                                                    if (err) {
                                                        util.handleError(err, callback, callback);
                                                    }
                                                    if(!fs.existsSync(filePath)) {
                                                        util.handleError({hoerror: 2, message: "cannot get basic data"}, callback, callback);
                                                    }
                                                    fs.readFile(filePath, function (err,data) {
                                                        if (err) {
                                                            util.handleError(err, callback, callback);
                                                        }
                                                        data = util.bufferToString(data);
                                                        fs.unlink(filePath, function(err) {
                                                            if (err) {
                                                                util.handleError(err, callback, callback);
                                                            }
                                                            raw = data.match(/<tr class=\'even\'><td nowrap>\&nbsp\;\d+\&nbsp\;/g);
                                                            for (var i in raw) {
                                                                index = raw[i].match(/\d+/);
                                                                if (index) {
                                                                    list.push(index[0]);
                                                                }
                                                            }*/
                                                            setTimeout(function(){
                                                                callback(null, list);
                                                            }, 0);
                                                        /*});
                                                    });
                                                }, 600000, false);
                                            });
                                        });
                                    }, 600000, false);
                                });
                            });
                        }, 600000, false);*/
                    });
                });
            }, 600000, false);
            break;
            default:
            util.handleError({hoerror: 2, message: "stock type unknown!!!"}, callback, callback);
        }
    }
};

function getBasicStockData(type, index, callback) {
    switch(type) {
        case 'twse':
        var url = 'http://mops.twse.com.tw/mops/web/ajax_quickpgm?encodeURIComponent=1&step=4&firstin=1&off=1&keyword4=' + index + '&code1=&TYPEK2=&checkbtn=1&queryName=co_id&TYPEK=all&co_id=' + index;
        var filePath = config_glb.nas_tmp+'/twse'+index;
        api.xuiteDownload(url, filePath, function(err) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            if(!fs.existsSync(filePath)) {
                util.handleError({hoerror: 2, message: "cannot get basic data"}, callback, callback);
            }
            fs.readFile(filePath, function (err,data) {
                if (err) {
                    util.handleError(err, callback, callback);
                }
                data = util.bufferToString(data);
                fs.unlink(filePath, function(err) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var raw = data.match(/>[^<]+<\/a>/g);
                    var result = {};
                    result.stock_index = raw[0].match(/^>([^<]+)/)[1];
                    result.stock_time = (Number(raw[raw.length-1].match(/^>([^<]+)/)[1].match(/\d+/)[0]) + 1911).toString();
                    result.stock_class = raw[raw.length-2].match(/^>([^<]+)/)[1];
                    result.stock_market = raw[raw.length-3].match(/^>([^<]+)/)[1];
                    if (result.stock_market === '上市') {
                        result.stock_market_e = 'sii';
                    } else if (result.stock_market === '上櫃') {
                        result.stock_market_e = 'otc';
                    } else if (result.stock_market === '興櫃') {
                        result.stock_market_e = 'rotc';
                    } else if (result.stock_market === '公開發行') {
                        result.stock_market_e = 'pub';
                    }
                    result.stock_full = raw[raw.length-4].match(/^>([^<]+)/)[1];
                    result.stock_name = [];
                    result.stock_location = ['tw', '台灣', '臺灣'];
                    for (var i = 1; i < raw.length-4; i++) {
                        result.stock_name.push(raw[i].match(/^>([^<]+)/)[1]);
                    }
                    if (result.stock_name[0].match(/^F/)) {
                        result.stock_location.push('大陸');
                        result.stock_location.push('中國');
                        result.stock_location.push('中國大陸');
                        result.stock_location.push('china');
                    }
                    setTimeout(function(){
                        callback(null, result);
                    }, 0);
                });
            });
        }, 600000, false);
        break;
        default:
        util.handleError({hoerror: 2, message: "stock type unknown!!!"}, callback, callback);
    }
}

function handleStockTag(type, index, callback){
    var tags = [];
    var name = '';
    getBasicStockData(type, index, function(err, basic) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        tags.push(type);
        tags.push(basic.stock_index);
        name = basic.stock_name[0];
        for (var i in basic.stock_name) {
            tags.push(basic.stock_name[i]);
        }
        tags.push(basic.stock_full);
        tags.push(basic.stock_market);
        tags.push(basic.stock_market_e);
        tags.push(basic.stock_class);
        tags.push(basic.stock_time);
        for (var i in basic.stock_location) {
            tags.push(basic.stock_location[i]);
        }
        setTimeout(function(){
            callback(null, name, tags);
        }, 0);
    });
}

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
