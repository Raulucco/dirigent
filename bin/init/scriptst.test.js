var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');
var Q = require('q');
var inquirers = require('./mocks.js').inquirers;

describe('Setup scripts management configuration on current dir base on user inputs', function () {

    var createConfigFiles;
    var defer;

    describe('User don\'t want to manage scripts with dirigent', function () {

        before(function () {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
            mockery.registerMock('inquirer', inquirers.doNotBuildScripts);

            createConfigFiles = sinon.stub();
            mockery.registerMock('./createConfigFiles.js', createConfigFiles);

        });

        it('Skips directory configuration on negative user input', function (done) {
            var scripts = require('./scripts.js');
            scripts().catch(function (result) {
                expect(result).to.equal("No");
                expect(createConfigFiles.calledOnce).to.not.be.true;
                done();
            }).done();
        });


        after(function () {
            mockery.disable();
        });

    });

    describe('User wants to manage scripts with dirigent', function () {

        var defer;
        before(function () {
            defer = Q.defer();
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
            mockery.registerMock('inquirer', inquirers.buildScripts);

            createConfigFiles = sinon.stub().returns(defer.promise);
            mockery.registerMock('./createConfigFiles.js', createConfigFiles);

        });

        it('Calls the createConfFiles just once', function (done) {
            var scripts = require('./scripts.js');
            scripts().then(function (result) {
                expect(result).to.equal("Yes");
                expect(createConfigFiles.calledOnce).to.be.true;
                done();
            }).done();

            defer.resolve(true);
        });


        after(function () {
            mockery.disable();
        });
    });

});