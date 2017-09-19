var expect = require('expect.js'),
    _ = require('lodash');

describe('NTLM', function () {
    // @todo Add '/ntlm' endpoint in echo server
    var ntlmServerIP = '34.214.154.175',
        USERNAME = 'postman',
        PASSWORD = 'NTLM@123',
        DOMAIN = '',
        WORKSTATION = '',
        testrun,
        runOptions = {
            collection: {
                item: {
                    name: 'NTLM Sample Request',
                    request: {
                        url: ntlmServerIP,
                        auth: {
                            type: 'ntlm',
                            ntlm: {
                                username: '{{uname}}',
                                password: '{{pass}}',
                                domain: '{{domain}}',
                                workstation: '{{workstation}}'
                            }
                        }
                    }
                }
            },
            authorizer: {
                interactive: true
            }
        };

    describe('with in-correct endpoint', function () {
        before(function (done) {
            var clonedRunOptions = _.cloneDeep(runOptions);

            clonedRunOptions.environment = {
                values: [{
                    key: 'uname',
                    value: USERNAME
                }, {
                    key: 'pass',
                    value: PASSWORD
                }, {
                    key: 'domain',
                    value: DOMAIN
                }, {
                    key: 'workstation',
                    value: WORKSTATION
                }]
            };
            clonedRunOptions.collection.item.request.url = 'http://postman-echo.com/get';
            // perform the collection run
            this.run(clonedRunOptions, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('must have completed the run', function () {
            expect(testrun).be.ok();
            expect(testrun.done.callCount).to.be(1);
            testrun.done.getCall(0).args[0] && console.error(testrun.done.getCall(0).args[0].stack);
            expect(testrun.done.getCall(0).args[0]).to.be(null);
            expect(testrun.start.callCount).to.be(1);
        });

        it('must bail out after sending one request', function () {
            expect(testrun.request.callCount).to.be(1);

            var err = testrun.request.firstCall.args[0];

            expect(err).to.be(null);
        });
    });

    describe('with in-correct details', function () {
        before(function (done) {
            runOptions.environment = {
                values: [{
                    key: 'uname',
                    value: 'foo'
                }, {
                    key: 'pass',
                    value: 'baz'
                }, {
                    key: 'domain',
                    value: DOMAIN
                }, {
                    key: 'workstation',
                    value: WORKSTATION
                }]
            };
            // perform the collection run
            this.run(runOptions, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('must have completed the run', function () {
            expect(testrun).be.ok();
            expect(testrun.done.callCount).to.be(1);
            testrun.done.getCall(0).args[0] && console.error(testrun.done.getCall(0).args[0].stack);
            expect(testrun.done.getCall(0).args[0]).to.be(null);
            expect(testrun.start.callCount).to.be(1);
        });

        it('must have sent the request thrice', function () {
            expect(testrun.request.callCount).to.be(3);

            var err = testrun.request.firstCall.args[0],
                response = testrun.request.firstCall.args[2];

            expect(err).to.be(null);
            expect(response.code).to.eql(401);
        });
    });

    describe('with correct details', function () {
        before(function (done) {
            runOptions.environment = {
                values: [{
                    key: 'uname',
                    value: USERNAME
                }, {
                    key: 'pass',
                    value: PASSWORD
                }, {
                    key: 'domain',
                    value: DOMAIN
                }, {
                    key: 'workstation',
                    value: WORKSTATION
                }]
            };
            // perform the collection run
            this.run(runOptions, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('must have completed the run successfully', function () {
            expect(testrun).be.ok();
            expect(testrun.done.callCount).to.be(1);
            testrun.done.getCall(0).args[0] && console.error(testrun.done.getCall(0).args[0].stack);
            expect(testrun.done.getCall(0).args[0]).to.be(null);
            expect(testrun.start.callCount).to.be(1);
        });

        it('must have sent the request thrice', function () {
            expect(testrun.request.callCount).to.be(3);

            var err = testrun.request.thirdCall.args[0],
                response = testrun.request.thirdCall.args[2];

            expect(err).to.be(null);
            expect(response.code).to.eql(200);
        });
    });

});
