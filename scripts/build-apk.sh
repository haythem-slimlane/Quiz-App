#!/usr/bin/env bash
set -e

echo "=== 1. Building Vite Production Assets ==="
npm run build

BUILD_DIR="/tmp/build_apk"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/assets/www"

echo "=== 2. Copying Web Assets (filtered) ==="
# Copy dist contents excluding any apk or zip files
cp dist/index.html "$BUILD_DIR/assets/www/"
if [ -d "dist/assets" ]; then
  cp -r dist/assets "$BUILD_DIR/assets/www/"
fi
if [ -f "dist/questions.json" ]; then
  cp dist/questions.json "$BUILD_DIR/assets/www/"
fi

# Ensure /tmp/android-29.jar and /tmp/r8.jar exist
if [ ! -f "/tmp/android-29.jar" ]; then
  echo "Downloading android-29.jar..."
  curl -fsSL -o /tmp/android-29.jar https://raw.githubusercontent.com/Sable/android-platforms/master/android-29/android.jar
fi

if [ ! -f "/tmp/r8.jar" ]; then
  echo "Downloading r8.jar..."
  curl -fsSL -o /tmp/r8.jar https://dl.google.com/android/maven2/com/android/tools/r8/8.2.42/r8-8.2.42.jar
fi

MANIFEST="android/app/src/main/AndroidManifest.xml"
SRC_JAVA="android/app/src/main/java/com/example/quizconcours/MainActivity.java"
RES_DIR="android/app/src/main/res"

echo "=== 3. Generating R.java with AAPT (Android 10 API 29) ==="
aapt package -m \
  -J "$BUILD_DIR/gen" \
  -M "$MANIFEST" \
  -S "$RES_DIR" \
  -I /tmp/android-29.jar

echo "=== 4. Compiling Java Classes with javac ==="
javac -source 8 -target 8 \
  -bootclasspath /tmp/android-29.jar \
  -cp /tmp/android-29.jar \
  -d "$BUILD_DIR/bin" \
  "$BUILD_DIR/gen/com/example/quizconcours/R.java" \
  "$SRC_JAVA"

echo "=== 5. Converting bytecode to DEX with D8 ==="
CLASS_FILES=$(find "$BUILD_DIR/bin" -name "*.class")
java -cp /tmp/r8.jar com.android.tools.r8.D8 \
  --min-api 21 \
  --lib /tmp/android-29.jar \
  --output "$BUILD_DIR" \
  $CLASS_FILES

echo "=== 6. Packaging APK with AAPT ==="
aapt package -f \
  -M "$MANIFEST" \
  -S "$RES_DIR" \
  -I /tmp/android-29.jar \
  -A "$BUILD_DIR/assets" \
  -F "$BUILD_DIR/unaligned.apk"

echo "=== 7. Adding classes.dex to APK ==="
(cd "$BUILD_DIR" && aapt add unaligned.apk classes.dex)

echo "=== 8. Aligning APK with zipalign (4-byte boundary) ==="
zipalign -f -p 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/aligned.apk"

echo "=== 9. Creating Keystore and Signing APK (v1, v2, v3) ==="
KEYSTORE="$BUILD_DIR/debug.keystore"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=QuizConcours,OU=Mobile,O=App,L=Tunis,ST=Tunis,C=TN"
fi

FINAL_APK="$BUILD_DIR/quiz-concours-tunisie.apk"
rm -f "$FINAL_APK"
cp "$BUILD_DIR/aligned.apk" "$FINAL_APK"

apksigner sign \
  --ks "$KEYSTORE" \
  --ks-pass pass:android \
  --key-pass pass:android \
  --ks-key-alias androiddebugkey \
  --v1-signing-enabled true \
  --v2-signing-enabled true \
  --v3-signing-enabled true \
  "$FINAL_APK"

echo "=== 10. Verifying Final Signed APK ==="
apksigner verify -v "$FINAL_APK"
aapt dump badging "$FINAL_APK" | grep -E "package|sdkVersion|targetSdkVersion|application-label"

echo "=== 11. Publishing APK to public and dist ==="
mkdir -p public dist
cp "$FINAL_APK" public/quiz-concours-tunisie.apk
cp "$FINAL_APK" public/app-release.apk
cp "$FINAL_APK" dist/quiz-concours-tunisie.apk
cp "$FINAL_APK" dist/app-release.apk

echo "=== 12. Updating Source ZIP Project ==="
rm -f public/quiz-concours-jetpack-compose-project.zip dist/quiz-concours-jetpack-compose-project.zip
7z a -tzip public/quiz-concours-jetpack-compose-project.zip android/
cp public/quiz-concours-jetpack-compose-project.zip dist/quiz-concours-jetpack-compose-project.zip

echo "=== SUCCESS! Build completed ==="
ls -lh public/quiz-concours-tunisie.apk public/quiz-concours-jetpack-compose-project.zip
