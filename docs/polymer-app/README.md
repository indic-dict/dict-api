
# Development
## Setup
- install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)). `npm install -g polymer-cli`
- install [Bower](https://bower.io/) using [npm](https://www.npmjs.com) `npm install -g bower`
- Adding and using new [webcomponents](https://www.webcomponents.org/) : Just use bower.
   - As of 2017-07 it is safe to ignore npm warnings about bower deprecation (See [here](https://www.polymer-project.org/2.0/docs/tools/polymer-cli)).
   - `bower install  --save iron-ajax`

## Code organization
- index.html is the entry point. It loads the dict-ui polymer module (defined in src).
- dict-ui uses a drawer layout. We use literate programming - so, don't worry and just read what's written betwixt the code.

## Start and build
- This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app: `polymer serve --open` or `polymer serve build/unbundled`
- Build: `polymer build`
