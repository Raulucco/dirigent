var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');
var Q = require('q');
var fs = require('fs');
var inquirers = require('./mocks.js').inquirers;
var inquirer = require('inquirer');
var fakecwd = 'C:/Some/path/on/the/file/system';
var defaultFilesName = require('./scripts/filenames.js');

describe('Creates required configurations files', function () {

    var writeFileMock;
    var createScriptsConfFile;
    var inquirerStub;

    before(function () {
        mockery.enable();
        mockery.registerMock('path', {
            join: function () {
                var args = Array.prototype.slice.call(arguments);
                args.map(function (arg, index) {

                    return arg.split(/(\\|\/)+/).join('/').replace(/^[\.\\\/]+|[\.\\\/]+$/g, '');

                    return arg;
                });

                return args.join('/');
            }
        });
        sinon.stub(process, 'cwd', function () {
            return fakecwd;
        });

    });

    beforeEach(function () {
        writeFileMock = sinon.stub(fs, 'writeFile', function (path, content, opts, fn) {
            if (typeof fn === 'function') {
                fn();
            }
        });
    });

    describe('User don\'t want to use any scripts transpiler', function () {

        before(function () {
           inquirerStub = sinon.stub(inquirer, 'prompt', inquirers.createConfFilesForJs.prompt);
            createScriptsConfFile = require('./createConfigfiles.js');
        });

        it('Creates four files', function (done) {
            createScriptsConfFile().then(function (result) {
                expect(writeFileMock.callCount).to.be.equal(4);
                webpackDevConfWasCreated();
                webpackDeployConfWasCreated();
                packageJsonWasCreated();
                dirigentFileWasCreated();
            }).done(done);
        });

        it('Offers the directory name as the default module name', function () {
            var questions = require('./scripts/questions/index.js');
            expect(questions[0].default).to.be.equal('system');
        });

        after(function () {
            inquirer.prompt.restore();
        });
    });

    describe('User choose typescript implementation', function () {
        before(function () {
            inquirerStub = sinon.stub(inquirer, 'prompt', inquirers.createConfFilesForTs.prompt);
            mockery.registerMock('inquirer', inquirers.createConfFilesForTs);
            createScriptsConfFile = require('./createConfigfiles.js');
        });

        it('package.json contains typescript modules', function (done) {
            createScriptsConfFile().then(function () {
                var devWebpackConf = writeFileMock.getCall(2).args[1];
                var packagejson = writeFileMock.getCall(4).args[1];
                expect(writeFileMock.callCount).to.be.equal(6);
                expect(writeFileMock.getCall(0).args[0]).to.be.equal(fakecwd + '/tsdconfig.json');
                expect(writeFileMock.getCall(1).args[0]).to.be.equal(fakecwd + '/tslint.json');
                expect(/^\s+"loader":\s"ts-loader",$/gm.test(devWebpackConf)).to.be.true;
                expect(/^\s+"ts-loader":\s"\^(\d+\.){2}\d+",?/m.test(packagejson)).to.be.true;
            }).done(done);

        });

        after(function () {
            inquirer.prompt.restore();
        });

    });

    afterEach(function () {
        fs.writeFile.restore();
    });

    after(function () {
        mockery.disable();
        process.cwd.restore();
    });

    function webpackDevConfWasCreated() {
        expect(writeFileMock.getCall(0).args[0]).to.be.equal(fakecwd + '/' + defaultFilesName.dev);
    }

    function webpackDeployConfWasCreated() {
        expect(writeFileMock.getCall(1).args[0]).to.be.equal(fakecwd + '/' + defaultFilesName.deploy);
    }

    function packageJsonWasCreated() {
        expect(writeFileMock.getCall(2).args[0]).to.be.equal(fakecwd + '/package.json');
    }

    function dirigentFileWasCreated() {
        expect(writeFileMock.getCall(3).args[0]).to.be.equal(fakecwd + '/dirigentfile.js');
    }

});