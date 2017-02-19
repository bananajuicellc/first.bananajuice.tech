# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Run Who Goes First web app."""

import argparse
import collections
import gettext
import os.path

import flask
from flask import Flask
from flask_babel import Babel


app = Flask(__name__)
babel = Babel(app)


LANGUAGES = {
    'en': {
        'name': u'English',
        'translations': {
            'random-card': 'random-card'
        }
    },
    'fr': {
        'name': u'français',
        'translations': {
            'random-card': 'carte-au-hasard'
        }
    },
    'uk': {
        'name': u'українська мова',
        'translations': {
            'random-card': 'random-card'
        }
    },
}

DEFAULT_LANGUAGE = 'en'


@app.route('/')
def redirect_home_page():
    return flask.render_template('redirect_top_card.html')


@app.route('/api/v1/cards.json', endpoint='api_v1_cards')
def handle_api_v1_cards():
    return flask.jsonify(get_all_cards())


@app.route('/en/', endpoint='index_en')
@app.route('/fr/', endpoint='index_fr')
@app.route('/uk/', endpoint='index_uk')
def index_card():
    return flask.render_template('index.html')


@app.route('/en/contribute/', endpoint='contribute_en')
@app.route('/fr/contribute/', endpoint='contribute_fr')
@app.route('/uk/contribute/', endpoint='contribute_uk')
def handle_contribute():
    return flask.render_template('contribute.html')


@app.route('/en/privacy/', endpoint='privacy_en')
@app.route('/fr/privacy/', endpoint='privacy_fr')
@app.route('/uk/privacy/', endpoint='privacy_uk')
def handle_privacy():
    return flask.render_template('privacy.html')


@app.route('/en/help/', endpoint='help_en')
@app.route('/fr/help/', endpoint='help_fr')
@app.route('/uk/help/', endpoint='help_uk')
def handle_help():
    return flask.render_template('help.html')


@app.route(u'/fr/about/', endpoint='redirect_about_index_fr')
def redirect_about_index_card_fr():
    return flask.render_template(
        'redirect.html', redirect_target='/fr/a-propos/')


@app.route('/en/about/', endpoint='about_index_en')
@app.route(u'/fr/a-propos/', endpoint='about_index_fr')
@app.route('/uk/about/', endpoint='about_index_uk')
def about_index_card():
    return flask.render_template('about_index.html')


@app.route(u'/fr/random-card/')
def redirect_random_card_fr():
    target = '/fr/{}/'.format(LANGUAGES['fr']['translations']['random-card'])
    return flask.render_template('redirect.html', redirect_target=target)


@app.route('/en/random-card/', endpoint='random_card_page_en')
@app.route(
    '/fr/{}/'.format(LANGUAGES['fr']['translations']['random-card']),
    endpoint='random_card_page_fr')
@app.route(
    '/uk/{}/'.format(LANGUAGES['uk']['translations']['random-card']),
    endpoint='random_card_page_uk')
def random_card():
    return flask.render_template('random_card.html', cards=get_all_cards())


def get_card_handler(cid):
    def handler():
        return flask.render_template(
            os.path.join('cards', cid.replace('-', '_') + '.html'))
    return handler


def get_about_card_handler(cid):
    def handler():
        return flask.render_template(
            os.path.join('cards', 'about_' + cid.replace('-', '_') + '.html'))
    return handler


def get_redirect_handler(redirect_target):
    def handler():
        return flask.render_template(
            'redirect.html', redirect_target=redirect_target)
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
    if page.endswith('_card'):
        cid = page[:-5]  # Remove _card suffix
        if cid.startswith('about_'):
            cid = cid[6:]
    for lang in LANGUAGES:
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


def get_card_redirects(language, directory, url):
    translation = LANGUAGES[language]['translation']
    redirects = set([
        u'/{}/cards/{}'.format(language, directory),
        u'/{}/cards/{}'.format(language, translation.gettext(directory)),
        u'/{}/{}{}'.format(
            language, translation.gettext('cards/'), directory),
    ])
    return [redirect for redirect in redirects if redirect != url]


def get_card(directory):
    card = collections.defaultdict(dict)

    for language in LANGUAGES:
        card[language]['name'] = directory[:-1]  # Remove trailing slash.
        translation = LANGUAGES[language]['translation']
        url = u'/{}/{}{}'.format(
            language,
            translation.gettext('cards/'),
            translation.gettext(directory))
        card[language]['url'] = url
        card[language]['redirects'] = get_card_redirects(
            language, directory, url)

    return card


def get_all_cards():
    # The translation object for the default language should be the null
    # translation. That means it returns what you give it. The purpose in
    # using it is to trick gettext into extracting these as messages to
    # translate.
    translation = LANGUAGES[DEFAULT_LANGUAGE]['translation']

    # Include a trailing / in each translation so it is clear it is a URL.
    all_cards = {
        'award': get_card(translation.gettext('award/')),
        'baking': get_card(translation.gettext('baking/')),
        'batteries': get_card(translation.gettext('batteries/')),
        'birthday': get_card(translation.gettext('birthday/')),
        'building': get_card(translation.gettext('building/')),
        'buttons': get_card(translation.gettext('buttons/')),
        'catnap': get_card(translation.gettext('catnap/')),
        'coins': get_card(translation.gettext('coins/')),
        'dessert': get_card(translation.gettext('dessert/')),
        'drawing': get_card(translation.gettext('drawing/')),
        'd20': get_card(translation.gettext('d20/')),
        'flat-tire': get_card(translation.gettext('flat-tire/')),
        'foreign-language':
            get_card(translation.gettext('foreign-language/')),
        'hammock': get_card(translation.gettext('hammock/')),
        'junk-mail': get_card(translation.gettext('junk-mail/')),
        'light-bulb': get_card(translation.gettext('light-bulb/')),
        'litter-box': get_card(translation.gettext('litter-box/')),
        'oldest-movie': get_card(translation.gettext('oldest-movie/')),
        'onion': get_card(translation.gettext('onion/')),
        'pizza': get_card(translation.gettext('pizza/')),
        'post-office': get_card(translation.gettext('post-office/')),
        'postcard': get_card(translation.gettext('postcard/')),
        'sharpen': get_card(translation.gettext('sharpen/')),
        'stung': get_card(translation.gettext('stung/')),
        'survey': get_card(translation.gettext('survey/')),
        'train': get_card(translation.gettext('train/')),
        'trash': get_card(translation.gettext('trash/')),
        'tv': get_card(translation.gettext('television/')),
        'walk-dog': get_card(translation.gettext('walk-a-dog/')),
        'went-to-movies':
            get_card(translation.gettext('went-to-the-movies/')),
    }
    return all_cards


def populate_card_url_rules():
    all_cards = get_all_cards()

    for cid, card in all_cards.items():
        for language, translated_card in card.items():
            translation = LANGUAGES[language]['translation']
            card_url = translated_card['url']
            about_url = u'{}{}'.format(
                card_url, translation.gettext('about/'))
            app.add_url_rule(
                card_url, cid + '_card_' + language, get_card_handler(cid))
            app.add_url_rule(
                about_url,
                'about_' + cid + '_card_' + language,
                get_about_card_handler(cid))

            for i, redirect in enumerate(translated_card['redirects']):
                app.add_url_rule(
                    redirect,
                    'redirect_{}_card_{}_{}'.format(cid, language, i),
                    get_redirect_handler(card_url))
                app.add_url_rule(
                    redirect,
                    'redirect_{}_card_{}_about_0_{}'.format(cid, language, i),
                    get_redirect_handler(about_url))
                if translation.gettext('about/') != 'about/':
                    app.add_url_rule(
                        redirect,
                        'redirect_{}_card_{}_about_1_{}'.format(
                            cid, language, i),
                        get_redirect_handler(about_url))


def load_translations():
    for language in LANGUAGES:
        if language == DEFAULT_LANGUAGE:
            translation = gettext.NullTranslations()
        else:
            translation = gettext.translation(
                'messages',
                'translations',
                [language])
        LANGUAGES[language]['translation'] = translation


def initialize():
    """Initialize the module.

    These actions are needed, regardless of whether this is being loaded as a
    module (for freezing) or as the main script.
    """
    load_translations()
    populate_card_url_rules()


initialize()


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
