// No idea what this is for. Something to do with the serviceWorker.  But, what is the serviceWorker?
/* eslint-env node */

module.exports = {
  staticFileGlobs: [
    '/dict-api/polymer-app/build/github/index.html',
    '/dict-api/polymer-app/build/github/manifest.json',
    '/dict-api/polymer-app/build/github/bower_components/webcomponentsjs/*',
  ],
  navigateFallback: '/dict-api/polymer-app/build/github/index.html',
  replacePrefix: '/dict-api/polymer-app/build/github'
};
