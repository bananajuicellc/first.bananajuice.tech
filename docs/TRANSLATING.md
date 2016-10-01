# Translating Who Goes First

First set up a development environment as described in
[CONTRIBUTING.md](../CONTRIBUTING.md).


## Extracting messages

Extract messages to pull messages out of Python files and templates for
translation.

```
pybabel extract -F babel.cfg --no-wrap -o messages.pot .
```

Then update the language catalog so that all language files get the new
messages.

```
pybabel update -i messages.pot -d ./translations
```

## Adding a new language

After extracting messages, you can add a new language to the catalog.

```
pybabel init -i messages.pot -d ./translations -l fr
```

You also must add the language to the `LANGUAGES` dictionary in
`whogoesfirst.py`.


### Updating existing translations

Run poedit and translate text.

Compile translations so that they appear in the app.

```
pybabel compile -d ./translations
```

You can test that the messages appear in the app by running the development
version.

```
python whogoesfirst.py
```
