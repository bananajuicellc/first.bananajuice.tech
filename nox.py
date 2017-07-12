# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import nox


@nox.session
def translations(session):
    session.install('Babel')

    # Extract messages and compile all translations.
    # https://github.com/whogoesfirst/who-goes-first/blob/master/docs/TRANSLATING.md
    session.run(
        'pybabel',
        'extract',
        '-F',
        'babel.cfg',
        '--no-wrap',
        '-o',
        'messages.pot',
        '.')
    session.run(
        'pybabel', 'update', '-i', 'messages.pot', '-d', './translations')


@nox.session
def freeze(session):
    # Install all development dependencies.
    session.install('-r', 'requirements.txt')

    # Freeze the app.
    # This should fail if there are any redirects, 404s, or server errors.
    session.run('pybabel', 'compile', '-d', './translations')
    session.run('python', 'freeze.py')


@nox.session
def lint(session):
    session.install('flake8')
    session.run('flake8', '--exclude', '.nox,.cache,env', '.')


@nox.session
def js(session):
    session.run('npm', 'test')
