## Motivation
Perhaps, besides providing the UI, one could produce a reusable dictionary-lookup [web-component](https://www.webcomponents.org/introduction)?

## Use
* Link: [here](https://indic-dict.github.io/dict-api/polymer-app/build/github/), short url: <http://rebrand.ly/koshah> .

## Status
Not working as of 2019.

## Screencast
- Older polymer 2 app: [YT](https://www.youtube.com/watch?v=DmsfqP5nnEM) .

## Development
### Setup
- install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)). `sudo npm install -g polymer-cli --unsafe-perm`
- Adding and using new [webcomponents](https://www.webcomponents.org/) : Just use npm.
   - `npm install  --save iron-ajax`

### Code organization
- index.html is the entry point. It loads the dict-ui polymer module (defined in src).
- dict-ui uses a drawer layout. We've tried to use literate programming - so, don't worry and just read what's written betwixt the code.

### Start and build
- This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app: `polymer serve --open` or `polymer serve build/unbundled`
- Build: `bower install; polymer build`
