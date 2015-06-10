/*jslint bitwise: true */
'use strict';

var _ = require('lodash');
var uuid = require('uuid');

module.exports = function() {

    // TODO: Expose this to the outside
    var pubnub = require('pubnub')({
        'publish_key': '',
        'subscribe_key': '',
        'uuid': 'server-' + uuid.v4()
    });

    var hashCode = function(str) {
        return str.split('').reduce(function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    };

    var sortObject = function(object) {
        var sortedObj = {};
        var keys = _.keys(object);

        keys = _.sortBy(keys, function(key) {
            return key;
        });

        _.each(keys, function(key) {
            if(typeof object[key] === 'object' && !(object[key] instanceof Array)) {
                sortedObj[key] = sortObject(object[key]);
            } else {
                sortedObj[key] = object[key];
            }
        });

        return sortedObj;
    };

    var generateHash = function(obj) {
        return hashCode(JSON.stringify(sortObject(obj)));
    };

    var existFeed = function(driver, database, feedId, cb) {
        driver.db('rethinkdb').table('jobs')
            .filter({
                type: 'query'
            })
            .filter(function(job) {
                return job('info')('query').match('^r.db\\("' + database + '"\\)');
            })
            .filter(function(job) {
                return job('info')('query').match(feedId.toString());
            })
            .run()
            .then(function(value) {
                cb(value.length > 0);
            });
    };

    return {
        generateHash: generateHash,
        publish: pubnub.publish,
        subscribe: pubnub.subscribe,
        unsubscribe: pubnub.unsubscribe,
        here_now: pubnub.here_now,
        existFeed: existFeed
    };
};
