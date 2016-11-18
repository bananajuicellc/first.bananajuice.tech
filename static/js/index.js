/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO: browserfy var wgf = require('wgf')

var wgf = wgf || {}
wgf.index = wgf.index || {}

;(function () {
  wgf.index.loadDeck = function (preferredLanguage) {
    // TODO: make path to root relative
    wgf.listCards({rootPath: '', preferredLanguage: preferredLanguage})
      .then(wgf.getDeck)
      .then(wgf.attachNextCard)
      .catch(
        function (error) {
          console.error('Failed to load the deck.\n', error, '\n', error.stack)
        })
  }
})()
