# who-goes-first

A selection game to help gamers pick who goes first.

## Installation

1. Install the Chrome Web Apps [development
   tools](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md).
2. Create a [new CCA
   project](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/CreateProject.md). cca create WhoGoesFirst com.bananajuicesoftware.WhoGoesFirst "Who Goes First"
3. cd to the project directory. Clone this repository.
4. Use this remove the www folder and rename the folder for this repository to
   www.
5. [Build and
   run](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Develop.md).

## Build

For iOS

    cca build ios

For Android (debug)

    cca build android --debug --webview=system --android-minSdkVersion=21

For Android (release)

   cca build android --release --webview=system --android-minSdkVersion=21 
