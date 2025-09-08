# AdMob Integration for Georgian Emoji Movie Game ????

## AdMob Setup for Your Incredible Georgian Movie Guessing Game

### Step 1: AdMob Account Setup
1. Go to [AdMob Console](https://admob.google.com/)
2. Create new app: **Georgian Emoji Movies**
3. App ID: \ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX\

### Step 2: Ad Unit IDs
- **Banner Ad** (bottom): \ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX\
- **Interstitial** (between games): \ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX\
- **Rewarded** (hint unlock): \ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX\

### Step 3: Add to AndroidManifest.xml
\\\xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
\\\

### Step 4: Ionic Integration
\\\	ypescript
// Install AdMob plugin
npm install @capacitor-community/admob
npx cap sync

// Initialize AdMob
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['YOUR_DEVICE_ID'],
});

// Show banner ad
await AdMob.showBanner({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER',
});

// Show interstitial after wrong answers
await AdMob.prepareInterstitial({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
});
await AdMob.showInterstitial();

// Show rewarded ad for extra hints
await AdMob.prepareRewardedVideoAd({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
});
await AdMob.showRewardedVideoAd();
\\\

### Step 5: Revenue Optimization
- **Banner**: Always visible during gameplay
- **Interstitial**: After 3 wrong answers
- **Rewarded**: Unlock medium/hard hints
- **Native**: Between movie categories

### Monetization Strategy for Your 50 Amazing Movies:
- Easy movies (?????? "???? ????"): Free hints
- Medium movies (?????? "?????????"): Watch ad for hint
- Hard movies (?????? "??????"): Rewarded ad required

Your Georgian emoji movie game will generate excellent revenue! ????
