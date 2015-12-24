/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var expect = require('chai').expect;

var card = require('../card.js');

// mock Chrome APIs
chrome = {
  i18n: {
    getMessage: function() {
      return 'translated message';
    }
  }
};

describe('Deck', function() {
  var deck = card.Deck('deck');
  describe('nextCard', function() {
    it('returns a hash to a new card', function() {
      var got = deck.nextCard();
      expect(got).to.contain('#/cards/');
    });
    it('sets hash to a new card', function() {
      var prev = deck.currentHash();
      expect(prev).to.contain('#/cards/');
      var got = deck.nextCard();
      expect(got).to.not.equal(prev);
    });
  });
});
