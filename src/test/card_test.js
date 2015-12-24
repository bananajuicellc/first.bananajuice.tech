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
  },
  storage: {
    sync: {
      get: function(key, callback) {
        callback({});
      }
    }
  }
};

describe('loadDeck', function() {
  it('returns card keys with deleted cards removed', function() {
    chrome.storage.sync.get = function(key, callback) {
      callback({
        deck: {
          cardKeys: [
            'who_goes_first',
            'some_card_we_deleted',
            'another_card_we_deleted',
            'dice',
            'and_another_card_we_deleted',
            'more_card_we_deleted'
          ]
        }
      });
    };
    card.cardKeys_ = function() {
      return [
        'who_goes_first',
        'dice',
      ];
    };
    
    card.loadDeck('deck', function(got) {
      expect(got.cardKeys).to.have.length(2);
      expect(got.cardKeys).to.include.members(['who_goes_first', 'dice']);
    });
  });

  it('returns card keys with current card deleted', function() {
    chrome.storage.sync.get = function(key, callback) {
      callback({
        deck: {
          cardKeys: [
            'who_goes_first',
            'dice',
            'card_to_delete',
            'pizza'
          ],
          currentCard: 2
        }
      });
    };
    card.cardKeys_ = function() {
      return [
        'who_goes_first',
        'dice',
        'pizza'
      ];
    };
    
    card.loadDeck('deck', function(got) {
      expect(got.cardKeys).to.have.length(3);
      expect(got.cardKeys).to.include.members(['who_goes_first', 'dice', 'pizza']);
      expect(got.currentCard).to.equal(1);
    });
  });

  it('returns card keys including new cards', function() {
    chrome.storage.sync.get = function(key, callback) {
      callback({
        deck: {
          cardKeys: [
            'who_goes_first',
            'dice'
          ]
        }
      });
    };
    card.cardKeys_ = function() {
      return [
        'who_goes_first',
        'bee',
        'dice',
        'pizza',
      ];
    };
    
    card.loadDeck('deck', function(got) {
      expect(got.cardKeys).to.have.length(4);
      expect(got.cardKeys).to.include.members([
        'who_goes_first',
        'bee',
        'dice',
        'pizza'
      ]);
    });
  });

  it('returns card keys with same current card with new cards', function() {
    chrome.storage.sync.get = function(key, callback) {
      callback({
        deck: {
          cardKeys: [
            'who_goes_first',
            'dice'
          ],
          currentCard: 1
        }
      });
    };
    card.cardKeys_ = function() {
      return [
        'who_goes_first',
        'bee',
        'dice',
        'pizza',
      ];
    };
    
    card.loadDeck('deck', function(got) {
      expect(got.currentCard).to.equal(1);
      expect(got.cardKeys[1]).to.equal('dice');
    });
  });

  it('returns card keys with same current card with removed cards', function() {
    chrome.storage.sync.get = function(key, callback) {
      callback({
        deck: {
          cardKeys: [
            'who_goes_first',
            'before_removed',
            'dice',
            'after_removed'
          ],
          currentCard: 2
        }
      });
    };
    card.cardKeys_ = function() {
      return [
        'who_goes_first',
        'bee',
        'dice',
        'pizza',
      ];
    };
    
    card.loadDeck('deck', function(got) {
      expect(got.currentCard).to.equal(1);
      expect(got.cardKeys[1]).to.equal('dice');
    });
  });
});

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
