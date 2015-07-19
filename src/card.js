/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var wgf = wgf || {};
wgf.card = wgf.card || {};

/*
Creates a new card deck.

This returns a closure with the ability to render a new card or the current
card.
 */
wgf.card.Deck = function(opt_cardKeys, opt_currentCard) {
  var cardKeys = opt_cardKeys || wgf.card.cardKeys_();
  var currentCard = opt_currentCard || 0;

  // Follow "reusable charts" style http://bost.ocks.org/mike/chart/
  my = function () {
    currentCard = currentCard + 1;
    if (currentCard >= cardKeys.length) {
      wgf.card.resetCards_(cardKeys);
      currentCard = 0;
    }
    var cardId = cardKeys[currentCard];
    location.hash = '#/cards/' + cardId;
  };
  
  return my;
};


// http://stackoverflow.com/a/6274398
wgf.card._shuffle = function(array) {
  var counter = array.length, temp, index;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
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
    p.textContent = chrome.i18n.getMessage('card_prompt_' + cardId);
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
  cardImage.classList.add('pixel-art');
  
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
    cardImage.src = 'assets/dice/d20_' + diceRollSubpath +'.png';
  };
  rollDice();
  
  // Set up event handlers
  var isRolling = false;
  var rollDiceStart = function(evt) {
    if (evt) {
      evt.preventDefault();
    }
    cardImage.src = 'assets/dice/d20_blank.png';
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
  'award': wgf.card.renderCardImage('award'),
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
