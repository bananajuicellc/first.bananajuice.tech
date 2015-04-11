/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var renderCardImage = function (cardId) {
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

var cards = {
  'award': renderCardImage('award'),
  'baking': renderCardImage('baking'),
  'batteries': renderCardImage('batteries'),
  'bee': renderCardImage('bee'),
  'building': renderCardImage('building'),
  'buttons': renderCardImage('buttons'),
  'drawing': renderCardImage('drawing'),
  'flat_tire': renderCardImage('flat_tire'),
  'foreign_language': renderCardImage('foreign_language'),
  'hammock': renderCardImage('hammock'),
  'junkmail': renderCardImage('junkmail'),
  'light_bulb': renderCardImage('light_bulb'),
  'litter_box': renderCardImage('litter_box'),
  'onion': renderCardImage('onion'),
  'pizza': renderCardImage('pizza'),
  'post_office': renderCardImage('post_office'),
  'postcard': renderCardImage('postcard'),
  'survey': renderCardImage('survey'),
  'train': renderCardImage('train'),
  'trash': renderCardImage('trash'),
  'tv': renderCardImage('tv'),
  'walk_dog': renderCardImage('walk_dog'),
  'who_goes_first': renderCardImage('who_goes_first')
};
var cardKeys = Object.keys(cards);

var randRange = function (endIndex) {
  return Math.floor(Math.random() * endIndex);
};

var randomCard = function () {
  var cardId = cardKeys[randRange(cardKeys.length)];
  location.hash = '#/cards/' + cardId;
};

var emptyNode = function (node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return node;
};

var viewCard = function (cardId) {
  var cardContent = emptyNode(document.getElementById('wgf-card-content'));
  cards[cardId](cardContent);
};

var routes = {
  '/random-card': randomCard,
  '/cards/:cardId': viewCard
};

var router = Router(routes);

router.init();
location.hash = '#/cards/who_goes_first';

var translateMenus = function() {
  var nextButtonText = document.getElementById('wgf-next-button-text');
  nextButtonText.textContent = chrome.i18n.getMessage('menu_next_card');
};

document.addEventListener("DOMContentLoaded", function(event) {
  translateMenus();
});