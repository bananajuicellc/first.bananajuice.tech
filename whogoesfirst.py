# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template(
            'index.html',
            google_analytics_id='UA-71804102-1',
            card_image='who_goes_first.png')

if __name__ == '__main__':
    app.run(port=8080)

