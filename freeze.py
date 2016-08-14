# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Freeze the Who Goes First web app."""

import flask_frozen

from whogoesfirst import app

freezer = flask_frozen.Freezer(app)

app.config['FREEZER_DESTINATION'] = './public'

if __name__ == '__main__':
    freezer.freeze()
