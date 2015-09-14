var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');
var mocha = new Mocha();


// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
function addDir(dir) {
    fs.readdirSync(dir).filter(function (file) {
        // Only keep the .js files
        return file.substr(-8) === '.test.js';

    }).forEach(function (file) {
        // Use the method "addFile" to add the file to mocha
        mocha.addFile(path.join(dir, file));
    });
}

['bin/run', 'bin/init'].forEach(addDir);

mocha.reporter('spec')
    .run(function (failures) {
        process.on('exit', function () {
            process.exit(failures);
        });
    });