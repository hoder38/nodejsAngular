var mongodb = require('mongodb');

var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

var mongodbServer = new mongodb.Server(config_glb.session_ip, config_glb.session_port, { auto_reconnect: true, poolSize: 10});

var db = new mongodb.Db(config_glb.session_name, mongodbServer, {safe: true});

var ObjectID = mongodb.ObjectID;

db.open(function(err, con){
    if (!err) {
        con.authenticate(config_type.session_username, config_type.session_pwd,function(err2,con2){
            if (con2) {
                console.log('session database connected');
            } else {
                console.log('session database authentication error', err2);
            }
        });
    } else {
        console.log('session database connection error', err);
    }
});
module.exports = function(express) {
    var mongoStore = require('connect-mongo')(express);
    var sessionsCollection = null;
    return {
        config: {
            secret: config_type.session_secret,
            cookie: { maxAge: 86400 * 1000 },
            store: new mongoStore({
                host: config_glb.session_ip,
                port: config_glb.session_port,
                db: config_glb.session_name,
                username: config_type.session_username,
                password: config_type.session_pwd
            })
        },
        orig: function(functionName) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (sessionsCollection) {
                if (functionName === 'find') {
                    var callback = args.splice(-1, 1);
                    setTimeout(function(){
                        sessionsCollection[functionName].apply(sessionsCollection, args).toArray(callback[0]);
                    }, 0);
                } else {
                    setTimeout(function(){
                        sessionsCollection[functionName].apply(sessionsCollection, args);
                    }, 0);
                }
            } else {
                db.collection('sessions', function(err, collection) {
                    sessionsCollection = collection;
                    if (err) {
                        var callback = args.splice(-1, 1);
                        callback[0](err, null);
                        throw new Error('terminal');
                    }
                    if (functionName === 'find') {
                        var callback = args.splice(-1, 1);
                        setTimeout(function(){
                            collection[functionName].apply(collection, args).toArray(callback[0]);
                        }, 0);
                    } else {
                        setTimeout(function(){
                            collection[functionName].apply(collection, args);
                        }, 0);
                    }
                });
            }
        },
        objectID: function(id) {
            return new ObjectID(id);
        }
    };
};