// Shared by popup.js and offscreen.js (loaded as a plain <script> before
// them, so this just defines a global). Tried in order; production comes
// first so a running local dev server cannot accidentally steal extension
// uploads from the user's real dashboard.
const API_BASES = ["https://capca-cam.vercel.app", "http://localhost:3000"];
