# Who Goes First

A selection game to help gamers pick who goes first.

## Installation

1. Install the Chrome Web Apps [development
   tools](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md).
1. Clone this repository.

    ```
    git clone https://github.com/bananajuicellc/who-goes-first.git
    cd who-goes-first
    ```

1. Change to src and install dependencies.

    ```
    cd src
    bower install
    npm install
    cd ..
    ```

1. Create a [new CCA
   project](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/CreateProject.md).

    ```
    cca create build com.bananajuicesoftware.WhoGoesFirst "Who Goes First"
    ```

1. Build and run with
   [CCA](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Develop.md).

    ```
    make
    cd build
    cca run ios --emulator
    ```

## Test

Tests are written with Mocha and Chai. They run in node.

```
cd src
npm test
```

## Build

For Chrome, run:

```
make
```

This copies the files needed for the Chrome app to `build/www`. You can add
this directory as an "unpacked extension" in the
[Chrome extensions settings page](chrome://extensions/).

In the terminal, change to the `build` directory to build the mobile applications.

For iOS:

```
cca build ios
```

For Android (debug):

```
cca build android --debug --webview=system --android-minSdkVersion=21
```

For Android (release):

```
cca build android --release --webview=system --android-minSdkVersion=21 
```


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).


## Licensing

This Source Code Form is subject to the terms of the Mozilla Public License, v.
2.0. See [LICENSE](LICENSE).

