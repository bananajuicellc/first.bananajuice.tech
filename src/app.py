#!/usr/bin/env python

import json
import os
import shutil

from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('templates'))

template = env.get_template('card.html')

cards = {
    'award': 'award.png',
    'baking': 'baking.png',
    'batteries': 'batteries.png',
    'bee': 'bee.png',
    'birthday': 'birthday.gif',
    'building': 'building.png',
    'buttons': 'buttons.gif',
    # 'dice': wgf.card.renderCard(wgf.card.renderCardDice20, 'dice20'),
    'drawing': 'drawing.png',
    'flat-tire': 'flat_tire.png',
    'foreign-language': 'foreign_language.png',
    'hammock': 'hammock.png',
    'junkmail': 'junkmail.png',
    'light-bulb': 'light_bulb.png',
    'litter-box': 'litter_box.png',
    'oldest-movie': 'blacksmith.gif',
    'onion': 'onion.png',
    'pizza': 'pizza.gif',
    'post-office': 'post_office.png',
    'postcard': 'postcard.png',
    'survey': 'survey.png',
    'train': 'train.png',
    'trash': 'trash.png',
    'tv': 'tv.png',
    'walk-dog': 'walk_dog.png',
    'who-goes-first': 'who_goes_first.png',
}

messages = {}
with open('_locales/en/messages.json') as f:
    messages = json.load(f)

for card in cards:
    mo = messages['card_prompt_{0}'.format(card.replace('-', '_'))]
    m = mo['message']
    s = template.render(
            card_image=cards[card],
            card_description=m,
            google_analytics_id=os.environ['WGF_GOOGLE_ANALYTICS'])
    try:
        os.makedirs('../web/cards/{0}'.format(card))
    except OSError, e:
        if e.errno != 17: # File Exists
            raise
    with open('../web/cards/{0}/index.html'.format(card), 'w') as f:
        f.write(s)

    try:
        shutil.copytree('assets', '../web/assets')
    except OSError, e:
        if e.errno != 17: # File Exists
            raise
    try:
        shutil.copy('index.css', '../web/index.css')
    except OSError, e:
        if e.errno != 17: # File Exists
            raise

