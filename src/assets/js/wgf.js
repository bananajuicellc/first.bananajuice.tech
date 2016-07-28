/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var wgf = wgf || {};
wgf.card = wgf.card || {};

(function() {
  // Wrap XMLHttpRequest in a Promise.
  // www.html5rocks.com/en/tutorials/es6/promises/
  var get = function (url) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest()
      req.open('GET', url)

      req.onload = function () {
        // This is called even on 404, etc.
        // so check the status.
        if (req.status == 200) {
          resolve(req.response)
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error.
          reject(Error(req.statusText))
        }
      }

      // Handle network errors.
      req.onerror = function () {
        reject(Error('Network Error'))
      }

      // Make the request.
      req.send();
    })
  }

  wgf.listCards = function (options) {
    if (options['rootPath'] === undefined) {
      throw new Error('rootPath to API must be defined')
    }
    if (options['preferredLanguage'] === undefined) {
      throw new Error('preferredLanguage must be defined')
    }
    return get(options['rootPath'] + '/api/v1/cards/')
      .then(JSON.parse)
      .then(function (cards) {
        // Choose the most appropriate card URLs for the deck.
        var preferredLanguage = options['preferredLanguage']
        deck = {
          'preferredLanguage': preferredLanguage,
          'cards': {}
        }
        for (var cid in cards) {
          var card = cards[cid]
          deck['cards'][cid] = {}
          // All cards must have at least an English translation.
          // TODO: Choose a better fallback language based on the browser
          //       language preferences.
          var cardLanguage = 'en'
          if (preferredLanguage in card) {
            cardLanguage = preferredLanguage
          }
          deck['cards'][cid] = card[cardLanguage]['url']
        }
        return deck
      })
  }

  wgf.getDeck = function (deck) {
    // Deck starts at -1 because we display the title card first, which actually
    // doesn't appear in the cards list.
    deck['topCard'] = -1
    deck['deck'] = []
    for (var cid in deck['cards']) {
      deck['deck'].push(cid)
    }

    var deckJSON = localStorage.getItem('deck')
    if (!!deckJSON) {
      var loadedDeck = JSON.parse(deckJSON)
      deck['topCard'] = loadedDeck['topCard']
      deck['deck'] = []

      var allCards = {}
      for (var cid in deck['cards']) {
        allCards[cid] = true
      }

      var i = 0
      while (loadedDeck['deck'].length > 0) {
        var cid = loadedDeck['deck'].splice(0, 1)[0]
        if (cid in allCards) {
          deck['deck'].push(cid)
          delete allCards[cid]
        } else {
          // Card was deleted. Shift it out of the deck.
          // If we are deleting a card that has already been shown (including)
          // the current one being displayed, shift where we think the top card
          // is so that we don't skip any that haven't been shown, yet.
          if (i <= deck['topCard']) {
            deck['topCard'] = deck['topCard'] - 1
            i = i - 1
          }
        }
        i = i + 1;
      }
      // These are the new cards that we missed.
      for (var cid in allCards) {
        deck['deck'].push(cid)
      }
    }
    shuffle(deck['deck'], deck['topCard'] + 1)
    return deck
  }

  wgf.navigateNextCard = function (deck) {
    deck['topCard'] = deck['topCard'] + 1
    var url = ''
    if (deck['topCard'] >= deck['deck'].length) {
      deck['topCard'] = -1
      shuffle(deck['deck'])

      // The title card page should be translated into all languages.
      // TODO: Use relative URLs so that the app can be hosted from a directory.
      url = '/' + deck['preferredLanguage'] + '/'
    } else {
      url = (
        // TODO: Use relative URLs so this works in other directories.
        deck['cards'][deck['deck'][deck['topCard']]] +
        '#!/?lang=' +
        deck['preferredLanguage'])
    }
    localStorage.setItem('deck', JSON.stringify(deck))
    window.location = url
  }

  wgf.attachNextCard = function (deck) {
    var nextButton = document.getElementById('wgf-next-button-link')
    nextButton.addEventListener('click', function (event) {
      event.preventDefault()
      wgf.navigateNextCard(deck)
    })
  }

  // Shuffle the array from opt_left to the end of the array.
  // http://stackoverflow.com/a/6274398
  var shuffle = function(array, opt_left) {
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
  }


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

  // We export as a node module for automated testing.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = wgf.card;
  }
})();
