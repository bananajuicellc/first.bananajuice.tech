# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Run Who Goes First web app."""

import argparse
import os.path

import flask
from flask import Flask
from flask import render_template
from flask.ext.babel import Babel

app = Flask(__name__)
babel = Babel(app)


LANGUAGES = {
    'en': {
        'name': u'English',
        'translations': {
            'about': 'about',
            'cards': 'cards',
            'random-card': 'random-card'
        }
    },
    'fr': {
        'name': u'français',
        'translations': {
            'about': u'a-propos',
            'cards': u'cartes',
            'random-card': 'carte-au-hasard'
        }
    },
    'uk': {
        'name': u'українська мова',
        'translations': {
            'about': 'about',
            'cards': 'cards',
            'random-card': 'random-card'
        }
    },
}

CARDS = {
    'award': {
        'translations': {
            'en': 'award',
            'fr': 'prix',
            'uk': 'award',
        }
    },
    'baking': {
        'translations': {
            'en': 'baking',
            'uk': 'baking'
        }
    },
    'batteries': {
        'translations': {
            'en': 'batteries',
            'uk': 'batteries'
        }
    },
    'birthday': {
        'translations': {
            'en': 'birthday',
            'uk': 'birthday'
        }
    },
    'building': {
        'translations': {
            'en': 'building',
            'uk': 'building'
        }
    },
    'buttons': {
        'translations': {
            'en': 'buttons',
            'uk': 'buttons'
        }
    },
    'drawing': {
        'translations': {
            'en': 'drawing',
            'uk': 'drawing'
        }
    },
    'd20': {
        'translations': {
            'en': 'd20',
            'fr': 'd20',
            'uk': 'd20'
        }
    },
    'flat-tire': {
        'translations': {
            'en': 'flat-tire',
            'uk': 'flat-tire'
        }
    },
    'foreign-language': {
        'translations': {
            'en': 'foreign-language',
            'uk': 'foreign-language'
        }
    },
    'hammock': {
        'translations': {
            'en': 'hammock',
            'uk': 'hammock',
        }
    },
    'junk-mail': {
        'translations': {
            'en': 'junk-mail',
            'uk': 'junk-mail',
        }
    },
    'light-bulb': {
        'translations': {
            'en': 'light-bulb',
            'uk': 'light-bulb',
        }
    },
    'litter-box': {
        'translations': {
            'en': 'litter-box',
            'uk': 'litter-box',
        }
    },
    'oldest-movie': {
        'translations': {
            'en': 'oldest-movie',
            'uk': 'oldest-movie',
        }
    },
    'onion': {
        'translations': {
            'en': 'onion',
            'uk': 'onion',
        }
    },
    'pizza': {
        'translations': {
            'en': 'pizza',
            'uk': 'pizza'
        }
    },
    'post-office': {
        'translations': {
            'en': 'post-office',
            'uk': 'post-office'
        }
    },
    'postcard': {
        'translations': {
            'en': 'postcard',
            'uk': 'postcard',
        }
    },
    'stung': {
        'translations': {
            'en': 'stung',
            'uk': 'stung',
        }
    },
    'survey': {
        'translations': {
            'en': 'survey',
            'uk': 'survey',
        }
    },
    'train': {
        'translations': {
            'en': 'train',
            'uk': 'train',
        }
    },
    'trash': {
        'translations': {
            'en': 'trash',
            'uk': 'trash',
        }
    },
    'tv': {
        'translations': {
            'en': 'television',
            'uk': 'television',
        }
    },
    'walk-dog': {
        'translations': {
            'en': 'walk-a-dog',
            'uk': 'walk-a-dog',
        }
    },
    'went-to-movies': {
        'translations': {
            'en': 'went-to-the-movies',
            'uk': 'went-to-the-movies',
        }
    },
}

DEFAULT_LANGUAGE = 'en'


@app.route('/')
def redirect_home_page():
    return render_template('redirect.html')


@app.route('/api/v1/cards.json', endpoint='api_v1_cards')
def handle_api_v1_cards():
    return flask.jsonify(get_all_cards())


@app.route('/en/', endpoint='index_en')
@app.route('/fr/', endpoint='index_fr')
@app.route('/uk/', endpoint='index_uk')
def index_card():
    return render_template('index.html')


@app.route('/en/privacy/', endpoint='privacy_en')
@app.route('/fr/privacy/', endpoint='privacy_fr')
@app.route('/uk/privacy/', endpoint='privacy_uk')
def handle_privacy():
    return render_template('privacy.html')


@app.route('/en/about/', endpoint='about_index_en')
@app.route(u'/fr/a-propos/', endpoint='about_index_fr')
@app.route('/uk/about/', endpoint='about_index_uk')
def about_index_card():
    return render_template('about_index.html')


@app.route('/en/random-card/', endpoint='random_card_page_en')
@app.route(
    '/fr/{}/'.format(LANGUAGES['fr']['translations']['random-card']),
    endpoint='random_card_page_fr')
@app.route(
    '/uk/{}/'.format(LANGUAGES['uk']['translations']['random-card']),
    endpoint='random_card_page_uk')
def random_card():
    return render_template('random_card.html', cards=get_all_cards())


def get_card_handler(cid):
    def handler():
        return render_template(
            os.path.join('cards', cid.replace('-', '_') + '.html'))
    return handler


def get_about_card_handler(cid):
    def handler():
        return render_template(
            os.path.join('cards', 'about_' + cid.replace('-', '_') + '.html'))
    return handler


@app.before_request
def populate_request():
    flask.g.babel = babel
    flask.g.language = get_locale()


@babel.localeselector
def get_locale():
    lang = flask.request.path[1:].split('/', 1)[0]
    if lang in LANGUAGES:
        return lang
    else:
        return DEFAULT_LANGUAGE


def get_translations(page):
    translations = {}
    languages = LANGUAGES
    if page.endswith('_card'):
        cid = page[:-5]  # Remove _card suffix
        if cid.startswith('about_'):
            cid = cid[6:]
        languages = CARDS[cid]['translations']
    for lang in languages:
        translations[lang] = {
            'url': flask.url_for(page + '_' + lang),
            'name': LANGUAGES[lang]['name']
        }
    return translations


def get_page(endpoint):
    return endpoint.rpartition('_')[0]


@app.context_processor
def inject_custom():
    endpoint = flask.request.endpoint
    if endpoint.startswith('api_') or endpoint.startswith('redirect_'):
        return {}
    return {
        'translations': get_translations(get_page(flask.request.endpoint)),
        'global_translations': LANGUAGES,
        'google_analytics_id': 'UA-71804102-1'
    }


def get_all_cards():
    all_cards = {}
    for cid in CARDS:
        card = CARDS[cid]
        translations = card['translations']
        all_cards[cid] = {}
        for language in translations:
            all_cards[cid][language] = {}
            translated_name = translations[language]
            all_cards[cid][language]['name'] = translated_name
            gtranslations = LANGUAGES[language]['translations']
            all_cards[cid][language]['url'] = u'/{}/{}/{}/'.format(
                language,
                gtranslations['cards'],
                translated_name)
    return all_cards


def populate_card_url_rules():
    all_cards = get_all_cards()
    for cid, card in all_cards.items():
        for language, translated_card in card.items():
            gtranslations = LANGUAGES[language]['translations']
            card_url = translated_card['url']
            app.add_url_rule(
                card_url, cid + '_card_' + language, get_card_handler(cid))
            app.add_url_rule(
                card_url + gtranslations['about'] + '/',
                'about_' + cid + '_card_' + language,
                get_about_card_handler(cid))


populate_card_url_rules()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
            '--host', help='Hostname of the Flask app.', default='127.0.0.1')
    parser.add_argument(
            '--port', help='Port for the Flask app.', type=int, default=8080)
    parser.add_argument(
            '--debug',
            help='Use debug mode for the Flask app.',
            type=bool,
            default=False)

    args = parser.parse_args()

    app.run(host=args.host, port=args.port, debug=args.debug)
