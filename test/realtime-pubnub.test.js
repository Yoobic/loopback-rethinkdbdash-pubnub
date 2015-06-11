'use strict';

var realtimePubnub = require('../');

describe('realtime-pubnub', function() {
    it('should fail if app is undefined', function() {
        expect(function() {
            realtimePubnub();
        }).to.throw('app is undefined');
    });

    it('should fail if publishKey is undefined', function() {
        expect(function() {
            realtimePubnub({});
        }).to.throw('publishKey is undefined');
    });

    it('should fail if subscribeKey is undefined', function() {
        expect(function() {
            realtimePubnub({}, 'xxx');
        }).to.throw('subscribeKey is undefined');
    });

});
