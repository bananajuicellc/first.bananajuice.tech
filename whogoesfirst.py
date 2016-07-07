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
    'en': u'English',
    'fr': u'français'

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
def index():
    return render_template('index.html', card_image='who_goes_first.png')


@app.route('/en/about/', endpoint='about_index_en')
@app.route(u'/fr/à-propos/', endpoint='about_index_fr')
def about():
    return render_template('about.html')


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
    for lang in LANGUAGES:
        translations[lang] = {
            'url': flask.url_for(page + '_' + lang),
            'name': LANGUAGES[lang]
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
    app.run(port=8080, debug=True)
