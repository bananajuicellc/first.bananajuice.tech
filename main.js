/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var cards = [
  'award',
  'baking',
  'batteries',
  'bee',
  'building',
  'buttons',
  'drawing',
  'flat-tire',
  'foreign-language',
  'hammock',
  'junkmail',
  'light-bulb',
  'litter-box',
  'onion',
  'pizza',
  'post-office',
  'postcard',
  'survey',
  'train',
  'trash',
  'tv'
]

var randRange = function (endIndex) {
  return Math.floor(Math.random() * endIndex);
}

var randomCard = function () {
  var cardId = cards[randRange(cards.length)];
  location.hash = '#/cards/' + cardId;
};
var viewCard = function (cardId) {
  var cardImg = document.getElementById('wgf-card-image');
  cardImg.src = 'assets/cards/' + cardId + '.png';
};

var routes = {
  '/random-card': randomCard,
  '/cards/:cardId': viewCard
};

var router = Router(routes);

router.init();