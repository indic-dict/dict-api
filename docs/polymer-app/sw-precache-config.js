/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

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
