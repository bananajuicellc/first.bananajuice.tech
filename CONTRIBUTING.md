# Contributing to Who Goes First

Who Goes First follows the [Collective Code Construction
Contract](http://rfc.zeromq.org/spec:22) (C4).


## Changes to the C4 process

- A patch SHOULD have an [animated
  selfie](http://www.threechords.org/blog/how-animated-gif-selfies-fixed-our-teams-morale/)
  to improve communication between Maintainers and Contributors. The tool [face
  to gif](https://hdragomir.github.io/facetogif/) may be useful for this
  purpose.


## Style Guide

Python code should follow pep8, as linted by flake8.

JavaScript code should follow [standard](http://standardjs.com/rules.html)
JavaScript rules.


## Running Tests

You should be able to run the tests with the `npm test` command.

## Generating Translations

Extract messages.

```
pybabel extract -F babel.cfg -o messages.pot .
```

### Adding a new language

Update language catalog.

```
pybabel init -i messages.pot -d ./translations -l fr
```

### Updating existing translations

Update language catalog.

```
pybabel update -i messages.pot -d ./translations
```

Run poedit and translate text.

Compile translations.

```
pybabel compile -d ./translations
```
