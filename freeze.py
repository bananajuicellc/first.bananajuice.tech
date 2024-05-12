# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Freeze the Who Goes First web app."""

import os
import subprocess

import flask_frozen

import whogoesfirst


def create_mo_files():
    """
    https://stackoverflow.com/a/37906830
    """
    data_files = []
    localedir = whogoesfirst.LOCALEDIR
    po_dirs = [
        localedir / l / 'LC_MESSAGES'
               for l in next(os.walk(localedir))[1]]
    for d in po_dirs:
        mo_files = []
        po_files = [f
                    for f in next(os.walk(d))[2]
                    if os.path.splitext(f)[1] == '.po']
        for po_file in po_files:
            filename, _ = os.path.splitext(po_file)
            mo_file = filename + '.mo'
            msgfmt_cmd = 'msgfmt {} -o {}'.format(d / po_file, d / mo_file)
            subprocess.call(msgfmt_cmd, shell=True)
            mo_files.append(d / mo_file)
        data_files.append((d, mo_files))
    return data_files

freezer = flask_frozen.Freezer(whogoesfirst.app)

whogoesfirst.app.config['FREEZER_DESTINATION'] = './public'
whogoesfirst.app.config['FREEZER_REDIRECT_POLICY'] = 'error'

if __name__ == '__main__':
    create_mo_files()
    whogoesfirst.initialize()
    freezer.freeze()
