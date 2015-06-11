/*jslint bitwise: true */
//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var _ = require('lodash');
var uuid = require('uuid');

module.exports = function() {
    var pubnub;

    var init = function(publishKey, subscribeKey) {
        pubnub = require('pubnub')({
            'publish_key': publishKey,
            'subscribe_key': subscribeKey,
            'uuid': 'server-' + uuid.v4()
        });
    };

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

    var publish = function() {
        return pubnub.publish.apply(this, arguments);
    };

    var subscribe = function() {
        return pubnub.subscribe.apply(this, arguments);
    };
    var unsubscribe = function() {
        return pubnub.unsubscribe.apply(this, arguments);
    };
    var here_now = function() {
        return pubnub.here_now.apply(this, arguments);
    };
    return {
        init: init,
        generateHash: generateHash,
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        here_now: here_now,
        existFeed: existFeed
    };
};
