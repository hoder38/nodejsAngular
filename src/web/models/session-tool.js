var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10});

var db = new mongodb.Db('mySessionStore', mongodbServer, {safe: true});

var ObjectID = mongodb.ObjectID;

db.open(function(err, con){
    if (!err) {
        console.log('session database connected');
    } else {
        console.log('session database connection error', err);
    }
});
module.exports = function(express) {
    var mongoStore = require('connect-mongo')(express);
    var sessionsCollection = null;
    return {
        config: {
            secret: 'holyhoderhome',
            cookie: { maxAge: 86400 * 1000 },
            store: new mongoStore({
                host: 'localhost',
                port: 27017,
                db: 'mySessionStore'
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