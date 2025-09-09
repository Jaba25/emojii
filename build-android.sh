#!/bin/bash

echo "🚀 Building Android APK using Docker..."

# Create output directory
mkdir -p android-output

# Build the Docker image and run the container
docker-compose build android-build

# Run the container and copy the APK
docker-compose run --rm android-build sh -c "
    echo '📱 Building web app...'
    npm run build
    
    echo '🔄 Syncing Capacitor...'
    npx cap sync android
    
    echo '🏗️ Building Android APK...'
    cd android
    chmod +x gradlew
    ./gradlew assembleDebug
    
    echo '📦 Copying APK to output...'
    cp app/build/outputs/apk/debug/app-debug.apk /usr/src/app/android-output/
    
    echo '✅ Android APK built successfully!'
    echo '📁 APK location: android-output/app-debug.apk'
"

echo "🎉 Build complete! Check the android-output folder for your APK."