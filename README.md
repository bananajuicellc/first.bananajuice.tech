# Who Goes First [![Build Status](https://img.shields.io/travis/whogoesfirst/who-goes-first.svg)](https://travis-ci.org/whogoesfirst/who-goes-first) [![license: MPL v2.0](https://img.shields.io/badge/license-MPL%20v2.0-blue.svg)](https://www.mozilla.org/en-US/MPL/2.0/)

![Who Goes First logo - pixel art style people standing in a
line](static/cards/who_goes_first.png)

A selection game to help gamers pick who goes first. Play it at
[whogoes1st.com](https://whogoes1st.com).


## Running a Development Version

Who Goes First is built using the [Flask framework](http://flask.pocoo.org/).
Translation and localization is done using
[Flask-Babel](https://pythonhosted.org/Flask-Babel/)
Static site generation is done using
[Frozen-Flask](http://pythonhosted.org/Frozen-Flask/).

First set up a virtual environment. If there are spaces in the path to
the directory where you checked out this code [choose a path without spaces for
the venv directory](https://github.com/pypa/virtualenv/issues/53).

```
sudo easy_install pip
sudo pip install virtualenv
virtualenv venv
source venv/bin/activate
```

Next install the dependencies.

```
pip install -r requirements.txt
```

Now you can run locally.

```
python whogoesfirst.py
```

To freeze as static files, run the freeze Python script.

```
python freeze.py
```


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).


## Licensing

This Source Code Form is subject to the terms of the Mozilla Public License, v.
2.0. See [LICENSE](LICENSE).
