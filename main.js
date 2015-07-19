/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var emptyNode = function (node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return node;
};

var deck = wgf.card.Deck();

var routes = {
  '/random-card': deck,
  '/cards/:cardId': wgf.card.viewCard
};

var router = Router(routes);

router.init();
location.hash = '#/cards/who_goes_first';

var translateMenus = function() {
  var nextButtonImg = document.getElementById('wgf-next-button-img');
  nextButtonImg.alt = chrome.i18n.getMessage('menu_next_card');
};

document.addEventListener("DOMContentLoaded", function(event) {
  translateMenus();
});