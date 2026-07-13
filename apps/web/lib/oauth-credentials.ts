import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type GoogleCredentialSource = {
  client_id?: string;
  client_secret?: string;
};

type GoogleCredentialFile = {
  web?: GoogleCredentialSource;
  installed?: GoogleCredentialSource;
};

export type GoogleOAuthCredentials = {
  clientId: string;
  clientSecret: string;
};

function credentialFileCandidates() {
  return [
    process.env.GOOGLE_OAUTH_CREDENTIALS_FILE,
    path.join(process.cwd(), "google_oauth_creds.json"),
    path.join(process.cwd(), "..", "..", "google_oauth_creds.json"),
  ].filter((candidate): candidate is string => Boolean(candidate));
}

function readCredentialFile(filePath: string): GoogleOAuthCredentials | null {
  if (!existsSync(filePath)) return null;

  const parsed = JSON.parse(readFileSync(filePath, "utf8")) as GoogleCredentialFile;
  const source = parsed.web ?? parsed.installed;
  if (!source?.client_id || !source.client_secret) return null;

  return {
    clientId: source.client_id,
    clientSecret: source.client_secret,
  };
}

export function getGoogleOAuthCredentials(): GoogleOAuthCredentials | null {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  for (const filePath of credentialFileCandidates()) {
    try {
      const credentials = readCredentialFile(filePath);
      if (credentials) return credentials;
    } catch {
      // Ignore malformed local credential files so missing OAuth stays disabled.
    }
  }

  return null;
}
