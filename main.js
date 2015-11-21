/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var emptyNode = function (node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return node;
};


var translateMenus = function() {
  var nextMsg = chrome.i18n.getMessage('menu_next_card');
  document.getElementById('wgf-next-button-img').alt = nextMsg;
};

document.addEventListener("DOMContentLoaded", function(event) {
  wgf.card.loadDeck('deck', function(deck) {
    console.log(deck);
    var routes = {
      '/random-card': deck,
      '/cards/:cardId': wgf.card.viewCard
    };
    
    var router = Router(routes);
    
    router.init();
    location.hash = deck.currentHash();
  });
  
  translateMenus();
});