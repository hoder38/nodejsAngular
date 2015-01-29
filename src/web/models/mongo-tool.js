var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10});

var db = new mongodb.Db('mydb', mongodbServer, {safe: true});

var ObjectID = mongodb.ObjectID;

db.open(function(err, con){
    if (!err) {
        console.log('database connected');
        db.collection('user', function(err, collection) {
            if (err) {
                throw new Error('user collection error');
            }
            collection.count(function(err, count) {
                if (err) {
                    throw new Error('count user collection error');
                }
                if (count === 0) {
                    var crypto = require('crypto');
                    var data = {};
                    data['username'] = 'hoder';
                    data['desc'] = 'owner';
                    data['perm'] = 1;
                    data['password'] = crypto.createHash('md5').update('test123').digest('hex');
                    collection.insert(data, function(err,user){
                        if(err) {
                            throw new Error('creat owner error');
                        }
                        console.log(user);
                    });
                }
            });
        });
    } else {
        console.log('database connection error', err);
    }
});
module.exports = {
    collection: [],
    orig: function(functionName, name) {
        var args = Array.prototype.slice.call(arguments, 2);
        var this_obj = this;
        if (name in this.collection) {
            if (functionName === 'find') {
                var callback = args.splice(-1, 1);
                setTimeout(function(){
                    this_obj.collection[name][functionName].apply(this_obj.collection[name], args).toArray(callback[0]);
                }, 0);
            } else {
                setTimeout(function(){
                    this_obj.collection[name][functionName].apply(this_obj.collection[name], args);
                }, 0);
            }
        } else {
            db.collection(name, function(err, collection) {
                if (err) {
                    var callback = args.splice(-1, 1);
                    callback[0](err, null);
                    throw new Error('terminal');
                }
                this_obj.collection[name] = collection;
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
        if (typeof id !== 'undefined') {
            return new ObjectID(id);
        } else {
            return new ObjectID();
        }
    }
};