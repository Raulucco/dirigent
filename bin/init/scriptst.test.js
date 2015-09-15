var should = require('chai').should();
var expect = require('chai').expect;
var rewire = require('rewire');
var inquiremock = {
    prompt: function (questions, cb) {
        var obj = { answers: {} };
        var i = 0;
        var len = questions.length;
        for (; i < len; i++) {
            obj.answers[questions[i].name] = questions[i].choices[questions[i].default];
        }
        cb(obj);
    }
}

rewire('inquirer', inquiremock);

describe('Generates scripts configuation files', function () {
    it('Names the module as the parent directory, by default', function () {

    });
});