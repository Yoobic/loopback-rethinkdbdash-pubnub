'use strict';
var loopback = require('loopback');
module.exports = function() {

    var app = loopback();

    var ds = app.dataSource('rethinkdbdash', {
        connector: 'loopback-connector-rethinkdbdash'
    });

    var Book = ds.createModel('Book', {
        name: String
    });
    app.model(Book);
    return app;
};
