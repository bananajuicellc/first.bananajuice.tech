# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.


def session_freeze(session):
    session.install('-r', 'requirements.txt')
    session.run('python', 'freeze.py')


def session_lint(session):
    session.install('flake8')
    session.run('flake8', '--exclude', '.nox,.cache,env', '.')
