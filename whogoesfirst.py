# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Run Who Goes First webapp."""

import argparse

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
            'about': u'à-propos',
            'cards': u'cartes',
            'random-card': 'carte-au-hasard'
        }
    }
}

CARDS = {
    'award': {
        'translations': {
            'en': 'award',
            'fr': 'prix'
        }
    },
    'baking': {'translations': {'en': 'baking'}},
    'batteries': {'translations': {'en': 'batteries'}},
    'birthday': {'translations': {'en': 'birthday'}},
    'building': {'translations': {'en': 'building'}},
    'oldest-movie': {'translations': {'en': 'oldest-movie'}},
    'stung': {'translations': {'en': 'stung'}},
    'train': {'translations': {'en': 'train'}}
}

DEFAULT_LANGUAGE = 'en'


@app.route('/')
def home_page_redirect():
    language = flask.request.accept_languages.best_match(
            LANGUAGES.keys(),
            default=DEFAULT_LANGUAGE)
    return flask.redirect(flask.url_for('index_' + language))


@app.route('/api/v1/cards/', endpoint='api_v1_cards')
def handle_api_v1_cards():
    return flask.jsonify(get_all_cards())


@app.route('/en/', endpoint='index_en')
@app.route('/fr/', endpoint='index_fr')
def index_card():
    return render_template('index.html')


@app.route('/en/about/', endpoint='about_index_en')
@app.route(u'/fr/à-propos/', endpoint='about_index_fr')
def about_index_card():
    return render_template('about_index.html')


@app.route('/en/random-card/', endpoint='random_card_en')
@app.route(
    '/fr/{}/'.format(LANGUAGES['fr']['translations']['random-card']),
    endpoint='random_card_fr')
def random_card():
    return render_template('random_card.html', cards=get_all_cards())


def get_card_handler(cid):
    def handler():
        return render_template(cid.replace('-', '_') + '.html')
    return handler


def get_about_card_handler(cid):
    def handler():
        return render_template('about_' + cid.replace('-', '_') + '.html')
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
    if page not in ('index', 'about_index', 'random_card'):
        cid = page
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
    if flask.request.endpoint.startswith('api_'):
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


def main(args):
    all_cards = get_all_cards()
    for cid, card in all_cards.items():
        for language, translated_card in card.items():
            gtranslations = LANGUAGES[language]['translations']
            card_url = translated_card['url']
            app.add_url_rule(
                card_url, cid + '_' + language, get_card_handler(cid))
            app.add_url_rule(
                card_url + gtranslations['about'],
                'about_' + cid + '_' + language,
                get_about_card_handler(cid))
    app.run(host=args.host, port=args.port, debug=args.debug)


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
    main(parser.parse_args())
