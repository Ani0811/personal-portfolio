#!/usr/bin/env node
/**
 * Check OAuth2 token retrieval for Gmail.
 * Usage: node scripts/check-oauth.js
 */
require('dotenv').config();
const { google } = require('googleapis');

async function main() {
  const clientId = process.env.EMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.EMAIL_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.EMAIL_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('Missing OAuth env vars. Ensure EMAIL_OAUTH_CLIENT_ID, EMAIL_OAUTH_CLIENT_SECRET, and EMAIL_OAUTH_REFRESH_TOKEN are set in backend/.env');
    process.exit(1);
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const res = await oAuth2Client.getAccessToken();
    console.log('Successfully retrieved access token.');
    console.log('Result:', res);
    process.exit(0);
  } catch (err) {
    console.error('OAuth token fetch failed:', err.message || err);
    process.exit(1);
  }
}

main();
