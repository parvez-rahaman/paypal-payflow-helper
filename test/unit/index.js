var test = require('tap').test,
    paypal\-payflow = require(__dirname + '/../../lib/index.js');

paypal\-payflow(function (err) {
    test('unit', function (t) {
        t.equal(err, null, 'error object is null');
        t.end();
    });
});