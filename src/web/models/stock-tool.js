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
        } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
            var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
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
            console.log('umknown date');
            return false;
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
                //} else {
                //    cash[year][quarter+2] = cash[year][quarter-1];
                }
                if (quarterIsEmpty(cash[year-1][quarter-1])) {
                    cash[year-1].splice(quarter-1, 1);
                //} else {
                //   cash[year-1][quarter+2] = cash[year-1][quarter-1];
                }
            }
        } else {
            if (!cash[year][quarter-1] || !no_cover) {
                cash[year][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0) + getParameter(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', 0) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 0), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedOperatingActivities', 0), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedInvestingActivities', 0), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 0) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedFinancingActivities', 0), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 0) + getParameter(xml, 'tw-gaap-fh:CashDividends', 0), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-fh:NetChangesCashCashEquivalents', 0), begin: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 1), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 0)};
            }
            if (!cash[year-1][quarter-1] || !no_cover) {
                cash[year-1][quarter-1] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1) + getParameter(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', 1) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 1), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedOperatingActivities', 1), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedInvestingActivities', 1), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', 1) + getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedFinancingActivities', 1), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', 1) + getParameter(xml, 'tw-gaap-fh:CashDividends', 1), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-fh:NetChangesCashCashEquivalents', 1), begin: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 3) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 3), end: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 2) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 2)};
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
        } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
            var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
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
                if (!asset[year][quarter-1] || !no_cover) {
                    asset[year][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 0) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 0) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 0) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 0), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 0) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) + getParameter(xml, 'tifrs-bsci-fh:Payables', 0), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 0), inventories: getParameter(xml, 'ifrs:Inventories', 0) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 0), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 0), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 0), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 0) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 0) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) + getParameter(xml, 'tifrs-bsci-fh:Payables', 0), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 0) - getParameter(xml, 'ifrs:CurrentLiabilities', 0) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 0) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) - getParameter(xml, 'tifrs-bsci-fh:Payables', 0), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 0), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 0), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 0) + getParameter(xml, 'tifrs-bsci-fh:Capital', 0), total: getParameter(xml, 'ifrs:Assets', 0), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 0) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 0)};
                }
                if (!asset[year-1][quarter-1] || !no_cover) {
                    asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 1) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 1) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 1) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 1), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 1) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) + getParameter(xml, 'tifrs-bsci-fh:Payables', 1), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 1), inventories: getParameter(xml, 'ifrs:Inventories', 1) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 1), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 1), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 1), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 1) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 1) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) + getParameter(xml, 'tifrs-bsci-fh:Payables', 1), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 1) - getParameter(xml, 'ifrs:CurrentLiabilities', 1) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 1) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) - getParameter(xml, 'tifrs-bsci-fh:Payables', 1), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 1), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 1), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 1) + getParameter(xml, 'tifrs-bsci-fh:Capital', 1), total: getParameter(xml, 'ifrs:Assets', 1), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 1) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 1)};
                }
                if (!asset[year-2][quarter-1] || !no_cover) {
                    asset[year-2][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 2) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 2) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 2) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 2), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 2) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) + getParameter(xml, 'tifrs-bsci-fh:Payables', 2), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 2), inventories: getParameter(xml, 'ifrs:Inventories', 2) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 2), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 2), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 2), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 2) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 2) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) + getParameter(xml, 'tifrs-bsci-fh:Payables', 2), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 2) - getParameter(xml, 'ifrs:CurrentLiabilities', 2) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 2) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) - getParameter(xml, 'tifrs-bsci-fh:Payables', 2), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 2), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 2), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 2) + getParameter(xml, 'tifrs-bsci-fh:Capital', 2), total: getParameter(xml, 'ifrs:Assets', 2), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 2) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 2)};
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
                    asset[year][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 0) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 0) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 0) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 0), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 0) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 0) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) + getParameter(xml, 'tifrs-bsci-fh:Payables', 0), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 0), inventories: getParameter(xml, 'ifrs:Inventories', 0) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 0), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 0), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 0), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 0) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 0) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) + getParameter(xml, 'tifrs-bsci-fh:Payables', 0), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 0) - getParameter(xml, 'ifrs:CurrentLiabilities', 0) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 0) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 0) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 0) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 0) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 0) - getParameter(xml, 'tifrs-bsci-fh:Payables', 0), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 0), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 0), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 0) + getParameter(xml, 'tifrs-bsci-fh:Capital', 0), total: getParameter(xml, 'ifrs:Assets', 0), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 0) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 0)};
                }
                if (!asset[year-1][3] || !no_cover) {
                    asset[year-1][3] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 1) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 1) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 1) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 1), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 1) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 1) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) + getParameter(xml, 'tifrs-bsci-fh:Payables', 1), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 1), inventories: getParameter(xml, 'ifrs:Inventories', 1) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 1), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 1), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 1), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 1) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 1) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) + getParameter(xml, 'tifrs-bsci-fh:Payables', 1), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 1) - getParameter(xml, 'ifrs:CurrentLiabilities', 1) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 1) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 1) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 1) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 1) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 1) - getParameter(xml, 'tifrs-bsci-fh:Payables', 1), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 1), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 1), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 1) + getParameter(xml, 'tifrs-bsci-fh:Capital', 1), total: getParameter(xml, 'ifrs:Assets', 1), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 1) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 1)};
                }
                if (!asset[year-1][quarter-1] || !no_cover) {
                    asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 2) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 2) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 2) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 2), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 2) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 2) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) + getParameter(xml, 'tifrs-bsci-fh:Payables', 2), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 2), inventories: getParameter(xml, 'ifrs:Inventories', 2) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 2), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 2), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 2), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 2) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 2) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) + getParameter(xml, 'tifrs-bsci-fh:Payables', 2), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 2) - getParameter(xml, 'ifrs:CurrentLiabilities', 2) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 2) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 2) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 2) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 2) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 2) - getParameter(xml, 'tifrs-bsci-fh:Payables', 2), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 2), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 2), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 2) + getParameter(xml, 'tifrs-bsci-fh:Capital', 2), total: getParameter(xml, 'ifrs:Assets', 2), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 2) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 2)};
                }
                if (!asset[year-2][3] || !no_cover) {
                    asset[year-2][3] = {receivable: getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', 3) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', 3) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', 3) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', 3) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', 3) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialAssetsForHedging', 3) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', 3) + getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', 3), payable: getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', 3) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', 3) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 3) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 3) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 3) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 3) + getParameter(xml, 'tifrs-bsci-fh:Payables', 3), cash: getParameter(xml, 'ifrs:CashAndCashEquivalents', 3), inventories: getParameter(xml, 'ifrs:Inventories', 3) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', 3), OCFA: getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', 3), property: getParameter(xml, 'ifrs:PropertyPlantAndEquipment', 3), current_liabilities: getParameter(xml, 'ifrs:CurrentLiabilities', 3) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', 3) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 3) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 3) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 3) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 3) + getParameter(xml, 'tifrs-bsci-fh:Payables', 3), noncurrent_liabilities: getParameter(xml, 'ifrs:Liabilities', 3) - getParameter(xml, 'ifrs:CurrentLiabilities', 3) - getParameter(xml, 'ifrs:CurrentTaxLiabilities', 3) - getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', 3) - getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', 3) - getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', 3) - getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', 3) - getParameter(xml, 'tifrs-bsci-fh:Payables', 3), equityParent: getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', 3), equityChild: getParameter(xml, 'ifrs:NoncontrollingInterests', 3), share: getParameter(xml, 'tifrs-bsci-ci:CapitalStock', 3) + getParameter(xml, 'tifrs-bsci-fh:Capital', 3), total: getParameter(xml, 'ifrs:Assets', 3), longterm: getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', 3) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', 3)};
                }
                if (quarter === 3 || quarter === 2) {
                    if (quarterIsEmpty(asset[year][quarter-1])) {
                        asset[year].splice(quarter-1, 1);
                    //} else {
                    //    asset[year][quarter+2] = asset[year][quarter-1];
                    }
                    if (quarterIsEmpty(asset[year-1][quarter-1])) {
                        asset[year-1].splice(quarter-1, 1);
                    //} else {
                    //    asset[year-1][quarter+2] = asset[year-1][quarter-1];
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
                asset[year][quarter-1] = {receivable: getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 0) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 0) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 0) + getParameter(xml, 'tw-gaap-fh:DueCentralBankCallLoansBanks', 0) + getParameter(xml, 'tw-gaap-fh:FinancialAssetsMeasuredFairValueProfitLoss', 0) + getParameter(xml, 'tw-gaap-fh:SecuritiesPurchasedResellAgreements', 0) + getParameter(xml, 'tw-gaap-fh:ReceivablesNet', 0), payable: getParameter(xml, 'tw-gaap-ci:AccountsPayable', 0) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 0) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 0) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 0) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 0) + getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 0) + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 0) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 0) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 0) + getParameter(xml, 'tw-gaap-fh:Payables', 0), cash: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 0) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 0), inventories: getParameter(xml, 'tw-gaap-ci:Inventories', 0) + getParameter(xml, 'tw-gaap-fh:LoansDiscountedNet', 0), OCFA: 0, property: getParameter(xml, 'tw-gaap-ci:FixedAssets', 0) + getParameter(xml, 'tw-gaap-fh:FixAssetsNet', 0), current_liabilities: getParameter(xml, 'tw-gaap-ci:CurrentLiabilities', 0) + getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 0) + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 0) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 0) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 0) + getParameter(xml, 'tw-gaap-fh:Payables', 0), noncurrent_liabilities: getParameter(xml, 'tw-gaap-ci:LongtermBorrowings', 0) + getParameter(xml, 'tw-gaap-ci:OtherLiabilities', 0) + getParameter(xml, 'tw-gaap-fh:Liabilities', 0) - getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 0) - getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 0) - getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 0) - getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 0) - getParameter(xml, 'tw-gaap-fh:Payables', 0), equityParent: getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 0) + getParameter(xml, 'tw-gaap-fh:StockholdersEquityParentCompany', 0), equityChild: getParameter(xml, 'tw-gaap-ci:MinorityInterest', 0) + getParameter(xml, 'tw-gaap-fh:OtherEquity-MinorityInterest', 0), share: getParameter(xml, 'tw-gaap-ci:Capital', 0) + getParameter(xml, 'tw-gaap-fh:Capital', 0), total: getParameter(xml, 'tw-gaap-ci:Assets', 0) + getParameter(xml, 'tw-gaap-fh:Assets', 0), longterm: getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 0) + getParameter(xml, 'tw-gaap-fh:EquityInvestmentsEquityMethodNet', 0)};
            }
            if (!asset[year-1][quarter-1] || !no_cover) {
                asset[year-1][quarter-1] = {receivable: getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', 1) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', 1) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', 1) + getParameter(xml, 'tw-gaap-fh:DueCentralBankCallLoansBanks', 1) + getParameter(xml, 'tw-gaap-fh:FinancialAssetsMeasuredFairValueProfitLoss', 1) + getParameter(xml, 'tw-gaap-fh:SecuritiesPurchasedResellAgreements', 1) + getParameter(xml, 'tw-gaap-fh:ReceivablesNet', 1), payable: getParameter(xml, 'tw-gaap-ci:AccountsPayable', 1) + getParameter(xml, 'tw-gaap-ci:NotesPayable', 1) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', 1) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', 1) + getParameter(xml, 'tw-gaap-ci:OtherPayables', 1) + getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 1) + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 1) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 1) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 1) + getParameter(xml, 'tw-gaap-fh:Payables', 1), cash: getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', 1) + getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', 1), inventories: getParameter(xml, 'tw-gaap-ci:Inventories', 1) + getParameter(xml, 'tw-gaap-fh:LoansDiscountedNet', 1), OCFA: 0, property: getParameter(xml, 'tw-gaap-ci:FixedAssets', 1) + getParameter(xml, 'tw-gaap-fh:FixAssetsNet', 1), current_liabilities: getParameter(xml, 'tw-gaap-ci:CurrentLiabilities', 1) + getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 1) + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 1) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 1) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 1) + getParameter(xml, 'tw-gaap-fh:Payables', 1), noncurrent_liabilities: getParameter(xml, 'tw-gaap-ci:LongtermBorrowings', 1) + getParameter(xml, 'tw-gaap-ci:OtherLiabilities', 1) + getParameter(xml, 'tw-gaap-fh:Liabilities', 1) - getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', 1) - getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', 1) - getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', 1) - getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', 1) - getParameter(xml, 'tw-gaap-fh:Payables', 1), equityParent: getParameter(xml, 'tw-gaap-ci:TotalParentCompanyStockholdersEquities', 1) + getParameter(xml, 'tw-gaap-fh:StockholdersEquityParentCompany', 1), equityChild: getParameter(xml, 'tw-gaap-ci:MinorityInterest', 1) + getParameter(xml, 'tw-gaap-fh:OtherEquity-MinorityInterest', 1), share: getParameter(xml, 'tw-gaap-ci:Capital', 1) + getParameter(xml, 'tw-gaap-fh:Capital', 1), total: getParameter(xml, 'tw-gaap-ci:Assets', 1) + getParameter(xml, 'tw-gaap-fh:Assets', 1), longterm: getParameter(xml, 'tw-gaap-ci:LongtermInvestments', 1) + getParameter(xml, 'tw-gaap-fh:EquityInvestmentsEquityMethodNet', 1)};
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
        } else if (xml.xbrl['tw-gaap-fh:CashCashEquivalents']){
            var xml_date = xml.xbrl['tw-gaap-fh:CashCashEquivalents'][0]['$']['contextRef'].match(/^AsOf(\d\d\d\d)(\d\d\d\d)$/);
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
        + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 0) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 0)
        if (type === 1) {
            if (quarter === 4 || quarter === 1) {
                if (!sales[year][quarter-1] || !no_cover) {
                    sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 0) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 0) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 0) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 0), profit: getParameter(xml, 'ifrs:ProfitLoss', 0), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 0), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 0) + getParameter(xml, 'ifrs:RevenueFromInterest', 0) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 0), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 0) + getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 0), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 0) - getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', 0), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 0), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 0) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossExceptInterest', 0) - getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 0) - getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 0), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 0) + getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 0), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 0) + getParameter(xml, 'ifrs:InterestExpense', 0) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 0), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 0) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 0) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 0) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 0) - getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 0)};
                }
                if (!sales[year-1][quarter-1] || !no_cover) {
                    sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 1) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 1) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 1) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 1), profit: getParameter(xml, 'ifrs:ProfitLoss', 1), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 1), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 1) + getParameter(xml, 'ifrs:RevenueFromInterest', 1) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 1), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 1) + getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 1), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 1) - getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', 1), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 1), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 1) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossExceptInterest', 1) - getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 1) - getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 1), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 1) + getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 1), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 1) + getParameter(xml, 'ifrs:InterestExpense', 1) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 1), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 1) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 1) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 1) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 1) - getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 1)};
                }
            } else if (quarter === 3 || quarter === 2) {
                //sales[year][quarter+2] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 0), profit: getParameter(xml, 'ifrs:ProfitLoss', 0), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 0), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 0), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 0), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 0), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 0), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 0), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 0), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 0), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 0)};
                //sales[year-1][quarter+2] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 1), profit: getParameter(xml, 'ifrs:ProfitLoss', 1), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 1), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 1), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 1), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 1), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 1), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 1), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 1), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 1), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 1)};
                if (!sales[year][quarter-1] || !no_cover) {
                    sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 2) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 2) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 2) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 2), profit: getParameter(xml, 'ifrs:ProfitLoss', 2), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 2), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 2) + getParameter(xml, 'ifrs:RevenueFromInterest', 2) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 2), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 2) + getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 2), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 2) - getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', 2), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 2), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 2) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossExceptInterest', 2) - getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 2) - getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 2), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 2) + getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 2), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 2) + getParameter(xml, 'ifrs:InterestExpense', 2) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 2), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 2) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 2) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 2) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 2) - getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 2)};
                }
                if (!sales[year-1][quarter-1] || !no_cover) {
                    sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tifrs-bsci-ci:GrossProfitLossFromOperations', 3) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 3) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 3) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 3), profit: getParameter(xml, 'ifrs:ProfitLoss', 3), comprehensive: getParameter(xml, 'ifrs:ComprehensiveIncome', 3), revenue: getParameter(xml, 'tifrs-bsci-ci:OperatingRevenue', 3) + getParameter(xml, 'ifrs:RevenueFromInterest', 3) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 3), expenses: getParameter(xml, 'tifrs-bsci-ci:OperatingExpenses', 3) + getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 3), tax: getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', 3) - getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', 3), eps: getParameter(xml, 'ifrs:BasicEarningsLossPerShare', 3), nonoperating: getParameter(xml, 'tifrs-bsci-ci:NonoperatingIncomeAndExpenses', 3) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossExceptInterest', 3) - getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 3) - getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 3), finance_cost: getParameter(xml, 'ifrs:FinanceCosts', 3) + getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', 3), cost: getParameter(xml, 'tifrs-bsci-ci:OperatingCosts', 3) + getParameter(xml, 'ifrs:InterestExpense', 3) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 3), operating: getParameter(xml, 'tifrs-bsci-ci:NetOperatingIncomeLoss', 3) + getParameter(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', 3) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', 3) - getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', 3) - getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', 3)};
                }
                /*if (quarterIsEmpty(sales[year][quarter+2])) {
                    sales[year].splice(quarter+2, 1);
                }
                if (quarterIsEmpty(sales[year-1][quarter+2])) {
                    sales[year-1].splice(quarter+2, 1);
                }*/
            }
        } else {
            if (!sales[year][quarter-1] || !no_cover) {
                sales[year][quarter-1] = {gross_profit: getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 0) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 0) - getParameter(xml, 'tw-gaap-fh:InterestExpenses', 0) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 0) + getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 0) + getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 0) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 0), profit: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 0) + getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 0), comprehensive: 0, revenue: getParameter(xml, 'tw-gaap-ci:OperatingRevenue', 0) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 0) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 0) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 0), expenses: getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 0) + getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 0), tax: getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 0) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 0), eps: getParameter(xml, 'tw-gaap-ci:PrimaryEarningsPerShare', 0) + getParameter(xml, 'tw-gaap-fh:PrimaryEarningsPerShare', 0), nonoperating: getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 0) + getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 0) - getParameter(xml, 'tw-gaap-fh:InterestIncomes', 0) + getParameter(xml, 'tw-gaap-fh:InterestExpenses', 0) - getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 0) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 0) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 0) - getParameter(xml, 'tw-gaap-fh:DividendRevenue', 0) + getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 0) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 0), finance_cost: getParameter(xml, 'tw-gaap-ci:InterestExpense', 0) + getParameter(xml, 'tw-gaap-fh:BadDebtExpensesLoan', 0), cost: getParameter(xml, 'tw-gaap-ci:OperatingCosts', 0) + getParameter(xml, 'tw-gaap-fh:InterestExpenses', 0) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 0) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 0), operating: getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 0) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 0) - getParameter(xml, 'tw-gaap-fh:InterestExpenses', 0) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 0) + getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 0) + getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 0) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 0) - getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 0)};
            }
            if (!sales[year-1][quarter-1] || !no_cover) {
                sales[year-1][quarter-1] = {gross_profit: getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', 1) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 1) - getParameter(xml, 'tw-gaap-fh:InterestExpenses', 1) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 1) + getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 1) + getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 1) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 1), profit: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', 1) + getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 1), comprehensive: 0, revenue: getParameter(xml, 'tw-gaap-ci:OperatingRevenue', 1) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 1) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 1) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 1), expenses: getParameter(xml, 'tw-gaap-ci:OperatingExpenses', 1) + getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 1), tax: getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', 1) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 1), eps: getParameter(xml, 'tw-gaap-ci:PrimaryEarningsPerShare', 1) + getParameter(xml, 'tw-gaap-fh:PrimaryEarningsPerShare', 1), nonoperating: getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', 1) + getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', 1) - getParameter(xml, 'tw-gaap-fh:InterestIncomes', 1) + getParameter(xml, 'tw-gaap-fh:InterestExpenses', 1) - getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 1) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 1) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 1) - getParameter(xml, 'tw-gaap-fh:DividendRevenue', 1) + getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 1) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', 1), finance_cost: getParameter(xml, 'tw-gaap-ci:InterestExpense', 1) + getParameter(xml, 'tw-gaap-fh:BadDebtExpensesLoan', 1), cost: getParameter(xml, 'tw-gaap-ci:OperatingCosts', 1) + getParameter(xml, 'tw-gaap-fh:InterestExpenses', 1) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 1) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 1), operating: getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', 1) + getParameter(xml, 'tw-gaap-fh:InterestIncomes', 1) - getParameter(xml, 'tw-gaap-fh:InterestExpenses', 1) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', 1) + getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', 1) + getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', 1) + getParameter(xml, 'tw-gaap-fh:DividendRevenue', 1) - getParameter(xml, 'tw-gaap-fh:OperatingExpenses', 1)};
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
                    salesStatus[i][j] = {revenue: sales[i][j].revenue, cost: Math.ceil(sales[i][j].cost/sales[i][j].revenue*1000)/10, expenses: Math.ceil(sales[i][j].expenses/sales[i][j].revenue*1000)/10, finance_cost: Math.ceil(sales[i][j].finance_cost/sales[i][j].revenue*1000)/10, nonoperating_without_FC: Math.ceil((sales[i][j].nonoperating+sales[i][j].finance_cost)/sales[i][j].revenue*1000)/10, tax: Math.ceil(sales[i][j].tax/sales[i][j].revenue*1000)/10, comprehensive: Math.ceil(sales[i][j].comprehensive/sales[i][j].revenue*1000)/10, profit: Math.ceil(sales[i][j].profit/sales[i][j].revenue*1000)/10, profit_comprehensive: Math.ceil((sales[i][j].profit+sales[i][j].comprehensive)/sales[i][j].revenue*1000)/10, eps: sales[i][j].eps, salesPerAsset: Math.ceil(sales[i][j].revenue/asset[i][j].total*1000)/1000};
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
                if (profitStatus[i][j]) {
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
                if (safetyStatus[i][j]) {
                    multiple++;
                    index += (safetyStatus[i][j].shortCash+safetyStatus[i][j].shortCashWithoutCL+safetyStatus[i][j].shortCashWithoutInvest)*multiple;
                }
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
        return Math.ceil((managementStatus[year][quarter-1].profitRelative+managementStatus[year][quarter-1].cashRelative+managementStatus[year][quarter-1].inventoriesRelative+managementStatus[year][quarter-1].receivableRelative+managementStatus[year][quarter-1].payableRelative)*1000)/1000;
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
                        if (err.code !== 'HPE_INVALID_CONSTANT' && err.code !== 'ECONNREFUSED' && err.code !== 'ENOTFOUND') {
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
                        } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
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
