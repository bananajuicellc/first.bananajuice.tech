/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function () {
  var cardImage = document.getElementById('wgf-d20')

 // Roll the dice to get a new number.
  var rollDice = function () {
    var diceRoll = Math.floor(Math.random() * 20) + 1
    var diceRollSubpath
    if (diceRoll < 10) {
      diceRollSubpath = '0' + diceRoll
    } else {
      diceRollSubpath = '' + diceRoll
    }
    cardImage.alt = '' + diceRoll
    cardImage.src = '/static/dice/d20_' + diceRollSubpath + '.svg'
  }
  rollDice()

 // Set up event handlers
  var isRolling = false
  var rollDiceStart = function (evt) {
    if (evt) {
      evt.preventDefault()
    }
    cardImage.src = '/static/dice/d20_blank.svg'
    isRolling = true
  }
  cardImage.addEventListener('mousedown', rollDiceStart, false /* useCapture */)
  cardImage.addEventListener('touchstart', rollDiceStart, false /* useCapture */)

  var rollDiceEnd = function (evt) {
    if (!isRolling) {
      return
    }
    if (evt) {
      evt.preventDefault()
    }
    rollDice()
    isRolling = false
  }
  cardImage.addEventListener('mouseup', rollDiceEnd, false /* useCapture */)
  cardImage.addEventListener('mouseleave', rollDiceEnd, false /* useCapture */)
  cardImage.addEventListener('touchcancel', rollDiceEnd, false /* useCapture */)
  cardImage.addEventListener('touchend', rollDiceEnd, false /* useCapture */)
  cardImage.addEventListener('touchleave', rollDiceEnd, false /* useCapture */)
})()
