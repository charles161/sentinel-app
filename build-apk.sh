#!/bin/bash
# Build Sentinel APK: export web → sync capacitor → gradle build
set -e
cd "$(dirname "$0")"

echo "→ Moving android dir temporarily (Expo/Capacitor conflict)"
mv android /tmp/sentinel-android-build
echo "→ Exporting web bundle..."
npx expo export --platform web
echo "→ Restoring android dir..."
mv /tmp/sentinel-android-build android
echo "→ Syncing Capacitor..."
npx cap sync android
echo "→ Building APK..."
export ANDROID_HOME=/home/clover_mj/android-sdk
export ANDROID_SDK_ROOT=/home/clover_mj/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
cd android && ./gradlew assembleDebug
echo "→ Copying APK..."
cp app/build/outputs/apk/debug/app-debug.apk /tmp/sentinel-app.apk
ls -lh /tmp/sentinel-app.apk
echo "✓ Done. APK at /tmp/sentinel-app.apk"
