# Contributing to Who Goes First

Who Goes First follows the [Collective Code Construction
Contract](http://rfc.zeromq.org/spec:22) (C4) with [some
changes](#changes-to-the-c4-process). This means that anyone can contribute to
the project.

In this document, the words "MUST", "MUST NOT", "REQUIRED", "SHALL",
"SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" use
the [definitions of key words according to RFC
2119](https://www.ietf.org/rfc/rfc2119.txt).


## Ways to contribute

- [Adding cards](docs/ADDING_CARDS.md)
- [Contributing translations](docs/TRANSLATING.md)
- Fixing bugs and adding features. (See the rest of this document for
  guidelines.)


## Setting up your development environment

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


## Style guide

Python code MUST follow the [PEP 8 style
guide](https://www.python.org/dev/peps/pep-0008/), and pass a lint check by
flake8 without warnings or errors.

JavaScript code MUST follow [standard JavaScript
rules](http://standardjs.com/rules.html).


## Running Who Goes First

Now you can run locally.

```
python whogoesfirst.py
```

To freeze as static files, run the freeze Python script.

```
python freeze.py
```


## Running tests

You can run the full suite of tests with
[Nox](https://nox.readthedocs.io/en/latest/).

```
nox
```

To run just a specific session (for example: lint), use the `-s session_name`
command-line argument.

```
nox -s lint
```


## Extracting messages for translation

Every change that modifies or adds a new string MUST extract messages for
translation. Run the following command in your development environment:

```
pybabel extract -F babel.cfg -o messages.pot .
```

See [TRANSLATING.md](docs/TRANSLATING.md) for more detailed instructions on
contributing translations.


## How to contribute changes

Send a pull request that identifies the problem you are solving in the subject
and a description. There should be one pull request per problem solved. Keep
changes small! A maintainer will verify that your contribution meets the
guidelines and will merge it.


## Changes to the C4 process

- A patch SHOULD have an [animated
  selfie](http://www.threechords.org/blog/how-animated-gif-selfies-fixed-our-teams-morale/)
  to improve communication between Maintainers and Contributors.
