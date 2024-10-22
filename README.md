# open-o-connect

A mobile application for connecting to electronic medical record systems based on the open-source "O19" project code.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm run start
   ```

Start Android

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Build APK

Install eas-cli package globally. This package will be used to build APK.

```bash
npm install -g eas-cli
```

Build Apk Locally

```bash
eas build -p android --profile preview --local
```

Here, `preview` is the name of the profile in eas.json file. Adding `--local` flag will build apk locally.

You'll need an expo account to build. So head over to https://expo.dev/ to sign up.
