# who-goes-first

A selection game to help gamers pick who goes first.

## Installation

1. Install the Chrome Web Apps [development
   tools](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md).
1. Clone this repository.
1. Create a [new CCA
   project](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/CreateProject.md). cca create WhoGoesFirst com.bananajuicesoftware.WhoGoesFirst "Who Goes First"
1. Rename the project directory that creates as `build`.
   www.
1. [Build and
   run](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Develop.md).

## Build

For Chrome, run:

    make

This copies the files needed for the Chrome app to `build/www`. You can add
this directory as an "unpacked extension" in the
[Chrome extensions settings page](chrome://extensions/).

In the terminal, change to the `build` directory to build the mobile applications.

For iOS:

    cca build ios

For Android (debug):

    cca build android --debug --webview=system --android-minSdkVersion=21

For Android (release):

   cca build android --release --webview=system --android-minSdkVersion=21 
