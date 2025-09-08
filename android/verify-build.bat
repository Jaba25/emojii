@echo off
echo 🔧 Verifying Android build configuration...

REM Check Java version
echo ☕ Java version:
java -version

REM Check Gradle version
echo 🏗️ Gradle version:
gradlew.bat --version

REM Clean previous builds
echo 🧹 Cleaning previous builds...
gradlew.bat clean

REM Build the project
echo 🚀 Building Android project...
gradlew.bat assembleDebug --stacktrace --info

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo 📱 APK location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ Build failed. Check the output above for errors.
    exit /b 1
)

pause