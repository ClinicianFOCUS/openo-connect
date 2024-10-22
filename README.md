# open-o-connect

A mobile application for connecting to electronic medical record systems based on the open-source "O19" project code.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Install EAS CLI
   ```bash
   npm install -g eas-cli
   ```
3. Create an Expo account and login

   - [Sign up](https://expo.dev/signup) for an Expo account.
   - Run the following command in your terminal to log in to the EAS CLI:
     ```bash
     eas login
     ```

   ### For Android

   1. Build APK (For Development Only)

      ```bash
      eas build --profile development --platform android --local
      ```

      Here, `preview` is the name of the profile in eas.json file. Adding `--local` flag will build apk locally.

      Note: Will need to rebuild if any natvie code changes are made (Like new package installed).

   2. Start Project
      ```bash
      npm run android
      ```
      This will start the application in emulator and connected android device.

   ### For iOS (TODO)

## Build APK (For Production Only)

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
