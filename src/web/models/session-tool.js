var config_type = require('../../../ver.js');

var config_glb = require('../../../config/' + config_type.dev_type + '.js');

module.exports = function(express) {
    var redisStore = require('connect-redis')(express);
    return {
        config: {
            secret: config_type.session_secret,
            cookie: { maxAge: 86400 * 1000 * 3 },
            store: new redisStore({
                host: config_glb.session_ip,
                port: config_glb.session_port,
                resave: false,
                saveUninitialized: false
            })
        }
    };
};