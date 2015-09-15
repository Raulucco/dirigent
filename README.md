INSTALLATION
============
In order to use this tool you need to install [Node.js](http://nodejs.org).
Open the parent directory on a command prompt and run `npm link`
Now you can execute orchestrator from a prompt window.

#USAGE#
To setup a new project run `dirigent init`
Answer the required questions.
After installation run `npm install`.

##Scripts##
- To start development `dirigent run scripts` or `dirigent run scripts:dev`
- To deploy `dirigent run scripts:deploy`

##Styles##
- To start development `dirigent run styles` or `dirigent run styles:dev`
- To deploy `dirigent run styles:deploy`

##Test##
Dirigent expects [karma](https://github.com/karma-runner/karma) as your test runer. So it will add the necessary plugins in your `package.json`.
It is posible to create a `karma.config.js` file by running `dirigent setup:karma`.
Dirigent add a command in your `package.json` file under scripts test so that you just need to run `npm test`, so if you don't have `karma-cli` globally installed in your system you can run `npm test`.

#What it is dirigent#
Dirigent intention is to stop writing your configuration files again and again.
So with a few questions creates the needed files for setup you development environment with [webpack](https://webpack.github.io/) and karma.

##Commands##
There is basically tree commands:

- `init`: will setup your scripts configuration files (`webpack.config.js`).
-- `scripts`: will create a `webpack.config.js` file and a `package.json` file. If you choose to use any javascript transpiler then it will generate it's configuuration files too.
-- `styles`: will create a `libsass.config.js` file that will be used to compile the .scss to a single .css bundle.

- `run`: executes your module configuration and any dependencies found on the `dirigentfile.js` *deps section.

- `setup:karma` :creates the `karma.config.js` file based on your webpack configuration.

 *deps are relative to the root directory where your `dirigentfile.js` lives.

###Why webpack and karma?###
Thoose are just my personal preferences :-)

Considerations
--------------

Dirigent will asume that you build a unique bundle for each module / directory.
If you need to create multiple bundles from a same directory add on your webpack conf:
<code>
    ...
    "plugins": [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: <the commons chunk name>,
            filename: <the filename of the commons chunk>
        })
     ],
     ...
</code>
