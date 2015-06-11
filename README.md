# Loopback connector for RethinkDB.

[![NPM version](https://badge.fury.io/js/loopback-rethinkdbdash-pubnub.svg)](http://badge.fury.io/js/loopback-rethinkdbdash-pubnub) [![Downloads](http://img.shields.io/npm/dm/loopback-rethinkdbdash-pubnub.svg)](http://badge.fury.io/js/loopback-rethinkdbdash-pubnub)   
[![Build Status](https://travis-ci.org/Yoobic/loopback-rethinkdbdash-pubnub.svg?branch=master)](https://travis-ci.org/Yoobic/loopback-rethinkdbdash-pubnub) [![Test Coverage](https://codeclimate.com/github/Yoobic/loopback-rethinkdbdash-pubnub/badges/coverage.svg)](https://codeclimate.com/github/Yoobic/loopback-rethinkdbdash-pubnub) [![Code Climate](https://codeclimate.com/github/Yoobic/loopback-rethinkdbdash-pubnub/badges/gpa.svg)](https://codeclimate.com/github/Yoobic/loopback-rethinkdbdash-pubnub)   
[![Dependency Status](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub.svg)](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub) [![devDependency Status](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub/dev-status.svg)](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub#info=devDependencies) [![peerDependency Status](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub/peer-status.svg)](https://david-dm.org/Yoobic/loopback-rethinkdbdash-pubnub#info=peerDependencies)    

A middleware for binding change feed to pubnub channels

[![NPM](https://nodei.co/npm/loopback-rethinkdbdash-pubnub.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/loopback-rethinkdbdash-pubnub)

## Usage
This library is used during the bootstrap of the loopback server
```js
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) {
        require('loopback-rethinkdbdash-pubnub')(app, 'PUBNUB PUBLISH KEY HERE', 'PUBNUB SUBSRIBEKEY HERE');
        app.start();
    }

});
```

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/Yoobic/loopback-rethinkdbdash-pubnub/releases)

## License

MIT