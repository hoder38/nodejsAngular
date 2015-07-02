//sudo -i node /home/pi/app/nodejsAngular/src/test/cmd.js stock 1 8213
//記得等db connect
var stockTool = require("../web/models/stock-tool.js");
var util = require("../web/util/utility.js");
var mongo = require("../web/models/mongo-tool.js");
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function cmdUpdateStock(updateType, singleIndex) {
    updateType = (typeof updateType !== 'undefined' && !isNaN(Number(updateType))) ? Number(updateType) : 1;
    console.log('cmdUpdateStock');
    console.log(new Date());
    console.log('update stock');
    if (singleIndex) {
        updateStock(updateType, 'twse', [singleIndex], 0, function(err) {
            if(err) {
                util.handleError(err);
            } else {
                console.log('stock update complete');
            }
        });
    } else {
        stockTool.getStockList('twse', function(err, stocklist){
            if(err) {
                util.handleError(err);
            } else {
                if (stocklist.length < 1) {
                    console.log('empty stock list');
                } else {
                    updateStock(updateType, 'twse', stocklist, 0, function(err) {
                        if(err) {
                            util.handleError(err);
                        } else {
                            console.log('stock update complete');
                        }
                    });
                }
            }
        });
    }
}

function updateStock(updateType, type, stocklist, index, callback) {
    console.log('updateStock');
    console.log(new Date());
    console.log(stocklist[index]);
    stockTool.getSingleStock(type, stocklist[index], function(err) {
        if (err) {
            util.handleError(err, callback, callback);
        }
        index++;
        if (index < stocklist.length) {
            updateStock(type, stocklist, index, callback);
        } else {
            setTimeout(function(){
                callback(null);
            }, 0);
        }
    }, updateType);
}

process.on('uncaughtException', function(err) {
    console.log('Threw Exception: %s  %s', err.name, err.message);
    if (err.stack) {
        console.log(err.stack);
    }
});

rl.on('line', function(line){
    var cmd = line.split(" ");
    switch (cmd[0]) {
        case 'stock':
        console.log('stock');
        cmdUpdateStock(cmd[1], cmd[2]);
        break;
        default:
        console.log('help:');
        console.log('stock update [single index]');
    }
});