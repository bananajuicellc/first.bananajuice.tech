/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var wgf = wgf || {};
wgf.card = wgf.card || {};


wgf.card.randomCard = function() {
  var cardId = wgf.card._cardKeys[
      wgf.card._randRange(wgf.card._cardKeys.length)];
  location.hash = '#/cards/' + cardId;
};


wgf.card.viewCard = function (cardId) {
  var cardContent = emptyNode(document.getElementById('wgf-card-content'));
  wgf.card._cards[cardId](cardContent);
};


wgf.card.renderCardImage = function (cardId) {
  return function (element) {
    var cardImage = new Image();
    cardImage.src = 'assets/cards/' + cardId + '.png';
    cardImage.classList.add('pixel-art');
    cardImage.classList.add('wgf-card-image');
    element.appendChild(cardImage);

    var cardText = document.createElement('div');
    cardText.classList.add('wgf-card-text');
    var p = document.createElement('p');
    p.textContent = chrome.i18n.getMessage('card_prompt_' + cardId);
    cardText.appendChild(p);
    element.appendChild(cardText);
  };
};


wgf.card._cards = {
  'award': wgf.card.renderCardImage('award'),
  'baking': wgf.card.renderCardImage('baking'),
  'batteries': wgf.card.renderCardImage('batteries'),
  'bee': wgf.card.renderCardImage('bee'),
  'building': wgf.card.renderCardImage('building'),
  'buttons': wgf.card.renderCardImage('buttons'),
  'drawing': wgf.card.renderCardImage('drawing'),
  'flat_tire': wgf.card.renderCardImage('flat_tire'),
  'foreign_language': wgf.card.renderCardImage('foreign_language'),
  'hammock': wgf.card.renderCardImage('hammock'),
  'junkmail': wgf.card.renderCardImage('junkmail'),
  'light_bulb': wgf.card.renderCardImage('light_bulb'),
  'litter_box': wgf.card.renderCardImage('litter_box'),
  'onion': wgf.card.renderCardImage('onion'),
  'pizza': wgf.card.renderCardImage('pizza'),
  'post_office': wgf.card.renderCardImage('post_office'),
  'postcard': wgf.card.renderCardImage('postcard'),
  'survey': wgf.card.renderCardImage('survey'),
  'train': wgf.card.renderCardImage('train'),
  'trash': wgf.card.renderCardImage('trash'),
  'tv': wgf.card.renderCardImage('tv'),
  'walk_dog': wgf.card.renderCardImage('walk_dog'),
  'who_goes_first': wgf.card.renderCardImage('who_goes_first')
};


wgf.card._cardKeys = Object.keys(wgf.card._cards);


wgf.card._randRange = function (endIndex) {
  return Math.floor(Math.random() * endIndex);
};
