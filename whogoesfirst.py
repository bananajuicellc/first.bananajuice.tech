# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import Flask
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from flask.ext.babel import Babel

app = Flask(__name__)
babel = Babel(app)


LANGUAGES = {
    'en': 'English',
    'fr': 'français'

}
DEFAULT_LANGUAGE = 'en'


@app.route('/')
def home_page_redirect():
    language = request.accept_languages.best_match(
            LANGUAGES.keys(),
            default=DEFAULT_LANGUAGE)
    return redirect(url_for('index_' + language))


@app.route('/en/', endpoint='index_en')
@app.route('/fr/', endpoint='index_fr')
def index():
    return render_template(
            'index.html',
            google_analytics_id='UA-71804102-1',
            card_image='who_goes_first.png')


@app.before_request
def func():
    g.babel = babel
    g.language = get_locale()


@babel.localeselector
def get_locale():
    lang = request.path[1:].split('/', 1)[0]
    if lang in LANGUAGES:
        return lang
    else:
        return DEFAULT_LANGUAGE


if __name__ == '__main__':
    app.run(port=8080, debug=True)
