# Translating Who Goes First

The easiest way to help translate Who Goes First is to use the
[translate.whogoest1st.com](https://translate.whogoes1st.com/) web translation
service, called [Weblate](https://weblate.org/).

## Using the translation service

1.  [Register for an
    account](https://translate.whogoes1st.com/accounts/register/).
2.  Click the activation link in your email.
3.  Go to the [Who Goes
    First project page](https://translate.whogoes1st.com/#list-who-goes-first)
    in the translate tool.
4.  Selected the language you wish to translate.
5.  Find strings you want to translate and suggest translations.

See the [Weblate translators
guide](https://docs.weblate.org/en/latest/user/index.html) for more detailed
instructions.

### Requesting a new language

If your language is not listed in Weblate, please [file a new issue on
GitHub](https://github.com/whogoes1st/whogoes1st/issues/new) describing the
language you would like added.

Or, if you are comfortable with code, follow the instructions below to add a
new language and send a pull request.

## Translating locally

First set up a development environment as described in
[CONTRIBUTING.md](../CONTRIBUTING.md).


### Extracting messages

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

### Adding a new language

After extracting messages, you can add a new language to the catalog.

```
pybabel init -i messages.pot -d ./translations -l fr
```

You also must add the language to the `LANGUAGES` dictionary in
`whogoesfirst.py`.


#### Updating existing translations

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
