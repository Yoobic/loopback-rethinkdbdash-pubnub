'use strict';
var pubnubHelper = require('./pubnubHelper')();

module.exports = function() {
    var _app;
    var init = function(app, publishKey, subscribeKey) {
        if(!app) {
            throw new Error('app is undefined');
        }
        if(!publishKey || publishKey.length <= 0) {
            throw new Error('publishKey is undefined');
        }
        if(!subscribeKey || subscribeKey.length <= 0) {
            throw new Error('subscribeKey is undefined');
        }
        _app = app;
        app.pubnubHelper = pubnubHelper;
        app.pubnubHelper.init(publishKey, subscribeKey);
    };

    var onMessage = function(model, value) {
        var modelName = model.modelName;
        var method = value.method;
        var feedId = pubnubHelper.generateHash(value);
        var channelQueryName = modelName + ':' + feedId;

        pubnubHelper.existFeed(model.dataSource.connector.db, model.dataSource.connector.database, feedId, function(exist) {

            if(exist) {
                //console.log('channel', channelQueryName, 'already exist');
                return;
            }

            var fn;
            if(method) {
                fn = model[method];
            } else {
                fn = model.dataSource.connector.allFeed;
            }
            fn.call(model.dataSource.connector, modelName, feedId, value.filter, function(err, cursor) {
                if(err) {
                    pubnubHelper.publish({
                        channel: channelQueryName,
                        message: {
                            error: err
                        }
                    });
                } else {
                    if(cursor) {
                        pubnubHelper.subscribe({
                            channel: channelQueryName + '-pnpres',
                            message: function(msg) {
                                if(msg.occupancy === 0) {
                                    if(cursor) {
                                        // closing the feed
                                        cursor.close();
                                    }
                                    pubnubHelper.unsubscribe({
                                        channel: channelQueryName + '-pnpres'
                                    });
                                }
                            }
                        });

                        cursor.each(function(err, record) {
                            if(err) {
                                pubnubHelper.publish({
                                    channel: channelQueryName,
                                    message: {
                                        error: err
                                    }
                                });
                            } else {
                                pubnubHelper.publish({
                                    channel: channelQueryName,
                                    message: record
                                });
                            }
                        });
                    }
                }
            });
        });
    };

    var start = function() {
        _app.models().forEach(function(model) {

            var connector = model.dataSource.connector;
            if(connector.constructor.name === 'RethinkDB') {

                pubnubHelper.subscribe({
                    channel: model.modelName,
                    windowing: 500,
                    message: function(value) {
                        //console.log('channel', model.modelName, value);
                        setTimeout(function() {
                            onMessage(model, value);
                        }, 0);
                        return true;
                    }
                });
            }
        });
    };

    return {
        init: init,
        start: start
    };
};
