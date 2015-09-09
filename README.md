INSTALLATION
============

In order to use this tool you need to install [Node.js](http://nodejs.org).
Open the parent directory on a command prompt and run `npm link`
Now you can execute orchestrator from a prompt window.

#USAGE#

To start a new project run `dirigent init`
Answer the required questions.
After installation run `npm install`.

##Scripts##

- To start development `dirigent run scripts` or `dirigent run scripts:dev`
- To deploy `dirigent run scripts:deploy`

##Styles##
- To start development `dirigent run styles` or `dirigent run styles:dev`
- To deploy `dirigent run styles:deploy`

##Test##
Dirigent expects karma as your test runer. So it will add the necessary plugins in your package.json.
But is up to you to configure karma running `karma init`
Dirigent add a command in your package.json file under scripts test so that you just need to run `npm test`.
