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
        var xmlDate = {};
        if (xml.xbrl['tifrs-notes:Year']) {
            type = 1;
            year = Number(xml.xbrl['tifrs-notes:Year'][0]['_']);
            quarter = Number(xml.xbrl['tifrs-notes:Quarter'][0]['_']);
        } else {
            if (xmlDate = getXmlDate(xml, 'tw-gaap-ci:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-basi:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-bd:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ins:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ar:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
                if (year === 2010 && quarter === 1 && xml.xbrl.context[0].entity[0].identifier[0]['_'] === '5315' || xml.xbrl.context[0].entity[0].identifier[0]['_'] === '6148') {
                    return cash;
                }
            } else {
                console.log('umknown date');
                return false;
            }
        }
        var isOk = false;
        for (var i = 0; i < 4; i++) {
            if (type === 1) {
                if (xmlDate = califrsCash(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            } else {
                if (xmlDate = calgaapCash(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            }
        }
        if (!isOk) {
            console.log('unknown finance data');
            return false;
        }
        return cash;
        function califrsCash(ci, no_cover) {
            var xmlDate = {};
            var y = 0,q = 0;
            if (xmlDate = getXmlDate(xml, 'tifrs-SCF:ProfitLossBeforeTax', ci)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tifrs-SCF:ProfitLossBeforeTax', ci), operation: getParameter(xml, 'ifrs:CashFlowsFromUsedInOperatingActivities', ci), invest: getParameter(xml, 'tifrs-SCF:NetCashFlowsFromUsedInInvestingActivities', ci), finance: getParameter(xml, 'tifrs-SCF:CashFlowsFromUsedInFinancingActivities', ci), dividends: getParameter(xml, 'tifrs-SCF:CashDividendsPaid', ci), change: getParameter(xml, 'ifrs:IncreaseDecreaseInCashAndCashEquivalents', ci), begin: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtBeginningOfPeriod', ci), end: getParameter(xml, 'tifrs-SCF:CashAndCashEquivalentsAtEndOfPeriod', ci)};
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
        }
        function calgaapCash(ci, no_cover) {
            var xmlDate = {};
            var cashDate = {};
            var cashBegin = 0;
            var cashEnd = 0;
            var bq = 0;
            var eq = 5;
            var temp = 0;
            var y = 0,q = 0;
            var i = 0;
            if ((xmlDate = getXmlDate(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', ci)) || (xmlDate = getXmlDate(xml, 'tw-gaap-ci:NetIncomeLoss_StatementCashFlows', ci)) || (xmlDate = getXmlDate(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', ci))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', ci) + getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-ci:NetIncomeLoss_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', ci), operation: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-ci:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-ci:CashDividends', ci), change: getParameter(xml, 'tw-gaap-ci:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-ci:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-ci:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', ci)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-fh:CurrentConsolidatedTotalIncome', ci) - getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', ci), operation: getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-fh:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-fh:CashDividends', ci), change: getParameter(xml, 'tw-gaap-fh:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-fh:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-fh:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else if ((xmlDate = getXmlDate(xml, 'tw-gaap-basi:ConsolidatedTotalIncome_StatementCashFlows', ci)) || (xmlDate = getXmlDate(xml, 'tw-gaap-basi:NetIncomeLoss_StatementCashFlows', ci))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-basi:ConsolidatedTotalIncome_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-basi:NetIncomeLoss_StatementCashFlows', ci) - getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', ci), operation: getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-basi:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-basi:CashDividends', ci), change: getParameter(xml, 'tw-gaap-basi:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-basi:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-basi:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-CashFlowStatement', ci)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-CashFlowStatement', ci) + getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', ci), operation: getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-mim:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-mim:CashDividends', ci), change: getParameter(xml, 'tw-gaap-mim:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-mim:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-mim:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else if ((xmlDate = getXmlDate(xml, 'tw-gaap-bd:ConsolidatedTotalIncome_StatementCashFlows', ci)) || (xmlDate = getXmlDate(xml, 'tw-gaap-bd:NetIncomeLoss-CashFlowStatement', ci))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-bd:NetIncomeLoss-CashFlowStatement', ci) + getParameter(xml, 'tw-gaap-bd:ConsolidatedTotalIncome_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', ci), operation: getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-bd:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-bd:CashDividends', ci), change: getParameter(xml, 'tw-gaap-bd:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-bd:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-bd:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else if ((xmlDate = getXmlDate(xml, 'tw-gaap-ins:ConsolidatedTotalIncome_StatementCashFlows', ci)) || (xmlDate = getXmlDate(xml, 'tw-gaap-ins:NetIncomeLoss_StatementCashFlows', ci))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!cash[y]) {
                    cash[y] = [];
                }
                if (!cash[y][q] || !no_cover) {
                    cash[y][q] = {profitBT: getParameter(xml, 'tw-gaap-ins:ConsolidatedTotalIncome_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-ins:NetIncomeLoss_StatementCashFlows', ci) + getParameter(xml, 'tw-gaap-ins:IncomeTaxExpenseBenefit', ci), operation: getParameter(xml, 'tw-gaap-ins:NetCashProvidedUsedOperatingActivities', ci), invest: getParameter(xml, 'tw-gaap-ins:NetCashProvidedUsedInvestingActivities', ci), finance: getParameter(xml, 'tw-gaap-ins:NetCashProvidedUsedFinancingActivities', ci), dividends: getParameter(xml, 'tw-gaap-ins:CashDividends', ci), change: getParameter(xml, 'tw-gaap-ins:NetChangesCashCashEquivalents', ci), begin: 0, end: 0};
                    cashDate = getXmlDate(xml, 'tw-gaap-ins:CashCashEquivalents', i);
                    while (cashDate) {
                        if (cashDate.year === y) {
                            temp = getParameter(xml, 'tw-gaap-ins:CashCashEquivalents', i);
                            if (temp && cashDate.quarter < eq) {
                                cashEnd = temp;
                                eq = cashDate.quarter;
                            }
                        } else if (cashDate.year === (y-1)) {
                            temp = getParameter(xml, 'tw-gaap-ins:CashCashEquivalents', i);
                            if (temp && cashDate.quarter > bq) {
                                cashBegin = temp;
                                bq = cashDate.quarter;
                            }
                        }
                        i++;
                        cashDate = getXmlDate(xml, 'tw-gaap-ins:CashCashEquivalents', i);
                    }
                    if ((cashBegin && cashEnd) || cash[y][q].change) {
                        cash[y][q].begin = cashBegin;
                        cash[y][q].end = cashEnd;
                    } else {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y][q])) {
                        cash[y][q] = null;
                    }
                    if (quarterIsEmpty(cash[y])) {
                        delete cash[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
        }
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
            if (xmlDate = getXmlDate(xml, 'tw-gaap-ci:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-basi:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-bd:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ins:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ar:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
                if (year === 2010 && quarter === 1 && xml.xbrl.context[0].entity[0].identifier[0]['_'] === '5315' || xml.xbrl.context[0].entity[0].identifier[0]['_'] === '6148') {
                    return asset;
                }
            } else {
                console.log('umknown date');
                return false;
            }
        }
        var xmlDate = {};
        var isOk = false;
        for (var i = 0; i < 4; i++) {
            if (type === 1) {
                if (xmlDate = califrsAsset(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            } else {
                if (xmlDate = calgaapAsset(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            }
        }
        if (!isOk) {
            console.log('unknown finance data');
            return false;
        }
        return asset;
        function califrsAsset(ai, no_cover) {
            var xmlDate = {};
            var y = 0,q = 0;
            if (xmlDate = getXmlDate(xml, 'tifrs-bsci-ci:CapitalStock', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-ci:CapitalStock', ai);
                    asset[y][q].inventories = getParameter(xml, 'ifrs:Inventories', ai);
                    asset[y][q].longterm = getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-ci:AccountsReceivableNet', ai) + getParameter(xml, 'tifrs-bsci-ci:OtherReceivables', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesReceivableNet', ai) + getParameter(xml, 'tifrs-bsci-ci:ConstructionContractsReceivable', ai) + getParameter(xml, 'tifrs-bsci-ci:Prepayments', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-ci:AccountsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:AccountsPayableToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-ci:OtherPayables', ai) + getParameter(xml, 'tifrs-bsci-ci:ShorttermNotesAndBillsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:NotesPayableToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-ci:ConstructionContractsPayable', ai) + getParameter(xml, 'tifrs-bsci-ci:ReceiptsUnderCustody', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'ifrs:CurrentLiabilities', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-fh:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-fh:Capital', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].inventories = getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-fh:AvailableForSaleFinancialAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesPurchasedUnderResellAgreements', ai) + getParameter(xml, 'tifrs-bsci-fh:LoansDiscountedNet', ai);
                    asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-fh:ReinsuranceContractAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-fh:HeldToMaturityFinancialAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-fh:InvestmentsAccountedForUsingEquityMethodNet', ai) + getParameter(xml, 'ifrs:OtherFinancialAssets', ai) + getParameter(xml, 'ifrs:InvestmentProperty', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-fh:ReceivablesNet', ai) + getParameter(xml, 'tifrs-bsci-fh:DueFromTheCentralBankAndCallLoansToBanks', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-fh:Payables', ai) + getParameter(xml, 'tifrs-bsci-fh:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-fh:Deposits', ai);
                    asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tifrs-bsci-fh:DueToTheCentralBankAndBanks', ai) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-fh:SecuritiesSoldUnderRepurchaseAgreements', ai) + getParameter(xml, 'tifrs-bsci-fh:CommercialPapersIssuedNet', ai) + getParameter(xml, 'tifrs-bsci-fh:DerivativeFinancialLiabilitiesForHedging', ai) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-basi:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-basi:Capital', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-basi:DiscountsAndLoansNet', ai) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'ifrs:FinancialAssetsAvailableforsale', ai);
                    asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-basi:HeldToMaturityFinancialAssets', ai) + getParameter(xml, 'ifrs:OtherFinancialAssets', ai) + getParameter(xml, 'ifrs:InvestmentProperty', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-basi:Receivables', ai) + getParameter(xml, 'tifrs-bsci-basi:DueFromTheCentralBankAndCallLoansToBanks', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-basi:Payables', ai) + getParameter(xml, 'tifrs-bsci-basi:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-basi:DepositsAndRemittances', ai);
                    asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tifrs-bsci-basi:DueToTheCentralBankAndBanks', ai) + getParameter(xml, 'ifrs:FinancialLiabilitiesAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-basi:NotesAndBondsIssuedUnderRepurchaseAgreement', ai) + getParameter(xml, 'ifrs:CurrentTaxLiabilities', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-bd:CapitalStock', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai) + getParameter(xml, 'tifrs-bsci-bd:CustomerMarginAccount', ai);;
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai) + getParameter(xml, 'tifrs-bsci-bd:PropertyAndEquipment', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-bd:CapitalStock', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-bd:CurrentFinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-bd:AvailableForSaleCurrentFinancialAssets', ai) + getParameter(xml, 'tifrs-bsci-bd:BondInvestmentsUnderResaleAgreements', ai);
                    asset[y][q].longterm = getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai) + getParameter(xml, 'tifrs-bsci-bd:NoncurrentFinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'tifrs-bsci-bd:NoncurrentFinancialAssetsAtCost', ai) + getParameter(xml, 'tifrs-bsci-bd:AvailableForSaleNoncurrentFinancialAssets', ai) + getParameter(xml, 'ifrs:InvestmentProperty', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-bd:MarginLoansReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:NotesReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:AccountsReceivable', ai) + getParameter(xml, 'tifrs-bsci-bd:Prepayments', ai) + getParameter(xml, 'tifrs-bsci-bd:OtherReceivables', ai) + getParameter(xml, 'tifrs-bsci-bd:SecurityBorrowingCollateralPrice', ai) + getParameter(xml, 'tifrs-bsci-bd:SecurityBorrowingMargin', ai) + getParameter(xml, 'tifrs-bsci-bd:RefinancingMargin', ai) + getParameter(xml, 'tifrs-bsci-bd:RefinancingCollateralReceivable', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-bd:CommercialPaperPayable', ai) + getParameter(xml, 'tifrs-bsci-bd:SecuritiesFinancingRefundableDeposits', ai) + getParameter(xml, 'tifrs-bsci-bd:DepositsPayableForSecuritiesFinancing', ai) + getParameter(xml, 'tifrs-bsci-bd:SecuritiesLendingRefundableDeposits', ai) + getParameter(xml, 'tifrs-bsci-bd:AccountsPayable', ai) + getParameter(xml, 'tifrs-bsci-bd:AdvanceReceipts', ai) + getParameter(xml, 'tifrs-bsci-bd:ReceiptsUnderCustody', ai) + getParameter(xml, 'tifrs-bsci-bd:OtherPayables', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:NoncurrentLiabilities', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-mim:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-mim:Capital', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-mim:CurrentFinancialAssetsAtFairValueThroughProfitOrLoss', ai) + getParameter(xml, 'ifrs:Inventories', ai) + getParameter(xml, 'tifrs-bsci-mim:SecuritiesPurchasedUnderResellAgreements', ai) + getParameter(xml, 'tifrs-bsci-mim:DiscountsAndLoansNet', ai) + getParameter(xml, 'tifrs-bsci-mim:NoncurrentAssetsClassifiedAsHeldForSaleNet', ai);
                    asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-mim:NoncurrentAvailableForSaleFinancialAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-mim:NoncurrentHeldToMaturityFinancialAssetsNet', ai) + getParameter(xml, 'tifrs-bsci-mim:NoncurrentFinancialAssetsAtCostNet', ai) + getParameter(xml, 'ifrs:InvestmentAccountedForUsingEquityMethod', ai) + getParameter(xml, 'ifrs:InvestmentProperty', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-mim:ReceivablesNet', ai) + getParameter(xml, 'tifrs-bsci-mim:ReceivablesDueFromRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-mim:DueFromTheCentralBankAndCallLoansToBanks', ai) + getParameter(xml, 'tifrs-bsci-mim:Prepayments', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-mim:Payables', ai) + getParameter(xml, 'tifrs-bsci-mim:PayablesToRelatedParties', ai) + getParameter(xml, 'tifrs-bsci-mim:DepositsFromTheCentralBankAndBanks', ai) + getParameter(xml, 'tifrs-bsci-mim:DepositsAndRemittances', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'ifrs:CurrentLiabilities', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-ins:ShareCapital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].cash = getParameter(xml, 'ifrs:CashAndCashEquivalents', ai);
                    asset[y][q].OCFA = getParameter(xml, 'ifrs:OtherCurrentFinancialAssets', ai);
                    asset[y][q].property = getParameter(xml, 'ifrs:PropertyPlantAndEquipment', ai);
                    asset[y][q].share = getParameter(xml, 'tifrs-bsci-ins:ShareCapital', ai);
                    asset[y][q].total = getParameter(xml, 'ifrs:Assets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'ifrs:NoncontrollingInterests', ai);
                    asset[y][q].equityParent = getParameter(xml, 'ifrs:EquityAttributableToOwnersOfParent', ai) + getParameter(xml, 'tifrs-bsci-ci:EquityAttributableToFomerOwnerOfBusinessCombinationUnderCommonControl', ai);
                    asset[y][q].inventories = getParameter(xml, 'tifrs-bsci-ins:Loans', ai) + getParameter(xml, 'tifrs-bsci-ins:InvestmentsInNotesAndBondsWithResaleAgreement', ai) + getParameter(xml, 'ifrs:FinancialAssetsAtFairValueThroughProfitOrLoss', ai);
                    asset[y][q].longterm = getParameter(xml, 'tifrs-bsci-ins:Investments', ai) - asset[y][q].inventories + getParameter(xml, 'tifrs-bsci-ins:ReinsuranceAssets', ai);
                    asset[y][q].receivable = getParameter(xml, 'tifrs-bsci-ins:Receivables', ai) + getParameter(xml, 'tifrs-bsci-ins:Prepayments', ai) + getParameter(xml, 'tifrs-bsci-ins:GuaranteeDepositsPaid', ai) + getParameter(xml, 'tifrs-bsci-ins:ReinsuranceLiabilityReserveContributed', ai);
                    asset[y][q].payable = getParameter(xml, 'tifrs-bsci-ins:AccountsPayable', ai) + getParameter(xml, 'tifrs-bsci-ins:AdvanceReceipts', ai) + getParameter(xml, 'tifrs-bsci-ins:GuaranteeDepositsAndMarginsReceived', ai) + getParameter(xml, 'tifrs-bsci-ins:ReinsuranceLiabilityReserveReceived', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tifrs-bsci-ins:LiabilitiesOnInsuranceProductSeparatedAccountAbstract', ai) + getParameter(xml, 'tifrs-bsci-ins:InsuranceLiabilities', ai) + getParameter(xml, 'tifrs-bsci-ins:ReserveForInsuranceWithNatureOfFinancialInstrument', ai) + getParameter(xml, 'tifrs-bsci-ins:PreferenceShareLiabilities', ai) + getParameter(xml, 'tifrs-bsci-ins:BondsPayable', ai) + getParameter(xml, 'tifrs-bsci-ins:FinancialLiabilitiesAtCost', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'ifrs:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
        }
        function calgaapAsset(ai, no_cover) {
            var xmlDate = {};
            var y = 0,q = 0;
            if (xmlDate = getXmlDate(xml, 'tw-gaap-ci:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-ci:Capital', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-ci:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-ci:FixedAssets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-ci:MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-ci:StockholdersEquities', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-ci:Assets', ai);
                    asset[y][q].longterm = getParameter(xml, 'tw-gaap-ci:LongtermInvestments', ai);
                    asset[y][q].receivable = getParameter(xml, 'tw-gaap-ci:NetAccountsReceivable', ai) + getParameter(xml, 'tw-gaap-ci:OtherReceivables', ai) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivable', ai) + getParameter(xml, 'tw-gaap-ci:NetAccountsReceivableRelatedParties', ai) + getParameter(xml, 'tw-gaap-ci:OtherReceivablesRelatedParties', ai) + getParameter(xml, 'tw-gaap-ci:NetNotesReceivableRelatedParties', ai) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-ci:Inventories', ai);
                    asset[y][q].payable = getParameter(xml, 'tw-gaap-ci:AccountsPayable', ai) + getParameter(xml, 'tw-gaap-ci:NotesPayable', ai) + getParameter(xml, 'tw-gaap-ci:IncomeTaxPayable', ai) + getParameter(xml, 'tw-gaap-ci:AccruedExpenses', ai) + getParameter(xml, 'tw-gaap-ci:OtherPayables', ai) + getParameter(xml, 'tw-gaap-ci:BillingsConstructionProcess_2264yy', ai) + getParameter(xml, 'tw-gaap-ci:AdvanceReceipts', ai) + getParameter(xml, 'tw-gaap-ci:AccountsPayableRelatedParties', ai) + getParameter(xml, 'tw-gaap-ci:NotesPayableRelatedParties', ai) + getParameter(xml, 'tw-gaap-ci:ReceiptsCustody', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-ci:LongTermLiabilities', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'tw-gaap-ci:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (asset[y][q].total === 0) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-fh:Capital', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-fh:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-fh:FixAssetsNet', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-fh:OtherEquity-MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-fh:StockholdersEquity', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-fh:Assets', ai);
                    asset[y][q].longterm = getParameter(xml, 'tw-gaap-fh:HeldMaturityFinancialAssetsNet', ai) + getParameter(xml, 'tw-gaap-fh:EquityInvestmentsEquityMethodNet', ai) + getParameter(xml, 'tw-gaap-fh:OtherFinancialAssetsNet', ai) + getParameter(xml, 'tw-gaap-fh:InvestmentsRealEstateNet', ai);
                    asset[y][q].receivable = getParameter(xml, 'tw-gaap-fh:ReceivablesNet', ai) + getParameter(xml, 'tw-gaap-fh:DueCentralBankCallLoansBanks', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-fh:FinancialAssetsMeasuredFairValueProfitLoss', ai) + getParameter(xml, 'tw-gaap-fh:SecuritiesPurchasedResellAgreements', ai) + getParameter(xml, 'tw-gaap-fh:LoansDiscountedNet', ai) + getParameter(xml, 'tw-gaap-fh:AvailableSaleFinancialAssetsNet', ai);
                    asset[y][q].payable = getParameter(xml, 'tw-gaap-fh:DepositsCentralBankBanks', ai) + getParameter(xml, 'tw-gaap-fh:Deposits', ai) + getParameter(xml, 'tw-gaap-fh:Payables', ai);
                    asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tw-gaap-fh:CommercialPapersIssued', ai) + getParameter(xml, 'tw-gaap-fh:FinancialLiabilitiesMeasuredFairValueProfitLoss', ai) + getParameter(xml, 'tw-gaap-fh:SecuritiesSoldRepurchaseAgreements', ai) + getParameter(xml, 'tw-gaap-fh:DueCentralBankOtherBanks', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-fh:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (quarterIsEmpty(asset[y][q])) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-basi:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-basi:Capital', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-basi:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-basi:FixedAssets-Net', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-basi:MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-basi:StockholdersEquity', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-basi:Assets', ai);
                    asset[y][q].longterm = getParameter(xml, 'tw-gaap-basi:HeldMaturityFinancialAssetsNet', ai) + getParameter(xml, 'tw-gaap-basi:OtherFinancialAssetsNet', ai);
                    asset[y][q].receivable = getParameter(xml, 'tw-gaap-basi:ReceivablesNet', ai) + getParameter(xml, 'tw-gaap-basi:DueTheCentralBankCallLoansBanks-BalanceSheet', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-basi:DiscountsLoansNet', ai) + getParameter(xml, 'tw-gaap-basi:FinancialAssetsMeasuredFairValueProfitLoss', ai) + getParameter(xml, 'tw-gaap-basi:AvailableSaleFinancialAssetsNet', ai);
                    asset[y][q].payable = getParameter(xml, 'tw-gaap-basi:DepositsTheCentralBankBanks', ai) + getParameter(xml, 'tw-gaap-basi:DepositsRemittances', ai) + getParameter(xml, 'tw-gaap-basi:Payables', ai);
                    asset[y][q].current_liabilities = asset[y][q].payable + getParameter(xml, 'tw-gaap-basi:FinancialLiabilitiesMeasuredFairValueProfitLoss', ai) + getParameter(xml, 'tw-gaap-basi:NotesBondsIssuedRepurchaseAgreement', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-basi:Liabilities', ai) - asset[y][q].current_liabilities;
                    if (asset[y][q].total === 0) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-bd:CapitalStock', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-bd:CapitalStock', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-bd:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-bd:FixedAssets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-bd:MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-bd:StockholdersEquities', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-bd:Assets', ai);
                    asset[y][q].longterm = getParameter(xml, 'tw-gaap-bd:FundsLongTermInvestments', ai);
                    asset[y][q].OCFA = getParameter(xml, 'tw-gaap-bd:CustomerMarginAccount', ai);
                    asset[y][q].receivable = getParameter(xml, 'tw-gaap-bd:MarginLoansReceivable', ai) + getParameter(xml, 'tw-gaap-bd:NotesReceivable', ai) + getParameter(xml, 'tw-gaap-bd:AccountsReceivable', ai) + getParameter(xml, 'tw-gaap-bd:Prepayments', ai) + getParameter(xml, 'tw-gaap-bd:OtherReceivables', ai) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingCollateralPrice', ai) + getParameter(xml, 'tw-gaap-bd:SecurityBorrowingMargin', ai) + getParameter(xml, 'tw-gaap-bd:RefinancingMargin', ai) + getParameter(xml, 'tw-gaap-bd:RefinancingCollateralReceivable', ai) + getParameter(xml, 'tw-gaap-bd:PrepaidPensionCurrent', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-bd:FinancialAssetsMeasuredFairValueProfitLossCurrent', ai) + getParameter(xml, 'tw-gaap-bd:AvailableSaleFinancialAssetsCurrent-BalanceSheet', ai) + getParameter(xml, 'tw-gaap-bd:BondInvestmentsResaleAgreements', ai);
                    asset[y][q].payable = getParameter(xml, 'tw-gaap-bd:CommercialPaperPayable', ai) + getParameter(xml, 'tw-gaap-bd:SecuritiesFinancingRefundableDeposits', ai) + getParameter(xml, 'tw-gaap-bd:DepositsPayableSecuritiesFinancing', ai) + getParameter(xml, 'tw-gaap-bd:SecuritiesLendingRefundableDeposits', ai) + getParameter(xml, 'tw-gaap-bd:AccountsPayable', ai) + getParameter(xml, 'tw-gaap-bd:AmountsReceivedAdvance', ai) + getParameter(xml, 'tw-gaap-bd:ReceiptsCustody', ai) + getParameter(xml, 'tw-gaap-bd:OtherPayable', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-bd:LongTermLiability', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'tw-gaap-bd:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (asset[y][q].total === 0) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:Capital', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-mim:Capital', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-mim:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-mim:FixedAssets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-mim:MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-mim:StockholdersEquity', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-mim:Assets', ai);
                    asset[y][q].longterm = getParameter(xml, 'tw-gaap-mim:FundsInvestments', ai);
                    asset[y][q].receivable = getParameter(xml, 'tw-gaap-mim:Receivables', ai) + getParameter(xml, 'tw-gaap-mim:DueCentralBankCallLoansBanks', ai) + getParameter(xml, 'tw-gaap-ci:OtherPrepayments', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-mim:FinancialAssetsMeasuredFairValueProfitLossCurrent', ai) + getParameter(xml, 'tw-gaap-mim:AvailableSaleFinancialAssetsCurrent', ai) + getParameter(xml, 'tw-gaap-mim:SecuritiesPurchasedResellAgreements', ai) + getParameter(xml, 'tw-gaap-mim:Inventories', ai) + getParameter(xml, 'tw-gaap-mim:DiscountsLoansNet', ai);
                    asset[y][q].payable = getParameter(xml, 'tw-gaap-mim:Payables', ai) + getParameter(xml, 'tw-gaap-mim:DepositsCentralBankBanks', ai) + getParameter(xml, 'tw-gaap-mim:DepositsRemittances', ai);
                    asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-mim:LongtermLiabilities', ai);
                    asset[y][q].current_liabilities = getParameter(xml, 'tw-gaap-mim:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (asset[y][q].total === 0) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ins:CommonStock', ai)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!asset[y]) {
                    asset[y] = [];
                }
                if (!asset[y][q] || !no_cover) {
                    asset[y][q] = {receivable: 0, payable: 0, cash: 0, inventories: 0, OCFA: 0, property: 0, current_liabilities: 0, noncurrent_liabilities: 0, equityParent: 0, equityChild: 0, share: 0, total: 0, longterm: 0};
                    asset[y][q].share = getParameter(xml, 'tw-gaap-ins:CommonStock', ai);
                    asset[y][q].cash = getParameter(xml, 'tw-gaap-ins:CashCashEquivalents', ai);
                    asset[y][q].property = getParameter(xml, 'tw-gaap-ins:FixedAssets', ai);
                    asset[y][q].equityChild = getParameter(xml, 'tw-gaap-ins:MinorityInterest', ai);
                    asset[y][q].equityParent = getParameter(xml, 'tw-gaap-ins:StockholdersEquity', ai) - asset[y][q].equityChild;
                    asset[y][q].total = getParameter(xml, 'tw-gaap-ins:Assets', ai);
                    asset[y][q].inventories = getParameter(xml, 'tw-gaap-ins:FinancialAssetsMeasuredFairValueProfitLoss', ai) + getParameter(xml, 'tw-gaap-ins:InvestmentsNotesBondsResaleAgreement', ai) + getParameter(xml, 'tw-gaap-ins:Loans', ai) + getParameter(xml, 'tw-gaap-ins:AvailableSaleFinancialAssets', ai);
                    if (getParameter(xml, 'tw-gaap-ins:Receivables', ai)) {
                        asset[y][q].receivable = getParameter(xml, 'tw-gaap-ins:Receivables', ai) + getParameter(xml, 'tw-gaap-ins:PrepaidAccounts', ai) + getParameter(xml, 'tw-gaap-ins:ReinsuranceLiabilityReserveContributed', ai);
                        asset[y][q].longterm = getParameter(xml, 'tw-gaap-ins:Investments', ai) - asset[y][q].inventories + getParameter(xml, 'tw-gaap-ins:ReinsuranceReservesAssets-Net', ai);
                        asset[y][q].payable = getParameter(xml, 'tw-gaap-ins:AccountsPayable', ai) + getParameter(xml, 'tw-gaap-ins:AdvanceReceipts', ai) + getParameter(xml, 'tw-gaap-ins:GuaranteeDepositsMarginsReceived', ai);
                        asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-ins:LiabilitiesInsuranceProductSeparatedAccount', ai) + getParameter(xml, 'tw-gaap-ins:LiabilitiesReserves', ai) + getParameter(xml, 'tw-gaap-ins:BondsPayable', ai) + getParameter(xml, 'tw-gaap-ins:PreferredStockLiabilities', ai) + getParameter(xml, 'tw-gaap-ins:FinancialLiabilitiesCarriedCost', ai);
                    } else {
                        asset[y][q].receivable = getParameter(xml, 'tw-gaap-ins:GuaranteeDepositsPaid', ai) + getParameter(xml, 'tw-gaap-ins:NotesReceivableNet', ai) + getParameter(xml, 'tw-gaap-ins:NotesReceivableRelatedPartiesNet', ai) + getParameter(xml, 'tw-gaap-ins:PremiumsReceivableNet', ai) + getParameter(xml, 'tw-gaap-ins:ClaimsRecoverableReinsurers', ai) + getParameter(xml, 'tw-gaap-ins:DueReinsurersCedingCompaniesNet', ai) + getParameter(xml, 'tw-gaap-ins:PrepaymentReinsuranceExpenses', ai) + getParameter(xml, 'tw-gaap-ins:ReinsuranceReceivable', ai) + getParameter(xml, 'tw-gaap-ins:OtherReceivables', ai) + getParameter(xml, 'tw-gaap-ins:Prepayments', ai);
                        asset[y][q].longterm = getParameter(xml, 'tw-gaap-ins:HeldMaturityFinancialAssets', ai) + getParameter(xml, 'tw-gaap-ins:FinancialAssetsCarriedCostCurrent', ai) + getParameter(xml, 'tw-gaap-ins:DebtInvestmentsWithoutActiveMarket', ai) + getParameter(xml, 'tw-gaap-ins:OtherFinancialAssetsCurrent', ai) + getParameter(xml, 'tw-gaap-ins:FundsInvestments', ai);
                        asset[y][q].payable = getParameter(xml, 'tw-gaap-ins:NotesPayable', ai) + getParameter(xml, 'tw-gaap-ins:CommissionsPayable', ai) + getParameter(xml, 'tw-gaap-ins:ClaimsPayable', ai) + getParameter(xml, 'tw-gaap-ins:CurrentLiabilities-DueReinsurersCedingCompanies', ai) + getParameter(xml, 'tw-gaap-ins:ReinsurancePremiumsPayable', ai) + getParameter(xml, 'tw-gaap-ins:OtherPayables', ai) + getParameter(xml, 'tw-gaap-ins:AdvanceReceipts', ai) + getParameter(xml, 'tw-gaap-ins:GuaranteeDepositsMarginsReceived', ai);
                        asset[y][q].noncurrent_liabilities = getParameter(xml, 'tw-gaap-ins:ReserveOperationsLiabilities', ai) + getParameter(xml, 'tw-gaap-ins:LongTermLiabilities', ai);
                    }
                    asset[y][q].current_liabilities = getParameter(xml, 'tw-gaap-ins:Liabilities', ai) - asset[y][q].noncurrent_liabilities;
                    if (asset[y][q].total === 0) {
                        asset[y][q] = null;
                    }
                    if (quarterIsEmpty(asset[y])) {
                        delete asset[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
        }
    },
    getSales: function(xml, sales, cash, no_cover) {
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
            if (xmlDate = getXmlDate(xml, 'tw-gaap-ci:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-basi:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-bd:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ins:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ar:CashCashEquivalents', 0)) {
                year = xmlDate.year;
                quarter = xmlDate.quarter;
                if (year === 2010 && quarter === 1 && (xml.xbrl.context[0].entity[0].identifier[0]['_'] === '5315' || xml.xbrl.context[0].entity[0].identifier[0]['_'] === '6148')) {
                    return sales;
                }
            } else {
                console.log('umknown date');
                return false;
            }
        }
        var xmlDate = {};
        var isOk = false;
        for (var i = 0; i < 4; i++) {
            if (type === 1) {
                if (xmlDate = califrsSales(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            } else {
                if (xmlDate = calgaapSales(i, no_cover)) {
                    if (xmlDate.year === year && xmlDate.quarter === quarter) {
                        isOk = true;
                    }
                }
            }
        }
        if (!isOk && (year !== 2009 || quarter !== 4 || xml.xbrl.context[0].entity[0].identifier[0]['_'] !== '3664')) {
            console.log('unknown finance data');
            return false;
        }
        return sales;
        function califrsSales(si, no_cover) {
            var xmlDate = {};
            var y = 0,q = 0;
            if ((xmlDate = getXmlDate(xml, 'tifrs-bsci-ci:OperatingRevenue', si)) || (xmlDate = getXmlDate(xml, 'tifrs-bsci-ci:OperatingExpenses', si))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
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
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-fh:NetInterestIncomeExpense', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                    sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                    sales[y][q].revenue = getParameter(xml, 'ifrs:RevenueFromInterest', si) + getParameter(xml, 'tifrs-bsci-fh:NetIncomeLossOfInsuranceOperations', si) + getParameter(xml, 'tifrs-bsci-fh:NetServiceFeeChargeAndCommissionsIncomeLoss', si) + getParameter(xml, 'tifrs-bsci-fh:GainsOnFinancialAssetsLiabilitiesAtFairValueThroughProfitOrLoss', si) + getParameter(xml, 'tifrs-bsci-fh:GainLossOnInvestmentProperty', si) + getParameter(xml, 'tifrs-bsci-fh:RealizedGainsOnAvailableForSaleFinancialAssets', si) + getParameter(xml, 'tifrs-bsci-fh:RealizedGainsOnHeldToMaturityFinancialAssets', si);
                    sales[y][q].cost = getParameter(xml, 'ifrs:InterestExpense', si) + getParameter(xml, 'tifrs-bsci-fh:NetChangeInProvisionsForInsuranceLiabilities', si) + getParameter(xml, 'tifrs-bsci-fh:LossesOnFinancialAssetsLiabilitiesAtFairValueThroughProfitOrLoss', si) + getParameter(xml, 'tifrs-bsci-fh:RealizedLossesOnAvailableForSaleFinancialAssets', si) + getParameter(xml, 'tifrs-bsci-fh:RealizedLossesOnHeldToMaturityFinancialAssets', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-fh:OperatingExpenses', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-fh:BadDebtExpensesAndGuaranteeLiabilityProvisions', si);
                    sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-fh:TaxExpenseIncome', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-basi:NetIncomeLossOfInterest', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                    sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                    sales[y][q].revenue = getParameter(xml, 'ifrs:RevenueFromInterest', si) + getParameter(xml, 'tifrs-bsci-basi:ServiceFee', si) + getParameter(xml, 'tifrs-bsci-basi:GainsOnFinancialAssetsOrLiabilitiesMeasuredAtFairValueThroughProfitOrLoss', si) + getParameter(xml, 'tifrs-bsci-basi:GainsOnDisposalOfAvailableForSaleFinancialAssets', si);
                    sales[y][q].cost = getParameter(xml, 'ifrs:InterestExpense', si) + getParameter(xml, 'tifrs-bsci-basi:ServiceCharge', si) + getParameter(xml, 'tifrs-bsci-basi:LossesOnFinancialAssetsOrLiabilitiesMeasuredAtFairValueThroughProfitOrLoss', si) + getParameter(xml, 'tifrs-bsci-basi:RealizedLossesOnAvailableForSaleFinancialAssets', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-basi:OperatingExpense', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-basi:BadDebtExpensesAndGuaranteeLiabilityProvision', si);
                    sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-basi:TaxIncomeExpenseRelatedToComponentsOfNetIncome', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-bd:TotalRevenue', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                    sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                    sales[y][q].revenue = getParameter(xml, 'tifrs-bsci-bd:TotalRevenue', si);
                    sales[y][q].expenses = getParameter(xml, 'ifrs:EmployeeBenefitsExpense', si) + getParameter(xml, 'ifrs:DepreciationAndAmortisationExpense', si);
                    sales[y][q].finance_cost = getParameter(xml, 'ifrs:FinanceCosts', si);
                    sales[y][q].cost = getParameter(xml, 'tifrs-bsci-bd:TotalExpenditureAndExpense', si) - sales[y][q].expenses - sales[y][q].finance_cost;
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].tax = -getParameter(xml, 'tifrs-bsci-bd:IncomeTaxBenefitExpense', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-mim:OperatingExpenses', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                    sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                    sales[y][q].revenue = getParameter(xml, 'ifrs:Revenue', si) - getParameter(xml, 'ifrs:OtherIncome', si) - getParameter(xml, 'tifrs-bsci-mim:ForeignExchangeGains', si) - getParameter(xml, 'tifrs-bsci-mim:ReversalOfImpairmentLossOnAssets', si) - getParameter(xml, 'tifrs-bsci-mim:ShareOfProfitOfAssociatesAndJointVenturesAccountedForUsingEquityMethod', si);
                    sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-mim:OperatingExpenses', si);
                    sales[y][q].cost = getParameter(xml, 'tifrs-bsci-mim:Expenses', si) - getParameter(xml, 'tifrs-bsci-mim:OtherExpenses', si) - getParameter(xml, 'tifrs-bsci-mim:ShareOfLossOfAssociatesAndJointVenturesAccountedForUsingEquityMethod', si) - sales[y][q].expenses;
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].finance_cost = getParameter(xml, 'tifrs-bsci-mim:BadDebtExpensesAndGuaranteeLiabilityProvisions', si);
                    sales[y][q].tax = getParameter(xml, 'ifrs:TaxExpenseIncome', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tifrs-bsci-ins:OperatingRevenue', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].profit = getParameter(xml, 'ifrs:ProfitLoss', si);
                    sales[y][q].comprehensive = getParameter(xml, 'ifrs:OtherComprehensiveIncome', si);
                    sales[y][q].revenue = getParameter(xml, 'tifrs-bsci-ins:OperatingRevenue', si);
                    sales[y][q].cost = getParameter(xml, 'tifrs-bsci-ins:OperatingCosts', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tifrs-bsci-ins:OperatingExpenses', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].finance_cost = getParameter(xml, 'ifrs:InterestExpense', si);
                    sales[y][q].tax = getParameter(xml, 'ifrs:IncomeTaxExpenseContinuingOperations', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'ifrs:BasicEarningsLossPerShare', si);
                    if (quarterIsEmpty(sales[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
        }
        function calgaapSales(si, no_cover) {
            var xmlDate = {};
            var y = 0,q = 0;
            if ((xmlDate = getXmlDate(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', si)) || (xmlDate = getXmlDate(xml, 'tw-gaap-ci:NetIncomeLoss', si))) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-ci:OperatingRevenue', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-ci:OperatingCosts', si);
                    sales[y][q].gross_profit = getParameter(xml, 'tw-gaap-ci:GrossProfitLossOperations', si);
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-ci:OperatingExpenses', si);
                    sales[y][q].operating = getParameter(xml, 'tw-gaap-ci:OperatingIncomeLoss', si);
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-ci:ConsolidatedTotalIncome', si) + getParameter(xml, 'tw-gaap-ci:NetIncomeLoss', si);
                    sales[y][q].tax = getParameter(xml, 'tw-gaap-ci:IncomeTaxExpenseBenefit', si);
                    sales[y][q].nonoperating = getParameter(xml, 'tw-gaap-ci:NonOperatingIncomeGains', si) - getParameter(xml, 'tw-gaap-ci:NonOperatingExpenses', si);
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-ci:PrimaryEarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-ci:InterestExpense', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-fh:InterestIncomes', si) + getParameter(xml, 'tw-gaap-fh:NetIncomeLossInsuranceOperations', si) + getParameter(xml, 'tw-gaap-fh:NetServiceFeeChargeCommissionsIncomeLoss', si) + getParameter(xml, 'tw-gaap-fh:GainsFinancialAassetsLiabilitiesMeasuredFairValueProfitLoss', si) + getParameter(xml, 'tw-gaap-fh:RealizedGainsAvailableSaleFinancialAssets', si) + getParameter(xml, 'tw-gaap-fh:RealizedGainsHeldMaturityFinancialAassets', si) + getParameter(xml, 'tw-gaap-fh:GainsRealEstateInvestments', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-fh:InterestExpenses', si) - getParameter(xml, 'tw-gaap-fh:NetChangeInReservesForLiabilities', si) - getParameter(xml, 'tw-gaap-fh:RecoveredProvisionMiscellaneousInsuranceReserve', si) + getParameter(xml, 'tw-gaap-fh:GainsFinancialAassetsLiabilitiesMeasuredFairValueProfitLoss', si) + getParameter(xml, 'tw-gaap-fh:RealizedLossesAvailableSaleFinancialAssets', si) + getParameter(xml, 'tw-gaap-fh:RealizedLossesHeldMaturityFinancialAssets', si) + getParameter(xml, 'tw-gaap-fh:LossesRealEstateInvestments', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-fh:OperatingExpenses', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-fh:ConsolidatedIncomeLossContinuingOperationsNetIncomeTax', si);
                    sales[y][q].tax = -getParameter(xml, 'tw-gaap-fh:IncomeTaxExpenseBenefit', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-fh:PrimaryEarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-fh:BadDebtExpensesLoan', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-basi:InterestIncomes', si) + getParameter(xml, 'tw-gaap-basi:ServiceFee', si) + getParameter(xml, 'tw-gaap-basi:GainsFinancialAssetsLiabilitiesMeasuredFairValueProfitLoss', si) + getParameter(xml, 'tw-gaap-basi:RealizedGainsAvailableSaleFinancialAssets', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-basi:InterestExpenses', si) + getParameter(xml, 'tw-gaap-basi:ServiceCharge', si) + getParameter(xml, 'tw-gaap-basi:LossesFinancialAssetsLiabilitiesMeasuredFairValueProfitLoss', si) + getParameter(xml, 'tw-gaap-basi:RealizedLossesAvailableSaleFinancialAssets', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-basi:PersonnelExpenses', si) + getParameter(xml, 'tw-gaap-basi:DepreciationAmortizationExpense', si) + getParameter(xml, 'tw-gaap-basi:OtherGeneralAdministrativeExpenses', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-basi:IncomeLossContinuingOperations', si);
                    sales[y][q].tax = -getParameter(xml, 'tw-gaap-basi:IncomeTaxExpenseBenefitContinuingOperations', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-basi:PrimaryEarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-basi:BadDebtExpensesLoan', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-bd:ConsolidatedNetIncome', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-bd:Revenue', si) - getParameter(xml, 'tw-gaap-bd:NonOperatingRevenuesGains', si);
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-bd:OperatingExpenses', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-bd:Expenditure', si) - sales[y][q].expenses - getParameter(xml, 'tw-gaap-bd:NonOperatingExpenseLoss', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-bd:ConsolidatedNetIncome', si);
                    sales[y][q].tax = getParameter(xml, 'tw-gaap-bd:IncomeTaxExpense', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-bd:PrimaryEarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-bd:InterestExpenses', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-mim:Revenues', si) - getParameter(xml, 'tw-gaap-mim:OtherIncome', si) - getParameter(xml, 'tw-gaap-mim:ForeignExchangeGains', si) - getParameter(xml, 'tw-gaap-mim:ReversalImpairmentLossAssets', si) - getParameter(xml, 'tw-gaap-mim:InvestmentIncomeEquityMethodInvestees', si) - getParameter(xml, 'tw-gaap-mim:GainDisposalFixedAssets', si);
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-mim:OperatingExpenses', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-mim:Expenses', si) - getParameter(xml, 'tw-gaap-mim:OtherExpenses', si) - getParameter(xml, 'tw-gaap-mim:ForeignExchangeLosses', si) - getParameter(xml, 'tw-gaap-mim:ImpairmentLosses', si) - getParameter(xml, 'tw-gaap-mim:LossDisposalFixedAssets', si) - getParameter(xml, 'tw-gaap-mim:InvestmentLossEquityMethodInvestee', si) - sales[y][q].expenses;
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-mim:ConsolidatedTotalIncome-IncomeStatement', si);
                    sales[y][q].tax = getParameter(xml, 'tw-gaap-mim:IncomeTaxExpenses', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-mim:PrimaryEarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-mim:BadDebtExpensesLoan', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else if (xmlDate = getXmlDate(xml, 'tw-gaap-ins:NetIncomeLossContinuingOperations', si)) {
                y = xmlDate.year;
                q = xmlDate.quarter-1;
                if (!sales[y]) {
                    sales[y] = [];
                }
                if (!sales[y][q] || !no_cover) {
                    sales[y][q] = {gross_profit: 0, profit: 0, comprehensive: 0, revenue: 0, expenses: 0, tax: 0, eps: 0, nonoperating: 0, finance_cost: 0, cost: 0, operating: 0};
                    sales[y][q].revenue = getParameter(xml, 'tw-gaap-ins:OperatingIncomes', si);
                    sales[y][q].cost = getParameter(xml, 'tw-gaap-ins:OperatingCosts', si);
                    sales[y][q].gross_profit = sales[y][q].revenue - sales[y][q].cost;
                    sales[y][q].expenses = getParameter(xml, 'tw-gaap-ins:OperatingExpenses', si);
                    sales[y][q].operating = sales[y][q].gross_profit - sales[y][q].expenses;
                    sales[y][q].profit = getParameter(xml, 'tw-gaap-ins:NetIncomeLossContinuingOperations', si);
                    sales[y][q].tax = getParameter(xml, 'tw-gaap-ins:IncomeTaxExpenseBenefit', si);
                    sales[y][q].nonoperating = sales[y][q].profit + sales[y][q].tax - sales[y][q].operating;
                    sales[y][q].eps = getParameter(xml, 'tw-gaap-ins:EarningsPerShare', si);
                    sales[y][q].finance_cost = getParameter(xml, 'tw-gaap-ins:InterestExpense', si);
                    if (quarterIsEmpty(sales[y][q]) || quarterIsEmpty(cash[y][q])) {
                        sales[y][q] = null;
                    }
                    if (quarterIsEmpty(sales[y])) {
                        delete sales[y];
                    }
                }
            } else {
                return false;
            }
            return xmlDate;
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
                    assetStatus[i][j] = {total: asset[i][j].total, receivable: Math.ceil(asset[i][j].receivable/asset[i][j].total*1000)/10, cash: Math.ceil(asset[i][j].cash/asset[i][j].total*1000)/10, OCFA: Math.ceil(asset[i][j].OCFA/asset[i][j].total*1000)/10, inventories: Math.ceil(asset[i][j].inventories/asset[i][j].total*1000)/10, property: Math.ceil(asset[i][j].property/asset[i][j].total*1000)/10, longterm: Math.ceil(asset[i][j].longterm/asset[i][j].total*1000)/10, other: Math.ceil((asset[i][j].total - asset[i][j].cash - asset[i][j].inventories - asset[i][j].receivable - asset[i][j].OCFA - asset[i][j].property - asset[i][j].longterm)/asset[i][j].total*1000)/10, equityChild: Math.ceil(asset[i][j].equityChild/asset[i][j].total*1000)/10 , equityParent: Math.ceil(asset[i][j].equityParent/asset[i][j].total*1000)/10, noncurrent_liabilities: Math.ceil(asset[i][j].noncurrent_liabilities/asset[i][j].total*1000)/10, current_liabilities_without_payable: Math.ceil((asset[i][j].current_liabilities - asset[i][j].payable)/asset[i][j].total*1000)/10, payable: Math.ceil(asset[i][j].payable/asset[i][j].total*1000)/10};
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
                    if (!sales[i][j].revenue) {
                        sales[i][j].revenue = 1;
                    }
                    salesStatus[i][j] = {revenue: sales[i][j].revenue, cost: Math.ceil(sales[i][j].cost/sales[i][j].revenue*1000)/10, expenses: Math.ceil(sales[i][j].expenses/sales[i][j].revenue*1000)/10, finance_cost: Math.ceil(sales[i][j].finance_cost/sales[i][j].revenue*1000)/10, nonoperating_without_FC: Math.ceil((sales[i][j].nonoperating+sales[i][j].finance_cost)/sales[i][j].revenue*1000)/10, tax: Math.ceil(sales[i][j].tax/sales[i][j].revenue*1000)/10, comprehensive: Math.ceil(sales[i][j].comprehensive/sales[i][j].revenue*1000)/10, profit: Math.ceil(sales[i][j].profit/sales[i][j].revenue*1000)/10, profit_comprehensive: Math.ceil((sales[i][j].profit+sales[i][j].comprehensive)/sales[i][j].revenue*1000)/10, eps: sales[i][j].eps};
                    if ((j === '1' || j === '2' || j === '3') && sales[i][Number(j)-1]) {
                        salesStatus[i][j].quarterRevenue = sales[i][j].revenue - sales[i][Number(j)-1].revenue;
                        if (!salesStatus[i][j].quarterRevenue) {
                            salesStatus[i][j].quarterRevenue = 1;
                        }
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
                    revenue.push(salesStatus[i][j].quarterRevenue);
                    profit.push(Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100));
                    cash.push(asset[i][j].cash);
                    inventories.push(asset[i][j].inventories);
                    receivable.push(asset[i][j].receivable);
                    payable.push(asset[i][j].payable);
                    managementStatus[i][j] = {revenue: salesStatus[i][j].quarterRevenue, profit: Math.ceil(salesStatus[i][j].quarterProfit * salesStatus[i][j].quarterRevenue/100), cash: asset[i][j].cash, inventories: asset[i][j].inventories, receivable: asset[i][j].receivable, payable: asset[i][j].payable};
                } else {
                    startY = 0;
                    startQ = 0;
                    revenue = [];
                    profit = [];
                    cash = [];
                    inventories = [];
                    receivable = [];
                    payable = [];
                    managementStatus[i] = [];
                    delete managementStatus[i-1];
                }
            }
        }
        realY = Number(startY);
        realQ = Number(startQ);
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
            for (var i = 0; i < 8; i++) {
                if (bQ > 3) {
                    bQ = 0;
                    bY++;
                }
                if (managementStatus[bY] && managementStatus[bY][bQ]) {
                    managementStatus[bY][bQ][dataRelative] = 0;
                }
                bQ++;
            }
            for (var i = 2; i < revenue.length; i++) {
                if (Q > 3) {
                    Q = 0;
                    Y++;
                }
                if (managementStatus[Y][Q]) {
                    Relative = 0;
                    for (var j = 0; j <= i; j++) {
                        Relative += (revenue[j] - revenueEven[i-2]) * (data[j] - dataEven[i-2]);
                    }
                    if (dataVariance[i-2] && revenueVariance[i-2]) {
                        managementStatus[Y][Q][dataRelative] = Math.ceil(Relative / dataVariance[i-2] / revenueVariance[i-2] * 1000) / 1000;
                    } else {
                        managementStatus[Y][Q][dataRelative] = 0;
                    }
                } else {
                    i--;
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
            return -10;
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
                        sales = this_obj.getSales(xml, sales, cash, is_start);
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
                    var filesize = 0;
                    if (err) {
                        if (err.code !== 'HPE_INVALID_CONSTANT' && err.code !== 'ECONNREFUSED' && err.code !== 'ENOTFOUND' && err.code !== 'ETIMEDOUT') {
                            util.handleError(err, callback, callback);
                        }
                    } else {
                        filesize = fs.statSync(xmlPath)['size'];
                        console.log(filesize);
                    }

                    if (wait > 150000 || filesize === 350 || err) {
                        if (err) {
                            util.handleError(err);
                        }
                        if (wait > 150000 || filesize === 350 || err.code === 'HPE_INVALID_CONSTANT') {
                            if (filesize === 350) {
                                fs.unlinkSync(xmlPath);
                            }
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
                                                util.handleError(err, callback, callback);
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
                                    console.log('stock finance data not exist');
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
                        } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
                            wait += 10000;
                            setTimeout(function(){
                                recur_getTwseXml();
                            }, wait);
                        }
                    } else {
                        if (filesize < 10000) {
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
                                sales = this_obj.getSales(xml, sales, cash, is_start);
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
    //抓上市及上櫃
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
                        api.xuiteDownload(url + "otc", filePath, function(err) {
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
                                    setTimeout(function(){
                                        callback(null, list);
                                    }, 0);
                                    /*api.xuiteDownload(url + "rotc", filePath, function(err) {
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
                                                            }
                                                            setTimeout(function(){
                                                                callback(null, list);
                                                            }, 0);
                                                        });
                                                    });
                                                }, 600000, false);
                                            });
                                        });
                                    }, 600000, false);*/
                                });
                            });
                        }, 600000, false);
                    });
                });
            }, 600000, false);
            break;
            default:
            util.handleError({hoerror: 2, message: "stock type unknown!!!"}, callback, callback);
        }
    },
    getStockPER: function(id, callback) {
        mongo.orig("find", "stock", {_id: id}, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, callback, callback);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: "can not find stock!!!"}, callback, callback);
            }
            sales = items[0].sales;
            var date = new Date();
            var year = date.getFullYear();
            while (!sales[year] && year > 2000) {
                year--;
            }
            var yearEPS = 0
            for (var i = 3; i >=0; i--) {
                if (sales[year][i]) {
                    if (i === 3) {
                        yearEPS = sales[year][i].eps;
                        break;
                    } else {
                        if (sales[year-1] && sales[year-1][3] && sales[year-1][i]) {
                            yearEPS = sales[year][i].eps + sales[year-1][3].eps - sales[year-1][i].eps;
                            break;
                        }
                    }
                }
            }
            getStockPrice(items[0].type, items[0].index, function(err, price) {
                if(err) {
                    util.handleError(err, callback, callback);
                }
                var per = 0;
                if (yearEPS > 0) {
                    per = Math.ceil(price/yearEPS*1000)/1000;
                }
                setTimeout(function(){
                    callback(null, per);
                }, 0);
            });
        });
    },
    getStockYield: function(id, callback) {
        mongo.orig("find", "stock", {_id: id}, {limit: 1}, function(err, items){
            if(err) {
                util.handleError(err, callback, callback);
            }
            if (items.length === 0) {
                util.handleError({hoerror: 2, message: "can not find stock!!!"}, callback, callback);
            }
            switch(items[0].type) {
                case 'twse':
                var url = 'http://mops.twse.com.tw/mops/web/ajax_t05st09?encodeURIComponent=1&step=1&firstin=1&off=1&keyword4=' + items[0].index + '&code1=&TYPEK2=&checkbtn=1&queryName=co_id&TYPEK=all&isnew=true&co_id=' + items[0].index;
                api.xuiteDownload(url, '', function(err, data) {
                    if (err) {
                        util.handleError(err, callback, callback);
                    }
                    var raw = data.match(/<TD align='right' [^&]+/g);
                    if (raw.length < 2) {
                        util.handleError({hoerror: 2, message: "can not find dividends!!!"}, callback, callback);
                    }
                    var dividends = Number(raw[0].match(/\d+(\.\d+)?/)[0]) + Number(raw[1].match(/\d+(\.\d+)?/)[0]);
                    getStockPrice(items[0].type, items[0].index, function(err, price) {
                        if(err) {
                            util.handleError(err, callback, callback);
                        }
                        var yield = 0;
                        if (dividends > 0) {
                            yield = Math.ceil(price/dividends*1000)/1000;
                        }
                        setTimeout(function(){
                            callback(null, yield);
                        }, 0);
                    });
                }, 10000, false, false);
                break;
                default:
                util.handleError({hoerror: 2, message: "stock type unknown!!!"}, callback, callback);
            }
        });
    },
};

function getStockPrice(type, index, callback) {
    var name = index;
    if (type === 'twse') {
        name+= '.tw+' + index + '.two';
    }
    var url = 'http://download.finance.yahoo.com/d/quotes.csv?s=' + name + '&f=l1';
    api.xuiteDownload(url, '', function(err, result) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        var price = result.match(/\d+(\.\d+)/)[0];
        if (price) {
            setTimeout(function(){
                callback(null, price);
            }, 0);
        } else {
            util.handleError({hoerror: 2, message: "stock price get fail"}, callback, callback);
        }
    }, 10000, false, false);
}

function getBasicStockData(type, index, callback) {
    switch(type) {
        case 'twse':
        var url = 'http://mops.twse.com.tw/mops/web/ajax_quickpgm?encodeURIComponent=1&step=4&firstin=1&off=1&keyword4=' + index + '&code1=&TYPEK2=&checkbtn=1&queryName=co_id&TYPEK=all&co_id=' + index;
        api.xuiteDownload(url, '', function(err, data) {
            if (err) {
                util.handleError(err, callback, callback);
            }
            var raw = data.match(/>[^<]+<\/a>/g);
            if (raw.length < 1) {
                util.handleError({hoerror: 2, message: "can not find basic data!!!"}, callback, callback);
            }
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
        }, 600000, false, false);
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

function getXmlDate(xml, name, index) {
    if (xml.xbrl[name] && xml.xbrl[name][index] && xml.xbrl[name][index]['$'] && xml.xbrl[name][index]['$'].contextRef) {
        var result = xml.xbrl[name][index]['$'].contextRef.match(/^AsOf(\d\d\d\d)(\d\d)\d\d$/);
        if (!result) {
            result = xml.xbrl[name][index]['$'].contextRef.match(/^From\d\d\d\d01\d\dTo(\d\d\d\d)(\d\d)\d\d$/);
            if (!result) {
                return false;
            }
        }
        var year = Number(result[1]);
        var quarter = 0;
        if (result[2] === '01') {
            quarter = 4;
            year--;
        } else if (result[2] === '03') {
            quarter = 1;
        } else if (result[2] === '06') {
            quarter = 2;
        } else if (result[2] === '09') {
            quarter = 3;
        } else if (result[2] === '12') {
            quarter = 4;
        } else {
            return false;
        }
        return {year: year, quarter: quarter};
    } else {
        return false;
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
