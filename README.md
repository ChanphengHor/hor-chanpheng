# hor-chanpheng – Firebase Functions (Gen 2) + Hosting

A Firebase project that serves HTTP APIs via Cloud Functions (2nd Gen) with clean URLs proxied through Firebase Hosting, plus a simple HTML page to test the APIs.

## Overview
- Functions (Gen 2): Node.js 22, Firestore via Admin SDK
- Hosting rewrites provide clean URLs under your domain
- Test page: `functions-test.html` for quick verification using jQuery

## Project Structure
```
.
├─ firebase.json
├─ functions/
│  ├─ index.js
│  ├─ package.json
│  └─ node_modules/
├─ home/
│  ├─ 404.html
│  └─ ... static files
├─ functions-test.html
└─ README.md
```

## Prerequisites
- Node.js 22+
- Firebase CLI installed and logged in
  ```bash
  firebase --version
  firebase login
  firebase use hor-chanpheng
  ```

## Install
```bash
cd functions
npm install
```

## Functions (Gen 2)
Implemented in `functions/index.js` using `firebase-functions/v2/https` and Firebase Admin SDK:
- `getCVDataV2`: Reads documents from Firestore collection `cv`
- `getProductListV2`: Reads documents from Firestore collection `products`

## Clean URLs via Hosting
Configured in `firebase.json` rewrites:
```json
{
  "hosting": {
    "rewrites": [
      { "source": "/api/cv", "function": "getCVDataV2" },
      { "source": "/api/products", "function": "getProductListV2" }
    ]
  }
}
```

### Production URLs
- CV: `https://horchanpheng.web.app/api/cv`
- Products: `https://horchanpheng.web.app/api/products`

### Direct Function URLs (alternate)
- CV: `https://us-central1-hor-chanpheng.cloudfunctions.net/getCVDataV2`
- Products: `https://us-central1-hor-chanpheng.cloudfunctions.net/getProductListV2`

## Test Quickly
Open `functions-test.html` in a browser and click the buttons. It defaults to the Hosting base URL and calls the clean endpoints using jQuery.

Or test with curl:
```bash
curl -s https://horchanpheng.web.app/api/cv | jq '.'
curl -s https://horchanpheng.web.app/api/products | jq '.'
```

## Local Development
Run only the Functions emulator:
```bash
firebase emulators:start --only functions
```
Then hit the local emulator URL printed in the console, or adjust `functions-test.html` base URL if needed.

## Deploy
Deploy functions (Gen 2) and hosting:
```bash
# Deploy functions only
firebase deploy --only functions

# Deploy hosting only
firebase deploy --only hosting

# Deploy both
firebase deploy
```

If you renamed or migrated functions and see deletion prompts for old 1st Gen names, you can force deploy or delete the legacy functions explicitly:
```bash
# Force deploy (skips interactive deletion checks)
firebase deploy --only functions --force

# Or delete a legacy 1st Gen function
firebase functions:delete getCVData --region us-central1 --force
```

## Logs & Monitoring
```bash
firebase functions:list
firebase functions:log --only getCVDataV2
firebase functions:log --only getProductListV2
```

## Firestore
This project expects collections:
- `cv`
- `products`

Documents are returned as arrays of `{ id, ...fields }`.

## Configuration Notes
The project uses Gen 2 Functions with Node.js 22:
```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs22",
    "gen": 2
  }
}
```

Environment config via `functions.config()` is deprecated after March 2026. Prefer `.env` per Firebase docs if you add secrets in the future.

## Troubleshooting
- Permission errors: re-login `firebase login`
- Function not found in source: delete legacy function or use `--force`
- CORS: Gen 2 setup uses `onRequest({ cors: true })` in `index.js`

## License
Proprietary – for the Hor Chanpheng project.

