@echo off
echo 🚀 Building Android APK using Docker...

REM Create output directory
if not exist android-output mkdir android-output

REM Build the Docker image
echo 🏗️ Building Docker image...
docker-compose build android-build

REM Run the container and build APK
echo 📱 Running Android build...
docker-compose run --rm android-build sh -c "echo '📱 Building web app...' && npm run build && echo '🔄 Syncing Capacitor...' && npx cap sync android && echo '🏗️ Building Android APK...' && cd android && chmod +x gradlew && ./gradlew assembleDebug && echo '📦 Copying APK to output...' && cp app/build/outputs/apk/debug/app-debug.apk /usr/src/app/android-output/ && echo '✅ Android APK built successfully!' && echo '📁 APK location: android-output/app-debug.apk'"

echo 🎉 Build complete! Check the android-output folder for your APK.
pause