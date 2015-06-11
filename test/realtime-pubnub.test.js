'use strict';

var realtimePubnub = require('../')();

describe('realtime-pubnub', function() {

    describe('init()', function() {

        it('should fail if app is undefined', function() {
            expect(function() {
                realtimePubnub.init();
            }).to.throw('app is undefined');
        });

        it('should fail if publishKey is undefined', function() {
            expect(function() {
                realtimePubnub.init({});
            }).to.throw('publishKey is undefined');
        });

        it('should fail if subscribeKey is undefined', function() {
            expect(function() {
                realtimePubnub.init({}, 'xxx');
            }).to.throw('subscribeKey is undefined');
        });

    });

    describe('start()', function() {

        beforeEach(function() {
            this.app = require('./fixtures/server.js')();
            realtimePubnub.init(this.app, 'demo', 'demo');
        });

        it('should succeed with app, publishKey and subscribeKey', function() {
            realtimePubnub.start();
            assert.ok(true);
        });

        it('should call subscribe on model channel with correct windowing', function() {
            var subscribeSpy = sinon.spy(this.app.pubnubHelper, 'subscribe');
            realtimePubnub.start();
            assert(subscribeSpy.calledOnce);
            var arg = (subscribeSpy.args[0][0]);
            assert(arg.channel === 'Book', 'channel should be Book');
            assert(arg.windowing === 500, 'windowing shoube be 500');
        });
    });

});
