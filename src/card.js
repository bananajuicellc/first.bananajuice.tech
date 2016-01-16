/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var _ = _ || require('lodash');
var wgf = wgf || {};
wgf.card = wgf.card || {};

(function() {
  /* Creates a new card deck.
   *
   * This returns a closure with the ability to render a new card or the
   * current card.
   */
  wgf.card.Deck = function(deckId, opt_deck) {
    opt_deck = opt_deck || {};
    var cardKeys = opt_deck.cardKeys || wgf.card.cardKeys_();
    var currentCard = opt_deck.currentCard || 0;
    
    var currentHash = function() {
      var cardId = cardKeys[currentCard];
      return '#/cards/' + cardId;
    };
    
    var nextCard = function() {
      currentCard = currentCard + 1;
      if (currentCard >= cardKeys.length) {
        wgf.card.resetCards_(cardKeys);
        currentCard = 0;
      }
      return currentHash();
    };
    
    var save = function() {
      var storage = {};
      storage[deckId] = {
        'cardKeys': cardKeys,
        'currentCard': currentCard,
      };
      chrome.storage.sync.set(storage);
    };

    var my = {};
    my.nextCard = nextCard;
    my.save = save;
    my.currentHash = currentHash;
    return my;
  };

  wgf.card.loadDeck = function(deckId, callback) {
    // Fallback to load whole deck to make testing in browser easier.
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
        callback({});
    }
    chrome.storage.sync.get(deckId, function(items) {
      // No deck is saved yet, we can load the default one.
      if (!items[deckId]) {
        callback({});
        return;
      }
      var deck = items[deckId];

      // Make a set of the card keys we support.
      var supportedCards = {};
      var supportedCardsArray = wgf.card.cardKeys_();
      for (var i = 0; i < supportedCardsArray.length; i++) {
        supportedCards[supportedCardsArray[i]] = true;
      }

      for (var i = 0; i < deck.cardKeys.length; i++) {
        var key = deck.cardKeys[i];
        if (!supportedCards[key]) {
          // Remove any cards that aren't cards anymore.
          deck.cardKeys.splice(i, i);
          if (i <= deck.currentCard) {
            deck.currentCard -= 1;
          }
          i -= 1;
        } else {
          // Keep track of the cards we do have, so we can add the new ones to
          // the end.
          delete supportedCards[key];
        }
      }

      // Any remaining cards need to be added back.
      for (var key in supportedCards) {
        deck.cardKeys.push(key);
      }
      wgf.card._shuffle(deck.cardKeys, deck.currentCard + 1);

      callback(deck); // deck.cardKeys, deck.currentCard;
    });
  };

  // Shuffle the array from opt_left to the end of the array.
  // http://stackoverflow.com/a/6274398
  wgf.card._shuffle = function(array, opt_left) {
    opt_left = opt_left || 0;
    var counter = array.length;

    // While there are elements in the array
    while (counter > opt_left) {
      // Pick a random index
      var index = Math.floor(Math.random() * (counter - opt_left))
      index = index + opt_left;

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  };


  wgf.card.resetCards_ = function(cardKeys) {
    // The title card is special. We always want it to appear first in the deck.
    var titleCard = cardKeys[0];
    cardKeys.splice(0 /* index */, 1 /* count to remove */);
    wgf.card._shuffle(cardKeys);
    cardKeys.splice(0 /* index */, 0 /* count to remove */, titleCard);
    return cardKeys;
  };


  wgf.card.viewCard = function (cardId) {
    var cardContent = emptyNode(document.getElementById('wgf-card-content'));
    wgf.card.CARDS_[cardId](cardContent);
  };


  wgf.card.renderCard = function (renderContent, cardId) {
    return function (element) {
      renderContent(element);

      var cardText = document.createElement('div');
      cardText.classList.add('wgf-card-text');
      var p = document.createElement('p');
      p.innerHTML = chrome.i18n.getMessage('card_prompt_' + cardId);
      cardText.appendChild(p);
      element.appendChild(cardText);
    };
  };


  wgf.card.renderCardImage = function (cardId, opt_cardFilename) {
    var cardFilename = opt_cardFilename || (cardId + '.png');
    return wgf.card.renderCard(
      function (element) {
        var cardImage = new Image();
        cardImage.src = 'assets/cards/' + cardFilename;
        cardImage.classList.add('pixel-art');
        cardImage.classList.add('wgf-card-image');
        element.appendChild(cardImage);
      },
      cardId);
  };


  wgf.card.renderCardDice20 = function (element) {
    var cardImage = new Image();
    cardImage.classList.add('wgf-card-image');
    
    // Roll the dice to get a new number.
    var rollDice = function() {
      var diceRoll = Math.floor(Math.random() * 20) + 1;
      var diceRollSubpath;
      if (diceRoll < 10) {
        diceRollSubpath = '0' + diceRoll;
      } else {
        diceRollSubpath = '' + diceRoll;
      }
      cardImage.alt = '' + diceRoll;
      cardImage.src = 'assets/dice/d20_' + diceRollSubpath + '.svg';
    };
    rollDice();
    
    // Set up event handlers
    var isRolling = false;
    var rollDiceStart = function(evt) {
      if (evt) {
        evt.preventDefault();
      }
      cardImage.src = 'assets/dice/d20_blank.svg';
      isRolling = true;
    };
    cardImage.addEventListener('mousedown', rollDiceStart, false /* useCapture */);
    cardImage.addEventListener('touchstart', rollDiceStart, false /* useCapture */);
    
    var rollDiceEnd = function(evt) {
      if (!isRolling) {
        return;
      }
      if (evt) {
        evt.preventDefault();
      }
      rollDice();
      isRolling = false;
    };
    cardImage.addEventListener('mouseup', rollDiceEnd, false /* useCapture */);
    cardImage.addEventListener('mouseleave', rollDiceEnd, false /* useCapture */);
    cardImage.addEventListener('touchcancel', rollDiceEnd, false /* useCapture */);
    cardImage.addEventListener('touchend', rollDiceEnd, false /* useCapture */);
    cardImage.addEventListener('touchleave', rollDiceEnd, false /* useCapture */);
    
    element.appendChild(cardImage);
  };


  wgf.card.CARDS_ = {
    'award': wgf.card.renderCardImage('award', 'award.gif'),
    'baking': wgf.card.renderCardImage('baking'),
    'batteries': wgf.card.renderCardImage('batteries'),
    'bee': wgf.card.renderCardImage('bee'),
    'birthday': wgf.card.renderCardImage('birthday', 'birthday.gif'),
    'building': wgf.card.renderCardImage('building'),
    'buttons': wgf.card.renderCardImage('buttons', 'buttons.gif'),
    'dice': wgf.card.renderCard(wgf.card.renderCardDice20, 'dice20'),
    'drawing': wgf.card.renderCardImage('drawing'),
    'flat_tire': wgf.card.renderCardImage('flat_tire'),
    'foreign_language': wgf.card.renderCardImage('foreign_language'),
    'hammock': wgf.card.renderCardImage('hammock'),
    'junkmail': wgf.card.renderCardImage('junkmail'),
    'light_bulb': wgf.card.renderCardImage('light_bulb'),
    'litter_box': wgf.card.renderCardImage('litter_box'),
    'oldest_movie': wgf.card.renderCardImage('oldest_movie', 'blacksmith.gif'),
    'onion': wgf.card.renderCardImage('onion'),
    'pizza': wgf.card.renderCardImage('pizza', 'pizza.gif'),
    'post_office': wgf.card.renderCardImage('post_office'),
    'postcard': wgf.card.renderCardImage('postcard'),
    'survey': wgf.card.renderCardImage('survey'),
    'train': wgf.card.renderCardImage('train'),
    'trash': wgf.card.renderCardImage('trash'),
    'tv': wgf.card.renderCardImage('tv'),
    'walk_dog': wgf.card.renderCardImage('walk_dog'),
    'went_to_movies': wgf.card.renderCardImage('went_to_movies', 'went_to_movies.jpg'),
    'who_goes_first': wgf.card.renderCardImage('who_goes_first'),
  };

  wgf.card.cardKeys_ = function() {
    var keys = Object.keys(wgf.card.CARDS_);
    _.remove(keys, _.partial(_.eq, 'who_goes_first'));
    keys.splice(
      0 /* index */,
      0 /* count to remove */,
      'who_goes_first');
    return wgf.card.resetCards_(keys);
  };


  wgf.card._randRange = function (endIndex) {
    return Math.floor(Math.random() * endIndex);
  };

  // We export as a node module for automated testing.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = wgf.card;
  }
})();
