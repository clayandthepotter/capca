# Google Drive OAuth Setup

Capca uses the same Google Web OAuth client for Google sign-in and the
separate Google Drive connection flow.

## Google Cloud

Project: `capca-501804`

Required setup:

- Enable the Google Drive API.
- Use an OAuth client with app type `Web application`.
- Add these authorized redirect URIs:
  - `https://capca-cam.vercel.app/api/auth/callback/google`
  - `https://capca-cam.vercel.app/api/drive/callback`
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000/api/drive/callback`
- Add these authorized JavaScript origins:
  - `https://capca-cam.vercel.app`
  - `http://localhost:3000`
- On Google Auth Platform > Data Access, include:
  - `openid`
  - `email`
  - `profile`
  - `https://www.googleapis.com/auth/drive.file`
- While publishing status is `Testing`, add developer/tester Gmail accounts on
  Google Auth Platform > Audience > Test users.

If Google shows `Access blocked` with `access_denied`, the app is still gated
by the Google Auth Platform publishing/tester/verification state before Capca
receives a callback.

## Vercel

Production env vars required on the `capca` project:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

After changing either value, redeploy Production so the serverless functions
pick up the new OAuth credentials.

## App Flow

- `/api/drive/connect` redirects signed-in users to Google for `drive.file`
  consent.
- `/api/drive/callback` stores the refresh token and creates or reuses the
  `Capca Recordings` folder in the user's Drive.
- Drive recordings upload directly from the extension to Google's resumable
  upload endpoint, then Capca stores the Drive file id and web view link in the
  user's dashboard.
