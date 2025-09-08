#!/bin/bash

echo "🔧 Verifying Android build configuration..."

# Check Java version
echo "☕ Java version:"
java -version

# Check Gradle version
echo "🏗️ Gradle version:"
./gradlew --version

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Check for common issues
echo "🔍 Checking for common issues..."

# Verify JDK compatibility
if java -version 2>&1 | grep -q "version \"17\|version \"21"; then
    echo "✅ JDK version is compatible"
else
    echo "⚠️ Warning: JDK version might cause issues. Recommended: JDK 17 or 21"
fi

# Build the project
echo "🚀 Building Android project..."
./gradlew assembleDebug --stacktrace --info

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: app/build/outputs/apk/debug/app-debug.apk"
else
    echo "❌ Build failed. Check the output above for errors."
    exit 1
fi