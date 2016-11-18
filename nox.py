# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.


def session_freeze(session):
    # Install all development dependencies.
    session.install('-r', 'requirements.txt')

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
    session.run('pybabel', 'compile', '-d', './translations')

    # Freeze the app.
    # This should fail if there are any redirects, 404s, or server errors.
    session.run('python', 'freeze.py')


def session_lint(session):
    session.install('flake8')
    session.run('flake8', '--exclude', '.nox,.cache,env', '.')


def session_js(session):
    session.run('npm', 'test')
