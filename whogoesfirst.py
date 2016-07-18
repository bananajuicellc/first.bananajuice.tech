# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
            'cards': 'cards'
        }
    },
    'fr': {
        'name': u'français',
        'translations': {
            'about': u'à-propos',
            'cards': u'cartes'
        }
    }
}

CARDS = {
    'award': {
        'translations': {
            'en': 'award',
            'fr': 'prix'
        }
    }
}

DEFAULT_LANGUAGE = 'en'


@app.route('/')
def home_page_redirect():
    language = flask.request.accept_languages.best_match(
            LANGUAGES.keys(),
            default=DEFAULT_LANGUAGE)
    return flask.redirect(flask.url_for('index_' + language))


@app.route('/en/', endpoint='index_en')
@app.route('/fr/', endpoint='index_fr')
def index_card():
    return render_template('index.html')


@app.route('/en/about/', endpoint='about_index_en')
@app.route(u'/fr/à-propos/', endpoint='about_index_fr')
def about_index_card():
    return render_template('about_index.html')


def get_card_handler(cid):
    def handler():
        return render_template(cid + '.html')
    return handler


def get_about_card_handler(cid):
    def handler():
        return render_template('about_' + cid + '.html')
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
    languages = LANGUAGES
    if page not in ('index', 'about_index'):
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
    return {
        'translations': get_translations(get_page(flask.request.endpoint)),
        'google_analytics_id': 'UA-71804102-1'
    }


if __name__ == '__main__':
    for cid in CARDS:
        card = CARDS[cid]
        translations = card['translations']
        for language in translations:
            translation = translations[language]
            gtranslations = LANGUAGES[language]['translations']
            card_url = u'/{}/{}/{}/'.format(
                language,
                gtranslations['cards'],
                translation)
            app.add_url_rule(
                card_url, cid + '_' + language, get_card_handler(cid))
            app.add_url_rule(
                card_url + gtranslations['about'],
                'about_' + cid + '_' + language,
                get_about_card_handler(cid))
    app.run(port=8080, debug=True)
